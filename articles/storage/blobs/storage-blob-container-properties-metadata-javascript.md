---
title: Use JavaScript to manage properties and metadata for a blob container
titleSuffix: Azure Storage
description: Learn how to set and retrieve system properties and store custom metadata on blob containers in your Azure Storage account using the JavaScript client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: azure-storage
ms.topic: how-to
ms.date: 11/30/2022

ms.devlang: javascript
ms.custom: devx-track-js, devguide-js
---

# Manage container properties and metadata with JavaScript

Blob containers support system properties and user-defined metadata, in addition to the data they contain. This article shows how to manage system properties and user-defined metadata with the [Azure Storage client library for JavaScript](https://www.npmjs.com/package/@azure/storage-blob).

## Prerequisites

- The examples in this article assume you already have a project set up to work with the Azure Blob Storage client library for JavaScript. To learn about setting up your project, including package installation, importing modules, and creating an authorized client object to work with data resources, see [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to work with container properties or metadata. To learn more, see the authorization guidance for the following REST API operations:
    - [Get Container Properties](/rest/api/storageservices/get-container-properties#authorization)
    - [Set Container Metadata](/rest/api/storageservices/set-container-metadata#authorization)
    - [Get Container Metadata](/rest/api/storageservices/get-container-metadata#authorization)

## About properties and metadata

- **System properties**: System properties exist on each Blob storage resource. Some of them can be read or set, while others are read-only. Under the covers, some system properties correspond to certain standard HTTP headers. The Azure Storage client library for JavaScript maintains these properties for you.

- **User-defined metadata**: User-defined metadata consists of one or more name-value pairs that you specify for a Blob storage resource. You can use metadata to store additional values with the resource. Metadata values are for your own purposes only, and don't affect how the resource behaves.

    Metadata name/value pairs are valid HTTP headers and should adhere to all restrictions governing HTTP headers. For more information about metadata naming requirements, see [Metadata names](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata#metadata-names).

## Retrieve container properties

To retrieve container properties, create a [ContainerClient](/javascript/api/@azure/storage-blob/containerclient) object then use the following method:

- ContainerClient.[getProperties](/javascript/api/@azure/storage-blob/containerclient#@azure-storage-blob-containerclient-getproperties) (returns [ContainerProperties](/javascript/api/@azure/storage-blob/containerproperties))

The following code example fetches a container's properties and writes the property values to a console window:

```javascript
async function getContainerProperties(containerClient) {

  // Get Properties including existing metadata
  const containerProperties = await containerClient.getProperties();
  if(!containerProperties.errorCode){
    console.log(containerProperties);
  }
}
```

## Set and retrieve metadata

You can specify metadata as one or more name-value pairs container resource. To set metadata, create a [ContainerClient](/javascript/api/@azure/storage-blob/containerclient) object then use the following method:

- ContainerClient.[setMetadata](/javascript/api/@azure/storage-blob/containerclient#@azure-storage-blob-containerclient-setmetadata)

The following code example sets metadata on a container.

```javascript
/*
const metadata = {
  // values must be strings
  lastFileReview: currentDate.toString(),
  reviewer: `johnh`
}
*/
async function setContainerMetadata(containerClient, metadata) {

  await containerClient.setMetadata(metadata);

}
```

To retrieve metadata, [get the container properties](#retrieve-container-properties) then use the returned **metadata** property. 

- [ContainerClient.getProperties](/javascript/api/@azure/storage-blob/containerclient#@azure-storage-blob-containerclient-getproperties)

## Resources

To learn more about setting and retrieving container properties and metadata using the Azure Blob Storage client library for JavaScript, see the following resources.

### REST API operations

The Azure SDK for JavaScript contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar JavaScript paradigms. The client library methods for setting and retrieving properties and metadata use the following REST API operations:

- [Get Container Properties](/rest/api/storageservices/get-container-properties) (REST API)
- [Set Container Metadata](/rest/api/storageservices/set-container-metadata) (REST API)
- [Get Container Metadata](/rest/api/storageservices/get-container-metadata) (REST API)

The `getProperties` method retrieves container properties and metadata by calling both the [Get Blob Properties](/rest/api/storageservices/get-blob-properties) operation and the [Get Blob Metadata](/rest/api/storageservices/get-blob-metadata) operation.

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide/container-set-properties-and-metadata.js)

[!INCLUDE [storage-dev-guide-resources-javascript](../../../includes/storage-dev-guides/storage-dev-guide-resources-javascript.md)]
