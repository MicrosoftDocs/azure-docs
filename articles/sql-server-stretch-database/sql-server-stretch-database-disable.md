<properties
	pageTitle="Disable Stretch Database and bring back remote data | Microsoft Azure"
	description="Learn how to disable Stretch Database for a table and optionally bring back remote data."
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

# Disable Stretch Database and bring back remote data

To disable Stretch Database for a table, select **Stretch** for a table in SQL Server Management Studio. Then select one of the following options.

-   **Disable | Bring data back from Azure**. Copy the remote data for the table from Azure back to SQL Server, then disable Stretch Database for the table. This operation incurs data transfer costs, and it can't be canceled.

-   **Disable | Leave data in Azure**. Disable Stretch Database for the table.  Abandon the remote data for the table in Azure.

After you disable Stretch Database for a table, data migration stops and query results no longer include results from the remote table.

You can also use Transact\-SQL to disable Stretch Database for a table or for a database.

If you simply want to pause data migration, see [Pause and resume Stretch Database](sql-server-stretch-database-pause.md).

**Note** Disabling Stretch does not remove the remote objects. If you want to delete the remote table or the remote database, you have to drop it by using the Azure management portal.

## Disable Stretch Database for a table

### Use SQL Server Management Studio to disable Stretch Database for a table

1.  In SQL Server Management Studio, in Object Explorer, select the table for which you want to disable Stretch Database.

2.  Right\-click and select **Stretch**, and then select one of the following options.

    -   **Disable | Bring data back from Azure**. Copy the remote data for the table from Azure back to SQL Server, then disable Stretch Database for the table. This command can't be canceled.

        This operation incurs data transfer costs. For more info, see [Data Transfers Pricing Details](https://azure.microsoft.com/pricing/details/data-transfers/).

        After all the remote data has been copied from Azure back to SQL Server, Stretch is disabled for the table.

    -   **Disable | Leave data in Azure**. Disable Stretch Database for the table.  Abandon the remote data for the table in Azure.

    Disabling Stretch does not remove the remote table. If you want to delete the remote table, you have to drop it by using the Azure management portal. 

### Use Transact\-SQL to disable Stretch Database for a table

-   To disable Stretch for a table and copy the remote data for the table from Azure SQL Database back to SQL Server, run the following command. This command can't be canceled.

    ```tsql
    ALTER TABLE <table name>
       SET ( REMOTE_DATA_ARCHIVE ( MIGRATION_STATE = OUTBOUND ) ) ;
    ```
    This operation incurs data transfer costs. For more info, see [Data Transfers Pricing Details](https://azure.microsoft.com/pricing/details/data-transfers/).

    After all the remote data has been copied from Azure back to SQL Server, Stretch is disabled for the table.

-   To disable Stretch for a table and abandon the remote data, run the following command.

    ```tsql
    ALTER TABLE <table_name>
       SET ( REMOTE_DATA_ARCHIVE = OFF_WITHOUT_DATA_RECOVERY ( MIGRATION_STATE = PAUSED ) ) ;
    ```
Disabling Stretch does not remove the remote table. If you want to delete the remote table, you have to drop it by using the Azure management portal. 

## Disable Stretch Database for a database
Before you can disable Stretch Database for a database, you have to disable Stretch Database on the individual Stretch\-enabled tables in the database.

Disabling Stretch does not remove the remote database. If you want to delete the remote database, you have to drop it by using the Azure management portal. 

### Use SQL Server Management Studio to disable Stretch Database for a database

1.  In SQL Server Management Studio, in Object Explorer, select the database for which you want to disable Stretch Database.

2.  Right\-click and select **Tasks**, and then select **Stretch**, and then select **Disable**.

### Use Transact\-SQL to disable Stretch Database for a database
Run the following command.

```tsql
ALTER DATABASE <database name>
    SET REMOTE_DATA_ARCHIVE = OFF ;
```

## See also
[ALTER DATABASE SET Options (Transact-SQL)](https://msdn.microsoft.com/library/bb522682.aspx)
[Pause and resume Stretch Database](sql-server-stretch-database-pause.md)
