---
title: List blob containers with JavaScript - Azure Storage 
description: Learn how to list blob containers in your Azure Storage account using the JavaScript client library.
services: storage
author: normesta

ms.service: storage
ms.topic: how-to
ms.date: 03/28/2022
ms.author: normesta
ms.subservice: blobs
ms.devlang: javascript
ms.custom: devx-track-js
---

# List blob containers with JavaScript

When you list the containers in an Azure Storage account from your code, you can specify a number of options to manage how results are returned from Azure Storage. This article shows how to list containers using the [Azure Storage client library for JavaScript]().

## Understand container listing options

To list containers in your storage account, call the following method:

- [GetBlobContainers]()

The overloads for these methods provide additional options for managing how containers are returned by the listing operation. These options are described in the following sections.

### Manage how many results are returned

By default, a listing operation returns up to 5000 results at a time. To return a smaller set of results, provide a nonzero value for the size of the page of results to return.

If your storage account contains more than 5000 containers, or if you have specified a page size such that the listing operation returns a subset of containers in the storage account, then Azure Storage returns a *continuation token* with the list of containers. A continuation token is an opaque value that you can use to retrieve the next set of results from Azure Storage.

In your code, check the value of the continuation token to determine whether it is empty. When the continuation token is empty, then the set of results is complete. If the continuation token is not empty, then call the listing method again, passing in the continuation token to retrieve the next set of results, until the continuation token is empty.

```javascript

```

### Filter results with a prefix

To filter the list of containers, specify a string for the `prefix` parameter. The prefix string can include one or more characters. Azure Storage then returns only the containers whose names start with that prefix.

```javascript

```

### Return metadata

To return container metadata with the results, specify the **Metadata** value for the [BlobContainerTraits]() enum. Azure Storage includes metadata with each container returned, so you do not need to also fetch the container metadata separately.

```javascript

```

## Example: List containers

The following example lists the containers in a storage account that begins with a specified prefix. The example lists containers that begin with the specified prefix and returns the specified number of results per call to the listing operation. It then uses the continuation token to get the next segment of results. The example also returns container metadata with the results.

```javascript

```

## See also

- [Get started with Azure Blob Storage and JavaScript](storage-blob-dotnet-get-started.md)
- [List Containers](/rest/api/storageservices/list-containers2)
- [Enumerating Blob Resources](/rest/api/storageservices/enumerating-blob-resources)
