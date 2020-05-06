---
title: Troubleshoot with Azure Stream Analytics error codes
description: 
ms.author: mamccrea
author: mamccrea
ms.topic: conceptual
ms.date: 05/06/2020
ms.service: stream-analytics
---

# Troubleshoot with Azure Stream Analytics error codes

You can use activity logs and resource logs to help debug unexpected behaviors from your Azure Stream Analytics job. This article lists the description for every error code that can occur for the following error categories:

* Configuration error
* Data error
* External availability error
* External error
* Internal error

## Configuration error

Configuration errors are related to your job configuration, or input and output configurations. See all configuration error codes in the following table:

|Error code|Description|
|-----------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| KafkaInvalidPermission                        | The Stream Analytics job do not   have the proper permission to perform certain actions, detailed error is [{0}   - {1}].                                                                                                                                                                                                                          |
| KafkaInvalidConfiguration                     | Certain   configurations on the Kafka adapter are invalid, detailed error is [{0} -   {1}].                                                                                                                                                                                                                                                        |
| KafkaInvalidTimestampType                     | The timestamp type used by Kafka   topic \[{0}] is invalid. Expecting {1} but got {2}.                                                                                                                                                                                                                                                              |
| EventHubUnauthorizedAccess                    | Encountered   Unauthorized Access error from Event Hub: {0}                                                                                                                                                                                                                                                                                        |
| EventHubReceiverEpochConflict                 | There is more than one receiver   with different epoch value connected to the same {0}. Please ensure Service   Bus Explorer or an EventProcessorHost application is not connected while this   Stream Analytics job is running.                                                                                                                   |
| EventHubReceiverQuotaExceeded                 | We   cannot connect to {0} partition \[{1}] because the maximum number of allowed   receivers per partition in a consumer group has been reached. Ensure that   other Stream Analytics jobs or Service Bus Explorer are not using the same   consumer group. The following information may be helpful in identifying the   connected receivers: {2} |
| EventHubOutputThrottled                       | An error occurred while writing   data to Event Hub due to throttling. Please upgrade the throughput if it is   happening consistently.                                                                                                                                                                                                            |
| EventHubOutputInvalidConnectionConfig         | The   connection configuration provided is incorrect. Please correct the   configuration and restart the job.                                                                                                                                                                                                                                      |
| EventHubOutputInvalidHostname                 | The Event Hub host is   unreachable. Please make sure the supplied host name is correct.                                                                                                                                                                                                                                                           |
| EventHubOutputUnexpectedPartitionCount        | EventHub   sender encounters unexpected EventHub partition count. Please restart the job   if EventHub's partition count has changed.                                                                                                                                                                                                              |
| CosmosDBPartitionKeyNotFound                  | Failed to find the partition key   of Cosmos DB collection \[{0}] in database \[{1}]. Please ensure there is a   valid partition key specified for the collection in Cosmos DB.                                                                                                                                                                      |
| CosmosDBInvalidPartitionKeyColumn             | The   partition key can only be a leaf node at the top level. {0} is neither a leaf   node nor at the top level.                                                                                                                                                                                                                                   |
| CosmosDBInvalidIdColumn                       | The query output cannot contain   the column \[id] if a different column '{0}' is chosen as the primary key   property.                                                                                                                                                                                                                             |
| CosmosDBDatabaseNotFound                      | Cannot   find database \[{0}].                                                                                                                                                                                                                                                                                                                      |
| CosmosDBCollectionNotFound                    | Failed to find Cosmos DB   collection: \[{0}] in database:\[{1}].                                                                                                                                                                                                                                                                                    |
| CosmosDBOutputWriteThrottling                 | An error   occurred writing data due to throttling by Cosmos DB. Please upgrade   collection performance tier and tune the performance of your database.                                                                                                                                                                                           |
| SQLDatabaseConnectionStringError              | The ASA job has encountered an   authentication error at {0}. Please ensure that the SQL Database connection   string is correct.                                                                                                                                                                                                                  |
| SQLDatabaseManagedIdentityAuthenticationError | The ASA   job has encountered an authentication error at {0}. Please ensure that the   account name is configured properly and the job's Managed Identity has access   to the SQL Database.                                                                                                                                                        |
| SQLDatabaseOutputNoTableError                 | Cannot find schema information   for table {0} at {1}: {2}.                                                                                                                                                                                                                                                                                        |
| SQLDWOutputInvalidServiceEdition              | SQL   Database is not supported. Please use Synapse SQL pool.                                                                                                                                                                                                                                                                                      |

## Data error

Data errors occur when there is bad data in the stream, such as an unexpected record schema. See all data error codes in the following table:

| Error code                             | Description                                                                                                                                                                          |
|----------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| InputDeserializationError              | Error while deserializing input   message Id: {0}. Hit following error: {1}                                                                                                          |
| InputEventTimestampNotFound            | Unable   to get timestamp for resource '{0}' due to error '{1}'                                                                                                                      |
| InputEventTimestampByOverValueNotFound | Unable to get value of TIMESTAMP   BY OVER COLUMN                                                                                                                                    |
| InputEventLateBeyondThreshold          | Input   event with application timestamp '{0:o}' and arrival time '{1:o}' was sent   later than configured tolerance.                                                                |
| InputEventEarlyBeyondThreshold         | Input event arrival time '{0:o}'   is earlier than input event application timestamp '{1:o}' by more than {2}   minutes.                                                             |
| AzureFunctionMessageSizeExceeded       | There is   a problem outputting to Azure Functions. The message size limit of {0} bytes   has been exceeded. Size of the message is {1} bytes.                                       |
| EventHubOutputRecordExceedsSizeLimit   | An output record exceeds the   maximum size limit of {0} {1} when writing to Event Hub.                                                                                              |
| CosmosDBOutputInvalidId                | The   value \[{0}] or the type of the column \[id] is invalid. Please provide unique   non-empty strings that are no longer than 255 characters.                                       |
| CosmosDBOutputInvalidIdCharacter       | The output record's document id   value \[{0}] contains an invalid character.                                                                                                         |
| CosmosDBOutputMissingId                | The   output record does not contain the column \[id] to use as primary key   property.                                                                                               |
| CosmosDBOutputMissingIdColumn          | The output record does not   contain the document id property: \[{0}]. Ensure the query output contains the   column \[{0}] with a unique non-empty string less than '255' characters. |
| CosmosDBOutputMissingPartitionKey      | The   output record is missing the column '{0}' (case-sensitive) to use as the   partition key property.                                                                             |
| CosmosDBOutputSingleRecordTooLarge     | A single record write to Cosmos   DB is too large.                                                                                                                                   |
| SQLDatabaseOutputDataError             | Cannot   write event(s) to SQL Database due to issues in the data. Detailed Error: {0}                                                                                               |

## External availability error

External availability errors occur when a dependent service is unavailable. See all external availability error codes in the following table:

| Error code                 | Description                                                         |
|----------------------------|---------------------------------------------------------------------|
| ExternalServiceUnavailable | {0} is temporarily unavailable,   retrying.                         |
| KafkaServerNotAvailable    | The   Kafka server is not available, detailed error is [{0} - {1}]. |
| EventHubMessagingError     | Encountered error when   communicating with EventHub: {0}           |

## External error

External errors are generic errors thrown by an upstream or downstream service that Stream Analytics can't distinguish as a data error, configuration error, or external availability error. See all external error codes in the following table:

| Error code                               | Description                                                                                                                                                             |
|------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| AdapterInitializationError               | An error occurred when   initializing the {0} adapter.                                                                                                                  |
| AdapterFailedToWriteEvents               | An error   occurred writing data to {0}.                                                                                                                                |
| KafkaServerError                         | The Kafka server returns an   error: [{0} - {1}].                                                                                                                       |
| AzureFunctionHttpError                   | An HTTP   error is returned from Azure functions.                                                                                                                       |
| AzureFunctionFailedToSendMessage         | Failed to write events to Azure   Function.                                                                                                                             |
| AzureFunctionRedirectError               | There is   a problem outputting to Azure Functions. The following information may be   useful in diagnosing the issue. Error received: '{0} ({1})'. RequestId:   '{2}'. |
| AzureFunctionClientError                 | There is a problem outputting to   Azure Functions. The error received: '{0} ({1})' indicates client side error.   RequestId: '{2}'.                                    |
| AzureFunctionServerError                 | There is   a problem outputting to Azure Functions. The error received: '{0} ({1})'   indicates server side error. RequestId: '{2}'                                     |
| AzureFunctionHttpTimeOutError            | Writing to Azure functions   failed as the http request exceeded {0} seconds. Please check your Azure   Functions logs for potential delays. Request Id: {1}.           |
| EventHubArgumentError                    | Input   offsets are invalid. This may be due to a failover. Stream Analytics job will   have to be restarted from last output time. Exception: {0}                      |
| EventHubFailedToWriteEvents              | An error occurred while sending   data to Event Hub. The following information can be helpful in diagnosing the   issue:  {0} {1}.                                      |
| CosmosDBConnectionFailureAfterMaxRetries | Failed   to connect to the Cosmos DB account {0} after {1} retries.                                                                                                     |
| CosmosDBFailureAfterMaxRetries           | Failed to query the Cosmos DB   database and collection after {0} retries.                                                                                              |
| CosmosDBFailedToCreateStoredProcedure    | Cannot   create stored procedure after several retries. Error: {0}                                                                                                      |
| CosmosDBOutputRequestTimeout             | Upsert stored procedure returned   error {0} for batch size {1}, this operation will be retried. Detailed error   message: {2}."                                        |
| SQLDatabaseOutputInitializationError     | Cannot   initialize SQL Database output with database info: {0}.                                                                                                        |
| SQLDatabaseOutputWriteError              | Cannot write {0} events to SQL   Database output at {1}. Detailed Error: {2}                                                                                            |
| SQLDWOutputInitializationError           | An error   occurred when initializing Synapse SQL pool output.                                                                                                          |
| SQLDWOutputWriteError                    | An error occurred when writing   output to Synapse SQL pool.                                                                                                            |

## Internal error

Internal errors are generic errors that are thrown within the Stream Analytics platform when Stream Analytics can't distinguish if 

| Error code                      | Description                                                                                   |
|---------------------------------|-----------------------------------------------------------------------------------------------|
| KafkaInvalidRequest             | The request sent to the Kafka   server is invalid, detailed error is \[{0] - {1}].             |
| KafkaInputError                 | Kafka   input encounters an issue: [{0} - {1}].                                               |
| CosmosDBOutputBatchSizeTooLarge | The batch size used to write to   Cosmos DB is too large, retrying with a smaller batch size. |

## Next steps

* [Troubleshoot input connections](stream-analytics-troubleshoot-input.md)
* [Troubleshoot Azure Stream Analytics outputs](stream-analytics-troubleshoot-output.md)
* [Troubleshoot Azure Stream Analytics queries](stream-analytics-troubleshoot-query.md)
* [Troubleshoot Azure Stream Analytics by using resource logs](stream-analytics-job-diagnostic-logs.md)
* [Azure Stream Analytics data errors](data-errors.md)