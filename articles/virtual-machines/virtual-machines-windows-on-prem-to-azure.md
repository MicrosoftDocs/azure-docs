---
title: Create Azure VMs from on-premises VHDs | Microsoft Docs
description: Create VMs in Azure using VHDs uplaoded from on-premises, in the Resource Manager deployment model.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 3
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 02/05/2016
ms.author: cynthn

---

# Upload VHDs to use for creating new VMs in Azure


Before uploading any VHD to Azure, you should follow [Prepare a Windows VHD or VHDX to upload to Azure](virtual-machines-windows-prepare-for-upload-vhd-image.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)

## Upload a generalized VHD to Azure and use managed disks 

1. [Generalized the Windows VM using Sysprep](virtual-machines-windows-generalize-vhd.md)
2. [Upload a Windows VHD from an on-premises VM to Azure](virtual-machines-windows-upload-image.md)
3. [Capture a managed image of a generalized VM in Azure](virtual-machines-windows-capture-image-resource.md)
4. [Create a VM from a generalized managed VM image](virtual-machines-windows-create-vm-generalized-managed.md)


## Upload a specialized VHD to Azure and use managed disks 

1. [Upload a Windows VHD from an on-premises VM to Azure](virtual-machines-windows-upload-image.md)
2. (Create a managed disk from the uploaded VHD)[virtual-machines-windows-create-managed-disk-ps.md#]
3. [Create a VM from a specialized VHD](virtual-machines-windows-create-vm-specialized.md)


## Upload a generalized VHD to Azure and use unmanaged disks in a storage account

1. [Generalized the Windows VM using Sysprep](virtual-machines-windows-generalize-vhd.md)
2. [Upload a Windows VHD from an on-premises VM to Azure](virtual-machines-windows-upload-image.md)
3. [Capture an unmanaged image of the VHD](virtual-machines-windows-capture-image)
4. [Create a VM from an unmanged image in Azure](virtual-machines-windows-create-vm-generalized.md)




## Upload a specialized VHD to Azure and use unmanaged disks in a storage account

1. [Upload a Windows VHD from an on-premises VM to Azure](virtual-machines-windows-upload-image.md)
2. [Create a VM from a specialized VHD](virtual-machines-windows-create-vm-specialized.md)


