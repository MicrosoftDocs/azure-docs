---
title: Set or change a blob's access tier with Java
titleSuffix: Azure Storage 
description: Learn how to set or change a blob's access tier in your Azure Storage account using the Java client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 08/02/2023
ms.devlang: java
ms.custom: devx-track-java, devguide-java, devx-track-extended-java
---

# Set or change a block blob's access tier with Java

[!INCLUDE [storage-dev-guide-selector-access-tier](../../../includes/storage-dev-guides/storage-dev-guide-selector-access-tier.md)]

This article shows how to set or change the access tier for a block blob using the [Azure Storage client library for Java](/java/api/overview/azure/storage-blob-readme). 

## Prerequisites

- This article assumes you already have a project set up to work with the Azure Blob Storage client library for Java. To learn about setting up your project, including package installation, adding `import` directives, and creating an authorized client object, see [Get Started with Azure Storage and Java](storage-blob-java-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to set the blob's access tier. To learn more, see the authorization guidance for the following REST API operation:
    - [Set Blob Tier](/rest/api/storageservices/set-blob-tier#authorization)

[!INCLUDE [storage-dev-guide-about-access-tiers](../../../includes/storage-dev-guides/storage-dev-guide-about-access-tiers.md)]

> [!NOTE]
> To set the access tier to `Cold` using Java, you must use a minimum [client library](/java/api/overview/azure/storage-blob-readme) version of 12.21.0.

## Set a blob's access tier during upload

You can set a blob's access tier on upload by using the [BlobUploadFromFileOptions](/java/api/com.azure.storage.blob.options.blobuploadfromfileoptions) class. The following code example shows how to set the access tier when uploading a blob:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobUpload.java" id="Snippet_UploadBlobWithAccessTier":::

To learn more about uploading a blob with Java, see [Upload a blob with Java](storage-blob-upload-java.md).

## Change the access tier for an existing block blob

You can change the access tier of an existing block blob by using one of the following methods:

- [setAccessTier](/java/api/com.azure.storage.blob.specialized.blobclientbase#com-azure-storage-blob-specialized-blobclientbase-setaccesstier(com-azure-storage-blob-models-accesstier))
- [setAccessTierWithResponse](/java/api/com.azure.storage.blob.specialized.blobclientbase#method-details)

The following code example shows how to change the access tier to Cool for an existing blob:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobAccessTier.java" id="Snippet_ChangeAccessTier":::

If you're rehydrating an archived blob, use the [setAccessTierWithResponse](/java/api/com.azure.storage.blob.specialized.blobclientbase#method-details) method. Set the `tier` parameter to a valid [AccessTier](/java/api/com.azure.storage.blob.models.accesstier) value of `HOT`, `COOL`, `COLD`, or `ARCHIVE`. You can optionally set the `priority` parameter to a valid [RehydratePriority](/java/api/com.azure.storage.blob.models.rehydratepriority) value `HIGH` or `STANDARD`.

The following code example shows how to rehydrate an archived blob by changing the access tier to Hot:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobAccessTier.java" id="Snippet_RehydrateUsingSetAccessTier":::

The [setAccessTierWithResponse](/java/api/com.azure.storage.blob.specialized.blobclientbase#method-details) method can also accept a [BlobSetAccessTierOptions](/java/api/com.azure.storage.blob.options.blobsetaccesstieroptions) parameter to specify configuration options.

## Copy a blob to a different access tier

You can change the access tier of an existing block blob by specifying an access tier as part of a copy operation. To change the access tier during a copy operation, use the [BlobBeginCopyOptions](/java/api/com.azure.storage.blob.options.blobbegincopyoptions) class. 

You can use the [setTier](/java/api/com.azure.storage.blob.options.blobbegincopyoptions#com-azure-storage-blob-options-blobbegincopyoptions-settier(com-azure-storage-blob-models-accesstier)) method to specify the [AccessTier](/java/api/com.azure.storage.blob.models.accesstier) value as `HOT`, `COOL`, `COLD`, or `ARCHIVE`. If you're rehydrating a blob from the archive tier using a copy operation, use the [setRehydratePriority](/java/api/com.azure.storage.blob.options.blobbegincopyoptions#com-azure-storage-blob-options-blobbegincopyoptions-setrehydratepriority(com-azure-storage-blob-models-rehydratepriority)) method to specify the [RehydratePriority](/java/api/com.azure.storage.blob.models.rehydratepriority) value as `HIGH` or `STANDARD`.

The following code example shows how to rehydrate an archived blob to the Hot tier using a copy operation:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobAccessTier.java" id="Snippet_RehydrateUsingCopy":::

To learn more about copying a blob with Java, see [Copy a blob with Java](storage-blob-copy-java.md).

## Resources

To learn more about setting access tiers using the Azure Blob Storage client library for Java, see the following resources.

### REST API operations

The Azure SDK for Java contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Java paradigms. The client library methods for setting access tiers use the following REST API operation:

- [Set Blob Tier](/rest/api/storageservices/set-blob-tier) (REST API)

[!INCLUDE [storage-dev-guide-resources-java](../../../includes/storage-dev-guides/storage-dev-guide-resources-java.md)]

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobAccessTier.java)

### See also

- [Access tiers best practices](access-tiers-best-practices.md)
- [Blob rehydration from the archive tier](archive-rehydrate-overview.md)
