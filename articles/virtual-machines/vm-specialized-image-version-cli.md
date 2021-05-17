---
title: Create a VM from a specialized image version using the Azure CLI
description: Create a VM using a specialized image version in a Shared Image Gallery using the Azure CLI.
author: cynthn
ms.service: virtual-machines
ms.subservice: shared-image-gallery
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 04/23/2020
ms.author: cynthn
ms.reviewer: akjosh 
ms.custom: devx-track-azurecli
---

# Create a VM using a specialized image version with the Azure CLI

Create a VM from a [specialized image version](./shared-image-galleries.md#generalized-and-specialized-images) stored in a Shared Image Gallery. If want to create a VM using a generalized image version, see [Create a VM from a generalized image version](vm-generalized-image-version-cli.md).

Replace resource names as needed in this example. 

List the image definitions in a gallery using [az sig image-definition list](/cli/azure/sig/image-definition#az_sig_image_definition_list) to see the name and ID of the definitions.

```azurecli-interactive 
resourceGroup=myGalleryRG
gallery=myGallery
az sig image-definition list \
   --resource-group $resourceGroup \
   --gallery-name $gallery \
   --query "[].[name, id]" \
   --output tsv
```

Create the VM using [az vm create](/cli/azure/vm#az_vm_create) using the --specialized parameter to indicate the the image is a specialized image. 

Use the image definition ID for `--image` to create the VM from the latest version of the image that is available. You can also create the VM from a specific version by supplying the image version ID for `--image`. 

In this example, we are creating a VM from the latest version of the *myImageDefinition* image.

```azurecli
az group create --name myResourceGroup --location eastus
az vm create --resource-group myResourceGroup \
    --name myVM \
    --image "/subscriptions/<Subscription ID>/resourceGroups/myGalleryRG/providers/Microsoft.Compute/galleries/myGallery/images/myImageDefinition" \
	--specialized
```


## Next steps
[Azure Image Builder (preview)](./image-builder-overview.md) can help automate image version creation, you can even use it to update and [create a new image version from an existing image version](./linux/image-builder-gallery-update-image-version.md). 

You can also create Shared Image Gallery resource using templates. There are several Azure Quickstart Templates available: 

- [Create a Shared Image Gallery](https://azure.microsoft.com/resources/templates/101-sig-create/)
- [Create an Image Definition in a Shared Image Gallery](https://azure.microsoft.com/resources/templates/101-sig-image-definition-create/)
- [Create an Image Version in a Shared Image Gallery](https://azure.microsoft.com/resources/templates/101-sig-image-version-create/)
- [Create a VM from Image Version](https://azure.microsoft.com/resources/templates/101-vm-from-sig/)