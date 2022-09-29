---
title: Overview of VMs on your Azure Stack Edge device
description: Describes virtual machines on your Azure Stack Edge device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 05/18/2022
ms.author: alkohli
---

# Virtual machines on your Azure Stack Edge Pro GPU device

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article provides a brief overview of virtual machines (VMs) running on your Azure Stack Edge devices, supported VM sizes, and summarizes the various ways of creating VM images, deploying, and then managing VMs. 

## About VMs

Azure Stack Edge solution provides purpose-built hardware-as-a-service devices from Microsoft that can be used to deploy edge computing workloads and get quick actionable insights at the edge where the data is generated. 

Depending on your environment and the type of applications you're running, you can deploy one of the following edge computing workloads on these devices: 

- **Containerized** - Use IoT Edge or Kubernetes to run your containerized applications.
- **Non-containerized** - Deploy both Windows and Linux virtual machines on your devices to run non-containerized applications. 

You deploy a VM on your device when you need more control over the computing environment. You can use VMs on your device in several ways ranging from development and test to running applications on the edge.

## Before you create a VM

Before you begin, review the following considerations about your VM:

- The size of the VM you'll use.
- The maximum number of VMs that can be created on your device.
- The operating system that the VM runs.
- The configuration of the VM after it starts.


### VM size

You need to be aware of VM sizes if you're planning to deploy VMs. There are multiple sizes available for the VMs that you can use to run apps and workloads on your device. The size that you choose then determines factors such as processing power, memory, and storage capacity. For  more information, see [Supported VM sizes](azure-stack-edge-gpu-virtual-machine-sizes.md#supported-vm-sizes).

To figure out the size and the number of VMs that you can deploy on your device, factor in the usable compute on your device and other workloads that you're running. If running Kubernetes, consider the compute requirements for the Kubernetes master and worker VMs as well.

|Kubernetes VM type|CPU and memory requirement|
|---------|---------|
|Master VM|4 cores, 4-GB RAM|
|Worker VM|12 cores, 32-GB RAM|

For the usable compute and memory on your device, see the [Compute and memory specifications](azure-stack-edge-gpu-technical-specifications-compliance.md#compute-and-memory-specifications) for your device model. 

For a GPU virtual machine, you must use a [VM size from the NCasT4-v3-series](azure-stack-edge-gpu-virtual-machine-sizes.md#n-series-gpu-optimized).


### VM limits

You can run a maximum of 24 VMs on your device. This is another factor to consider when deploying your workload.

### Operating system disks and images

On your device, you can use Generation 1 or Generation 2 VMs with a fixed virtual hard disk (VHD) format. VHDs are used to store the machine operating system (OS) and data. VHDs are also used for the images you use to install an OS. 

The images that you use to create VM images can be generalized or specialized. When creating images for your VMs, you must prepare the images. See the various ways to prepare and use VM images on your device:

- [Prepare Windows generalized image from a VHD](azure-stack-edge-gpu-prepare-windows-vhd-generalized-image.md)
- [Prepare generalized image from an ISO](azure-stack-edge-gpu-prepare-windows-generalized-image-iso.md)
- [Create custom VM images starting from an Azure VM](azure-stack-edge-gpu-create-virtual-machine-image.md)
- [Use specialized image](azure-stack-edge-gpu-deploy-vm-specialized-image-powershell.md)

### Extensions

The following extensions are available for the VMs on your device.

|Extension|Description|Learn more|
|---------|---------|---------|
|Custom script extensions|Use custom script extensions to configure workloads.|[Deploy Custom Script Extension on VMs running on your device](azure-stack-edge-gpu-deploy-virtual-machine-custom-script-extension.md)|
|GPU extensions |Use GPU extensions to install GPU drivers.|[Create GPU VMs](azure-stack-edge-gpu-deploy-gpu-virtual-machine.md#create-gpu-vms) and [Install GPU extensions](azure-stack-edge-gpu-deploy-virtual-machine-install-gpu-extension.md)|
|Reset VM password extensions|Reset a VM password using PowerShell.|[Install the VM password reset extension](azure-stack-edge-gpu-deploy-virtual-machine-install-password-reset-extension.md)|

## Create a VM

To deploy a VM, you first need to create all the resources that are needed to create a VM. Regardless of the method employed to create a VM, you'll follow these steps: 

1. Connect to the local Azure Resource Manager of your device. 
1. Identify the built-in subscription on the device.
1. Bring your VM image.
    1. Create a resource group in the built-in subscription. The resource group will contain the VM and all the related resources.
    2. Create a local storage account on the device to store the VHD that will be used to create a VM image.
    3. Upload a Windows/Linux source image into the storage account to create a managed disk.
    4. Use the managed disk to create a VM image.
1. Enable compute on a device port to create a virtual switch.
    1. This creates a virtual network using the virtual switch attached to the port on which you enabled compute.  
1. Create a VM using the previously created VM image, virtual network, and virtual network interface(s) to communicate within the virtual network and assign a public IP address to remotely access the VM. Optionally include data disks to provide more storage for your VM.
 
The deployment workflow is displayed in the following diagram:

![Diagram of the VM deployment workflow.](media/azure-stack-edge-gpu-deploy-virtual-machine-powershell/vm-workflow-r.svg)

There are several ways to deploy a VM on your device. Your choice depends on your environment. The following table summarizes the various ways to deploy a VM on your device:

|Method|Article|
|---------|---------|
|Azure portal|[Deploy a VM on your device via the Azure portal](azure-stack-edge-gpu-deploy-virtual-machine-portal.md).|
|Templates|[Deploy a VM on your device via templates](azure-stack-edge-gpu-deploy-virtual-machine-templates.md)|
|PowerShell|[Deploy a VM on your device via Azure PowerShell cmdlets](azure-stack-edge-gpu-deploy-virtual-machine-powershell.md)<br>[Deploy a VM on your device via Azure PowerShell script](azure-stack-edge-gpu-deploy-virtual-machine-powershell-script.md)|
|CLI/Python|[Deploy a VM on your device via Azure CLI/Python](azure-stack-edge-gpu-deploy-virtual-machine-cli-python.md)|
|GPU|[Deploy a VM on your device using GPUs](azure-stack-edge-gpu-deploy-gpu-virtual-machine.md)|


## Manage your VM

You can manage the VMs on your device via the Azure portal, via the PowerShell interface of the device, or directly through the APIs. Some typical management tasks are:

- Get information about a VM.
- Connect to a VM, start, stop, delete VMs.
- Manage disks, VM sizes, network interfaces, virtual switches
- Back up VM disks.

### Get information about your VM

To get more information about your VM via the Azure portal, follow these steps:

1. Go to Azure Stack Edge resource for your device and then go to **Virtual machines > Overview**. 
1. In the **Overview** page, go to **Virtual machines** and select the virtual machine that you're interested in. You can then view the details of the VM. 

### Connect to your VM

Depending on the OS that your VM runs, you can connect to the VM as follows: 

- [Connect to a Windows VM on your device](azure-stack-edge-gpu-deploy-virtual-machine-templates.md#connect-to-windows-vm).
- [Connect to a Linux VM on your device](azure-stack-edge-gpu-deploy-virtual-machine-templates.md#connect-to-linux-vm).

### Start, stop, delete VMs

You can [turn on the VM](azure-stack-edge-gpu-deploy-virtual-machine-powershell.md#turn-on-the-vm), [suspend or shut down the VM](azure-stack-edge-gpu-deploy-virtual-machine-powershell.md#suspend-or-shut-down-the-vm). Finally, you can [delete the VMs](azure-stack-edge-gpu-deploy-virtual-machine-powershell.md#delete-the-vm) after you're done using them.

### Manage network interfaces, virtual switches

You can [add, modify, detach network interfaces](azure-stack-edge-gpu-manage-virtual-machine-network-interfaces-portal.md) for your VMs. You can also [create new virtual switches](azure-stack-edge-gpu-create-virtual-switch-powershell.md) on your device to deploy VMs. 

### Manage data disks, VM size

You can add a [data disk to an existing VM](azure-stack-edge-gpu-manage-virtual-machine-disks-portal.md#add-a-data-disk), [attach an existing disk](azure-stack-edge-gpu-manage-virtual-machine-disks-portal.md#add-a-data-disk), [detach a data disk](azure-stack-edge-gpu-manage-virtual-machine-disks-portal.md#detach-a-data-disk), and finally [resize the VM](azure-stack-edge-gpu-manage-virtual-machine-resize-portal.md#resize-a-vm) itself via the Azure portal.

### Back up VMs

You can back up the VM disks and in the event of a device failure, restore the data from the backups. For more information, see [Back up VM disks](azure-stack-edge-gpu-back-up-virtual-machine-disks.md).

## Next steps

- Learn about [VM sizes and types for Azure Stack Edge Pro GPU](azure-stack-edge-gpu-virtual-machine-sizes.md).


