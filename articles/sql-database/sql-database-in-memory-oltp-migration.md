<properties
	pageTitle="Use In-Memory OLTP to improve Azure SQL transactional performance | Microsoft Azure"
	description="Adopt In-Memory OLTP to improve transactional performance in an existing SQL database."
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
	ms.date="10/28/2015"
	ms.author="jodebrui"/>


# Use In-Memory (Preview) to improve your Azure SQL application's performance

Follow these steps to optimize the transactional performance of your existing Premium Azure SQL Database using [In-Memory](sql-database-in-memory.md).

For comparison, choose a workload similar to your production workload with a similar number of concurrent connections and read/write ratio. To minimize network latency, we recommend running your test workload in the same Azure region as the database.

## Step 1: Copy your data to a new Premium Database
1.	Export your production database to a bacpac by using either:

	A. The Export functionality in the [portal](https://portal.azure.com/), or

	B. The Export Data-tier Application functionality in SQL Server Management Studio

2.	Import the bacpac into a new Premium database in a V12 server:

	A. In the portal: navigate to the server and select the Import Database option. Be sure to select a Premium pricing tier.

	B. In SQL Server Management Studio (SSMS): Connect to the server, right-click on the Databases node, and select Import Data-Tier Application.


## Step 2: Identify objects to migrate to In-Memory OLTP
SQL Server Management Studio (SSMS) includes a Transaction Performance Analysis Report you can run against a database with an active workload, to identify tables and stored procedures that are candidates for migration to In-Memory OLTP. Refer to [Determining if a Table or Stored Procedure Should Be Ported to In-Memory OLTP](https://msdn.microsoft.com/library/dn205133.aspx) for more details.

1.	Connect to the production database using SSMS. Alternatively, if you have a workload running against the new test database you can connect to that one as well.
2.	Right-click on the database and select Reports -> Standard Reports -> Transaction Performance Analysis Report. The report will allow you identify tables and stored procedures that may benefit from In-Memory OLTP, based on usage.


## Step 3: Migrate tables
1.	Connect to the new test database using SSMS.
To avoid the need for using the WITH (SNAPSHOT) option in queries, we recommend setting the database option MEMORY_OPTIMIZED_ELEVATE_TO_SNAPSHOT.
2.	Once connected to the new test database, execute:

   	    ALTER DATABASE CURRENT SET MEMORY_OPTIMIZED_ELEVATE_TO_SNAPSHOT=ON

3.	Migrate the disk-based table to memory-optimized by either of these approaches:

	A. SSMS Memory Optimization Wizard: When connected to the test database, right-click on the table and select Memory Optimization Advisor. Use the advisor to determine whether the table has any features that are not support with memory-optimized. If not, the advisor can perform the actual schema and data migration. Review the [memory optimization advisor topic on MSDN](https://msdn.microsoft.com/library/dn284308.aspx) for more details.

	B. Manual Migration: Connect to the new test database using SSMS.

Follow these steps to migrate a table:

1.	Script the table, by right-clicking on the table and select Script Table As -> CREATE To -> New Query Window.
2.	Change the CLUSTERED index to NONCLUSTERED and add the option WITH (MEMORY_OPTIMIZED=ON).
3.	If the table uses any unsupported features, implement workarounds. MSDN documents how to deal with [common unsupported features](https://msdn.microsoft.com/library/dn247639.aspx).
4.	Rename the existing table using sp_rename.
5.	Create the new memory-optimized table by executing the CREATE TABLE script.
6.	Copy the data by executing the following statement:
``INSERT INTO <new_memory_optimized_table> SELECT * FROM <old_disk_based_table>

## Step 4 (optional): Migrate Stored Procedures

Connect to the new test database using [SQL Server Management Studio (SSMS)](https://msdn.microsoft.com/library/mt238290.aspx) September 2015 Preview or later.

Identify all features not supported in natively compiled stored procedures by running the [Native Compilation Advisor](https://msdn.microsoft.com/library/dn284308.aspx) on the old procedure. Workarounds for common unsupported features are documented on [MSDN](https://msdn.microsoft.com/library/dn296678.aspx).

Two things to consider when migrating a stored procedure to native:

- Native modules require the following options:

	- NATIVE_COMPILATION
	- SCHEMABINDING



- Native modules use [ATOMIC blocks](https://msdn.microsoft.com/library/dn452281.aspx) for transaction management; explicit BEGIN TRAN/COMMIT/ROLLBACK statements are not required.

A typical natively compiled stored procedure looks as follows:


   	    CREATE PROCEDURE schemaname.procedurename
   		@param1 type1, …
   		WITH NATIVE_COMPILATION, SCHEMABINDING
   		AS
   		BEGIN ATOMIC WITH (TRANSACTION ISOLATION LEVEL = SNAPSHOT, LANGUAGE = N'your_language')

   		…

   		END



Note that while SNAPSHOT is the most commonly used isolation level with memory-optimized table, REPEATABLE READ and SERIALIZABLE are also supported.

##### Follow these steps to migrate a stored procedure:

1.	Script the old stored procedure, by right-clicking on the procedure and selecting  Script Procedure As -> CREATE To -> New Query Window.
2.	Rewrite the procedure header using the template above, and remove any BEGIN TRAN/ROLLBACK/COMMIT statements.
3.	If the stored procedure uses any unsupported features, implement workarounds. MSDN documents how to deal with [common unsupported features](https://msdn.microsoft.com/library/dn296678.aspx).
4.	Either DROP the procedure or rename the old procedure using sp_rename.
5.	Create the new natively compiled stored procedure by executing the CREATE PROCEDURE script.

## Step 5: Run your workload
Run your test workload against the memory-optimized tables and natively compiled stored procedures, and measure the performance gain.

## Next steps

[Monitor In-Memory Storage](https://azure.microsoft.com/documentation/articles/sql-database-in-memory-oltp-monitoring/).

[Monitoring Azure SQL Database using dynamic management views](sql-database-monitoring-with-dmvs.md)
