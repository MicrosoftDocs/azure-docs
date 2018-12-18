---
title: Azure SQL Database In-Memory technologies | Microsoft Docs
description: Azure SQL Database In-Memory technologies greatly improve the performance of transactional and analytics workloads. 
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: jodebrui
ms.author: jodebrui
ms.reviewer:
manager: craigg
ms.date: 12/18/2018
---
# Optimize performance by using In-Memory technologies in SQL Database

In-Memory technologies in Azure SQL Database enable you to improve performance of your application, and potentially reduce cost of your database. By using In-Memory technologies in Azure SQL Database, you can achieve performance improvements with various workloads:
- **Transactional** (online transactional processing (OLTP)) where most of the requests read or update smaller set of data (for example, CRUD operations).
- **Analytic** (online analytical processing (OLAP)) where most of the queries have complex calculations for the reporting purposes, with a certain number of queries that load and append data to the existing tables (so called bulk-load), or delete the data from the tables. 
- **Mixed** (hybrid transaction/analytical processing (HTAP)) where both OLTP and OLAP queries are executed on the same set of data.

In-memory technologies can improve performance of these workloads by keeping the data that should be processed into the memory, using native compilation of the queries, or advanced processing such as batch processing and SIMD instructions that are available on the underlying hardware.

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

In-Memory technologies are available in all databases in the Premium tier, including databases in Premium elastic pools.

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

In-memory OLTP technology provides extremely fast data access operations by keeping all data in memory. It also uses specialized indexes, native compilation of queries, and latch-free data-acccess to improve performance of the OLTP workload. There are two ways to organize your In-Memory OLTP data:
- **Memory-optimized rowstore** format where every row is a separate memory object. This is a classic In-Memory OLTP format optimized for high-performance OLTP workloads. There are two types of memory-optimized tables that can be used in the memory-optimized rowstore format:
  - *Durable tables* (SCHEMA_AND_DATA) where the rows placed in memory are preserved after server restart. This type of tables behaves like a traditional rowstore table with the additional benefits of in-memory optimizations.
  - *Non-durable tables* (SCEMA_ONLY) where the rows are not-preserved after restart. This type of table is designed for temporary data (for example, replacement of temp tables), or tables where you need to quickly load data before you move it to some persisted table (so called staging tables).
- **Memory-optimized columnstore** format where data is organized in a columnar format. This structure is designed for HTAP scenarios where you need to run analytic queries on the same data structure where your OLTP workload is running.

> [!Note]
> In-Memory OLTP technology is designed for the data structures that can fully reside in memory. Since the In-memory data cannot be offloaded to disk, make sure that you are using database that has enough memory. See [Data size and storage cap for In-Memory OLTP](#data-size-and-storage-cap-for-in-memory-oltp) for more details.

A quick primer on In-Memory OLTP: [Quickstart 1: In-Memory OLTP Technologies for Faster T-SQL Performance](https://msdn.microsoft.com/library/mt694156.aspx) (another article to help you get started)

In-depth videos about the technologies:

- [In-Memory OLTP in Azure SQL Database](https://channel9.msdn.com/Shows/Data-Exposed/In-Memory-OTLP-in-Azure-SQL-DB) (which contains a demo of performance benefits and steps to reproduce these results yourself)
- [In-Memory OLTP Videos: What it is and When/How to use it](https://blogs.msdn.microsoft.com/sqlserverstorageengine/2016/10/03/in-memory-oltp-video-what-it-is-and-whenhow-to-use-it/)

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
- [Columnstore Index: In-Memory Analytics Videos from Ignite 2016](https://blogs.msdn.microsoft.com/sqlserverstorageengine/2016/10/04/columnstore-index-in-memory-analytics-i-e-columnstore-index-videos-from-ignite-2016/)

### Data size and storage for columnstore indexes

Columnstore indexes aren't required to fit in memory. Therefore, the only cap on the size of the indexes is the maximum overall database size, which is documented in the [DTU-based purchasing model](sql-database-service-tiers-dtu.md) and [vCore-based purchasing model](sql-database-service-tiers-vcore.md) articles.

When you use clustered columnstore indexes, columnar compression is used for the base table storage. This compression can significantly reduce the storage footprint of your user data, which means that you can fit more data in the database. And the compression can be further increased with [columnar archival compression](https://msdn.microsoft.com/library/cc280449.aspx#Using Columnstore and Columnstore Archive Compression). The amount of compression that you can achieve depends on the nature of the data, but 10 times the compression is not uncommon.

For example, if you have a database with a maximum size of 1 terabyte (TB) and you achieve 10 times the compression by using columnstore indexes, you can fit a total of 10 TB of user data in the database.

When you use nonclustered columnstore indexes, the base table is still stored in the traditional rowstore format. Therefore, the storage savings aren't as big as with clustered columnstore indexes. However, if you're replacing a number of traditional nonclustered indexes with a single columnstore index, you can still see an overall savings in the storage footprint for the table.

### Changing service tiers of databases containing Columnstore indexes

*Downgrading Single Database to Basic or Standard* might not be possible if your target tier is below S3. Columnstore indexes are supported only on the Business Critical/Premium pricing tier and on the Standard tier, S3 and above, and not on the Basic tier. When you downgrade your database to an unsupported tier or level, your columnstore index becomes unavailable. The system maintains your columnstore index, but it never leverages the index. If you later upgrade back to a supported tier or level, your columnstore index is immediately ready to be leveraged again.

If you have a **clustered** columnstore index, the whole table becomes unavailable after the downgrade. Therefore we recommend that you drop all *clustered* columnstore indexes before you downgrade your database to an unsupported tier or level.

> [!Note]
> Managed Instance supports Columstore indexes in all tiers.

<a id="install_oltp_manuallink" name="install_oltp_manuallink"></a>

&nbsp;

## 1. Install the In-Memory OLTP sample

You can create the AdventureWorksLT sample database with a few clicks in the [Azure portal](https://portal.azure.com/). Then, the steps in this section explain how you can enrich your AdventureWorksLT database with In-Memory OLTP objects and demonstrate performance benefits.

For a more simplistic, but more visually appealing performance demo for In-Memory OLTP, see:

- Release: [in-memory-oltp-demo-v1.0](https://github.com/Microsoft/sql-server-samples/releases/tag/in-memory-oltp-demo-v1.0)
- Source code: [in-memory-oltp-demo-source-code](https://github.com/Microsoft/sql-server-samples/tree/master/samples/features/in-memory/ticket-reservations)

#### Installation steps

1. In the [Azure portal](https://portal.azure.com/), create a Premium or Business Critical database on a server. Set the **Source** to the AdventureWorksLT sample database. For detailed instructions, see [Create your first Azure SQL database](sql-database-get-started-portal.md).

2. Connect to the database with SQL Server Management Studio [(SSMS.exe)](https://msdn.microsoft.com/library/mt238290.aspx).

3. Copy the [In-Memory OLTP Transact-SQL script](https://raw.githubusercontent.com/Microsoft/sql-server-samples/master/samples/features/in-memory/t-sql-scripts/sql_in-memory_oltp_sample.sql) to your clipboard. The T-SQL script creates the necessary In-Memory objects in the AdventureWorksLT sample database that you created in step 1.

4. Paste the T-SQL script into SSMS, and then execute the script. The `MEMORY_OPTIMIZED = ON` clause CREATE TABLE statements are crucial. For example:


```
CREATE TABLE [SalesLT].[SalesOrderHeader_inmem](
	[SalesOrderID] int IDENTITY NOT NULL PRIMARY KEY NONCLUSTERED ...,
	...
) WITH (MEMORY_OPTIMIZED = ON);
```


#### Error 40536


If you get error 40536 when you run the T-SQL script, run the following T-SQL script to verify whether the database supports In-Memory:


```
SELECT DatabasePropertyEx(DB_Name(), 'IsXTPSupported');
```


A result of **0** means that In-Memory isn't supported, and **1** means that it is supported. To diagnose the problem, ensure that the database is at the Premium service tier.


#### About the created memory-optimized items

**Tables**: The sample contains the following memory-optimized tables:

- SalesLT.Product_inmem
- SalesLT.SalesOrderHeader_inmem
- SalesLT.SalesOrderDetail_inmem
- Demo.DemoSalesOrderHeaderSeed
- Demo.DemoSalesOrderDetailSeed


You can inspect memory-optimized tables through the **Object Explorer** in SSMS. Right-click **Tables** > **Filter** > **Filter Settings** > **Is Memory Optimized**. The value equals 1.


Or you can query the catalog views, such as:


```
SELECT is_memory_optimized, name, type_desc, durability_desc
	FROM sys.tables
	WHERE is_memory_optimized = 1;
```


**Natively compiled stored procedure**: You can inspect SalesLT.usp_InsertSalesOrder_inmem through a catalog view query:


```
SELECT uses_native_compilation, OBJECT_NAME(object_id), definition
	FROM sys.sql_modules
	WHERE uses_native_compilation = 1;
```


&nbsp;

### Run the sample OLTP workload

The only difference between the following two *stored procedures* is that the first procedure uses memory-optimized versions of the tables, while the second procedure uses the regular on-disk tables:

- SalesLT**.**usp_InsertSalesOrder**_inmem**
- SalesLT**.**usp_InsertSalesOrder**_ondisk**


In this section, you see how to use the handy **ostress.exe** utility to execute the two stored procedures at stressful levels. You can compare how long it takes for the two stress runs to finish.


When you run ostress.exe, we recommend that you pass parameter values designed for both of the following:

- Run a large number of concurrent connections, by using -n100.
- Have each connection loop hundreds of times, by using -r500.


However, you might want to start with much smaller values like -n10 and -r50 to ensure that everything is working.


### Script for ostress.exe


This section displays the T-SQL script that is embedded in our ostress.exe command line. The script uses items that were created by the T-SQL script that you installed earlier.


The following script inserts a sample sales order with five line items into the following memory-optimized *tables*:

- SalesLT.SalesOrderHeader_inmem
- SalesLT.SalesOrderDetail_inmem


```
DECLARE
	@i int = 0,
	@od SalesLT.SalesOrderDetailType_inmem,
	@SalesOrderID int,
	@DueDate datetime2 = sysdatetime(),
	@CustomerID int = rand() * 8000,
	@BillToAddressID int = rand() * 10000,
	@ShipToAddressID int = rand() * 10000;

INSERT INTO @od
	SELECT OrderQty, ProductID
	FROM Demo.DemoSalesOrderDetailSeed
	WHERE OrderID= cast((rand()*60) as int);

WHILE (@i < 20)
begin;
	EXECUTE SalesLT.usp_InsertSalesOrder_inmem @SalesOrderID OUTPUT,
		@DueDate, @CustomerID, @BillToAddressID, @ShipToAddressID, @od;
	SET @i = @i + 1;
end
```


To make the *_ondisk* version of the preceding T-SQL script for ostress.exe, you would replace both occurrences of the *_inmem* substring with *_ondisk*. These replacements affect the names of tables and stored procedures.


### Install RML utilities and `ostress`


Ideally, you would plan to run ostress.exe on an Azure virtual machine (VM). You would create an [Azure VM](https://azure.microsoft.com/documentation/services/virtual-machines/) in the same Azure geographic region where your AdventureWorksLT database resides. But you can run ostress.exe on your laptop instead.


On the VM, or on whatever host you choose, install the Replay Markup Language (RML) utilities. The utilities include ostress.exe.

For more information, see:
- The ostress.exe discussion in [Sample Database for In-Memory OLTP](https://msdn.microsoft.com/library/mt465764.aspx).
- [Sample Database for In-Memory OLTP](https://msdn.microsoft.com/library/mt465764.aspx).
- The [blog for installing ostress.exe](https://blogs.msdn.com/b/psssql/archive/2013/10/29/cumulative-update-2-to-the-rml-utilities-for-microsoft-sql-server-released.aspx).



<!--
dn511655.aspx is for SQL 2014,
[Extensions to AdventureWorks to Demonstrate In-Memory OLTP]
(http://msdn.microsoft.com/library/dn511655&#x28;v=sql.120&#x29;.aspx)

whereas for SQL 2016+
[Sample Database for In-Memory OLTP]
(http://msdn.microsoft.com/library/mt465764.aspx)
-->



### Run the *_inmem* stress workload first


You can use an *RML Cmd Prompt* window to run our ostress.exe command line. The command-line parameters direct `ostress` to:

- Run 100 connections concurrently (-n100).
- Have each connection run the T-SQL script 50 times (-r50).


```
ostress.exe -n100 -r50 -S<servername>.database.windows.net -U<login> -P<password> -d<database> -q -Q"DECLARE @i int = 0, @od SalesLT.SalesOrderDetailType_inmem, @SalesOrderID int, @DueDate datetime2 = sysdatetime(), @CustomerID int = rand() * 8000, @BillToAddressID int = rand() * 10000, @ShipToAddressID int = rand()* 10000; INSERT INTO @od SELECT OrderQty, ProductID FROM Demo.DemoSalesOrderDetailSeed WHERE OrderID= cast((rand()*60) as int); WHILE (@i < 20) begin; EXECUTE SalesLT.usp_InsertSalesOrder_inmem @SalesOrderID OUTPUT, @DueDate, @CustomerID, @BillToAddressID, @ShipToAddressID, @od; set @i += 1; end"
```


To run the preceding ostress.exe command line:


1. Reset the database data content by running the following command in SSMS, to delete all the data that was inserted by any previous runs:

    ``` tsql
    EXECUTE Demo.usp_DemoReset;
    ```

2. Copy the text of the preceding ostress.exe command line to your clipboard.

3. Replace the `<placeholders>` for the parameters -S -U -P -d with the correct real values.

4. Run your edited command line in an RML Cmd window.


#### Result is a duration


When `ostress.exe` finishes, it writes the run duration as its final line of output in the RML Cmd window. For example, a shorter test run lasted about 1.5 minutes:

`11/12/15 00:35:00.873 [0x000030A8] OSTRESS exiting normally, elapsed time: 00:01:31.867`


#### Reset, edit for *_ondisk*, then rerun


After you have the result from the *_inmem* run, perform the following steps for the *_ondisk* run:


1. Reset the database by running the following command in SSMS to delete all the data that was inserted by the previous run:
```
EXECUTE Demo.usp_DemoReset;
```

2. Edit the ostress.exe command line to replace all *_inmem* with *_ondisk*.

3. Rerun ostress.exe for the second time, and capture the duration result.

4. Again, reset the database (for responsibly deleting what can be a large amount of test data).


#### Expected comparison results

Our In-Memory tests have shown that performance improved by **nine times** for this simplistic workload, with `ostress` running on an Azure VM in the same Azure region as the database.

<a id="install_analytics_manuallink" name="install_analytics_manuallink"></a>

&nbsp;

## 2. Install the In-Memory Analytics sample


In this section, you compare the IO and statistics results when you're using a columnstore index versus a traditional b-tree index.


For real-time analytics on an OLTP workload, it's often best to use a nonclustered columnstore index. For details, see [Columnstore Indexes Described](https://msdn.microsoft.com/library/gg492088.aspx).



### Prepare the columnstore analytics test


1. Use the Azure portal to create a fresh AdventureWorksLT database from the sample.
 - Use that exact name.
 - Choose any Premium service tier.

2. Copy the [sql_in-memory_analytics_sample](https://raw.githubusercontent.com/Microsoft/sql-server-samples/master/samples/features/in-memory/t-sql-scripts/sql_in-memory_analytics_sample.sql) to your clipboard.
 - The T-SQL script creates the necessary In-Memory objects in the AdventureWorksLT sample database that you created in step 1.
 - The script creates the Dimension table and two fact tables. The fact tables are populated with 3.5 million rows each.
 - The script might take 15 minutes to complete.

3. Paste the T-SQL script into SSMS, and then execute the script. The **COLUMNSTORE** keyword in the **CREATE INDEX** statement is crucial, as in:<br/>`CREATE NONCLUSTERED COLUMNSTORE INDEX ...;`

4. Set AdventureWorksLT to compatibility level 130:<br/>`ALTER DATABASE AdventureworksLT SET compatibility_level = 130;`

    Level 130 is not directly related to In-Memory features. But level 130 generally provides faster query performance than 120.


#### Key tables and columnstore indexes


- dbo.FactResellerSalesXL_CCI is a table that has a clustered columnstore index, which has advanced compression at the *data* level.

- dbo.FactResellerSalesXL_PageCompressed is a table that has an equivalent regular clustered index, which is compressed only at the *page* level.


#### Key queries to compare the columnstore index


There are [several T-SQL query types that you can run](https://raw.githubusercontent.com/Microsoft/sql-server-samples/master/samples/features/in-memory/t-sql-scripts/clustered_columnstore_sample_queries.sql) to see performance improvements. In step 2 in the T-SQL script, pay attention to this pair of queries. They differ only on one line:


- `FROM FactResellerSalesXL_PageCompressed a`
- `FROM FactResellerSalesXL_CCI a`


A clustered columnstore index is in the FactResellerSalesXL\_CCI table.

The following T-SQL script excerpt prints statistics for IO and TIME for the query of each table.


```
/*********************************************************************
Step 2 -- Overview
-- Page Compressed BTree table v/s Columnstore table performance differences
-- Enable actual Query Plan in order to see Plan differences when Executing
*/
-- Ensure Database is in 130 compatibility mode
ALTER DATABASE AdventureworksLT SET compatibility_level = 130
GO

-- Execute a typical query that joins the Fact Table with dimension tables
-- Note this query will run on the Page Compressed table, Note down the time
SET STATISTICS IO ON
SET STATISTICS TIME ON
GO

SELECT c.Year
	,e.ProductCategoryKey
	,FirstName + ' ' + LastName AS FullName
	,count(SalesOrderNumber) AS NumSales
	,sum(SalesAmount) AS TotalSalesAmt
	,Avg(SalesAmount) AS AvgSalesAmt
	,count(DISTINCT SalesOrderNumber) AS NumOrders
	,count(DISTINCT a.CustomerKey) AS CountCustomers
FROM FactResellerSalesXL_PageCompressed a
INNER JOIN DimProduct b ON b.ProductKey = a.ProductKey
INNER JOIN DimCustomer d ON d.CustomerKey = a.CustomerKey
Inner JOIN DimProductSubCategory e on e.ProductSubcategoryKey = b.ProductSubcategoryKey
INNER JOIN DimDate c ON c.DateKey = a.OrderDateKey
GROUP BY e.ProductCategoryKey,c.Year,d.CustomerKey,d.FirstName,d.LastName
GO
SET STATISTICS IO OFF
SET STATISTICS TIME OFF
GO


-- This is the same Prior query on a table with a clustered columnstore index CCI
-- The comparison numbers are even more dramatic the larger the table is (this is an 11 million row table only)
SET STATISTICS IO ON
SET STATISTICS TIME ON
GO
SELECT c.Year
	,e.ProductCategoryKey
	,FirstName + ' ' + LastName AS FullName
	,count(SalesOrderNumber) AS NumSales
	,sum(SalesAmount) AS TotalSalesAmt
	,Avg(SalesAmount) AS AvgSalesAmt
	,count(DISTINCT SalesOrderNumber) AS NumOrders
	,count(DISTINCT a.CustomerKey) AS CountCustomers
FROM FactResellerSalesXL_CCI a
INNER JOIN DimProduct b ON b.ProductKey = a.ProductKey
INNER JOIN DimCustomer d ON d.CustomerKey = a.CustomerKey
Inner JOIN DimProductSubCategory e on e.ProductSubcategoryKey = b.ProductSubcategoryKey
INNER JOIN DimDate c ON c.DateKey = a.OrderDateKey
GROUP BY e.ProductCategoryKey,c.Year,d.CustomerKey,d.FirstName,d.LastName
GO

SET STATISTICS IO OFF
SET STATISTICS TIME OFF
GO
```

In a database with the P2 pricing tier, you can expect about nine times the performance gain for this query by using the clustered columnstore index compared with the traditional index. With P15, you can expect about 57 times the performance gain by using the columnstore index.



## Next steps

- [Quickstart 1: In-Memory OLTP Technologies for faster T-SQL Performance](https://msdn.microsoft.com/library/mt694156.aspx)

- [Use In-Memory OLTP in an existing Azure SQL application](sql-database-in-memory-oltp-migration.md)

- [Monitor In-Memory OLTP storage](sql-database-in-memory-oltp-monitoring.md) for In-Memory OLTP


## Additional resources

#### Deeper information

- [Learn how Quorum doubles key database’s workload while lowering DTU by 70% with In-Memory OLTP in SQL Database](https://customers.microsoft.com/story/quorum-doubles-key-databases-workload-while-lowering-dtu-with-sql-database)

- [In-Memory OLTP in Azure SQL Database Blog Post](https://azure.microsoft.com/blog/in-memory-oltp-in-azure-sql-database/)

- [Learn about In-Memory OLTP](https://msdn.microsoft.com/library/dn133186.aspx)

- [Learn about columnstore indexes](https://msdn.microsoft.com/library/gg492088.aspx)

- [Learn about real-time operational analytics](https://msdn.microsoft.com/library/dn817827.aspx)

- See [Common Workload Patterns and Migration Considerations](https://msdn.microsoft.com/library/dn673538.aspx) (which describes workload patterns where In-Memory OLTP commonly provides significant performance gains)

#### Application design

- [In-Memory OLTP (In-Memory Optimization)](https://msdn.microsoft.com/library/dn133186.aspx)

- [Use In-Memory OLTP in an existing Azure SQL application](sql-database-in-memory-oltp-migration.md)

#### Tools

- [Azure portal](https://portal.azure.com/)

- [SQL Server Management Studio (SSMS)](https://msdn.microsoft.com/library/mt238290.aspx)

- [SQL Server Data Tools (SSDT)](https://msdn.microsoft.com/library/mt204009.aspx)
