---
title: Create a blob container with .NET
titleSuffix: Azure Storage 
description: Learn how to create a blob container in your Azure Storage account using the .NET client library.
services: storage
author: pauljewellmsft

ms.service: storage
ms.topic: how-to
ms.date: 07/25/2022
ms.author: pauljewell
ms.subservice: blobs
ms.devlang: csharp
ms.custom: devx-track-csharp, devguide-csharp
---

# Create a blob container with .NET

Blobs in Azure Storage are organized into containers. Before you can upload a blob, you must first create a container. This article shows how to create containers with the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage).

> [!NOTE]
> The examples in this article assume that you've created a [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) object by using the guidance in the [Get started with Azure Blob Storage and .NET](storage-blob-dotnet-get-started.md) article.

## Name a container

A container name must be a valid DNS name, as it forms part of the unique URI used to address the container or its blobs. Follow these rules when naming a container:

- Container names can be between 3 and 63 characters long.
- Container names must start with a letter or number, and can contain only lowercase letters, numbers, and the dash (-) character.
- Two or more consecutive dash characters aren't permitted in container names.

The URI for a container is in this format:

`https://myaccount.blob.core.windows.net/mycontainer`

## Create a container

To create a container, call one of the following methods from the `BlobServiceClient` class:

- [CreateBlobContainer](/dotnet/api/azure.storage.blobs.blobserviceclient.createblobcontainer)
- [CreateBlobContainerAsync](/dotnet/api/azure.storage.blobs.blobserviceclient.createblobcontainerasync)

You can also create a container using one of the following methods from the `BlobContainerClient` class:

- [Create](/dotnet/api/azure.storage.blobs.blobcontainerclient.create)
- [CreateAsync](/dotnet/api/azure.storage.blobs.blobcontainerclient.createasync)

These methods throw an exception if a container with the same name already exists.

Containers are created immediately beneath the storage account. It's not possible to nest one container beneath another.

The following example uses a `BlobServiceClient` object to create a container asynchronously:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Containers.cs" id="CreateSampleContainerAsync":::

## Create the root container

A root container serves as a default container for your storage account. Each storage account may have one root container, which must be named *$root*. The root container must be explicitly created or deleted.

You can reference a blob stored in the root container without including the root container name. The root container enables you to reference a blob at the top level of the storage account hierarchy. For example, you can reference a blob that is in the root container in the following manner:

`https://myaccount.blob.core.windows.net/default.html`

The following example creates the root container synchronously:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Containers.cs" id="CreateRootContainer":::

## Resources

To learn more about creating a container using the Azure Blob Storage client library for .NET, see the following resources.

### REST API operations

The Azure SDK for .NET contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar .NET paradigms. The client library methods for creating a container use the following REST API operation:

- [Create Container](/rest/api/storageservices/create-container) (REST API)

[!INCLUDE [storage-dev-guide-resources-dotnet](../../../includes/storage-dev-guides/storage-dev-guide-resources-dotnet.md)]
