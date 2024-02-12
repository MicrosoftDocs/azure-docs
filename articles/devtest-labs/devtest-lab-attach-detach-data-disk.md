---
title: Attach & detach data disks for lab VMs
description: Learn how to attach or detach a data disk for a lab virtual machine in Azure DevTest Labs.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 09/30/2023
ms.custom: UpdateFrequency2
---

# Attach or detach a data disk for a lab virtual machine in Azure DevTest Labs

This article explains how to attach and detach a lab virtual machine (VM) data disk in Azure DevTest Labs. You can create, attach, detach, and reattach multiple [data disks](../virtual-machines/managed-disks-overview.md) for lab VMs that you own. This functionality is useful for managing storage or software separately from individual VMs.

## Prerequisites

To attach or detach a data disk, you need to own the lab VM, and the VM must be running. The VM size determines how many data disks you can attach. For more information, see [Sizes for virtual machines](../virtual-machines/sizes.md).

## Create and attach a new data disk

Follow these steps to create and attach a new managed data disk for a DevTest Labs VM.

1. Select your VM from the **My virtual machines** list on the lab **Overview** page.

1. On the VM **Overview** page, select **Disks** under **Settings** in the left navigation.
 
1. On the **Disks** page, select **Attach new**.

   :::image type="content" source="./media/devtest-lab-attach-detach-data-disk/devtest-lab-attach-new.png" alt-text="Screenshot of Attach new on the V M's Disk page.":::

1. Fill out the **Attach new disk** form as follows:

   - For **Name**, enter a unique name.
   - For **Disk type**, select a [disk type](../virtual-machines/disks-types.md) from the drop-down list.
   - For **Size (GiB)**, enter a size in gigabytes.

1. Select **OK**.

    :::image type="content" source="./media/devtest-lab-attach-detach-data-disk/devtest-lab-attach-new-form.png" alt-text="Screenshot of the Attach new disk form.":::

1. After the disk is attached, on the **Disks** page, view the new attached disk under **Data disks**.

   :::image type="content" source="./media/devtest-lab-attach-detach-data-disk/devtest-lab-attached-data-disk.png" alt-text="Screenshot of the new data disk under Data disks on the Disks page.":::

## Attach an existing data disk

Follow these steps to attach an existing available data disk to a running VM.

1. Select your VM from the **My virtual machines** list on the lab **Overview** page.

1. On the VM **Overview** page, select **Disks** under **Settings** in the left navigation.
 
1. On the **Disks** page, select **Attach existing**.

   :::image type="content" source="./media/devtest-lab-attach-detach-data-disk/devtest-lab-attach-existing-button.png" alt-text="Screenshot of Attach existing on the V M's Disk page.":::

1. On the **Attach existing disk** page, select a disk, and then select **OK**.

   :::image type="content" source="./media/devtest-lab-attach-detach-data-disk/devtest-lab-attach-existing.png" alt-text="Screenshot of attach existing data disk to a virtual machine.":::

1. After the disk is attached, on the **Disks** page, view the attached disk under **Data disks**.

## Detach a data disk

Detaching removes the lab disk from the VM, but keeps it in storage for later use.

Follow these steps to detach an attached data disk from a running VM.

1. Select the VM with the disk from the **My virtual machines** list on the lab **Overview** page.

1. On the VM **Overview** page, select **Disks** under **Settings** in the left navigation.
 
1. On the **Disks** page, under **Data disks**, select the data disk you want to detach.

   :::image type="content" source="./media/devtest-lab-attach-detach-data-disk/devtest-lab-detach-button.png" alt-text="Screenshot of selecting a data disk to detach.":::

1. On the data disk's page, select **Detach**, and then select **OK**.

   :::image type="content" source="./media/devtest-lab-attach-detach-data-disk/devtest-lab-detach-data-disk-2.png" alt-text="Screenshot showing Detach on the Data disk page.":::

The disk is detached, and is available to reattach to this or another VM. 

### Detach or delete a data disk on the lab management page

You can also detach or delete a data disk without navigating to the VM's page.

1. In the left navigation for your lab's **Overview** page, select **My data disks** under **My Lab**.

1. On the **My data disks** page, either:

   - Select the disk you want to detach, and then on the data disk's page, select **Detach** and then select **OK**.

     or

   - Select the ellipsis (**...**) next to the disk you want to detach, select **Detach** from the context menu, and then select **Yes**.

     :::image type="content" source="./media/devtest-lab-attach-detach-data-disk/devtest-lab-detach-data-disk.png" alt-text="Screenshot of detaching a data disk from the listing's context menu.":::

You can also delete a detached data disk, by selecting **Delete** from the context menu or from the data disk page. When you delete a data disk, it is removed from storage and can't be reattached anymore.

## Next steps

For information about transferring data disks for claimable lab VMs, see [Transfer the data disk](devtest-lab-add-claimable-vm.md#transfer-the-data-disk).
