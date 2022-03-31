---
title: Use JavaScript to manage properties and metadata for a blob container
titleSuffix: Azure Storage
description: Learn how to set and retrieve system properties and store custom metadata on blob containers in your Azure Storage account using the JavaScript client library.
services: storage
author: normesta

ms.service: storage
ms.topic: how-to
ms.date: 03/28/2022
ms.author: normesta
ms.devlang: javascript
ms.custom: devx-track-javascript
---

# Manage container properties and metadata with JavaScript

Blob containers support system properties and user-defined metadata, in addition to the data they contain. This article shows how to manage system properties and user-defined metadata with the [Azure Storage client library for JavaScript]().

## About properties and metadata

- **System properties**: System properties exist on each Blob storage resource. Some of them can be read or set, while others are read-only. Under the covers, some system properties correspond to certain standard HTTP headers. The Azure Storage client library for JavaScript maintains these properties for you.

- **User-defined metadata**: User-defined metadata consists of one or more name-value pairs that you specify for a Blob storage resource. You can use metadata to store additional values with the resource. Metadata values are for your own purposes only, and do not affect how the resource behaves.

Metadata name/value pairs are valid HTTP headers, and so should adhere to all restrictions governing HTTP headers. Metadata names must be valid HTTP header names and valid C# identifiers, may contain only ASCII characters, and should be treated as case-insensitive. Metadata values containing non-ASCII characters should be Base64-encoded or URL-encoded.

## Retrieve container properties

To retrieve container properties, use:

- [ContainerClient.getProperties()](/javascript/api/@azure/storage-blob/containerclient?view=azure-node-latest#@azure-storage-blob-containerclient-getproperties)

The following code example fetches a container's system properties and writes some property values to a console window:

```javascript

```

## Set and retrieve metadata

You can specify metadata as one or more name-value pairs on a blob or container resource. To set metadata, create a map of name-value pairs, and then call one of the following methods to write the values:

- [ContainerClient.setMetadata](metadata, containerSetMetadataOptions)

The name of your metadata must conform to the naming conventions for JavaScript identifiers. Metadata names preserve the case with which they were created, but are case-insensitive when set or read. If two or more metadata headers with the same name are submitted for a resource, Blob storage comma-separates and concatenates the two values and return HTTP response code 200 (OK).

The following code example sets metadata on a container.

```javascript

```

To retrieve metadata, call:

- [ContainerClient.getProperties](/javascript/api/@azure/storage-blob/containerclient?view=azure-node-latest#@azure-storage-blob-containerclient-getproperties)

Then, read the values, as shown in the example below.

```javascript

```

## See also

- [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md)
- [Get Container Properties operation](/rest/api/storageservices/get-container-properties)
- [Set Container Metadata operation](/rest/api/storageservices/set-container-metadata)
- [Get Container Metadata operation](/rest/api/storageservices/get-container-metadata)
