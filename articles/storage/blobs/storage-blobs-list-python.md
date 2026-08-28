---
title: List blobs with Python
titleSuffix: Azure Storage
description: Learn how to list blobs in your storage account using the Azure Storage client library for Python. Code examples show how to list blobs in a flat listing, or how to list blobs hierarchically, as though they were organized into directories or folders.
services: storage
author: stevenmatthew

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 08/05/2024
ms.author: shaas
ms.devlang: python
ms.custom: devx-track-python, devguide-python
# Customer intent: "As a Python developer, I want to list blobs in my Azure Storage account using the client library, so that I can manage and organize my data efficiently."
---

# List blobs with Python

[!INCLUDE [storage-dev-guide-selector-list-blob](../../../includes/storage-dev-guides/storage-dev-guide-selector-list-blob.md)]

This article shows how to list blobs by using the [Azure Storage client library for Python](/python/api/overview/azure/storage).

To learn about listing blobs by using asynchronous APIs, see [List blobs asynchronously](#list-blobs-asynchronously).

[!INCLUDE [storage-dev-guide-prereqs-python](../../../includes/storage-dev-guides/storage-dev-guide-prereqs-python.md)]

## Set up your environment

[!INCLUDE [storage-dev-guide-project-setup-python](../../../includes/storage-dev-guides/storage-dev-guide-project-setup-python.md)]

#### Add import statements

Add the following `import` statements:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_list_blobs.py" id="Snippet_imports":::

#### Authorization

The authorization mechanism must have the necessary permissions to list a blob. For authorization with Microsoft Entra ID (recommended), you need the Azure RBAC built-in role **Storage Blob Data Reader** or higher. To learn more, see the authorization guidance for [List Blobs (REST API)](/rest/api/storageservices/list-blobs#authorization).

[!INCLUDE [storage-dev-guide-create-client-python](../../../includes/storage-dev-guides/storage-dev-guide-create-client-python.md)]

## About blob listing options

When you list blobs from your code, you can specify many options to manage how results return from Azure Storage. You can specify the number of results to return in each set of results, and then retrieve the subsequent sets. You can specify a prefix to return blobs whose names begin with that character or string. You can list blobs in a flat listing structure, or hierarchically. A hierarchical listing returns blobs as though they were organized into folders.

To list the blobs in a container by using a flat listing, call one of these methods:

- [ContainerClient.list_blobs](/python/api/azure-storage-blob/azure.storage.blob.containerclient#azure-storage-blob-containerclient-list-blobs) (along with the name, optionally include metadata, tags, and other information associated with each blob)
- [ContainerClient.list_blob_names](/python/api/azure-storage-blob/azure.storage.blob.containerclient#azure-storage-blob-containerclient-list-blobs) (only returns blob name)

To list the blobs in a container by using a hierarchical listing, call the following method:

- [ContainerClient.walk_blobs](/python/api/azure-storage-blob/azure.storage.blob.containerclient#azure-storage-blob-containerclient-walk-blobs) (along with the name, optionally include metadata, tags, and other information associated with each blob)

### Filter results with a prefix

To filter the list of blobs, specify a string for the `name_starts_with` keyword argument. The prefix string can include one or more characters. Azure Storage returns only the blobs whose names start with that prefix.

### Flat listing versus hierarchical listing

Blobs in Azure Storage are organized in a flat paradigm, rather than a hierarchical paradigm (like a classic file system). However, you can organize blobs into *virtual directories* to mimic a folder structure. A virtual directory forms part of the name of the blob and is indicated by the delimiter character.

To organize blobs into virtual directories, use a delimiter character in the blob name. The default delimiter character is a forward slash (/), but you can specify any character as the delimiter.

If you name your blobs by using a delimiter, you can choose to list blobs hierarchically. For a hierarchical listing operation, Azure Storage returns any virtual directories and blobs beneath the parent object. You can call the listing operation recursively to traverse the hierarchy, similar to how you would traverse a classic file system programmatically.

## Use a flat listing

By default, a listing operation returns blobs in a flat listing. In a flat listing, blobs aren't organized by virtual directory.

The following example lists the blobs in the specified container by using a flat listing:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_list_blobs.py" id="Snippet_list_blobs_flat":::

Sample output is similar to:

```console
List blobs flat:
Name: file4.txt
Name: folderA/file1.txt
Name: folderA/file2.txt
Name: folderA/folderB/file3.txt
```

You can also specify options to filter list results or show more information. The following example lists blobs and blob tags:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_list_blobs.py" id="Snippet_list_blobs_flat_options":::

Sample output is similar to:

```console
List blobs flat:
Name: file4.txt, Tags: None
Name: folderA/file1.txt, Tags: None
Name: folderA/file2.txt, Tags: None
Name: folderA/folderB/file3.txt, Tags: {'tag1': 'value1', 'tag2': 'value2'}
```

> [!NOTE]
> The sample output shown assumes that you have a storage account with a flat namespace. If you enable the hierarchical namespace feature for your storage account, directories aren't virtual. Instead, they're concrete, independent objects. As a result, directories appear in the list as zero-length blobs.</br></br>For an alternative listing option when working with a hierarchical namespace, see [List directory contents (Azure Data Lake Storage)](data-lake-storage-directory-file-acl-python.md#list-directory-contents).

## Use a hierarchical listing

When you call a listing operation hierarchically, Azure Storage returns the virtual directories and blobs at the first level of the hierarchy.

To list blobs hierarchically, use the following method:

- [ContainerClient.walk_blobs](/python/api/azure-storage-blob/azure.storage.blob.containerclient#azure-storage-blob-containerclient-walk-blobs)

The following example lists the blobs in the specified container using a hierarchical listing:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_list_blobs.py" id="Snippet_list_blobs_hierarchical":::

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
> Blob snapshots can't be listed in a hierarchical listing operation.

## List blobs asynchronously

The Azure Blob Storage client library for Python supports listing blobs asynchronously. To learn more about project setup requirements, see [Asynchronous programming](storage-blob-python-get-started.md#asynchronous-programming).

Follow these steps to list blobs by using asynchronous APIs:

1. Add the following import statements:

    ```python
    import asyncio

    from azure.identity.aio import DefaultAzureCredential
    from azure.storage.blob.aio import BlobServiceClient, ContainerClient, BlobPrefix
    ```

1. Add code to run the program by using `asyncio.run`. This function runs the passed coroutine, `main()` in this example, and manages the `asyncio` event loop. Coroutines are declared by using the async/await syntax. In this example, the `main()` coroutine first creates the top level `BlobServiceClient` by using `async with`, then calls the method that lists the blobs. Only the top level client needs to use `async with`, as other clients created from it share the same connection pool.

    :::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_list_blobs_async.py" id="Snippet_create_client_async":::

1. Add code to list the blobs. The following code example lists blobs by using a flat listing. The code is the same as the synchronous example, except that the method is declared by using the `async` keyword and `async for` is used when calling the `list_blobs` method.

    :::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_list_blobs_async.py" id="Snippet_list_blobs_flat":::

With this basic setup in place, you can implement other examples in this article as coroutines by using async/await syntax.

## List blobs in Apache Arrow format (preview)

> [!IMPORTANT]
> Listing blobs in Apache Arrow format is currently in **PREVIEW**. This scenario requires a **beta (preview) version** of the Azure Blob Storage client library for Python (for example, `azure-storage-blob` **12.31.0b1** or later preview release). Preview features are provided without a service-level agreement and aren't recommended for production workloads. Some features might not be supported, or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This capability is built on the existing `List Blobs` API. Instead of using the default XML, it uses the compact, columnar [Apache Arrow](https://arrow.apache.org/) format as the response format on the wire. You enable it by setting a single option on the container listing call. The Python SDK decodes Apache Arrow behind the scenes and still returns the same `BlobProperties` objects. This approach improves listing throughput and reduces client-side CPU when enumerating large containers. It preserves the response contract that applications rely on.

> [!WARNING]
> Listing blobs in Apache Arrow format isn't supported on storage accounts that have hierarchical namespace (Azure Data Lake Storage) enabled.

To request Apache Arrow-formatted results, set the `response_format` keyword argument to `"arrow"` when you call [ContainerClient.list_blobs](/python/api/azure-storage-blob/azure.storage.blob.containerclient?view=azure-python-preview&preserve-view=true#azure-storage-blob-containerclient-list-blobs) or [ContainerClient.list_blob_names](/python/api/azure-storage-blob/azure.storage.blob.containerclient?view=azure-python-preview&preserve-view=true#azure-storage-blob-containerclient-list-blob-names). When using Apache Arrow output, you can also set the `start_from` and `end_before` keyword arguments to control the range of paths returned.

> [!NOTE]
> Using `response_format="arrow"` requires the [nanoarrow](https://pypi.org/project/nanoarrow/) package to be installed.

The following example lists the blobs in a container and requests the results in Apache Arrow format:

```python
# response_format="arrow" requires the nanoarrow package to be installed
blob_list = container_client.list_blobs(
    name_starts_with="folderA/",
    response_format="arrow",
)

for blob in blob_list:
    print("Name: " + blob.name)
```

## Resources

To learn more about how to list blobs by using the Azure Blob Storage client library for Python, see the following resources.

### Code samples

- View [synchronous](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/python/blob-devguide-py/blob_devguide_list_blobs.py) or [asynchronous](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/python/blob-devguide-py/blob_devguide_list_blobs_async.py) code samples from this article (GitHub).

### REST API operations

The Azure SDK for Python contains libraries that build on top of the Azure REST API. By using these libraries, you can interact with REST API operations through familiar Python paradigms. The client library methods for listing blobs use the following REST API operation:

- [List Blobs](/rest/api/storageservices/list-blobs) (REST API)

[!INCLUDE [storage-dev-guide-resources-python](../../../includes/storage-dev-guides/storage-dev-guide-resources-python.md)]

### See also

- [Enumerating Blob Resources](/rest/api/storageservices/enumerating-blob-resources)
- [Blob versioning](versioning-overview.md)

[!INCLUDE [storage-dev-guide-next-steps-python](../../../includes/storage-dev-guides/storage-dev-guide-next-steps-python.md)]
