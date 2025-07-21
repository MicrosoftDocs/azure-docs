---
title: Attach or detach data disks for lab VMs
description: Learn how to use the Azure portal to attach or detach a data disk for an Azure DevTest Labs virtual machine (VM).
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 03/20/2025
ms.custom: UpdateFrequency2

#customer intent: As a lab user, I want to attach and detach data disks for my DevTest Labs VMs so I can manage storage or software separately from individual VMs.
---

# Attach or detach a data disk for a lab VM in Azure DevTest Labs

This article explains how to attach and detach a lab virtual machine (VM) data disk in Azure DevTest Labs by using the Azure portal. Depending on the VM size, you can create, attach, detach, and reattach multiple [data disks](/azure/virtual-machines/managed-disks-overview). Data disks let you manage storage or software separately from individual VMs.

## Prerequisites

To attach or detach a data disk, you must have ownership permissions on the lab VM, and the VM must be running. The VM size determines how many data disks you can attach. For more information, see [Sizes for virtual machines](/azure/virtual-machines/sizes).

## Create and attach a new data disk

Follow these steps to create and attach a new managed data disk for a DevTest Labs VM.

1. In the Azure portal, select your VM from the **My virtual machines** list on your lab **Overview** page.
1. On the VM **Overview** page, select **Disks** under **Settings** in the left navigation.
1. On the **Disks** page, select **Attach new**.

   :::image type="content" source="./media/devtest-lab-attach-detach-data-disk/devtest-lab-attach-new.png" alt-text="Screenshot of Attach new on the V M's Disk page.":::

1. On the **Attach new disk** page:

   - For **Name**, enter a unique name.
   - For **Disk type**, select a [disk type](/azure/virtual-machines/disks-types) from the dropdown list.
   - For **Size (GiB)**, enter the disk size in gigabytes.

1. Select **OK**.

    :::image type="content" source="./media/devtest-lab-attach-detach-data-disk/devtest-lab-attach-new-form.png" alt-text="Screenshot of the Attach new disk form.":::

1. After the disk is attached, on the **Disks** page, view the new attached disk under **Data disks**.

   :::image type="content" source="./media/devtest-lab-attach-detach-data-disk/devtest-lab-attached-data-disk.png" alt-text="Screenshot of the new data disk under Data disks on the Disks page.":::

## Attach an existing data disk

Follow these steps to attach an existing available data disk to a running VM.

1. In the Azure portal, select your VM from the **My virtual machines** list on the lab **Overview** page.
1. On the VM **Overview** page, select **Disks** under **Settings** in the left navigation.
1. On the **Disks** page, select **Attach existing**.

   :::image type="content" source="./media/devtest-lab-attach-detach-data-disk/devtest-lab-attach-existing-button.png" alt-text="Screenshot of Attach existing on the VM's Disk page.":::

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

1. On the data disk's page, select **Detach**, then respond **OK** to **Are you sure you want to detach it**.

   :::image type="content" source="./media/devtest-lab-attach-detach-data-disk/devtest-lab-detach-data-disk-2.png" alt-text="Screenshot showing Detach on the Data disk page.":::

The disk detaches, and is available to reattach to this or another VM. 

### Detach or delete a data disk from the lab page

You can also detach or delete a data disk by using the lab's **Overview** page.

1. On the lab **Overview** page in the Azure portal, select **My data disks** under **My Lab** in the left navigation.

1. On the **My data disks** page, either:

   - Select the ellipsis (**...**) next to the disk you want to detach, select **Detach** from the context menu, and then select **Yes**.

   - Or, select the disk name, and on the disk's page, select **Detach** and then select **OK**.

   :::image type="content" source="./media/devtest-lab-attach-detach-data-disk/devtest-lab-detach-data-disk.png" alt-text="Screenshot of detaching a data disk from the listing's context menu.":::

To delete a detached data disk, select **Delete** from the context menu on the **My data disks** page, or select **Delete** on the disk's page. Deleting a data disk removes it from storage. If you want to attach the disk again, you must add it as a new disk.

## Related content

For information about transferring data disks for claimable lab VMs, see [Transfer the data disk](devtest-lab-add-claimable-vm.md#transfer-the-data-disk).
