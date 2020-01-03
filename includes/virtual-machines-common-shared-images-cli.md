---
 title: include file
 description: include file
 services: virtual-machines
 author: axayjo
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 05/21/2019
 ms.author: akjosh; cynthn
 ms.custom: include file
---

## Before you begin

To complete the example in this article, you must have an existing managed image of a generalized VM. For more information, see [Tutorial: Create a custom image of an Azure VM with the Azure CLI](https://docs.microsoft.com/azure/virtual-machines/linux/tutorial-custom-images). If the managed image contains a data disk, the data disk size cannot be more than 1 TB.

## Launch Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. 

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also launch Cloud Shell in a separate browser tab by going to [https://shell.azure.com/bash](https://shell.azure.com/bash). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press enter to run it.

If you prefer to install and use the CLI locally, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Create an image gallery 

An image gallery is the primary resource used for enabling image sharing. Allowed characters for Gallery name are uppercase or lowercase letters, digits, dots, and periods. The gallery name cannot contain dashes.   Gallery names must be unique within your subscription. 

Create an image gallery using [az sig create](/cli/azure/sig#az-sig-create). The following example creates a gallery named *myGallery* in *myGalleryRG*.

```azurecli-interactive
az group create --name myGalleryRG --location WestCentralUS
az sig create --resource-group myGalleryRG --gallery-name myGallery
```

## Create an image definition

Image definitions create a logical grouping for images. They are used to manage information about the image versions that are created within them. Image definition names can be made up of uppercase or lowercase letters, digits, dots, dashes, and periods. For more information about the values you can specify for an image definition, see [Image definitions](https://docs.microsoft.com/azure/virtual-machines/linux/shared-image-galleries#image-definitions).

Create an initial image definition in the gallery using [az sig image-definition create](/cli/azure/sig/image-definition#az-sig-image-definition-create).

```azurecli-interactive 
az sig image-definition create \
   --resource-group myGalleryRG \
   --gallery-name myGallery \
   --gallery-image-definition myImageDefinition \
   --publisher myPublisher \
   --offer myOffer \
   --sku 16.04-LTS \
   --os-type Linux 
```


## Create an image version 

Create versions of the image as needed using [az image gallery create-image-version](/cli/azure/sig/image-version#az-sig-image-version-create). You will need to pass in the ID of the managed image to use as a baseline for creating the image version. You can use [az image list](/cli/azure/image?view#az-image-list) to get information about images that are in a resource group. 

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

## Share the gallery

We recommend that you share with other users at the gallery level. To get the object ID of your gallery, use [az sig show](/cli/azure/sig#az-sig-show).

```azurecli-interactive
az sig show \
   --resource-group myGalleryRG \
   --gallery-name myGallery \
   --query id
```

Use the object ID as a scope, along with an email address and [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) to give a user access to the shared image gallery.

```azurecli-interactive
az role assignment create --role "Reader" --assignee <email address> --scope <gallery ID>
```


