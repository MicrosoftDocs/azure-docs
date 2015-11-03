<properties 
	pageTitle="Compatibility levels in SQL Database | Microsoft Azure" 
	description="Explains how to set the compatibility level for your Azure SQL Database database, and the features that are affected."
	services="sql-database" 
	documentationCenter="" 
	authors="MightyPen" 
	manager="jeffreyg" 
	editor=""/>


<tags 
	ms.service="sql-database" 
	ms.workload="data-management" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="09/21/2015" 
	ms.author="genemi"/>


# Compatibility levels in SQL Database


For Azure SQL Database, this topic describes the feature choices you can make by using the Transact-SQL statement **ALTER DATABASE**. The compatibility level concept is designed to reduce any upgrade risk.


Most of the features that are activated or deactivated by the compatibility level are part of the query optimizer.  Microsoft makes the activation of a new query optimizer feature contingent on the compatibility level when:


- The upgraded context alters the semantics of an earlier feature.
- The query optimization has a plausible chance of harming the performance of certain uncommon yet legitimate SQL queries.


If your query performs less well after a version upgrade to your Azure SQL Database server or database, you have the option of reducing the compatibility level. The lower setting can deactivate a narrow set of optimizer enhancements, probably including the one that is unfavorable to your query.


## How compatibility level works


Microsoft SQL Server has had settable compatibility levels for years. Now starting with version V12, Azure SQL Database also adopts compatibility levels. Activation of some new features is controlled by the compatibility level setting within each SQL Database database. The possible settings include:


- 110: The lowest possible setting, and therefore the setting that excludes the most new features.
- 120: Loosely corresponds to SQL Database V11 (meaning `SELECT @@version;` returns **11.**0.0.0).
 - The V11 version was also referred to as 'SAWA V2' of SQL Database.
 - This 120 is the highest value in Microsoft SQL Server 2014.
- 130: Loosely corresponds to V12 (meaning `SELECT @@version;` returns **12.**0.0.0).
 - This 130 is the highest value in Microsoft SQL Server 2016.


For example, a setting of 120 means your database has access to the subset of features that become activated at level 120, *plus* features that become active at any lower setting such as 110. When set at 120, your database does not have access to level 130 features.


## Read or set the compatibility level


### Read the compatibility level


```
SELECT d.name, d.compatibility_level
	FROM sys.databases AS d
	WHERE d.name = db_name();
```


### Set the compatibility level


```
ALTER DATABASE YourDatabaseName SET COMPATIBILITY_LEVEL = 130;
```


For more information, see:


- [ALTER TABLE Compatibility Level (Transact-SQL)](http://msdn.microsoft.com/library/bb510680.aspx)
- [sys.databases (Transact-SQL)](http://msdn.microsoft.com/library/ms178534.aspx)


## In-memory tables and columnstore indexes


A majority of the compatibility level features that become active at levels 120 and 130 are related to tables and indexes that are *in-memory*. Therefore important items include:


- Memory-optimized tables
- Columnstore indexes


Where in-memory items are involved, compatibility level 130 provides the following advantages:


- The ability of the query optimizer to process more queries in *batch* mode is activated.
 - Batch mode is faster than *row* mode when a great many rows are involved.
- The addition of the **SORT** operator.
- The addition of Window aggregates.


For more information about in-memory tables, and about columnstore indexes, see:


- [Memory-Optimized Tables](http://msdn.microsoft.com/library/dn133165.aspx)
- [CREATE CLUSTERED COLUMNSTORE INDEX (Transact-SQL)](http://msdn.microsoft.com/library/dn511016.aspx)
- [Columnstore Indexes Described](http://msdn.microsoft.com/library/gg492088.aspx)


## General features that require minimum level 130


The cardinality estimator (CE) generates and stores statistics about the approximate number of rows in a table. Many parts of the query optimizer use the cardinality information.


The algorithms used by the CE have been improved. Improvements cause change, and change can cause uncommon specialized cases to regress.


| 130 is minimum<br/>necessary<br/>level | Query area,<br/>General | Details of<br/>query plan<br/>improvement |
| :-- | :-- | :-- |
| 130 | Cardinality estimator (CE) | Refinements to the cardinality estimator (CE), compared to the earlier CE at level 120.<br/><br/>In the query plan you might see: **CardinalityEstimationModelVersion="130"**<br/><br/>**Trace flag** [**9481**](http://www.sqlservergeeks.com/sql-server-2014-trace-flags-9481/) can be turned on to use the CE of level 120 when your database is at level 130.<br/><br/>**Trace flag** [**4199**](http://support.microsoft.com/kb/974006), when your database is at compatibility level 130, can be set to off to opt out of hotfixes to the query optimizer. The flag applies only to hotfixes that are implemented after level 130 is fully out of preview and is released for General Availability (GA). For details see:<br/><br/>● [DBCC TRACEON](http://msdn.microsoft.com/library/ms187329.aspx) |
| 130 | Parallel query plans for in-memory tables | Queries can use multiple threads and can run in parallel when they are against an in-memory table, meaning a table that was created with the **MEMORY_OPTIMIZED = YES** clause. Parallelism can make the queries run faster.<br/><br/>This enhancement is supported for regular Transact-SQL and user stored procedures. But it is not supported for native stored procedures which compiled into a DLL. |


## Columnstore index features that require minimum level 130


At compatibility level 130, the query optimizer enhancements can result in a new query plan. For changed plans that involve a columnstore index, the change usually involves one of the following:


- A reduction in the circumstances where data must be copied for a further sub-operation.
- A change from *row* processing to ***batch*** processing for operations such as sort.


In most cases the plan change improves performance of the query by involving:


- Parallel inserts into a columnstore index.
 - Level 130 does not provide parallel scanning of nonclustered indexes.
- Increased use of the **tempdb** database.


| 130 is minimum<br/>necessary<br/>level | Query area,<br/>Columnstore index | Details of<br/>query plan<br/>improvement |
| :-- | :-- | :-- |
| 130 | Function queries | Performance is improved by the switch to batch mode, in the following cases:<br/><br/>• Sorting is involved.<br/><br/>• Aggregates with *multiple* distinct functions<br/>(one function from each of two different bullets from the following list):<br/>&nbsp;&nbsp;&nbsp;▫ **COUNT** *or* **COUNT_BIG**<br/>&nbsp;&nbsp;&nbsp;▫ **AVG** *or* **SUM**<br/>&nbsp;&nbsp;&nbsp;▫ **CHECKSUM_AGG**<br/>&nbsp;&nbsp;&nbsp;▫ **STDEV** *or* **STDEVP**<br/><br/>• Window aggregate functions<br/>(described [here on MSDN](http://msdn.microsoft.com/library/ms189461.aspx), and [here by Kathi Kellenberger](http://www.bidn.com/blogs/KathiKellenberger/sql-server/4397/what-is-a-window-aggregate-function)):<br/>&nbsp;&nbsp;&nbsp;▫ **COUNT**, **COUNT_BIG**, **SUM**, **AVG**, **MIN**, **MAX**, **CLR**<br/><br/>• Window [user-defined](http://msdn.microsoft.com/library/ms131057.aspx) aggregates:<br/>&nbsp;&nbsp;&nbsp;▫ [**CHECKSUM_AGG**](http://msdn.microsoft.com/library/ms188920.aspx), [**STDEV**](http://msdn.microsoft.com/library/ms190474.aspx), [**STDEVP**](http://msdn.microsoft.com/library/ms176080.aspx), [**VAR**](http://msdn.microsoft.com/library/ms186290.aspx), [**VARP**](http://msdn.microsoft.com/library/ms188735.aspx), [**GROUPING**](http://msdn.microsoft.com/library/ms178544.aspx)<br/><br/>• Window aggregate analytic functions:<br/>&nbsp;&nbsp;&nbsp;▫ [**LAG**](http://msdn.microsoft.com/library/hh231256.aspx), [**LEAD**](http://msdn.microsoft.com/library/hh213125.aspx), [**FIRST_VALUE**](http://msdn.microsoft.com/library/hh213018.aspx), [**LAST_VALUE**](http://msdn.microsoft.com/library/hh231517.aspx), [**PERCENTILE_CONT**](http://msdn.microsoft.com/library/hh231473.aspx), [**PERCENTILE_DISC**](http://msdn.microsoft.com/library/hh231327.aspx), [**CUME_DIST**](http://msdn.microsoft.com/library/hh231078.aspx), [**PERCENT_RANK**](http://msdn.microsoft.com/library/hh213573.aspx) |
| 130 | Single-threaded serial query plan | A query executed on a single thread can run in batch mode. This can make the query perform faster.<br/><br/>A query plan might be designed as single-threaded, or a query might run under **MAXDOP 1**. |
| 130 | Parallel insert | Your query plan can perform some inserts in parallel.<br/<br/>The [example](#ExampleQueryParallelCciByCompatLevel) later in this topic demonstrates this parallelism. |
| 130 | Anti-semi join | This operator can now run in batch mode. |


## General features that require minimum level 120


| 120 is minimum<br/>necessary<br/>level | Query area,<br/>General | Details of<br/>query plan<br/>improvement |
| :-- | :-- | :-- |
| 120 | [Altering MEMORY_OPTIMIZED Tables](http://msdn.microsoft.com/library/dn269114.aspx) | Enables you to perform Transact-SQL **ALTER TABLE** operations on tables which have **MEMORY_OPTIMIZED = YES**.<br/><br/>The database application can continue to run, but operations that access the table are blocked until the **ALTER TABLE** completes. |
| 120 | [Creating and Managing Storage for Memory-Optimized Objects](http://msdn.microsoft.com/library/dn133174.aspx) | The in-memory OLTP engine is integrated into SQL Server. This lets you have both **MEMORY_OPTIMIZED** tables and traditional disk-based tables in the same database. |
| 120 | [Transact-SQL Support for In-Memory OLTP](http://msdn.microsoft.com/library/dn133180.aspx) | A handful of Transact-SQL commands have been enhanced to support in-memory online transaction processing (OLTP).<br/><br/>One example is the new **NATIVE_COMPILATION** keyword on the [CREATE PROCEDURE](http://msdn.microsoft.com/library/ms187926.aspx) command. |
| 120 | Cardinality estimator (CE) | Refinements to the cardinality estimator (CE), compared to the earlier CE at level 110.<br/><br/>In the query plan you might see: **CardinalityEstimationModelVersion="120"**<br/><br/>For details on how **trace flag 4199** interacts with the compatibility level value, see [KB 974006](http://support.microsoft.com/kb/974006).|


## Columnstore index features that require minimum level 120


This section describes the [features of columnstore indexing](http://msdn.microsoft.com/library/dn934994.aspx) that are activated at the compatibility level 120 or higher.


| 120 is minimum<br/>compatibility<br/>level | Columnstore index<br/>feature name | Columnstore index<br/>feature description |
| :-- | :-- | :-- |
| 120 | Snapshot isolation (SI) level, and<br/><br/>read committed snapshot isolation (RCSI) level. | When the query plan involves a columnstore index, SI and RCSI prevent data from partially complete transactions from being included in the query results, without the need for excessive locks. |
| 120 | Index defragmentation | Deleted rows are removed without an explicit rebuild of index.<br/><br/>**ALTER INDEX ... REORGANIZE** removes deleted rows from the columnstore index while the table and index remain operational online. |
| 120 | Accessible on an AlwaysOn [readable secondary replica](http://msdn.microsoft.com/library/ff878253.aspx) | You can improve performance for operational analytics by offloading analytics queries to an AlwaysOn secondary replica. |
| 120 | Aggregate push down,<br/>during table scan phase of aggregate functions | Improves performance by completing interim computations earlier in the query plan, so that less data need be copied to later phases.<br/><br/>Applies to **MIN**, **MAX**, **SUM**, **COUNT**, **AVG**.<br/><br/>Applies only when the data type is eight bytes or less, although not for strings. |
| 120 | Push down of string-based **WHERE** clauses | The predicate pushdown optimization can speed up queries that compare string data of type &#x5b;var&#x5d;char or n&#x5b;var&#x5d;char. This optimization:<br/><br/>• Applies to the common comparison operators including **LIKE** that use bitmap filters.<br/><br/>• Works only when there is one string predicate.<br/><br/>• Works with all the collations the product supports.<br/><br/>If you want more details about bitmap filters, see this blog post: [Intro to Query Execution Bitmap Filters](http://blogs.msdn.com/b/sqlqueryprocessing/archive/2006/10/27/query-execution-bitmaps.aspx). |



<a id="ExampleQueryParallelCciByCompatLevel" name="ExampleQueryParallelCciByCompatLevel"></a>


&nbsp;


## Example change of query plan by compatibility level


For one Transact-SQL **INSERT...SELECT** statement, this section displays the change in its query plan between compatibility levels 120 and 130.


#### Source table schema


The following table contains at least 300,000 rows. The advanced query plan might not bother with parallelism if there is too little data to make parallelism worth while.


```
CREATE TABLE [dbo].[ccitestoriginal](
	[FinanceKey] [int] NOT NULL,
	[DateKey] [int] NOT NULL,
	[OrganizationKey] [int] NOT NULL,
	[DepartmentGroupKey] [int] NOT NULL,
	[ScenarioKey] [int] NOT NULL,
	[AccountKey] [int] NOT NULL,
	[Amount] [float] NOT NULL,
	[Date] [datetime] NULL
) ON [PRIMARY];
GO

CREATE CLUSTERED COLUMNSTORE INDEX [cci_ccitestoriginal]
	ON [dbo].[ccitestoriginal]
	WITH (DROP_EXISTING = OFF) ON [PRIMARY];
GO
```


#### Script to generate the query plan


Apply these steps to the Transact-SQL script that follows:


1. In **Ssms.exe** connect to your database.
2. Paste the Transact-SQL script into an **Ssms.exe** query window.
3. Edit the script to ensure that **120** is the value on **ALTER DATABASE** statement.
4. Run only the portion of the script that is *before* the **INSERT INTO** statement.
5. Activate the menu option: **Query** > **Include Actual Execution Plan (Ctrl+M)**.
6. Run only the **INSERT INTO** statement.<br/><br/>
7. Deactivate the menu option: **Query** > **Include Actual Execution Plan (Ctrl+M)**.
8. Finally, run only the portion of the script that is *after* the **INSERT INTO** statement.
9. Note the query plan for **120** in the **Execution plan** tab, which is near **Results** tab.<br/>-- -- -- -- -- --
10. Edit the script so that **130** is the value on **ALTER DATABASE**.
11. Rerun the script as described in the preceding steps.
12. Note the query plan for **130** is different, and includes parallelism.


&nbsp;


```
go
SET NOCOUNT ON;
go

ALTER DATABASE YourDatabaseName SET COMPATIBILITY_LEVEL =
	120
	--130
;
go

DROP TABLE ccitest_into_work;
go

SELECT *
	INTO ccitest_into_work  -- Create an empty copy of the table.
	FROM ccitestoriginal
	WHERE 1=2;
go

CREATE CLUSTERED COLUMNSTORE INDEX ccitest_into_work_cci
	ON ccitest_into_work;
go

SET NOCOUNT OFF;
go
	
	-- Run this INSERT statement alone!
	--
	-- First run all the preceding Transact-SQL statements.
	-- Then run this one INSERT statement alone.
	-- Then run all remaining Transact-SQL statements.

INSERT INTO ccitest_into_work WITH (TABLOCK)
	SELECT TOP 300000 *
		FROM ccitestoriginal;
go

SET NOCOUNT ON;
go

DROP TABLE ccitest_into_work;
go
```


#### Display of the two plans



<br/>**120:** Here is the query plan when the compatibility level is **120**.


![Plan at level 120][1-Plan-at-level-120]


<br/>**130:** Here is the query plan when the compatibility level is **130**.


The **130** plan includes *parallelism* that the **120** plan lacks.


The display of this plan is rather wide in **Ssms.exe**. For better display here, the screenshot is split into two parts. The second part continues the first part.


![Plan at level 130][2-Plan-at-level-130]


## Default compatibility level in your database


When you upgrade your Azure SQL Database server, such as from version V11 to V12, the compatibility level in each database remains unchanged. After the upgrade, you can increase the compatibility level in any given database by using the **ALTER DATABASE** statement.


Any new freshly created database will have the maximum compatibility level the SQL Database version allows.



<!-- Image references. -->

[1-Plan-at-level-120]: ./media/sql-database-compatibility-level/sql-db-compat-level-query-plan-b-120.png

[2-Plan-at-level-130]: ./media/sql-database-compatibility-level/sql-db-compat-level-query-plan-b12-130.png

