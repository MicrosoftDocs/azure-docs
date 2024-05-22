---
author: KennedyDenMSFT
ms.author: aaronmax
ms.service: azure-monitor
ms.topic: include
ms.date: 03/12/2024
---

### Design checklist

> [!div class="checklist"]
> - Change to workspace-based Application Insights.
> - Use sampling to tune the amount of data collected.
> - Limit the number of Ajax calls.
> - Disable unneeded modules.
> - Preaggregate metrics from any calls to TrackMetric.
> - Limit the use of custom metrics where possible.
> - Ensure use of updated software development kits (SDKs).
> - Limit unwanted host trace and general trace logging using log levels.

### Configuration recommendations

| Recommendation | Benefit |
|:---------------|:--------|
| Change to workspace-based Application Insights. | Ensure that your Application Insights resources are [workspace-based](../app/create-workspace-resource.md). Workspace-based Application Insights resources can apply new cost savings tools such as [Basic Logs](../logs/basic-logs-configure.md), [commitment tiers](../logs/cost-logs.md#commitment-tiers), and [retention by data type and data archive](../logs/data-retention-archive.md#configure-retention-and-archive-at-the-table-level). |
| Use sampling to tune the amount of data collected. | [Sampling](../app/sampling.md) is the primary tool you can use to tune the amount of data collected by Application Insights. Use sampling to reduce the amount of telemetry sent from your applications with minimal distortion of metrics. |
| Limit the number of Ajax calls. | [Limit the number of Ajax calls](../app/javascript.md#configuration) that can be reported in every page view or disable Ajax reporting. If you disable Ajax calls, you also disable [JavaScript correlation](../app/javascript.md#enable-distributed-tracing). |
| Disable unneeded modules. | [Edit ApplicationInsights.config](../app/configuration-with-applicationinsights-config.md) to turn off collection modules that you don't need. For example, you might decide that performance counters or dependency data aren't required. |
| Preaggregate metrics from any calls to TrackMetric. | If you put calls to TrackMetric in your application, you can reduce traffic by using the overload that accepts your calculation of the average and standard deviation of a batch of measurements. Alternatively, you can use a [preaggregating package](https://www.myget.org/gallery/applicationinsights-sdk-labs). |
| Limit the use of custom metrics. | The Application Insights option to [Enable alerting on custom metric dimensions](../app/pre-aggregated-metrics-log-metrics.md#custom-metrics-dimensions-and-pre-aggregation) can increase costs. Using this option can result in the creation of more preaggregation metrics. |
| Ensure use of updated software development kits (SDKs). | Earlier versions of the ASP.NET Core SDK and Worker Service SDK [collect many counters by default](../app/eventcounters.md#default-counters-collected), which were collected as custom metrics. Use later versions to specify [only required counters](../app/eventcounters.md#customizing-counters-to-be-collected). |
| Limit unwanted trace logging. | Application Insights has several possible [log sources](../app/app-insights-overview.md#logging-frameworks). Log levels can be used to tune and reduce trace log telemetry. Logging can also apply to the host. For example, customers using Azure Kubernetes Service (AKS) should adjust [control plane and data plane logs](../../aks/monitor-aks.md#logs). Similarly, customers using Azure functions should [adapt log levels and scope](../../azure-functions/configure-monitoring.md) to optimize log volume and costs. |