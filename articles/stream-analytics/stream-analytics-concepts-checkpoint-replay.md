---
title: Checkpoint and replay recovery concepts in Azure Stream Analytics
description: This article describes checkpoint and replay job recovery concepts in Azure Stream Analytics.
author: ajetasin
ms.author: ajetasi
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 05/09/2022
ms.custom: seodec18, event-tier1-build-2022
---
# Checkpoint and replay concepts in Azure Stream Analytics jobs
This article describes the internal checkpoint and replay concepts in Azure Stream Analytics, and the impact those have on job recovery. Each time a Stream Analytics job runs, state information is maintained internally. That state information is saved in a checkpoint periodically. In some scenarios, the checkpoint information is used for job recovery if a job failure or upgrade occurs. In other circumstances, the checkpoint cannot be used for recovery, and a replay is necessary.

## Stateful query logic in temporal elements
One of the unique capability of Azure Stream Analytics job is to perform stateful processing, such as windowed aggregates, temporal joins, and temporal analytic functions. Each of these operators keeps state information when the job runs. The maximum window size for these query elements is seven days. 

The temporal window concept appears in several Stream Analytics query elements:
1. Windowed aggregates (GROUP BY of Tumbling, Hopping, and Sliding windows)

2. Temporal joins (JOIN with DATEDIFF)

3. Temporal analytic functions (ISFIRST, LAST, and LAG with LIMIT DURATION)


## Job recovery from node failure, including OS upgrade
Each time a Stream Analytics job runs, internally it is scaled out to do work across multiple worker nodes. Each worker node's state is checkpointed every few minutes, which helps the system recover if a failure occurs.

At times, a given worker node may fail, or an Operating System upgrade can occur for that worker node. To recover automatically, Stream Analytics acquires a new healthy node, and the prior worker node's state is restored from the latest available checkpoint. To resume the work, a small amount of replay is necessary to restore the state from the time when the checkpoint is taken. Usually, the restore gap is only a few minutes. When enough Streaming Units are selected for the job, the replay should be completed quickly. 

In a fully parallel query, the time it takes to catch up after a worker node failure is proportional to:

[the input event rate] x [the gap length] / [number of processing partitions]

If you ever observe significant processing delay because of node failure and OS upgrade, consider making the query fully parallel, and scale the job to allocate more Streaming Units. For more information, see [Scale an Azure Stream Analytics job to increase throughput](stream-analytics-scale-jobs.md).

Current Stream Analytics does not show a report when this kind of recovery process is taking place.

## Job recovery from a service upgrade 

Microsoft occasionally upgrades the binaries that run the Stream Analytics jobs in the Azure service. At these times, users’ running jobs are upgraded to a newer version and the job restarts automatically. 

Azure Stream Analytics uses checkpoints where possible to restore data from the last checkpointed state. In scenarios where internal checkpoints can't be used, the state of the streaming query is restored entirely using a replay technique. In order to allow Stream Analytics jobs to replay the exact same input from before, it’s important to set the retention policy for the source data to at least the window sizes in your query. Failing to do so may result in incorrect or partial results during service upgrade, since the source data may not be retained far enough back to include the full window size. 

In general, the amount of replay needed is proportional to the size of the window multiplied by the average event rate. As an example, for a job with an input rate of 1000 events per second, a window size greater than one hour is considered to have a large replay size. Up to one hour of data may need to be re-processed to initialize the state so it can produce full and correct results, which may cause delayed output (no output) for some extended period. Queries with no windows or other temporal operators, like `JOIN` or `LAG`, would have zero replay.

## Estimate replay catch-up time
To estimate the length of the delay due to a service upgrade, you can follow this technique:

1. Load the input Event Hubs with sufficient data to cover the largest window size in your query, at expected event rate. The events’ timestamp should be close to the wall clock time throughout that period of time, as if it’s a live input feed. For example, if you have a 3-day window in your query, send events to Event Hubs for three days, and continue to send events. 

2. Start the job using **Now** as the start time. 

3. Measure the time between the start time and when the first output is generated. The time is rough how much delay the job would incur during a service upgrade.

4. If the delay is too long, try to partition your job and increase number of SUs, so the load is spread out to more nodes. Alternatively, consider reducing the window sizes in your query, and perform further aggregation or other stateful processing on the output produced by the Stream Analytics job in the downstream sink (for example, using Azure SQL Database).

For general service stability concern during upgrade of mission critical jobs, consider running duplicate jobs in paired Azure regions. For more information, see [Guarantee Stream Analytics job reliability during service updates](stream-analytics-job-reliability.md).

## Job recovery from a user initiated stop and start
To edit the Query syntax on a streaming job, or to adjust inputs and outputs, the job needs to be stopped to make the changes and upgrade the job design. In such scenarios, when a user stops the streaming job, and starts it again, the recovery scenario is similar to service upgrade. 

Checkpoint data cannot be used for a user initiated job restart. To estimate the delay of output during such a restart, use the same procedure as described in the previous section, and apply similar mitigation if the delay is too long.

## Next steps
For more information on reliability and scalability, see these articles:
- [Tutorial: Set up alerts for Azure Stream Analytics jobs](stream-analytics-set-up-alerts.md)
- [Scale an Azure Stream Analytics job to increase throughput](stream-analytics-scale-jobs.md)
- [Guarantee Stream Analytics job reliability during service updates](stream-analytics-job-reliability.md)
