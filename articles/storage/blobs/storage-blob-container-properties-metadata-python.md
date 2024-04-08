---
title: Use Python to manage properties and metadata for a blob container
titleSuffix: Azure Storage
description: Learn how to set and retrieve system properties and store custom metadata on blob containers in your Azure Storage account using the Python client library.
services: storage
author: pauljewellmsft

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 12/20/2023
ms.author: pauljewell
ms.devlang: python
ms.custom: devx-track-python, devguide-python
---

# Manage container properties and metadata with Python

[!INCLUDE [storage-dev-guide-selector-manage-properties-container](../../../includes/storage-dev-guides/storage-dev-guide-selector-manage-properties-container.md)]

Blob containers support system properties and user-defined metadata, in addition to the data they contain. This article shows how to manage system properties and user-defined metadata with the [Azure Storage client library for Python](/python/api/overview/azure/storage).

To learn about managing properties and metadata using asynchronous APIs, see [Set container metadata asynchronously](#set-container-metadata-asynchronously).

## Prerequisites

- This article assumes you already have a project set up to work with the Azure Blob Storage client library for Python. To learn about setting up your project, including package installation, adding `import` statements, and creating an authorized client object, see [Get started with Azure Blob Storage and Python](storage-blob-python-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to work with container properties or metadata. To learn more, see the authorization guidance for the following REST API operations:
    - [Get Container Properties](/rest/api/storageservices/get-container-properties#authorization)
    - [Set Container Metadata](/rest/api/storageservices/set-container-metadata#authorization)
    - [Get Container Metadata](/rest/api/storageservices/get-container-metadata#authorization)

## About properties and metadata

- **System properties**: System properties exist on each Blob Storage resource. Some of them can be read or set, while others are read-only. Behind the scenes, some system properties correspond to certain standard HTTP headers. The Azure Storage client library for Python maintains these properties for you.

- **User-defined metadata**: User-defined metadata consists of one or more name-value pairs that you specify for a Blob storage resource. You can use metadata to store additional values with the resource. Metadata values are for your own purposes only, and don't affect how the resource behaves.

    Metadata name/value pairs are valid HTTP headers and should adhere to all restrictions governing HTTP headers. For more information about metadata naming requirements, see [Metadata names](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata#metadata-names).

## Retrieve container properties

To retrieve container properties, use the following method:

- [ContainerClient.get_container_properties](/python/api/azure-storage-blob/azure.storage.blob.containerclient#azure-storage-blob-containerclient-get-container-properties)

The following code example fetches a container's system properties and writes the property values to a console window:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_container_properties_metadata.py" id="Snippet_get_container_properties":::

## Set and retrieve metadata

You can specify metadata as one or more name-value pairs on a blob or container resource. To set metadata, use the following method:

- [ContainerClient.set_container_metadata](/python/api/azure-storage-blob/azure.storage.blob.containerclient#azure-storage-blob-containerclient-set-container-metadata)

Setting container metadata overwrites all existing metadata associated with the container. It's not possible to modify an individual name-value pair.

The following code example sets metadata on a container:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_container_properties_metadata.py" id="Snippet_set_container_metadata":::

To retrieve metadata, call the following method:

- [ContainerClient.get_container_properties](/python/api/azure-storage-blob/azure.storage.blob.containerclient#azure-storage-blob-containerclient-get-container-properties)

The following example reads in metadata values: 

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_container_properties_metadata.py" id="Snippet_get_container_metadata":::

## Set container metadata asynchronously

The Azure Blob Storage client library for Python supports managing container properties and metadata asynchronously. To learn more about project setup requirements, see [Asynchronous programming](storage-blob-python-get-started.md#asynchronous-programming).

Follow these steps to set container metadata using asynchronous APIs:

1. Add the following import statements:

    ```python
    import asyncio

    from azure.identity.aio import DefaultAzureCredential
    from azure.storage.blob.aio import BlobServiceClient
    ```

1. Add code to run the program using `asyncio.run`. This function runs the passed coroutine, `main()` in our example, and manages the `asyncio` event loop. Coroutines are declared with the async/await syntax. In this example, the `main()` coroutine first creates the top level `BlobServiceClient` using `async with`, then calls the method that sets the container metadata. Note that only the top level client needs to use `async with`, as other clients created from it share the same connection pool.

    ```python
    async def main():
        sample = ContainerSamples()

        # TODO: Replace <storage-account-name> with your actual storage account name
        account_url = "https://<storage-account-name>.blob.core.windows.net"
        credential = DefaultAzureCredential()

        async with BlobServiceClient(account_url, credential=credential) as blob_service_client:
            await sample.set_metadata(blob_service_client, "sample-container")

    if __name__ == '__main__':
        asyncio.run(main())
    ```

1. Add code to set the container metadata. The code is the same as the synchronous example, except that the method is declared with the `async` keyword and the `await` keyword is used when calling the `get_container_properties` and `set_container_metadata` methods.

    :::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_container_properties_metadata_async.py" id="Snippet_set_container_metadata":::

With this basic setup in place, you can implement other examples in this article as coroutines using async/await syntax.

## Resources

To learn more about setting and retrieving container properties and metadata using the Azure Blob Storage client library for Python, see the following resources.

### REST API operations

The Azure SDK for Python contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Python paradigms. The client library methods for setting and retrieving properties and metadata use the following REST API operations:

- [Get Container Properties](/rest/api/storageservices/get-container-properties) (REST API)
- [Set Container Metadata](/rest/api/storageservices/set-container-metadata) (REST API)
- [Get Container Metadata](/rest/api/storageservices/get-container-metadata) (REST API)

The `get_container_properties` method retrieves container properties and metadata by calling both the [Get Container Properties](/rest/api/storageservices/get-container-properties) operation and the [Get Container Metadata](/rest/api/storageservices/get-container-metadata) operation.

### Code samples

- View [synchronous](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/python/blob-devguide-py/blob_devguide_container_properties_metadata.py) or [asynchronous](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/python/blob-devguide-py/blob_devguide_container_properties_metadata_async.py) code samples from this article (GitHub)

[!INCLUDE [storage-dev-guide-resources-python](../../../includes/storage-dev-guides/storage-dev-guide-resources-python.md)]