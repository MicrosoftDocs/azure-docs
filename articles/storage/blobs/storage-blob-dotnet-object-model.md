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

Each resource has .NET class. To interact with a resource, create an instance of the appropriate class. These are the primary classes: 

- [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient): The `BlobServiceClient` class allows you to manipulate Azure Storage resources and blob containers.

- [BlobContainerClient](/dotnet/api/azure.storage.blobs.blobcontainerclient): The `BlobContainerClient` class allows you to manipulate Azure Storage containers and their blobs.

- [BlobClient](/dotnet/api/azure.storage.blobs.blobclient): The `BlobClient` class allows you to manipulate Azure Storage blobs.

There also some more specialized classes that are described later in this article. 

## Service client object

Create a [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) to interact with Blob Storage service resources. 

These are some tasks you can accomplish with this object:

- Create and delete containers

- Get existing containers

- Create a shared access signature (SAS)

- Get and set properties of the service instance

Create a [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) by using one of it's constructors. Pass the constructor an Azure Active Directory (Azure AD) token, a SAS token, an account key credential, or connection string.

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

Create a [BlobContainerClient](/dotnet/api/azure.storage.blobs.blobcontainerclient) to interact with a container.

These are some tasks you can accomplish with this object:

- Create a container or get an existing container

- List the blobs in a container

- Set and get container properties and metadata

You can create or get a container by calling methods of a [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) instance. 

To get an existing container, call the [GetBlobContainerClient](/dotnet/api/azure.storage.blobs.blobserviceclient.getblobcontainerclient) method. 

To create a container, use the [CreateBlobContainer](/dotnet/api/azure.storage.blobs.blobserviceclient.createblobcontainer) or [CreateBlobContainerAsync](/dotnet/api/azure.storage.blobs.blobserviceclient.createblobcontainerasync) method. The following examples shows this approach:

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

You can also create a container by using the one of the constructors of the [BlobContainerClient](/dotnet/api/azure.storage.blobs.blobcontainerclient) class. Unless you've [enabled public access to your storage account](anonymous-read-access-configure.md#allow-or-disallow-public-read-access-for-a-storage-account) (typically not recommended), you'll need to pass the constructor an Azure Active Directory (Azure AD) token, a SAS token, an account key credential, or connection string.

For more information, see [Create a container](storage-blob-container-create.md).

## Blob client object

Create a [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) to interact with a blob. 

These are some tasks you can accomplish with this object:

- Upload and download a blob

- Mark a blob for deletion or restore a deleted blob

- Set and get the properties, metadata and tags associated with a blob

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

You can also create a [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) by using one of it's constructors. If you choose to use a constructor, pass the constructor an Azure Active Directory (Azure AD) token, a SAS token, an account key credential, or connection string. You'll also need to identify a container. You can do this by using parameters in the constructor.

### Specialized blob clients

There are three types of blobs: append blob, block blob, and page blob. See [this article](/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs) to learn more about them. 

The [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) contains methods and properties that apply to all of these blob types. However, some operations are specific to a blob type and you won't find what you need to perform those operations in the [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) class. 

To perform operations specific to a blob type, create one of these specialized blob client classes.

- [AppendBlobClient](/dotnet/api/azure.storage.blobs.specialized.appendblobclient)

- [BlockBlobClient](/dotnet/api/azure.storage.blobs.specialized.blockblobclient)

- [PageBlobClient](/dotnet/api/azure.storage.blobs.specialized.pageblobclient)

For example, if you want to periodically append data to a log in Blob Storage, you'll need to create an append blob. To create an append blob, you'll need to create an instance of the [AppendBlobClient](/dotnet/api/azure.storage.blobs.specialized.appendblobclient) class. That class contains methods that you can use to periodically append data to the append blob. After you create the blob, you can still use the [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) class to perform other operations on that blob.

You can create an instance of any specialized client classes by using the [GetPageBlobClient](/dotnet/api/azure.storage.blobs.specialized.specializedblobextensions.getpageblobclient) extension methods available off of a [BlobContainerClient](/dotnet/api/azure.storage.blobs.blobcontainerclient) instance. The following example creates an [AppendBlobClient](/dotnet/api/azure.storage.blobs.specialized.appendblobclient) by calling the [GetAppendBlobClient](/dotnet/api/azure.storage.blobs.specialized.specializedblobextensions.getappendblobclient) extension method of the [BlobContainerClient](/dotnet/api/azure.storage.blobs.blobcontainerclient) instance.

```csharp
public static async void CreateAppendBlob
    (BlobContainerClient containerClient, string logBlobName)
{
   AppendBlobClient appendBlobClient = containerClient.GetAppendBlobClient(logBlobName);
   appendBlobClient.CreateIfNotExists();
}

```

You can create an instance of any specialized client classes by using one of their constructors. 

### Blob client options

Something here about the options objects for adding custom options such as retry, encryption etc.

## Client namespaces

Take folks through the different namespaces and what sorts of objects they contain. For example, the models, specialized namespaces.

## Exception handling

Something here about the exception handling model along with an example.

## See also

[Get started with Azure Blob Storage and .NET](storage-blob-dotnet-get-started.md)