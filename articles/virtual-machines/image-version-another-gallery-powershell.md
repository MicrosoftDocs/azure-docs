---
title: Copy an image from another gallery
description: Copy an image from another gallery using Azure PowerShell.
author: cynthn
ms.service: virtual-machines
ms.topic: article
ms.workload: infrastructure
ms.date: 04/02/2020
ms.author: cynthn
#PMcontact: akjosh
#SIG to SIG
---

# Copy an image from another gallery

If you have multiple galleries in your organization, you can also create image versions from existing image versions stored in other galleries. For example, you might have a development and test gallery for creating and testing new images. When they are ready to be used in production, you can copy them into a production gallery using this example. You can also create an image from and image in another gallery using the [Azure CLI](image-version-another-gallery-cli.md).


To complete this article, you must have an existing source gallery, image definition, and image version. You should also have a destination gallery. We will be creating a new image definition and image version in your destination gallery


When working through this article, replace the resource names where needed.

[!INCLUDE [virtual-machines-common-gallery-list-cli](../../includes/virtual-machines-common-gallery-list-cli.md)]

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



## Get the source image version

You will need information from the source image definition so you can create a copy of it in your new gallery.

List information about the existing galleries, image definitions, and image versions using the [Get-AzResource](/powershell/module/az.resources/get-azresource) cmdlet.

The results are in the format `gallery\image definition\image version`.

```azurepowershell-interactive
$imageVersions = Get-AzResource -ResourceType Microsoft.Compute/galleries/images/versions
$imageVersions.Name
```

Once you have all of the information you need, you can get the ID of the source image version using [Get-AzGalleryImageVersion](/powershell/module/az.compute/get-azgalleryimageversion). In this example, we are getting the `1.0.0` image version, using the `myImageDefinition`, in the `myGallery` source gallery, from the `myResourceGroup` resource group.

```azurepowershell-interactive
$sourceImgVer = Get-AzGalleryImageVersion `
   -GalleryImageDefinitionName myImageDefinition `
   -GalleryName myGallery `
   -ResourceGroupName myResourceGroup `
   -Name 1.0.0
```


## Create the image definition 

You need to create a new image definition that matches the image definition of your source image version. You can see all of the information you need to recreate the image definition in your new gallery using [Get-AzGalleryImageDefinition](/powershell/module/az.compute/get-azgalleryimagedefinition).

```azurepowershell-interactive
Get-AzGalleryImageDefinition `
   -GalleryName myGallery `
   -ResourceGroupName myResourceGroup `
   -Name myImageDefinition
```


The output will look something like this:

```output
{
  "description": null,
  "disallowed": null,
  "endOfLifeDate": null,
  "eula": null,
  "hyperVgeneration": "V1",
  "id": "/subscriptions/1111abcd-1a23-4b45-67g7-1234567de123/resourceGroups/myGalleryRG/providers/Microsoft.Compute/galleries/myGallery/images/myImageDefinition",
  "identifier": {
    "offer": "myOffer",
    "publisher": "myPublisher",
    "sku": "mySKU"
  },
  "location": "eastus",
  "name": "myImageDefinition",
  "osState": "Specialized",
  "osType": "Windows",
  "privacyStatementUri": null,
  "provisioningState": "Succeeded",
  "purchasePlan": null,
  "recommended": null,
  "releaseNoteUri": null,
  "resourceGroup": "myGalleryRG",
  "tags": null,
  "type": "Microsoft.Compute/galleries/images"
}
```

Create a new image definition, in your new gallery, using the information from the output above.


Create the image definition using [New-AzGalleryImageDefinition](https://docs.microsoft.com/powershell/module/az.compute/new-azgalleryimageversion) and the information from the output. In this example, the image definition is named *myDestinationImgDef* in the gallery named *myDestinationGallery*.


```azurepowershell-interactive
$sourceImgVer  = New-AzGalleryImageDefinition `
   -GalleryName myDestinationGallery `
   -ResourceGroupName myDestinationRG `
   -Location WestUS `
   -Name 'myDestinationImgDef' `
   -OsState specialized `
   -OsType Windows `
   -HyperVGeneration v1
   -Publisher 'myPublisher' `
   -Offer 'myOffer' `
   -Sku 'mySKU'
```


## Create the image version

Create an image version using [New-AzGalleryImageVersion](https://docs.microsoft.com/powershell/module/az.compute/new-azgalleryimageversion), and the information from the output. You will need to pass in the ID source image version in the `--managed-image` parameter to use as a baseline for creating the image version in your destination gallery. 

Allowed characters for image version are numbers and periods. Numbers must be within the range of a 32-bit integer. Format: *MajorVersion*.*MinorVersion*.*Patch*.

In this example, the version of our image is *1.0.0* and we are going to create 2 replicas in the *West Central US* region, 1 replica in the *South Central US* region and 1 replica in the *East US 2* region using zone-redundant storage. 


```azurecli-interactive 
az sig image-version create \
   --resource-group myDestinationRG \
   --gallery-name myDestinationGallery \
   --gallery-image-definition 'myDestinationImgDef' \
   --gallery-image-version 1.0.0 \
   --target-regions "WestCentralUS" "SouthCentralUS=1" "EastUS2=1=Standard_ZRS" \
   --replica-count 2 \
   --managed-image $sourceImgVer.Id
```

> [!NOTE]
> You need to wait for the image version to completely finish being built and replicated before you can use the same managed image to create another image version.
>
> You can also store all of your image version replicas in [Zone Redundant Storage](https://docs.microsoft.com/azure/storage/common/storage-redundancy-zrs) by adding `--storage-account-type standard_zrs` when you create the image version.
>

## Next steps

Create a VM from a [generalized](vm-generalized-image-version-powershell.md) or a [specialized](vm-specialized-image-version-powershell.md) image version.

[Azure Image Builder (preview)](./linux/image-builder-overview.md) can help automate image version creation, you can even use it to update and [create a new image version from an existing image version](./linux/image-builder-gallery-update-image-version.md). 