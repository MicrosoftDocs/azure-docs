---
title: List, update, and delete resources 
description: List, update, and delete resources in your Azure Compute Gallery.
author: sandeepraichura
ms.author: saraic
ms.reviewer: cynthn
ms.service: virtual-machines
ms.subservice: gallery
ms.topic: how-to
ms.date: 04/20/2022
ms.custom: devx-track-azurecli, devx-track-azurepowershell

---

# List, update, and delete gallery resources

You can manage your Azure Compute Gallery (formerly known as Shared Image Gallery) resources using the Azure CLI or Azure PowerShell.

## List galleries shared with you

### [CLI](#tab/cli)

List Galleries shared with your subscription.

```azurecli-interactive
region=westus
az sig list-shared --location $region 
```

List Galleries shared with your tenant.

```azurecli-interactive
region=westus
az sig list-shared --location $region --shared-to tenant 
```

The output will contain the public `name` and `uniqueID` of the gallery that is shared with you. You can use the name of the gallery to query for images that are available through the gallery.

Here is example output:

```output
[
  {
    "location": "westus",
    "name": "1231b567-8a99-1a2b-1a23-123456789abc-MYDIRECTSHARED",
    "uniqueId": "/SharedGalleries/1231b567-8a99-1a2b-1a23-123456789abc-MYDIRECTSHARED"
  }
]
```

### [REST](#tab/rest)

List galleries shared with a subscription.

```REST
GET
https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{rgName}/providers/Microsoft.Compute/Locations/{location}/SharedGalleries?api-version=2020-09-30 
```
 

The response should look similar to this: 

```rest
{	 
"value": [ 
{ 
"identifier": { 
"uniqueId": "/SharedGalleries/{SharedGalleryUniqueName}"         
}, 
"name": "galleryuniquename1", 
   		"type": "Microsoft. Compute/sharedGalleries", 
   		"location": "location" 
  	}, 
  	{ 
"identifier": { 
"uniqueName": "/SharedGalleries/{SharedGalleryUniqueName}"       
}, 
"name": "galleryuniquename2", 
"type": "Microsoft. Compute/sharedGalleries", 
"location": "location" 
  	} 
], 
} 
```
 

List the galleries shared with a tenant.

```rest
GET
https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Compute/Locations/{location}/SharedGalleries?api-version=2020-09-30&sharedTo=tenant 
```
 

The response should look similar to this:

```
{	 
"value": [ 
{ 
"identifier": { 
"uniqueName": "/SharedGalleries/{SharedGalleryUniqueName}"         
}, 
"name": "galleryuniquename1", 
   		"type": "Microsoft. Compute/sharedGalleries", 
   		"location": "location" 
  	}, 
  	{ 
"identifier": { 
"uniqueName": "/SharedGalleries/{SharedGalleryUniqueName}"       
}, 
"name": "galleryuniquename2", 
"type": "Microsoft. Compute/sharedGalleries", 
"location": "location" 
  	} 
], 
} 

---

## List your gallery information

### [CLI](#tab/cli)

Get the location, status and other information about your image galleries using [az sig list](/cli/azure/sig#az-sig-list).

```azurecli-interactive 
az sig list -o table
```


**List the image definitions**

List the image definitions in your gallery, including information about OS type and status, using [az sig image-definition list](/cli/azure/sig/image-definition#az-sig-image-definition-list).


```azurecli-interactive 
az sig image-definition list --resource-group myGalleryRG --gallery-name myGallery -o table
```


**List image versions** 

List image versions in your gallery using [az sig image-version list](/cli/azure/sig/image-version#az-sig-image-version-list):


```azurecli-interactive
az sig image-version list --resource-group myGalleryRG --gallery-name myGallery --gallery-image-definition myImageDefinition -o table
```



**Get a specific image version**

Get the ID of a specific image version in your gallery using [az sig image-version show](/cli/azure/sig/image-version#az-sig-image-version-show).  

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


### [CLI](#tab/cli2)

Update the description of a gallery using ([az sig update](/cli/azure/sig#az-sig-update). 

```azurecli-interactive
az sig update \
   --gallery-name myGallery \
   --resource-group myGalleryRG \
   --set description="My updated description."
```


Update the description of an image definition using [az sig image-definition update](/cli/azure/sig/image-definition#az-sig-image-definition-update).

```azurecli-interactive
az sig image-definition update \
   --gallery-name myGallery\
   --resource-group myGalleryRG \
   --gallery-image-definition myImageDefinition \
   --set description="My updated description."
```

Update an image version to add a region to replicate to using [az sig image-version update](/cli/azure/sig/image-definition#az-sig-image-definition-update). This change will take a while as the image gets replicated to the new region.

```azurecli-interactive
az sig image-version update \
   --resource-group myGalleryRG \
   --gallery-name myGallery \
   --gallery-image-definition myImageDefinition \
   --gallery-image-version 1.0.0 \
   --add publishingProfile.targetRegions  name=eastus
```

This example shows how to use [az sig image-version update](/cli/azure/sig/image-definition#az-sig-image-definition-update) to exclude this image version from being used as the *latest* image.

```azurecli-interactive
az sig image-version update \
   --resource-group myGalleryRG \
   --gallery-name myGallery \
   --gallery-image-definition myImageDefinition \
   --gallery-image-version 1.0.0 \
   --set publishingProfile.excludeFromLatest=true
```

This example shows how to use [az sig image-version update](/cli/azure/sig/image-definition#az-sig-image-definition-update) to include this image version in being considered for *latest* image.

```azurecli-interactive
az sig image-version update \
   --resource-group myGalleryRG \
   --gallery-name myGallery \
   --gallery-image-definition myImageDefinition \
   --gallery-image-version 1.0.0 \
   --set publishingProfile.excludeFromLatest=false
```

### [PowerShell](#tab/powershell2)



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


### [CLI](#tab/cli4)

Before you can delete a community shared gallery, you need to use [az sig share reset](/cli/azure/sig/share#az-sig-share-reset) to stop sharing the gallery publicly.

Delete an image version using [az sig image-version delete](/cli/azure/sig/image-version#az-sig-image-version-delete).

```azurecli-interactive
az sig image-version delete \
   --resource-group myGalleryRG \
   --gallery-name myGallery \
   --gallery-image-definition myImageDefinition \
   --gallery-image-version 1.0.0 
```

Delete an image definition using [az sig image-definition delete](/cli/azure/sig/image-definition#az-sig-image-definition-delete).

```azurecli-interactive
az sig image-definition delete \
   --resource-group myGalleryRG \
   --gallery-name myGallery \
   --gallery-image-definition myImageDefinition
```


Delete a gallery using [az sig delete](/cli/azure/sig#az-sig-delete).

```azurecli-interactive
az sig delete \
   --resource-group myGalleryRG \
   --gallery-name myGallery
```

### [PowerShell](#tab/powershell4)



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
## Community galleries

> [!IMPORTANT]
> Azure Compute Gallery – community galleries is currently in PREVIEW and subject to the [Preview Terms for Azure Compute Gallery - community gallery](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

To list your own galleries, and output the public names for your community galleries:

```azurecli-interactive
az sig list --query [*]."{Name:name,PublicName:sharingProfile.communityGalleryInfo.publicNames}"
```


> [!NOTE]
> As an end user, to get the public name of a community gallery, you currently need to use the portal. Go to **Virtual machines** > **Create** > **Azure virtual machine** > **Image** > **See all images** > **Community Images** > **Public gallery name**.


List all of the image definitions that are available in a community gallery using [az sig image-definition list-community](/cli/azure/sig/image-definition#az-sig-image-definition-list-community). 

In this example, we list all of the images in the *ContosoImage* gallery in *West US* and by name, the unique ID that is needed to create a VM, OS and OS state.

```azurecli-interactive 
 az sig image-definition list-community \
   --public-gallery-name "ContosoImages-1a2b3c4d-1234-abcd-1234-1a2b3c4d5e6f" \
   --location westus \
   --query [*]."{Name:name,ID:uniqueId,OS:osType,State:osState}" -o table
```

List image versions shared in a community gallery using [az sig image-version list-community](/cli/azure/sig/image-version#az-sig-image-version-list-community):

```azurecli-interactive
az sig image-version list-community \
   --location westus \
   --public-gallery-name "ContosoImages-1a2b3c4d-1234-abcd-1234-1a2b3c4d5e6f" \
   --gallery-image-definition myImageDefinition \
   --query [*]."{Name:name,UniqueId:uniqueId}" \
   -o table
```

---
## Direct shared galleries


> [!IMPORTANT]
> Azure Compute Gallery – direct shared gallery is currently in PREVIEW and subject to the [Preview Terms for Azure Compute Gallery](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
>
> To publish images to a direct shared gallery during the preview, you need to register at [https://aka.ms/directsharedgallery-preview](https://aka.ms/directsharedgallery-preview). Creating VMs from a direct shared gallery is open to all Azure users.
>
> During the preview, you need to create a new gallery, with the property `sharingProfile.permissions` set to `Groups`. When using the CLI to create a gallery, use the `--permissions groups` parameter. You can't use an existing gallery, the property can't currently be updated.



To find the `uniqueID` of a gallery that is shared with you, use [az sig list-shared](/cli/azure/sig/image-definition#az-sig-image-definition-list-shared). In this example, we are looking for galleries in the West US region.

```azurecli-interactive
region=westus
az sig list-shared --location $region --query "[].uniqueId" -o tsv
```

List all of the image definitions that are shared directly with you, use [az sig image-definition list-shared](/cli/azure/sig/image-definition#az-sig-image-definition-list-shared). 

In this example, we list all of the images in the gallery in *West US* and by name, the unique ID that is needed to create a VM, OS and OS state.

```azurecli-interactive 
name="1a2b3c4d-1234-abcd-1234-1a2b3c4d5e6f-myDirectShared"
 az sig image-definition list-shared \
   --gallery-unique-name $name
   --location $region \
   --query [*]."{Name:name,ID:uniqueId,OS:osType,State:osState}" -o table
```

List image versions directly shared to you using [az sig image-version list-shared](/cli/azure/sig/image-version#az-sig-image-version-list-shared):

```azurecli-interactive
imgDef="myImageDefinition"
az sig image-version list-shared \
   --location $region \
   --public-gallery-name $name \
   --gallery-image-definition $imgDef \
   --query [*]."{Name:name,UniqueId:uniqueId}" \
   -o table
```

## Next steps

- Create an [image definition and an image version](image-version.md).
- Create a VM from a [generalized](vm-generalized-image-version.md) or [specialized](vm-specialized-image-version.md) image in an Azure Compute Gallery.
