---
title: Manageability and monitoring - query activity, resource utilization 
description: Learn what capabilities are available to manage and monitor Azure SQL Data Warehouse. Use the Azure portal and Dynamic Management Views (DMVs) to understand query activity and resource utilization of your data warehouse.
services: sql-data-warehouse
author: kevinvngo
manager: craigg-msft
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.subservice: manage
ms.date: 01/14/2020
ms.author: kevin
ms.reviewer: igorstan
ms.custom: seo-lt-2019
---

# Monitoring resource utilization and query activity in Azure SQL Data Warehouse
Azure SQL Data Warehouse provides a rich monitoring experience within the Azure portal to surface insights to your data warehouse workload. The Azure portal is the recommended tool when monitoring your data warehouse as it provides configurable retention periods, alerts, recommendations, and customizable charts and dashboards for metrics and logs. The portal also enables you to integrate with other Azure monitoring services such as Operations Management Suite (OMS) and Azure Monitor (logs) to provide a holistic monitoring experience for not only your data warehouse but also your entire Azure analytics platform for an integrated monitoring experience. This documentation describes what monitoring capabilities are available to optimize and manage your analytics platform with SQL Data Warehouse. 

## Resource utilization 
The following metrics are available in the Azure portal for SQL Data Warehouse. These metrics are surfaced through [Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/data-collection#metrics).


| Metric Name             | Description                                                  | Aggregation Type |
| ----------------------- | ------------------------------------------------------------ | ---------------- |
| CPU percentage          | CPU utilization across all nodes for the data warehouse      | Avg, Min, Max    |
| Data IO percentage      | IO Utilization across all nodes for the data warehouse       | Avg, Min, Max    |
| Memory percentage       | Memory utilization (SQL Server) across all nodes for the data warehouse | Avg, Min, Max   |
| Active Queries          | Number of active queries executing on the system             | Sum              |
| Queued Queries          | Number of queued queries waiting to start executing          | Sum              |
| Successful Connections  | Number of successful connections to the data                 | Sum, Count       |
| Failed Connections      | Number of failed connections to the data warehouse           | Sum, Count       |
| Blocked by Firewall     | Number of logins to the data warehouse which was blocked     | Sum, Count       |
| DWU limit               | Service level objective of the data warehouse                | Avg, Min, Max    |
| DWU percentage          | Maximum between CPU percentage and Data IO percentage        | Avg, Min, Max    |
| DWU used                | DWU limit * DWU percentage                                   | Avg, Min, Max    |
| Cache hit percentage    | (cache hits / cache miss) * 100  where cache hits is the sum of all columnstore segments hits in the local SSD cache and cache miss is the columnstore segments misses in the local SSD cache summed across all nodes | Avg, Min, Max    |
| Cache used percentage   | (cache used / cache capacity) * 100 where cache used is the sum of all bytes in the local SSD cache across all nodes and cache capacity is the sum of the storage capacity of the local SSD cache across all nodes | Avg, Min, Max    |
| Local tempdb percentage | Local tempdb utilization across all compute nodes - values are emitted every five minutes | Avg, Min, Max    |

Things to consider when viewing metrics and setting alerts:

- Failed and successful connections are reported for a particular data warehouse - not for the logical server
- Memory percentage reflects utilization even if the data warehouse is in idle state - it does not reflect active workload memory consumption. Use and track this metric along with others (tempdb, gen2 cache) to make a holistic decision on if scaling for additional cache capacity will increase workload performance to meet your requirements.


## Query activity
For a programmatic experience when monitoring SQL Data Warehouse via T-SQL, the service provides a set of Dynamic Management Views (DMVs). These views are useful when actively troubleshooting and identifying performance bottlenecks with your workload.

To view the list of DMVs that SQL Data Warehouse provides, refer to this [documentation](https://docs.microsoft.com/azure/sql-data-warehouse/sql-data-warehouse-reference-tsql-system-views#sql-data-warehouse-dynamic-management-views-dmvs). 

## Metrics and diagnostics logging
Both metrics and logs can be exported to Azure Monitor, specifically the [Azure Monitor logs](https://docs.microsoft.com/azure/log-analytics/log-analytics-overview) component and can be programmatically accessed through [log queries](https://docs.microsoft.com/azure/log-analytics/log-analytics-tutorial-viewdata). The log latency for SQL Data Warehouse is about 10-15 minutes. For more details on the factors impacting latency, visit the following documentation.


## Next steps
The following How-to guides describe common scenarios and use cases when monitoring and managing your data warehouse:

- [Monitor your data warehouse workload with DMVs](https://docs.microsoft.com/azure/sql-data-warehouse/sql-data-warehouse-manage-monitor)
