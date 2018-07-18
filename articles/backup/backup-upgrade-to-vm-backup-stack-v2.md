---
title: Upgrade to the Azure VM Backup Stack V2
description: Upgrade process and FAQs for VM backup stack, Resource Manager deployment model
services: backup, virtual-machines
author: trinadhk
manager: vijayts
tags: azure-resource-manager, virtual-machine-backup
ms.service: backup, virtual-machines
ms.topic: conceptual
ms.date: 03/08/2018
ms.author: trinadhk
--- 

# Upgrade to Azure VM Backup stack V2
The Resource Manager deployment model for the upgrade to virtual machine (VM) backup stack provides the following feature enhancements:
* Ability to see snapshots taken as part of a backup job that's available for recovery without waiting for data transfer to finish. It reduces the wait time for snapshots to copy to the vault before triggering restore. Also, this ability eliminates the additional storage requirement for backing up premium VMs, except for the first backup.  

* Reduction in backup and restore times by retaining snapshots locally for seven days.

* Support for disk sizes up to 4 TB.

* Ability to use an unmanaged VM's original storage accounts, when restoring. This ability exists even when the VM has disks that are distributed across storage accounts. It speeds up restore operations for a wide variety of VM configurations.
    > [!NOTE]
    > This ability is not the same as overriding the original VM. 
    >

## What's changing in the new stack?
Currently, the backup job consists of two phases:
1.	Taking a VM snapshot. 
2.	Transferring a VM snapshot to the Azure Backup vault. 

A recovery point is considered created only after phases 1 and 2 are done. As part of the new stack, a recovery point is created as soon as the snapshot is finished. You can also restore from this recovery point by using the same restore flow. You can identify this recovery point in the Azure portal by using “snapshot” as the recovery point type. After the snapshot is transferred to the vault, the recovery point type changes to “snapshot and vault.” 

![Backup job in VM backup stack Resource Manager deployment model--storage and vault](./media/backup-azure-vms/instant-rp-flow.jpg) 

By default, snapshots are kept for seven days. This feature allows the restore to finish faster from these snapshots. It reduces the time that's required to copy data back from the vault to the customer's storage account. 

## Considerations before upgrade
* The upgrade of the VM backup stack is one directional. So all backups go into this flow. Because it's enabled at the subscription level, all VMs go into this flow. All new feature additions are based on the same stack. Ability to control this at policy level is coming in future releases.

* Snapshots are stored locally to boost recovery point creation and also to speed up restore operations. Therefore, you see storage costs that correspond to snapshots during the seven-day period.

* Incremental snapshots are stored as page blobs. All customers that use unmanaged disks are charged for the seven days the snapshots are stored in the customer's local storage account. According to the current pricing model, there is no cost for customers on managed disks.

* If you do a restore from a snapshot recovery point for a premium VM, you see a temporary storage location that is used while the VM is created as part of the restore.

* For premium storage accounts, the snapshots that are taken for instant recovery will count towards the limit of 10 TB of allocated space.

## Upgrade
### The Azure portal
If you use the Azure portal, you see a notification on the vault dashboard. This notification relates to large-disk support and backup and restore speed improvements.

![Backup job in VM backup stack Resource Manager deployment model--support notification](./media/backup-azure-vms/instant-rp-banner.png) 

To open a screen for upgrading to the new stack, select the banner. 

![Backup job in VM backup stack Resource Manager deployment model--upgrade](./media/backup-azure-vms/instant-rp.png) 

### PowerShell
Run the following cmdlets from an elevated PowerShell terminal:
1.	Sign in to your Azure account: 

    ```
    PS C:> Connect-AzureRmAccount
    ```

2.	Select the subscription that you want to register for preview:

    ```
    PS C:>  Get-AzureRmSubscription –SubscriptionName "Subscription Name" | Select-AzureRmSubscription
    ```

3.	Register this subscription for private preview:

    ```
    PS C:>  Register-AzureRmProviderFeature -FeatureName "InstantBackupandRecovery" –ProviderNamespace Microsoft.RecoveryServices
    ```

## Verify that the upgrade is finished
From an elevated PowerShell terminal, run the following cmdlet:

```
Get-AzureRmProviderFeature -FeatureName "InstantBackupandRecovery" –ProviderNamespace Microsoft.RecoveryServices
```

If it says "Registered," then your subscription is upgraded to VM backup stack Resource Manager deployment model.

## Frequently asked questions

The following questions and answers have been collected from forums and customer questions.

### Will upgrading to V2 impact current backups

If you upgrade to V2, there is no impact to your current backups, and no need to reconfigure your environment. You can upgrade and everything in your backup environment continues to work as it has.

### What does it cost to upgrade to Azure Backup stack v2

There is no direct cost to upgrade to Azure Backup stack v2. Snapshots are stored locally to boost recovery point creation, and to speed up restore operations. Therefore, you will see storage costs that correspond to the snapshots taken during the seven-day period.

### Does upgrading to stack v2 increase the premium storage account snapshot limit by 10 TB

No.

### In Premium Storage accounts, do snapshots taken for instant recovery point occupy the 10 TB snapshot limit

Yes, for premium storage accounts, the snapshots taken for instant recovery point, occupy 10 TB of allocated space.

### How does the snapshot work for 7 days 

For seven days, a new snapshot is taken each day. There are seven individual snapshots. The service does **not** take a copy on the first day, and add changes for the next six days.

### What happens if the default resource group is deleted accidentally

If the resource group is deleted, the instant recovery points for all protected VMs in that region, are lost. When the next backup occurs, the resource group is created again, and the backups continue as expected. This functionality is not exclusive to instant recovery points.

### Can I delete the default resource group created for instant recovery points

The resource group is a managed resource group created by the Azure Backup service. Currently, you can't change or modify the resource group. You should not make changes, or lock the resource group. This guidance is not just for the V2 stack.
 
### Is a v2 snapshot an incremental snapshot or full snapshot

For unmanaged disks, the snapshot is an incremental snapshot. For managed disks, the snapshot is a full snapshot.