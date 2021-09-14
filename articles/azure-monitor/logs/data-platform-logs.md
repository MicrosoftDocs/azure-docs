---
title: Azure Monitor Logs
description: Learn the basics of Azure Monitor Logs, which is used for advanced analysis of monitoring data.
documentationcenter: ''
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.date: 10/22/2020
ms.author: bwren
---

# Azure Monitor Logs overview
Azure Monitor Logs is a feature of Azure Monitor that collects and organizes log and performance data from [monitored resources](../monitor-reference.md). Data from multiple sources can be consolidated into a single workspace. These sources include:

- [Platform logs](../essentials/platform-logs-overview.md) from Azure services.
- Log and performance data from [virtual machine agents](../agents/agents-overview.md).
- Usage and performance data from [applications](../app/app-insights-overview.md). 

You can then analyze the data by using a sophisticated query language that's capable of quickly analyzing millions of records. 

You might perform a simple query that retrieves a specific set of records or perform sophisticated data analysis to identify critical patterns in your monitoring data. Work with log queries and their results interactively by using Log Analytics, use them in alert rules to be proactively notified of issues, or visualize their results in a workbook or dashboard.

> [!NOTE]
> Azure Monitor Logs is one half of the data platform that supports Azure Monitor. The other is [Azure Monitor Metrics](../essentials/data-platform-metrics.md), which stores numeric data in a time-series database. Numeric data is more lightweight than data in Azure Monitor Logs. Azure Monitor Metrics can support near real-time scenarios, so it's useful for alerting and fast detection of issues. 
>
> Azure Monitor Metrics can only store numeric data in a particular structure, whereas Azure Monitor Logs can store a variety of data types that have their own structures. You can also perform complex analysis on Azure Monitor Logs data by using log queries, which can't be used for analysis of Azure Monitor Metrics data.

## What can you do with Azure Monitor Logs?
The following table describes some of the ways that you can use Azure Monitor Logs:

|  | Description |
|:---|:---|
| **Analyze** | Use [Log Analytics](./log-analytics-tutorial.md) in the Azure portal to write [log queries](./log-query-overview.md) and interactively analyze log data by using a powerful analysis engine. |
| **Alert** | Configure a [log alert rule](../alerts/alerts-log.md) that sends a notification or takes [automated action](../alerts/action-groups.md) when the results of the query match a particular result. |
| **Visualize** | Pin query results rendered as tables or charts to an [Azure dashboard](../../azure-portal/azure-portal-dashboards.md).<br>Create a [workbook](../visualize/workbooks-overview.md) to combine with multiple sets of data in an interactive report. <br>Export the results of a query to [Power BI](../visualize/powerbi.md) to use different visualizations and share with users outside Azure.<br>Export the results of a query to [Grafana](../visualize/grafana-plugin.md) to use its dashboarding and combine with other data sources.|
| **Get insights** | Support [insights](../monitor-reference.md#insights-and-core-solutions) that provide a customized monitoring experience for particular applications and services.  |
| **Retrieve** | Access log query results from a command line by using the [Azure CLI](/cli/azure/monitor/log-analytics).<br>Access log query results from a command line by using [PowerShell cmdlets](/powershell/module/az.operationalinsights).<br>Access log query results from a custom application by using the [REST API](https://dev.loganalytics.io/). |
| **Export** | Configure [automated export of log data](./logs-data-export.md) to an Azure storage account or Azure Event Hubs.<br>Build a workflow to retrieve log data and copy it to an external location by using [Azure Logic Apps](./logicapp-flow-connector.md). |

![Diagram that shows an overview of Azure Monitor Logs.](media/data-platform-logs/logs-overview.png)

## Data collection
After you create a Log Analytics workspace, you must configure sources to send their data. No data is collected automatically. 

This configuration will be different depending on the data source. For example:

- [Create diagnostic settings](../essentials/diagnostic-settings.md) to send resource logs from Azure resources to the workspace. 
- [Enable VM insights](../vm/vminsights-enable-overview.md) to collect data from virtual machines. 
- [Configure data sources on the workspace](../agents/data-sources.md) to collect more events and performance data.

For a complete list of data sources that you can configure to send data to Azure Monitor Logs, see [What is monitored by Azure Monitor?](../monitor-reference.md).

## Log Analytics and workspaces
Log Analytics is a tool in the Azure portal. Use it to edit and run log queries and interactively analyze their results. You can then use those queries to support other features in Azure Monitor, such as log query alerts and workbooks. Access Log Analytics from the **Logs** option on the Azure Monitor menu or from most other services in the Azure portal.

For a description of Log Analytics, see [Overview of Log Analytics in Azure Monitor](./log-analytics-overview.md). To walk through using Log Analytics features to create a simple log query and analyze its results, see [Log Analytics tutorial](./log-analytics-tutorial.md).

Azure Monitor Logs stores the data that it collects in one or more [Log Analytics workspaces](./design-logs-deployment.md). A workspace defines:

- The geographic location of the data.
- Access rights that define which users can access data.
- Configuration settings such as the pricing tier and data retention.  

You must create at least one workspace to use Azure Monitor Logs. A single workspace might be sufficient for all of your monitoring data, or you might choose to create multiple workspaces depending on your requirements. For example, you might have one workspace for your production data and another for testing. 

To create a new workspace, see [Create a Log Analytics workspace in the Azure portal](./quick-create-workspace.md). For considerations on creating multiple workspaces, see [Designing your Azure Monitor Logs deployment](design-logs-deployment.md).

## Log queries
Data is retrieved from a Log Analytics workspace through a log query, which is a read-only request to process data and return results. Log queries are written in [Kusto Query Language (KQL)](/azure/data-explorer/kusto/query/). KQL is the same query language that Azure Data Explorer uses. 

You can write log queries in Log Analytics to interactively analyze their results, use them in alert rules to be proactively notified of issues, or include their results in workbooks or dashboards. Insights include prebuilt queries to support their views and workbooks.

For a list of where log queries are used and references to tutorials and other documentation to get you started, see [Log queries in Azure Monitor](./log-query-overview.md).

![Screenshot that shows queries in Log Analytics.](media/data-platform-logs/log-analytics.png)

## Data structure
Log queries retrieve their data from a Log Analytics workspace. Each workspace contains multiple tables that are organized into separate columns with multiple rows of data. Each table is defined by a unique set of columns. Rows of data provided by the data source share those columns. 

[![Diagram that shows the Azure Monitor Logs structure.](media/data-platform-logs/logs-structure.png)](media/data-platform-logs/logs-structure.png#lightbox)

Log data from Application Insights is also stored in Azure Monitor Logs, but it's stored differently depending on how your application is configured: 

- For a workspace-based application, data is stored in a Log Analytics workspace in a standard set of tables. The types of data include application requests, exceptions, and page views. Multiple applications can use the same workspace. 

- For a classic application, the data is not stored in a Log Analytics workspace. It uses the same query language, and you create and run queries by using the same Log Analytics tool in the Azure portal. Data items for classic applications are stored separately from each other. The general structure is the same as for workspace-based applications, although the table and column names are different. 

For a detailed comparison of the schema for workspace-based and classic applications, see [Workspace-based resource changes](../app/apm-tables.md).

> [!NOTE]
> The classic Application Insights experience includes backward compatibility for your resource queries, workbooks, and log-based alerts. To query or view against the [new workspace-based table structure or schema](../app/apm-tables.md), you must first go to your Log Analytics workspace. During the preview, selecting **Logs** from within the Application Insights panes will give you access to the classic Application Insights query experience. For more information, see [Query scope](./scope.md).

[![Diagram that shows the Azure Monitor Logs structure for Application Insights.](media/data-platform-logs/logs-structure-ai.png)](media/data-platform-logs/logs-structure-ai.png#lightbox)

## Relationship to Azure Data Explorer
Azure Monitor Logs is based on Azure Data Explorer. A Log Analytics workspace is roughly the equivalent of a database in Azure Data Explorer. Tables are structured the same, and both use KQL. 

The experience of using Log Analytics to work with Azure Monitor queries in the Azure portal is similar to the experience of using the Azure Data Explorer Web UI. You can even [include data from a Log Analytics workspace in an Azure Data Explorer query](/azure/data-explorer/query-monitor-data). 

## Next steps

- Learn about [log queries](./log-query-overview.md) to retrieve and analyze data from a Log Analytics workspace.
- Learn about [metrics in Azure Monitor](../essentials/data-platform-metrics.md).
- Learn about the [monitoring data available](../agents/data-sources.md) for various resources in Azure.
