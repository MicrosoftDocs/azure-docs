---
title: Map of AzCopy commands to REST operations (Azure Blob Storage)
description: Find the REST operations used by each AzCopy v10 command.
author: normesta
ms.service: azure-storage
ms.topic: reference
ms.date: 07/03/2024
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
| [azcopy bench](../common/storage-ref-azcopy-bench.md?toc=/azure/storage/blobs/toc.json) | Upload   | [Put Block](/rest/api/storageservices/put-block-list) and [Put Block List](/rest/api/storageservices/put-block-list). Possibly [Put Blob](/rest/api/storageservices/put-blob) based on object size.|
| [azcopy bench](../common/storage-ref-azcopy-bench.md?toc=/azure/storage/blobs/toc.json) | Download |[List Blobs](/rest/api/storageservices/list-blobs), [Get Blob Properties](/rest/api/storageservices/get-blob-properties), and [Get Blob](/rest/api/storageservices/get-blob) |
| [azcopy copy](../common/storage-ref-azcopy-copy.md?toc=/azure/storage/blobs/toc.json) | Upload | [Put Block](/rest/api/storageservices/put-block-list), [Put Block List](/rest/api/storageservices/put-block-list), and [Get Blob Properties](/rest/api/storageservices/get-blob-properties). Possibly [Put Blob](/rest/api/storageservices/put-blob) based on object size. |
| [azcopy copy](../common/storage-ref-azcopy-copy.md?toc=/azure/storage/blobs/toc.json) | Download | [List Blobs](/rest/api/storageservices/list-blobs), [Get Blob Properties](/rest/api/storageservices/get-blob-properties), and [Get Blob](/rest/api/storageservices/get-blob) |
| [azcopy copy](../common/storage-ref-azcopy-copy.md?toc=/azure/storage/blobs/toc.json) | Perform a dry run | [List Blobs](/rest/api/storageservices/list-blobs) |
| [azcopy copy](../common/storage-ref-azcopy-copy.md?toc=/azure/storage/blobs/toc.json) | Copy from Amazon S3|[Put Blob from URL](/rest/api/storageservices/put-blob-from-url). Based on object size, could also be [Put Block From URL](/rest/api/storageservices/put-block-from-url) and [Put Block List](/rest/api/storageservices/put-block-list). |
| [azcopy copy](../common/storage-ref-azcopy-copy.md?toc=/azure/storage/blobs/toc.json) | Copy from Google Cloud Storage |[Put Blob from URL](/rest/api/storageservices/put-blob-from-url). Based on object size, could also be [Put Block From URL](/rest/api/storageservices/put-block-from-url) and [Put Block List](/rest/api/storageservices/put-block-list). |
| [azcopy copy](../common/storage-ref-azcopy-copy.md?toc=/azure/storage/blobs/toc.json) | Copy to another container |[List Blobs](/rest/api/storageservices/list-blobs), [Get Blob Properties](/rest/api/storageservices/get-blob-properties), and [Put Blob From URL](/rest/api/storageservices/put-blob-from-url). Based on object size, could also be [Put Block From URL](/rest/api/storageservices/put-block-from-url) and [Put Block List](/rest/api/storageservices/put-block-list). |
| [azcopy sync](../common/storage-ref-azcopy-sync.md?toc=/azure/storage/blobs/toc.json) | Update local with changes to container |[List Blobs](/rest/api/storageservices/list-blobs), [Get Blob Properties](/rest/api/storageservices/get-blob-properties), and [Get Blob](/rest/api/storageservices/get-blob) |
| [azcopy sync](../common/storage-ref-azcopy-sync.md?toc=/azure/storage/blobs/toc.json) | Update container with changes to local file system |[List Blobs](/rest/api/storageservices/list-blobs), [Get Blob Properties](/rest/api/storageservices/get-blob-properties), [Put Block](/rest/api/storageservices/put-block-list), and [Put Block List](/rest/api/storageservices/put-block-list). Possibly [Put Blob](/rest/api/storageservices/put-blob) based on object size. |
| [azcopy sync](../common/storage-ref-azcopy-sync.md?toc=/azure/storage/blobs/toc.json) | Synchronize containers |[List Blobs](/rest/api/storageservices/list-blobs), [Get Blob Properties](/rest/api/storageservices/get-blob-properties), and [Put Blob From URL](/rest/api/storageservices/put-blob-from-url). Based on object size, could also be [Put Block From URL](/rest/api/storageservices/put-block-from-url) and [Put Block List](/rest/api/storageservices/put-block-list). |
| [azcopy set-properties](../common/storage-ref-azcopy-set-properties.md?toc=/azure/storage/blobs/toc.json) | Set blob tier |[Set Blob Tier](/rest/api/storageservices/set-blob-tier) and [List Blobs](/rest/api/storageservices/list-blobs) (if targeting a virtual directory) |
| [azcopy set-properties](../common/storage-ref-azcopy-set-properties.md?toc=/azure/storage/blobs/toc.json) | Set metadata |[Set Blob Metadata](/rest/api/storageservices/set-blob-metadata) and [List Blobs](/rest/api/storageservices/list-blobs) (if targeting a virtual directory) |
| [azcopy set-properties](../common/storage-ref-azcopy-set-properties.md?toc=/azure/storage/blobs/toc.json) | Set blob tags |[Set Blob Tags](/rest/api/storageservices/set-blob-tags) and [List Blobs](/rest/api/storageservices/list-blobs) (if targeting a virtual directory) |
| [azcopy list](../common/storage-ref-azcopy-list.md?toc=/azure/storage/blobs/toc.json) | List blobs in a container|[List Blobs](/rest/api/storageservices/list-blobs) |
| [azcopy make](../common/storage-ref-azcopy-make.md?toc=/azure/storage/blobs/toc.json) | Create a container |[Create Container](/rest/api/storageservices/create-container) |
| [azcopy remove](../common/storage-ref-azcopy-remove.md?toc=/azure/storage/blobs/toc.json) | Delete a container |[Delete Container](/rest/api/storageservices/delete-container) |
| [azcopy remove](../common/storage-ref-azcopy-remove.md?toc=/azure/storage/blobs/toc.json) | Delete a blob |[Get Blob Properties](/rest/api/storageservices/get-blob-properties). [List Blobs](/rest/api/storageservices/list-blobs) (if targeting a virtual directory), and [Delete Blob](/rest/api/storageservices/delete-blob) |

### Commands that target the Data Lake Storage endpoint

| Command | Scenario | Operations |
|---------|----------|-----------------------------------------|
| [azcopy bench](../common/storage-ref-azcopy-bench.md?toc=/azure/storage/blobs/toc.json) | Upload   | [Path - Update](/rest/api/storageservices/datalakestoragegen2/path/update) (Append), and [Path - Update](/rest/api/storageservices/datalakestoragegen2/path/update) (Flush)   |
| [azcopy bench](../common/storage-ref-azcopy-bench.md?toc=/azure/storage/blobs/toc.json) | Download | [List Blobs](/rest/api/storageservices/list-blobs), [Get Blob Properties](/rest/api/storageservices/get-blob-properties), and [Path - Read](/rest/api/storageservices/datalakestoragegen2/path/read)|
| [azcopy copy](../common/storage-ref-azcopy-copy.md?toc=/azure/storage/blobs/toc.json) | Upload | [Path - Update](/rest/api/storageservices/datalakestoragegen2/path/update), and [Get Blob Properties](/rest/api/storageservices/get-blob-properties) |
| [azcopy copy](../common/storage-ref-azcopy-copy.md?toc=/azure/storage/blobs/toc.json) | Download |[List Blobs](/rest/api/storageservices/list-blobs), [Get Blob Properties](/rest/api/storageservices/get-blob-properties), and [Path - Read](/rest/api/storageservices/datalakestoragegen2/path/read) |
| [azcopy copy](../common/storage-ref-azcopy-copy.md?toc=/azure/storage/blobs/toc.json) | Perform a dry run | [List Blobs](/rest/api/storageservices/list-blobs) |
| [azcopy copy](../common/storage-ref-azcopy-copy.md?toc=/azure/storage/blobs/toc.json) | Copy from Amazon S3| Not supported |
| [azcopy copy](../common/storage-ref-azcopy-copy.md?toc=/azure/storage/blobs/toc.json) | Copy from Google Cloud Storage | Not supported |
| [azcopy copy](../common/storage-ref-azcopy-copy.md?toc=/azure/storage/blobs/toc.json) | Copy to another container | [List Blobs](/rest/api/storageservices/list-blobs), and [Copy Blob](/rest/api/storageservices/copy-blob). if --preserve-permissions-true, then [Path - Get Properties](/rest/api/storageservices/datalakestoragegen2/path/get-properties) (Get Access Control List) and [Path - Update](/rest/api/storageservices/datalakestoragegen2/path/update) (Set access control) otherwise, [Get Blob Properties](/rest/api/storageservices/get-blob-properties). | 
| [azcopy sync](../common/storage-ref-azcopy-sync.md?toc=/azure/storage/blobs/toc.json) | Update local with changes to container | [List Blobs](/rest/api/storageservices/list-blobs), [Get Blob Properties](/rest/api/storageservices/get-blob-properties), and [Get Blob](/rest/api/storageservices/get-blob) |
| [azcopy sync](../common/storage-ref-azcopy-sync.md?toc=/azure/storage/blobs/toc.json) | Update container with changes to local file system | [List Blobs](/rest/api/storageservices/list-blobs), [Get Blob Properties](/rest/api/storageservices/get-blob-properties), [Path - Update](/rest/api/storageservices/datalakestoragegen2/path/update) (Append), and [Path - Update](/rest/api/storageservices/datalakestoragegen2/path/update) (Flush)|
| [azcopy sync](../common/storage-ref-azcopy-sync.md?toc=/azure/storage/blobs/toc.json) | Synchronize containers | [List Blobs](/rest/api/storageservices/list-blobs), [Get Blob Properties](/rest/api/storageservices/get-blob-properties), and [Copy Blob](/rest/api/storageservices/copy-blob) |
| [azcopy set-properties](../common/storage-ref-azcopy-set-properties.md?toc=/azure/storage/blobs/toc.json) | Set blob tier | Not supported |
| [azcopy set-properties](../common/storage-ref-azcopy-set-properties.md?toc=/azure/storage/blobs/toc.json) | Set metadata | Not supported |
| [azcopy set-properties](../common/storage-ref-azcopy-set-properties.md?toc=/azure/storage/blobs/toc.json) | Set blob tags | Not supported |
| [azcopy list](../common/storage-ref-azcopy-list.md?toc=/azure/storage/blobs/toc.json) | List blobs in a container| [List Blobs](/rest/api/storageservices/list-blobs)|
| [azcopy make](../common/storage-ref-azcopy-make.md?toc=/azure/storage/blobs/toc.json) | Create a container | [Filesystem - Create](/rest/api/storageservices/datalakestoragegen2/filesystem/create) |
| [azcopy remove](../common/storage-ref-azcopy-remove.md?toc=/azure/storage/blobs/toc.json) | Delete a container | [Filesystem - Delete](/rest/api/storageservices/datalakestoragegen2/filesystem/delete) |
| [azcopy remove](../common/storage-ref-azcopy-remove.md?toc=/azure/storage/blobs/toc.json) | Delete a blob | [Filesystem - Delete](/rest/api/storageservices/datalakestoragegen2/filesystem/delete) |

## See also

- [Get started with AzCopy](storage-use-azcopy-v10.md)
- [Optimize the performance of AzCopy v10 with Azure Storage](storage-use-azcopy-optimize.md)
- [Troubleshoot AzCopy V10 issues in Azure Storage by using log files](storage-use-azcopy-configure.md)
