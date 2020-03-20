---
title: Create an image version from a snapshot 
description: Learn how to use Azure PowerShell to create an image version from a snapshot.
author: cynthn
ms.topic: article
ms.service: virtual-machines
ms.workload: infrastructure
ms.date: 03/18/2020
ms.author: cynthn

---

# Create an image version from a snapshot

If you have an existing snapshot that you would like to migrate into a Shared Image Gallery, you can create an image version from the snapshot.

An **image version** is what you use to create a VM when using a Shared Image Gallery. You can have multiple versions of an image as needed for your environment. Like a managed image, when you use an **image version** to create a VM, the image version is used to create new disks for the VM. Image versions can be used multiple times.


## Before you begin

To complete this article, you must have an existing Shared Image Gallery and an [image definition](./windows/shared-images.md#). Because snapshots are typically taken of a VM that hasn't been generalized, create a an image definition for a specialized image before you begin.

To complete the example in this article, you must have an existing snapshot. If the snapshot contains a data disk, the data disk size cannot be more than 1 TB.

When working through this article, replace the resource names where needed.

## Get the snapshot

You can see a list of snapshots that are available in a resource group using [Get-AzSnapshot](https://docs.microsoft.com/powershell/module/az.compute/get-azsnapshot). Once you know the snapshot name and what resource group it is in, you can use `Get-AzSnapshot` again to get the snapshot object and store it in a variable to use later. This example gets an snapshot named *mySnapshot* from the "myResourceGroup" resource group and assigns it to the variable *$snapshot*. 

```azurepowershell-interactive
$snapshot = Get-AzSnapshot `
   -SnapshotName mySnapshot
   -ResourceGroupName myResourceGroup
```

## Create an image version

Create an image version from the snapshot using [New-AzGalleryImageVersion](https://docs.microsoft.com/powershell/module/az.compute/new-azgalleryimageversion). 

Allowed characters for image version are numbers and periods. Numbers must be within the range of a 32-bit integer. Format: *MajorVersion*.*MinorVersion*.*Patch*.

In this example, the image version is *1.0.0* and it's replicated to both *West Central US* and *South Central US* datacenters. When choosing target regions for replication, remember that you also have to include the *source* region as a target for replication.


```azurepowershell-interactive
$region1 = @{Name='South Central US';ReplicaCount=1}
$region2 = @{Name='West Central US';ReplicaCount=2}
$targetRegions = @($region1,$region2)
$job = $imageVersion = New-AzGalleryImageVersion `
   -GalleryImageDefinitionName $galleryImage.Name `
   -GalleryImageVersionName '1.0.0' `
   -GalleryName $gallery.Name `
   -ResourceGroupName $resourceGroup.ResourceGroupName `
   -Location $resourceGroup.Location `
   -TargetRegion $targetRegions  `
   -Source $snapshot.Id.ToString() `
   -PublishingProfileEndOfLifeDate '2020-01-01' `
   -asJob 
```

It can take a while to replicate the image to all of the target regions, so we have created a job so we can track the progress. To see the progress of the job, type `$job.State`.

```azurepowershell-interactive
$job.State
```

> [!NOTE]
> You need to wait for the image version to completely finish being built and replicated before you can use the same snapshot to create another image version. 
>
> You can also store your image version in [Zone Redundant Storage](https://docs.microsoft.com/azure/storage/common/storage-redundancy-zrs) by adding `-StorageAccountType Standard_ZRS` when you create the image version.
>
