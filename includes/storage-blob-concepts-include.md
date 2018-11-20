---
title: "include file"
description: "include file"
services: storage
author: tamram
ms.service: storage
ms.topic: "include"
ms.date: 11/18/2018
ms.author: tamram
ms.custom: "include file"
---

Azure Blob storage is Microsoft's object storage solution for the cloud. Blob storage is optimized for storing massive amounts of unstructured data, such as text or binary data. 

Blob storage also supports Azure Data Lake Storage Gen2 for enterprise big data analytics. For more information about Azure Data Lake Storage Gen2, see [Introduction to Azure Data Lake Storage Gen2 ](https://docs.microsoft.com/azure/storage/data-lake-storage/introduction).

Blob storage is designed for:

* Serving images or documents directly to a browser.
* Storing files for distributed access.
* Streaming video and audio.
* Writing to log files.
* Storing data for backup and restore, disaster recovery, and archiving.
* Storing data for analysis by an on-premises or Azure-hosted service.

Users or client applications can access objects in Blob storage via HTTP/HTTPS, from anywhere in the world. Objects in Blob storage are available via URLs, the [Azure Storage REST API](https://docs.microsoft.com/rest/api/storageservices/blob-service-rest-api), [Azure PowerShell](https://docs.microsoft.com/powershell/module/azure.storage), [Azure CLI](https://docs.microsoft.com/cli/azure/storage), or an Azure Storage client library. The storage client libraries are available for various languages, including [.NET](https://docs.microsoft.com/dotnet/api/overview/azure/storage/client), [Java](https://docs.microsoft.com/java/api/overview/azure/storage/client), [Node.js](http://azure.github.io/azure-storage-node), [Python](https://docs.microsoft.com/python/azure/), [PHP](http://azure.github.io/azure-storage-php/), and [Ruby](http://azure.github.io/azure-storage-ruby).

## Blob service concepts

Blob storage exposes three types of resources:

- The storage account
- Containers in the storage account
- Blobs in a container. 

The following diagram shows the relationship between these resources.

![Diagram of Blob (object) storage architecture](./media/storage-blob-concepts-include/blob1.png)

### Storage account

All access to data objects in Azure Storage happens through a storage account. For more information, see [Azure storage account overview](../articles/storage/common/storage-account-overview.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).

### Container

A container organizes a set of blobs, similar to a folder in a file system. A storage account can include an unlimited number of containers, and a container can store an unlimited number of blobs. 

  > [!NOTE]
  > The container name must be lowercase. For more information about naming containers, see [Naming and Referencing Containers, Blobs, and Metadata](https://docs.microsoft.com/rest/api/storageservices/Naming-and-Referencing-Containers--Blobs--and-Metadata).

### Blob
 
Azure Storage offers three types of blobs:

* **Block blobs** store text and binary data, up to about 4.7 TB. Block blobs are made up of blocks of data that can be managed individually.
* **Append blobs** are made up of blocks like block blobs, but are optimized for append operations. Append blobs are ideal for scenarios such as logging data from virtual machines.
* **Page blobs** store random access files up to 8 TB in size. Page blobs store the virtual hard drive (VHD) files serve as disks for Azure virtual machines. Fore more information about page blobs, see (../articles/storage/blobs/storage-blob-pageblob-overview.md)

For more information about the different types of blobs, see [Understanding Block Blobs, Append Blobs, and Page Blobs](https://docs.microsoft.com/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs).

All blobs reside within a container. You can further organize blobs into virtual directories and navigate them as you would a file system. 

There may be times where large datasets and network constraints make uploading data to Blob storage over the wire unrealistic. You can use [Azure Data Box Disk](../articles/databox/data-box-disk-overview.md) to request solid-state disks (SSDs) from Microsoft. You can then copy your data to those disks and ship them back to Microsoft to be uploaded into Blob storage.

If you need to export large amounts of data from your storage account, see [Use the Microsoft Azure Import/Export service to transfer data to Blob storage](../articles/storage/common/storage-import-export-service.md).
  
