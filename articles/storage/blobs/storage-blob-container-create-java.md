---
title: Create a blob container with Java
titleSuffix: Azure Storage
description: Learn how to create a blob container in your Azure Storage account using the Java client library.
services: storage
author: pauljewellmsft

ms.service: storage
ms.topic: how-to
ms.date: 11/16/2022
ms.author: pauljewell
ms.subservice: blobs
ms.devlang: java
ms.custom: devx-track-java, devguide-java
---

# Create a blob container with Java

Blobs in Azure Storage are organized into containers. Before you can upload a blob, you must first create a container. This article shows how to create containers with the [Azure Storage client library for Java](/java/api/overview/azure/storage-blob-readme).

## Name a container

A container name must be a valid DNS name, as it forms part of the unique URI used to address the container or its blobs. Follow these rules when naming a container:

- Container names can be between 3 and 63 characters long.
- Container names must start with a letter or number, and can contain only lowercase letters, numbers, and the dash (-) character.
- Two or more consecutive dash characters aren't permitted in container names.

The URI for a container is in this format:

`https://accountname.blob.core.windows.net/containername`

## Create a container

To create a container, call one of the following methods from the `BlobServiceClient` class:

- [createBlobContainer](/java/api/com.azure.storage.blob.blobserviceclient)
- [createBlobContainerIfNotExists](/java/api/com.azure.storage.blob.blobserviceclient)

You can also create a container using one of the following methods from the `BlobContainerClient` class:

- [create](/java/api/com.azure.storage.blob.blobcontainerclient)
- [createIfNotExists](/java/api/com.azure.storage.blob.blobcontainerclient)

Containers are created immediately beneath the storage account. It's not possible to nest one container beneath another. For the `create` and `createBlobContainer` methods, an exception is thrown if a container with the same name already exists. 

The following example creates a container from a `BlobServiceClient` object:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-containers/src/main/java/com/blobs/devguide/containers/ContainerCreate.java" id="Snippet_CreateContainer":::

## Create the root container

A root container serves as a default container for your storage account. Each storage account may have one root container, which must be named *$root*. The root container must be explicitly created or deleted.

You can reference a blob stored in the root container without including the root container name. The root container enables you to reference a blob at the top level of the storage account hierarchy. For example, you can reference a blob that is in the root container in the following manner:

`https://accountname.blob.core.windows.net/default.html`

The following example creates a new `BlobContainerClient` object with the container name $root, then creates the container if it doesn't already exist in the storage account:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-containers/src/main/java/com/blobs/devguide/containers/ContainerCreate.java" id="Snippet_CreateRootContainer":::

## Resources

To learn more about creating a container using the Azure Blob Storage client library for Java, see the following resources.

### REST API operations

The Azure SDK for Java contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Java paradigms. The client library methods for creating a container use the following REST API operation:

- [Create Container](/rest/api/storageservices/create-container) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/Java/blob-devguide/blob-devguide-containers/src/main/java/com/blobs/devguide/containers/ContainerCreate.java)

[!INCLUDE [storage-dev-guide-resources-java](../../../includes/storage-dev-guides/storage-dev-guide-resources-java.md)]
