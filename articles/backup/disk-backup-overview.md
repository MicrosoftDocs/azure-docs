---
title: Overview of Azure Disk Backup
description: Learn about the Azure Disk backup solution.
ms.topic: conceptual
ms.date: 01/07/2021
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

- Need for frequent backups per day without application being quiescent
- Apps running in a  cluster scenario: both Windows Server Failover Cluster and Linux clusters are writing to shared disks
- Specific need for agentless backup because of security or performance concerns on the application
- Application consistent backup of VM isn't feasible since line-of-business apps don't support Volume Shadow Copy Service (VSS).

Consider Azure Disk Backup in scenarios where:

- a mission-critical application is running on an Azure Virtual machine that demands multiple backups per day to meet the recovery point objective, but without impacting the production environment or application performance
- your organization or industry regulation restricts installing agents because of security concerns
- executing custom pre or post scripts and invoking freeze and thaw on Linux virtual machines to get application-consistent backup puts undue overhead on production workload availability
- containerized applications running on Azure Kubernetes Service (AKS cluster) are using managed disks as persistent storage. Today you have to back up the managed disk via automation scripts that are hard to manage.
- a managed disk is holding critical business data, used as a file-share, or contains database backup files, and you want to optimize backup cost by not investing in Azure VM backup
- You have many Linux and Windows single-disk virtual machines (that is, a virtual machine with just an OS disk and no data disks attached) that host webserver or state-less machines or serves as a staging environment with application configuration settings and     you need a cost efficient backup solution to protect the OS disk. For example, to trigger a quick on-demand backup before upgrading or patching the virtual machine
- a virtual machine is running an OS configuration that is unsupported by Azure VM backup solution (for example, Windows 2008 32-bit Server)

## How the backup and restore process works

- The first step in configuring backup for Azure managed disks is creating a [Backup vault](backup-vault-overview.md). The vault gives you a consolidated view of the backups configured across different workloads.

- Then create a Backup policy that allows you to configure backup frequency and retention duration.

- To configure backup, go to the Backup vault, assign a backup policy, select the managed disk that needs to be backed up and provide a resource group where the snapshots are to be stored and managed. Azure Backup automatically triggers scheduled backup jobs that create an incremental snapshot of the disk according to the backup frequency. Older snapshots are deleted according to the retention duration specified by the backup policy.

- Azure Backup uses [incremental snapshots](../virtual-machines/disks-incremental-snapshots.md#restrictions) of the managed disk. Incremental snapshots are a cost-effective, point-in-time backup of managed disks that are billed for the delta changes to the disk since the last snapshot. They're always stored on the most cost-effective storage, standard HDD storage regardless of the storage type of the parent disks. The first snapshot of the disk will occupy the used size of the disk, and consecutive incremental snapshots store delta changes to the disk since the last snapshot.

- Once you configure the backup of a managed disk, a backup instance will be created within the backup vault. Using the backup instance, you can find health of backup operations, trigger on-demand backups, and perform restore operations. You can also view health of backups across multiple vaults and backup instances using Backup Center, which provides a single pane of glass view.

- To restore, just select the recovery point from which you want to restore the disk. Provide the resource group where the restored disk is to be created from the snapshot. Azure Backup provides an instant restore experience since the snapshots are stored locally in your subscription.

- Backup Vault uses Managed Identity to access other Azure resources. To configure backup of a managed disk and to restore from past backup, Backup Vault’s managed identity requires a set of permissions on the source disk, the snapshot resource group where snapshots are created and managed, and the target resource group where you want to restore the backup. You can grant permissions to the managed identity by using Azure role-based access control (Azure RBAC). Managed identity is a service principal of a special type that may only be used with Azure resources. Learn more about [Managed Identities](../active-directory/managed-identities-azure-resources/overview.md).

- Currently Azure Disk Backup supports operational backup of managed disks and doesn't copy the backups to Backup Vault storage. Refer to the [support matrix](disk-backup-support-matrix.md)for a detailed list of supported and unsupported scenarios, and region availability.

## Pricing

Azure Backup offers a snapshot lifecycle management solution for protecting Azure Disks. The disk snapshots created by Azure Backup are stored in the resource group within your Azure subscription and incur **Snapshot Storage** charges. You can visit [Managed Disk Pricing](https://azure.microsoft.com/pricing/details/managed-disks/) for more details about the snapshot pricing. Because the snapshots aren't copied to the Backup Vault, Azure Backup doesn't charge a **Protected Instance** fee and **Backup Storage** cost doesn't apply. Additionally, incremental snapshots occupy delta changes since the last snapshot and are always stored on standard storage regardless of the storage type of the parent-managed disks and are charged according to the pricing of standard storage. This makes Azure Disk Backup a cost-effective solution.

## Next steps

- [Azure Disk Backup support matrix](disk-backup-support-matrix.md)
