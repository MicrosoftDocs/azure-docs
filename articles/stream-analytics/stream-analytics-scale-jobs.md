---
title: Scale up and out in Azure Stream Analytics jobs
description: Learn how to scale an Azure Stream Analytics job by partitioning input data, tuning the query, and setting streaming units (SUs).
ms.service: azure-stream-analytics
author: ahartoon
ms.author: anboisve
ms.topic: concept-article
ms.date: 06/01/2026
ai-usage: ai-assisted
---
# Scale an Azure Stream Analytics job to increase throughput

This article explains how to tune an Azure Stream Analytics query to increase throughput. Use these scaling patterns to handle higher load by using more bandwidth, CPU, and memory resources.

Azure Stream Analytics measures compute capacity in *streaming units (SUs)*. Each SU V2 represents the full capacity of a single compute node. An *embarrassingly parallel* query is one where each input partition can be processed independently, with no data shared across partitions.

## Prerequisites

Before you begin, review these articles:

- [Understand and adjust streaming units](stream-analytics-streaming-unit-consumption.md)
- [Create parallelizable jobs](stream-analytics-parallelization.md)

## Scale a fully parallelizable query

If your query is embarrassingly parallel across input partitions, follow these steps:

1. Author your query to use the **PARTITION BY** keyword. For more information, see [Use query parallelization in Azure Stream Analytics](stream-analytics-parallelization.md).

1. Depending on output types used in your query, some output can be either not parallelizable, or need further configuration to be embarrassingly parallel. For example, configure your outputs for parallelization. Not all output types support parallel writes:

   | Output type | Parallelization support |
   |---|---|
   | Azure Blob Storage, Azure Table Storage, Azure Data Lake Storage, Azure Service Bus, Azure Functions | Automatic |
   | Azure SQL Database, Azure Synapse Analytics | Optional. Requires configuration |
   | Azure Event Hubs | Requires `PartitionKey` set to match the **PARTITION BY** field (usually `PartitionId`). Match input and output partition counts to avoid cross-over. |
   | Power BI | Not parallelizable. Outputs are always merged before sending to the sink |

1. Run your query with **1 SU V2** (which is the full capacity of a single computing node) to measure maximum achievable throughput. If you use **GROUP BY**, measure how many groups (cardinality) the job can handle.

1. Check for system resource limits. The following symptoms indicate your Azure Stream Analytics job is hitting resource limits:

   | Symptom | Likely cause | Action |
   |---|---|---|
   | SU % utilization metric exceeds 80% | High memory usage. See [Understand and adjust streaming units](stream-analytics-streaming-unit-consumption.md). | Add more SU V2s. |
   | Output timestamp falls behind wall clock time | Depending on your query logic, the output timestamp can have a logic offset from the wall clock time. However, they should progress at roughly the same rate. If the output timestamp is falling further and further behind, it’s an indicator that the system is overworking. It can be a result of downstream output sink throttling, or high CPU utilization. Stream Analytics doesn't provide CPU utilization metric at this time, so it can be difficult to differentiate the two. | If the issue is due to sink throttling, increase output partitions (and input partitions to maintain parallelism), or increase sink resources (for example, Request Units for Azure Cosmos DB). |
   | Per-partition backlog event metric keeps increasing (visible in job diagram) | Output sink throttling or high CPU | Same as above. |

1. Extrapolate capacity linearly. After you determine what 1 SU V2 can handle, add more SUs proportionally, assuming no data skew across partitions.

> [!NOTE]
> **Choose the right number of SU V2s:** Azure Stream Analytics creates one processing node for each SU V2. Make the number of SU V2s a divisor of the input partition count so partitions are evenly distributed.
>
> **Example:** A 1 SU V2 job processes 4 MB/s with 4 input partitions. Use 2 SU V2s for ~8 MB/s, or 4 SU V2s for ~16 MB/s. Choose the SU V2 count based on your target input rate.


## Scale a nonparallel query

If your query isn't embarrassingly parallel, follow these steps:

1. Start without **PARTITION BY** to avoid complexity. Run the query with 1 SU V2 to measure maximum throughput. Check for the same [resource limit symptoms](#scale-a-fully-parallelizable-query) described in the previous section (SU utilization over 80%, output timestamp lag, increasing backlog).

1. If you achieve your target throughput, you're done. Optionally, test with 2/3 SU V2 and 1/3 SU V2 to find the minimum SU V2 count for your scenario.

1. If you can't achieve the desired throughput, break the query into multiple steps. Allocate up to 1 SU V2 for each step. For example, a three-step query needs 3 SU V2s. Azure Stream Analytics places each step on its own dedicated node.

1. If you still haven't reached your throughput target, add **PARTITION BY** to steps closer to the input. For **GROUP BY** operations that aren't naturally partitionable, use the local/global aggregate pattern: perform a partitioned **GROUP BY** first, then a nonpartitioned **GROUP BY**. For example, to count cars passing through each toll booth every 3 minutes when the volume exceeds what 1 SU V2 can handle:

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
    This query counts cars per toll booth per partition in Step1, then aggregates the partitioned counts in the final step.
    
    After you partition the query, allocate 1 SU V2 for each partition of each step so each partition runs on its own processing node.
    
    > [!NOTE]
    > If your query can't be partitioned, adding more SU V2s in a multi-step query might not improve throughput. To gain performance, reduce volume in the initial steps by using the local/global aggregate pattern shown in step 4.

## Scale multiple independent queries in a single job

For multitenant Independent Software Vendor (ISV) scenarios where you process data from multiple tenants in a single Azure Stream Analytics job (with separate inputs and outputs per tenant), each subquery's load is typically small. Follow these steps:

1. Don't use **PARTITION BY** in the query.

1. If you use Azure Event Hubs, reduce the input partition count to the minimum value of 2.

1. Run the query with 1 SU V2. Add subqueries until the job hits resource limits. The symptoms are the same as for a [fully parallelizable query](#scale-a-fully-parallelizable-query): SU utilization over 80%, output timestamp lag, or increasing backlog.

1. After you reach the subquery limit, add new subqueries to a separate job. The number of jobs scales linearly with the number of independent queries (assuming no load skew). You can then forecast how many SU V2 jobs you need to run as a function of the number of tenants you would like to serve.

1. For reference data joins, union all inputs before joining with the reference data, then split the events afterward. Otherwise, each reference data join keeps a separate copy of reference data in memory, which can cause unnecessary memory usage.

> [!NOTE]
> **Maximum tenants per job:** Stay under 40 tenants for a 1/3 SU V2 job, and 60 tenants for 2/3 and 1 SU V2 jobs. Large numbers of subqueries create complex topologies that the job controller might not handle, which prevents the job from starting.

## Get help

For further assistance, try the [Microsoft Q&A question page for Azure Stream Analytics](/answers/tags/179/azure-stream-analytics).

## Related content

- [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
- [Get started using Azure Stream Analytics](stream-analytics-real-time-fraud-detection.md)
- [Azure Stream Analytics Query Language Reference](/stream-analytics-query/stream-analytics-query-language-reference)
- [Azure Stream Analytics Management REST API Reference](/rest/api/streamanalytics/)
