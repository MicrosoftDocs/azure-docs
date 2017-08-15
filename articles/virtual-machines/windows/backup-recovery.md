---
title: Overview of backing up and restoring Windows VMs in Azure | Microsoft Docs
description: Overview of protecting your Windows VMs by backing them up using Azure Backup.
services: virtual-machines-windows
documentationcenter: virtual-machines
author: cynthn
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 08/09/2017
ms.author: cynthn
---

# Backup and restore options for Windows virtual machines in Azure
You can protect your data by taking backups at regular intervals. There are several backup options available for VMs, depending on your use-case.


## Azure Backup

For backing up Azure VMs running production workloads, use Azure Backup. Azure Backup supports application-consistent backups for both Windows and Linux VMs.

For a simple, hands-on introduction to Azure Backup for Azure VMs, see [Back up Windows virtual machines in Azure](windows/tutorial-backup-vms.md)

For more information on how Azure Backup works, see [Plan your VM backup infrastructure in Azure](../../backup/backup-azure-vms-introduction.md)


## Managed snapshots 

In development and test environments, snapshots provide a simplified backup option.

A Managed Snapshot is a read-only full copy of a managed disk which is stored as a standard managed disk by default. With snapshots, you can back up your managed disks at any point in time. These snapshots exist independent of the source disk and can be used to create new Managed Disks. They are billed based on the used size. For example, if you create a snapshot of a managed disk with provisioned capacity of 64 GB and actual used data size of 10 GB, snapshot will be billed only for the used data size of 10 GB.  

[Incremental snapshots](storage-incremental-snapshots.md) are currently not supported for Managed Disks, but will be supported in the future.

To learn more about how to create snapshots with Managed Disks, please check out these resources:

* [Create copy of VHD stored as a Managed Disk using Snapshots in Windows](../virtual-machines/windows/snapshot-copy-managed-disk.md)
* [Create copy of VHD stored as a Managed Disk using Snapshots in Linux](../virtual-machines/linux/snapshot-copy-managed-disk.md)

## Azure Site Recovery

Azure Site Recovery protects your VMs from true disaster recovery scenario, when a whole region experiences an outage due to major natural disaster or widespread service interruption. You can configure Azure Site Recovery for your VMs so that you can recover your application with a single click in matter of minutes. You can replicate to Azure region of your choice and not restricted to paired regions. 

Site Recovery provides a simple way to replicate Azure VMs between regions. 

- Automatically creates the required resources in the target region, based on source region settings.
- you can replicate from any region to any region within a continent. Compare this with read-access geo-redundant storage, which replicates asynchronously between standard paired regions only. Read-access geo-redundant storage provides read-only access to the data in the target region.
- Automated continuous replication meands that failover and failback can be triggered with a single click.
- You can run disaster-recovery drills with on-demand test failovers, as and when needed, without affecting your production workloads or ongoing replication.
 - You can use recovery plans to orchestrate failover and failback of the entire application running on multiple VMs. The recovery plan feature has rich first-class integration with Azure automation runbooks.

You can get started by [replicating your virtual machines](https://aka.ms/a2a-getting-started). 



## Storage redundancy

If an entire region experiences a service disruption, the locally redundant copies of your data would temporarily be unavailable. If you have enabled geo-replication, three additional copies of your Azure Storage blobs and tables are stored in a different region. In the event of a complete regional outage or a disaster in which the primary region is not recoverable, Azure remaps all of the DNS entries to the geo-replicated region.


## Next steps

- Start [protecting your applications running on Azure virtual machines](https://aka.ms/a2a-getting-started) using Azure Site Recovery

- To learn more about how to implement a disaster recovery and high availability strategy, see [Disaster recovery and high availability for Azure applications](../resiliency/resiliency-disaster-recovery-high-availability-azure-applications.md).

- To develop a detailed technical understanding of a cloud platform’s capabilities, see [Azure resiliency technical guidance](../resiliency/resiliency-technical-guidance.md).
