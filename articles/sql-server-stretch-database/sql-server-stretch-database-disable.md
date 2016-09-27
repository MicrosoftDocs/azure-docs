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
	ms.date="08/05/2016"
	ms.author="douglasl"/>

# Disable Stretch Database and bring back remote data

To disable Stretch Database for a table, select **Stretch** for a table in SQL Server Management Studio. Then select one of the following options.

-   **Disable | Bring data back from Azure**. Copy the remote data for the table from Azure back to SQL Server, then disable Stretch Database for the table. This operation incurs data transfer costs, and it can't be canceled.

-   **Disable | Leave data in Azure**. Disable Stretch Database for the table.  Abandon the remote data for the table in Azure.

You can also use Transact\-SQL to disable Stretch Database for a table or for a database.

After you disable Stretch Database for a table, data migration stops and query results no longer include results from the remote table.

If you simply want to pause data migration, see [Pause and resume Stretch Database](sql-server-stretch-database-pause.md).

>   [AZURE.NOTE] Disabling Stretch Database for a table or for a database does not delete the remote object. If you want to delete the remote table or the remote database, you have to drop it by using the Azure management portal. The remote objects continue to incur Azure costs until you delete them. For more info, see [SQL Server Stretch Database Pricing](https://azure.microsoft.com/pricing/details/sql-server-stretch-database/).

## Disable Stretch Database for a table

### Use SQL Server Management Studio to disable Stretch Database for a table

1.  In SQL Server Management Studio, in Object Explorer, select the table for which you want to disable Stretch Database.

2.  Right\-click and select **Stretch**, and then select one of the following options.

    -   **Disable | Bring data back from Azure**. Copy the remote data for the table from Azure back to SQL Server, then disable Stretch Database for the table. This command can't be canceled.

        >   [AZURE.NOTE] Copying the remote data for the table from Azure back to SQL Server incurs data transfer costs. For more info, see [Data Transfers Pricing Details](https://azure.microsoft.com/pricing/details/data-transfers/).

        After all the remote data has been copied from Azure back to SQL Server, Stretch is disabled for the table.

    -   **Disable | Leave data in Azure**. Disable Stretch Database for the table.  Abandon the remote data for the table in Azure.

    >   [AZURE.NOTE] Disabling Stretch Database for a table does not delete the remote data or the remote table. If you want to delete the remote table, you have to drop it by using the Azure management portal. The remote table continues to incur Azure costs until you delete it. For more info, see [SQL Server Stretch Database Pricing](https://azure.microsoft.com/pricing/details/sql-server-stretch-database/).

### Use Transact\-SQL to disable Stretch Database for a table

-   To disable Stretch for a table and copy the remote data for the table from Azure back to SQL Server, run the following command. After all the remote data has been copied from Azure back to SQL Server, Stretch is disabled for the table.

    This command can't be canceled.

    ```tsql
	USE <Stretch-enabled database name>;
    GO
    ALTER TABLE <Stretch-enabled table name>  
       SET ( REMOTE_DATA_ARCHIVE ( MIGRATION_STATE = INBOUND ) ) ;
    GO
    ```
    >   [AZURE.NOTE] Copying the remote data for the table from Azure back to SQL Server incurs data transfer costs. For more info, see [Data Transfers Pricing Details](https://azure.microsoft.com/pricing/details/data-transfers/).

-   To disable Stretch for a table and abandon the remote data, run the following command.

    ```tsql
    ALTER TABLE <table_name>
       SET ( REMOTE_DATA_ARCHIVE = OFF_WITHOUT_DATA_RECOVERY ( MIGRATION_STATE = PAUSED ) ) ;
    ```

>   [AZURE.NOTE] Disabling Stretch Database for a table does not delete the remote data or the remote table. If you want to delete the remote table, you have to drop it by using the Azure management portal. The remote table continues to incur Azure costs until you delete it. For more info, see [SQL Server Stretch Database Pricing](https://azure.microsoft.com/pricing/details/sql-server-stretch-database/).

## Disable Stretch Database for a database
Before you can disable Stretch Database for a database, you have to disable Stretch Database on the individual Stretch\-enabled tables in the database.

### Use SQL Server Management Studio to disable Stretch Database for a database

1.  In SQL Server Management Studio, in Object Explorer, select the database for which you want to disable Stretch Database.

2.  Right\-click and select **Tasks**, and then select **Stretch**, and then select **Disable**.

>   [AZURE.NOTE] Disabling Stretch Database for a database does not delete the remote database. If you want to delete the remote database, you have to drop it by using the Azure management portal. The remote database continues to incur Azure costs until you delete it. For more info, see [SQL Server Stretch Database Pricing](https://azure.microsoft.com/pricing/details/sql-server-stretch-database/).

### Use Transact\-SQL to disable Stretch Database for a database
Run the following command.

```tsql
ALTER DATABASE <database name>
    SET REMOTE_DATA_ARCHIVE = OFF ;
```

>   [AZURE.NOTE] Disabling Stretch Database for a database does not delete the remote database. If you want to delete the remote database, you have to drop it by using the Azure management portal. The remote database continues to incur Azure costs until you delete it. For more info, see [SQL Server Stretch Database Pricing](https://azure.microsoft.com/pricing/details/sql-server-stretch-database/).

## See also

[ALTER DATABASE SET Options (Transact-SQL)](https://msdn.microsoft.com/library/bb522682.aspx)

[Pause and resume Stretch Database](sql-server-stretch-database-pause.md)
