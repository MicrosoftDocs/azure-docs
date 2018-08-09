---
title: Azure SQL Analytics solution in Log Analytics | Microsoft Docs
description: Azure SQL Analytics solution helps you manage your Azure SQL databases
services: log-analytics
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: ''
ms.assetid: b2712749-1ded-40c4-b211-abc51cc65171
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 05/03/2018
ms.author: magoedte
ms.component: na
---

# Monitor Azure SQL Databases using Azure SQL Analytics (Preview)

![Azure SQL Analytics symbol](./media/log-analytics-azure-sql/azure-sql-symbol.png)

Azure SQL Analytics is a cloud monitoring solution for monitoring performance of Azure SQL Databases at scale across multiple elastic pools and subscriptions. It collects and visualizes important Azure SQL Database performance metrics with built-in intelligence for performance troubleshooting on top. 

By using metrics that you collect with the solution, you can create custom monitoring rules and alerts. The solution helps you to identify issues at each layer of your application stack. It uses Azure Diagnostic metrics along with Log Analytics views to present data about all your Azure SQL databases and elastic pools in a single Log Analytics workspace. Log Analytics helps you to collect, correlate, and visualize structured and unstructured data.

Currently, this preview solution supports up to 150,000 Azure SQL Databases and 5,000 SQL Elastic Pools per workspace.

For a hands-on overview on using Azure SQL Analytics solution and for typical usage scenarios, see the embedded video:

> [!VIDEO https://channel9.msdn.com/Shows/Azure-Friday/Get-Intelligent-Insights-for-Improving-Azure-SQL-Database-Performance/player]
>

## Connected sources

Azure SQL Analytics is a cloud monitoring solution supporting streaming of diagnostics telemetry for Azure SQL Databases and elastic pools. As it does not use agents to connect to the Log Analytics service, the solution does not support connectivity with Windows, Linux or SCOM resources, see the compatibility table below.

| Connected Source | Support | Description |
| --- | --- | --- |
| **[Azure Diagnostics](log-analytics-azure-storage.md)** | **Yes** | Azure metric and log data are sent to Log Analytics directly by Azure. |
| [Azure storage account](log-analytics-azure-storage.md) | No | Log Analytics does not read the data from a storage account. |
| [Windows agents](log-analytics-windows-agent.md) | No | Direct Windows agents are not used by the solution. |
| [Linux agents](log-analytics-linux-agents.md) | No | Direct Linux agents are not used by the solution. |
| [SCOM management group](log-analytics-om-agents.md) | No | A direct connection from the SCOM agent to Log Analytics is not used by the solution. |

## Configuration

Perform the following steps to add the Azure SQL Analytics solution to your workspace.

1. Add the Azure SQL Analytics solution to your workspace from [Azure marketplace](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/Microsoft.AzureSQLAnalyticsOMS?tab=Overview).
2. In the Azure portal, click **+ Create a resource**, then search for **Azure SQL Analytics**.  
    ![Monitoring + Management](./media/log-analytics-azure-sql/monitoring-management.png)
3. Select **Azure SQL Analytics (Preview)** from the list
4. In the **Azure SQL Analytics (Preview)** area, click **Create**.  
    ![Create](./media/log-analytics-azure-sql/portal-create.png)
5. In the **Create new solution** area, create new, or select an existing workspace that you want to add the solution to, and then click **Create**.  
    ![add to workspace](./media/log-analytics-azure-sql/add-to-workspace.png)

### Configure Azure SQL Databases and Elastic Pools to stream diagnostics telemetry

Once you've created Azure SQL Analytics solution in your workspace, in order to monitor performance of Azure SQL Databases and/or Elastic Pools, you will need to **configure each** of Azure SQL Database and elastic pool resource you wish to monitor to stream its diagnostics telemetry to the solution.

- Enable Azure Diagnostics for your Azure SQL databases and elastic pools and [configure them to send their data to Log Analytics](../sql-database/sql-database-metrics-diag-logging.md).

### To configure multiple Azure subscriptions

To support multiple subscriptions, use the PowerShell script from [Enable Azure resource metrics logging using PowerShell](https://blogs.technet.microsoft.com/msoms/2017/01/17/enable-azure-resource-metrics-logging-using-powershell/). Provide the workspace resource ID as a parameter when executing the script to send diagnostic data from resources in one Azure subscription to a workspace in another Azure subscription.

**Example**

```
PS C:\> $WSID = "/subscriptions/<subID>/resourcegroups/oms/providers/microsoft.operationalinsights/workspaces/omsws"
```

```
PS C:\> .\Enable-AzureRMDiagnostics.ps1 -WSID $WSID
```

## Using the solution

When you add the solution to your workspace, the Azure SQL Analytics tile is added to your workspace, and it appears in Overview. The tile shows the number of Azure SQL databases and Azure SQL elastic pools that the solution is connected to.

![Azure SQL Analytics tile](./media/log-analytics-azure-sql/azure-sql-sol-tile.png)

### Viewing Azure SQL Analytics data

Click on the **Azure SQL Analytics** tile to open the Azure SQL Analytics dashboard. The dashboard includes the overview of all databases that are monitored through different perspectives. For different perspectives to work, you must enable proper metrics or logs on your SQL resources to be streamed to Azure Log Analytics workspace.

![Azure SQL Analytics Overview](./media/log-analytics-azure-sql/azure-sql-sol-overview.png)

Selecting any of the tiles, opens a drill-down report into the specific perspective. Once the perspective is selected, the drill-down report is opened.

![Azure SQL Analytics Timeouts](./media/log-analytics-azure-sql/azure-sql-sol-metrics.png)

Each perspective provides summaries on subscription, server, elastic pool, and database level. In addition, each perspective shows a perspective specific to the report on the right. Selecting subscription, server, pool, or database from the list continues the drill-down.

| Perspective | Description |
| --- | --- |
| Resource by type | Perspective that counts all the resources monitored. Drill-down provides the summary of DTU and GB metrics. |
| Insights | Provides hierarchical drill-down into Intelligent Insights. Learn more about intelligent insights. |
| Errors | Provides hierarchical drill-down into SQL errors that happened on the databases. |
| Timeouts | Provides hierarchical drill-down into SQL timeouts that happened on the databases. |
| Blockings | Provides hierarchical drill-down into SQL blockings that happened on the databases. |
| Database waits | Provides hierarchical drill-down into SQL wait statistics on the database level. Includes summaries of total waiting time and the waiting time per wait type. |
| Query duration | Provides hierarchical drill-down into the query execution statistics such as query duration, CPU usage, Data IO usage, Log IO usage. |
| Query waits | Provides hierarchical drill-down into the query wait statistics by wait category. |

### Intelligent Insights report

Azure SQL Database [Intelligent Insights](../sql-database/sql-database-intelligent-insights.md) lets you know what is happening with your database performance. All Intelligent Insights collected can be visualized and accessed through the Insights perspective.

![Azure SQL Analytics Insights](./media/log-analytics-azure-sql/azure-sql-sol-insights.png)

### Elastic Pool and Database reports

Both Elastic Pools and Databases have their own specific reports which show all the data that is collected for the resource in the specified time.

![Azure SQL Analytics Database](./media/log-analytics-azure-sql/azure-sql-sol-database.png)

![Azure SQL Analytics Elastic Pool](./media/log-analytics-azure-sql/azure-sql-sol-pool.png)

### Query reports

Through the Query duration and query waits perspectives, you can correlate the performance of any query through the query report. This report compares the query performance across different databases and makes it easy to pinpoint databases that perform the selected query well versus ones that are slow.

![Azure SQL Analytics Queries](./media/log-analytics-azure-sql/azure-sql-sol-queries.png)

### Analyze data and create alerts

You can easily [create alerts](../monitoring-and-diagnostics/monitor-alerts-unified-usage.md) with the data coming from Azure SQL Database resources. Here are some useful [log search](log-analytics-log-searches.md) queries that you can use with a log alert:



*High DTU on Azure SQL Database*

```
AzureMetrics 
| where ResourceProvider=="MICROSOFT.SQL" and ResourceId contains "/DATABASES/" and MetricName=="dtu_consumption_percent" 
| summarize AggregatedValue = max(Maximum) by bin(TimeGenerated, 5m)
| render timechart
```

*High DTU on Azure SQL Database Elastic Pool*

```
AzureMetrics 
| where ResourceProvider=="MICROSOFT.SQL" and ResourceId contains "/ELASTICPOOLS/" and MetricName=="dtu_consumption_percent" 
| summarize AggregatedValue = max(Maximum) by bin(TimeGenerated, 5m)
| render timechart
```



## Next steps

- Use [Log Searches](log-analytics-log-searches.md) in Log Analytics to view detailed Azure SQL data.
- [Create your own dashboards](log-analytics-dashboards.md) showing Azure SQL data.
- [Create alerts](log-analytics-alerts.md) when specific Azure SQL events occur.
