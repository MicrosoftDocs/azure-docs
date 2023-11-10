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
Cost optimization refers to ways to reduce unnecessary expenses and improve operational efficiencies. You can significantly reduce your cost for Azure Monitor by understanding your different configuration options and opportunities to reduce the amount of data that it collects. Before you use this article, you should see [Azure Monitor cost and usage](cost-usage.md) to understand the different ways that Azure Monitor charges and how to view your monthly bill.

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

## Alerts

[!INCLUDE [waf-containers-cost](includes/waf-alerts-cost.md)]


## Virtual machines

[!INCLUDE [waf-vm-cost](includes/waf-vm-cost.md)]

## Containers


[!INCLUDE [waf-containers-cost](includes/waf-containers-cost.md)]



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
| Change to Workspace-based Application Insights | Ensure that your Application Insights resources are [Workspace-based](app/create-workspace-resource.md) so that they can leverage new cost savings tools such as [Basic Logs](logs/basic-logs-configure.md), [Commitment Tiers](logs/cost-logs.md#commitment-tiers), [Retention by data type and Data Archive](logs/data-retention-archive.md#configure-retention-and-archive-at-the-table-level). |
| Use sampling to tune the amount of data collected. | [Sampling](app/sampling.md) is the primary tool you can use to tune the amount of data collected by Application Insights. Use sampling to reduce the amount of telemetry that's sent from your applications with minimal distortion of metrics. |
| Limit the number of Ajax calls. | [Limit the number of Ajax calls](app/javascript.md#configuration) that can be reported in every page view or disable Ajax reporting. If you disable Ajax calls, you'll be disabling [JavaScript correlation](app/javascript.md#enable-distributed-tracing) too. |
| Disable unneeded modules. | [Edit ApplicationInsights.config](app/configuration-with-applicationinsights-config.md) to turn off collection modules that you don't need. For example, you might decide that performance counters or dependency data aren't required. |
| Pre-aggregate metrics from any calls to TrackMetric. | If you put calls to TrackMetric in your application, you can reduce traffic by using the overload that accepts your calculation of the average and standard deviation of a batch of measurements. Alternatively, you can use a [pre-aggregating package](https://www.myget.org/gallery/applicationinsights-sdk-labs). |
| Limit the use of custom metrics. | The Application Insights option to [Enable alerting on custom metric dimensions](app/pre-aggregated-metrics-log-metrics.md#custom-metrics-dimensions-and-pre-aggregation) can increase costs. Using this option can result in the creation of more pre-aggregation metrics. |
| Ensure use of updated SDKs. | Earlier versions of the ASP.NET Core SDK and Worker Service SDK [collect many counters by default](app/eventcounters.md#default-counters-collected), which were collected as custom metrics. Use later versions to specify [only required counters](app/eventcounters.md#customizing-counters-to-be-collected). |

## Frequently asked questions

This section provides answers to common questions.

### Is Application Insights free?

Yes, for experimental use. In the basic pricing plan, your application can send a certain allowance of data each month free of charge. The free allowance is large enough to cover development and publishing an app for a few users. You can set a cap to prevent more than a specified amount of data from being processed.
          
Larger volumes of telemetry are charged by the gigabyte. We provide some tips on how to [limit your charges](#application-insights).
          
The Enterprise plan incurs a charge for each day that each web server node sends telemetry. It's suitable if you want to use Continuous Export on a large scale.
          
Read the [pricing plan](https://azure.microsoft.com/pricing/details/application-insights/).

### How much does Application Insights cost?

* Open the **Usage and estimated costs** page in an Application Insights resource. There's a chart of recent usage. You can set a data volume cap, if you want.
* To see your bills across all resources:

  1. Open the [Azure portal](https://portal.azure.com).
  1. Search for **Cost Management** and use the **Cost analysis** pane to see forecasted costs.
  1. Search for **Cost Management and Billing** and open the **Billing scopes** pane to see current charges across subscriptions.
          
### Are there data transfer charges between an Azure web app and Application Insights?

* If your Azure web app is hosted in a datacenter where there's an Application Insights collection endpoint, there's no charge.
* If there's no collection endpoint in your host datacenter, your app's telemetry incurs [Azure outgoing charges](https://azure.microsoft.com/pricing/details/bandwidth/).
          
This answer depends on the distribution of our endpoints, *not* on where your Application Insights resource is hosted.

### Will I incur network costs if my Application Insights resource is monitoring an Azure resource (i.e., telemetry producer) in a different region?

Yes, you may incur additional network costs which will vary depending on the region the telemetry is coming from and where it is going. Refer to [Azure bandwidth pricing](https://azure.microsoft.com/pricing/details/bandwidth/) for details.

## Next step

- [Get best practices for a complete deployment of Azure Monitor](best-practices.md).

