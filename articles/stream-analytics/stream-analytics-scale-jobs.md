---
title: Scaling up and out in Azure Stream Analytics jobs
description: This article describes how to scale a Stream Analytics job by partitioning input data, tuning the query, and setting job streaming units.
author: JSeb225
ms.author: jeanb
ms.reviewer: mamccrea
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 06/22/2017
---
# Scale an Azure Stream Analytics job to increase throughput
This article shows you how to tune a Stream Analytics query to increase throughput for Streaming Analytics jobs. You can use the following guide to scale your job to handle higher load and take advantage of more system resources (such as more bandwidth, more CPU resources, more memory).
As a prerequisite, you may need to read the following articles:
-	[Understand and adjust Streaming Units](stream-analytics-streaming-unit-consumption.md)
-	[Create parallelizable jobs](stream-analytics-parallelization.md)

## Case 1 – Your query is inherently fully parallelizable across input partitions
If your query is inherently fully parallelizable across input partitions, you can follow the following steps:
1.	Author your query to be embarrassingly parallel by using **PARTITION BY** keyword. See more details in the Embarrassingly parallel jobs section [on this page](stream-analytics-parallelization.md).
2.	Depending on output types used in your query, some output may either be not parallelizable, or need further configuration to be embarrassingly parallel. For example, PowerBI output is not parallelizable. Outputs are always merged before sending to the output sink. Blobs, Tables, ADLS, Service Bus, and Azure Function are automatically parallelized. SQL and SQL DW outputs have an option for parallelization. Event Hub needs to have the PartitionKey configuration set to match with the **PARTITION BY** field (usually PartitionId). For Event Hub, also pay extra attention to match the number of partitions for all inputs and all outputs to avoid cross-over between partitions. 
3.	Run your query with **6 SU** (which is the full capacity of a single computing node) to measure maximum achievable throughput, and if you are using **GROUP BY**, measure how many groups (cardinality) the job can handle. General symptoms of the job hitting system resource limits are the following.
    - SU % utilization metric is over 80%. This indicates memory usage is high. The factors contributing to the increase of this metric are described [here](stream-analytics-streaming-unit-consumption.md). 
    -	Output timestamp is falling behind with respect to wall clock time. Depending on your query logic, the output timestamp may have a logic offset from the wall clock time. However, they should progress at roughly the same rate. If the output timestamp is falling further and further behind, it’s an indicator that the system is overworking. It can be a result of downstream output sink throttling, or high CPU utilization. We don’t provide CPU utilization metric at this time, so it can be difficult to differentiate the two.
        - If the issue is due to sink throttling, you may need to increase the number of output partitions (and also input partitions to keep the job fully parallelizable), or increase the amount of resources of the sink (for example number of Request Units for CosmosDB).
    - In job diagram, there is a per partition backlog event metric for each input. If the backlog event metric keeps increasing, it’s also an indicator that the system resource is constrained (either because of output sink throttling, or high CPU).
4.	Once you have determined the limits of what a 6 SU job can reach, you can extrapolate linearly the processing capacity of the job as you add more SUs, assuming you don’t have any data skew that makes certain partition "hot."

> [!NOTE]
> Choose the right number of Streaming Units:
> Because Stream Analytics creates a processing node for each 6 SU added, it’s best to make the number of nodes a divisor of the number of input partitions, so the partitions can be evenly distributed across the nodes.
For example, you have measured your 6 SU job can achieve 4 MB/s processing rate, and your input partition count is 4. You can choose to run your job with 12 SU to achieve roughly 8 MB/s processing rate, or 24 SU to achieve 16 MB/s. You can then decide when to increase SU number for the job to what value, as a function of your input rate.


## Case 2 - If your query is not embarrassingly parallel.
If your query is not embarrassingly parallel, you can follow the following steps.
1.	Start with a query with no **PARTITION BY** first to avoid partitioning complexity, and run your query with 6 SU to measure maximum load as in [Case 1](#case-1--your-query-is-inherently-fully-parallelizable-across-input-partitions).
2.	If you can achieve your anticipated load in term of throughput, you are done. Alternatively, you may choose to measure the same job running at 3 SU and 1 SU, to find out the minimum number of SU that works for your scenario.
3.	If you can’t achieve the desired throughput, try to break your query into multiple steps if possible, if it doesn’t have multiple steps already, and allocate up to 6 SU for each step in the query. For example if you have 3 steps, allocate 18 SU in the "Scale" option.
4.	When running such a job, Stream Analytics puts each step on its own node with dedicated 6 SU resources. 
5.	If you still haven’t achieved your load target, you can attempt to use **PARTITION BY** starting from steps closer to the input. For **GROUP BY** operator that may not be naturally partitionable, you can use the local/global aggregate pattern to perform a partitioned **GROUP BY** followed by a non-partitioned **GROUP BY**. For example, if you want to count how many cars going through each toll booth every 3 minutes, and the volume of the data is beyond what can be handled by 6 SU.

Query:

 ```SQL
 WITH Step1 AS (
 SELECT COUNT(*) AS Count, TollBoothId, PartitionId
 FROM Input1 Partition By PartitionId
 GROUP BY TumblingWindow(minute, 3), TollBoothId, PartitionId
 )
 SELECT SUM(Count) AS Count, TollBoothId
 FROM Step1
 GROUP BY TumblingWindow(minute, 3), TollBoothId
 ```
In the query above, you are counting cars per toll booth per partition, and then adding the count from all partitions together.

Once partitioned, for each partition of the step, allocate up to 6 SU, each partition having 6 SU is the maximum, so each partition can be placed on its own processing node.

> [!Note]
> If your query cannot be partitioned, adding additional SU in a multi-steps query may not always improve throughput. One way to gain performance is to reduce volume on the initial steps using local/global aggregate pattern, as described above in step 5.

## Case 3 - You are running lots of independent queries in a job.
For certain ISV use cases, where it’s more cost-efficient to process data from multiple tenants in a single job, using separate inputs and outputs for each tenant, you may end up running quite a few (for example 20) independent queries in a single job. The assumption is each such subquery’s load is relatively small. 
In this case, you can follow the following steps.
1.	In this case, do not use **PARTITION BY** in the query
2.	Reduce the input partition count to the lowest possible value of 2 if you are using Event Hub.
3.	Run the query with 6 SU. With expected load for each subquery, add as many such subqueries as possible, until the job is hitting system resource limits. Refer to [Case 1](#case-1--your-query-is-inherently-fully-parallelizable-across-input-partitions) for the symptoms when this happens.
4.	Once you are hitting the subquery limit measured above, start adding the subquery to a new job. The number of jobs to run as a function of the number of independent queries should be fairly linear, assuming you don’t have any load skew. You can then forecast how many 6 SU jobs you need to run as a function of the number of tenants you would like to serve.
5.	When using reference data join with such queries, union the inputs together before joining with the same reference data. Then, split out the events if necessary. Otherwise, each reference data join keeps a copy of reference data in memory, likely blowing up the memory usage unnecessarily.

> [!Note] 
> How many tenants to put in each job?
> This query pattern often has a large number of subqueries, and results in very large and complex topology. The controller of the job may not be able to handle such a large topology. As a rule of thumb, stay under 40 tenants for 1 SU job, and 60 tenants for 3 SU and 6 SU jobs. When you are exceeding the capacity of the controller, the job will not start successfully.



## Get help
For further assistance, try our [Microsoft Q&A question page for Azure Stream Analytics](https://docs.microsoft.com/answers/topics/azure-stream-analytics.html).

## Next steps
* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-real-time-fraud-detection.md)
* [Azure Stream Analytics Query Language Reference](https://docs.microsoft.com/stream-analytics-query/stream-analytics-query-language-reference)
* [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)

<!--Image references-->

[img.stream.analytics.monitor.job]: ./media/stream-analytics-scale-jobs/StreamAnalytics.job.monitor-NewPortal.png
[img.stream.analytics.configure.scale]: ./media/stream-analytics-scale-jobs/StreamAnalytics.configure.scale.png
[img.stream.analytics.perfgraph]: ./media/stream-analytics-scale-jobs/perf.png
[img.stream.analytics.streaming.units.scale]: ./media/stream-analytics-scale-jobs/StreamAnalyticsStreamingUnitsExample.jpg
[img.stream.analytics.preview.portal.settings.scale]: ./media/stream-analytics-scale-jobs/StreamAnalyticsPreviewPortalJobSettings-NewPortal.png   

<!--Link references-->

[microsoft.support]: https://support.microsoft.com
[azure.event.hubs.developer.guide]: https://msdn.microsoft.com/library/azure/dn789972.aspx

[stream.analytics.introduction]: stream-analytics-introduction.md
[stream.analytics.get.started]: stream-analytics-real-time-fraud-detection.md
[stream.analytics.query.language.reference]: https://go.microsoft.com/fwlink/?LinkID=513299
[stream.analytics.rest.api.reference]: https://go.microsoft.com/fwlink/?LinkId=517301

