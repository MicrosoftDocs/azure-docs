---
title: Enable replication for an added VMware virtual machine disk in Azure Site Recovery
description: "This article describes how to enable replication for a disk added to a VMware virtual machine thats enabled for disaster recovery with Azure Site Recovery"
ms.author: v-gajeronika
ms.reviewer: v-gajeronika
author: Jeronika-MS
ms.topic: how-to
ms.date: 02/13/2026
ms.custom: engagement-fy23
ms.service: azure-site-recovery
# Customer intent: As a VMware administrator, I want to enable replication for newly added data disks in a virtual machine, so that I can ensure their protection as part of the disaster recovery strategy with Azure Site Recovery.
---

# Enable replication for a disk added to a VMware virtual machine 

This article describes how to enable replication for newly added data disks that you add to a VMware virtual machine. The virtual machine already has disaster recovery enabled to an Azure region by using [Azure Site Recovery](site-recovery-overview.md).

You can now enable replication for a disk you add to a virtual machine for VMware virtual machines. 

**When you add a new disk to a VMware virtual machine that is replicating to an Azure region, the following occurs:** 
-	Replication health for the virtual machine shows a warning, and a note in the portal informs you that one or more disks are available for protection.
-	If you enable protection for the added disks, the warning disappears after initial replication of the disk.
-	If you choose not to enable replication for the disk, you can select to dismiss the warning.

    :::image type="content" source="./media/vmware-azure-enable-replication-added-disk/post-add-disk.png" alt-text="Screenshot of `Enable replication` for an added disk.":::

## Before you start

This article assumes that you already set up disaster recovery for the VMware virtual machine to which you're adding the disk. If you didn't, follow the [VMware to Azure disaster recovery tutorial](vmware-azure-set-up-replication-tutorial-modernized.md).

## Enable replication for an added disk

To enable replication for an added disk, complete the following:

1. In the vault, go to **Replicated Items** and select the virtual machine to which you added the disk.
1. Select **Disks** > **Data disks** section of the protected item, and then select the data disk for which you want to enable replication (these disks have a **Not protected** status).
    

    > [!NOTE]
    > If the enable replication operation for this disk fails, you can resolve the issues and retry the operation.

1. In **Disk Details**, select **Enable replication**.

    :::image type="content" source="./media/vmware-azure-enable-replication-added-disk/enable-replication.png" alt-text="Screenshot of the disk to enable replication.":::

1. Confirm **Enable Replication** 
    
    :::image type="content" source="./media/vmware-azure-enable-replication-added-disk/confirm-enable-replication.png" alt-text="Screenshot of confirming enable replication for added disk.":::


After the enable replication job runs and the initial replication finishes, the replication health warning for the disk issue is removed.

## Next steps

[Learn more](site-recovery-test-failover-to-azure.md) about running a test failover.

