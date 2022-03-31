---
title: Azure Monitor best practices - Cost management
description: Guidance and recommendations for reducing your cost for Azure Monitor.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 03/31/2022

---

# Azure Monitor best practices - Cost management
This article provides guidance on reducing your cloud monitoring costs by implementing and managing Azure Monitor in the most cost effective manner. This includes leveraging cost saving features and ensuring that you're not paying for data collection that provides little or no value. It also provides guidance for regularly monitoring your usage so that you can proactively detect and identify sources responsible for excessive usage.


## Configure workspaces
You can start using Azure Monitor with a single Log Analytics workspace using default options. As your monitoring environment grows, you will need to make decisions about whether to have multiple services share a single workspace or create multiple workspaces, and you want to evaluate configuration options that allow you to reduce your monitoring costs.

### Configure pricing tier or dedicated cluster
By default, your workspace will use Pay-As-You-Go pricing with no minimum data volume. If you collect a sufficient amount of data, you can significantly decrease your cost by using a [commitment tier](logs/cost-logs.md#commitment-tiers). [Dedicated clusters](logs/logs-dedicated-clusters.md) provide additional functionality and cost savings if you ingest at least 500 GB per day, collectively among multiple workspaces in the same region. Unlike commitment tiers, workspaces in a dedicated cluster don't need to individually reach the 500 GB.

See [Azure Monitor Logs pricing details](logs/cost-logs.md) for details on commitment tiers and guidance on determining which is most appropriate for you  environment. See [Usage and estimated costs](usage-estimated-costs.md#usage-and-estimated-costs) to view estimated costs for your usage at different pricing tiers.

### Determine most cost effective workspace configuration
There can be cost implications when you combine different services such as operational data from Azure Monitor and security data from Azure Sentinel and Microsoft Defender for Cloud. See [Azure Monitor Logs pricing details](logs/cost-logs.md) for a description of these implications and guidance on determining your most cost effective configuration.


## Configure tables 
Aside from [tables that don't incur charges](logs/cost-logs.md#data-size-calculation), all data in a Log Analytics workspace is billed at the same rate. You may be collecting data though that you query infrequently or that you need to archive for compliance but rarely access. 

### Configure data retention and archiving
Data collected in a Log Analytics workspace is retained for 31 days at no charge (90 days if Azure Sentinel is enabled on the workspace). You incur retention charges for any data that you retain beyond this duration. 

You may need to retain data beyond the default for trending analysis or other reporting. Your retention requirement may just be for compliance reasons for for occasional investigation or analysis of historical data. In this case, you should configure [Archived Logs](logs/data-retention-archive.md) which allows you to retain data long term (up to 7 years) at a significantly reduced cost. There is a cost to search archived data or temporarily restore it for analysis.

You can configure retention and archiving for all tables in a workspace or configure each table separately. This allows you to optimize your costs by setting only the retention you require for each data type. 

### Configure Basic Logs for tables requireing minimal queries (preview)
You can save on data ingestion costs by configuring [certain tables](logs/basic-logs-configure.md#which-tables-support-basic-logs) in your Log Analytics workspace that you primarily use for debugging, troubleshooting and auditing as [Basic Logs](logs/basic-logs-configure.md). Tables configured for Basic Logs have a lower ingestion cost in exchange for reduced features. They can't be used for alerting, their retention is set to 8 days, they support a limited version of the query language, and there is a cost for querying them. If you query these tables infrequently though, this query cost can be more than offset by the reduced ingestion cost.

The decision whether to configure a table for Basic Logs is based on the following criteria:

- The table currently support Basic Logs.
- You don't require more than eight days of data retention for the table.
- You only require basic queries of the data using a limited version of the query language.
- The cost savings for data ingestion over a month exceeds the expected cost for any queries

See [Query Basic Logs in Azure Monitor (Preview)](/logs/basic-logs-query.md) for details on query limitations and [Configure Basic Logs in Azure Monitor (Preview)](logs/basic-logs-configure.md) for more details about them.

## Reduce the amount of data collected
The most straightforward strategy to reduce your costs for data ingestion and retention is to reduce the amount of data that you collect. Your goal should be to collect the minimal amount of data to meet your monitoring requirements. If you find that you're collecting data that's not being used for alerting or analysis, then you have an opportunity to reduce your monitoring costs by modifying your configuration to stop collecting data that you don't need.

The configuration change will vary depending on the data source. The following table provides guidance for configuring the most common data sources to reduce the data they send to the workspace.

### Virtual machines

| Source | Strategy | Log Analytics agent | Azure Monitor agent |
|:---|:---|:---|:---|
| Event logs | - Reduce the number of event logs collected. <br> - Collect only required event levels. For example, do not collect *Information* level events. | Change the [event log configuration for the workspace](agents/data-sources-windows-events.md) | Change the [data collection rule](agents/data-collection-rule-azure-monitor-agent.md).  Use [custom XPath queries](agents/data-collection-rule-azure-monitor-agent.md#limit-data-collection-with-custom-xpath-queries) to filter specific event IDs. |
| Syslog | - Reduce the number of facilities collected. <br> - Collect only required event levels. For example, do not collect *Info* and *Debug* level events. | Change the [syslog configuration for the workspace](agents/data-sources-syslog.md). |  Change the [data collection rule](agents/data-collection-rule-azure-monitor-agent.md).  Use [custom XPath queries](agents/data-collection-rule-azure-monitor-agent.md#limit-data-collection-with-custom-xpath-queries) to filter specific events. |
| Performance counters | - Reduce the frequency of collection. <br> - Reduce the number of performance counters. | Change the [performance counter configuration for the workspace](agents/data-sources-performance-counters.md). | Change the [data collection rule](agents/data-collection-rule-azure-monitor-agent.md).  Use [custom XPath queries](agents/data-collection-rule-azure-monitor-agent.md#limit-data-collection-with-custom-xpath-queries) to filter specific counters. |


### Caution when multi-homing agents
You should be cautious with any configuration using multi-homed agents where a single virtual machine sends data to multiple workspaces since you may be incurring charges for the same data multiple times. If you do multi-home agents, ensure that you're sending unique data to each workspace. 

You can also collect duplicate data with a single virtual machine running both the Azure Monitor agent and Log Analytics agent, even if they're both sending data to the same workspace. While the agents can coexist, each works independently without any knowledge of the other. You should continue to use the Log Analytics agent until you [migrate to the Azure Monitor agent](logs/../agents/azure-monitor-agent-migration.md) rather than using both together.

See [Analyze usage in Log Analytics workspace](logs/analyze-usage.md) for guidance on analyzing your collected data to ensure that you aren't collecting duplicate data for the same machine.


#### Azure Monitor features

| Source | Strategy |
|:---|:---|
| Resource logs | Change the [diagnostic settings](essentials/diagnostic-settings.md#create-in-azure-portal) to: <br> - Reduce the number of resources that send logs to Log Analytics. <br> - Collect only required logs.<br> - Use [ingesting-time transformations](logs/ingestion-time-transformations.md) on the workspace to filter log data that isn't required. |
| Application Insights | See [Manage Application Insights data volume](#manage-application-insights-data-volume). |
| Container insights | See [Controlling ingestion to reduce cost](containers/container-insights-cost.md#controlling-ingestion-to-reduce-cost) for guidance on reducing the amount of data sent from Container insights. |
| [SQL Analytics](insights/azure-sql.md) | Use [Set-AzSqlServerAudit](/powershell/module/az.sql/set-azsqlserveraudit) to tune the auditing settings.

#### Other Azure services

| Source | Strategy |
|:---|:---|
| Defender for Cloud | Select [common or minimal security events](../security-center/security-center-enable-data-collection.md#data-collection-tier). |
| Microsoft Sentinel | Review any [Sentinel data sources](../sentinel/connect-data-sources.md) that you recently enabled as sources of additional data volume. See [Reduce costs for Microsoft Sentinel](../sentinel/billing-reduce-costs.md) for other strategies to reduce Sentinel costs. |



### Only collect metric data if used
[Platform metrics](essentials/data-platform-metrics.md) are collected from Azure resources at no cost. You can create a [diagnostic setting](essentials/diagnostic-settings.md) to send this same metric data to a Log Analytics workspace, which can be valuable to analyze it using log queries. You should only

 You can also send performance data from virtual machines to Metrics using [Azure Monitor agent](agents/azure-monitor-agent-overview.md). In both of these scenarios, you can also send that same data to a Log Analytics workspace. 




### Filter data with transformations (preview)
[Data collection rule transformations in Azure Monitor](essentials/data-collection-rule-transformations.md) allow you to filter incoming data to reduce costs for data ingestion and retention. In addition to filtering records from the incoming data, you can filter out columns in the data, reducing its size as described in [Data size calculation](logs/cost-logs.md#data-size-calculation).

Use ingestion-time transformations on the workspace to further filter data for workflows where you don't have granular control. For example, you can select categories to collect for a particular service in a diagnostic setting, but that category might send a variety of logs that you don't need. Create a transformation for the table that service uses to filter out records you don't want.

You can also ingestion-time transformations to lower the storage requirements for records you want by removing columns without useful information. For example, you might have error events in a resource log that you want for alerting, but you don't require certain columns in those records that contain a large amount of data. Create a transformation for the table that removes those columns.

See the following table for methods to apply transformations to different workflows.

| Source | Target | Description | Filtering method |
|:---|:---|:---|:---|
| Azure Monitor agent | Built-in tables | Collect data from standard sources such as Windows events, syslog, and performance data and send to built-in tables in Log Analytics workspace. | Use XPath in DCR to collect specific data from client machine. Ingestion-time transformations in agent DCR are not yet supported. |
| Azure Monitor agent | Custom tables | Collecting data outside of standard data sources is not yet supported. | |
| Log Analytics agent | Built-in tables | Collect data from standard sources such as Windows events, syslog, and performance data and send to built-in tables in Log Analytics workspace. | Configure data collection on the workspace. Optionally, create ingestion-time transformation in the workspace DCR to filter records and columns. |
| Log Analytics agent | Custom tables | Configure [custom logs](agents/data-sources-custom-logs.md) on the workspace to collect file based text logs. | Configure ingestion-time transformation in the workspace DCR to filter or transform incoming data. You must first migrate the custom table to the new custom logs API. |
| Data Collector API | Custom tables | Use [Data Collector API](logs/data-collector-api.md) to send data to custom tables in the workspace using REST API. | Configure ingestion-time transformation in the workspace DCR to filter or transform incoming data. You must first migrate the custom table to the new custom logs API. |
| Custom Logs API | Custom tables<br>Built-in tables | Use [Custom Logs API](logs/custom-logs-overview.md) to send data to custom tables in the workspace using REST API. | Configure ingestion-time transformation in the DCR for the custom log. |
| Other data sources | Built-in tables | Includes resource logs from diagnostic settings and other Azure Monitor features such as Application insights, Container insights and VM insights. | Configure ingestion-time transformation in the workspace DCR to filter or transform incoming data. |


### Manage Application Insights data volume
There are multiple methods that you can use to limit the amount of data collected by Application Insights.

* **Sampling**: Use [sampling](app/sampling.md) to reduce the amount of telemetry that's sent from your server and client apps, with minimal distortion of metrics. Sampling is the primary tool you can use to tune the amount of data you send.

* **Limit Ajax calls**: [Limit the number of Ajax calls](app/javascript.md#configuration) that can be reported in every page view, or switch off Ajax reporting. Disabling Ajax calls will disable [JavaScript correlation](app/javascript.md#enable-correlation).

* **Disable unneeded modules**: [Edit ApplicationInsights.config](app/configuration-with-applicationinsights-config.md) to turn off collection modules that you don't need. For example, you might decide that performance counters or dependency data aren't required.

* **Pre-aggregate metrics**: If you put calls to TrackMetric in your app, you can reduce traffic by using the overload that accepts your calculation of the average and standard deviation of a batch of measurements. Or, you can use a [pre-aggregating package](https://www.myget.org/gallery/applicationinsights-sdk-labs).

* **Limit the use of custom metrics**: The Application Insights option to [Enable alerting on custom metric dimensions](app/pre-aggregated-metrics-log-metrics.md#custom-metrics-dimensions-and-pre-aggregation) can increase costs because this can result in the creation of more pre-aggregation metrics.

* **Ensure use of updated SDKs**: Earlier version of the ASP.NET Core SDK and Worker Service SDK [collect a large number of counters by default](app/eventcounters#default-counters-collected.md) which collected as custom metrics. Use later versions to specify [only required counters](app/eventcounters#default-counters-collected.md#customizing-counters-to-be-collected).




## Monitor workspace for high data collection
Even if you've configured your environment and data collection for cost optimization, you need monitoring in place to ensure that you maintain that optimization and don't incur any unexpected charges. This includes being alerted when you experience excessive data collection and even having the option of shutting down data collection to ensure that you incur unexpected charges. You also need tools to quickly identify the source of any data increase so that you can mitigate any increased charges.


### Causes of higher than expected usage
Increased Azure Monitor charges are typically going to be a result of increased data collection. This will 

### Set a daily cap
A [daily cap](logs/daily-cap.md) disables data collection in a Log Analytics workspace for the rest of the day once your configured limit is reached. This should not be used as a method to reduce costs, but rather used as a preventative measure to ensure that you don't exceed a particular budget. This can be useful though if your organization is particularly cost conscious. 

When data collection stops, you effectively have no monitoring of features and resources relying on that workspace. Rather than just relying on the daily cap alone, you can configure an alert rule to notify you when data collection reaches some level before the daily cap. This allows you address any increases before data collection shuts down, or even to temporarily disable collection for less critical resources.

See [Set daily cap on Log Analytics workspace](logs/daily-cap.md) for details on how the daily cap works and how to configure one.
## Alert data collection is high
In order to avoid unexpected bills, you should be proactively notified any time you experience excessive usage. This allows you to address any potential anomalies before the end of your billing period. When you receive an alert, use the guidance in this article to determine why usage is higher than expected and make appropriate changes before you incur additional charges.

The following example is a [log alert rule](../alerts/alerts-unified-log.md) that sends an alert if the billable data volume ingested in the last 24 hours was greater than 50 GB. Modify the **Alert Logic** to use a different threshold based on expected usage in your environment.

| Setting | Value |
|:---|:---|
| **Scope** | |
| Target scope | Select your Log Analytics workspace. |
| **Condition** | |
| Query | `Usage \| where IsBillable \| summarize DataGB = sum(Quantity / 1000.)` |
| Measurement | Measure: *DataGB*<br>Aggregation type: Total<br>Aggregation granularity: 1 day |
| Alert Logic | Operator: Greater than<br>Threshold value: 50<br>Frequency of evaluation: 1 day |
| Actions | Select or add an [action group](../alerts/action-groups.md) to notify you when the threshold is exceeded. |
| **Details** | |
| Severity| Warning |
| Alert rule name | Billable data volume greater than 50 GB in 24 hours |

See [Analyze usage in Log Analytics workspace](logs/analyze-usage.md) for details on using log queries like the one used here to analyze billable usage in your workspace.


## Understand your collected data
When you detect an increase in data collection, then you need methods to analyze your collected data to identify the source of the increase. You should also periodically analyze data collection to determine if there's additional configuration that can decrease your usage further. This is particularly important when you add a new set of data sources, such as a new set of virtual machines or onboard a new service. 


## Next steps

- See [Azure Monitor cost and usage](usage-estimated-costs.md)) for a description of Azure Monitor and how to view and analyze your monthly bill.
