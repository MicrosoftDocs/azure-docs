<properties title="Azure Stream Analytics limitations in the preview release" pageTitle=" Stream Analytics limitations in the preview release | Azure" description="Learn the limitations in the public preview release of Azure Stream Analytics jobs" metaKeywords="" services="" solutions="" documentationCenter="" authors="jgao" videoId="" scriptId="" manager="paulettm" editor="cgronlun"/>

<tags ms.service="stream-analytics" ms.devlang="na" ms.topic="article" ms.tgt_pltfrm="na" ms.workload="data-services" ms.date="09/31/2014" ms.author="jgao" />

#Azure Stream Analytics limitations in the preview release

This document describes the limits and known issues of [Azure Stream Analytics][azure.stream.analytics.documentation] during the Preview release.  In most cases these limits exist with an intent to get your early feedback or based on current capacity constraints. 
<!--Table of contents for topic, the words in brackets must match the heading wording exactly-->

+ [Limitations] 
+ [Release notes and known issues]

## Limitations

###Regional availability
Stream Analytics jobs can only be provisioned in the Central US and West Europe regions in the preview release.

###Elevated Event Hub permissions required

At this time Stream Analytics requires a Shared Access Policy with Manage permissions for Event Hub input and output sources.

###Scale 
**Streaming Unit quota**

Due to current capacity constraints, a quota of 12 Streaming Units per region per subscription is enforced. For more information see [Scale Azure Stream Analytics jobs][azure.stream.analytics.scale]. If you have business need to relax this limit, please call [Microsoft support][microsoft.support] and we will do our best to accommodate within the constraints of the public offer. 

**Streaming Unit specification and utilization**

The number of Streaming Units that can be allocated to a job depend on the number of partitions on the data input and the way that the job query is written.
  
In this preview release, the number of Streaming Units provided to a job may sometimes be higher than the amount selected or billed.  Additionally, Streaming Units will not be throttled down, meaning that observed performance may be higher than guaranteed depending on the availability of computational resources.

**Partition key**

When scaling out your query with PARTITION BY, the field to partition on must be PartitionId.  Partitioning on other user-defined fields will be enabled in a future release.
For details on scaling your job, see [Scale Azure Stream Analytics jobs][azure.stream.analytics.scale].

###Inputs



**Character encoding**

For the CSV and JSON input sources, UTF-8 is the only support  encoding format.


###Query complexity
The maximum number of supported aggregate functions in a Stream Analytics job query definition is seven.

###Lifecycle management

**Job upgrade**

At this time Stream Analytics does not support live edits to the definition or configuration of a running job.  In order to change the input, output, query, scale or configuration of a running job, you must first stop the job.

**Job stop and restart**

Stopping a job does not preserve any state about job progress, meaning that there is currently no way to configure a restarted job to resume from where it was last stopped.  This is a limitation that will be addressed in a future release.  For best practices on starting and stopping jobs, see [Azure Stream Analytics developer guide][azure.stream.analytics.developer.guide]. 

###Monitor jobs
Some metrics related to job usage and performance, such as latency, are not available in the preview release.  The preview release also only surfaces job throughput in terms of event count, not size.

##Release notes / known issues

This contains a list of known issues for Azure Stream Analytics. This section will change over time as we remove items from the list, encounter new issues or learn more about existing ones.

###Delay in Azure Storage account configuration
When creating a Stream Analytics job in a region for the first time, you will be prompted to create a new storage account or specify an existing account for monitoring Stream Analytics jobs in that region.  Due to latency in configuring monitoring, creating another Stream Analytics job in the same region within 30 minutes will prompt for the specifying of a second storage account instead of showing the recently configured one in the Monitoring Storage Account Dropdown.  To avoid creating an unnecessary storage account, wait 30 minutes after creating a job in a region for the first time before provisioning additional jobs in that region. 

###Jobs use Default Consumer Group for Event Hub
When an Event Hub is specified as an input, Stream Analytics jobs will use the Default Consumer Group to ingest data from the Event Hub.  Doing so without additional configuration means that no other receivers can access the Event Hub.  To enable an Event Hub to have more than one receiver, additional consumer groups must be configured.  For details, see [Event Hubs developer guide][azure.event.hubs.developer.guide].




<!--Anchors-->
[Limitations]: #Limitations
[Release notes and known issues]: #Release-notes-and-known-issues
[Subheading 3]: #subheading-3
[Next steps]: #next-steps

<!--Image references-->
[5]: ./media/markdown-template-for-new-articles/octocats.png
[6]: ./media/markdown-template-for-new-articles/pretty49.png
[7]: ./media/markdown-template-for-new-articles/channel-9.png


<!--Link references-->

[azure.stream.analytics.documentation]: http://go.microsoft.com/fwlink/?LinkId=512092
[azure.stream.analytics.scale]: ../stream-analytics-scale-jobs/
[azure.stream.analytics.developer.guide]: ../stream-analytics-scale-jobs/


[microsoft.support]: http://support.microsoft.com/
[azure.event.hubs.developer.guide]: http://msdn.microsoft.com/en-us/library/azure/dn789972.aspx

[Link 1 to another azure.microsoft.com documentation topic]: ../virtual-machines-windows-tutorial/
[Link 2 to another azure.microsoft.com documentation topic]: ../web-sites-custom-domain-name/
[Link 3 to another azure.microsoft.com documentation topic]: ../storage-whatis-account/
