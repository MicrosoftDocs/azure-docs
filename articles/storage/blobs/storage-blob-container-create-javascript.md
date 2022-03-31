---
title: Create a blob container with JavaScript - Azure Storage 
description: Learn how to create a blob container in your Azure Storage account using the JavaScript client library.
services: storage
author: normesta

ms.service: storage
ms.topic: how-to
ms.date: 03/28/2022
ms.author: normesta
ms.subservice: blobs
ms.devlang: javascript
ms.custom: devx-track-js
---

# Create a container in Azure Storage with JavaScript

Blobs in Azure Storage are organized into containers. Before you can upload a blob, you must first create a container. This article shows how to create containers with the [Azure Storage client library for JavaScript]().

## Name a container

A container name must be a valid DNS name, as it forms part of the unique URI used to address the container or its blobs. Follow these rules when naming a container:

- Container names can be between 3 and 63 characters long.
- Container names must start with a letter or number, and can contain only lowercase letters, numbers, and the dash (-) character.
- Two or more consecutive dash characters aren't permitted in container names.

The URI for a container is in this format:

`https://myaccount.blob.core.windows.net/mycontainer`

## Create a container

To create a container, call one of the following methods:

- [CreateBlobContainer]()
- [CreateBlobContainerAsync]()

These methods throw an exception if a container with the same name already exists.

Containers are created immediately beneath the storage account. It's not possible to nest one container beneath another.

The following example creates a container asynchronously:

:::code language="javascript" source="~/azure-storage-snippets/blobs/quickstarts/JavaScript/V12/nodejs/index.js" id="snippet_CreateContainer":::

## Create the root container

A root container serves as a default container for your storage account. Each storage account may have one root container, which must be named *$root*. The root container must be explicitly created or deleted.

You can reference a blob stored in the root container without including the root container name. The root container enables you to reference a blob at the top level of the storage account hierarchy. For example, you can reference a blob that is in the root container in the following manner:

`https://myaccount.blob.core.windowsJavaScript/default.html`

The following example creates the root container synchronously:

```javascript
const { BlobServiceClient, AnonymousCredential } = require("@azure/storage-blob");

// Enter your storage account name and SAS
const account = process.env.ACCOUNT_NAME || "<account name>";
const accountSas = process.env.ACCOUNT_SAS || "<account SAS>";

// List containers
const blobServiceClient = new BlobServiceClient(
// When using AnonymousCredential, following url should include a valid SAS or support public access
`https://${account}.blob.core.windows.net${accountSas}`,
new AnonymousCredential()
);

const container =  blobServiceClient.createContainer("$root");
```

## See also

- [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md)
- [Create Container operation](/rest/api/storageservices/create-container)
- [Delete Container operation](/rest/api/storageservices/delete-container)
