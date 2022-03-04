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

## Service client

Use the [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) class to interact with the Blob Storage service instance of your account. Use this class to do things like:

- Thing 1
- Thing 2
- Thing 3

You'll create one of these by blah. Here's a quick example

```csharp
Example goes here
```

For more examples of creating a service object instance, see [Get started with Azure Blob Storage and .NET](storage-blob-dotnet-get-started.md).

## Container client

To operate on a container, use the [BlobContainerClient](/dotnet/api/azure.storage.blobs.blobcontainerclient) class. Use this object to do things like:

- Thing 1
- Thing 2
- Thing 3

You can get this object by blah. Here's a quick example.

```csharp
Example goes here
```

## Blob client

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