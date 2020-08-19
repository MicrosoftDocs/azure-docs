---
title: Logs in Azure Monitor | Microsoft Docs
description: Describes logs in Azure Monitor which are used for advanced analysis of monitoring data.
documentationcenter: ''
author: bwren
manager: carmonm


ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 08/17/2020
ms.author: bwren
---

# Logs in Azure Monitor
Azure Monitor Logs is a feature of Azure Monitor that collects and organizes log data from a variety of sources and makes it available for analysis using a sophisticated query language. Azure Monitor Logs supports 


Logs in Azure Monitor contain different kinds of data organized into records with a different schema for each type.


 Logs can contain numeric values like Azure Monitor Metrics but typically contain text data with detailed descriptions. They further differ from metric data in that they vary in their structure and are often not collected at regular intervals. Telemetry such as events and traces are stored Azure Monitor Logs in addition to performance data so that it can all be combined for analysis.

## Relationship to Azure Monitor Metrics
Azure Monitor Metrics stores numeric data in a time-series database which makes this data more lightweight than Azure Monitor Logs and capable of supporting near real-time scenarios making them particularly useful for alerting and fast detection of issues. Metrics though can only store numeric data in a particular structure, while Logs can store a variety of different data types each with their own structure. You can also perform complex analysis on Logs data using log queries which cannot be used for analysis of Metrics data.

Numeric data is often sent from data sources to Logs in addition to Metrics. While there is an additional charge for collecting and retaining this data in Logs, it allows you to include metric data in log queries and analyze it with your other monitoring data.


## Relationship to Azure Data Explorer
Azure Monitor Logs is based on Azure Data Explorer. A Log Analytics workspace is roughly the equivalent of a database in Azure Data Explorer, tables are structured the same, and both use the same Kusto Query Language (KQL). The experience of using Log Analytics to work with Azure Monitor queries in the Azure portal is similar to the experience using the Azure Data Explorer Web UI. You can even [include data from a Log Analytics workspace in an Azure Data Explorer query](/azure/data-explorer/query-monitor-data). 



## How is data in Azure Monitor Logs structured?
Data collected by Azure Monitor Logs is stored in a [Log Analytics workspace](./design-logs-deployment.md) that contains multiple tables that each store data from a particular source. The workspace defines the geographic location of the data, access rights defining which users can access data, and configuration settings such as the pricing tier and data retention. You may use a single workspace for all of your monitoring data or create multiple workspaces depending on your requirements. See [Designing your Azure Monitor Logs deployment](design-logs-deployment.md) on considerations for creating multiple workspaces.

Each workspace contains multiple tables are that are organized into separate columns with multiple rows of data. Each table is defined by a unique set of columns that are shared by the rows of data provided by the data source. 

![Azure Monitor Logs structure](media/data-platform-logs/logs-structure.png)

Log data from Application Insights also uses Azure Monitor Logs but isn't stored in a Log Analytics workspace. Its data is structured the same and uses the same query language, and you create and run queries using the same Log Analytics tool in the Azure portal. Data for each monitored application though is stored separately, and each has a standard set of tables to hold data such as application requests, exceptions, and page views.

> [!NOTE]
> [Workspace-based Application Insights resources](../app/create-workspace-resource.md) are now in public preview. This stores Application Insights data in a Log Analytics workspace with your other monitoring data and can combine the data for multiple applications in a single workspace. 


## What can you do with Azure Monitor Logs?
The following table lists the different ways that you can use Logs in Azure Monitor.


|  | Description |
|:---|:---|
| **Analyze** | Use [Log Analytics](../log-query/get-started-portal.md) in the Azure portal to write [log queries](../log-query/log-query-overview.md) and interactively analyze log data using the powerful Data Explorer analysis engine.<br>Use the [Application Insights analytics console](../log-query/log-query-overview.md) in the Azure portal to write log queries and interactively analyze log data from Application Insights. |
| **Visualize** | Pin query results rendered as tables or charts to an [Azure dashboard](../../azure-portal/azure-portal-dashboards.md).<br>Create a [workbook](./workbooks-overview.md) to combine with multiple sets of data in an interactive report. <br>Export the results of a query to [Power BI](powerbi.md) to use different visualizations and share with users outside of Azure.<br>Export the results of a query to [Grafana](grafana-plugin.md) to leverage its dashboarding and combine with other data sources.|
| **Alert** | Configure a [log alert rule](alerts-log.md) that sends a notification or takes [automated action](action-groups.md) when the results of the query match a particular result.<br>Configure a [metric alert rule](alerts-metric-logs.md) on certain log data logs extracted as metrics. |
| **Retrieve** | Access log query results from a command line using [Azure CLI](/cli/azure/ext/log-analytics/monitor/log-analytics).<br>Access log query results from a command line using [PowerShell cmdlets](/powershell/module/az.operationalinsights).<br>Access log query results from a custom application using [REST API](https://dev.loganalytics.io/). |
| **Export** | Build a workflow to retrieve log data and copy it to an external location using [Logic Apps](../../logic-apps/index.yml). |




## Sources of Azure Monitor Logs
Azure Monitor can collect log data from a variety of sources both within Azure and from on-premises resources. The following tables list the different data sources available from different resources that write data to Azure Monitor Logs. Each has a link to details on any required configuration.

### Azure tenant and subscription

| Data | Description |
|:---|:---|
| Azure Active Directory audit logs | Configured through Diagnostic settings for each directory. See [Integrate Azure AD logs with Azure Monitor logs](../../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md).  |
| Activity logs | Stored separately by default and can be used for near real time alerts. Install Activity log Analytics solution to write to Log Analytics workspace. See [Collect and analyze Azure activity logs in Log Analytics](./activity-log.md). |

### Azure resources

| Data | Description |
|:---|:---|
| Resource diagnostics | Configure Diagnostic settings to write to diagnostic data, including metrics to a Log Analytics workspace. See [Stream Azure resource logs to Log Analytics](./resource-logs.md#send-to-log-analytics-workspace). |
| Monitoring solutions | Monitoring solutions write data they collect to their Log Analytics workspace. See [Data collection details for management solutions in Azure](../monitor-reference.md) for a list of solutions. See [Monitoring solutions in Azure Monitor](../insights/solutions.md) for details on installing and using solutions. |
| Metrics | Send platform metrics for Azure Monitor resources to a Log Analytics workspace to retain log data for longer periods and to perform complex analysis with other data types using the [Kusto query language](/azure/kusto/query/). See [Stream Azure resource logs to Log Analytics](./resource-logs.md#send-to-azure-storage). |
| Azure table storage | Collect data from Azure storage where some Azure resources write monitoring data. See  [Use Azure blob storage for IIS and Azure table storage for events with Log Analytics](diagnostics-extension-logs.md). |

### Virtual Machines

| Data | Description |
|:---|:---|
|  Agent data sources | Data sources collected from [Windows](agent-windows.md) and [Linux](../learn/quick-collect-linux-computer.md) agents include events, performance data, and custom logs. See [Agent data sources in Azure Monitor](data-sources.md) for a list of data sources and details on configuration. |
| Monitoring solutions | Monitoring solutions write data they collect from agents to their Log Analytics workspace. See [Data collection details for management solutions in Azure](../monitor-reference.md) for a list of solutions. See [Monitoring solutions in Azure Monitor](../insights/solutions.md) for details on installing and using solutions. |
| System Center Operations Manager | Connect Operations Manager management group to Azure Monitor to collect event and performance data from on-premises agents into logs. See [Connect Operations Manager to Log Analytics](om-agents.md) for details on this configuration. |


### Applications

| Data | Description |
|:---|:---|
| Requests and exceptions | Detailed data about application requests and exceptions are in the  _requests_, _pageViews_, and _exceptions_ tables. Calls to [external components](../app/asp-net-dependencies.md) are in the _dependencies_ table. |
| Usage and performance | Performance for the application is available in the _requests_, _browserTimings_ and _performanceCounters_ tables. Data for [custom metrics](../app/api-custom-events-metrics.md#trackevent) is in the _customMetrics_ table.|
| Trace data | Results from [distributed tracing](../app/distributed-tracing.md) are stored in the _traces_ table. |
| Availability tests | Summary data from [availability tests](../app/monitor-web-app-availability.md) is stored in the _availabilityResults_ table. Detailed data from these tests are in separate storage and accessed from  Application Insights in the Azure portal. |

### Insights

| Data | Description |
|:---|:---|
| Azure Monitor for containers | Inventory and performance data collected by [Azure Monitor for containers](../insights/container-insights-overview.md). See [Container data-collection details](../insights/container-insights-log-search.md#container-records) for a list of the tables. |
| Azure Monitor for VMs | Map and performance data collected by [Azure Monitor for VMs](../insights/vminsights-overview.md). See [How to query logs from Azure Monitor for VMs](../insights/vminsights-log-search.md) for details on querying this data. |

### Custom 

| Data | Description |
|:---|:---|
| REST API | Write data to a Log Analytics workspace from any REST client. See [Send log data to Azure Monitor with the HTTP Data Collector API](data-collector-api.md) for details.
| Logic App | Write any data to a Log Analytics workspace from a Logic App workflow with the **Azure Log Analytics Data Collector** action. |

### Security

| Data | Description |
|:---|:---|
| Azure Security Center | [Azure Security Center](../../security-center/index.yml) stores data that it collects in a Log Analytics workspace where it can be analyzed with other log data. See [Data collection in Azure Security Center](../../security-center/security-center-enable-data-collection.md) for details on workspace configuration. |
| Azure Sentinel | [Azure Sentinel](../../sentinel/index.yml) stores data from data sources into a Log Analytics workspace. See [Connect data sources](../../sentinel/connect-data-sources.md).  |


## Next steps

- Learn more about the [Azure Monitor data platform](data-platform.md).
- Learn about [metrics in Azure Monitor](data-platform-metrics.md).
- Learn about the [monitoring data available](data-sources.md) for different resources in Azure.

