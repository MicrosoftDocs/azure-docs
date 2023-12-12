---
title: List blobs with Python
titleSuffix: Azure Storage
description: Learn how to list blobs in your storage account using the Azure Storage client library for Python. Code examples show how to list blobs in a flat listing, or how to list blobs hierarchically, as though they were organized into directories or folders.
services: storage
author: pauljewellmsft

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 11/20/2023
ms.author: pauljewell
ms.devlang: python
ms.custom: devx-track-python, devguide-python
---

# List blobs with Python

[!INCLUDE [storage-dev-guide-selector-list-blob](../../../includes/storage-dev-guides/storage-dev-guide-selector-list-blob.md)]

This article shows how to list blobs using the [Azure Storage client library for Python](/python/api/overview/azure/storage).

To learn about listing blobs using asynchronous APIs, see [List blobs asynchronously](#list-blobs-asynchronously).

## Prerequisites

- This article assumes you already have a project set up to work with the Azure Blob Storage client library for Python. To learn about setting up your project, including package installation, adding `import` statements, and creating an authorized client object, see [Get started with Azure Blob Storage and Python](storage-blob-python-get-started.md).
- To use asynchronous APIs in your code, see the requirements in the [Asynchronous programming](storage-blob-python-get-started.md#asynchronous-programming) section.
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to list blobs. To learn more, see the authorization guidance for the following REST API operation:
    - [List Blobs](/rest/api/storageservices/list-blobs#authorization)

## About blob listing options

When you list blobs from your code, you can specify many options to manage how results are returned from Azure Storage. You can specify the number of results to return in each set of results, and then retrieve the subsequent sets. You can specify a prefix to return blobs whose names begin with that character or string. And you can list blobs in a flat listing structure, or hierarchically. A hierarchical listing returns blobs as though they were organized into folders.

To list the blobs in a container using a flat listing, call one of these methods:

- [ContainerClient.list_blobs](/python/api/azure-storage-blob/azure.storage.blob.containerclient#azure-storage-blob-containerclient-list-blobs) (along with the name, you can optionally include metadata, tags, and other information associated with each blob)
- [ContainerClient.list_blob_names](/python/api/azure-storage-blob/azure.storage.blob.containerclient#azure-storage-blob-containerclient-list-blobs) (only returns blob name)

To list the blobs in a container using a hierarchical listing, call the following method:

- [ContainerClient.walk_blobs](/python/api/azure-storage-blob/azure.storage.blob.containerclient#azure-storage-blob-containerclient-walk-blobs) (along with the name, you can optionally include metadata, tags, and other information associated with each blob)

### Filter results with a prefix

To filter the list of blobs, specify a string for the `name_starts_with` keyword argument. The prefix string can include one or more characters. Azure Storage then returns only the blobs whose names start with that prefix.

### Flat listing versus hierarchical listing

Blobs in Azure Storage are organized in a flat paradigm, rather than a hierarchical paradigm (like a classic file system). However, you can organize blobs into *virtual directories* in order to mimic a folder structure. A virtual directory forms part of the name of the blob and is indicated by the delimiter character.

To organize blobs into virtual directories, use a delimiter character in the blob name. The default delimiter character is a forward slash (/), but you can specify any character as the delimiter.

If you name your blobs using a delimiter, then you can choose to list blobs hierarchically. For a hierarchical listing operation, Azure Storage returns any virtual directories and blobs beneath the parent object. You can call the listing operation recursively to traverse the hierarchy, similar to how you would traverse a classic file system programmatically.

## Use a flat listing

By default, a listing operation returns blobs in a flat listing. In a flat listing, blobs aren't organized by virtual directory.

The following example lists the blobs in the specified container using a flat listing:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-list-blobs.py" id="Snippet_list_blobs_flat":::

Sample output is similar to:

```console
List blobs flat:
Name: file4.txt
Name: folderA/file1.txt
Name: folderA/file2.txt
Name: folderA/folderB/file3.txt
```

You can also specify options to filter list results or show additional information. The following example lists blobs and blob tags:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-list-blobs.py" id="Snippet_list_blobs_flat_options":::

Sample output is similar to:

```console
List blobs flat:
Name: file4.txt, Tags: None
Name: folderA/file1.txt, Tags: None
Name: folderA/file2.txt, Tags: None
Name: folderA/folderB/file3.txt, Tags: {'tag1': 'value1', 'tag2': 'value2'}
```

> [!NOTE]
> The sample output shown assumes that you have a storage account with a flat namespace. If you've enabled the hierarchical namespace feature for your storage account, directories are not virtual. Instead, they are concrete, independent objects. As a result, directories appear in the list as zero-length blobs.</br></br>For an alternative listing option when working with a hierarchical namespace, see [List directory contents (Azure Data Lake Storage Gen2)](data-lake-storage-directory-file-acl-python.md#list-directory-contents).

## Use a hierarchical listing

When you call a listing operation hierarchically, Azure Storage returns the virtual directories and blobs at the first level of the hierarchy.

To list blobs hierarchically, use the following method:

- [ContainerClient.walk_blobs](/python/api/azure-storage-blob/azure.storage.blob.containerclient#azure-storage-blob-containerclient-walk-blobs)

The following example lists the blobs in the specified container using a hierarchical listing:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-list-blobs.py" id="Snippet_list_blobs_hierarchical":::

Sample output is similar to:

```console
folderA/
  folderA/folderB/
    folderA/folderB/file3.txt
  folderA/file1.txt
  folderA/file2.txt
file4.txt
```

> [!NOTE]
> Blob snapshots cannot be listed in a hierarchical listing operation.

## List blobs asynchronously

The Azure Blob Storage client library for Python supports listing blobs asynchronously. To learn more about project setup requirements, see [Asynchronous programming](storage-blob-python-get-started.md#asynchronous-programming).

Follow these steps to list blobs using asynchronous APIs:

1. Add the following import statements:

    ```python
    import asyncio

    from azure.identity.aio import DefaultAzureCredential
    from azure.storage.blob.aio import BlobServiceClient, ContainerClient, BlobPrefix
    ```

1. Add code to run the program using `asyncio.run`. This function runs the passed coroutine, `main()` in our example, and manages the `asyncio` event loop. Coroutines are declared with the async/await syntax. In this example, the `main()` coroutine first creates the top level `BlobServiceClient` using `async with`, then calls the method that lists the blobs. Note that only the top level client needs to use `async with`, as other clients created from it share the same connection pool.

    :::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-list-blobs-async.py" id="Snippet_create_client_async":::

1. Add code to list the blobs. The following code example lists blobs using a flat listing. The code is the same as the synchronous example, except that the method is declared with the `async` keyword and the `await` keyword is used when calling the `list_blobs` method.

    :::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-list-blobs-async.py" id="Snippet_list_blobs_flat":::

With this basic setup in place, you can implement other examples in this article as coroutines using async/await syntax.

## Resources

To learn more about how to list blobs using the Azure Blob Storage client library for Python, see the following resources.

### REST API operations

The Azure SDK for Python contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Python paradigms. The client library methods for listing blobs use the following REST API operation:

- [List Blobs](/rest/api/storageservices/list-blobs) (REST API)

### Code samples

- View [synchronous](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/python/blob-devguide-py/blob-devguide-list-blobs.py) or [asynchronous](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/python/blob-devguide-py/blob-devguide-list-blobs-async.py) code samples from this article (GitHub)

[!INCLUDE [storage-dev-guide-resources-python](../../../includes/storage-dev-guides/storage-dev-guide-resources-python.md)]

### See also

- [Enumerating Blob Resources](/rest/api/storageservices/enumerating-blob-resources)
- [Blob versioning](versioning-overview.md)