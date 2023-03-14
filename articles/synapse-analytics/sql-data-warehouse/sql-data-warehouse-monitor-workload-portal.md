---
title: Monitor workload - Azure portal
description: Monitor Synapse SQL using the Azure portal
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: sngun
ms.date: 09/13/2022
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.topic: conceptual
---

# Monitor workload - Azure portal

This article describes how to use the Azure portal to monitor your workload. This includes setting up Azure Monitor Logs to investigate query execution and workload trends using log analytics for [Synapse SQL](https://azure.microsoft.com/blog/workload-insights-with-sql-data-warehouse-delivered-through-azure-monitor-diagnostic-logs-pass/).

## Prerequisites

- Azure subscription: If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
- SQL pool: We will be collecting logs for a SQL pool. If you don't have a SQL pool provisioned, see the instructions in [Create a SQL pool](./load-data-from-azure-blob-storage-using-copy.md).

## Create a Log Analytics workspace

In the Azure portal, navigate to the page for Log Analytics workspaces, or use the Azure services search window to create a new Log Analytics workspace. 

:::image type="content" source="./media/sql-data-warehouse-monitor-workload-portal/add_analytics_workspace.png" alt-text="Screenshot shows the Log Analytics workspaces where you can select Add.":::

:::image type="content" source="./media/sql-data-warehouse-monitor-workload-portal/add_analytics_workspace_2.png" alt-text="Screenshot shows the Log Analytics workspace where you can enter values.":::

For more information on workspaces, see [Create a Log Analytics workspace](../../azure-monitor/logs/quick-create-workspace.md).

## Turn on Resource logs

Configure diagnostic settings to emit logs from your SQL pool. Logs consist of telemetry views equivalent to the most commonly used performance troubleshooting DMVs. Currently the following views are supported:

- [sys.dm_pdw_exec_requests](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-exec-requests-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true)
- [sys.dm_pdw_request_steps](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-request-steps-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true)
- [sys.dm_pdw_dms_workers](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-dms-workers-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true)
- [sys.dm_pdw_waits](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-waits-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true)
- [sys.dm_pdw_sql_requests](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-sql-requests-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true)

:::image type="content" source="./media/sql-data-warehouse-monitor-workload-portal/enable_diagnostic_logs.png" alt-text="Screenshot of the page to create a diagnostic setting in the Azure portal.":::

Logs can be emitted to Azure Storage, Stream Analytics, or Log Analytics. For this tutorial, select Log Analytics. Select all desired categories and metrics and choose **Send to Log Analytics workspace**. 

:::image type="content" source="./media/sql-data-warehouse-monitor-workload-portal/specify_logs.png" alt-text="Screenshot of the page to specify which logs to collect in the Azure portal.":::

Select **Save** to create the new diagnostic setting. It may take a few minutes for data to appear in queries.

## Run queries against Log Analytics

Navigate to your Log Analytics workspace where you can:

- Analyze logs using log queries and save queries for reuse
- Save queries for reuse
- Create log alerts
- Pin query results to a dashboard

For details on the capabilities of log queries using Kusto, see [Kusto Query Language (KQL) overview](/azure/data-explorer/kusto/query/).

:::image type="content" source="./media/sql-data-warehouse-monitor-workload-portal/log_analytics_workspace_editor.png" alt-text="Log Analytics workspace editor.":::

:::image type="content" source="./media/sql-data-warehouse-monitor-workload-portal/log_analytics_workspace_queries.png" alt-text="Log Analytics workspace queries.":::

## Sample log queries

Set the [scope of your queries](../../azure-monitor/logs/scope.md) to the Log Analytics workspace resource.

```Kusto
//List all queries
AzureDiagnostics
| where Category contains "ExecRequests"
| project TimeGenerated, StartTime_t, EndTime_t, Status_s, Command_s, ResourceClass_s, duration=datetime_diff('millisecond',EndTime_t, StartTime_t)
```

```Kusto
//Chart the most active resource classes
AzureDiagnostics
| where Category contains "ExecRequests"
| where Status_s == "Completed"
| summarize totalQueries = dcount(RequestId_s) by ResourceClass_s
| render barchart
```

```Kusto
//Count of all queued queries
AzureDiagnostics
| where Category contains "waits"
| where Type == "UserConcurrencyResourceType"
| summarize totalQueuedQueries = dcount(RequestId_s)
```

## Next steps

- Now that you have set up and configured Azure monitor logs, [customize Azure dashboards](../../azure-portal/azure-portal-dashboards.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) to share across your team.
