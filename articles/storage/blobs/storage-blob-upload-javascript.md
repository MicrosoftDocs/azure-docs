---
title: Upload a blob using JavaScript - Azure Storage
description: Learn how to upload a blob to your Azure Storage account using the JavaScript client library.
services: storage
author: normesta

ms.author: normesta
ms.date: 03/28/2022
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.devlang: javascript
ms.custom: "devx-track-js"
---

# Upload a blob to Azure Storage by using the JavaScript client library

You can upload a blob, open a blob stream and write to that, or upload large blobs in blocks.

> [!NOTE]
> The examples in this article assume that you've created a [BlobServiceClient]() object by using the guidance in the [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md) article. Blobs in Azure Storage are organized into containers. Before you can upload a blob, you must first create a container. To learn how to create a container, see [Create a container in Azure Storage with JavaScript](storage-blob-container-create.md). 

To upload a blob by using a file path, a stream, a binary object or a text string, use the following method:

- [Upload]()


To open a stream in Blob Storage, and then write to that stream, use the following method:

- [OpenWrite](/dotnet/api/azure.storage.blobs.specialized.blockblobclient.openwrite)


## Upload by using a file path

The following example uploads a blob by using a file path:

```javascript

```

## Upload by using a Stream

The following example uploads a blob by creating a [Stream]() object, and then uploading that stream.

```javascript

```

## Upload by using a BinaryData object

The following example uploads a [BinaryData]() object.

```javascript

```

## Upload a string

The following example uploads a string:

```javascript

```

## Upload with index tags

Blob index tags categorize data in your storage account using key-value tag attributes. These tags are automatically indexed and exposed as a searchable multi-dimensional index to easily find data. You can perform this task by adding tags to a [BlobUploadOptions]() instance, and then passing that instance into the [Upload]() method.

The following example uploads a blob with three index tags.

```javascript

```

## Upload to a stream in Blob Storage

You can open a stream in Blob Storage and write to that stream. The following example creates a zip file in Blob Storage and writes files to that file. Instead of building a zip file in local memory, only one file at a time is in memory. 

```javascript
```

## Upload by staging blocks and then committing them

You can have greater control over how to divide our uploads into blocks by manually staging individual blocks of data. When all of the blocks that make up a blob are staged, you can commit them to Blob Storage. You can use this approach if you want to enhance performance by uploading blocks in parallel. 

```javascript
```

## See also

- [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md)
- [Use blob index tags to manage and find data on Azure Blob Storage](storage-blob-index-how-to.md)
- [Put Blob](/rest/api/storageservices/put-blob) (REST API)
- [Put Blob From URL](/rest/api/storageservices/put-blob-from-url) (REST API)
