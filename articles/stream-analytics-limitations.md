<properties 
	pageTitle="Stream Analytics limitations in the preview release | Azure" 
	description="Learn the limitations in the public preview release of Azure Stream Analytics jobs" 
	services="stream-analytics" 
	documentationCenter="" 
	authors="mumian" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="stream-analytics" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.workload="data-services" 
	ms.date="03/05/2015"
	ms.author="jgao"/>

# Azure Stream Analytics Preview limitations and known issues

This document describes the limitations and known issues of [Azure Stream Analytics][stream.analytics.documentation] during the preview release. In most cases, these limits exist with an intent to get your early feedback or are based on current capacity constraints. 
<!--Table of contents for topic, the words in brackets must match the heading wording exactly-->


## Limitations

### Regional availability
Stream Analytics jobs can be provisioned only in the Central US and West Europe regions in the preview release.

### Scale 
**Streaming-unit quota**

Due to current capacity constraints, a quota of 12 streaming units per region per subscription is enforced. For more information, see [Scale Azure Stream Analytics jobs][stream.analytics.scale.jobs]. If you have a business need to relax this limit, please call [Microsoft Support][microsoft.support] and we will do our best to accommodate your need within the constraints of the public offer. 

**Streaming-unit utilization**

In this preview release, the number of streaming units provided to a job may sometimes be higher than the amount selected or billed. Additionally, streaming units will not be throttled down, meaning that observed performance may be higher than guaranteed performance, depending on the availability of computational resources.

**Partition key**

When scaling out your query with **Partition By**, the field to partition on must be **PartitionId**. Partitioning on other user-defined fields will be enabled in a future release.
For details on scaling your job, see [Scale Azure Stream Analytics jobs][stream.analytics.scale.jobs].

### Inputs



**Character encoding**

For the CSV and JSON input sources, UTF-8 is the only support encoding format.


### Query complexity
The maximum number of supported aggregate functions in a Stream Analytics job query definition is 7.

### Number of queries
The maximum number of supported queries for a given input source is 5.  


### Lifecycle management

**Job upgrade**

At this time, Stream Analytics does not support live edits to the definition or configuration of a running job. In order to change the input, output, query, scale or configuration of a running job, you must first stop the job.

**Job stop and restart**

Stopping a job does not preserve any state about job progress, meaning that there is currently no way to configure a restarted job to resume from where it was last stopped. This is a limitation that will be addressed in a future release. For best practices on starting and stopping jobs, see [Azure Stream Analytics developer guide][stream.analytics.developer.guide]. 

### Monitoring
Some metrics related to job usage and performance, such as latency, are not available in the preview release. The preview release also surfaces job throughput only in terms of event count, not size.

## Release notes/known issues

This section contains a list of known issues for Azure Stream Analytics. This section will change over time as we remove items from the list, encounter new issues or learn more about existing ones.


### Elevated event-hub permissions required
At this time, Stream Analytics requires a shared access policy with Manage permissions for event-hub input sources and output targets.

### Delay in Azure Storage account configuration
When creating a Stream Analytics job in a region for the first time, you will be prompted to create a new Storage account or specify an existing account for monitoring Stream Analytics jobs in that region. Due to latency in configuring monitoring, creating another Stream Analytics job in the same region within 30 minutes will prompt for the specifying of a second Storage account instead of showing the recently configured one in the **Monitoring Storage Account** drop-down. To avoid creating an unnecessary Storage account, wait 30 minutes after creating a job in a region for the first time before provisioning additional jobs in that region. 

### Jobs should each use their own event-hub consumer group
Each Stream Analytics job input should be configured to have its own event-hub consumer group. When a job contains self-join or multiple outputs, some input may be read by more than one reader, which causes the total number of readers in a single consumer group to exceed the event hub’s limit of 5 readers per consumer group. In this case, the query will need to be broken down into multiple queries and intermediate results routed through additional event hubs. Note that there is also a limit of 20 consumer groups per event hub. For details, see [Event Hubs developer guide][azure.event.hubs.developer.guide].

### Add an input/output - event hub 
The third page of the **Add Input** and **Add Output** dialogs for event-hub sources has a drop-down titled **Event Hub**, which contains both a list of Service Bus namespaces in the current subscription and an option to connect to an event hub in a different subscription. If you wish to connect to an event hub in the same subscription, select its Service Bus namespace here. If you wish to connect to an event hub outside of the subscription, select **Use Event Hub from Another Subscription**.  


### Cannot reference the same query step more than once
In this preview release, a given sub-query step defined via the **WITH** keyword cannot be referenced more than once. A common scenario that this may impact is a self-join using aliases of the same step. To work around this behavior, please create two separate steps with the same sub-query and different names.

### Unsupported type conversions result in null values
Any event vales with type conversions not supported in the "Data Types" section of [Azure Stream Analytics Query Language Reference][stream.analytics.query.language.reference] will result in a null value. In this preview release, no error logging is in place for these conversion exceptions. 

### Out-of-memory issue
Streaming Analytics jobs with a large tolerance for out-of-order events and/or complex queries maintaining a large amount of state may cause the job to run out of memory, resulting in a job restart. The start and stop operations will be visible in the job’s operation logs. To avoid this behavior, scale the query out across multiple partitions. In a future release, this limitation will be addressed by degrading performance on impacted jobs instead of restarting them.

### Empty event-hub shard in partitioned query results in no output
When you're running a partitioned query with a non-partitioned sub-query as the second step, if one of the event-hub partitions on the input is completely empty, the query will not generate results. An error for this will be reflected in the operation logs for the job. Please make sure all event-hub partitions have incoming events at all times to avoid this problem.

### SQL Database event volume limitation
When using SQL Database as an output target, very high volumes of output data may cause the Stream Analytics job to time out. To resolve this issue, either reduce the output volume by using aggregates or join operators, or choose Azure Blob storage or Event Hubs as an output target instead.

### Large blob inputs not supported
Consuming large files from Blob storage may cause Stream Analytics jobs to crash. To avoid this issue, keep each blob under 10MB in size.

### Whitespace in column headers causes null output entries
Stream Analytics does not trim whitespace on column headers. Including whitespace at the beginning or end of a column name will result in null entries in the job output.   


## Get support
For additional support, see [Azure Stream Analytics forum](stream-analytics-forum.md). 


## Next steps

- [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
- [Get started using Azure Stream Analytics](stream-analytics-get-started.md)
- [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
- [Azure Stream Analytics Query Language Reference](stream-analytics-query-language-reference.md)
- [Azure Stream Analytics Management REST API Reference](stream-analytics-rest-api-reference.md) 

<!--Anchors-->
[Limitations]: #Limitations
[Release notes and known issues]: #Release-notes-and-known-issues
[Next steps]: #next-steps

<!--Image references-->
[5]: ./media/markdown-template-for-new-articles/octocats.png
[6]: ./media/markdown-template-for-new-articles/pretty49.png
[7]: ./media/markdown-template-for-new-articles/channel-9.png


<!--Link references-->

[stream.analytics.documentation]: http://go.microsoft.com/fwlink/?LinkId=512093
[stream.analytics.scale.jobs]: stream-analytics-scale-jobs.md
[stream.analytics.developer.guide]: stream-analytics-developer-guide.md
[stream.analytics.introduction]: stream-analytics-introduction.md
[stream.analytics.get.started]: stream-analytics-get-started.md
[stream.analytics.limitations]: stream-analytics-limitations.md


[stream.analytics.query.language.reference]: http://go.microsoft.com/fwlink/?LinkID=513299
[stream.analytics.rest.api.reference]: http://go.microsoft.com/fwlink/?LinkId=517301


[microsoft.support]: http://support.microsoft.com/
[azure.event.hubs.developer.guide]: http://msdn.microsoft.com/library/azure/dn789972.aspx

[Link 1 to another azure.microsoft.com documentation topic]: virtual-machines-windows-tutorial.md
[Link 2 to another azure.microsoft.com documentation topic]: web-sites-custom-domain-name.md
[Link 3 to another azure.microsoft.com documentation topic]: storage-whatis-account.md
