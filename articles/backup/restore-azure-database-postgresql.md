---
title: Restore Azure Database for PostgreSQL 
description: Learn about how to restore Azure Database for PostgreSQL backups.
ms.topic: how-to
ms.date: 01/21/2022
ms.custom: devx-track-azurecli
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Restore Azure Database for PostgreSQL backups

This article explains how to restore a database to an Azure PostgreSQL server backed up by Azure Backup.

You can restore a database to any Azure PostgreSQL server of a different/same subscription but within the same region of the vault, if the service has the appropriate [set of permissions](backup-azure-database-postgresql-overview.md#azure-backup-authentication-with-the-postgresql-server) on the target server.

## Restore Azure PostgreSQL database

1. Go to **Backup vault** -> **Backup Instances**. Select a database and click **Restore**.

   :::image type="content" source="./media/restore-azure-database-postgresql/select-database-for-restore-inline.png" alt-text="Screenshot showing the process to select and restore a database." lightbox="./media/restore-azure-database-postgresql/select-database-for-restore-expanded.png":::

   Alternatively, you can navigate to this page from the [Backup center](./backup-center-overview.md).	  
  
1. On the **Select restore point** page, select a recovery point from the list of all full backups available for the selected backup instance. By default, the latest recovery point is selected.

   :::image type="content" source="./media/restore-azure-database-postgresql/select-restore-point-inline.png" alt-text="Screenshot showing the process to select a recovery point." lightbox="./media/restore-azure-database-postgresql/select-restore-point-expanded.png":::

   If the restore point is in the archive tier, you must rehydrate the recovery point before restoring. Provide the following additional parameters required for rehydration:

   - **Rehydration priority**: Default is **Standard**.
   - **Rehydration duration**: The maximum rehydration duration is 30 days, and the minimum rehydration duration is 10 days. Default value is **15 days**. The recovery point is stored in the **Backup data store** for this duration.

1. On the **Restore parameters** page, select one of the following restore types: **Restore as Database** or **Restore as Files**.

   - **Restore as Database**

     The target server can be same as the source server. However, overwriting the original database isn't supported. You can choose from the server across all subscriptions, but in the same region as that of the vault.

     1. In the **Select key vault and the secret** drop-down list, select a vault that stores the credentials to connect to the target server.

     1. Select **Review + Restore** to trigger validation to check if the service has [restore permissions on the target server](backup-azure-database-postgresql-overview.md#set-of-permissions-needed-for-azure-postgresql-database-restore). These permissions must be [granted manually](backup-azure-database-postgresql-overview.md#grant-access-on-the-azure-postgresql-server-and-key-vault-manually).

     :::image type="content" source="./media/restore-azure-database-postgresql/restore-as-database-inline.png" alt-text="Screenshot showing the selected restore type as Restore as Database." lightbox="./media/restore-azure-database-postgresql/restore-as-database-expanded.png":::

> [!IMPORTANT]
> The DB user whose credentials were chosen via the key vault will have all the privileges over the restored database and any existing DB user boundaries will be overridden. For eg: If the backed up database had any DB user specific permissions/constraints such as DB user A can access few tables, and DB user B can access few other tables, such permissions will not be preserved after restore. If you want to preserve those permissions, use restore as files and use the pg_restore command with the relevant switch.

   - **Restore as Files: Dump the backup files to the target storage account (blobs).**

     You can choose from the storage accounts across all subscriptions, but in the same region as that of the vault.     

     1. In the **Select the target container** drop-down list, select one of the containers filtered for the selected storage account.
     1. Select **Review + Restore** to trigger validation to check if the backup service has the [restore permissions on the target storage account](#restore-permissions-on-the-target-storage-account).

     :::image type="content" source="./media/restore-azure-database-postgresql/restore-as-files-inline.png" alt-text="Screenshot showing the selected restore type as Restore as Files." lightbox="./media/restore-azure-database-postgresql/restore-as-files-expanded.png":::
   
1. Submit the Restore operation and track the triggered job under **Backup jobs**.
   
   :::image type="content" source="./media/restore-azure-database-postgresql/track-triggered-job-inline.png" alt-text="Screenshot showing the tracked triggered job under Backup jobs." lightbox="./media/restore-azure-database-postgresql/track-triggered-job-expanded.png":::

>[!NOTE]
>Archive support for Azure Database for PostgreSQL is in limited public preview.

## Restore permissions on the target storage account

Assign the Backup vault MSI the permission to access the storage account containers using the Azure portal.

1. Go to **Storage Account** -> **Access Control** -> **Add role assignment**.

1. Select the **Storage Blob Data Contributor** role in the **Role** drop-down list to the Backup vault MSI.

   :::image type="content" source="./media/restore-azure-database-postgresql/assign-vault-msi-permission-to-access-storage-account-containers-azure-portal-inline.png" alt-text="Screenshot showing the process to assign Backup vault M S I the permission to access the storage account containers using the Azure portal." lightbox="./media/restore-azure-database-postgresql/assign-vault-msi-permission-to-access-storage-account-containers-azure-portal-expanded.png":::

Alternatively, give granular permissions to the specific container you're restoring to by using the Azure CLI [az role assignment](/cli/azure/role/assignment) create command.

```azurecli
az role assignment create --assignee $VaultMSI_AppId  --role "Storage Blob Data Contributor"   --scope $id
```
Replace the assignee parameter with the _Application ID_ of the vault's MSI and the scope parameter to refer to your specific container. To get the **Application ID** of the vault MSI, select **All applications** under **Application type**. Search for the vault name and copy the Application ID.

 :::image type="content" source="./media/restore-azure-database-postgresql/select-application-type-for-id-inline.png" alt-text="Screenshot showing the process to get the Application I D of the vault MSI." lightbox="./media/restore-azure-database-postgresql/select-application-type-for-id-expanded.png":::

 :::image type="content" source="./media/restore-azure-database-postgresql/copy-vault-id-inline.png" alt-text="Screenshot showing the process to copy  the Application I D of the vault." lightbox="./media/restore-azure-database-postgresql/copy-vault-id-expanded.png":::
 
## Next steps

[Troubleshoot PostgreSQL database backup by using Azure Backup](backup-azure-database-postgresql-troubleshoot.md)