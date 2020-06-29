---
title: Migrate from a managed image to an image version with the Azure CLI 
description: Learn how to migrate from a managed image to an image version in a Shared Image Gallery using the Azure CLI.
author: cynthn
ms.service: virtual-machines
ms.subservice: imaging
ms.topic: how-to
ms.workload: infrastructure
ms.date: 05/04/2020
ms.author: cynthn
ms.reviewer: akjosh
#Need to show how to get the gallery and definition
---

# Migrate from a managed image to an image version using the Azure CLI
If you have an existing managed image that you would like to migrate into a Shared Image Gallery, you can create a Shared Image Gallery image directly from the managed image. Once you have tested your new image, you can delete the source managed image. You can also migrate from a managed image to a Shared Image Gallery using [PowerShell](image-version-managed-image-powershell.md).

Images in an image gallery have two components, which we will create in this example:
- An **Image definition** carries information about the image and requirements for using it. This includes whether the image is Windows or Linux, specialized or generalized, release notes, and minimum and maximum memory requirements. It is a definition of a type of image. 
- An **image version** is what is used to create a VM when using a Shared Image Gallery. You can have multiple versions of an image as needed for your environment. When you create a VM, the image version is used to create new disks for the VM. Image versions can be used multiple times.


## Before you begin

To complete this article, you must have an existing [Shared Image Gallery](shared-images-cli.md). 

To complete the example in this article, you must have an existing managed image of a generalized VM. For more information, see [Capture a managed image](./linux/capture-image.md). If the managed image contains a data disk, the data disk size cannot be more than 1 TB.

When working through this article, replace the resource group and VM names where needed.



## Create an image definition

Because managed images are always generalized images, you will create a an image definition using `--os-state generalized` for a generalized image.

Image definition names can be made up of uppercase or lowercase letters, digits, dots, dashes, and periods. 

For more information about the values you can specify for an image definition, see [Image definitions](https://docs.microsoft.com/azure/virtual-machines/linux/shared-image-galleries#image-definitions).

Create an image definition in the gallery using [az sig image-definition create](/cli/azure/sig/image-definition#az-sig-image-definition-create).

In this example, the image definition is named *myImageDefinition*, and is for a [generalized](./linux/shared-image-galleries.md#generalized-and-specialized-images) Linux OS image. To create a definition for images using a Windows OS, use `--os-type Windows`. 

```azurecli-interactive 
resourceGroup=myGalleryRG
gallery=myGallery
imageDef=myImageDefinition
az sig image-definition create \
   --resource-group $resourceGroup \
   --gallery-name $gallery \
   --gallery-image-definition $imageDef \
   --publisher myPublisher \
   --offer myOffer \
   --sku mySKU \
   --os-type Linux \
   --os-state generalized
```


## Create the image version

Create versions using [az image gallery create-image-version](/cli/azure/sig/image-version#az-sig-image-version-create). You will need to pass in the ID of the managed image to use as a baseline for creating the image version. You can use [az image list](/cli/azure/image?view#az-image-list) to get the IDs for your images. 

```azurecli-interactive
az image list --query "[].[name, id]" -o tsv
```

Allowed characters for image version are numbers and periods. Numbers must be within the range of a 32-bit integer. Format: *MajorVersion*.*MinorVersion*.*Patch*.

In this example, the version of our image is *1.0.0* and we are going to create 1 replica in the *South Central US* region and 1 replica in the *East US 2* region using zone-redundant storage. When choosing target regions for replication, remember that you also have to include the *source* region as a target for replication.

Pass the ID of the managed image in the `--managed-image` parameter.


```azurecli-interactive 
imageID="/subscriptions/<subscription ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/images/myImage"
az sig image-version create \
   --resource-group $resourceGroup \
   --gallery-name $gallery \
   --gallery-image-definition $imageDef \
   --gallery-image-version 1.0.0 \
   --target-regions "southcentralus=1" "eastus2=1=standard_zrs" \
   --replica-count 2 \
   --managed-image $imageID
```

> [!NOTE]
> You need to wait for the image version to completely finish being built and replicated before you can use the same managed image to create another image version.
>
> You can also store all of your image version replicas in [Zone Redundant Storage](https://docs.microsoft.com/azure/storage/common/storage-redundancy-zrs) by adding `--storage-account-type standard_zrs` when you create the image version.
>

## Next steps

Create a VM from a [generalized image version](vm-generalized-image-version-cli.md).