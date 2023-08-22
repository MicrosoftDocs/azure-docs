---
title: include file
description: include file
services: event-hubs
author: spelluru
ms.service: stream-analytics
ms.topic: include
ms.date: 07/10/2023
ms.author: spelluru
ms.custom: "include file"

---

|Metric|Condition|Time aggregation|Threshold|Corrective actions|
|-|-|-|-|-|
|**SU (Memory) % Utilization**|Greater than|Average|80|Multiple factors increase the utilization of SUs. You can scale with query parallelization or increase the number of SUs. For more information, see [Leverage query parallelization in Azure Stream Analytics](../stream-analytics-parallelization.md).|
|**CPU % Utilization**|Greater than|Average|90|This likely means that some operations (such as user-defined functions, user-defined aggregates, or complex input deserialization) are requiring a lot of CPU cycles. You can usually overcome this problem by increasing the number of SUs for the job.|
|**Runtime Errors**|Greater than|Total|0|Examine the activity or resource logs and make appropriate changes to the inputs, query, or outputs.|
|**Watermark Delay**|Greater than|Average|When the average value of this metric over the last 15 minutes is greater than the late arrival tolerance (in seconds). If you haven't modified the late arrival tolerance, the default is set to 5 seconds.|Try increasing the number of SUs or parallelizing your query. For more information on SUs, see [Understand and adjust streaming units](../stream-analytics-streaming-unit-consumption.md#how-many-sus-are-required-for-a-job). For more information on parallelizing your query, see [Leverage query parallelization in Azure Stream Analytics](../stream-analytics-parallelization.md).|
|**Input Deserialization Errors**|Greater than|Total|0|Examine the activity or resource logs and make appropriate changes to the input. For more information on resource logs, see [Troubleshoot Azure Stream Analytics by using resource logs](../stream-analytics-job-diagnostic-logs.md).|
