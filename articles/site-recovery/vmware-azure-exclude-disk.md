---
title: Exclude VMware VM disks from disaster recovery to Azure with Azure Site Recovery
description: How to exclude VMware VM disks from replication to Azure with Azure Site Recovery.
author: Jeronika-MS
ms.service: azure-site-recovery
ms.topic: how-to
ms.author: v-gajeronika
ms.reviewer: v-gajeronika
ms.date: 02/13/2026

# Customer intent: As a cloud administrator managing VMware VMs, I want to exclude specific disks from replication to Azure, so that I can optimize bandwidth and resource usage during disaster recovery operations.
---

# Exclude disks from VMware VM replication to Azure

This article describes how to exclude disks when replicating VMware VMs to Azure for disaster recovery. You might want to exclude disks from replication for a number of reasons:

- Ensure that unimportant data churned on the excluded disk doesn't get replicated.
- Optimize the consumed replication bandwidth, or the target-side resources, by excluding disks you don't need to replicate.
- Save storage and network resources by not replicating data you don't need.

Before you exclude disks from replication:

- [Learn more](exclude-disks-replication.md) about excluding disks.
- Review [typical exclude scenarios](exclude-disks-replication.md#typical-scenarios) and [examples](exclude-disks-replication.md#example-1-exclude-the-sql-server-tempdb-disk) that show how excluding a disk affects replication, failover, and failback.

## Before you start

 Note the following before you start:

- **Replication**: By default, all disks on a machine are replicated.
- **Disk type**: Only basic disks can be excluded from replication. You can't exclude operating system or dynamic disks.
- **Mobility service**: To exclude a disk from replication, you must manually install the Mobility service on the machine before you enable replication. You can't use the push installation, since this method installs the Mobility service on a VM only after replication is enabled.  
- **Add, remove, or exclude disks**: After you enable replication, you can't add, remove, or exclude disks for replication. If you want to add, remove, or exclude disks, you need to disable protection for the machine and then enable it again.
- **Failover**: After failover, if failed over apps need excluded disks in order to work, you need to create those disks manually. Alternatively, you can integrate Azure automation into a recovery plan, to create the disk during failover of the machine.
- **Failback-Windows**: When you fail back to your on-premises site after failover, Windows disks that you create manually in Azure aren't failed back. For example, if you fail over three disks and create two disks directly on Azure VMs, only the three disks that were failed over are failed back.
- **Failback-Linux**: For failback of Linux machines, disks that you create manually in Azure are failed back. For example, if you fail over three disks and create two disks directly on Azure VMs, all five are failed back. You can't exclude disks that were created manually in the failback, or in reprotection of VMs.



## Exclude disks from replication

1. When you [enable replication](./hyper-v-azure-tutorial.md) for a VMware VM, after selecting the VMs that you want to replicate, review the **Disks to Replicate** column in the **Enable replication** > **Properties** > **Configure properties** page. By default, all disks are selected for replication.
1. If you don't want to replicate a specific disk, clear the selection for any disks you want to exclude. 

    :::image type="content" source="./media/vmware-azure-exclude-disk/enable-replication-exclude-disk1.png" alt-text="Exclude disks from replication.":::



## Next steps
After your deployment is set up and running, [learn more](failover-failback-overview.md) about different types of failover.
