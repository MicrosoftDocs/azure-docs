---
title: Tutorial - Create shared VM images with Azure PowerShell | Microsoft Docs
description: Learn how to use Azure PowerShell to create a shared virtual machine image in Azure
services: virtual-machines-windows
documentationcenter: virtual-machines
author: cynthn
manager: jeconnoc
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 09/05/2018
ms.author: cynthn
ms.custom: 

#Customer intent: As an IT administrator, I want to learn about how to create shared VM images to minimize the number of post-deployment configuration tasks.
---

# Preview: Create a shared image gallery with Azure PowerShell

The Shared Image Gallery greatly simplifies custom image sharing across your organization. Custom images are like marketplace images, but you create them yourself. Custom images can be used to bootstrap configurations such as preloading applications, application configurations, and other OS configurations. The Shared Image Gallery lets to share your custom VM images with others in your organization, within or across regions, within an AAD tenant. Choose which images you want to share, which regions you want to make them available in, and who you want to share them with. You can create multiple galleries so that you can logically group shared images. The gallery is a top-level resource that provides full role-based access control (RBAC). Images can be versioned, and you can choose to replicate each image version to a different set of Azure regions. The gallery only works with Managed Images.

In this tutorial, you create your own custom image of an Azure virtual machine and add the image to an image gallery for sharing. You learn how to:

> [!div class="checklist"]
> * Deprovision and generalize VMs
> * Create a managed image
> * Create an image gallery
> * Create a shared image
> * Create a VM from a shared image
> * Delete a resources


## Before you begin

The steps below detail how to take an existing VM and turn it into a re-usable custom image that you can use to create new VM instances.

To complete the example in this tutorial, you must have an existing virtual machine. If needed, this [script sample](../scripts/virtual-machines-windows-powershell-sample-create-vm.md) can create one for you. When working through the tutorial, replace the resource group and VM names where needed.

[!INCLUDE [cloud-shell-powershell.md](../../../includes/cloud-shell-powershell.md)]

If you choose to install and use the PowerShell locally, this tutorial requires the AzureRM module version 6.1.1 or later. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps).

```	


[!INCLUDE [virtual-machines-common-shared-images-ps](../../../includes/virtual-machines-common-shared-images-ps.md)]

 
## Create VMs from an image

Now that you have an image, you can create one or more new VMs from the image. Creating a VM from a custom image is similar to creating a VM using a Marketplace image. When you use a Marketplace image, you have to provide the information about the image, image provider, offer, SKU, and version. Using the simplified parameter set for the [New-AzureRMVM]() cmdlet, you just need to provide the name of the custom image as long as it is in the same resource group. 

This example creates a VM named *myVMfromImage*, in the *myResourceGroup* in the *East US* datacenter.

```azurepowershell-interactive
New-AzureRmVm `
   -ResourceGroupName "myResourceGroup" `
   -Name "myVMfromImage" `
   -Image $imageVersion.Id `
   -Location "East US" `
   -VirtualNetworkName "myImageVnet" `
   -SubnetName "myImageSubnet" `
   -SecurityGroupName "myImageNSG" `
   -PublicIpAddressName "myImagePIP" `
   -OpenPorts 3389
```

[!INCLUDE [virtual-machines-common-gallery-list-ps](../../../includes/virtual-machines-common-gallery-list-ps.md)]


## Next steps

In this tutorial, you created a custom VM image. You learned how to:

> [!div class="checklist"]
> * Deprovision and generalize VMs
> * Create a managed image
> * Create an image gallery
> * Create a shared image
> * Create a VM from a shared image
> * Delete a resources

You can also deploy Virtual Machine Scale Sets using shared images.


