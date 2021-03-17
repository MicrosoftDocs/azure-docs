---
title: How to manage VMs network interfaces on your Azure Stack Edge Pro via the Azure portal
description: Learn how to create and manage VMs on your Azure Stack Edge Pro via the Azure portal.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 03/16/2021
ms.author: alkohli
Customer intent: As an IT admin, I need to understand how to manage network interfaces on an Azure Stack Edge Pro device so that I can use it to run applications using Edge compute before sending it to Azure.
---

# Use the Azure portal to manage network interfaces on the VMs on your Azure Stack Edge Pro GPU

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

You can create and manage virtual machines (VMs) on an Azure Stack Edge device using Azure portal, templates, Azure PowerShell cmdlets and via Azure CLI/Python scripts. This article describes how to manage the network interfaces on a VM running on your Azure Stack Edge device using the Azure portal. 

When you create a VM, you specify one virtual network interface to be created. You may want to add one or more network interfaces to the virtual machine after it is created. You may also want to change the default network interface settings for an existing network interface.

This article explains how to add a network interface to an existing VM, change existing settings such as IP type (static vs. dynamic), and finally remove or detach an existing interface. 

        
## About network interfaces on VMs

A network interface enables a virtual machine (VM) running on your Azure Stack Edge Pro device to communicate with Azure and on-premises resources. When you enable a port for compute network on your device, a virtual switch is created on that network interface. This virtual switch is then used to deploy compute workloads such as VMs or containerized applications on your device. 

Your device supports only one virtual switch but multiple virtual network interfaces. Each network interface on your VM has a static or a dynamic IP address assigned to it. With IP addresses assigned to multiple network interfaces on your VM, certain capabilities are enabled on your VM. For example, your VM can host multiple websites or services with different IP addresses and SSL certificates on a single server. A VM on your device can serve as a network virtual appliance, such as a firewall or a load balancer. <!--Is it possible to do that on ASE?-->

<!--There is a limit to how many virtual network interfaces can be created on the virtual switch on your device. See the Azure Stack Edge Pro limits article for details.--> 


## Prerequisites

Before you begin to manage VMs on your device via the Azure portal, make sure that:

1. You have enabled a network interface for compute on your device. This action creates a virtual switch on that network interface on your VM. In the local UI of your device, go to **Compute**. Select the network interface that you will use to create a virtual switch.

    > [!IMPORTANT] 
    > You can only configure one port for compute.

    1. Enable compute on the network interface. Azure Stack Edge Pro creates and manages a virtual switch corresponding to that network interface.

1. You have atleast one VM deployed on your device. To create this VM, see the instructions in [Deploy VM on your Azure Stack Edge Pro via the Azure portal](azure-stack-edge-gpu-deploy-virtual-machine-portal.md).

1. You VM should be in **Stopped** state. To stop your VM, go to **Virtual machines > Overview** and select the VM you want to stop. In the VM properties blade, select **Stop**. Before you add, edit, or delete network interfaces, you must stop



## Add a network interface



## Edit a network interface



## Detach a network interface






## Next steps

To learn how to administer your Azure Stack Edge Pro device, see[Use local web UI to administer a Azure Stack Edge Pro](azure-stack-edge-manage-access-power-connectivity-mode.md).
