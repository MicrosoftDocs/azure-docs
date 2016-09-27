<properties
	pageTitle="In-Memory OLTP improves SQL txn perf | Microsoft Azure"
	description="Adopt In-Memory OLTP to improve transactional performance in an existing SQL database."
	services="sql-database"
	documentationCenter=""
	authors="jodebrui"
	manager="jhubbard"
	editor="MightyPen"/>


<tags
	ms.service="sql-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/18/2016"
	ms.author="jodebrui"/>


# Use In-Memory OLTP (preview) to improve your application performance in SQL Database

[In-Memory OLTP](sql-database-in-memory.md) can be used to improve the performance of OLTP workload in  [Premium](sql-database-service-tiers.md) Azure SQL Databases without increasing the performance level.

Follow these steps to adopt In-Memory OLTP in your existing database.

## Step 1: Ensure your Premium database supports In-Memory OLTP

Premium databases created in November 2015 or later do support the In-Memory feature. You can ascertain whether your Premium database supports the In-Memory feature by running the following Transact-SQL statement. In-Memory is supported if the returned result is 1 (not 0):

```
SELECT DatabasePropertyEx(Db_Name(), 'IsXTPSupported');
```

*XTP* stands for *Extreme Transaction Processing*

If your existing database must be moved to a new V12 Premium database, you can use the following techniques to export and then import your data.

#### Export steps

Export your production database to a bacpac by using either:

- The [Export](sql-database-export.md) functionality in the [portal](https://portal.azure.com/).

- The **Export Data-tier Application** functionality in an [up-to-date SSMS.exe](http://msdn.microsoft.com/library/mt238290.aspx) (SQL Server Management Studio).
 1. In the **Object Explorer**, expand the **Databases** node.
 2. Right-click your database node.
 3. Click **Tasks** > **Export Data-tier Application**.
 4. Operate the wizard window that is displayed.


#### Import steps

Import the bacpac into a new Premium database.

1. In the Azure [portal](https://portal.azure.com/),
 - Navigate to the server.
 - Select the [Import Database](sql-database-import.md) option.
 - Select a Premium pricing tier.

2. Use SSMS to import the bacpac:
 - In the **Object Explorer**, right-click the **Databases** node.
 - Click **Import Data-Tier Application**.
 - Operate the wizard window that is displayed.


## Step 2: Identify objects to migrate to In-Memory OLTP

SSMS includes a **Transaction Performance Analysis Overview** report that you can run against a database with an active workload. The report identifies tables and stored procedures that are candidates for migration to In-Memory OLTP.

In SSMS, to generate the report:
- In the **Object Explorer**, right-click your database node.
- Click **Reports** > **Standard Reports** > **Transaction Performance Analysis Overview**.

For more information, see [Determining if a Table or Stored Procedure Should Be Ported to In-Memory OLTP](http://msdn.microsoft.com/library/dn205133.aspx).


## Step 3: Create a comparable test database

Suppose the report indicates your database has a table that would benefit from being converted to a memory-optimized table. We recommend that you first test to confirm the indication by testing.

You need a test copy of your production database. The test database must be at the same service tier level as your production database.

To ease testing, tweak your test database as follows:

1. Connect to the test database by using SSMS.

2. To avoid needing the WITH (SNAPSHOT) option in queries, set the database option as shown in the following T-SQL statement:
```
ALTER DATABASE CURRENT
	SET
		MEMORY_OPTIMIZED_ELEVATE_TO_SNAPSHOT = ON;
```


## Step 4: Migrate tables

You must create and populate a memory-optimized copy of the table you want to test. You can create it by using either:

- The handy Memory Optimization Wizard in SSMS.
- Manual T-SQL.


#### Memory Optimization Wizard in SSMS

To use this migration option:

1. Connect to the test database with SSMS.

2. In the **Object Explorer**, right-click on the table, and then click **Memory Optimization Advisor**.
 - The **Table Memory Optimizer Advisor** wizard is displayed.

3. In the wizard, click **Migration validation** (or the **Next** button) to see if the table has any unsupported features that are unsupported in memory-optimized tables. For more information, see:
 - The *memory optimization checklist* in [Memory Optimization Advisor](http://msdn.microsoft.com/library/dn284308.aspx).
 - [Transact-SQL Constructs Not Supported by In-Memory OLTP](http://msdn.microsoft.com/library/dn246937.aspx).
 - [Migrating to In-Memory OLTP](http://msdn.microsoft.com/library/dn247639.aspx).

4. If the table has no unsupported features, the advisor can perform the actual schema and data migration for you.


#### Manual T-SQL

To use this migration option:

1. Connect to your test database by using SSMS (or a similar utility).

2. Obtain the complete T-SQL script for your table and its indexes.
 - In SSMS, right-click your table node.
 - Click **Script Table As** > **CREATE To** > **New Query Window**.

3. In the script window, add WITH (MEMORY_OPTIMIZED = ON) to the CREATE TABLE statement.

4. If there is a CLUSTERED index, change it to NONCLUSTERED.

5. Rename the existing table by using SP_RENAME.

6. Create the new memory-optimized copy of the table by running your edited CREATE TABLE script.

7. Copy the data to your memory-optimized table by using INSERT...SELECT * INTO:
	
```
INSERT INTO <new_memory_optimized_table>
		SELECT * FROM <old_disk_based_table>;
```


## Step 5 (optional): Migrate stored procedures

The In-Memory feature can also modify a stored procedure for improved performance.


### Considerations with natively compiled stored procedures

A natively compiled stored procedure must have the following options on its T-SQL WITH clause:

- NATIVE_COMPILATION

- SCHEMABINDING: meaning tables that the stored procedure cannot have their column definitions changed in any way that would affect the stored procedure, unless you drop the stored procedure.


A native module must use one big [ATOMIC blocks](http://msdn.microsoft.com/library/dn452281.aspx) for transaction management. There is no role for an explicit BEGIN TRANSACTION, or for ROLLBACK TRANSACTION. If your code detects a violation of a business rule, it can terminate the atomic block with a [THROW](http://msdn.microsoft.com/library/ee677615.aspx) statement.


### Typical CREATE PROCEDURE for natively compiled

Typically the T-SQL to create a natively compiled stored procedure is similar to the following template:

```
CREATE PROCEDURE schemaname.procedurename
	@param1 type1, …
	WITH NATIVE_COMPILATION, SCHEMABINDING
	AS
		BEGIN ATOMIC WITH
			(TRANSACTION ISOLATION LEVEL = SNAPSHOT,
			LANGUAGE = N'your_language__see_sys.languages'
			)
		…
		END;
```

- For the TRANSACTION_ISOLATION_LEVEL, SNAPSHOT is the most common value for the natively compiled stored procedure. However,  a subset of the other values are also supported:
 - REPEATABLE READ
 - SERIALIZABLE


- The LANGUAGE value must be present in the sys.languages view.


### How to migrate a stored procedure

The migration steps are:


1. Obtain the CREATE PROCEDURE script to the regular interpreted stored procedure.

2. Rewrite its header to match the previous template.

3. Ascertain whether the stored procedure T-SQL code uses any features that are not supported for natively compiled stored procedures. Implement workarounds if necessary.
 - For details see [Migration Issues for Natively Compiled Stored Procedures](http://msdn.microsoft.com/library/dn296678.aspx).

4. Rename the old stored procedure by using SP_RENAME. Or simply DROP it.

5. Run your edited CREATE PROCEDURE T-SQL script.


## Step 6: Run your workload in test

Run a workload in your test database that is similar to the workload that runs in your production database. This should reveal the performance gain achieved by your use of the In-Memory feature for tables and stored procedures.

Major attributes of the workload are:

- Number of concurrent connections.

- Read/write ratio.


To tailor and run the test workload, consider using the handy ostress.exe tool, which illustrated in [here](sql-database-in-memory.md).


To minimize network latency, run your test in the same Azure geographic region where the database exists.


## Step 7: Post-implementation monitoring

Consider monitoring the performance effects of your In-Memory implementations in production:

- [Monitor In-Memory Storage](sql-database-in-memory-oltp-monitoring.md).

- [Monitoring Azure SQL Database using dynamic management views](sql-database-monitoring-with-dmvs.md)


## Related links

- [In-Memory OLTP (In-Memory Optimization)](http://msdn.microsoft.com/library/dn133186.aspx)

- [Introduction to Natively Compiled Stored Procedures](http://msdn.microsoft.com/library/dn133184.aspx)

- [Memory Optimization Advisor](http://msdn.microsoft.com/library/dn284308.aspx)

