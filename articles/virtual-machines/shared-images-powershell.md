---
title: Create a Shared Image Gallery with Azure PowerShell 
description: Learn how to use Azure PowerShell to create a Shared Image Gallery in Azure
author: cynthn
ms.service: virtual-machines
ms.subservice: imaging
ms.topic: how-to
ms.workload: infrastructure
ms.date: 05/04/2020
ms.author: cynthn
ms.reviewer: akjosh

#Customer intent: As an IT administrator, I want to learn about how to create shared VM images to minimize the number of post-deployment configuration tasks.
---

# Create a shared image gallery with Azure PowerShell 

A [Shared Image Gallery](./windows/shared-image-galleries.md) simplifies custom image sharing across your organization. Custom images are like marketplace images, but you create them yourself. Custom images can be used to bootstrap deployment tasks like preloading applications, application configurations, and other OS configurations. 

The Shared Image Gallery lets you share your custom VM images with others in your organization, within or across regions, within an AAD tenant. Choose which images you want to share, which regions you want to make them available in, and who you want to share them with. You can create multiple galleries so that you can logically group shared images. 

The gallery is a top-level resource that provides full role-based access control (RBAC). Images can be versioned, and you can choose to replicate each image version to a different set of Azure regions. The gallery only works with Managed Images.

The Shared Image Gallery feature has multiple resource types. 

[!INCLUDE [virtual-machines-shared-image-gallery-resources](../../includes/virtual-machines-shared-image-gallery-resources.md)]


[!INCLUDE [virtual-machines-common-shared-images-powershell](../../includes/virtual-machines-common-shared-images-powershell.md)]


## Next steps

Create an image from a [VM](image-version-vm-powershell.md), a [managed image](image-version-managed-image-powershell.md), or an [image in another gallery](image-version-another-gallery-powershell.md).

[Azure Image Builder (preview)](./windows/image-builder-overview.md) can help automate image version creation, you can even use it to update and [create a new image version from an existing image version](./windows/image-builder-gallery-update-image-version.md). 

You can also create Shared Image Gallery resource using templates. There are several Azure Quickstart Templates available: 

- [Create a Shared Image Gallery](https://azure.microsoft.com/resources/templates/101-sig-create/)
- [Create an Image Definition in a Shared Image Gallery](https://azure.microsoft.com/resources/templates/101-sig-image-definition-create/)
- [Create an Image Version in a Shared Image Gallery](https://azure.microsoft.com/resources/templates/101-sig-image-version-create/)
- [Create a VM from Image Version](https://azure.microsoft.com/resources/templates/101-vm-from-sig/)


