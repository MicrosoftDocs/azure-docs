---
title: Upload a blob with Go
titleSuffix: Azure Storage
description: Learn how to upload a blob to your Azure Storage account using the Go client library.
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.date: 05/22/2024
ms.service: azure-blob-storage
ms.topic: how-to
ms.devlang: golang
ms.custom: devx-track-go, devguide-go
---

# Upload a block blob with Go

[!INCLUDE [storage-dev-guide-selector-upload](../../../includes/storage-dev-guides/storage-dev-guide-selector-upload.md)]

This article shows how to upload a blob using the [Azure Storage client module for Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#section-readme). You can upload data to a block blob from a file path, a stream, a binary object, or a text string. You can also upload blobs with index tags.

[!INCLUDE [storage-dev-guide-prereqs-go](../../../includes/storage-dev-guides/storage-dev-guide-prereqs-go.md)]

## Set up your environment

[!INCLUDE [storage-dev-guide-project-setup-go](../../../includes/storage-dev-guides/storage-dev-guide-project-setup-go.md)]

#### Authorization

The authorization mechanism must have the necessary permissions to upload a blob. For authorization with Microsoft Entra ID (recommended), you need Azure RBAC built-in role **Storage Blob Data Contributor** or higher. To learn more, see the authorization guidance for [Put Blob](/rest/api/storageservices/put-blob#authorization) and [Put Block](/rest/api/storageservices/put-block#authorization).

## Upload data to a block blob

To upload a blob, call any of the following methods from the client object:

- [UploadBuffer](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#Client.UploadBuffer)
- [UploadFile](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#Client.UploadFile)
- [UploadStream](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#Client.UploadStream)

To perform the upload, the client library might use either [Put Blob](/rest/api/storageservices/put-blob) or a series of [Put Block](/rest/api/storageservices/put-block) calls followed by [`Put Block List`](/rest/api/storageservices/put-block-list). This behavior depends on the overall size of the object and how the data transfer options are set.

## Upload a block blob from a local file path

The following example uploads a local file to a block blob:

:::code language="go" source="~/blob-devguide-go/cmd/upload-blob/upload_blob.go" id="snippet_upload_blob_file":::

## Upload a block blob from a stream

The following example creates a `Reader` instance and reads from a string as if it were a stream of bytes. The stream is then uploaded to a block blob:

:::code language="go" source="~/blob-devguide-go/cmd/upload-blob/upload_blob.go" id="snippet_upload_blob_stream":::

## Upload binary data to a block blob

The following example uploads binary data to a block blob:

:::code language="go" source="~/blob-devguide-go/cmd/upload-blob/upload_blob.go" id="snippet_upload_blob_buffer":::

## Upload a block blob with index tags

The following example uploads a block blob with index tags:

:::code language="go" source="~/blob-devguide-go/cmd/upload-blob/upload_blob.go" id="snippet_upload_blob_tags":::

## Upload a block blob with configuration options

You can define client library configuration options when uploading a blob. These options can be tuned to improve performance, enhance reliability, and optimize costs. The following code examples show how to define configuration options for an upload operation.

### Specify data transfer options for upload

You can set configuration options when uploading a blob to optimize performance. The following configuration options are available for upload operations:

- `BlockSize`: The size of each block when uploading a block blob. The default value is 1 MiB.
- `Concurrency`: The maximum number of parallel connections to use during upload. The default value is 1.

For more information on transfer size limits for Blob Storage, see [Scale targets for Blob storage](scalability-targets.md#scale-targets-for-blob-storage).

The following code example shows how to specify data transfer options using the [UploadFileOptions](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/blockblob#UploadFileOptions). The values provided in this sample aren't intended to be a recommendation. To properly tune these values, you need to consider the specific needs of your app.

:::code language="go" source="~/blob-devguide-go/cmd/upload-blob/upload_blob.go" id="snippet_upload_blob_transfer_options":::

[!INCLUDE [storage-dev-guide-code-samples-note-go](../../../includes/storage-dev-guides/storage-dev-guide-code-samples-note-go.md)]

## Resources

To learn more about uploading blobs using the Azure Blob Storage client module for Go, see the following resources.

### Code samples

- View [code samples](https://github.com/Azure-Samples/blob-storage-devguide-go/blob/main/cmd/upload-blob/upload_blob.go) from this article (GitHub)

### REST API operations

The Azure SDK for Go contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Go paradigms. The client library methods for uploading blobs use the following REST API operations:

- [Put Blob](/rest/api/storageservices/put-blob) (REST API)
- [Put Block](/rest/api/storageservices/put-block) (REST API)

[!INCLUDE [storage-dev-guide-resources-go](../../../includes/storage-dev-guides/storage-dev-guide-resources-go.md)]

### See also

- [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md)
- [Use blob index tags to manage and find data on Azure Blob Storage](storage-blob-index-how-to.md)