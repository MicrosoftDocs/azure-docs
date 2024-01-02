---
title: Set or change a blob's access tier with Python
titleSuffix: Azure Storage 
description: Learn how to set or change a blob's access tier in your Azure Storage account using the Python client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 12/20/2023
ms.devlang: python
ms.custom: devx-track-python, devguide-python
---

# Set or change a block blob's access tier with Python

[!INCLUDE [storage-dev-guide-selector-access-tier](../../../includes/storage-dev-guides/storage-dev-guide-selector-access-tier.md)]

This article shows how to set or change the access tier for a block blob using the [Azure Storage client library for Python](/python/api/overview/azure/storage).

To learn about changing a blob's access tier using asynchronous APIs, see [Change a blob's access tier asynchronously](#change-a-blobs-access-tier-asynchronously).

## Prerequisites

- This article assumes you already have a project set up to work with the Azure Blob Storage client library for Python. To learn about setting up your project, including package installation, adding `import` statements, and creating an authorized client object, see [Get started with Azure Blob Storage and Python](storage-blob-python-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to set the blob's access tier. To learn more, see the authorization guidance for the following REST API operation:
    - [Set Blob Tier](/rest/api/storageservices/set-blob-tier#authorization)

[!INCLUDE [storage-dev-guide-about-access-tiers](../../../includes/storage-dev-guides/storage-dev-guide-about-access-tiers.md)]

> [!NOTE]
> To set the access tier to `Cold` using Python, you must use a minimum [client library](/python/api/azure-storage-blob) version of 12.15.0.

## Set a blob's access tier during upload

You can set a blob's access tier on upload by passing the `standard_blob_tier` keyword argument to [upload_blob](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-upload-blob) or [upload_blob_from_url](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-upload-blob-from-url).

The following code example shows how to set the access tier when uploading a blob:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_upload.py" id="Snippet_upload_blob_access_tier":::

To learn more about uploading a blob with Python, see [Upload a blob with Python](storage-blob-upload-python.md).

## Change the access tier for an existing block blob

You can change the access tier of an existing block blob by using the following function:

- [set_standard_blob_tier](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-set-standard-blob-tier)

The following code example shows how to change the access tier for an existing blob to `Cool`:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_access_tiers.py" id="Snippet_change_blob_access_tier":::

If you're rehydrating an archived blob, you can optionally pass the `rehydrate_priority` keyword argument as `HIGH` or `STANDARD`.

## Copy a blob to a different access tier

You can change the access tier of an existing block blob by specifying an access tier as part of a copy operation. To change the access tier during a copy operation, pass the `standard_blob_tier` keyword argument to [start_copy_from_url](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-start-copy-from-url). If you're rehydrating a blob from the archive tier using a copy operation, you can optionally pass the `rehydrate_priority` keyword argument as `HIGH` or `STANDARD`.

The following code example shows how to rehydrate an archived blob to the `Hot` tier using a copy operation:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_access_tiers.py" id="Snippet_rehydrate_using_copy":::

To learn more about copying a blob with Python, see [Copy a blob with Python](storage-blob-copy-python.md).

## Change a blob's access tier asynchronously

The Azure Blob Storage client library for Python supports changing a blob's access tier asynchronously. To learn more about project setup requirements, see [Asynchronous programming](storage-blob-python-get-started.md#asynchronous-programming).

Follow these steps to change a blob's access tier using asynchronous APIs:

1. Add the following import statements:

    ```python
    import asyncio

    from azure.storage.blob import (
    StandardBlobTier
    )
    from azure.identity.aio import DefaultAzureCredential
    from azure.storage.blob.aio import (
    BlobServiceClient,
    BlobClient
    )
    ```

1. Add code to run the program using `asyncio.run`. This function runs the passed coroutine, `main()` in our example, and manages the `asyncio` event loop. Coroutines are declared with the async/await syntax. In this example, the `main()` coroutine first creates the top level `BlobServiceClient` using `async with`, then calls the method that changes the blob's access tier. Note that only the top level client needs to use `async with`, as other clients created from it share the same connection pool.

    :::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_access_tiers_async.py" id="Snippet_create_client_async":::

1. Add code to change the blob's access tier. The code is the same as the synchronous example, except that the method is declared with the `async` keyword and the `await` keyword is used when calling the `set_standard_blob_tier` method.

    :::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_access_tiers_async.py" id="Snippet_change_blob_access_tier":::

With this basic setup in place, you can implement other examples in this article as coroutines using async/await syntax.

## Resources

To learn more about setting access tiers using the Azure Blob Storage client library for Python, see the following resources.

### REST API operations

The Azure SDK for Python contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Python paradigms. The client library methods for setting access tiers use the following REST API operation:

- [Set Blob Tier](/rest/api/storageservices/set-blob-tier) (REST API)

[!INCLUDE [storage-dev-guide-resources-python](../../../includes/storage-dev-guides/storage-dev-guide-resources-python.md)]

### Code samples

- View [synchronous](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/python/blob-devguide-py/blob_devguide_access_tiers.py) or [asynchronous](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/python/blob-devguide-py/blob_devguide_access_tiers_async.py) code samples from this article (GitHub)

### See also

- [Access tiers best practices](access-tiers-best-practices.md)
- [Blob rehydration from the archive tier](archive-rehydrate-overview.md)
