---
author: ggailey777
ms.author: glenga
ms.date: 7/24/2019
ms.topic: include
ms.service: azure-functions
---

> [!NOTE]
> Streaming logs support only a single instance of the Functions host. When your function is scaled to multiple instances, data from other instances are not shown in the log stream. The [Live Metrics Stream](../articles/azure-monitor/app/live-stream.md) in Application Insights does supported multiple instances. While also in near real time, streaming analytics are also based on [sampled data](../articles/azure-functions/functions-monitoring.md#configure-sampling).