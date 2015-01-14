<properties title="" pageTitle="Stream Analytics limitations in the preview release | Azure" description="Learn the limitations in the public preview release of Azure Stream Analytics jobs" metaKeywords="" services="stream-analytics" solutions="" documentationCenter="" authors="mumian" videoId="" scriptId="" manager="paulettm" editor="cgronlun"/>

<tags ms.service="stream-analytics" ms.devlang="na" ms.topic="article" ms.tgt_pltfrm="na" ms.workload="data-services" ms.date="10/28/2014" ms.author="jgao" />

#Azure Stream Analytics Preview limitations and known issues

This document describes the limitations and known issues of [Azure Stream Analytics][stream.analytics.documentation] during the Preview release.  In most cases these limits exist with an intent to get your early feedback or based on current capacity constraints. 
<!--Table of contents for topic, the words in brackets must match the heading wording exactly-->

##In this article
+ [Limitations](#limitations) 
+ [Release notes and known issues](#knownissues)
+ [Next steps]

##<a name="limitations"></a> Limitations

###Regional availability
Stream Analytics jobs can only be provisioned in the Central US and West Europe regions in the preview release.

###Scale 
**Streaming Unit quota**

Due to current capacity constraints, a quota of 12 Streaming Units per region per subscription is enforced. For more information see [Scale Azure Stream Analytics jobs][stream.analytics.scale.jobs]. If you have business need to relax this limit, please call [Microsoft support][microsoft.support] and we will do our best to accommodate within the constraints of the public offer. 

**Streaming Unit utilization**

In this preview release, the number of Streaming Units provided to a job may sometimes be higher than the amount selected or billed.  Additionally, Streaming Units will not be throttled down, meaning that observed performance may be higher than guaranteed depending on the availability of computational resources.

**Partition key**

When scaling out your query with PARTITION BY, the field to partition on must be PartitionId.  Partitioning on other user-defined fields will be enabled in a future release.
For details on scaling your job, see [Scale Azure Stream Analytics jobs][stream.analytics.scale.jobs].

###Inputs



**Character encoding**

For the CSV and JSON input sources, UTF-8 is the only support  encoding format.


###Query complexity
The maximum number of supported aggregate functions in a Stream Analytics job query definition is seven.

###Lifecycle management

**Job upgrade**

At this time Stream Analytics does not support live edits to the definition or configuration of a running job.  In order to change the input, output, query, scale or configuration of a running job, you must first stop the job.

**Job stop and restart**

Stopping a job does not preserve any state about job progress, meaning that there is currently no way to configure a restarted job to resume from where it was last stopped.  This is a limitation that will be addressed in a future release.  For best practices on starting and stopping jobs, see [Azure Stream Analytics developer guide][stream.analytics.developer.guide]. 

###Monitoring
Some metrics related to job usage and performance, such as latency, are not available in the preview release.  The preview release also only surfaces job throughput in terms of event count, not size.

##<a name="knownissues"></a>Release notes / known issues

This contains a list of known issues for Azure Stream Analytics. This section will change over time as we remove items from the list, encounter new issues or learn more about existing ones.


###Elevated Event Hub permissions required
At this time Stream Analytics requires a Shared Access Policy with Manage permissions for Event Hub input and output sources.

###Delay in Azure Storage account configuration
When creating a Stream Analytics job in a region for the first time, you will be prompted to create a new storage account or specify an existing account for monitoring Stream Analytics jobs in that region.  Due to latency in configuring monitoring, creating another Stream Analytics job in the same region within 30 minutes will prompt for the specifying of a second storage account instead of showing the recently configured one in the Monitoring Storage Account Dropdown.  To avoid creating an unnecessary storage account, wait 30 minutes after creating a job in a region for the first time before provisioning additional jobs in that region. 

###Jobs use Default Consumer Group for Event Hub
When an Event Hub is specified as an input, Stream Analytics jobs will use the Default Consumer Group to ingest data from the Event Hub.  Doing so without additional configuration means that no other receivers can access the Event Hub.  To enable an Event Hub to have more than one receiver, additional consumer groups must be configured.  For details, see [Event Hubs developer guide][azure.event.hubs.developer.guide].

###Add an Input/Output - Event Hub 
The third page of the Add Input and Add Output dialogs for Event Hub sources has a dropdown titled Event Hub which contains both a list of Service Bus namespaces in the current subscription and an option to connect to an Event Hub in a different subscription.  If you wish to connect to an Event Hub in the same subscription, select its Service Bus namespace here.  If you wish to connect to an Event Hub outside of the subscription, select “Use Event Hub from Another Subscription”.  


###Cannot reference the same query step more than once
In this preview release a given sub-query step defined using the WITH keyword cannot be referenced more than once.  A common scenario that this may impact is a self-join using aliases of the same step.  To workaround this behavior, please create two separate steps with the same sub-query and different names.

###Unsupported type conversions result in NULL values
Any event vales with type conversions not supported in the Data Types section of [Azure Stream Analytics Query Language Reference][stream.analytics.query.language.reference] will result in a NULL value.  In this preview release no error logging is in place for these conversion exceptions. 

###Out of memory issue
Streaming Analytics jobs with a large tolerance windows for out of order events and/or complex queries maintaining a large amount of state may cause the job to run out of memory, resulting in a job restart. The start and stop operations will be visible in the job’s Operation Logs.  To avoid this behavior, scale the query out across multiple partitions.  In a future release this limitation will be addressed by degrading performance on impacted jobs instead of restarting them.

###Empty Event Hub shard in partitioned query results in no output
When running a partitioned query with a non-partitioned sub-query as the second step, if one of the Event Hub partitions on the input is completely empty, the query will not generate results. An error for this will be reflected in the Operation Logs for the job.  Please make sure all Event Hub partitions have incoming events at all times to avoid this problem.

###SQL Database event volume limitation
When using SQL Database as an output source, very high volumes of output data may cause the Stream Analytics job to time out. To resolve this issue, either reduce the output volume using aggregates or join operators, or choose Blob Storage or Event Hub as an output source instead.

###Large blob inputs not supported
Consuming large files from Blob Storage may cause Stream Analytics jobs to crash.  To avoid this issue, keep each blob under 10 MB in size.

###LEFT OUTER JOIN not supported
The LEFT OUTER JOIN operation is enabled in the Stream Analytics Query Language but not supported.  Running a query with a LEFT OUTER JOIN for more than a few minutes will result in memory consumption issues.  We do not recommend using this operation for any scenarios beyond short-lived query experimentation.  This limitation will be addressed in an upcoming release.

###Whitespace in column headers causes null output entries
Stream Analytics does not trim whitespace on column headers. Including whitespace at the beginning or end or a column name will result in null entries in the job output.   


##<a name="nextsteps"></a>Next steps

- [Introduction to Azure Stream Analytics][stream.analytics.introduction]
- [Get started using Azure Stream Analytics][stream.analytics.get.started]
- [Scale Azure Stream Analytics jobs][stream.analytics.scale.jobs]
- [Azure Stream Analytics limitations and known issues][stream.analytics.limitations]
- [Azure Stream Analytics query language reference][stream.analytics.query.language.reference]
- [Azure Stream Analytics management REST API reference][stream.analytics.rest.api.reference] 

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
[stream.analytics.scale.jobs]: ../stream-analytics-scale-jobs/
[stream.analytics.developer.guide]: ../stream-analytics-developer-guide/
[stream.analytics.introduction]: ../stream-analytics-introduction/
[stream.analytics.get.started]: ../stream-analytics-get-started/
[stream.analytics.limitations]: ../stream-analytics-limitations/


[stream.analytics.query.language.reference]: http://go.microsoft.com/fwlink/?LinkID=513299
[stream.analytics.rest.api.reference]: http://go.microsoft.com/fwlink/?LinkId=517301


[microsoft.support]: http://support.microsoft.com/
[azure.event.hubs.developer.guide]: http://msdn.microsoft.com/en-us/library/azure/dn789972.aspx

[Link 1 to another azure.microsoft.com documentation topic]: ../virtual-machines-windows-tutorial/
[Link 2 to another azure.microsoft.com documentation topic]: ../web-sites-custom-domain-name/
[Link 3 to another azure.microsoft.com documentation topic]: ../storage-whatis-account/
