---
title: Monitor Stream Analytics job with Azure portal
description: Monitor Azure Stream Analytics jobs in the Azure portal by using key performance metrics to track query and job performance and troubleshoot issues.
author: spelluru
ms.author: spelluru
ms.service: azure-stream-analytics
ms.topic: how-to
ms.date: 08/25/2026
ms.custom: sfi-image-nochange
ai-usage: ai-assisted
---
# Monitor an Azure Stream Analytics job with metrics in the Azure portal

The Azure portal surfaces key performance metrics that you can use to monitor and troubleshoot your Stream Analytics query and job performance.

This article shows you how to monitor your Stream Analytics job in the portal by using these metrics.

## Azure portal monitor page

To see Azure Stream Analytics job metrics, browse to the Stream Analytics job that you want to monitor, and then view the **Monitoring** section on the **Overview** page.

:::image type="content" source="./media/stream-analytics-monitoring/02-stream-analytics-monitoring-block.png" alt-text="Screenshot that shows the Stream Analytics job monitoring section." lightbox="./media/stream-analytics-monitoring/02-stream-analytics-monitoring-block.png":::

Alternatively, select **Monitoring** in the left pane, and then select **Metrics**. The metrics page opens so you can add the specific metric that you want to check:

:::image type="content" source="./media/stream-analytics-monitoring/01-stream-analytics-monitoring.png" alt-text="Screenshot that shows the Stream Analytics job monitoring dashboard." lightbox="./media/stream-analytics-monitoring/01-stream-analytics-monitoring.png":::

Azure Stream Analytics provides many metrics. For details about each one, see [Azure Stream Analytics job metrics](monitor-azure-stream-analytics-reference.md#metrics-descriptions).

Use these metrics to also [monitor the performance of your Stream Analytics job](monitor-azure-stream-analytics.md#azure-stream-analytics-metrics).

For more information, see the [Azure Stream Analytics query language reference](/stream-analytics-query/stream-analytics-query-language-reference) and the [Azure Stream Analytics management REST API reference](/rest/api/streamanalytics/). To try Azure Stream Analytics end to end, see [Get started using Azure Stream Analytics](stream-analytics-real-time-fraud-detection.md). For further assistance, try our [Microsoft Q&A question page for Azure Stream Analytics](/answers/tags/179/azure-stream-analytics).

The following screenshots show the filter, splitting, and time-range options that you use in the next section:

:::image type="content" source="./media/stream-analytics-monitoring/03-stream-analytics-monitoring-filter.png" alt-text="Screenshot that shows the Stream Analytics job metrics filter." lightbox="./media/stream-analytics-monitoring/03-stream-analytics-monitoring-filter.png":::

:::image type="content" source="./media/stream-analytics-monitoring/04-stream-analytics-monitoring-splitter.png" alt-text="Screenshot that shows the Stream Analytics job metrics splitter." lightbox="./media/stream-analytics-monitoring/04-stream-analytics-monitoring-splitter.png":::

:::image type="content" source="./media/stream-analytics-monitoring/08-stream-analytics-monitoring.png" alt-text="Screenshot that shows the Stream Analytics monitor page with a time range." lightbox="./media/stream-analytics-monitoring/08-stream-analytics-monitoring.png":::

## Operate and aggregate metrics in portal monitor

You have several options to operate and aggregate the metrics on the portal monitor page. For more options, see [Customize monitoring in Azure Monitor](/azure/azure-monitor/data-platform). Follow these steps:

1. Use **Add filter** to check the metrics data for a specific dimension. Three important metrics dimensions are available. To learn more about the metric dimensions, see [Azure Stream Analytics metrics dimensions](monitor-azure-stream-analytics-reference.md#metric-dimensions).
1. Use **Apply splitting** to check the metrics data per dimension.
1. Specify the time range to view the metrics that you're interested in.

## Related content

* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Analyze Stream Analytics job performance with metrics dimensions](./stream-analytics-job-analysis-with-metric-dimensions.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
