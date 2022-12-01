---
title: External error codes - Azure Stream Analytics
description: Troubleshoot Azure Stream Analytics issues with external error codes. 
author: ahartoon
ms.author: anboisve
ms.topic: troubleshooting
ms.date: 05/07/2020
ms.service: stream-analytics
ms.custom: ignite-2022
---

# Azure Stream Analytics external error codes

You can use activity logs and resource logs to help debug unexpected behaviors from your Azure Stream Analytics job. This article lists the description for every external error code. External errors are generic errors thrown by an upstream or downstream service that Stream Analytics can't distinguish as a data error, configuration error, or external availability error.

## AdapterInitializationError

* **Cause**: An error occurred when initializing an adapter.

## AdapterFailedToWriteEvents

* **Cause**: An error occurred while writing data to an adapter.

## AzureFunctionHttpError

* **Cause**: An HTTP error was returned from Azure functions.

## AzureFunctionFailedToSendMessage

* **Cause**: Stream Analytics failed to write events to Azure Function.

## AzureFunctionRedirectError

* **Cause**: There's a redirect error when outputting to Azure Functions.

## AzureFunctionClientError

* **Cause**: There's a client error outputting to Azure Functions.

## AzureFunctionServerError

* **Cause**: There's a server error outputting to Azure Functions.

## AzureFunctionHttpTimeOutError

* **Cause**: Writing to Azure functions failed as the http request exceeded the timeout. 
* **Recommendation**: Check your Azure Functions logs for potential delays.

## EventHubArgumentError

* **Cause**: Input offsets are invalid. This may be due to a failover.
* **Recommendation**: Restart your Stream Analytics job from last output time.

## EventHubFailedToWriteEvents

* **Cause**: An error occurred while sending data to Event Hubs.

## CosmosDBConnectionFailureAfterMaxRetries

* **Cause**: Stream Analytics failed to connect to an Azure Cosmos DB account after the maximum number of retries.

## CosmosDBFailureAfterMaxRetries

* **Cause**: Stream Analytics failed to query the Azure Cosmos DB database and collection after the maximum number of retries.

## CosmosDBFailedToCreateStoredProcedure

* **Cause**: Azure Cosmos DB can't create a stored procedure after several retries.

## CosmosDBOutputRequestTimeout

* **Cause**: The upsert stored procedure returned an error. 

## SQLDatabaseOutputInitializationError

* **Cause**: Stream Analytics can't initialize the SQL Database output.

## SQLDatabaseOutputWriteError

* **Cause**: Stream Analytics can't write events to the SQL Database output.

## SQLDWOutputInitializationError

* **Cause**: An error occurred when initializing a dedicated SQL pool output.

## SQLDWOutputWriteError

* **Cause**: An error occurred when writing output to a dedicated SQL pool.

## Next steps

* [Troubleshoot input connections](stream-analytics-troubleshoot-input.md)
* [Troubleshoot Azure Stream Analytics outputs](stream-analytics-troubleshoot-output.md)
* [Troubleshoot Azure Stream Analytics queries](stream-analytics-troubleshoot-query.md)
* [Troubleshoot Azure Stream Analytics by using resource logs](stream-analytics-job-diagnostic-logs.md)
* [Azure Stream Analytics data errors](data-errors.md)
