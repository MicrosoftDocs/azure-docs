---
title: Azure SQL Data Warehouse Release Notes December 2018 | Microsoft Docs
description: Release notes for Azure SQL Data Warehouse.
services: sql-data-warehouse
author: twounder
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.subservice: manage
ms.date: 12/12/2018
ms.author: mausher
ms.reviewer: twounder
---

# What's new in Azure SQL Data Warehouse? December 2018
Azure SQL Data Warehouse receives improvements continually. This article describes the new features and changes that have been introduced in December 2018.

## Virtual Network Service Endpoints Generally Available
This release includes general availability of Virtual Network (VNet) Service Endpoints for Azure SQL Data Warehouse in all Azure regions. VNet Service Endpoints enable you to isolate connectivity to your logical server from a given subnet or set of subnets within your virtual network. The traffic to Azure SQL Data Warehouse from your VNet will always stay within the Azure backbone network. This direct route will be preferred over any specific routes that take Internet traffic through virtual appliances or on-premises. No additional billing is charged for virtual network access through service endpoints. Current pricing model for [Azure SQL Data Warehouse](https://azure.microsoft.com/pricing/details/sql-data-warehouse/gen2/) applies as is.

With this release, we also enabled PolyBase connectivity to [Azure Data Lake Storage Gen2](https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-introduction) (ADLS) via [Azure Blob File System](https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-abfs-driver) (ABFS) driver. Azure Data Lake Storage Gen2 brings all the qualities that are required for the complete lifecycle of analytics data to Azure Storage. Features of the two existing Azure storage services, Azure Blob Storage and Azure Data Lake Storage Gen1 are converged. Features from [Azure Data Lake Storage Gen1](https://docs.microsoft.com/azure/data-lake-store/index), such as file system semantics, file-level security, and scale are combined with low-cost, tiered storage, and high availability/disaster recovery capabilities from [Azure Blob Storage](https://docs.microsoft.com/azure/storage/blobs/storage-blobs-introduction). 

Using Polybase you can also import data into Azure SQL Data Warehouse from Azure Storage secured to VNet. Similarly, exporting data from Azure SQL Data Warehouse to Azure Storage secured to VNet is also supported via Polybase. 

For more information on VNet Service Endpoints in Azure SQL Data Warehouse, refer to the [blog post](https://azure.microsoft.com/blog/general-availability-of-vnet-service-endpoints-for-azure-sql-data-warehouse/) or the [documentation](https://docs.microsoft.com/azure/sql-database/sql-database-vnet-service-endpoint-rule-overview?toc=/azure/sql-data-warehouse/toc.json).

## Automatic Performance Monitoring (Preview)
[Query Store](https://docs.microsoft.com/sql/relational-databases/performance/monitoring-performance-by-using-the-query-store?view=sql-server-2017) is now available in Preview for Azure SQL Data Warehouse. Query Store is designed to help you with query performance troubleshooting by tracking queries, query plans, runtime statistics, and query history to help you monitor the activity and performance of your data warehouse. Query Store is a set of internal stores and Dynamic Management Views (DMVs) that allow you to:

- Identify and tune top resource consuming queries
- Identify and improve ad hoc workloads
- Evaluate query performance and impact to the plan by changes in statistics, indexes, or system size (DWU setting)
- See full query text for all queries executed

The Query Store contains three actual stores:  
- A plan store for persisting the execution plan information 
- A runtime stats store for persisting the execution statistics information
- A wait stats store for persisting wait stats information. 

SQL Data Warehouse manages these stores automatically and provide an unlimited number of queries storied over the last seven days at no additional charge. Enabling Query Store is as simple as running an ALTER DATABASE T-SQL statement:

```sql
ALTER DATABASE [Database Name] SET QUERY_STORE = ON;
```
For more information on Query Store  in Azure SQL Data Warehouse, see the article, [Monitoring performance by using the Query Store](https://docs.microsoft.com/sql/relational-databases/performance/monitoring-performance-by-using-the-query-store?view=sql-server-2017), and the Query Store DMVs, such as [sys.query_store_query](https://docs.microsoft.com/sql/relational-databases/system-catalog-views/sys-query-store-query-transact-sql?view=sql-server-2017). Here is the [blog post](https://azure.microsoft.com/blog/automatic-performance-monitoring-in-azure-sql-data-warehouse-with-query-store/) announcing the release.

## Lower Compute Tiers for Azure SQL Data Warehouse Gen2
Azure SQL Data Warehouse Gen2 now supports lower compute tiers. Customers can experience Azure SQL Data Warehouse’s leading performance, flexibility, and security features starting with 100 cDWU ([Data Warehouse Units](https://docs.microsoft.com/azure/sql-data-warehouse/what-is-a-data-warehouse-unit-dwu-cdwu)) and scale to 30,000 cDWU in minutes. Starting mid-December 2018, customers can benefit from Gen2 performance and flexibility with lower compute tiers in [regions](https://docs.microsoft.com/azure/sql-data-warehouse/gen2-lower-tier-regions), with the rest of the regions available during 2019.

By dropping the entry point for next-generation data warehousing, Microsoft opens the doors to value-driven customers who want to evaluate all the benefits of a secure, high-performance data warehouse without guessing which trial environment is best for them. Customers may start as low as 100 cDWU, down from the current 500 cDWU entry point. SQL Data Warehouse Gen2 continues to support pause and resume operations and goes beyond just the flexibility in compute. Gen2 also supports unlimited column-store storage capacity along with 2.5 times more memory per query, up to 128 concurrent queries and [adaptive caching](https://azure.microsoft.com/blog/adaptive-caching-powers-azure-sql-data-warehouse-performance-gains/) features. These features on average bring five times more performance compared to the same Data Warehouse Unit on Gen1 at the same price. Geo-redundant backups are standard for Gen2 with built-in guaranteed data protection. Azure SQL Data Warehouse Gen2 is ready to scale when you are.

## Columnstore Background Merge
By default, Azure SQL Data Warehouse (Azure SQL DW) stores data in columnar format, with micro-partitions called [rowgroups](https://docs.microsoft.com/azure/sql-data-warehouse/sql-data-warehouse-memory-optimizations-for-columnstore-compression). Sometimes, due to memory constrains at index build or data load time, the rowgroups may be compressed with less than the optimal size of one  million rows. Rowgroups may also become fragmented due to deletes. Small or fragmented rowgroups result in higher memory consumption, as well as inefficient query execution. With this release of Azure SQL DW, the columnstore background maintenance task merges small compressed rowgroups to create larger rowgroups to better utilize memory and speed up query execution.

## Next steps
Now that you know a bit about SQL Data Warehouse, learn how to quickly [create a SQL Data Warehouse][create a SQL Data Warehouse]. If you are new to Azure, you may find the [Azure glossary][Azure glossary] helpful as you learn new terminology. Or look at some of these other SQL Data Warehouse Resources.  

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
[Stack Overflow forum]: https://stackoverflow.com/questions/tagged/azure-sqldw
[Twitter]: https://twitter.com/hashtag/SQLDW
[Videos]: https://azure.microsoft.com/documentation/videos/index/?services=sql-data-warehouse
[create a SQL Data Warehouse]: ./create-data-warehouse-portal.md
[Azure glossary]: ../azure-glossary-cloud-terminology.md
