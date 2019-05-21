---
title: Azure SQL Database In-Memory technologies | Microsoft Docs
description: Azure SQL Database In-Memory technologies greatly improve the performance of transactional and analytics workloads. 
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer:
manager: craigg
ms.date: 03/19/2019
---
# Optimize performance by using In-Memory technologies in SQL Database

In-Memory technologies in Azure SQL Database enable you to improve performance of your application, and potentially reduce cost of your database. 

## When to use In-Memory technologies

By using In-Memory technologies in Azure SQL Database, you can achieve performance improvements with various workloads:

- **Transactional** (online transactional processing (OLTP)) where most of the requests read or update smaller set of data (for example, CRUD operations).
- **Analytic** (online analytical processing (OLAP)) where most of the queries have complex calculations for the reporting purposes, with a certain number of queries that load and append data to the existing tables (so called bulk-load), or delete the data from the tables. 
- **Mixed** (hybrid transaction/analytical processing (HTAP)) where both OLTP and OLAP queries are executed on the same set of data.

In-memory technologies can improve performance of these workloads by keeping the data that should be processed into the memory, using native compilation of the queries, or advanced processing such as batch processing and SIMD instructions that are available on the underlying hardware. 

## Overview

Azure SQL Database has the following In-Memory technologies:
- *[In-Memory OLTP](https://docs.microsoft.com/sql/relational-databases/in-memory-oltp/in-memory-oltp-in-memory-optimization)* increases number of transactions per second and reduces latency for transaction processing. Scenarios that benefit from In-Memory OLTP are: high-throughput transaction processing such as trading and gaming, data ingestion from events or IoT devices, caching, data load, and temporary table and table variable scenarios.
- *Clustered columnstore indexes* reduce your storage footprint (up to 10 times) and improve performance for reporting and analytics queries. You can use it with fact tables in your data marts to fit more data in your database and improve performance. Also, you can use it with historical data in your operational database to archive and be able to query up to 10 times more data.
- *Nonclustered columnstore indexes* for HTAP help you to gain real-time insights into your business through querying the operational database directly, without the need to run an expensive extract, transform, and load (ETL) process and wait for the data warehouse to be populated. Nonclustered columnstore indexes allow fast execution of analytics queries on the OLTP database, while reducing the impact on the operational workload.
- *Memory-optimized clustered columnstore indexes* for HTAP enables you to perform fast transaction processing, and to *concurrently* run analytics queries very quickly on the same data.

Both columnstore indexes and In-Memory OLTP have been part of the SQL Server product since 2012 and 2014, respectively. Azure SQL Database and SQL Server share the same implementation of In-Memory technologies. Going forward, new capabilities for these technologies are released in Azure SQL Database first, before they are released in SQL Server.

## Benefits of In-memory technology

Because of the more efficient query and transaction processing, In-Memory technologies also help you to reduce cost. You typically don't need to upgrade the pricing tier of the database to achieve performance gains. In some cases, you might even be able reduce the pricing tier, while still seeing performance improvements with In-Memory technologies.

Here are two examples of how In-Memory OLTP helped to significantly improve performance:

- By using In-Memory OLTP, [Quorum Business Solutions was able to double their workload while improving DTUs by 70%](https://customers.microsoft.com/story/quorum-doubles-key-databases-workload-while-lowering-dtu-with-sql-database).

  - DTU means *database transaction unit*, and it includes a measurement of resource consumption.
- The following video demonstrates significant improvement in resource consumption with a sample workload: [In-Memory OLTP in Azure SQL Database Video](https://channel9.msdn.com/Shows/Data-Exposed/In-Memory-OTLP-in-Azure-SQL-DB).
  - For more information, see the blog post: [In-Memory OLTP in Azure SQL Database Blog Post](https://azure.microsoft.com/blog/in-memory-oltp-in-azure-sql-database/)

> [!NOTE]  
> In-Memory technologies are available in Premium and Business Critical tier Azure SQL databases and Premium elastic pools.

The following video explains potential performance gains with In-Memory technologies in Azure SQL Database. Remember that the performance gain that you see always depends on many factors, including the nature of the workload and data, access pattern of the database, and so on.

> [!VIDEO https://channel9.msdn.com/Blogs/Azure/Azure-SQL-Database-In-Memory-Technologies/player]
>
>

This article describes aspects of In-Memory OLTP and columnstore indexes that are specific to Azure SQL Database and also includes samples:

- You'll see the impact of these technologies on storage and data size limits.
- You'll see how to manage the movement of databases that use these technologies between the different pricing tiers.
- You'll see two samples that illustrate the use of In-Memory OLTP, as well as columnstore indexes in Azure SQL Database.

For more information, see:

- [In-Memory OLTP Overview and Usage Scenarios](https://msdn.microsoft.com/library/mt774593.aspx) (includes references to customer case studies and information to get started)
- [Documentation for In-Memory OLTP](https://msdn.microsoft.com/library/dn133186.aspx)
- [Columnstore Indexes Guide](https://msdn.microsoft.com/library/gg492088.aspx)
- Hybrid transactional/analytical processing (HTAP), also known as [real-time operational analytics](https://msdn.microsoft.com/library/dn817827.aspx)

## In-memory OLTP

In-memory OLTP technology provides extremely fast data access operations by keeping all data in memory. It also uses specialized indexes, native compilation of queries, and latch-free data-access to improve performance of the OLTP workload. There are two ways to organize your In-Memory OLTP data:

- **Memory-optimized rowstore** format where every row is a separate memory object. This is a classic In-Memory OLTP format optimized for high-performance OLTP workloads. There are two types of memory-optimized tables that can be used in the memory-optimized rowstore format:
  - *Durable tables* (SCHEMA_AND_DATA) where the rows placed in memory are preserved after server restart. This type of tables behaves like a traditional rowstore table with the additional benefits of in-memory optimizations.
  - *Non-durable tables* (SCHEMA_ONLY) where the rows are not-preserved after restart. This type of table is designed for temporary data (for example, replacement of temp tables), or tables where you need to quickly load data before you move it to some persisted table (so called staging tables).
- **Memory-optimized columnstore** format where data is organized in a columnar format. This structure is designed for HTAP scenarios where you need to run analytic queries on the same data structure where your OLTP workload is running.

> [!Note]
> In-Memory OLTP technology is designed for the data structures that can fully reside in memory. Since the In-memory data cannot be offloaded to disk, make sure that you are using database that has enough memory. See [Data size and storage cap for In-Memory OLTP](#data-size-and-storage-cap-for-in-memory-oltp) for more details.

A quick primer on In-Memory OLTP: [Quickstart 1: In-Memory OLTP Technologies for Faster T-SQL Performance](https://msdn.microsoft.com/library/mt694156.aspx) (another article to help you get started)

In-depth videos about the technologies:

- [In-Memory OLTP in Azure SQL Database](https://channel9.msdn.com/Shows/Data-Exposed/In-Memory-OTLP-in-Azure-SQL-DB) (which contains a demo of performance benefits and steps to reproduce these results yourself)
- [In-Memory OLTP Videos: What it is and When/How to use it](https://blogs.msdn.microsoft.com/sqlserverstorageengine/20../../in-memory-oltp-video-what-it-is-and-whenhow-to-use-it/)

There is a programmatic way to understand whether a given database supports In-Memory OLTP. You can execute the following Transact-SQL query:
```
SELECT DatabasePropertyEx(DB_NAME(), 'IsXTPSupported');
```
If the query returns **1**, In-Memory OLTP is supported in this database. The following queries identify all objects that need to be removed before a database can be downgraded to Standard/Basic:
```
SELECT * FROM sys.tables WHERE is_memory_optimized=1
SELECT * FROM sys.table_types WHERE is_memory_optimized=1
SELECT * FROM sys.sql_modules WHERE uses_native_compilation=1
```

### Data size and storage cap for In-Memory OLTP

In-Memory OLTP includes memory-optimized tables, which are used for storing user data. These tables are required to fit in memory. Because you manage memory directly in the SQL Database service, we have the  concept of a quota for user data. This idea is referred to as *In-Memory OLTP storage*.

Each supported single database pricing tier and each elastic pool pricing tier includes a certain amount of In-Memory OLTP storage. See [DTU-based resource limits - single database](sql-database-dtu-resource-limits-single-databases.md), [DTU-based resource limits - elastic pools](sql-database-dtu-resource-limits-elastic-pools.md),[vCore-based resource limits - single databases](sql-database-vcore-resource-limits-single-databases.md) and [vCore-based resource limits - elastic pools](sql-database-vcore-resource-limits-elastic-pools.md).

The following items count toward your In-Memory OLTP storage cap:

- Active user data rows in memory-optimized tables and table variables. Note that old row versions don't count toward the cap.
- Indexes on memory-optimized tables.
- Operational overhead of ALTER TABLE operations.

If you hit the cap, you receive an out-of-quota error, and you are no longer able to insert or update data. To mitigate this error, delete data or increase the pricing tier of the database or pool.

For details about monitoring In-Memory OLTP storage utilization and configuring alerts when you almost hit the cap, see [Monitor In-Memory storage](sql-database-in-memory-oltp-monitoring.md).

#### About elastic pools

With elastic pools, the In-Memory OLTP storage is shared across all databases in the pool. Therefore, the usage in one database can potentially affect other databases. Two mitigations for this are:

- Configure a `Max-eDTU` or `MaxvCore` for databases that is lower than the eDTU or vCore count for the pool as a whole. This maximum caps the In-Memory OLTP storage utilization, in any database in the pool, to the size that corresponds to the eDTU count.
- Configure a `Min-eDTU` or `MinvCore` that is greater than 0. This minimum guarantees that each database in the pool has the amount of available In-Memory OLTP storage that corresponds to the configured `Min-eDTU` or `vCore`.

### Changing service tiers of databases that use In-Memory OLTP technologies

You can always upgrade your database or instance to a higher tier, such as from General Purpose to Business Critical (or Standard to Premium). The available functionality and resources only increase.

But downgrading the tier can negatively impact your database. The impact is especially apparent when you downgrade from Business Critical to General Purpose (or Premium to Standard or Basic) when your database contains In-Memory OLTP objects. Memory-optimized tables are unavailable after the downgrade (even if they remain visible). The same considerations apply when you're lowering the pricing tier of an elastic pool, or moving a database with In-Memory technologies, into a Standard or Basic elastic pool.

> [!Important]
> In-Memory OLTP isn't supported in the General Purpose, Standard or Basic tier. Therefore, it isn't possible to move a database that has any In-Memory OLTP objects to the Standard or Basic tier.

Before you downgrade the database to Standard/Basic, remove all memory-optimized tables and table types, as well as all natively compiled T-SQL modules. 

*Scaling-down resources in Business Critical tier*: Data in memory-optimized tables must fit within the In-Memory OLTP storage that is associated with the tier of the database or Managed Instance, or it is available in the elastic pool. If you try to scale-down the tier or move the database into a pool that doesn't have enough available In-Memory OLTP storage, the operation fails.

## In-memory columnstore

In-memory columnstore technology is enabling you to store and query a large amount of data in the tables. Columnstore technology uses column-based data storage format and batch query processing to achieve gain up to 10 times the query performance in OLAP workloads over traditional row-oriented storage. You can also achieve gains up to 10 times the data compression over the uncompressed data size.
There are two types of columnstore models that you can use to organize your data:

- **Clustered columnstore** where all data in the table is organized in the columnar format. In this model, all rows in the table are placed in columnar format that highly compresses the data and enables you to execute fast analytical queries and reports on the table. Depending on the nature of your data, the size of your data might be decreased 10x-100x. Clustered columnstore model also enables fast ingestion of large amount of data (bulk-load) since large batches of data greater than 100K rows are compressed before they are stored on disk. This model is a good choice for the classic data warehouse scenarios. 
- **Non-clustered columnstore** where the data is stored in traditional rowstore table and there is an index in the columnstore format that is used for the analytical queries. This model enables Hybrid Transactional-Analytic Processing (HTAP): the ability to run performant real-time analytics on a transactional workload. OLTP queries are executed on rowstore table that is optimized for accessing a small set of rows, while OLAP queries are executed on columnstore index that is better choice for scans and analytics. Azure SQL Database Query optimizer dynamically chooses rowstore or columnstore format based on the query. Non-clustered columnstore indexes don't decrease the size of the data since original data-set is kept in the original rowstore table without any change. However, the size of additional columnstore index should be in order of magnitude smaller than the equivalent B-tree index.

> [!Note]
> In-memory columnstore technology keeps only the data that is needed for processing in the memory, while the data that cannot fit into the memory is stored on-disk. Therefore, the amount of data in In-memory columnstore structures can exceed the amount of available memory. 

In-depth video about the technology:

- [Columnstore Index: In-Memory Analytics Videos from Ignite 2016](https://blogs.msdn.microsoft.com/sqlserverstorageengine/20../../columnstore-index-in-memory-analytics-i-e-columnstore-index-videos-from-ignite-2016/)

### Data size and storage for columnstore indexes

Columnstore indexes aren't required to fit in memory. Therefore, the only cap on the size of the indexes is the maximum overall database size, which is documented in the [DTU-based purchasing model](sql-database-service-tiers-dtu.md) and [vCore-based purchasing model](sql-database-service-tiers-vcore.md) articles.

When you use clustered columnstore indexes, columnar compression is used for the base table storage. This compression can significantly reduce the storage footprint of your user data, which means that you can fit more data in the database. And the compression can be further increased with [columnar archival compression](https://msdn.microsoft.com/library/cc280449.aspx#using-columnstore-and-columnstore-archive-compression). The amount of compression that you can achieve depends on the nature of the data, but 10 times the compression is not uncommon.

For example, if you have a database with a maximum size of 1 terabyte (TB) and you achieve 10 times the compression by using columnstore indexes, you can fit a total of 10 TB of user data in the database.

When you use nonclustered columnstore indexes, the base table is still stored in the traditional rowstore format. Therefore, the storage savings aren't as big as with clustered columnstore indexes. However, if you're replacing a number of traditional nonclustered indexes with a single columnstore index, you can still see an overall savings in the storage footprint for the table.

### Changing service tiers of databases containing Columnstore indexes

*Downgrading single database to Basic or Standard* might not be possible if your target tier is below S3. Columnstore indexes are supported only on the Business Critical/Premium pricing tier and on the Standard tier, S3 and above, and not on the Basic tier. When you downgrade your database to an unsupported tier or level, your columnstore index becomes unavailable. The system maintains your columnstore index, but it never leverages the index. If you later upgrade back to a supported tier or level, your columnstore index is immediately ready to be leveraged again.

If you have a **clustered** columnstore index, the whole table becomes unavailable after the downgrade. Therefore we recommend that you drop all *clustered* columnstore indexes before you downgrade your database to an unsupported tier or level.

> [!Note]
> Managed Instance supports ColumnStore indexes in all tiers.

<a id="install_oltp_manuallink" name="install_oltp_manuallink"></a>

## Next steps

- [Quickstart 1: In-Memory OLTP Technologies for faster T-SQL Performance](https://msdn.microsoft.com/library/mt694156.aspx)
- [Use In-Memory OLTP in an existing Azure SQL application](sql-database-in-memory-oltp-migration.md)
- [Monitor In-Memory OLTP storage](sql-database-in-memory-oltp-monitoring.md) for In-Memory OLTP
- [Try In-memory features in Azure SQL Database](sql-database-in-memory-sample.md)

## Additional resources

### Deeper information

- [Learn how Quorum doubles key database’s workload while lowering DTU by 70% with In-Memory OLTP in SQL Database](https://customers.microsoft.com/story/quorum-doubles-key-databases-workload-while-lowering-dtu-with-sql-database)
- [In-Memory OLTP in Azure SQL Database Blog Post](https://azure.microsoft.com/blog/in-memory-oltp-in-azure-sql-database/)
- [Learn about In-Memory OLTP](https://msdn.microsoft.com/library/dn133186.aspx)
- [Learn about columnstore indexes](https://msdn.microsoft.com/library/gg492088.aspx)
- [Learn about real-time operational analytics](https://msdn.microsoft.com/library/dn817827.aspx)
- See [Common Workload Patterns and Migration Considerations](https://msdn.microsoft.com/library/dn673538.aspx) (which describes workload patterns where In-Memory OLTP commonly provides significant performance gains)

### Application design

- [In-Memory OLTP (In-Memory Optimization)](https://msdn.microsoft.com/library/dn133186.aspx)
- [Use In-Memory OLTP in an existing Azure SQL application](sql-database-in-memory-oltp-migration.md)

### Tools

- [Azure portal](https://portal.azure.com/)
- [SQL Server Management Studio (SSMS)](https://msdn.microsoft.com/library/mt238290.aspx)
- [SQL Server Data Tools (SSDT)](https://msdn.microsoft.com/library/mt204009.aspx)
