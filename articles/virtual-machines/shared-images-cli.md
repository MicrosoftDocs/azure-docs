---
title: Create shared image galleries with the Azure CLI 
description: In this article, you learn how to use the Azure CLI to create a shared image of a VM in Azure.
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
# Create a Shared Image Gallery with the Azure CLI

A [Shared Image Gallery](./linux/shared-image-galleries.md) simplifies custom image sharing across your organization. Custom images are like marketplace images, but you create them yourself. Custom images can be used to bootstrap configurations such as preloading applications, application configurations, and other OS configurations. 

The Shared Image Gallery lets you share your custom VM images with others. Choose which images you want to share, which regions you want to make them available in, and who you want to share them with. 

[!INCLUDE [virtual-machines-common-shared-images-cli](../../includes/virtual-machines-common-shared-images-cli.md)]


## Next steps

Create an image version from a [VM](image-version-vm-cli.md), or a [managed image](image-version-managed-image-cli.md) using the Azure CLI.

For more information about Shared Image Galleries, see the [Overview](./linux/shared-image-galleries.md). If you run into issues, see [Troubleshooting shared image galleries](troubleshooting-shared-images.md).
