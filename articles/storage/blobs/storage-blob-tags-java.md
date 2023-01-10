---
title: Use blob index tags to find data with Java
titleSuffix: Azure Storage
description: Learn how to categorize, manage, and query for blob objects by using the Java client library.  
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.date: 11/16/2022
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.devlang: java
ms.custom: devx-track-java, devguide-java
---

# Use blob index tags to manage and find data using the Java client library

This article shows how to use blob index tags to manage and find data using the [Azure Storage client library for Java](/java/api/overview/azure/storage-blob-readme). 

Blob index tags categorize data in your storage account using key-value tag attributes. These tags are automatically indexed and exposed as a searchable multi-dimensional index to easily find data. This article shows you how to set, get, and find data using blob index tags.

To learn more about this feature along with known issues and limitations, see [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md).

## Set tags

You can set and get index tags if your code has authorized access to blob data through one of the following mechanisms:
- Azure AD built-in role assigned as [Storage Blob Data Owner](/azure/role-based-access-control/built-in-roles#storage-blob-data-owner) or higher
- Azure RBAC action [Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write](/azure/role-based-access-control/resource-provider-operations#microsoftstorage)
- Shared Access Signature with permission to access the blob's tags (`t` permission)
- Account key

For more information, see [Setting blob index tags](storage-manage-find-blobs.md#setting-blob-index-tags).

You can set tags by using the following method:

- [setTags](/java/api/com.azure.storage.blob.specialized.blobclientbase)

The specified tags in this method will replace existing tags. If old values must be preserved, they must be downloaded and included in the call to this method. The following example shows how to set tags:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobPropertiesMetadataTags.java" id="Snippet_SetBLobTags":::

You can delete all tags by passing an empty `Map` object into the `setTags` method:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobPropertiesMetadataTags.java" id="Snippet_ClearBLobTags":::

## Get tags

You can set and get index tags if your code has authorized access to blob data through one of the following mechanisms:
- Azure AD built-in role assigned as [Storage Blob Data Owner](/azure/role-based-access-control/built-in-roles#storage-blob-data-owner) or higher
- Azure RBAC action [Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read](/azure/role-based-access-control/resource-provider-operations#microsoftstorage)
- Shared Access Signature with permission to access the blob's tags (`t` permission)
- Account key

For more information, see [Getting and listing blob index tags](storage-manage-find-blobs.md#getting-and-listing-blob-index-tags).

You can get tags by using the following method: 

- [getTags](/java/api/com.azure.storage.blob.specialized.blobclientbase)

The following example shows how to retrieve and iterate over the blob's tags:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobPropertiesMetadataTags.java" id="Snippet_GetBLobTags":::

## Filter and find data with blob index tags

You can use index tags to find and filter data if your code has authorized access to blob data through one of the following mechanisms:
- Azure AD built-in role assigned as [Storage Blob Data Owner](/azure/role-based-access-control/built-in-roles#storage-blob-data-owner) or higher
- Azure RBAC action [Microsoft.Storage/storageAccounts/blobServices/containers/blobs/filter/action](/azure/role-based-access-control/resource-provider-operations#microsoftstorage)
- Shared Access Signature with permission to find blobs by tags (`f` permission)
- Account key

For more information, see [Finding data using blob index tags](storage-manage-find-blobs.md#finding-data-using-blob-index-tags).

> [!NOTE]
> You can't use index tags to retrieve previous versions. Tags for previous versions aren't passed to the blob index engine. For more information, see [Conditions and known issues](storage-manage-find-blobs.md#conditions-and-known-issues).

You can find data by using the following method: 

- [findBlobsByTags](/java/api/com.azure.storage.blob.blobcontainerclient)

The following example finds all blobs tagged as an image:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobPropertiesMetadataTags.java" id="Snippet_FindBlobsByTag":::

## See also

- [View code sample in GitHub](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobPropertiesMetadataTags.java)
- [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md)
- [Get Blob Tags](/rest/api/storageservices/get-blob-tags) (REST API)
- [Set Blob Tags](/rest/api/storageservices/set-blob-tags) (REST API)
- [Find Blobs by Tags](/rest/api/storageservices/find-blobs-by-tags) (REST API)