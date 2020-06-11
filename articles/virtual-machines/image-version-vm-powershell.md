---
title: Create an image from a VM (Preview)
description: Learn how to use Azure PowerShell to create an image in a Shared Image Gallery from an existing VM in Azure.
author: cynthn
ms.topic: how-to
ms.service: virtual-machines
ms.subservice: imaging
ms.workload: infrastructure
ms.date: 05/04/2020
ms.author: cynthn
ms.reviewer: akjosh
---

# Preview: Create an image from a VM

If you have an existing VM that you would like to use to make multiple, identical VMs, you can use that VM to create an image in a Shared Image Gallery using Azure PowerShell. You can also create an image from a VM using the [Azure CLI](image-version-vm-cli.md).

You can capture an image from both [specialized and generalized](https://docs.microsoft.com/azure/virtual-machines/windows/shared-image-galleries#generalized-and-specialized-images) VMs using Azure PowerShell. 

Images in an image gallery have two components, which we will create in this example:
- An **Image definition** carries information about the image and requirements for using it. This includes whether the image is Windows or Linux, specialized or generalized, release notes, and minimum and maximum memory requirements. It is a definition of a type of image. 
- An **image version** is what is used to create a VM when using a Shared Image Gallery. You can have multiple versions of an image as needed for your environment. When you create a VM, the image version is used to create new disks for the VM. Image versions can be used multiple times.


## Before you begin

To complete this article, you must have an existing Shared Image Gallery, and an existing VM in Azure to use as the source. 

If the VM has a data disk attached, the data disk size cannot be more than 1 TB.

When working through this article, replace the resource names where needed.


## Get the gallery

You can list all of the galleries and image definitions by name. The results are in the format `gallery\image definition\image version`.

```azurepowershell-interactive
Get-AzResource -ResourceType Microsoft.Compute/galleries | Format-Table
```

Once you find the right gallery and image definitions, create variables for them to use later. This example gets the gallery named *myGallery* in the *myResourceGroup* resource group.

```azurepowershell-interactive
$gallery = Get-AzGallery `
   -Name myGallery `
   -ResourceGroupName myResourceGroup
```

## Get the VM

You can see a list of VMs that are available in a resource group using [Get-AzVM](https://docs.microsoft.com/powershell/module/az.compute/get-azvm). Once you know the VM name and what resource group it is in, you can use `Get-AzVM` again to get the VM object and store it in a variable to use later. This example gets an VM named *sourceVM* from the "myResourceGroup" resource group and assigns it to the variable *$sourceVm*. 

```azurepowershell-interactive
$sourceVm = Get-AzVM `
   -Name sourceVM `
   -ResourceGroupName myResourceGroup
```

It is a best practice to stop\deallocate the VM before creating an image using [Stop-AzVM](https://docs.microsoft.com/powershell/module/az.compute/stop-azvm).

```azurepowershell-interactive
Stop-AzVM `
   -ResourceGroupName $sourceVm.ResourceGroupName `
   -Name $sourceVm.Name `
   -Force
```

## Create an image definition 

Image definitions create a logical grouping for images. They are used to manage information about the image. Image definition names can be made up of uppercase or lowercase letters, digits, dots, dashes and periods. 

When making your image definition, make sure is has all of the correct information. If you generalized the VM (using Sysprep for Windows, or waagent -deprovision for Linux) then you should create an image definition using `-OsState generalized`. If you didn't generalized the VM, create an image definition using `-OsState specialized`.

For more information about the values you can specify for an image definition, see [Image definitions](https://docs.microsoft.com/azure/virtual-machines/windows/shared-image-galleries#image-definitions).

Create the image definition using [New-AzGalleryImageDefinition](https://docs.microsoft.com/powershell/module/az.compute/new-azgalleryimageversion). 

In this example, the image definition is named *myImageDefinition*, and is for a specialized VM running Windows. To create a definition for images using Linux, use `-OsType Linux`. 

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


## Create an image version

Create an image version using [New-AzGalleryImageVersion](https://docs.microsoft.com/powershell/module/az.compute/new-azgalleryimageversion). 

Allowed characters for image version are numbers and periods. Numbers must be within the range of a 32-bit integer. Format: *MajorVersion*.*MinorVersion*.*Patch*.

In this example, the image version is *1.0.0* and it's replicated to both *West Central US* and *South Central US* datacenters. When choosing target regions for replication, remember that you also have to include the *source* region as a target for replication.

To create an image version from the VM, use `$vm.Id.ToString()` for the `-Source`.

```azurepowershell-interactive
   $region1 = @{Name='South Central US';ReplicaCount=1}
   $region2 = @{Name='East US';ReplicaCount=2}
   $targetRegions = @($region1,$region2)

$job = $imageVersion = New-AzGalleryImageVersion `
   -GalleryImageDefinitionName $imageDefinition.Name`
   -GalleryImageVersionName '1.0.0' `
   -GalleryName $gallery.Name `
   -ResourceGroupName $gallery.ResourceGroupName `
   -Location $gallery.Location `
   -TargetRegion $targetRegions  `
   -Source $sourceVm.Id.ToString() `
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

Once you have verified that you new image version is working correctly, you can create a VM. Create a VM from a [specialized image version](vm-specialized-image-version-powershell.md) or a [generalized image version](vm-generalized-image-version-powershell.md).
