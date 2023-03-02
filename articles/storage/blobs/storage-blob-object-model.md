---
title: Understand the Blob Storage object model
titleSuffix: Azure Storage
description: Understand the Blob Storage object model and how to work with data resources using the Azure SDK.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: storage
ms.topic: how-to
ms.date: 03/01/2023
ms.subservice: blobs
ms.custom: devguide-csharp, devguide-java, devguide-javascript, devguide-python
---

# Understand the Blob Storage object model

As you build applications to work with data resources in Azure Blob Storage, your code primarily interacts with three resource types: storage accounts, containers, and blobs. This article explains these resource types and shows how they relate to one another. It also shows how application code uses the Azure Blob Storage client libraries to interact with these various resources.

## Blob Storage resource types

The Azure Blob Storage client libraries allow you to interact with three types of resources in the storage service:

- Storage accounts
- Blob containers
- Blobs

The following diagram shows the relationship between these resources:

![Diagram showing the relationship between a storage account, containers, and blobs](./media/storage-blobs-introduction/blob1.png)

### Storage accounts

A storage account provides a unique namespace in Azure for your data. Every object that you store in Azure Storage has an address that includes your unique account name. The combination of the account name and the Blob Storage endpoint forms the base address for the objects in your storage account.

For example, if your storage account is named *sampleaccount*, then the default endpoint for Blob Storage is:

`https://sampleaccount.blob.core.windows.net`

To learn more about types of storage accounts, see [Azure storage account overview](../common/storage-account-overview.md?toc=/azure/storage/blobs/toc.json).

### Containers

A container organizes a set of blobs, similar to a directory in a file system. A storage account can include an unlimited number of containers, and a container can store an unlimited number of blobs.

The URI for a container is similar to:

`https://sampleaccount.blob.core.windows.net/sample-container`

For more information about naming containers, see [Naming and Referencing Containers, Blobs, and Metadata](/rest/api/storageservices/Naming-and-Referencing-Containers--Blobs--and-Metadata).

### Blobs

Azure Storage supports three types of blobs:

- **Block blobs** store text and binary data. Block blobs are made up of blocks of data that can be managed individually. Block blobs can store up to about 190.7 TiB.
- **Append blobs** are made up of blocks like block blobs, but are optimized for append operations. Append blobs are ideal for scenarios such as logging data from virtual machines.
- **Page blobs** store random access files up to 8 TiB in size. Page blobs store virtual hard drive (VHD) files and serve as disks for Azure virtual machines. For more information about page blobs, see [Overview of Azure page blobs](storage-blob-pageblob-overview.md)

For more information about the different types of blobs, see [Understanding Block Blobs, Append Blobs, and Page Blobs](/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs).

The URI for a blob is similar to:

`https://sampleaccount.blob.core.windows.net/sample-container/sample-blob`

For more information about naming blobs, see [Naming and Referencing Containers, Blobs, and Metadata](/rest/api/storageservices/Naming-and-Referencing-Containers--Blobs--and-Metadata).

## Interact with data resources using the Azure SDK

The Azure REST API consists of service endpoints that support sets of HTTP operations, or methods. These operations allow access to create, retrieve, update, or delete data resources in the service. 

While you could work directly with the resources via REST API calls, the Azure SDKs contain libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar programming language paradigms. The SDKs are designed to simplify interactions between your application and Azure resources.

## [.NET](#tab/dotnet)

In the Azure Blob Storage client libraries, each resource type is represented by one or more associated classes. The following table lists the basic classes with a brief description:

| Class | Description |
| --- | --- |
| [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) | Represents the Blob Storage endpoint for your storage account. |
| [BlobContainerClient](/dotnet/api/azure.storage.blobs.blobcontainerclient) | Allows you to work with Azure Storage containers and their blobs. |
| [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) | Allows you to work with Azure Storage blobs. |
| [AppendBlobClient](/dotnet/api/azure.storage.blobs.specialized.appendblobclient) | Allows you to perform operations specific to append blobs such as appending log data. |
| [BlockBlobClient](/dotnet/api/azure.storage.blobs.specialized.blockblobclient)| Allows you to perform operations specific to block blobs such as staging and then committing blocks of data. |

The following packages contain the classes used to work with Blob Storage data resources:

- [Azure.Storage.Blobs](/dotnet/api/azure.storage.blobs): Contains the primary classes (_client objects_) that you can use to operate on the service, containers, and blobs.
- [Azure.Storage.Blobs.Specialized](/dotnet/api/azure.storage.blobs.specialized): Contains classes that you can use to perform operations specific to a blob type, such as block blobs.
- [Azure.Storage.Blobs.Models](/dotnet/api/azure.storage.blobs.models): All other utility classes, structures, and enumeration types.

## [Java](#tab/java)

In the Azure Blob Storage client libraries, each resource type is represented by one or more associated classes. The following table lists the basic classes with a brief description:

| Class | Description |
| --- | --- |
| [BlobServiceClient](/java/api/com.azure.storage.blob.blobserviceclient) | Represents the Blob Storage endpoint for your storage account. |
| [BlobContainerClient](/java/api/com.azure.storage.blob.blobcontainerclient) | Allows you to work with Azure Storage containers and their blobs. |
| [BlobClient](/java/api/com.azure.storage.blob.blobclient) | Allows you to work with Azure Storage blobs. |
| [AppendBlobClient](/java/api/com.azure.storage.blob.specialized.appendblobclient) | Allows you to perform operations specific to append blobs such as appending log data. |
| [BlockBlobClient](/java/api/com.azure.storage.blob.specialized.blockblobclient)| Allows you to perform operations specific to block blobs such as staging and then committing blocks of data. |

The following packages contain the classes used to work with Blob Storage data resources:

- [com.azure.storage.blob](/java/api/com.azure.storage.blob): Contains the primary classes (_client objects_) that you can use to operate on the service, containers, and blobs.
- [com.azure.storage.blob.specialized](/java/api/com.azure.storage.blob.specialized): Contains classes that you can use to perform operations specific to a blob type, such as block blobs.
- [com.azure.storage.blob.models](/java/api/com.azure.storage.blob.models): All other utility classes, structures, and enumeration types.

## [JavaScript](#tab/javascript)

In the Azure Blob Storage client libraries, each resource type is represented by one or more associated classes. The following table lists the basic classes with a brief description:

| Class | Description |
| --- | --- |
| [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient) | Represents the Blob Storage endpoint for your storage account. |
| [ContainerClient](/javascript/api/@azure/storage-blob/containerclient) | Allows you to work with Azure Storage containers and their blobs. |
| [BlobClient](/javascript/api/@azure/storage-blob/blobclient) | Allows you to work with Azure Storage blobs. |

The following package contains the classes used to work with Blob Storage data resources:

- [@azure/storage-blob](/javascript/api/@azure/storage-blob): Contains all classes that you can use to operate on the service, containers, and blobs.

## [Python](#tab/python)

In the Azure Blob Storage client libraries, each resource type is represented by one or more associated classes. The following table lists the basic classes with a brief description:

| Class | Description |
| --- | --- |
| [BlobServiceClient](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient) | Represents the Blob Storage endpoint for your storage account. |
| [ContainerClient](/python/api/azure-storage-blob/azure.storage.blob.containerclient) | Allows you to work with Azure Storage containers and their blobs. |
| [BlobClient](/python/api/azure-storage-blob/azure.storage.blob.blobclient) | Allows you to work with Azure Storage blobs. |

The following package contains the classes used to work with Blob Storage data resources:

- [azure.storage.blob](/python/api/azure-storage-blob/azure.storage.blob): Contains all classes that you can use to operate on the service, containers, and blobs.

---

## Next steps

Working with Azure resources using the SDK begins with creating a client instance. To learn more about client object creation and management, see [Create and manage client objects that interact with data resources](storage-blob-client-management.md).