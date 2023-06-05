---
title: Manage VMs disks on Azure Stack Edge Pro GPU, Pro R, Mini R via Azure portal
description: Learn how to manage disks including add, resize, detach, and delete data disks for VMs deployed on your Azure Stack Edge Pro GPU, Azure Stack Edge Pro R, and Azure Stack Edge Mini R via the Azure portal.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 08/02/2021
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand how to manage disks on a VM running on an Azure Stack Edge Pro device so that I can use it to run applications using Edge compute before sending it to Azure.
---

# Use the Azure portal to manage disks on the VMs on your Azure Stack Edge Pro GPU

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

You can provision disks on the virtual machines (VMs) deployed on your Azure Stack Edge Pro device using the Azure portal. The disks are provisioned on the device via the local Azure Resource Manager and consume the device capacity. The operations such as adding, detaching, and deleting a disk can be done via the Azure portal, which in turn makes calls to the local Azure Resource Manager to provision the storage. 

This article explains how to add, detach or remove, and delete data disks from an existing VM, and resize the VM itself via, the Azure portal.

        
## About disks on VMs

Your VM can have an OS disk and a data disk. Every virtual machine deployed on your device has one attached operating system disk. This OS disk has a pre-installed OS, which was selected when the VM was created. This disk contains the boot volume.

> [!NOTE]
> You cannot change the OS disk size for a VM deployed on your device. The OS disk size is determined by the VM size that you selected.

A data disk on the other hand, is a managed disk attached to the VM running on your device. A data disk is used to store application data. Data disks are typically SCSI drives. The size of the VM determines how many data disks you can attach to a VM. By default, premium storage is used to host the disks.

A VM deployed on your device may sometimes contain a temporary disk. The temporary disk provides short-term storage for applications and processes, and is intended to only store data such as page or swap files. Data on the temporary disk may be lost during a maintenance event or when you redeploy a VM. During a successful standard reboot of the VM, data on the temporary disk will persist. 


## Prerequisites

Before you begin to manage disks on the VMs running on your device via the Azure portal, make sure that:


1. You've access to an activated Azure Stack Edge Pro GPU device. You have also enabled a network interface for compute on your device. This action creates a virtual switch on that network interface on your VM. 
    1. In the local UI of your device, go to **Compute**. Select the network interface that you will use to create a virtual switch.

        > [!IMPORTANT] 
        > You can only configure one port for compute.

    1. Enable compute on the network interface. Azure Stack Edge Pro GPU creates and manages a virtual switch corresponding to that network interface.

1. You have at least one VM deployed on your device. To create this VM, see the instructions in [Deploy VM on your Azure Stack Edge Pro via the Azure portal](azure-stack-edge-gpu-deploy-virtual-machine-portal.md).


## Add a data disk

Follow these steps to add a disk to a virtual machine deployed on your device.

1. Go to the virtual machine to which you want to add a data disk, and select **Disks** in the virtual machine **Details**.
    
    ![Screenshot of Disks settings on the Details tab of an Azure Stack Edge virtual machine. The Disks label is highlighted.](./media/azure-stack-edge-gpu-manage-virtual-machine-disks-portal/add-data-disk-1.png)

1. In the **Disks** blade, under **Data Disks**, select **Create and attach a new disk**.

    ![Screenshot of the Disks blade in Overview view for Virtual Machines. The Create and attach a new disk option, under Data disks, is highlighted.](./media/azure-stack-edge-gpu-manage-virtual-machine-disks-portal/add-data-disk-2.png)

1. In the **Create a new disk** blade, enter the following parameters:

    
    |Field  |Description  |
    |---------|---------|
    |Name     | A unique name within the resource group. The name cannot be changed after the data disk is created.     |
    |Edge resource group |Enter the Edge resource group in which to store the new disk.|
    |Size| The size of your data disk in GiB. The maximum size of a data disk is determined by the VM size that you have selected. When provisioning a disk, you should also consider the actual space on your device and other VM workloads that are running that consume capacity.  |         

    ![Screenshot of the Create a new disk blade for a virtual machine. The OK button is highlighted.](./media/azure-stack-edge-gpu-manage-virtual-machine-disks-portal/add-data-disk-3.png)

    Select **OK** and proceed.

1. In the **Disks** display, you'll see an entry corresponding to the new disk. Accept the default or assign a valid Logical Unit Number (LUN) to the disk, and select **Save**. A LUN is a unique identifier for a SCSI disk. For more information, see [What is a LUN?](../virtual-machines/linux/azure-to-guest-disk-mapping.md#what-is-a-lun).

    ![Screenshot of the Disks display for Virtual machines after adding a new disk. The disk number for the new disk and the Save button are highlighted.](./media/azure-stack-edge-gpu-manage-virtual-machine-disks-portal/add-data-disk-4.png)

1. You'll see a notification that disk creation is in progress. After the disk is successfully created, the virtual machine is updated. 

    ![Screenshot showing the notification that disk creation is in progress.](./media/azure-stack-edge-gpu-manage-virtual-machine-disks-portal/add-data-disk-5.png)

1. Navigate back to the virtual machine **Details** page. The list of disks updates to display the newly created data disk.

    ![Screenshot of the Details tab for a virtual machine. A newly created virtual machine disk is highlighted in the Disks area.](./media/azure-stack-edge-gpu-manage-virtual-machine-disks-portal/add-data-disk-6.png)


## Change a data disk

Follow these steps to change a disk associated with a virtual machine deployed on your device.

1. Go to the virtual machine that has the data disk to change, and select **Disks** in the virtual machine **Details**.

1. In the list of data disks, select the disk that you wish to change. In the far right of the disk selected, select the edit icon (pencil).  

    ![Screenshot of Disks on a virtual machine. The Data disks section, and the pencil icon, which is used to edit a data disk, are highlighted.](./media/azure-stack-edge-gpu-manage-virtual-machine-disks-portal/edit-data-disk-1.png)

1. In the **Change disk** blade, you can only change the size of the disk. You can't change the name of a disk once it's created. Change the **Size** of the disk, and save the change.

    ![Screenshot of the Change Disk blade for a virtual machine. The Size option and the OK button are highlighted.](./media/azure-stack-edge-gpu-manage-virtual-machine-disks-portal/edit-data-disk-2.png)

    > [!NOTE]
    > You can only expand a data disk. You can't shrink the disk.

1. In the **Disks** display, the list of disks refreshes to display the updated disk.


## Attach an existing disk

Follow these steps to attach an existing disk to the virtual machine deployed on your device.

1. Go to the virtual machine to which you wish to attach the existing disk, and select **Disks** in the virtual machine **Details**.

1. In the **Disks** blade, under **Data Disks**, select **Attach an existing disk**.

    ![Screenshot of the Disks blade for an Azure Stack Edge virtual machine. The "Attach an existing disk option" is highlighted.](./media/azure-stack-edge-gpu-manage-virtual-machine-disks-portal/attach-existing-data-disk-1.png)

1. Accept default LUN or assign a valid LUN. Choose an existing data disk from the dropdown list. Select **Save**.

    ![Screenshot of the Disks blade for an Azure Stack Edge virtual machine after an existing disk is added. The LUN number and name of the disk are highlighted, as is the Save button.](./media/azure-stack-edge-gpu-manage-virtual-machine-disks-portal/attach-existing-data-disk-2.png)

    Select **Save** and proceed.

1. You'll see a notification that the virtual machine is updated. After the VM is updated, navigate back to the virtual machine **Details** page. Refresh the page to view the newly attached disk in the list of data disks.

    ![Screenshot showing the Data disks section of the Details pane for a virtual machine. A data disk entry is highlighted.](./media/azure-stack-edge-gpu-manage-virtual-machine-disks-portal/list-data-disks-2.png)


## Detach a data disk

Follow these steps to detach or remove a data disk associated with a virtual machine deployed on your device.

> [!NOTE]
> - You can remove a data disk while the VM is running. Make sure that nothing is actively using the disk before detaching it from the VM.
> - If you detach a disk, it is not automatically deleted. Follow the steps in [Delete a disk](#delete-a-data-disk), below.

1. Go to the virtual machine from which you wish to detach a data disk, and select **Disks** in the virtual machine **Details**.

    ![Screenshot showing the Data disks section of the Details pane for a virtual machine. The disk entries under Data disks are highlighted.](./media/azure-stack-edge-gpu-manage-virtual-machine-disks-portal/list-data-disks-1.png)

1. In the list of disks, select the disk that you wish to detach. In the far right of the disk selected, select the detach icon ("X"). The selected disk will be detached. Select **Save**.

    ![Screenshot of the Disks display for a virtual machine. The X icon for an unattached disk that can be detached, and the Save button, are highlighted.](./media/azure-stack-edge-gpu-manage-virtual-machine-disks-portal/detach-data-disk-1.png)

1. After the disk is detached, the virtual machine is updated. Refresh the page to view the updated list of data disks.

    ![Screenshot of the refreshed Disks display for a virtual machine after a data disk is detached. The Data disks list is highlighted.](./media/azure-stack-edge-gpu-manage-virtual-machine-disks-portal/list-data-disks-2.png)


## Delete a data disk

Follow these steps to delete a data disk that's not attached to a VM deployed on your device.

> [!NOTE]
> Before deleting a data disk, you must [detach the data disk from the VM](#detach-a-data-disk) if the disk is in use.

1. Go to **Virtual machines** on your device, and go to the **Resources** pane. Select **Disks**.
 
    ![Screenshot showing the Disks tab on the Resources blade for virtual machines. The Resources label and Disks tab are highlighted.](./media/azure-stack-edge-gpu-manage-virtual-machine-disks-portal/delete-disk-1.png)

1. In the list of disks, select the disk that you wish to delete. In the far right of the disk selected, select the delete icon (trashcan).

    ![Screenshot showing the Disks tab on the Resources blade for virtual machines. A data disk with a trashcan icon, indicating it can be deleted, is highlighted.](./media/azure-stack-edge-gpu-manage-virtual-machine-disks-portal/delete-disk-2.png)

    If you don't see the delete icon, you can select the VM name in the **Attached VM** column and [detach the disk from the VM](#detach-a-data-disk).

1. You'll see a message asking you to confirm that you want to delete the disk. The operation can't be reversed. Select **Yes**.

    ![Screenshot showing the notification asking you to confirm you want to delete a data disk.](./media/azure-stack-edge-gpu-manage-virtual-machine-disks-portal/delete-disk-3.png)

    When deletion is complete, the disk is removed from the list.


## Next steps

To learn how to deploy virtual machines on your Azure Stack Edge Pro device, see [Deploy virtual machines via the Azure portal](azure-stack-edge-gpu-deploy-virtual-machine-portal.md).
