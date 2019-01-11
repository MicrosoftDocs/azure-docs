---
title: Azure VM Backup FAQ
description: 'Answers to common questions about: how Azure VM backup works, limitations and what happens when changes to policy occur'
services: backup
author: trinadhk
manager: shreeshd
ms.service: backup
ms.topic: conceptual
ms.date: 8/16/2018
ms.author: trinadhk
---
# Frequently asked questions-Azure Backup

This article answers common questions about the [Azure Backup](backup-introduction-to-azure-backup.md) service.

## General questions


### What Azure VMs can you back up using Azure Backup?
[Review](backup-azure-arm-vms-prepare.md#before-you-start) supported operating systems and limitations.



## Backup

### Does an on-demand backup job use the same retention schedule as scheduled backups?
No. You should specify the retention range for an on-demand backup job. By default, it's retained for 30 days when triggered from the portal.

### I recently enabled Azure Disk Encryption on some VMs. Will my backups continue to work?
You need to provide permissions for Azure Backup to access Key Vault. Specify the permissions in PowerShell as described in the **Enable backup** section in the [Azure Backup PowerShell](backup-azure-vms-automation.md) documentation.

### I migrated VM disks to managed disks. Will my backups continue to work?
Yes, backups work seamlessly. There's no need to reconfigure anything.

### Why can't I see my VM in the Configure Backup wizard?
The wizard only lists VMs in the same region as the vault, and that aren't already being backed up.


### My VM is shut down. Will an on-demand or a scheduled backup work?
Yes. Backups run when a machine is shut down. The recovery point is marked as crash consistent.

### Can I cancel an in-progress backup job?
Yes. You can cancel backup job in a **Taking snapshot** state. You can't cancel a job if data transfer from the snapshot is in progress.

### I enabled resource group lock on my backed-up managed disk VMs. Will my backups continue to work?
If you lock the resource group, Azure Backup service can't delete the older restore points.
- New backups will start to fail as there's a maximum limit of 18 restore points.
- If backups fail with an internal error after the lock,  [follow these steps](backup-azure-troubleshoot-vm-backup-fails-snapshot-timeout.md#clean-up-restore-point-collection-from-azure-portal) to remove the restore point collection.

### Does the backup policy consider Daylight Saving Time (DST)?
No. The date and time on your local computer is local with current daylight savings applied. The time set for scheduled backups might differ from the local time due to DST.

### How many data disks can I attach to a VM backed up by Azure Backup?
Azure Backup can back up VMs with up to 16 disks. Support for 16 disks is provided in the [Instant Restore](backup-instant-restore-capability.md).

### Does Azure backup support standard SSD managed disk?
Azure Backup supports [standard SSD managed disks](https://azure.microsoft.com/blog/announcing-general-availability-of-standard-ssd-disks-for-azure-virtual-machine-workloads/). SSD managed disks provide a new type of durable storage for Azure VMs. Support for SSD managed disks is provided in the [Instant Restore](backup-instant-restore-capability.md).

### Can we back up a VM with a Write Accelerator (WA)-enabled disk?
Snapshots can't be taken on the WA-enabled disk. However, the Azure Backup service can exclude the WA-enabled disk from backup. Disk exclusion for VMs with WA-enabled disks is supported only for subscriptions upgraded to Instant Restore.

### I have a VM with Write Accelerator (WA) disks and SAP HANA installed. How do I back up?
Azure Backup can't back up the WA-enabled disk but can exclude it from backup. However, the backup won't provide database consistency because information on the WA-enabled disk isn't backed up. You can back up disks with this configuration if you want operating system disk backup, and backup of disks that aren't WA-enabled.

We do have a private preview for an SAP HANA backup with an RPO of 15 minutes. It's built in a similar way to SQL DB backup, and uses the backInt interface for third-party solutions certified by SAP HANA. If you're interested in the private preview, email us at ` AskAzureBackupTeam@microsoft.com ` with the subject **Sign up for private preview for backup of SAP HANA in Azure VMs**.


## Restore

### How do I decide whether to restore disks only or a full VM?
Think of a VM restore as a quick create option for an Azure VM. This option changes disk names, containers used by the disks, public IP addresses and network interface names. The change maintains unique resources when a VM is created. The VM isn't added to an availability set.

The restore disk option if you want to:
  * Customize the VM that gets created. For example change the size.
  * Add configuration settings which weren't there at the time of backup
  * Control the naming convention for resources that are created.
  * Add the VM to an availability set.
  * Add any other setting that must be configured using PowerShell or a template.  w

### Can I restore backups of unmanaged VM disks after I upgrade to managed disks?
Yes, you can use backups taken before disks were migrated from unmanaged to managed.
- By default, a restore VM job creates an unmanaged VM.
- However, you can restore disks and use them to create a managed VM.

### How do I restore a VM to a restore point before the VM was migrated to managed disks?
By default, a restore VM job creates a VM with unmanaged disks. To create a VM with managed disks:
1. [Restore to unmanaged disks](tutorial-restore-disk.md#restore-a-vm-disk).
2. [Convert the restored disks to managed disks](tutorial-restore-disk.md#convert-the-restored-disk-to-a-managed-disk).
3. [Create a VM with managed disks](tutorial-restore-disk.md#create-a-vm-from-the-restored-disk).

[Learn more](backup-azure-vms-automation.md#restore-an-azure-vm) about doing this in PowerShell.

### Can I restore the VM that's been deleted?
Yes. Even if you delete the VM, you can go to corresponding backup item in the vault and restore from a recovery point.

### How to restore a VM to the same availability sets?
For Managed Disk Azure VM, restoring to the availability sets is enabled by providing an option in template while restoring as managed Disks. This template has the input parameter called **Availability sets**.

### How do we get faster restore performances?
For faster restore performance, we are moving to [Instant Restore](backup-instant-restore-capability.md) capability.

## Manage VM backups

### What happens if I modify a backup policy?
The VM is backed up using the schedule and retention settings in the modified or new policy.

- If retention is extended, existing recovery points are marked and kept in accordance with the new policy.
- If retention is reduced, recovery points are marked for pruning in the next cleanup job, and subsequently deleted.

### How do I move a VM backed up by Azure Backup to a different resource group?

1. Temporarily stop the backup, and retain backup data.
2. Move the VM to the target resource group.
3. Reenabled backup in the same or new vault.

You can restore the VM from available restore points that were created before the move operation.
