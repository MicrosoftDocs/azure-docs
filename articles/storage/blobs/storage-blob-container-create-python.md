---
title: Create a blob container with Python
titleSuffix: Azure Storage
description: Learn how to create a blob container in your Azure Storage account using the Python client library.
services: storage
author: pauljewellmsft

ms.service: storage
ms.topic: how-to
ms.date: 01/04/2023
ms.author: pauljewell
ms.subservice: blobs
ms.devlang: python
ms.custom: devx-track-python, devguide-python
---

# Create a container in Azure Storage using the Python client library

Blobs in Azure Storage are organized into containers. Before you can upload a blob, you must first create a container. This article shows how to create containers with the [Azure Storage client library for Python](/python/api/overview/azure/storage).

## Name a container

A container name must be a valid DNS name, as it forms part of the unique URI used to address the container or its blobs. Follow these rules when naming a container:

- Container names can be between 3 and 63 characters long.
- Container names must start with a letter or number, and can contain only lowercase letters, numbers, and the dash (-) character.
- Two or more consecutive dash characters aren't permitted in container names.

The URI for a container is in this format:

`https://accountname.blob.core.windows.net/containername`

## Create a container

To create a container, call the following method from the [BlobServiceClient](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient) class:

- [BlobServiceClient.create_container](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient#azure-storage-blob-blobserviceclient-create-container)

You can also create a container using one of the following methods from the [ContainerClient](/python/api/azure-storage-blob/azure.storage.blob.containerclient) class:

- [ContainerClient.create_container](/python/api/azure-storage-blob/azure.storage.blob.containerclient#azure-storage-blob-containerclient-create-container)

Containers are created immediately beneath the storage account. It's not possible to nest one container beneath another. An exception is thrown if a container with the same name already exists. 

This following example creates a container from a `BlobServiceClient` object:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-containers.py" id="Snippet_create_container":::

## Create the root container

A root container serves as a default container for your storage account. Each storage account may have one root container, which must be named *$root*. The root container must be explicitly created or deleted.

You can reference a blob stored in the root container without including the root container name. The root container enables you to reference a blob at the top level of the storage account hierarchy. For example, you can reference a blob that is in the root container in the following manner:

`https://accountname.blob.core.windows.net/default.html`

The following example creates a new `ContainerClient` object with the container name $root, then creates the container if it doesn't already exist in the storage account:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-containers.py" id="Snippet_create_root_container":::

## See also

- [View code sample in GitHub](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/Python/blob-devguide/blob-devguide-containers/container-create.py)
- [Quickstart: Azure Blob Storage client library for Python](storage-quickstart-blobs-python.md)
- [Create Container](/rest/api/storageservices/create-container) (REST API)
- [Delete Container](/rest/api/storageservices/delete-container) (REST API)