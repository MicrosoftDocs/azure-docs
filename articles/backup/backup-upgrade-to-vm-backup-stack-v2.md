---  
title: Upgrade to VM backup stack V2 | Microsoft Docs 
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
ms.author: trinadhk 
--- 

# Upgrade to VM backup stack V2
VM backup stack V2 provides following feature enhancements 
* Ability to see snapshot taken as part of backup job to be available for recovery without waiting for data transfer to complete.
It will reduce the wait on snapshot to be copied to vault before triggering restore. Also, this will eliminate the additional storage requirement for backing up premium VMs except for first backup.  

* Reduction in backup and restore times by retaining snapshots locally for 7 days. 

* Support for disk sizes up to 4 TB.  

* Ability to use original storage accounts (even when VM has disks are distributed across storage accounts) when doing a restore of an unmanaged VM. This will make restores faster for a wide variety of VM configurations. 
    > [!NOTE] 
    > This is not same as overriding the original VM. 
    > 
    >

## What is changing in the new stack?
Today backup job consists of two phases:
1.	Taking VM snapshot. 
2.	Transferring VM snapshot to Azure Backup vault. 

A recovery point is considered created only after 1 and 2 are done. As part of new stack, a recovery point is created as soon as the snapshot is completed. You can also restore from this recovery point using the same restore flow. You can identify this recovery point in portal using “snapshot” as recovery point type. Once the snapshot is transferred to vault, recovery point type changes to “Snapshot and Vault”. 

![Backup job in VM backup stack V2](./media/backup-azure-vms/instant-rp-flow.jpg) 

By default, snapshots will be retained for 7 days. This allows to complete restore faster from these snapshots by reducing the time required to copy data back from vault to customer storage account. 

## Considerations before upgrade
* This is a one-directional upgrade of the VM backup stack. So, all  future backups will go into this flow. Since **it is enabled at a subscription level, all VMs will go onto this flow**. All new feature additions will be based on the same stack. Ability to control this at policy level is coming in future releases. 
* For VM with premium disks, during the first backup, make sure that storage space equivalent to size of the VM is available in the storage account until first backup completes. 
* Since snapshots are stored locally to boost recovery point creation and also to speed up restore, you will see storage costs corresponding to snapshots for the period 7 days.
For managed disks, although there is *no increase in price* as restorePointCollections are free. 
* If you are doing a restore from Snapshot recovery point for a Premium VM, you will see a temporary storage location being used while VM is getting created as part of the restore. 

## How to upgrade?
### Portal
If you are using portal, you will see a notification on vault dashboard related to large disk support and backup and restore speed improvements.

![Backup job in VM backup stack V2](./media/backup-azure-vms/instant-rp-banner.png) 

Clicking on the banner, will open a screen for upgrading to new stack. 

![Backup job in VM backup stack V2](./media/backup-azure-vms/instant-rp.png) 

### PowerShell
Execute following cmdlets from an elevated PowerShell terminal:
1.	Log in to Azure Account. 

```
PS C:> Login-AzureRmAccount
```

2.	Select the subscription that you want to register for preview

```
PS C:>  Get-AzureRmSubscription –SubscriptionName "Subscription Name" | Select-AzureRmSubscription
```

3.	Register this subscription for private preview

```
PS C:>  Register-AzureRmProviderFeature -FeatureName “InstantBackupandRecovery” –ProviderNamespace Microsoft.RecoveryServices
```

## How to verify if upgrade is complete?
From an elevated PowerShell terminal, run the following cmdlet:

```
Get-AzureRmProviderFeature -FeatureName “InstantBackupandRecovery” –ProviderNamespace Microsoft.RecoveryServices
```

If it says Registered, then your subscription is upgraded to VM backup stack V2. 



