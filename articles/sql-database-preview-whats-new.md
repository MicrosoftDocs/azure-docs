<properties pageTitle="What's new in the Latest SQL Database Update V12 (preview)" description="Lists and describes the latest enhancements to Microsoft Azure SQL Database, the preview of version 12, that are available starting in December 2014." services="sql-database" documentationCenter="" authors="MightyPen" manager="jeffreyg" editor=""/>

<tags ms.service="sql-database" ms.workload="sql-database" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/12/2015" ms.author="genemi"/>


# What's new in the Latest SQL Database Update V12 (preview)

<!--
Latest Edit Datetime:  GM,  2014-12-15  Monday  16:52pm.
Applied feedback of JG, JH, JM (Added back Joanne's marketing text.).
-->


The latest Azure SQL Database V12 (preview) provides nearly complete compatibility with the Microsoft SQL Server engine. The preview brings more Premium performance to customers. These enhancements help to streamline SQL Server application migrations to Azure, and help customers who have heavier database workloads. 

This preview marks the first step in delivering the next generation of the Azure SQL Database service. It gives customers more compatibility, flexibility, and performance. Internal tests of the preview at the Premium service tier showed that some queries now complete in a fraction of the time they take on today's Premium Azure SQL Database. Even bigger improvements were seen in some scenarios that benefit from the in-memory columnstore technology.

**[Sign up](https://portal.azure.com) for the Latest SQL Database Update V12 (Preview) to take advantage of the next generation of  SQL Database on Microsoft Azure. To take advantage of the preview, you first need a subscription to Microsoft Azure. You can sign up for a [free Azure trial](http://azure.microsoft.com/en-us/pricing/free-trial) and review [pricing](http://azure.microsoft.com/en-us/pricing/details/sql-database) information.**

> [AZURE.NOTE]
> Test databases, database copies, or new databases, are good candidates for upgrading to the preview. Production databases that your business depends on should wait until after the preview period.

Your path to planning and implementing the V12 preview starts at [Plan and prepare to upgrade to the Latest SQL Database Update V12 (preview)](http://azure.microsoft.com/documentation/articles/sql-database-preview-plan-prepare-upgrade/).


### Key highlights

Key highlights of this V12 preview include the following:

- **Easier management** of large databases to support heavier workloads with parallel queries (Premium only), [table partitioning](http://msdn.microsoft.com/library/ms187802.aspx), [online indexing](http://msdn.microsoft.com/library/ms188388.aspx), worry-free large index rebuilds with 2GB size limit removed, and more options on the [alter database](http://msdn.microsoft.com/library/bb522682.aspx) statement.

- **Support for key programmability functions** to drive more robust application design with [CLR integration](http://msdn.microsoft.com/library/ms189524.aspx), T-SQL [window functions](http://msdn.microsoft.com/library/ms189461.aspx), [XML indexes](http://msdn.microsoft.com/library/bb934097.aspx), and [change tracking](http://msdn.microsoft.com/library/bb933875.aspx) for data.

- **Breakthrough performance** with support for in-memory [columnstore](http://msdn.microsoft.com/library/gg492153.aspx) queries (Premium tier only) for data mart and smaller analytic workloads.

- **Monitoring and troubleshooting** are improved with visibility into over 100 new table views in an expanded set of Database Management Views ([DMVs](http://msdn.microsoft.com/library/ms188754.aspx))

- **New S3 performance level in the Standard tier:** offers more pricing flexibility between Standard and Premium. S3 will deliver more DTUs (database throughput units) and all the features available in the Standard tier.

## Details of the new V12 preview enhancements explained

This section names and explains the new features in each category.


### Category: Expanded database management


| Feature | Description |
| :--- | :--- |
| Table partitioning | Previous limitations on [table partitioning](http://msdn.microsoft.com/library/ms190787.aspx) are eliminated. |
| Larger transactions | <p>With the V12 preview you are no longer limited to a maximum of 2 GB of data modifications in a single transaction.</p> <p>One benefit is that rebuilding a large index is no longer limited by 2 GB transaction size limit.</p> For general information, see [Azure SQL Database Resource Limits](http://msdn.microsoft.com/library/azure/dn338081.aspx). |
| Online index build and rebuild | <p>Before the V12 preview, Azure SQL Database generally supported the (ONLINE=ON) clause of the ALTER INDEX statement, but this was not supported for indexes on a BLOB type column. Now the V12 preview does support (ONLINE=ON) even for indexes on BLOB columns.</p> <p>The ONLINE feature enables queries to benefit from an index even while the index is being rebuilt.</p> |
| CHECKPOINT support | With the V12 preview you can issue the T-SQL CHECKPOINT statement for your database. |
| More options on ALTER DATABASE | The V12 preview supports more of the options that are available on the ALTER DATABASE statement. <p> </p> For more information, see [ALTER DATABASE (Transact-SQL)](http://msdn.microsoft.com/library/ms174269.aspx) or [Azure SQL Database Transact-SQL Reference](http://msdn.microsoft.com/library/azure/ee336281.aspx). |
| More DBCC commands | The V12 preview supports the following additional DBCC commands: <p> </p> CHECKALLOC <br/> CHECKCONSTRAINTS <br/> CHECKDB <br/> CHECKFILEGROUP <br/> CHECKIDENT <br/> CHECKTABLE <br/><br/> CLEANTABLE <br/> DBREINDEX <br/> INDEXDEFRAG <br/> INPUTBUFFER <br/> OPENTRAN <br/> PROCCACHE <br/> SHOWCONTIG <br/> SQLPERF <br/> TRACESTATUS <br/>UPDATEUSAGE <br/> USEROPTIONS |


### Category: Programming and application support


| Feature | Description |
| :--- | :--- |
| Window functions in T-SQL queries | The ANSI window functions are access with the [OVER clause](http://msdn.microsoft.com/library/ms189461.aspx). <p></p> Itzik Ben-Gan has an excellent [blog post](http://sqlmag.com/sql-server-2012/how-use-microsoft-sql-server-2012s-window-functions-part-1) that further explains window functions and the OVER clause. |
| .NET CLR integration | The CLR (common language runtime) of the .NET Framework is integrated into the V12 preview. <p></p> Only SAFE assemblies that are fully compiled to binary code are supported. For details see [CLR Integration Programming Model Restrictions](http://msdn.microsoft.com/library/ms403273.aspx). <p></p> You can find information about this feature in the following topics: <br/> * [Introduction to SQL Server CLR Integration](http://msdn.microsoft.com/library/ms254498.aspx) <br/> * [CREATE ASSEMBLY (Transact-SQL)](http://msdn.microsoft.com/library/ms189524.aspx). |
| Change tracking for data | Change tracking for data can now be configured at the database or table level. <p></p> For information about change tracking, see [About Change Tracking (SQL Server)](http://msdn.microsoft.com/library/bb933875.aspx). |
| XML indexes | The V12 preview enables you use the T-SQL statements CREATE XML INDEX and CREATE SELECTIVE XML INDEX. <p></p> Information about XML indexes is available at: <br/> * [CREATE XML INDEX (Transact-SQL)](http://msdn.microsoft.com/library/bb934097.aspx) <br/> * [Create, Alter, and Drop Selective XML Indexes](http://msdn.microsoft.com/library/jj670109.aspx) |
| Table as a heap | The V12 preview enables you to create a table that has no clustered index. <p></p> This feature is especially helpful for its support of the T-SQL SELECT...INTO statement which creates a table from a query result. |
| Application roles | For security and permissions control, the V12 preview enables you to issue GRANT - DENY - REMOVE statements against [application roles](http://msdn.microsoft.com/library/ms190998.aspx). |


### Category: Better customer insights


<!-- -----------------------------
GeneMi , 2014-Dec-07:

A.  PM Sasha Nosov recommends that our Help documentation make no mention of XEvents ("session events"?). 

B. "Change tracking" - as a feature name appears in two different rows in different categories in this topic draft. Yet I think both rows refer to the same feature. Is there any good reason to have two rows for Change Tracking?  Probably not.  Ask PMs.
----------------------- -->

| Feature | Description |
| :--- | :--- |
| DMVs (dynamic management views) | The following DMVs are added: <br/><br/> dm_clr_properties <br/> dm_clr_tasks <br/><br/> dm_db_file_space_usage <br/> dm_db_log_space_usage <br/> dm_db_session_space_usage <br/> dm_db_task_space_usage <br/><br/> dm_exec_background_job_queue <br/> dm_exec_background_job_queue_stats <br/> dm_exec_query_optimizer_info <br/> dm_exec_query_profiles <br/> dm_exec_query_resource_semaphores <br/> dm_exec_query_transformation_stats <br/><br/>dm_tran_active_snapshot_database_transactions <br/> dm_tran_commit_table <br/> dm_tran_current_snapshot <br/> dm_tran_current_transaction <br/> dm_tran_top_version_generators <br/> dm_tran_transactions_snapshot <br/> dm_tran_version_store |
| Change tracking | The V12 preview fully supports change tracking. <p></p> For details of this feature see [Enable and Disable Change Tracking (SQL Server)](http://msdn.microsoft.com/library/bb964713.aspx). |


### Performance improvements at the Premium service tier


These performance enhancements apply to the P2 and P3 levels within the Premium service tier.

| Feature | Description |
| :--- | :--- |
| Parallel processing for queries | The V12 preview provides a higher degree of parallelism for queries that can benefit from it. |
| Briefer I/O latency | The V12 preview has significantly briefer latency for input/output operations. |
| Increased IOPS | The V12 preview can process a larger quantity of input/output per second (IOPS). |
| Log rate | The V12 preview can log more data changes per second. |


### Summary of enhancements


The V12 preview elevates our SQL Database close to full feature compatibility with our SQL Server product. The V12 preview focuses on the most popular features, and on programmability support. This makes your development more efficient and more enjoyable.  It is now even easier to move your SQL database applications to the cloud.

And at the Premium tier the V12 preview brings major performance improvements. Some applications will see extreme gains in query speed. Applications with heavy workloads will see reliably robust throughput.


## How to proceed


You can learn how to try the V12 preview at [Plan and Prepare to Upgrade to the Latest Azure SQL Database Update Preview](http://azure.microsoft.com/documentation/articles/sql-database-preview-plan-prepare-upgrade/).

During the V12 preview period you can use the preview at a discount price. The new S3 level delivers 100 DTUs (database throughput units) and all the features available in the Standard tier for $0.2016/hour. The price is discounted down to $0.1008/hour during the V12 preview. For details see [SQL Database Pricing](http://azure.microsoft.com/pricing/details/sql-database/).


### Cautions for the V12 preview


- Any database that is upgraded to the preview cannot be reverted back to the earlier version.
- Test databases, database copies, or new databases, are good candidates for upgrading to the preview. Production databases that your business depends on should wait until after the preview period.
- The Web and Business service pricing tier is not supported on this preview version.


<!-- EndOfFile -->

