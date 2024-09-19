from pyspark.sql import SparkSession
from pyspark.sql.functions import expr, from_json, col
from pyspark.sql.types import StructType, StructField, DoubleType, IntegerType
import os
import time

time.sleep(850)

# Environment variables
KAFKA_BROKER_URL = os.environ.get('KAFKA_BROKER_URL', 'kafka1:9092')
KAFKA_TOPIC_NAME = os.environ.get('KAFKA_TOPIC_NAME', 'test')
MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://mongodb-container')
MONGO_DATABASE = os.environ.get('MONGO_DATABASE', 'FilmFlix')
MONGO_COLLECTION = os.environ.get('MONGO_COLLECTION', 'recommendations')

# Create Spark session
spark = (
    SparkSession
    .builder
    .appName("Streaming from Kafka")
    .config("spark.streaming.stopGracefullyOnShutdown", "true")
    .config("spark.sql.shuffle.partitions", "2")
    .config("spark.jars.packages", "org.apache.spark:spark-sql-kafka-0-10_2.12:3.3.0,org.mongodb.spark:mongo-spark-connector_2.12:3.0.1")
    .getOrCreate()
)

spark.sparkContext.setLogLevel("WARN")

# Read data from Kafka
kafka_df = (
    spark
    .readStream
    .format("kafka")
    .option("kafka.bootstrap.servers", KAFKA_BROKER_URL)
    .option("subscribe", KAFKA_TOPIC_NAME)
    .option("startingOffsets", "earliest")
    .load()
)

# Parse value from binary to string
kafka_json_df = kafka_df.withColumn("value", expr("cast(value as string)"))
kafka_json_df.printSchema()
# Define the schema matching MongoDB fields
schema = StructType([
    StructField("userRating", DoubleType(), True),
    StructField("movieId", IntegerType(), True),
    StructField("customersId", IntegerType(), True)
])

# Parse the JSON string into a struct column
kafka_json_df = kafka_json_df.withColumn("value_json", from_json(col("value"), schema))

# Extract the specific fields from the JSON
kafka_json_df = kafka_json_df.select(
    col("value_json.userRating").alias("Rating"),
    col("value_json.movieId").alias("MovieID"),
    col("value_json.customersId").alias("CustomersID")
)

# Define the function to write each batch to MongoDB
def write_to_mongodb(df, epoch_id):
    df.write.format("mongo")\
        .mode("append")\
        .option("uri", MONGO_URI) \
        .option("database", MONGO_DATABASE) \
        .option("collection", MONGO_COLLECTION) \
        .save()
    df.show(truncate=False)


# Output the DataFrame to the console
query_console = (
    kafka_json_df.writeStream
    .outputMode("append")
    .format("console")
    .option("truncate", "false")
    .start()
)


# Output to MongoDB using foreachBatch
query_mongo = (
    kafka_json_df.writeStream
    .foreachBatch(write_to_mongodb)
    .outputMode("append")
    .option("checkpointLocation", "/tmp/checkpoint_dir_kafka")
    .start()
)

#By running both query_console and query_mongo, your application will simultaneously print the data to the console and write it to MongoDB.
#Both streams will run until you terminate the application.
# Await termination
query_console.awaitTermination()
query_mongo.awaitTermination()