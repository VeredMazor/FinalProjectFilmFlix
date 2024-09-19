import os
import json
from kafka import KafkaProducer


# Get Enviroment variables for Kafka connection
KAFKA_BROKER_URL = os.environ.get('KAFKA_BROKER_URL')
KAFKA_TOPIC_NAME = os.environ.get('KAFKA_TOPIC_NAME')

# Kafka Producer
producer = KafkaProducer(
        bootstrap_servers=['kafka1:9092'],
        value_serializer=lambda v: json.dumps(v).encode('utf-8'),
        api_version=(0, 10, 3) # for error: kafka.errors.NoBrokersAvailable: NoBrokersAvailable
)
