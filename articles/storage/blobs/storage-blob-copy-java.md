---
title: Copy a blob with Java
titleSuffix: Azure Storage
description: Learn how to copy a blob in Azure Storage by using the Java client library.
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.date: 04/18/2023
ms.service: azure-storage
ms.topic: how-to
ms.devlang: java
ms.custom: devx-track-java, devguide-java, devx-track-extended-java
---

# Copy a blob with Java

This article provides an overview of copy operations using the [Azure Storage client library for Java](/java/api/overview/azure/storage-blob-readme).

## About copy operations

Copy operations can be used to move data within a storage account, between storage accounts, or into a storage account from a source outside of Azure. When using the Blob Storage client libraries to copy data resources, it's important to understand the REST API operations behind the client library methods. The following table lists REST API operations that can be used to copy data resources to a storage account. The table also includes links to detailed guidance about how to perform these operations using the [Azure Storage client library for Java](/java/api/overview/azure/storage-blob-readme).

| REST API operation | When to use | Client library methods | Guidance |
| --- | --- | --- | --- |
| [Put Blob From URL](/rest/api/storageservices/put-blob-from-url) | This operation is preferred for scenarios where you want to move data into a storage account and have a URL for the source object. This operation completes synchronously. | [uploadFromUrl](/java/api/com.azure.storage.blob.specialized.blockblobclient#method-details) | [Copy a blob from a source object URL with Java](storage-blob-copy-url-java.md) |
| [Put Block From URL](/rest/api/storageservices/put-block-from-url) | For large objects, you can use [Put Block From URL](/rest/api/storageservices/put-block-from-url) to write individual blocks to Blob Storage, and then call [Put Block List](/rest/api/storageservices/put-block-list) to commit those blocks to a block blob. This operation completes synchronously. | [stageBlockFromUrl](/java/api/com.azure.storage.blob.specialized.blockblobclient#method-details) | [Copy a blob from a source object URL with Java](storage-blob-copy-url-java.md) |
| [Copy Blob](/rest/api/storageservices/copy-blob) | This operation can be used when you want asynchronous scheduling for a copy operation. | [beginCopy](/java/api/com.azure.storage.blob.specialized.blobclientbase#method-details) | [Copy a blob with asynchronous scheduling using Java](storage-blob-copy-async-java.md) |

For append blobs, you can use the [Append Block From URL](/rest/api/storageservices/append-block-from-url) operation to commit a new block of data to the end of an existing append blob. The following client library method wraps this operation:

- [appendBlockFromUrl](/java/api/com.azure.storage.blob.specialized.appendblobclient#method-details)

For page blobs, you can use the [Put Page From URL](/rest/api/storageservices/put-page-from-url) operation to write a range of pages to a page blob where the contents are read from a URL. The following client library method wraps this operation:

- [uploadPagesFromUrl](/java/api/com.azure.storage.blob.specialized.pageblobclient#method-details)

## Client library resources

- [Client library reference documentation](/java/api/overview/azure/storage-blob-readme)
- [Client library source code](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/storage/azure-storage-blob)
- [Package (Maven)](https://mvnrepository.com/artifact/com.azure/azure-storage-blob)
