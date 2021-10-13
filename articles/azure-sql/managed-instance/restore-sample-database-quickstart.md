---
title: "Quickstart: Restore a backup (SSMS)"
titleSuffix: Azure SQL Managed Instance 
description: In this quickstart, learn to restore a database backup to Azure SQL Managed Instance using SQL Server Management Studio (SSMS). 
services: sql-database
ms.service: sql-managed-instance
ms.subservice: backup-restore
ms.custom: 
ms.devlang: 
ms.topic: quickstart
author: misliplavo 
ms.author: mlazic
ms.reviewer: mathoma
ms.date: 09/13/2021
---
# Quickstart: Restore a database to Azure SQL Managed Instance with SSMS
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

In this quickstart, you'll use SQL Server Management Studio (SSMS) to restore a database (the Wide World Importers - Standard backup file) from Azure Blob storage to [Azure SQL Managed Instance](sql-managed-instance-paas-overview.md).

> [!VIDEO https://www.youtube.com/embed/RxWYojo_Y3Q]

> [!NOTE]
> For more information on migration using Azure Database Migration Service, see [Tutorial: Migrate SQL Server to an Azure Managed Instance using Database Migration Service](../../dms/tutorial-sql-server-to-managed-instance.md).
> For more information on various migration methods, see [SQL Server to Azure SQL Managed Instance Guide](../migration-guides/managed-instance/sql-server-to-managed-instance-guide.md).

## Prerequisites

This quickstart:

- Uses resources from the [Create a managed instance](instance-create-quickstart.md) quickstart.
- Requires the latest version of [SSMS](/sql/ssms/sql-server-management-studio-ssms) installed.
- Requires using SSMS to connect to SQL Managed Instance. See these quickstarts on how to connect:
  - [Enable a public endpoint](public-endpoint-configure.md) on SQL Managed Instance - this is the recommended approach for this tutorial.
  - [Connect to SQL Managed Instance from an Azure VM](connect-vm-instance-configure.md).
  - [Configure a point-to-site connection to SQL Managed Instance from on-premises](point-to-site-p2s-configure.md).

> [!NOTE]
> For more information on backing up and restoring a SQL Server database using Azure Blob storage and a [Shared Access Signature (SAS) key](../../storage/common/storage-sas-overview.md), see [SQL Server Backup to URL](/sql/relational-databases/backup-restore/sql-server-backup-to-url).

## Restore from a backup file using the restore wizard

In SSMS, follow these steps to restore the Wide World Importers database to SQL Managed Instance by using the restore wizard. The database backup file is stored in a pre-configured Azure Blob Storage account.

1. Open SSMS and connect to your managed instance.
2. In **Object Explorer**, right-click the databases of your managed instance and select **Restore Database** to open the restore wizard.

    ![Screenshot that shows opening the restore wizard.](./media/restore-sample-database-quickstart/restore-wizard-start.png)

3. In the new restore wizard, select the ellipsis (**...**) to select the source of the backup file to use.

    ![Screenshot that shows opening a new restore wizard window.](./media/restore-sample-database-quickstart/new-restore-wizard.png)

4. In **Select backup devices**, select **Add**. In **Backup media type**, **URL** is the only option because it is the only source type supported. Select **OK**.

    ![Screenshot that shows selecting the device.](./media/restore-sample-database-quickstart/restore-wizard-select-device.png)

5. In **Select a Backup File Location**, you can choose from three options to provide information about backup files are located:
    - Select a pre-registered storage container from the dropdown.
    - Enter a new storage container and a shared access signature. (A new SQL credential will be registered for you.) 
    - Select **Add** to browse more storage containers from your Azure subscription.

    ![Screenshot that shows selecting the backup file location.](./media/restore-sample-database-quickstart/restore-wizard-backup-file-location.png)

    Complete the next steps if you select the **Add** button. If you use a different method to provide the backup file location, go to step 12.
6. In **Connect to a Microsoft Subscription**, select **Sign in** to sign in to your Azure subscription:

    ![Screenshot that shows Azure subscription sign-in.](./media/restore-sample-database-quickstart/restore-wizard-connect-subscription-sign-in.png)

7. Sign in to your Microsoft Account to initiate the session in Azure:

    ![Screenshot that shows signing in to the Azure session.](./media/restore-sample-database-quickstart/restore-wizard-sign-in-session.png)

8. Select the subscription where the storage account with the backup files is located:

    ![Screenshot that shows selecting the subscription.](./media/restore-sample-database-quickstart/restore-wizard-select-subscription.png)

9. Select the storage account where the backup files are located:

    ![Screenshot that shows the storage account.](./media/restore-sample-database-quickstart/restore-wizard-select-storage-account.png)

10. Select the blob container where the backup files are located:

    ![Select Blob container](./media/restore-sample-database-quickstart/restore-wizard-select-container.png)

11. Specify the expiration date of the shared access policy and select **Create Credential**. A shared access signature with the correct permissions is created. Select **OK**.

    ![Screenshot that shows generating the shared access signature.](./media/restore-sample-database-quickstart/restore-wizard-generate-shared-access-signature.png)

12. In the left pane, expand the folder structure to show the folder where the backup files are located. Select all the backup files that are related to the backup set to be restored, and then select **OK**:

    ![Screenshot that shows the backup file selection.](./media/restore-sample-database-quickstart/restore-wizard-backup-file-selection.png)

    SSMS validates the backup set. The process takes up to a few seconds depending on the size of the backup set.

13. If the backup is validated, specify the destination database name or leave the database name of the backup set, and then select **OK**:

    ![Screenshot that shows starting the restore.](./media/restore-sample-database-quickstart/restore-wizard-start-restore.png)

    The restore starts. The duration depends on the size of the backup set.

    ![Screenshot that shows running the restore.](./media/restore-sample-database-quickstart/restore-wizard-running-restore.png)

14. When the restore finishes, a dialog shows that it was successful. Select **OK**.

    ![Screenshot that shows the finished restore.](./media/restore-sample-database-quickstart/restore-wizard-finish-restore.png)

15. Check the restored database in Object Explorer:

    ![Screenshot that shows the restored database.](./media/restore-sample-database-quickstart/restore-wizard-restored-database.png)


## Restore from a backup file using T-SQL

In SQL Server Management Studio, follow these steps to restore the Wide World Importers database to SQL Managed Instance. The database backup file is stored in a pre-configured Azure Blob storage account.

1. Open SSMS and connect to your managed instance.
2. In **Object Explorer**, right-click your managed instance and select **New Query** to open a new query window.
3. Run the following SQL script, which uses a pre-configured storage account and SAS key to [create a credential](/sql/t-sql/statements/create-credential-transact-sql) in your managed instance.
 
   > [!IMPORTANT]
   > `CREDENTIAL` must match the container path, begin with `https`, and can't contain a trailing forward slash. `IDENTITY` must be `SHARED ACCESS SIGNATURE`. `SECRET` must be the Shared Access Signature token and can't contain a leading `?`.

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

    ![Screenshot shows the script running in Object Explorer with a success message.](./media/restore-sample-database-quickstart/restore.png)

6. Run the following script to track the status of your restore.

   ```sql
   SELECT session_id as SPID, command, a.text AS Query, start_time, percent_complete
      , dateadd(second,estimated_completion_time/1000, getdate()) as estimated_completion_time
   FROM sys.dm_exec_requests r
   CROSS APPLY sys.dm_exec_sql_text(r.sql_handle) a
   WHERE r.command in ('BACKUP DATABASE','RESTORE DATABASE')
   ```

7. When the restore completes, view the database in Object Explorer. You can verify that database restore is completed using the [sys.dm_operation_status](/sql/relational-databases/system-dynamic-management-views/sys-dm-operation-status-azure-sql-database) view.

> [!NOTE]
> A database restore operation is asynchronous and retryable. You might get an error in SQL Server Management Studio if the connection breaks or a time-out expires. Azure SQL Managed Instance will keep trying to restore database in the background, and you can track the progress of the restore using the [sys.dm_exec_requests](/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-requests-transact-sql) and [sys.dm_operation_status](/sql/relational-databases/system-dynamic-management-views/sys-dm-operation-status-azure-sql-database) views.
> In some phases of the restore process, you will see a unique identifier instead of the actual database name in the system views. Learn about `RESTORE` statement behavior differences [here](./transact-sql-tsql-differences-sql-server.md#restore-statement).

## Next steps

- If, at step 5, a database restore is terminated with the message ID 22003, create a new backup file containing backup checksums and perform the restore again. See [Enable or disable backup checksums during backup or restore](/sql/relational-databases/backup-restore/enable-or-disable-backup-checksums-during-backup-or-restore-sql-server).
- For troubleshooting a backup to a URL, see [SQL Server Backup to URL best practices and troubleshooting](/sql/relational-databases/backup-restore/sql-server-backup-to-url-best-practices-and-troubleshooting).
- For an overview of app connection options, see [Connect your applications to SQL Managed Instance](connect-application-instance.md).
- To query using your favorite tools or languages, see [Quickstarts: Azure SQL Database connect and query](../database/connect-query-content-reference-guide.md).
