---
title: Create shared VM images with the Azure CLI | Microsoft Docs
description: In this article, you learn how to use the Azure CLI to create a shared image of a VM in Azure.
services: virtual-machines-linux
documentationcenter: virtual-machines
author: axayjo
manager: jeconnoc
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 09/19/2018
ms.author: akjosh; cynthn
ms.custom: 

#Customer intent: As an IT administrator, I want to learn about how to create shared VM images to minimize the number of post-deployment configuration tasks.
---

# Preview: Create a shared image gallery with the Azure CLI

The Shared Image Gallery greatly simplifies custom image sharing across your organization. Custom images are like marketplace images, but you create them yourself. Custom images can be used to bootstrap configurations such as preloading applications, application configurations, and other OS configurations. The Shared Image Gallery lets you share your custom VM images with others in your organization, within or across regions, within an AAD tenant. Choose which images you want to share, which regions you want to make them available in, and who you want to share them with. You can create multiple galleries so that you can logically group shared images. The gallery is a top-level resource that provides full role-based access control (RBAC). Images can be versioned, and you can choose to replicate each image version to a different set of Azure regions. The gallery only works with Managed Images.

In this article, you create your own gallery and custom images of an Azure virtual machine. You learn how to:

> [!div class="checklist"]
> * Create a shared image gallery
> * Create a shared image definition
> * Create a shared image version
> * Create a VM from a shared image
> * Delete a resources


[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0.46 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).

[!INCLUDE [virtual-machines-common-shared-images-cli](../../../includes/virtual-machines-common-shared-images-cli.md)]

## Create a VM

Create a VM from the image version using [az vm create](/cli/azure/vm#az-vm-create).

```azurecli-interactive 
az vm create\
   -g myGalleryRG \
   -n myVM \
   --image "/subscriptions/<subscription-ID>/resourceGroups/myGalleryRG/providers/Microsoft.Compute/galleries/myGallery/images/myImageDefinition/versions/1.0.0" \
   --generate-ssh-keys
```

[!INCLUDE [virtual-machines-common-gallery-list-cli](../../../includes/virtual-machines-common-gallery-list-cli.md)]



## Next steps

For more information about Shared Image Galleries, see the [Overview](shared-image-galleries.md).
