---
title: Download a blob with JavaScript - Azure Storage
description: Learn how to download a blob in Azure Storage by using the JavaScript client library.
services: storage
author: normesta

ms.author: normesta
ms.date: 03/28/2022
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.devlang: javascript
ms.custom: "devx-track-javascript"
---

# Download a blob in Azure Storage using the JavaScript client library

You can download a blob by using any of the following methods:

- [DownloadTo]()
- [DownloadContent]()

You can also open a stream to read from a blob. The stream will only download the blob as the stream is read from. Use the following method:

- [OpenRead](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.openread)


> [!NOTE]
> The examples in this article assume that you've created a [BlobServiceClient]() object by using the guidance in the [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md) article.  
 
## Download to a file path

The following example downloads a blob by using a file path:

```javascript

```

## Download to a stream

The following example downloads a blob by creating a [Stream]() object and then downloading to that stream.

```javascript

```

## Download to a string

The following example downloads a blob to a string. This example assumes that the blob is a text file.  

```javascript

```

## Download from a stream

The following example downloads a blob by reading from a stream. 

```javascript
```

## See also

- [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md)
- [DownloadStreaming]()
- [Get Blob](/rest/api/storageservices/get-blob) (REST API)
