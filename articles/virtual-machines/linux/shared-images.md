---
title: Create shared image galleries with the Azure CLI 
description: In this article, you learn how to use the Azure CLI to create a shared image of a VM in Azure.
author: cynthn
ms.service: virtual-machines
ms.topic: article
ms.workload: infrastructure
ms.date: 03/24/2020
ms.author: cynthn
#PMcontact: akjosh
#Customer intent: As an IT administrator, I want to learn about how to create shared VM images to minimize the number of post-deployment configuration tasks.
---
# Create a shared image gallery with the Azure CLI

A [Shared Image Gallery](shared-image-galleries.md) simplifies custom image sharing across your organization. Custom images are like marketplace images, but you create them yourself. Custom images can be used to bootstrap configurations such as preloading applications, application configurations, and other OS configurations. 

The Shared Image Gallery lets you share your custom VM images with others in your organization, within or across regions, within an AAD tenant. Choose which images you want to share, which regions you want to make them available in, and who you want to share them with. You can create multiple galleries so that you can logically group shared images. 

The gallery is a top-level resource that provides full role-based access control (RBAC). Images can be versioned, and you can choose to replicate each image version to a different set of Azure regions. The gallery only works with Managed Images.

The Shared Image Gallery feature has multiple resource types. We will be using or building these in this article:


[!INCLUDE [virtual-machines-shared-image-gallery-resources](../../../includes/virtual-machines-shared-image-gallery-resources.md)]


[!INCLUDE [virtual-machines-common-shared-images-cli](../../../includes/virtual-machines-common-shared-images-cli.md)]


For more information about how to share resources using RBAC, see [Manage access using RBAC and Azure CLI](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-cli).



## Next steps

Create an image version from a [VM](image-version-vm-cli.md), or a [managed image](image-version-managed-image-cli.md).

For more information about Shared Image Galleries, see the [Overview](shared-image-galleries.md). If you run into issues, see [Troubleshooting shared image galleries](troubleshooting-shared-images.md).
