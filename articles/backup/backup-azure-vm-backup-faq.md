
---
title: Azure VM Backup FAQ | Microsoft Docs
description: 'Answers to common questions about: how Azure VM backup works, limitations and what happens when changes to policy occur'
services: backup
documentationcenter: ''
author: trinadhk
manager: shreeshd
editor: ''
keywords: azure vm backup, azure vm restore, backup policy

ms.assetid: c4cd7ff6-8206-45a3-adf5-787f64dbd7e1
ms.service: backup
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 7/18/2017
ms.author: trinadhk;pullabhk;

---
# Questions about the Azure VM Backup service
This article has answers to common questions to help you quickly understand the Azure VM Backup components. In some of the answers, there are links to the articles that have comprehensive information. You can also post questions about the Azure Backup service in the [discussion forum](https://social.msdn.microsoft.com/forums/azure/home?forum=windowsazureonlinebackup).

## Configure backup
### Do Recovery Services vaults support classic VMs or Resource Manager based VMs? <br/>
Recovery Services vaults support both models.  You can back up a classic VM (created in the Classic portal), or a Resource Manager VM (created in the Azure portal) to a Recovery Services vault.

### What configurations are not supported by Azure VM backup?
Go through [Supported operating systems](backup-azure-arm-vms-prepare.md#supported-operating-system-for-backup) and [Limitations of VM backup](backup-azure-arm-vms-prepare.md#limitations-when-backing-up-and-restoring-a-vm)

### Why can't I see my VM in configure backup wizard?
In Configure backup wizard, Azure Backup only lists VMs that are:
  * Not already protected 
      You can verify the backup status of a VM by going to VM blade and checking Backup status from Settings Menu . Learn more on how to [Check backup status of a VM](backup-azure-vms-first-look-arm.md#configure-the-backup-job-from-the-vm-management-blade)
  * Belongs to same region as VM

## Backup
### Will on-demand backup job follow same retention schedule as scheduled backups?
No. You should specify the retention range for an on-demand backup job. By default, it is retained for 30 days when triggered from portal. 

### I recently enabled Azure Disk Encryption on some VMs. Will my backups continue to work?
You need to give permissions for Azure Backup service to access Key Vault. You can provide these permissions in PowerShell using steps mentioned in *Enable Backup* section of [PowerShell](backup-azure-vms-automation.md) documentation.

### I migrated disks of a VM to managed disks. Will my backups continue to work?
Yes, backups work seamlessly and no need to reconfigure backup. 

### My VM is shut down. Will an on-demand or a scheduled backup work?
Yes. Even when a machine is shut down backups work and the recovery point is marked as Crash consistent. For more details, see the data consistency section in [this article](backup-azure-vms-introduction.md#how-does-azure-back-up-virtual-machines)

### Can I cancel an in-progress backup job?
Yes. You can cancel backup job if it is in "Taking snapshot" phase. **You can't cancel a job if data transfer from snapshot is in progress**. 

## Restore
### How do I decide between restoring disks versus full VM restore?
Think of Azure full VM restore as a quick create option. Restore VM option changes the names of disks, containers used by those disks, public IP addresses and network interface names. The change is required to maintain the uniqueness of resources created during VM creation. But it will not add the VM to availability set. 

Use restore disks to:
  * Customize the VM that gets created from point in time configuration like changing the size
  * Add configurations, which are not present at the time of backup 
  * Control the naming convention for resources getting created
  * Add VM to availability set
  * For any other configuration which can be achieved only by using PowerShell/a declarative template definition
  
### Can I use backups of unmanaged disk VM to restore after I upgrade my disks to managed disks?
Yes, you can use the backups taken before migrating disks from unmanaged to managed. By default, restore VM job will create a VM with unmanaged disks. You can use restore disks functionality to restore disks and use them to create a VM on managed disks. 

## Manage VM backups
### What happens when I change a backup policy on VM(s)?
When a new policy is applied on VM(s), schedule and retention of the new policy is followed. If retention is extended, existing recovery points are marked to keep them as per new policy. If retention is reduced, they are marked for pruning in the next cleanup job and subsequently deleted. 
