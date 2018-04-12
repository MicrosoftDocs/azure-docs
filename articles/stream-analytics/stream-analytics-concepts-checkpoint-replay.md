---
title: Checkpoint and replay concepts in Azure Stream Analytics
description: This article describes best practices to optimize a Stream Analytics query for memory, output latency, and recovery speed.
services: stream-analytics
author: zhongc
ms.author: zhongc
manager: kfile
ms.reviewer: jasonh
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 04/11/2018
---
# Considerations when creating Stream Analytics jobs

This article describes best practices to optimize a Stream Analytics query for memory consumption, latency to generate output, and speed of recovery during failure and upgrades.

## Best practices for windowing functions
The temporal window concept appears in several Stream Analytics query elements. The maximum window size for these query elements is seven days.

1.	Windowed aggregates (GROUP BY of Tumbling, Hopping, and Sliding windows)

2.	Temporal joins (JOIN with DATEDIFF)

3.	Temporal analytic functions (ISFIRST, LAST, and LAG with LIMIT DURATION)

These query elements are the core set of stateful operators provided by Stream Analytics. Stream Analytics manages their states on user’s behalf, by managing memory consumption, checkpointing for resiliency, and state recovery during service upgrades. Even though Stream Analytics fully manages the states, there are a number of best practice recommendations that users should follow. 

## Memory consumption
Consider the following factors that influence memory consumed by Stream Analytics jobs:

1. The memory consumed for a windowed aggregate is not always directly proportional to the window size. Instead, the memory consumed is proportional to the cardinality of the data, or the number of groups in each time window.

2. The memory consumed by joins is proportional to the DateDiff time range multiplied by average event rate.

3. The memory consumed by analytic functions is not proportional to the window size, but rather partition count in each time window.

Monitor the **SU % Utilization** metric of the streaming job, and avoid that metric exceeding 80% utilization. Set an alert at 80% threshold for production jobs. For more information, see [Tutorial: Set up alerts for Azure Stream Analytics jobs](stream-analytics-set-up-alerts.md).

## Latency to generate output
Once a Stream Analytics job is started, and input events are read in, output may not be produced immediately. These factors impact the timeliness of the output that is generated:

1. For tumbling or hopping window aggregates, results are generated at the end of the window timeframe. For a sliding window, the results are generated when an event enters or exits the sliding window. If you are planning to use large window size (> 1 hour), it’s best to choose hopping or sliding window so that you can see the output more frequently.

2. For joins, matches are generated as soon as when both sides of the matched events arrive. Data that lacks a match (LEFT OUTER JOIN) is generated at the end of the DATEDIFF window with respect to each event on the left side.

3. For analytic functions, the output is generated for every event, there is no delay.

During normal operation of the job, if you find the job’s output is falling behind (longer and longer latency), you can pinpoint the root causes by examining these factors:
- Whether the downstream sink is throttled
- Whether the upstream source is throttled
- Whether the processing logic in the query is compute-intensive

To see those details, in the Azure portal, select the streaming job, and select the **Job diagram**. For each input, there is a per partition backlog event metric. If the backlog event metric keeps increasing, it’s an indicator that the system resources are constrained. Potentially that is due to of output sink throttling, or high CPU.

## Job recovery from node failure, including OS upgrade
Each time a Stream Analytics job runs, internally it is scaled out to do work across multiple worker nodes. Each worker node's state is checkpointed every few minutes, which helps the system recover if a failure occurs.

At times, a given worker node may fail, or an Operating System upgrade can occur for that worker node. To recover automatically, Stream Analytics acquires a new healthy node, and the prior worker node's state is restored from the latest available checkpoint. To resume the work, a small amount of replay is necessary to restore the state from the time when the checkpoint is taken. Usually, the restore gap is only a few minutes. When enough Streaming Units are selected for the job, the replay should be completed quickly. 

Stream Analytics uses a separate worker node for every six streaming units that are configured in the job. In a fully parallel query, the number of processing partitions is the number of configured Streaming Units divided by six. 

The time it takes to catch up after a worker node failure is proportional to:
/[the input event rate/] x /[the gap length/] / /[number of processing partitions/]. 

If you ever observe significant processing delay because of node failure and OS upgrade, consider making the query fully parallel, and scale the job to allocate more Streaming Units. For more information, see [Scale an Azure Stream Analytics job to increase throughput](stream-analytics-scale-jobs.md).

Current Stream Analytics does not show a report when this kind of recovery process is taking place.

## Job recovery from a service upgrade 
Microsoft occasionally upgrades the binaries that run the Stream Analytics jobs in the Azure service. At these times, users’ running jobs are upgraded to newer version and the job restarts automatically. 

Currently, the recovery checkpoint format is not preserved between upgrades. As a result, the state of the streaming query must be restored entirely using replay technique. In order to allow Stream Analytics jobs to replay the exact same input from before, it’s important to set the retention policy for the source data to at least the window sizes in your query. Failing to do so may result in incorrect or partial results during service upgrade, since the source data may not be retained far enough back to include the full window size.

In general, the amount of replay needed is proportional to the size of the window multiplied by the average event rate. As an example, for a job with an input rate of 1000 events per second, a window size greater than one hour is considered to have a large replay size. For queries with large replay size, you may observe delayed output (no output) for some extended period. 

## Estimate replay catch-up time
To estimate the length of the delay due to a service upgrade, you can follow this technique:

1. Load the input Event Hub with sufficient data to cover the largest window size in your query, at expected event rate. The events’ timestamp should be close to the wall clock time throughout that period of time, as if it’s a live input feed. For example, if you have a 3-day window in your query, send events to Event Hub for three days, and continue to send events. 

2. Start the job using **Now** as the start time. 

3. Measure the time between the start time and when the first output is generated. The time is rough how much delay the job would incur during a service upgrade.

4. If the delay is too long, try to partition your job and increase number of SUs, so the load is spread out to more nodes. Alternatively, consider reducing the window sizes in your query, and perform further aggregation or other stateful processing on the output produced by the Stream Analytics job in the downstream sink (for example, using Azure SQL database).

For general service stability concern during upgrade of mission critical jobs, consider running duplicate jobs in paired Azure regions. For more information, see [Guarantee Stream Analytics job reliability during service updates](stream-analytics-job-reliability.md).

## Job recovery from a user initiated stop and start
To edit the Query syntax on a streaming job, or to adjust inputs and outputs, the job needs to be stopped to make the changes and upgrade the job design. In such scenarios, when a user stops the streaming job, and starts it again, the recovery scenario is similar to service upgrade. 

Checkpoint data cannot be used for a user initiated job restart. To estimate the delay of output during such a restart, use the same procedure as described in the previous section, and apply similar mitigation if the delay is too long.

## Next steps
For more information on reliability and scalability, see these articles:
- [Tutorial: Set up alerts for Azure Stream Analytics jobs](stream-analytics-set-up-alerts.md)
- [Scale an Azure Stream Analytics job to increase throughput](stream-analytics-scale-jobs.md)
- [Guarantee Stream Analytics job reliability during service updates](stream-analytics-job-reliability.md)