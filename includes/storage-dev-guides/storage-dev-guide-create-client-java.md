---
title: "include file"
description: "include file"
services: storage
author: pauljewellmsft
ms.service: azure-blob-storage
ms.topic: include
ms.date: 08/26/2024
ms.author: pauljewell
ms.custom: include file
---

#### Create a client object

To connect an app to Blob Storage, create an instance of [BlobServiceClient](/java/api/com.azure.storage.blob.blobserviceclient).

The following example uses [BlobServiceClientBuilder](/java/api/com.azure.storage.blob.blobserviceclientbuilder) to build a `BlobServiceClient` object using `DefaultAzureCredential`, and shows how to create container and blob clients, if needed:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/App.java" id="Snippet_GetServiceClientAzureAD":::

To learn more about creating and managing client objects, see [Create and manage client objects that interact with data resources](../../articles/storage/blobs/storage-blob-client-management.md).

