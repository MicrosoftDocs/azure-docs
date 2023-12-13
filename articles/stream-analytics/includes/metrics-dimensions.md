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



Stream Analytics has [many metrics](../stream-analytics-job-metrics.md) available to monitor a job's health. To troubleshoot performance problems with your job, you can split and filter metrics by using the following dimensions. 

| Dimension                 | Definition                               | 
| ---------------------- | ---------------------------------------- | 
| **Logical Name**       | The input or output name for a Stream Analytics job. |
| **Partition ID**     | The ID of the input data partition from an input source. For example, if the input source is an event hub, the partition ID is the event hub's partition ID. For embarrassingly parallel jobs, **Partition ID** in the output is the same as it is in the input. |
| **Node Name**        | The identifier of a streaming node that's provisioned when your job runs. A streaming node represents the amount of compute and memory resources allocated to your job. |

:::image type="content" source="../media/stream-analytics-monitoring/05-stream-analytics-monitoring-dimension.png" alt-text="Screenshot of a chart that shows the area for selecting a dimension for Stream Analytics job metrics." lightbox="../media/stream-analytics-monitoring/05-stream-analytics-monitoring-dimension.png":::

:::image type="content" source="../media/stream-analytics-job-metrics-dimensions/02-metric-splitting-with-dimension.png" alt-text="Screenshot that shows splitting a metric by dimension.":::

:::image type="content" source="../media/stream-analytics-job-metrics-dimensions/03-metric-filtered-by-dimension.png" alt-text="Screenshot that shows filtering a metric by dimension.":::