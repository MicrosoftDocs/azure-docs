<properties
	pageTitle="SQL In-Memory Technologies | Microsoft Azure"
	description="SQL In-Memory technologies greatly improve the performance of transactional and analytics workloads. Learn how to take advantage of these technologies."
	services="sql-database"
	documentationCenter=""
	authors="jodebrui"
	manager="jhubbard"
	editor=""/>


<tags
	ms.service="sql-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="11/09/2016"
	ms.author="jodebrui"/>


# Optimize Performance using In-Memory Technologies in SQL Database

In-Memory technologies are available in all database in the Premium tier, including databases in Premium elastic pools. They help to optimize the performance of transactional (OLTP), analytics (OLAP), as well as mixed workloads (HTAP). With these technologies customers have been able to achieve up to 30X performance improvement for transaction processing and up to 100X performance improvement for analytical queries, for some scenarios. Not only do In-Memory technologies allow you to achieve unparalleled performance, you can also reduce cost: you typically do not need to upgrade the pricing tier of the database to achieve performance gains, and in some cases you could even reduce the pricing tier while still seeing performance improvements using In-Memory technologies, compared with traditional tables and indexes.

> [AZURE.VIDEO azure-sql-database-in-memory-technologies]

Azure SQL Database has the following In-Memory technologies:

- *In-Memory OLTP* increases throughput and reduces latency for transaction processing. Scenarios that benefit from In-Memory OLTP are: high-throughput transaction processing such as trading and gaming, data ingestion from events or IoT devices, caching, data load, and temp table and table variable scenarios.
- *Clustered Columnstore Indexes* reduce storage footprint (up to 10X) and improve performance for reporting and analytics queries. Use it with fact tables in your data marts to fit more data in your database and improve performance. Use it with historical data in your operational database to archive and be able to query up to 10 times more data.
- *Nonclustered Columnstore Indexes* for Hybrid Transactional and Analytical Processing (HTAP): gain real-time insights into your business by querying the operational database directly, without the need to run an expensive ETL process and wait for the data warehouse to be populated. Nonclustered Columnstore indexes allow very fast execution of analytics queries on the OLTP database, while reducing the impact on the operational workload.
- In-Memory OLTP and Columnstore can also be combined: you can have a memory-optimized table with a columnstore index, allowing you to both perform very fast transaction processing and run analytics queries very fast on the same data.

Both Columnstore and In-Memory OLTP have been part of the SQL Server product since 2012 and 2014, respectively. Azure SQL Database and SQL Server share the same implementation of In-Memory technologies, and, going forward, new capabilities for these technologies are released on Azure SQL Database first, before making their way into the next release of SQL Server. 

This topic describes aspects of In-Memory OLTP and Columnstore indexes that are specific to Azure SQL Database, and includes samples. First you will see the impact of these technologies on storage and what are the limits on data size. Then you will see how to manage moving databases that leverage these technologies between the different pricing tiers. Finally, you will see two samples that illustrate the use of In-Memory OLTP as well as Columnstore in Azure SQL Database.

In-depth information about the technologiescan be found at the following locations:

- [In-Memory OLTP](http://msdn.microsoft.com/library/dn133186.aspx)
- [Columnstore Indexes Guide](https://msdn.microsoft.com/library/gg492088.aspx)
- Hybrid Transactional and Analytical Processing aka [real-time operational analytics](https://msdn.microsoft.com/library/dn817827.aspx)

A quick primer on In-Memory OLTP can be found here:

- [Quick Start 1: In-Memory OLTP Technologies for Faster T-SQL Performance](http://msdn.microsoft.com/library/mt694156.aspx) - is another article to help you get started.

In-depth videos about the technologies:

- [In-Memory OLTP Videos: What it is and When/How to use it](https://blogs.msdn.microsoft.com/sqlserverstorageengine/2016/10/03/in-memory-oltp-video-what-it-is-and-whenhow-to-use-it/)
- [Columnstore Index: In-Memory Analytics (i.e. columnstore index) Videos from Ignite 2016](https://blogs.msdn.microsoft.com/sqlserverstorageengine/2016/10/04/columnstore-index-in-memory-analytics-i-e-columnstore-index-videos-from-ignite-2016/)

## Storage and data size

### Data size and storage cap for In-Memory OLTP

In-Memory OLTP includes memory-optimized tables, which are used for storing user data. These tables are required to fit in memory. Since you do manage memory directly in the SQL Database service, we have a concept of quota for user data, referred to as *In-Memory OLTP Storage*.

Each supported standalone  database pricing tier and each elastic pool pricing tier includes a certain amount of In-Memory OLTP Storage. At the time of writing you get a gigabyte of storage for every 125 DTUs or eDTUs.

[SQL Database Service Tiers](sql-database-service-tiers.md) has the official list of In-Memory OLTP storage available for each supported standalone database and elastic pool pricing tier.

The following counts towards your In-Memory OLTP storage cap:

- Active user data rows in memory-optimized tables and table variables. Note that old row versions do not count toward the cap.
- Indexes on memory-optimized tables.
- Operational overhead of ALTER TABLE operations.

If you hit the cap you will receive an out-of-quota error and will no longer be able to insert or update data. Mitigation is to delete data or increase the pricing tier of the database or pool.


For details about monitoring In-Memory OLTP storage utilization and configuring alerts when almost hitting the cap see:

- [Monitor In-Memory Storage](sql-database-in-memory-oltp-monitoring.md)

#### Note about elastic pools

With elastic pools the In-Memory OLTP Storage is shared across all databases in the pool, thus the usage in one database can potentially impact other databases. Two mitigations for this are:

- Configure Max-eDTU for databases that is lower than the eDTU count for the pool as a whole. This caps the In-Memory OLTP Storage utilization in any database in the pool to the size corresponding to the eDTU count.
- Configure Min-eDTU greater than 0. This guarantees that each database in the pool has the amount of In-Memory OLTP Storage available corresponding to the configured Min-eDTU.

### Data size and storage for Columnstore indexes

Columnstore indexes are not required to fit in memory. Therefore the only cap on the size of the indexes is the maximum overall database size, which is documented in the [SQL Database Service Tiers](sql-database-service-tiers.md) article.

When using Clustered Columnstore Indexes, columnar compression is used for the base table storage. This can significantly reduce the storage footprint of your user data, meaning that you can fit more data in the database. And this can be further increased with [columnar archival compression](https://msdn.microsoft.com/library/cc280449.aspx#Using Columnstore and Columnstore Archive Compression). The amount of compression you can achieve depends on the nature of the data, but 10X compression is not uncommon.

For example, if you have a database with max size 1 terabyte (TB), and you achieve 10X compression using columnstore, you can fit a total of 10TB of user data in the database.

When using Nonclustered Columnstore Indexes, the base table is still stored in traditional rowstore format, therefore the storage savings are not as big as with Clustered Columnstore. However, if you are replacing a number of traditional nonclustered indexes with a single columnstore index, you can still see an overall saving in storage footprint for the table.

## Moving databases using In-Memory technologies between pricing tiers

Increasing the pricing tier for a database that uses In-Memory technologies does not need any special considerations, since higher pricing tiers always have more functionality and more resources. Decreasing the pricing tier can have implications for your database, especially when moving from Premium to Standard or Basic and when moving a database leveraging In-Memory OLTP to a lower Premium tier. The same considerations apply when lowering the pricing tier of an elastic pool, or moving databases with In-Memory technologies into a Standard or Basic elastic pool.

### In-Memory OLTP

*Downgrade to Basic/Standard.* In-Memory OLTP is not supported in databases in the Standard or Basic tier. In addition, it is not possible to move a database that has any In-Memory OLTP objects to the Standard or Basic tier.

- Before downgrading the database to Standard/Basic, remove all memory-optimized table and table types, as well as all natively compiled T-SQL modules.

There is a programmatic way to understand whether a given database supports In-Memory OLTP. You can execute the following Transact-SQL query:

```
SELECT DatabasePropertyEx(DB_NAME(), 'IsXTPSupported');
```

If the query returns **1**, In-Memory OLTP is supported in this database.


*Downgrade to lower Premium tier.* Data in memory-optimized tables must fit within the In-Memory OLTP storage associated with the pricing tier of the database or available in the elastic pool. If you try to lower the pricing tier or move the database into a pool that does not have enough available In-Memory OLTP storage, the operation will fail.

### Columnstore Indexes

*Downgrade to Basic/Standard.* Columnstore indexes are not supported in databases in the Standard or Basic tier. When downgrading a database to Standard/Basic, columnstore indexes will become unavailable. If you use a Clustered columnstore index, this means the table as a whole becomes unavailable.

- Before downgrading the database to Standard/Basic, drop all clustered columnstore indexes.

*Downgrade to lower Premium tier.* This will succeed as long as the database as a whole fits within the max database size for the target pricing tier or available storage in the elastic pool. There is no specific impact from the Columnstore indexes.


<a id="install_oltp_manuallink" name="install_oltp_manuallink"></a>

&nbsp;

## A. Install the In-Memory OLTP sample

You can create the AdventureWorksLT [V12] sample database by a few clicks in the [Azure portal](https://portal.azure.com/). Then the steps in this section explain how you can enrich your AdventureWorksLT database with In-Memory OLTP objects, and demonstrate performance benefits.

A more simplistic, but more visually appealing performance demo for In-Memory OLTP can be found here:

- Release: [in-memory-oltp-demo-v1.0](https://github.com/Microsoft/sql-server-samples/releases/tag/in-memory-oltp-demo-v1.0)
- Source code: [in-memory-oltp-demo-source-code](https://github.com/Microsoft/sql-server-samples/tree/master/samples/features/in-memory/ticket-reservations)

#### Installation steps

1. In the [Azure portal](https://portal.azure.com/), create a Premium database on a V12 server. Set the **Source** to the AdventureWorksLT [V12] sample database.
 - For detailed instructions, you can see [Create your first Azure SQL database](sql-database-get-started.md).

2. Connect to the database with SQL Server Management Studio [(SSMS.exe)](http://msdn.microsoft.com/library/mt238290.aspx).

3. Copy the [In-Memory OLTP Transact-SQL script](https://raw.githubusercontent.com/Microsoft/sql-server-samples/master/samples/features/in-memory/t-sql-scripts/sql_in-memory_oltp_sample.sql) to your clipboard.
 - The T-SQL script creates the necessary In-Memory objects in the AdventureWorksLT sample database you created in step 1.

4. Paste the T-SQL script into SSMS, and then execute the script.
 - Crucial is the `MEMORY_OPTIMIZED = ON` clause CREATE TABLE statements, as in:


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


A result of **0** means In-Memory is not supported, and 1 means it is supported. To diagnose the problem:

- Ensure the database is at the Premium service tier.


#### About the created memory-optimized items

**Tables**: The sample contains the following memory-optimized tables:

- SalesLT.Product_inmem
- SalesLT.SalesOrderHeader_inmem
- SalesLT.SalesOrderDetail_inmem
- Demo.DemoSalesOrderHeaderSeed
- Demo.DemoSalesOrderDetailSeed


You can inspect memory-optimized tables through the **Object Explorer** in SSMS by:

- Right-click **Tables** > **Filter** > **Filter Settings** > **Is Memory Optimized** equals 1.


Or you can query the catalog views such as:


```
SELECT is_memory_optimized, name, type_desc, durability_desc
	FROM sys.tables
	WHERE is_memory_optimized = 1;
```


**Natively compiled stored procedure**: SalesLT.usp_InsertSalesOrder_inmem can be inspected through a catalog view query:


```
SELECT uses_native_compilation, OBJECT_NAME(object_id), definition
	FROM sys.sql_modules
	WHERE uses_native_compilation = 1;
```


&nbsp;

## Run the sample OLTP workload

The only difference between the following two *stored procedures* is that the first procedure uses memory-optimized versions of the tables, while the second procedure uses the regular on-disk tables:

- SalesLT**.**usp_InsertSalesOrder**_inmem**
- SalesLT**.**usp_InsertSalesOrder**_ondisk**


In this section, you see how to use the handy **ostress.exe** utility to execute the two stored procedures at stressful levels. You can compare how long it takes the two stress runs to complete.


When you run ostress.exe, we recommend that you pass parameter values designed to both:

- Run a large number of concurrent connections, by using -n100.
- Have each connection loop hundreds of times, by using -r500.


However, you might want to start with much smaller values like -n10 and -r50 to ensure the everything is working.


### Script for ostress.exe


This section displays the T-SQL script that is embedded in our ostress.exe command line. The script uses items that were created by the T-SQL script you installed earlier.


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


To make the *_ondisk* version of the preceding T-SQL for ostress.exe, you would simply replace both occurrences of the *_inmem* substring with *_ondisk*. These replaces affect the names of tables and stored procedures.


### Install RML utilities and ostress


Ideally you would plan to run ostress.exe on an Azure VM. You would create an [Azure Virtual Machine](https://azure.microsoft.com/documentation/services/virtual-machines/) in the same Azure geographic region where your AdventureWorksLT database resides. But you can run ostress.exe on your laptop instead.


On the VM, or on whatever host you choose, install the Replay Markup Language (RML) utilities, which include ostress.exe.

- See the ostress.exe discussion in [Sample Database for In-Memory OLTP](http://msdn.microsoft.com/library/mt465764.aspx).
 - Or see [Sample Database for In-Memory OLTP](http://msdn.microsoft.com/library/mt465764.aspx).
 - Or see [Blog for installing ostress.exe](http://blogs.msdn.com/b/psssql/archive/2013/10/29/cumulative-update-2-to-the-rml-utilities-for-microsoft-sql-server-released.aspx)



<!--
dn511655.aspx is for SQL 2014,
[Extensions to AdventureWorks to Demonstrate In-Memory OLTP]
(http://msdn.microsoft.com/library/dn511655&#x28;v=sql.120&#x29;.aspx)

whereas for SQL 2016+
[Sample Database for In-Memory OLTP]
(http://msdn.microsoft.com/library/mt465764.aspx)
-->



### Run the *_inmem* stress workload first


You can use an *RML Cmd Prompt* window to run our ostress.exe command line. The command line parameters direct ostress to:

- Run 100 connections concurrently (-n100).
- Have each connection run the T-SQL script 50 times (-r50).


```
ostress.exe -n100 -r50 -S<servername>.database.windows.net -U<login> -P<password> -d<database> -q -Q"DECLARE @i int = 0, @od SalesLT.SalesOrderDetailType_inmem, @SalesOrderID int, @DueDate datetime2 = sysdatetime(), @CustomerID int = rand() * 8000, @BillToAddressID int = rand() * 10000, @ShipToAddressID int = rand()* 10000; INSERT INTO @od SELECT OrderQty, ProductID FROM Demo.DemoSalesOrderDetailSeed WHERE OrderID= cast((rand()*60) as int); WHILE (@i < 20) begin; EXECUTE SalesLT.usp_InsertSalesOrder_inmem @SalesOrderID OUTPUT, @DueDate, @CustomerID, @BillToAddressID, @ShipToAddressID, @od; set @i += 1; end"
```


To run the preceding ostress.exe command line:


1. Reset the database data content by running the following command in SSMS, to delete all the data that was inserted by any previous runs:
```
EXECUTE Demo.usp_DemoReset;
```

2. Copy the text of the preceding ostress.exe command line to your clipboard.

3. Replace the `<placeholders>` for the parameters -S -U -P -d with the correct real values.

4. Run your edited command line in an RML Cmd window.


#### Result is a duration


When ostress.exe completes, it writes the run duration as its final line of output in the RML Cmd window. For example, a shorter test run lasted about 1.5 minutes:

`11/12/15 00:35:00.873 [0x000030A8] OSTRESS exiting normally, elapsed time: 00:01:31.867`


#### Reset, edit for *_ondisk*, then rerun


After you have the result from the *_inmem* run, perform the following steps for the *_ondisk* run:


1. Reset the database by running the following command in SSMS, to delete all the data that was inserted by the previous run:
```
EXECUTE Demo.usp_DemoReset;
```

2. Edit the ostress.exe command line to replace all *_inmem* with *_ondisk*.

3. Rerun ostress.exe for the second time, and capture the duration result.

4. Again reset the database, for responsible deletion of what can be a large amount of test data.


#### Expected comparison results

Our In-Memory tests have shown a **9 times** performance improvement for this simplistic workload, with ostress running on an Azure VM in the same Azure region as the database.



<a id="install_analytics_manuallink" name="install_analytics_manuallink"></a>

&nbsp;


## B. Install the In-Memory Analytics sample


In this section, you compare the IO and Statistics results when using a columnstore index versus a traditional b-tree index.


For real-time analytics on an OLTP workload, it is often best to use a NONclustered columnstore index. For details see [Columnstore Indexes Described](http://msdn.microsoft.com/library/gg492088.aspx).



### Prepare the columnstore analytics test


1. Use the Azure portal to create a fresh AdventureWorksLT database from the sample.
 - Use that exact name.
 - Choose any Premium service tier.

2. Copy the [sql_in-memory_analytics_sample](https://raw.githubusercontent.com/Microsoft/sql-server-samples/master/samples/features/in-memory/t-sql-scripts/sql_in-memory_analytics_sample.sql) to your clipboard.
 - The T-SQL script creates the necessary In-Memory objects in the AdventureWorksLT sample database you created in step 1.
 - The script creates the Dimension table, and two fact tables. The fact tables are populated with 3.5 million rows each.
 - The script might take 15 minutes to complete.

3. Paste the T-SQL script into SSMS, and then execute the script.
 - Crucial is the **COLUMNSTORE** keyword on a **CREATE INDEX** statement, as in:<br/>`CREATE NONCLUSTERED COLUMNSTORE INDEX ...;`

4. Set AdventureWorksLT to compatibility level 130:<br/>`ALTER DATABASE AdventureworksLT SET compatibility_level = 130;`
 - Level 130 is not directly related to In-Memory features. But level 130 generally provides faster query performance than does 120.


#### Crucial tables and columnstore indexes


- dbo.FactResellerSalesXL_CCI is a table that has a clustered **columnstore** index, which has advanced compression at the *data* level.

- dbo.FactResellerSalesXL_PageCompressed is a table that has an equivalent regular clustered index, which is compressed only at the *page* level.


#### Crucial queries to compare the columnstore index


[Here](https://raw.githubusercontent.com/Microsoft/sql-server-samples/master/samples/features/in-memory/t-sql-scripts/clustered_columnstore_sample_queries.sql) are several T-SQL query types you can run to see performance improvements. From Step 2 in the T-SQL script, there is a pair of queries that are of direct interest. The two queries differ only on one line:


- `FROM FactResellerSalesXL_PageCompressed a`
- `FROM FactResellerSalesXL_CCI a`


A clustered columnstore index is on the FactResellerSalesXL\_CCI table.

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


-- This is the same Prior query on a table with a Clustered Columnstore index CCI
-- The comparison numbers are even more dramatic the larger the table is, this is a 11 million row table only.
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

In a database with the P2 pricing tier you can expect about 9X perf gain for this query from using the clustered columnstore index compared with the traditional index. With P15 you can expect about 57X perf gain from columnstore.



## Next steps

- [Quick Start 1: In-Memory OLTP Technologies for Faster T-SQL Performance](http://msdn.microsoft.com/library/mt694156.aspx)

- [Use In-Memory OLTP in an existing Azure SQL Application.](sql-database-in-memory-oltp-migration.md)

- [Monitor In-Memory Storage](sql-database-in-memory-oltp-monitoring.md) for In-Memory OLTP.


## Additional resources

#### Deeper information

- [Learn about In-Memory OLTP](http://msdn.microsoft.com/library/dn133186.aspx)

- [Learn about Columnstore Indexes](https://msdn.microsoft.com/library/gg492088.aspx)

- [Learn about Real-Time Operational Analytics](http://msdn.microsoft.com/library/dn817827.aspx)

- White paper on [Common Workload Patterns and Migration Considerations](http://msdn.microsoft.com/library/dn673538.aspx), which describes workload patterns where In-Memory OLTP commonly provides significant performance gains.

#### Application design

- [In-Memory OLTP (In-Memory Optimization)](http://msdn.microsoft.com/library/dn133186.aspx)

- [Use In-Memory OLTP in an existing Azure SQL Application.](sql-database-in-memory-oltp-migration.md)

#### Tools

- [Azure Portal](https://portal.azure.com/)

- [SQL Server Management Studio (SSMS)](https://msdn.microsoft.com/library/mt238290.aspx)

- [SQL Server Data Tools (SSDT)](http://msdn.microsoft.com/library/mt204009.aspx)
