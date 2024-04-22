---
title: Use Go to manage properties and metadata for a blob container
titleSuffix: Azure Storage
description: Learn how to set and retrieve system properties and store custom metadata on blob containers in your Azure Storage account using the Go client library.
services: storage
author: pauljewellmsft

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 04/22/2024
ms.author: pauljewell
ms.devlang: golang
ms.custom: devx-track-go, devguide-go
---

# Manage container properties and metadata with Go

[!INCLUDE [storage-dev-guide-selector-manage-properties-container](../../../includes/storage-dev-guides/storage-dev-guide-selector-manage-properties-container.md)]

Blob containers support system properties and user-defined metadata, in addition to the data they contain. This article shows how to manage system properties and user-defined metadata with the [Azure Storage client module for Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#section-readme).

## Prerequisites

- This article assumes you already have a project set up to work with the Azure Blob Storage client module for Go. To learn about setting up your project, including package installation, adding `import` statements, and creating an authorized client object, see [Get started with Azure Blob Storage and Go](storage-blob-go-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to work with container properties or metadata. To learn more, see the authorization guidance for the following REST API operations:
    - [Get Container Properties](/rest/api/storageservices/get-container-properties#authorization)
    - [Set Container Metadata](/rest/api/storageservices/set-container-metadata#authorization)
    - [Get Container Metadata](/rest/api/storageservices/get-container-metadata#authorization)

## About properties and metadata

- **System properties**: System properties exist on each Blob Storage resource. Some of them can be read or set, while others are read-only. Behind the scenes, some system properties correspond to certain standard HTTP headers. The Azure Storage client library for Go maintains these properties for you.

- **User-defined metadata**: User-defined metadata consists of one or more name-value pairs that you specify for a Blob storage resource. You can use metadata to store additional values with the resource. Metadata values are for your own purposes only, and don't affect how the resource behaves.

    Metadata name/value pairs are valid HTTP headers and should adhere to all restrictions governing HTTP headers. For more information about metadata naming requirements, see [Metadata names](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata#metadata-names).

## Retrieve container properties

To retrieve container properties, use the following method:

- [ContainerClient.get_container_properties](/python/api/azure-storage-blob/azure.storage.blob.containerclient#azure-storage-blob-containerclient-get-container-properties)

The following code example fetches a container's system properties and writes the property values to a console window:

:::code language="go" source="~/blob-devguide-go/cmd/container-properties-metadata/container_properties_metadata.go id="snippet_get_container_properties":::

## Set and retrieve metadata

You can specify metadata as one or more name-value pairs on a blob or container resource. To set metadata, use the following method:

- [ContainerClient.set_container_metadata](/python/api/azure-storage-blob/azure.storage.blob.containerclient#azure-storage-blob-containerclient-set-container-metadata)

Setting container metadata overwrites all existing metadata associated with the container. It's not possible to modify an individual name-value pair.

The following code example sets metadata on a container:

:::code language="go" source="~/blob-devguide-go/cmd/container-properties-metadata/container_properties_metadata.go id="snippet_set_container_metadata":::

To retrieve metadata, call the following method:

- [ContainerClient.get_container_properties](/python/api/azure-storage-blob/azure.storage.blob.containerclient#azure-storage-blob-containerclient-get-container-properties)

The following example reads in metadata values: 

:::code language="go" source="~/blob-devguide-go/cmd/container-properties-metadata/container_properties_metadata.go id="snippet_get_container_metadata":::

## Resources

To learn more about setting and retrieving container properties and metadata using the Azure Blob Storage client module for Go, see the following resources.

### REST API operations

The Azure SDK for Go contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Go paradigms. The client library methods for setting and retrieving properties and metadata use the following REST API operations:

- [Get Container Properties](/rest/api/storageservices/get-container-properties) (REST API)
- [Set Container Metadata](/rest/api/storageservices/set-container-metadata) (REST API)
- [Get Container Metadata](/rest/api/storageservices/get-container-metadata) (REST API)

The `get_container_properties` method retrieves container properties and metadata by calling both the [Get Container Properties](/rest/api/storageservices/get-container-properties) operation and the [Get Container Metadata](/rest/api/storageservices/get-container-metadata) operation.

### Code samples

- View [code samples](https://github.com/Azure-Samples/blob-storage-devguide-go/cmd/container-properties-metadata/container_properties_metadata.go) from this article (GitHub)

[!INCLUDE [storage-dev-guide-resources-go](../../../includes/storage-dev-guides/storage-dev-guide-resources-go.md)]