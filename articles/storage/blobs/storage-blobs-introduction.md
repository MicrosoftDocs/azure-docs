---
title: Introduction to Blob storage - Object storage in Azure | Microsoft Docs
description: Azure Blob storage is designed to store massive amounts of unstructured object data, such as text or binary data. Your applications can access objects in Blob storage from PowerShell or the Azure CLI, from code via Azure Storage client libraries, or over REST.  
services: storage
author: tamram
manager: jeconnoc

ms.service: storage
ms.topic: overview
ms.date: 03/27/2018
ms.author: tamram

---
# Introduction to Blob storage

Azure Blob storage is Microsoft's cloud storage solution for data objects. Blob storage can store massive amounts of unstructured object data, such as text or binary data. Data in Blob storage can be accessed from anywhere in the world via HTTP or HTTPS. You can use Blob storage to expose data publicly to the world, or to store application data privately.

Common uses of Blob storage include:

* Serving images or documents directly to a browser
* Storing files for distributed access
* Streaming video and audio
* Storing for backup and restore, disaster recovery, and archiving
* Storing data for analysis by an on-premises or Azure-hosted service
* Storing VHDs for use with Azure Virtual Machines

## Blob service concepts

The Blob service contains the following components:

![Blob architecture](./media/storage-blobs-introduction/blob1.png)

* **Storage Account:** All access to Azure Storage is done through a storage account. This storage account can be 
a **General-purpose storage account (v1 or v2)** or **Blob storage accounts**. See [About Azure storage accounts](../common/storage-create-storage-account.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) for more information.

* **Container:** A container provides a grouping of a set of blobs. All blobs must be in a container. An account can contain an unlimited number of containers. A container can store an unlimited number of blobs. Note that the container name must be lowercase.

* **Blob:** A file of any type and size. Azure Storage offers three types of blobs: block blobs, [page blobs](storage-blob-pageblob-overview.md), and append blobs.
  
    *Block blobs* are ideal for storing text or binary files, such as documents and media files. *Append blobs* are similar to block blobs in that they are made up of blocks, but they are optimized for append operations, so they are useful for logging scenarios. A single block blob can contain up to 50,000 blocks of up to 100 MB each, for a total size of slightly more than 4.75 TB (100 MB X 50,000). A single append blob can contain up to 50,000 blocks of up to 4 MB each, for a total size of slightly more than 195 GB (4 MB X 50,000).
  
    *Page blobs* can be up to 8 TB in size, and are more efficient for frequent read/write operations. Azure Virtual Machines use page blobs as OS and data disks.
  
    For details about naming containers and blobs, see [Naming and Referencing Containers, Blobs, and Metadata](/rest/api/storageservices/Naming-and-Referencing-Containers--Blobs--and-Metadata).

## Next steps

* [Create a storage account](../common/storage-create-storage-account.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)
* [Getting started with Blob storage using .NET](storage-dotnet-how-to-use-blobs.md)
* [Azure Storage samples using .NET](../common/storage-samples-dotnet.md)
* [Azure Storage samples using Java](../common/storage-samples-java.md)
