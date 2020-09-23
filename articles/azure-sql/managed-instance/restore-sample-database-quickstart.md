---
title: "Quickstart: Restore a backup (SSMS)"
titleSuffix: Azure SQL Managed Instance 
description: In this quickstart, learn to restore a database backup to Azure SQL Managed Instance using SQL Server Management Studio (SSMS). 
services: sql-database
ms.service: sql-managed-instance
ms.subservice: operations
ms.custom: 
ms.devlang: 
ms.topic: quickstart
author: srdan-bozovic-msft
ms.author: srbozovi
ms.reviewer: sstein, carlrab, bonova
ms.date: 12/14/2018
---
# Quickstart: Restore a database to Azure SQL Managed Instance with SSMS
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

In this quickstart, you'll use SQL Server Management Studio (SSMS) to restore a database (the Wide World Importers - Standard backup file) from Azure Blob storage to [Azure SQL Managed Instance](sql-managed-instance-paas-overview.md).

> [!VIDEO https://www.youtube.com/embed/RxWYojo_Y3Q]

> [!NOTE]
> For more information on migration using Azure Database Migration Service, see [SQL Managed Instance migration using Database Migration Service](../../dms/tutorial-sql-server-to-managed-instance.md).
> For more information on various migration methods, see [SQL Server migration to Azure SQL Managed Instance](migrate-to-instance-from-sql-server.md).

## Prerequisites

This quickstart:

- Uses resources from the [Create a managed instance](instance-create-quickstart.md) quickstart.
- Requires the latest version of [SSMS](https://docs.microsoft.com/sql/ssms/sql-server-management-studio-ssms) installed.
- Requires using SSMS to connect to SQL Managed Instance. See these quickstarts on how to connect:
  - [Enable a public endpoint](public-endpoint-configure.md) on SQL Managed Instance - this is the recommended approach for this tutorial.
  - [Connect to SQL Managed Instance from an Azure VM](connect-vm-instance-configure.md).
  - [Configure a point-to-site connection to SQL Managed Instance from on-premises](point-to-site-p2s-configure.md).

> [!NOTE]
> For more information on backing up and restoring a SQL Server database using Azure Blob storage and a [Shared Access Signature (SAS) key](https://docs.microsoft.com/azure/storage/common/storage-dotnet-shared-access-signature-part-1), see [SQL Server Backup to URL](https://docs.microsoft.com/sql/relational-databases/backup-restore/sql-server-backup-to-url?view=sql-server-2017).

## Restore from a backup file

In SQL Server Management Studio, follow these steps to restore the Wide World Importers database to SQL Managed Instance. The database backup file is stored in a pre-configured Azure Blob storage account.

1. Open SSMS and connect to your managed instance.
2. In **Object Explorer**, right-click your managed instance and select **New Query** to open a new query window.
3. Run the following SQL script, which uses a pre-configured storage account and SAS key to [create a credential](https://docs.microsoft.com/sql/t-sql/statements/create-credential-transact-sql) in your managed instance.

   ```sql
   CREATE CREDENTIAL [https://mitutorials.blob.core.windows.net/databases]
   WITH IDENTITY = 'SHARED ACCESS SIGNATURE'
   , SECRET = 'sv=2017-11-09&ss=bfqt&srt=sco&sp=rwdlacup&se=2028-09-06T02:52:55Z&st=2018-09-04T18:52:55Z&spr=https&sig=WOTiM%2FS4GVF%2FEEs9DGQR9Im0W%2BwndxW2CQ7%2B5fHd7Is%3D'
   ```

    ![create credential](./media/restore-sample-database-quickstart/credential.png)

4. To check your credential, run the following script, which uses a [container](https://azure.microsoft.com/services/container-instances/) URL to get a backup file list.

   ```sql
   RESTORE FILELISTONLY FROM URL =
      'https://mitutorials.blob.core.windows.net/databases/WideWorldImporters-Standard.bak'
   ```

    ![file list](./media/restore-sample-database-quickstart/file-list.png)

5. Run the following script to restore the Wide World Importers database.

   ```sql
   RESTORE DATABASE [Wide World Importers] FROM URL =
     'https://mitutorials.blob.core.windows.net/databases/WideWorldImporters-Standard.bak'
   ```

    ![restore](./media/restore-sample-database-quickstart/restore.png)

6. Run the following script to track the status of your restore.

   ```sql
   SELECT session_id as SPID, command, a.text AS Query, start_time, percent_complete
      , dateadd(second,estimated_completion_time/1000, getdate()) as estimated_completion_time
   FROM sys.dm_exec_requests r
   CROSS APPLY sys.dm_exec_sql_text(r.sql_handle) a
   WHERE r.command in ('BACKUP DATABASE','RESTORE DATABASE')
   ```

7. When the restore completes, view the database in Object Explorer. You can verify that database restore is completed using the [sys.dm_operation_status](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-operation-status-azure-sql-database) view.

> [!NOTE]
> A database restore operation is asynchronous and retryable. You might get an error in SQL Server Management Studio if the connection breaks or a time-out expires. Azure SQL Database will keep trying to restore database in the background, and you can track the progress of the restore using the [sys.dm_exec_requests](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-requests-transact-sql) and [sys.dm_operation_status](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-operation-status-azure-sql-database) views.
> In some phases of the restore process, you will see a unique identifier instead of the actual database name in the system views. Learn about `RESTORE` statement behavior differences [here](https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance-transact-sql-information#restore-statement).

## Next steps

- If, at step 5, a database restore is terminated with the message ID 22003, create a new backup file containing backup checksums and perform the restore again. See [Enable or disable backup checksums during backup or restore](https://docs.microsoft.com/sql/relational-databases/backup-restore/enable-or-disable-backup-checksums-during-backup-or-restore-sql-server).
- For troubleshooting a backup to a URL, see [SQL Server Backup to URL best practices and troubleshooting](https://docs.microsoft.com/sql/relational-databases/backup-restore/sql-server-backup-to-url-best-practices-and-troubleshooting).
- For an overview of app connection options, see [Connect your applications to SQL Managed Instance](connect-application-instance.md).
- To query using your favorite tools or languages, see [Quickstarts: Azure SQL Database connect and query](../database/connect-query-content-reference-guide.md).
