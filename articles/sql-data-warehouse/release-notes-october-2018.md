---
title: Azure SQL Data Warehouse Release Notes October 2018 | Microsoft Docs
description: Release notes for Azure SQL Data Warehouse.
services: sql-data-warehouse
author: twounder
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.component: manage
ms.date: 12/04/2018
ms.author: mausher
ms.reviewer: twounder
---

# What's new in Azure SQL Data Warehouse? October 2018
Azure SQL Data Warehouse receives improvements continually. This article describes the new features and changes that have been introduced in October 2018.

## DevOps for Data Warehousing
The highly requested feature for SQL Data Warehouse (SQL DW) is now in preview with the support for SQL Server Data Tool (SSDT) in Visual Studio! Teams of developers can now collaborate over a single, version-controlled codebase and quickly deploy changes to any instance in the world. Interested in joining? This feature is available for preview today! You can register by visiting the [SQL Data Warehouse Visual Studio SQL Server Data Tools (SSDT) - Preview Enrollment form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR4-brmKy3TZOjoktwuHd7S1UODkwQ1lVMEw1NDBGRjNLRDNWOFlQRUpIRi4u). Given the high demand, we are managing acceptance into preview to ensure the best experience for our customers. Once you sign up, our goal is to confirm your status within seven business days.

## Row Level Security Generally Available
Azure SQL Data Warehouse (SQL DW) now supports row level security (RLS) adding a powerful capability to secure your sensitive data. With the introduction of RLS, you can implement security policies to control access to rows in your tables, as in who can access what rows. RLS enables this fine-grained access control without having to redesign your data warehouse. RLS simplifies the overall security model as the access restriction logic is located in the database tier itself rather than away from the data in another application. RLS also eliminates the need to introduce views to filter out rows for access control management. There is no additional cost for this enterprise-grade security feature for all our customers.

## Advanced Advisors
Advanced tuning for Azure SQL Data Warehouse (SQL DW) just got simpler with additional data warehouse recommendations and metrics. There are additional advanced performance recommendations through Azure Advisor at your disposal, including:
1.	Adaptive cache – Be advised when to scale to optimize cache utilization.
2.	Table distribution – Determine when to replicate tables to reduce data movement and increase workload performance. 
3.	Tempdb – Understand when to scale and configure resource classes to reduce tempdb contention.

There is a deeper integration of data warehouse metrics with [Azure Monitor](https://azure.microsoft.com/blog/enhanced-capabilities-to-monitor-manage-and-integrate-sql-data-warehouse-in-the-azure-portal/) including an enhanced customizable monitoring chart for near real-time metrics in the overview blade. You no longer must leave the data warehouse overview blade to access Azure Monitor metrics when monitoring usage, or validating and applying data warehouse recommendations. In addition, there are new metrics available, such as tempdb and adaptive cache utilization to complement your performance recommendations.

## Advanced tuning with integrated advisors
Advanced tuning for Azure SQL Data Warehouse (SQL DW) just got simpler with additional data warehouse recommendations and metrics and a redesign of the portal overview blade that provides an integrated experience with Azure Advisor and Azure Monitor.

## Accelerated Database Recovery (ADR)
Azure SQL Data Warehouse Accelerated Database Recovery (ADR) is now in Public Preview. ADR is a new SQL Server Engine that greatly improves database availability, especially in the presence of long running transactions, by completely redesigning the current recovery process from the ground up. The primary benefits of ADR are fast and consistent database recovery and instantaneous transaction rollback.

## Azure Monitor diagnostics logs
SQL Data Warehouse (SQL DW) now enables enhanced insights into analytical workloads by integrating directly with Azure Monitor diagnostic logs. This new capability enables developers to analyze workload behavior over an extended time period and make informed decisions on query optimization or capacity management. We have now introduced an external logging process through [Azure Monitor diagnostic logs](https://docs.microsoft.com/azure/monitoring/monitoring-data-collection?toc=/azure/azure-monitor/toc.json#logs) that provide additional insights into your data warehouse workload. With a single click of a button, you are now able to configure diagnostic logs for historical query performance troubleshooting capabilities using [Log Analytics](https://docs.microsoft.com/azure/log-analytics/log-analytics-queries). Azure Monitor diagnostic logs support customizable retention periods by saving the logs to a storage account for auditing purposes, the capability to stream logs to event hubs near real-time telemetry insights, and the ability to analyze logs using Log Analytics with [log queries](). Diagnostic logs consist of telemetry views of your data warehouse equivalent to the most commonly used performance troubleshooting DMVs for SQL Data Warehouse. For this initial release, we have enabled views for the following system dynamic management views:

- [sys.dm_pdw_exec_requests](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-exec-requests-transact-sql)
- [sys.dm_pdw_request_steps](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-request-steps-transact-sql)
- [sys.dm_pdw_dms_workers](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-dms-workers-transact-sql)
- [sys.dm_pdw_waits](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-waits-transact-sql)
- [sys.dm_pdw_sql_requests](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-sql-requests-transact-sql)

## Columnstore memory management
As the number of compressed column store row groups increases, the memory required to manage the internal column segment metadata for those rowgroups increases.  As a result, query performance and queries executed against some of the Columnstore Dynamic Management Views (DMVs) can degrade.  Improvements have made in this release to optimize the size of the internal metadata for these cases, leading to improved experience and performance for such queries. 

## Azure Data Lake Storage Gen2 integration (GA)
Azure SQL Data Warehouse (SQL DW) now has native integration with Azure Data Lake Storage Gen2. Customers can now load data using external tables from ABFS into SQL DW. This functionality enables customers to integrate with their data lakes in Data Lake Storage Gen2. 

## Bug fixes

| Title | Description |
|:---|:---|
| **CETAS to Parquet failures in small resource classes on Data warehouses of DW2000 and more** | This fix correctly identifies a null reference in the Create External Table As to Parquet code path. |
|**Identity column value might lose in some CTAS operation** | The value of an identify column may not be preserved when CTASed to another table. Reported in a blog: [https://blog.westmonroepartners.com/azure-sql-dw-identity-column-bugs/](https://blog.westmonroepartners.com/azure-sql-dw-identity-column-bugs/). |
| **Internal failure in some cases when a session is terminated while a query is still running** | This fix triggers an InvalidOperationException if a session is terminated when the query is still running. |
| **(Deployed in November 2018) Customers were experiencing a suboptimal performance when attempting to load multiple small files from ADLS (Gen1) using Polybase.** | System performance was bottlenecked during AAD security token validation. Performance problems were mitigated by enabling caching of security tokens. |


## Next steps
Now that you know a bit about SQL Data Warehouse, learn how to quickly [create a SQL Data Warehouse][create a SQL Data Warehouse]. If you are new to Azure, you may find the [Azure glossary][Azure glossary] helpful as you encounter new terminology. Or look at some of these other SQL Data Warehouse Resources.  

* [Customer success stories]
* [Blogs]
* [Feature requests]
* [Videos]
* [Customer Advisory Team blogs]
* [Stack Overflow forum]
* [Twitter]


[Blogs]: https://azure.microsoft.com/blog/tag/azure-sql-data-warehouse/
[Customer Advisory Team blogs]: https://blogs.msdn.microsoft.com/sqlcat/tag/sql-dw/
[Customer success stories]: https://azure.microsoft.com/case-studies/?service=sql-data-warehouse
[Feature requests]: https://feedback.azure.com/forums/307516-sql-data-warehouse
[Stack Overflow forum]: http://stackoverflow.com/questions/tagged/azure-sqldw
[Twitter]: https://twitter.com/hashtag/SQLDW
[Videos]: https://azure.microsoft.com/documentation/videos/index/?services=sql-data-warehouse
[create a SQL Data Warehouse]: ./create-data-warehouse-portal.md
[Azure glossary]: ../azure-glossary-cloud-terminology.md
