<properties
	pageTitle="Scale Stream Analytics jobs to increase throughput | Microsoft Azure"
	description="Learn how to scale Stream Analytics jobs by configuring input partitions, tuning the query definition, and setting job streaming units."
	keywords="analytics jobs,data stream,data streaming"
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
	ms.date="08/19/2015"
	ms.author="jeffstok"/>

# Scale Azure Stream Analytics jobs to increase throughput #

Learn how to calculate *streaming units* for Stream Analytics jobs, and how to scale Stream Analytics jobs by configuring input partitions, tuning the query definition, and setting job streaming units. 

## What are the parts of a Stream Analytics job? ##
An Azure Stream Analytics job definition includes inputs, a query, and output. Inputs are from where the job reads the data stream, the query is used to transform the data input stream, and the output is where the job sends the job results to.  

A job requires at least one input source for data streaming. The data stream input source can be stored in an Azure Service Bus Event Hub or in Azure Blob storage. For more information, see [Introduction to Azure Stream Analytics](stream-analytics-introduction.md), [Get started using Azure Stream Analytics](stream-analytics-get-started.md), and [Azure Stream Analytics developer guide](../stream-analytics-developer-guide.md).

## Configuring Streaming Units ##
Streaming Units (SUs) represent the resources and power to execute an Azure Stream Analytics job. SUs provide a way to describe the relative event processing capacity based on a blended measure of CPU, memory, and read and write rates. Each streaming unit corresponds to roughly 1MB/second of throughput. 

Choosing how many SUs are required for a particular job is depends on the on the partition configuration for the inputs and the query defined for the job.  You can select up to your quota in streaming units for a job by using the Azure portal. Each Azure subscription by default has a quota of up to 50 streaming units for all the analytics jobs in a specific region.  To increase streaming units for your subscriptions, contact [Microsoft Support](http://support.microsoft.com).

The number of streaming units that a job can utilize depends on the partition configuration for the inputs and the query defined for the job. Note also that a valid value for the stream units must be used. The valid values start at 1, 3, 6 and then upwards in increments of 6, as shown below.

![Azure Stream Analytics Stream Units Scale][img.stream.analytics.streaming.units.scale]

This article will show you how to calculate and tune the query to increase throughput for analytics jobs.

## Calculate the maximum streaming units of a job ##
The total number of streaming units that can be used by a Stream Analytics job depends on the number of steps in the query defined for the job and the number of partitions for each step.

### Steps in a query ###
A query can have one or many steps. Each step is a sub-query defined by using the WITH keyword. The only query that is outside of the WITH keyword is also counted as a step, for example, the SELECT statement in the following query:

	WITH Step1 AS (
		SELECT COUNT(*) AS Count, TollBoothId
		FROM Input1 Partition By PartitionId
		GROUP BY TumblingWindow(minute, 3), TollBoothId, PartitionId
	)

	SELECT SUM(Count) AS Count, TollBoothId
	FROM Step1
	GROUP BY TumblingWindow(minute,3), TollBoothId

The previous query has two steps.

> [AZURE.NOTE] This sample query will be explained later in the article.

### Partition a step ###

Partitioning a step requires the following conditions:

- The input source must be partitioned. For more information, see [Azure Stream Analytics developer guide](../stream-analytics-developer-guide.md) and [Event Hubs Programming Guide](../azure-event-hubs-developer-guide.md).
- The SELECT statement of the query must read from a partitioned input source.
- The query within the step must have the **Partition By** keyword

When a query is partitioned, the input events will be processed and aggregated in separate partition groups, and outputs events are generated for each of the groups. If a combined aggregate is desirable, you must create a second non-partitioned step to aggregate.

### Calculate the max streaming units for a job ###

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
<li>The query contains two steps. The input step is partitioned and the second step is not.</li>
<li>The SELECT statement reads from the partitioned input.</li>
</ul>
</td>
<td>24 (18 for partitioned steps + 6 for non-partitioned steps)</td></tr>
</table>

### Example of scale ###
The following query calculates the number of cars going through a toll station with three tollbooths within a three-minute window. This query can be scaled up to six streaming units.

	SELECT COUNT(*) AS Count, TollBoothId
	FROM Input1
	GROUP BY TumblingWindow(minute, 3), TollBoothId, PartitionId

To use more streaming units for the query, both the data stream input and the query must be partitioned. Given that the data stream partition is set to 3, the following modified query can be scaled up to 18 streaming units:

	SELECT COUNT(*) AS Count, TollBoothId
	FROM Input1 Partition By PartitionId
	GROUP BY TumblingWindow(minute, 3), TollBoothId, PartitionId

When a query is partitioned, the input events are processed and aggregated in separate partition groups. Output events are also generated for each of the groups. Partitioning can cause some unexpected results when the **Group-by** field is not the Partition Key in the data stream input. For example, the TollBoothId field in the previous sample query is not the Partition Key of Input1. The data from the TollBooth #1 can be spread in multiple partitions.

Each of the Input1 partitions will be processed separately by Stream Analytics, and multiple records of the car-pass-through count for the same tollbooth in the same tumbling window will be created. If the input partition key can't be changed, this problem can be fixed by adding an additional non-partition step, for example:

	WITH Step1 AS (
		SELECT COUNT(*) AS Count, TollBoothId
		FROM Input1 Partition By PartitionId
		GROUP BY TumblingWindow(minute, 3), TollBoothId, PartitionId
	)

	SELECT SUM(Count) AS Count, TollBoothId
	FROM Step1
	GROUP BY TumblingWindow(minute, 3), TollBoothId

This query can be scaled to 24 streaming units.

>[AZURE.NOTE] If you are joining two streams, ensure that the streams are partitioned by the partition key of the column that you do the joins, and you have the same number of partitions in both streams.


## Configure Stream Analytics job partition ##

**To adjust a streaming unit for a job**

1. Sign in to the [Management portal](https://manage.windowsazure.com).
2. Click **Stream Analytics** in the left pane.
3. Click the Stream Analytics job that you want to scale.
4. Click **SCALE** at the top of the page.

![Azure Stream Analytics Stream Units Scale][img.stream.analytics.streaming.units.scale]


## Monitor job performance ##

Using the management portal, you can track the throughput of a job in Events/second:

![Azure Stream Analytics monitor jobs][img.stream.analytics.monitor.job]

Calculate the expected throughput of the workload in Events/second. If the throughput is less than expected, tune the input partition, tune the query, and add additional streaming units to your job.

## ASA Throughput at Scale - Raspberry Pi scenario ##


To understand how ASA scales in a typical scenario in terms of processing throughput across multiple Streaming Units, here is an experiment that sends sensor data (clients) into Event Hub, ASA processes it and sends alert or statistics as an output to another Event Hub.

The client is sending synthesized sensor data to Event Hubs in JSON format to ASA and data output is also in JSON format.  Here is how the sample data would look like–  

    {"devicetime":"2014-12-11T02:24:56.8850110Z","hmdt":42.7,"temp":72.6,"prss":98187.75,"lght":0.38,"dspl":"R-PI Olivier's Office"}

Query: “Send an alert when the light is switched off”  

    SELECT AVG(lght),
	 “LightOff” as AlertText
	FROM input TIMESTAMP
	BY devicetime
	 WHERE
		lght< 0.05 GROUP BY TumblingWindow(second, 1)

Measuring Throughput: Throughput in this context is the amount of input data processed by ASA in a fixed amount of time (10minutes). To achieve best processing throughput for the input data, both the data stream input and the query must be partitioned. Also COUNT()is included in the query to measure how many input events were processed. To ensure ASA is not simply waiting for input events to come, each partition of the Input Event Hub was preloaded with sufficient input data (about 300MB).  

Below are the results with increasing number of Streaming units and corresponding Partition counts in Event Hubs.  

<table border="1">
<tr><th>Input Partitions</th><th>Output Partitions</th><th>Streaming Units</th><th>Sustained Throughput
</th></td>

<tr><td>12</td>
<td>12</td>
<td>6</td>
<td>4.06 MB/s</td>
</tr>

<tr><td>12</td>
<td>12</td>
<td>12</td>
<td>8.06 MB/s</td>
</tr>

<tr><td>48</td>
<td>48</td>
<td>48</td>
<td>38.32 MB/s</td>
</tr>

<tr><td>192</td>
<td>192</td>
<td>192</td>
<td>172.67 MB/s</td>
</tr>

<tr><td>480</td>
<td>480</td>
<td>480</td>
<td>454.27 MB/s</td>
</tr>

<tr><td>720</td>
<td>720</td>
<td>720</td>
<td>609.69 MB/s</td>
</tr>
</table>

![img.stream.analytics.perfgraph][img.stream.analytics.perfgraph]

## Get help ##
For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureStreamAnalytics).


## Next steps ##

- [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
- [Get started using Azure Stream Analytics](stream-analytics-get-started.md)
- [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
- [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
- [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)


<!--Image references-->

[img.stream.analytics.monitor.job]: ./media/stream-analytics-scale-jobs/StreamAnalytics.job.monitor.png
[img.stream.analytics.configure.scale]: ./media/stream-analytics-scale-jobs/StreamAnalytics.configure.scale.png
[img.stream.analytics.perfgraph]: ./media/stream-analytics-scale-jobs/perf.png
[img.stream.analytics.streaming.units.scale]: ./media/stream-analytics-scale-jobs/StreamAnalyticsStreamingUnitsExample.jpg

<!--Link references-->

[microsoft.support]: http://support.microsoft.com
[azure.management.portal]: http://manage.windowsazure.com
[azure.event.hubs.developer.guide]: http://msdn.microsoft.com/library/azure/dn789972.aspx

[stream.analytics.developer.guide]: ../stream-analytics-developer-guide.md
[stream.analytics.introduction]: stream-analytics-introduction.md
[stream.analytics.get.started]: stream-analytics-get-started.md
[stream.analytics.query.language.reference]: http://go.microsoft.com/fwlink/?LinkID=513299
[stream.analytics.rest.api.reference]: http://go.microsoft.com/fwlink/?LinkId=517301
 