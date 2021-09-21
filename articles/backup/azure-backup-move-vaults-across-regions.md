---
title: Move Azure Recovery Services vault to another region
description: In this article, you'll learn how to ensure continued backups after moving the resources across regions.
ms.topic: conceptual
ms.date: 08/27/2021
ms.custom: references_regions 
---
# Back up resources in Recovery Services vault after moving across regions

Azure Resource Mover supports the movement of multiple resources across regions. While moving your resources from one region to another, you can ensure that your resources stay protected. As Azure Backup supports protection of several workloads, you may need to take some steps to continue having the same level of protection in the new region.

To understand the detailed steps to achieve this, refer to the sections below.

>[!Note]
>Azure Backup currently doesn’t support the movement of backup data from one Recovery Services vault to another. To protect your resource in the new region, the resource needs to be registered and backed up to a new/existing vault in the new region. When moving your resources from one region to another, backup data in your existing Recovery services vaults in the older region can be retained/deleted based on your requirement. If you choose to retain data in the old vaults, you will incur backup charges accordingly.

## Back up Azure Virtual Machine after moving across regions

When an Azure Virtual Machine (VM) that’s been protected by a Recovery Services vault is moved from one region to another, it can no longer be backed up to the older vault. The backups in the old vault will start failing with the errors **BCMV2VMNotFound** or [**ResourceNotFound**](./backup-azure-vms-troubleshoot.md#320001-resourcenotfound---could-not-perform-the-operation-as-vm-no-longer-exists--400094-bcmv2vmnotfound---the-virtual-machine-doesnt-exist--an-azure-virtual-machine-wasnt-found).

To protect your VM in the new region, you should follow these steps:

1. Before moving the VM, [select the VM on the **Backup Items** tab](./backup-azure-delete-vault.md#delete-protected-items-in-the-cloud) of existing vault’s dashboard and select **Stop protection** followed by retain/delete data as per your requirement. When the backup data for a VM is stopped with retain data, the recovery points remain forever and don’t adhere to any policy. This ensures you always have your backup data ready for restore.

   >[!Note]
   >Retaining data in the older vault will incur backup charges. If you no longer wish to retain data to avoid billing, you need to delete the retained backup data using the  [Delete data option](./backup-azure-manage-vms.md#delete-backup-data).

1. Move your VM to the new region using [Azure Resource Mover](../resource-mover/tutorial-move-region-virtual-machines.md).

1. Start protecting your VM in a new or existing Recovery Services vault in the new region.
   When you need to restore from your older backups, you can still do it from your old Recovery Services vault if you had chosen to retain the backup data. 

The above steps should help ensure that your resources are being backed up in the new region as well.

## Back up Azure File Share after moving across regions

To move your Storage Accounts along with the file shares in them from one region to another, see [Move an Azure Storage account to another region](../storage/common/storage-account-move.md).

>[!Note]
>When Azure File Share is copied across regions, its associated snapshots don’t move along with it. In order to move the snapshots data to the new region, you need to move the individual files and directories of the snapshots to the Storage Account in the new region using [AzCopy](../storage/common/storage-use-azcopy-files.md#copy-all-file-shares-directories-and-files-to-another-storage-account).

Azure Backup offers [a snapshot management solution](./backup-afs.md) for your Azure Files today. This means, you don’t move the file share data into the Recovery Services vaults. Also, as the snapshots don’t move with your Storage Account, you’ll effectively have all your backups (snapshots) in the existing region only and protected by the existing vault. However, you can ensure that the new file shares that you create in the new region are protected by Azure Backup by following these steps:

1. Start protecting the Azure File Share copied into the new Storage Account in a new or existing Recovery Services vault in the new region.  

1. Once the Azure File Share is copied to the new region, you can choose to stop protection and retain/delete the snapshots (and the corresponding recovery points) of the original Azure File Share as per your requirement. This can be done by selecting your file share on the [Backup Items tab](./backup-azure-delete-vault.md#delete-protected-items-in-the-cloud) of the original vault’s dashboard. When the backup data for Azure File Share is stopped with retain data, the recovery points remain forever and don’t adhere to any policy.
   
   This ensures that you will always have your snapshots ready for restore from the older vault. 
 
## Back up SQL Server in Azure VM/SAP HANA in Azure VM

When you move a VM running SQL or SAP HANA servers to another region, the SQL and SAP HANA databases in those VMs can no longer be backed up in the vault of the earlier region. To protect the SQL and SAP HANA servers running in Azure VM in the new region, you should follow these steps:
 
1. Before moving VM running SQL Server/SAP HANA to a new region, select it in the [Backup Items tab](./backup-azure-delete-vault.md#delete-protected-items-in-the-cloud) of the existing vault’s dashboard and select _the databases_ for which backup needs to be stopped. Select **Stop protection** followed by retain/delete data as per your requirement. When the backup data is stopped with retain data, the recovery points remain forever and don’t adhere to any policy. This ensures that you always have your backup data ready for restore.

   >[!Note]
   >Retaining data in the older vault will incur backup charges. If you no longer wish to retain data to avoid billing, you need to delete the retained backup data using [Delete data option](./backup-azure-manage-vms.md#delete-backup-data).

1. Move the VM running SQL Server/SAP HANA to the new region using [Azure Resource Mover](../resource-mover/tutorial-move-region-virtual-machines.md).

1. Start protecting the VM in a new/existing Recovery Services vault in the new region. When you need to restore from your older backups, you can still do it from your old Recovery Services vault.
 
The above steps should help ensure that your resources are being backed up in the new region as well.