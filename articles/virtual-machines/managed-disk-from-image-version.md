---
title: Export an image version to a managed disk
description: Export an image version from an Azure Compute Gallery to a managed disk.
author: cynthn
ms.service: virtual-machines
ms.subservice: gallery
ms.topic: how-to
ms.workload: infrastructure
ms.date: 12/12/2022
ms.author: mattmcinnes
ms.reviewer: olayemio 
ms.custom: devx-track-azurepowershell, devx-track-azurecli 
ms.devlang: azurecli

---

# Export an image version to a managed disk

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

You can export an image version's OS or data disk as a managed disk from an image version, which is stored in an Azure Compute Gallery (formerly known as Shared Image Gallery).


## CLI

List the image versions in a gallery using [az sig image-version list](/cli/azure/sig/image-version#az-sig-image-version-list). In this example, we're looking for all of the image versions that are part of the *myImageDefinition* image definition in the *myGallery* gallery.

```azurecli-interactive
az sig image-version list \
   --resource-group myResourceGroup\
   --gallery-name myGallery \
   --gallery-image-definition myImageDefinition \
   -o table
```

Set the `source` variable to the ID of the image version, then use [az disk create](/cli/azure/disk#az-disk-create) to create the managed disk. 

In this example, we export the OS disk of the image version to create a managed disk named *myManagedOSDisk*, in the *EastUS* region, in a resource group named *myResourceGroup*. 

```azurecli-interactive
source="/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Compute/galleries/<galleryName>/images/<galleryImageDefinition>/versions/<imageVersion>"

az disk create --resource-group myResourceGroup --location EastUS --name myManagedOSDisk --gallery-image-reference $source 
```



If you want to export a data disk from the image version, add `--gallery-image-reference-lun` to specify the LUN location of the data disk to be exported. 

In this example, we export the data disk located at LUN 0 of the image version to create a managed disk named *myManagedDataDisk*, in the *EastUS* region, in a resource group named *myResourceGroup*. 

```azurecli-interactive
source="/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Compute/galleries/<galleryName>/images/<galleryImageDefinition>/versions/<imageVersion>"

az disk create --resource-group myResourceGroup --location EastUS --name myManagedDataDisk --gallery-image-reference $source --gallery-image-reference-lun 0
``` 

## PowerShell

List the image versions in a gallery using [Get-AzResource](/powershell/module/az.resources/get-azresource). 

```azurepowershell-interactive
Get-AzResource `
   -ResourceType Microsoft.Compute/galleries/images/versions | `
   Format-Table -Property Name,ResourceId,ResourceGroupName
```

Once you have all of the information you need, you can use [Get-AzGalleryImageVersion](/powershell/module/az.compute/get-azgalleryimageversion) to get the source image version you want to use and assign it to a variable. In this example, we're getting the `1.0.0` image version, of the `myImageDefinition` definition, in the `myGallery` source gallery, in the `myResourceGroup` resource group.

```azurepowershell-interactive
$sourceImgVer = Get-AzGalleryImageVersion `
   -GalleryImageDefinitionName myImageDefinition `
   -GalleryName myGallery `
   -ResourceGroupName myResourceGroup `
   -Name 1.0.0
```

After setting the `source` variable to the ID of the image version, use [New-AzDiskConfig](/powershell/module/az.compute/new-azdiskconfig) to create a disk configuration, then [New-AzDisk](/powershell/module/az.compute/new-azdisk) to create the disk. 

In this example, we export the OS disk of the image version to create a managed disk named *myManagedOSDisk*, in the *EastUS* region, in a resource group named *myResourceGroup*. 

Create a disk configuration.
```azurepowershell-interactive
$diskConfig = New-AzDiskConfig `
   -Location EastUS `
   -CreateOption FromImage `
   -GalleryImageReference @{Id = $sourceImgVer.Id}
```

Create the disk.

```azurepowershell-interactive
New-AzDisk -Disk $diskConfig `
   -ResourceGroupName myResourceGroup `
   -DiskName myManagedOSDisk
```

If you want to export a data disk on the image version, add a LUN ID to the disk configuration to specify the LUN location of the data disk to export. 

In this example, we export the data disk located at LUN 0 of the image version to create a managed disk named *myManagedDataDisk*, in the *EastUS* region, in a resource group named *myResourceGroup*. 

Create a disk configuration.
```azurepowershell-interactive
$diskConfig = New-AzDiskConfig `
   -Location EastUS `
   -CreateOption FromImage `
   -GalleryImageReference @{Id = $sourceImgVer.Id; Lun=0}
```

Create the disk.

```azurepowershell-interactive
New-AzDisk -Disk $diskConfig `
   -ResourceGroupName myResourceGroup `
   -DiskName myManagedDataDisk
```

## Next steps

You can also create an [image version](image-version.md) from a managed disk.


