---
title: 'Azure Stream Analytics: Understand and adjust Streaming Units | Microsoft Docs'
description: Understand what factors impact performance in Azure Stream Analytics.
keywords: streaming unit, query performance
services: stream-analytics
documentationcenter: ''
author: JSeb225
manager: jhubbard
editor: cgronlun

ms.assetid: 
ms.service: stream-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-services
ms.date: 04/20/2017
ms.author: jeanb

---

# Understand and adjust Streaming Units

Azure Stream Analytics aggregates the performance "weight" of running a job into Streaming Units (SUs). SUs represent the computing resources that are consumed to execute a job. SUs provide a way to describe the relative event processing capacity based on a blended measure of CPU, memory, and read and write rates. This capacity lets you focus on the query logic and removes you from needing to know storage tier performance considerations, allocate memory for your job manually, and approximate the CPU core-count needed to run your job in a timely manner.

In order to achieve low latency streaming processing, Azure Stream Analytics jobs perform all processing in memory. When running out of memory, the streaming job fails. As a result, for a production job, it’s important to monitor a streaming job’s resource usage, and make sure there is enough resource allocated in order to keep the jobs running 24/7.

The metric is a percentage number ranging from 0% to 100%. For a streaming job with minimal footprint, the SU % Utilization metric is usually between 10% to 20%. It’s best to keep the metric below 80% to account for occasional spikes.  You can set an alert on the metric (see [here to set up metric alerts](https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/insights-alerts-portal)).



## Configure Stream Analytics Streaming Units (SUs)
1. Sign in to [Azure portal](http://portal.azure.com/)
2. In the list of resources, find the Stream Analytics job that you want to scale and then open it. 
3. In the job page, under Configure, click **Scale**. 

    ![Azure portal Stream Analytics job configuration][img.stream.analytics.preview.portal.settings.scale]
    
4. Use the slider to set the SUs for the job. Notice that you are limited to specific SU settings. 


## Monitor job performance
Using the Azure portal, you can track the throughput of a job:

![Azure Stream Analytics monitor jobs][img.stream.analytics.monitor.job]

Calculate the expected throughput of the workload. If the throughput is less than expected, tune the input partition, tune the query, and add SUs to your job.


## How many SUs are required for a job?

Choosing the number of required SUs for a particular job depends on the partition configuration for the inputs and the query that's defined within the job. The **Scale** page allows you to set the right number of SUs. It is a best practice to allocate more SUs than needed. The Stream Analytics processing engine optimizes for latency and throughput at the cost of allocating additional memory.

In general, the best practice is to start with 6 SUs for queries that don't use **PARTITION BY**. Then determine the sweet spot by using a trial and error method in which you modify the number of SUs after you pass representative amounts of data and examine the SU% Utilization metric.

For more information about choosing the right number of SUs, see this page: [Scale Azure Stream Analytics jobs to increase throughput](stream-analytics-scale-jobs.md)

> [!Note]
> Choosing how many SUs are required for a particular job depends on the partition configuration for the inputs and on the query defined for the job. You can select up to your quota in SUs for a job. By default, each Azure subscription has a quota of up to 200 SUs for all the analytics jobs in a specific region. To increase SUs for your subscriptions beyond this quota, contact [Microsoft Support](http://support.microsoft.com). Valid values for SUs per job are 1, 3, 6, and up in increments of 6.
> Note that using 1 SU is not recommended for production jobs. We usually advice to only use 1-SU-jobs for prototyping and testing jobs.



## Factors increasing SU% utilization 
### Stateful query logic 
One of the unique capability of Azure Stream Analytics job is to perform stateful processing, such as windowed aggregates, temporal joins, and temporal analytic functions. Each of these operators keeps some states. 
#### Windowed aggregates
The state size of a windowed aggregate is proportional to the number of groups (cardinality) in the group by operator. 
For example, in the following query, the number associated with clusterid is the cardinality of the query. 

    SELECT count(*)
    FROM input 
    GROUP BY  clusterid, tumblingwindow (minutes, 5)


In order to ameliorate issues caused by high cardinality in the previous query, you can send events to Event Hub partitioned by ''clusterid'', and scale out the query by allowing the system to process each input partition separately using **PARTITION BY** as shown in the example below:


    SELECT count(*) 
    FROM PARTITION BY PartitionId
    GROUP BY PartitionId, clusterid, tumblingwindow (minutes, 5)

Once the query is partitioned out, it is spread out over multiple nodes. As a result, the number of clusterid coming into each node is reduced thereby reducing the cardinality of the group by operator. 

Event Hub partitions should be partitioned by the grouping key to avoid the need for a reduce step. Additional details are covered [here](https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-overview). 
#### Temporal join
The state size of a temporal join is proportional to the number of events in the temporal wiggle room of the join, which is event input rate multiply by the wiggle room size. 

The number of unmatched events in the join affect the memory utilization for the query. The following query is looking to find the ad impressions that generate clicks:

    SELECT id
    FROM clicks 
    INNER JOIN, impressions ON impressions.id = clicks.id AND DATEDIFF(hour, impressions, clicks) between 0 AND 10.

In this example, it is possible that lots of ads are shown and few people click on it and it is required to keep all the events in the time window. Memory consumed is proportional to the window size and event rate. 

To remediate this, send events to Event Hub partitioned by the join keys (id in this case), and scale out the query by allowing the system to process each input partition separately using  **PARTITION BY** as shown:

    SELECT id
    FROM clicks PARTITION BY PartitionId
    INNER JOIN impressions PARTITION BY PartitionId 
    ON impression.PartitionId = clocks.PartitionId AND impressions.id = clicks.id AND DATEDIFF(hour, impressions, clicks) between 0 AND 10 
</code>

Once the query is partitioned out, it is spread out over multiple nodes. As a result the number of events coming into each node is reduced thereby reducing the size of the state kept in the join window. 
#### Temporal analytic function
The state size of a temporal analytic function is proportional to the event rate multiply by the duration. 
The remediation is similar to temporal join. You can scale out the query using **PARTITION BY**. 

### Out of order buffer 
User can configure the out of order buffer size in the Event Ordering configuration pane. The buffer is used to hold inputs for the duration of the window, and reorder them. The size of the buffer is proportional to the event input rate multiply by the out of order window size. The default window size is 0. 

To remediate this, scale out query using **PARTITION BY**. Once the query is partitioned out, it is spread out over multiple nodes. As a results the number of events coming into each node is reduced thereby reducing the number of events in each reorder buffer. 

### Input partition count 
Each input partition of a job input has a buffer. The larger number of input partitions, the more resource the job consumes. For each SU, Azure Stream Analytics can process roughly 1 MB/s of input, so you may want to match ASA SU number with the number of partition of your Event Hub. Typically, 1SU job is sufficient for an Event Hub with 2 partitions (which is the minimum for Event Hub). If the Event Hub has more partitions, your ASA job consumes more resources, but not necessarily uses the extra throughput provided by Event Hub. For a 6SU job, you may need 4 or 8 partitions from the Event Hub. Using an Event Hub with 16 partitions or larger in an 1SU job often contributes to excessive resource usage, and should be avoided. 

### Reference data 
Reference data in ASA are loaded into memory for fast lookup. With the current implementation, each join operation with reference data keeps a copy of the reference data in memory, even if you join with the same reference data multiple times. For queries with **PARTITION BY**, each partition has a copy of the reference data, so the partitions are fully decoupled. With the multiplier effect, memory usage can quickly get very high if you join with reference data multiple times with multiple partitions.  

#### Use of UDF functions
When you add a UDF function, Azure Stream Analytics loads the JavaScript runtime into memory. This will affect the SU%.


## Get help
For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureStreamAnalytics).

## Next steps
* [Create parallelizable queries in Azure Stream Analytics](stream-analytics-parallelization.md)
* [Scale Azure Stream Analytics jobs to increase throughput](stream-analytics-scale-jobs.md)

<!--Image references-->

[img.stream.analytics.monitor.job]: ./media/stream-analytics-scale-jobs/StreamAnalytics.job.monitor-NewPortal.png
[img.stream.analytics.configure.scale]: ./media/stream-analytics-scale-jobs/StreamAnalytics.configure.scale.png
[img.stream.analytics.perfgraph]: ./media/stream-analytics-scale-jobs/perf.png
[img.stream.analytics.streaming.units.scale]: ./media/stream-analytics-scale-jobs/StreamAnalyticsStreamingUnitsExample.jpg
[img.stream.analytics.preview.portal.settings.scale]: ./media/stream-analytics-scale-jobs/StreamAnalyticsPreviewPortalJobSettings-NewPortal.png   
