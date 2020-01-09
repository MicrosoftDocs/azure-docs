---
title: Use repartitioning to optimize Azure Stream Analytics jobs
description: This article describes how to use repartitioning to optimize Azure Stream Analytics jobs that cannot be parallelized.
ms.service: stream-analytics
author: mamccrea
ms.author: mamccrea
ms.date: 09/19/2019
ms.topic: conceptual
ms.custom: mvc
---

# Use repartitioning to optimize processing with Azure Stream Analytics

This article shows you how to use repartitioning to scale your Azure Stream Analytics query for scenarios that can't be fully [parallelized](stream-analytics-scale-jobs.md).

You might not be able to use [parallelization](stream-analytics-parallelization.md) if:

* You don't control the partition key for your input stream.
* Your source "sprays" input across multiple partitions that later need to be merged.

Repartitioning, or reshuffling, is required when you process data on a stream that's not sharded according to a natural input scheme, such as **PartitionId** for Event Hubs. When you repartition, each shard can be processed independently, which allows you to linearly scale out your streaming pipeline.

## How to repartition

To repartition, use the keyword **INTO** after a **PARTITION BY** statement in your query. The following example partitions the data by **DeviceID** into a partition count of 10. Hashing of **DeviceID** is used to determine which partition shall accept which substream. The data is flushed independently for each partitioned stream, assuming the output supports partitioned writes, and has 10 partitions.

```sql
SELECT * 
INTO output
FROM input
PARTITION BY DeviceID 
INTO 10
```

The following example query joins two streams of repartitioned data. When joining two streams of repartitioned data, the streams must have the same partition key and count. The outcome is a stream that has the same partition scheme.

```sql
WITH step1 AS (SELECT * FROM input1 PARTITION BY DeviceID INTO 10),
step2 AS (SELECT * FROM input2 PARTITION BY DeviceID INTO 10)

SELECT * INTO output FROM step1 PARTITION BY DeviceID UNION step2 PARTITION BY DeviceID
```

The output scheme should match the stream scheme key and count so that each substream can be flushed independently. The stream could also be merged and repartitioned again by a different scheme before flushing, but you should avoid that method because it adds to the general latency of the processing and increases resource utilization.

## Streaming Units for repartitions

Experiment and observe the resource usage of your job to determine the exact number of partitions you need. The number of [streaming units (SU)](stream-analytics-streaming-unit-consumption.md) must be adjusted according to the physical resources needed for each partition. In general, six SUs are needed for each partition. If there are insufficient resources assigned to the job, the system will only apply the repartition if it benefits the job.

## Repartitions for SQL output

When your job uses SQL database for output, use explicit repartitioning to match the optimal partition count to maximize throughput. Since SQL works best with eight writers, repartitioning the flow to eight before flushing, or somewhere further upstream, may benefit job performance. 

When there are more than 8 input partitions, inheriting the input partitioning scheme might not be an appropriate choice. Consider using [INTO](/stream-analytics-query/into-azure-stream-analytics#into-shard-count) in your query to explicitly specify the number of output writers. 

The following example reads from the input, regardless of it being naturally partitioned, and repartitions the stream tenfold according to the DeviceID dimension and flushes the data to output. 

```sql
SELECT * INTO [output] FROM [input] PARTITION BY DeviceID INTO 10
```

For more information, see [Azure Stream Analytics output to Azure SQL Database](stream-analytics-sql-output-perf.md).


## Next steps

* [Get started with Azure Stream Analytics](stream-analytics-introduction.md)
* [Leverage query parallelization in Azure Stream Analytics](stream-analytics-parallelization.md)
