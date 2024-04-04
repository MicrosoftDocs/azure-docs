---
ms.service: azure-monitor
ms.topic: include
ms.date: 10/31/2023
ms.author: edbaynash
author: EdB-MSFT
---

### Why am I missing metrics that have two labels with the same name but different casing?

Azure managed Prometheus is a case insensitive system. It treats strings, such as metric names, label names, or label values, as the same time series if they differ from another time series only by the case of the string. For more information, see [Prometheus metrics overview](/azure/azure-monitor/essentials/prometheus-metrics-overview#case-sensitivity).
