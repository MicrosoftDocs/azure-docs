---
title: Map of AzCopy commands to REST operations (Azure Blob Storage)
description: Find the REST operations used by each AzCopy v10 command.
author: normesta
ms.service: azure-storage
ms.topic: reference
ms.date: 01/27/2025
ms.author: normesta
ms.subservice: storage-common-concepts
---

# Map of AzCopy v10 commands to Azure Blob Storage REST operations

When you run a command that operates on data in your storage account, AzCopy translates that command to a REST operation. This article maps AzCopy commands to Azure Blob Storage REST operations.  

## Command mapping

The following table shows the operations that are used by each AzCopy command. To determine the price of each operation, see [Map each REST operation to a price](../blobs/map-rest-apis-transaction-categories.md).

### Commands that target the Blob Service Endpoint

| Command | Scenario | Operations |
|---------|----------|-----------------------------------------|
| [azcopy bench](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_bench) | Upload   | [Put Block](/rest/api/storageservices/put-block-list) and [Put Block List](/rest/api/storageservices/put-block-list). Possibly [Put Blob](/rest/api/storageservices/put-blob) based on object size.|
| [azcopy bench](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_bench) | Download |[List Blobs](/rest/api/storageservices/list-blobs), [Get Blob Properties](/rest/api/storageservices/get-blob-properties), and [Get Blob](/rest/api/storageservices/get-blob) |
| [azcopy copy](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_copy) | Upload | [Put Block](/rest/api/storageservices/put-block-list), [Put Block List](/rest/api/storageservices/put-block-list), and [Get Blob Properties](/rest/api/storageservices/get-blob-properties). Possibly [Put Blob](/rest/api/storageservices/put-blob) based on object size. |
| [azcopy copy](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_copy) | Download | [List Blobs](/rest/api/storageservices/list-blobs), [Get Blob Properties](/rest/api/storageservices/get-blob-properties), and [Get Blob](/rest/api/storageservices/get-blob) |
| [azcopy copy](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_copy) | Perform a dry run | [List Blobs](/rest/api/storageservices/list-blobs) |
| [azcopy copy](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_copy) | Copy from Amazon S3|[Put Blob from URL](/rest/api/storageservices/put-blob-from-url). Based on object size, could also be [Put Block From URL](/rest/api/storageservices/put-block-from-url) and [Put Block List](/rest/api/storageservices/put-block-list). |
| [azcopy copy](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_copy) | Copy from Google Cloud Storage |[Put Blob from URL](/rest/api/storageservices/put-blob-from-url). Based on object size, could also be [Put Block From URL](/rest/api/storageservices/put-block-from-url) and [Put Block List](/rest/api/storageservices/put-block-list). |
| [azcopy copy](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_copy) | Copy to another container |[List Blobs](/rest/api/storageservices/list-blobs), [Get Blob Properties](/rest/api/storageservices/get-blob-properties), and [Put Blob From URL](/rest/api/storageservices/put-blob-from-url). Based on object size, could also be [Put Block From URL](/rest/api/storageservices/put-block-from-url) and [Put Block List](/rest/api/storageservices/put-block-list). |
| [azcopy sync](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_sync) | Update local with changes to container |[List Blobs](/rest/api/storageservices/list-blobs), [Get Blob Properties](/rest/api/storageservices/get-blob-properties), and [Get Blob](/rest/api/storageservices/get-blob) |
| [azcopy sync](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_sync) | Update container with changes to local file system |[List Blobs](/rest/api/storageservices/list-blobs), [Get Blob Properties](/rest/api/storageservices/get-blob-properties), [Put Block](/rest/api/storageservices/put-block-list), and [Put Block List](/rest/api/storageservices/put-block-list). Possibly [Put Blob](/rest/api/storageservices/put-blob) based on object size. |
| [azcopy sync](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_sync) | Synchronize containers |[List Blobs](/rest/api/storageservices/list-blobs), [Get Blob Properties](/rest/api/storageservices/get-blob-properties), and [Put Blob From URL](/rest/api/storageservices/put-blob-from-url). Based on object size, could also be [Put Block From URL](/rest/api/storageservices/put-block-from-url) and [Put Block List](/rest/api/storageservices/put-block-list). |
| [azcopy set-properties](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_set-properties) | Set blob tier |[Set Blob Tier](/rest/api/storageservices/set-blob-tier) and [List Blobs](/rest/api/storageservices/list-blobs) (if targeting a virtual directory) |
| [azcopy set-properties](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_set-properties) | Set metadata |[Set Blob Metadata](/rest/api/storageservices/set-blob-metadata) and [List Blobs](/rest/api/storageservices/list-blobs) (if targeting a virtual directory) |
| [azcopy set-properties](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_set-properties) | Set blob tags |[Set Blob Tags](/rest/api/storageservices/set-blob-tags) and [List Blobs](/rest/api/storageservices/list-blobs) (if targeting a virtual directory) |
| [azcopy list](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_list) | List blobs in a container|[List Blobs](/rest/api/storageservices/list-blobs) |
| [azcopy make](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_make) | Create a container |[Create Container](/rest/api/storageservices/create-container) |
| [azcopy remove](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_jobs_remove) | Delete a container |[Delete Container](/rest/api/storageservices/delete-container) |
| [azcopy remove](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_jobs_remove) | Delete a blob |[Get Blob Properties](/rest/api/storageservices/get-blob-properties). [List Blobs](/rest/api/storageservices/list-blobs) (if targeting a virtual directory), and [Delete Blob](/rest/api/storageservices/delete-blob) |

### Commands that target the Data Lake Storage endpoint

| Command | Scenario | Operations |
|---------|----------|-----------------------------------------|
| [azcopy bench](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_benchn) | Upload   | [Path - Update](/rest/api/storageservices/datalakestoragegen2/path/update) (Append), and [Path - Update](/rest/api/storageservices/datalakestoragegen2/path/update) (Flush)   |
| [azcopy bench](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_bench) | Download | [List Blobs](/rest/api/storageservices/list-blobs), [Get Blob Properties](/rest/api/storageservices/get-blob-properties), and [Path - Read](/rest/api/storageservices/datalakestoragegen2/path/read)|
| [azcopy copy](../common/storage-ref-azcopy-copy.md?toc=/azure/storage/blobs/toc.json) | Upload | [Path - Update](/rest/api/storageservices/datalakestoragegen2/path/update), and [Get Blob Properties](/rest/api/storageservices/get-blob-properties) |
| [azcopy copy](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_copy) | Download |[List Blobs](/rest/api/storageservices/list-blobs), [Get Blob Properties](/rest/api/storageservices/get-blob-properties), and [Path - Read](/rest/api/storageservices/datalakestoragegen2/path/read) |
| [azcopy copy](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_copy) | Perform a dry run | [List Blobs](/rest/api/storageservices/list-blobs) |
| [azcopy copy](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_copy) | Copy from Amazon S3| Not supported |
| [azcopy copy](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_copy) | Copy from Google Cloud Storage | Not supported |
| [azcopy copy](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_copy) | Copy to another container | [List Blobs](/rest/api/storageservices/list-blobs), and [Copy Blob](/rest/api/storageservices/copy-blob). if --preserve-permissions-true, then [Path - Get Properties](/rest/api/storageservices/datalakestoragegen2/path/get-properties) (Get Access Control List) and [Path - Update](/rest/api/storageservices/datalakestoragegen2/path/update) (Set access control) otherwise, [Get Blob Properties](/rest/api/storageservices/get-blob-properties). | 
| [azcopy sync](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_sync) | Update local with changes to container | [List Blobs](/rest/api/storageservices/list-blobs), [Get Blob Properties](/rest/api/storageservices/get-blob-properties), and [Get Blob](/rest/api/storageservices/get-blob) |
| [azcopy sync](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_sync) | Update container with changes to local file system | [List Blobs](/rest/api/storageservices/list-blobs), [Get Blob Properties](/rest/api/storageservices/get-blob-properties), [Path - Update](/rest/api/storageservices/datalakestoragegen2/path/update) (Append), and [Path - Update](/rest/api/storageservices/datalakestoragegen2/path/update) (Flush)|
| [azcopy sync](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_sync) | Synchronize containers | [List Blobs](/rest/api/storageservices/list-blobs), [Get Blob Properties](/rest/api/storageservices/get-blob-properties), and [Copy Blob](/rest/api/storageservices/copy-blob) |
| [azcopy set-properties](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_set-properties) | Set blob tier | Not supported |
| [azcopy set-properties](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_set-properties) | Set metadata | Not supported |
| [azcopy set-properties](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_set-properties) | Set blob tags | Not supported |
| [azcopy list](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_list) | List blobs in a container| [List Blobs](/rest/api/storageservices/list-blobs)|
| [azcopy make](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_make) | Create a container | [Filesystem - Create](/rest/api/storageservices/datalakestoragegen2/filesystem/create) |
| [azcopy remove](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_jobs_remove) | Delete a container | [Filesystem - Delete](/rest/api/storageservices/datalakestoragegen2/filesystem/delete) |
| [azcopy remove](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_jobs_remove) | Delete a blob | [Filesystem - Delete](/rest/api/storageservices/datalakestoragegen2/filesystem/delete) |

## See also

- [Get started with AzCopy](storage-use-azcopy-v10.md)
- [Optimize the performance of AzCopy v10 with Azure Storage](storage-use-azcopy-optimize.md)
- [Troubleshoot AzCopy V10 issues in Azure Storage by using log files](storage-use-azcopy-configure.md)
