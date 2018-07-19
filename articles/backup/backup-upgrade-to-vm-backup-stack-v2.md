---
title: Upgrade to the Azure VM Backup Stack V2
description: Upgrade process and FAQs for VM backup stack, Resource Manager deployment model
services: backup
author: trinadhk
manager: vijayts
tags: azure-resource-manager, virtual-machine-backup
ms.service: backup
ms.topic: conceptual
ms.date: 7/18/2018
ms.author: trinadhk
---

# Upgrade to Azure VM Backup stack V2

The Resource Manager deployment model for the upgrade to virtual machine (VM) backup stack provides the following feature enhancements:

* Ability to see snapshots taken as part of a backup job that's available for recovery without waiting for data transfer to finish. It reduces the wait time for snapshots to copy to the vault before triggering restore. Also, this ability eliminates the additional storage requirement for backing up premium VMs, except for the first backup.  

* Reduces backup and restore times by retaining snapshots locally, for seven days.

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

* The upgrade of the VM backup stack is one directional, all backups go into this flow. Because the change occurs at the subscription level, all VMs go into this flow. All new feature additions are based on the same stack. Currently you can't control the stack at policy level.

* Snapshots are stored locally to boost recovery point creation and also to speed up restore operations. As a result, you'll see storage costs that correspond to snapshots taken during the seven-day period.

* Incremental snapshots are stored as page blobs. All customers that use unmanaged disks are charged for the seven days the snapshots are stored in the customer's local storage account. According to the current pricing model, there's no cost for customers on managed disks.

* If you restore a premium VM from a snapshot recovery point, a temporary storage location is used while the VM is created.

* For premium storage accounts, the snapshots taken for instant recovery points count towards the 10-TB limit of allocated space.

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

### Will upgrading to V2 impact current backups?

If you upgrade to V2, there's no impact to your current backups, and no need to reconfigure your environment. Upgrade and your backup environment continues to work as it has.

### What does it cost to upgrade to Azure Backup stack v2?

There is no cost to upgrade to Azure Backup stack v2. Snapshots are stored locally to speed up recovery point creation, and restore operations. As a result, you'll see storage costs that correspond to the snapshots taken during the seven-day period.

### Does upgrading to stack v2 increase the premium storage account snapshot limit by 10 TB?

No.

### In Premium Storage accounts, do snapshots taken for instant recovery point occupy the 10 TB snapshot limit?

Yes, for premium storage accounts, the snapshots taken for instant recovery point, occupy the allocated 10 TB of space.

### How does the snapshot work during the seven-day period? 

Each day a new snapshot is taken. There are seven individual snapshots. The service does **not** take a copy on the first day, and add changes for the next six days.

### What happens if the default resource group is deleted accidentally?

If the resource group is deleted, the instant recovery points for all protected VMs in that region, are lost. When the next backup occurs, the resource group is created again, and the backups continue as expected. This functionality is not exclusive to instant recovery points.

### Can I delete the default resource group created for instant recovery points?

Azure Backup service creates the managed resource group. Currently, you can't change or modify the resource group. Also, you should not lock the resource group. This guidance is not just for the V2 stack.
 
### Is a v2 snapshot an incremental snapshot or full snapshot?

Incremental snapshots are used for unmanaged disks. For managed disks, the snapshot is a full snapshot.
