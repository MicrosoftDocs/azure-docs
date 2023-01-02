---
title: Use JavaScript to manage properties and metadata for a blob container
titleSuffix: Azure Storage
description: Learn how to set and retrieve system properties and store custom metadata on blob containers in your Azure Storage account using the JavaScript client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: storage
ms.topic: how-to
ms.date: 11/30/2022

ms.devlang: javascript
ms.custom: devx-track-js, devguide-js
---

# Manage container properties and metadata with JavaScript

Blob containers support system properties and user-defined metadata, in addition to the data they contain. This article shows how to manage system properties and user-defined metadata with the [Azure Storage client library for JavaScript](https://www.npmjs.com/package/@azure/storage-blob).

## About properties and metadata

- **System properties**: System properties exist on each Blob storage resource. Some of them can be read or set, while others are read-only. Under the covers, some system properties correspond to certain standard HTTP headers. The Azure Storage client library for JavaScript maintains these properties for you.

- **User-defined metadata**: User-defined metadata consists of one or more name-value pairs that you specify for a Blob storage resource. You can use metadata to store additional values with the resource. Metadata values are for your own purposes only, and do not affect how the resource behaves.

- **Metadata names**: Metadata name/value pairs are valid HTTP headers and should adhere to all restrictions governing HTTP headers. For more information about metadata naming requirements, see [Metadata names](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata#metadata-names).

## Retrieve container properties

To retrieve container properties, create a [ContainerClient](/javascript/api/@azure/storage-blob/containerclient) object then use the following method:

- ContainerClient.[getProperties](/javascript/api/@azure/storage-blob/containerclient#@azure-storage-blob-containerclient-getproperties) which returns [ContainerProperties](/javascript/api/@azure/storage-blob/containerproperties)

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

- [ContainerClient.getProperties](/javascript/api/@azure/storage-blob/containerclient#@azure-storage-blob-containerclient-getproperties) which returns metadata inside the ContainerProperties object.


## See also

- [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md)
- [Get Container Properties operation](/rest/api/storageservices/get-container-properties)
- [Set Container Metadata operation](/rest/api/storageservices/set-container-metadata)
- [Get Container Metadata operation](/rest/api/storageservices/get-container-metadata)
