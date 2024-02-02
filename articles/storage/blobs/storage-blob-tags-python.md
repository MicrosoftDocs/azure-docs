---
title: Use blob index tags to manage and find data with Python
titleSuffix: Azure Storage
description: Learn how to categorize, manage, and query for blob objects by using the Python client library.  
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.date: 02/02/2024
ms.service: azure-blob-storage
ms.topic: how-to
ms.devlang: python
ms.custom: devx-track-python, devguide-python
---

# Use blob index tags to manage and find data with Python

[!INCLUDE [storage-dev-guide-selector-index-tags](../../../includes/storage-dev-guides/storage-dev-guide-selector-index-tags.md)]

This article shows how to use blob index tags to manage and find data using the [Azure Storage client library for Python](/python/api/overview/azure/storage).

To learn about setting blob index tags using asynchronous APIs, see [Set blob index tags asynchronously](#set-blob-index-tags-asynchronously).

## Prerequisites

- This article assumes you already have a project set up to work with the Azure Blob Storage client library for Python. To learn about setting up your project, including package installation, adding `import` statements, and creating an authorized client object, see [Get started with Azure Blob Storage and Python](storage-blob-python-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to work with blob index tags. To learn more, see the authorization guidance for the following REST API operations:
    - [Get Blob Tags](/rest/api/storageservices/get-blob-tags#authorization)
    - [Set Blob Tags](/rest/api/storageservices/set-blob-tags#authorization)
    - [Find Blobs by Tags](/rest/api/storageservices/find-blobs-by-tags#authorization)

[!INCLUDE [storage-dev-guide-about-blob-tags](../../../includes/storage-dev-guides/storage-dev-guide-about-blob-tags.md)]

## Set tags

[!INCLUDE [storage-dev-guide-auth-set-blob-tags](../../../includes/storage-dev-guides/storage-dev-guide-auth-set-blob-tags.md)]

You can set tags by using the following method:

- [BlobClient.set_blob_tags](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-set-blob-tags)

The specified tags in this method will replace existing tags. If old values must be preserved, they must be downloaded and included in the call to this method. The following example shows how to set tags:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_blobs_properties_metadata_tags.py" id="Snippet_set_blob_tags":::

You can delete all tags by passing an empty `dict` object into the `set_blob_tags` method:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_blobs_properties_metadata_tags.py" id="Snippet_clear_blob_tags":::

## Get tags

[!INCLUDE [storage-dev-guide-auth-get-blob-tags](../../../includes/storage-dev-guides/storage-dev-guide-auth-get-blob-tags.md)]

You can get tags by using the following method: 

- [BlobClient.get_blob_tags](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-get-blob-tags)

The following example shows how to retrieve and iterate over the blob's tags:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_blobs_properties_metadata_tags.py" id="Snippet_get_blob_tags":::

## Filter and find data with blob index tags

[!INCLUDE [storage-dev-guide-auth-filter-blob-tags](../../../includes/storage-dev-guides/storage-dev-guide-auth-filter-blob-tags.md)]

> [!NOTE]
> You can't use index tags to retrieve previous versions. Tags for previous versions aren't passed to the blob index engine. For more information, see [Conditions and known issues](storage-manage-find-blobs.md#conditions-and-known-issues).

You can find data by using the following method: 

- [ContainerClient.find_blobs_by_tag](/python/api/azure-storage-blob/azure.storage.blob.containerclient#azure-storage-blob-containerclient-find-blobs-by-tags)

The following example finds and lists all blobs tagged as an image:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_blobs_properties_metadata_tags.py" id="Snippet_find_blobs_by_tags":::

## Set blob index tags asynchronously

The Azure Blob Storage client library for Python supports working with blob index tags asynchronously. To learn more about project setup requirements, see [Asynchronous programming](storage-blob-python-get-started.md#asynchronous-programming).

Follow these steps to set blob index tags using asynchronous APIs:

1. Add the following import statements:

    ```python
    import asyncio

    from azure.identity.aio import DefaultAzureCredential
    from azure.storage.blob.aio import BlobServiceClient
    ```

1. Add code to run the program using `asyncio.run`. This function runs the passed coroutine, `main()` in our example, and manages the `asyncio` event loop. Coroutines are declared with the async/await syntax. In this example, the `main()` coroutine first creates the top level `BlobServiceClient` using `async with`, then calls the method that sets the blob index tags. Note that only the top level client needs to use `async with`, as other clients created from it share the same connection pool.

    ```python
    async def main():
        sample = BlobSamples()

        # TODO: Replace <storage-account-name> with your actual storage account name
        account_url = "https://<storage-account-name>.blob.core.windows.net"
        credential = DefaultAzureCredential()

        async with BlobServiceClient(account_url, credential=credential) as blob_service_client:
            await sample.set_blob_tags(blob_service_client, "sample-container")

    if __name__ == '__main__':
        asyncio.run(main())
    ```

1. Add code to set the blob index tags. The code is the same as the synchronous example, except that the method is declared with the `async` keyword and the `await` keyword is used when calling the `get_blob_tags` and `set_blob_tags` methods.

    :::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_blobs_properties_metadata_tags_async.py" id="Snippet_set_blob_tags":::

With this basic setup in place, you can implement other examples in this article as coroutines using async/await syntax.

## Resources

To learn more about how to use index tags to manage and find data using the Azure Blob Storage client library for Python, see the following resources.

### REST API operations

The Azure SDK for Python contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Python paradigms. The client library methods for managing and using blob index tags use the following REST API operations:

- [Get Blob Tags](/rest/api/storageservices/get-blob-tags) (REST API)
- [Set Blob Tags](/rest/api/storageservices/set-blob-tags) (REST API)
- [Find Blobs by Tags](/rest/api/storageservices/find-blobs-by-tags) (REST API)

### Code samples

- View [synchronous](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/python/blob-devguide-py/blob_devguide_blobs_properties_metadata_tags.py) or [asynchronous](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/python/blob-devguide-py/blob_devguide_blobs_properties_metadata_tags_async.py) code samples from this article (GitHub)

[!INCLUDE [storage-dev-guide-resources-python](../../../includes/storage-dev-guides/storage-dev-guide-resources-python.md)]

### See also

- [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md)
- [Use blob index tags to manage and find data on Azure Blob Storage](storage-blob-index-how-to.md)