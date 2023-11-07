---
title: List blob containers with Python
titleSuffix: Azure Storage
description: Learn how to list blob containers in your Azure Storage account using the Python client library.
services: storage
author: pauljewellmsft

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 10/23/2023
ms.author: pauljewell
ms.devlang: python
ms.custom: devx-track-python, devguide-python
---

# List blob containers with Python

[!INCLUDE [storage-dev-guide-selector-list-container](../../../includes/storage-dev-guides/storage-dev-guide-selector-list-container.md)]

When you list the containers in an Azure Storage account from your code, you can specify several options to manage how results are returned from Azure Storage. This article shows how to list containers using the [Azure Storage client library for Python](/python/api/overview/azure/storage).

## Prerequisites

- This article assumes you already have a project set up to work with the Azure Blob Storage client library for Python. To learn about setting up your project, including package installation, adding `import` statements, and creating an authorized client object, see [Get started with Azure Blob Storage and Python](storage-blob-python-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to list blob containers. To learn more, see the authorization guidance for the following REST API operation:
    - [List Containers](/rest/api/storageservices/list-containers2#authorization)

## About container listing options

When listing containers from your code, you can specify options to manage how results are returned from Azure Storage. You can specify the number of results to return in each set of results, and then retrieve the subsequent sets. You can also filter the results by a prefix, and return container metadata with the results. These options are described in the following sections.

To list containers in a storage account, call the following method:

- [BlobServiceClient.list_containers](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient#azure-storage-blob-blobserviceclient-list-containers)

This method returns an iterable of type [ContainerProperties](/python/api/azure-storage-blob/azure.storage.blob.containerproperties). Containers are ordered lexicographically by name.

### Manage how many results are returned

By default, a listing operation returns up to 5000 results at a time. To return a smaller set of results, provide a nonzero value for the `results_per_page` keyword argument.

### Filter results with a prefix

To filter the list of containers, specify a string or character for the `name_starts_with` keyword argument. The prefix string can include one or more characters. Azure Storage then returns only the containers whose names start with that prefix.

### Include container metadata

To include container metadata with the results, set the `include_metadata` keyword argument to `True`. Azure Storage includes metadata with each container returned, so you don't need to fetch the container metadata separately.

### Include deleted containers

To include soft-deleted containers with the results, set the `include_deleted` keyword argument to `True`.

## Code examples

The following example lists all containers and metadata. You can include container metadata by setting `include_metadata` to `True`:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-containers.py" id="Snippet_list_containers":::

The following example lists only containers that begin with a prefix specified in the `name_starts_with` parameter:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-containers.py" id="Snippet_list_containers_prefix":::

You can also specify a limit for the number of results per page. This example passes in `results_per_page` and paginates the results:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-containers.py" id="Snippet_list_containers_pages":::

## Resources

To learn more about listing containers using the Azure Blob Storage client library for Python, see the following resources.

### REST API operations

The Azure SDK for Python contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Python paradigms. The client library methods for listing containers use the following REST API operation:

- [List Containers](/rest/api/storageservices/list-containers2) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/python/blob-devguide-py/blob-devguide-containers.py)

[!INCLUDE [storage-dev-guide-resources-python](../../../includes/storage-dev-guides/storage-dev-guide-resources-python.md)]

## See also

- [Enumerating Blob Resources](/rest/api/storageservices/enumerating-blob-resources)