---
title: Azure Quickstart - Transfer objects to/from Azure Blob storage using PowerShell | Microsoft Docs
description: Quickly learn to transfer objects to/from Azure Blob storage using PowerShell
services: storage
documentationcenter: storage
author: robinsh
manager: timlt
editor: tysonn

ms.assetid: 
ms.custom: mvc
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: quickstart
ms.date: 07/19/2017
ms.author: robinsh
---

# Transfer objects to/from Azure Blob storage using Azure PowerShell

The Azure PowerShell module is used to create and manage Azure resources from the PowerShell command line or in scripts. This guide details using PowerShell to transfer files between local disk and Azure Blob storage.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

This quick start requires the Azure PowerShell module version 3.6 or later. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps).

[!INCLUDE [storage-quickstart-tutorial-intro-include-powershell](../../../includes/storage-quickstart-tutorial-intro-include-powershell.md)]

## Create a container

Blobs are always uploaded into a container. This allows you to organize groups of blobs like you organize your files on your computer in folders.

Set the container name, then create the container using [New-AzureStorageContainer](/powershell/module/azure.storage/new-azurestoragecontainer), setting the permissions to 'blob' to allow public access of the files. The container name in this example is *quickstartblobs*.

```powershell
$containerName = "quickstartblobs"
New-AzureStorageContainer -Name $containerName -Context $ctx -Permission blob
```

## Upload blobs to the container

Blob storage supports block blobs, append blobs, and page blobs. VHD files used to back IaaS VMs are page blobs. Append blobs are used for logging, such as when you want to write to a file and then keep adding more information. Most files stored in Blob storage are block blobs. 

To upload a file to a block blob, get a container reference, then get a reference to the block blob in that container. Once you have the blob reference, you can upload data to it by using [Set-AzureStorageBlobContent](/powershell/module/azure.storage/set-azurestorageblobcontent). This operation creates the blob if it doesn't already exist, or overwrites it if it does already exist.

The following examples upload Image001.jpg and Image002.png from the D:\\_TestImages folder on the local disk to the container you just created.

```powershell
# upload a file
Set-AzureStorageBlobContent -File "D:\_TestImages\Image001.jpg" `
  -Container $containerName `
  -Blob "Image001.jpg" `
  -Context $ctx 

# upload another file
Set-AzureStorageBlobContent -File "D:\_TestImages\Image002.png" `
  -Container $containerName `
  -Blob "Image002.png" `
  -Context $ctx
```

Upload as many files as you like before continuing.

## List the blobs in a container

Get a list of blobs in the container using [Get-AzureStorageBlob](/powershell/module/azure.storage/get-azurestorageblob). This example shows just the names of the blobs uploaded.

```powershell
Get-AzureStorageBlob -Container $ContainerName -Context $ctx | select Name 
```

## Download blobs

Download the blobs to your local disk. For each blob to be downloaded, set the name and call [Get-AzureStorageBlobContent](/powershell/module/azure.storage/get-azurestorageblobcontent) to download the blob.

This example downloads the blobs to D:\\_TestImages\Downloads on the local disk. 

```powershell
# download first blob
Get-AzureStorageBlobContent -Blob "Image001.jpg" `
  -Container $containerName `
  -Destination "D:\_TestImages\Downloads\" `
  -Context $ctx 

# download another blob
Get-AzureStorageBlobContent -Blob "Image002.png" `
  -Container $containerName `
  -Destination "D:\_TestImages\Downloads\" `
  -Context $ctx 
```

## Data transfer with AzCopy

The [AzCopy](../common/storage-use-azcopy.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) utility is another option for high-performance scriptable data transfer for Azure Storage. You can use AzCopy to transfer data to and from Blob, File, and Table storage.

As a quick example, here is the AzCopy command for uploading a file called *myfile.txt* to the *mystoragecontainer* container from within a PowerShell window.

```PowerShell
./AzCopy `
    /Source:C:\myfolder `
    /Dest:https://mystorageaccount.blob.core.windows.net/mystoragecontainer `
    /DestKey:<storage-account-access-key> `
    /Pattern:"myfile.txt"
```

## Clean up resources

Remove all of the assets you've created. The easiest way to do this is to delete the resource group. This also deletes all resources contained within the group. In this case, it removes the storage account and the resource group itself.

```powershell
Remove-AzureRmResourceGroup -Name $resourceGroup
```

## Next steps

In this quick start, you learned how to transfer files between a local disk and Azure Blob storage. To learn more about working with Blob storage, continue to the Blob storage How-to.

> [!div class="nextstepaction"]
> [Blob Storage Operations How-To](storage-how-to-use-blobs-powershell.md)

### Microsoft Azure PowerShell Storage cmdlets reference
* [Storage PowerShell cmdlets](/powershell/module/azurerm.storage#storage)

### Microsoft Azure Storage Explorer
* [Microsoft Azure Storage Explorer](../../vs-azure-tools-storage-manage-with-storage-explorer.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) is a free, standalone app from Microsoft that enables you to work visually with Azure Storage data on Windows, macOS, and Linux.