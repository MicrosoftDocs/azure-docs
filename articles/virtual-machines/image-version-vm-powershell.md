---
title: Create an image version from a VM
description: Learn how to use Azure PowerShell to create an image version from an existing VM in Azure.
author: cynthn
ms.topic: article
ms.service: virtual-machines
ms.workload: infrastructure
ms.date: 03/20/2020
ms.author: cynthn

---

# Create an image version from a VM

If you have an existing VM that you would like to use to make multiple, identical VMs, then you can use that VM to create an image version in a Shared Image Gallery. 

An **image version** is what you use to create a VM when using a Shared Image Gallery. You can have multiple versions of an image as needed for your environment. When you use an **image version** to create a VM, the image version is used to create new disks for the VM. Image versions can be used multiple times.


## Before you begin

To complete this article, you must have an existing Shared Image Gallery and an [image definition](./windows/shared-images.md#). 

Make sure your image definition is the right type. If you have generalized the VM (using Sysprep for Windows, or waagent -deprevision for Linux) then you should create a generalized image definition. If you want to use the VM without removing existing user accounts, create a specialized image definition.

To complete the example in this article, you must have an existing VM in Azure. If the has a data disk attached, the data disk size cannot be more than 1 TB.

When working through this article, replace the resource names where needed.



## Get the VM

You can see a list of VMs that are available in a resource group using [Get-AzVM](https://docs.microsoft.com/powershell/module/az.compute/get-azvm). Once you know the VM name and what resource group it is in, you can use `Get-AzVM` again to get the VM object and store it in a variable to use later. This example gets an VM named *sourceVM* from the "myResourceGroup" resource group and assigns it to the variable *$vm*. 

```azurepowershell-interactive
$sourceVM = Get-AzVM `
   -Name sourceVM `
   -ResourceGroupName myResourceGroup
```

## Get the gallery and image definition

You can list all of the galleries and image definitions by name.

```azurepowershell-interactive
$galleries = Get-AzResource -ResourceType Microsoft.Compute/galleries
$galleries.Name

$imageDefinitions = Get-AzResource -ResourceType Microsoft.Compute/galleries/images
$imageDefinitions.Name
```

Once you find the right gallery and image definitions, create variables for them to use later.

```azurepowershell-interactive
$gallery = Get-AzGallery `
   -Name myGallery `
   -ResourceGroupName myResourceGroup
$imageDef = Get-AzGalleryImageDefinition `
   -GalleryName myGallery `
   -ResourceGroupName myGalleryRG `
   -Name myImageDefinition
```


## Create an image version

Create an image version using [New-AzGalleryImageVersion](https://docs.microsoft.com/powershell/module/az.compute/new-azgalleryimageversion). 

Allowed characters for image version are numbers and periods. Numbers must be within the range of a 32-bit integer. Format: *MajorVersion*.*MinorVersion*.*Patch*.

In this example, the image version is *1.0.0* and it's replicated to both *West Central US* and *South Central US* datacenters. When choosing target regions for replication, remember that you also have to include the *source* region as a target for replication.

To create an image version from the VM, use `$vm.Id.ToString()` for the `-Source`.

```azurepowershell-interactive
   $region1 = @{Name='South Central US';ReplicaCount=1}
   $region2 = @{Name='East US';ReplicaCount=2}
   $targetRegions = @($region1,$region2)

$imageVersion = New-AzGalleryImageVersion `
   -GalleryImageDefinitionName $galleryImage.Name`
   -GalleryImageVersionName '1.0.0' `
   -GalleryName $gallery.Name `
   -ResourceGroupName $resourceGroup.ResourceGroupName `
   -Location $resourceGroup.Location `
   -TargetRegion $targetRegions  `
   -Source $vm.Id.ToString() `
   -PublishingProfileEndOfLifeDate '2020-12-01'
```

It can take a while to replicate the image to all of the target regions.

> [!NOTE]
> You can also store your image version in [Zone Redundant Storage](https://docs.microsoft.com/azure/storage/common/storage-redundancy-zrs) by adding `-StorageAccountType Standard_ZRS` when you create the image version.
>

## Next steps

Once you have verified that you new image version is working correctly, you can create a VM. Create a VM from a [specialized image version](vm-specialized-image-version-powershell.md) or a [generalized image version](vm-generalized-image-version-powershell.md).