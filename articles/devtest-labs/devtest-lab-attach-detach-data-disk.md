---
title: Attach or detach a data disk to a virtual machine
description: Learn how to attach or detach a data disk to a virtual machine in Azure DevTest Labs
ms.topic: how-to
ms.date: 10/21/2021
---

# Attach or detach a data disk to a virtual machine in Azure DevTest Labs

You can select a new data disk for a VM, and Azure [creates and manages](../virtual-machines/managed-disks-overview.md) the disk automatically. The data disk can then be detached, and either: reattached, or attached to a different VM that you own. This functionality is handy for managing storage or software outside of each individual virtual machine.

## Prerequisites

Your virtual machine must be running. The size of the virtual machine controls how many data disks you can attach. For details, see [Sizes for virtual machines](../virtual-machines/sizes.md).


## Attach a new data disk
Follow these steps to create and attach a new managed data disk to a VM in Azure DevTest Labs.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to your lab in **DevTest Labs**.

1. Select your running virtual machine.

1. From the **virtual machine** page, under **Settings**, select **Disk**.
 
1. Select **Attach new**.

    :::image type="content" source="./media/devtest-lab-attach-detach-data-disk/devtest-lab-attach-new.png" alt-text="Attach new data disk to a virtual machine.":::

1. From the **Attach new disk** page, provide the following information: 

    |Property | Description |
    |---|---|
    |Name|Enter a unique name.|
    |Disk type| Select a [disk type](../virtual-machines/disks-types.md) from the drop-down list.|
    |Size (GiB)|Enter a size in gigabytes.|

    :::image type="content" source="./media/devtest-lab-attach-detach-data-disk/devtest-lab-attach-new-form.png" alt-text="Complete the 'attach new disk' form.":::

1. Select **OK**.

1. You're returned to the **virtual machine** page. View your attached disk under **Data disks**.

    :::image type="content" source="./media/devtest-lab-attach-detach-data-disk/devtest-lab-attached-data-disk.png" alt-text="Attached disk appears under data disks.":::

## Detach a data disk

Detaching removes the disk from the VM, but keeps it in storage for later use.

### Detach from the VM's management page

1. Navigate to a VM that has a data disk attached.

1. From the **virtual machine** page, under **Settings**, select **Disks**.

1. Under **Data disks**, select the data disk you want to detach.

    :::image type="content" source="./media/devtest-lab-attach-detach-data-disk/devtest-lab-detach-button.png" alt-text="Select data disks for a virtual machine.":::

1. From the **Data disk** page, select **Detach**.

    :::image type="content" source="./media/devtest-lab-attach-detach-data-disk/evtest-lab-detach-data-disk2.png" alt-text="Screenshot shows a disk's details pane with the 'Detach' action highlighted.":::

1. Select **OK** to confirm that you want to detach the data disk. The disk is detached and is available to attach to another VM. 

### Detach from the lab's management page

1. Navigate to your lab in **DevTest Labs**.

1. Under **My Lab**, select **My data disks**.

1. For the disk you wish to detach, select its ellipsis (**...**) – and select **Detach**.

    :::image type="content" source="./media/devtest-lab-attach-detach-data-disk/devtest-lab-detach-data-disk.png" alt-text="Detach a data disk.":::

1. Select **Yes** to confirm that you want to detach it.

   > [!NOTE]
   > If a data disk is already detached, you can choose to remove it from your list of available data disks by selecting **Delete**.

## Attach an existing disk

Follow these steps to attach an existing available data disk to a running VM. 

1. Navigate to a VM. Start the VM if stopped.

1. From the **virtual machine** page, under **Settings**, select **Disks**.

1. Select **Attach existing** to attach an available data disk to the VM.

    :::image type="content" source="./media/devtest-lab-attach-detach-data-disk/devtest-lab-attach-existing-button.png" alt-text="Screenshot that shows the 'Disks' setting selected and 'Attach existing' selected.":::

1. From the **Attach existing disk** page, select a disk and then **OK**. After a few moments, the data disk is attached to the VM and appears in the list of **Data disks** for that VM.

    :::image type="content" source="./media/devtest-lab-attach-detach-data-disk/devtest-lab-attach-existing.png" alt-text="Attach existing data disk to a virtual machine.":::

## Upgrade an unmanaged data disk

If you have a VM with unmanaged data disks, you can convert the VM to use managed disks. This process converts both the OS disk and any attached data disks.

First [detach the data disk](#detach-a-data-disk) from the unmanaged VM. Then, [reattach the disk](#attach-an-existing-disk) to a managed VM to automatically upgrade the data disk from unmanaged to managed.

## Next steps

Learn how to manage data disks for [claimable virtual machines](devtest-lab-add-claimable-vm.md#unclaim-a-vm).
