---
title: Optimizing Azure Stream Analytics jobs to use fewer streaming units | Microsoft Docs
description: Query best practices for scaling and performance.
keywords: streaming unit, query performance
services: stream-analytics
documentationcenter: ''
author: jeffstokes72
manager: jhubbard
editor: cgronlun

ms.assetid: 
ms.service: stream-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-services
ms.date: 03/31/2017
ms.author: jeffstok

---

# What are Azure Stream Analytics streaming units?

Azure Stream Analytics aggregates the performance 'weight' of running a job into **Streaming units (SUs)**. These represent the computing resources consumed to execute a job. SUs provide a way to describe the relative event processing capacity based on a blended measure of CPU, memory, and read and write rates. This lets you focus on the query logic and removes you from needing to know storage tier performance considerations, allocate memory for your job manually, and also approximate the CPU core-count needed to run your job in a timely manner.

## How many SUs are required for a job?

Choosing how many SUs are required for a particular job is depends on the on the partition configuration for the inputs and the query defined within the job. The **Scale** blade allows you to set the right amount of SUs required. It is a best practice to allocate more SUs than needed. The Stream Analytics processing engine optimizes for latency and throughput at the cost of allocating additional memory.

In general, it is the best practice to start with 6 SUs for queries not using **PARTITION BY**. Then determine the sweet-spot using a trial and error method by modifying the number of SUs after passing representative amounts of data and examining the SU %Utilization metric.

Also, Azure Stream Analytics keeps events in a window called the “reorder buffer” before starting any processing. Events are sorted within the reorder window by time and subsequent operations are performed on the temporally sorted events. Reordering events by time ensures that the operator has visibility into all of the events in the stipulated timeframe, which allows the operator to perform the requisite processing and produce an output. A side effect of this mechanism is that processing is delayed by the duration of the reorder window. The memory footprint of the job (which affects SU consumption) is a function of the size of this reorder window and number of events contained within it.

> ![NOTE]
>
> When the number of readers change during job upgrades, transient warnings are written to Audit logs. Stream Analytics jobs will automatically recover from these transient issues.

## Common high-memory causes for high SU usage for running jobs.

### High cardinality for GROUP BY

The cardinality of incoming events dictates memory usage for the job.

For example, in `SELECT count(*) from input group by clustered, tumblingwindow (minutes, 5)`, the number associated with **clustered** is the cardinality of the query.

In order to mitigate issues caused by high carnality, scale out the query by increasing partitions using **PARTITION BY**.

```
Select count(*) from input
Partition By clusterid
GROUP BY clustered tumblingwindow (minutes, 5)
```

The number of **clustered** is the cardinality of GROUP BY here.

Once the query is partitioned out, it is spread out over multiple nodes. As a result, the number of events coming into each node is reduced. This in turn reduces the size of the reorder buffer. Event Hub partitions should also be partitioned by partitionid.

### High unmatched event count for JOIN

The number of unmatched events in a JOIN impacts the memory utilization of the query. For example, take a query that is looking to find the ad impressions that generate clicks:

```
SELECT id from clicks INNER JOIN,
impressions on impressions.id = clicks.id AND DATEDIFF(hour, impressions, clicks) between 0 AND 10
```

Given this scenario, it is possible that many ads are shown and few clicks are generated. This would required the job to keep all the events within the time window. Memory consumed is proportional to the window size and event rate. 

To mitigate this, scale out the query by increasing partitions using the **PARTITION BY**. 

Once the query is partitioned it is spread out over multiple processing nodes. As a result, the number of events coming into each node is reduced, thereby reducing the size of the reorder buffer.

### Large number of out of order events 

A large number of out of order events within a large time window will cause the size of the "reorder buffer" to be larger. To mitigate this, scale the query by increasing partitions by using **PARTITION BY**. Once the query is partitioned it is spread out over multiple nodes. As a results the number of events coming into each node is reduced thereby reducing the size of the reorder buffer. 


## Get help
For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureStreamAnalytics).

## Next steps
* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-get-started.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics query language reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
* [Azure Stream Analytics Management REST API reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)
