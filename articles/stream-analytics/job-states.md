---
title: Azure Stream Analytics job states
description: This article describes different states of a Stream Analytics job
services: stream-analytics
author: sidram
ms.author: sidram
ms.reviewer: mamccrea
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 02/06/2019
---
# Azure Stream Analytics job states

A Stream Analytics job could be in one of four states at any given time. You can find the state of your job on your Stream Analytics job's Overview page in the Azure portal. 

| State | Description | Recommended actions |
| --- | --- | --- |
| **Running** | Your job is running on Azure reading events coming from the defined input sources, processing them and writing the results to the configured output sinks. | It is a best practice to track your job’s performance by monitoring [key metrics](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-set-up-alerts#scenarios-to-monitor). |
| **Stopped** | Your job is stopped and does not process events. | NA | 
| **Degraded** | Transient errors are likely impacting your job. Stream Analytics will immediately try to recover from such errors and return to a Running state (within few minutes). These errors could happen due to network issues, availability of other Azure resources, deserialization errors etc. Your job’s performance may be impacted when job is in degraded state.| You can look at the [diagnostic or activity logs](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-job-diagnostic-logs#debugging-using-activity-logs) to learn more about the cause of these transient errors. In cases such as deserialization errors, it is recommended to take corrective action to ensure events aren't malformed. If the job keeps reaching the resource utilization limit, try to increase the SU number or [parallelize your job](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-parallelization). In other cases where you cannot take any action, Stream Analytics will try to recover to a *Running* state.  |
| **Failed** | Your job encountered a critical error resulting in a failed state. Events aren't read and processed. Runtime errors are a common cause for jobs ending up in a failed state. | You can [configure alerts](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-set-up-alerts#set-up-alerts-in-the-azure-portal) so that you get notified when job goes to Failed state. <br> <br>You can debug using [activity and diagnostic logs](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-job-diagnostic-logs#debugging-using-activity-logs) to identify root cause and address the issue.|

## Next steps
* [Setup alerts for Azure Stream Analytics jobs](stream-analytics-set-up-alerts.md)
* [Metrics available in Stream Analytics](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-monitoring#metrics-available-for-stream-analytics)
* [Troubleshoot using activity and diagnostic logs](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-job-diagnostic-logs)
