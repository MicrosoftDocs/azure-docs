---
title: Configuration error codes - Azure Stream Analytics
description: Troubleshoot Azure Stream Analytics issues with configuration error codes. 
ms.author: mamccrea
author: mamccrea
ms.topic: conceptual
ms.date: 05/07/2020
ms.service: stream-analytics
---

# Azure Stream Analytics configuration error codes

You can use activity logs and resource logs to help debug unexpected behaviors from your Azure Stream Analytics job. This article lists the description for every configuration error code. Configuration errors are related to your job configuration, or input and output configurations.

## EventHubUnauthorizedAccess

* **Cause**: Event Hub threw an *Unauthorized Access* error.

## EventHubReceiverEpochConflict

* **Cause**: There is more than one Event Hub receiver with different epoch values.
* **Recommendation**: Ensure *Service Bus Explorer* or an *EventProcessorHost* application is not connected while your Stream Analytics job is running.

## EventHubReceiverQuotaExceeded

* **Cause**: Stream Analytics can't connect to a partition because the maximum number of allowed receivers per partition in a consumer group has been reached.
* **Recommendation**: Ensure that other Stream Analytics jobs or Service Bus Explorer are not using the same consumer group.

## EventHubOutputThrottled

* **Cause**: An error occurred while writing data to Event Hub due to throttling.
* **Recommendation**: If this happens consistently, upgrade the throughput.

## EventHubOutputInvalidConnectionConfig

* **Cause**: The connection configuration provided is incorrect.
* **Recommendation**: Correct the configuration and restart the job.

## EventHubOutputInvalidHostname

* **Cause**: The Event Hub host is unreachable.
* **Recommendation**: Ensure the supplied host name is correct.

## EventHubOutputUnexpectedPartitionCount

* **Cause**: The EventHub sender encountered an unexpected EventHub partition count.
* **Recommendation**: Restart your Stream Analytics job if the EventHub's partition count has changed.

## CosmosDBPartitionKeyNotFound

* **Cause**: Stream Analytics couldn't find the partition key of a particular Cosmos DB collection in the database.
* **Recommendation**: Ensure there is a valid partition key specified for the collection in Cosmos DB.

## CosmosDBInvalidPartitionKeyColumn

* **Cause**: Thrown when a partition key is neither a leaf node nor at the top level.

## CosmosDBInvalidIdColumn

* **Cause**: The query output can't contain the column \[id] if a different column is chosen as the primary key property.

## CosmosDBDatabaseNotFound

* **Cause**: Stream Analytics can't find a CosmosDB database.

## CosmosDBCollectionNotFound

* **Cause**: Stream Analytics can't find a particular Cosmos DB collection in a database.

## CosmosDBOutputWriteThrottling

* **Cause**: An error occurred while writing data due to throttling by Cosmos DB.
* **Recommendation**: Upgrade the collection performance tier and tune the performance of your database.

## SQLDatabaseConnectionStringError

* **Cause**: The Stream Analytics job has encountered an authentication error.
* **Recommendation**: Ensure that the SQL Database connection string is correct.

## SQLDatabaseManagedIdentityAuthenticationError

* **Cause**: The Stream Analytics job has encountered an authentication error. 
* **Recommendation**: Ensure that the account name is configured properly and the job's Managed Identity has access to the SQL Database.

## SQLDatabaseOutputNoTableError

* **Cause**: Stream Analytics can't find the schema information for a particular table.

## SQLDWOutputInvalidServiceEdition

* **Cause**: SQL Database is not supported.
* **Recommendation**: Use Synapse SQL pool.

## Next steps

* [Troubleshoot input connections](stream-analytics-troubleshoot-input.md)
* [Troubleshoot Azure Stream Analytics outputs](stream-analytics-troubleshoot-output.md)
* [Troubleshoot Azure Stream Analytics queries](stream-analytics-troubleshoot-query.md)
* [Troubleshoot Azure Stream Analytics by using resource logs](stream-analytics-job-diagnostic-logs.md)
* [Azure Stream Analytics data errors](data-errors.md)
