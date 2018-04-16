---  
title: Upgrade to Azure VM backup stack Resource Manager deployment model | Microsoft Docs 
description: Upgrade process and FAQs for VM backup stack Resource Manager deployment model 
services: backup, virtual-machines 
documentationcenter: '' 
author: trinadhk  
manager: vijayts 
tags: azure-resource-manager, virtual-machine-backup 
ms.assetid:  
ms.service: backup, virtual-machines 
ms.devlang: na 
ms.topic: article 
ms.workload: storage-backup-recovery 
ms.date: 03/08/2018 
ms.author: trinadhk, sogup
--- 

# Upgrade to Azure VM backup stack Resource Manager deployment model
The virtual machine (VM) backup stack Resource Manager deployment model upgrade provides the following feature enhancements:
* Ability to see snapshots taken as part of a backup job that's available for recovery without waiting for data transfer to complete. It reduces the wait time for snapshots to copy to the vault before triggering restore. Also, this ability eliminates the additional storage requirement for backing up premium VMs, except for the first backup.  

* Reduction in backup and restore times by retaining snapshots locally for seven-days. 

* Support for disk sizes up to 4 TB. 

* Ability to use original storage accounts when doing a restore of an unmanaged VM. This ability exists even when VM has disks that are distributed across storage accounts. It makes restores faster for a wide variety of VM configurations.
    > [!NOTE] 
    > This ability is not the same as overriding the original VM. 
    > 
    >

## What's changing in the new stack?
Currently, the backup job consists of two phases:
1.	Taking a VM snapshot. 
2.	Transferring a VM snapshot to the Azure Backup vault. 

A recovery point is considered created only after phases 1 and 2 are done. As part of the new stack, a recovery point is created as soon as the snapshot is completed. You can also restore from this recovery point using the same restore flow. You can identify this recovery point in the Microsoft Azure portal using “snapshot” as the recovery point type. Once the snapshot is transferred to the vault, the recovery point type changes to “snapshot and vault.” 

![Backup job in VM backup stack Resource Manager deployment model--storage and vault](./media/backup-azure-vms/instant-rp-flow.jpg) 

By default, snapshots are kept for seven days. This feature allows the restore to be completed faster from these snapshots. It reduces the time that is required to copy data back from the vault to the customer storage account. 

## Considerations before upgrade
* The upgrade of the VM backup stack is one directional. Therefore, all backups go into this flow. Because it's enabled at the subscription level, all VMs go onto this flow. All new feature additions are based on the same stack.

* For VMs with premium disks, during and until the first backup completes, make sure there's enough storage space in the storage account. It should be equal to the size of the VM.

* Snapshots are stored locally to boost recovery point creation and also to speed up restore. Therefore, you see storage costs that correspond to snapshots during the seven-day period.

* Incremental snapshots are stored as page blobs. All customers that use unmanaged disks are charged for the seven days the snapshots are stored in the customer's local storage account. According to the current pricing model, there is no cost for customers on managed disks.

* If you do a restore from a snapshot recovery point for a premium VM, you see a temporary storage location that is used while the VM is created as part of the restore.

* For premium storage accounts, the snapshots that are taken for instant recovery occupy 10 TB of allocated space.

## Upgrade
### The Azure portal
If you use the Azure portal, you see a notification on the vault dashboard related to large disk support and backup and restore speed improvements.

![Backup job in VM backup stack Resource Manager deployment model--support notification](./media/backup-azure-vms/instant-rp-banner.png) 

To open a screen for upgrading to the new stack, select the banner. 

![Backup job in VM backup stack Resource Manager deployment model--upgrade](./media/backup-azure-vms/instant-rp.png) 

### PowerShell
Execute the following cmdlets from an elevated Azure PowerShell terminal:
1.	Sign in to your Azure account: 

```
PS C:> Login-AzureRmAccount
```

2.	Select the subscription that you want to register for preview:

```
PS C:>  Get-AzureRmSubscription –SubscriptionName "Subscription Name" | Select-AzureRmSubscription
```

3.	Register this subscription for private preview:

```
PS C:>  Register-AzureRmProviderFeature -FeatureName “InstantBackupandRecovery” –ProviderNamespace Microsoft.RecoveryServices
```

## Verify that the upgrade is complete
From an elevated PowerShell terminal, run the following cmdlet:

```
Get-AzureRmProviderFeature -FeatureName “InstantBackupandRecovery” –ProviderNamespace Microsoft.RecoveryServices
```

If it says Registered, then your subscription is upgraded to VM backup stack Resource Manager deployment model. 



