---
title: Manageability and monitoring - query activity, resource utilization
description: Learn what capabilities are available to manage and monitor Azure Synapse Analytics. Use the Azure portal and Dynamic Management Views (DMVs) to understand query activity and resource utilization of your data warehouse.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: sngun
ms.date: 04/08/2024
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.topic: conceptual
ms.custom: azure-synapse
---

# Monitor resource utilization and query activity in Azure Synapse Analytics

Azure Synapse Analytics provides a rich monitoring experience within the Azure portal to surface insights regarding your data warehouse workload. The Azure portal is the recommended tool when monitoring your data warehouse as it provides configurable retention periods, alerts, recommendations, and customizable charts and dashboards for metrics and logs. The portal also enables you to integrate with other Azure monitoring services such as Azure Monitor (logs) with Log analytics to provide a holistic monitoring experience for not only your data warehouse but also your entire Azure analytics platform for an integrated monitoring experience. This documentation describes what monitoring capabilities are available to optimize and manage your analytics platform with Synapse SQL.

## Resource utilization

For a list and details about the metrics that are available for dedicated SQL pools (formerly SQL Data Warehouse), see [Supported metrics for Microsoft.Synapse/workspaces/sqlPools](../monitor-synapse-analytics-reference.md). These metrics are surfaced through [Azure Monitor](/azure/azure-monitor/data-platform?bc=%2fazure%2fsynapse-analytics%2fsql-data-warehouse%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fsynapse-analytics%2fsql-data-warehouse%2ftoc.json#metrics).

Things to consider when viewing metrics and setting alerts:

- DWU used represents only a **high-level representation of usage** across the SQL pool and isn't meant to be a comprehensive indicator of utilization. To determine whether to scale up or down, consider all factors which can be impacted by DWU such as concurrency, memory, `tempdb`, and adaptive cache capacity. We recommend [running your workload at different DWU settings](sql-data-warehouse-manage-compute-overview.md#finding-the-right-size-of-data-warehouse-units) to determine what works best to meet your business objectives.
- Failed and successful connections are reported for a particular data warehouse - not for the server itself.
- Memory percentage reflects utilization even if the data warehouse is in idle state - it doesn't reflect active workload memory consumption. Use and track this metric along with others (`tempdb`, Gen2 cache) to make a holistic decision on if scaling for additional cache capacity will increase workload performance to meet your requirements.

## Query activity

For a programmatic experience when monitoring Synapse SQL via T-SQL, the service provides a set of Dynamic Management Views (DMVs). These views are useful when actively troubleshooting and identifying performance bottlenecks with your workload.

To view the list of DMVs that apply to Synapse SQL, review [dedicated SQL pool DMVs](../sql/reference-tsql-system-views.md#dedicated-sql-pool-dynamic-management-views-dmvs).

> [!NOTE]
> - You need to resume your dedicated SQL Pool to monitor the queries using the **Query activity** tab.
> - The **Query activity** tab cannot be used to view historical executions.
> - The **Query activity** tab will NOT display queries which are related to declare variables (for example, `DECLARE @ChvnString VARCHAR(10)`), set variables (for example, `SET @ChvnString = 'Query A'`), or the batch details. You might find differences between the total number of queries executed on the Azure portal and the total number of queries logged in the DMVs.  
> - To check the query history for the exact queries which submitted, enable [diagnostics](sql-data-warehouse-monitor-workload-portal.md) to export the available DMVs to one of the available destinations (such as Log Analytics). By design, DMVs contain only the last 10,000 executed queries. After any pause, resume, or scale operation, the DMV data will be cleared.

## Metrics and diagnostics logging

Both metrics and logs can be exported to Azure Monitor, specifically the [Azure Monitor logs](/azure/azure-monitor/logs/log-query-overview?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) component and can be programmatically accessed through [log queries](../../azure-monitor/logs/log-analytics-tutorial.md?bc=%2fazure%2fsynapse-analytics%2fsql-data-warehouse%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fsynapse-analytics%2fsql-data-warehouse%2ftoc.json). The log latency for Synapse SQL is about 10-15 minutes.

## Related content

The following articles describe common scenarios and use cases when monitoring and managing your data warehouse:

- [Monitor your data warehouse workload with DMVs](sql-data-warehouse-manage-monitor.md)
- [Use Azure Monitor with your Azure Synapse Analytics workspace](../monitor-synapse-analytics.md)
