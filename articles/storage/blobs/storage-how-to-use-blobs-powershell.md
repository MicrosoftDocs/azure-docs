---
title: Perform operations on Azure Blob storage (object storage) with PowerShell | Microsoft Docs
description: Tutorial - Perform operations on Azure Blob storage (object storage) with PowerShell
services: storage
documentationcenter: storage
author: robinsh
manager: timlt
editor: tysonn

ms.assetid: 
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/15/2017
ms.author: robinsh
---

# Perform Azure Blob storage operations with Azure PowerShell

Azure Blob storage is a service for storing large amounts of unstructured object data, such as text or binary data, that can be accessed from anywhere in the world via HTTP or HTTPS. This article covers basic operations in Azure Blob storage such as uploading, downloading, and deleting blobw. You learn how to:

> [!div class="checklist"]
> * Create a container 
> * Upload blobs
> * List the blobs in a container 
> * Download blobs
> * Copy blobs
> * Delete blobs
> * View and set a blob's metadata and properties
> * Manage security using Shared Access Signatures

This tutorial requires the Azure PowerShell module version 3.6 or later. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps).

[!INCLUDE [storage-quickstart-tutorial-intro-include-cli](../../../includes/storage-quickstart-tutorial-intro-include-cli.md)]

## Create a container

Blobs are always uploaded into a container. Containers are similar to directories on your computer, allowing you to organize groups of blobs in containers like you organize your files in folders on your computer. A storage account can have any number of containers; it is only limited by the amount of space taken up in the storage account (up to 500TB). 

When you create a container, you can set the access level, which helps define who can access the blobs in that container. For example, they can be private (access level = `Off`),meaning nobody can access them without a shared access signature or the access keys for the storage account. If you don't specify the access level when you create the container, it defaults to private.

You may want images in your container to be accessible publicly. For example, if you want to store images to be displayed on your website, you want them to be public. In this case, you set the container access level to `blob`, and anybody with a URL pointing to a blob in that container can access the blob.

To create the container, set the container name, then create the container, setting the permissions to 'blob'. Container names must start with a letter or a number, and can contain only letters, numbers, and the hyphen character (-). For more rules about naming blobs and containers, please see [Naming and Referencing Containers, Blobs, and Metadata](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata).

Create a new container with [New-AzureStorageContainer](/powershell/module/azure.storage/new-azurestoragecontainer). Set the access level to public. The container name in this example is *blobshowto*.

```powershell
$containerName = "blobshowto"
New-AzureStorageContainer -Name $containerName -Context $ctx -Permission blob
```

## Upload blobs into a container

Azure Blob Storage supports block blobs, append blobs, and page blobs.  VHD files used to back IaaS VMs are page blobs. Append blobs are used for logging, such as when you want to write to a file and then keep adding more information. Most files stored in Blob storage are block blobs. 

To upload a file to a block blob, get a container reference, then get a reference to the block blob in that container. Once you have the blob reference, you can upload data to it by using [Set-AzureStorageBlobContent](/powershell/module/azure.storage/set-azurestorageblobcontent). This operation creates the blob if it doesn't exist, or overwrites it if it does already exist.

The following shows how to upload a blob into a container. First, set variables that point to the directory on the local machine where the files are located, and set a variable for the name of the file to be uploaded. This is helpful when you want to perform the same operation repeatedly. Upload a couple of files so you can see multiple entries when listing the blobs in the container.

The following examples load Image001.jpg and Image002.png from D:\\_TestImages on the local disk to the container you just created.

```powershell
$localFileDirectory = "D:\_TestImages\"

$blobName = "Image001.jpg"
$localFile = $localFileDirectory + $blobName
Set-AzureStorageBlobContent -File $localFile `
  -Container $containerName `
  -Blob $blobName `
  -Context $ctx 
```

Upload another file. 

```powershell
$blobName = "Image002.png"
$localFile = $localFileDirectory + $blobName 
Set-AzureStorageBlobContent -File $localFile `
  -Container $containerName `
  -Blob $blobName `
  -Context $ctx
```

Upload as many files as you like before continuing.

## List the blobs in a container

Get a list of blobs in the container using [Get-AzureStorageBlob](/powershell/module/azure.storage/get-azurestorageblob) and selecting the blob name to be displayed.

```powershell
Get-AzureStorageBlob -Container $ContainerName -Context $ctx | select Name 
```

## Download blobs

Download the blobs to your local disk. First, set a variable that points to the local folder to which you want to download the blobs. Then for each blob to be downloaded, set the name and call [Get-AzureStorageBlobContent](/powershell/module/azure.storage/get-azurestorageblobcontent) to download the blob.

This example copies the blobs to D:\\_TestImages\Downloads on the local disk. 

```powershell
# local directory to which to download the files
# example "D:\_TestImages\Downloads\"
$localTargetDirectory = "D:\_TestImages\Downloads\"

# download the first blob
$blobName = "Image001.jpg"
Get-AzureStorageBlobContent -Blob $blobName `
  -Container $containerName `
  -Destination $localTargetDirectory `
  -Context $ctx 

# download another blob
$blobName = "Image002.png"
Get-AzureStorageBlobContent -Blob $blobName `
  -Container $containerName `
  -Destination $localTargetDirectory `
  -Context $ctx 
```

## Copy blobs

There are several things to consider when copying blobs. You could be just copying the blob into a new name in the same location. You could be copying the blob to a separate storage account. You could be copying a large blob (such as a VHD file) to a different storage account. These would each be done differently.

### Simple blob copy

You can make a copy of one of the blobs in a container by copying it into a new blob. This example will copy it into the same container with a different name, but you can just as easily create another container and copy it there instead. This example shows how to use [Start-AzureStorageBlobCopy](/powershell/module/azure.storage/start-azurestorageblobcopy) to copy the blob. You have to specify both the source and destination blob name and container name.

```powershell
$blobName = "Image002.png"
$newBlobName = "CopyOf_" + $blobName 

Start-AzureStorageBlobCopy -SrcBlob $blobName `
  -SrcContainer $containerName `
  -DestContainer $containerName `
  -DestBlob $newBlobName `
  -Context $ctx 

# get list of blobs to verify the new one has been created
Get-AzureStorageBlob -Container $containerName -Context $ctx | select Name 
```

### Copy a blob to a different storage account 

You may want to copy a blob to a separate storage account. One example for doing this is to copy a VHD file that backs one of your VMs to a different storage account in order to back it up. 

Set up a second storage account, retrieve the context, set up a container in that storage account, and perform the copy. This part of the script is almost identical to the script above except for using the second storage account instead of the first.

```powershell
#create new storage acount, get context 
$storageAccount2Name = "blobstutorialtestcopy"
$storageAccount2 = New-AzureRmStorageAccount -ResourceGroupName $resourceGroup `
  -Name $storageAccount2Name `
  -Location $location `
  -SkuName Standard_LRS `
  -Kind Storage `
  -EnableEncryptionService Blob

$ctx2 = $storageAccount2.Context

#create a container in the second storage account 
$containerName2 = "tutorialblobscopied"
New-AzureStorageContainer -Name $containerName2 `
  -Context $ctx2 `
  -Permission blob

# copy one of the blobs from the first storage account to the second one 
# specify the source and destination container, blob name, and context
Start-AzureStorageBlobCopy -SrcBlob $blobName `
  -SrcContainer $containerName `
  -DestContainer $containerName2 `
  -DestBlob $blobName `
  -SrcContext $ctx `
  -DestContext $ctx2 

# list the blobs in the container in the second storage account
# to verify that the newly copied blob is there
Get-AzureStorageBlob -Container $containerName2 -Context $ctx2 | select Name 
```

### Copying very large blobs asynchronously

If you are copying a very large blob that is multiple GB, you can take advantage of the  asynchronous copy by starting it, and then coming back and checking the status until it's finished. This way, you are not tied up while it is performing the copy operation.

If you are copying within a storage account, the copy is very fast. If you are copying between two storage accounts in the same region, the copy is pretty fast. However, if your source and destination are in separate regions, it could take several hours to finish the copy, depending on the distance and the size of your file. 

This script uses the same variables defined in the last copy example. The difference is that this one captures the status of the copy and queries it repeatedly every 10 seconds until it is finished. You may have to upload a very large blob to your storage account to see this take more than one iteration to complete.

Use [Get-AzureStorageBlobCopyState](/powershell/module/azure.storage/get-azurestorageblobcopystate) to query the status of the copy. 

```powershell
# start the blob copy, and assign the result to $blobResult
$blobResult = Start-AzureStorageBlobCopy -SrcBlob $blobName `
  -SrcContainer $containerName `
  -DestContainer $containerName2 `
  -DestBlob $blobName `
  -Context $ctx `
  -DestContext $ctx2

# get the status of the blob copy
$status = $blobResult | Get-AzureStorageBlobCopyState 
# show the value of the status
$status 

# loop until it finishes copying, pausing for 10 seconds after each iteration
# it is finished when the status is no longer 'Pending'
while ($status.Status -eq "Pending") {
    $status = $blobResult | Get-AzureStorageBlobCopyState 
    $status
    Start-Sleep 10
}

# get the list of blobs to see the new file in the second storage account 
Get-AzureStorageBlob -Container $containerName2 -Context $ctx2 | select Name 
```

## Delete blobs

To remove blobs from a storage account, use [Remove-AzureStorageBlob](/powershell/module/azure.storage/Remove-AzureStorageBlob). 

```powershell
$blobName = "Image001.jpg"
Remove-AzureStorageBlob -Blob $blobName -Container $containerName -Context $ctx

# get list of blobs to see the one you deleted is gone
Get-AzureStorageBlob -Container $containerName -Context $ctx | select Name 
```

## Read and write a blob's properties and metadata

To access the set of properties and methods for a returned **IListBlobItem**, you must cast it (or convert it) to a **CloudBlockBlob**, **CloudPageBlob**, or **CloudBlobDirectory** object. If the type is unknown, you can use a type check to determine which to cast it to. The following code demonstrates how to retrieve and output the properties of one of the blobs uploaded earlier using [Get-AzureStorageBlob](/powershell/module/azure.storage/get-azurestorageblob) and casting the result to a CloudBlockBlob object.

```powershell
# blob properties
# get a reference to the blob you uploaded -- this is an **IListBlobItem** -- then
# convert it to a CloudBlockBlob, giving you access to the properties 
# and methods of the blob 
$blobName = "Image001.jpg"
$blob = Get-AzureStorageBlob -Context $ctx `
   -Container $containerName `
   -Blob $blobName 

#convert $blob to a CloudBlockBlob object
$cloudBlockBlob = [Microsoft.WindowsAzure.Storage.Blob.CloudBlockBlob] $blob.ICloudBlob

# you can view the properties by typing in $cloudBlockBlob 
#   and hitting the period key; this brings up IntelliSense,
#   which shows you all of the available properties
Write-Host "blob type = " $cloudBlockBlob.BlobType
Write-Host "blob name = " $cloudBlockBlob.Name
Write-Host "blob uri = " $cloudBLockBlob.Uri
```

Populate the system properties by calling FetchAttributes, then view those properties. Some of the properties are writable, and you can change their values. This example shows how to change the content type, also known as the MIME type.

```powershell
# populate the system properties
$cloudBlockBlob.FetchAttributes()

# view some of the system properties
# contentType is commonly referred to as MIME type
Write-Host "content type = " $cloudBlockBlob.Properties.ContentType
Write-Host "size = " $cloudBlockBlob.Properties.Length 

# change the content type to image/png
$contentType = "image/jpg"
$cloudBlockBlob.Properties.ContentType = $contentType 
$cloudBlockBlob.SetProperties() 

# get the system properties again to show that the content type has changed
$cloudBlockBlob.FetchAttributes()
Write-Host "content type = " $cloudBlockBlob.Properties.ContentType
```

Each blob has its own metadata that you can set. For example, you may store the name of the user who uploaded the blob, or the date/time it was first uploaded. The metadata consists of key/value pairs. This can be modified using PowerShell as follows.

```powershell
# "filename" is the key, "original file name" is the value
$cloudBlockBlob.Metadata["filename"] = "original file name"

# "owner" is the key, "RobinS" is the value
$cloudBlockBlob.Metadata["owner"] = "RobinS"

# save the metadata and then display it
$cloudBlockBlob.SetMetadata()
$cloudBlockBlob.Metadata

# clear the metadata, save it, and show it
$cloudBlockBlob.Metadata.Clear()
$cloudBlockBlob.SetMetadata()
$cloudBlockBlob.Metadata
```

## Managing security for blobs 

By default, Azure Storage keeps your data secure by limiting access to the account owner, who is in possession of the storage account access keys. When you need to share blob data in your storage account, it is important to do so without compromising the security of your account access keys. To do this, you can use a Shared Access Signature URL, which is a URL to the asset that includes query parameters and a security token that allows a specific level of permission for a specific amount of time. For example, you may want to give read access to a private blob for 5 minutes so someone can view it. 

### Set the access level of the container and its blobs to private

First, set the access level of the container to `Off`, which designates that there is no access without a shared access signature or the account key. Use the [Set-AzureStorageContainerAcl](/powershell/module/azure.storage/Set-AzureStorageContainerAcl).

```powershell
Set-AzureStorageContainerAcl -Name $containerName -Context $ctx -Permission Off 
```

### Test private access

To verify that you have no access to the blobs in that container, construct the URL to one of the blobs without a shared access signature and try to view the blob. Using the HTTPS protocol, the URL will be in the following format:

    `https://storageaccountname.blob.core.windows.net/containername/blobname`

This shows how to create the blob URL.

```powershell
$blobUrl = "https://" `
  $storageAccountName ".blob.core.windows.net/" + `
  $containerName +  "/" $blobName

Write-Host "Blob URL = " $blobUrl 
```

Copy the blob URL and paste it into a private browser window -- it will show an authorization error because the blob is private and you have not included a shared access signature. 

### Create the SAS URI

Create an SAS URI -- this is the link to the blob including the query parameters and security token that make up the SAS. Paste this URI into a private browsing window -- it will show the image. 

First create the start date/time and expiration date/time for access. This uses a 2-minute window. 

```powershell
# set the start time to the current date/time 
# set the end time to 2 minutes in the future
$StartTime = Get-Date
$EndTime = $StartTime.AddMinutes(2.0)
```

Create the SAS URI using [New-AzureStorageBlobSASToken](/powershell/module/azure.storage/new-azurestorageblobsastoken). You need the container name, blob name, storage account context, the permissions to be granted (in this case, read, write, and delete), and the start and end time for access. 

```powershell
$SASURI = New-AzureStorageBlobSASToken -Container $containerName `
    -Blob $blobName `
    -Context $ctx `
    -Permission "rwd" `
    -StartTime $StartTime `
    -ExpiryTime $EndTime `
    -FullUri

Write-Host "URL with SAS = " $SASURI
```

Copy the SAS URI and put it in a private browser window; it will show the image.

Wait long enough for the URL to expire (2 minutes in this example), then paste the URL into another in-private browser window. This time, you will get an authorization error and it won't show the picture, because the SAS URI has expired.

## Clean up resources

Remove all of the assets you have created. To do this, you can remove the resource group, which also deletes all resources contained within the group. In this case, it removes all of the storage accounts and the resource group itself.

```powershell
Remove-AzureRmResourceGroup -Name $resourceGroup
```

## Next steps

In this tutorial, you learned about basic Blob storage management such as how to:

> [!div class="checklist"]
> * Create a container 
> * Upload blobs
> * List the blobs in a container 
> * Download blobs
> * Copy blobs
> * Delete blobs
> * Read and write a blob's metadata and properties
> * Manage security using Shared Access Signatures

### Microsoft Azure PowerShell Storage cmdlets
* [Storage PowerShell cmdlets](/powershell/module/azurerm.storage#storage)

### Microsoft Azure Storage Explorer
* [Microsoft Azure Storage Explorer](../../vs-azure-tools-storage-manage-with-storage-explorer.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) is a free, standalone app from Microsoft that enables you to work visually with Azure Storage data on Windows, macOS, and Linux.