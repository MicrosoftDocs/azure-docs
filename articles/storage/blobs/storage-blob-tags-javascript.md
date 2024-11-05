---
title: Use blob index tags to manage and find data with JavaScript or TypeScript
titleSuffix: Azure Storage
description: Learn how to categorize, manage, and query for blob objects by using the JavaScript client library.  
services: storage
author: pauljewellmsft
ms.author: pauljewell
ms.date: 10/28/2024
ms.service: azure-blob-storage
ms.topic: how-to
ms.devlang: javascript
ms.custom: devx-track-js, devguide-js, devx-track-ts, devguide-ts
---

# Use blob index tags to manage and find data with JavaScript or TypeScript

[!INCLUDE [storage-dev-guide-selector-index-tags](../../../includes/storage-dev-guides/storage-dev-guide-selector-index-tags.md)]

This article shows how to use blob index tags to manage and find data using the [Azure Storage client library for JavaScript](https://www.npmjs.com/package/@azure/storage-blob).

## Prerequisites

- The examples in this article assume you already have a project set up to work with the Azure Blob Storage client library for JavaScript. To learn about setting up your project, including package installation, importing modules, and creating an authorized client object to work with data resources, see [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to work with blob index tags. To learn more, see the authorization guidance for the following REST API operations:
    - [Get Blob Tags](/rest/api/storageservices/get-blob-tags#authorization)
    - [Set Blob Tags](/rest/api/storageservices/set-blob-tags#authorization)
    - [Find Blobs by Tags](/rest/api/storageservices/find-blobs-by-tags#authorization)

[!INCLUDE [storage-dev-guide-about-blob-tags](../../../includes/storage-dev-guides/storage-dev-guide-about-blob-tags.md)]

## Set tags

[!INCLUDE [storage-dev-guide-auth-set-blob-tags](../../../includes/storage-dev-guides/storage-dev-guide-auth-set-blob-tags.md)]

You can set tags by using the following method:

- [BlobClient.setTags](/javascript/api/@azure/storage-blob/blobclient#@azure-storage-blob-blobclient-settags)

The specified tags in this method replace existing tags. If old values must be preserved, they must be downloaded and included in the call to this method. The following example shows how to set tags:

### [JavaScript](#tab/javascript)

:::code language="javascript" source="~/azure-storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/set-and-retrieve-blob-tags.js" id="Snippet_setTags":::

### [TypeScript](#tab/typescript)

:::code language="typescript" source="~/azure-storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-set-tags.ts" id="Snippet_setTags" :::

---

You can delete all tags by passing an empty JSON object into the `setTags` method.

## Get tags

[!INCLUDE [storage-dev-guide-auth-get-blob-tags](../../../includes/storage-dev-guides/storage-dev-guide-auth-get-blob-tags.md)]

You can get tags by using the following method: 

- [BlobClient.getTags](/javascript/api/@azure/storage-blob/blobclient#@azure-storage-blob-blobclient-gettags)

The following example shows how to retrieve and iterate over the blob's tags.

### [JavaScript](#tab/javascript)

:::code language="javascript" source="~/azure-storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/set-and-retrieve-blob-tags.js" id="Snippet_getTags":::

### [TypeScript](#tab/typescript)

:::code language="typescript" source="~/azure-storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-set-tags.ts" id="Snippet_getTags" :::

---

## Filter and find data with blob index tags

[!INCLUDE [storage-dev-guide-auth-filter-blob-tags](../../../includes/storage-dev-guides/storage-dev-guide-auth-filter-blob-tags.md)]

> [!NOTE]
> You can't use index tags to retrieve previous versions. Tags for previous versions aren't passed to the blob index engine. For more information, see [Conditions and known issues](storage-manage-find-blobs.md#conditions-and-known-issues).

Data is queried with a JSON object sent as a string. The properties don't need to have additional string quotes but the values do need additional string quotes.

The following table shows some query strings:

|Query string for tags (tagOdataQuery)|Description|
|--|--|
|`id='1' AND project='billing'`|Filter blobs across all containers based on these two properties|
|`owner='PhillyProject' AND createdOn >= '2021-12' AND createdOn <= '2022-06'`|Filter blobs across all containers based on strict property value for `owner` and range of dates for `createdOn` property.|
|`@container = 'my-container' AND createdBy = 'Jill'`|**Filter by container** and specific property. In this query, `createdBy` is a text match and doesn't indicate an authorization match through Active Directory. |


You can find data by using the following method: 

- [BlobServiceClient.findBlobsByTags](/javascript/api/@azure/storage-blob/blobserviceclient#@azure-storage-blob-blobserviceclient-findblobsbytags)

The following example finds all blobs matching the `tagOdataQuery` parameter.

### [JavaScript](#tab/javascript)

:::code language="javascript" source="~/azure-storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/set-and-retrieve-blob-tags.js" id="Snippet_findBlobsByQuery":::

### [TypeScript](#tab/typescript)

:::code language="typescript" source="~/azure-storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-set-and-retrieve-tags.ts" id="Snippet_findBlobsByQuery" :::

---

And example output for this function shows the matched blobs and their tags, based on the console.log code in the preceding function:

|Response|
|-|
|Blob 1: set-tags-1650565920363-query-by-tag-blob-a-1.txt - {"createdOn":"2022-01","owner":"PhillyProject","project":"set-tags-1650565920363"}|

## Resources

To learn more about how to use index tags to manage and find data using the Azure Blob Storage client library for JavaScript, see the following resources.

### Code samples

- View [JavaScript](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide/set-and-retrieve-blob-tags.js) and [TypeScript](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-set-and-retrieve-tags.ts) code samples from this article (GitHub)

### REST API operations

The Azure SDK for JavaScript contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar JavaScript paradigms. The client library methods for managing and using blob index tags use the following REST API operations:

- [Get Blob Tags](/rest/api/storageservices/get-blob-tags) (REST API)
- [Set Blob Tags](/rest/api/storageservices/set-blob-tags) (REST API)
- [Find Blobs by Tags](/rest/api/storageservices/find-blobs-by-tags) (REST API)

[!INCLUDE [storage-dev-guide-resources-javascript](../../../includes/storage-dev-guides/storage-dev-guide-resources-javascript.md)]

### See also

- [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md)
- [Use blob index tags to manage and find data on Azure Blob Storage](storage-blob-index-how-to.md)
