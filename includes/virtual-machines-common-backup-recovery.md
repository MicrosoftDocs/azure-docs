---
 title: include file
 description: include file
 services: virtual-machines
 author: cynthn
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 03/09/2018
 ms.author: cynthn
 ms.custom: include file
---


## Azure Backup

For backing up Azure VMs running production workloads, use Azure Backup. Azure Backup supports application-consistent backups for both Windows and Linux VMs. Azure Backup creates recovery points that are stored in geo-redundant recovery vaults. When you restore from a recovery point, you can restore the whole VM or just specific files. 

For a simple, hands-on introduction to Azure Backup for Azure VMs, see the "Back up Azure virtual machines" tutorial for [Linux](../articles/virtual-machines/linux/tutorial-backup-vms.md) or [Windows](../articles/virtual-machines/windows/tutorial-backup-vms.md).

For more information on how Azure Backup works, see [Plan your VM backup infrastructure in Azure](../articles/backup/backup-azure-vms-introduction.md)


## Azure Site Recovery

Azure Site Recovery protects your VMs from a major disaster scenario, when a whole region experiences an outage due to major natural disaster or widespread service interruption. You can configure Azure Site Recovery for your VMs so that you can recover your application with a single click in matter of minutes. You can replicate to an Azure region of your choice, it is not restricted to paired regions. 

You can run disaster-recovery drills with on-demand test failovers, without affecting your production workloads or ongoing replication. Create recovery plans to orchestrate failover and failback of the entire application running on multiple VMs. The recovery plan feature is integrated with Azure automation runbooks.

You can get started by [replicating your virtual machines](https://aka.ms/a2a-getting-started). 

## Managed snapshots 

In development and test environments, snapshots provide a quick and simple option for backing up VMs that use Managed Disks. A managed snapshot is a read-only full copy of a managed disk. Snapshots exist independent of the source disk and can be used to create new managed disks for rebuilding a VM. They are billed based on the used portion of the disk. For example, if you create a snapshot of a managed disk with provisioned capacity of 64 GB and actual used data size of 10 GB, snapshot will be billed only for the used data size of 10 GB.  

For more information on creating snapshots, see:

* [Create copy of VHD stored as a Managed Disk using Snapshots in Windows](../articles/virtual-machines/windows/snapshot-copy-managed-disk.md)
* [Create copy of VHD stored as a Managed Disk using Snapshots in Linux](../articles/virtual-machines/linux/snapshot-copy-managed-disk.md)



## Next steps
You can try out Azure Backup by following the "Back up Windows virtual machines tutorial" for [Linux](../articles/virtual-machines/linux/tutorial-backup-vms.md) or [Windows](../articles/virtual-machines/windows/tutorial-backup-vms.md).
