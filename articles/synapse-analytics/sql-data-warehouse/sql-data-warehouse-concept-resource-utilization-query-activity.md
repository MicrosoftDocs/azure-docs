---
title: Manageability and monitoring - query activity, resource utilization
description: Learn what capabilities are available to manage and monitor Azure Synapse Analytics. Use the Azure portal and Dynamic Management Views (DMVs) to understand query activity and resource utilization of your data warehouse.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: sngun
ms.date: 03/14/2024
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.topic: conceptual
ms.custom: azure-synapse
---

# Monitor resource utilization and query activity in Azure Synapse Analytics

Azure Synapse Analytics provides a rich monitoring experience within the Azure portal to surface insights regarding your data warehouse workload. The Azure portal is the recommended tool when monitoring your data warehouse as it provides configurable retention periods, alerts, recommendations, and customizable charts and dashboards for metrics and logs. The portal also enables you to integrate with other Azure monitoring services such as Azure Monitor (logs) with Log analytics to provide a holistic monitoring experience for not only your data warehouse but also your entire Azure analytics platform for an integrated monitoring experience. This documentation describes what monitoring capabilities are available to optimize and manage your analytics platform with Synapse SQL.

## Resource utilization

The following metrics are available for dedicated SQL pools (formerly SQL Data Warehouse). For dedicated SQL pools created in Azure Synapse workspaces, see [Use Azure Monitor with your Azure Synapse Analytics workspace](../monitoring/how-to-monitor-using-azure-monitor.md).

These metrics are surfaced through [Azure Monitor](../../azure-monitor/data-platform.md?bc=%2fazure%2fsynapse-analytics%2fsql-data-warehouse%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fsynapse-analytics%2fsql-data-warehouse%2ftoc.json#metrics).

| Metric Name | Description | Aggregation Type |
| --- | --- | --- |
| CPU percentage | CPU utilization across all nodes for the data warehouse | Avg, Min, Max |
| Data IO percentage | IO Utilization across all nodes for the data warehouse | Avg, Min, Max |
| Memory percentage | Memory utilization (SQL Server) across all nodes for the data warehouse | Avg, Min, Max |
| Active Queries | Number of active queries executing on the system | Sum |
| Queued Queries | Number of queued queries waiting to start executing | Sum |
| Successful Connections | Number of successful connections (logins) against the database | Sum, Count |
| Failed Connections: User Errors | Number of user failed connections (logins) against the database | Sum, Count |
| Failed Connections: System Errors | Number of system failed connections (logins) against the database | Sum, Count |
| Blocked by Firewall | Number of logins to the data warehouse which was blocked | Sum, Count |
| DWU limit | Service level objective of the data warehouse | Avg, Min, Max |
| DWU percentage | Maximum between CPU percentage and Data IO percentage | Avg, Min, Max |
| DWU used | DWU limit * DWU percentage | Avg, Min, Max |
| Cache hit percentage | (cache hits / (cache hits + cache miss)) * 100, where cache hits are the sum of all columnstore segments hits in the local SSD cache and cache miss is the columnstore segments misses in the local SSD cache summed across all nodes | Avg, Min, Max |
| Cache used percentage | (cache used / cache capacity) * 100 where cache used is the sum of all bytes in the local SSD cache across all nodes and cache capacity is the sum of the storage capacity of the local SSD cache across all nodes | Avg, Min, Max |
| Local `tempdb` percentage | Local `tempdb` utilization across all compute nodes - values are emitted every five minutes | Avg, Min, Max |

Things to consider when viewing metrics and setting alerts:

- DWU used represents only a **high-level representation of usage** across the SQL pool and is not meant to be a comprehensive indicator of utilization. To determine whether to scale up or down, consider all factors which can be impacted by DWU such as concurrency, memory, `tempdb`, and adaptive cache capacity. We recommend [running your workload at different DWU settings](sql-data-warehouse-manage-compute-overview.md#finding-the-right-size-of-data-warehouse-units) to determine what works best to meet your business objectives.
- Failed and successful connections are reported for a particular data warehouse - not for the server itself.
- Memory percentage reflects utilization even if the data warehouse is in idle state - it does not reflect active workload memory consumption. Use and track this metric along with others (`tempdb`, Gen2 cache) to make a holistic decision on if scaling for additional cache capacity will increase workload performance to meet your requirements.

## Query activity

For a programmatic experience when monitoring Synapse SQL via T-SQL, the service provides a set of Dynamic Management Views (DMVs). These views are useful when actively troubleshooting and identifying performance bottlenecks with your workload.

To view the list of DMVs that apply to Synapse SQL, review [dedicated SQL pool DMVs](../sql/reference-tsql-system-views.md#dedicated-sql-pool-dynamic-management-views-dmvs).

> [!NOTE]
> You need to resume your dedicated SQL Pool to monitor the queries using the Query activity tab.
> The **Query activity** tab cannot be used to view historical executions. To check the query history, it is recommended to enable [diagnostics](sql-data-warehouse-monitor-workload-portal.md) to export the available DMVs to one of the available destinations (such as Log Analytics) for future reference. By design, DMVs contain records of the last 10,000 executed queries only. Once this limit is reached, the DMV data will be flushed, and new records will be inserted. Additionally, after any pause, resume, or scale operation, the DMV data will be cleared.

## Metrics and diagnostics logging

Both metrics and logs can be exported to Azure Monitor, specifically the [Azure Monitor logs](../../azure-monitor/logs/log-query-overview.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) component and can be programmatically accessed through [log queries](../../azure-monitor/logs/log-analytics-tutorial.md?bc=%2fazure%2fsynapse-analytics%2fsql-data-warehouse%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fsynapse-analytics%2fsql-data-warehouse%2ftoc.json). The log latency for Synapse SQL is about 10-15 minutes.

## Next steps

The following How-to guide describes common scenarios and use cases when monitoring and managing your data warehouse:

- [Monitor your data warehouse workload with DMVs](sql-data-warehouse-manage-monitor.md)
- [Use Azure Monitor with your Azure Synapse Analytics workspace](../monitoring/how-to-monitor-using-azure-monitor.md)
