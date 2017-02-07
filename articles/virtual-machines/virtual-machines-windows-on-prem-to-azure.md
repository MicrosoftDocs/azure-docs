---
title: Create Azure VMs from on-premises VHDs | Microsoft Docs
description: Create VMs in Azure using VHDs uploaded from on-premises, in the Resource Manager deployment model.
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


- [Migrate from Amazon Web Services (AWS) to Azure Managed Disks](virtual-machines-windows-aws-to-azure.md)
- [Upload a generalized VHD to Azure and use Managed Disks](virtual-machines-windows-upload-generalized-managed.md)
- [Upload a generalized VHD to Azure and use unmanaged disks in a storage account](virtual-machines-windows-upload-generalized-managed.md)
- [Upload a specialized VHD to Azure and use either Managed Disks or unmanaged disks in a storage account](virtual-machines-windows-upload-specialized.md)


## Next Steps

- Before uploading any VHD to Azure, you should follow [Prepare a Windows VHD or VHDX to upload to Azure](virtual-machines-windows-prepare-for-upload-vhd-image.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)