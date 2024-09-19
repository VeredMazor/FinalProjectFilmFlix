#!/bin/bash

# Name of the Docker container service
SERVICE_NAME="spark-als"

# Start the container
docker-compose up -d $SERVICE_NAME

# Wait for the container to be ready and complete its work
sleep 1200  # Wait for 20 minutes (adjust as needed)

# Stop the specific container
docker-compose stop $SERVICE_NAME
