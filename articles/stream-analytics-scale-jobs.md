<properties 
	pageTitle="Scale Stream Analytics jobs | Azure" 
	description="Learn how to scale Stream Analytics jobs" 
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

# Scale Azure Stream Analytics jobs 

Learn how to calculate *Streaming Units* for a Stream Analytics job, and how to scale Stream Analytics jobs by configuring input partitions, tuning the query definition, and setting job streaming units.

An Azure Stream Analytics job definition includes inputs, a query, and output. Inputs are from where the job reads the data stream, the query is used to transform the input stream, and the output is where the job sends the job results to.  

A job requires at least one data stream input source. The data stream input source can be stored in an Azure Service Bus Event Hub or in Azure Blob storage. For more information, see [Introduction to Azure Stream Analytics][stream.analytics.introduction], [Get started using Azure Stream Analytics][stream.analytics.get.started], and [Azure Stream Analytics developer guide][stream.analytics.developer.guide]. 

The resource available for processing Stream Analytics jobs is measured by a streaming unit. Each streaming unit can provide up to 1 MB/second throughput. Each job needs a minimum of one streaming unit, which is the default for all jobs. You can set up to 12 streaming units for a Stream Analytics job by using the Azure portal. Each Azure subscription can have up to 12 streaming units for all the jobs in a specific region. To increase streaming units for your subscription (up to 100 units), contact [Microsoft Support][microsoft.support].

The number of streaming units that a job can utilize depends on the partition configuration for the inputs and the query defined for the job. This article will show you how to calculate and tune the query to increase throughput.


## Calculate the maximum streaming units of a job
The total number of streaming units that can be used by a Stream Analytics job depends on the number of steps in the query defined for the job and the number of partitions for each step.

### Steps in a query
A query can have one or many steps. Each step is a sub-query defined by using the WITH keyword. The only query that is outside of the WITH keyword is also counted as a step, for example, the SELECT statement in the following query:

	WITH Step1 (
		SELECT COUNT(*) AS Count, TollBoothId
		FROM Input1 Partition By PartitionId 
		GROUP BY TumblingWindow(minute, 3), TollBoothId
	) 

	SELECT SUM(Count) AS Count, TollBoothId
	FROM Step1 
	GROUP BY TumblingWindow(minute,3), TollBoothId

The previous query has two steps. 

> [AZURE.NOTE] This sample query will be explained later in the article.

### Partition a step

Partitioning a step requires the following conditions:

- The input source must be partitioned. For more information, see [Azure Stream Analytics developer guide][stream.analytics.developer.guide] and [Event Hubs Programming Guide][azure.event.hubs.developer.guide].
- The SELECT statement of the query must read from a partitioned input source. 
- The query within the step must have the **Partition By** keyword 

When a query is partitioned, the input events will be processed and aggregated in separate partition groups, and outputs events are generated for each of the groups. If a combined aggregate is desirable, you must create a second non-partitioned step to aggregate.

**Note**: The preview release of Azure Stream Analytics doesn't support partitioning by column names. You can only partition by the **PartitionId** field, which is a built-in field in your query. The **ParitionId** field indicates from which partition of the source data stream the event is from. For details, see [Azure Stream Analytics limitations and known issues][stream.analytics.limitations].

### Calculate the max streaming units for a job

All non-partitioned steps together can scale up to six streaming units for a Stream Analytics job. To add additional streaming units, a step must be partitioned. Each partition can have six streaming units.

<table border="1">
<tr><th>Query of a job</th><th>Max streaming units for the job</th></td>

<tr><td>
<ul>
<li>The query contains one step.</li>
<li>The step is not partitioned.</li>
</ul>
</td>
<td>6</td></tr>

<tr><td>
<ul>
<li>The input data stream is partitioned by 3.</li>
<li>The query contains one step.</li>
<li>The step is partitioned.</li>
</ul>
</td>
<td>18</td></tr>

<tr><td>
<ul>
<li>The query contains two steps.</li>
<li>Neither of the steps is partitioned.</li>
</ul>
</td>
<td>6</td></tr>



<tr><td>
<ul>
<li>The data stream input is partitioned by 3.</li>
<li>The query contains two steps.</li>
<li>The SELECT statement reads from the partitioned input.</li>
</ul>
</td>
<td>24 (18 for partitioned steps + 6 for non-partitioned steps)</td></tr>
</table>

### Example of scale
The following query calculates the number of cars going through a toll station with three tollbooths within a three-minute window. This query can be scaled up to six streaming units.

	SELECT COUNT(*) AS Count, TollBoothId
	FROM Input1 
	GROUP BY TumblingWindow(minute, 3), TollBoothId

To use more streaming units for the query, both the data stream input and the query must be partitioned. Given that the data stream partition is set to 3, the following modified query can be scaled up to 18 streaming units:

	SELECT COUNT(*) AS Count, TollBoothId
	FROM Input1 Partition By PartitionId
	GROUP BY TumblingWindow(minute, 3), TollBoothId

When a query is partitioned, the input events are processed and aggregated in separate partition groups. Output events are also generated for each of the groups. Partitioning can cause some unexpected results when the **Group-by** field is not the Partition Key in the data stream input. For example, the TollBoothId field in the previous sample query is not the Partition Key of Input1. The data from the TollBooth #1 can be spread in multiple partitions. 

Each of the Input1 partitions will be processed separately by Stream Analytics, and multiple records of the car-pass-through count for the same tollbooth in the same tumbling window will be created. If the input partition key can't be changed, this problem can be fixed by adding an additional non-partition step, for example:

	WITH Step1 (
		SELECT COUNT(*) AS Count, TollBoothId
		FROM Input1 Partition By PartitionId
		GROUP BY TumblingWindow(minute, 3), TollBoothId
	) 

	SELECT SUM(Count) AS Count, TollBoothId
	FROM Step1 
	GROUP BY TumblingWindow(minute, 3), TollBoothId

This query can be scaled to 24 streaming units. 

>[AZURE.NOTE] If you are joining two streams, please ensure that the streams are partitioned by the partition key of the column that you do the joins, and you have the same number of partitions in both streams.


## Configure Stream Analytics job partition

**To adjust a streaming unit for a job**

1. Sign in to the [Management portal][azure.management.portal].
2. Click **Stream Analytics** in the left pane.
3. Click the Stream Analytics job that you want to scale.
4. Click **SCALE** at the top of the page.

![Azure Stream Analytics configure job scale][img.stream.analytics.configure.scale]


## Monitor job performance

Using the management portal, you can track the throughput of a job in Events/second:

![Azure Stream Analytics monitor jobs][img.stream.analytics.monitor.job]
 
Calculate the expected throughput of the workload in Events/second. If the throughput is less than expected, tune the input partition, tune the query, and add additional streaming units to your job.

## Next steps
In this article, you have learned how to calculate streaming units and how to scale a Stream Analytics job. To read more about Stream Analytics, see:

- [Introduction to Azure Stream Analytics][stream.analytics.introduction]
- [Get started using Azure Stream Analytics][stream.analytics.get.started]
- [Azure Stream Analytics developer guide][stream.analytics.developer.guide]
- [Azure Stream Analytics limitations and known issues][stream.analytics.limitations]
- [Azure Stream Analytics Query Language Reference][stream.analytics.query.language.reference]
- [Azure Stream Analytics Management REST API Reference][stream.analytics.rest.api.reference]

<!--Image references-->

[img.stream.analytics.monitor.job]: ./media/stream-analytics-scale-jobs/StreamAnalytics.job.monitor.png
[img.stream.analytics.configure.scale]: ./media/stream-analytics-scale-jobs/StreamAnalytics.configure.scale.png

<!--Link references-->

[microsoft.support]: http://support.microsoft.com
[azure.management.portal]: http://manage.windowsazure.com
[azure.event.hubs.developer.guide]: http://msdn.microsoft.com/library/azure/dn789972.aspx

[stream.analytics.developer.guide]: stream-analytics-developer-guide.md
[stream.analytics.limitations]: stream-analytics-limitations.md
[stream.analytics.introduction]: stream-analytics-introduction.md
[stream.analytics.get.started]: stream-analytics-get-started.md
[stream.analytics.query.language.reference]: http://go.microsoft.com/fwlink/?LinkID=513299
[stream.analytics.rest.api.reference]: http://go.microsoft.com/fwlink/?LinkId=517301


