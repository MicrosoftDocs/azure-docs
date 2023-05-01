---
title: Upload a blob with Python
titleSuffix: Azure Storage
description: Learn how to upload a blob to your Azure Storage account using the Python client library.
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.date: 05/01/2023
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.devlang: python
ms.custom: devx-track-python, devguide-python
---

# Upload a block blob with Python

This article shows how to upload a blob using the [Azure Storage client library for Python](/python/api/overview/azure/storage). You can upload data to a block blob from a file path, a stream, a binary object, or a text string. You can also upload blobs with index tags.

## Prerequisites

To work with the code examples in this article, make sure you have:

- An authorized client object to connect to Blob Storage data resources. To learn more, see [Create and manage client objects that interact with data resources](storage-blob-client-management.md).
- Permissions to perform an upload operation. To learn more, see the authorization guidance for the following REST API operations:
    - [Put Blob](/rest/api/storageservices/put-blob#authorization)
    - [Put Block](/rest/api/storageservices/put-block#authorization)
- The package **azure-storage-blob** installed to your project directory. To learn more about setting up your project, see [Get Started with Azure Storage and Python](storage-blob-python-get-started.md#set-up-your-project).

## Upload data to a block blob

To upload a blob using a stream or a binary object, use the following method:

- [BlobClient.upload_blob](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-upload-blob)

## Upload a block blob from a local file path

The following example uploads a file to a block blob using a `BlobClient` object:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-upload.py" id="Snippet_upload_blob_file":::

## Upload a block blob from a stream

The following example creates random bytes of data and uploads a `BytesIO` object to a block blob using a `BlobClient` object:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-upload.py" id="Snippet_upload_blob_stream":::

## Upload binary data to a block blob

The following example uploads binary data to a block blob using a `BlobClient` object:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-upload.py" id="Snippet_upload_blob_data":::

## Upload a block blob with index tags

The following example uploads a block blob with index tags:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-upload.py" id="Snippet_upload_blob_tags":::

## Upload a block blob by staging blocks and committing

You can have greater control over how to divide uploads into blocks by manually staging individual blocks of data. When all of the blocks that make up a blob are staged, you can commit them to Blob Storage.

The following example reads data from a file and stages blocks to be committed as part of a blob:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-upload.py" id="Snippet_upload_blob_blocks":::

## Resources

To learn more about uploading blobs using the Azure Blob Storage client library for Python, see the following resources.

### REST API operations

The Azure SDK for Python contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Python paradigms. The client library methods for uploading blobs use the following REST API operations:

- [Put Blob](/rest/api/storageservices/put-blob) (REST API)
- [Put Block](/rest/api/storageservices/put-block) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/python/blob-devguide-py/blob-devguide-blobs.py)

[!INCLUDE [storage-dev-guide-resources-python](../../../includes/storage-dev-guides/storage-dev-guide-resources-python.md)]

### See also

- [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md)
- [Use blob index tags to manage and find data on Azure Blob Storage](storage-blob-index-how-to.md)