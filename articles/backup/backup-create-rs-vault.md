---
title: Create and configure Recovery Services vaults
description: In this article, learn how to create and configure Recovery Services vaults that store the backups and recovery points. Learn how to use Cross Region Restore to restore in a secondary region.
ms.topic: conceptual
ms.date: 04/14/2021
ms.custom: references_regions 
---

# Create and configure a Recovery Services vault

[!INCLUDE [How to create a Recovery Services vault](../../includes/backup-create-rs-vault.md)]

## Set storage redundancy

Azure Backup automatically handles storage for the vault. You need to specify how that storage is replicated.

> [!NOTE]
> Changing **Storage Replication type** (Locally redundant/ Geo-redundant) for a Recovery Services vault has to be done before configuring backups in the vault. Once you configure backup, the option to modify is disabled.
>
>- If you haven't yet configured the backup, then [follow these steps](#set-storage-redundancy) to review and modify the settings.
>- If you've already configured the backup and must move from GRS to LRS, then [review these workarounds](#how-to-change-from-grs-to-lrs-after-configuring-backup).

1. From the **Recovery Services vaults** pane, select the new vault. Under the **Settings** section, select  **Properties**.
1. In **Properties**, under **Backup Configuration**, select **Update**.

1. Select the storage replication type, and select **Save**.

     ![Set the storage configuration for new vault](./media/backup-create-rs-vault/recovery-services-vault-backup-configuration.png)

   - We recommend that if you're using Azure as a primary backup storage endpoint, continue to use the default **Geo-redundant** setting.
   - If you don't use Azure as a primary backup storage endpoint, then choose **Locally redundant**, which reduces the Azure storage costs.
   - Learn more about [geo](../storage/common/storage-redundancy.md#geo-redundant-storage) and [local](../storage/common/storage-redundancy.md#locally-redundant-storage) redundancy.
   - If you need data availability without downtime in a region, guaranteeing data residency, then choose [zone-redundant storage](../storage/common/storage-redundancy.md#zone-redundant-storage).

>[!NOTE]
>The Storage Replication settings for the vault aren't relevant for Azure file share backup as the current solution is snapshot based and there's no data transferred to the vault. Snapshots are stored in the same storage account as the backed up file share.

## Set Cross Region Restore

The restore option **Cross Region Restore (CRR)** allows you to restore data in a secondary, [Azure paired region](../best-practices-availability-paired-regions.md).

It supports the following datasources:

- Azure VMs (general availability)
- SQL databases hosted on Azure VMs (preview)
- SAP HANA databases hosted on Azure VMs (preview)

Using Cross Region Restore allows you to:

- conduct drills when there's an audit or compliance requirement
- restore the data if there's a disaster in the primary region

When restoring a VM, you can restore the VM or its disk. If you're restoring from SQL/SAP HANA databases hosted on Azure VMs, then you can restore databases or their files.

To choose this feature, select **Enable Cross Region Restore** from the **Backup Configuration** pane.

Since this process is at the storage level, there are [pricing implications](https://azure.microsoft.com/pricing/details/backup/).

>[!NOTE]
>Before you begin:
>
>- Review the [support matrix](backup-support-matrix.md#cross-region-restore) for a list of supported managed types and regions.
>- The Cross Region Restore (CRR) feature for Azure VMs is now in general availability in all Azure public regions.
>- Cross Region Restore for SQL and SAP HANA databases is in preview in all Azure public regions.
>- CRR is a vault level opt-in feature for any GRS vault (turned off by default).
>- After opting-in, it might take up to 48 hours for the backup items to be available in secondary regions.
>- Currently, CRR for Azure VMs is supported for Azure Resource Manager Azure VMs and encrypted Azure VMs. Classic Azure VMs won't be supported. When additional management types support CRR, then they'll be **automatically** enrolled.
>- Cross Region Restore **currently can't be reverted back** to GRS or LRS once the protection is initiated for the first time.
>- Currently, secondary region [RPO](azure-backup-glossary.md#rpo-recovery-point-objective) is up to 12 hours from the primary region, even though [read-access geo-redundant storage (RA-GRS)](../storage/common/storage-redundancy.md#redundancy-in-a-secondary-region) replication is 15 minutes.

### Configure Cross Region Restore

A vault created with GRS redundancy includes the option to configure the Cross Region Restore feature. Every GRS vault will have a banner, which will link to the documentation. To configure CRR for the vault, go to the Backup Configuration pane, which contains the option to enable this feature.

 ![Backup Configuration banner](./media/backup-azure-arm-restore-vms/banner.png)

1. From the portal, go to your Recovery Services vault > **Properties** (under **Settings**).
1. Under **Backup Configuration**, select **Update**.
1. Select **Enable Cross Region Restore in this vault** to enable the functionality.

   ![Enable Cross Region restore](./media/backup-azure-arm-restore-vms/backup-configuration.png)

See these articles for more information about backup and restore with CRR:

- [Cross Region Restore for Azure VMs](backup-azure-arm-restore-vms.md#cross-region-restore)
- [Cross Region Restore for SQL databases](restore-sql-database-azure-vm.md#cross-region-restore)
- [Cross Region Restore for SAP HANA databases](sap-hana-db-restore.md#cross-region-restore)

## Set encryption settings

By default, the data in the Recovery Services vault is encrypted using platform-managed keys. No explicit actions are required from your end to enable this encryption, and it applies to all workloads being backed up to your Recovery Services vault.  You may choose to bring your own key to encrypt the backup data in this vault. This is referred to as customer-managed keys. If you wish to encrypt backup data using your own key, the encryption key must be specified before any item is protected to this vault. Once you enable encryption with your key, it can't be reversed.

### Configuring a vault to encrypt using customer-managed keys

To configure your vault to encrypt with customer-managed keys, these steps must be followed in this order:

1. Enable managed identity for your Recovery Services vault

1. Assign permissions to the vault to access the encryption key in the Azure Key Vault

1. Enable soft-delete and purge protection on the Azure Key Vault

1. Assign the encryption key to the Recovery Services vault

Instructions for each of these steps can be found [in this article](encryption-at-rest-with-cmk.md#configuring-a-vault-to-encrypt-using-customer-managed-keys).

## Modifying default settings

We highly recommend you review the default settings for **Storage Replication type** and **Security settings** before configuring backups in the vault.

- **Storage Replication type** by default is set to **Geo-redundant** (GRS). Once you configure the backup, the option to modify is disabled.
  - If you haven't yet configured the backup, then [follow these steps](#set-storage-redundancy) to review and modify the settings.
  - If you've already configured the backup and must move from GRS to LRS, then [review these workarounds](#how-to-change-from-grs-to-lrs-after-configuring-backup).

- **Soft delete** by default is **Enabled** on newly created vaults to protect backup data from accidental or malicious deletes. [Follow these steps](./backup-azure-security-feature-cloud.md#enabling-and-disabling-soft-delete) to review and modify the settings.

### How to change from GRS to LRS after configuring backup

Before deciding to move from GRS to locally redundant storage (LRS), review the trade-offs between lower cost and higher data durability that fit your scenario. If you must move from GRS to LRS, then you have two choices. They depend on your business requirements to retain the backup data:

- [Don’t need to preserve previous backed-up data](#dont-need-to-preserve-previous-backed-up-data)
- [Must preserve previous backed-up data](#must-preserve-previous-backed-up-data)

#### Don’t need to preserve previous backed-up data

To protect workloads in a new LRS vault, the current protection and data will need to be deleted in the GRS vault and backups configured again.

>[!WARNING]
>The following operation is destructive and can't be undone. All backup data and backup items associated with the protected server will be permanently deleted. Proceed with caution.

Stop and delete current protection on the GRS vault:

1. Disable soft delete in the GRS vault properties. Follow [these steps](backup-azure-security-feature-cloud.md#disabling-soft-delete-using-azure-portal) to disable soft delete.

1. Stop protection and delete backups from the existing GRS vault. In the Vault dashboard menu, select **Backup Items**. Items listed here that need to be moved to the LRS vault must be removed along with their backup data. See how to [delete protected items in the cloud](backup-azure-delete-vault.md#delete-protected-items-in-the-cloud) and [delete protected items on premises](backup-azure-delete-vault.md#delete-protected-items-on-premises).

1. If you're planning to move AFS (Azure file shares), SQL servers or SAP HANA servers, then you'll need also to unregister them. In the vault dashboard menu, select **Backup Infrastructure**. See how to [unregister the SQL server](manage-monitor-sql-database-backup.md#unregister-a-sql-server-instance), [unregister a storage account associated with Azure file shares](manage-afs-backup.md#unregister-a-storage-account), and [unregister an SAP HANA instance](sap-hana-db-manage.md#unregister-an-sap-hana-instance).

1. Once they're removed from the GRS vault, continue to configure the backups for your workload in the new LRS vault.

#### Must preserve previous backed-up data

If you need to keep the current protected data in the GRS vault and continue the protection in a new LRS vault, there are limited options for some of the workloads:

- For MARS, you can [stop protection with retain data](backup-azure-manage-mars.md#stop-protecting-files-and-folder-backup) and register the agent in the new LRS vault.

  - Azure Backup service will continue to retain all the existing recovery points of the GRS vault.
  - You'll need to pay to keep the recovery points in the GRS vault.
  - You'll be able to restore the backed-up data only for unexpired recovery points in the GRS vault.
  - A new initial replica of the data will need to be created on the LRS vault.

- For an Azure VM, you can [stop protection with retain data](backup-azure-manage-vms.md#stop-protecting-a-vm) for the VM in the GRS vault, move the VM to another resource group, and then protect the VM in the LRS vault. See [guidance and limitations](../azure-resource-manager/management/move-limitations/virtual-machines-move-limitations.md) for moving a VM to another resource group.

  A VM can be protected in only one vault at a time. However, the VM in the new resource group can be protected on the LRS vault as it's considered a different VM.

  - Azure Backup service will retain the recovery points that have been backed up on the GRS vault.
  - You'll need to pay to keep the recovery points in the GRS vault (see [Azure Backup pricing](azure-backup-pricing.md) for details).
  - You'll be able to restore the VM, if needed, from the GRS vault.
  - The first backup on the LRS vault of the VM in the new resource will be an initial replica.

## Next steps

[Learn about](backup-azure-recovery-services-vault-overview.md) Recovery Services vaults.
[Learn about](backup-azure-delete-vault.md) Delete Recovery Services vaults.