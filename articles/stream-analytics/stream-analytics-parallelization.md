---
title: Use query parallelization and scale in Azure Stream Analytics
description: This article describes how to scale Stream Analytics jobs by configuring input partitions, tuning the query definition, and setting job streaming units.
services: stream-analytics
author: JSeb225
ms.author: jeanb
manager: kfile
ms.reviewer: jasonh
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 05/07/2018
---
# Leverage query parallelization in Azure Stream Analytics
This article shows you how to take advantage of parallelization in Azure Stream Analytics. You learn how to scale Stream Analytics jobs by configuring input partitions and tuning the analytics query definition.
As a prerequisite, you may want to be familiar with the notion of Streaming Unit described in [Understand and adjust Streaming Units](stream-analytics-streaming-unit-consumption.md).

## What are the parts of a Stream Analytics job?
A Stream Analytics job definition includes inputs, a query, and output. Inputs are where the job reads the data stream from. The query is used to transform the data input stream, and the output is where the job sends the job results to.  

A job requires at least one input source for data streaming. The data stream input source can be stored in an Azure event hub or in Azure blob storage. For more information, see [Introduction to Azure Stream Analytics](stream-analytics-introduction.md) and [Get started using Azure Stream Analytics](stream-analytics-real-time-fraud-detection.md).

## Partitions in sources and sinks
Scaling a Stream Analytics job takes advantage of partitions in the input or output. Partitioning lets you divide data into subsets based on a partition key. A process that consumes the data (such as a Streaming Analytics job) can consume and write different partitions in parallel, which increases throughput. 

### Inputs
All Azure Stream Analytics input can take advantage of partitioning:
-	EventHub (need to set the partition key explicitly with PARTITION BY keyword)
-	IoT Hub  (need to set the partition key explicitly with PARTITION BY keyword)
-	Blob storage

### Outputs

When you work with Stream Analytics, you can take advantage of partitioning in the outputs:
-	Azure Data Lake Storage
-	Azure Functions
-	Azure Table
-	Blob storage (can set the partition key explicitly)
-	CosmosDB  (need to set the partition key explicitly)
-	EventHub (need to set the partition key explicitly)
-	IoT Hub  (need to set the partition key explicitly)
-	Service Bus

PowerBI, SQL, and SQL Data-Warehouse outputs don’t support partitioning. However you can still partition the input as described in [this section](#multi-step-query-with-different-partition-by-values) 

For more information about partitions, see the following articles:

* [Event Hubs features overview](../event-hubs/event-hubs-features.md#partitions)
* [Data partitioning](https://docs.microsoft.com/azure/architecture/best-practices/data-partitioning#partitioning-azure-blob-storage)


## Embarrassingly parallel jobs
An *embarrassingly parallel* job is the most scalable scenario we have in Azure Stream Analytics. It connects one partition of the input to one instance of the query to one partition of the output. This parallelism has the following requirements:

1. If your query logic depends on the same key being processed by the same query instance, you must make sure that the events go to the same partition of your input. For Event Hubs or IoT Hub, this means that the event data must have the **PartitionKey** value set. Alternatively, you can use partitioned senders. For blob storage, this means that the events are sent to the same partition folder. If your query logic does not require the same key to be processed by the same query instance, you can ignore this requirement. An example of this logic would be a simple select-project-filter query.  

2. Once the data is laid out on the input side, you must make sure that your query is partitioned. This requires you to use **PARTITION BY** in all the steps. Multiple steps are allowed, but they all must be partitioned by the same key. Currently, the partitioning key must be set to **PartitionId** in order for the job to be fully parallel.  

3. Most of our output can take advantage of partitioning, however if you use an output type that doesn't support partitioning your job won't be fully parallel. Refer to the [output section](#outputs) for more details.

4. The number of input partitions must equal the number of output partitions. Blob storage output can support partitions and inherits the partitioning scheme of the upstream query. When a partition key for Blob storage is specified, data is partitioned per input partition thus the result is still fully parallel. Here are examples of partition values that allow a fully parallel job:

   * 8 event hub input partitions and 8 event hub output partitions
   * 8 event hub input partitions and blob storage output
   * 8 event hub input partitions and blob storage output partitioned by a custom field with arbitrary cardinality
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

This query is a simple filter. Therefore, we don't need to worry about partitioning the input that is being sent to the event hub. Notice that the query includes **PARTITION BY PartitionId**, so it fulfills requirement #2 from earlier. For the output, we need to configure the event hub output in the job to have the partition key set to **PartitionId**. One last check is to make sure that the number of input partitions is equal to the number of output partitions.

### Query with a grouping key

* Input: Event hub with 8 partitions
* Output: Blob storage

Query:

    SELECT COUNT(*) AS Count, TollBoothId
    FROM Input1 Partition By PartitionId
    GROUP BY TumblingWindow(minute, 3), TollBoothId, PartitionId

This query has a grouping key. Therefore, the events grouped together must be sent to the same Event Hub partition. Since in this example we group by TollBoothID, we should be sure that TollBoothID is used as the partition key when the events are sent to Event Hub. Then in ASA, we can use **PARTITION BY PartitionId** to inherit from this partition scheme and enable full parallelization. Since the output is blob storage, we don't need to worry about configuring a partition key value, as per requirement #4.

## Example of scenarios that are *not* embarrassingly parallel

In the previous section, we showed some embarrassingly parallel scenarios. In this section, we discuss scenarios that don't meet all the requirements to be embarrassingly parallel. 

### Mismatched partition count
* Input: Event hub with 8 partitions
* Output: Event hub with 32 partitions

In this case, it doesn't matter what the query is. If the input partition count doesn't match the output partition count, the topology isn't embarrassingly parallel.+  However we can still get some level or parallelization.

### Query using non-partitioned output
* Input: Event hub with 8 partitions
* Output: PowerBI

PowerBI output doesn't currently support partitioning. Therefore, this scenario is not embarrassingly parallel.

### Multi-step query with different PARTITION BY values
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

Query:

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
* The query within the step must have the **PARTITION BY** keyword.

When a query is partitioned, the input events are processed and aggregated in separate partition groups, and outputs events are generated for each of the groups. If you want a combined aggregate, you must create a second non-partitioned step to aggregate.

### Calculate the max streaming units for a job
All non-partitioned steps together can scale up to six streaming units (SUs) for a Stream Analytics job. In addition to this, you can add 6 SUs for each partition in a partitioned step.
You can see some **examples** in the table below.

| Query                                               | Max SUs for the job |
| --------------------------------------------------- | ------------------- |
| <ul><li>The query contains one step.</li><li>The step is not partitioned.</li></ul> | 6 |
| <ul><li>The input data stream is partitioned by 16.</li><li>The query contains one step.</li><li>The step is partitioned.</li></ul> | 96 (6 * 16 partitions) |
| <ul><li>The query contains two steps.</li><li>Neither of the steps is partitioned.</li></ul> | 6 |
| <ul><li>The input data stream is partitioned by 3.</li><li>The query contains two steps. The input step is partitioned and the second step is not.</li><li>The <strong>SELECT</strong> statement reads from the partitioned input.</li></ul> | 24 (18 for partitioned steps + 6 for non-partitioned steps |

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

Each of the **Input1** partitions will be processed separately by Stream Analytics. As a result, multiple records of the car count for the same tollbooth in the same Tumbling window will be created. If the input partition key can't be changed, this problem can be fixed by adding a non-partition step to aggregate values across partitions, as in the following example:

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





## Get help
For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=AzureStreamAnalytics).

## Next steps
* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-real-time-fraud-detection.md)
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
[azure.event.hubs.developer.guide]: http://msdn.microsoft.com/library/azure/dn789972.aspx

[stream.analytics.introduction]: stream-analytics-introduction.md
[stream.analytics.get.started]: stream-analytics-real-time-fraud-detection.md
[stream.analytics.query.language.reference]: http://go.microsoft.com/fwlink/?LinkID=513299
[stream.analytics.rest.api.reference]: http://go.microsoft.com/fwlink/?LinkId=517301

