---
title: Manage properties and metadata for a blob with Go
titleSuffix: Azure Storage
description: Learn how to set and retrieve system properties and store custom metadata on blobs in your Azure Storage account using the Go client library.
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.date: 05/22/2024
ms.service: azure-blob-storage
ms.topic: how-to
ms.devlang: golang
ms.custom: devx-track-go, devguide-go
---

# Manage blob properties and metadata with Go

[!INCLUDE [storage-dev-guide-selector-manage-properties-blob](../../../includes/storage-dev-guides/storage-dev-guide-selector-manage-properties-blob.md)]

In addition to the data they contain, blobs support system properties and user-defined metadata. This article shows how to manage system properties and user-defined metadata using the [Azure Storage client module for Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#section-readme).

[!INCLUDE [storage-dev-guide-prereqs-go](../../../includes/storage-dev-guides/storage-dev-guide-prereqs-go.md)]

## Set up your environment

[!INCLUDE [storage-dev-guide-project-setup-go](../../../includes/storage-dev-guides/storage-dev-guide-project-setup-go.md)]

#### Authorization

The authorization mechanism must have the necessary permissions to work with container properties or metadata. For authorization with Microsoft Entra ID (recommended), you need Azure RBAC built-in role **Storage Blob Data Reader** or higher for the *get* operations, and **Storage Blob Data Contributor** or higher for the *set* operations. To learn more, see the authorization guidance for [Set Blob Properties](/rest/api/storageservices/set-blob-properties#authorization), [Get Blob Properties](/rest/api/storageservices/get-blob-properties#authorization), [Set Blob Metadata](/rest/api/storageservices/set-blob-metadata#authorization), or [Get Blob Metadata](/rest/api/storageservices/get-blob-metadata#authorization).

## About properties and metadata

- **System properties**: System properties exist on each Blob storage resource. Some of them can be read or set, while others are read-only. Under the covers, some system properties correspond to certain standard HTTP headers. The Azure Storage client library for Go maintains these properties for you.

- **User-defined metadata**: User-defined metadata consists of one or more name-value pairs that you specify for a Blob storage resource. You can use metadata to store additional values with the resource. Metadata values are for your own purposes only, and don't affect how the resource behaves.

    Metadata name/value pairs are valid HTTP headers and should adhere to all restrictions governing HTTP headers. For more information about metadata naming requirements, see [Metadata names](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata#metadata-names).

> [!NOTE]
> Blob index tags also provide the ability to store arbitrary user-defined key/value attributes alongside an Azure Blob storage resource. While similar to metadata, only blob index tags are automatically indexed and made searchable by the native blob service. Metadata cannot be indexed and queried unless you utilize a separate service such as Azure Search.
>
> To learn more about this feature, see [Manage and find data on Azure Blob storage with blob index (preview)](storage-manage-find-blobs.md).

## Set and retrieve properties

To set properties on a blob, call the following method from a blob client object:

- [SetHTTPHeaders](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/blob#Client.SetHTTPHeaders)

Any properties not explicitly set are cleared. To preserve any existing properties, you can first retrieve the blob properties, then use them to populate the headers that aren't being updated.

The following code example sets the `BlobContentType` and `BlobContentLanguage` system properties on a blob, while preserving the existing properties:

:::code language="go" source="~/blob-devguide-go/cmd/blob-properties-metadata/blob_properties_metadata.go" id="snippet_set_blob_properties":::

To retrieve properties on a blob, call  the following method from a blob client object:

- [GetProperties](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/blob#Client.GetProperties)

The following code example gets a blob's system properties and displays some of the values:

:::code language="go" source="~/blob-devguide-go/cmd/blob-properties-metadata/blob_properties_metadata.go" id="snippet_get_blob_properties":::

## Set and retrieve metadata

You can specify metadata as one or more name-value pairs on a blob or container resource. To set metadata, send a map containing name-value pairs using the following method from a blob client object:

- [SetMetadata](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/blob#Client.SetMetadata)

The following code example sets metadata on a blob:

:::code language="go" source="~/blob-devguide-go/cmd/blob-properties-metadata/blob_properties_metadata.go" id="snippet_set_blob_metadata":::

To retrieve metadata, call the [GetProperties](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/blob#Client.GetProperties) method from a blob client object, and access the `Metadata` field in the response. The `GetProperties` method retrieves blob properties and metadata by calling both the [Get Blob Properties](/rest/api/storageservices/get-blob-properties) operation and the [Get Blob Metadata](/rest/api/storageservices/get-blob-metadata) operation.

The following code example reads metadata on a blob and prints each key/value pair: 

:::code language="go" source="~/blob-devguide-go/cmd/blob-properties-metadata/blob_properties_metadata.go" id="snippet_get_blob_metadata":::

[!INCLUDE [storage-dev-guide-code-samples-note-go](../../../includes/storage-dev-guides/storage-dev-guide-code-samples-note-go.md)]

## Resources

To learn more about how to manage system properties and user-defined metadata using the Azure Blob Storage client module for Go, see the following resources.

### Code samples

- View [code samples](https://github.com/Azure-Samples/blob-storage-devguide-go/blob/main/cmd/blob-properties-metadata/blob_properties_metadata.go) from this article (GitHub)

### REST API operations

The Azure SDK for Go contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Go paradigms. The client library methods for managing system properties and user-defined metadata use the following REST API operations:

- [Set Blob Properties](/rest/api/storageservices/set-blob-properties) (REST API)
- [Get Blob Properties](/rest/api/storageservices/get-blob-properties) (REST API)
- [Set Blob Metadata](/rest/api/storageservices/set-blob-metadata) (REST API)
- [Get Blob Metadata](/rest/api/storageservices/get-blob-metadata) (REST API)

[!INCLUDE [storage-dev-guide-resources-go](../../../includes/storage-dev-guides/storage-dev-guide-resources-go.md)]