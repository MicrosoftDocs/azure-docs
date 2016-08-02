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
	ms.date="06/27/2016"
	ms.author="douglasl"/>

# Manage and troubleshoot Stretch Database

To manage and troubleshoot Stretch Database, use the tools and methods described in this topic .

## Manage local data

### <a name="LocalInfo"></a>Get info about local databases and tables enabled for Stretch Database
Open the catalog views **sys.databases** and **sys.tables** to see info about Stretch\-enabled SQL Server databases and tables. For more info, see [sys.databases (Transact-SQL)](https://msdn.microsoft.com/library/ms178534.aspx) and [sys.tables (Transact-SQL)](https://msdn.microsoft.com/library/ms187406.aspx).

To see how much space a Stretch\-enabled table is using in SQL Server, run the following statement.

 ```tsql
USE <Stretch-enabled database name>;
GO
EXEC sp_spaceused '<Stretch-enabled table name>', 'true', 'LOCAL_ONLY';
GO
 ```
## Manage data migration

### Check the filter function applied to a table
Open the catalog view **sys.remote\_data\_archive\_tables** and check the value of the **filter\_predicate** column to identify the function that Stretch Database is using to select rows to migrate. If the value is null, the entire table is eligible to be migrated. For more info, see [sys.remote_data_archive_tables (Transact-SQL)](https://msdn.microsoft.com/library/dn935003.aspx) and [Select rows to migrate by using a filter function](sql-server-stretch-database-predicate-function.md).

### <a name="Migration"></a>Check the status of data migration
Select **Tasks | Stretch | Monitor** for a database in SQL Server Management Studio to monitor data migration in Stretch Database Monitor. For more info, see [Monitor and troubleshoot data migration (Stretch Database)](sql-server-stretch-database-monitor.md).

Or, open the dynamic management view **sys.dm\_db\_rda\_migration\_status** to see how many batches and rows of data have been migrated.

### <a name="Firewall"></a>Troubleshoot data migration
For troubleshooting suggestions, see [Monitor and troubleshoot data migration (Stretch Database)](sql-server-stretch-database-monitor.md).

## Manage remote data

### <a name="RemoteInfo"></a>Get info about remote databases and tables used by Stretch Database
Open the catalog views **sys.remote\_data\_archive\_databases** and **sys.remote\_data\_archive\_tables** to see info about the remote databases and tables in which migrated data is stored. For more info, see [sys.remote_data_archive_databases (Transact-SQL)](https://msdn.microsoft.com/library/dn934995.aspx) and [sys.remote_data_archive_tables (Transact-SQL)](https://msdn.microsoft.com/library/dn935003.aspx).

To see how much space a Stretch-enabled table is using in Azure, run the following statement.

 ```tsql
USE <Stretch-enabled database name>;
GO
EXEC sp_spaceused '<Stretch-enabled table name>', 'true', 'REMOTE_ONLY';
GO
 ```

### Delete migrated data  
If you want to delete data that has already been migrated to Azure, follow the steps described in [sys.sp_rda_reconcile_batch](https://msdn.microsoft.com/library/mt707768.aspx).

## Manage table schema

### Don't change the schema of the remote table
Don't change the schema of a remote Azure table that's associated with a SQL Server table configured for Stretch Database. In particular, don't modify the name or the data type of a column. The Stretch Database feature makes various assumptions about the schema of the remote table in relation to the schema of the SQL Server table. If you change the remote schema, Stretch Database stops working for the changed table.

### Reconcile table columns  
If you have accidentally deleted columns from the remote table, run **sp_rda_reconcile_columns** to add columns to the remote table that exist in the Stretch\-enabled SQL Server table but not in the remote table. For more info, see [sys.sp_rda_reconcile_columns](https://msdn.microsoft.com/library/mt707765.aspx).  

  > [!IMPORTANT] When **sp_rda_reconcile_columns** recreates columns that you accidentally deleted from the remote table, it does not restore the data that was previously in the deleted columns.

**sp_rda_reconcile_columns** does not delete columns from the remote table that exist in the remote table but not in the Stretch\-enabled SQL Server table. If there are columns in the remote Azure table that no longer exist in the Stretch\-enabled SQL Server table, these extra columns do not prevent Stretch Database from operating normally. You can optionally remove the extra columns manually.  

## Manage performance and costs  

### Troubleshoot query performance
Queries that include Stretch\-enabled tables are expected to perform more slowly than they did before the tables were enabled for Stretch. If query performance degrades significantly, review the following possible problems.

-   Is your Azure server in a different geographical region than your SQL Server? Configure your Azure server to be in the same geographical region as your SQL Server to reduce network latency.

-   Your network conditions may have degraded. Contact your network administrator for info about recent issues or outages.

### Increase Azure performance level for resource\-intensive operations such as indexing
When you build, rebuild, or reorganize an index on a large table that's configured for Stretch Database, and you anticipate heavy querying of the migrated data in Azure during this time, consider increasing the performance level of the corresponding remote Azure database for the duration of the operation. For more info about performance levels and pricing, see [SQL Server Stretch Database Pricing](https://azure.microsoft.com/pricing/details/sql-server-stretch-database/).

### You can't pause the SQL Server Stretch Database service on Azure  
 Make sure that you select the appropriate performance and pricing level. If you increase the performance level temporarily for a resource\-intensive operation, restore it to the previous level after the operation completes. For more info about performance levels and pricing, see [SQL Server Stretch Database Pricing](https://azure.microsoft.com/pricing/details/sql-server-stretch-database/).  

## Change the scope of queries  
 Queries against Stretch\-enabled tables return both local and remote data by default. You can change the scope of queries for all queries by all users, or only for a single query by an administrator.  

### Change the scope of queries for all queries by all users  
 To change the scope of all queries by all users, run the stored procedure **sys.sp_rda_set_query_mode**. You can reduce the scope to query local data only, disable all queries, or restore the default setting. For more info, see [sys.sp_rda_set_query_mode](https://msdn.microsoft.com/library/mt703715.aspx).  

### <a name="queryHints"></a>Change the scope of queries for a single query by an administrator  
 To change the scope of a single query by a member of the db_owner role, add the **WITH \( REMOTE_DATA_ARCHIVE_OVERRIDE = *value* \)** query hint to the SELECT statement. The REMOTE_DATA_ARCHIVE_OVERRIDE query hint can have the following values.  
 -   **LOCAL_ONLY**. Query local data only.  

 -   **REMOTE_ONLY**. Query remote data only.  

 -   **STAGE_ONLY**. Query only the data in the table where Stretch Database stages rows eligible for migration and retains migrated rows for the specified period after migration. This query hint is the only way to query the staging table.  

For example, the following query returns local results only.  

 ```tsql  
 USE <Stretch-enabled database name>;
 GO
 SELECT * FROM <Stretch_enabled table name> WITH (REMOTE_DATA_ARCHIVE_OVERRIDE = LOCAL_ONLY) WHERE ... ;
 GO
```  

## <a name="adminHints"></a>Make administrative updates and deletes  
 By default you can't UPDATE or DELETE rows that are eligible for migration, or rows that have already been migrated, in a Stretch\-enabled table. When you have to fix a problem, a member of the db_owner role can run an UPDATE or DELETE operation by adding the **WITH \( REMOTE_DATA_ARCHIVE_OVERRIDE = *value* \)** query hint to the statement. The REMOTE_DATA_ARCHIVE_OVERRIDE query hint can have the following values.  
 -   **LOCAL_ONLY**. Update or delete local data only.  

 -   **REMOTE_ONLY**. Update or delete remote data only.  

 -   **STAGE_ONLY**. Update or delete only the data in the table where Stretch Database stages rows eligible for migration and retains migrated rows for the specified period after migration.  

## See also

[Monitor Stretch Database](sql-server-stretch-database-monitor.md)

[Backup Stretch-enabled databases](sql-server-stretch-database-backup.md)

[Restore Stretch-enabled databases](sql-server-stretch-database-restore.md)
