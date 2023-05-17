---
title: Exclude Hyper-V VM disks from disaster recovery to Azure with Azure Site Recovery 
description: How to exclude Hyper-V VM disks from replication to Azure with Azure Site Recovery.
author: ankitaduttaMSFT
manager: rochakm
ms.service: site-recovery
ms.topic: conceptual
ms.author: ankitadutta
ms.date: 11/12/2019
---

# Exclude disks from replication

This article describes how to exclude disks when replicating Hyper-V VMs to Azure. You might want to exclude disks from replication for a number of reasons:

- Ensure that unimportant data churned on the excluded disk doesn't get replicated.
- Optimize the consumed replication bandwidth, or the target-side resources, by excluding disks you don't need to replicate.
- Save storage and network resources by not replicating data you don't need.

Before you exclude disks from replication:

- [Learn more](exclude-disks-replication.md) about excluding disks.
- Review [typical exclude scenarios](exclude-disks-replication.md#typical-scenarios) and [examples](exclude-disks-replication.md#example-1-exclude-the-sql-server-tempdb-disk) that show how excluding a disk affects replication, failover, and failback.

## Before you start

Note the following before you start:

- **Replication**: By default all disks on a machine are replicated.
- **Disk type**:
    - You can exclude basic disks from replication.
    - You can't exclude operating system disks.
    - We recommend that you don't exclude dynamic disks. Site Recovery can't identify which VHD is basic or dynamic in the guest VM.  If you don't exclude all dependent dynamic volume disks, the protected dynamic disk becomes a failed disk on a failed over VM, and the data on that disk isn't accessible.
- **Add/remove/exclude disks**: After you enable replication, you can't add/remove/exclude disks for replication. If you want to add/remove or exclude a disk, you need to disable protection for the VM, and then enable it again.
- **Failover**: After failover, if failed over apps need exclude disks in order to work, you need to create those disks manually. Alternatively, you can integrate Azure automation into a recovery plan, to create the disk during failover of the machine.
- **Failback**: When you fail back to your on-premises site after failover, disks that you created manually in Azure aren't failed back. For example, if you fail over three disks and create two disks directly on an Azure VM, only three disks that were failed over are then failed back. You can't include disks that were created manually in failback, or in reverse replication of VMs.

## Exclude disks

1. To exclude disks when you [enable replication](./hyper-v-azure-tutorial.md) for a Hyper-V VM, after selecting the VMs you want to replicate, in the **Enable replication** > **Properties** > **Configure properties** page, review the **Disks to Replicate** column. By default all disks are selected for replication.
2. If you don't want to replicate a specific disk, in **Disks to replicate** clear the selection for any disks you want to exclude. 

    ![Exclude disks from replication](./media/hyper-v-exclude-disk/enable-replication6-with-exclude-disk.png)


## Next steps
After your deployment is set up and running, [learn more](failover-failback-overview.md) about different types of failover.
