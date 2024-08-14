---
title: Monitoring data reference for Azure Stream Analytics
description: This article contains important reference material you need when you monitor Azure Stream Analytics.
ms.date: 03/21/2024
ms.custom: horz-monitor
ms.topic: reference
author: spelluru
ms.author: spelluru
ms.service: stream-analytics
---

# Azure Stream Analytics monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure Stream Analytics](monitor-azure-stream-analytics.md) for details on the data you can collect for Azure Stream Analytics and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

Azure Stream Analytics provides plenty of metrics that you can use to monitor and troubleshoot your query and job performance. You can view data from these metrics on the **Overview** page of the Azure portal, in the **Monitoring** section.  

:::image type="content" source="./media/stream-analytics-job-metrics/02-stream-analytics-job-metrics-monitoring-block.png" alt-text="Screenshot of the Azure portal that shows the section for monitoring Stream Analytics jobs." lightbox="./media/stream-analytics-job-metrics/02-stream-analytics-job-metrics-monitoring-block.png":::

If you want to check a specific metric, select **Metrics** in the **Monitoring** section. On the page that appears, select the metric.

:::image type="content" source="./media/stream-analytics-job-metrics/01-stream-analytics-job-metrics-monitoring.png" alt-text="Screenshot that shows selecting a metric in the Stream Analytics job monitoring dashboard." lightbox="./media/stream-analytics-job-metrics/01-stream-analytics-job-metrics-monitoring.png":::

### Supported metrics for Microsoft.StreamAnalytics/streamingjobs
The following table lists the metrics available for the Microsoft.StreamAnalytics/streamingjobs resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [microsoft-streamanalytics-streamingjobs-metrics-include](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-streamanalytics-streamingjobs-metrics-include.md)]

### Metrics descriptions

[!INCLUDE [metrics](./includes/metrics.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

[!INCLUDE [metrics-dimensions](./includes/metrics-dimensions.md)]

### Logical Name dimension

[!INCLUDE [metrics-dimension-logical-name](./includes/metrics-dimension-logical-name.md)]

### Node Name dimension

[!INCLUDE [metrics-dimension-node-name](./includes/metrics-dimension-node-name.md)]

### Partition ID dimension

[!INCLUDE [metrics-partition-id](./includes/metrics-dimension-partition-id.md)]

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.StreamAnalytics/streamingjobs
[!INCLUDE [microsoft-streamanalytics-streamingjobs-logs-include](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-streamanalytics-streamingjobs-logs-include.md)]

### Resource logs schema

[!INCLUDE [resource-logs-schema](./includes/resource-logs-schema.md)]

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

### Stream Analytics jobs
[!INCLUDE [microsoft-streamanalytics-streamingjobs-logs-include](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-streamanalytics-streamingjobs-logs-include.md)]

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]
- [Microsoft.StreamAnalytics resource provider operations](../role-based-access-control/permissions/internet-of-things.md#microsoftstreamanalytics)

## Related content

- [Monitor Azure resources with Azure Monitor](../azure-monitor/essentials/monitor-azure-resource.md)
- [Monitor Azure Stream Analytics](monitor-azure-stream-analytics.md)
- [Dimensions for Azure Stream Analytics metrics](monitor-azure-stream-analytics-reference.md#metric-dimensions)
- [Understand and adjust streaming units](stream-analytics-streaming-unit-consumption.md)
