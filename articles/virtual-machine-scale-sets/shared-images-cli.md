---
title: Use shared VM images to create a scale set in Azure | Microsoft Docs
description: Learn how to use the Azure CLI to create shared VM images to use for deploying virtual machine scale sets in Azure.
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
ms.date: 05/06/2019
ms.author: akjosh
ms.reviewer: cynthn
ms.custom: 

---
# Create and use shared images for virtual machine scale sets with the Azure CLI 2.0

When you create a scale set, you specify an image to be used when the VM instances are deployed. [Shared Image Galleries](shared-image-galleries.md) greatly simplifies custom image sharing across your organization. Custom images are like marketplace images, but you create them yourself. Custom images can be used to bootstrap configurations such as preloading applications, application configurations, and other OS configurations. The Shared Image Gallery lets you share your custom VM images with others in your organization, within or across regions, within an AAD tenant. Choose which images you want to share, which regions you want to make them available in, and who you want to share them with. You can create multiple galleries so that you can logically group shared images. The gallery is a top-level resource that provides full role-based access control (RBAC). Images can be versioned, and you can choose to replicate each image version to a different set of Azure regions. The gallery only works with Managed Images. 

>[!NOTE]
> This article walks through the process of using a generalized managed image. It is not supported to create a scale set from a specialized VM image.


[!INCLUDE [virtual-machines-common-shared-images-cli](../../includes/virtual-machines-common-shared-images-cli.md)]

## Create a scale set from the custom VM image
Create a scale set with [`az vmss create`](/cli/azure/vmss#az-vmss-create). Instead of a platform image, such as *UbuntuLTS* or *CentOS*, specify the name of your custom VM image. The following example creates a scale set named *myScaleSet* that uses the custom image named *myImage* from the previous step:

```azurecli-interactive
az vmss create \
  -g myGalleryRG \
  -n myScaleSet \
  --image "/subscriptions/<subscription ID>/resourceGroups/myGalleryRG/providers/Microsoft.Compute/galleries/myGallery/images/myImageDefinition/versions/1.0.0" \
  --admin-username azureuser \
  --generate-ssh-keys
```

It takes a few minutes to create and configure all the scale set resources and VMs.


[!INCLUDE [virtual-machines-common-gallery-list-cli](../../includes/virtual-machines-common-gallery-list-cli.md)]


## Clean up resources
To remove your scale set and additional resources, delete the resource group and all its resources with [az group delete](/cli/azure/group). The `--no-wait` parameter returns control to the prompt without waiting for the operation to complete. The `--yes` parameter confirms that you wish to delete the resources without an additional prompt to do so.

```azurecli-interactive
az group delete --name myResourceGroup --no-wait --yes
```


## Next steps

You can also create Shared Image Gallery resource using templates. There are several Azure Quickstart Templates available: 

- [Create a Shared Image Gallery](https://azure.microsoft.com/resources/templates/101-sig-create/)
- [Create an Image Definition in a Shared Image Gallery](https://azure.microsoft.com/resources/templates/101-sig-image-definition-create/)
- [Create an Image Version in a Shared Image Gallery](https://azure.microsoft.com/resources/templates/101-sig-image-version-create/)
- [Create a VM from Image Version](https://azure.microsoft.com/resources/templates/101-vm-from-sig/)


If you run into any issues, you can [troubleshoot shared image galleries](troubleshooting-shared-images.md).
