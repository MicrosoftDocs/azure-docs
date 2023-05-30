---
author: bwren
ms.author: bwren
ms.service: azure-monitor
ms.topic: include
ms.date: 03/30/2023
---

### Design checklist

> [!div class="checklist"]
> - Configure agent collection to remove unneeded data.
> - Modify settings for collection of metric data.
> - Limit Prometheus metrics collected.
> - Configure Basic Logs.
### Configuration recommendations

| Recommendation | Benefit |
|:---|:---|
| Configure agent collection to remove unneeded data. |  Analyze the data collected by Container insights as described in [Controlling ingestion to reduce cost](containers/container-insights-cost.md#control-ingestion-to-reduce-cost) and adjust your configuration to stop collection of data in ContainerLogs you don't need. |
| Modify settings for collection of metric data. |  You can reduce your costs by modifying the default collection settings Container insights uses for the collection of metric data. See [Enable cost optimization settings (preview)](containers/container-insights-cost-config.md) for details on modifying both the frequency that metric data is collected and the namespaces that are collected. |
| Limit Prometheus metrics collected. | If you configured Prometheus metric scraping, then follow the recommendations at [Controlling ingestion to reduce cost](containers/container-insights-cost.md#prometheus-metrics-scraping) to optimize your data collection for cost. |
| Configure Basic Logs. | [Convert your schema to ContainerLogV2](containers/container-insights-logging-v2.md) which is compatible with Basic logs and can provide significant cost savings as described in [Controlling ingestion to reduce cost](containers/container-insights-cost.md#configure-basic-logs). |