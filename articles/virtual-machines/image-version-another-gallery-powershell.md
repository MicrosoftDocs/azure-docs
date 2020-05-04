---
title: Copy an image from another gallery
description: Copy an image from another gallery using Azure PowerShell.
author: cynthn
ms.service: virtual-machines
ms.subservice: imaging
ms.topic: how-to
ms.workload: infrastructure
ms.date: 05/04/2020
ms.author: cynthn
ms.reviewer: akjosh
#SIG to SIG
---

# Copy an image from another gallery

If you have multiple galleries in your organization, you can create images from images stored in other galleries. For example, you might have a development and test gallery for creating and testing new images. When they are ready to be used in production, you can copy them into a production gallery using this example. You can also create an image from an image in another gallery using the [Azure CLI](image-version-another-gallery-cli.md).


## Before you begin

To complete this article, you must have an existing source gallery, image definition, and image version. You should also have a destination gallery. 

The source image version must be replicated to the region where your destination gallery is located. 

We will be creating a new image definition and image version in your destination gallery.


When working through this article, replace the resource names where needed.


## Get the source image 

You will need information from the source image definition so you can create a copy of it in your destination gallery.

List information about the existing galleries, image definitions, and image versions using the [Get-AzResource](/powershell/module/az.resources/get-azresource) cmdlet.

The results are in the format `gallery\image definition\image version`.

```azurepowershell-interactive
Get-AzResource `
   -ResourceType Microsoft.Compute/galleries/images/versions | `
   Format-Table -Property Name,ResourceGroupName
```

Once you have all of the information you need, you can get the ID of the source image version using [Get-AzGalleryImageVersion](/powershell/module/az.compute/get-azgalleryimageversion). In this example, we are getting the `1.0.0` image version, of the `myImageDefinition` definition, in the `myGallery` source gallery, in the `myResourceGroup` resource group.

```azurepowershell-interactive
$sourceImgVer = Get-AzGalleryImageVersion `
   -GalleryImageDefinitionName myImageDefinition `
   -GalleryName myGallery `
   -ResourceGroupName myResourceGroup `
   -Name 1.0.0
```


## Create the image definition 

You need to create a new image definition that matches the image definition of your source. You can see all of the information you need to recreate the image definition using [Get-AzGalleryImageDefinition](/powershell/module/az.compute/get-azgalleryimagedefinition).

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

Create a new image definition, in your destination gallery, using the [New-AzGalleryImageDefinition](https://docs.microsoft.com/powershell/module/az.compute/new-azgalleryimageversion) cmdlet and the information from the output above.


In this example, the image definition is named *myDestinationImgDef* in the gallery named *myDestinationGallery*.


```azurepowershell-interactive
$destinationImgDef  = New-AzGalleryImageDefinition `
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

Create an image version using [New-AzGalleryImageVersion](https://docs.microsoft.com/powershell/module/az.compute/new-azgalleryimageversion). You will need to pass in the ID of the source image in the `--managed-image` parameter for creating the image version in your destination gallery. 

Allowed characters for image version are numbers and periods. Numbers must be within the range of a 32-bit integer. Format: *MajorVersion*.*MinorVersion*.*Patch*.

In this example, the destination gallery is named *myDestinationGallery*, in the *myDestinationRG* resource group, in the *West US* location. The version of our image is *1.0.0* and we are going to create 1 replica in the *South Central US* region, and 2 replicas in the *West US* region. 


```azurepowershell-interactive
$region1 = @{Name='South Central US';ReplicaCount=1}
$region2 = @{Name='West US';ReplicaCount=2}
$targetRegions = @($region1,$region2)

$job = $imageVersion = New-AzGalleryImageVersion `
   -GalleryImageDefinitionName $destinationImgDef.Name`
   -GalleryImageVersionName '1.0.0' `
   -GalleryName myDestinationGallery `
   -ResourceGroupName myDestinationRG `
   -Location WestUS `
   -TargetRegion $targetRegions  `
   -Source $sourceImgVer.Id.ToString() `
   -PublishingProfileEndOfLifeDate '2020-12-01' `
   -asJob 
```

It can take a while to replicate the image to all of the target regions, so we have created a job so we can track the progress. To see the progress of the job, type `$job.State`.

```azurepowershell-interactive
$job.State
```

> [!NOTE]
> You need to wait for the image version to completely finish being built and replicated before you can use the same managed image to create another image version.
>
> You can also store your image in Premiun storage by a adding `-StorageAccountType Premium_LRS`, or [Zone Redundant Storage](https://docs.microsoft.com/azure/storage/common/storage-redundancy-zrs) by adding `-StorageAccountType Standard_ZRS` when you create the image version.
>


## Next steps

Create a VM from a [generalized](vm-generalized-image-version-powershell.md) or a [specialized](vm-specialized-image-version-powershell.md) image version.

[Azure Image Builder (preview)](./linux/image-builder-overview.md) can help automate image version creation, you can even use it to update and [create a new image version from an existing image version](./linux/image-builder-gallery-update-image-version.md). 