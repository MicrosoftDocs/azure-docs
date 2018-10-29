---
title: Azure VM Backup FAQ
description: 'Answers to common questions about: how Azure VM backup works, limitations and what happens when changes to policy occur'
services: backup
author: trinadhk
manager: shreeshd
keywords: azure vm backup, azure vm restore, backup policy
ms.service: backup
ms.topic: conceptual
ms.date: 8/16/2018
ms.author: trinadhk
---
# Questions about the Azure VM Backup service
This article has answers to common questions to help you quickly understand the Azure VM Backup components. In some of the answers, there are links to the articles that have comprehensive information. You can also post questions about the Azure Backup service in the [discussion forum](https://social.msdn.microsoft.com/forums/azure/home?forum=windowsazureonlinebackup).

## Configure backup
### Do Recovery Services vaults support classic VMs or Resource Manager based VMs? <br/>
Recovery Services vaults support both models.  You can back up a classic VM or a Resource Manager VM to a Recovery Services vault.

### What configurations are not supported by Azure VM backup?
Go through [Supported operating systems](backup-azure-arm-vms-prepare.md#supported-operating-systems-for-backup) and [Limitations of VM backup](backup-azure-arm-vms-prepare.md#limitations-when-backing-up-and-restoring-a-vm)

### Why can't I see my VM in configure backup wizard?
In Configure backup wizard, Azure Backup only lists VMs that are:
  * Not already protected
      You can verify the backup status of a VM by going to VM blade and checking Backup status from Settings Menu . Learn more on how to [Check backup status of a VM](backup-azure-vms-first-look-arm.md#configure-the-backup-job-from-the-vm-operations-menu)
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

### I enabled Resource Group lock on my backed-up managed disk VMs. Will my backups continue to work?
If the user locks the Resource Group, Backup service is not able to delete the older restore points. Due to this new backups start failing as there is a limit of maximum 18 restore points imposed from the backend. If your backups are failing with an internal error after the RG lock, follow these [steps to remove the restore point collection](backup-azure-troubleshoot-vm-backup-fails-snapshot-timeout.md#backup-service-does-not-have-permission-to-delete-the-old-restore-points-due-to-resource-group-lock).

### Does Backup policy take Daylight Saving Time(DST) into account?
No. Be aware that date and time on your local computer is displayed in your local time and with your current daylight saving time bias. So the configured time for scheduled backups can be different from your local time due to DST.

### Maximum of how many data disks can I attach to a VM to be backed up by Azure Backup?
Azure Backup now supports backup of virtual machines with up to 32 disks. To get 32 disk support, [upgrade to Azure VM Backup stack V2](backup-upgrade-to-vm-backup-stack-v2.md). All the VMs enabling protection starting 24th Sept, 2018 will get supported.

### Does Azure backup support Standard SSD managed disk?
Azure Backup supports [Standard SSD Managed Disks](https://azure.microsoft.com/blog/announcing-general-availability-of-standard-ssd-disks-for-azure-virtual-machine-workloads/), a new type of durable storage for Microsoft Azure Virtual machines. It is supported for managed disks on [Azure VM Backup stack V2](backup-upgrade-to-vm-backup-stack-v2.md).

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

### What is the procedure to restore a VM to a restore point taken before the conversion from unmanaged to managed disks was done for a VM?
In this scenario, by default, restore VM job will create a VM with unmanaged disks. To create a VM with managed disks:
1. [Restore to unmanaged disks](tutorial-restore-disk.md#restore-a-vm-disk)
2. [Convert the restored disks to managed disks](tutorial-restore-disk.md#convert-the-restored-disk-to-a-managed-disk)
3. [Create a VM with managed disks](tutorial-restore-disk.md#create-a-vm-from-the-restored-disk) <br>
For PowerShell cmdlets, refer [here](backup-azure-vms-automation.md#restore-an-azure-vm).

### Can I restore the VM if my VM is deleted?
Yes. Life Cycle of VM and its corresponding backup item are different. So, even if you delete the VM, you can go to corresponding backup item in the Recovery Services vault and trigger a restore using one of the recovery points.

## Manage VM backups
### What happens when I change a backup policy on VM(s)?
When a new policy is applied on VM(s), schedule and retention of the new policy is followed. If retention is extended, existing recovery points are marked to keep them as per new policy. If retention is reduced, they are marked for pruning in the next cleanup job and subsequently deleted.

### How can I move a VM enrolled in Azure backup between resource groups?
Follow the below steps to successfully move the backed-up VM to the target resource group
1. Temporarily stop backup and retain backup data
2. Move the VM to the target resource group
3. Re-protect it with same/new vault

Users can restore from the available restore points created before the move operation.
