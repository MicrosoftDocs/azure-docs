---
title: 'Quickstart: Upload, download, and list blobs - Azure PowerShell'
titleSuffix: Azure Storage
description: In this quickstart, you use Azure PowerShell in object (Blob) storage. Then you use PowerShell to upload a blob to Azure Storage, download a blob, and list the blobs in a container.
services: storage
author: stevenmatthew
ms.service: azure-blob-storage
ms.topic: quickstart
ms.date: 06/26/2023
ms.author: shaas
ms.custom: devx-track-azurepowershell, mode-api
---

# Quickstart: Upload, download, and list blobs with PowerShell

Use the Azure PowerShell module to create and manage Azure resources. You can create or manage Azure resources from the PowerShell command line or in scripts. This guide describes using PowerShell to transfer files between local disk and Azure Blob storage.

## Prerequisites

To access Azure Storage, you'll need an Azure subscription. If you don't already have a subscription, then create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

You will also need the Storage Blob Data Contributor role to read, write, and delete Azure Storage containers and blobs.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

This quickstart requires the Azure PowerShell module Az version 0.7 or later. Run `Get-InstalledModule -Name Az -AllVersions | select Name,Version` to find the version. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell).

[!INCLUDE [storage-quickstart-tutorial-intro-include-powershell](../../../includes/storage-quickstart-tutorial-intro-include-powershell.md)]

## Create a container

Blobs are always uploaded into a container. You can organize groups of blobs like the way you organize your files on your computer in folders.

Set the container name, then create the container by using [New-AzStorageContainer](/powershell/module/az.storage/new-azstoragecontainer). The container name in this example is *quickstartblobs*.

```azurepowershell-interactive
$ContainerName = 'quickstartblobs'
New-AzStorageContainer -Name $ContainerName -Context $Context
```

## Upload blobs to the container

Blob storage supports block blobs, append blobs, and page blobs. VHD files that back IaaS VMs are page blobs. Use append blobs for logging, such as when you want to write to a file and then keep adding more information. Most files stored in Blob storage are block blobs.

To upload a file to a block blob, get a container reference, then get a reference to the block blob in that container. Once you have the blob reference, you can upload data to it by using [Set-AzStorageBlobContent](/powershell/module/az.storage/set-azstorageblobcontent). This operation creates the blob if it doesn't exist, or overwrites the blob if it exists.

The following examples upload *Image001.jpg* and *Image002.png* from the *D:\Images* folder on the local disk to the container you created.

```azurepowershell-interactive
# upload a file to the default account (inferred) access tier
$Blob1HT = @{
  File             = 'D:\Images\Image001.jpg'
  Container        = $ContainerName
  Blob             = "Image001.jpg"
  Context          = $Context
  StandardBlobTier = 'Hot'
}
Set-AzStorageBlobContent @Blob1HT
  
 # upload another file to the Cool access tier
 $Blob2HT = @{
  File             = 'D:\Images\Image002.jpg'
  Container        = $ContainerName
  Blob             = 'Image002.png'
  Context          = $Context
  StandardBlobTier = 'Cool'
 }
 Set-AzStorageBlobContent @Blob2HT
  
# upload a file to a folder to the Archive access tier
$Blob3HT = @{
  File             = 'D:\Images\FolderName\Image003.jpg'
  Container        = $ContainerName
  Blob             = 'FolderName/Image003.jpg'
  Context          = $Context
  StandardBlobTier = 'Archive'
}
Set-AzStorageBlobContent @Blob3HT


```

Upload as many files as you like before continuing.

## List the blobs in a container

Get a list of blobs in the container by using [Get-AzStorageBlob](/powershell/module/az.storage/get-azstorageblob). This example shows just the names of the blobs uploaded.

```azurepowershell-intereactive
Get-AzStorageBlob -Container $ContainerName -Context $Context |
  Select-Object -Property Name
```

## Download blobs

Download the blobs to your local disk. For each blob you want to download, set the name and call [Get-AzStorageBlobContent](/powershell/module/az.storage/get-azstorageblobcontent) to download the blob.

This example downloads the blobs to *D:\Images\Downloads* on the local disk.

```powershell
# Download first blob
$DLBlob1HT = @{
  Blob        = 'Image001.jpg'
  Container   = $ContainerName
  Destination = 'D:\Images\Downloads\'
  Context     = $Context
}
Get-AzStorageBlobContent @DLBlob1HT

# Download another blob
$DLBlob2HT = @{
  Blob        = 'Image002.png'
  Container   = $ContainerName
  Destination = 'D:\Images\Downloads\'
  Context     = $Context  
}
Get-AzStorageBlobContent @DLBlob2HT
```

## Data transfer with AzCopy

The AzCopy command-line utility offers high-performance, scriptable data transfer for Azure Storage. You can use AzCopy to transfer data to and from Blob storage and Azure Files. For more information about AzCopy v10, the latest version of AzCopy, see [Get started with AzCopy](../common/storage-use-azcopy-v10.md). To learn about using AzCopy v10 with Blob storage, see [Transfer data with AzCopy and Blob storage](../common/storage-use-azcopy-v10.md#transfer-data).

The following example uses AzCopy to upload a local file to a blob. Remember to replace the sample values with your own values:

```powershell
azcopy login
azcopy copy 'D:\Images\Image001.jpg' "https://$StorageAccountName.blob.core.windows.net/$ContainerName/NewGaphic.jpg"
```

## Clean up resources

Remove all of the assets you've created. The easiest way to remove the assets is to delete the resource group. Removing the resource group also deletes all resources included within the group. In the following example, removing the resource group removes the storage account and the resource group itself.

```azurepowershell-interactive
Remove-AzResourceGroup -Name $ResourceGroup 
```

## Next steps

In this quickstart, you transferred files between a local file system and Azure Blob storage. To learn more about working with Blob storage by using PowerShell, select an option below.

> [!div class="nextstepaction"]
> [Manage block blobs with PowerShell](blob-powershell.md)

> [!div class="nextstepaction"]
> [Azure PowerShell samples for Azure Blob storage](storage-samples-blobs-powershell.md?toc=/azure/storage/blobs/toc.json)

### Microsoft Azure PowerShell Storage cmdlets reference

- [Storage PowerShell cmdlets](/powershell/module/az.storage)

### Microsoft Azure Storage Explorer

- [Microsoft Azure Storage Explorer](../../vs-azure-tools-storage-manage-with-storage-explorer.md?toc=/azure/storage/blobs/toc.json) is a free, standalone app from Microsoft that enables you to work visually with Azure Storage data on Windows, macOS, and Linux.
