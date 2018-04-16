---  
title: Upgrade to Azure VM backup stack V2 | Microsoft Docs 
description: Upgrade process and FAQs for VM backup stack V2 
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

# Upgrade to Azure VM backup stack V2
The virtual machine (VM) backup stack V2 upgrade provides the following feature enhancements:
* Ability to see snapshots taken as part of a backup job that's available for recovery without waiting for data transfer to complete. It reduces the wait time for snapshots to copy to the vault before triggering restore. Also, this ability eliminates the additional storage requirement for backing up premium VMs, except for the first backup.  

* Reduction in backup and restore times through seven-day local snapshot retention. 

* Support for disk sizes up to 4 TB.  

* Ability to use original storage accounts (even when VM has disks distributed across storage accounts) when doing a restore of an unmanaged VM. This makes restores faster for a wide variety of VM configurations. 
    > [!NOTE] 
    > This is not the same as overriding the original VM. 
    > 
    >

## What's changing in the new stack?
Currently, the backup job consists of two phases:
1.	Taking a VM snapshot. 
2.	Transferring a VM snapshot to the Azure Backup vault. 

A recovery point is considered created only after phases 1 and 2 are done. As part of the new stack, a recovery point is created as soon as the snapshot is completed. You can also restore from this recovery point using the same restore flow. You can identify this recovery point in the Microsoft Azure portal using “snapshot” as the recovery point type. Once the snapshot is transferred to the vault, the recovery point type changes to “snapshot and vault.” 

![Backup job in VM backup stack V2--storage and vault](./media/backup-azure-vms/instant-rp-flow.jpg) 

By default, snapshots are retained for seven days. This allows the restore to be completed faster from these snapshots by reducing the time required to copy data back from the vault to the customer storage account. 

## Considerations before upgrade
* The upgrade of the VM backup stack is one directional. Therefore, all backups go into this flow. Because it's enabled at the subscription level, all VMs go onto this flow. All new feature additions are based on the same stack. Ability to control this at the policy level is coming in future releases.

* For VMs with premium disks, during the first backup, make sure that storage space equivalent to size of the VM is available in the storage account until the first backup completes. 

* Because snapshots are stored locally to boost recovery point creation and also to speed up restore, you'll see storage costs that correspond to snapshots during the seven-day period.

* Incremental snapshots are stored as page blobs. All customers that use unmanaged disks are charged for the seven days the snapshots are stored in the customer's local storage account. According to the current pricing model, there is no cost for customers on managed disks.

* If you're doing a restore from a snapshot recovery point for a premium VM, you'll see a temporary storage location used while the VM is created as part of the restore. 

* In the case of premium storage accounts, the snapshots taken for instant recovery occupy the 10 TB space allocated in the premium storage account.

## Upgrade
### The Azure portal
If you're using the Azure portal, you'll see a notification on the vault dashboard related to large disk support and backup and restore speed improvements.

![Backup job in VM backup stack V2--support notification](./media/backup-azure-vms/instant-rp-banner.png) 

To open a screen for upgrading to the new stack, select the banner. 

![Backup job in VM backup stack V2--upgrade](./media/backup-azure-vms/instant-rp.png) 

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

If it says Registered, then your subscription is upgraded to VM backup stack V2. 



