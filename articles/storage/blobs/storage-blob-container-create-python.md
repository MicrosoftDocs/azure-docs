---
title: Create a blob container with Python
titleSuffix: Azure Storage
description: Learn how to create a blob container in your Azure Storage account using the Python client library.
services: storage
author: pauljewellmsft

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 08/02/2023
ms.author: pauljewell
ms.devlang: python
ms.custom: devx-track-python, devguide-python
---

# Create a blob container with Python

[!INCLUDE [storage-dev-guide-selector-create-container](../../../includes/storage-dev-guides/storage-dev-guide-selector-create-container.md)]

Blobs in Azure Storage are organized into containers. Before you can upload a blob, you must first create a container. This article shows how to create containers with the [Azure Storage client library for Python](/python/api/overview/azure/storage).

## Prerequisites

- This article assumes you already have a project set up to work with the Azure Blob Storage client library for Python. To learn about setting up your project, including package installation, adding `import` statements, and creating an authorized client object, see [Get started with Azure Blob Storage and Python](storage-blob-python-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to create a blob container. To learn more, see the authorization guidance for the following REST API operation:
    - [Create Container](/rest/api/storageservices/create-container#authorization)

[!INCLUDE [storage-dev-guide-about-container-naming](../../../includes/storage-dev-guides/storage-dev-guide-about-container-naming.md)]

## Create a container

To create a container, call the following method from the [BlobServiceClient](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient) class:

- [BlobServiceClient.create_container](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient#azure-storage-blob-blobserviceclient-create-container)

You can also create a container using the following method from the [ContainerClient](/python/api/azure-storage-blob/azure.storage.blob.containerclient) class:

- [ContainerClient.create_container](/python/api/azure-storage-blob/azure.storage.blob.containerclient#azure-storage-blob-containerclient-create-container)

Containers are created immediately beneath the storage account. It's not possible to nest one container beneath another. An exception is thrown if a container with the same name already exists. 

The following example creates a container from a `BlobServiceClient` object:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-containers.py" id="Snippet_create_container":::

## Create the root container

A root container serves as a default container for your storage account. Each storage account may have one root container, which must be named *$root*. The root container must be explicitly created or deleted.

You can reference a blob stored in the root container without including the root container name. The root container enables you to reference a blob at the top level of the storage account hierarchy. For example, you can reference a blob in the root container as follows:

`https://accountname.blob.core.windows.net/default.html`

The following example creates a new `ContainerClient` object with the container name $root, then creates the container if it doesn't already exist in the storage account:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-containers.py" id="Snippet_create_root_container":::

## Resources

To learn more about creating a container using the Azure Blob Storage client library for Python, see the following resources.

### REST API operations

The Azure SDK for Python contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Python paradigms. The client library methods for creating a container use the following REST API operation:

- [Create Container](/rest/api/storageservices/create-container) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/python/blob-devguide-py/blob-devguide-containers.py)

[!INCLUDE [storage-dev-guide-resources-python](../../../includes/storage-dev-guides/storage-dev-guide-resources-python.md)]