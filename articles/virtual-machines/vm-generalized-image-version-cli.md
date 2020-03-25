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

Create a VM from a generalized image version stored in a Shared Image Gallery. If want to create a VM using a specialized image version, see [Create a VM from a specialized image version](vm-specialized-image-version-cli.md).

[!INCLUDE [virtual-machines-common-gallery-list-cli](../../../includes/virtual-machines-common-gallery-list-cli.md)]


## Create the VM

Create a VM from the latest image version using [az vm create](/cli/azure/vm#az-vm-create). To use the latest image version, the value for `--image` is set to the ID of the image definition. 

Replace resource names as needed in this example. 

```azurecli-interactive 
az vm create\
   --resource-group myGalleryRG \
   --name myVM \
   --image "/subscriptions/subscription ID where the gallery is located>/resourceGroups/myGalleryRG/providers/Microsoft.Compute/galleries/myGallery/images/myImageDefinition" \
   --generate-ssh-keys
```

You can also use a specific version by using the image version ID for the `--image` parameter. For example, to use image version *1.0.0* type: `--image "/subscriptions/<subscription ID where the gallery is located>/resourceGroups/myGalleryRG/providers/Microsoft.Compute/galleries/myGallery/images/myImageDefinition/versions/1.0.0"`.

## Next steps


[Azure Image Builder (preview)](image-builder-overview.md) can help automate image version creation, you can even use it to update and [create a new image version from an existing image version](image-builder-gallery-update-image-version.md). 