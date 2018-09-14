---
 title: include file
 description: include file
 services: virtual-machines
 author: cynthn
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 09/13/2018
 ms.author: cynthn
 ms.custom: include file
---

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0.46 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).

## Before you begin

To complete the example in this article, you must have an existing managed image of a generalized VM. For more information, see [Tutorial: Create a custom image of an Azure VM with the Azure CLI 2.0](https://docs.microsoft.com/azure/virtual-machines/linux/tutorial-custom-images). 

## Preview: Register the feature

Shared Image Galleries is in preview, but you need to register the feature before you can use it. To register the Shared Image Galleries feature:

```azurecli-interactive
az feature register --namespace Microsoft.Compute --name GalleryPreview
az provider register -n Microsoft.Compute
```

It might take a few minutes to register the feature. You can check the progress using:

```azurecli-interactive
az provider show -n Microsoft.Compute
```

## Create an image gallery 

An image gallery is the primary resource used for enabling image sharing. Gallery names must be unique within your subscription. Create an image gallery using [az sig create](/cli/azure). The following example creates a gallery named *myGallery* in *myGalleryRG*.

```azurecli-interactive
az group create --name myGalleryRG --location WestCentralUS
az sig create -g myGalleryRG --gallery-name myGallery
```

## Create an image definition

Create an initial image definition in the gallery using [az sig image-definition create](/cli/azure).

```azurecli-interactive 
az sig image-definition create \
   -g myGalleryRG \
   --gallery-name myGallery \
   --gallery-image-definition myImageDefinition \
   --publisher myPublisher \
   --offer myOffer \
   --sku 16.04-LTS \
   --os-type Linux 
```

## Create an image version 
 
Create versions of the image as needed using az image gallery create-image-version. You will need to pass in the ID of the managed image to use as a baseline for creating the image version. You can use [az image list](/cli/azure/image?view#az-image-list) to get information about images that are in a resource group. In this example, the version of our image is *1.0.0*.

```azurecli-interactive 
az sig image-version create \
   -g myGalleryRG \
   --gallery-name myGallery \
   --gallery-image-definition myImageDefinition \
   --gallery-image-version 1.0.0 \
   --target-regions "EastUS=5" "WestUS=7" \
   --managed-image "/subscriptions/<subscription id>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/images/myImage"
```


