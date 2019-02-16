---
title: Create shared VM images with Azure PowerShell | Microsoft Docs
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
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 12/11/2018
ms.author: cynthn
ms.custom: 

#Customer intent: As an IT administrator, I want to learn about how to create shared VM images to minimize the number of post-deployment configuration tasks.
---

# Preview: Create a shared image gallery with Azure PowerShell 

A [Shared Image Gallery](shared-image-galleries.md) simplifies custom image sharing across your organization. Custom images are like marketplace images, but you create them yourself. Custom images can be used to bootstrap deployment tasks like preloading applications, application configurations, and other OS configurations. 

The Shared Image Gallery lets you share your custom VM images with others in your organization, within or across regions, within an AAD tenant. Choose which images you want to share, which regions you want to make them available in, and who you want to share them with. You can create multiple galleries so that you can logically group shared images. 

The gallery is a top-level resource that provides full role-based access control (RBAC). Images can be versioned, and you can choose to replicate each image version to a different set of Azure regions. The gallery only works with Managed Images.

The Shared Image Gallery feature has multiple resource types. We will be using or building these in this article:

| Resource | Description|
|----------|------------|
| **Managed image** | This is a basic image that can be used alone or used to create an **image version** in an image gallery. Managed images are created from generalized VMs. A managed image is a special type of VHD that can be used to make multiple VMs and can now be used to create shared image versions. |
| **Image gallery** | Like the Azure Marketplace, an **image gallery** is a repository for managing and sharing images, but you control who has access. |
| **Image definition** | Images are defined within a gallery and carry information about the image and requirements for using it internally. This includes whether the image is Windows or Linux, release notes, and minimum and maximum memory requirements. It is a definition of a type of image. |
| **Image version** | An **image version** is what you use to create a VM when using a gallery. You can have multiple versions of an image as needed for your environment. Like a managed image, when you use an **image version** to create a VM, the image version is used to create new disks for the VM. Image versions can be used multiple times. |

[!INCLUDE [updated-for-az-vm.md](../../../includes/updated-for-az-vm.md)]

## Before you begin

To complete the example in this article, you must have an existing managed image. You can follow [Tutorial: Create a custom image of an Azure VM with Azure PowerShell](tutorial-custom-images.md) to create one if needed. When working through this article, replace the resource group and VM names where needed.

[!INCLUDE [virtual-machines-common-shared-images-ps](../../../includes/virtual-machines-common-shared-images-powershell.md)]
 
## Create VMs from an image

Once the image version is complete, you can create one or more new VMs. Using the simplified parameter set for the [New-AzVM](https://docs.microsoft.com/powershell/module/az.compute/new-azvm) cmdlet, you just need to provide image ID of the image version. 

This example creates a VM named *myVMfromImage*, in the *myResourceGroup* in the *East US* datacenter.

```azurepowershell-interactive
New-AzVm `
   -ResourceGroupName "myResourceGroup" `
   -Name "myVMfromImage" `
   -Image $imageVersion.Id `
   -Location "South Central US" `
   -VirtualNetworkName "myImageVnet" `
   -SubnetName "myImageSubnet" `
   -SecurityGroupName "myImageNSG" `
   -PublicIpAddressName "myImagePIP" `
   -OpenPorts 3389
```

[!INCLUDE [virtual-machines-common-gallery-list-ps](../../../includes/virtual-machines-common-gallery-list-ps.md)]

## Clean up resources

When no longer needed, you can use the [Remove-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/remove-azresourcegroup) cmdlet to remove the resource group, VM, and all related resources:

```azurepowershell-interactive
Remove-AzResourceGroup -Name myGalleryRG
```

## Next steps

You can also create Shared Image Gallery resource using templates. There are several Azure Quickstart Templates available: 

- [Create a Shared Image Gallery](https://azure.microsoft.com/resources/templates/101-sig-create/)
- [Create an Image Definition in a Shared Image Gallery](https://azure.microsoft.com/resources/templates/101-sig-image-definition-create/)
- [Create an Image Version in a Shared Image Gallery](https://azure.microsoft.com/resources/templates/101-sig-image-version-create/)
- [Create a VM from Image Version](https://azure.microsoft.com/resources/templates/101-vm-from-sig/)

For more information about Shared Image Galleries, see the [Overview](shared-image-galleries.md). If you run into issues, see [Troubleshooting shared image galleries](troubleshooting-shared-images.md).

