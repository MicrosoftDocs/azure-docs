---
title: List blob containers with Go
titleSuffix: Azure Storage
description: Learn how to list blob containers in your Azure Storage account using the Go client library.
services: storage
author: pauljewellmsft

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 05/22/2024
ms.author: pauljewell
ms.devlang: golang
ms.custom: devx-track-go, devguide-go
---

# List blob containers with Go

[!INCLUDE [storage-dev-guide-selector-list-container](../../../includes/storage-dev-guides/storage-dev-guide-selector-list-container.md)]

When you list the containers in an Azure Storage account from your code, you can specify several options to manage how results are returned from Azure Storage. This article shows how to list containers using the [Azure Storage client module for Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#section-readme).

[!INCLUDE [storage-dev-guide-prereqs-go](../../../includes/storage-dev-guides/storage-dev-guide-prereqs-go.md)]

## Set up your environment

[!INCLUDE [storage-dev-guide-project-setup-go](../../../includes/storage-dev-guides/storage-dev-guide-project-setup-go.md)]

#### Authorization

The authorization mechanism must have the necessary permissions to list blob containers. For authorization with Microsoft Entra ID (recommended), you need Azure RBAC built-in role **Storage Blob Data Contributor** or higher. To learn more, see the authorization guidance for [List Containers](/rest/api/storageservices/list-containers2#authorization).

## About container listing options

When listing containers from your code, you can specify options to manage how results are returned from Azure Storage. You can specify the number of results to return in each set of results, and then retrieve the subsequent sets. You can also filter the results by a prefix, and return container metadata with the results. These options are described in the following sections.

To list containers in a storage account, call the following method:

- [NewListContainersPager](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#Client.NewListContainersPager)

This method returns a [Pager](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azcore/runtime#Pager), which allows your app to process one page of results at a time. Containers are ordered lexicographically by name.

You can specify options for listing containers by using the [ListContainersOptions](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#ListContainersOptions) struct. This struct includes fields for managing the number of results, filtering by prefix, and including container information using[ListContainersInclude](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/service#ListContainersInclude).

### Manage how many results are returned

By default, a listing operation returns up to 5,000 results at a time. To return a smaller set of results, provide a nonzero value for the `MaxResults` field in the [ListContainersOptions](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#ListContainersOptions) struct.

### Filter results with a prefix

To filter the list of containers, specify a string or character for the `Prefix` field in [ListContainersOptions](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#ListContainersOptions). The prefix string can include one or more characters. Azure Storage then returns only the containers whose names start with that prefix.

### Include container metadata

To include container metadata with the results, set the `Metadata` field to `true` as part of [ListContainersInclude](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/service#ListContainersInclude). Azure Storage includes metadata with each container returned, so you don't need to fetch the container metadata separately.

### Include deleted containers

To include soft-deleted containers with the results, set the `Deleted` field to `true` as part of [ListContainersInclude](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/service#ListContainersInclude).

## Code examples

The following example lists all containers and metadata:

:::code language="go" source="~/blob-devguide-go/cmd/list-containers/list_containers.go" id="snippet_list_containers":::

The following example lists only containers that begin with the specified prefix:

:::code language="go" source="~/blob-devguide-go/cmd/list-containers/list_containers.go" id="snippet_list_containers_prefix":::

You can also specify a limit for the number of results per page. This example passes in a value for `MaxResults` and paginates the results:

:::code language="go" source="~/blob-devguide-go/cmd/list-containers/list_containers.go" id="snippet_list_containers_pages":::

[!INCLUDE [storage-dev-guide-code-samples-note-go](../../../includes/storage-dev-guides/storage-dev-guide-code-samples-note-go.md)]

## Resources

To learn more about listing containers using the Azure Blob Storage client module for Go, see the following resources.

### Code samples

- View [code samples](https://github.com/Azure-Samples/blob-storage-devguide-go/blob/main/cmd/list-containers/list_containers.go) from this article (GitHub)

### REST API operations

The Azure SDK for Go contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Go paradigms. The client library methods for listing containers use the following REST API operation:

- [List Containers](/rest/api/storageservices/list-containers2) (REST API)

[!INCLUDE [storage-dev-guide-resources-go](../../../includes/storage-dev-guides/storage-dev-guide-resources-go.md)]

## See also

- [Enumerating Blob Resources](/rest/api/storageservices/enumerating-blob-resources)