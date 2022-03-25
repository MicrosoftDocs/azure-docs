---
title: List, update, and delete resources 
description: List, update, and delete resources in your Azure Compute Gallery.
author: sandeepraichura
ms.author: saraic
ms.reviewer: cynthn
ms.service: virtual-machines
ms.subservice: gallery
ms.topic: how-to
ms.date: 03/25/2022
ms.custom: devx-track-azurecli, devx-track-azurepowershell

---

# List, update, and delete gallery resources 

You can manage your Azure Compute Gallery (formerly known as Shared Image Gallery) resources using the Azure CLI or Azure PowerShell.

## List your gallery information

### [CLI](#tab/cli)

Get the location, status and other information about the available image galleries using [az sig list](/cli/azure/sig#az_sig_list).

```azurecli-interactive 
az sig list -o table
```

> [!NOTE]
> To get the name of a community gallery, you need to use the portal. Go to **Virtual machines** > **Create** > **Azure virtual machine** > **Image** > **See all images** > **Community Images** > **Public gallery name**.

**List the image definitions**

See all of image definitions in your gallery using [az sig image-definition list](/cli/azure/sig/image-definition#az_sig_image_definition_list):

```azurecli-interactive 
az sig image-definition list --resource-group myGalleryRG --gallery-name myGallery -o table
```

List all of the image definitions that are available in a community gallery using [az sig image-definition list-community](/cli/azure/sig/image-definition#az_sig_image_definition_list_community):

```azurecli-interactive 
az sig image-definition list-community --resource-group myGalleryRG --gallery-name myGallery -o table
```

**List image versions** 

List image versions in your gallery using [az sig image-version list](/cli/azure/sig/image-version#az_sig_image_version_list):

```azurecli-interactive
az sig image-version list --resource-group myGalleryRG --gallery-name myGallery --gallery-image-definition myImageDefinition -o table
```

List image versions shared in a community gallery using [az sig image-version list-community](/cli/azure/sig/image-version#az_sig_image_version_list_community):

```azurecli-interactive
az sig image-version list --resource-group myGalleryRG --gallery-name myGallery --gallery-image-definition myImageDefinition -o table
```

**Get the image version ID**

Get the ID of an image version in your gallery using [az sig image-version show](/cli/azure/sig/image-version#az_sig_image_version_show). Like the other `list` and `show` commands, you can use `list-shared` to see image versions shared to your subscription, or `list-community` to see images shared into a community gallery. 

In this example, we are querying for the image ID of an image version in our *myGallery** image gallery:

```azurecli-interactive
az sig image-version show \
   --resource-group myGalleryRG \
   --gallery-name myGallery \
   --gallery-image-definition myImageDefinition \
   --gallery-image-version 1.0.0 \
   --query "id" 
```



### [PowerShell](#tab/powershell)

List all galleries by name.

```azurepowershell-interactive
$galleries = Get-AzResource -ResourceType Microsoft.Compute/galleries
$galleries.Name
```

List all image definitions by name.

```azurepowershell-interactive
$imageDefinitions = Get-AzResource -ResourceType Microsoft.Compute/galleries/images
$imageDefinitions.Name
```

List all image versions by name.

```azurepowershell-interactive
$imageVersions = Get-AzResource -ResourceType Microsoft.Compute/galleries/images/versions
$imageVersions.Name
```

Delete an image version. This example deletes the image version named *1.0.0*.

```azurepowershell-interactive
Remove-AzGalleryImageVersion `
   -GalleryImageDefinitionName myImageDefinition `
   -GalleryName myGallery `
   -Name 1.0.0 `
   -ResourceGroupName myGalleryRG
```


---


## Update resources

### [CLI](#tab/cli)
There are some limitations on what can be updated. The following items can be updated: 

Azure Compute Gallery:
- Description

Image definition:
- Recommended vCPUs
- Recommended memory
- Description
- End of life date

Image version:
- Regional replica count
- Target regions
- Exclusion from latest
- End of life date

If you plan on adding replica regions, do not delete the source managed image. The source managed image is needed for replicating the image version to additional regions. 

Update the description of a gallery using ([az sig update](/cli/azure/sig#az_sig_update). 

```azurecli-interactive
az sig update \
   --gallery-name myGallery \
   --resource-group myGalleryRG \
   --set description="My updated description."
```


Update the description of an image definition using [az sig image-definition update](/cli/azure/sig/image-definition#az_sig_image_definition_update).

```azurecli-interactive
az sig image-definition update \
   --gallery-name myGallery\
   --resource-group myGalleryRG \
   --gallery-image-definition myImageDefinition \
   --set description="My updated description."
```

Update an image version to add a region to replicate to using [az sig image-version update](/cli/azure/sig/image-definition#az_sig_image_definition_update). This change will take a while as the image gets replicated to the new region.

```azurecli-interactive
az sig image-version update \
   --resource-group myGalleryRG \
   --gallery-name myGallery \
   --gallery-image-definition myImageDefinition \
   --gallery-image-version 1.0.0 \
   --add publishingProfile.targetRegions  name=eastus
```

This example shows how to use [az sig image-version update](/cli/azure/sig/image-definition#az_sig_image_definition_update) to exclude this image version from being used as the *latest* image.

```azurecli-interactive
az sig image-version update \
   --resource-group myGalleryRG \
   --gallery-name myGallery \
   --gallery-image-definition myImageDefinition \
   --gallery-image-version 1.0.0 \
   --set publishingProfile.excludeFromLatest=true
```

This example shows how to use [az sig image-version update](/cli/azure/sig/image-definition#az_sig_image_definition_update) to include this image version in being considered for *latest* image.

```azurecli-interactive
az sig image-version update \
   --resource-group myGalleryRG \
   --gallery-name myGallery \
   --gallery-image-definition myImageDefinition \
   --gallery-image-version 1.0.0 \
   --set publishingProfile.excludeFromLatest=false
```

### [PowerShell](#tab/powershell)


There are some limitations on what can be updated. The following items can be updated: 

Azure Compute Gallery:
- Description

Image definition:
- Recommended vCPUs
- Recommended memory
- Description
- End of life date

Image version:
- Regional replica count
- Target regions
- Exclusion from latest
- End of life date

If you plan on adding replica regions, do not delete the source managed image. The source managed image is needed for replicating the image version to additional regions. 

To update the description of a gallery, use [Update-AzGallery](/powershell/module/az.compute/update-azgallery).

```azurepowershell-interactive
Update-AzGallery `
   -Name $gallery.Name ` 
   -ResourceGroupName $resourceGroup.Name
```

This example shows how to use [Update-AzGalleryImageDefinition](/powershell/module/az.compute/update-azgalleryimagedefinition) to update the end-of-life date for our image definition.

```azurepowershell-interactive
Update-AzGalleryImageDefinition `
   -GalleryName $gallery.Name `
   -Name $galleryImage.Name `
   -ResourceGroupName $resourceGroup.Name `
   -EndOfLifeDate 01/01/2030
```

This example shows how to use [Update-AzGalleryImageVersion](/powershell/module/az.compute/update-azgalleryimageversion) to exclude this image version from being used as the *latest* image.

```azurepowershell-interactive
Update-AzGalleryImageVersion `
   -GalleryImageDefinitionName $galleryImage.Name `
   -GalleryName $gallery.Name `
   -Name $galleryVersion.Name `
   -ResourceGroupName $resourceGroup.Name `
   -PublishingProfileExcludeFromLatest
```

This example shows how to use [Update-AzGalleryImageVersion](/powershell/module/az.compute/update-azgalleryimageversion) to include this image version in being considered for *latest* image.

```azurepowershell-interactive
Update-AzGalleryImageVersion `
   -GalleryImageDefinitionName $galleryImage.Name `
   -GalleryName $gallery.Name `
   -Name $galleryVersion.Name `
   -ResourceGroupName $resourceGroup.Name `
   -PublishingProfileExcludeFromLatest:$false
```

---




## Delete resources

You have to delete resources in reverse order, by deleting the image version first. After you delete all of the image versions, you can delete the image definition. After you delete all image definitions, you can delete the gallery. 

Before you can delete a community shared gallery, you need to use [az sig share reset](/cli/azure/sig/share?view=azure-cli-latest#az-sig-share-reset) to stop sharing the gallery publicly.

### [CLI](#tab/cli)

Delete an image version using [az sig image-version delete](/cli/azure/sig/image-version#az_sig_image_version_delete).

```azurecli-interactive
az sig image-version delete \
   --resource-group myGalleryRG \
   --gallery-name myGallery \
   --gallery-image-definition myImageDefinition \
   --gallery-image-version 1.0.0 
```

Delete an image definition using [az sig image-definition delete](/cli/azure/sig/image-definition#az_sig_image_definition_delete).

```azurecli-interactive
az sig image-definition delete \
   --resource-group myGalleryRG \
   --gallery-name myGallery \
   --gallery-image-definition myImageDefinition
```


Delete a gallery using [az sig delete](/cli/azure/sig#az_sig_delete). 

```azurecli-interactive
az sig delete \
   --resource-group myGalleryRG \
   --gallery-name myGallery
```

### [PowerShell](#tab/powershell)



```azurepowershell-interactive
$resourceGroup = "myResourceGroup"
$gallery = "myGallery"
$imageDefinition = "myImageDefinition"
$imageVersion = "myImageVersion"

Remove-AzGalleryImageVersion `
   -GalleryImageDefinitionName $imageDefinition `
   -GalleryName $gallery `
   -Name $imageVersion `
   -ResourceGroupName $resourceGroup

Remove-AzGalleryImageDefinition `
   -ResourceGroupName $resourceGroup `
   -GalleryName $gallery `
   -GalleryImageDefinitionName $imageDefinition

Remove-AzGallery `
   -Name $gallery `
   -ResourceGroupName $resourceGroup

Remove-AzResourceGroup -Name $resourceGroup
```

---

## Next steps

[Azure Image Builder (preview)](./image-builder-overview.md) can help automate image version creation, you can even use it to update and [create a new image version from an existing image version](./linux/image-builder-gallery-update-image-version.md).