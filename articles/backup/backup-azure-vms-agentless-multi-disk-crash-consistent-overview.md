---
title: Agentless Crash-Consistent Azure VM Backup
description: Learn when to use agentless multi-disk crash-consistent backup for Azure VMs, how it compares with application-consistent backup, pricing, and support.
ms.topic: overview
ms.date: 07/25/2025
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As an IT administrator managing Azure VMs, I want to understand when to use agentless multi-disk crash-consistent backup so that I can choose the appropriate backup consistency type for my workload and verify its support and pricing requirements.
---

# What is agentless multi-disk crash-consistent backup for Azure VMs?

Agentless multi-disk crash-consistent backup protects Azure virtual machines (VMs) without relying on the VM agent or snapshot extension. It creates multi-disk [crash-consistent restore points](/azure/virtual-machines/virtual-machines-create-restore-points) and reduces VM I/O quiescing time for performance-sensitive workloads that can tolerate crash-consistent recovery.

With the [Enhanced VM backup policy](backup-azure-vms-enhanced-policy.md), you can configure application-consistent or crash-consistent restore points. For supported VMs, Azure Backup can also retry with a crash-consistent snapshot if an application-consistent snapshot fails.

This article explains when to use agentless crash-consistent backup, its limitations and pricing, and the supported Azure VM configurations.

>[!Note]
>The agentless multi-disk crash consistent VM backup feature is generally available. This release includes changes to billing; see the [pricing details](#pricing-for-agentless-multi-disk-crash-consistent-backup).

## When do I choose crash-consistent backup over application-consistent backup?

Choose to perform crash-consistent backup in the following scenarios:

- If your workload is performance sensitive and can tolerate recovery from crash-consistent backups, crash-consistent backups help quiesce VM I/O for a shorter period during backup. Crash-consistent backup doesn't use Volume Shadow Copy Service (VSS) (for Windows) or *fsfreeze* (for Linux) to avoid the associated quiescing delays. 

- If you don't want to install the [VM Agent](/azure/virtual-machines/extensions/agent-windows) or [snapshot extension](/azure/virtual-machines/extensions/vmsnapshot-windows) required for application-consistent or file-system-consistent snapshots in your Azure VM, use crash-consistent backups for an agentless backup solution.

- If your operating system isn't supported for application or file-system-consistent backup, use crash-consistent backups. Crash-consistent backup is operating system agnostic as it doesn't rely on the VM agent or snapshot extension.

## When do I not use crash-consistent backups?

Don't use crash-consistent backups in the following scenarios:

- Your application can't tolerate recovery from crash-consistent backups.
- You use pre/post scripts for Linux VM backups.
- You use read/write host caching and your workload is sensitive to cached data not being flushed before backup.

## Pricing for agentless multi-disk crash-consistent backup

With general availability of agentless multi-disk crash consistent VM backup, you incur charges based on the size of the backed-up data, as [detailed here](https://azure.microsoft.com/pricing/details/backup/?msockid=229ace64ee9568201c64da31efc769d2). For each VM protected with agentless backup, a protected instance fee applies, similar to application-consistent VM backups. This fee depends on the *VM’s used size*, calculated as **50 percent** of its provisioned size.

## Supported scenarios for agentless multi-disk crash-consistent VM backup

[!INCLUDE [backup-azure-agentless-multi-disk-crash-consistent-vm-backup-support-scenarios.md](../../includes/backup-azure-agentless-multi-disk-crash-consistent-vm-backup-support-scenarios.md)]


>[!Note]
>For disks configured with *read/write* host caching, multi-disk crash consistency can't be guaranteed because writes that occur while the snapshot is taken might not be acknowledged by Azure Storage. If maintaining consistency is crucial, we recommend that you use the application-consistent backups.

## Next steps

[Back up Azure VM with agentless multi-disk crash-consistent backup](backup-azure-vms-agentless-multi-disk-crash-consistent.md)
