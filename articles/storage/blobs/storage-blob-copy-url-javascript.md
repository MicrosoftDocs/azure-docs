---
title: Copy a blob from a source object URL with JavaScript
titleSuffix: Azure Storage
description: Learn how to copy a blob from a source object URL in Azure Storage by using the JavaScript client library.
author: pauljewellmsft

ms.author: pauljewell
ms.date: 05/08/2023
ms.service: azure-storage
ms.topic: how-to
ms.devlang: javascript
ms.custom: devx-track-js, devguide-js
---

# Copy a blob from a source object URL with JavaScript

This article shows how to copy a blob from a source object URL using the [Azure Storage client library for JavaScript](/javascript/api/overview/azure/storage-blob-readme). You can copy a blob from a source within the same storage account, from a source in a different storage account, or from any accessible object retrieved via HTTP GET request on a given URL.

The client library methods covered in this article use the [Put Blob From URL](/rest/api/storageservices/put-blob-from-url) and [Put Block From URL](/rest/api/storageservices/put-block-from-url) REST API operations. These methods are preferred for copy scenarios where you want to move data into a storage account and have a URL for the source object. For copy operations where you want asynchronous scheduling, see [Copy a blob with asynchronous scheduling using JavaScript](storage-blob-copy-async-javascript.md).

## Prerequisites

- The examples in this article assume you already have a project set up to work with the Azure Blob Storage client library for JavaScript. To learn about setting up your project, including package installation, importing modules, and creating an authorized client object to work with data resources, see [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to perform a copy operation. To learn more, see the authorization guidance for the following REST API operation:
    - [Put Blob From URL](/rest/api/storageservices/put-blob-from-url#authorization)
    - [Put Block From URL](/rest/api/storageservices/put-block-from-url#authorization)

[!INCLUDE [storage-dev-guide-blob-copy-from-url](../../../includes/storage-dev-guides/storage-dev-guide-about-blob-copy-from-url.md)]

## Copy a blob from a source object URL

This section gives an overview of methods provided by the Azure Storage client library for JavaScript to perform a copy operation from a source object URL.

The following method wraps the [Put Blob From URL](/rest/api/storageservices/put-blob-from-url) REST API operation, and creates a new block blob where the contents of the blob are read from a given URL:

- [BlockBlobClient.syncUploadFromURL](/javascript/api/@azure/storage-blob/blockblobclient#@azure-storage-blob-blockblobclient-syncuploadfromurl)

These methods are preferred for scenarios where you want to move data into a storage account and have a URL for the source object.

For large objects, you may choose to work with individual blocks. The following method wraps the [Put Block From URL](/rest/api/storageservices/put-block-from-url) REST API operation. This method creates a new block to be committed as part of a blob where the contents are read from a source URL:

- [BlockBlobClient.stageBlockFromURL](/javascript/api/@azure/storage-blob/blockblobclient#@azure-storage-blob-blockblobclient-stageblockfromurl)

## Copy a blob from a source within Azure

If you're copying a blob from a source within Azure, access to the source blob can be authorized via Azure Active Directory (Azure AD), a shared access signature (SAS), or an account key.

The following example shows a scenario for copying from a source blob within Azure:

:::code language="javascript" source="~/azure-storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/copy-blob-put-from-url.js" id="Snippet_copy_from_azure_put_blob_from_url":::

The [syncUploadFromURL](/javascript/api/@azure/storage-blob/blockblobclient#@azure-storage-blob-blockblobclient-syncuploadfromurl) method can also accept a [BlockBlobSyncUploadFromURLOptions](/javascript/api/@azure/storage-blob/blockblobsyncuploadfromurloptions) parameter to specify further options for the operation.

## Copy a blob from a source outside of Azure

You can perform a copy operation on any source object that can be retrieved via HTTP GET request on a given URL, including accessible objects outside of Azure. The following example shows a scenario for copying a blob from an accessible source object URL.

:::code language="javascript" source="~/azure-storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/copy-blob-put-from-url.js" id="Snippet_copy_from_external_source_put_blob_from_url":::

## Resources

To learn more about copying blobs using the Azure Blob Storage client library for JavaScript, see the following resources.

### REST API operations

The Azure SDK for JavaScript contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar JavaScript paradigms. The client library methods covered in this article use the following REST API operations:

- [Put Blob From URL](/rest/api/storageservices/put-blob-from-url) (REST API)
- [Put Block From URL](/rest/api/storageservices/put-block-from-url) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide/copy-blob-put-from-url.js)

[!INCLUDE [storage-dev-guide-resources-javascript](../../../includes/storage-dev-guides/storage-dev-guide-resources-javascript.md)]
