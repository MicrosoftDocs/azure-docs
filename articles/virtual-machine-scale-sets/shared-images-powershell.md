---
title: Use shared VM images to create a scale set in Azure
description: Learn how to use the Azure PowerShell to create shared VM images to use for deploying virtual machine scale sets in Azure.
author: cynthn
ms.service: virtual-machine-scale-sets
ms.subservice: imaging
ms.topic: how-to
ms.date: 05/04/2020
ms.author: cynthn
ms.reviewer: akjosh
---
# Create and use shared images for virtual machine scale sets with the Azure PowerShell

When you create a scale set, you specify an image to be used when the VM instances are deployed. The Shared Image Gallery service greatly simplifies custom image sharing across your organization. Custom images are like marketplace images, but you create them yourself. Custom images can be used to bootstrap configurations such as preloading applications, application configurations, and other OS configurations. 

The Shared Image Gallery lets you share your custom VM images with others in your organization, within or across regions, within an AAD tenant. Choose which images you want to share, which regions you want to make them available in, and who you want to share them with. You can create multiple galleries so that you can logically group shared images. 

The gallery is a top-level resource that provides full role-based access control (RBAC). Images can be versioned, and you can choose to replicate each image version to a different set of Azure regions. The gallery only works with Managed Images. 

The Shared Image Gallery feature has multiple resource types. 


[!INCLUDE [virtual-machines-shared-image-gallery-resources](../../includes/virtual-machines-shared-image-gallery-resources.md)]


## Before you begin

The steps below detail how to take an existing VM and turn it into a reusable custom image that you can use to create new VM instances.

To complete the example in this article, you must have an existing managed image. You can follow [Tutorial: Create and use a custom image for virtual machine scale sets with Azure PowerShell](tutorial-use-custom-image-powershell.md) to create one if needed. If the managed image contains a data disk, the data disk size cannot be more than 1 TB.

When working through the article, replace the resource group and VM names where needed.


[!INCLUDE [virtual-machines-common-shared-images-ps](../../includes/virtual-machines-common-shared-images-powershell.md)]




## Next steps

You can also create Shared Image Gallery resource using templates. There are several Azure Quickstart Templates available: 

- [Create a Shared Image Gallery](https://azure.microsoft.com/resources/templates/101-sig-create/)
- [Create an Image Definition in a Shared Image Gallery](https://azure.microsoft.com/resources/templates/101-sig-image-definition-create/)
- [Create an Image Version in a Shared Image Gallery](https://azure.microsoft.com/resources/templates/101-sig-image-version-create/)
- [Create a VM from Image Version](https://azure.microsoft.com/resources/templates/101-vm-from-sig/)

For more information about Shared Image Galleries, see the [Overview](shared-image-galleries.md). If you run into issues, see [Troubleshooting shared image galleries](troubleshooting-shared-images.md).
