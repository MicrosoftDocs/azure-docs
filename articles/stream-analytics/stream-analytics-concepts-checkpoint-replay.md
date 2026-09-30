---
title: Checkpoint and replay recovery concepts in Azure Stream Analytics
description: Understand checkpoint and replay recovery concepts in Azure Stream Analytics, including how jobs restore state after node failures, upgrades, and outages.
author: ajetasin
ms.author: ajetasi
ms.service: azure-stream-analytics
ms.topic: concept-article
ms.date: 08/25/2026
ai-usage: ai-assisted
---
# Checkpoint and replay concepts in Azure Stream Analytics jobs

Azure Stream Analytics maintains state information internally each time a job runs, and it periodically saves that state to a checkpoint. If a job fails or is upgraded, Stream Analytics can use the latest checkpoint to recover. When the job can't use the checkpoint, it performs a replay instead, reprocessing recent input events to rebuild its state.

This article explains how checkpoints and replays work in Azure Stream Analytics and how they affect the time it takes a job to recover.

## Stateful query logic in temporal elements
One of the unique capabilities of an Azure Stream Analytics job is to perform stateful processing, such as windowed aggregates, temporal joins, and temporal analytic functions. Each of these operators keeps state information when the job runs. The maximum window size for these query elements is seven days.

The temporal window concept appears in several Stream Analytics query elements:

- Windowed aggregates (GROUP BY of Tumbling, Hopping, and Sliding windows)
- Temporal joins (JOIN with DATEDIFF)
- Temporal analytic functions (ISFIRST, LAST, and LAG with LIMIT DURATION)

## Job recovery from node failure, including OS upgrade
Each time a Stream Analytics job runs, the service scales it out internally to do work across multiple worker nodes. The service checkpoints each worker node's state every few minutes, which helps it recover if a failure occurs.

At times, a given worker node might fail, or an operating system upgrade can occur for that worker node. To recover automatically, Stream Analytics acquires a new healthy node and restores the prior worker node's state from the latest available checkpoint. To resume the work, the job replays a small amount of data to restore the state from the last checkpoint. Usually, the restore gap is only a few minutes. When you select enough streaming units for the job, the replay completes quickly.

In a fully parallel query, the time it takes to catch up after a worker node failure is proportional to:

[the input event rate] x [the gap length] / [number of processing partitions]

If you ever observe significant processing delay because of node failure and OS upgrade, consider making the query fully parallel, and scale the job to allocate more streaming units. For more information, see [Scale an Azure Stream Analytics job to increase throughput](stream-analytics-scale-jobs.md).

Stream Analytics doesn't currently show a report when this kind of recovery process takes place.

## Job recovery from a service upgrade

Microsoft occasionally upgrades the binaries that run the Stream Analytics jobs in the Azure service. At these times, Microsoft upgrades running jobs to a newer version, and the job restarts automatically.

Azure Stream Analytics uses checkpoints where possible to restore data from the last checkpointed state. When Stream Analytics can't use internal checkpoints, a replay technique restores the entire state of the streaming query. To let Stream Analytics jobs replay the exact same input, set the retention policy for the source data to at least the window sizes in your query. Failing to do so might result in incorrect or partial results during a service upgrade, because Stream Analytics might not retain the source data far enough back to include the full window size.

In general, the amount of replay needed is proportional to the size of the window multiplied by the average event rate. For example, for a job with an input rate of 1,000 events per second, a window size greater than one hour has a large replay size. The service might need to reprocess up to one hour of data to initialize the state so that it can produce full and correct results, which might cause delayed output (no output) for some extended period. Queries with no windows or other temporal operators, like `JOIN` or `LAG`, have zero replay.

## Estimate replay catch-up time
To estimate the length of the delay due to a service upgrade, follow this technique:

- Load the input event hub with sufficient data to cover the largest window size in your query, at the expected event rate. The events' timestamps should be close to the wall clock time throughout that period, as if it's a live input feed. For example, if you have a three-day window in your query, send events to the event hub for three days, and continue to send events.
- Start the job by using **Now** as the start time.
- Measure the time between the start time and when the job generates its first output. This time is roughly how much delay the job incurs during a service upgrade.
- If the delay is too long, try to partition your job and increase the number of streaming units so that the load spreads across more nodes. Alternatively, consider reducing the window sizes in your query, and perform further aggregation or other stateful processing on the output that the Stream Analytics job produces in the downstream sink (for example, by using Azure SQL Database).

For general service stability concern during upgrade of mission critical jobs, consider running duplicate jobs in paired Azure regions. For more information, see [Guarantee Stream Analytics job reliability during service updates](stream-analytics-job-reliability.md).

## Job recovery from a user-initiated stop and start
To edit the query syntax on a streaming job, or to adjust inputs and outputs, you need to stop the job to make the changes and upgrade the job design. In such scenarios, when you stop the streaming job and start it again, the recovery scenario is similar to a service upgrade.

A user-initiated job restart can't use checkpoint data. To estimate the delay of output during such a restart, use the same procedure that the previous section describes, and apply similar mitigation if the delay is too long.

## Related content
For more information on reliability and scalability, see these articles:

- [Tutorial: Set up alerts for Azure Stream Analytics jobs](stream-analytics-set-up-alerts.md)
- [Scale an Azure Stream Analytics job to increase throughput](stream-analytics-scale-jobs.md)
- [Guarantee Stream Analytics job reliability during service updates](stream-analytics-job-reliability.md)
