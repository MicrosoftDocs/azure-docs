---
title: Azure Stream Analytics job states
description: This article describes the four different states of a Stream Analytics job; running, stopped, degraded, and failed.
author: xujxu
ms.author: xujiang1
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 12/21/2022
---
# Azure Stream Analytics job states

A Stream Analytics job could be in one of four states at any given time: running, stopped, degraded, or failed. You can find the state of your job on your Stream Analytics job's Overview page in the Azure portal. 

:::image type="content" source="./media/job-states/job-state.png" alt-text="Screenshot that shows job state."  lightbox="./media/job-states/job-state.png":::

| State | Description | Recommended actions |
| --- | --- | --- |
| **Running** | Your job is running on Azure reading events coming from the defined input sources, processing them and writing the results to the configured output sinks. | It's a best practice to track your job’s performance by monitoring [key metrics](./stream-analytics-job-metrics.md#scenarios-to-monitor). |
| **Stopped** | Your job is stopped and doesn't process events. | NA | 
| **Degraded** | There might be intermittent issues with your input and output connections. These errors are called transient errors that might make your job enter a Degraded state. Stream Analytics will immediately try to recover from such errors and return to a Running state (within few minutes). These errors could happen due to network issues, availability of other Azure resources, deserialization errors etc. Your job’s performance may be impacted when job is in degraded state.| You can look at the [diagnostic or activity logs](./stream-analytics-job-diagnostic-logs.md#debugging-using-activity-logs) to learn more about the cause of these transient errors. In cases such as deserialization errors, it's recommended to take corrective action to ensure events aren't malformed. If the job keeps reaching the resource utilization limit, try to increase the SU number or [parallelize your job](./stream-analytics-parallelization.md). In other cases where you can't take any action, Stream Analytics will try to recover to a *Running* state. <br> You can use [watermark delay](./stream-analytics-job-metrics.md#scenarios-to-monitor) metric to understand if these transient errors are impacting your job's performance.|
| **Failed** | Your job encountered a critical error resulting in a failed state. Events aren't read and processed. Runtime errors are a common cause for jobs ending up in a failed state. | You can [configure alerts](./stream-analytics-set-up-alerts.md#set-up-alerts-in-the-azure-portal) so that you get notified when job goes to Failed state. <br> <br>You can debug using [activity and resource logs](./stream-analytics-job-diagnostic-logs.md#debugging-using-activity-logs) to identify root cause and address the issue.|

## Next steps
* [Azure Stream Analytics job metrics](./stream-analytics-job-metrics.md)
* [Azure Stream Analytics metrics dimensions](./stream-analytics-job-metrics-dimensions.md)
* [Troubleshoot using activity and resource logs](./stream-analytics-job-diagnostic-logs.md)
