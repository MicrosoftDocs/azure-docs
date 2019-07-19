---
title: Use .NET with Azure Data Lake Storage Gen2
description: Use the Azure Storage Client Library for .NET to interact with Azure Blob storage accounts that have a hierarchical namespace.
services: storage
author: normesta
ms.service: storage
ms.date: 06/26/2019
ms.author: normesta
ms.topic: article
ms.component: data-lake-storage-gen2
---

# Use .NET with Azure Data Lake Storage Gen2

This article shows you how to use the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage/client).NET to manage directories in storage accounts that have a hierarchical namespace. 

> [!NOTE]
> The content featured in this article uses terms such as *blobs* and *containers* instead of *files* and *file systems*. That's because Azure Data Lake Storage Gen2 is built on blob storage, and in blob storage a *file* is persisted as a *blob*, and a *file system* is persisted as a *container*. 

## Connect to the storage account 

First, parse the connection string by calling the [CloudStorageAccount.TryParse](/dotnet/api/microsoft.windowsazure.storage.cloudstorageaccount.tryparse) method. 

Then, create an object that represents Blob storage in your storage account by calling the [CloudStorageAccount.CreateCloudBlobClient](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.cloudstorageaccount.createcloudblobclient?view=azure-dotnet) method.

```cs
public bool GetBlobClient(ref CloudBlobClient cloudBlobClient, string storageConnectionString)
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
}
```

### APIs featured in this snippet 

> [!div class="checklist"] 
> * [CloudStorageAccount.TryParse](/dotnet/api/microsoft.windowsazure.storage.cloudstorageaccount.tryparse) method 
> * [CloudStorageAccount.CreateCloudBlobClient](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.cloudstorageaccount.createcloudblobclient?view=azure-dotnet) method


## Add directory to a file system (container)

Create a directory reference by calling the [CloudBlobContainer.GetDirectoryReference](https://www.microsoft.com) method.

Create a directory by using one of the following methods:

* [CloudBlobDirectory.CreateAsync](https://www.microsoft.com) method.
* other method.
* other method.

This example adds a directory named `my-directory` to a container and then adds a sub-directory named `my-subdirectory` to the directory named `my-directory`. 

```cs
public async Task CreateDirectory(CloudBlobClient cloudBlobClient,
    string containerName)
{
    CloudBlobContainer cloudBlobContainer =
        cloudBlobClient.GetContainerReference(containerName);

    if (cloudBlobContainer != null)
    {
        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.GetDirectoryReference("my-directory");

        await cloudBlobDirectory.CreateAsync();

        await cloudBlobDirectory.GetDirectoryReference("my-subdirectory").CreateAsync();
    }
}
```
## Move a directory

Move or rename a directory by calling the [MoveAsync](https://www.microsoft.com) method. Pass the Uri of the desired directory location as a parameter. 

This example moves a directory named `my-directory` to a sub-directory of another directory named `my-directory-2`. 

```cs
public async Task MoveDirectory(CloudBlobClient cloudBlobClient,
    string containerName)
{
    CloudBlobContainer cloudBlobContainer =
        cloudBlobClient.GetContainerReference(containerName);

    if (cloudBlobContainer != null)
    {
        // Get source directory
        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.GetDirectoryReference("my-directory");

        if (cloudBlobDirectory != null)
        {
            // Get destination directory
            CloudBlobDirectory cloudBlobDestinationDirectory =
                cloudBlobContainer.GetDirectoryReference("my-directory-2");

            if (cloudBlobDestinationDirectory != null)
            {
                await cloudBlobDirectory.MoveAsync(new Uri(cloudBlobDestinationDirectory.Uri.AbsoluteUri + "my-directory/"));
            }

        }
    }
```
## Rename a directory

Rename a directory by calling the [MoveAsync](https://www.microsoft.com) method. Pass the Uri of the desired directory location as a parameter. 

This example renames that sub-directory to `my-directory-renamed`.

```cs
public async Task RenameDirectory(CloudBlobClient cloudBlobClient,
    string containerName)
{
    CloudBlobContainer cloudBlobContainer =
        cloudBlobClient.GetContainerReference(containerName);

    if (cloudBlobContainer != null)
    {
        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.GetDirectoryReference("my-directory-2/my-directory");

        if (cloudBlobDirectory != null)
        {
            await cloudBlobDirectory.MoveAsync(new Uri(cloudBlobContainer.Uri.AbsoluteUri + 
                "/my-directory-2/my-directory-renamed"));

        }
    }

}
```

## Delete a directory from a file system (container)

The following example deletes a directory by calling the [CloudBlobDirectory.Delete](https://www.microsoft.com) method. 

This method deletes a directory named `my-directory` from the `my-directory-2` directory.  

```cs
public void DeleteDirectory(CloudBlobClient cloudBlobClient,
    string containerName)
{
    CloudBlobContainer cloudBlobContainer =
        cloudBlobClient.GetContainerReference(containerName);

    if (cloudBlobContainer != null)
    {
        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.GetDirectoryReference("my-directory-2/my-directory");

        if (cloudBlobDirectory != null)
        {
            cloudBlobDirectory.Delete();
        }
    }

}
```
## Upload a file to a directory

Comment here.  

```cs
Code here.
```

## Download a file from a directory

Comment here.  

```cs
Code here.
```

## List the contents of a directory

Comment here.  

```cs
Code here.
```

[!INCLUDE [storage-blob-dotnet-resources](../../../includes/storage-blob-dotnet-resources.md)]

## Next steps

Explore more APIs in the [Microsoft.WindowsAzure.Storage.Blob](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.blob?view=azure-dotnet) namespace of the [Azure Storage APIs for .NET](https://docs.microsoft.com/dotnet/api/overview/azure/storage?view=azure-dotnet) docs.