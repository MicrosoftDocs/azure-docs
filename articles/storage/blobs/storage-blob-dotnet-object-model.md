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

Put a cool introduction here.

## The basic building blocks

Blob storage offers three types of resources:

- The storage account

- A container in the storage account

- A blob in the container

The following diagram shows the relationship between these resources.

![Diagram of Blob storage architecture](./media/storage-blobs-introduction/blob1.png)

To interact with a resource, you'll instantiate a client object for that resource. 

## Service client object

Create a [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) to interact with your Blob Storage service instance. Use this object to do things such as:

- Create and delete containers

- Get existing containers

- Create a shared access signature (SAS)

- Get and set properties of the service instance

Create a [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) by using one of it's constructors. Pass in Azure Active Directory (Azure AD) token, a SAS token, an account key credential, or connection string.

This example creates a [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) instance, and then uses that object to create a [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient).


```csharp
public static void GetBlobServiceClient(ref BlobServiceClient blobServiceClient, string accountName)
{
    TokenCredential credential = new DefaultAzureCredential();

    string blobUri = "https://" + accountName + ".blob.core.windows.net";

        blobServiceClient = new BlobServiceClient(new Uri(blobUri), credential);          
}
```

For more examples of creating a service object instance, see [Get started with Azure Blob Storage and .NET](storage-blob-dotnet-get-started.md).

## Container client object

Create a [BlobContainerClient](/dotnet/api/azure.storage.blobs.blobcontainerclient) to interact with a container. Use this object to do things such as:

- Create a blob client object to upload or download blobs

- List the blobs in a container

- Set and get container properties and metadata

Create a [BlobContainerClient](/dotnet/api/azure.storage.blobs.blobcontainerclient) by using one of it's constructors or by using any of the following methods of the [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) instance:

- [CreateBlobContainer](/dotnet/api/azure.storage.blobs.blobserviceclient.createblobcontainer)

- [CreateBlobContainerAsync](/dotnet/api/azure.storage.blobs.blobserviceclient.createblobcontainerasync)

- [GetBlobContainerClient](/dotnet/api/azure.storage.blobs.blobserviceclient.getblobcontainerclient)

The following example creates a container by using the [CreateBlobContainerAsync](/dotnet/api/azure.storage.blobs.blobserviceclient.createblobcontainerasync) of a [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) instance. 

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

For more information, see [Create a container](storage-blob-container-create.md).

## Blob client object

Create a [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) to interact with a blob. Use this object to do things such as:

- Upload and download a blob
- Mark a blob for deletion or restore a deleted blob
- Set and get the properties, metadata and tags associated with a blob

Create a [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) by using one of it's constructors or by calling the [GetBlobClient](/dotnet/api/azure.storage.blobs.blobcontainerclient.getblobclient) method of a [BlobContainerClient](/dotnet/api/azure.storage.blobs.blobcontainerclient) instance.

The following example creates a [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) by calling the [GetBlobClient](/dotnet/api/azure.storage.blobs.blobcontainerclient.getblobclient) method of a [BlobContainerClient](/dotnet/api/azure.storage.blobs.blobcontainerclient) instance.

```csharp
public static async Task UploadFile
    (BlobContainerClient containerClient, string localFilePath)
{
    string fileName = Path.GetFileName(localFilePath);
    BlobClient blobClient = containerClient.GetBlobClient(fileName);

    await blobClient.UploadAsync(localFilePath, true);
}
```

### Specialized blob clients

A blob can be an append blob, a block blob, or a page blob. To learn more, see [Understanding block blobs, append blobs, and page blobs](/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs). 

The [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) provides methods and properties that apply to all of these blob types. To perform operations specific to a blob type, create one of these specialized blob client classes.

- [AppendBlobClient](/dotnet/api/azure.storage.blobs.specialized.appendblobclient)

- [BlockBlobClient](/dotnet/api/azure.storage.blobs.specialized.blockblobclient)

- [PageBlobClient](/dotnet/api/azure.storage.blobs.specialized.pageblobclient)

For example, if you want to periodically append data to a log in Blob Storage, you would need to create an [AppendBlobClient](/dotnet/api/azure.storage.blobs.specialized.appendblobclient) because you won't find the methods that you need in the [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) class.

You can create an instance of any specialized client classes by using one of their constructors or by calling the [GetAppendBlobClient](/dotnet/api/azure.storage.blobs.specialized.specializedblobextensions.getappendblobclient), [GetBlockBlobClient](/dotnet/api/azure.storage.blobs.specialized.specializedblobextensions.getblockblobclient), or [GetPageBlobClient](/dotnet/api/azure.storage.blobs.specialized.specializedblobextensions.getpageblobclient) extension methods available off of a [BlobContainerClient](/dotnet/api/azure.storage.blobs.blobcontainerclient) instance. 

The following example creates an [AppendBlobClient](/dotnet/api/azure.storage.blobs.specialized.appendblobclient) by calling the [GetAppendBlobClient](/dotnet/api/azure.storage.blobs.specialized.specializedblobextensions.getappendblobclient) extension method of the [BlobContainerClient](/dotnet/api/azure.storage.blobs.blobcontainerclient) instance.

```csharp
public static async void CreateAppendBlob
    (BlobContainerClient containerClient, string logBlobName)
{
   AppendBlobClient appendBlobClient = containerClient.GetAppendBlobClient(logBlobName);
   appendBlobClient.CreateIfNotExists();
}

```

### Blob client options

Something here about the options objects for adding custom options such as retry, encryption etc.

## Client namespaces

Take folks through the different namespaces and what sorts of objects they contain. For example, the models, specialized namespaces.

## Exception handling

Something here about the exception handling model along with an example.

## See also

[Get started with Azure Blob Storage and .NET](storage-blob-dotnet-get-started.md)