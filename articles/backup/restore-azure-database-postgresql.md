---
title: Restore Azure Database for PostgreSQL 
description: Learn about how to restore Azure Database for PostgreSQL backups.
ms.topic: how-to
ms.date: 02/01/2024
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

 :::image type="content" source="./media/restore-azure-database-postgresql/select-application-type-for-id-inline.png" alt-text="Screenshot showing the process to get the Application ID of the vault MSI." lightbox="./media/restore-azure-database-postgresql/select-application-type-for-id-expanded.png":::

 :::image type="content" source="./media/restore-azure-database-postgresql/copy-vault-id-inline.png" alt-text="Screenshot showing the process to copy  the Application ID of the vault." lightbox="./media/restore-azure-database-postgresql/copy-vault-id-expanded.png":::
 
## Restore databases across regions

As one of the restore options, Cross Region Restore (CRR) allows you to restore Azure Database for PostgreSQL servers in a secondary region, which is an Azure-paired region.

### Considerations

- To begin using the feature, read the [Before you start](create-manage-backup-vault.md#before-you-start) section.
- To check if Cross Region Restore is enabled, see the [Configure Cross Region Restore](create-manage-backup-vault.md#perform-cross-region-restore-using-azure-portal) section.


### View backup instances in secondary region

If CRR is enabled, you can view the backup instances in the secondary region.

1. From the [Azure portal](https://portal.azure.com/), go to **Backup Vault** > **Backup Instances**.
1. Select the filter as **Instance Region == Secondary Region**.


    :::image type="content" source="./media/create-manage-backup-vault/select-secondary-region-as-instance-region.png" alt-text="Screenshot showing the selection of the secondary region as the instance region." lightbox="./media/create-manage-backup-vault/select-secondary-region-as-instance-region.png":::

    >[!Note]
    > Only Backup Management Types supporting the CRR feature are listed. Currently, the restoration of primary region data to a secondary region for PostgreSQL servers is only supported.


### Restore in secondary region

The secondary region restore experience is similar to the primary region restore.  

When configuring details in the **Restore Configuration** pane to configure your restore, you’re prompted to provide only secondary region parameters. So, a vault should already exist in the secondary region and the PostgreSQL server should be registered to the vault in the secondary region. 

Follow these steps: 


1.	Select **Backup Instance name** to view details.
2.	Select **Restore to secondary region**.

    :::image type="content" source="./media/create-manage-backup-vault/restore-to-secondary-region.png" alt-text="Screenshot showing how to restore to secondary region." lightbox="./media/create-manage-backup-vault/restore-to-secondary-region.png":::

1. Select the restore point, the region, and the resource group. 
1. Select **Restore**. 
    >[!Note]
    > - After the restore is triggered in the data transfer phase, the restore job can't be canceled.
    > - The role/access level required to perform restore operation in cross-regions are *Backup Operator* role in the subscription and *Contributor (write)* access on the source and target virtual machines. To view backup jobs, *Backup reader* is the minimum permission required in the subscription.
    > - The RPO for the backup data to be available in secondary region is 12 hours. Therefore, when you turn on CRR, the RPO for the secondary region is 12 hours + log frequency duration (that can be set to a minimum of 15 minutes).


### Monitoring secondary region restore jobs

1.	In the Azure portal, go to **Monitoring + Reporting** > **Backup Jobs**.
2.	Filter Instance Region for **Secondary Region** to view the jobs in the secondary region.

    :::image type="content" source="./media/create-manage-backup-vault/view-jobs-in-secondary-region.png" alt-text="Screenshot showing how to view jobs in secondary region." lightbox="./media/create-manage-backup-vault/view-jobs-in-secondary-region.png":::


## Next steps

[Troubleshoot PostgreSQL database backup by using Azure Backup](backup-azure-database-postgresql-troubleshoot.md)