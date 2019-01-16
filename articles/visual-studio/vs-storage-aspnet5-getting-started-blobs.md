---
title: Get started with blob storage and Visual Studio connected services (ASP.NET Core) | Microsoft Docs
description: How to get started using Azure Blob storage in a Visual Studio ASP.NET Core project after you have created a storage account using Visual Studio connected services
services: storage
author: ghogen
manager: douge
ms.assetid: 094b596a-c92c-40c4-a0f5-86407ae79672
ms.prod: visual-studio-dev15
ms.technology: vs-azure
ms.custom: vs-azure
ms.workload: azure-vs
ms.topic: conceptual
ms.date: 11/14/2017
ms.author: ghogen
---
# Get started with Azure Blob storage and Visual Studio connected services (ASP.NET Core)

[!INCLUDE [storage-try-azure-tools-blobs](../../includes/storage-try-azure-tools-blobs.md)]

This article describes how to get started using Azure Blob storage in Visual Studio after you have created or referenced an Azure storage account in an ASP.NET Core project by using the Visual Studio **Connected Services** feature. The **Connected Services** operation installs the appropriate NuGet packages to access Azure storage in your project and adds the connection string for the storage account to your project configuration files. (See [Storage documentation](https://azure.microsoft.com/documentation/services/storage/) for general information about Azure Storage.)

Azure Blob storage is a service for storing large amounts of unstructured data that can be accessed from anywhere in the world via HTTP or HTTPS. A single blob can be any size. Blobs can be things like images, audio and video files, raw data, and document files. This article describes how to get started with blob storage after you create an Azure storage account by using the Visual Studio **Connected Services** in an ASP.NET Core project.

Just as files live in folders, storage blobs live in containers. After you have created a blob, you create one or more containers in that blob. For example, in a blob called "Scrapbook," you can create containers called "images" to store pictures and another called "audio" to store audio files. After you create the containers, you can upload individual files to them. See [Quickstart: Upload, download, and list blobs using .NET](../storage/blobs/storage-quickstart-blobs-dotnet.md) for more information on programmatically manipulating blobs.

Some of the Azure Storage APIs are asynchronous, and the code in this article assumes async methods are being used. See [Asynchronous programming](https://docs.microsoft.com/dotnet/csharp/async) for more information.

## Access blob containers in code

To programmatically access blobs in ASP.NET Core projects, you need to add the following code if not already present:

1. Add the necessary `using` statements:

    ```cs
    using Microsoft.Extensions.Configuration;
    using Microsoft.WindowsAzure.Storage;
    using Microsoft.WindowsAzure.Storage.Blob;
    using System.Threading.Tasks;
    using LogLevel = Microsoft.Extensions.Logging.LogLevel;
    ```

1. Get a `CloudStorageAccount` object that represents your storage account information. Use the following code to get your storage connection string and storage account information from the Azure service configuration:

    ```cs
     CloudStorageAccount storageAccount = new CloudStorageAccount(
        new Microsoft.WindowsAzure.Storage.Auth.StorageCredentials(
        "<storage-account-name>",
        "<access-key>"), true);
    ```

1. Use a `CloudBlobClient` object to get a `CloudBlobContainer` reference to an existing container in your storage account:

    ```cs
    // Create a blob client.
    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

    // Get a reference to a container named "mycontainer."
    CloudBlobContainer container = blobClient.GetContainerReference("mycontainer");
    ```

## Create a container in code

You can also use the `CloudBlobClient` to create a container in your storage account by calling `CreateIfNotExistsAsync`:

```cs
// Create a blob client.
CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

// Get a reference to a container named "my-new-container."
CloudBlobContainer container = blobClient.GetContainerReference("my-new-container");

// If "mycontainer" doesn't exist, create it.
await container.CreateIfNotExistsAsync();
```

To make the files within the container available to everyone, set the container to be public:

```cs
await container.SetPermissionsAsync(new BlobContainerPermissions
{
    PublicAccess = BlobContainerPublicAccessType.Blob
});
```

## Upload a blob into a container

To upload a blob file into a container, get a container reference and use it to get a blob reference. Then upload any stream of data to that reference by calling the `UploadFromStreamAsync` method. This operation creates the blob if it's not already there, and overwrites an existing blob. 

```cs
// Get a reference to a blob named "myblob".
CloudBlockBlob blockBlob = container.GetBlockBlobReference("myblob");

// Create or overwrite the "myblob" blob with the contents of a local file
// named "myfile".
using (var fileStream = System.IO.File.OpenRead(@"path\myfile"))
{
    await blockBlob.UploadFromStreamAsync(fileStream);
}
```

## List the blobs in a container

To list the blobs in a container, first get a container reference, then call its `ListBlobsSegmentedAsync` method to retrieve the blobs and/or directories within it. To access the rich set of properties and methods for a returned `IListBlobItem`, cast it to a `CloudBlockBlob`, `CloudPageBlob`, or `CloudBlobDirectory` object. If you don't know the blob type, use a type check to determine which to cast it to.

```cs
BlobContinuationToken token = null;
do
{
    BlobResultSegment resultSegment = await container.ListBlobsSegmentedAsync(token);
    token = resultSegment.ContinuationToken;

    foreach (IListBlobItem item in resultSegment.Results)
    {
        if (item.GetType() == typeof(CloudBlockBlob))
        {
            CloudBlockBlob blob = (CloudBlockBlob)item;
            Console.WriteLine("Block blob of length {0}: {1}", blob.Properties.Length, blob.Uri);
        }

        else if (item.GetType() == typeof(CloudPageBlob))
        {
            CloudPageBlob pageBlob = (CloudPageBlob)item;

            Console.WriteLine("Page blob of length {0}: {1}", pageBlob.Properties.Length, pageBlob.Uri);
        }

        else if (item.GetType() == typeof(CloudBlobDirectory))
        {
            CloudBlobDirectory directory = (CloudBlobDirectory)item;

            Console.WriteLine("Directory: {0}", directory.Uri);
        }
    }
} while (token != null);
```

See [Quickstart: Upload, download, and list blobs using .NET](../storage/blobs/storage-quickstart-blobs-dotnet.md#list-the-blobs-in-a-container) for other ways to list the contents of a blob container.

## Download a blob

To download a blob, first get a reference to the blob, then call the `DownloadToStreamAsync` method. The following example uses the `DownloadToStreamAsync` method to transfer the blob contents to a stream object that you can then save as a local file.

```cs
// Get a reference to a blob named "photo1.jpg".
CloudBlockBlob blockBlob = container.GetBlockBlobReference("photo1.jpg");

// Save the blob contents to a file named "myfile".
using (var fileStream = System.IO.File.OpenWrite(@"path\myfile"))
{
    await blockBlob.DownloadToStreamAsync(fileStream);
}
```

See [Quickstart: Upload, download, and list blobs using .NET](../storage/blobs/storage-quickstart-blobs-dotnet.md#download-blobs) for other ways to save blobs as files.

## Delete a blob

To delete a blob, first get a reference to the blob, then call the `DeleteAsync` method:

```cs
// Get a reference to a blob named "myblob.txt".
CloudBlockBlob blockBlob = container.GetBlockBlobReference("myblob.txt");

// Delete the blob.
await blockBlob.DeleteAsync();
```

## Next steps

[!INCLUDE [vs-storage-dotnet-blobs-next-steps](../../includes/vs-storage-dotnet-blobs-next-steps.md)]
