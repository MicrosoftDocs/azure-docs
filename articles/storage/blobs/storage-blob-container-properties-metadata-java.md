---
title: Use Java to manage properties and metadata for a blob container
titleSuffix: Azure Storage
description: Learn how to set and retrieve system properties and store custom metadata on blob containers in your Azure Storage account using the Java client library.
services: storage
author: pauljewellmsft

ms.service: storage
ms.topic: how-to
ms.date: 12/22/2022
ms.author: pauljewell
ms.devlang: java
ms.custom: devx-track-java, devguide-java
---

# Manage container properties and metadata with Java

Blob containers support system properties and user-defined metadata, in addition to the data they contain. This article shows how to manage system properties and user-defined metadata with the [Azure Storage client library for Java](/java/api/overview/azure/storage-blob-readme).

## About properties and metadata

- **System properties**: System properties exist on each Blob Storage resource. Some of them can be read or set, while others are read-only. Behind the scenes, some system properties correspond to certain standard HTTP headers. The Azure Storage client library for Java maintains these properties for you.

- **User-defined metadata**: User-defined metadata consists of one or more name-value pairs that you specify for a Blob storage resource. You can use metadata to store additional values with the resource. Metadata values are for your own purposes only, and don't affect how the resource behaves.

- **Metadata names**: Metadata name/value pairs are valid HTTP headers and should adhere to all restrictions governing HTTP headers. For more information about metadata naming requirements, see [Metadata names](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata#metadata-names).

## Retrieve container properties

To retrieve container properties, use the following method:

- [getProperties](/java/api/com.azure.storage.blob.blobcontainerclient)

The following code example fetches a container's system properties and writes the property values to a console window:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-containers/src/main/java/com/blobs/devguide/containers/ContainerPropertiesMetadata.java" id="Snippet_GetContainerProperties":::

## Set and retrieve metadata

You can specify metadata as one or more name-value pairs on a blob or container resource. To set metadata, use the following method:

- [setMetadata](/java/api/com.azure.storage.blob.blobcontainerclient)

The name of your metadata must conform to the naming conventions for C# identifiers. Metadata names preserve the case with which they were created, but are case-insensitive when set or read. If two or more metadata headers with the same name are submitted for a resource, the Blob service returns status code 400 (Bad Request).

Setting container metadata overwrites all existing metadata associated with the container. It's not possible to modify an individual name-value pair.

The following code example sets metadata on a container:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-containers/src/main/java/com/blobs/devguide/containers/ContainerPropertiesMetadata.java" id="Snippet_AddContainerMetadata":::

To retrieve metadata, call the following method:

- [getProperties](/java/api/com.azure.storage.blob.blobcontainerclient)

The following example reads in metadata values: 

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-containers/src/main/java/com/blobs/devguide/containers/ContainerPropertiesMetadata.java" id="Snippet_ReadContainerMetadata":::

## See also

- [View code sample in GitHub](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/Java/blob-devguide/blob-devguide-containers/src/main/java/com/blobs/devguide/containers/ContainerPropertiesMetadata.java)
- [Quickstart: Azure Blob Storage client library for Java](storage-quickstart-blobs-java.md)
- [Get Container Properties](/rest/api/storageservices/get-container-properties) (REST API)
- [Set Container Metadata](/rest/api/storageservices/set-container-metadata) (REST API)
- [Get Container Metadata](/rest/api/storageservices/get-container-metadata) (REST API)