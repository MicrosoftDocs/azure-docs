<properties 
	pageTitle="Stream Analytics Release Notes | Microsoft Azure" 
	description="Stream Analytics Release Notes" 
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
	ms.date="07/27/2016" 
	ms.author="jeffstok"/>

#Stream Analytics release notes

## Notes for 04/15/2016 release of Stream Analytics ##

This release contains the following update.

Title | Description
---|---
General Availability for Power BI outputs  | [Power BI outputs](stream-analytics-power-bi-dashboard.md) are now Generally Available. The 90 day authorization expiration for Power BI has been removed. For more information on scenarios where authorization needs to be renewed see the [Renew authorization](stream-analytics-power-bi-dashboard.md#Renew-authorization) section of Creating a Power BI dashboard.

## Notes for 03/03/2016 release of Stream Analytics ##

This release contains the following update.

Title | Description
---|---
New Stream Analytics Query Language items  | SAQL now has [GetType](https://msdn.microsoft.com/library/azure/mt643890.aspx "GetType MSDN Page"), [TRY_CAST](https://msdn.microsoft.com/library/azure/mt643735.aspx "TRY_CAST MSDN Page") and [REGEXMATCH](https://msdn.microsoft.com/library/azure/mt643891.aspx "REGEXMATCH MSDN Page").

## Notes for 12/10/2015 release of Stream Analytics ##

This release contains the following update.

Title | Description
---|---
REST API version update | The REST API version has been updated to 2015-10-01. Details can be found on MSDN at [Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx) and [Machine Learning integration in Stream Analytics](stream-analytics-how-to-configure-azure-machine-learning-endpoints-in-stream-analytics.md).
Azure Machine Learning Integration | With this release comes support for Azure Machine Learning user defined functions. See the [tutorial](stream-analytics-machine-learning-integration-tutorial.md) for more information as well as the [general blog announcement](http://blogs.technet.com/b/machinelearning/archive/2015/12/10/apply-azure-ml-as-a-function-in-azure-stream-analytics.aspx).

## Notes for 11/12/2015 release of Stream Analytics ##

This release contains the following update.

Title | Description
---|---
New behavior of SELECT | SELECT in Stream Analytics has been extended to allow * as a property accessor of a nested record. For further information, consult [http://msdn.microsoft.com/library/mt622759.aspx](http://msdn.microsoft.com/library/mt622759.aspx "Complex Data Types").

## Notes for 10/22/2015 release of Stream Analytics ##

This release contains the following updates.

Title | Description
---|---
Additional query language features | Stream Analytics has expanded the query language by including the following features: [ABS](https://msdn.microsoft.com/library/azure/mt574054.aspx), [CEILING](https://msdn.microsoft.com/library/azure/mt605286.aspx), [EXP](https://msdn.microsoft.com/library/azure/mt605289.aspx), [FLOOR](https://msdn.microsoft.com/library/azure/mt605240.aspx), [POWER](https://msdn.microsoft.com/library/azure/mt605287.aspx), [SIGN](https://msdn.microsoft.com/library/azure/mt605290.aspx), [SQUARE](https://msdn.microsoft.com/library/azure/mt605288.aspx), and [SQRT](https://msdn.microsoft.com/library/azure/mt605238.aspx).
Removed aggregate limitations  | This release removes the limitation of 15 aggregates in a query. There is now no limit to the number of aggregates per query.
Added GROUP BY System.Timestamp feature | The [GROUP BY](https://msdn.microsoft.com/library/azure/dn835023.aspx) function now allows for either window_type or [System.Timestamp](https://msdn.microsoft.com/library/azure/mt598501.aspx).
Added OFFSET for Tumbling and Hopping windows | By default, [Tumbling](https://msdn.microsoft.com/library/azure/dn835055.aspx) and [Hopping](https://msdn.microsoft.com/library/azure/dn835041.aspx) windows are aligned against zero time (1/1/0001 12:00:00 AM UTC). The new (optional) parameter ‘offsetsize’ allows specifying a custom offset (or alignment).


## Notes for 09/29/2015 release of Stream Analytics ##

This release contains the following updates.

Title | Description
---|---
Azure IoT Suite Public Preview | Stream Analytics is included in the Public Preview of the Azure IoT Suite.
Azure Portal integration | In addition to continued presence in the Azure Management portal, Stream Analytics is now integrated in the [Azure Portal](https://azure.microsoft.com/overview/preview-portal/). Note that Stream Analytics functionality in the Preview portal is currently a subset of the functionality offered in the Azure Management portal, without support for in-browser query testing, Power BI output configuration, and browsing to or creating new input and output resources in subscriptions you have access to.
Support for DocumentDB output | Stream Analytics jobs can now output to [DocumentDB](https://azure.microsoft.com/services/documentdb/).
Support for IoT Hub input | Stream Analytics jobs can now ingest data from IoT Hubs.
TIMESTAMP BY for heterogeneous events | When a single data stream contains multiple event types having timestamps in different fields, you can now use [TIMESTAMP BY](http://msdn.microsoft.com/library/mt573293.aspx) with expressions to specify different timestamp fields for each case.

## Notes for 09/10/2015 release of Stream Analytics ##

This release contains the following updates.

Title|Description
---|---
Support for PowerBI groups|To enable sharing data with other Power BI users, Stream Analytics jobs can now write to [PowerBI groups](stream-analytics-define-outputs.md#power-bi) inside your Power BI account.

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
- [Get started using Azure Stream Analytics](stream-analytics-get-started.md)
- [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
- [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
- [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)
 
