---
title: Copy a blob from a source object URL with Go
titleSuffix: Azure Storage
description: Learn how to copy a blob from a source object URL in Azure Storage by using the Go client library.
author: pauljewellmsft

ms.author: pauljewell
ms.date: 07/25/2024
ms.service: azure-blob-storage
ms.topic: how-to
ms.devlang: golang
ms.custom: devx-track-go, devguide-go
---

# Copy a blob from a source object URL with Go

[!INCLUDE [storage-dev-guide-selector-copy-url](../../../includes/storage-dev-guides/storage-dev-guide-selector-copy-url.md)]

This article shows how to copy a blob from a source object URL using the [Azure Storage client module for Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#section-readme). You can copy a blob from a source within the same storage account, from a source in a different storage account, or from any accessible object retrieved via HTTP GET request on a given URL.

The client library methods covered in this article use the [Put Blob From URL](/rest/api/storageservices/put-blob-from-url) and [Put Block From URL](/rest/api/storageservices/put-block-from-url) REST API operations. These methods are preferred for copy scenarios where you want to move data into a storage account and have a URL for the source object. For copy operations where you want asynchronous scheduling, see [Copy a blob with asynchronous scheduling using Go](storage-blob-copy-async-go.md).

[!INCLUDE [storage-dev-guide-prereqs-go](../../../includes/storage-dev-guides/storage-dev-guide-prereqs-go.md)]

## Set up your environment

[!INCLUDE [storage-dev-guide-project-setup-go](../../../includes/storage-dev-guides/storage-dev-guide-project-setup-go.md)]

#### Authorization

The authorization mechanism must have the necessary permissions to perform a copy operation. For authorization with Microsoft Entra ID (recommended), you need Azure RBAC built-in role **Storage Blob Data Contributor** or higher. To learn more, see the authorization guidance for [Put Blob From URL](/rest/api/storageservices/put-blob-from-url#authorization) or [Put Block From URL](/rest/api/storageservices/put-block-from-url#authorization).

## About copying blobs from a source object URL

The `Put Blob From URL` operation creates a new block blob where the contents of the blob are read from a given URL. The operation completes synchronously.

The source can be any object retrievable via a standard HTTP GET request on the given URL. This includes block blobs, append blobs, page blobs, blob snapshots, blob versions, or any accessible object inside or outside Azure.

When the source object is a block blob, all committed blob content is copied. The content of the destination blob is identical to the content of the source, but the list of committed blocks isn't preserved and uncommitted blocks aren't copied.

The destination is always a block blob, either an existing block blob, or a new block blob created by the operation. The contents of an existing blob are overwritten with the contents of the new blob.

The `Put Blob From URL` operation always copies the entire source blob. Copying a range of bytes or set of blocks isn't supported. To perform partial updates to a block blob’s contents by using a source URL, use the [Put Block From URL](/rest/api/storageservices/put-block-from-url) API along with [`Put Block List`](/rest/api/storageservices/put-block-list).

To learn more about the `Put Blob From URL` operation, including blob size limitations and billing considerations, see [Put Blob From URL remarks](/rest/api/storageservices/put-blob-from-url#remarks).

## Copy a blob from a source object URL

This section gives an overview of methods provided by the Azure Storage client library for Go to perform a copy operation from a source object URL.

The following method wraps the [Put Blob From URL](/rest/api/storageservices/put-blob-from-url) REST API operation, and creates a new block blob where the contents of the blob are read from a given URL:

- [UploadBlobFromURL](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/blockblob#Client.UploadBlobFromURL)

This method is preferred for scenarios where you want to move data into a storage account and have a URL for the source object.

For large objects, you might choose to work with individual blocks. The following method wraps the [Put Block From URL](/rest/api/storageservices/put-block-from-url) REST API operation. This method creates a new block to be committed as part of a blob where the contents are read from a source URL:

- [StageBlockFromURL](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/blockblob#Client.StageBlockFromURL)

## Copy a blob from a source within Azure

If you're copying a blob from a source within Azure, access to the source blob can be authorized via Microsoft Entra ID (recommended), a shared access signature (SAS), or an account key.

The following code example shows a scenario for copying a source blob within Azure. In this example, we also set the access tier for the destination blob to `Cool` using the [UploadBlobFromURLOptions](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/blockblob#UploadBlobFromURLOptions) struct.

:::code language="go" source="~/blob-devguide-go/cmd/copy-put-from-url/copy_put_from_url.go" id="snippet_copy_from_source_url":::

The following example shows sample usage:

:::code language="go" source="~/blob-devguide-go/cmd/copy-put-from-url/copy_put_from_url.go" id="snippet_copy_from_source_url_usage":::

## Copy a blob from a source outside of Azure

You can perform a copy operation on any source object that can be retrieved via HTTP GET request on a given URL, including accessible objects outside of Azure. The following code example shows a scenario for copying a blob from an accessible source object URL.

:::code language="go" source="~/blob-devguide-go/cmd/copy-put-from-url/copy_put_from_url.go" id="snippet_copy_from_external_source":::

The following example shows sample usage:

:::code language="go" source="~/blob-devguide-go/cmd/copy-put-from-url/copy_put_from_url.go" id="snippet_copy_from_external_source_usage":::

## Resources

To learn more about copying blobs using the Azure Blob Storage client library for Go, see the following resources.

### Code samples

- View [code samples](https://github.com/Azure-Samples/blob-storage-devguide-go/blob/main/cmd/copy-put-from-url/copy_put_from_url.go) from this article (GitHub)

### REST API operations

The Azure SDK for Go contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Go paradigms. The client library methods covered in this article use the following REST API operations:

- [Put Blob From URL](/rest/api/storageservices/put-blob-from-url) (REST API)
- [Put Block From URL](/rest/api/storageservices/put-block-from-url) (REST API)

[!INCLUDE [storage-dev-guide-resources-go](../../../includes/storage-dev-guides/storage-dev-guide-resources-go.md)]
