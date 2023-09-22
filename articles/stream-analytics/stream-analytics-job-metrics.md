---
title: Azure Stream Analytics job metrics
description: This article describes job metrics in Azure Stream Analytics.
author: xujxu
ms.author: xujiang1
ms.service: stream-analytics
ms.topic: how-to
ms.date: 07/10/2023
ms.custom: seodec18
---

# Azure Stream Analytics job metrics

Azure Stream Analytics provides plenty of metrics that you can use to monitor and troubleshoot your query and job performance. You can view data from these metrics on the **Overview** page of the Azure portal, in the **Monitoring** section.  

:::image type="content" source="./media/stream-analytics-job-metrics/02-stream-analytics-job-metrics-monitoring-block.png" alt-text="Screenshot of the Azure portal that shows the section for monitoring Stream Analytics jobs." lightbox="./media/stream-analytics-job-metrics/02-stream-analytics-job-metrics-monitoring-block.png":::

If you want to check a specific metric, select **Metrics** in the **Monitoring** section. On the page that appears, select the metric.

:::image type="content" source="./media/stream-analytics-job-metrics/01-stream-analytics-job-metrics-monitoring.png" alt-text="Screenshot that shows selecting a metric in the Stream Analytics job monitoring dashboard." lightbox="./media/stream-analytics-job-metrics/01-stream-analytics-job-metrics-monitoring.png":::

## Metrics available for Stream Analytics

[!INCLUDE [metrics](./includes/metrics.md)]

## Scenarios to monitor
Azure Stream Analytics provides a serverless, distributed streaming processing service. Jobs can run on one or more distributed streaming nodes, which the service automatically manages. The input data is partitioned and allocated to different streaming nodes for processing. 

[!INCLUDE [metrics-scenarios](./includes/metrics-scenarios.md)]

## Get help
For further assistance, try the [Microsoft Q&A page for Azure Stream Analytics](/answers/topics/azure-stream-analytics.html).

## Next steps
* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Dimensions for Azure Stream Analytics metrics](./stream-analytics-job-metrics-dimensions.md)
* [Understand and adjust streaming units](./stream-analytics-streaming-unit-consumption.md)
* [Analyze Stream Analytics job performance by using metrics and dimensions](./stream-analytics-job-analysis-with-metric-dimensions.md)
* [Monitor a Stream Analytics job with the Azure portal](./stream-analytics-monitoring.md)
* [Get started with Azure Stream Analytics](stream-analytics-real-time-fraud-detection.md)

