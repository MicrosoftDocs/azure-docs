---
title: Manage properties and metadata for a blob with Python
titleSuffix: Azure Storage
description: Learn how to set and retrieve system properties and store custom metadata on blobs in your Azure Storage account using the Python client library.
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.date: 08/05/2024
ms.service: azure-blob-storage
ms.topic: how-to
ms.devlang: python
ms.custom: devx-track-python, devguide-python
---

# Manage blob properties and metadata with Python

[!INCLUDE [storage-dev-guide-selector-manage-properties-blob](../../../includes/storage-dev-guides/storage-dev-guide-selector-manage-properties-blob.md)]

In addition to the data they contain, blobs support system properties and user-defined metadata. This article shows how to manage system properties and user-defined metadata using the [Azure Storage client library for Python](/python/api/overview/azure/storage).

To learn about managing properties and metadata using asynchronous APIs, see [Set blob metadata asynchronously](#set-blob-metadata-asynchronously).

[!INCLUDE [storage-dev-guide-prereqs-python](../../../includes/storage-dev-guides/storage-dev-guide-prereqs-python.md)]

## Set up your environment

[!INCLUDE [storage-dev-guide-project-setup-python](../../../includes/storage-dev-guides/storage-dev-guide-project-setup-python.md)]

#### Add import statements

Add the following `import` statements:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_blobs_properties_metadata_tags.py" id="Snippet_imports":::

#### Authorization

The authorization mechanism must have the necessary permissions to work with container properties or metadata. For authorization with Microsoft Entra ID (recommended), you need Azure RBAC built-in role **Storage Blob Data Reader** or higher for the *get* operations, and **Storage Blob Data Contributor** or higher for the *set* operations. To learn more, see the authorization guidance for [Set Blob Properties (REST API)](/rest/api/storageservices/set-blob-properties#authorization), [Get Blob Properties (REST API)](/rest/api/storageservices/get-blob-properties#authorization), [Set Blob Metadata (REST API)](/rest/api/storageservices/set-blob-metadata#authorization), or [Get Blob Metadata (REST API)](/rest/api/storageservices/get-blob-metadata#authorization).

[!INCLUDE [storage-dev-guide-create-client-python](../../../includes/storage-dev-guides/storage-dev-guide-create-client-python.md)]

## About properties and metadata

- **System properties**: System properties exist on each Blob storage resource. Some of them can be read or set, while others are read-only. Under the covers, some system properties correspond to certain standard HTTP headers. The Azure Storage client library for Python maintains these properties for you.

- **User-defined metadata**: User-defined metadata consists of one or more name-value pairs that you specify for a Blob storage resource. You can use metadata to store additional values with the resource. Metadata values are for your own purposes only, and don't affect how the resource behaves.

    Metadata name/value pairs are valid HTTP headers and should adhere to all restrictions governing HTTP headers. For more information about metadata naming requirements, see [Metadata names](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata#metadata-names).

> [!NOTE]
> Blob index tags also provide the ability to store arbitrary user-defined key/value attributes alongside an Azure Blob storage resource. While similar to metadata, only blob index tags are automatically indexed and made searchable by the native blob service. Metadata cannot be indexed and queried unless you utilize a separate service such as Azure Search.
>
> To learn more about this feature, see [Manage and find data on Azure Blob storage with blob index (preview)](storage-manage-find-blobs.md).

## Set and retrieve properties

To set properties on a blob, use the following method:

- [BlobClient.set_http_headers](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-set-http-headers)

Any properties not explicitly set are cleared. To preserve any existing properties, you can first retrieve the blob properties, then use them to populate the headers that aren't being updated.

The following code example sets the `content_type` and `content_language` system properties on a blob, while preserving the existing properties:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_blobs_properties_metadata_tags.py" id="Snippet_set_blob_properties":::

To retrieve properties on a blob, use the following method:

- [BlobClient.get_blob_properties](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-get-blob-properties)

The following code example gets a blob's system properties and displays some of the values:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_blobs_properties_metadata_tags.py" id="Snippet_get_blob_properties":::

## Set and retrieve metadata

You can specify metadata as one or more name-value pairs on a blob or container resource. To set metadata, send a [dictionary](https://docs.python.org/3/library/stdtypes.html#dict) containing name-value pairs using the following method:

- [BlobClient.set_blob_metadata](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-set-blob-metadata)

The following code example sets metadata on a blob:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_blobs_properties_metadata_tags.py" id="Snippet_set_blob_metadata":::

To retrieve metadata, call the [get_blob_properties](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-get-blob-properties) method on your blob to populate the metadata collection, then read the values, as shown in the example below. The `get_blob_properties` method retrieves blob properties and metadata by calling both the [Get Blob Properties](/rest/api/storageservices/get-blob-properties) operation and the [Get Blob Metadata](/rest/api/storageservices/get-blob-metadata) operation.

The following code example reads metadata on a blob and prints each key/value pair: 

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_blobs_properties_metadata_tags.py" id="Snippet_get_blob_metadata":::

## Set blob metadata asynchronously

The Azure Blob Storage client library for Python supports managing blob properties and metadata asynchronously. To learn more about project setup requirements, see [Asynchronous programming](storage-blob-python-get-started.md#asynchronous-programming).

Follow these steps to set blob metadata using asynchronous APIs:

1. Add the following import statements:

    ```python
    import asyncio

    from azure.identity.aio import DefaultAzureCredential
    from azure.storage.blob.aio import BlobServiceClient
    ```

1. Add code to run the program using `asyncio.run`. This function runs the passed coroutine, `main()` in our example, and manages the `asyncio` event loop. Coroutines are declared with the async/await syntax. In this example, the `main()` coroutine first creates the top level `BlobServiceClient` using `async with`, then calls the method that sets the blob metadata. Note that only the top level client needs to use `async with`, as other clients created from it share the same connection pool.

    ```python
    async def main():
        sample = BlobSamples()

        # TODO: Replace <storage-account-name> with your actual storage account name
        account_url = "https://<storage-account-name>.blob.core.windows.net"
        credential = DefaultAzureCredential()

        async with BlobServiceClient(account_url, credential=credential) as blob_service_client:
            await sample.set_metadata(blob_service_client, "sample-container")

    if __name__ == '__main__':
        asyncio.run(main())
    ```

1. Add code to set the blob metadata. The code is the same as the synchronous example, except that the method is declared with the `async` keyword and the `await` keyword is used when calling the `get_blob_properties` and `set_blob_metadata` methods.

    :::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_blobs_properties_metadata_tags_async.py" id="Snippet_set_blob_metadata":::

With this basic setup in place, you can implement other examples in this article as coroutines using async/await syntax.

## Resources

To learn more about how to manage system properties and user-defined metadata using the Azure Blob Storage client library for Python, see the following resources.

### Code samples

- View [synchronous](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/python/blob-devguide-py/blob_devguide_blobs_properties_metadata_tags.py) or [asynchronous](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/python/blob-devguide-py/blob_devguide_blobs_properties_metadata_tags_async.py) code samples from this article (GitHub)

### REST API operations

The Azure SDK for Python contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Python paradigms. The client library methods for managing system properties and user-defined metadata use the following REST API operations:

- [Set Blob Properties](/rest/api/storageservices/set-blob-properties) (REST API)
- [Get Blob Properties](/rest/api/storageservices/get-blob-properties) (REST API)
- [Set Blob Metadata](/rest/api/storageservices/set-blob-metadata) (REST API)
- [Get Blob Metadata](/rest/api/storageservices/get-blob-metadata) (REST API)

[!INCLUDE [storage-dev-guide-resources-python](../../../includes/storage-dev-guides/storage-dev-guide-resources-python.md)]

[!INCLUDE [storage-dev-guide-next-steps-python](../../../includes/storage-dev-guides/storage-dev-guide-next-steps-python.md)]