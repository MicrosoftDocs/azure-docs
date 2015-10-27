<properties
	pageTitle="Get started with SQL In-Memory | Microsoft Azure"
	description="SQL In-Memory technologies greatly improve the performance of transactional and analytics workloads. Learn how to take advantage of these technologies."
	services="sql-database"
	documentationCenter=""
	authors="jodebrui"
	manager="jeffreyg"
	editor=""/>


<tags
	ms.service="sql-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="hero-article"
	ms.date="10/27/2015"
	ms.author="jodebrui"/>


# Get started with In-Memory OLTP


SQL In-Memory technologies greatly improve the performance of transactional and analytics workloads. With In-Memory OLTP you can achieve up to 30 times gain in transaction throughput, and with In-Memory Analytics you can achieve up to 100 times improvement in query performance, depending on the workload.

In-Memory Analytics is currently generally available. In-Memory OLTP is in preview, for Premium Azure SQL databases.


## Getting started
Try In-Memory OLTP for transactional workloads:

- Install the [In-Memory OLTP sample database](# Install the In-Memory OLTP sample database).
- [Use In-Memory OLTP in an existing Azure SQL Application.](https://azure.microsoft.com/en-us/documentation/articles/sql-database-in-memory-oltp-migration/)
- [Monitor in-memory storage](https://azure.microsoft.com/en-us/documentation/articles/sql-database-in-memory-monitoring/).

Try In-Memory Analytics for transactional workloads:

- Install the Columnstore sample. Learn more about [In-Memory Columnstore](https://msdn.microsoft.com/library/gg492088.aspx) on MSDN.


## Install the In-Memory OLTP sample database

The AdventureWorksLT-based In-Memory OLTP sample (available in the Azure preview portal) extends the AdventureWorksLT [V12] sample  with memory-optimized tables and natively compiled stored procedures to illustrate the In-Memory OLTP objects. It also comes with an INSERT workload to demonstrate the performance benefits of using memory-optimized tables, compared with disk-based tables.

1.	In the preview [portal](https://portal.azure.com/) create a Premium database on a V12 server. Set Source to the AdventureWorksLT[V12] sample database. For more detailed instructions for this step see [this article](https://azure.microsoft.com/en-us/documentation/articles/sql-database-get-started/).
2.	Connect to the database (for example, using [SQL Server Management Studio (SSMS)](https://msdn.microsoft.com/en-us/library/mt238290.aspx)).
3.	Download and execute the [In-Memory OLTP script](https://github.com/Azure/azure-sql-database-samples/tree/master/T-SQL/In-Memory) that creates the necessary In-Memory objects in the AdventureWorksLT sample database created in step 1.

The sample contains the following memory-optimized tables:

- SalesLT.Product_inmem
- SalesLT.SalesOrderHeader_inmem
- SalesLT.SalesOrderDetail_inmem
- Demo.DemoSalesOrderHeaderSeed
- Demo.DemoSalesOrderDetailSeed

Inspect memory-optimized tables through object explorer, or through catalog view queries.

Example:

		SELECT name, object_id, type, type_desc, is_memory_optimized, durability, durability_desc
		FROM sys.tables
		WHERE is_memory_optimized=1

Likewise, the natively compiled stored procedure SalesLT.usp_InsertSalesOrder_inmem can be inspected through object explorer or queries of the catalog views.

Example:

		SELECT object_name(object_id), object_id, definition, uses_native_compilation
		FROM sys.sql_modules
		WHERE uses_native_compilation=1


## Run the sample workload
Use stored procedures SalesLT.usp_InsertSalesOrder_inmem and SalesLT.usp_InsertSalesOrder_ondisk to compare the insert performance for memory-optimized versus disk-based tables.

We recommend running the workload using a number of concurrent client connections from an application residing in the same Azure region as the sample database.

### Sample sales order insert
The following script inserts a sample sales order with five line items in the memory-optimized tables SalesLT.SalesOrderHeader_inmem and SalesLT.SalesOrderDetail_inmem:


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

			EXEC SalesLT.usp_InsertSalesOrder_inmem @SalesOrderID OUTPUT, @DueDate,
			@CustomerID, @BillToAddressID, @ShipToAddressID, @od;


### Running the sample stress workload
To run a sample stress workload, create an [Azure Virtual Machine](https://azure.microsoft.com/documentation/services/virtual-machines/) in the same region as your sample database. Use the ostress command-line tool to run the workload. Instructions for [installing and running ostress](https://msdn.microsoft.com/library/dn511655(v=sql.120).aspx#PerformanceMeasurementsusingtheDemoWorkload) can be found on MSDN.

When run from the RML Cmd Prompt, the following command inserts one million sales orders, with five line items each, in memory-optimized tables, using 100 concurrent connections:

		ostress.exe –n100 –r500 –S<servername>.database.windows.net -U<login> -P<password>
		 -d<database> -q -Q"DECLARE @i int = 0, @od SalesLT.SalesOrderDetailType_inmem,
		@SalesOrderID int, @DueDate datetime2 = sysdatetime(), @CustomerID int = rand() *
		8000, @BillToAddressID int = rand() * 10000, @ShipToAddressID int = rand()*  
		10000; INSERT INTO @od SELECT OrderQty, ProductID FROM
		Demo.DemoSalesOrderDetailSeed WHERE OrderID= cast((rand()*60) as int); while (@i <
		 20) begin; EXEC SalesLT.usp_InsertSalesOrder_inmem @SalesOrderID OUTPUT, @DueDate,
		 @CustomerID, @BillToAddressID, @ShipToAddressID, @od; set @i += 1 end"

Be sure to replace <servername> with the name of your server, <database> with the name of your database, and <login> and <password> with your login information.

To compare the insert performance of memory-optimized tables with traditional disk-based tables, use the following command to insert the same one million sales orders in disk-based tables:

		ostress.exe –n100 –r500 –S<servername>.database.windows.net -U<login> -P<password>
		-d<database> -q -Q"DECLARE @i int = 0, @od SalesLT.SalesOrderDetailType_ondisk,
		@SalesOrderID int, @DueDate datetime2 = sysdatetime(), @CustomerID int = rand() *
		8000, @BillToAddressID int = rand() * 10000, @ShipToAddressID int = rand() *
		10000; INSERT INTO @od SELECT OrderQty, ProductID FROM
		Demo.DemoSalesOrderDetailSeed with (snapshot) WHERE OrderID= cast((rand()*60) as
		int); while (@i < 20) begin; EXEC SalesLT.usp_InsertSalesOrder_ondisk
		@SalesOrderID OUTPUT, @DueDate, @CustomerID, @BillToAddressID, @ShipToAddressID,
		@od; set @i += 1 end"

Tests have shown around a 9 times performance improvement for memory-optimized tables compared with disk-based tables for this workload, with ostress running in a VM in the same Azure region as the database.

After each test run be sure to reset the sample, to prevent running out of in-memory storage space. Run the following T-SQL statement in your database. A single test run inserting one million sales orders results in >500MB of data in memory-optimized tables.

		EXECUTE Demo.usp_DemoReset

## Install the Columnstore sample
**First**, create a new Azure SQL Database. 

- Choose any Premium edition (Premium is required for Columnstore)
- Ensure you create the database from the Sample.

- For simplicity, name your database AdventureworksLT





**Next**, connect to the Azure SQL Database through [SQL Server Management Studio (SSMS)](https://msdn.microsoft.com/library/mt238290.aspx) September 2015 Preview or later.



- Run the Setup Script [sql_in-memory_analytics_sample](https://github.com/Azure/azure-sql-database-samples/tree/master/T-SQL/In-Memory)



- Create the schema required for the Dimension and fact tables by running the script. The script will create 2 fact tables with ~ 3.5 million rows each.



- FactResellerSales_CCI which has a columnstore table 



- FactResellerSalesXL_PageCompressed which is an equivalent B-tree table which is page compressed. **Note:** This script can take up to 15 minutes to run and generate the data.

**Run** through the demo queries in the file [clustered_columnstore_sample_queries.sql](https://github.com/Azure/azure-sql-database-samples/tree/master/T-SQL/In-Memory). and explore the feature.
## More about In-Memory OLTP
[In-Memory OLTP (In-Memory Optimization)](https://msdn.microsoft.com/library/dn133186.aspx)

[White paper on Common Workload Patterns and Migration Considerations](https://msdn.microsoft.com/library/dn673538.aspx) describes workload patterns where In-Memory OLTP commonly provides significant performance gains.

## Preview considerations

In-Memory OLTP is supported **only** for Premium edition databases.

In-Memory OLTP is supported only in newly created databases. It is not supported in databases created based on an existing database through the Copy or Restore functionality.
However, once you have the new database, you can copy or restore this database while keeping the full functionality of in-memory OLTP.

To verify whether In-Memory OLTP is supported in a given database, run the following query:

   	    SELECT DATABASEPROPERTYEX(DB_NAME(), 'IsXTPSupported')



If the query returns **1**, In-Memory OLTP is supported in this database, as well as any database copy and database restore created based on this database.

If a database contains any of the following kinds of objects or types, changing the service tier of the database to basic or standard is not supported. To downgrade the database, first drop the objects.

- Memory-optimized tables
- Memory-optimized table types
- Natively compiled modules
Using In-Memory OLTP with databases in elastic pools is not supported.

Using In-Memory OLTP with SQL Data Warehouse is not supported.

The Query Store does not capture queries inside natively compiled modules.

Some Transact-SQL features are not supported with In-Memory OLTP. For details see [Transact-SQL Support for In-Memory OLTP](https://msdn.microsoft.com/library/dn133180.aspx).

## Supported tools

[SQL Server Management Studio (SSMS)](https://msdn.microsoft.com/library/mt238290.aspx) September 2015 Preview or later.

[SQL Server Data Tools Preview (SSDT)](https://msdn.microsoft.com/en-us/library/mt204009.aspx) September 2015 Preview or later.

## Additional resources
More about In-Memory OLTP and Analytics:
[In-Memory OLTP (In-Memory Optimization)](https://msdn.microsoft.com/library/dn133186.aspx)

[Learn about Columnstore indexes on MSDN](https://msdn.microsoft.com/library/gg492088.aspx)

[White paper on Common Workload Patterns and Migration Considerations](https://msdn.microsoft.com/library/dn673538.aspx) describes workload patterns where In-Memory OLTP commonly provides significant performance gains.

## Next steps
Try [Use In-Memory OLTP in an existing Azure SQL Application.](https://azure.microsoft.com/en-us/documentation/articles/sql-database-in-memory-oltp-migration/)

[Monitor In-Memory Storage](https://azure.microsoft.com/en-us/documentation/articles/sql-database-in-memory-monitoring/) for In-Memory OLTP.
