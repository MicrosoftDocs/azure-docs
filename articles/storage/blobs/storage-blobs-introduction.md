---
title: Introduction to Blob (object) Storage
titleSuffix: Azure Storage
description: Use Azure Blob Storage to store massive amounts of unstructured object data, such as text or binary data. Azure Blob Storage is highly scalable and available.
services: storage
author: tamram

ms.service: storage
ms.topic: overview
ms.date: 03/28/2023
ms.author: tamram
ms.subservice: blobs
ms.custom: engagement-fy23
---

# Introduction to Azure Blob Storage

[!INCLUDE [storage-blob-concepts-include](../../../includes/storage-blob-concepts-include.md)]

## Blob Storage resources

Blob Storage offers three types of resources:

- The **storage account**
- A **container** in the storage account
- A **blob** in a container

The following diagram shows the relationship between these resources.

![Diagram showing the relationship between a storage account, containers, and blobs](./media/storage-blobs-introduction/blob1.png)

### Storage accounts

A storage account provides a unique namespace in Azure for your data. Every object that you store in Azure Storage has an address that includes your unique account name. The combination of the account name and the Blob Storage endpoint forms the base address for the objects in your storage account.

For example, if your storage account is named *mystorageaccount*, then the default endpoint for Blob Storage is:

```
http://mystorageaccount.blob.core.windows.net
```

The following table describes the different types of storage accounts that are supported for Blob Storage:

| Type of storage account | Performance tier | Usage |
|--|--|--|
| General-purpose v2 | Standard | Standard storage account type for blobs, file shares, queues, and tables. Recommended for most scenarios using Blob Storage or one of the other Azure Storage services. |
| Block blob | Premium | Premium storage account type for block blobs and append blobs. Recommended for scenarios with high transaction rates or that use smaller objects or require consistently low storage latency. [Learn more about workloads for premium block blob accounts...](../blobs/storage-blob-block-blob-premium.md) |
| Page blob | Premium | Premium storage account type for page blobs only. [Learn more about workloads for premium page blob accounts...](../blobs/storage-blob-pageblob-overview.md) |

To learn more about types of storage accounts, see [Azure storage account overview](../common/storage-account-overview.md?toc=/azure/storage/blobs/toc.json). For information about legacy storage account types, see [Legacy storage account types](../common/storage-account-overview.md#legacy-storage-account-types).

To learn how to create a storage account, see [Create a storage account](../common/storage-account-create.md).

### Containers

A container organizes a set of blobs, similar to a directory in a file system. A storage account can include an unlimited number of containers, and a container can store an unlimited number of blobs.

A container name must be a valid DNS name, as it forms part of the unique URI (Uniform resource identifier) used to address the container or its blobs. Follow these rules when naming a container:

- Container names can be between 3 and 63 characters long.
- Container names must start with a letter or number, and can contain only lowercase letters, numbers, and the dash (-) character.
- Two or more consecutive dash characters aren't permitted in container names.

The URI for a container is similar to:

`https://myaccount.blob.core.windows.net/mycontainer`

For more information about naming containers, see [Naming and Referencing Containers, Blobs, and Metadata](/rest/api/storageservices/Naming-and-Referencing-Containers--Blobs--and-Metadata).

### Blobs

Azure Storage supports three types of blobs:

- **Block blobs** store text and binary data. Block blobs are made up of blocks of data that can be managed individually. Block blobs can store up to about 190.7 TiB.
- **Append blobs** are made up of blocks like block blobs, but are optimized for append operations. Append blobs are ideal for scenarios such as logging data from virtual machines.
- **Page blobs** store random access files up to 8 TiB in size. Page blobs store virtual hard drive (VHD) files and serve as disks for Azure virtual machines. For more information about page blobs, see [Overview of Azure page blobs](storage-blob-pageblob-overview.md)

For more information about the different types of blobs, see [Understanding Block Blobs, Append Blobs, and Page Blobs](/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs).

The URI for a blob is similar to:

`https://myaccount.blob.core.windows.net/mycontainer/myblob`

or

`https://myaccount.blob.core.windows.net/mycontainer/myvirtualdirectory/myblob`

Follow these rules when naming a blob:  
  
- A blob name can contain any combination of characters.  
- A blob name must be at least one character long and cannot be more than 1,024 characters long, for blobs in Azure Storage. 
- Blob names are case-sensitive.  
- Reserved URL characters must be properly escaped.  
- The number of path segments comprising the blob name cannot exceed 254. A path segment is the string between consecutive delimiter characters (*e.g.*, the forward slash '/') that corresponds to the name of a virtual directory.  
  
> [!NOTE]
> Avoid blob names that end with a dot (.), a forward slash (/), or a sequence or combination of the two. No path segments should end with a dot (.).

For more information about naming blobs, see [Naming and Referencing Containers, Blobs, and Metadata](/rest/api/storageservices/Naming-and-Referencing-Containers--Blobs--and-Metadata).

## Move data to Blob Storage

A number of solutions exist for migrating existing data to Blob Storage:

- **AzCopy** is an easy-to-use command-line tool for Windows and Linux that copies data to and from Blob Storage, across containers, or across storage accounts. For more information about AzCopy, see [Transfer data with the AzCopy v10](../common/storage-use-azcopy-v10.md).
- The **Azure Storage Data Movement library** is a .NET library for moving data between Azure Storage services. The AzCopy utility is built with the Data Movement library. For more information, see the [reference documentation](/dotnet/api/microsoft.azure.storage.datamovement) for the Data Movement library.
- **Azure Data Factory** supports copying data to and from Blob Storage by using the account key, a shared access signature, a service principal, or managed identities for Azure resources. For more information, see [Copy data to or from Azure Blob Storage by using Azure Data Factory](../../data-factory/connector-azure-blob-storage.md?toc=/azure/storage/blobs/toc.json).
- **Blobfuse** is a virtual file system driver for Azure Blob Storage. You can use BlobFuse to access your existing block blob data in your Storage account through the Linux file system. For more information, see [What is BlobFuse? - BlobFuse2 (preview)](blobfuse2-what-is.md).
- **Azure Data Box** service is available to transfer on-premises data to Blob Storage when large datasets or network constraints make uploading data over the wire unrealistic. Depending on your data size, you can request [Azure Data Box Disk](../../databox/data-box-disk-overview.md), [Azure Data Box](../../databox/data-box-overview.md), or [Azure Data Box Heavy](../../databox/data-box-heavy-overview.md) devices from Microsoft. You can then copy your data to those devices and ship them back to Microsoft to be uploaded into Blob Storage.
- The **Azure Import/Export service** provides a way to import or export large amounts of data to and from your storage account using hard drives that you provide. For more information, see [What is Azure Import/Export service?](../../import-export/storage-import-export-service.md).

## Next steps

- [Create a storage account](../common/storage-account-create.md?toc=/azure/storage/blobs/toc.json)
- [Scalability and performance targets for Blob Storage](scalability-targets.md)
