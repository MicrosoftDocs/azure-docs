---
title: Create Recovery Services vaults
description: In this article, learn how to create Recovery Services vaults that store the backups and recovery points.
ms.reviewer: sogup
ms.topic: conceptual
ms.date: 05/30/2019
---

# Create a Recovery Services vault

A Recovery Services vault is an entity that stores the backups and recovery points created over time. The Recovery Services vault also contains the backup policies that are associated with the protected virtual machines.

To create a Recovery Services vault:

1. Sign in to your subscription in the [Azure portal](https://portal.azure.com/).

2. On the left menu, select **All services**.

    ![Select All services](./media/backup-create-rs-vault/click-all-services.png)

3. In the **All services** dialog box, enter **Recovery Services**. The list of resources filters according to your input. In the list of resources, select **Recovery Services vaults**.

    ![Enter and choose Recovery Services vaults](./media/backup-create-rs-vault/all-services.png)

    The list of Recovery Services vaults in the subscription appears.

4. On the **Recovery Services vaults** dashboard, select **Add**.

    ![Add a Recovery Services vault](./media/backup-create-rs-vault/add-button-create-vault.png)

    The **Recovery Services vault** dialog box opens. Provide values for the **Name**, **Subscription**, **Resource group**, and **Location**.

    ![Configure the Recovery Services vault](./media/backup-create-rs-vault/create-new-vault-dialog.png)

   - **Name**: Enter a friendly name to identify the vault. The name must be unique to the Azure subscription. Specify a name that has at least two, but not more than 50 characters. The name must start with a letter and consist only of letters, numbers, and hyphens.
   - **Subscription**: Choose the subscription to use. If you're a member of only one subscription, you'll see that name. If you're not sure which subscription to use, use the default (suggested) subscription. There are multiple choices only if your work or school account is associated with more than one Azure subscription.
   - **Resource group**: Use an existing resource group or create a new one. To see the list of available resource groups in your subscription, select **Use existing**, and then select a resource from the drop-down list box. To create a new resource group, select **Create new** and enter the name. For complete information about resource groups, see [Azure Resource Manager overview](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview).
   - **Location**: Select the geographic region for the vault. To create a vault to protect virtual machines, the vault **must** be in the same region as the virtual machines.

      > [!IMPORTANT]
      > If you're not sure of the location of your VM, close the dialog box. Go to the list of virtual machines in the portal. If you have virtual machines in several regions, create a Recovery Services vault in each region. Create the vault in the first location, before you create the vault for another location. There's no need to specify storage accounts to store the backup data. The Recovery Services vault and the Azure Backup service handle that automatically.
      >
      >

5. When you're ready to create the Recovery Services vault, select **Create**.

    ![Create the Recovery Services vault](./media/backup-create-rs-vault/click-create-button.png)

    It can take a while to create the Recovery Services vault. Monitor the status notifications in the **Notifications** area at the upper-right corner of the portal. After your vault is created, it's visible in the list of Recovery Services vaults. If you don't see your vault, select **Refresh**.

     ![Refresh the list of backup vaults](./media/backup-create-rs-vault/refresh-button.png)

## Set storage redundancy

Azure Backup automatically handles storage for the vault. You need to specify how that storage is replicated.

>[!NOTE]
>The Storage Replication settings for the vault are not relevant for Azure file share backup as the current solution is snapshot based and there is no data transferred to the vault. Snapshots are stored in the same storage account as the backed up file share.

1. From the **Recovery Services vaults** blade, click the new vault. Under the **Settings** section, click  **Properties**.
2. In **Properties**, under **Backup Configuration**, click **Update**.

3. Select the storage replication type, and click **Save**.

     ![Set the storage configuration for new vault](./media/backup-try-azure-backup-in-10-mins/recovery-services-vault-backup-configuration.png)

   - We recommend that if you're using Azure as a primary backup storage endpoint, continue to use the default **Geo-redundant** setting.
   - If you don't use Azure as a primary backup storage endpoint, then choose **Locally-redundant**, which reduces the Azure storage costs.
   - Learn more about [geo](../storage/common/storage-redundancy-grs.md) and [local](../storage/common/storage-redundancy-lrs.md) redundancy.

> [!NOTE]
> Changing **Storage Replication type** (Locally-redundant/ Geo-redundant) for a Recovery services vault has to be done before configuring backups in the vault. Once you configure backup, the option to modify is disabled and you cannot change the **Storage Replication type**.

## Set Cross Region Restore

As one of the restore options, Cross Region Restore (CRR) allows you to restore Azure VMs in a secondary region, which is an [Azure paired region](https://docs.microsoft.com/azure/best-practices-availability-paired-regions). This option allows you to:

- conduct drills when there's an audit or compliance requirement
- restore the VM or its disk if there's a disaster in the primary region.

To choose this feature, select **Enable Cross Region Restore** from the **Backup Configuration** blade.

For this process, there are pricing implications as it is at the storage level.

>[!NOTE]
>Before you begin:
>
>- Review the [support matrix](backup-support-matrix.md#cross-region-restore) for a list of supported managed types and regions.
>- The Cross Region Restore (CRR) feature is now previewed in all Azure public regions.
>- CRR is a vault level opt-in feature for any GRS vault (turned off by default).
>- After opting-in, it might take up to 48 hours for the backup items to be available in secondary regions.
>- Currently CRR is supported only for Backup Management Type - ARM Azure VM (classic Azure VM will not be supported).  When additional management types support CRR, then they will be **automatically** enrolled.
>- Cross Region Restore currently cannot be reverted back to GRS or LRS once the protection is initiated for the first time. 

### Configure Cross Region Restore

A vault created with GRS redundancy includes the option to configure the Cross Region Restore feature. Every GRS vault will have a banner, which will link to the documentation. To configure CRR for the vault, go to the Backup Configuration blade, which contains the option to enable this feature.

 ![Backup Configuration banner](./media/backup-azure-arm-restore-vms/banner.png)

1. From the portal, go to Recovery Services vault > Settings > Properties.
2. Click **Enable Cross Region Restore in this vault** to enable the functionality.

   ![Before you click Enable Cross Region restore in this vault](./media/backup-azure-arm-restore-vms/backup-configuration1.png)

   ![After you click Enable Cross Region restore in this vault](./media/backup-azure-arm-restore-vms/backup-configuration2.png)

Learn how to [view backup items in the secondary region](backup-azure-arm-restore-vms.md#view-backup-items-in-secondary-region).

Learn how to [restore in the secondary region](backup-azure-arm-restore-vms.md#restore-in-secondary-region).

Learn how to [monitor secondary region restore jobs](backup-azure-arm-restore-vms.md#monitoring-secondary-region-restore-jobs).

## Modifying default settings

We highly recommend you review the default settings for **Storage Replication type** and **Security settings** before configuring backups in the vault.

- **Storage Replication type** by default is set to **Geo-redundant**. Once you configure the backup, the option to modify is disabled. Follow these [steps](https://docs.microsoft.com/azure/backup/backup-create-rs-vault#set-storage-redundancy) to review and modify the settings.

- **Soft delete** by default is **Enabled** on newly created vaults to protect backup data from accidental or malicious deletes. Follow these [steps](https://docs.microsoft.com/azure/backup/backup-azure-security-feature-cloud#enabling-and-disabling-soft-delete) to review and modify the settings.

## Next steps

[Learn about](backup-azure-recovery-services-vault-overview.md) Recovery Services vaults.
[Learn about](backup-azure-delete-vault.md) Delete Recovery Services vaults.
