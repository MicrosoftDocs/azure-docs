---
title: Optimize your Gen2 cache | Microsoft Docs
description: Learn how to monitor your Gen2 cache using the Azure portal.
services: sql-data-warehouse
author: kevinvngo
manager: craigg
ms.service: sql-data-warehouse
ms.subservice: performance
ms.topic: conceptual
ms.date: 09/06/2018
ms.author: kevin
ms.reviewer: igorstan
---

# How to monitor the Gen2 cache
The Gen2 storage architecture automatically tiers your most frequently queried columnstore segments in a cache residing on NVMe based SSDs designed for Gen2 data warehouses. Greater performance is realized when your queries retrieve segments that are residing in the cache. This article describes how to monitor and troubleshoot slow query performance by determining whether your workload is optimally leveraging the Gen2 cache.  
## Troubleshoot using the Azure portal
You can use Azure Monitor to view Gen2 cache metrics to troubleshoot query performance. First go to the Azure portal and click on Monitor:

![Azure Monitor](./media/sql-data-warehouse-cache-portal/cache_0.png)

Select the metrics button and fill in the **Subscription**, **Resource** **group**, **Resource type**, and **Resource name** of your data warehouse.

The key metrics for troubleshooting the Gen2 cache are **Cache hit percentage** and **Cache used percentage**. Configure the Azure metric chart to display these two metrics.

![Cache Metrics](./media/sql-data-warehouse-cache-portal/cache_1.png)


## Cache hit and used percentage
The matrix below describes scenarios based on the values of the cache metrics:

|                                | **High Cache hit percentage** | **Low Cache hit percentage** |
| :----------------------------: | :---------------------------: | :--------------------------: |
| **High Cache used percentage** |          Scenario 1           |          Scenario 2          |
| **Low Cache used percentage**  |          Scenario 3           |          Scenario 4          |

**Scenario 1:** You are optimally using your cache. [Troubleshoot](https://docs.microsoft.com/azure/sql-data-warehouse/sql-data-warehouse-manage-monitor) other areas which may be slowing down your queries.

**Scenario 2:** Your current working data set cannot fit into the cache which causes a low cache hit percentage due to physical reads. Consider scaling up your performance level and rerun your workload to populate the cache.

**Scenario 3:** It is likely that your query is running slow due to reasons unrelated to the cache. [Troubleshoot](https://docs.microsoft.com/azure/sql-data-warehouse/sql-data-warehouse-manage-monitor) other areas which may be slowing down your queries. You can also consider [scaling down your instance](https://docs.microsoft.com/azure/sql-data-warehouse/sql-data-warehouse-manage-monitor) to reduce your cache size to save costs. 

**Scenario 4:** You had a cold cache which could be the reason why your query was slow. Consider rerunning your query as your working dataset should now be in cached. 

**Important: If the cache hit percentage or cache used percentage is not updating after rerunning your workload, your working set can already be residing in memory. Note only clustered columnstore tables are cached.**

## Next steps
For more information on general query performance tuning, see [Monitor query execution](https://docs.microsoft.com/azure/sql-data-warehouse/sql-data-warehouse-manage-monitor#monitor-query-execution).


<!--Image references-->

<!--Article references-->
[SQL Data Warehouse best practices]: ./sql-data-warehouse-best-practices.md
[System views]: ./sql-data-warehouse-reference-tsql-system-views.md
[Table distribution]: ./sql-data-warehouse-tables-distribute.md
[Investigating queries waiting for resources]: ./sql-data-warehouse-manage-monitor.md#waiting

<!--MSDN references-->
[sys.dm_pdw_dms_workers]: https://msdn.microsoft.com/library/mt203878.aspx
[sys.dm_pdw_exec_requests]: https://msdn.microsoft.com/library/mt203887.aspx
[sys.dm_pdw_exec_sessions]: https://msdn.microsoft.com/library/mt203883.aspx
[sys.dm_pdw_request_steps]: https://msdn.microsoft.com/library/mt203913.aspx
[sys.dm_pdw_sql_requests]: https://msdn.microsoft.com/library/mt203889.aspx
[DBCC PDW_SHOWEXECUTIONPLAN]: https://msdn.microsoft.com/library/mt204017.aspx
[DBCC PDW_SHOWSPACEUSED]: https://msdn.microsoft.com/library/mt204028.aspx
[LABEL]: https://msdn.microsoft.com/library/ms190322.aspx
