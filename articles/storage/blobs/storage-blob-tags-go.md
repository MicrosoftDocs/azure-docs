---
title: Use blob index tags to manage and find data with Go
titleSuffix: Azure Storage
description: Learn how to categorize, manage, and query for blob objects by using the Go client module.  
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.date: 08/05/2024
ms.service: azure-blob-storage
ms.topic: how-to
ms.devlang: golang
ms.custom: devx-track-go, devguide-go
---

# Use blob index tags to manage and find data with Go

[!INCLUDE [storage-dev-guide-selector-index-tags](../../../includes/storage-dev-guides/storage-dev-guide-selector-index-tags.md)]

This article shows how to use blob index tags to manage and find data using the [Azure Storage client module for Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#section-readme).

[!INCLUDE [storage-dev-guide-prereqs-go](../../../includes/storage-dev-guides/storage-dev-guide-prereqs-go.md)]

## Set up your environment

[!INCLUDE [storage-dev-guide-project-setup-go](../../../includes/storage-dev-guides/storage-dev-guide-project-setup-go.md)]

#### Authorization

The authorization mechanism must have the necessary permissions to work with blob index tags. For authorization with Microsoft Entra ID (recommended), you need Azure RBAC built-in role **Storage Blob Data Owner** or higher. To learn more, see the authorization guidance for [Get Blob Tags](/rest/api/storageservices/get-blob-tags#authorization), [Set Blob Tags](/rest/api/storageservices/set-blob-tags#authorization), or [Find Blobs by Tags](/rest/api/storageservices/find-blobs-by-tags#authorization).

[!INCLUDE [storage-dev-guide-about-blob-tags](../../../includes/storage-dev-guides/storage-dev-guide-about-blob-tags.md)]

## Set tags

[!INCLUDE [storage-dev-guide-auth-set-blob-tags](../../../includes/storage-dev-guides/storage-dev-guide-auth-set-blob-tags.md)]

You can set tags by using the following method:

- [SetTags](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/blob#Client.SetTags)

The tags specified in this method replace any existing tags. If existing values must be preserved, they must be downloaded and included in the call to this method. The following example shows how to set tags:

:::code language="go" source="~/blob-devguide-go/cmd/blob-index-tags/blob_index_tags.go" id="snippet_set_blob_tags":::

You can remove all tags by calling `SetTags` with no tags, as shown in the following example:

:::code language="go" source="~/blob-devguide-go/cmd/blob-index-tags/blob_index_tags.go" id="snippet_clear_blob_tags":::

## Get tags

[!INCLUDE [storage-dev-guide-auth-get-blob-tags](../../../includes/storage-dev-guides/storage-dev-guide-auth-get-blob-tags.md)]

You can get tags by using the following method: 

- [GetTags](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/blob#Client.GetTags)

The following example shows how to retrieve and iterate over the blob's tags:

:::code language="go" source="~/blob-devguide-go/cmd/blob-index-tags/blob_index_tags.go" id="snippet_get_blob_tags":::

## Filter and find data with blob index tags

[!INCLUDE [storage-dev-guide-auth-filter-blob-tags](../../../includes/storage-dev-guides/storage-dev-guide-auth-filter-blob-tags.md)]

> [!NOTE]
> You can't use index tags to retrieve previous versions. Tags for previous versions aren't passed to the blob index engine. For more information, see [Conditions and known issues](storage-manage-find-blobs.md#conditions-and-known-issues).

You can filter blob data based on index tags by using the following method: 

- [FilterBlobs](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob@v1.3.2/container#Client.FilterBlobs)

The following example finds and lists all blobs tagged as an image:

:::code language="go" source="~/blob-devguide-go/cmd/blob-index-tags/blob_index_tags.go" id="snippet_find_blobs_by_tags":::

[!INCLUDE [storage-dev-guide-code-samples-note-go](../../../includes/storage-dev-guides/storage-dev-guide-code-samples-note-go.md)]

## Resources

To learn more about how to use index tags to manage and find data using the Azure Blob Storage client library for Go, see the following resources.

### Code samples

- View [code samples](https://github.com/Azure-Samples/blob-storage-devguide-go/blob/main/cmd/blob-index-tags/blob_index_tags.go) from this article (GitHub)

### REST API operations

The Azure SDK for Go contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Go paradigms. The client library methods for managing and using blob index tags use the following REST API operations:

- [Get Blob Tags](/rest/api/storageservices/get-blob-tags) (REST API)
- [Set Blob Tags](/rest/api/storageservices/set-blob-tags) (REST API)
- [Find Blobs by Tags](/rest/api/storageservices/find-blobs-by-tags) (REST API)

[!INCLUDE [storage-dev-guide-resources-go](../../../includes/storage-dev-guides/storage-dev-guide-resources-go.md)]

### See also

- [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md)
- [Use blob index tags to manage and find data on Azure Blob Storage](storage-blob-index-how-to.md)