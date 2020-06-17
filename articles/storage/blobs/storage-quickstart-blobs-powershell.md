---
title: Quickstart - Create a blob with PowerShell
titleSuffix: Azure Storage
description: In this quickstart, you use Azure PowerShell in object (Blob) storage. Then you use PowerShell to upload a blob to Azure Storage, download a blob, and list the blobs in a container.
services: storage
author: tamram

ms.service: storage
ms.subservice: blobs
ms.topic: quickstart
ms.date: 03/31/2020
ms.author: tamram
---

# Quickstart: Upload, download, and list blobs with PowerShell

Use the Azure PowerShell module to create and manage Azure resources. Creating or managing Azure resources can be done from the PowerShell command line or in scripts. This guide describes using PowerShell to transfer files between local disk and Azure Blob storage.

[!INCLUDE [storage-multi-protocol-access-preview](../../../includes/storage-multi-protocol-access-preview.md)]

## Prerequisites

To access Azure Storage, you'll need an Azure subscription. If you don't already have a subscription, then create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

This quickstart requires the Azure PowerShell module Az version 0.7 or later. Run `Get-InstalledModule -Name Az -AllVersions | select Name,Version` to find the version. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps).

[!INCLUDE [storage-quickstart-tutorial-intro-include-powershell](../../../includes/storage-quickstart-tutorial-intro-include-powershell.md)]

## Create a container

Blobs are always uploaded into a container. You can organize groups of blobs like the way you organize your files on your computer in folders.

Set the container name, then create the container by using [New-AzStorageContainer](/powershell/module/az.storage/new-azstoragecontainer). Set the permissions to `blob` to allow public access of the files. The container name in this example is *quickstartblobs*.

```powershell
$containerName = "quickstartblobs"
New-AzStorageContainer -Name $containerName -Context $ctx -Permission blob
```

## Upload blobs to the container

Blob storage supports block blobs, append blobs, and page blobs. VHD files that back IaaS VMs are page blobs. Use append blobs for logging, such as when you want to write to a file and then keep adding more information. Most files stored in Blob storage are block blobs. 

To upload a file to a block blob, get a container reference, then get a reference to the block blob in that container. Once you have the blob reference, you can upload data to it by using [Set-AzStorageBlobContent](/powershell/module/az.storage/set-azstorageblobcontent). This operation creates the blob if it doesn't exist, or overwrites the blob if it exists.

The following examples upload *Image001.jpg* and *Image002.png* from the *D:\\_TestImages* folder on the local disk to the container you created.

```powershell
# upload a file
Set-AzStorageBlobContent -File "D:\_TestImages\Image001.jpg" `
  -Container $containerName `
  -Blob "Image001.jpg" `
  -Context $ctx 

# upload another file
Set-AzStorageBlobContent -File "D:\_TestImages\Image002.png" `
  -Container $containerName `
  -Blob "Image002.png" `
  -Context $ctx
```

Upload as many files as you like before continuing.

## List the blobs in a container

Get a list of blobs in the container by using [Get-AzStorageBlob](/powershell/module/az.storage/get-azstorageblob). This example shows just the names of the blobs uploaded.

```powershell
Get-AzStorageBlob -Container $ContainerName -Context $ctx | select Name
```

## Download blobs

Download the blobs to your local disk. For each blob you want to download, set the name and call [Get-AzStorageBlobContent](/powershell/module/az.storage/get-azstorageblobcontent) to download the blob.

This example downloads the blobs to *D:\\_TestImages\Downloads* on the local disk. 

```powershell
# download first blob
Get-AzStorageBlobContent -Blob "Image001.jpg" `
  -Container $containerName `
  -Destination "D:\_TestImages\Downloads\" `
  -Context $ctx 

# download another blob
Get-AzStorageBlobContent -Blob "Image002.png" `
  -Container $containerName `
  -Destination "D:\_TestImages\Downloads\" `
  -Context $ctx
```

## Data transfer with AzCopy

The AzCopy command-line utility offers high-performance, scriptable data transfer for Azure Storage. You can use AzCopy to transfer data to and from Blob storage and Azure Files. For more information about AzCopy v10, the latest version of AzCopy, see [Get started with AzCopy](../common/storage-use-azcopy-v10.md). To learn about using AzCopy v10 with Blob storage, see [Transfer data with AzCopy and Blob storage](../common/storage-use-azcopy-blobs.md).

The following example uses AzCopy to upload a local file to a blob. Remember to replace the sample values with your own values:

```powershell
azcopy login
azcopy copy 'C:\myDirectory\myTextFile.txt' 'https://mystorageaccount.blob.core.windows.net/mycontainer/myTextFile.txt'
```

## Clean up resources

Remove all of the assets you've created. The easiest way to remove the assets is to delete the resource group. Removing the resource group also deletes all resources included within the group. In the following example, removing the resource group removes the storage account and the resource group itself.

```powershell
Remove-AzResourceGroup -Name $resourceGroup
```

## Next steps

In this quickstart, you transferred files between a local file system and Azure Blob storage. To learn more about working with Blob storage by using PowerShell, explore Azure PowerShell samples for Blob storage.

> [!div class="nextstepaction"]
> [Azure PowerShell samples for Azure Blob storage](storage-samples-blobs-powershell.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)

### Microsoft Azure PowerShell Storage cmdlets reference

* [Storage PowerShell cmdlets](/powershell/module/az.storage)

### Microsoft Azure Storage Explorer

* [Microsoft Azure Storage Explorer](../../vs-azure-tools-storage-manage-with-storage-explorer.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) is a free, standalone app from Microsoft that enables you to work visually with Azure Storage data on Windows, macOS, and Linux.
