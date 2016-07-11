<properties
   pageTitle="Data warehouse workload"
   description="SQL Data Warehouse's elasticity lets you grow, shrink, or pause compute power by using a sliding scale of data warehouse units (DWUs). This article explains the data warehouse metrics and how they relate to DWUs. "
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="barbkess"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="07/01/2016"
   ms.author="barbkess;mausher;jrj;sonyama"/>


# Data warehouse workload
A data warehouse workload refers to all of the operations that transpire against a data warehouse. The data warehouse workload encompasses the entire process of loading data into the warehouse, performing analysis and reporting on the data warehouse, managing data in the data warehouse, and exporting data from the data warehouse. The depth and breadth of these components are often commensurate with the maturity level of the data warehouse.


## New to data warehousing?
A data warehouse is a collection of data that is loaded from one or more data sources and is used to perform business intelligence tasks such as reporting and data analysis.

Data warehouses are characterized by queries that scan larger numbers of rows, large ranges of data and may return relatively large results for the purposes of analysis and reporting. Data warehouses are also characterized by relatively large data loads versus small transaction-level inserts/updates/deletes.

- A data warehouse performs best when the data is stored in a way that optimizes queries that need to scan large numbers of rows or large ranges of data. This type of scanning works best when the data is stored and searched by columns, instead of by rows.

>[AZURE.NOTE] The in-memory columnstore index, which uses column storage, provides up to 10x compression gains and 100x query performance gains over traditional binary trees for reporting and analytics queries. We consider columnstore indexes as the standard for storing and scanning large data in a data warehouse.

- A data warehouse has different requirements than a system that optimizes for online transaction processing (OLTP). The OLTP system has many insert, update, and delete operations. These operations seek to specific rows in the table. Table seeks perform best when the data is stored in a row-by-row manner. The data can be sorted and quickly searched with a divide and conquer approach called a binary tree or btree search.


## Data loading
Data loading is a big part of the data warehouse workload. Businesses usually have a busy OLTP system that tracks changes throughout the day when customers are generating business transactions. Periodically, often at night during a maintenance window, the transactions are moved or copied to the data warehouse. Once the data is in the data warehouse, analysts can perform analysis and make business decisions on the data.

- Traditionally, the process of loading is called ETL for Extract, Transform, and Load. Data usually needs to be transformed so it is consistent with other data in the data warehouse. Previously, businesses used dedicated ETL servers to perform the transformations. Now, with such fast massively parallel processing you can load data into SQL Data Warehouse first, and then perform the transformations. This process is called Extract, Load, and Transform (ELT), and is becoming a new standard for the data warehouse workload.

> [AZURE.NOTE] With SQL Server CTP2, you can now perform analytics in real-time on an OLTP table. This does not replace the need for a data warehouse to store and analyze data, but it does provide a way to perform analysis in real-time.

### Reporting and analysis queries
Reporting and analysis queries are often categorized into small, medium and large based on a number of criteria, but usually it is based on time. In most data warehouses, there is a mixed workload of fast-running versus long-running queries. In each case, it is important to determine this mix and to determine its frequency (hourly, daily, month-end, quarter-end, and so on). It is important to understand that the mixed query workload, coupled with concurrency, lead to proper capacity planning for a data warehouse.

- Capacity planning can be a complex task for a mixed query workload, especially when you need a long lead time to add capacity to the data warehouse. SQL Data Warehouse removes the urgency of capacity planning since you can grow and shrink compute capacity at any time, and since storage and compute capacity are independently sized.

### Data management
Managing data is important, especially when you know you might run out of disk space in the near future. Data warehouses usually divide the data into meaningful ranges, which are stored as partitions in a table. All SQL Server-based products let you move partitions in and out of the table. This partition switching lets you move older data to less expensive storage and keep the latest data available on online storage.

- Columnstore indexes support partitioned tables. For columnstore indexes, partitioned tables are used for data management and archival. For tables stored row-by-row, partitions have a larger role in query performance.  

- PolyBase plays an important role in managing data. Using PolyBase, you have the option to archive older data to Hadoop or Azure blob storage.  This provides lots of options since the data is still online.  It might take longer to retrieve data from Hadoop, but the tradeoff of retrieval time might outweigh the storage cost.

### Exporting data
One way to make data available for reports and analysis is to send data from the data warehouse to servers dedicated for running reports and analysis. These servers are called data marts. For example, you could pre-process report data and then export it from the data warehouse to many servers around the world, to make it broadly available for customers and analysts.

- For generating reports, each night you could populate read-only reporting servers with a snapshot of the daily data. This gives higher bandwidth for customers while lowering the compute resource needs on the data warehouse. From a security aspect, data marts allow you to reduce the number of users who have access to the data warehouse.
- For analytics, you can either build an analysis cube on the data warehouse and run analysis against the data warehouse, or pre-process data and export it to the analysis server for further analytics.

## Next steps
Now that you know a bit about SQL Data Warehouse, learn how to quickly [create a SQL Data Warehouse][] and [load sample data][].

<!--Image references-->

<!--Article references-->
[load sample data]: ./sql-data-warehouse-load-sample-databases.md
[create a SQL Data Warehouse]: ./sql-data-warehouse-get-started-provision.md

<!--MSDN references-->

<!--Other web references-->
