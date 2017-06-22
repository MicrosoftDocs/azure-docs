---
title: Scale Stream Analytics jobs to increase throughput | Microsoft Docs
description: Learn how to scale Stream Analytics jobs by configuring input partitions, tuning the query definition, and setting job streaming units.
keywords: data streaming, streaming data processing, tune analytics
services: stream-analytics
documentationcenter: ''
author: jeffstokes72
manager: jhubbard
editor: cgronlun

ms.assetid: 7e857ddb-71dd-4537-b7ab-4524335d7b35
ms.service: stream-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-services
ms.date: 06/22/2017
ms.author: jeffstok

---
# Scale Azure Stream Analytics jobs to increase stream data processing throughput
This article shows you how to tune a Stream Analytics query to increase throughput for Streaming Analytics jobs. You learn how to scale Stream Analytics jobs by configuring input partitions, tuning the analytics query definition, and calculating and setting job *streaming units* (SUs). 

## What are the parts of a Stream Analytics job?
A Stream Analytics job definition includes inputs, a query, and output. Inputs are where the job reads the data stream from. The query is used to transform the data input stream, and the output is where the job sends the job results to.  

A job requires at least one input source for data streaming. The data stream input source can be stored in an Azure event hub or in Azure blob storage. For more information, see [Introduction to Azure Stream Analytics](stream-analytics-introduction.md) and [Get started using Azure Stream Analytics](stream-analytics-get-started.md).

## Partitions in event hubs and Azure storage
Scaling a Stream Analytics job takes advantage of partitions in the input or output. Partitioning lets you divide data into subsets based on a partition key. A process that consumes the data (such as a Streaming Analytics job) can consume and write different partitions in parallel, which increases throughput. When you work with Streaming Analytics, you can take advantage of partitioning in event hubs and in Blob storage. 

For more information about partitions, see the following articles:

* [Event Hubs features overview](../event-hubs/event-hubs-features.md#partitions)
* [Data partitioning](../architecture/best-practices/data-partitioning.md#partitioning-azure-blob-storage)


## Streaming units (SUs)
Streaming units (SUs) represent the resources and computing power that are required in order to execute an Azure Stream Analytics job. SUs provide a way to describe the relative event processing capacity based on a blended measure of CPU, memory, and read and write rates. Each SU corresponds to roughly 1 MB/second of throughput. 

Choosing how many SUs are required for a particular job depends on the partition configuration for the inputs and on the query defined for the job. You can select up to your quota in SUs for a job. By default, each Azure subscription has a quota of up to 50 SUs for all the analytics jobs in a specific region. To increase SUs for your subscriptions beyond this quota, contact [Microsoft Support](http://support.microsoft.com). Valid values for SUs per job are 1, 3, 6, and up in increments of 6.

## Embarrassingly parallel jobs
An *embarrassingly parallel* job is the most scalable scenario we have in Azure Stream Analytics. It connects one partition of the input to one instance of the query to one partition of the output. This parallelism has the following requirements:

1. If your query logic depends on the same key being processed by the same query instance, you must make sure that the events go to the same partition of your input. For event hubs, this means that the event data must have the **PartitionKey** value set. Alternatively, you can use partitioned senders. For blob storage, this means that the events are sent to the same partition folder. If your query logic does not require the same key to be processed by the same query instance, you can ignore this requirement. An example of this logic would be a simple select-project-filter query.  

2. Once the data is laid out on the input side, you must make sure that your query is partitioned. This requires you to use **Partition By** in all the steps. Multiple steps are allowed, but they all must be partitioned by the same key. Currently, the partitioning key must be set to **PartitionId** in order for the job to be fully parallel.  

3. Currently only event hubs and blob storage support partitioned output. For event hub output, you must configure the partition key to be **PartitionId**. For blob storage output, you don't have to do anything.  

4. The number of input partitions must equal the number of output partitions. Blob storage output doesn't currently support partitions. But that's okay, because it inherits the partitioning scheme of the upstream query. Here are examples of partition values that allow a fully parallel job:  

   * 8 event hub input partitions and 8 event hub output partitions
   * 8 event hub input partitions and blob storage output  
   * 8 blob storage input partitions and blob storage output  
   * 8 blob storage input partitions and 8 event hub output partitions  

The following sections discuss some example scenarios that are embarrassingly parallel.

### Simple query

* Input: Event hub with 8 partitions
* Output: Event hub with 8 partitions

Query:

    SELECT TollBoothId
    FROM Input1 Partition By PartitionId
    WHERE TollBoothId > 100

This query is a simple filter. Therefore, we don't need to worry about partitioning the input that is being sent to the event hub. Notice that the query includes **Partition By PartitionId**, so it fulfills requirement #2 from earlier. For the output, we need to configure the event hub output in the job to have the parition key set to **PartitionId**. One last check is to make sure that the number of input partitions is equal to the number of output partitions.

### Query with a grouping key

* Input: Event hub with 8 partitions
* Output: Blob storage

Query:

    SELECT COUNT(*) AS Count, TollBoothId
    FROM Input1 Partition By PartitionId
    GROUP BY TumblingWindow(minute, 3), TollBoothId, PartitionId

This query has a grouping key. Therefore, the same key needs to be processed by the same query instance, which means that events must be sent to the event hub in a partitioned manner. But which key should be used? **PartitionId** is a job-logic concept. The key we actually care about is **TollBoothId**, so the **PartitionKey** value of the event data should be **TollBoothId**. We do this in the query by setting **Partition By** to **PartitionId**. Since the output is blob storage, we don't need to worry about configuring a partition key value, as per requirement #4.

### Multi-step query with a grouping key
* Input: Event hub with 8 partitions
* Output: Event hub instance with 8 partitions

Query:

    WITH Step1 AS (
    SELECT COUNT(*) AS Count, TollBoothId, PartitionId
    FROM Input1 Partition By PartitionId
    GROUP BY TumblingWindow(minute, 3), TollBoothId, PartitionId
    )

    SELECT SUM(Count) AS Count, TollBoothId
    FROM Step1 Partition By PartitionId
    GROUP BY TumblingWindow(minute, 3), TollBoothId, PartitionId

This query has a grouping key, so the same key needs to be processed by the same query instance. We can use the same strategy as in the previous example. In this case, the query has multiple steps. Does each step have **Partition By PartitionId**? Yes, so the query fulfills requirement #3. For the output, we need to set the partition key to **PartitionId**, as discussed earlier. We can also see that it has the same number of partitions as the input.

## Example scenarios that are *not* embarrassingly parallel

In the previous section, we showed some embarrassingly parallel scenarios. In this section, we discuss scenarios that don't meet all the requirements to be embarrassingly parallel. 

### Mismatched partition count
* Input: Event hub with 8 partitions
* Output: Event hub with 32 partitions

In this case, it doesn't matter what the query is. If the input partition count doesn't match the output partition count, the topology isn't embarrassingly parallel.

### Not using event hubs or blob storage as output
* Input: Event hub with 8 partitions
* Output: PowerBI

PowerBI output doesn't currently support partitioning. Therefore, this scenario is not embarrassingly parallel.

### Multi-step query with different Partition By values
* Input: Event hub with 8 partitions
* Output: Event hub with 8 partitions

Query:

    WITH Step1 AS (
    SELECT COUNT(*) AS Count, TollBoothId, PartitionId
    FROM Input1 Partition By PartitionId
    GROUP BY TumblingWindow(minute, 3), TollBoothId, PartitionId
    )

    SELECT SUM(Count) AS Count, TollBoothId
    FROM Step1 Partition By TollBoothId
    GROUP BY TumblingWindow(minute, 3), TollBoothId

As you can see, the second step uses **TollBoothId** as the partitioning key. This step is not the same as the first step, and it therefore requires us to do a shuffle. 

The preceding examples show some Stream Analytics jobs that conform to (or don't) an embarrassingly parallel topology. If they do conform, they have the potential for maximum scale. For jobs that don't fit one of these profiles, scaling guidance will be available in future updates. For now, use the general guidance in the following sections.

## Calculate the maximum streaming units of a job
The total number of streaming units that can be used by a Stream Analytics job depends on the number of steps in the query defined for the job and the number of partitions for each step.

### Steps in a query
A query can have one or many steps. Each step is a subquery defined by the **WITH** keyword. The query that is outside the **WITH** keyword (one query only) is also counted as a step, such as the **SELECT** statement in the following query:

    WITH Step1 AS (
        SELECT COUNT(*) AS Count, TollBoothId
        FROM Input1 Partition By PartitionId
        GROUP BY TumblingWindow(minute, 3), TollBoothId, PartitionId
    )

    SELECT SUM(Count) AS Count, TollBoothId
    FROM Step1
    GROUP BY TumblingWindow(minute,3), TollBoothId

This query has two steps.

> [!NOTE]
> This query is discussed in more detail later in the article.
>  

### Partition a step
Partitioning a step requires the following conditions:

* The input source must be partitioned. 
* The **SELECT** statement of the query must read from a partitioned input source.
* The query within the step must have the **Partition By** keyword.

When a query is partitioned, the input events are processed and aggregated in separate partition groups, and outputs events are generated for each of the groups. If you want a combined aggregate, you must create a second non-partitioned step to aggregate.

### Calculate the max streaming units for a job
All non-partitioned steps together can scale up to six streaming units (SUs) for a Stream Analytics job. To add SUs, a step must be partitioned. Each partition can have six SUs.

<table border="1">
<tr><th>Query</th><th>Max SUs for the job</th></td>

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
<li>The input data stream is partitioned by 3.</li>
<li>The query contains two steps. The input step is partitioned and the second step is not.</li>
<li>The <strong>SELECT</strong> statement reads from the partitioned input.</li>
</ul>
</td>
<td>24 (18 for partitioned steps + 6 for non-partitioned steps)</td></tr>
</table>

### Examples of scaling

The following query calculates the number of cars within a three-minute window going through a toll station that has three tollbooths. This query can be scaled up to six SUs.

    SELECT COUNT(*) AS Count, TollBoothId
    FROM Input1
    GROUP BY TumblingWindow(minute, 3), TollBoothId, PartitionId

To use more SUs for the query, both the input data stream and the query must be partitioned. Since the data stream partition is set to 3, the following modified query can be scaled up to 18 SUs:

    SELECT COUNT(*) AS Count, TollBoothId
    FROM Input1 Partition By PartitionId
    GROUP BY TumblingWindow(minute, 3), TollBoothId, PartitionId

When a query is partitioned, the input events are processed and aggregated in separate partition groups. Output events are also generated for each of the groups. Partitioning can cause some unexpected results when the **GROUP BY** field is not the partition key in the input data stream. For example, the **TollBoothId** field in the previous query is not the partition key of **Input1**. The result is that the data from TollBooth #1 can be spread in multiple partitions.

Each of the **Input1** partitions will be processed separately by Stream Analytics. As a result, multiple records of the car count for the same tollbooth in the same Tumbling window will be created. If the input partition key can't be changed, this problem can be fixed by adding a non-partition step, as in the following example:

    WITH Step1 AS (
        SELECT COUNT(*) AS Count, TollBoothId
        FROM Input1 Partition By PartitionId
        GROUP BY TumblingWindow(minute, 3), TollBoothId, PartitionId
    )

    SELECT SUM(Count) AS Count, TollBoothId
    FROM Step1
    GROUP BY TumblingWindow(minute, 3), TollBoothId

This query can be scaled to 24 SUs.

> [!NOTE]
> If you are joining two streams, make sure that the streams are partitioned by the partition key of the column that you use to create the joins. Also make sure that you have the same number of partitions in both streams.
> 
> 

## Configure Stream Analytics streaming units

1. Sign in to the [Azure portal](https://portal.azure.com).
2. In the list of resources, find the Stream Analytics job that you want to scale and then open it.
3. In the job blade, under **Configure**, click **Scale**.

    ![Azure portal Stream Analytics job configuration][img.stream.analytics.preview.portal.settings.scale]

4. Use the slider to set the SUs for the job. Notice that you are limited to specific SU settings.


## Monitor job performance
Using the Azure portal, you can track the throughput of a job:

![Azure Stream Analytics monitor jobs][img.stream.analytics.monitor.job]

Calculate the expected throughput of the workload. If the throughput is less than expected, tune the input partition, tune the query, and add SUs to your job.


## Visualize Stream Analytics throughput at scale: the Raspberry Pi scenario
To help you understand how Stream Analytics jobs scale, we performed an experiment based on input from a Raspberry Pi device. This experiment let us see the effect on throughput of multiple streaming units and partitions.

In this scenario, the device sends sensor data (clients) to an event hub. Streaming Analytics processes the data and sends an alert or statistics as an output to another event hub. 

The client sends sensor data in JSON format. The data output is also in JSON format. The data looks like this:

    {"devicetime":"2014-12-11T02:24:56.8850110Z","hmdt":42.7,"temp":72.6,"prss":98187.75,"lght":0.38,"dspl":"R-PI Olivier's Office"}

The following query is used to send an alert when a light is switched off:

    SELECT AVG(lght),
     "LightOff" as AlertText
    FROM input TIMESTAMP
    BY devicetime
     WHERE
        lght< 0.05 GROUP BY TumblingWindow(second, 1)

### Measure throughput

In this context, throughput is the amount of input data processed by Stream Analytics in a fixed amount of time. (We measured for 10 minutes.) To achieve the best processing throughput for the input data, both the data stream input and the query were  partitioned. We included **COUNT()** in the query to measure how many input events were processed. To make sure the job was not simply waiting for input events to come, each partition of the input event hub was preloaded with about 300 MB of input data.

The following table shows the results we saw when we increased the number of streaming units and the corresponding partition counts in event hubs.  

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

And the following graph shows a visualization of the relationship between SUs and throughput.

![img.stream.analytics.perfgraph][img.stream.analytics.perfgraph]

## Get help
For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/home?forum=AzureStreamAnalytics).

## Next steps
* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-get-started.md)
* [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
* [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)

<!--Image references-->

[img.stream.analytics.monitor.job]: ./media/stream-analytics-scale-jobs/StreamAnalytics.job.monitor-NewPortal.png
[img.stream.analytics.configure.scale]: ./media/stream-analytics-scale-jobs/StreamAnalytics.configure.scale.png
[img.stream.analytics.perfgraph]: ./media/stream-analytics-scale-jobs/perf.png
[img.stream.analytics.streaming.units.scale]: ./media/stream-analytics-scale-jobs/StreamAnalyticsStreamingUnitsExample.jpg
[img.stream.analytics.preview.portal.settings.scale]: ./media/stream-analytics-scale-jobs/StreamAnalyticsPreviewPortalJobSettings-NewPortal.png   

<!--Link references-->

[microsoft.support]: http://support.microsoft.com
[azure.management.portal]: http://manage.windowsazure.com
[azure.event.hubs.developer.guide]: http://msdn.microsoft.com/library/azure/dn789972.aspx

[stream.analytics.introduction]: stream-analytics-introduction.md
[stream.analytics.get.started]: stream-analytics-get-started.md
[stream.analytics.query.language.reference]: http://go.microsoft.com/fwlink/?LinkID=513299
[stream.analytics.rest.api.reference]: http://go.microsoft.com/fwlink/?LinkId=517301

