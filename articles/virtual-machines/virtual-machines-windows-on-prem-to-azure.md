---
title: Create Azure VMs from on-premises VHDs | Microsoft Docs
description: Create VMs in Azure using VHDs uplaoded from on-premises, in the Resource Manager deployment model.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 02/05/2016
ms.author: cynthn

---

# Upload VHDs to use for creating new VMs in Azure

You can upload VHD files to Azure in order to create Azure virtual machines. You can upload either generalized and specialized VHDs. 
* **Generalized VHD** - a generalized VHD has had all of your personal account information removed using Sysprep. 
* **Specialized VHD** - a specialized VHD maintains the user accounts, applications and other state data from your original VM. 

> [!IMPORTANT]
> Before uploading any VHD to Azure, you should follow [Prepare a Windows VHD or VHDX to upload to Azure](virtual-machines-windows-prepare-for-upload-vhd-image.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
>
>


* For information about pricing of the various VM sizes, see [Virtual Machines Pricing](https://azure.microsoft.com/pricing/details/virtual-machines/#Windows).
* For information on storage pricing, see [Storage Pricing](https://azure.microsoft.com/pricing/details/storage/blobs/). 
* For availability of VM sizes in Azure regions, see [Products available by region](https://azure.microsoft.com/regions/services/).
* To see general limits on Azure VMs, see [Azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md).


## Upload a generalized VHD to Azure and use Managed Disks 

1. [Generalized on-premises Windows VM using Sysprep](virtual-machines-windows-generalize-vhd.md)
2. [Upload the generalized VHD to Azure](virtual-machines-windows-upload-image.md)
3. [Create a managed image from the VHD Azure](virtual-machines-windows-capture-image-resource.md)
4. [Create a VM from the managed image](virtual-machines-windows-create-vm-generalized-managed.md)


## Upload a specialized VHD to Azure and use Managed Disks 

1. [Upload the specialized Windows VHD from on-premises to Azure](virtual-machines-windows-upload-image.md)
2. [Create the managed disk from the VHD and then create the VM](virtual-machines-windows-create-vm-specialized.md)


## Upload a generalized VHD to Azure and use unmanaged disks in a storage account

1. [Generalized the Windows VM using Sysprep](virtual-machines-windows-generalize-vhd.md)
2. [Upload the Windows VHD from on-premises to Azure](virtual-machines-windows-upload-image.md)
3. [Capture an unmanaged image of the VHD](virtual-machines-windows-capture-image)
4. [Create the VM from the unmanged image](virtual-machines-windows-create-vm-generalized.md)


## Upload a specialized VHD to Azure and use unmanaged disks in a storage account

1. [Upload the specialized Windows VHD from on-premises to Azure](virtual-machines-windows-upload-image.md)
2. [Create a VM from the specialized VHD](virtual-machines-windows-create-vm-specialized.md)


## Next Steps

- Before uploading any VHD to Azure, you should follow [Prepare a Windows VHD or VHDX to upload to Azure](virtual-machines-windows-prepare-for-upload-vhd-image.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)