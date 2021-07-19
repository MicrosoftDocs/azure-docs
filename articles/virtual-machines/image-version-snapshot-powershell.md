---
title: PowerShell - Create an image from a snapshot or Managed Disk in a Shared Image Gallery
description: Learn how to Create an image from a snapshot or Managed Disk in a Shared Image Gallery using PowerShell.
author: cynthn
ms.topic: how-to
ms.service: virtual-machines
ms.subservice: shared-image-gallery
ms.workload: infrastructure
ms.date: 06/30/2020
ms.author: cynthn
ms.reviewer: akjosh 
ms.custom: devx-track-azurepowershell
---

# Create an image from a Managed Disk or snapshot in a Shared Image Gallery using PowerShell

If you have an existing snapshot or Managed Disk that you would like to migrate into a Shared Image Gallery, you can create a Shared Image Gallery image directly from the Managed Disk or snapshot. Once you have tested your new image, you can delete the source Managed Disk or snapshot. You can also create an image from a Managed Disk or snapshot in a Shared Image Gallery using the [Azure CLI](image-version-snapshot-cli.md).

Images in an image gallery have two components, which we will create in this example:
- An **Image definition** carries information about the image and requirements for using it. This includes whether the image is Windows or Linux, specialized or generalized, release notes, and minimum and maximum memory requirements. It is a definition of a type of image. 
- An **image version** is what is used to create a VM when using a Shared Image Gallery. You can have multiple versions of an image as needed for your environment. When you create a VM, the image version is used to create new disks for the VM. Image versions can be used multiple times.


## Before you begin

To complete this article, you must have an snapshot or Managed Disk. 

If you want to include a data disk, the data disk size cannot be more than 1 TB.

When working through this article, replace the resource names where needed.


## Get the snapshot or Managed Disk

You can see a list of snapshots that are available in a resource group using [Get-AzSnapshot](/powershell/module/az.compute/get-azsnapshot). 

```azurepowershell-interactive
get-azsnapshot | Format-Table -Property Name,ResourceGroupName
```

Once you know the snapshot name and what resource group it is in, you can use `Get-AzSnapshot` again to get the snapshot object and store it in a variable to use later. This example gets an snapshot named *mySnapshot* from the "myResourceGroup" resource group and assigns it to the variable *$source*. 

```azurepowershell-interactive
$source = Get-AzSnapshot `
   -SnapshotName mySnapshot `
   -ResourceGroupName myResourceGroup
```

You can also use a Managed Disk instead of a snapshot. To get a Managed Disk, use [Get-AzDisk](/powershell/module/az.compute/get-azdisk). 

```azurepowershell-interactive
Get-AzDisk | Format-Table -Property Name,ResourceGroupName
```

Then get the Managed Disk and assign it to the `$source` variable.

```azurepowershell-interactive
$source = Get-AzDisk `
   -Name myDisk
   -ResourceGroupName myResourceGroup
```

You can use the same cmdlets to get any data disks that you want to include in your image. Assign them to variables, then use those variables later when you create the image version.


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

When making your image definition, make sure is has all of the correct information. In this example, we are assuming that the snapshot or Managed Disk are from a VM that is in use, and hasn't been generalized. If the Managed Disk or snapshot was taken of a generalized OS (after running Sysprep for Windows or [waagent](https://github.com/Azure/WALinuxAgent) `-deprovision` or `-deprovision+user` for Linux) then change the `-OsState` to `generalized`. 

For more information about the values you can specify for an image definition, see [Image definitions](./shared-image-galleries.md#image-definitions).

Create the image definition using [New-AzGalleryImageDefinition](/powershell/module/az.compute/new-azgalleryimageversion). In this example, the image definition is named *myImageDefinition*, and is for a specialized Windows OS. To create a definition for images using a Linux OS, use `-OsType Linux`. 

```azurepowershell-interactive
$imageDefinition = New-AzGalleryImageDefinition `
   -GalleryName $gallery.Name `
   -ResourceGroupName $gallery.ResourceGroupName `
   -Location $gallery.Location `
   -Name 'myImageDefinition' `
   -OsState specialized `
   -OsType Windows `
   -Publisher 'myPublisher' `
   -Offer 'myOffer' `
   -Sku 'mySKU'
```

> [!NOTE]
> For image definitions that will contain images descended from third-party images, the plan information must match exactly the plan information from the third-party image. Include the plan information in the image definition by adding `-PurchasePlanName`, `-PurchasePlanProduct`, and `-PurchasePlanPublisher` when you create the image definition.
>

### Purchase plan information

In some cases, you need to pass purchase plan information in when creating a VM from an image that was based on an Azure Marketplace image. In these cases, we recommend you include the purchase plan information in the image definition. In this case, see [Supply Azure Marketplace purchase plan information when creating images](marketplace-images.md).


## Create an image version

Create an image version from the snapshot using [New-AzGalleryImageVersion](/powershell/module/az.compute/new-azgalleryimageversion). 

Allowed characters for image version are numbers and periods. Numbers must be within the range of a 32-bit integer. Format: *MajorVersion*.*MinorVersion*.*Patch*.

If you want your image to contain a data disk, in addition to the OS disk, then add the `-DataDiskImage` parameter and set it to the ID of data disk snapshot or Managed Disk.

In this example, the image version is *1.0.0* and it's replicated to both *West Central US* and *South Central US* datacenters. When choosing target regions for replication, remember that you also have to include the *source* region as a target for replication.


```azurepowershell-interactive
$region1 = @{Name='South Central US';ReplicaCount=1}
$region2 = @{Name='West Central US';ReplicaCount=2}
$targetRegions = @($region1,$region2)
$job = $imageVersion = New-AzGalleryImageVersion `
   -GalleryImageDefinitionName $imageDefinition.Name `
   -GalleryImageVersionName '1.0.0' `
   -GalleryName $gallery.Name `
   -ResourceGroupName $gallery.ResourceGroupName `
   -Location $gallery.Location `
   -TargetRegion $targetRegions  `
   -OSDiskImage @{Source = @{Id=$source.Id}; HostCaching = "ReadOnly" } `
   -PublishingProfileEndOfLifeDate '2025-01-01' `
   -asJob 
```

It can take a while to replicate the image to all of the target regions, so we have created a job so we can track the progress. To see the progress of the job, type `$job.State`.

```azurepowershell-interactive
$job.State
```

> [!NOTE]
> You need to wait for the image version to completely finish being built and replicated before you can use the same snapshot to create another image version. 
>
> You can also store your image version in [Zone Redundant Storage](../storage/common/storage-redundancy.md) by adding `-StorageAccountType Standard_ZRS` when you create the image version.
>

## Delete the source

Once you have verified that you new image version is working correctly, you can delete the source for the image with either [Remove-AzSnapshot](/powershell/module/Az.Compute/Remove-AzSnapshot) or [Remove-AzDisk](/powershell/module/az.compute/remove-azdisk).


## Next steps

Once you have verified that replication is complete, you can create a VM from the [specialized image](vm-specialized-image-version-powershell.md).

For information about how to supply purchase plan information, see [Supply Azure Marketplace purchase plan information when creating images](marketplace-images.md).
