<properties title="Scale Azure Stream Analytics jobs" pageTitle="Scale Stream Analytics jobs | Azure" description="Learn how to scale Stream Analytics jobs" metaKeywords="" services="" solutions="" documentationCenter="" authors="jgao" videoId="" scriptId="" manager="paulettm" editor="cgronlun"/>

<tags ms.service="stream-analytics" ms.devlang="na" ms.topic="article" ms.tgt_pltfrm="na" ms.workload="data-services" ms.date="09/31/2014" ms.author="jgao" />

# Scale Azure Stream Analytics (preview) jobs 

Learn how to scale Azure Stream Analytics jobs by configuring input partition, tuning the query definition and calculate streaming units.

The resource available for processing Stream Analytics jobs is measured by *Streaming Unit*. Each streaming unit can provide up to 1 MB/second throughput. Each job needs a minimum of one streaming unit, which is the default for all jobs. You can set up to 12 streaming unit for a Stream Analytics job using the Azure Management portal. Each subscription can have only up to 12 streaming units for all Jobs in a specific region. For increasing streaming units for your subscription up to 100 units, contact [Microsoft Support][microsoft.support].


+ [Monitor Stream Analytics job performance]
+ [Understanding Event hub partition]
+ [Calculate streaming unit limit of a job] 
+ [Next steps]

##Monitor job performance

The throughput of a job is tracked in Events/sec (documentation link to dashboard ***link to dashboard is not possible). Calculate the expected throughput of the workload in Events/sec, and ensure that you are getting the same in the dashboard. 

In case the throughput is lesser than expected, add additional Streaming Units to your job.

##Understand Event hub partition

*** (shall I talk about partition for blob storage?)

An Azure Stream Analytics job definition include Inputs, query and output. Inputs are where the job reads data stream from, the output is where the job send the job results to, and the query is used to transform the input stream.  A job requires at least one data stream input source. The data stream input source can be either an Azure Service Bus Event Hub or an Azure Blob storage.  

Partitions are the scale mechanism of Event Hubs. Each partition is capable of a specified throughput limit: 1MB per second ingress/2MB per second egress. You can specify the number of partitions at the time you create the Event Hub; this number should match the expected throughput demands of the Event Hub. Events sent to the same partition are ordered within that partition for easy, ordered retrieval. Messages sent to an Event Hub can contain a user-settable PartitionKey property which is hashed to a specific partition for the life of the Event Hub. Consumers connect to a particular partition to receive messages. This enables flexible message receiving options that you can use to organize an event stream. For more information, see [Event Hubs Developer Guide][azure.event.hubs.developer.guide].

*** (additional background information to cover? for example consumer groups?)

##Calculate streaming unit constrain of a job
The total number of streaming units that can be used by a Stream Analytics job depends on the query defined for the job and the number of partitions specified for the Event hub input source. ***(is this limited to the Event hub?) 

### Steps of a query
A query can have one or many steps. Each step is a sub-query defined using the WITH keyword. The only query that’s outside of the WITH keyword is also counted as a step. For example, the SELECT statement in the following query:  ***( can I used the term "main query" vs. subqueries?)


	WITH SubQuery1 (
	SELECT COUNT(*), TollBoothNum
	FROM Partitioned(Input, System.PartitionId) 
	GROUP BY TumblingWindow(3, minute), TollBoothNum
	) 
	SELECT COUNT(*), TollBoothNum
	FROM SubQuery1 
	GROUP BY TumblingWindow(3, minute), TollBoothNum

The previous query has totally 2 steps. Each of the steps can scale up to 6 streaming units. ***(is the statement correct?)

To add additional streaming units a step, the step must be partitioned. 

### Partition a step

*** (two parts - 1. partition configuration for event hub, 2. use partition by in the query)

When a query is partitioned using the Partition By keyword, events can be processed and aggregated in separate groups ***(define group, is it the Event hub consumer group?), and output event is generated for each such group. If a single aggregate *** (define single aggregate) is desirable, you will need to create a second non-partitioned step to aggregate.

To partition a step, it must adhere to these conditions:

- Read from one of the Inputs for the job (From <Input>) ***( not clear to me)
- The Input must be partitioned ***( does it refer to the event hub partition count setting? how is that setting related to the Partition By keyword?)
- The query within the step must have the Partition By keyword ***( Can I use the Partition By keyword for the main query and the subquery?)

You can only partition by the PartitionId field ***(partitionid = partitionkey defined in events?), which is a built in field to indicate from which partition of Event Hub or Blob the event ***(how to do this from blob?) is from. *** (is this a limitation?)

### Calculate stream units of a query

<table border="1">
<tr><th>Query</th><th>Max streaming units for the job with the query</th></td>

<tr><td>
<ul>
<li>Single step</li>
<li>No Partitioned Keyword in step</li>
</ul>
</td>
<td>6</td></tr>

<tr><td>
<ul>
<li>Two steps</li>
<li>No Partitioned Keyword in steps</li>
</ul>
</td>
<td>6 ***(I thought it would be 12. 6 for each step)</td></tr>

<tr><td>
<ul>
<li>Single step</li>
<li>Input partitioned by 3</li>
<li>Partitioned Keyword in step</li>
</ul>
</td>
<td>18</td></tr>

<tr><td>
<ul>
<li>Two steps</li>
<li>Input partitioned by 3</li>
<li>One of the two steps reading from Input has Partitioned Keyword</li>
</ul>
</td>
<td>24 (18 for partitioned step + 6 for non partitioned step)</td></tr>

</table>

The following query calculates the number of cars going through a toll station with 3 tool booths within a 3-minute window. This query can be scaled up to 6 Streaming Units.

	SELECT COUNT(*), TollId
	FROM Input 
	GROUP BY TumblingWindow(minute, 3), TollId

To use more Streaming Unit for the query, Both the job Input (*** how to partition blob events?) and the query must be partitioned. Given the query and with the Input partition set to 3, this following modified query can be scaled up to 18 streaming units.

	SELECT COUNT(*), TollId
	FROM Input Partition By PartitionId
	GROUP BY TumblingWindow(minute, 3), TollId

For accurate results ***(explain) it is recommended that the Partition Key at the Input Source is the TollId. *** (how to use TollID as the partition key? But the PartitionId is used in the sample query not tollID)

If the Input is not partitioned with the Partition Key TollId, then one can get unexpected results as the data from multiple Toll Booths can be in the same partition. These unexpected results can be fixed by adding an additional un-partitioned step.

	WITH SubQuery1 (
	SELECT COUNT(*), TollIdFROM Input Partition By PartitionId
	GROUP BY TumblingWindow(minute, 3), TollId
	) 
	SELECT COUNT(*), TollId
	FROM SubQuery1 
	GROUP BY TumblingWindow(minute, 3), TollId

This query can be scaled to 24 Streaming Units.








## Next steps

Bla, bla, bla ...

<!--Anchors-->
[Subheading 1]: #subheading-1
[Subheading 2]: #subheading-2
[Subheading 3]: #subheading-3
[Next steps]: #next-steps

<!--Image references-->
[5]: ./media/markdown-template-for-new-articles/octocats.png
[6]: ./media/markdown-template-for-new-articles/pretty49.png
[7]: ./media/markdown-template-for-new-articles/channel-9.png


<!--Link references-->


[microsoft.support]: http://support.microsoft.com
[azure.event.hubs.developer.guide]: http://msdn.microsoft.com/en-us/library/azure/dn789972.aspx

[Link 1 to another azure.microsoft.com documentation topic]: ../virtual-machines-windows-tutorial/
[Link 2 to another azure.microsoft.com documentation topic]: ../web-sites-custom-domain-name/
[Link 3 to another azure.microsoft.com documentation topic]: ../storage-whatis-account/
