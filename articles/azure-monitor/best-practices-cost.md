---
title: Azure Monitor best practices - Cost management
description: Guidance and recommendations for reducing your cost for Azure Monitor.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 03/08/2022

---

# Azure Monitor best practices - Cost management
This article provides guidance on reducing your cloud monitoring costs by implementing and managing Azure Monitor in the most cost effective manner. This includes leveraging cost saving features and ensuring that you're not paying for data collection that provides little or no value. It also provides guidance for detecting and analyzing excessive usage. 






## Configure

### Configure pricing tier or dedicated cluster
By default, your workspace will use Pay-As-You-Go pricing with no minimum data volume. If you collect a sufficient amount of data, you can significantly decrease your cost by configuring a commitment tier. See [Azure Monitor Logs pricing details](logs/cost-logs.md) for details on commitment tiers and guidance on determining which is most appropriate for you  environment.

[Dedicated clusters](logs/logs-dedicated-clusters.md) provide additional functionality and cost savings if you ingest at least 500 GB per day, collectively among multiple workspaces in the same region. Unlike commitment tiers, workspaces in a dedicated cluster don't need to individually reach the 500 GB.

### Determine most cost effective workspace configuration
There can be cost implications when you combine different services such as operational data from Azure Monitor and security data from Azure Sentinel and Microsoft Defender for Cloud. See [Azure Monitor Logs pricing details](logs/cost-logs.md) for a description of these implications and guidance on determining your most cost effective configuration.

### Configure Basic Logs for low value tables (preview)
Use [Basic Logs](logs/basic-logs-configure.md) to save on the cost of storing high-volume verbose logs you use for debugging, troubleshooting and auditing, but not for analytics and alerts. Tables configured for Basic Logs have a lower ingestion cost in exchange for reduced features. 

### Reduce long-term retention with Archived Logs (preview)
Data collected in a Log Analytics workspace is retained for 31 days at no charge (90 days if Azure Sentinel is enabled on the workspace). You incur retention charges for any data that you retain beyond this duration.

For data that you need to retain long-term for compliance or occasional investigation, configure [Archived Logs](logs/data-retention-archive.md) which allows you to retain data at a significantly reduced cost.

### Optimize alert rules









## Data collection

### Reduce the amount of data collected
The most straightforward strategy to reduce your costs for data ingestion and retention is to reduce the amount of data that you collect. Your goal should be to collect the minimal amount of data to meet your monitoring requirements. If you find that you're collecting data that's not being used for alerting or analysis, then you have an opportunity to reduce your monitoring costs by modifying your configuration to stop collecting data that you don't need.

The configuration change will vary depending on the data source. The following table provides guidance for configuring the most common data sources to reduce the data they send to the workspace.

#### Virtual machines

| Source | Strategy | Log Analytics agent | Azure Monitor agent |
|:---|:---|:---|:---|
| Event logs | - Reduce the number of event logs collected. <br> - Collect only required event levels. For example, do not collect *Information* level events. | Change the [event log configuration for the workspace](agents/data-sources-windows-events.md) | Change the [data collection rule](agents/data-collection-rule-azure-monitor-agent.md).  Use [custom XPath queries](agents/data-collection-rule-azure-monitor-agent.md#limit-data-collection-with-custom-xpath-queries) to filter specific event IDs. |
| Syslog | - Reduce the number of facilities collected. <br> - Collect only required event levels. For example, do not collect *Info* and *Debug* level events. | Change the [syslog configuration for the workspace](agents/data-sources-syslog.md). |  Change the [data collection rule](agents/data-collection-rule-azure-monitor-agent.md).  Use [custom XPath queries](agents/data-collection-rule-azure-monitor-agent.md#limit-data-collection-with-custom-xpath-queries) to filter specific events. |
| Performance counters | - Reduce the frequency of collection. <br> - Reduce the number of performance counters. | Change the [performance counter configuration for the workspace](agents/data-sources-performance-counters.md). | Change the [data collection rule](agents/data-collection-rule-azure-monitor-agent.md).  Use [custom XPath queries](agents/data-collection-rule-azure-monitor-agent.md#limit-data-collection-with-custom-xpath-queries) to filter specific counters. |


### Caution when multi-homing agents

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


### Reduce data collection with Archive Logs (preview)
Because you're charged for ingestion and retention for any data you collect in your Log Analytics workspace, you can reduce your costs by reducing the amount of data you collect. The following table lists common sources of data and strategies for reducing their data volume.


### Filter data with transformations (preview)
Ingestion-time transformations allow you to filter incoming data, allowing you to reduce costs for data ingestion and retention. In addition to filtering records from the incoming data, you can filter out columns in the data, reducing its size as described in [Data size calculation](logs/cost-logs.md#data-size-calculation).

Use ingestion-time transformations on the workspace to further filter data for workflows where you don't have granular control. For example, you can select categories to collect for a particular service in a diagnostic setting, but that category might send a variety of logs that you don't need. Create a transformation for the table that service uses to filter out records you don't want.

You can also ingestion-time transformations to lower the storage requirements for records you want by removing columns without useful information. For example, you might have error events in a resource log that you want for alerting, but you don't require certain columns in those records that contain a large amount of data. Create a transformation for the table that removes those columns.

See the following table for methods to apply transformations to different workflows.

| Source | Target | Description | Filtering method |
|:---|:---|:---|:---|
| Azure Monitor agent | Built-in tables | Collect data from standard sources such as Windows events, syslog, and performance data and send to built-in tables in Log Analytics workspace. | Use XPath in DCR to collect specific data from client machine. Ingestion-time transformations in agent DCR are not yet supported. |
| Log Analytics agent | Built-in tables | Collect data from standard sources such as Windows events, syslog, and performance data and send to built-in tables in Log Analytics workspace. | Configure data collection on the workspace. Optionally, create ingestion-time transformation in the workspace DCR to filter records and columns. |
| Azure Monitor agent | Custom tables | Collecting data outside of standard data sources is not yet supported. | |
| Log Analytics agent | Custom tables | Configure [custom logs](agents/data-sources-custom-logs.md) on the workspace to collect file based text logs. | Configure ingestion-time transformation in the workspace DCR to filter or transform incoming data. You must first migrate the custom table to the new custom logs API. |
| Data Collector API | Custom tables | Use [Data Collector API](logs/data-collector-api.md) to send data to custom tables in the workspace using REST API. | Configure ingestion-time transformation in the workspace DCR to filter or transform incoming data. You must first migrate the custom table to the new custom logs API. |
| Custom Logs API | Custom tables<br>Built-in tables | Use [Custom Logs API](logs/custom-logs-overview.md) to send data to custom tables in the workspace using REST API. | Configure ingestion-time transformation in the DCR for the custom log. |
| Other data sources | Built-in tables | Includes resource logs from diagnostic settings and other Azure Monitor features such as Application insights, Container insights and VM insights. | Configure ingestion-time transformation in the workspace DCR to filter or transform incoming data. |


### Manage Application Insights data volume
The volume of data you send can be managed using the following techniques:

* **Sampling**: You can use sampling to reduce the amount of telemetry that's sent from your server and client apps, with minimal distortion of metrics. Sampling is the primary tool you can use to tune the amount of data you send. Learn more about [sampling features](app/sampling.md).

* **Limit Ajax calls**: You can [limit the number of Ajax calls that can be reported](app/javascript.md#configuration) in every page view, or switch off Ajax reporting. Disabling Ajax calls will disable [JavaScript correlation](app/javascript.md#enable-correlation).

* **Disable unneeded modules**: [Edit ApplicationInsights.config](app/configuration-with-applicationinsights-config.md) to turn off collection modules that you don't need. For example, you might decide that performance counters or dependency data are inessential.

* **Pre-aggregate metrics**: If you put calls to TrackMetric in your app, you can reduce traffic by using the overload that accepts your calculation of the average and standard deviation of a batch of measurements. Or, you can use a [pre-aggregating package](https://www.myget.org/gallery/applicationinsights-sdk-labs).


The Application Insights option to [Enable alerting on custom metric dimensions](app/pre-aggregated-metrics-log-metrics.md#custom-metrics-dimensions-and-pre-aggregation) can also increase costs because this can result in the creation of more pre-aggregation metrics. Learn more about log-based and pre-aggregated metrics in Application Insights and about pricing for Azure Monitor custom metrics.


### Limit logs used for troubleshooting





## Monitor

### Causes of higher than expected usage
### Monitor workspace for high data collection
You should regularly monitor your workspace to understand its usage patterns and be proactively alerted whenever usage abruptly increases. This is particularly important when you add a new set of data sources, such as a new set of virtual machines or onboard a new service. 

You should regularly 

### Understand data being collected
### Set a daily cap for Log Analytics workspace and Application Insights













## Next steps

- See [Configure data collection](best-practices-data-collection.md) for steps and recommendations to configure data collection in Azure Monitor.
