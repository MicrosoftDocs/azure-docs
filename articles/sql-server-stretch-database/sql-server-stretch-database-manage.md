<properties
	pageTitle="Manage and troubleshoot Stretch Database | Microsoft Azure"
	description="Learn how to manage and troubleshoot Stretch Database."
	services="sql-server-stretch-database"
	documentationCenter=""
	authors="douglaslMS"
	manager=""
	editor=""/>

<tags
	ms.service="sql-server-stretch-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="02/26/2016"
	ms.author="douglasl"/>

# Manage and troubleshoot Stretch Database

To manage and troubleshoot Stretch Database, use the tools and methods described in this topic .

## <a name="LocalInfo"></a>Get info about local databases and tables enabled for Stretch Database
Open the catalog views **sys.databases** and **sys.tables** to see info about Stretch\-enabled SQL Server databases and tables. For more info, see [sys.databases (Transact-SQL)](https://msdn.microsoft.com/library/ms178534.aspx) and [sys.tables (Transact-SQL)](https://msdn.microsoft.com/library/ms187406.aspx).

## <a name="RemoteInfo"></a>Get info about remote databases and tables used by Stretch Database
Open the catalog views **sys.remote\_data\_archive\_databases** and **sys.remote\_data\_archive\_tables** to see info about the remote databases and tables in which migrated data is stored. For more info, see [sys.remote_data_archive_databases (Transact-SQL)](https://msdn.microsoft.com/library/dn934995.aspx) and [sys.remote_data_archive_tables (Transact-SQL)](https://msdn.microsoft.com/library/dn935003.aspx).

## Check the filter predicate applied to a table
Open the catalog view **sys.remote\_data\_archive\_tables** and check the value of the **filter\_predicate** column. If the value is null, the entire table is eligible to be migrated. For more info, see [sys.remote_data_archive_tables (Transact-SQL)](https://msdn.microsoft.com/library/dn935003.aspx).

## <a name="Migration"></a>Check the status of data migration
Select **Tasks | Stretch | Monitor** for a database in SQL Server Management Studio to monitor data migration in Stretch Database Monitor. For more info, see [Monitor and troubleshoot data migration (Stretch Database)](sql-server-stretch-database-monitor.md).

Or, open the dynamic management view **sys.dm\_db\_rda\_migration\_status** to see how many batches and rows of data have been migrated.

## Increase Azure performance level for resource\-intensive operations such as indexing
When you build, rebuild, or reorganize an index on a large table that's configured for Stretch Database, consider increasing the performance level of the corresponding remote database for the duration of the operation.

## Don't change the schema of the remote table
Don't change the schema of a remote Azure table that's associated with a SQL Server table configured for Stretch Database. In particular, don't modify the name or the data type of a column. The Stretch Database feature makes various assumptions about the schema of the remote table in relation to the schema of the SQL Server table. If you change the remote schema, Stretch Database stops working for the changed table.

## <a name="Firewall"></a>Troubleshoot data migration
For troubleshooting suggestions, see [Monitor and troubleshoot data migration (Stretch Database)](sql-server-stretch-database-monitor.md).

## Troubleshoot query performance
**Queries that include my Stretch\-enabled table are slow.**
Queries that include Stretch\-enabled tables are expected to perform more slowly than they did before the tables were enabled for Stretch. If query performance degrades significantly, review the following possible problems.

-   Is your Azure server in a different geographical region than your SQL Server? Configure your Azure server to be in the same geographical region as your SQL Server to reduce network latency.

-   Your network conditions may have degraded. Contact your network administrator for info about recent issues or outages.

## See also

[Monitor Stretch Database](sql-server-stretch-database-monitor.md)

[Backup and restore Stretch-enabled databases](sql-server-stretch-database-backup.md)
