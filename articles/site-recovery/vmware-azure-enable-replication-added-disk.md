---
title: Enable replication for an added VMWare VM disk in Azure Site Recovery
description: This article describes how to enable replication for a disk added to an VMWare VM that's enabled for disaster recovery with Azure Site Recovery
ms.author: ankitadutta
author: ankitaduttaMSFT
ms.topic: how-to
ms.date: 02/15/2024
ms.custom: engagement-fy23
ms.service: site-recovery
---

# Enable replication for a disk added to an VMWare VM 

This article describes how to enable replication for newly added data disks that are added to a VMWare VM which already has disaster recovery enabled to an Azure region, using [Azure Site Recovery](site-recovery-overview.md).

Enabling replication for a disk you add to a VM is supported for VMWare VMs now. 

When you add a new disk to a VMware VM that's replicating to an Azure region, the following occurs: 
-	Replication health for the VM shows a warning, and a note in the portal informs you that one or more disks are available for protection.
-	If you enable protection for the added disks, the warning will disappear after initial replication of the disk.
-	If you choose not to enable replication for the disk, you can select to dismiss the warning.

![Screenshot of a new disk added.](./media/vmware-azure-enable-replication-added-disk/enable-replication-disk-job.png)


## Before you start

This article assumes that you've already set up disaster recovery for the VMware VM to which you're adding the disk. If you haven't, follow the [VMWare to Azure disaster recovery tutorial](vmware-azure-set-up-replication-tutorial-modernized.md).

## Enable replication for an added disk

To enable replication for an added disk, do the following:

1. In the vault > **Replicated Items**, select the VM to which you added the disk.
2. Select **Disks** > **Data disks** section of the protected item, and then select the data disk for which you want to enable replication (these disks have a **Not protected** status).
    
    ![Screenshot of the disk to enable replication.](./media/azure-to-azure-enable-replication-added-disk/enable-replication.png)

    > [!NOTE]
    > If the enable replication operation for this disk fails, you can resolve the issues and retry the operation.

3.	In **Disk Details**, select **Enable replication**.

    ![Enable replication for added disk](./media/vmware-azure-enable-replication-added-disk/post-add-disk.png)
1. Confirm **Enable Replication** 
    
    ![Screenshot of confirming enable replication for added disk.](./media/vmware-azure-enable-replication-added-disk/confirm-enable-replication.png)


After the enable replication job runs and the initial replication finishes, the replication health warning for the disk issue is removed.

![Screenshot of dismissing warning.](./media/vmware-azure-enable-replication-added-disk/dismiss-warning.png)


## Next steps

[Learn more](site-recovery-test-failover-to-azure.md) about running a test failover.
