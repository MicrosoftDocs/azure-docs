---
title: List blobs with JavaScript
titleSuffix: Azure Storage
description: Learn how to list blobs in your storage account using the Azure Storage client library for JavaScript. Code examples show how to list blobs in a flat listing, or how to list blobs hierarchically, as though they were organized into directories or folders.
services: storage
author: stevenmatthew
ms.author: shaas

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 10/28/2024

ms.devlang: javascript
ms.custom: devx-track-js, devguide-js, devx-track-ts, devguide-ts
# Customer intent: As a JavaScript developer, I want to list blobs in Azure Blob Storage, so that I can efficiently retrieve and manage my storage resources using either flat or hierarchical structures based on my project's requirements.
---

# List blobs with JavaScript

[!INCLUDE [storage-dev-guide-selector-list-blob](../../../includes/storage-dev-guides/storage-dev-guide-selector-list-blob.md)]

This article shows how to list blobs using the [Azure Storage client library for JavaScript](https://www.npmjs.com/package/@azure/storage-blob).

## Prerequisites

- The examples in this article assume you already have a project set up to work with the Azure Blob Storage client library for JavaScript. To learn about setting up your project, including package installation, importing modules, and creating an authorized client object to work with data resources, see [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to list blobs. To learn more, see the authorization guidance for the following REST API operation:
    - [List Blobs](/rest/api/storageservices/list-blobs#authorization)

## About blob listing options

When you list blobs from your code, you can specify several options to manage how results are returned from Azure Storage. You can specify the number of results to return in each set of results, and then retrieve the subsequent sets. You can specify a prefix to return blobs whose names begin with that character or string. And you can list blobs in a flat listing structure, or hierarchically. A hierarchical listing returns blobs as though they were organized into folders.

To list the blobs in a container using a flat listing, call the following method:

- [ContainerClient.listBlobsFlat](/javascript/api/@azure/storage-blob/containerclient#@azure-storage-blob-containerclient-listblobsflat)

To list the blobs in a container using a hierarchical listing, call the following method:

- ContainerClient.[listBlobsByHierarchy](/javascript/api/@azure/storage-blob/containerclient#@azure-storage-blob-containerclient-listblobsbyhierarchy)

### Manage how many results are returned

By default, a listing operation returns up to 5000 results at a time, but you can specify the number of results that you want each listing operation to return. The examples presented in this article show you how to return results in pages. To learn more about pagination concepts, see [Pagination with the Azure SDK for JavaScript](/azure/developer/javascript/core/use-azure-sdk#asynchronous-paging-of-results).

### Filter results with a prefix

To filter the list of blobs, specify a string for the `prefix` property in [ContainerListBlobsOptions](/javascript/api/@azure/storage-blob/containerlistblobsoptions). The prefix string can include one or more characters. Azure Storage returns only the blobs whose names start with that prefix. For example, passing the prefix string `sample-` returns only blobs whose names start with `sample-`.

### Include blob metadata or other information

To include blob metadata with the results, set the `includeMetadata` property to `true` as part of [ContainerListBlobsOptions](/javascript/api/@azure/storage-blob/containerlistblobsoptions). You can also include snapshots, tags, or versions in the results by setting the appropriate property to `true`.

### Flat listing versus hierarchical listing

Blobs in Azure Storage are organized in a flat paradigm, rather than a hierarchical paradigm (like a classic file system). However, you can organize blobs into *virtual directories* to mimic a folder structure. A virtual directory forms part of the name of the blob and is indicated by the delimiter character.

To organize blobs into virtual directories, use a delimiter character in the blob name. The default delimiter character is a forward slash (/), but you can specify any character as the delimiter.

If you name your blobs by using a delimiter, you can choose to list blobs hierarchically. For a hierarchical listing operation, Azure Storage returns any virtual directories and blobs beneath the parent object. You can call the listing operation recursively to traverse the hierarchy, similar to how you would traverse a classic file system programmatically.

## Use a flat listing

By default, a listing operation returns blobs in a flat listing. In a flat listing, blobs aren't organized by virtual directory.

The following example lists the blobs in the specified container by using a flat listing. This example includes blob snapshots and blob metadata, if they exist:

### [JavaScript](#tab/javascript)

:::code language="javascript" source="~/azure-storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/list-blobs.js" id="snippet_listBlobsFlatWithPageMarker":::

### [TypeScript](#tab/typescript)

:::code language="typescript" source="~/azure-storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blobs-list.ts" id="snippet_listBlobsFlatWithPageMarker" :::

---

The sample output is similar to:

```console
Blobs flat list (by page):
- Page:
  - a1
  - a2
- Page:
  - folder1/b1
  - folder1/b2
- Page:
  - folder2/sub1/c
  - folder2/sub1/d
```

> [!NOTE]
> The sample output shown assumes that you have a storage account with a flat namespace. If you enable the hierarchical namespace feature for your storage account, directories aren't virtual. Instead, they're concrete, independent objects. As a result, directories appear in the list as zero-length blobs.</br></br>For an alternative listing option when working with a hierarchical namespace, see [List directory contents (Azure Data Lake Storage)](data-lake-storage-directory-file-acl-javascript.md#list-directory-contents).

## Use a hierarchical listing

When you call a listing operation hierarchically, Azure Storage returns the virtual directories and blobs at the first level of the hierarchy.

To list blobs hierarchically, use the following method:

- [BlobContainerClient.listBlobsByHierarchy](/javascript/api/@azure/storage-blob/containerclient#@azure-storage-blob-containerclient-listblobsbyhierarchy)

The following example lists the blobs in the specified container using a hierarchical listing. In this example, the prefix parameter is initially set to an empty string to list all blobs in the container. The example then calls the listing operation recursively to traverse the virtual directory hierarchy and list blobs.

### [JavaScript](#tab/javascript)

:::code language="javascript" source="~/azure-storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/list-blobs.js" id="snippet_listBlobsHierarchicalWithPageMarker":::

### [TypeScript](#tab/typescript)

:::code language="typescript" source="~/azure-storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blobs-list.ts" id="snippet_listBlobsHierarchicalWithPageMarker" :::

---

The sample output is similar to:

```console
Folder /
   Page 1
        BlobItem: name - a1
        BlobItem: name - a2
   Page 2
Folder /folder1/
   Page 1
        BlobItem: name - folder1/b1
        BlobItem: name - folder1/b2
Folder /folder2/
   Page 1
Folder /folder2/sub1/
   Page 1
        BlobItem: name - folder2/sub1/c
        BlobItem: name - folder2/sub1/d
   Page 2
        BlobItem: name - folder2/sub1/e
```

> [!NOTE]
> Blob snapshots can't be listed in a hierarchical listing operation.

## List blobs in Apache Arrow format (preview)

> [!IMPORTANT]
> Listing blobs in Apache Arrow format is currently in **PREVIEW**. This scenario requires a **beta (preview) version** of the Azure Blob Storage client library for JavaScript (for example, `@azure/storage-blob` **12.34.0-beta.1** or later preview release). Preview features are provided without a service-level agreement and aren't recommended for production workloads. Some features might not be supported, or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This capability is built on the existing `List Blobs` API. Instead of using the default XML, it uses the compact, columnar [Apache Arrow](https://arrow.apache.org/) format as the response format on the wire. You enable it by setting a single option on the container listing call. The JavaScript SDK decodes Apache Arrow behind the scenes and still returns the same blob item objects. This approach improves listing throughput and reduces client-side CPU when enumerating large containers. It preserves the response contract that applications rely on.

> [!WARNING]
> Listing blobs in Apache Arrow format isn't supported on storage accounts that have hierarchical namespace (Azure Data Lake Storage) enabled.

To request Apache Arrow-formatted results, set the `responseFormat` property of the listing options to `StorageResponseFormat.Arrow`, then pass the options to [ContainerClient.listBlobsFlat](/javascript/api/@azure/storage-blob/containerclient?view=azure-node-preview&preserve-view=true#@azure-storage-blob-containerclient-listblobsflat). Import the `StorageResponseFormat` enum from `@azure/storage-blob`.

The following example lists the blobs in a container and requests the results in Apache Arrow format:

```javascript
const { StorageResponseFormat } = require("@azure/storage-blob");

const options = {
  prefix: "FolderA/",
  responseFormat: StorageResponseFormat.Arrow,
};

for await (const blob of containerClient.listBlobsFlat(options)) {
  console.log("Blob name: " + blob.name);
}
```

## Resources

To learn more about how to list blobs by using the Azure Blob Storage client library for JavaScript, see the following resources.

### Code samples

- View [JavaScript](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide/list-blobs.js) and [TypeScript](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blobs-list.ts) code samples from this article on GitHub.

### REST API operations

The Azure SDK for JavaScript contains libraries that build on top of the Azure REST API. By using these libraries, you can interact with REST API operations through familiar JavaScript paradigms. The client library methods for listing blobs use the following REST API operation:

- [List Blobs](/rest/api/storageservices/list-blobs) (REST API)

[!INCLUDE [storage-dev-guide-resources-javascript](../../../includes/storage-dev-guides/storage-dev-guide-resources-javascript.md)]

### See also

- [Enumerating Blob Resources](/rest/api/storageservices/enumerating-blob-resources)
- [Blob versioning](versioning-overview.md)

