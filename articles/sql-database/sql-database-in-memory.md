<properties
	pageTitle="SQL In-Memory, Get started | Microsoft Azure"
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
	ms.date="06/08/2016"
	ms.author="jodebrui"/>


# Get started with In-Memory (Preview) in SQL Database

In-Memory features greatly improve the performance of transactional and analytics workloads in the right situations.

This topic emphasizes two demonstrations, one for In-Memory OLTP, and one for In-Memory Analytics. Each demo comes complete with the steps and code you would need to run the demo. You can either:

- Use the code to test variations to see differences in performance results; or
- Read the code to understand the scenario, and to see how to create and utilize the In-Memory objects.

> [AZURE.VIDEO azure-sql-database-in-memory-technologies]

- [Quick Start 1: In-Memory OLTP Technologies for Faster T-SQL Performance](http://msdn.microsoft.com/library/mt694156.aspx) - is another article to help you get started.

#### In-Memory OLTP

The features of In-Memory [OLTP](#install_oltp_manuallink) (online transaction processing) are:

- Memory-optimized tables.
- Natively compiled stored procedures.


A memory-optimized table has one representation of itself in active memory, in addition to the standard representation on a hard drive. Business transactions against the table run faster because they directly interact with only the representation that is in active memory.

With In-Memory OLTP you can achieve up to 30 times gain in transaction throughput, depending on the specifics of the workload.


Natively compiled stored procedures require fewer machine instructions during run time than they would if they were created as traditional interpreted stored procedures. We have seen native compilation result in durations that are 1/100th of the interpreted duration.


#### In-Memory Analytics 

The feature of In-Memory [Analytics](#install_analytics_manuallink) is:

- Columnstore indexes


A columnstore index improves the performance of query workloads by exotic compression of data.

In other services the columnstore indexes are necessarily memory optimized. However, in Azure SQL Database a columnstore index can exist on the hard drive along with the traditional table that it indexes.


#### Real-Time Analytics

For [Real-Time Analytics](http://msdn.microsoft.com/library/dn817827.aspx) you combine In-Memory OLTP and Analytics to get:

- Real-time business insight based on operational data.


#### Availability


GA, General Availability:

- [Columnstore indexes](http://msdn.microsoft.com/library/dn817827.aspx) that are *on-disk*.


Preview:

- In-Memory OLTP
- In-Memory Analytics with memory-optimized columnstore indexes
- Real-Time Operational Analytics


Considerations while the In-Memory features are in Preview are described [later in this topic](#preview_considerations_for_in_memory).


> [AZURE.NOTE] These in-Preview features are available only for [*Premium*](sql-database-service-tiers.md) Azure SQL databases, not for databases on the Standard or Basic service tier.



<a id="install_oltp_manuallink" name="install_oltp_manuallink"></a>

&nbsp;

## A. Install the In-Memory OLTP sample

You can create the AdventureWorksLT [V12] sample database by a few clicks in the [Azure Portal](https://portal.azure.com/). Then the steps in this section explain how you can enrich your AdventureWorksLT database with:

- In-Memory tables.
- A natively compiled stored procedure.


#### Installation steps

1. In the [Azure Portal](https://portal.azure.com/), create a Premium database on a V12 server. Set the **Source** to the AdventureWorksLT [V12] sample database.
 - For detailed instructions you can see [Create your first Azure SQL database](sql-database-get-started.md).

2. Connect to the database with SQL Server Management Studio [(SSMS.exe)](http://msdn.microsoft.com/library/mt238290.aspx).

3. Copy the [In-Memory OLTP Transact-SQL script](https://raw.githubusercontent.com/Microsoft/sql-server-samples/master/samples/features/in-memory/t-sql-scripts/sql_in-memory_oltp_sample.sql) to your clipboard.
 - The T-SQL script creates the necessary In-Memory objects in the AdventureWorksLT sample database you created in step 1.

4. Paste the T-SQL script into SSMS, and the execute the script.
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

- Ensure the database was created after the In-Memory OLTP features became active for Preview.
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


In this section you see how to use the handy **ostress.exe** utility to execute the two stored procedures at stressful levels. You can compare how long it takes the two stress runs to complete.


When you run ostress.exe, we recommend that you pass parameter values designed to both:

- Run a large number of concurrent connections, by using perhaps -n100.
- Have each connection loop hundreds of times, by using perhaps -r500.


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


To make the _ondisk version of the preceding T-SQL for ostress.exe, you would simply replace both occurrences of the *_inmem* substring with *_ondisk*. These replaces affect the names of tables and stored procedures.


### Install RML utilities and ostress


Ideally you would plan to run ostress.exe on an Azure VM. You would create an [Azure Virtual Machine](https://azure.microsoft.com/documentation/services/virtual-machines/) in the same Azure geographic region where your AdventureWorksLT database resides. But you can run ostress.exe on your laptop instead.


On the VM, or on whatever host you choose, install the Replay Markup Language (RML) utilities which include ostress.exe.

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



### Run the _inmem stress workload first


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

3. Replace the <placeholders> for the parameters -S -U -P -d with the correct real values.

4. Run your edited command line in an RML Cmd window.


#### Result is a duration


When ostress.exe completes, it writes the run duration as its final line of output in the RML Cmd window. For example, a shorter test run lasted about 1.5 minutes:

`11/12/15 00:35:00.873 [0x000030A8] OSTRESS exiting normally, elapsed time: 00:01:31.867`


#### Reset, edit for _ondisk, then rerun


After you have the result from the _inmem run, perform the following steps for the _ondisk run:


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


In this section you compare the IO and Statistics results when using a columnstore index versus a regular index.


Columnstore indexes are logically the same as regular indexes, but physically they are different. A columnstore index exotically organizes data to greatly compress the data. This offers major performance improvements.


For real-time analytics on an OLTP workload, it is often best to use a NONclustered columnstore index. For details see [Columnstore Indexes Described](http://msdn.microsoft.com/library/gg492088.aspx).



### Prepare the columnstore analytics test


1. Use the Azure portal to create a fresh AdventureWorksLT database from the sample.
 - Use that exact name.
 - Choose any Premium service tier.

2. Copy the [sql_in-memory_analytics_sample](https://raw.githubusercontent.com/Microsoft/sql-server-samples/master/samples/features/in-memory/t-sql-scripts/sql_in-memory_analytics_sample.sql) to your clipboard.
 - The T-SQL script creates the necessary In-Memory objects in the AdventureWorksLT sample database you created in step 1.
 - The script creates the Dimension table, and two fact tables. The fact tables are populated with 3.5 million rows each.
 - The script might take 15 minutes to complete.

3. Paste the T-SQL script into SSMS, and the execute the script.
 - Crucial is the **COLUMNSTORE** keyword on a **CREATE INDEX** statement, as in:<br/>`CREATE NONCLUSTERED COLUMNSTORE INDEX ...;`

4. Set AdventureWorksLT to compatibility level 130:<br/>`ALTER DATABASE AdventureworksLT SET compatibility_level = 130;`
 - Level 130 is not directly related to In-Memory features. But level 130 generally provides faster query performance than does 120.


#### Crucial tables and columnstore indexes


- dbo.FactResellerSalesXL_CCI is a table which has a clustered **columnstore** index, which has advanced compression at the *data* level.

- dbo.FactResellerSalesXL_PageCompressed is a table which has an equivalent regular clustered index, which is compressed only at the *page* level.


#### Crucial queries to compare the columnstore index


[Here](https://raw.githubusercontent.com/Microsoft/sql-server-samples/master/samples/features/in-memory/t-sql-scripts/clustered_columnstore_sample_queries.sql) are several T-SQL query types you can run to see performance improvements. From Step 2 in the T-SQL script there is a pair of queries that are of direct interest. The two queries differ only on one line:


- `FROM FactResellerSalesXL_PageCompressed a`
- `FROM FactResellerSalesXL_CCI a`


A clustered columnstore index is on the FactResellerSalesXL**_CCI** table.

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
WHERE e.ProductCategoryKey =2
	AND c.FullDateAlternateKey BETWEEN '1/1/2014' AND '1/1/2015'
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
WHERE e.ProductCategoryKey =2
	AND c.FullDateAlternateKey BETWEEN '1/1/2014' AND '1/1/2015'
GROUP BY e.ProductCategoryKey,c.Year,d.CustomerKey,d.FirstName,d.LastName
GO

SET STATISTICS IO OFF
SET STATISTICS TIME OFF
GO
```



<a id="preview_considerations_for_in_memory" name="preview_considerations_for_in_memory"></a>


## Preview considerations for In-Memory OLTP


The In-Memory OLTP features in Azure SQL Database became [active for preview on October 28, 2015](https://azure.microsoft.com/updates/public-preview-in-memory-oltp-and-real-time-operational-analytics-for-azure-sql-database/).


In the current preview, In-Memory OLTP is supported only for:

- Databases that are at a *Premium* service tier.

- Databases that were created after the In-Memory OLTP features became active.
 - A new database cannot support In-Memory OLTP if it is restored from a database that was created before the In-Memory OLTP features became active.


When in doubt, you can always run the following T-SQL SELECT to ascertain whether whether your database supports In-Memory OLTP. A result of **1** means the database does support In-Memory OLTP:

```
SELECT DatabasePropertyEx(DB_NAME(), 'IsXTPSupported');
```


If the query returns **1**, In-Memory OLTP is supported in this database, as well as any database copy and database restore created based on this database.


#### Objects allowed only at Premium


If a database contains any of the following kinds of In-Memory OLTP objects or types, downgrading the service tier of the database from Premium to either Basic or Standard is not supported. To downgrade the database, first drop these objects:

- Memory-optimized tables
- Memory-optimized table types
- Natively compiled modules


#### Other relationships


- Using In-Memory OLTP features with databases in elastic pools is not supported during Preview.
 - To move a database that has or has had In-Memory OLTP objects to an elastic pool, follow these steps:
  - 1. Drop any memory-optimized tables, table types, and natively compiled T-SQL modules in the database
  - 2. Change the service tier of the database to standard (*there is currently an issue preventing the move of Premium databases that have had In-Memory OLTP objects in the past into an elastic pool; the Azure DB team is actively working on resolving the issue)
  - 3. Move the database into the elastic pool

- Using In-Memory OLTP with SQL Data Warehouse is not supported.
 - The columnstore index feature of In-Memory Analytics is supported in SQL Data Warehouse.

- The Query Store does not capture queries inside natively compiled modules during Preview, but it might in the future.

- Some Transact-SQL features are not supported with In-Memory OLTP. This applies to both Microsoft SQL Server and Azure SQL Database. For details see:
 - [Transact-SQL Support for In-Memory OLTP](http://msdn.microsoft.com/library/dn133180.aspx)
 - [Transact-SQL Constructs Not Supported by In-Memory OLTP](http://msdn.microsoft.com/library/dn246937.aspx)


## Next steps


- Try [Use In-Memory OLTP in an existing Azure SQL Application.](sql-database-in-memory-oltp-migration.md)


## Additional resources

#### Deeper information

- [Learn about In-Memory OLTP, which applies to both Microsoft SQL Server and Azure SQL Database](http://msdn.microsoft.com/library/dn133186.aspx)

- [Learn about Real-Time Operational Analytics on MSDN](http://msdn.microsoft.com/library/dn817827.aspx)

- White paper on [Common Workload Patterns and Migration Considerations](http://msdn.microsoft.com/library/dn673538.aspx), which describes workload patterns where In-Memory OLTP commonly provides significant performance gains.

#### Application design

- [In-Memory OLTP (In-Memory Optimization)](http://msdn.microsoft.com/library/dn133186.aspx)

- [Use In-Memory OLTP in an existing Azure SQL Application.](sql-database-in-memory-oltp-migration.md)

#### Tools

- [SQL Server Data Tools Preview (SSDT)](http://msdn.microsoft.com/library/mt204009.aspx), for the latest monthly version.

- [Description of the Replay Markup Language (RML) Utilities for SQL Server](http://support.microsoft.com/en-us/kb/944837)

- [Monitor In-Memory Storage](sql-database-in-memory-oltp-monitoring.md) for In-Memory OLTP.

