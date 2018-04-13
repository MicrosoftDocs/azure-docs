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

# Upgrade to VM backup stack V2
The virtual machine (VM) backup stack V2 upgrade provides the following feature enhancements:
* Ability to see snapshots taken as part of a backup job that's available for recovery without waiting for data transfer to complete. It reduces the wait for snapshots to copy to the vault before triggering restore. Also, this eliminates the additional storage requirement for backing up premium VMs except for the first backup.  

* Reduction in backup and restore times through seven-day local snapshot retention. 

* Support for disk sizes up to 4 TB.  

* Ability to use original storage accounts (even when VM has disks distributed across storage accounts) when doing a restore of an unmanaged VM. This makes restores faster for a wide variety of VM configurations. 
    > [!NOTE] 
    > This is not same as overriding the original VM. 
    > 
    >

## What is changing in the new stack?
Currently, the backup job consists of two phases:
1.	Taking VM snapshot. 
2.	Transferring VM snapshot to Azure Backup vault. 

A recovery point is considered created only after phases 1 and 2 are done. As part of the new stack, a recovery point is created as soon as the snapshot is completed. You can also restore from this recovery point using the same restore flow. You can identify this recovery point in the Azure portal using “snapshot” as recovery point type. Once the snapshot is transferred to the vault, recovery point type changes to “Snapshot and Vault.” 

![Backup job in VM backup stack V2](./media/backup-azure-vms/instant-rp-flow.jpg) 

By default, snapshots will be retained for seven days. This allows the restore to be completed faster from these snapshots by reducing the time required to copy data back from the vault to the customer storage account. 

## Considerations before upgrade
* The upgrade of the VM backup stack is one-directional. Therefore, all backups go into this flow. Because **it's enabled at a subscription level, all VMs go onto this flow**. All new feature additions are based on the same stack. Ability to control this at policy level is coming in future releases. 
* For VMs with premium disks, during the first backup, make sure that storage space equivalent to size of the VM is available in the storage account until first backup completes. 
* Since snapshots are stored locally to boost recovery point creation and also to speed up restore, you will see storage costs corresponding to snapshots during the seven-day period.
* Incremental snapshots are stored as page blobs. All the customers using unmanaged disks will be charged for the 7 days snapshots stored in the customer's local storage account. According to the current pricing model, there is no cost for customers on managed disks.
* If you are doing a restore from Snapshot recovery point for a Premium VM, you will see a temporary storage location being used while the VM is being created as part of the restore. 
* In case of premium storage accounts, the snapshots taken for instant recovery will occupy the 10TB space allocated in the premium storage account.

## How to upgrade?
### The Azure portal
If you're using using the Azure portal, you'll see a notification on the vault dashboard related to large disk support and backup and restore speed improvements.

![Backup job in VM backup stack V2](./media/backup-azure-vms/instant-rp-banner.png) 

To open a screen for upgrading to the new stack, select the banner. 

![Backup job in VM backup stack V2](./media/backup-azure-vms/instant-rp.png) 

### PowerShell
Execute the following cmdlets from an elevated PowerShell terminal:
1.	Sign in to your Azure account. 

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

## Verify whether the upgrade is complete
From an elevated PowerShell terminal, run the following cmdlet:

```
Get-AzureRmProviderFeature -FeatureName “InstantBackupandRecovery” –ProviderNamespace Microsoft.RecoveryServices
```

If it says Registered, then your subscription is upgraded to VM backup stack V2. 



