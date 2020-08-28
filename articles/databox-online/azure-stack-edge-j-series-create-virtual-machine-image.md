---
title: Create VM images for your Azure Stack Edge device
description: Describes how to create linux or Windows VM images to use with your Azure Stack Edge device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: overview
ms.date: 08/21/2020
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand how to create and upload Azure VM images that I can use with my Azure Stack Edge device so that I can deploy VMs on the device.
---

# Create custom VM images for your Azure Stack Edge device

<!--[!INCLUDE [applies-to-skus](../../includes/azure-stack-edge-applies-to-all-sku.md)]-->

To deploy VMs on your Azure Stack Edge device, you need to be able to create custom VM images that you can use to create VMs. This article describes the steps required to create Linux or Windows VM custom images that you can use to deploy VMs on your Azure Stack Edge device.

## VM image workflow

The workflow requires you to create a virtual machine in Azure, customize the VM, generalize, and then download the VHD corresponding to that VM. This generalized VHD is uploaded to Azure Stack Edge, managed disk is created from that VHD, image is created from managed disk, and finally VMs are created from that image.   

For more information, go to [Deploy a VM on your Azure Stack Edge device using Azure PowerShell](azure-stack-edge-j-series-deploy-virtual-machine-powershell.md).


## Create a Windows custom VM image

Do the following steps to create a Windows VM image.

1. Create a Windows Virtual Machine. For more information, go to [Tutorial: Create and manage Windows VMs with Azure PowerShell](../virtual-machines/windows/tutorial-manage-vm.md)

2. Download an existing OS disk.

    - Follow the steps in [Download a VHD](../virtual-machines/windows/download-vhd.md).

    - Use the following `sysprep` command instead of what is described in the preceding procedure.
    
        `c:\windows\system32\sysprep\sysprep.exe /oobe /generalize /shutdown /mode:vm`
   
       You can also refer to [Sysprep (system preparation) overview](https://docs.microsoft.com/windows-hardware/manufacture/desktop/sysprep--system-preparation--overview).

Use this VHD to now create and deploy a VM on your Azure Stack Edge device.

## Create a Linux custom VM image

Do the following steps to create a Linux VM image.

1. Create a Linux Virtual Machine. For more information, go to [Tutorial: Create and manage Linux VMs with the Azure CLI](../virtual-machines/linux/tutorial-manage-vm.md).

2. [Download existing OS disk](../virtual-machines/linux/download-vhd.md).

Use this VHD to now create and deploy a VM on your Azure Stack Edge device. You can use the following two Azure Marketplace images to create Linux custom images:

|Item name  |Description  |Publisher  |
|---------|---------|---------|
|[Ubuntu Server](https://azuremarketplace.microsoft.com/marketplace/apps/canonical.ubuntuserver) |Ubuntu Server is the world's most popular Linux for cloud environments.|Canonical|
|[Debian 8 "Jessie"](https://azuremarketplace.microsoft.com/marketplace/apps/credativ.debian) |Debian GNU/Linux is one of the most popular Linux distributions.     |credativ|

For a full list of Azure marketplace images that could work (presently not tested), go to [Azure Marketplace items available for Azure Stack Hub](https://docs.microsoft.com/azure-stack/operator/azure-stack-marketplace-azure-items?view=azs-1910).


## Next steps

[Deploy VMs on your Azure Stack Edge device](azure-stack-edge-j-series-deploy-virtual-machine-powershell.md).
