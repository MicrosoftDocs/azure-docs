---
title: About agentless multi-disk crash-consistent backup for Azure Virtual Machines by using Azure Backup
description: Learn about agentless multi-disk crash-consistent backup for Azure VMs by using Azure Backup via Azure portal.
ms.topic: overview
ms.date: 09/11/2024
author: jyothisuri
ms.author: jsuri
---

# About agentless multi-disk crash-consistent backup for Azure VMs (preview)

Azure Backup supports agentless VM backups by using multi-disk [crash-consistent restore points](/azure/virtual-machines/virtual-machines-create-restore-points) (preview). The [Enhanced VM backup policy](backup-azure-vms-enhanced-policy.md) now enables you to configure the consistency type of the backups (application-consistent restore points or crash-consistent restore points preview) for Azure VMs. This feature also enables Azure VM backup to retry the backup operation with *crash-consistent snapshots* (for *supported VMs*) if the application-consistent snapshot fails. 

## When do I choose crash-consistent backup over application-consistent backup?

Choose to perform crash-consistent backup in the following scenarios:

- If your workload is performance sensitive and can tolerate recovery from crash-consistent backups, crash-consistent backups help quiesce VM I/O for a shorter period during backup. Crash-consistent backup doesn't use Volume Shadow Copy Service (VSS) (for Windows) or *fsfreeze* (for Linux) to avoid the associated quiescing delays. 

- If you don't want to install the [VM Agent](/azure/virtual-machines/extensions/agent-windows) or [snapshot extension](/azure/virtual-machines/extensions/vmsnapshot-windows) required for application-consistent or file-system-consistent snapshots in your Azure VM, use crash-consistent backups for an agentless backup solution.

- If your operating system is not supported for application or file-system-consistent backup, use crash-consistent backups. Crash-consistent backup is operating system agnostic as it doesn't rely on the VM agent or snapshot extension.

## When do I not use crash-consistent backups?

Don't use crash-consistent backups in the following scenarios:

- If your application can't tolerate recovery from crash-consistent backups.
- If you use pre/post scripts for Linux VM backups.
- If you use read/write host caching and your workload is sensitive to cached data not being flushed before backup.

## Pricing for agentless multi-disk crash-consistent backup

During preview, Azure VMs backed up with multi-disk crash-consistent type is charged for 0.5 protected instance (PI) and the backup storage consumed.

## Supported scenarios for agentless multi-disk crash-consistent VM backup (preview)

[!INCLUDE [backup-azure-agentless-multi-disk-crash-consistent-vm-backup-support-scenarios.md](../../includes/backup-azure-agentless-multi-disk-crash-consistent-vm-backup-support-scenarios.md)]


>[!Note]
>For disks configured with *read/write* host caching, multi-disk crash consistency can't be guaranteed because writes that occur while the snapshot is taken might not be acknowledged by Azure Storage. If maintaining consistency is crucial, we recommend that you use the application-consistent backups.

## Next steps

[Back up Azure VM with agentless multi-disk crash-consistent backup (preview)](backup-azure-vms-agentless-multi-disk-crash-consistent.md)
