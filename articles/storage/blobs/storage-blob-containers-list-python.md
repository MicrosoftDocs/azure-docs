---
title: List blob containers with Python - Azure Storage 
description: Learn how to list blob containers in your Azure Storage account using the Python client library.
services: storage
author: pauljewellmsft

ms.service: storage
ms.topic: how-to
ms.date: 11/16/2022
ms.author: pauljewell
ms.subservice: blobs
ms.devlang: python
ms.custom: devx-track-python, devguide-python
---

# List blob containers using the Python client library

When you list the containers in an Azure Storage account from your code, you can specify several options to manage how results are returned from Azure Storage. This article shows how to list containers using the [Azure Storage client library for Python](/python/api/overview/azure/storage).

> [!NOTE]
> The examples in this article assume that you've created a [BlobServiceClient](/java/api/com.azure.storage.blob.blobserviceclient) object by using the guidance in the [Get started with Azure Blob Storage and Python](storage-blob-python-get-started.md) article.

## Understand container listing options

To list containers in your storage account, call the following method:

- BlobServiceClient.[listBlobContainers](/java/api/com.azure.storage.blob.blobserviceclient#com-azure-storage-blob-blobserviceclient-listblobcontainers())

The overloads for this method provide additional options for managing how containers are returned by the listing operation. These options are described in the following sections.

### Manage how many results are returned

By default, a listing operation returns up to 5000 results at a time. To return a smaller set of results, provide a nonzero value for the size of the page of results to return.

If your storage account contains more than 5000 containers, or if you've specified a page size such that the listing operation returns a subset of containers in the storage account, Azure Storage returns a *continuation token* with the list of containers. A continuation token is an opaque value that you can use to retrieve the next set of results from Azure Storage.

In your code, check the value of the continuation token to determine whether it's empty. When the continuation token is empty, then the set of results is complete. If the continuation token isn't empty, then call the listing method again, passing in the continuation token to retrieve the next set of results, until the continuation token is empty.

### Filter results with a prefix

To filter the list of containers, specify a string for the `prefix` parameter. The prefix string can include one or more characters. Azure Storage then returns only the containers whose names start with that prefix.

## Example: List containers

:::code language="python" source="~/azure-storage-snippets/blobs/howto/Python/blob-devguide/blob-devguide-containers/container-list.py" id="Snippet_ListContainers":::

## See also

- [View code sample in GitHub](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/Python/blob-devguide/blob-devguide-containers/container-list.py)
- [Quickstart: Azure Blob Storage client library for Python](storage-quickstart-blobs-python.md)
- [List Containers](/rest/api/storageservices/list-containers2) (REST API)
- [Enumerating Blob Resources](/rest/api/storageservices/enumerating-blob-resources)