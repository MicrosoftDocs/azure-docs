---
title: Upload a VHD to Azure or copy a disk across regions - Azure PowerShell
description: Learn how to upload a VHD to an Azure managed disk and copy a managed disk across regions, using Azure PowerShell, via direct upload.    
author: roygara
ms.author: rogarana
ms.date: 03/27/2020
ms.topic: how-to
ms.service: virtual-machines
ms.tgt_pltfrm: linux
ms.subservice: disks
---

# Upload a VHD to Azure or copy a managed disk to another region - Azure PowerShell

[!INCLUDE [disks-upload-vhd-to-disk-intro](../../../includes/disks-upload-vhd-to-disk-intro.md)]

## Prerequisites

- Download the latest [version of AzCopy v10](../../storage/common/storage-use-azcopy-v10.md#download-and-install-azcopy).
- [Install Azure PowerShell module](/powershell/azure/install-Az-ps).
- If you intend to upload a VHD from on-premises: A fixed size VHD that [has been prepared for Azure](prepare-for-upload-vhd-image.md), stored locally.
- Or, a managed disk in Azure, if you intend to perform a copy action.

## Getting started

If you'd prefer to upload disks through a GUI, you can do so using Azure Storage Explorer. For details refer to: [Use Azure Storage Explorer to manage Azure managed disks](disks-use-storage-explorer-managed-disks.md)

To upload your VHD to Azure, you'll need to create an empty managed disk that is configured for this upload process. Before you create one, there's some additional information you should know about these disks.

This kind of managed disk has two unique states:

- ReadToUpload, which means the disk is ready to receive an upload but, no [secure access signature](https://docs.microsoft.com/azure/storage/common/storage-dotnet-shared-access-signature-part-1) (SAS) has been generated.
- ActiveUpload, which means that the disk is ready to receive an upload and the SAS has been generated.

> [!NOTE]
> While in either of these states, the managed disk will be billed at [standard HDD pricing](https://azure.microsoft.com/pricing/details/managed-disks/), regardless of the actual type of disk. For example, a P10 will be billed as an S10. This will be true until `revoke-access` is called on the managed disk, which is required in order to attach the disk to a VM.

## Create an empty managed disk

Before you can create an empty standard HDD for uploading, you'll need the file size of the VHD you want to upload, in bytes. The example code will get that for you but, to do it yourself you can use: `$vhdSizeBytes = (Get-Item "<fullFilePathHere>").length`. This value is used when specifying the **-UploadSizeInBytes** parameter.

Now, on your local shell, create an empty standard HDD for uploading by specifying the **Upload** setting in the **-CreateOption** parameter as well as the **-UploadSizeInBytes** parameter in the [New-AzDiskConfig](https://docs.microsoft.com/powershell/module/az.compute/new-azdiskconfig?view=azps-1.8.0) cmdlet. Then call [New-AzDisk](https://docs.microsoft.com/powershell/module/az.compute/new-azdisk?view=azps-1.8.0) to create the disk.

Replace `<yourdiskname>`, `<yourresourcegroupname>`, and `<yourregion>` then run the following commands:

```powershell
$vhdSizeBytes = (Get-Item "<fullFilePathHere>").length

$diskconfig = New-AzDiskConfig -SkuName 'Standard_LRS' -OsType 'Windows' -UploadSizeInBytes $vhdSizeBytes -Location '<yourregion>' -CreateOption 'Upload'

New-AzDisk -ResourceGroupName '<yourresourcegroupname' -DiskName '<yourdiskname>' -Disk $diskconfig
```

If you would like to upload either a premium SSD or a standard SSD, replace **Standard_LRS** with either **Premium_LRS** or **StandardSSD_LRS**. Ultra disks are not yet supported.

Now that you've created an empty managed disk that is configured for the upload process, you can upload a VHD to it. To upload a VHD to the disk, you'll need a writeable SAS, so that you can reference it as the destination for your upload.

To generate a writable SAS of your empty managed disk, replace `<yourdiskname>`and `<yourresourcegroupname>`, then use the following commands:

```powershell
$diskSas = Grant-AzDiskAccess -ResourceGroupName '<yourresourcegroupname>' -DiskName '<yourdiskname>' -DurationInSecond 86400 -Access 'Write'

$disk = Get-AzDisk -ResourceGroupName '<yourresourcegroupname>' -DiskName '<yourdiskname>'
```

## Upload a VHD

Now that you have a SAS for your empty managed disk, you can use it to set your managed disk as the destination for your upload command.

Use AzCopy v10 to upload your local VHD file to a managed disk by specifying the SAS URI you generated.

This upload has the same throughput as the equivalent [standard HDD](disks-types.md#standard-hdd). For example, if you have a size that equates to S4, you will have a throughput of up to 60 MiB/s. But, if you have a size that equates to S70, you will have a throughput of up to 500 MiB/s.

```
AzCopy.exe copy "c:\somewhere\mydisk.vhd" $diskSas.AccessSAS --blob-type PageBlob
```

After the upload is complete, and you no longer need to write any more data to the disk, revoke the SAS. Revoking the SAS will change the state of the managed disk and allow you to attach the disk to a VM.

Replace `<yourdiskname>`and `<yourresourcegroupname>`, then run the following command:

```powershell
Revoke-AzDiskAccess -ResourceGroupName '<yourresourcegroupname>' -DiskName '<yourdiskname>'
```

## Copy a managed disk

Direct upload also simplifies the process of copying a managed disk. You can either copy within the same region or copy your managed disk to another region.

The follow script will do this for you, the process is similar to the steps described earlier, with some differences, since you're working with an existing disk.

> [!IMPORTANT]
> You need to add an offset of 512 when you're providing the disk size in bytes of a managed disk from Azure. This is because Azure omits the footer when returning the disk size. The copy will fail if you do not do this. The following script already does this for you.

Replace the `<sourceResourceGroupHere>`, `<sourceDiskNameHere>`, `<targetDiskNameHere>`, `<targetResourceGroupHere>`, `<yourOSTypeHere>` and `<yourTargetLocationHere>` (an example of a location value would be uswest2) with your values, then run the following script in order to copy a managed disk.

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
