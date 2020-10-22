---
title: Create a managed disk from an image version
description: Create a managed disk from an image version in a shared image gallery.
author: cynthn
ms.service: virtual-machines
ms.subservice: imaging
ms.topic: how-to
ms.workload: infrastructure
ms.date: 10/06/2020
ms.author: cynthn
ms.reviewer: olayemio

---

# Create a managed disk from an image version

If you need to, you can make a managed disk from an image version stored in a Shared Image Gallery.


## CLI

Set the `source` variable to the ID of the image version, then use [az disk create](/cli/azure/disk#az_disk_create) to create the managed disk. 


You can see a list image versions using [az sig image-version list](/cli/azure/sig/image-version#az_sig_image_version_list). In this example, we are looking for all of the image versions that are part of the *myImageDefinition* image definition in the *myGallery* image gallery.

```azurecli-interactive
az sig image-version list \
   --resource-group myResourceGroup\
   --gallery-name myGallery \
   --gallery-image-definition myImageDefinition \
   -o table
```


In this example, we create a managed disk named *myManagedDisk*, in the *EastUS* region, in a resource group named *myResourceGroup*. 

```azurecli-interactive
source="/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Compute/galleries/<galleryName>/images/<galleryImageDefinition>/versions/<imageVersion>"

az disk create --resource-group myResourceGroup --location EastUS --name myManagedDisk --gallery-image-reference $source 
```

If the disk is a data disk, add `--gallery-image-reference-lun` to specify the LUN.

## PowerShell

You can list all of the image versions using [Get-AzResource](/powershell/module/az.resources/get-azresource). 

```azurepowershell-interactive
Get-AzResource `
   -ResourceType Microsoft.Compute/galleries/images/versions | `
   Format-Table -Property Name,ResourceId,ResourceGroupName
```



Once you have all of the information you need, you can use [Get-AzGalleryImageVersion](/powershell/module/az.compute/get-azgalleryimageversion) to get the source image version you want to use and assign it to a variable. In this example, we are getting the `1.0.0` image version, of the `myImageDefinition` definition, in the `myGallery` source gallery, in the `myResourceGroup` resource group.

```azurepowershell-interactive
$sourceImgVer = Get-AzGalleryImageVersion `
   -GalleryImageDefinitionName myImageDefinition `
   -GalleryName myGallery `
   -ResourceGroupName myResourceGroup `
   -Name 1.0.0
```

Set up some variables for the disk information.

```azurepowershell-interactive
$location = "East US"
$resourceGroup = "myResourceGroup"
$diskName = "myDisk"
```

Create a disk configuration and then the disk, using the source image version ID. For the `-GalleryImageReference`, LUN is needed only if the source is a data disk.

```azurepowershell-interactive
$diskConfig = New-AzDiskConfig `
   -Location $location `
   -CreateOption FromImage `
   -GalleryImageReference @{Id = $sourceImgVer.Id; Lun=1}
```

Create the disk.

```azurepowershell-interactive
New-AzDisk -Disk $diskConfig `
   -ResourceGroupName $resourceGroup `
   -DiskName $diskName
```

## Next steps

You can also create an image version from a managed disk using the [Azure CLI](image-version-managed-image-cli.md) or [PowerShell](image-version-managed-image-powershell.md).


