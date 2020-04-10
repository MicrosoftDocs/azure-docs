---
title: Create a VM from a generalized image version using the Azure CLI 
description: Create a VM from a generalized image version using the Azure CLI.
author: cynthn
ms.service: virtual-machines
ms.topic: article
ms.workload: infrastructure
ms.date: 03/24/2020
ms.author: cynthn
#PMcontact: akjosh
#Need to get info about the gallery and definition
---
# Create a VM from a generalized image version using the CLI

Create a VM from a [generalized image version](https://docs.microsoft.com/azure/virtual-machines/linux/shared-image-galleries#generalized-and-specialized-images) stored in a Shared Image Gallery. If want to create a VM using a specialized image, see [Create a VM from a specialized image using PowerShell](vm-specialized-image-version-powershell.md). Currently, you cannot create a VM from a specialized image using the Azure CLI.

[!INCLUDE [virtual-machines-common-gallery-list-cli](../../includes/virtual-machines-common-gallery-list-cli.md)]

## Get the image ID

List the image definitions in a gallery using [az sig image-definition list](/cli/azure/sig/image-definition#az-sig-image-definition-list) to see the name and ID of the definitions.

```azurecli-interactive 
az sig image-definition list --resource-group myGalleryRG --gallery-name myGallery --query "[].[name, id]" --output tsv
```

## Create the VM

Create a VM using [az vm create](/cli/azure/vm#az-vm-create). To use the latest verison of the image, set `--image` to the ID of the image definition. 

Replace resource names as needed in this example. 

```azurecli-interactive 
az vm create\
   --resource-group myGalleryRG \
   --name myVM \
   --image "/subscriptions/<subscription ID where the gallery is located>/resourceGroups/myGalleryRG/providers/Microsoft.Compute/galleries/myGallery/images/myImageDefinition" \
   --generate-ssh-keys
```

You can also use a specific version by using the image version ID for the `--image` parameter. For example, to use image version *1.0.0* type: `--image "/subscriptions/<subscription ID where the gallery is located>/resourceGroups/myGalleryRG/providers/Microsoft.Compute/galleries/myGallery/images/myImageDefinition/versions/1.0.0"`.

## Next steps


[Azure Image Builder (preview)](./linux/image-builder-overview.md) can help automate image version creation, you can even use it to update and [create a new image version from an existing image version](./linux/image-builder-gallery-update-image-version.md). 