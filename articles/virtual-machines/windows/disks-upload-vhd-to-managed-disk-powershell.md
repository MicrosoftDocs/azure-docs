---
title: Upload a VHD to Azure or copy a disk across regions - Azure PowerShell
description: Learn how to upload a VHD to an Azure managed disk and copy a managed disk across regions, using Azure PowerShell, via direct upload.    
author: roygara
ms.author: rogarana
ms.date: 01/27/2022
ms.topic: how-to
ms.service: storage
ms.tgt_pltfrm: linux
ms.subservice: disks 
ms.custom: devx-track-azurepowershell
---

# Upload a VHD to Azure or copy a managed disk to another region - Azure PowerShell

**Applies to:** :heavy_check_mark: Windows VMs 

[!INCLUDE [disks-upload-vhd-to-disk-intro](../../../includes/disks-upload-vhd-to-disk-intro.md)]

## Prerequisites

- Download the latest [version of AzCopy v10](../../storage/common/storage-use-azcopy-v10.md#download-and-install-azcopy).
- [Install Azure PowerShell module](/powershell/azure/install-Az-ps).
- If you intend to upload a VHD from on-premises: A VHD or VHDx that [has been prepared for Azure](prepare-for-upload-vhd-image.md), stored locally.
    - With [Add-AzVHD](/powershell/module/az.compute/add-azvhd?view=azps-7.1.0&viewFallbackFrom=azps-5.4.0), you don't need to resize the VHD, convert it to VHDx, or set it to a fixed size. Add-AzVHD performs all of those for you.

## Upload a VHD or VHDx

To upload a VHD as a managed disk, use [Add-AzVHD](/powershell/module/az.compute/add-azvhd?view=azps-7.1.0&viewFallbackFrom=azps-5.4.0). 

The following example uploads a VHD from your local machine to a new Azure managed disk. Replace `<your-filepath-here>`, `<your-resource-group-name>`,`<desired-region>`, and `<desired-managed-disk-name>` with your parameters:

```azurepowershell
# Required parameters
$path = <your-filepath-here>.vhd
$resourceGroup = <your-resource-group-name>
$location = <desired-region>
$name = <desired-managed-disk-name>

# Optional parameters
# $Zone = <desired-zone>
# $sku=<desired-SKU>

# To use $Zone or #sku, add -Zone or -DiskSKU parameters to the command
Add-AzVhd -LocalFilePath $path -ResourceGroupName $resourceGroup -Location $location -DiskName $name
```

## Copy a managed disk

You can also either copy a managed disk within the same region or copy it to another region.

The follow script will do this for you:

> [!IMPORTANT]
> You need to add an offset of 512 when you're providing the disk size in bytes of a managed disk from Azure. This is because Azure omits the footer when returning the disk size. The copy will fail if you do not do this. The following script already does this for you.

Replace the `<sourceResourceGroupHere>`, `<sourceDiskNameHere>`, `<targetDiskNameHere>`, `<targetResourceGroupHere>`, `<yourOSTypeHere>` and `<yourTargetLocationHere>` (an example of a location value would be uswest2) with your values, then run the following script in order to copy a managed disk.

> [!TIP]
> If you are creating an OS disk, add `-HyperVGeneration '<yourGeneration>'` to `New-AzDiskConfig`.

```powershell

$sourceRG = <sourceResourceGroupHere>
$sourceDiskName = <sourceDiskNameHere>
$targetDiskName = <targetDiskNameHere>
$targetRG = <targetResourceGroupHere>
$targetLocate = <yourTargetLocationHere>
#Expected value for OS is either "Windows" or "Linux"
$targetOS = <yourOSTypeHere>

$sourceDisk = Get-AzDisk -ResourceGroupName $sourceRG -DiskName $sourceDiskName

# Adding the sizeInBytes with the 512 offset, and the -Upload flag
$targetDiskconfig = New-AzDiskConfig -SkuName 'Standard_LRS' -osType $targetOS -UploadSizeInBytes $($sourceDisk.DiskSizeBytes+512) -Location $targetLocate -CreateOption 'Upload'

$targetDisk = New-AzDisk -ResourceGroupName $targetRG -DiskName $targetDiskName -Disk $targetDiskconfig

$sourceDiskSas = Grant-AzDiskAccess -ResourceGroupName $sourceRG -DiskName $sourceDiskName -DurationInSecond 86400 -Access 'Read'

$targetDiskSas = Grant-AzDiskAccess -ResourceGroupName $targetRG -DiskName $targetDiskName -DurationInSecond 86400 -Access 'Write'

azcopy copy $sourceDiskSas.AccessSAS $targetDiskSas.AccessSAS --blob-type PageBlob

Revoke-AzDiskAccess -ResourceGroupName $sourceRG -DiskName $sourceDiskName

Revoke-AzDiskAccess -ResourceGroupName $targetRG -DiskName $targetDiskName 
```

## Next steps

Now that you've successfully uploaded a VHD to a managed disk, you can attach your disk to a VM and begin using it.

To learn how to attach a data disk to a VM, see our article on the subject: [Attach a data disk to a Windows VM with PowerShell](attach-disk-ps.md). To use the disk as the OS disk, see [Create a Windows VM from a specialized disk](create-vm-specialized.md#create-the-new-vm).
