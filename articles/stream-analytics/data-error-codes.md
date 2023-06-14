---
title: Data error codes - Azure Stream Analytics
description: Troubleshoot Azure Stream Analytics issues with data error codes, which occur when there's bad data in the stream.
author: ahartoon
ms.author: anboisve
ms.topic: troubleshooting
ms.date: 05/25/2022
ms.service: stream-analytics
ms.custom: kr2b-contr-experiment
---

# Azure Stream Analytics data error codes

You can use activity logs and resource logs to help debug unexpected behaviors from your Azure Stream Analytics job. This article lists the description for every data error code. Data errors occur when there's bad data in the stream, such as an unexpected record schema.

## InputDeserializationError

* **Cause**: There was an error while deserializing input data.

## InputEventTimestampNotFound

* **Cause**: Stream Analytics is unable to get a time stamp for a resource. 

## InputEventTimestampByOverValueNotFound

* **Cause**: Stream Analytics is unable to get the value of `TIMESTAMP BY OVER COLUMN`.

## InputEventLateBeyondThreshold

* **Cause**: An input event was sent later than configured tolerance.

## InputEventEarlyBeyondThreshold

* **Cause**: An input event arrival time is earlier than the input event application time stamp threshold.

## AzureFunctionMessageSizeExceeded

* **Cause**: The message output to Azure Functions exceeds the size limit.

## EventHubOutputRecordExceedsSizeLimit

* **Cause**: An output record exceeds the maximum size limit when writing to Azure Event Hubs.

## CosmosDBOutputInvalidId

* **Cause**: The value or the type of a particular column is invalid.
* **Recommendation**: Provide unique non-empty strings that are no longer than 255 characters.

## CosmosDBOutputInvalidIdCharacter

* **Cause**: The output record's Document ID contains an invalid character.

## CosmosDBOutputMissingId

* **Cause**: The output record doesn't contain the column `[id]` to use as the primary key property.

## CosmosDBOutputMissingIdColumn

* **Cause**: The output record doesn't contain the Document ID property. 
* **Recommendation**: Ensure the query output contains the column with a unique non-empty string of no more than 255 characters.

## CosmosDBOutputMissingPartitionKey

* **Cause**: The output record is missing a column to use as the partition key property.

## CosmosDBOutputSingleRecordTooLarge

* **Cause**: A single record write to Azure Cosmos DB is too large.

## SQLDatabaseOutputDataError

* **Cause**: Stream Analytics can't write event(s) to Azure SQL Database due to issues in the data.

## Next steps

* [Troubleshoot input connections](stream-analytics-troubleshoot-input.md)
* [Troubleshoot Azure Stream Analytics outputs](stream-analytics-troubleshoot-output.md)
* [Troubleshoot Azure Stream Analytics queries](stream-analytics-troubleshoot-query.md)
* [Troubleshoot Azure Stream Analytics by using resource logs](stream-analytics-job-diagnostic-logs.md)
* [Azure Stream Analytics data errors](data-errors.md)
