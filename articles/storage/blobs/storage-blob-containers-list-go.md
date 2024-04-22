---
title: List blob containers with Go
titleSuffix: Azure Storage
description: Learn how to list blob containers in your Azure Storage account using the Go client library.
services: storage
author: pauljewellmsft

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 04/22/2024
ms.author: pauljewell
ms.devlang: golang
ms.custom: devx-track-go, devguide-go
---

# List blob containers with Go

[!INCLUDE [storage-dev-guide-selector-list-container](../../../includes/storage-dev-guides/storage-dev-guide-selector-list-container.md)]

When you list the containers in an Azure Storage account from your code, you can specify several options to manage how results are returned from Azure Storage. This article shows how to list containers using the [Azure Storage client module for Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#section-readme).

## Prerequisites

- This article assumes you already have a project set up to work with the Azure Blob Storage client module for Go. To learn about setting up your project, including package installation, adding `import` statements, and creating an authorized client object, see [Get started with Azure Blob Storage and Go](storage-blob-go-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to list blob containers. To learn more, see the authorization guidance for the following REST API operation:
    - [List Containers](/rest/api/storageservices/list-containers2#authorization)

## About container listing options

When listing containers from your code, you can specify options to manage how results are returned from Azure Storage. You can specify the number of results to return in each set of results, and then retrieve the subsequent sets. You can also filter the results by a prefix, and return container metadata with the results. These options are described in the following sections.

To list containers in a storage account, call the following method:

- [BlobServiceClient.list_containers](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient#azure-storage-blob-blobserviceclient-list-containers)

This method returns an iterable of type [ContainerProperties](/python/api/azure-storage-blob/azure.storage.blob.containerproperties). Containers are ordered lexicographically by name.

### Manage how many results are returned

By default, a listing operation returns up to 5000 results at a time. To return a smaller set of results, provide a nonzero value for the `results_per_page` keyword argument.

### Filter results with a prefix

To filter the list of containers, specify a string or character for the `name_starts_with` keyword argument. The prefix string can include one or more characters. Azure Storage then returns only the containers whose names start with that prefix.

### Include container metadata

To include container metadata with the results, set the `include_metadata` keyword argument to `True`. Azure Storage includes metadata with each container returned, so you don't need to fetch the container metadata separately.

### Include deleted containers

To include soft-deleted containers with the results, set the `include_deleted` keyword argument to `True`.

## Code examples

The following example lists all containers and metadata. You can include container metadata by setting `include_metadata` to `True`:

:::code language="go" source="~/blob-devguide-go/cmd/list-containers/list_containers.go id="snippet_list_containers":::

The following example lists only containers that begin with a prefix specified in the `name_starts_with` parameter:

:::code language="go" source="~/blob-devguide-go/cmd/list-containers/list_containers.go id="snippet_list_containers_prefix":::

You can also specify a limit for the number of results per page. This example passes in `results_per_page` and paginates the results:

:::code language="go" source="~/blob-devguide-go/cmd/list-containers/list_containers.go id="snippet_list_containers_pages":::

## Resources

To learn more about listing containers using the Azure Blob Storage client module for Go, see the following resources.

### REST API operations

The Azure SDK for Go contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Go paradigms. The client library methods for listing containers use the following REST API operation:

- [List Containers](/rest/api/storageservices/list-containers2) (REST API)

### Code samples

- View [code samples](https://github.com/Azure-Samples/blob-storage-devguide-go/cmd/list-containers/list_containers.go) from this article (GitHub)

[!INCLUDE [storage-dev-guide-resources-go](../../../includes/storage-dev-guides/storage-dev-guide-resources-go.md)]

## See also

- [Enumerating Blob Resources](/rest/api/storageservices/enumerating-blob-resources)