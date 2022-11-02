---
title: List blob containers with JavaScript - Azure Storage 
description: Learn how to list blob containers in your Azure Storage account using the JavaScript client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: storage
ms.topic: how-to
ms.date: 03/28/2022

ms.subservice: blobs
ms.devlang: javascript
ms.custom: devx-track-js
---

# List blob containers with JavaScript

When you list the containers in an Azure Storage account from your code, you can specify a number of options to manage how results are returned from Azure Storage. This article shows how to list containers using the [Azure Storage client library for JavaScript](https://www.npmjs.com/package/@azure/storage-blob).

The [sample code snippets](https://github.com/Azure-Samples/AzureStorageSnippets/tree/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide) are available in GitHub as runnable Node.js files.

## Understand container listing options

To list containers in your storage account, call the following method:

- BlobServiceClient.[listContainers](/javascript/api/@azure/storage-blob/blobserviceclient#@azure-storage-blob-blobserviceclient-listcontainers)

### List containers with optional prefix

By default, a listing operation returns up to 5000 results at a time. 

The BlobServiceClient.[listContainers](/javascript/api/@azure/storage-blob/blobserviceclient#@azure-storage-blob-blobserviceclient-listcontainers) returns a list of [ContainerItem](/javascript/api/@azure/storage-blob/containeritem) objects. Use the containerItem.name to create a [ContainerClient](/javascript/api/@azure/storage-blob/containerclient) in order to get a more complete [ContainerProperties](/javascript/api/@azure/storage-blob/containerproperties) object.

```javascript
async function listContainers(blobServiceClient, containerNamePrefix) {

  const options = {
    includeDeleted: false,
    includeMetadata: true,
    includeSystem: true,
    prefix: containerNamePrefix
  }

  for await (const containerItem of blobServiceClient.listContainers(options)) {

    // ContainerItem
    console.log(`For-await list: ${containerItem.name}`);

    // ContainerClient
    const containerClient = blobServiceClient.getContainerClient(containerItem.name);

    // ... do something with container 
  }
}
```

## List containers with paging

To return a smaller set of results, provide a nonzero value for the size of the page of results to return.

If your storage account contains more than 5000 containers, or if you have specified a page size such that the listing operation returns a subset of containers in the storage account, then Azure Storage returns a *continuation token* with the list of containers. A continuation token is an opaque value that you can use to retrieve the next set of results from Azure Storage.

In your code, check the value of the continuation token to determine whether it is empty. When the continuation token is empty, then the set of results is complete. If the continuation token is not empty, then call the listing method again, passing in the continuation token to retrieve the next set of results, until the continuation token is empty.

```javascript
async function listContainersWithPagingMarker(blobServiceClient) {

  // add prefix to filter list
  const containerNamePrefix = '';

  // page size
  const maxPageSize = 2;

  const options = {
    includeDeleted: false,
    includeMetadata: true,
    includeSystem: true,
    prefix: containerNamePrefix
  }
  
  let i = 1;
  let marker;
  let iterator = blobServiceClient.listContainers(options).byPage({ maxPageSize });
  let response = (await iterator.next()).value;

  // Prints 2 container names
  if (response.containerItems) {
    for (const container of response.containerItems) {
      console.log(`IteratorPaged: Container ${i++}: ${container.name}`);
    }
  }

  // Gets next marker
  marker = response.continuationToken;

  // Passing next marker as continuationToken
  iterator = blobServiceClient.listContainers().byPage({ continuationToken: marker, maxPageSize: maxPageSize * 2 });
  response = (await iterator.next()).value;

  // Print next 4 container names
  if (response.containerItems) {
    for (const container of response.containerItems) {
      console.log(`Container ${i++}: ${container.name}`);
    }
  }
}
```

Use the options parameter to the **listContainers** method to filter results with a prefix.

### Filter results with a prefix

To filter the list of containers, specify a string for the **prefix** property. The prefix string can include one or more characters. Azure Storage then returns only the containers whose names start with that prefix.

```javascript
async function listContainers(blobServiceClient, containerNamePrefix) {

  const options = {
    includeDeleted: false,
    includeMetadata: true,
    includeSystem: true,

    // filter with prefix
    prefix: containerNamePrefix
  }

  for await (const containerItem of blobServiceClient.listContainers(options)) {

    // do something with containerItem

  }
}
```

### Include metadata in results

To return container metadata with the results, specify the **metadata** value for the BlobContainerTraits enum. Azure Storage includes metadata with each container returned, so you do not need to fetch the container metadata as a separate operation.

```javascript
async function listContainers(blobServiceClient, containerNamePrefix) {

  const options = {
    includeDeleted: false,
    includeSystem: true,
    prefix: containerNamePrefix,

    // include metadata 
    includeMetadata: true,
  }

  for await (const containerItem of blobServiceClient.listContainers(options)) {

    // do something with containerItem

  }
}
```

## See also

- [Get started with Azure Blob Storage and JavaScript](storage-blob-dotnet-get-started.md)
- [List Containers](/rest/api/storageservices/list-containers2)
- [Enumerating Blob Resources](/rest/api/storageservices/enumerating-blob-resources)
