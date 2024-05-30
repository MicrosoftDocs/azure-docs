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

### Supported metrics for Microsoft.StreamAnalytics/streamingjobs
The following table lists the metrics available for the Microsoft.StreamAnalytics/streamingjobs resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [Microsoft.StreamAnalytics/streamingjobs](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-streamanalytics-streamingjobs-metrics-include.md)]

### Metrics descriptions

[!INCLUDE [metrics](./includes/metrics.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

- **Logical Name**: The input or output name for an Azure Stream Analytics job.
- **Partition ID**: The ID of the input data partition from an input source.
- **Node Name**: The identifier of a streaming node that's provisioned when a job runs.

For detailed information, see [Dimensions for Azure Stream Analytics metrics](stream-analytics-job-metrics-dimensions.md).

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.StreamAnalytics/streamingjobs
[!INCLUDE [Microsoft.StreamAnalytics/streamingjobs](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/microsoft-streamanalytics-streamingjobs-logs-include.md)]

For the resource logs schema and properties for data errors and events, see [Resource logs schema](stream-analytics-job-diagnostic-logs.md#resource-logs-schema).

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

### Stream Analytics jobs
microsoft.streamanalytics/streamingjobs

- [AzureActivity](/azure/azure-monitor/reference/tables/AzureActivity)
- [AzureMetrics](/azure/azure-monitor/reference/tables/AzureMetrics)
- [AzureDiagnostics](/azure/azure-monitor/reference/tables/AzureDiagnostics)

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]
- [Microsoft.StreamAnalytics resource provider operations](../role-based-access-control/permissions/internet-of-things.md#microsoftstreamanalytics)

## Related content

- [Monitor Azure resources with Azure Monitor](../azure-monitor/essentials/monitor-azure-resource.md)
- [Monitor Azure Stream Analytics](monitor-azure-stream-analytics.md)
- [Dimensions for Azure Stream Analytics metrics](stream-analytics-job-metrics-dimensions.md)
- [Understand and adjust streaming units](stream-analytics-streaming-unit-consumption.md)
