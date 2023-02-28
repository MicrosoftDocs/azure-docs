---
title: Upload a VHD to Azure 
description: Upload a VHD to Azure to use as a basis for images for creating new virtual machines.
author: cynthn
ms.service: virtual-machines
ms.subservice: imaging
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 02/28/2023
ms.author: cynthn 
ms.custom: devx-track-azurepowershell
---

# Upload a VHD

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets 

This article walks you through using PowerShell to upload a VHD of a generalized VM to Azure. You can upload a VHD exported from an on-premises virtualization tool or from another cloud. Uploading to a managed disk simplifies the eventual creation of a [image](image-version.md) you can use to create multiple VMs.


## Before you begin

- Before uploading a Linux VHD to Azure, review [Bringing and creating Linux images in Azure](./linux/imaging.md)
- Before uploading a Windows VHD to Azure, you should follow [Prepare a Windows VHD or VHDX to upload to Azure](prepare-for-upload-vhd-image.md).


## Upload the VHD 

You can now upload a VHD straight into a managed disk. For instructions, see [Upload a VHD to Azure using Azure PowerShell](disks-upload-vhd-to-managed-disk-powershell.md).



Once the VHD is uploaded to the managed disk, you need to use [Get-AzDisk](/powershell/module/az.compute/get-azdisk) to get the managed disk.

```azurepowershell-interactive
$disk = Get-AzDisk -ResourceGroupName 'myResourceGroup' -DiskName 'myDiskName'
```

## Create the image
Create a managed image from your generalized OS managed disk. Replace the following values with your own information.

First, set some variables:

```powershell
$location = 'East US'
$imageName = 'myImage'
$rgName = 'myResourceGroup'
```

Create the image using your managed disk.

```azurepowershell-interactive
$imageConfig = New-AzImageConfig `
   -Location $location
$imageConfig = Set-AzImageOsDisk `
   -Image $imageConfig `
   -OsState Generalized `
   -OsType Windows `
   -ManagedDiskId $disk.Id
```

Create the image.

```azurepowershell-interactive
$image = New-AzImage `
   -ImageName $imageName `
   -ResourceGroupName $rgName `
   -Image $imageConfig
```

## Create the VM

Now that you have an image, you can create one or more new VMs from the image. This example creates a VM named *myVM* from *myImage*, in *myResourceGroup*.


```powershell
New-AzVm `
    -ResourceGroupName $rgName `
    -Name "myVM" `
    -Image $image.Id `
    -Location $location `
    -VirtualNetworkName "myVnet" `
    -SubnetName "mySubnet" `
    -SecurityGroupName "myNSG" `
    -PublicIpAddressName "myPIP" 
```


## Next steps

Sign in to your new virtual machine. For more information, see [How to connect and log on to an Azure virtual machine running Windows](connect-logon.md).
