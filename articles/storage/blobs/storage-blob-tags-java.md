---
title: Use blob index tags to manage and find data with Java
titleSuffix: Azure Storage
description: Learn how to categorize, manage, and query for blob objects by using the Java client library.  
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.date: 08/02/2023
ms.service: azure-blob-storage
ms.topic: how-to
ms.devlang: java
ms.custom: devx-track-java, devguide-java, devx-track-extended-java
---

# Use blob index tags to manage and find data with Java

[!INCLUDE [storage-dev-guide-selector-index-tags](../../../includes/storage-dev-guides/storage-dev-guide-selector-index-tags.md)]

This article shows how to use blob index tags to manage and find data using the [Azure Storage client library for Java](/java/api/overview/azure/storage-blob-readme). 

## Prerequisites

- This article assumes you already have a project set up to work with the Azure Blob Storage client library for Java. To learn about setting up your project, including package installation, adding `import` directives, and creating an authorized client object, see [Get Started with Azure Storage and Java](storage-blob-java-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to work with blob index tags. To learn more, see the authorization guidance for the following REST API operations:
    - [Get Blob Tags](/rest/api/storageservices/get-blob-tags#authorization)
    - [Set Blob Tags](/rest/api/storageservices/set-blob-tags#authorization)
    - [Find Blobs by Tags](/rest/api/storageservices/find-blobs-by-tags#authorization)

## About blob index tags

Blob index tags categorize data in your storage account using key-value tag attributes. These tags are automatically indexed and exposed as a searchable multi-dimensional index to easily find data. This article shows you how to set, get, and find data using blob index tags.

To learn more about this feature along with known issues and limitations, see [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md).

## Set tags

[!INCLUDE [storage-dev-guide-auth-set-blob-tags](../../../includes/storage-dev-guides/storage-dev-guide-auth-set-blob-tags.md)]

You can set tags by using the following method:

- [setTags](/java/api/com.azure.storage.blob.specialized.blobclientbase)

The specified tags in this method will replace existing tags. If old values must be preserved, they must be downloaded and included in the call to this method. The following example shows how to set tags:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobPropertiesMetadataTags.java" id="Snippet_SetBLobTags":::

You can delete all tags by passing an empty `Map` object into the `setTags` method:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobPropertiesMetadataTags.java" id="Snippet_ClearBLobTags":::

## Get tags

[!INCLUDE [storage-dev-guide-auth-get-blob-tags](../../../includes/storage-dev-guides/storage-dev-guide-auth-get-blob-tags.md)]

You can get tags by using the following method: 

- [getTags](/java/api/com.azure.storage.blob.specialized.blobclientbase)

The following example shows how to retrieve and iterate over the blob's tags:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobPropertiesMetadataTags.java" id="Snippet_GetBLobTags":::

## Filter and find data with blob index tags

[!INCLUDE [storage-dev-guide-auth-filter-blob-tags](../../../includes/storage-dev-guides/storage-dev-guide-auth-filter-blob-tags.md)]

> [!NOTE]
> You can't use index tags to retrieve previous versions. Tags for previous versions aren't passed to the blob index engine. For more information, see [Conditions and known issues](storage-manage-find-blobs.md#conditions-and-known-issues).

You can find data by using the following method: 

- [findBlobsByTags](/java/api/com.azure.storage.blob.blobcontainerclient)

The following example finds all blobs tagged as an image:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobPropertiesMetadataTags.java" id="Snippet_FindBlobsByTag":::

## Resources

To learn more about how to use index tags to manage and find data using the Azure Blob Storage client library for Java, see the following resources.

### REST API operations

The Azure SDK for Java contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Java paradigms. The client library methods for managing and using blob index tags use the following REST API operations:

- [Get Blob Tags](/rest/api/storageservices/get-blob-tags) (REST API)
- [Set Blob Tags](/rest/api/storageservices/set-blob-tags) (REST API)
- [Find Blobs by Tags](/rest/api/storageservices/find-blobs-by-tags) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobPropertiesMetadataTags.java)

[!INCLUDE [storage-dev-guide-resources-java](../../../includes/storage-dev-guides/storage-dev-guide-resources-java.md)]

### See also

- [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md)
- [Use blob index tags to manage and find data on Azure Blob Storage](storage-blob-index-how-to.md)
