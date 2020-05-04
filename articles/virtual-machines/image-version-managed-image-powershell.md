---
title: Migrate a managed image to a Shared Image Gallery
description: Learn how to use Azure PowerShell to migrate a managed image to a image version in a Shared Image Gallery.
author: cynthn
ms.topic: how-to
ms.service: virtual-machines
ms.subservice: imaging
ms.workload: infrastructure
ms.date: 05/04/2020
ms.author: cynthn
ms.reviewer: akjosh
---

# Migrate from a managed image to a Shared Image Gallery image

If you have an existing managed image that you would like to migrate into a Shared Image Gallery, you can create a Shared Image Gallery image directly from the managed image. Once you have tested your new image, you can delete the source managed image. You can also migrate from a managed image to a Shared Image Gallery using the [Azure CLI](image-version-managed-image-cli.md).

Images in an image gallery have two components, which we will create in this example:
- An **Image definition** carries information about the image and requirements for using it. This includes whether the image is Windows or Linux, specialized or generalized, release notes, and minimum and maximum memory requirements. It is a definition of a type of image. 
- An **image version** is what is used to create a VM when using a Shared Image Gallery. You can have multiple versions of an image as needed for your environment. When you create a VM, the image version is used to create new disks for the VM. Image versions can be used multiple times.


## Before you begin

To complete this article, you must have an existing managed image. If the managed image contains a data disk, the data disk size cannot be more than 1 TB.

When working through this article, replace the resource group and VM names where needed.

## Get the gallery

You can list all of the galleries and image definitions by name. The results are in the format `gallery\image definition\image version`.

```azurepowershell-interactive
Get-AzResource -ResourceType Microsoft.Compute/galleries | Format-Table
```

Once you find the right gallery, create a variable to use later. This example gets the gallery named *myGallery* in the *myResourceGroup* resource group.

```azurepowershell-interactive
$gallery = Get-AzGallery `
   -Name myGallery `
   -ResourceGroupName myResourceGroup
```


## Create an image definition 

Image definitions create a logical grouping for images. They are used to manage information about the image. Image definition names can be made up of uppercase or lowercase letters, digits, dots, dashes and periods. 

When making your image definition, make sure is has all of the correct information. Because managed images are always generalized, you should set `-OsState generalized`. 

For more information about the values you can specify for an image definition, see [Image definitions](https://docs.microsoft.com/azure/virtual-machines/windows/shared-image-galleries#image-definitions).

Create the image definition using [New-AzGalleryImageDefinition](https://docs.microsoft.com/powershell/module/az.compute/new-azgalleryimageversion). In this example, the image definition is named *myImageDefinition*, and is for a generalized Windows OS. To create a definition for images using a Linux OS, use `-OsType Linux`. 

```azurepowershell-interactive
$imageDefinition = New-AzGalleryImageDefinition `
   -GalleryName $gallery.Name `
   -ResourceGroupName $gallery.ResourceGroupName `
   -Location $gallery.Location `
   -Name 'myImageDefinition' `
   -OsState generalized `
   -OsType Windows `
   -Publisher 'myPublisher' `
   -Offer 'myOffer' `
   -Sku 'mySKU'
```

## Get the managed image

You can see a list of images that are available in a resource group using [Get-AzImage](https://docs.microsoft.com/powershell/module/az.compute/get-azimage). Once you know the image name and what resource group it is in, you can use `Get-AzImage` again to get the image object and store it in a variable to use later. This example gets an image named *myImage* from the "myResourceGroup" resource group and assigns it to the variable *$managedImage*. 

```azurepowershell-interactive
$managedImage = Get-AzImage `
   -ImageName myImage `
   -ResourceGroupName myResourceGroup
```


## Create an image version

Create an image version from the managed image using [New-AzGalleryImageVersion](https://docs.microsoft.com/powershell/module/az.compute/new-azgalleryimageversion). 

Allowed characters for image version are numbers and periods. Numbers must be within the range of a 32-bit integer. Format: *MajorVersion*.*MinorVersion*.*Patch*.

In this example, the image version is *1.0.0* and it's replicated to both *West Central US* and *South Central US* datacenters. When choosing target regions for replication, remember that you also have to include the *source* region as a target for replication. 


```azurepowershell-interactive
$region1 = @{Name='South Central US';ReplicaCount=1}
$region2 = @{Name='West Central US';ReplicaCount=2}
$targetRegions = @($region1,$region2)
$job = $imageVersion = New-AzGalleryImageVersion `
   -GalleryImageDefinitionName $imageDefinition.Name `
   -GalleryImageVersionName '1.0.0' `
   -GalleryName $gallery.Name `
   -ResourceGroupName $resourceGroup.ResourceGroupName `
   -Location $resourceGroup.Location `
   -TargetRegion $targetRegions  `
   -Source $managedImage.Id.ToString() `
   -PublishingProfileEndOfLifeDate '2020-12-31' `
   -asJob 
```

It can take a while to replicate the image to all of the target regions, so we have created a job so we can track the progress. To see the progress, type `$job.State`.

```azurepowershell-interactive
$job.State
```


> [!NOTE]
> You need to wait for the image version to completely finish being built and replicated before you can use the same managed image to create another image version. 
>
> You can also store your image in Premiun storage by a adding `-StorageAccountType Premium_LRS`, or [Zone Redundant Storage](https://docs.microsoft.com/azure/storage/common/storage-redundancy-zrs) by adding `-StorageAccountType Standard_ZRS` when you create the image version.
>

## Delete the managed image

Once you have verified that you new image version is working correctly, you can delete the managed image.

```azurepowershell-interactive
Remove-AzImage `
   -ImageName $managedImage.Name `
   -ResourceGroupName $managedImage.ResourceGroupName
```

## Next steps

Once you have verified that replication is complete, you can create a VM from the [generalized image](vm-generalized-image-version-powershell.md).

