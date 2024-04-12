---
author: rboucher
ms.author: robb
ms.service: azure-monitor
ms.topic: include
ms.date: 02/27/2024
---

<a name="platform-metrics"></a>
## Azure Monitor platform metrics

Azure Monitor provides platform metrics for most services. These metrics are:

- Individually defined for each namespace.
- Stored in the Azure Monitor time-series metrics database.
- Lightweight and capable of supporting near real-time alerting.
- Used to track the performance of a resource over time.

**Collection:** Azure Monitor collects platform metrics automatically. No configuration is required.

**Routing:** You can also usually route platform metrics to Azure Monitor Logs / Log Analytics so you can query them with other log data. For more information, see the [Metrics diagnostic setting](/azure/azure-monitor/essentials/diagnostic-settings#metrics). For how to configure diagnostic settings for a service, see [Create diagnostic settings in Azure Monitor](/azure/azure-monitor/essentials/create-diagnostic-settings).

For a list of all metrics it's possible to gather for all resources in Azure Monitor, see [Supported metrics in Azure Monitor](/azure/azure-monitor/platform/metrics-supported).
