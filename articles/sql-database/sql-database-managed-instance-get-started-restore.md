---
title: "Quickstart: Restore a backup (SSMS)"
titleSuffix: Azure SQL SQL Managed Instance 
description: In this quickstart, learn to restore a database backup to an Azure SQL SQL Managed Instance using SQL Server Management (SSMS). 
services: sql-database
ms.service: sql-database
ms.subservice: managed-instance
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: quickstart
author: srdan-bozovic-msft
ms.author: srbozovi
ms.reviewer: sstein, carlrab, bonova
ms.date: 12/14/2018
---
# Quickstart: Restore a database to an Azure SQL Managed Instance with SSMS

In this quickstart, you'll use SQL Server Management Studio (SSMS) to restore a database (the Wide World Importers - Standard backup file) from Azure Blob storage into an [Azure SQL Managed Instance](sql-database-managed-instance.md).

> [!VIDEO https://www.youtube.com/embed/RxWYojo_Y3Q]

> [!NOTE]
> For more information on migration using the Azure Database Migration Service (DMS), see [SQL Managed Instance migration using DMS](../dms/tutorial-sql-server-to-managed-instance.md).
> For more information on various migration methods, see [SQL Server migration to Azure SQL Managed Instance](sql-database-managed-instance-migrate.md).

## Prerequisites

This quickstart:

- Uses resources from the [Create a SQL Managed Instance](sql-database-managed-instance-get-started.md) quickstart.
- Requires the latest version of [SQL Server Management Studio (SSMS)](https://docs.microsoft.com/sql/ssms/sql-server-management-studio-ssms) installed.
- Requires using SSMS to connect to your SQL Managed Instance. See these quickstarts on how to connect:
  - [Enable public endpoint](sql-database-managed-instance-public-endpoint-configure.md) on SQL Managed Instance - this is recommended approach for this tutorial.
  - [Connect to an SQL Managed Instance from an Azure VM](sql-database-managed-instance-configure-vm.md)
  - [Configure a point-to-site connection to an SQL Managed Instance from on-premises](sql-database-managed-instance-configure-p2s.md).

> [!NOTE]
> For more information on backing up and restoring a SQL Server database using Azure Blob storage and a [Shared Access Signature (SAS) key](https://docs.microsoft.com/azure/storage/common/storage-dotnet-shared-access-signature-part-1), see [SQL Server Backup to URL](https://docs.microsoft.com/sql/relational-databases/backup-restore/sql-server-backup-to-url?view=sql-server-2017).

## Restore from a backup file

In SQL Server Management Studio (SSMS), follow these steps to restore the Wide World Importers database to your SQL Managed Instance. The database backup file is stored in a pre-configured Azure Blob storage account.

1. Open SSMS and connect to your SQL Managed Instance.
2. In **Object Explorer**, right-click your SQL Managed Instance and select **New Query** to open a new query window.
3. Run the following SQL script, which uses a pre-configured storage account and SAS key to [create a credential](https://docs.microsoft.com/sql/t-sql/statements/create-credential-transact-sql) in your SQL Managed Instance.

   ```sql
   CREATE CREDENTIAL [https://mitutorials.blob.core.windows.net/databases]
   WITH IDENTITY = 'SHARED ACCESS SIGNATURE'
   , SECRET = 'sv=2017-11-09&ss=bfqt&srt=sco&sp=rwdlacup&se=2028-09-06T02:52:55Z&st=2018-09-04T18:52:55Z&spr=https&sig=WOTiM%2FS4GVF%2FEEs9DGQR9Im0W%2BwndxW2CQ7%2B5fHd7Is%3D'
   ```

    ![create credential](./media/sql-database-managed-instance-get-started-restore/credential.png)

4. To check your credential, run the following script, which uses a [container](https://azure.microsoft.com/services/container-instances/) URL to get a backup file list.

   ```sql
   RESTORE FILELISTONLY FROM URL =
      'https://mitutorials.blob.core.windows.net/databases/WideWorldImporters-Standard.bak'
   ```

    ![file list](./media/sql-database-managed-instance-get-started-restore/file-list.png)

5. Run the following script to restore the Wide World Importers database.

   ```sql
   RESTORE DATABASE [Wide World Importers] FROM URL =
     'https://mitutorials.blob.core.windows.net/databases/WideWorldImporters-Standard.bak'
   ```

    ![restore](./media/sql-database-managed-instance-get-started-restore/restore.png)

6. Run the following script to track your the status of your restore.

   ```sql
   SELECT session_id as SPID, command, a.text AS Query, start_time, percent_complete
      , dateadd(second,estimated_completion_time/1000, getdate()) as estimated_completion_time
   FROM sys.dm_exec_requests r
   CROSS APPLY sys.dm_exec_sql_text(r.sql_handle) a
   WHERE r.command in ('BACKUP DATABASE','RESTORE DATABASE')
   ```

7. When the restore completes, view the database in Object Explorer. You can verify that database restore is completed using [sys.dm_operation_status](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-operation-status-azure-sql-database) view.

> [!NOTE]
> Database restore operation is asynchronous and retryable. You might get some error is SQL Server Management Studio if connection breaks or some time-out expires. Azure SQL Database will keep trying to restore database in the background, and you can track the progress of restore using the [sys.dm_exec_requests](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-requests-transact-sql) and [sys.dm_operation_status](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-operation-status-azure-sql-database) views.
> In some phases of restore process you will see unique identifier instead of actual database name in the system views. Learn about `RESTORE` statement behavior differences [here](https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance-transact-sql-information#restore-statement).

## Next steps

- For troubleshooting a backup to a URL, see [SQL Server Backup to URL Best Practices and Troubleshooting](https://docs.microsoft.com/sql/relational-databases/backup-restore/sql-server-backup-to-url-best-practices-and-troubleshooting).
- For an overview of app connection options, see [Connect your applications to SQL Managed Instance](sql-database-managed-instance-connect-app.md).
- To query using your favorite tools or languages, see [Quickstarts: Azure SQL Database Connect and Query](sql-database-connect-query.md).
