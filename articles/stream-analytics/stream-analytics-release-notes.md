<properties 
	pageTitle="Stream Analytics Release Notes | Microsoft Azure" 
	description="Stream Analytics GA Release Notes" 
	services="stream-analytics" 
	documentationCenter="" 
	authors="jeffstokes72" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="stream-analytics" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.workload="data-services" 
	ms.date="08/20/2015" 
	ms.author="jeffstok"/>

#Microsoft Stream Analytic release notes

## Notes for 08/20/2015 release of Stream Analytics ##

This release contains the following updates.

Title|Description
---|---
Added LAST function |The [LAST](http://msdn.microsoft.com/library/mt421186.aspx) function is now available in Stream Analytics jobs, enabling you to retrieve the most recent event in an event stream within a given timeframe.
New Array functions|Array functions [GetArrayElement](http://msdn.microsoft.com/library/mt270218.aspx), [GetArrayElements](http://msdn.microsoft.com/library/mt298451.aspx) and [GetArrayLength](http://msdn.microsoft.com/library/mt270226.aspx) are now available.
New Record functions|Record functions [GetRecordProperties](http://msdn.microsoft.com/library/mt270221.aspx) and [GetRecordPropertyValue](http://msdn.microsoft.com/library/mt270220.aspx) are now available.

## Notes for 07/30/2015 release of Stream Analytics ##

This release contains the following updates.

Title|Description
---|---
Power BI Org Id decoupled from Azure Id|This feature enables [Power BI output](stream-analytics-power-bi-dashboard.md) for ASA jobs under any Azure account type (Live Id or Org Id). Additionally, you can have one Org Id for your Azure account and use a different one for authorizing Power BI output.
Support for Service Bus Queues output|[Service Bus Queues](stream-analytics-connect-data-event-outputs.md#service-bus-queues) outputs are now available in Stream Analytics jobs.
Support for Service Bus Topics output|[Service Bus Topics](stream-analytics-connect-data-event-outputs.md#service-bus-topics) outputs are now available in Stream Analytics jobs.

## Notes for 07/09/2015 release of Stream Analytics ##

This release contains the following updates.


Title|Description
---|---
Custom Blob Output Partitioning|Blob storage outputs now allow an option to specify the frequency that output blobs are written and the structure and format of the output data path folder structure. 

## Notes for 05/03/2015 release of Stream Analytics ##

This release contains the following updates.


Title|Description
---|---
Increased maximum value for Out of Order Tolerance Window|The maximum size for the Out of Order Tolerance Window is now 59:59 (MM:SS)
JSON Output Format: Line Separated or Array|Now there is an option when outputting to Blob Storage or Event Hub to output as either an array of JSON objects or by separating JSON objects with a new line. 

## Notes for 04/16/2015 release of Stream Analytics ##


Title|Description
---|---
Delay in Azure Storage account configuration|When creating a Stream Analytics job in a region for the first time, you will be prompted to create a new Storage account or specify an existing account for monitoring Stream Analytics jobs in that region. Due to latency in configuring monitoring, creating another Stream Analytics job in the same region within 30 minutes will prompt for the specifying of a second Storage account instead of showing the recently configured one in the Monitoring Storage Account drop-down. To avoid creating an unnecessary Storage account, wait 30 minutes after creating a job in a region for the first time before provisioning additional jobs in that region.
Job Upgrade|At this time, Stream Analytics does not support live edits to the definition or configuration of a running job. In order to change the input, output, query, scale or configuration of a running job, you must first stop the job.
Data types inferred from input source|If a CREATE TABLE statement is not used, the input type is derived from input format, for example all fields from CSV are string. Fields need to be converted explicitly to the right type using the CAST function in order to avoid type mismatch errors.
Missing fields are outputted as null values|Referencing a field that is not present in the input source will result in null values in the output event.
WITH statements must precede SELECT statements|In your query, SELECT statements must follow subqueries defined in WITH statements.
Out-of-memory issue|Streaming Analytics jobs with a large tolerance for out-of-order events and/or complex queries maintaining a large amount of state may cause the job to run out of memory, resulting in a job restart. The start and stop operations will be visible in the job’s operation logs. To avoid this behavior, scale the query out across multiple partitions. In a future release, this limitation will be addressed by degrading performance on impacted jobs instead of restarting them.
Large blob inputs without payload timestamp may cause Out-of-memory issue|Consuming large files from Blob storage may cause Stream Analytics jobs to crash if a timestamp field is not specified via TIMESTAMP BY. To avoid this issue, keep each blob under 10MB in size.
SQL Database event volume limitation|When using SQL Database as an output target, very high volumes of output data may cause the Stream Analytics job to time out. To resolve this issue, either reduce the output volume by using aggregates or filter operators, or choose Azure Blob storage or Event Hubs as an output target instead.
PowerBI datasets can only contain one table|PowerBI does not support more than one table in a given dataset.

## Get help
For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureStreamAnalytics)

## Next steps

- [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
- [Get started using Azure Stream Analytics](../stream.analytics.get.started.md)
- [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
- [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
- [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)
 
