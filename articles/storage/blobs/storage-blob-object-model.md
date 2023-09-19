---
title: Understand how apps interact with Blob Storage data resources
titleSuffix: Azure Storage
description: Understand the Blob Storage object model and how to work with data resources using the Azure SDKs.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 03/07/2023
ms.custom: devguide-csharp, devguide-java, devguide-javascript, devguide-python
---

# Understand how apps interact with Blob Storage data resources

As you build applications to work with data resources in Azure Blob Storage, your code primarily interacts with three resource types: storage accounts, containers, and blobs. This article explains these resource types and shows how they relate to one another. It also shows how application code uses the Azure Blob Storage client libraries to interact with these various resources.

## Blob Storage resource types

The Azure Blob Storage client libraries allow you to interact with three types of resources in the storage service:

- [Storage accounts](#storage-accounts)
- [Blob containers](#containers)
- [Blobs](#blobs)

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
- **Page blobs** store random access files up to 8 TiB in size. For more information about page blobs, see [Overview of Azure page blobs](storage-blob-pageblob-overview.md)

For more information about the different types of blobs, see [Understanding Block Blobs, Append Blobs, and Page Blobs](/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs).

The URI for a blob is similar to:

`https://sampleaccount.blob.core.windows.net/sample-container/sample-blob`

For more information about naming blobs, see [Naming and Referencing Containers, Blobs, and Metadata](/rest/api/storageservices/Naming-and-Referencing-Containers--Blobs--and-Metadata).

## Work with data resources using the Azure SDK

The Azure SDKs contain libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar programming language paradigms. The SDKs are designed to simplify interactions between your application and Azure resources.

In the Azure Blob Storage client libraries, each resource type is represented by one or more associated classes. These classes provide operations to work with an Azure Storage resource.

## [.NET](#tab/dotnet)

The following table lists the basic classes, along with a brief description:

| Class | Description |
| --- | --- |
| [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) | Represents the storage account, and provides operations to retrieve and configure account properties, and to work with blob containers in the storage account. |
| [BlobContainerClient](/dotnet/api/azure.storage.blobs.blobcontainerclient) | Represents a specific blob container, and provides operations to work with the container and the blobs within. |
| [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) | Represents a specific blob, and provides general operations to work with the blob, including operations to upload, download, delete, and create snapshots. |
| [AppendBlobClient](/dotnet/api/azure.storage.blobs.specialized.appendblobclient) | Represents an append blob, and provides operations specific to append blobs, such as appending log data. |
| [BlockBlobClient](/dotnet/api/azure.storage.blobs.specialized.blockblobclient)| Represents a block blob, and provides operations specific to block blobs, such as staging and then committing blocks of data. |

The following packages contain the classes used to work with Blob Storage data resources:

- [Azure.Storage.Blobs](/dotnet/api/azure.storage.blobs): Contains the primary classes (_client objects_) that you can use to operate on the service, containers, and blobs.
- [Azure.Storage.Blobs.Specialized](/dotnet/api/azure.storage.blobs.specialized): Contains classes that you can use to perform operations specific to a blob type, such as block blobs.
- [Azure.Storage.Blobs.Models](/dotnet/api/azure.storage.blobs.models): All other utility classes, structures, and enumeration types.

## [Java](#tab/java)

The following table lists the basic classes, along with a brief description:

| Class | Description |
| --- | --- |
| [BlobServiceClient](/java/api/com.azure.storage.blob.blobserviceclient) | Represents the storage account, and provides operations to retrieve and configure account properties, and to work with blob containers in the storage account. |
| [BlobContainerClient](/java/api/com.azure.storage.blob.blobcontainerclient) | Represents a specific blob container, and provides operations to work with the container and the blobs within. |
| [BlobClient](/java/api/com.azure.storage.blob.blobclient) | Represents a specific blob, and provides general operations to work with the blob, including operations to upload, download, delete, and create snapshots. |
| [AppendBlobClient](/java/api/com.azure.storage.blob.specialized.appendblobclient) | Represents an append blob, and provides operations specific to append blobs, such as appending log data. |
| [BlockBlobClient](/java/api/com.azure.storage.blob.specialized.blockblobclient)| Represents a block blob, and provides operations specific to block blobs, such as staging and then committing blocks of data. |

The following packages contain the classes used to work with Blob Storage data resources:

- [com.azure.storage.blob](/java/api/com.azure.storage.blob): Contains the primary classes (_client objects_) that you can use to operate on the service, containers, and blobs.
- [com.azure.storage.blob.specialized](/java/api/com.azure.storage.blob.specialized): Contains classes that you can use to perform operations specific to a blob type, such as block blobs.
- [com.azure.storage.blob.models](/java/api/com.azure.storage.blob.models): All other utility classes, structures, and enumeration types.

## [JavaScript](#tab/javascript)

The following table lists the basic classes, along with a brief description:

| Class | Description |
| --- | --- |
| [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient) | Represents the storage account, and provides operations to retrieve and configure account properties, and to work with blob containers in the storage account. |
| [ContainerClient](/javascript/api/@azure/storage-blob/containerclient) | Represents a specific blob container, and provides operations to work with the container and the blobs within. |
| [BlobClient](/javascript/api/@azure/storage-blob/blobclient) | Represents a specific blob, and provides general operations to work with the blob, including operations to upload, download, delete, and create snapshots. |
| [AppendBlobClient](/javascript/api/@azure/storage-blob/appendblobclient) | Represents an append blob, and provides operations specific to append blobs, such as appending log data. |
| [BlockBlobClient](/javascript/api/@azure/storage-blob/blockblobclient) | Represents a block blob, and provides operations specific to block blobs, such as staging and then committing blocks of data. |

The following package contains the classes used to work with Blob Storage data resources:

- [@azure/storage-blob](/javascript/api/@azure/storage-blob): Contains all classes that you can use to operate on the service, containers, and blobs.

## [Python](#tab/python)

The following table lists the basic classes, along with a brief description:

| Class | Description |
| --- | --- |
| [BlobServiceClient](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient) | Represents the storage account, and provides operations to retrieve and configure account properties, and to work with blob containers in the storage account. |
| [ContainerClient](/python/api/azure-storage-blob/azure.storage.blob.containerclient) | Represents a specific blob container, and provides operations to work with the container and the blobs within. |
| [BlobClient](/python/api/azure-storage-blob/azure.storage.blob.blobclient) | Represents a specific blob, and provides operations to upload, download, delete, and create snapshots of a blob. `BlobClient` also provides specific operations for specialized blob types, such as append blobs and block blobs. |

The following package contains the classes used to work with Blob Storage data resources:

- [azure.storage.blob](/python/api/azure-storage-blob/azure.storage.blob): Contains all classes that you can use to operate on the service, containers, and blobs.

---

## Next steps

Working with Azure resources using the SDK begins with creating a client instance. To learn more about client object creation and management, see [Create and manage client objects that interact with data resources](storage-blob-client-management.md).