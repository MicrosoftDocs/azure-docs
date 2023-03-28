---
title: Optimize costs in Azure Monitor
description: Recommendations for reducing costs in Azure Monitor.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 10/17/2022
ms.reviewer: bwren
---

# Optimize costs in Azure Monitor
You can significantly reduce your cost for Azure Monitor by understanding your different configuration options and opportunities to reduce the amount of data that it collects. Before you use this article, you should see [Azure Monitor cost and usage](usage-estimated-costs.md) to understand the different ways that Azure Monitor charges and how to view your monthly bill.

> [!NOTE]
> This article describes [Cost optimization](/azure/architecture/framework/cost/) for Azure Monitor as part of the [Azure Well-Architected Framework](/azure/architecture/framework/). This is a set of guiding tenets that can be used to improve the quality of a workload. The framework consists of five pillars of architectural excellence:
> 
> - Reliability
> - Security
> - Cost Optimization
> - Operational Excellence
> - Performance Efficiency

## Design considerations

Azure Monitor includes the following design considerations related to cost:

- Log Analytics workspace architecture<br><br>You can start using Azure Monitor with a single Log Analytics workspace by using default options. As your monitoring environment grows, you'll need to make decisions about whether to have multiple services share a single workspace or create multiple workspaces. There can be cost implications with your workspace design, most notably when you combine different services such as operational data from Azure Monitor and security data from Microsoft Sentinel. This may include trade-offs between functionality and cost depending on your particular priorities.<br><br>See [Design a Log Analytics workspace architecture](logs/workspace-design.md) for a list of criteria to consider when designing a workspace architecture.


## Checklist

**Log Analytics workspace configuration**

> [!div class="checklist"]
> - Configure pricing tier or dedicated cluster to optimize your cost depending on your usage.
> - Configure tables used for debugging, troubleshooting, and auditing as Basic Logs.
> - Configure data retention and archiving.

**Data collection**

> [!div class="checklist"]
> - Use diagnostic settings and transformations to collect only critical resource log data from Azure resources.
> - Configure VM agents to collect only critical events.
> - Use transformations to filter resource logs.
> - Ensure that VMs aren't sending data to multiple workspaces.

**Monitor usage**

> [!div class="checklist"]
> - Send alert when data collection is high.
> - Analyze your collected data at regular intervals to determine if there are opportunities to further reduce your cost.
> - Consider a daily cap as a preventative measure to ensure that you don't exceed a particular budget.


## Configuration recommendations



### Log Analytics workspace configuration
You may be able to significantly reduce your costs by optimizing the configuration of your Log Analytics workspaces. You can commit to a minimum amount of data collection in exchange for a reduced rate, and optimize your costs for the functionality and retention of data in particular tables. 

| Recommendation | Description |
|:---|:---|
| Configure pricing tier or dedicated cluster for your Log Analytics workspaces. | By default, Log Analytics workspaces will use pay-as-you-go pricing with no minimum data volume. If you collect enough amount of data, you can significantly decrease your cost by using a [commitment tier](logs/cost-logs.md#commitment-tiers) or [dedicated cluster](logs/logs-dedicated-clusters.md), which allows you to commit to a daily minimum of data collected in exchange for a lower rate.<br><br>See [Azure Monitor Logs cost calculations and options](logs/cost-logs.md) for details on commitment tiers and guidance on determining which is most appropriate for your level of usage. See [Usage and estimated costs](usage-estimated-costs.md#usage-and-estimated-costs) to view estimated costs for your usage at different pricing tiers.
| Configure tables used for debugging, troubleshooting, and auditing as Basic Logs. | Tables in a Log Analytics workspace configured for [Basic Logs](logs/basic-logs-configure.md) have a lower ingestion cost in exchange for limited features and a charge for log queries. If you query these tables infrequently, this query cost can be more than offset by the reduced ingestion cost.<br><br>See [Configure Basic Logs in Azure Monitor (Preview)](logs/basic-logs-configure.md) for more information about Basic Logs and [Query Basic Logs in Azure Monitor (preview)](.//logs/basic-logs-query.md) for details on query limitations. |
| Configure data retention and archiving. | There is a charge for retaining data in a Log Analytics workspace beyond the default of 30 days (90 days in Sentinel if enabled on the workspace). If you need to retain data for compliance reasons or for occasional investigation or analysis of historical data, configure [Archived Logs](logs/data-retention-archive.md), which allows you to retain data for up to seven years at a reduced cost.<br><br>See [Configure data retention and archive policies in Azure Monitor Logs](logs/data-retention-archive.md) for details on how to configure your workspace and how to work with archived data. |



### Data collection
Since Azure Monitor charges for the collection of data, your goal should be to collect the minimal amount of data required to meet your monitoring requirements. You have an opportunity to reduce your monitoring costs by modifying your configuration to stop collecting data that you're not using for alerting or analysis.

#### Azure resources

| Recommendation | Description |
|:---|:---|
| Collect only critical resource log data from Azure resources. | When you create [diagnostic settings](essentials/diagnostic-settings.md) to send [resource logs](essentials/resource-logs.md) for your Azure resources to a Log Analytics database, only specify those categories that you require. Since diagnostic settings don't allow granular filtering of resource logs, use a [workspace transformation](essentials/data-collection-transformations.md?#workspace-transformation-dcr) to further filter unneeded data. See [Diagnostic settings in Azure Monitor](essentials/diagnostic-settings.md#controlling-costs) for details on how to configure diagnostic settings and using transformations to filter their data. |

#### Virtual machines

| Recommendation | Description |
|:---|:---|
| Configure VM agents to collect only critical events. | Virtual machines can vary significantly in the amount of data they collect, depending on the amount of telemetry generated by the applications and services they have installed. See [Monitor virtual machines with Azure Monitor: Workloads](vm/monitor-virtual-machine-data-collection.md#controlling-costs) for guidance on data to collect and strategies for using XPath queries and transformations to limit it.|
| Ensure that VMs aren't sending duplicate data. | Any configuration that uses multiple agents on a single machine or where you multi-home agents to send data to multiple workspaces may incur charges for the same data multiple times. If you do multi-home agents, make sure you're sending unique data to each workspace. See [Analyze usage in Log Analytics workspace](logs/analyze-usage.md) for guidance on analyzing your collected data to make sure you aren't collecting duplicate data. If you're migrating between agents, continue to use the Log Analytics agent until you [migrate to the Azure Monitor agent](./agents/azure-monitor-agent-migration.md) rather than using both together unless you can ensure that each is collecting unique data. |

#### Container insights

| Recommendation | Description |
|:---|:---|
| Configure agent collection to remove unneeded data. |  Analyze the data collected by Container insights as described in [Controlling ingestion to reduce cost](containers/container-insights-cost.md#control-ingestion-to-reduce-cost) and adjust your configuration to stop collection of data in ContainerLogs you don't need. |
| Modify settings for collection of metric data |  You can reduce your costs by modifying the default collection settings Container insights uses for the collection of metric data. See [Enable cost optimization settings (preview)](containers/container-insights-cost-config.md) for details on modifying both the frequency that metric data is collected and the namespaces that are collected. |
| Limit Prometheus metrics collected | If you configured Prometheus metric scraping, then follow the recommendations at [Controlling ingestion to reduce cost](containers/container-insights-cost.md#prometheus-metrics-scraping) to optimize your data collection for cost. |
| Configure Basic Logs | [Convert your schema to ContainerLogV2](containers/container-insights-logging-v2.md) which is compatible with Basic logs and can provide significant cost savings as described in [Controlling ingestion to reduce cost](containers/container-insights-cost.md#configure-basic-logs). |


#### Application Insights

| Recommendation | Description |
|:---|:---|
| Change to Workspace-based Application Insights | Ensure that your Application Insights resources are Workspace-based so that they can leveage new cost saving tools such as Basic Logs, Commitment Tiers, Retention by data type and Data Archive. |
| Use sampling to tune the amount of data collected. | [Sampling](app/sampling.md) is the primary tool you can use to tune the amount of data collected by Application Insights. Use sampling to reduce the amount of telemetry that's sent from your applications with minimal distortion of metrics. |
| Limit the number of Ajax calls. | [Limit the number of Ajax calls](app/javascript.md#configuration) that can be reported in every page view or disable Ajax reporting. If you disable Ajax calls, you'll be disabling [JavaScript correlation](app/javascript.md#enable-distributed-tracing) too. |
| Disable unneeded modules. | [Edit ApplicationInsights.config](app/configuration-with-applicationinsights-config.md) to turn off collection modules that you don't need. For example, you might decide that performance counters or dependency data aren't required. |
| Pre-aggregate metrics from any calls to TrackMetric. | If you put calls to TrackMetric in your application, you can reduce traffic by using the overload that accepts your calculation of the average and standard deviation of a batch of measurements. Alternatively, you can use a [pre-aggregating package](https://www.myget.org/gallery/applicationinsights-sdk-labs). |
| Limit the use of custom metrics. | The Application Insights option to [Enable alerting on custom metric dimensions](app/pre-aggregated-metrics-log-metrics.md#custom-metrics-dimensions-and-pre-aggregation) can increase costs. Using this option can result in the creation of more pre-aggregation metrics. |
| Ensure use of updated SDKs. | Earlier versions of the ASP.NET Core SDK and Worker Service SDK [collect many counters by default](app/eventcounters.md#default-counters-collected), which were collected as custom metrics. Use later versions to specify [only required counters](app/eventcounters.md#customizing-counters-to-be-collected). |

#### All log data collection

| Recommendation | Description |
|:---|:---|
| Remove unnecssary data during data ingestion | After following all of the preveious recommendations, consider using Azure Monitor data collection transformations to reduce the size of your data during ingestion. |


## Monitor workspace and analyze usage

After you've configured your environment and data collection for cost optimization, you need to continue to monitor it to ensure that you don't experience unexpected increases in billable usage. You should also analyze your usage regularly to determine if you have other opportunities to further filter out collected data that hasn't proven to be useful.


| Recommendation | Description |
|:---|:---|
| Send alert when data collection is high. | To avoid unexpected bills, you should be proactively notified anytime you experience excessive usage. Notification allows you to address any potential anomalies before the end of your billing period. See [Send alert when data collection is high](logs/analyze-usage.md#send-alert-when-data-collection-is-high) for details. |
| Analyze collected data | Periodically analyze data collection using methods in [Analyze usage in Log Analytics workspace](logs/analyze-usage.md) to determine if there's additional configuration that can decrease your usage further. This is particularly important when you add a new set of data sources, such as a new set of virtual machines or onboard a new service. |
| Consider a daily cap as a preventative measure to ensure that you don't exceed a particular budget. | A [daily cap](logs/daily-cap.md) disables data collection in a Log Analytics workspace for the rest of the day after your configured limit is reached. This shouldn't be used as a method to reduce costs as described in [When to use a daily cap](logs/daily-cap.md). See [Set daily cap on Log Analytics workspace](logs/daily-cap.md) for information on how the daily cap works and how to configure one. |




## Next step

- [Get best practices for a complete deployment of Azure Monitor](best-practices.md).
