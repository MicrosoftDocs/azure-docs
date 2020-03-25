---
title: Copy an image version from another gallery
description: Copy an image version from another gallery with the Azure CLI.
author: cynthn
ms.service: virtual-machines
ms.topic: article
ms.workload: infrastructure
ms.date: 03/24/2020
ms.author: cynthn
#PMcontact: akjosh
#SIG to SIG
---

## Copy an image version from another gallery

Get the image definition from the original gallery
Create an image definition in the new gallery that matches the one in the original gallery
Get the ID of the image version in the original gallery
Create the image definition in the new gallery using the image version ID  from the old gallery as the `--managed-image`.

----------------
----------------


## Before you begin

To complete this article, you must have an existing [Shared Image Gallery and an image definition](./linux/shared-images.md#). Because managed images are always generalized images, create a an image definition for a generalized image before you begin.

To complete the example in this article, you must have an existing managed image of a generalized VM. For more information, see [Capture a managed image](./linux/capture-image.md). If the managed image contains a data disk, the data disk size cannot be more than 1 TB.

When working through this article, replace the resource group and VM names where needed.

[!INCLUDE [virtual-machines-common-gallery-list-cli](../../../includes/virtual-machines-common-gallery-list-cli.md)]

## Create the image version

Create versions using [az image gallery create-image-version](/cli/azure/sig/image-version#az-sig-image-version-create). You will need to pass in the ID of the managed image to use as a baseline for creating the image version. You can use [az image list](/cli/azure/image?view#az-image-list) to get information about images that are in a resource group. 

Allowed characters for image version are numbers and periods. Numbers must be within the range of a 32-bit integer. Format: *MajorVersion*.*MinorVersion*.*Patch*.

In this example, the version of our image is *1.0.0* and we are going to create 2 replicas in the *West Central US* region, 1 replica in the *South Central US* region and 1 replica in the *East US 2* region using zone-redundant storage.


```azurecli-interactive 
az sig image-version create \
   --resource-group myGalleryRG \
   --gallery-name myGallery \
   --gallery-image-definition myImageDefinition \
   --gallery-image-version 1.0.0 \
   --target-regions "WestCentralUS" "SouthCentralUS=1" "EastUS2=1=Standard_ZRS" \
   --replica-count 2 \
   --managed-image "/subscriptions/<subscription ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/images/myImage"
```

> [!NOTE]
> You need to wait for the image version to completely finish being built and replicated before you can use the same managed image to create another image version.
>
> You can also store all of your image version replicas in [Zone Redundant Storage](https://docs.microsoft.com/azure/storage/common/storage-redundancy-zrs) by adding `--storage-account-type standard_zrs` when you create the image version.
>

## Next steps

Create a VM from a [generalized image version](vm-generalized-image-version.md).





## Next steps

[Azure Image Builder (preview)](image-builder-overview.md) can help automate image version creation, you can even use it to update and [create a new image version from an existing image version](image-builder-gallery-update-image-version.md). 