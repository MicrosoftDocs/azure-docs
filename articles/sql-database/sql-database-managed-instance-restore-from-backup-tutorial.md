---
title: 'Restore a backup to Azure SQL Database Managed Instance | Microsoft Docs'
description: Restore a database backup to an Azure SQL Database Managed Instance using SSMS.
keywords: sql database tutorial, sql database managed instance, restore a backup
services: sql-database
author: bonova
ms.reviewer: carlrab, srbozovi
ms.service: sql-database
ms.custom: managed instance
ms.topic: tutorial
ms.date: 07/06/2018
ms.author: bonova
manager: craigg

---
# Restore a database backup to an Azure SQL Database Managed Instance

This tutorial demonstrates how to restore a backup of a database stored in Azure blob storage into the Managed Instance using the Wide World Importers - Standard backup file. This method requires some downtime. For a tutorial using the Azure Database Migration Service (DMS) for migration, see [Managed Instance migration using DMS](../dms/tutorial-sql-server-to-managed-instance.md). For a discussion of the varous migration methods, see [SQL Server instance migration to Azure SQL Database Managed Instance](sql-database-managed-instance-migrate.md).

> [!div class="checklist"]
> * Download the Wide World Importers - Standard backup file
> * Create Azure storage account and upload backup file
> * Restore the Wide World Importers database from a backup file

## Prerequisites

This tutorial uses as its starting point the resources created in this tutorial: [Create an Azure SQL Database Managed Instance](sql-database-managed-instance-create-tutorial-portal.md).

## Download the Wide World Importers - Standard backup file

Use the following steps to download the Wide World Importers - Standard backup file.

Using Internet Explorer, enter https://github.com/Microsoft/sql-server-samples/releases/download/wide-world-importers-v1.0/WideWorldImporters-Standard.bak in the URL address box and then, when prompted, click **Save** to save this file in the **Downloads** folder.

## Log in to the Azure portal

Log in to the [Azure portal](https://portal.azure.com/#create/Microsoft.SQLManagedInstance).

## Create Azure storage account and upload backup file

1. Click **Create a resource** in the upper left-hand corner of the Azure portal.
2. Locate **Storage** and then click **Storage Account** to open the storage account form.

   ![storage account](./media/sql-database-managed-instance-tutorial/storage-account.png)

3. Fill out the storage account form with the requested information, using the information in the following table:

   | Setting| Suggested value | Description |
   | ------ | --------------- | ----------- |
   |**Name**|Any valid name|For valid names, see [Naming rules and restrictions](https://docs.microsoft.com/azure/architecture/best-practices/naming-conventions).|
   |**Deployment model**|Resource model||
   |**Account kind**|Blob storage||
   |**Performance**|Standard or premium|Magnetic drives or SSDs|
   |**Replication**|Locally redundant storage||
   |**Access tier (default)|Cool or hot||
   |**Secure transfer required**|Disabled||
   |**Subscription**|Your subscription|For details about your subscriptions, see [Subscriptions](https://account.windowsazure.com/Subscriptions).|
   |**Resource group**|The resource group that you created earlier|| 
   |**Location**|The location that you previously selected||
   |**Virtual networks**|Disabled||

4. Click **Create**.

   ![storage account details](./media/sql-database-managed-instance-tutorial/storage-account-details.png)

5. After the storage account deployment succeeds, open your new storage account.
6. Under **Settings**, click **Shared Access Signature** to open the Shared access signature (SAS) form.

   ![sas form](./media/sql-database-managed-instance-tutorial/sas-form.png)

7. On the SAS form, modify the default values as desired. Notice that the expiry date/time is, by default, only 8 hours.
8. Click **Generate SAS**.

   ![sas form completed](./media/sql-database-managed-instance-tutorial/sas-generate.png)

9. Copy and save the **SAS token** and the **Blob server SAS URL**.
10. Under **Settings**, click **Containers**.

    ![containers](./media/sql-database-managed-instance-tutorial/containers.png)

11. Click **+ Container** to create a container to hold your backup file.
12. Fill out the container form with the requested information, using the information in the following table:

    | Setting| Suggested value | Description |
   | ------ | --------------- | ----------- |
   |**Name**|Any valid name|For valid names, see [Naming rules and restrictions](https://docs.microsoft.com/azure/architecture/best-practices/naming-conventions).|
   |**Public access level**|Private (no anonymous access)||

    ![container detail](./media/sql-database-managed-instance-tutorial/container-detail.png)

13. Click **OK**.
14. After the container has been created, open the container.

    ![container](./media/sql-database-managed-instance-tutorial/container.png)

15. Click **Container properties** and then copy the URL to the container.

    ![container URL](./media/sql-database-managed-instance-tutorial/container-url.png)

16. Click **Upload** to open the **Upload blob** form.

    ![upload](./media/sql-database-managed-instance-tutorial/upload.png)

17. Browse to your download folder and select the **WideWorldIimporters-Standard.bak** file.

    ![upload](./media/sql-database-managed-instance-tutorial/upload-bak.png)

18. Click **Upload**.
19. Do not continue until the upload is complete.

    ![upload complete](./media/sql-database-managed-instance-tutorial/upload-complete.png)


## Restore the Wide World Importers database from a backup file

With SSMS, use the following steps to restore the Wide World Importers database to your Managed Instance from the backup file.

1. In SSMS, open a new query window.
2. Use the following script to create a SAS credential - providing the URL for the storage account container and the SAS key as indicated.

   ```sql
   CREATE CREDENTIAL [https://<storage_account_name>.blob.core.windows.net/<container>] 
      WITH IDENTITY = 'SHARED ACCESS SIGNATURE'
      , SECRET = '<shared_access_signature_key_with_removed_first_?_symbol>' 
   ```

    ![credential](./media/sql-database-managed-instance-tutorial/credential.png)

3. Use the following script to create check the SAS credential and backup validity - providing the URL for the container with the backup file:

   ```sql
   RESTORE FILELISTONLY FROM URL = 
      'https://<storage_account_name>.blob.core.windows.net/<container>/WideWorldImporters-Standard.bak'
   ```

    ![file list](./media/sql-database-managed-instance-tutorial/file-list.png)

4. Use the following script to restore the Wide World Importers database from a backup file - providing the URL for the container with the backup file:

   ```sql
   RESTORE DATABASE [Wide World Importers] FROM URL =
     'https://<storage_account_name>.blob.core.windows.net/<container>/WideWorldImporters-Standard.bak'`
   ```

    ![restore executing](./media/sql-database-managed-instance-tutorial/restore-executing.png)

5. To track the status of your restore, run the following query in a new query session:

   ```sql
   SELECT session_id as SPID, command, a.text AS Query, start_time, percent_complete
      , dateadd(second,estimated_completion_time/1000, getdate()) as estimated_completion_time 
   FROM sys.dm_exec_requests r 
   CROSS APPLY sys.dm_exec_sql_text(r.sql_handle) a 
   WHERE r.command in ('BACKUP DATABASE','RESTORE DATABASE')`
   ```

    ![restore percent complete](./media/sql-database-managed-instance-tutorial/restore-percent-complete.png)

6. When the restore completes, view it in Object Explorer. 

    ![restore complete](./media/sql-database-managed-instance-tutorial/restore-complete.png)

## Next steps

In this tutorial, you learned to restore a backup of a database stored in Azure blob storage into the Managed Instance using the Wide World Importers - Standard backup file. You learned how to: 

> [!div class="checklist"]
> * Download the Wide World Importers - Standard backup file
> * Create Azure storage account and upload backup file
> * Restore the Wide World Importers database from a backup file

Advance to the next tutorial to learn how to migrate SQL Server to Azure SQL Database Managed Instance using DMS.

> [!div class="nextstepaction"]
>[Migrate SQL Server to Azure SQL Database Managed Instance using DMS](../dms/tutorial-sql-server-to-managed-instance.md)
