---
title: List blobs with JavaScript
titleSuffix: Azure Storage
description: Learn how to list blobs in your storage account using the Azure Storage client library for JavaScript. Code examples show how to list blobs in a flat listing, or how to list blobs hierarchically, as though they were organized into directories or folders.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 08/16/2023

ms.devlang: javascript
ms.custom: devx-track-js, devguide-js
---

# List blobs with JavaScript

[!INCLUDE [storage-dev-guide-selector-list-blob](../../../includes/storage-dev-guides/storage-dev-guide-selector-list-blob.md)]

This article shows how to list blobs using the [Azure Storage client library for JavaScript](https://www.npmjs.com/package/@azure/storage-blob).

## Prerequisites

- The examples in this article assume you already have a project set up to work with the Azure Blob Storage client library for JavaScript. To learn about setting up your project, including package installation, importing modules, and creating an authorized client object to work with data resources, see [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to list blobs. To learn more, see the authorization guidance for the following REST API operation:
    - [List Blobs](/rest/api/storageservices/list-blobs#authorization)

## About blob listing options

When you list blobs from your code, you can specify a number of options to manage how results are returned from Azure Storage. You can specify the number of results to return in each set of results, and then retrieve the subsequent sets. You can specify a prefix to return blobs whose names begin with that character or string. And you can list blobs in a flat listing structure, or hierarchically. A hierarchical listing returns blobs as though they were organized into folders.

To list the blobs in a storage account, create a [ContainerClient](storage-blob-javascript-get-started.md#create-a-containerclient-object) then call one of these methods:

- ContainerClient.[listBlobsByHierarcy](/javascript/api/@azure/storage-blob/containerclient#@azure-storage-blob-containerclient-listblobsbyhierarchy)
- ContainerClient.[listBlobsFlat](/javascript/api/@azure/storage-blob/containerclient#@azure-storage-blob-containerclient-listblobsflat)

Related functionality can be found in the following methods:

- BlobServiceClient.[findBlobsByTag](/javascript/api/@azure/storage-blob/blobserviceclient#@azure-storage-blob-blobserviceclient-findblobsbytags)
- ContainerClient.[findBlobsByTag](/javascript/api/@azure/storage-blob/containerclient#@azure-storage-blob-containerclient-findblobsbytags)

### Manage how many results are returned

By default, a listing operation returns up to 5000 results at a time, but you can specify the number of results that you want each listing operation to return. The examples presented in this article show you how to return results in pages. To learn more about pagination concepts, see [Pagination with the Azure SDK for JavaScript](/azure/developer/javascript/core/use-azure-sdk#asynchronous-paging-of-results).

### Filter results with a prefix

To filter the list of blobs, specify a string for the `prefix` property in [ContainerListBlobsOptions](/javascript/api/@azure/storage-blob/containerlistblobsoptions). The prefix string can include one or more characters. Azure Storage then returns only the blobs whose names start with that prefix.

```javascript
const listOptions = {
    includeCopy: false,                 // include metadata from previous copies
    includeDeleted: false,              // include deleted blobs 
    includeDeletedWithVersions: false,  // include deleted blobs with versions
    includeLegalHold: false,            // include legal hold
    includeMetadata: true,              // include custom metadata
    includeSnapshots: true,             // include snapshots
    includeTags: true,                  // include indexable tags
    includeUncommitedBlobs: false,      // include uncommitted blobs
    includeVersions: false,             // include all blob version
    prefix: ''                          // filter by blob name prefix
};
```

### Return metadata

You can return blob metadata with the results by specifying the `includeMetadata` property in the [list options](/javascript/api/@azure/storage-blob/containerlistblobsoptions).

### Flat listing versus hierarchical listing

Blobs in Azure Storage are organized in a flat paradigm, rather than a hierarchical paradigm (like a classic file system). However, you can organize blobs into *virtual directories* in order to mimic a folder structure. A virtual directory forms part of the name of the blob and is indicated by the delimiter character.

To organize blobs into virtual directories, use a delimiter character in the blob name. The default delimiter character is a forward slash (/), but you can specify any character as the delimiter.

If you name your blobs using a delimiter, then you can choose to list blobs hierarchically. For a hierarchical listing operation, Azure Storage returns any virtual directories and blobs beneath the parent object. You can call the listing operation recursively to traverse the hierarchy, similar to how you would traverse a classic file system programmatically.

## Use a flat listing

By default, a listing operation returns blobs in a flat listing. In a flat listing, blobs are not organized by virtual directory.

The following example lists the blobs in the specified container using a flat listing.

```javascript
async function listBlobsFlatWithPageMarker(containerClient) {

  // page size - artificially low as example
  const maxPageSize = 2;

  let i = 1;
  let marker;

  // some options for filtering list
  const listOptions = {
    includeMetadata: false,
    includeSnapshots: false,
    includeTags: false,
    includeVersions: false,
    prefix: ''
  };

  let iterator = containerClient.listBlobsFlat(listOptions).byPage({ maxPageSize });
  let response = (await iterator.next()).value;

  // Prints blob names
  for (const blob of response.segment.blobItems) {
    console.log(`Flat listing: ${i++}: ${blob.name}`);
  }

  // Gets next marker
  marker = response.continuationToken;

  // Passing next marker as continuationToken    
  iterator = containerClient.listBlobsFlat().byPage({ 
      continuationToken: marker, 
      maxPageSize: maxPageSize * 2 
  });
  response = (await iterator.next()).value;

  // Prints next blob names
  for (const blob of response.segment.blobItems) {
    console.log(`Flat listing: ${i++}: ${blob.name}`);
  }
}
```

The sample output is similar to:

```console
Flat listing: 1: a1
Flat listing: 2: a2
Flat listing: 3: folder1/b1
Flat listing: 4: folder1/b2
Flat listing: 5: folder2/sub1/c
Flat listing: 6: folder2/sub1/d
```

> [!NOTE]
> The sample output shown assumes that you have a storage account with a flat namespace. If you've enabled the hierarchical namespace feature for your storage account, directories are not virtual. Instead, they are concrete, independent objects. As a result, directories appear in the list as zero-length blobs.</br></br>For an alternative listing option when working with a hierarchical namespace, see [List directory contents (Azure Data Lake Storage Gen2)](data-lake-storage-directory-file-acl-javascript.md#list-directory-contents).

## Use a hierarchical listing

When you call a listing operation hierarchically, Azure Storage returns the virtual directories and blobs at the first level of the hierarchy.

To list blobs hierarchically, call the [BlobContainerClient.listBlobsByHierarchy](/javascript/api/@azure/storage-blob/containerclient#@azure-storage-blob-containerclient-listblobsbyhierarchy) method.

The following example lists the blobs in the specified container using a hierarchical listing, with an optional segment size specified, and writes the blob name to the console window.

```javascript
// Recursively list virtual folders and blobs
// Pass an empty string for prefixStr to list everything in the container
async function listBlobHierarchical(containerClient, prefixStr) {

  // page size - artificially low as example
  const maxPageSize = 2;

  // some options for filtering list
  const listOptions = {
    includeMetadata: false,
    includeSnapshots: false,
    includeTags: false,
    includeVersions: false,
    prefix: prefixStr
  };

  let delimiter = '/';
  let i = 1;
  console.log(`Folder ${delimiter}${prefixStr}`);

  for await (const response of containerClient
    .listBlobsByHierarchy(delimiter, listOptions)
    .byPage({ maxPageSize })) {

    console.log(`   Page ${i++}`);
    const segment = response.segment;

    if (segment.blobPrefixes) {

      // Do something with each virtual folder
      for await (const prefix of segment.blobPrefixes) {
        // build new prefix from current virtual folder
        await listBlobHierarchical(containerClient, prefix.name);
      }
    }

    for (const blob of response.segment.blobItems) {

      // Do something with each blob
      console.log(`\tBlobItem: name - ${blob.name}`);
    }
  }
}
```

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
> Blob snapshots cannot be listed in a hierarchical listing operation.

## Resources

To learn more about how to list blobs using the Azure Blob Storage client library for JavaScript, see the following resources.

### REST API operations

The Azure SDK for JavaScript contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar JavaScript paradigms. The client library methods for listing blobs use the following REST API operation:

- [List Blobs](/rest/api/storageservices/list-blobs) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide/list-blobs.js)

[!INCLUDE [storage-dev-guide-resources-javascript](../../../includes/storage-dev-guides/storage-dev-guide-resources-javascript.md)]

### See also

- [Enumerating Blob Resources](/rest/api/storageservices/enumerating-blob-resources)
- [Blob versioning](versioning-overview.md)
