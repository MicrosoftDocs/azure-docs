---
title: Manage properties and metadata for a blob with JavaScript
titleSuffix: Azure Storage
description: Learn how to set and retrieve system properties and store custom metadata on blobs in your Azure Storage account using the JavaScript client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell
ms.date: 10/28/2024
ms.service: azure-blob-storage
ms.topic: how-to
ms.devlang: javascript
ms.custom: devx-track-js, devguide-js, devx-track-ts, devguide-ts
---

# Manage blob properties and metadata with JavaScript

[!INCLUDE [storage-dev-guide-selector-manage-properties-blob](../../../includes/storage-dev-guides/storage-dev-guide-selector-manage-properties-blob.md)]

In addition to the data they contain, blobs support system properties and user-defined metadata. This article shows how to manage system properties and user-defined metadata with the [Azure Storage client library for JavaScript](https://www.npmjs.com/package/@azure/storage-blob).

## Prerequisites

- The examples in this article assume you already have a project set up to work with the Azure Blob Storage client library for JavaScript. To learn about setting up your project, including package installation, importing modules, and creating an authorized client object to work with data resources, see [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to work with blob properties or metadata. To learn more, see the authorization guidance for the following REST API operations:
    - [Set Blob Properties](/rest/api/storageservices/set-blob-properties#authorization)
    - [Get Blob Properties](/rest/api/storageservices/get-blob-properties#authorization)
    - [Set Blob Metadata](/rest/api/storageservices/set-blob-metadata#authorization)
    - [Get Blob Metadata](/rest/api/storageservices/get-blob-metadata#authorization)

## About properties and metadata

- **System properties**: System properties exist on each Blob storage resource. Some of them can be read or set, while others are read-only. Under the covers, some system properties correspond to certain standard HTTP headers. The Azure Storage client library for JavaScript maintains these properties for you.

- **User-defined metadata**: User-defined metadata consists of one or more name-value pairs that you specify for a Blob storage resource. You can use metadata to store additional values with the resource. Metadata values are for your own purposes only, and don't affect how the resource behaves.

    Metadata name/value pairs are valid HTTP headers and should adhere to all restrictions governing HTTP headers. For more information about metadata naming requirements, see [Metadata names](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata#metadata-names).

> [!NOTE]
> Blob index tags also provide the ability to store arbitrary user-defined key/value attributes alongside an Azure Blob storage resource. While similar to metadata, only blob index tags are automatically indexed and made searchable by the native blob service. Metadata cannot be indexed and queried unless you utilize a separate service such as Azure Search.
>
> To learn more about this feature, see [Manage and find data on Azure Blob storage with blob index (preview)](storage-manage-find-blobs.md).

## Set and retrieve properties

To set properties on a blob, use the following method:

- [BlobClient.setHTTPHeaders](/javascript/api/@azure/storage-blob/blobclient#@azure-storage-blob-blobclient-sethttpheaders) 
 
The following code example sets the `blobContentType` and `blobContentLanguage` system properties on a blob.

Any properties not explicitly set are cleared. The following code example first gets the existing properties on the blob, then uses them to populate the headers that aren't being updated.

## [JavaScript](#tab/javascript)

:::code language="javascript" source="~/azure-storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/blob-set-properties-and-metadata.js" id="snippet_setHTTPHeaders":::

## [TypeScript](#tab/typescript)

:::code language="typescript" source="~/azure_storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-set-properties-and-metadata.ts" id="snippet_setHTTPHeaders":::

---

To retrieve properties on a blob, use the following method:

- [getProperties](/javascript/api/@azure/storage-blob/blobclient#@azure-storage-blob-blobclient-getproperties)

The following code example gets a blob's system properties and displays some of the values:

## [JavaScript](#tab/javascript)

:::code language="javascript" source="~/azure-storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/blob-set-properties-and-metadata.js" id="snippet_getProperties":::

## [TypeScript](#tab/typescript)

:::code language="typescript" source="~/azure_storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-set-properties-and-metadata.ts" id="snippet_getProperties":::

---

## Set and retrieve metadata

You can specify metadata as one or more name-value pairs on a blob or container resource. To set metadata, send a [Metadata](/javascript/api/@azure/storage-blob/metadata) object containing name-value pairs using the following method:

- [BlobClient.setMetadata](/javascript/api/@azure/storage-blob/blobclient#@azure-storage-blob-blobclient-setmetadata)

The following code example sets metadata on a blob:

## [JavaScript](#tab/javascript)

:::code language="javascript" source="~/azure-storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/blob-set-properties-and-metadata.js" id="snippet_setBlobMetadata":::

## [TypeScript](#tab/typescript)

:::code language="typescript" source="~/azure_storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-set-properties-and-metadata.ts" id="snippet_setBlobMetadata":::

---

To retrieve metadata, call the [getProperties](/javascript/api/@azure/storage-blob/blobclient#@azure-storage-blob-blobclient-getproperties) method on your blob to populate the metadata collection, then read the values from the [metadata](/javascript/api/@azure/storage-blob/blobgetpropertiesresponse#@azure-storage-blob-blobgetpropertiesresponse-metadata) property. The `getProperties` method retrieves blob properties and metadata by calling both the `Get Blob Properties` operation and the `Get Blob Metadata` operation.

## Resources

To learn more about how to manage system properties and user-defined metadata using the Azure Blob Storage client library for JavaScript, see the following resources.

### Code samples

- View [JavaScript](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide/blob-set-properties-and-metadata.js) and [TypeScript](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-set-properties-and-metadata.ts) code samples from this article (GitHub)

### REST API operations

The Azure SDK for JavaScript contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar JavaScript paradigms. The client library methods for managing system properties and user-defined metadata use the following REST API operations:

- [Set Blob Properties](/rest/api/storageservices/set-blob-properties) (REST API)
- [Get Blob Properties](/rest/api/storageservices/get-blob-properties) (REST API)
- [Set Blob Metadata](/rest/api/storageservices/set-blob-metadata) (REST API)
- [Get Blob Metadata](/rest/api/storageservices/get-blob-metadata) (REST API)

[!INCLUDE [storage-dev-guide-resources-javascript](../../../includes/storage-dev-guides/storage-dev-guide-resources-javascript.md)]

[!INCLUDE [storage-dev-guide-next-steps-javascript](../../../includes/storage-dev-guides/storage-dev-guide-next-steps-javascript.md)]