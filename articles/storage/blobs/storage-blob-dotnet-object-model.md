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

To operate on a blob, use the [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) class. You can use this object to do these types of tasks:

- Thing 1
- Thing 2
- Thing 3

Get this object by blah. Here's a quick example.

```csharp
Example goes here
```

### Specialized blob clients

If you want to stuff specific to a type of blob, you have to create a client for it. Here's a list:

- [AppendBlobClient](/dotnet/api/azure.storage.blobs.specialized.appendblobclient): Use this class to create an append blob, append data to it, blah and blah.
- [BlockBlobClient](/dotnet/api/azure.storage.blobs.specialized.blockblobclient): Use this class to blah, blah, blah, and blah.
- [PageBlobClient](/dotnet/api/azure.storage.blobs.specialized.pageblobclient): Use this class to blah, blah, blah, and blah.
- [BlobLeaseClient](/dotnet/api/azure.storage.blobs.specialized.blobleaseclient): Use this class to blah.
- [BlobBatchClient](/dotnet/api/azure.storage.blobs.specialized.blobbatchclient): Use this class to blah.

You can get each of these objects off of the container. Here's an example.

```csharp
Example goes here
```

### Blob client options

Something here about the options objects for adding custom options such as retry, encryption etc.

## Client namespaces

Take folks through the different namespaces and what sorts of objects they contain. For example, the models, specialized namespaces.

## Exception handling

Something here about the exception handling model along with an example.

## See also

[Get started with Azure Blob Storage and .NET](storage-blob-dotnet-get-started.md)