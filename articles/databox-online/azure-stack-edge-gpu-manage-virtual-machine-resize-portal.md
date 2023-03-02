---
title: Resize VMs on Azure Stack Edge Pro GPU, Pro R, Mini R via the Azure portal
description: Learn how to resize the virtual machines (VM) running on your Azure Stack Edge Pro GPU, Azure Stack Edge Pro R, Azure Stack Edge Mini R via the Azure portal.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 07/08/2021
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand how to resize VMs running on an Azure Stack Edge Pro device so that I can use it to run applications using Edge compute before sending it to Azure.
---

# Use the Azure portal to resize the VMs on your Azure Stack Edge Pro GPU

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article explains how to resize the virtual machines (VMs) deployed on your Azure Stack Edge Pro GPU device.

       
## About VM sizing

The VM size determines the amount of compute resources (like CPU, GPU, and memory) that are made available to the VM. You should create virtual machines by using a VM size appropriate for your application workload. 

Even though all the machines will be running on the same hardware, machine sizes have different limits for disk access. This can help you manage overall disk access across your VMs. If a workload increases, you can also resize an existing virtual machine.

For more information, see [Supported VM sizes for your device](azure-stack-edge-gpu-virtual-machine-sizes.md).


## Prerequisites

Before you resize a VM running on your device via the Azure portal, make sure that:

1. You have at least one VM deployed on your device. To create this VM, see the instructions in [Deploy VM on your Azure Stack Edge Pro via the Azure portal](azure-stack-edge-gpu-deploy-virtual-machine-portal.md).

1. Your VM should be in **Stopped** state. To stop your VM, go to **Virtual machines > Overview** and select the VM you want to stop. In the Overview page, select **Stop** and then select **Yes** when prompted for confirmation. Before you resize your VM, you must stop the VM.

    ![Screenshot of the screen for stopping a VM from the Virtual Machines overview. The Yes button is highlighted.](./media/azure-stack-edge-gpu-manage-virtual-machine-network-interfaces-portal/stop-vm-2.png)


## Resize a VM

Follow these steps to resize a virtual machine deployed on your device. 

1. Go to the virtual machine that you have stopped, and select **VM size (change)** in the virtual machine **Details**.
    
    ![Screenshot of the Details tab for a virtual machine. The Details tab and the VM Size option are highlighted.](./media/azure-stack-edge-gpu-manage-virtual-machine-resize-portal/change-vm-size-1.png)

2. In the **Change VM size** blade, from the command bar, select the **VM size** and then select **Change**.

    ![Screenshot of the Change VM size screen. A VM size is highlighted, as is the Change button.](./media/azure-stack-edge-gpu-manage-virtual-machine-resize-portal/change-vm-size-2.png)

3. You'll see a notification that the virtual machine is being updated. After the virtual machine is successfully updated, the **Overview** page refreshes to display the resized VM.

    ![Screenshot of the Overview page for a VM. The VM Size value for the resized VM is highlighted.](./media/azure-stack-edge-gpu-manage-virtual-machine-resize-portal/change-vm-size-3.png)


## Next steps

To learn how to deploy virtual machines on your Azure Stack Edge Pro device, see [Deploy virtual machines via the Azure portal](azure-stack-edge-gpu-deploy-virtual-machine-portal.md).
