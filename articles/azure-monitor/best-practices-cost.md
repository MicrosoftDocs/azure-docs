---
title: Cost optimization in Azure Monitor
description: Recommendations for reducing costs in Azure Monitor.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 08/03/2023
ms.reviewer: bwren
---

# Cost optimization in Azure Monitor
Cost optimization refers to ways to reduce unnecessary expenses and improve operational efficiencies. You can significantly reduce your cost for Azure Monitor by understanding your different configuration options and opportunities to reduce the amount of data that it collects. Before you use this article, you should see [Azure Monitor cost and usage](usage-estimated-costs.md) to understand the different ways that Azure Monitor charges and how to view your monthly bill.

This article describes [Cost optimization](/azure/architecture/framework/cost/) for Azure Monitor as part of the [Azure Well-Architected Framework](/azure/architecture/framework/). This is a set of guiding tenets that can be used to improve the quality of a workload. The framework consists of five pillars of architectural excellence:

- Reliability
 - Security
 - Cost Optimization
 - Operational Excellence
 - Performance Efficiency


## Azure Monitor Logs

[!INCLUDE [waf-logs-cost](includes/waf-logs-cost.md)]


## Azure resources


### Design checklist

> [!div class="checklist"]
> - Collect only critical resource log data from Azure resources.


### Configuration recommendations

| Recommendation | Benefit |
|:---|:---|
| Collect only critical resource log data from Azure resources. | When you create [diagnostic settings](essentials/diagnostic-settings.md) to send [resource logs](essentials/resource-logs.md) for your Azure resources to a Log Analytics database, only specify those categories that you require. Since diagnostic settings don't allow granular filtering of resource logs, you can use a [workspace transformation](essentials/data-collection-transformations.md?#workspace-transformation-dcr) to further filter unneeded data for those resources that use a [supported table](logs/tables-feature-support.md). See [Diagnostic settings in Azure Monitor](essentials/diagnostic-settings.md#controlling-costs) for details on how to configure diagnostic settings and using transformations to filter their data. |

## Virtual machines

[!INCLUDE [waf-vm-cost](includes/waf-vm-cost.md)]

## Container insights

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
| Modify settings for collection of metric data. |  You can reduce your costs by modifying the default collection settings Container insights uses for the collection of metric data. See [Enable cost optimization settings](containers/container-insights-cost-config.md) for details on modifying both the frequency that metric data is collected and the namespaces that are collected. |
| Limit Prometheus metrics collected. | If you configured Prometheus metric scraping, then follow the recommendations at [Controlling ingestion to reduce cost](containers/container-insights-cost.md#prometheus-metrics-scraping) to optimize your data collection for cost. |
| Configure Basic Logs. | [Convert your schema to ContainerLogV2](containers/container-insights-logging-v2.md) which is compatible with Basic logs and can provide significant cost savings as described in [Controlling ingestion to reduce cost](containers/container-insights-cost.md#configure-basic-logs). |




## Application Insights

### Design checklist

> [!div class="checklist"]
> - Change to Workspace-based Application Insights.
> - Use sampling to tune the amount of data collected.
> - Limit the number of Ajax calls.
> - Disable unneeded modules.
> - Pre-aggregate metrics from any calls to TrackMetric.
> - Limit the use of custom metrics.
> - Ensure use of updated SDKs.

### Configuration recommendations

| Recommendation | Benefit |
|:---|:---|
| Change to Workspace-based Application Insights | Ensure that your Application Insights resources are [Workspace-based](app/create-workspace-resource.md) so that they can leverage new cost savings tools such as [Basic Logs](logs/basic-logs-configure.md), [Commitment Tiers](logs/cost-logs.md#commitment-tiers), [Retention by data type and Data Archive](logs/data-retention-archive.md#set-retention-and-archive-policy-by-table). |
| Use sampling to tune the amount of data collected. | [Sampling](app/sampling.md) is the primary tool you can use to tune the amount of data collected by Application Insights. Use sampling to reduce the amount of telemetry that's sent from your applications with minimal distortion of metrics. |
| Limit the number of Ajax calls. | [Limit the number of Ajax calls](app/javascript.md#configuration) that can be reported in every page view or disable Ajax reporting. If you disable Ajax calls, you'll be disabling [JavaScript correlation](app/javascript.md#enable-distributed-tracing) too. |
| Disable unneeded modules. | [Edit ApplicationInsights.config](app/configuration-with-applicationinsights-config.md) to turn off collection modules that you don't need. For example, you might decide that performance counters or dependency data aren't required. |
| Pre-aggregate metrics from any calls to TrackMetric. | If you put calls to TrackMetric in your application, you can reduce traffic by using the overload that accepts your calculation of the average and standard deviation of a batch of measurements. Alternatively, you can use a [pre-aggregating package](https://www.myget.org/gallery/applicationinsights-sdk-labs). |
| Limit the use of custom metrics. | The Application Insights option to [Enable alerting on custom metric dimensions](app/pre-aggregated-metrics-log-metrics.md#custom-metrics-dimensions-and-pre-aggregation) can increase costs. Using this option can result in the creation of more pre-aggregation metrics. |
| Ensure use of updated SDKs. | Earlier versions of the ASP.NET Core SDK and Worker Service SDK [collect many counters by default](app/eventcounters.md#default-counters-collected), which were collected as custom metrics. Use later versions to specify [only required counters](app/eventcounters.md#customizing-counters-to-be-collected). |



## Next step

- [Get best practices for a complete deployment of Azure Monitor](best-practices.md).

