---
title: Dimensions for Azure Stream Analytics metrics
description: This article describes dimensions for Azure Stream Analytics metrics.
author: xujxu
ms.author: xujiang1
ms.service: stream-analytics
ms.topic: conceptual
ms.custom: ignite-2022
ms.date: 10/12/2022
---
# Dimensions for Azure Stream Analytics metrics
Azure Stream Analytics provides a serverless, distributed streaming processing service. Jobs can run on one or more distributed streaming nodes, which the service automatically manages. The input data is partitioned and allocated to different streaming nodes for processing. 

[!INCLUDE [metrics-dimensions](./includes/metrics-dimensions.md)]

## Logical Name dimension

[!INCLUDE [metrics-dimension-logical-name](./includes/metrics-dimension-logical-name.md)]

## Node Name dimension

[!INCLUDE [metrics-dimension-node-name](./includes/metrics-dimension-node-name.md)]

## Partition ID dimension

[!INCLUDE [metrics-partition-id](./includes/metrics-dimension-partition-id.md)]


## Next steps

* [Azure Stream Analytics job metrics](./stream-analytics-job-metrics.md)
* [Analyze Stream Analytics job performance by using metrics and dimensions](./stream-analytics-job-analysis-with-metric-dimensions.md)
* [Debugging with the physical job diagram (preview) in Azure portal](./stream-analytics-job-physical-diagram-with-metrics.md)
* [Debugging with the logical job diagram (preview) in Azure portal](./stream-analytics-job-logical-diagram-with-metrics.md)
* [Monitor a Stream Analytics job with the Azure portal](./stream-analytics-monitoring.md)
* [Understand and adjust streaming units](./stream-analytics-streaming-unit-consumption.md)
