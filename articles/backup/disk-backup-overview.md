---
title: Overview of Azure Disk Backup
description: Learn about the Azure Disk backup solution.
ms.topic: conceptual
ms.date: 07/21/2023
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Overview of Azure Disk Backup

Azure Disk Backup is a native, cloud-based backup solution that protects your data in managed disks. It's a simple, secure, and cost-effective solution that enables you to configure protection for managed disks in a few steps. It assures that you can recover your data in a disaster scenario.

Azure Disk Backup offers a turnkey solution that provides snapshot lifecycle management for managed disks by automating periodic creation of snapshots and retaining it for configured duration using backup policy. You can manage the disk snapshots with zero infrastructure cost and without the need for custom scripting or any management overhead. This is a crash-consistent backup solution that takes point-in-time backup of a managed disk using [incremental snapshots](../virtual-machines/disks-incremental-snapshots.md) with support for multiple backups per day. It's also an agent-less solution and doesn't impact production application performance. It supports backup and restore of both OS and data disks (including shared disks), whether or not they're currently attached to a running Azure virtual machine.

If you require application-consistent backup of virtual machine including the data disks, or an option to restore an entire virtual machine from backup, restore a file or folder, or restore to a secondary region, then use the [Azure VM backup](backup-azure-vms-introduction.md) solution. Azure Backup offers side-by-side support for backup of managed disks using Disk Backup in addition to [Azure VM backup](./backup-azure-vms-introduction.md) solutions. This is useful when you need once-a-day application consistent backups of virtual machines and also more frequent backups of OS disks or a specific data disk that are crash consistent, and don't impact the production application performance.

Azure Disk Backup is integrated into Backup Center, which provides a **single unified management experience** in Azure for enterprises to govern, monitor, operate, and analyze backups at scale.

## Key benefits of Disk Backup

Azure Disk backup is an agentless and crash consistent solution that uses [incremental snapshots](../virtual-machines/disks-incremental-snapshots.md) and offers the following advantages:

- More frequent and quick backups without interrupting the virtual machine.
- Doesn't affect the performance of the production application.
- No security concerns since it doesn't require running custom scripts or installing agents.
- A cost-effective solution to back up specific disks when compared to backing up entire virtual machine.

Azure Disk backup solution is useful in the following scenarios:

- Need for frequent backups per day without application being quiescent.
- Apps running in a  cluster scenario: both Windows Server Failover Cluster and Linux clusters are writing to shared disks.
- Specific need for agentless backup because of security or performance concerns on the application.
- Application consistent backup of VM isn't feasible since line-of-business apps don't support Volume Shadow Copy Service (VSS).

Consider Azure Disk Backup in scenarios where:

- A mission-critical application is running on an Azure Virtual machine that demands multiple backups per day to meet the recovery point objective, but without impacting the production environment or application performance.
- Your organization or industry regulation restricts installing agents because of security concerns.
- Executing custom pre or post scripts and invoking freeze and thaw on Linux virtual machines to get application-consistent backup puts undue overhead on production workload availability.
- Containerized applications running on Azure Kubernetes Service (AKS cluster) are using managed disks as persistent storage. Today, you must back up the managed disk via automation scripts that are hard to manage.
- A managed disk is holding critical business data, used as a file-share, or contains database backup files, and you want to optimize backup cost by not investing in Azure VM backup.
- You have many Linux and Windows single-disk virtual machines (that is, a virtual machine with just an OS disk and no data disks attached) that host web server, state-less machines, or serves as a staging environment with application configuration settings, and you need a cost efficient backup solution to protect the OS disk. For example, to trigger a quick on-demand backup before upgrading or patching the virtual machine.
- A virtual machine is running an OS configuration that is unsupported by Azure VM backup solution (for example, Windows 2008 32-bit Server).

## How the backup and restore process works

- The first step in configuring backup for Azure Managed Disks is creating a [Backup vault](backup-vault-overview.md). The vault gives you a consolidated view of the backups configured across different workloads. Azure Disk backup supports only Operational Tier backup. Copying of backups to the vault storage tier is not supported. So, the Backup vault storage redundancy setting (LRS/GRS) doesn't apply to the backups stored in Operational Tier.

- Then create a Backup policy that allows you to configure backup frequency and retention duration.

- To configure backup, go to the Backup vault, assign a backup policy, select the managed disk that needs to be backed up and provide a resource group where the snapshots are to be stored and managed. Azure Backup automatically triggers scheduled backup jobs that create an incremental snapshot of the disk according to the backup frequency. Older snapshots are deleted according to the retention duration specified by the backup policy.

- Azure Backup uses [incremental snapshots](../virtual-machines/disks-incremental-snapshots.md#restrictions) of the managed disk. Incremental snapshots are a cost-effective, point-in-time backup of managed disks that are billed for the delta changes to the disk since the last snapshot. These are always stored on the most cost-effective storage, standard HDD storage regardless of the storage type of the parent disks. The first snapshot of the disk will occupy the used size of the disk, and consecutive incremental snapshots store delta changes to the disk since the last snapshot. Azure Backup automatically assigns tag to the snapshots it creates to uniquely identify them. 

- Once you configure the backup of a managed disk, a backup instance will be created within the backup vault. Using the backup instance, you can find health of backup operations, trigger on-demand backups, and perform restore operations. You can also view health of backups across multiple vaults and backup instances using Backup Center, which provides a single pane of glass view.

- To restore, just select the recovery point from which you want to restore the disk. Provide the resource group where the restored disk is to be created from the snapshot. Azure Backup provides an instant restore experience since the snapshots are stored locally in your subscription.

- Backup Vault uses Managed Identity to access other Azure resources. To configure backup of a managed disk and to restore from past backup, Backup Vault’s managed identity requires a set of permissions on the source disk, the snapshot resource group where snapshots are created and managed, and the target resource group where you want to restore the backup. You can grant permissions to the managed identity by using Azure role-based access control (Azure RBAC). Managed identity is a service principal of a special type that may only be used with Azure resources. Learn more about [Managed Identities](../active-directory/managed-identities-azure-resources/overview.md).

- Currently Azure Disk Backup supports operational backup of managed disks and doesn't copy the backups to Backup Vault storage. Refer to the [support matrix](disk-backup-support-matrix.md) for a detailed list of supported and unsupported scenarios, and region availability.

## How does the disk backup scheduling and retention period work?

Azure Disk Backup currently supports only the Operational Tier, which helps store backups as Disk Snapshots in your tenant that aren't moved to the vault. The backup policy defines the schedule and retention period of your backups in the Operational Tier (when the snapshots will be taken and how long they will be retained).

By using the Azure Disk backup policy, you can define the backup schedule with Hourly frequency of 1, 2, 4, 6, 8, or 12 hours and Daily frequency. Although backups have scheduled timing as per the policy, there can be a difference in the actual start time of the backups from the scheduled one.

The retention period of snapshots is governed by the snapshot limit for a disk. Currently, a maximum of 500 snapshots can be retained for a disk. If the limit is reached, no new snapshots can be taken, and you need to delete the older snapshots. 

The retention period for a backup also follows the maximum limit of 450 snapshots with 50 snapshots kept aside for on-demand backups.

For example, if the scheduling frequency for backups is set as Daily, then you can set the retention period for backups at a maximum value of 450 days. Similarly, if the scheduling frequency for backups is set as Hourly with a 1-hour frequency, then you can set the retention for backups at a maximum value of 18 days. 

## Pricing

Azure Backup uses [incremental snapshots](../virtual-machines/disks-incremental-snapshots.md) of the managed disk. Incremental snapshots are charged per GiB of the storage occupied by the delta changes since the last snapshot. For example, if you're using a managed disk with a provisioned size of 128 GiB, with 100 GiB used, the first incremental snapshot is billed only for the used size of 100 GiB. 20 GiB of data is added on the disk before you create the second snapshot. Now, the second incremental snapshot is billed for only 20 GiB. 

Incremental snapshots are always stored on standard storage, irrespective of the storage type of parent-managed disks, and are charged based on  the pricing of standard storage. For example, incremental snapshots of a Premium SSD-Managed Disk are stored on standard storage. By default, they are stored on ZRS  in regions that support ZRS. Otherwise, they are stored on locally redundant storage (LRS). The per GiB pricing of both the options, LRS and ZRS, is the same. 

The snapshots created by Azure Backup are stored in the resource group within your Azure subscription and incur Snapshot Storage charges. For more details about the snapshot pricing, see [Managed Disk Pricing](https://azure.microsoft.com/pricing/details/managed-disks/). Because the snapshots aren't copied to the Backup Vault, Azure Backup doesn't charge a Protected Instance fee and Backup Storage cost doesn't apply. 

The number of recovery points is determined by the Backup policy used to configure backups of the disk backup instances. Older block blobs are deleted according to the garbage collection process as the corresponding older recovery points are pruned.

## Next steps

[Azure Disk Backup support matrix](disk-backup-support-matrix.md)
