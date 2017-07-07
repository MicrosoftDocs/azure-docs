---
title: 'Azure Stream Analytics: Optimize your job to use Streaming Units efficiently | Microsoft Docs'
description: Query best practices for scaling and performance in Azure Stream Analytics.
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
ms.date: 04/20/2017
ms.author: jeffstok

---

# Optimize your job to use Streaming Units efficiently

Azure Stream Analytics aggregates the performance "weight" of running a job into Streaming Units (SUs). SUs represent the computing resources that are consumed to execute a job. SUs provide a way to describe the relative event processing capacity based on a blended measure of CPU, memory, and read and write rates. This capacity lets you focus on the query logic and removes you from needing to know storage tier performance considerations, allocate memory for your job manually, and approximate the CPU core-count needed to run your job in a timely manner.

## How many SUs are required for a job?

Choosing the number of required SUs for a particular job depends on the partition configuration for the inputs and the query that's defined within the job. The **Scale** blade allows you to set the right number of SUs. It is a best practice to allocate more SUs than needed. The Stream Analytics processing engine optimizes for latency and throughput at the cost of allocating additional memory.

In general, the best practice is to start with 6 SUs for queries that don't use *PARTITION BY*. Then determine the sweet spot by using a trial and error method in which you modify the number of SUs after you pass representative amounts of data and examine the SU %Utilization metric.

Azure Stream Analytics keeps events in a window called the “reorder buffer” before it starts any processing. Events are sorted within the reorder window by time, and subsequent operations are performed on the temporally sorted events. Reordering events by time ensures that the operator has visibility into all the events in the stipulated timeframe. It also lets the operator perform the requisite processing and produce an output. A side effect of this mechanism is that processing is delayed by the duration of the reorder window. The memory footprint of the job (which affects SU consumption) is a function of the size of this reorder window and the number of events contained within it.

> [!NOTE]
> When the number of readers changes during job upgrades, transient warnings are written to audit logs. Stream Analytics jobs automatically recover from these transient issues.

## Common high-memory causes for high SU usage for running jobs

### High cardinality for GROUP BY

The cardinality of incoming events dictates memory usage for the job.

For example, in `SELECT count(*) from input group by clustered, tumblingwindow (minutes, 5)`, the number associated with **clustered** is the cardinality of the query.

To mitigate issues that are caused by high cardinality, scale out the query by increasing partitions using **PARTITION BY**.

```
Select count(*) from input
Partition By clusterid
GROUP BY clustered tumblingwindow (minutes, 5)
```

The number of *clustered* is the cardinality of GROUP BY here.

After the query is partitioned, it is spread out over multiple nodes. As a result, the number of events coming into each node is reduced, which in turn reduces the size of the reorder buffer. You should also partition event hub partitions by partitionid.

### High unmatched event count for JOIN

The number of unmatched events in a JOIN affects the memory utilization of the query. For example, take a query that is looking to find the number of ad impressions that generates clicks:

```
SELECT id from clicks INNER JOIN,
impressions on impressions.id = clicks.id AND DATEDIFF(hour, impressions, clicks) between 0 AND 10
```

In this scenario, it is possible that many ads are shown and few clicks are generated. Such a result would require the job to keep all the events within the time window. The amount of memory consumed is proportional to the window size and event rate. 

To mitigate this situation, scale out the query by increasing partitions by using PARTITION BY. 

After the query is partitioned, it is spread out over multiple processing nodes. As a result, the number of events coming into each node is reduced, which in turn reduces the size of the reorder buffer.

### Large number of out of order events 

A large number of out of order events within a large time window causes the size of the "reorder buffer" to be larger. To mitigate this situation, scale the query by increasing partitions by using PARTITION BY. After the query is partitioned, it is spread out over multiple nodes. As a result, the number of events coming into each node is reduced, which in turn reduces the size of the reorder buffer. 


## Get help
For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/home?forum=AzureStreamAnalytics).

## Next steps
* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-get-started.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics query language reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
* [Azure Stream Analytics Management REST API reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)
