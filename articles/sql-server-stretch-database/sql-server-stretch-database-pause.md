<properties
	pageTitle="Pause and resume data migration (Stretch Database) | Microsoft Azure"
	description="Learn how to pause or resume data migration to Azure."
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
	ms.date="06/14/2016"
	ms.author="douglasl"/>

# Pause and resume data migration (Stretch Database)

To pause or resume data migration to Azure, select **Stretch** for a table in SQL Server Management Studio, and then select **Pause** to pause data migration or **Resume** to resume data migration. You can also use Transact\-SQL to pause or resume data migration.

Pause data migration on individual tables when you want to troubleshoot problems on the local server or to maximize the available network bandwidth.

## Pause data migration

### Use SQL Server Management Studio to pause data migration

1.  In SQL Server Management Studio, in Object Explorer, select the Stretch\-enabled table for which you want to pause data migration.

2.  Right\-click and select **Stretch**, and then select **Pause**.

### Use Transact\-SQL to pause data migration
Run the following command.

```tsql
USE <Stretch-enabled database name>;
GO
ALTER TABLE <Stretch-enabled table name>  
    SET ( REMOTE_DATA_ARCHIVE ( MIGRATION_STATE = PAUSED ) ) ;  
GO
```

## Resume data migration

### Use SQL Server Management Studio to resume data migration

1.  In SQL Server Management Studio, in Object Explorer, select the Stretch\-enabled table for which you want to resume data migration.

2.  Right\-click and select **Stretch**, and then select **Resume**.

### Use Transact\-SQL to resume data migration
Run the following command.

```tsql
USE <Stretch-enabled database name>;
GO
ALTER TABLE <Stretch-enabled table name>   
    SET ( REMOTE_DATA_ARCHIVE ( MIGRATION_STATE = OUTBOUND ) ) ;  
 GO
```

## Check whether migration is active or paused

### Use SQL Server Management Studio to check whether migration is active or paused
In SQL Server Management Studio, open **Stretch Database Monitor** and check the value of the **Migration State** column. For more info, see [Monitor and troubleshoot data migration](sql-server-stretch-database-monitor.md).

### Use Transact-SQL to check whether migration is active or paused
Query the catalog view **sys.remote_data_archive_tables** and check the value of the **is_migration_paused** column. For more info, see [sys.remote_data_archive_tables](https://msdn.microsoft.com/library/dn935003.aspx).

## See also

[ALTER TABLE (Transact-SQL)](https://msdn.microsoft.com/library/ms190273.aspx)
[Monitor and troubleshoot data migration](sql-server-stretch-database-monitor.md)
