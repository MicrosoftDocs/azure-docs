---
title: Restore Azure Database for PostgreSQL -Flexible server using Azure portal
description: Learn about how to restore Azure Database for PostgreSQL -Flexible backups.
ms.topic: how-to
ms.date: 03/18/2025
ms.service: azure-backup
ms.custom:
  - ignite-2024
author: jyothisuri
ms.author: jsuri
---

# Restore Azure Database for PostgreSQL - Flexible Server using Azure portal

This article describes how to restore an Azure PostgreSQL -Flexible Server backed up using Azure portal.

## Prerequisites

Before you restore from Azure Database for PostgreSQL Flexible server backups, review the following prerequisites:

- Ensure that you have the required [permissions for the restore operation](backup-azure-database-postgresql-flex-overview.md#permissions-for-backup).

- Backup data is stored in the Backup vault as a blob within the Microsoft tenant. During a restore operation, the backup data is copied from one storage account to another across tenants. Ensure that the target storage account for the restore has the **AllowCrossTenantReplication** property set to **true**.

- Ensure the target storage account for restoring backup as a file is accessible via a public network. If the storage account uses a private endpoint, [update its public network access settings](backup-azure-database-postgresql-flex-manage.md#enable-public-network-access-for-the-database-storage-account) before executing a restore operation.

## Restore Azure PostgreSQL-Flexible database

Follow these steps:

1. Go to **Backup vault** > **Backup Instances**. Select the PostgreSQL-Flex server to be restored and select **Restore**.

   :::image type="content" source="./media/restore-azure-database-postgresql-flex/restore.png" alt-text="Screenshot showing how to restore a database.":::

   Alternatively, go to [Backup center](./backup-center-overview.md) and select **Restore**.	  
  
1. Select the point in time you would like to restore by using **Select restore point**. Change the date range by selecting **Time period**.

   :::image type="content" source="./media/restore-azure-database-postgresql/select-restore-point-inline.png" alt-text="Screenshot showing the process to select a recovery point.":::

1. Choose the target storage account and container in **Restore parameters** tab. Select **Validate** to check the restore parameters permissions before the final review and restore.

1. Once the validation is successful, select **Review + restore**.
   :::image type="content" source="./media/restore-azure-database-postgresql-flex/review-restore.png" alt-text="Screenshot showing the restore parameter process.":::

1. After final review of the parameters, select **Restore** to restore the selected PostgreSQL-Flex server backup in target storage account.
   :::image type="content" source="./media/restore-azure-database-postgresql-flex/review.png" alt-text="Screenshot showing the review process page."::: 
   
1. Submit the Restore operation and track the triggered job under **Backup jobs**.
   :::image type="content" source="./media/restore-azure-database-postgresql-flex/validate.png" alt-text="Screenshot showing the validate process page.":::

1. Once the job is finished, the backed-up data is restored into the storage account. Below are the set of files recovered in your storage account after the restore:

   - The first file is a marker or timestamp file that gives the customer the time the backup was taken at. The file cannot be restored but if opened with a text editor should tell the customer the UTC time when the backup was taken.
     
   - The Second file **_database_** is an individual database backup for database called tempdata2 taken using pg_dump. Each database has a separate file with format **– {backup_name}_database_{db_name}.sql**
     
   - The Third File **_roles**. Has roles backed up using pg_dumpall
 
   - The Fourth file **_schemas**. backed up using pg_dumpall
     
   - The Fifth file **_tablespaces**. Has the tablespaces backed up using pg_dumpall

1. Post restoration completion to the target storage account, you can use pg_restore utility to restore the database and other files to a PostgreSQL Flexible server. Use the following command to connect to an existing postgresql flexible server and an existing database

   `az storage blob download --container-name <container-name> --name <blob-name> --account-name <storage-account-name> --account-key <storage-account-key> --file - | pg_restore -h <postgres-server-url> -p <port> -U <username> -d <database-name> -v -`

   * `--account-name`: Name of the Target Storage Account.
   * `--container-name`: Name of the blob container.
   * `--blob-name`: Name of the blob.
   * `--account-key`: Storage Account Key.
   * `-Fd`: The directory format.   
   * `-j`: The number of jobs.   
   * `-C`: Begin the output with a command to create the database itself and then reconnect to it.     

   If you have more than one database to restore, re-run the earlier command for each database.

   Also, by using multiple concurrent jobs `-j`, you can reduce the time it takes to restore a large database on a multi-vCore target server. The number of jobs can be equal to or less than the number of vCPUs that are allocated for the target server.

1. To restore the other three files (roles, schema and tablespaces), use the psql utility to restore them to a PostgreSQL Flexible server.

    `az storage blob download --container-name <container-name> --name <blob-name> --account-name <storage-account-name> --account-key <storage-account-key> --file - 
     | psql -h <hostname> -U <username> -d <db name> -f <dump directory> -v -`

   Re-run the above command for each file.
 
## Next steps

[Manage backup of Azure PostgreSQL - Flexible Server using Azure portal](backup-azure-database-postgresql-flex-manage.md).
