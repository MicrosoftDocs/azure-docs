---
title: Restore Azure Database for PostgreSQL by Using the Azure Portal
description: Learn about how to restore Azure Database for PostgreSQL backups.
ms.topic: how-to
ms.date: 05/20/2025
ms.custom:
  - devx-track-azurecli
  - build-2025
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
# Customer intent: "As a database administrator, I want to restore backups of Azure Database for PostgreSQL using the Azure portal, so that I can quickly recover data and maintain service continuity in case of data loss."
---

# Restore Azure Database for PostgreSQL backups by using the Azure portal

This article describes how to restore a database to an Azure Database for PostgreSQL server that you backed up by using Azure portal.  You can also restore a PostgreSQL database using [Azure PowerShell](restore-postgresql-database-ps.md), [Azure CLI](restore-postgresql-database-cli.md), and [REST API](restore-postgresql-database-use-rest-api.md).

You can restore a database to any Azure Database for PostgreSQL server of a different subscription or the same subscription but within the same region of the vault, if the service has the appropriate [set of permissions](backup-azure-database-postgresql-overview.md#azure-backup-authentication-with-the-azure-database-for-postgresql-server) on the target server.

## <a name = "restore-azure-postgresql-database"></a>Restore a PostgreSQL database

1. In the [Azure portal](https://portal.azure.com/), go to **Backup vault** > **Backup Instances**. Select a database, and then select **Restore**.

   :::image type="content" source="./media/restore-azure-database-postgresql/select-database-for-restore-inline.png" alt-text="Screenshot that shows details for a backup instance." lightbox="./media/restore-azure-database-postgresql/select-database-for-restore-expanded.png":::

   Alternatively, you can go to this page from the [Backup center](./backup-center-overview.md).
  
1. On the **Select restore point** tab, select a recovery point from the list of all full backups available for the selected backup instance. By default, the latest recovery point is selected.

   :::image type="content" source="./media/restore-azure-database-postgresql/select-restore-point-inline.png" alt-text="Screenshot that shows the tab for selecting a recovery point." lightbox="./media/restore-azure-database-postgresql/select-restore-point-expanded.png":::

   If the restore point is in the archive tier, you must rehydrate the recovery point before restoring. Provide the following additional parameters required for rehydration:

   - **Rehydration priority**: The default is **Standard**.
   - **Rehydration duration**: The maximum rehydration duration is 30 days, and the minimum rehydration duration is 10 days. The default value is **15 days**. The recovery point is stored in the backup datastore for this duration.

   > [!NOTE]
   > Archive support for Azure Database for PostgreSQL is in limited preview.

1. On the **Restore parameters** tab, select one of the following restore types:

   - **Restore as Database**: The target server can be the same as the source server. However, overwriting the original database isn't supported. You can choose from the servers across all subscriptions but in the same region as that of the vault.

     1. For **Select key vault to authenticate with target server**, select a vault that stores the credentials to connect to the target server.

     1. Select **Review and restore** to trigger validation that checks if the service has [restore permissions on the target server](backup-azure-database-postgresql-overview.md#permissions-needed-for-postgresql-database-restore). These permissions must be [granted manually](backup-azure-database-postgresql-overview.md#steps-for-manually-granting-access-on-the-azure-database-for-postgresql-server-and-on-the-key-vault).

     :::image type="content" source="./media/restore-azure-database-postgresql/restore-as-database-inline.png" alt-text="Screenshot that shows the selected option to restore as a database." lightbox="./media/restore-azure-database-postgresql/restore-as-database-expanded.png":::

     > [!IMPORTANT]
     > The database user whose credentials were chosen via the key vault has all the privileges over the restored database. Any existing database user boundaries are overridden.
     >
     > If the backed-up database had any user-specific permissions or constraints (for example, one database user can access a few tables, and another database user can access a few other tables), such permissions aren't preserved after the restore. If you want to preserve those permissions, use **Restore as Files**, and use the `pg_restore` command with the relevant switch.

   - **Restore as Files**: You can choose from the storage accounts across all subscriptions but in the same region as that of the vault.

     1. In the **Target Container** dropdown list, select one of the containers filtered for the selected storage account.
     1. Select **Review + Restore** to trigger validation that checks if the backup service has the [restore permissions on the target storage account](#restore-permissions-on-the-target-storage-account).

     :::image type="content" source="./media/restore-azure-database-postgresql/restore-as-files-inline.png" alt-text="Screenshot that shows the selected option to restore as files." lightbox="./media/restore-azure-database-postgresql/restore-as-files-expanded.png":::

1. Submit the restore operation, and then track the triggered job on the **Backup jobs** pane.

   :::image type="content" source="./media/restore-azure-database-postgresql/track-triggered-job-inline.png" alt-text="Screenshot that shows a tracked triggered job on the pane for backup jobs." lightbox="./media/restore-azure-database-postgresql/track-triggered-job-expanded.png":::

## Restore permissions on the target storage account

To assign the Backup vault's managed identity permission to access the storage account containers, follow these steps:

1. In the Azure portal, go to **Storage Account** > **Access Control (IAM)**, and then select **Add**.

1. On the **Add role assignment** pane, in the **Role** dropdown list, select the **Storage Blob Data Contributor** role for the Backup vault's managed identity.

   :::image type="content" source="./media/restore-azure-database-postgresql/assign-vault-msi-permission-to-access-storage-account-containers-azure-portal-inline.png" alt-text="Screenshot that shows selections for adding a role assignment in the Azure portal." lightbox="./media/restore-azure-database-postgresql/assign-vault-msi-permission-to-access-storage-account-containers-azure-portal-expanded.png":::

Alternatively, give granular permissions to the specific container that you're restoring to by using the Azure CLI [az role assignment create](/cli/azure/role/assignment) command:

```azurecli
az role assignment create --assignee $VaultMSI_AppId  --role "Storage Blob Data Contributor"   --scope $id
```

Replace the `assignee` parameter's value with the application ID of the vault's managed identity. For the value of the `scope` parameter, refer to your specific container. To get the application ID of the vault's managed identity, select **All applications** under **Application type**. Search for the vault name and copy the **Application ID** value.

:::image type="content" source="./media/restore-azure-database-postgresql/select-application-type-for-id-inline.png" alt-text="Screenshot that shows selections to get the application ID of a Backup vault's managed service identity." lightbox="./media/restore-azure-database-postgresql/select-application-type-for-id-expanded.png":::

:::image type="content" source="./media/restore-azure-database-postgresql/copy-vault-id-inline.png" alt-text="Screenshot that shows the process to copy the application ID of the vault." lightbox="./media/restore-azure-database-postgresql/copy-vault-id-expanded.png":::

## Restore databases across regions

You can use the **Cross Region Restore** option to restore Azure Database for PostgreSQL servers in a secondary region that's an Azure-paired region.

Before you start using **Cross Region Restore**, read [these important considerations](create-manage-backup-vault.md#before-you-start). To check if the feature is enabled, see [Configure Cross Region Restore](manage-backup-vault.md#perform-cross-region-restore-using-azure-portal).

### View backup instances in a secondary region

If **Cross Region Restore** is enabled, you can view the backup instances in a secondary region:

1. In the Azure portal, go to **Backup Vault** > **Backup Instances**.

1. Select the filter as **Instance Region == Secondary Region**.

:::image type="content" source="./media/create-manage-backup-vault/select-secondary-region-as-instance-region.png" alt-text="Screenshot that shows the selection of a secondary region as the instance region." lightbox="./media/create-manage-backup-vault/select-secondary-region-as-instance-region.png":::

> [!NOTE]
> Only backup management types that support the **Cross Region Restore** feature are listed. Currently, only the restoration of primary region data to a secondary region is supported for Azure Database for PostgreSQL servers.

### Restore in a secondary region

The experience of restoring in a secondary region is similar to the experience of restoring in a primary region.  

When you're configuring details on the **Restore Configuration** pane to configure your restore, you're prompted to provide only secondary region parameters. A vault should already exist in the secondary region, and the Azure Database for PostgreSQL server should be registered to the vault in the secondary region.

Follow these steps:

1. Select **Backup Instance name** to view details.

1. Select **Restore to secondary region**.

   :::image type="content" source="./media/create-manage-backup-vault/restore-to-secondary-region.png" alt-text="Screenshot that shows the button on the action menu for restoring to a secondary region." lightbox="./media/create-manage-backup-vault/restore-to-secondary-region.png":::

1. Select the restore point, the region, and the resource group.

1. Select **Restore**.

> [!NOTE]
>
> - After the restore is triggered in the data transfer phase, the restore job can't be canceled.
> - The role/access levels required to perform restore operations in cross-regions are the **Backup Operator** role in the subscription and **Contributor (write)** access on the source and target virtual machines. To view backup jobs, **Backup reader** is the minimum permission required in the subscription.
> - The recovery point objective (RPO) for the backup data to be available in the secondary region is 12 hours. When you turn on **Cross Region Restore**, the RPO for the secondary region is 12 hours + log frequency duration. The log frequency duration can be set to a minimum of 15 minutes.

### Monitor restore jobs in a secondary region

1. In the Azure portal, go to **Monitoring + reporting** > **Backup jobs**.

1. Filter **Instance Region** for **Secondary Region** to view the jobs in the secondary region.

:::image type="content" source="./media/create-manage-backup-vault/view-jobs-in-secondary-region.png" alt-text="Screenshot that shows selections for viewing jobs in a secondary region." lightbox="./media/create-manage-backup-vault/view-jobs-in-secondary-region.png":::

## Related content

- [Troubleshoot PostgreSQL database backup by using Azure Backup](backup-azure-database-postgresql-troubleshoot.md)
