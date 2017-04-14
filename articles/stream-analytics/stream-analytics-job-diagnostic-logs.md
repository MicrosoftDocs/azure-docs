---
title: Azure Stream Analytics diagnostic logs | Microsoft Docs
description: Learn how to analyze diagnostic logs from Stream Analytics jobs in Microsoft Azure.
keywords:
documentationcenter: ''
services: stream-analytics
author: jeffstokes72
manager: jhubbard
editor: cgronlun

ms.assetid: 
ms.service: stream-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-services
ms.date: 03/28/2017
ms.author: jeffstok

---
# Job diagnostic logs

## Introduction
Stream Analytics exposes two types of logs: 
* [Activity logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-activity-logs) that are always enabled and provide insights into operations performed on jobs;
* [Diagnostic logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs) that are configurable and provide richer insights into everything that happens with the job starting when it’s created, updated, while it’s running, and until it’s deleted.

> [!NOTE]
> It should be noted that the usage of services such as Azure Storage, Event Hub, and Log Analytics for analyzing non-conforming data will be charged based on the pricing model for those services.

## How to enable diagnostic logs
The diagnostics logs are turned **off** by default. To enable them, follow these steps:

Sign on to the Azure portal and navigate to the streaming job blade. Then go to the "Diagnostic logs" blade under "Monitoring."

![blade navigation to diagnostic logs](./media/stream-analytics-job-diagnostic-logs/image1.png)  

Then click the "Turn on diagnostics" link

![turn on diagnostic logs](./media/stream-analytics-job-diagnostic-logs/image2.png)

On the opened diagnostics, change the status to "On."

![change status diagnostic logs](./media/stream-analytics-job-diagnostic-logs/image3.png)

Configure the desired archival target (storage account, event hub, Log Analytics) and select the categories of logs that you want to collect (Execution, Authoring). Then save the new diagnostics configuration.

Once saved the configuration takes about 10 minutes to take effect. After that, the logs will start appearing in the configured archival target (which you can see on the "Diagnostics logs" blade):

![blade navigation to diagnostic logs](./media/stream-analytics-job-diagnostic-logs/image4.png)

More information about configuring diagnostics is available on the [diagnostic logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs) page.

## Diagnostic logs categories
There are two categories of diagnostic logs that we currently capture:

* **Authoring:** capture the logs related to job authoring operations: creation, adding and deleting inputs and outputs, adding and updating the query, starting and stopping the job.
* **Execution:** capture what is happening during job execution.
    * Connectivity errors;
    * Data processing errors;
        * Events that don’t conform with the query definition (mismatched field types and values, missing fields etc.);
        * Expression evaluation errors;
    * Etc.

## Diagnostic logs schema
All logs are stored in JSON format and each entry has the following common string fields:

Name | Description
------- | -------
time | The timestamp (in UTC) of the log
resourceId | The ID of the resource that operation took place on, upper-cased. It includes the subscription id, resource group, and job name. For example, **/SUBSCRIPTIONS/6503D296-DAC1-4449-9B03-609A1F4A1C87/RESOURCEGROUPS/MY-RESOURCE-GROUP/PROVIDERS/MICROSOFT.STREAMANALYTICS/STREAMINGJOBS/MYSTREAMINGJOB**.
category | The log category, either **Execution** or **Authoring**.
operationName | Name of the operation that is logged. For example, **Send Events: SQL Output write failure to mysqloutput**
status | The status of the operation. For example, **Failed, Succeeded**.
level | Log level. For example, **Error, Warning, Informational**.
properties | log entry-specific detail; serialized as JSON string; see following for more details

### Execution logs properties schema
Execution logs contain information about events that happened during Stream Analytics job execution.
Depending on the type of events, properties will have different schema. We currently have the following types:

### Data errors
Any error in processing data will fall under this category of logs. Produced mainly during data read, serialization, and write operation. It does not include connectivity errors which are treated as generic events.

Name | Description
------- | -------
Source | Name of the job input or output where the error happened.
Message | Message associated with the error.
Type | The type of error. For example, **DataConversionError, CsvParserError, and ServiceBusPropertyColumnMissingError**.
Data | Contains data useful to accurately locate the source of the error. Subject to truncation depending on size.

Depending on the **operationName** value, data errors will have the following schema:
* **Serialize Events** - happening during event read operations when the data at the input does not satisfy the query schema:
    * Type mismatch during event (de)serialize: field causing the error.
    * Cannot read an event, invalid serialization: information about the place in the input data where the error happened: blob name for blob input, offset and a sample of the data.
* **Send Events** - write operations: streaming event that caused the error.

### Generic events
Everything else

Name | Description
-------- | --------
Error | (optional) Error information, usually exception information if available.
Message| Log message.
Type | Type of message, maps to internal categorization of errors: for example **JobValidationError, BlobOutputAdapterInitializationFailure**, etc.
Correlation ID | [GUID](https://en.wikipedia.org/wiki/Universally_unique_identifier) that uniquely identifies the job execution. All execution log entries produced since the job is started until it stops will have the same "Correlation ID."



## Next steps
* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-get-started.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
* [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)

