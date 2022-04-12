---
title: Create a scale set from a generalized image with Azure CLI
description: Create a scale set using a generalized image in an Azure Compute Gallery using the Azure CLI.
author: sandeepraichura
ms.author: saraic
ms.service: virtual-machine-scale-sets
ms.subservice: shared-image-gallery
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 05/01/2020
ms.reviewer: cynthn
---

# Create a scale set from a generalized image with Azure CLI

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Uniform scale sets

Create a scale set from a generalized image version stored in an [Azure Compute Gallery](../virtual-machines/shared-image-galleries.md) using the Azure CLI. If want to create a scale set using a specialized image version, see [Create scale set instances from a specialized image](instance-specialized-image-version-cli.md).

## Create a scale set from an image in your gallery

Replace resource names as needed in this example.

List the image definitions in a gallery using [az sig image-definition list](/cli/azure/sig/image-definition#az-sig-image-definition-list) to see the name and ID of the definitions.

```azurecli-interactive 
resourceGroup=myGalleryRG
gallery=myGallery
az sig image-definition list \
   --resource-group $resourceGroup \
   --gallery-name $gallery \
   --query "[].[name, id]" \
   --output tsv
```

Create the scale set using [`az vmss create`](/cli/azure/vmss#az-vmss-create). 

Use the image definition ID for `--image` to create the scale set instances from the latest version of the image that is available. You can also create the scale set instances from a specific version by supplying the image version ID for `--image`. Be aware that using a specific image version means automation could fail if that specific image version isn't available because it was deleted or removed from the region. We recommend using the image definition ID for creating your new VM, unless a specific image version is required.

In this example, we are creating instances from the latest version of the *myImageDefinition* image.

```azurecli
az group create --name myResourceGroup --location eastus
az vmss create \
   --resource-group myResourceGroup \
   --name myScaleSet \
   --image "/subscriptions/<Subscription ID>/resourceGroups/myGalleryRG/providers/Microsoft.Compute/galleries/myGallery/images/myImageDefinition" 
   --admin-username azureuser \
   --generate-ssh-keys
```

It takes a few minutes to create and configure all the scale set resources and VMs.

## Create a scale set from an image in a community gallery

You can create scale sets from images in the community gallery, but if the image is removed at a later time, you won't be able to scale up. To ensure you have long-term access to the image, you should consider creating an image in your own gallery from a VM created using the community gallery image that you want to use for your scale set. For more information, see [Create an image definition and an image version](../virtual-machines/image-version.md).

If you choose to install and use the CLI locally, the community gallery requires that you are running the Azure CLI version 2.4.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).

Replace resource names as needed in this example.

> [!NOTE]
> As an end user, to get the public name of a community gallery, you need to use the portal. Go to **Virtual machines** > **Create** > **Azure virtual machine** > **Image** > **See all images** > **Community Images** > **Public gallery name**.

To create a VM using an image shared to a community gallery, use the unique ID of the image for the `--image` which will be in the following format:

```
/CommunityGalleries/<community gallery name, like: ContosoImages-1a2b3c4d-1234-abcd-1234-1a2b3c4d5e6f>/Images/<image name>/Versions/latest
```

To list all of the image definitions that are available in a community gallery using [az sig image-definition list-community](/cli/azure/sig/image-definition#az_sig_image_definition_list_community). In this example, we list all of the images in the *ContosoImage* gallery in *West US* and by name, the unique ID that is needed to create a VM, OS and OS state.

```azurecli-interactive 
 az sig image-definition list-community \
   --public-gallery-name "ContosoImages-1a2b3c4d-1234-abcd-1234-1a2b3c4d5e6f" \
   --location westus \
   --query [*]."{Name:name,ID:uniqueId,OS:osType,State:osState}" -o table
```

Create the scale set by setting the `--image` parameter to the unique ID of the image in the community gallery. In this example, we are creating a `Flexible` scale set.

```azurecli
az group create --name myResourceGroup --location eastus

imgDef="/CommunityGalleries/ContosoImages-1a2b3c4d-1234-abcd-1234-1a2b3c4d5e6f>/Images/myLinuxImage/Versions/latest"

az vmss create \
   --resource-group myResourceGroup \
   --name myScaleSet \
   --image $imgDef \
  --orchestration-mode Flexible
   --admin-username azureuser \
   --generate-ssh-keys
```

## Next steps
[Azure Image Builder (preview)](../virtual-machines/image-builder-overview.md) can help automate image version creation, you can even use it to update and [create a new image version from an existing image version](../virtual-machines/linux/image-builder-gallery-update-image-version.md). 

You can also create Azure Compute Gallery resource using templates. There are several Azure Quickstart Templates available: 

- [Create an Azure Compute Gallery](https://azure.microsoft.com/resources/templates/sig-create/)
- [Create an Image Definition in an Azure Compute Gallery](https://azure.microsoft.com/resources/templates/sig-image-definition-create/)
- [Create an Image Version in an Azure Compute Gallery](https://azure.microsoft.com/resources/templates/sig-image-version-create/)

For more information about Shared Image Galleries, see the [Overview](../virtual-machines/shared-image-galleries.md). If you run into issues, see [Troubleshooting shared image galleries](../virtual-machines/troubleshooting-shared-images.md).