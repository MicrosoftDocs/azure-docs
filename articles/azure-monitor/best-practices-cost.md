---
title: 'Azure Monitor best practices: Cost management'
description: Guidance and recommendations for reducing your cost for Azure Monitor.
ms.topic: conceptual
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

| Recommendation | Description |
|:---|:---|
| Configure pricing tier or dedicated cluster to optimize your cost depending on your usage. | By default, workspaces will use pay-as-you-go pricing with no minimum data volume. If you collect enough amount of data, you can significantly decrease your cost by using a [commitment tier](logs/cost-logs.md#commitment-tiers). You commit to a daily minimum of data collected in exchange for a lower rate.<br><br>[Dedicated clusters](logs/logs-dedicated-clusters.md) provide more functionality and cost savings if you ingest at least 500 GB per day collectively among multiple workspaces in the same region. Unlike commitment tiers, workspaces in a dedicated cluster don't need to individually reach 500 GB.<br><br>See [Azure Monitor Logs pricing details](logs/cost-logs.md) for information on commitment tiers and guidance on determining which is most appropriate for your level of usage. See [Usage and estimated costs](usage-estimated-costs.md#usage-and-estimated-costs) to view estimated costs for your usage at different pricing tiers.
| Configure tables used for debugging, troubleshooting, and auditing as Basic Logs. | You can significantly reduce your costs by optimizing your data retention and archiving and configuring [Basic Logs](logs/basic-logs-configure.md).<br><br>Tables configured for Basic Logs have a lower ingestion cost in exchange for reduced features. They can't be used for alerting, their retention is set to eight days, they support a limited version of the query language, and there's a cost for querying them. If you query these tables infrequently, this query cost can be more than offset by the reduced ingestion cost.<br><br>See [Query Basic Logs in Azure Monitor (preview)](.//logs/basic-logs-query.md) for information on query limitations. See [Configure Basic Logs in Azure Monitor (Preview)](logs/basic-logs-configure.md) for more information about Basic Logs. |
| Configure data retention and archiving. | Data collected in a Log Analytics workspace is retained for 31 days at no charge. The time period is 90 days if Microsoft Sentinel is enabled on the workspace. You can retain data beyond the default for trending analysis or other reporting, but there's a charge for this retention.<br><br>Your retention requirement might be for compliance reasons or for occasional investigation or analysis of historical data. In this case, you should configure [Archived Logs](logs/data-retention-archive.md), which allows you to retain data for up to seven years at a reduced cost. There's a cost to search archived data or temporarily restore it for analysis. If you require infrequent access to this data, this cost is more than offset by the reduced retention cost. |


### Data collection
The most straightforward strategy to reduce your costs for data ingestion and retention is to reduce the amount of data that you collect. Your goal should be to collect the minimal amount of data to meet your monitoring requirements. If you're collecting data that's not being used for alerting or analysis, you have an opportunity to reduce your monitoring costs by modifying your configuration to stop collecting data that you don't need.

| Recommendation | Description |
|:---|:---|
| Configure diagnostic settings to collect only critical resource log categories from Azure resources. | The data volume for [resource logs](essentials/resource-logs.md) varies significantly between services, so you should only collect the categories that are required. You might also not want to collect platform metrics from Azure resources because this data is already being collected in Metrics. Only configure your diagnostic data to collect metrics if you need metric data in the workspace for more complex analysis with log queries.<br><br>Diagnostic settings don't allow granular filtering of resource logs. You might require certain logs in a particular category but not others. In this case, use [transformations](essentials/data-collection-transformations.md) on the workspace to filter logs that you don't require. You can also filter out the value of certain columns that you don't require to save additional cost.  |
| Configure VM agents to collect only critical events. | Virtual machines can vary significantly in the amount of data they collect, depending on the amount of telemetry generated by the applications and services they have installed. See [the table below](#virtual-machines) for the most common data collected from virtual machines and strategies for limiting them for each of the Azure Monitor agents. |
| Use transformations to filter resource logs and events. | Use [data collection rule transformations in Azure Monitor](essentials//data-collection-transformations.md) to filter incoming data to reduce costs for data ingestion and retention. In addition to filtering records from the incoming data, you can filter out columns in the data, reducing its billable size as described in [Data size calculation](logs/cost-logs.md#data-size-calculation). |
| Ensure that VMs aren't sending data to multiple workspaces. |
| Application insights | There are multiple methods that you can use to limit the amount of data collected by Application Insights. See 


#### Virtual machines




#### Application Insights


| Recommendation | Description |
|:---|:---|
| Use sampling to tune the amount of data collected. | [Sampling](app/sampling.md) is the primary tool you can use to tune the amount of data collected by Application Insights. Use sampling to reduce the amount of telemetry that's sent from your applications with minimal distortion of metrics. |
| Limit the number of Ajax calls. | [Limit the number of Ajax calls](app/javascript.md#configuration) that can be reported in every page view or disable Ajax reporting. If you disable Ajax calls, you'll be disabling [JavaScript correlation](app/javascript.md#enable-distributed-tracing) too. |
| Disable unneeded modules. | [Edit ApplicationInsights.config](app/configuration-with-applicationinsights-config.md) to turn off collection modules that you don't need. For example, you might decide that performance counters or dependency data aren't required. |
| Pre-aggregate metrics from any calls to TrackMetric. | If you put calls to TrackMetric in your application, you can reduce traffic by using the overload that accepts your calculation of the average and standard deviation of a batch of measurements. Alternatively, you can use a [pre-aggregating package](https://www.myget.org/gallery/applicationinsights-sdk-labs). |
| Limit the use of custom metrics. | The Application Insights option to [Enable alerting on custom metric dimensions](app/pre-aggregated-metrics-log-metrics.md#custom-metrics-dimensions-and-pre-aggregation) can increase costs. Using this option can result in the creation of more pre-aggregation metrics. |
| Ensure use of updated SDKs. | Earlier versions of the ASP.NET Core SDK and Worker Service SDK [collect many counters by default](app/eventcounters.md#default-counters-collected), which were collected as custom metrics. Use later versions to specify [only required counters](app/eventcounters.md#customizing-counters-to-be-collected). |




## Reduce the amount of data collected

The configuration change varies depending on the data source. The following sections provide guidance for configuring common data sources to reduce the data they send to the workspace.





### Multi-homing agents

You should be cautious with any configuration using multi-homed agents where a single virtual machine sends data to multiple workspaces because you might be incurring charges for the same data multiple times. If you do multi-home agents, make sure you're sending unique data to each workspace.

You can also collect duplicate data with a single virtual machine running both the Azure Monitor agent and Log Analytics agent, even if they're both sending data to the same workspace. While the agents can coexist, each works independently without any knowledge of the other. Continue to use the Log Analytics agent until you [migrate to the Azure Monitor agent](./agents/azure-monitor-agent-migration.md) rather than using both together unless you can ensure that each is collecting unique data.

See [Analyze usage in Log Analytics workspace](logs/analyze-usage.md) for guidance on analyzing your collected data to make sure you aren't collecting duplicate data for the same machine.



## Other insights and services

See the documentation for other services that store their data in a Log Analytics workspace for recommendations on optimizing their data usage:

- **Container insights**: [Understand monitoring costs for Container insights](containers/container-insights-cost.md#controlling-ingestion-to-reduce-cost)
- **Microsoft Sentinel**: [Reduce costs for Microsoft Sentinel](../sentinel/billing-reduce-costs.md)
- **Defender for Cloud**: [Setting the security event option at the workspace level](../defender-for-cloud/enable-data-collection.md#setting-the-security-event-option-at-the-workspace-level)


### When to use transformations


See the following section on filtering data with transformations for a summary on where to implement filtering and transformations for different data sources.


Use [workspace transformations](essentials/data-collection-transformations.md#workspace-transformation-dcr) to further filter data for workflows where you don't have granular control. For example, you can select categories in a [diagnostic setting](essentials/diagnostic-settings.md) to collect resource logs for a particular service, but that category might also send records that you don't need. Create a transformation for the table that service uses to filter out records you don't want.

You can also use transformations to lower the storage requirements for records you want by removing columns without useful information. For example, you might have error events in a resource log that you want for alerting. But you might not require certain columns in those records that contain a large amount of data. You can create a transformation for the table that removes those columns.

The following table shows methods to apply transformations to different workflows.

> [!NOTE]
> Azure tables here refers to tables that are created and maintained by Microsoft and documented in the [Azure Monitor reference](/azure/azure-monitor/reference/). Custom tables are created by custom applications and have a suffix of *_CL* in their name.

| Source | Target | Description | Filtering method |
|:---|:---|:---|:---|
| Other data sources | Azure tables | Includes resource logs from diagnostic settings and other Azure Monitor features such as Application insights, Container insights, and VM insights. | Configure ingestion-time transformation in the workspace DCR to filter or transform incoming data. |

## Monitor workspace and analyze usage

After you've configured your environment and data collection for cost optimization, you need to continue to monitor it to ensure that you don't experience unexpected increases in billable usage. You should also analyze your usage regularly to determine if you have other opportunities to reduce your usage. For example, you might want to further filter out collected data that hasn't proven to be useful.



| Recommendation | Description |
|:---|:---|
| Send alert when data collection is high. | To avoid unexpected bills, you should be proactively notified anytime you experience excessive usage. Notification allows you to address any potential anomalies before the end of your billing period. See [Send alert when data collection is high](logs/analyze-usage.md#send-alert-when-data-collection-is-high) for details. |
| Consider a daily cap as a preventative measure to ensure that you don't exceed a particular budget. | A [daily cap](logs/daily-cap.md) disables data collection in a Log Analytics workspace for the rest of the day after your configured limit is reached. A daily cap shouldn't be used as a method to reduce costs but as a preventative measure to ensure that you don't exceed a particular budget. Daily caps are typically used by organizations that are particularly cost conscious.<br><br>When data collection stops, you effectively have no monitoring of features and resources relying on that workspace. Instead of relying on the daily cap alone, you can configure an alert rule to notify you when data collection reaches some level before the daily cap. Notification allows you to address any increases before data collection shuts down, or even to temporarily disable collection for less critical resources.<br><br>See [Set daily cap on Log Analytics workspace](logs/daily-cap.md) for information on how the daily cap works and how to configure one. |
| Analyze collected data | When you detect an increase in data collection, you need methods to analyze your collected data to identify the source of the increase. You should also periodically analyze data collection to determine if there's additional configuration that can decrease your usage further. This practice is particularly important when you add a new set of data sources, such as a new set of virtual machines or onboard a new service.<br><br>See [Analyze usage in Log Analytics workspace](logs/analyze-usage.md) for different methods to analyze your collected data and billable usage. This article includes various log queries that will help you identify the source of any data increases and to understand your basic usage patterns. |





## Next steps

- See [Azure Monitor cost and usage](usage-estimated-costs.md)) for a description of Azure Monitor and how to view and analyze your monthly bill.
- See [Azure Monitor Logs pricing details](logs/cost-logs.md) for information on how charges are calculated for data in a Log Analytics workspace and different configuration options to reduce your charges.
- See [Analyze usage in Log Analytics workspace](logs/analyze-usage.md) for information on analyzing the data in your workspace to determine the source of any higher-than-expected usage and opportunities to reduce your amount of data collected.
- See [Set daily cap on Log Analytics workspace](logs/daily-cap.md) to control your costs by setting a daily limit on the amount of data that can be ingested in a workspace.
