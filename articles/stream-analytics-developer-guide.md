<properties title="Azure Stream Analytics developer guide" pageTitle="Stream Analytics developer guide | Azure" description="Learn how to develop Azure Stream Analytics applications" metaKeywords="" services="stream-analytics" solutions="" documentationCenter="" authors="jgao" videoId="" scriptId="" manager="paulettm" editor="cgronlun"/>

<tags ms.service="stream-analytics" ms.devlang="na" ms.topic="article" ms.tgt_pltfrm="na" ms.workload="data-services" ms.date="10/28/2014" ms.author="jgao" />


# Azure Stream Analytics developer guide 

[This is prerelease documentation and is subject to change in future releases.] 

Azure Stream Analytics is a fully managed service providing low latency, highly available, scalable complex event processing over streaming data in the cloud. In the preview release,  Stream Analytics enables customers to setup streaming jobs to analyze data streams, and allows customers to drive near real-time analytics.  

Targeted scenarios of Stream Analytics:

- Perform complex event processing on high volume and high velocity data   
- Collect event data from globally distributed assets or equipment such as connected cars or utility grids 
- Process telemetry data for near real time monitoring and diagnostics 
- Capture and archive real-time events for future processing

For more information, see [Introduction to Azure Stream Analytics][stream.analytics.introduction]. 

Stream Analytics jobs are defined as one or more input sources, a query over the incoming stream data, and an output target.  


##In this article

+ [Inputs](#inputs) 
+ [Query](#query)
+ [Output](#output)
+ [Scale jobs](#scale)
+ [Monitor and troubleshoot jobs](#monitor)
+ [Manage jobs](#manage)
+ [Next steps](#nextsteps)



##<a name="inputs"></a>Inputs

### Data stream

Each Stream Analytics job definition must contain at least one data stream input source to be consumed and transformed by the job.  [Azure Blob Storage][azure.blob.storage] and [Azure Service Bus Event Hubs][azure.event.hubs] are supported as data stream input sources.  Event Hub input sources are used to collect event streams from multiple different devices and services, while Blob Storage can be used an input source for ingesting large amounts of data.  Because Blobs do not stream data, Stream Analytics jobs over Blobs will not be temporal in nature unless the records in the Blob contain timestamps.

### Reference data

Stream Analytics also supports a second type of input source: reference data.  This is auxiliary data used for performing correlation and lookups and the data here is usually static or infrequently changing.  In the preview release, Blob Storage is the only supported input source for Reference Data.

### Serialization
To ensure correct behavior of queries, Stream Analytics must be aware of the serialization format being used on incoming data streams. Currently supported formats are JSON, CSV, and Avro for Streaming Data and CSV for Reference Data.

### Generated Properties
Depending on the input type used in the job, some additional fields with event metadata will be generated.  These fields can be queried against just like other input columns.  If an existing event has a field that has the same name as one of the properties below, it will be overwritten with the input metadata.

<table border="1">
	<tr>
		<th></th>
		<th>Property</th>
		<th>Description</th>
	</tr>
	<tr>
		<td rowspan="4" valign="top"><strong>Blob</strong></td>
		<td>BlobName</td>
		<td>The name of the input blob that the event came from</td>
	</tr>
	<tr>
		<td>EventProcessedUtcTime</td>
		<td>The date and time that the blob record was processed</td>
	</tr>
	<tr>
		<td>BlobLastModifiedUtcTime</td>
		<td>The date and time that the blob was last modified</td>
	</tr>
	<tr>
		<td>PartitionId</td>
		<td>The zero-based partition ID for the input adapter</td>
	</tr>
	<tr>
		<td rowspan="3" valign="top"><b>Event Hub</b></td>
		<td>EventProcessedUtcTime</td>
		<td>The date and time that the event was processed</td>
	</tr>
	<tr>
		<td>EventEnqueuedUtcTime</td>
		<td>The date and time that the event was received by Event Hub</td>
	</tr>
	<tr>
		<td>PartitionId</td>
		<td>The zero-based partition ID for the input adapter</td>
	</tr>
</table>



###Additional resources
For details on creating input sources, see [Azure Event Hubs developer guide][azure.event.hubs.developer.guide] and [Use Azure Blob Storage][azure.blob.storage.use].  



##<a name="query"></a>Query
The logic to filter, manipulate and process incoming data is defined in the Query of Stream Analytics jobs.  Queries are written using the Stream Analytics query language, a SQL-Like language that is largely a subset of standard T-SQL syntax with some specific extensions for temporal queries.

###Windowing
Windowing extensions allow aggregations and computations to be performed over subsets of events that fall within some period of time. Windowing functions are invoked using the GROUP BY statement. For example, the following query counts the events received per second: 

	SELECT Count(*) 
	FROM Input1 
	GROUP BY TumblingWindow(second, 1) 

###Execution steps
For more complex queries, the standard SQL clause WITH can be used to specify a temporary named result set.  For example, this query uses WITH to perform a transformation with two execution steps:
 
	WITH step1 AS ( 
		SELECT Avg(Reading) as avr 
		FROM temperatureInput1 
		GROUP BY Building, TumblingWindow(hour, 1) 
	) 

	SELECT Avg(avr) AS campus_Avg 
	FROM step1 
	GROUP BY TumblingWindow (day, 1) 

To learn more about the query language, see [Azure Stream Analytics Query Language Reference][stream.analytics.query.language.reference]. 

##<a name="output"></a>Output
The output source is where the results of the Stream Analytics job will be written to. Results are written continuously to the output source as the job processes input events.  The following output sources are supported:

- Azure Service Bus Event Hubs: Choose Event Hub as an output source for scenarios when multiple streaming pipelines need to be composed together, such as issuing commands back to devices.
- Azure Storage Blobs : Use Blob storage for long-term archival of output or for storing data for later processing.
- Azure SQL Database: This output source is appropriate for data that is relational in nature or for applications that depend on content being hosted in a database.


##<a name="scale"></a>Scale jobs

A Stream Analytics job can be scaled through configuring Streaming Units, which define the amount of processing power a job receives. Each Streaming Unit corresponds to roughly 1 MB/second of throughput. Each subscription has a quota of 12 Streaming Units per region to be allocated across jobs in that region.

For details, see [Scale Azure Stream Analytics jobs][stream.analytics.scale.jobs].


##<a name="monitor"></a>Monitor and troubleshoot jobs

###Regional monitoring storage account

To enable job monitoring, Stream Analytics requires you to designate an Azure Storage account for monitoring data in each region containing Stream Analytics jobs.  This is configured at the time of job creation.  

###Metrics
The following metrics are available for monitoring the usage and performance of Stream Analytics jobs:

- Errors: number of error messages incurred by a Stream Analytics job
- Input events: amount of data received by the Stream Analytics job, in terms of event count
- Output events: amount of data sent by the Stream Analytics job to output source, in terms event count
- Out of order events: number of events received out of order that were either dropped or given an adjusted timestamp, based on the out of order policy
- Data conversion errors: number of data conversion errors incurred by a Stream Analytics job

###Operation logs
The best approach to debugging or troubleshooting a Stream Analytics job is through Azure Operation Logs.  Operation Logs can be accessed under Management Services section of the portal.  To inspect logs for your job, set Service Type to "Stream Analytics" and Service Name to the name of your job.


##<a name="manage"></a>Manage jobs 

###Starting and stopping jobs

When starting a job, you will be prompted to specify a Start Output value, which determines when this job will start producing resulting output. If the associated query includes a window, the job will begin picking up input from the input sources at the start of the window duration required, in order to produce the first output event at the specified time. There are two options, Job Start Time and Custom. The default setting is Job Start Time. For the Custom option, you must specify a date and time. This setting is useful for specifying how much historical data in the input sources to consume or for picking up data ingestion from a specific time, such as when a job was last stopped.

In the preview release of Stream Analytics, stopping a job does not preserve any state about the last events consumed by the job.  As a result, restarting a stopped job can result in dropped events or duplicate data.  If a job must be stopped temporarily, the best practice is to inspect the output and use the insert time of the last record to approximate when the job stopped.  Then specify this time as the Start Output value when the job is restarted. This is a temporary limitation and enabling job start and stop without data loss is a high priority to fix in future releases.  

###Configure jobs
You can adjust the following top-level settings for a Stream Analytics job:

- Out of order policy: Settings for handling events that do not arrive to the Stream Analytics job sequentially. You can designate a time threshold to reorder events within by specifying a Tolerance Window and also determine an action to take on events outside this window: Drop or Adjust.  Drop will drop all events received out of order and Adjust will change the System.Timestamp of out of order events to the timestamp of the most recently received ordered event.  
- Locale: Use this setting to specify the internationalization preference for the stream analytics job. While timestamps of data are locale neutral, settings here impact how the job will parse, compare, and sort data. For the preview release, only en-US is supported.


##<a name="support"></a>Get support
For additional support, see [Azure Stream Analytics forum][stream.analytics.forum]. 


##<a name="nextsteps"></a>Next steps

- [Introduction to Azure Stream Analytics][stream.analytics.introduction]
- [Get started using Azure Stream Analytics][stream.analytics.get.started]
- [Scale Azure Stream Analytics jobs][stream.analytics.scale.jobs]
- [Azure Stream Analytics limitations and known issues][stream.analytics.limitations]
- [Azure Stream Analytics query language reference][stream.analytics.query.language.reference]
- [Azure Stream Analytics management REST API reference][stream.analytics.rest.api.reference] 



<!--Image references-->
[5]: ./media/markdown-template-for-new-articles/octocats.png
[6]: ./media/markdown-template-for-new-articles/pretty49.png
[7]: ./media/markdown-template-for-new-articles/channel-9.png


<!--Link references-->
[azure.blob.storage]: http://azure.microsoft.com/en-us/documentation/services/storage/
[azure.blob.storage.use]: http://azure.microsoft.com/en-us/documentation/articles/storage-dotnet-how-to-use-blobs/

[azure.event.hubs]: http://azure.microsoft.com/en-us/services/event-hubs/
[azure.event.hubs.developer.guide]: http://msdn.microsoft.com/en-us/library/azure/dn789972.aspx

[stream.analytics.query.language.reference]: http://go.microsoft.com/fwlink/?LinkID=513299
[stream.analytics.forum]: http://go.microsoft.com/fwlink/?LinkId=512151

[stream.analytics.introduction]: ../stream-analytics-introduction/
[stream.analytics.get.started]: ../stream-analytics-get-started/
[stream.analytics.developer.guide]: ../stream-analytics-developer-guide/
[stream.analytics.scale.jobs]: ../stream-analytics-scale-jobs/
[stream.analytics.limitations]: ../stream-analytics-limitations/
[stream.analytics.query.language.reference]: http://go.microsoft.com/fwlink/?LinkID=513299
[stream.analytics.rest.api.reference]: http://go.microsoft.com/fwlink/?LinkId=517301
