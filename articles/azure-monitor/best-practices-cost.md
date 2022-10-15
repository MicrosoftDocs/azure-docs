---
title: 'Azure Monitor best practices: Cost management'
description: Guidance and recommendations for reducing your cost for Azure Monitor.
ms.topic: conceptual
ms.custom: ignite-2022
author: bwren
ms.author: bwren
ms.date: 03/31/2022
ms.reviewer: bwren
---

# Azure Monitor best practices: Cost optimization

[Azure Monitor](overview.md) helps you maximize the availability and performance of your applications and services. It delivers a comprehensive solution for collecting, analyzing, and acting on telemetry from your cloud and on-premises environments.

To understand how Azure Monitor supports cost optimization, start by understanding the different ways that Azure Monitor charges and how to view your monthly bill. See [Azure Monitor cost and usage](usage-estimated-costs.md) for a complete description of how Azure Monitor is billed and the different tools available to analyze your charges.

## Design considerations

Azure Monitor includes the following design considerations:

- Log Analytics workspace architecture<br><br>You can start using Azure Monitor with a single Log Analytics workspace by using default options. As your monitoring environment grows, you'll need to make decisions about whether to have multiple services share a single workspace or create multiple workspaces. There can be cost implications with your workspace design, most notably when you combine different services such as operational data from Azure Monitor and security data from Microsoft Sentinel.<br><br>See [Design a Log Analytics workspace architecture](logs/workspace-design.md) for a list of criteria to consider when designing a workspace architecture.


## Checklist

**Log Analytics workspace configuration**

> [!div class="checklist"]
> - Configure pricing tier or dedicated cluster to optimize your cost depending on your usage.
> - Configure tables used for debugging, troubleshooting, and auditing as Basic Logs.
> - Configure data retention and archiving.

**Data collection**

> [!div class="checklist"]
> - Configure diagnostic settings to collect only critical resource log categories from Azure resources.
> - Configure VM agents to collect only critical events.
> - Use transformations to filter resource logs and events.
> - Ensure that VMs aren't sending data to multiple workspaces.

**Monitor usage**

> [!div class="checklist"]
> - Send alert when data collection is high.
> - Consider a daily cap as a preventative measure to ensure that you don't exceed a particular budget.
> - Analyze your collected data.



## Configuration recommendations



### Log Analytics workspace configuration
You can significantly reduce your costs by configuring your Log Analytics workspaces. You can commit to minimum amount of data collection in exchange for a reduced rate, and optimized your costs for the functionality and retention of data in particular tables. 

| Recommendation | Description |
|:---|:---|
| Configure pricing tier or dedicated cluster for your Log Analytics workspaces. | By default, Log Analytics workspaces will use pay-as-you-go pricing with no minimum data volume. If you collect enough amount of data, you can significantly decrease your cost by using a [commitment tier](logs/cost-logs.md#commitment-tiers) or [dedicated cluster](logs/logs-dedicated-clusters.md), which allows you to commit to a daily minimum of data collected in exchange for a lower rate.<br><br>See [Azure Monitor Logs pricing details](logs/cost-logs.md) for information on commitment tiers and guidance on determining which is most appropriate for your level of usage. See [Usage and estimated costs](usage-estimated-costs.md#usage-and-estimated-costs) to view estimated costs for your usage at different pricing tiers.
| Configure tables used for debugging, troubleshooting, and auditing as Basic Logs. | Tables in a Log Analytics workspace configured for [Basic Logs](logs/basic-logs-configure.md) have a lower ingestion cost in exchange for reduced features. They can't be used for alerting, their retention is set to eight days, they support a limited version of the query language, and there's a cost for querying them. If you query these tables infrequently, this query cost can be more than offset by the reduced ingestion cost.<br><br>See [Query Basic Logs in Azure Monitor (preview)](.//logs/basic-logs-query.md) for information on query limitations. See [Configure Basic Logs in Azure Monitor (Preview)](logs/basic-logs-configure.md) for more information about Basic Logs. |
| Configure data retention and archiving. | Data collected in a Log Analytics workspace is retained for 31 days at no charge, or 90 days if Microsoft Sentinel is enabled on the workspace. You can retain data beyond the default for trending analysis or other reporting, but there's a charge for this retention. If you need to retain data for compliance reasons or for occasional investigation or analysis of historical data, configure [Archived Logs](logs/data-retention-archive.md), which allows you to retain data for up to seven years at a reduced cost.<br><br>See [Configure data retention and archive policies in Azure Monitor Logs](logs/data-retention-archive.md) for details on how to configure your workspace and how to work with archived data.



### Data collection
Your goal should be to collect the minimal amount of data to meet your monitoring requirements. If you're collecting data that's not being used for alerting or analysis, you have an opportunity to reduce your monitoring costs by modifying your configuration to stop collecting data that you don't need.

| Recommendation | Description |
|:---|:---|
| **Resource Logs** ||
| Collect only critical resource log data from Azure resources. | When you create [diagnostic settings](essentials/diagnostic-settings.md) to send [resource logs](essentials/resource-logs.md) for your Azure resources to a Log Analytics database, only specify those categories that you require. Since diagnostic settings don't allow granular filtering of resource logs, use a [workspace transformation](essentials/data-collection-transformations.md?#workspace-transformation-dcr) to filter data that you don't require. See [Diagnostic settings in Azure Monitor](essentials/diagnostic-settings.md#controlling-costs) for details on how to configure diagnostic settings and using transformations to filter their data. |
| **Virtual machines** ||
| Configure VM agents to collect only critical events. | Virtual machines can vary significantly in the amount of data they collect, depending on the amount of telemetry generated by the applications and services they have installed. See [Monitor virtual machines with Azure Monitor: Workloads](vm/monitor-virtual-machine-workloads.md#controlling-costs) for the most common data collected from virtual machines and strategies for limiting them for each of the Azure Monitor agents. |
| Ensure that VMs aren't sending data to multiple workspaces. | You should be cautious with any configuration using multi-homed agents where a single virtual machine sends data to multiple workspaces because you might be incurring charges for the same data multiple times. If you do multi-home agents, make sure you're sending unique data to each workspace.<br><br>You can also collect duplicate data with a single virtual machine running both the Azure Monitor agent and Log Analytics agent, even if they're both sending data to the same workspace. While the agents can coexist, each works independently without any knowledge of the other. Continue to use the Log Analytics agent until you [migrate to the Azure Monitor agent](./agents/azure-monitor-agent-migration.md) rather than using both together unless you can ensure that each is collecting unique data.<br><br>See [Analyze usage in Log Analytics workspace](logs/analyze-usage.md) for guidance on analyzing your collected data to make sure you aren't collecting duplicate data for the same machine. |
| **Container insights** | See [Understand monitoring costs for Container insights](containers/container-insights-cost.md) for more details. |
| Configure agent data collection to |  |
| Limit Prometheus metrics collected |  |
| Configure Basic Logs |  |
| **Application Insights** || 
| Use sampling to tune the amount of data collected. | [Sampling](app/sampling.md) is the primary tool you can use to tune the amount of data collected by Application Insights. Use sampling to reduce the amount of telemetry that's sent from your applications with minimal distortion of metrics. |
| Limit the number of Ajax calls. | [Limit the number of Ajax calls](app/javascript.md#configuration) that can be reported in every page view or disable Ajax reporting. If you disable Ajax calls, you'll be disabling [JavaScript correlation](app/javascript.md#enable-distributed-tracing) too. |
| Disable unneeded modules. | [Edit ApplicationInsights.config](app/configuration-with-applicationinsights-config.md) to turn off collection modules that you don't need. For example, you might decide that performance counters or dependency data aren't required. |
| Pre-aggregate metrics from any calls to TrackMetric. | If you put calls to TrackMetric in your application, you can reduce traffic by using the overload that accepts your calculation of the average and standard deviation of a batch of measurements. Alternatively, you can use a [pre-aggregating package](https://www.myget.org/gallery/applicationinsights-sdk-labs). |
| Limit the use of custom metrics. | The Application Insights option to [Enable alerting on custom metric dimensions](app/pre-aggregated-metrics-log-metrics.md#custom-metrics-dimensions-and-pre-aggregation) can increase costs. Using this option can result in the creation of more pre-aggregation metrics. |
| Ensure use of updated SDKs. | Earlier versions of the ASP.NET Core SDK and Worker Service SDK [collect many counters by default](app/eventcounters.md#default-counters-collected), which were collected as custom metrics. Use later versions to specify [only required counters](app/eventcounters.md#customizing-counters-to-be-collected). |



## Monitor workspace and analyze usage

After you've configured your environment and data collection for cost optimization, you need to continue to monitor it to ensure that you don't experience unexpected increases in billable usage. You should also analyze your usage regularly to determine if you have other opportunities to reduce your usage. For example, you might want to further filter out collected data that hasn't proven to be useful.



| Recommendation | Description |
|:---|:---|
| Analyze collected data | When you detect an increase in data collection, you need methods to analyze your collected data to identify the source of the increase. You should also periodically analyze data collection to determine if there's additional configuration that can decrease your usage further. This practice is particularly important when you add a new set of data sources, such as a new set of virtual machines or onboard a new service.<br><br>See [Analyze usage in Log Analytics workspace](logs/analyze-usage.md) for different methods to analyze your collected data and billable usage. This article includes various log queries that will help you identify the source of any data increases and to understand your basic usage patterns. |
| Send alert when data collection is high. | To avoid unexpected bills, you should be proactively notified anytime you experience excessive usage. Notification allows you to address any potential anomalies before the end of your billing period. See [Send alert when data collection is high](logs/analyze-usage.md#send-alert-when-data-collection-is-high) for details. |
| Consider a daily cap as a preventative measure to ensure that you don't exceed a particular budget. | A [daily cap](logs/daily-cap.md) disables data collection in a Log Analytics workspace for the rest of the day after your configured limit is reached. A daily cap shouldn't be used as a method to reduce costs as described in [When to use a daily cap](logs/daily-cap.md). See [Set daily cap on Log Analytics workspace](logs/daily-cap.md) for information on how the daily cap works and how to configure one. |




## Next step
