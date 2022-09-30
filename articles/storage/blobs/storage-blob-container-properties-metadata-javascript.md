---
title: Use JavaScript to manage properties and metadata for a blob container
titleSuffix: Azure Storage
description: Learn how to set and retrieve system properties and store custom metadata on blob containers in your Azure Storage account using the JavaScript client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: storage
ms.topic: how-to
ms.date: 03/28/2022

ms.devlang: javascript
ms.custom: devx-track-javascript
---

# Manage container properties and metadata with JavaScript

Blob containers support system properties and user-defined metadata, in addition to the data they contain. This article shows how to manage system properties and user-defined metadata with the [Azure Storage client library for JavaScript](https://www.npmjs.com/package/@azure/storage-blob).

## About properties and metadata

| Type|Description|
|--|--|
|[System properties](/javascript/api/@azure/storage-blob/containerproperties#@azure-storage-blob-containerproperties-lastmodified)|System properties exist on each Blob storage resource. Some of them can be read or set, while others are read-only. Under the covers, some system properties correspond to certain standard HTTP headers. The Azure Storage client library for JavaScript maintains these properties for you. <br><br>Examples:<br>* lastModified<br>* leaseStatus|
|**User-defined metadata**|User-defined metadata consists of one or more name-value pairs that you specify for a Blob storage resource. You can use metadata to store additional values with the resource. Metadata values are for your own purposes only, and do not affect how the resource behaves.<br><br>Examples:<br>`project`:`metrics-reporting`<br>`manager`:`johnh`|

Metadata name/value pairs are valid HTTP headers, and so should adhere to all restrictions governing HTTP headers. Metadata names must be valid HTTP header names and should be treated as case-insensitive. Metadata values containing non-ASCII characters should be Base64-encoded or URL-encoded.

## Retrieve container properties

To retrieve container properties, use:

- [ContainerClient.getProperties()](/javascript/api/@azure/storage-blob/containerclient#@azure-storage-blob-containerclient-getproperties) which returns [ContainerProperties](/javascript/api/@azure/storage-blob/containerproperties)

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

You can specify metadata as one or more name-value pairs container resource. To set metadata, use:

- [ContainerClient.setMetadata](/javascript/api/@azure/storage-blob/containerclient#@azure-storage-blob-containerclient-setmetadata)

The name of your metadata must conform to the naming conventions for JavaScript identifiers. Metadata names preserve the case with which they were created, but are case-insensitive when set or read. If two or more metadata headers with the same name are submitted for a resource, Blob storage comma-separates and concatenates the two values and return HTTP response code 200 (OK).

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
