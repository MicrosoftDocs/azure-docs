---
title: Explore the .NET object model for Azure Blob Storage
titleSuffix: Azure Storage
description: Take a tour of the key types that you'll use to interact with Azure Blob Storage in your .NET application. 
services: storage
author: normesta

ms.service: storage
ms.topic: how-to
ms.date: 03/02/2022
ms.author: normesta
ms.subservice: blobs
ms.custom: template-how-to
---

# Explore the .NET object model for Azure Blob Storage

This article gives you a tour of the Azure Blob Storage client library v12 for .NET. Use this guide to become familiar with the basic building blocks of the client object model. 

[Get started guide](storage-blob-dotnet-get-started.md) | [Package (NuGet)](https://www.nuget.org/packages/Azure.Storage.Blobs) | [Samples](../common/storage-samples-dotnet.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json#blob-samples) | [API reference](/dotnet/api/azure.storage.blobs) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs) | [Give Feedback](https://github.com/Azure/azure-sdk-for-net/issues)

## The basic building blocks

Blob storage offers three types of resources:

- The storage account
- A container in the storage account
- A blob in the container

The following diagram shows the relationship between these resources.

![Diagram of Blob storage architecture](./media/storage-blobs-introduction/blob1.png)

Each resource has .NET class. These are the primary classes: 

- [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient): The `BlobServiceClient` class allows you to manipulate Azure Storage resources and blob containers.
- [BlobContainerClient](/dotnet/api/azure.storage.blobs.blobcontainerclient): The `BlobContainerClient` class allows you to manipulate Azure Storage containers and their blobs.
- [BlobClient](/dotnet/api/azure.storage.blobs.blobclient): The `BlobClient` class allows you to manipulate Azure Storage blobs.

To interact with a resource, create an instance of the appropriate class. There also some more specialized classes that are described later in this article. 

## Service client

Create a [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) to interact with resources in the service instance. Create a [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) by using one of it's constructors. Use one of these credentials to authorize access to the Blob Storage service:

- Azure Active Directory (Azure AD) token credential
- SAS token 
- Account key credential
- Connection string

This example uses Azure Active Directory (Azure AD) token credential by creating a [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) instance, and then uses that object to create a [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient).


```csharp
public static void GetBlobServiceClient(ref BlobServiceClient blobServiceClient, string accountName)
{
    TokenCredential credential = new DefaultAzureCredential();

    string blobUri = "https://" + accountName + ".blob.core.windows.net";

        blobServiceClient = new BlobServiceClient(new Uri(blobUri), credential);          
}
```

For more examples of creating a service object instance, see [Get started with Azure Blob Storage and .NET](storage-blob-dotnet-get-started.md).

## Container client

Create a [BlobContainerClient](/dotnet/api/azure.storage.blobs.blobcontainerclient) to interact with a container. These articles contain examples:

- [Create a container](storage-blob-container-create.md)
- [Delete and restore a container](storage-blob-container-delete.md)
- [Manage container properties and metadata](storage-blob-container-properties-metadata.md)
- [List blobs in a container](storage-blobs-list)

To create a [BlobContainerClient](/dotnet/api/azure.storage.blobs.blobcontainerclient) to operate on an existing container, call the [GetBlobContainerClient](/dotnet/api/azure.storage.blobs.blobserviceclient.getblobcontainerclient) method of a [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) instance. 

To create a container, use the [CreateBlobContainer](/dotnet/api/azure.storage.blobs.blobserviceclient.createblobcontainer) or [CreateBlobContainerAsync](/dotnet/api/azure.storage.blobs.blobserviceclient.createblobcontainerasync) method of a [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) instance.  The following examples shows this approach:

```csharp
private static async Task<BlobContainerClient> CreateSampleContainerAsync(BlobServiceClient blobServiceClient)
{
    string containerName = "container-" + Guid.NewGuid();

    BlobContainerClient container = await blobServiceClient.CreateBlobContainerAsync(containerName);

    if (await container.ExistsAsync())
    {
        Console.WriteLine("Created container {0}", container.Name);
        return container;
    }

    return null;
}
```

You can also create a container by using the one of the constructors of the [BlobContainerClient](/dotnet/api/azure.storage.blobs.blobcontainerclient) class. Use one of these credentials to authorize access to the Blob Storage service:

- Azure Active Directory (Azure AD) token credential
- SAS token 
- Account key credential
- Connection string

## Blob client

Create a [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) to interact with a blob. These articles contain examples:

- [Upload a blob](storage-blob-upload.md)
- [Download a blob](storage-blob-download.md)
- [Copy a blob](storage-blob-copy.md)
- [Delete and restore a blob](storage-blob-delete.md)
- [Find and use tags](storage-blob-tags.md)
- [Manage blob properties and metadata](storage-blob-properties-metadata.md)

You can create a [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) by calling the [GetBlobClient](/dotnet/api/azure.storage.blobs.blobcontainerclient.getblobclient) method of a [BlobContainerClient](/dotnet/api/azure.storage.blobs.blobcontainerclient) instance. The following example shows this approach:

```csharp
public static async Task UploadFile
    (BlobContainerClient containerClient, string localFilePath)
{
    string fileName = Path.GetFileName(localFilePath);
    BlobClient blobClient = containerClient.GetBlobClient(fileName);

    await blobClient.UploadAsync(localFilePath, true);
}
```

You can also create a [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) by using one of it's constructors. Use one of these credentials to authorize access to the Blob Storage service:

- Azure Active Directory (Azure AD) token credential
- SAS token 
- Account key credential
- Connection string

### Specialized blob clients

There are three types of blobs: append blob, block blob, and page blob. See [this article](/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs) to learn more about each one. 

The [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) class contains methods and properties that apply to all of these blob types. For operations that are specific to a blob type, create one of the following specialized blob client classes.

- [AppendBlobClient](/dotnet/api/azure.storage.blobs.specialized.appendblobclient)
- [BlockBlobClient](/dotnet/api/azure.storage.blobs.specialized.blockblobclient)
- [PageBlobClient](/dotnet/api/azure.storage.blobs.specialized.pageblobclient)

For example, if you want to periodically append data to a log in Blob Storage, you'll need to create an append blob. To create an append blob, you'll need to create an instance of the [AppendBlobClient](/dotnet/api/azure.storage.blobs.specialized.appendblobclient) class. That class contains methods that you can use to periodically append data to the append blob. After you create the blob, you can still use the [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) class to perform other operations on that blob. However, you'll have to use an [AppendBlobClient](/dotnet/api/azure.storage.blobs.specialized.appendblobclient) to perform append operations because those operations are specific to append blobs.

You can create an instance of any specialized client classes by using the [GetPageBlobClient](/dotnet/api/azure.storage.blobs.specialized.specializedblobextensions.getpageblobclient) extension methods available off of a [BlobContainerClient](/dotnet/api/azure.storage.blobs.blobcontainerclient) instance. The following example creates an [AppendBlobClient](/dotnet/api/azure.storage.blobs.specialized.appendblobclient) by calling the [GetAppendBlobClient](/dotnet/api/azure.storage.blobs.specialized.specializedblobextensions.getappendblobclient) extension method of the [BlobContainerClient](/dotnet/api/azure.storage.blobs.blobcontainerclient) instance.

```csharp
public static async void CreateAppendBlob
    (BlobContainerClient containerClient, string logBlobName)
{
   AppendBlobClient appendBlobClient = containerClient.GetAppendBlobClient(logBlobName);
   appendBlobClient.CreateIfNotExists();
}

```

For a complete example, see [Append data to a blob in Azure Storage using the .NET client library](storage-blob-append.md)

You can also create an instance of any specialized client classes by using one of their constructors. 

## Client namespaces

The Azure Blob Storage client library v12 for .NET is organized into the following three namespaces:

- [Azure.Storage.Blobs](/dotnet/api/azure.storage.blobs): Contains the primary classes that you can use to operate on the service, containers, and blobs.
- [Azure.Storage.Blobs.Specialized](/dotnet/api/azure.storage.blobs.specialized): Contains classes that you can use to perform operations specific to a blob type (For example: append blobs).
- [Azure.Storage.Blobs.Models](/dotnet/api/azure.storage.blobs.models): All other utility classes, structures, and enumeration types used in method parameters or as objects returned by methods in the [Azure.Storage.Blobs](/dotnet/api/azure.storage.blobs) and [Azure.Storage.Blobs.Specialized](/dotnet/api/azure.storage.blobs.specialized) namespaces.

The following image shows each namespace and some of the classes available in each namespace.

> [!div class="mx-imgBorder"]
> ![.NET object namespaces](./media/storage-blob-dotnet-object-model/dotnet-object-namespaces.png)

## See also

[Get started with Azure Blob Storage and .NET](storage-blob-dotnet-get-started.md)