---
title: Use shared VM images to create a scale set in Azure | Microsoft Docs
description: Learn how to use the Azure PowerShell to create shared VM images to use for deploying virtual machine scale sets in Azure.
services: virtual-machine-scale-sets
documentationcenter: ''
author: axayjo
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machine-scale-sets
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/25/2019
ms.author: akjosh; cynthn
ms.custom: 

---
# Create and use shared images for virtual machine scale sets with the Azure PowerShell

When you create a scale set, you specify an image to be used when the VM instances are deployed. The Shared Image Gallery service greatly simplifies custom image sharing across your organization. Custom images are like marketplace images, but you create them yourself. Custom images can be used to bootstrap configurations such as preloading applications, application configurations, and other OS configurations. 

The Shared Image Gallery lets you share your custom VM images with others in your organization, within or across regions, within an AAD tenant. Choose which images you want to share, which regions you want to make them available in, and who you want to share them with. You can create multiple galleries so that you can logically group shared images. 

The gallery is a top-level resource that provides full role-based access control (RBAC). Images can be versioned, and you can choose to replicate each image version to a different set of Azure regions. The gallery only works with Managed Images. 

The Shared Image Gallery feature has multiple resource types. We will be using or building these in this article:

| Resource | Description|
|----------|------------|
| **Managed image** | This is a basic image that can be used alone or used to create an **image version** in an image gallery. Managed images are created from generalized VMs. A managed image is a special type of VHD that can be used to make multiple VMs and can now be used to create shared image versions. |
| **Image gallery** | Like the Azure Marketplace, an **image gallery** is a repository for managing and sharing images, but you control who has access. |
| **Image definition** | Images are defined within a gallery and carry information about the image and requirements for using it internally. This includes whether the image is Windows or Linux, release notes, and minimum and maximum memory requirements. It is a definition of a type of image. |
| **Image version** | An **image version** is what you use to create a VM when using a gallery. You can have multiple versions of an image as needed for your environment. Like a managed image, when you use an **image version** to create a VM, the image version is used to create new disks for the VM. Image versions can be used multiple times. |

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [updated-for-az-vm.md](../../includes/updated-for-az-vm.md)]

## Before you begin

The steps below detail how to take an existing VM and turn it into a reusable custom image that you can use to create new VM instances.

To complete the example in this article, you must have an existing managed image. You can follow [Tutorial: Create and use a custom image for virtual machine scale sets with Azure PowerShell](tutorial-use-custom-image-powershell.md) to create one if needed. When working through the article, replace the resource group and VM names where needed.


[!INCLUDE [virtual-machines-common-shared-images-ps](../../includes/virtual-machines-common-shared-images-powershell.md)]

## Create a scale set from the shared image version

Create a virtual machine scale set with [New-AzVmss](/powershell/module/az.compute/new-azvmss). The following example creates a scale set from the new image version in the West US datacenter. The Azure network resources for virtual network, public IP address, and load balancer are automatically created. When prompted, set your own administrative credentials for the VM instances in the scale set:

```azurepowershell-interactive
New-AzVmss `
  -ResourceGroupName myVMSSRG `
  -Location 'South Central US' `
  -VMScaleSetName 'myScaleSet' `
  -VirtualNetworkName 'myVnet' `
  -SubnetName 'mySubnet'`
  -PublicIpAddressName 'myPublicIPAddress' `
  -LoadBalancerName 'myLoadBalancer' `
  -UpgradePolicyMode 'Automatic' `
  -ImageName $imageVersion.Id
```

It takes a few minutes to create and configure all the scale set resources and VMs.

[!INCLUDE [virtual-machines-common-gallery-list-ps](../../includes/virtual-machines-common-gallery-list-ps.md)]

[!INCLUDE [virtual-machines-common-shared-images-update-delete-ps](../../includes/virtual-machines-common-shared-images-update-delete-ps.md)]


## Next steps

You can also create Shared Image Gallery resource using templates. There are several Azure Quickstart Templates available: 

- [Create a Shared Image Gallery](https://azure.microsoft.com/resources/templates/101-sig-create/)
- [Create an Image Definition in a Shared Image Gallery](https://azure.microsoft.com/resources/templates/101-sig-image-definition-create/)
- [Create an Image Version in a Shared Image Gallery](https://azure.microsoft.com/resources/templates/101-sig-image-version-create/)
- [Create a VM from Image Version](https://azure.microsoft.com/resources/templates/101-vm-from-sig/)

For more information about Shared Image Galleries, see the [Overview](shared-image-galleries.md). If you run into issues, see [Troubleshooting shared image galleries](troubleshooting-shared-images.md).
