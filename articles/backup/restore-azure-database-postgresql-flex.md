---
title: Restore Azure Database for PostgreSQL -Flexible server backups (preview)
description: Learn about how to restore Azure Database for PostgreSQL -Flexible backups.
ms.topic: how-to
ms.date: 06/14/2024
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Restore Azure Database for PostgreSQL Flexible backups (preview)

This article explains how to restore an Azure PostgreSQL -flex server backed up by Azure Backup.

## Prerequisites

1. Before you restore from Azure Database for PostgreSQL Flexible server backups, ensure that you have the required [permissions for the restore operation](backup-azure-database-postgresql-flex-overview.md#permissions-for-backup).

2. Backup data is stored in the Backup vault as a blob within the Microsoft tenant. During a restore operation, the backup data is copied from one storage account to another across tenants. Ensure that the target storage account for the restore has the **AllowCrossTenantReplication** property set to **true**.

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

1. Post restoration completion to the target storage account, you can use pg_restore utility to restore an Azure Database for PostgreSQL flexible server database from the target. Use the following command to connect to an existing postgresql flexible server and an existing database

   `pg_restore -h <hostname> -U <username> -d <db name> -Fd -j <NUM>  -C  <dump directory>`

   * `-Fd`: The directory format.   
   * `-j`: The number of jobs.   
   * `-C`: Begin the output with a command to create the database itself and then reconnect to it.     

   Here's an example of how this syntax might appear:

   `pg_restore -h <hostname>  -U <username> -j <Num of parallel jobs> -Fd -C -d <databasename> sampledb_dir_format`

   If you have more than one database to restore, re-run the earlier command for each database.

   Also, by using multiple concurrent jobs **-j**, you can reduce the time it takes to restore a large database on a multi-vCore target server. The number of jobs can be equal to or less than the number of vCPUs that are allocated for the target server.
 
## Next steps

[Support matrix for PostgreSQL-Flex database backup by using Azure Backup](backup-azure-database-postgresql-flex-support-matrix.md).
