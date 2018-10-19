---
title: "include file"
description: "include file"
services: storage
author: tamram
ms.service: storage
ms.topic: "include"
ms.date: 10/17/2018
ms.author: tamram
ms.custom: "include file"
---

Azure Blob storage is Microsoft's object storage solution for the cloud. Blob storage is optimized for storing massive amounts of unstructured data, such as text or binary data.

Blob storage is ideal for:

* Serving images or documents directly to a browser.
* Storing files for distributed access.
* Streaming video and audio.
* Writing to log files.
* Storing data for backup and restore, disaster recovery, and archiving.
* Storing data for analysis by an on-premises or Azure-hosted service.

Via HTTP or HTTPS from anywhere in the world, users or client applications can access blobs via URLs, the [Azure Storage REST API](https://docs.microsoft.com/rest/api/storageservices/blob-service-rest-api), [Azure PowerShell](https://docs.microsoft.com/powershell/module/azure.storage), [Azure CLI](https://docs.microsoft.com/cli/azure/storage), or an Azure Storage client library. The storage client libraries are available for multiple languages, including [.NET](https://docs.microsoft.com/dotnet/api/overview/azure/storage/client), [Java](https://docs.microsoft.com/java/api/overview/azure/storage/client), [Node.js](http://azure.github.io/azure-storage-node), [Python](https://docs.microsoft.com/python/azure/), [PHP](http://azure.github.io/azure-storage-php/), and [Ruby](http://azure.github.io/azure-storage-ruby).

## Blob service concepts

Blob storage exposes three resources: your storage account, the containers in the account, and the blobs in a container. The following diagram shows the relationship between these resources.

![Diagram of Blob (object) storage architecture](./media/storage-blob-concepts-include/blob1.png)

### Storage account

All access to data objects in Azure Storage happens through a storage account. For more information, see [Azure storage account overview](../articles/storage/common/storage-account-overview.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).

### Container

A container organizes a set of blobs, similar to a folder in a file system. All blobs reside within a container. A storage account can include an unlimited number of containers, and a container can store an unlimited number of blobs. 

  > [!NOTE]
  > The container name must be lowercase.

### Blob
 
Azure Storage offers three types of blobs&mdash;block blobs, append blobs, and [page blobs](../articles/storage/blobs/storage-blob-pageblob-overview.md) (used for VHD files).

* Block blobs store text and binary data, up to about 4.7 TB. Block blobs are made up of blocks of data that can be managed individually.
* Append blobs are made up of blocks like block blobs, but are optimized for append operations. Append blobs are ideal for scenarios such as logging data from virtual machines.
* Page blobs store random access files up to 8 TB in size. Page blobs store the VHD files that back VMs.

All blobs reside within a container. A container is similar to a folder in a file system. You can further organize blobs into virtual directories and navigate them as you would a file system. 

There may be times where large datasets and network constraints make uploading or downloading data to Blob storage over the wire unrealistic. If you need, you can ship a set of hard drives to Microsoft to import or export data directly from the data center. For more information, see [Use the Microsoft Azure Import/Export service to transfer data to Blob storage](../articles/storage/common/storage-import-export-service.md).
  
For details about naming containers and blobs, see [Naming and referencing containers, blobs, and metadata](/rest/api/storageservices/Naming-and-Referencing-Containers--Blobs--and-Metadata).
