---
title: Monitoring Azure Stream Analytics data reference 
description: Important reference material needed when you monitor Azure Stream Analytics 
author: xujxu
ms.author: xujiang1
ms.service: stream-analytics
ms.topic: how-to
ms.date: 07/10/2023
ms.custom: seodec18
---

# Monitoring Azure Stream Analytics data reference
This article provides a reference of log and metric data collected to analyze the performance and availability of Azure Stream Analytics jobs. See [Monitoring Azure Stream Analytics](monitor-azure-stream-analytics.md) for details on collecting and analyzing monitoring data for Azure Stream Analytics.

## Metrics

This section lists all the automatically collected platform metrics collected for Azure Stream Analytics.  

|Metric Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| Stream Analytics streaming jobs | [Microsoft.StreamAnalytics/streamingjobs](/azure/azure-monitor/platform/metrics-supported#microsoftstreamanalyticsstreamingjobs) |

[!INCLUDE [metrics](./includes/metrics.md)]

### Scenarios to monitor metrics

[!INCLUDE [metrics-scenarios](./includes/metrics-scenarios.md)]

## Metric dimensions

[!INCLUDE [metrics-dimensions](./includes/metrics-dimensions.md)]

### Logical Name dimension
[!INCLUDE [metrics-dimension-logical-name](./includes/metrics-dimension-logical-name.md)]

### Node Name dimension
[!INCLUDE [metrics-dimension-node-name](./includes/metrics-dimension-node-name.md)]

### Partition ID dimension
[!INCLUDE [metrics-dimension-partition-id](./includes/metrics-partition-id.md)]


## Get help
For further assistance, try the [Microsoft Q&A page for Azure Stream Analytics](/answers/topics/azure-stream-analytics.html).

## Next steps
* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Dimensions for Azure Stream Analytics metrics](./stream-analytics-job-metrics-dimensions.md)
* [Understand and adjust streaming units](./stream-analytics-streaming-unit-consumption.md)
* [Analyze Stream Analytics job performance by using metrics and dimensions](./stream-analytics-job-analysis-with-metric-dimensions.md)
* [Monitor a Stream Analytics job with the Azure portal](./stream-analytics-monitoring.md)
* [Get started with Azure Stream Analytics](stream-analytics-real-time-fraud-detection.md)

