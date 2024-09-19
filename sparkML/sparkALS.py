from pyspark.sql import SparkSession
from pyspark.sql.functions import col, udf, when, array, lit, size, expr
from pyspark.sql.types import ArrayType, IntegerType
from pyspark.ml.recommendation import ALS
from pyspark.ml.evaluation import RegressionEvaluator
from pyspark.ml.tuning import CrossValidator, ParamGridBuilder
import time



time.sleep(1000)

# Initialize Spark Session with MongoDB configuration
spark = SparkSession.builder \
    .appName("Read from MongoDB") \
    .config("spark.mongodb.input.uri", "mongodb://mongodb-container/FilmFlix") \
    .config("spark.mongodb.output.uri", "mongodb://mongodb-container/FilmFlix") \
    .config("spark.jars.packages", "org.mongodb.spark:mongo-spark-connector_2.12:3.0.1") \
    .config("spark.executor.memory", "4g") \
    .config("spark.driver.memory", "2g") \
    .getOrCreate()

# Load data from MongoDB
movies_df = spark.read.format("mongo").option("collection", "movies").load()
recommendations_df = spark.read.format("mongo").option("collection", "recommendations").load()
users_df = spark.read.format("mongo").option("collection", "users").load()

users_df.select("CustomersID").distinct().show()

# Rename columns to match expected schema
movies_df = movies_df \
    .withColumnRenamed("Movie Id", "MovieID") \
    .withColumnRenamed("Movie Name", "Name") \
    .withColumnRenamed("Release Date", "Year")

recommendations_df = recommendations_df \
    .withColumnRenamed("CustomersID", "CustomerID") \
    .withColumnRenamed("MovieID", "MovieID") \
    .withColumnRenamed("Rating", "Rating")

# Select relevant columns
movies_df = movies_df.select("MovieID", "Name", "Year")
recommendations_df = recommendations_df.select("CustomerID", "MovieID", "Rating")

# Sample Data for ML (if needed)
recommendations_df = recommendations_df.sample(fraction=0.3)

# Split Data into Training and Testing Sets
(training, testing) = recommendations_df.randomSplit([0.8, 0.2])

# Define parameter grid for CrossValidator
paramGrid = ParamGridBuilder().addGrid(ALS.rank, [5, 10, 20]) \
                    .addGrid(ALS.regParam, [0.1, 0.01]) \
                    .build()

# Create ALS model with CrossValidator
crossval = CrossValidator(estimator=ALS(coldStartStrategy="drop",
                                        userCol="CustomerID", 
                                        itemCol="MovieID", 
                                        ratingCol="Rating"),
                          estimatorParamMaps=paramGrid,
                          evaluator=RegressionEvaluator(metricName="rmse", labelCol="Rating"),
                          parallelism=3,
                          numFolds=3)

# Fit model
cvModel = crossval.fit(training)

# Make predictions and evaluate RMSE
predictions = cvModel.bestModel.transform(testing)
evaluator = RegressionEvaluator(metricName="rmse", labelCol="Rating", predictionCol="prediction")
rmse = evaluator.evaluate(predictions)
print('Root Mean Square Error (RMSE):', rmse)

# Generate Recommendations
userRecs = cvModel.bestModel.recommendForAllUsers(5)
movieRecs = cvModel.bestModel.recommendForAllItems(5)

# Show Recommendations
userRecs.show()
movieRecs.show()

# Check userRecs before extracting Top 5
userRecs.show(truncate=False)

# Define UDF to extract Top 5 movie recommendations
def extract_top_5(recommendations):
    if recommendations and len(recommendations) > 0:
        return [rec[0] for rec in recommendations[:5]]
    else:
        return []

extract_top_5_udf = udf(extract_top_5, ArrayType(IntegerType()))

# Rename 'CustomerID' to 'CustomersID' in userRecs DataFrame
userRecs = userRecs.withColumnRenamed("CustomerID", "CustomersID")

# Add Top5MovieIDs to userRecs DataFrame
userRecs = userRecs.withColumn("Top5MovieIDs", extract_top_5_udf(col("recommendations"))).select("CustomersID", "Top5MovieIDs")

# Debug: Print userRecs after extracting Top 5
userRecs.show(truncate=False)

# Drop 'Top5MovieIDs' from users_df to avoid ambiguity
#users_df = users_df.drop("Top5MovieIDs")
users_df.show(truncate=False)

user_1_recs = userRecs.filter(col("CustomersID") == 1)

# Show the result
user_1_recs.show(truncate=False)

# Join users DataFrame with userRecs DataFrame
users_with_recs_df = users_df.join(userRecs, "CustomersID", "left") 


# Debug: Print users_with_recs_df before writing to MongoDB
users_with_recs_df.show(truncate=False)

# Write the updated users back to MongoDB
users_with_recs_df.write.format("mongo") \
    .mode("append") \
    .option("database", "FilmFlix") \
    .option("collection", "users") \
    .save()

# Verify the update in MongoDB
updated_users_df = spark.read.format("mongo").option("collection", "users").load()
updated_users_df.show(truncate=False)
