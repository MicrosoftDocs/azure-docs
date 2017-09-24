
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

### What configurations are not supported by Azure VM backup ?
Please go through [Supported operating systems](backup-azure-arm-vms-prepare.md#supported-operating-system-for-backup) and [Limitations of VM backup](backup-azure-arm-vms-prepare.md#limitations-when-backing-up-and-restoring-a-vm)

### Why can't I see my VM in configure backup wizard?
In Configure backup wizard, Azure Backup only lists VMs which are:
* Not already protected - You can verify the backup status of a VM by going to VM blade and checking on Backup status from Settings Menu of the blade. Learn more on how to [Check backup status of a VM](backup-azure-vms-first-look-arm.md#configure-the-backup-job-from-the-vm-management-blade)
* Belongs to same region as VM

## Backup
### Will on-demand backup job follow same retention schedule as scheduled backups?
No. You need to specify the retention range for an on-demand backup job. By default, it will be retained for 30 days when triggered from portal. 

### I recently enabled Azure Disk Encryption on some VMs. Will my backups continue to work?
You need to give permissions for Azure Backup service to access Key Vault. You can provide these permissions in PowerShell using steps mentioned in *Enable Backup* section of [PowerShell](backup-azure-vms-automation.md) documentation.

### I migrated disks of a VM to managed disks. Will my backups continue to work?
Yes, backups work seamlessly and no need to re-configure backup. 

## Restore
### How do I decide between restoring disks versus full VM restore?
Think of Azure full VM restore as a way of quick create option for restored VM. Restore VM option will change the names of disks, containers used by disks,public IP addresses, network interface names for uniqueness of resources getting created as part of VM creation.It will also not add the VM to availability set. 

Use restore disks to:
* Customize the VM that gets created from point in time configuration like changing the size from backup configuration
* Add configurations which are not present at the time of backup 
* Control the naming convention for resources getting created
* Add VM to availability set
* You have any configuration which can be achieved only using PowerShell/a declarative template definition

## Manage VM backups
### What happens when I change a backup policy on VM(s)?
When a new policy is applied on VM(s), schedule and retention of the new policy will be followed. If retention is extended, existing recovery points will be marked to keep them as per new policy. If retention is reduced, they are marked for pruning in the next cleanup job and will be deleted. 
