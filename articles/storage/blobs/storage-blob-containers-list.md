---
title: List blob containers with .NET
titleSuffix: Azure Storage 
description: Learn how to list blob containers in your Azure Storage account using the .NET client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: azure-storage
ms.topic: how-to
ms.date: 03/28/2022
ms.devlang: csharp
ms.custom: devx-track-csharp, devguide-csharp, devx-track-dotnet
---

# List blob containers with .NET

When you list the containers in an Azure Storage account from your code, you can specify a number of options to manage how results are returned from Azure Storage. This article shows how to list containers using the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage).

## Prerequisites

- This article assumes you already have a project set up to work with the Azure Blob Storage client library for .NET. To learn about setting up your project, including package installation, adding `using` directives, and creating an authorized client object, see [Get started with Azure Blob Storage and .NET](storage-blob-dotnet-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to list blob containers. To learn more, see the authorization guidance for the following REST API operation:
    - [List Containers](/rest/api/storageservices/list-containers2#authorization)

## About container listing options

To list containers in your storage account, call one of the following methods:

- [GetBlobContainers](/dotnet/api/azure.storage.blobs.blobserviceclient.getblobcontainers)
- [GetBlobContainersAsync](/dotnet/api/azure.storage.blobs.blobserviceclient.getblobcontainersasync)

The overloads for these methods provide additional options for managing how containers are returned by the listing operation. These options are described in the following sections.

### Manage how many results are returned

By default, a listing operation returns up to 5000 results at a time. To return a smaller set of results, provide a nonzero value for the size of the page of results to return.

If your storage account contains more than 5000 containers, or if you have specified a page size such that the listing operation returns a subset of containers in the storage account, then Azure Storage returns a *continuation token* with the list of containers. A continuation token is an opaque value that you can use to retrieve the next set of results from Azure Storage.

In your code, check the value of the continuation token to determine whether it is empty. When the continuation token is empty, then the set of results is complete. If the continuation token is not empty, then call the listing method again, passing in the continuation token to retrieve the next set of results, until the continuation token is empty.

### Filter results with a prefix

To filter the list of containers, specify a string for the `prefix` parameter. The prefix string can include one or more characters. Azure Storage then returns only the containers whose names start with that prefix.

### Return metadata

To return container metadata with the results, specify the **Metadata** value for the [BlobContainerTraits](/dotnet/api/azure.storage.blobs.models.blobcontainertraits) enum. Azure Storage includes metadata with each container returned, so you do not need to also fetch the container metadata.

## Example: List containers

The following example asynchronously lists the containers in a storage account that begin with a specified prefix. The example lists containers that begin with the specified prefix and returns the specified number of results per call to the listing operation. It then uses the continuation token to get the next segment of results. The example also returns container metadata with the results.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Containers.cs" id="Snippet_ListContainers":::

## Resources

To learn more about listing containers using the Azure Blob Storage client library for .NET, see the following resources.

### REST API operations

The Azure SDK for .NET contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar .NET paradigms. The client library methods for listing containers use the following REST API operation:

- [List Containers](/rest/api/storageservices/list-containers2) (REST API)

[!INCLUDE [storage-dev-guide-resources-dotnet](../../../includes/storage-dev-guides/storage-dev-guide-resources-dotnet.md)]

## See also

- [Enumerating Blob Resources](/rest/api/storageservices/enumerating-blob-resources)
