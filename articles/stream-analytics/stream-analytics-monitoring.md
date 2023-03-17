---
title: Monitor Stream Analytics job with Azure portal
description: This article describes how to monitor Azure Stream Analytics jobs in the Azure portal.
author: xujxu
ms.author: xujiang1
ms.service: stream-analytics
ms.topic: how-to
ms.date: 12/21/2022
ms.custom: seodec18
---
# Monitor Stream Analytics job with Azure portal

The Azure portal surfaces key performance metrics that can be used to monitor and troubleshoot your query and job performance. This article demonstrates how to monitor your Stream Analytics job in portal with the metrics.

## Azure portal monitor page
To see Azure Stream Analytics job metrics, browse to the Stream Analytics job you're interested in seeing metrics for and view the **Monitoring** section on the **Overview** page.

:::image type="content" source="./media/stream-analytics-monitoring/02-stream-analytics-monitoring-block.png" alt-text="Diagram that shows the Stream Analytics job monitoring section." lightbox="./media/stream-analytics-monitoring/02-stream-analytics-monitoring-block.png":::

Alternatively, browse to the **Monitoring** blade in the left panel and select the **Metrics**, then the metric page will be shown for adding the specific metric you'd like to check:

:::image type="content" source="./media/stream-analytics-monitoring/01-stream-analytics-monitoring.png" alt-text="Diagram that shows Stream Analytics job monitoring dashboard." lightbox="./media/stream-analytics-monitoring/01-stream-analytics-monitoring.png":::

There are 17 types of metrics provided by Azure Stream Analytics service. To learn about the details of them, see [Azure Stream Analytics job metrics](./stream-analytics-job-metrics.md).

You can also use these metrics to [monitor the performance of your Stream Analytics job](./stream-analytics-job-metrics.md#scenarios-to-monitor). 

## Operate and aggregate metrics in portal monitor

There are several options available for you to operate and aggregate the metrics in portal monitor page. 

To check the metrics data for a specific dimension, you can use **Add filter**. There are three important metrics dimensions available. To learn more about the metric dimensions, see [Azure Stream Analytics metrics dimensions](./stream-analytics-job-metrics-dimensions.md).

:::image type="content" source="./media/stream-analytics-monitoring/03-stream-analytics-monitoring-filter.png" alt-text="Diagram that shows Stream Analytics job metrics filter." lightbox="./media/stream-analytics-monitoring/03-stream-analytics-monitoring-filter.png":::

To check the metrics data per dimension, you can use **Apply splitting**.

:::image type="content" source="./media/stream-analytics-monitoring/04-stream-analytics-monitoring-splitter.png" alt-text="Diagram that shows Stream Analytics job metrics splitter." lightbox="./media/stream-analytics-monitoring/04-stream-analytics-monitoring-splitter.png":::

You can also specify the time range to view the metrics you're interested in. 

:::image type="content" source="./media/stream-analytics-monitoring/08-stream-analytics-monitoring.png" alt-text="Diagram that shows the Stream Analytics monitor page with time range." lightbox="./media/stream-analytics-monitoring/08-stream-analytics-monitoring.png":::

For details, see [How to Customize Monitoring](../azure-monitor/data-platform.md).



## Get help
For further assistance, try our [Microsoft Q&A question page for Azure Stream Analytics](/answers/topics/azure-stream-analytics.html)

## Next steps
* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-real-time-fraud-detection.md)
* [Azure Stream Analytics job metrics](./stream-analytics-job-metrics.md)
* [Azure Stream Analytics metrics dimensions](./stream-analytics-job-metrics-dimensions.md)
* [Analyze Stream Analytics job performance with metrics dimensions](./stream-analytics-job-analysis-with-metric-dimensions.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics Query Language Reference](/stream-analytics-query/stream-analytics-query-language-reference)
* [Azure Stream Analytics Management REST API Reference](/rest/api/streamanalytics/)
