---
title: Move Azure Recovery Services vault to another region
description: In this article, you'll learn how to ensure continued backups after moving the resources across regions.
ms.topic: conceptual
ms.date: 09/24/2021
ms.custom: how-to 
author: AbhishekMallick-MS
ms.author: v-abhmallick
---
# Back up resources in Recovery Services vault after moving across regions

Azure Resource Mover supports the movement of multiple resources across regions. While moving your resources from one region to another, you can ensure that your resources stay protected. As Azure Backup supports protection of several workloads, you may need to take some steps to continue having the same level of protection in the new region.

To understand the detailed steps to achieve this, refer to the sections below.

>[!Note]
>Azure Backup currently doesn’t support the movement of backup data from one Recovery Services vault to another. To protect your resource in the new region, the resource needs to be registered and backed up to a new/existing vault in the new region. When moving your resources from one region to another, backup data in your existing Recovery Services vaults in the older region can be retained/deleted based on your requirement. If you choose to retain data in the old vaults, you will incur backup charges accordingly.

## Back up Azure Virtual Machine after moving across regions

When an Azure Virtual Machine (VM) that’s been protected by a Recovery Services vault is moved from one region to another, it can no longer be backed up to the older vault. The backups in the old vault will start failing with the errors **BCMV2VMNotFound** or [**ResourceNotFound**](./backup-azure-vms-troubleshoot.md#320001-resourcenotfound---could-not-perform-the-operation-as-vm-no-longer-exists--400094-bcmv2vmnotfound---the-virtual-machine-doesnt-exist--an-azure-virtual-machine-wasnt-found). For information on how to protect your VMs in the new region, see the following sections.

### Prepare to move Azure VMs

Before you move a VM, ensure the following prerequisites are met:

1. See the [prerequisites associated with VM move](../resource-mover/tutorial-move-region-virtual-machines.md#prerequisites) and ensure that the VM is eligible for move.
1. [Select the VM on the **Backup Items** tab](./backup-azure-delete-vault.md#delete-protected-items-in-the-cloud) of existing vault’s dashboard and select **Stop protection** followed by retain/delete data as per your requirement. When the backup data for a VM is stopped with retain data, the recovery points remain forever and don’t adhere to any policy. This ensures you always have your backup data ready for restore.
   >[!Note]
   >Retaining data in the older vault will incur backup charges. If you no longer wish to retain data to avoid billing, you need to delete the retained backup data using the  [Delete data option](./backup-azure-manage-vms.md#delete-backup-data).
1. Ensure that the VMs are turned on. All VMs’ disks that need to be available in the destination region are attached and initialized in the VMs.
1. Ensure that VMs have the latest trusted root certificates, and an updated certificate revocation list (CRL). To do so:
   - On Windows VMs, install the latest Windows updates.
   - On Linux VMs, refer to distributor guidance to ensure that machines have the latest certificates and CRL.
1. Allow outbound connectivity from VMs:
   - If you're using a URL-based firewall proxy to control outbound connectivity, allow access to [these URLs](../resource-mover/support-matrix-move-region-azure-vm.md#url-access).
   - If you're using network security group (NSG) rules to control outbound connectivity, create [these service tag rules](../resource-mover/support-matrix-move-region-azure-vm.md#nsg-rules).

### Move Azure VMs

Move your VM to the new region using [Azure Resource Mover](../resource-mover/tutorial-move-region-virtual-machines.md).

### Protect Azure VMs using Azure Backup

Start protecting your VM in a new or existing Recovery Services vault in the new region. When you need to restore from your older backups, you can still do it from your old Recovery Services vault if you had chosen to retain the backup data. 

The above steps should help ensure that your resources are being backed up in the new region as well.

## Back up Azure File Share after moving across regions

Azure Backup offers [a snapshot management solution](./backup-afs.md) for your Azure Files today. This means, you don’t move the file share data into the Recovery Services vaults. Also, as the snapshots don’t move with your Storage Account, you’ll effectively have all your backups (snapshots) in the existing region only and protected by the existing vault. However, if you move your Storage Accounts along with the file shares across regions or create new file shares in the new region, see to the following sections to ensure that they are protected by Azure Backup.

### Prepare to move Azure File Share

Before you move the Storage Account, ensure the following prerequisites are met:

1.	See the [prerequisites to move Storage Account](../storage/common/storage-account-move.md?tabs=azure-portal#prerequisites). 
1. Export and modify a Resource Move template. For more information, see [Prepare Storage Account for region move](../storage/common/storage-account-move.md?tabs=azure-portal#prepare).

### Move Azure File Share

To move your Storage Accounts along with the Azure File Shares in them from one region to another, see [Move an Azure Storage account to another region](../storage/common/storage-account-move.md).

>[!Note]
>When Azure File Share is copied across regions, its associated snapshots don’t move along with it. In order to move the snapshots data to the new region, you need to move the individual files and directories of the snapshots to the Storage Account in the new region using [AzCopy](../storage/common/storage-use-azcopy-files.md#copy-all-file-shares-directories-and-files-to-another-storage-account).

### Protect Azure File share using Azure Backup

Start protecting the Azure File Share copied into the new Storage Account in a new or existing Recovery Services vault in the new region.  

Once the Azure File Share is copied to the new region, you can choose to stop protection and retain/delete the snapshots (and the corresponding recovery points) of the original Azure File Share as per your requirement. This can be done by selecting your file share on the [Backup Items tab](./backup-azure-delete-vault.md#delete-protected-items-in-the-cloud) of the original vault’s dashboard. When the backup data for Azure File Share is stopped with retain data, the recovery points remain forever and don’t adhere to any policy.
   
This ensures that you will always have your snapshots ready for restore from the older vault. 
 
## Back up SQL Server/SAP HANA in Azure VM after moving across regions

When you move a VM running SQL or SAP HANA servers to another region, the SQL and SAP HANA databases in those VMs can no longer be backed up in the vault of the earlier region. To protect the SQL and SAP HANA servers running in Azure VM in the new region, see the follow sections.

### Prepare to move SQL Server/SAP HANA in Azure VM

Before you move SQL Server/SAP HANA running in a VM to a new region, ensure the following prerequisites are met:

1. See the [prerequisites associated with VM move](../resource-mover/tutorial-move-region-virtual-machines.md#prerequisites) and ensure that the VM is eligible for move. 
1. Select the VM on the [Backup Items tab](./backup-azure-delete-vault.md#delete-protected-items-in-the-cloud) of the existing vault’s dashboard and select _the databases_ for which backup needs to be stopped. Select **Stop protection** followed by retain/delete data as per your requirement. When the backup data is stopped with retain data, the recovery points remain forever and don’t adhere to any policy. This ensures that you always have your backup data ready for restore.
   >[!Note]
   >Retaining data in the older vault will incur backup charges. If you no longer wish to retain data to avoid billing, you need to delete the retained backup data using [Delete data option](./backup-azure-manage-vms.md#delete-backup-data).
1. Ensure that the VMs to be moved are turned on. All VMs disks that need to be available in the destination region are attached and initialized in the VMs.
1. Ensure that VMs have the latest trusted root certificates, and an updated certificate revocation list (CRL). To do so:
   - On Windows VMs, install the latest Windows updates.
   - On Linux VMs, refer to the distributor guidance and ensure that machines have the latest certificates and CRL.
1. Allow outbound connectivity from VMs:
   - If you're using a URL-based firewall proxy to control outbound connectivity, allow access to [these URLs](../resource-mover/support-matrix-move-region-azure-vm.md#url-access).
   - If you're using network security group (NSG) rules to control outbound connectivity, create [these service tag rules](../resource-mover/support-matrix-move-region-azure-vm.md#nsg-rules).

### Move SQL Server/SAP HANA in Azure VM

Move your VM to the new region using [Azure Resource Mover](../resource-mover/tutorial-move-region-virtual-machines.md).

### Protect SQL Server/SAP HANA in Azure VM using Azure Backup

Start protecting the VM in a new/existing Recovery Services vault in the new region. When you need to restore from your older backups, you can still do it from your old Recovery Services vault.
 
The above steps should help ensure that your resources are being backed up in the new region as well.