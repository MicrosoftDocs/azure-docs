---
title: List blob containers with JavaScript or TypeScript
titleSuffix: Azure Storage 
description: Learn how to list blob containers in your Azure Storage account using the JavaScript client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 10/28/2024

ms.devlang: javascript
ms.custom: devx-track-js, devguide-js, devx-track-ts, devguide-ts
---

# List blob containers with JavaScript or TypeScript

[!INCLUDE [storage-dev-guide-selector-list-container](../../../includes/storage-dev-guides/storage-dev-guide-selector-list-container.md)]

When you list the containers in an Azure Storage account from your code, you can specify several options to manage how results are returned from Azure Storage. This article shows how to list containers using the [Azure Storage client library for JavaScript](https://www.npmjs.com/package/@azure/storage-blob).

## Prerequisites

- The examples in this article assume you already have a project set up to work with the Azure Blob Storage client library for JavaScript. To learn about setting up your project, including package installation, importing modules, and creating an authorized client object to work with data resources, see [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to list blob containers. To learn more, see the authorization guidance for the following REST API operation:
    - [List Containers](/rest/api/storageservices/list-containers2#authorization)

## About container listing options

When listing containers from your code, you can specify options to manage how results are returned from Azure Storage. You can specify the number of results to return in each set of results, and then retrieve the subsequent sets. You can also filter the results by a prefix, and return container metadata with the results. These options are described in the following sections.

To list containers in your storage account, call the following method:

- [BlobServiceClient.listContainers](/javascript/api/@azure/storage-blob/blobserviceclient#@azure-storage-blob-blobserviceclient-listcontainers)

This method returns a list of [ContainerItem](/javascript/api/@azure/storage-blob/containeritem) objects. Containers are ordered lexicographically by name.

### Manage how many results are returned

By default, a listing operation returns up to 5000 results at a time, but you can specify the number of results that you want each listing operation to return. The examples presented in this article show you how to return results in pages.

### Filter results with a prefix

To filter the list of containers, specify a string for the `prefix` parameter in [ServiceListContainersOptions](/javascript/api/@azure/storage-blob/servicelistcontainersoptions). The prefix string can include one or more characters. Azure Storage then returns only the containers whose names start with that prefix.

### Include container metadata

To include container metadata with the results, set the `includeMetadata` parameter to `true` in [ServiceListContainersOptions](/javascript/api/@azure/storage-blob/servicelistcontainersoptions). Azure Storage includes metadata with each container returned, so you don't need to fetch the container metadata separately.

### Include deleted containers

To include soft-deleted containers with the results, set the `includeDeleted` parameter in [ServiceListContainersOptions](/javascript/api/@azure/storage-blob/servicelistcontainersoptions).

## Code example: List containers

The following example asynchronously lists the containers in a storage account that begin with a specified prefix. The example lists containers that begin with the specified prefix and returns the specified number of results per call to the listing operation. It then uses the continuation token to get the next segment of results. The example also returns container metadata with the results.

## [JavaScript](#tab/javascript)

:::code language="javascript" source="~/azure-storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/list-containers.js" id="snippet_listContainers":::

## [TypeScript](#tab/typescript)

:::code language="typescript" source="~/azure-storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/containers-list.ts" id="snippet_listContainers":::

---

## Resources

To learn more about listing containers using the Azure Blob Storage client library for JavaScript, see the following resources.

### REST API operations

The Azure SDK for JavaScript contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar JavaScript paradigms. The client library methods for listing containers use the following REST API operation:

- [List Containers](/rest/api/storageservices/list-containers2) (REST API)

### Code samples

- View [JavaScript](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide/list-containers.js) and [TypeScript](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/containers-list.ts) code samples from this article (GitHub)

[!INCLUDE [storage-dev-guide-resources-javascript](../../../includes/storage-dev-guides/storage-dev-guide-resources-javascript.md)]

## See also

- [Enumerating Blob Resources](/rest/api/storageservices/enumerating-blob-resources)

[!INCLUDE [storage-dev-guide-resources-javascript](../../../includes/storage-dev-guides/storage-dev-guide-resources-javascript.md)]
