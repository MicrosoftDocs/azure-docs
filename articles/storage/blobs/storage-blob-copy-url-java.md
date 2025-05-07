---
title: Copy a blob from a source object URL with Java
titleSuffix: Azure Storage
description: Learn how to copy a blob from a source object URL in Azure Storage by using the Java client library.
author: pauljewellmsft

ms.author: pauljewell
ms.date: 08/26/2024
ms.service: azure-blob-storage
ms.topic: how-to
ms.devlang: java
ms.custom: devx-track-java, devguide-java, devx-track-extended-java
---

# Copy a blob from a source object URL with Java

[!INCLUDE [storage-dev-guide-selector-copy-url](../../../includes/storage-dev-guides/storage-dev-guide-selector-copy-url.md)]

This article shows how to copy a blob from a source object URL using the [Azure Storage client library for Java](/java/api/overview/azure/storage-blob-readme). You can copy a blob from a source within the same storage account, from a source in a different storage account, or from any accessible object retrieved via HTTP GET request on a given URL.

The client library methods covered in this article use the [Put Blob From URL](/rest/api/storageservices/put-blob-from-url) and [Put Block From URL](/rest/api/storageservices/put-block-from-url) REST API operations. These methods are preferred for copy scenarios where you want to move data into a storage account and have a URL for the source object. For copy operations where you want asynchronous scheduling, see [Copy a blob with asynchronous scheduling using Java](storage-blob-copy-async-java.md).

[!INCLUDE [storage-dev-guide-prereqs-java](../../../includes/storage-dev-guides/storage-dev-guide-prereqs-java.md)]

## Set up your environment

[!INCLUDE [storage-dev-guide-project-setup-java](../../../includes/storage-dev-guides/storage-dev-guide-project-setup-java.md)]

#### Add import statements

Add the following `import` statements:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobCopyPutFromURL.java" id="Snippet_Imports":::

#### Authorization

The authorization mechanism must have the necessary permissions to perform a copy operation. For authorization with Microsoft Entra ID (recommended), you need Azure RBAC built-in role **Storage Blob Data Contributor** or higher. To learn more, see the authorization guidance for [Put Blob From URL (REST API)](/rest/api/storageservices/put-blob-from-url#authorization) or [Put Block From URL (REST API)](/rest/api/storageservices/put-block-from-url#authorization).

[!INCLUDE [storage-dev-guide-create-client-java](../../../includes/storage-dev-guides/storage-dev-guide-create-client-java.md)]

[!INCLUDE [storage-dev-guide-blob-copy-from-url](../../../includes/storage-dev-guides/storage-dev-guide-about-blob-copy-from-url.md)]

## Copy a blob from a source object URL

This section gives an overview of methods provided by the Azure Storage client library for Java to perform a copy operation from a source object URL.

The following methods wrap the [Put Blob From URL](/rest/api/storageservices/put-blob-from-url) REST API operation, and create a new block blob where the contents of the blob are read from a given URL:

- [uploadFromUrl](/java/api/com.azure.storage.blob.specialized.blockblobclient#method-details)
- [uploadFromUrlWithResponse](/java/api/com.azure.storage.blob.specialized.blockblobclient#method-details)

These methods are preferred for scenarios where you want to move data into a storage account and have a URL for the source object.

For large objects, you can work with individual blocks. The following method wraps the [Put Block From URL](/rest/api/storageservices/put-block-from-url) REST API operation. This method creates a new block to be committed as part of a blob where the contents are read from a source URL:

- [stageBlockFromUrl](/java/api/com.azure.storage.blob.specialized.blockblobclient#method-details)

## Copy a blob from a source within Azure

If you're copying a blob from a source within Azure, access to the source blob can be authorized via Microsoft Entra ID, a shared access signature (SAS), or an account key. 

The following example shows a scenario for copying from a source blob within Azure. The [uploadFromUrl](/java/api/com.azure.storage.blob.specialized.blockblobclient#method-details) method can optionally accept a Boolean parameter to indicate whether an existing blob should be overwritten, as shown in the example.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobCopyPutFromURL.java" id="Snippet_CopyFromAzure_PutBlobFromURL":::

The [uploadFromUrlWithResponse](/java/api/com.azure.storage.blob.specialized.blockblobclient#method-details) method can also accept a [BlobUploadFromUrlOptions](/java/api/com.azure.storage.blob.options.blobuploadfromurloptions) parameter to specify further options for the operation.

## Copy a blob from an external source

You can perform a copy operation on any source object that can be retrieved via HTTP GET request on a given URL, including accessible objects outside of Azure. The following example shows a scenario for copying a blob from an accessible source object URL.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobCopyPutFromURL.java" id="Snippet_CopyFromExternalSource_PutBlobFromURL":::

## Resources

To learn more about copying blobs using the Azure Blob Storage client library for Java, see the following resources.

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobCopyPutFromURL.java)

### REST API operations

The Azure SDK for Java contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Java paradigms. The client library methods covered in this article use the following REST API operations:

- [Put Blob From URL](/rest/api/storageservices/put-blob-from-url) (REST API)
- [Put Block From URL](/rest/api/storageservices/put-block-from-url) (REST API)

[!INCLUDE [storage-dev-guide-resources-java](../../../includes/storage-dev-guides/storage-dev-guide-resources-java.md)]

[!INCLUDE [storage-dev-guide-next-steps-java](../../../includes/storage-dev-guides/storage-dev-guide-next-steps-java.md)]
