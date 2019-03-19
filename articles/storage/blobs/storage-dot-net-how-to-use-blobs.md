---
title: How to use Blob storage from .NET
description: Use the Azure Storage Client Library for .NET to interact with Blob storage
services: storage
author: normesta
ms.service: storage
ms.date: 04/14/2019
ms.author: normesta
ms.topic: article
ms.component: data-lake-storage-gen2
---

# How to use Blob storage from .NET

This guide shows you how to interact with blobs by using .NET. It contains snippets that help you get started with common tasks such as uploading and downloading blobs. It also contains snippets that showcase common tasks with a hierarchical file system.

## Create a storage account

To create a storage account, see [Create a storage account](../common/storage-quickstart-create-account.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).

Enable a hierarchical namespace if you want to use the code snippets in this article that perform operations on a hierarchical file system.

![Enabling a hierarchical namespace](media/storage-dot-net-how-to-use-blobs/enable-hierarchical-namespace.png)

## Set up your development environment

What you install depends on the operating system that you are running on your development computer.

### Windows

* Install [.NET Core for Windows](https://www.microsoft.com/net/download/windows) or the [.NET Framework](https://www.microsoft.com/net/download/windows) (included with Visual Studio for Windows)

* Install [Visual Studio for Windows](https://www.visualstudio.com/). If you are using .NET Core, installing Visual Studio is optional. 

* Install the [Azure Storage APIs for .NET](https://docs.microsoft.com/dotnet/api/overview/azure/storage?view=azure-dotnet).

### Linux

* Install [.NET Core for Linux](https://www.microsoft.com/net/download/linux)

* Optionally install [Visual Studio Code](https://www.visualstudio.com/) and the [C# extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp&dotnetid=963890049.1518206068)

* Install the [Azure Storage APIs for .NET](https://docs.microsoft.com/dotnet/api/overview/azure/storage?view=azure-dotnet).

### macOS

* Install [.NET Core for macOS](https://www.microsoft.com/net/download/macos).

* Optionally install [Visual Studio for Mac](https://www.visualstudio.com/vs/visual-studio-mac/)

* Install the [Azure Storage APIs for .NET](https://docs.microsoft.com/dotnet/api/overview/azure/storage?view=azure-dotnet).

## Add library references to your code file

Add these using statements to your code file.

```cs
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
```

[!INCLUDE [storage-copy-connection-string-portal](../../../includes/storage-copy-connection-string-portal.md)]

## Connect to the storage account

First, parse the connection string, and then create an object that represents Blob storage in your storage account.

```cs
public bool GetBlob(ref CloudBlobClient cloudBlobClient, string storageConnectionString)
{
    if (CloudStorageAccount.TryParse
        (storageConnectionString, out CloudStorageAccount storageAccount))
    {
        cloudBlobClient = storageAccount.CreateCloudBlobClient();

        return true;
    }
    else
    {
        return false;
    }
}
```

### APIs featured in this snippet

> [!div class="checklist"]
> * [CloudBlobClient](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobclient?view=azure-dotnet) class
> * [CloudStorageAccount.TryParse](/dotnet/api/microsoft.windowsazure.storage.cloudstorageaccount.tryparse) method
> * [CloudStorageAccount.CreateCloudBlobClient](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.cloudstorageaccount.createcloudblobclient?view=azure-dotnet) method

## Create a container and set permissions

Create a container instance and then and then set the permissions on that container.

```cs
public async Task CreateContainerAsync
    (CloudBlobClient cloudBlobClient, string containerName)
{
    // Create container and give that container the name that you pass into this method.
    CloudBlobContainer cloudBlobContainer =
        cloudBlobClient.GetContainerReference(containerName);

    await cloudBlobContainer.CreateAsync();

    // Set the permissions so the blobs are public.
    BlobContainerPermissions permissions = new BlobContainerPermissions
    {
        PublicAccess = BlobContainerPublicAccessType.Blob
    };

    await cloudBlobContainer.SetPermissionsAsync(permissions);
}
```

### APIs featured in this snippet

> [!div class="checklist"]
> * [CloudBlobClient](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobclient?view=azure-dotnet) class
> * [CloudBlobContainer](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobcontainer?view=azure-dotnet) class
> * [BlobContainerPermissions](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.blob.blobcontainerpermissions?view=azure-dotnet) class
> * [CloudBlobClient.GetContainerReference](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobclient.getcontainerreference?view=azure-dotnet) method.
> * [CloudBlobContainer.CreateAsync](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobcontainer.createasync?view=azure-dotnet#Microsoft_WindowsAzure_Storage_Blob_CloudBlobContainer_CreateAsync) method.
> * [CloudBlobContainer.SetPermissionsAsync](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobcontainer.setpermissionsasync?view=azure-dotnet#Microsoft_WindowsAzure_Storage_Blob_CloudBlobContainer_SetPermissionsAsync_Microsoft_WindowsAzure_Storage_Blob_BlobContainerPermissions_) method.

## Upload blobs to the container

Some guidance goes here.

```cs
public async Task UploadBlob(CloudBlobClient cloudBlobClient,
    string sourceFile, string containerName)
{
    CloudBlobContainer cloudBlobContainer =
        cloudBlobClient.GetContainerReference(containerName);

    CloudBlockBlob cloudBlockBlob =
        cloudBlobContainer.GetBlockBlobReference(sourceFile);

    await cloudBlockBlob.UploadFromFileAsync(sourceFile);
}
```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type]()
> * [Method]()

## List blobs in the container

Some guidance goes here.

```cs
public async Task ListBlobs(CloudBlobClient cloudBlobClient, string containerName)
{
    CloudBlobContainer cloudBlobContainer = 
        cloudBlobClient.GetContainerReference(containerName);

    BlobContinuationToken blobContinuationToken = null;
    do
    {
        var resultSegment = await cloudBlobContainer.ListBlobsSegmentedAsync
            (null, blobContinuationToken);

        // Get the value of the continuation token returned by the listing call.
        blobContinuationToken = resultSegment.ContinuationToken;
        foreach (IListBlobItem item in resultSegment.Results)
        {
            Console.WriteLine(item.Uri);
        }
    } while (blobContinuationToken != null);
    // Loop while the continuation token is not null.
}
```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type]()
> * [Method]()

## Download blobs from the container

Some guidance goes here.

```cs
public async Task DownloadBlobs(CloudBlobClient cloudBlobClient, 
    string containerName, string sourceFile, string destinationFile)
{
    CloudBlobContainer cloudBlobContainer =
        cloudBlobClient.GetContainerReference(containerName);

    CloudBlockBlob cloudBlockBlob =
        cloudBlobContainer.GetBlockBlobReference(sourceFile);

    await cloudBlockBlob.DownloadToFileAsync(destinationFile, FileMode.Create);
}
```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type]()
> * [Method]()

## Delete blobs from the container

Some guidance goes here.

```cs
public async Task DeleteBlob(CloudBlobClient cloudBlobClient,
    string sourceFile, string containerName)
{
    CloudBlobContainer cloudBlobContainer =
        cloudBlobClient.GetContainerReference(containerName);

    CloudBlockBlob cloudBlockBlob =
        cloudBlobContainer.GetBlockBlobReference(sourceFile);

    await cloudBlockBlob.DeleteAsync();
}
```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type]()
> * [Method]()

## Add directories to the container

This is only for accounts that have a hierarchical namespace.

```cs

```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type]()
> * [Method]()

## Add files to directories in the container

This is only for accounts that have a hierarchical namespace.

```cs

```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type]()
> * [Method]()

## Set Access Control Lists (ACL) permission on a directory

This is only for accounts that have a hierarchical namespace.

```cs

```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type]()
> * [Method]()

## Set Access Control Lists (ACL) permission on a file in a directory

This is only for accounts that have a hierarchical namespace.

```cs

```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type]()
> * [Method]()

## Something here for append data and flush methods (scenario TBD)

This is only for accounts that have a hierarchical namespace.

```cs

```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type]()
> * [Method]()

## Next steps

Now that you've learned the basics of blob storage, follow these links to learn more about Azure Storage.  

Put next steps here.