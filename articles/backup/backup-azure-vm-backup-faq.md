---
title: FAQ - Backing up Azure VMs
description: In this article, discover answers to common questions about backing up Azure VMs with the Azure Backup service.
ms.reviewer: sogup
ms.topic: conceptual
ms.date: 09/17/2019
---
# Frequently asked questions-Back up Azure VMs

This article answers common questions about backing up Azure VMs with the [Azure Backup](backup-introduction-to-azure-backup.md) service.

## Backup

### Which VM images can be enabled for backup when I create them?

When you create a VM, you can enable backup for VMs running [supported operating systems](backup-support-matrix-iaas.md#supported-backup-actions)

### Is the backup cost included in the VM cost?

No. Backup costs are separate from a VM's costs. Learn more about [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/).

### Which permissions are required to enable backup for a VM?

If you're a VM contributor, you can enable backup on the VM. If you're using a custom role, you need the following permissions to enable backup on the VM:

- Microsoft.RecoveryServices/Vaults/write
- Microsoft.RecoveryServices/Vaults/read
- Microsoft.RecoveryServices/locations/*
- Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/*/read
- Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/read
- Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/write
- Microsoft.RecoveryServices/Vaults/backupFabrics/backupProtectionIntent/write
- Microsoft.RecoveryServices/Vaults/backupPolicies/read
- Microsoft.RecoveryServices/Vaults/backupPolicies/write

If your Recovery Services vault and VM have different resource groups, make sure you have write permissions in the resource group for the Recovery Services vault.  

### Does an on-demand backup job use the same retention schedule as scheduled backups?

No. Specify the retention range for an on-demand backup job. By default, it's retained for 30 days when triggered from the portal.

### I recently enabled Azure Disk Encryption on some VMs. Will my backups continue to work?

Provide permissions for Azure Backup to access Key Vault. Specify the permissions in PowerShell as described in the **Enable backup** section in the [Azure Backup PowerShell](backup-azure-vms-automation.md) documentation.

### I migrated VM disks to managed disks. Will my backups continue to work?

Yes, backups work seamlessly. There's no need to reconfigure anything.

### Why can't I see my VM in the Configure Backup wizard?

The wizard only lists VMs in the same region as the vault, and that aren't already being backed up.

### My VM is shut down. Will an on-demand or a scheduled backup work?

Yes. Backups run when a machine is shut down. The recovery point is marked as crash consistent.

### Can I cancel an in-progress backup job?

Yes. You can cancel backup job in a **Taking snapshot** state. You can't cancel a job if data transfer from the snapshot is in progress.

### I enabled lock on resource group created by Azure Backup Service (i.e `AzureBackupRG_<geo>_<number>`), will my backups continue to work?

If you lock the resource group created by Azure Backup Service, backups will start to fail as there's a maximum limit of 18 restore points.

User needs to remove the lock and clear the restore point collection from that resource group in order to make the future backups successful, [follow these steps](backup-azure-troubleshoot-vm-backup-fails-snapshot-timeout.md#clean-up-restore-point-collection-from-azure-portal) to remove the restore point collection.

### Does Azure backup support standard SSD-managed disks?

Yes, Azure Backup supports [standard SSD managed disks](https://azure.microsoft.com/blog/announcing-general-availability-of-standard-ssd-disks-for-azure-virtual-machine-workloads/).

### Can we back up a VM with a Write Accelerator (WA)-enabled disk?

Snapshots can't be taken on the WA-enabled disk. However, the Azure Backup service can exclude the WA-enabled disk from backup.

### I have a VM with Write Accelerator (WA) disks and SAP HANA installed. How do I back up?

Azure Backup can't back up the WA-enabled disk but can exclude it from backup. However, the backup won't provide database consistency because information on the WA-enabled disk isn't backed up. You can back up disks with this configuration if you want operating system disk backup, and backup of disks that aren't WA-enabled.

We're running private preview for an SAP HANA backup with an RPO of 15 minutes. It's built in a similar way to SQL DB backup, and uses the backInt interface for third-party solutions certified by SAP HANA. If you're interested, email us at `AskAzureBackupTeam@microsoft.com` with the subject **Sign up for private preview for backup of SAP HANA in Azure VMs**.

### What is the maximum delay I can expect in backup start time from the scheduled backup time I have set in my VM backup policy?

The scheduled backup will be triggered within 2 hours of the scheduled backup time. For example, If 100 VMs have their backup start time scheduled at 2:00 AM, then by maximum 4:00 AM all the 100 VMs will have backup job in progress. If scheduled backups have been paused due to outage and resumed/retried, then backup can start outside of this scheduled two-hour window.

### What is the minimum allowed retention range for daily backup point?

Azure Virtual Machine backup policy supports a minimum retention range of seven days up to 9999 days. Any modification to an existing VM backup policy with less than seven days will require an update to meet the minimum retention range of seven days.

### Can I backup or restore selective disks attached to a VM?

Azure Backup now supports selective disk backup and restore using the Azure Virtual Machine backup solution.

Today, Azure Backup supports backing up all the disks (Operating System and data) in a VM together using the Virtual Machine backup solution. With exclude-disk functionality, you get an option to backup one or a few from the many data disks in a VM. This provides an efficient and cost-effective solution for your backup and restore needs. Each recovery point contains data of the disks included in the backup operation, which further allows you to have a subset of disks restored from the given recovery point during the restore operation. This applies to restore both from the snapshot and the vault.

This solution is particularly useful in the following scenarios:
  
1. You have critical data to be backed up in only one disk and you don’t want to back up the rest of the disks attached to a VM. This minimizes the backup storage costs.  
2. You have other backup solutions for part of your VM data. For example, you back up your databases or data with a different workload backup solution, and you want to use Azure VM level backup for the rest of your disks and data to build an efficient and robust system utilizing the best capabilities available.

To sign up for the preview, write to us at AskAzureBackupTeam@microsoft.com

## Restore

### How do I decide whether to restore disks only or a full VM?

Think of a VM restore as a quick create option for an Azure VM. This option changes disk names, containers used by the disks, public IP addresses, and network interface names. The change maintains unique resources when a VM is created. The VM isn't added to an availability set.

You can use the restore disk option if you want to:

- Customize the VM that gets created. For example, change the size.
- Add configuration settings that weren't there at the time of backup.
- Control the naming convention for resources that are created.
- Add the VM to an availability set.
- Add any other setting that must be configured using PowerShell or a template.

### Can I restore backups of unmanaged VM disks after I upgrade to managed disks?

Yes, you can use backups taken before disks were migrated from unmanaged to managed.

### How do I restore a VM to a restore point before the VM was migrated to managed disks?

The restore process remains the same. If the recovery point is of a point-in-time when VM had unmanaged disks, you can [restore disks as unmanaged](tutorial-restore-disk.md#unmanaged-disks-restore). If the VM had managed disks then, you can [restore disks as managed disks](tutorial-restore-disk.md#managed-disk-restore). Then you can [create a VM from those disks](tutorial-restore-disk.md#create-a-vm-from-the-restored-disk).

[Learn more](backup-azure-vms-automation.md#restore-an-azure-vm) about doing this in PowerShell.

### Can I restore the VM that's been deleted?

Yes. Even if you delete the VM, you can go to corresponding backup item in the vault and restore from a recovery point.

### How to restore a VM to the same availability sets?

For Managed Disk Azure VM, restoring to the availability sets is enabled by providing an option in template while restoring as managed Disks. This template has the input parameter called **Availability sets**.

### How do we get faster restore performances?

[Instant Restore](backup-instant-restore-capability.md) capability helps in faster backups and instant restores from the snapshots.

### What happens when we change the key vault settings for the encrypted VM?

After you change the KeyVault settings for the encrypted VM, backups will continue to work with the new set of details. However, after the restore from a recovery point prior to the change, you will have to restore the secrets in a KeyVault before you can create the VM from it. For more information, refer this [article](https://docs.microsoft.com/azure/backup/backup-azure-restore-key-secret)

Operations like secret/key roll-over do not require this step and the same KeyVault can be used after restore.

### Can I access the VM once restored due to a VM having broken relationship with domain controller?

Yes, you access the VM once restored due to a VM having broken relationship with domain controller. For more information, refer this [article](https://docs.microsoft.com/azure/backup/backup-azure-arm-restore-vms#post-restore-steps)

## Manage VM backups

### What happens if I modify a backup policy?

The VM is backed up using the schedule and retention settings in the modified or new policy.

- If retention is extended, existing recovery points are marked and kept in accordance with the new policy.
- If retention is reduced, recovery points are marked for pruning in the next cleanup job, and subsequently deleted.

### How do I move a VM backed up by Azure Backup to a different resource group?

1. Temporarily stop the backup, and retain backup data.
2. Move the VM to the target resource group.
3. Re-enabled backup in the same or new vault.

You can restore the VM from available restore points that were created before the move operation.

### Is there a limit on number of VMs that can be associated with a same backup policy?

Yes, there is a limit of 100 VMs that can be associated to the same backup policy from portal. We recommend that for more than 100 VMs, create multiple backup policies with same schedule or different schedule.
