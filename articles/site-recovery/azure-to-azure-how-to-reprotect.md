---
title: Reprotect Azure virtual machines to the primary region with Azure Site Recovery
description: Describes how to reprotect Azure virtual machines after failover, the secondary to primary region, using Azure Site Recovery.
services: site-recovery
author: ankitaduttaMSFT
ms.service: site-recovery
ms.topic: tutorial
ms.date: 05/23/2024
ms.author: ankitadutta
---

# Reprotect failed over Azure virtual machines to the primary region

When you [fail over](site-recovery-failover.md) Azure virtual machines from one region to another using [Azure Site Recovery](site-recovery-overview.md), the virtual machines boot up in the secondary region, in an **unprotected** state. If you want to fail back the virtual machines to the primary region, do the following tasks:

1. Reprotect the virtual machines in the secondary region, so that they start to replicate to the primary region.
1. After reprotection completes and the virtual machines are replicating, you can fail over from the secondary to primary region.

## Prerequisites

- The virtual machine failover from the primary to secondary region must be committed.
- The primary target site should be available, and you should be able to access or create resources in that region.

## Reprotect a virtual machine

1. In **Vault** > **Replicated items**, right-click the failed over virtual machine, and select **Re-Protect**. The reprotection direction should show from secondary to primary.

   :::image type="content" source="./media/site-recovery-how-to-reprotect-azure-to-azure/reprotect.png" alt-text="Screenshot shows a virtual machine with a contextual menu with Re-protect selected." lightbox="./media/site-recovery-how-to-reprotect-azure-to-azure/reprotect.png":::

1. Review the resource group, network, storage, and availability sets. Then select **OK**. If there are any resources marked as new, they're created as part of the reprotection process.
1. The reprotection job seeds the target site with the latest data. After the job finishes, delta replication takes place. Then, you can fail over back to the primary site. You can select the storage account or the network you want to use during reprotect, using the customize option.

   :::image type="content" source="./media/site-recovery-how-to-reprotect-azure-to-azure/customize.png" alt-text="Screenshot displays Customize option on the Azure portal." lightbox="./media/site-recovery-how-to-reprotect-azure-to-azure/customize.png":::

### Customize reprotect settings

You can customize the following properties of the target virtual machine during reprotection.

:::image type="content" source="./media/site-recovery-how-to-reprotect-azure-to-azure/customizeblade.png" alt-text="Screenshot displays Customize on the Azure portal." lightbox="./media/site-recovery-how-to-reprotect-azure-to-azure/customizeblade.png":::

|Property |Notes  |
|---------|---------|
|Target resource group | Modify the target resource group in which the virtual machine is created. As the part of reprotection, the target virtual machine is deleted. When you reprotect a failed over virtual machine to the source virtual machine, the target resource group can't be changed. |
|Target virtual network | The target network can't be changed during the reprotect job. To change the network, redo the network mapping. |
|Capacity reservation | Configure a capacity reservation for the virtual machine. You can create a new capacity reservation group to reserve capacity or select an existing capacity reservation group. [Learn more](azure-to-azure-how-to-enable-replication.md#enable-replication) about capacity reservation. |
|Target storage (Secondary virtual machine doesn't use managed disks) | You can change the storage account that the virtual machine uses after failover. |
|Replica managed disks (Secondary virtual machine uses managed disks) | Site Recovery creates replica managed disks in the primary region to mirror the secondary virtual machine's managed disks. |
|Cache storage | You can specify a cache storage account to be used during replication. By default, a new cache storage account is created, if it doesn't exist. </br>By default, type of storage account (Standard storage account or Premium Block Blob storage account) that you have selected for the source virtual machine in original primary location is used. For example, during replication from original source to target, if you have selected *High Churn*, during re-protection back from target to original source, Premium Block blob will be used by default. You can configure and change it for re-protection. For more information, see [Azure virtual machine Disaster Recovery - High Churn Support](./concepts-azure-to-azure-high-churn-support.md).|
|Availability set | If the virtual machine in the secondary region is part of an availability set, you can choose an availability set for the target virtual machine in the primary region. By default, Site Recovery tries to find the existing availability set in the primary region, and use it. During customization, you can specify a new availability set. |

### What happens during reprotection?

By default, the following occurs:

1. A cache storage account is created in the region where the failed over virtual machine is running.
1. If the target storage account (the original storage account in the primary region) doesn't exist, a new one is created. The assigned storage account name is the name of the storage account used by the secondary virtual machine, suffixed with `asr`.
1. If your virtual machine uses managed disks, replica managed disks are created in the primary region to store the data replicated from the secondary virtual machine's disks.
1. Temporary replicas of the source disks (disks attached to the virtual machines in secondary region) are created with the name `ms-asr-<GUID>`, that are used to transfer / read data. The temp disks let us utilize the complete bandwidth of the disk instead of only 16% bandwidth of the original disks (that are connected to the virtual machine). The temp disks are deleted once the reprotection completes.
1. If the target availability set doesn't exist, a new one is created as part of the reprotect job if necessary. If you've customized the reprotection settings, then the selected set is used.

**When you trigger a reprotect job, and the target virtual machine exists, the following occurs:**

1. The target side virtual machine is turned off if it's running.
1. If the virtual machine is using managed disks, a copy of the original disk is created with an `-ASRReplica` suffix. The original disks are deleted. The `-ASRReplica` copies are used for replication.
1. If the virtual machine is using unmanaged disks, the target virtual machine's data disks are detached and used for replication. A copy of the OS disk is created and attached on the virtual machine. The original OS disk is detached and used for replication.
1. Only changes between the source disk and the target disk are synchronized. The differentials are computed by comparing both the disks and then transferred. Check below to find the estimated time to complete the reprotection.
1. After the synchronization completes, the delta replication begins, and a recovery point is created in line with the replication policy.

**When you trigger a reprotect job, and the target virtual machine and disks don't exist, the following occurs:**

1. If the virtual machine is using managed disks, replica disks are created with `-ASRReplica` suffix. The `-ASRReplica` copies are used for replication.
1. If the virtual machine is using unmanaged disks, replica disks are created in the target storage account.
1. The entire disks are copied from the failed over region to the new target region.
1. After the synchronization completes, the delta replication begins, and a recovery point is created in line with the replication policy.

> [!NOTE]
> The `ms-asr` disks are temporary disks that are deleted after the *reprotect* action is completed.  You will be charged a minimal cost based on the Azure managed disk price for the time that these disks are active.


#### Estimated time to do the reprotection

In most cases, Azure Site Recovery doesn't replicate the complete data to the source region. The amount of data replicated depends on the following conditions:

1. Azure Site Recovery doesn't support reprotection if the source virtual machine's data is deleted, corrupted, or inaccessible for some reason. For example, a resource group change or deletion. Alternatively, you can disable the previous disaster recovery protection and enable a new protection from the current region.
2.	If the source virtual machine data is accessible, then differentials are computed by comparing both the disks and only the differences are transferred. 
   In this case, the **reprotection  time** is greater than or equal to the `checksum calculation time + checksum differentials transfer time + time taken to process the recovery points from Azure Site Recovery agent + auto scale time`.

**Factors governing reprotection time in scenario 2**

The following factors affect the reprotection time when the source virtual machine is accessible in scenario 2:

1. **Checksum calculation time** - The time taken to complete the enable replication process from the primary to the disaster recovery location is used as a benchmark for the checksum differential calculation. Navigate to **Recovery Services vaults** > **Monitoring** > **Site Recovery jobs** to see the time taken to complete the enable replication process. This will be the minimum time required to complete the checksum calculation.
   :::image type="content" source="./media/site-recovery-how-to-reprotect-azure-to-azure/estimated-reprotection.png" alt-text="Screenshot displays duration of reprotection of a virtual machine on the Azure portal." lightbox="./media/site-recovery-how-to-reprotect-azure-to-azure/estimated-reprotection.png":::

1. **Checksum differential data transfer** happens at approximately 23% of disk throughput.
1. **The time taken to process the recovery points sent from Azure Site Recovery agent** – Azure Site Recovery agent continues to send recovery points during the checksum calculation and transfer phase, as well. However, Azure Site Recovery processes them only once the checksum diff transfer is complete. 
   The time taken to process recovery points will be around one-fifth (1/5th) of the time taken for checksum differentials calculation and checksum differentials transfer time (time for checksum diff calculation + time for checksum diff transfer). For example, if the time taken for checksum differential calculation and checksum differential transfer is 15 hours, the time taken to process the recovery points from the agent will be three hours.
1. The **auto scale time** is approximately 20-30 minutes.


**Example scenario:**

Let's take the example from the following screenshot, where Enable Replication from the primary to the disaster recovery location took an hour and 12 minutes. The Checksum calculation time would be at least an hour and 12 minutes. Assuming that the amount of data change post failover is 45 GB, and the disk has a throughput of 60 Mbps, the differential transfer will occur at 14 Mbps, and the time taken for differential transfer will be 45 GB / 14 Mbps, that is approximately 55 minutes. The time taken to process the recovery points is approximately one-fifth of the total time taken for the checksum calculation (72 minutes) and time taken for data transfer (55minutes), which is approximately 25 minutes.   Additionally, it takes 20-30 minutes for auto-scaling. So, the total time for reprotection should be at least three hours.

   :::image type="content" source="./media/site-recovery-how-to-reprotect-azure-to-azure/estimated-reprotection.png" alt-text="Screenshot displays example duration of reprotection of a virtual machine on the Azure portal." lightbox="./media/site-recovery-how-to-reprotect-azure-to-azure/estimated-reprotection.png":::

The above is a simple illustration of how to estimate the reprotection time. 

When the virtual machine is re-protected from disaster recovery region to primary region (that is, after failing over from the primary region to disaster recovery region), the target virtual machine (original source virtual machine), and associated NIC(s) are deleted.

However, when the virtual machine is re-protected again from the primary region to disaster recovery region after failback, we do not delete the virtual machine and associated NIC(s) in the disaster recovery region that were created during the earlier failover.

## Next steps

After the virtual machine is protected, you can initiate a failover. The failover shuts down the virtual machine in the secondary region and creates and boots the virtual machine in the primary region, with brief downtime during this process. We recommend you choose an appropriate time for this process and that you run a test failover before initiating a full failover to the primary site. 

[Learn more](site-recovery-failover.md) about Azure Site Recovery failover.
