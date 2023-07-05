---
title: Copy a blob from a source object URL with Python
titleSuffix: Azure Storage
description: Learn how to copy a blob from a source object URL in Azure Storage by using the Python client library.
author: pauljewellmsft

ms.author: pauljewell
ms.date: 04/28/2023
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.devlang: python
ms.custom: devx-track-python, devguide-python
---

# Copy a blob from a source object URL with Python

This article shows how to copy a blob from a source object URL using the [Azure Storage client library for Python](/python/api/overview/azure/storage). You can copy a blob from a source within the same storage account, from a source in a different storage account, or from any accessible object retrieved via HTTP GET request on a given URL.

The client library methods covered in this article use the [Put Blob From URL](/rest/api/storageservices/put-blob-from-url) and [Put Block From URL](/rest/api/storageservices/put-block-from-url) REST API operations. These methods are preferred for copy scenarios where you want to move data into a storage account and have a URL for the source object. For copy operations where you want asynchronous scheduling, see [Copy a blob with asynchronous scheduling using Python](storage-blob-copy-async-python.md).

## Prerequisites

To work with the code examples in this article, make sure you have:

- An authorized client object to connect to Blob Storage data resources. To learn more, see [Create and manage client objects that interact with data resources](storage-blob-client-management.md).
- Permissions to perform a copy operation. To learn more, see the authorization guidance for the following REST API operations:
    - [Put Blob From URL](/rest/api/storageservices/put-blob-from-url#authorization)
    - [Put Block From URL](/rest/api/storageservices/put-block-from-url#authorization)
- Packages installed to your project directory. These examples use **azure-storage-blob**. If you're using `DefaultAzureCredential` for authorization, you also need **azure-identity**. To learn more about setting up your project, see [Get Started with Azure Storage and Python](storage-blob-python-get-started.md#set-up-your-project). To see the necessary `using` directives, see [Code samples](#code-samples).

## About copying blobs from a source object URL

The `Put Blob From URL` operation creates a new block blob where the contents of the blob are read from a given URL. The operation completes synchronously.

The source can be any object retrievable via a standard HTTP GET request on the given URL. This includes block blobs, append blobs, page blobs, blob snapshots, blob versions, or any accessible object inside or outside Azure.

When the source object is a block blob, all committed blob content is copied. The content of the destination blob is identical to the content of the source, but the list of committed blocks isn't preserved and uncommitted blocks aren't copied.

The destination is always a block blob, either an existing block blob, or a new block blob created by the operation. The contents of an existing blob are overwritten with the contents of the new blob.

The `Put Blob From URL` operation always copies the entire source blob. Copying a range of bytes or set of blocks isn't supported. To perform partial updates to a block blob’s contents by using a source URL, use the [Put Block From URL](/rest/api/storageservices/put-block-from-url) API along with [`Put Block List`](/rest/api/storageservices/put-block-list).

To learn more about the `Put Blob From URL` operation, including blob size limitations and billing considerations, see [Put Blob From URL remarks](/rest/api/storageservices/put-blob-from-url#remarks).

## Copy a blob from a source object URL

This section gives an overview of methods provided by the Azure Storage client library for Python to perform a copy operation from a source object URL.

The following method wraps the [Put Blob From URL](/rest/api/storageservices/put-blob-from-url) REST API operation, and creates a new block blob where the contents of the blob are read from a given URL:

- [BlobClient.upload_blob_from_url](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-upload-blob-from-url)

These methods are preferred for scenarios where you want to move data into a storage account and have a URL for the source object.

For large objects, you may choose to work with individual blocks. The following method wraps the [Put Block From URL](/rest/api/storageservices/put-block-from-url) REST API operation. This method creates a new block to be committed as part of a blob where the contents are read from a source URL:

- [BlobClient.stage_block_from_url](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-stage-block-from-url)

## Copy a blob from a source within Azure

If you're copying a blob from a source within Azure, access to the source blob can be authorized via Azure Active Directory (Azure AD), a shared access signature (SAS), or an account key.

The following example shows a scenario for copying a source blob within Azure. The [upload_blob_from_url](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-upload-blob-from-url) method can optionally accept a Boolean parameter to indicate whether an existing blob should be overwritten, as shown in the example.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-copy-put-from-url.py" id="Snippet_copy_from_azure_put_blob_from_url":::

## Copy a blob from a source outside of Azure

You can perform a copy operation on any source object that can be retrieved via HTTP GET request on a given URL, including accessible objects outside of Azure. The following example shows a scenario for copying a blob from an accessible source object URL.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-copy-put-from-url.py" id="Snippet_copy_from_external_source_put_blob_from_url":::

## Resources

To learn more about copying blobs using the Azure Blob Storage client library for Python, see the following resources.

### REST API operations

The Azure SDK for Python contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Python paradigms. The client library methods covered in this article use the following REST API operations:

- [Put Blob From URL](/rest/api/storageservices/put-blob-from-url) (REST API)
- [Put Block From URL](/rest/api/storageservices/put-block-from-url) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/python/blob-devguide-py/blob-devguide-copy-put-from-url.py)

[!INCLUDE [storage-dev-guide-resources-python](../../../includes/storage-dev-guides/storage-dev-guide-resources-python.md)]
