---
title: Create a VM from a specialized image version using the Azure CLI
description: Create a VM using a specialized image version in a Shared Image Gallery using the Azure CLI.
author: cynthn
ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: article
ms.date: 03/27/2020
ms.author: cynthn
---

# Create a VM using a specialized image version with the Azure CLI

Create a VM from a [specialized image version](https://docs.microsoft.com/azure/virtual-machines/linux/shared-image-galleries#generalized-and-specialized-images) stored in a Shared Image Gallery. If want to create a VM using a generalized image version, see [Create a VM from a generalized image version](vm-generalized-image-version-cli.md).

Replace resource names as needed in this example. If you need help finding your resource names, see [List information](#list-information) later in this article.

Get the ID of the source image version using [az sig image-version show](/cli/azure/sig/image-version#az-sig-image-version-show). In this example, the resource group is *myGalleryRG*, the gallery is *myGallery*, the image definition is *myImageDefinition* and the image version is *1.0.0*.

```azurecli-interactive
az sig image-version show \
   --resource-group myGalleryRG \
   --gallery-name myGallery \
   --gallery-image-definition myImageDefinition \
   --gallery-image-version 1.0.0 \
   --query "id"
```

Create the VM using [az vm create](/cli/azure/vm#az-vm-create) by supplying th image version ID for `--attach-os-disk`. 

```azurecli
az vm create --resource-group myResourceGroup \
    --name myCopiedVM \
	--nics myNic \
	--size Standard_DS1_v2 \
	--os-type Linux \
    --attach-os-disk "/subscriptions/<Subscription ID>/resourceGroups/myGalleryRG/providers/Microsoft.Compute/galleries/myGallery/images/myImageDefinition/versions/1.0.0"
```


[!INCLUDE [virtual-machines-common-gallery-list-cli](../../includes/virtual-machines-common-gallery-list-cli.md)]

## Next steps
[Azure Image Builder (preview)](./linux/image-builder-overview.md) can help automate image version creation, you can even use it to update and [create a new image version from an existing image version](./linux/image-builder-gallery-update-image-version.md). 

You can also create Shared Image Gallery resource using templates. There are several Azure Quickstart Templates available: 

- [Create a Shared Image Gallery](https://azure.microsoft.com/resources/templates/101-sig-create/)
- [Create an Image Definition in a Shared Image Gallery](https://azure.microsoft.com/resources/templates/101-sig-image-definition-create/)
- [Create an Image Version in a Shared Image Gallery](https://azure.microsoft.com/resources/templates/101-sig-image-version-create/)
- [Create a VM from Image Version](https://azure.microsoft.com/resources/templates/101-vm-from-sig/)


