---
title: Resize VMs on Azure Stack Edge Pro GPU, Pro R, Mini R via the Azure portal
description: Learn how to resize the virtual machines (VM) running on your Azure Stack Edge Pro GPU, Azure Stack Edge Pro R, Azure Stack Edge Mini R via the Azure portal.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 03/24/2021
ms.author: alkohli
Customer intent: As an IT admin, I need to understand how to resize VMs running on an Azure Stack Edge Pro device so that I can use it to run applications using Edge compute before sending it to Azure.
---

# Use the Azure portal to resize the VMs on your Azure Stack Edge Pro GPU

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article explains how to resize the virtual machines (VMs) deployed on your Azure Stack Edge Pro GPU device.

       
## About VM sizing

The VM size determines the amount of compute resources (like CPU, GPU, and memory) that are made available to the VM. You should create virtual machines by using a VM size appropriate for your application workload. Even though all the machines will be running on the same hardware, machine sizes have different limits for disk access. This can help you manage overall disk access across your VMs. If a workload increases, you can also resize an existing virtual machine.


## Prerequisites

Before you resize a VM running on your device via the Azure portal, make sure that:

1. You have at least one VM deployed on your device. To create this VM, see the instructions in [Deploy VM on your Azure Stack Edge Pro via the Azure portal](azure-stack-edge-gpu-deploy-virtual-machine-portal.md).

1. Your VM should be in **Stopped** state. To stop your VM, go to **Virtual machines > Overview** and select the VM you want to stop. In the Overview page, select **Stop** and then select **Yes** when prompted for confirmation. Before you resize your VM, you must stop the VM.

    ![Stop VM from Overview page](./media/azure-stack-edge-gpu-manage-virtual-machine-network-interfaces-portal/stop-vm-2.png)


## Resize a VM

Follow these steps to resize a virtual machine deployed on your device. 

1. Go to the virtual machine that you have stopped and then go to the **Overview** page. Select **VM size (change)**.
    
    ![Select Networking on Overview page](./media/azure-stack-edge-gpu-manage-virtual-machine-network-interfaces-portal/add-nic-1.png)

2. In the **Disks** blade, from the command bar, select **+ Add network interface**.

    ![Select add network interface](./media/azure-stack-edge-gpu-manage-virtual-machine-network-interfaces-portal/add-nic-2.png)

3. In the **Add network interface** blade, enter the following parameters:

    
    |Column1  |Column2  |
    |---------|---------|
    |Name     | A unique name within the resource group. The name cannot be changed after the network interface is created. To manage multiple network interfaces easily, use the suggestions provided in the [Naming conventions](/azure/cloud-adoption-framework/ready/azure-best-practices/naming-and-tagging#resource-naming).     |
    |Virtual network| The virtual network associated with the virtual switch created on your device when you enabled compute on the network interface. There is only one virtual network associated with your device. |         
    |Subnet   | A subnet within the selected virtual network. This field is automatically populated with the subnet associated with the network interface on which you enabled compute. |       
    |IP assignment   | A static or a dynamic IP for your network interface. The static IP should be an available, free IP from the specified subnet range. Choose dynamic if a DHCP server exists in the environment.| 

    ![Add a network interface blade](./media/azure-stack-edge-gpu-manage-virtual-machine-network-interfaces-portal/add-nic-3.png)

4. You'll see a notification that the network interface creation is in progress.

    ![Notification when network interface is getting created](./media/azure-stack-edge-gpu-manage-virtual-machine-network-interfaces-portal/add-nic-4.png)

5.  After the network interface is successfully created, the list of network interfaces refreshes to display the newly created interface.

    ![Updated list of network interfaces](./media/azure-stack-edge-gpu-manage-virtual-machine-network-interfaces-portal/add-nic-5.png)



## Next steps

To learn how to deploy virtual machines on your Azure Stack Edge Pro device, see [Deploy virtual machines via the Azure portal](azure-stack-edge-gpu-deploy-virtual-machine-portal.md).
