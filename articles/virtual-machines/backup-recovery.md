---
title: Overview backup options for VMs 
description: Overview backup options for Azure virtual machines.
author: cynthn
ms.service: virtual-machines
ms.subservice: recovery
ms.topic: conceptual
ms.date: 01/12/2023
ms.author: cynthn
---


# Backup and restore options for virtual machines in Azure

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets

You can protect your data by taking backups at regular intervals. There are several backup options available for virtual machines (VMs), depending on your use-case.

## Azure Backup

You'll use Azure Backup for most use-cases involving backup operations on Azure VMs running production workloads. Azure Backup supports application-consistent backups for both Windows and Linux VMs. Azure Backup creates recovery points that are stored in geo-redundant recovery vaults. When you restore from a recovery point, you can restore entire VM or specific files.

For a simple, hands-on introduction to Azure Backup for Azure VMs, see the [Azure Backup quickstart](../backup/quick-backup-vm-portal.md).

For more information on how Azure Backup works, see [Plan your VM backup infrastructure in Azure](../backup/backup-azure-vms-introduction.md)

## Azure Site Recovery

Azure Site Recovery protects your VMs from a major disaster scenario. These scenarios may include widespread service interruptions or regional outages caused by natural disasters. You can configure Azure Site Recovery for your VMs so that your applications are recoverable in matter of minutes with a single click. You can replicate to an Azure region of your choice, since recovery isn't restricted to paired regions.

You can run disaster-recovery drills with on-demand test failovers, without affecting your production workloads or ongoing replication. Create recovery plans to orchestrate failover and failback of the entire application running on multiple VMs. The recovery plan feature is integrated with Azure Automation runbooks.

You can get started by [replicating your virtual machines](../site-recovery/azure-to-azure-quickstart.md).

## Managed snapshots

In development and test environments, snapshots provide a quick and simple option for backing up VMs that use managed disks. A managed snapshot is a full, read-only copy of a managed disk. Snapshots exist independently of their source disks.

Snapshots can be used to create new managed disks when a VM is rebuilt. They're billed based on the used portion of the disk. For example, if you create a snapshot of a managed disk with provisioned capacity of 64 GB and actual used data size of 10 GB, snapshot will be billed only for the used data size of 10 GB.  

For more information on creating snapshots, see:

* [Create copy of VHD stored as a Managed Disk](./windows/snapshot-copy-managed-disk.md)

## Virtual machine restore points

At this time, you can use Azure REST APIs to back up and restore your VMs. This approach is most often used by independent software vendor (ISVs) or organizations with a relatively small number of VMs to manage.

You can use the API to create a VM restore point collection. The restore point collection itself contains individual restore points for specific VMs. Each restore point stores a VM's configuration and a snapshot for each attached managed disk. To save space and costs, you can exclude any disk from your VM restore points.

Once created, VM restore points can then be used to restore individual disks. To restore a VM, restore all relevant disks and attach them to a new VM.

Learn more about [working with VM restore points](virtual-machines-create-restore-points.md) and the [restore point collections](/rest/api/compute/restore-point-collections) API.

## Next steps
You can try out Azure Backup by following the [Azure Backup quickstart](../backup/quick-backup-vm-portal.md).

You can also plan and implement reliability for your virtual machine configuration. For more information see [Virtual Machine Reliability](./reliability-virtual-machines.md).
