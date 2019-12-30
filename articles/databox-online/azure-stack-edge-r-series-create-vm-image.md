---
title: Create VM images for your Azure Stack Edge device
description: Describes how to create linux or Windows VM images to use with your Azure Stack Edge device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: overview
ms.date: 12/29/2019
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand how to create and upload Azure VM images that I can use with my Azure Stack Edge device so that I can deploy VMs on the device.
---

# Create VM images for your Azure Stack Edge device

To deploy VMs on your Azure Stack Edge device, you need to be able to create VM images that you can use to create VMs. This article describes the steps required to create Linux or Windows VM images that you can use to deploy VMs on your Azure Stack Edge device.

## VM image workflow

The general workflows requires you to create a virtual machine in Azure, customize the VM, and then download the VHD corresponding to that VM. After you download the VHD, you can use it to create VM on your Azure Stack Edge device. For more information, go to [Deploy a VM on your Azure Stack Edge device using Azure PowerShell](azure-stack-edge-r-series-deploy-vm-powershell.md).


### Create a Windows VM image

Do the following steps to create a Windows VM image.

1. Create a Windows Virtual Machine. For more information, go to [Tutorial: Create and manage Windows VMs with Azure PowerShell](https://docs.microsoft.com/azure/virtual-machines/windows/tutorial-manage-vm)

2. Download an existing OS disk.

    - Follow the steps in [Download a VHD](https://docs.microsoft.com/azure/virtual-machines/windows/download-vhd).

    - Use the following `sysprep` command instead of what is described in the preceding procedure.
    
        `c:\windows\system32\sysprep\sysprep.exe /oobe /generalize /shutdown /mode:vm`
	
	    You can also refer to this document: [](https://docs.microsoft.com/windows-hardware/manufacture/desktop/sysprep--system-preparation--overview)

Use this VHD to now create and deploy a VM on your Azure Stack Edge device.

### Create a Linux VM image

Do the following steps to create a Linux VM image.

1. Create a Linux Virtual Machine. For more information, go to [Tutorial: Create and manage Linux VMs with the Azure CLI](https://docs.microsoft.com/azure/virtual-machines/linux/tutorial-manage-vm).

2. [Download existing OS disk](https://docs.microsoft.com/azure/virtual-machines/linux/download-vhd).

Use this VHD to now create and deploy a VM on your Azure Stack Edge device.

## Next steps

[Deploy VMs on your Azure Stack Edge device](azure-stack-edge-r-series-deploy-vm-powershell.md).