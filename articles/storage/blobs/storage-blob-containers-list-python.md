---
title: List blob containers with Python
titleSuffix: Azure Storage
description: Learn how to list blob containers in your Azure Storage account using the Python client library.
services: storage
author: pauljewellmsft

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 12/07/2023
ms.author: pauljewell
ms.devlang: python
ms.custom: devx-track-python, devguide-python
---

# List blob containers with Python

[!INCLUDE [storage-dev-guide-selector-list-container](../../../includes/storage-dev-guides/storage-dev-guide-selector-list-container.md)]

When you list the containers in an Azure Storage account from your code, you can specify several options to manage how results are returned from Azure Storage. This article shows how to list containers using the [Azure Storage client library for Python](/python/api/overview/azure/storage).

To learn about listing blob containers using asynchronous APIs, see [List containers asynchronously](#list-containers-asynchronously).

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

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_list_containers.py" id="Snippet_list_containers":::

The following example lists only containers that begin with a prefix specified in the `name_starts_with` parameter:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_list_containers.py" id="Snippet_list_containers_prefix":::

You can also specify a limit for the number of results per page. This example passes in `results_per_page` and paginates the results:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_list_containers.py" id="Snippet_list_containers_pages":::

## List containers asynchronously

The Azure Blob Storage client library for Python supports listing containers asynchronously. To learn more about project setup requirements, see [Asynchronous programming](storage-blob-python-get-started.md#asynchronous-programming).

Follow these steps to list containers using asynchronous APIs:

1. Add the following import statements:

    ```python
    import asyncio

    from azure.identity.aio import DefaultAzureCredential
    from azure.storage.blob.aio import BlobServiceClient
    ```

1. Add code to run the program using `asyncio.run`. This function runs the passed coroutine, `main()` in our example, and manages the `asyncio` event loop. Coroutines are declared with the async/await syntax. In this example, the `main()` coroutine first creates the top level `BlobServiceClient` using `async with`, then calls the method that lists the containers. Note that only the top level client needs to use `async with`, as other clients created from it share the same connection pool.

    :::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_list_containers_async.py" id="Snippet_create_client_async":::

1. Add code to list the containers. The code is the same as the synchronous example, except that the method is declared with the `async` keyword and `async for` is used when calling the `list_containers` method.

    :::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_list_containers_async.py" id="Snippet_list_containers":::

With this basic setup in place, you can implement other examples in this article as coroutines using async/await syntax.

## Resources

To learn more about listing containers using the Azure Blob Storage client library for Python, see the following resources.

### REST API operations

The Azure SDK for Python contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Python paradigms. The client library methods for listing containers use the following REST API operation:

- [List Containers](/rest/api/storageservices/list-containers2) (REST API)

### Code samples

- View [synchronous](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/python/blob-devguide-py/blob_devguide_list_containers.py) or [asynchronous](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/python/blob-devguide-py/blob_devguide_list_containers_async.py) code samples from this article (GitHub)

[!INCLUDE [storage-dev-guide-resources-python](../../../includes/storage-dev-guides/storage-dev-guide-resources-python.md)]

## See also

- [Enumerating Blob Resources](/rest/api/storageservices/enumerating-blob-resources)