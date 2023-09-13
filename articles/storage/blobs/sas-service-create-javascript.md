---
title: Create a service SAS for a container or blob with JavaScript
titleSuffix: Azure Storage
description: Learn how to create a service shared access signature (SAS) for a container or blob using the Azure Blob Storage client library for JavaScript.
author: pauljewellmsft

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 01/19/2023
ms.author: pauljewell
ms.reviewer: nachakra
ms.devlang: javascript
ms.custom: devx-track-javascript, engagement-fy23, devx-track-js
---

# Create a service SAS for a container or blob with JavaScript

[!INCLUDE [storage-auth-sas-intro-include](../../../includes/storage-auth-sas-intro-include.md)]

This article shows how to use the storage account key to create a service SAS for a container or blob with the Blob Storage client library for JavaScript.

## Create a service SAS for a blob container

The following code example creates a SAS for a container. If the name of an existing stored access policy is provided, that policy is associated with the SAS. If no stored access policy is provided, then the code creates an ad hoc SAS on the container.

A service SAS is signed with the account access key. Use the [StorageSharedKeyCredential](/javascript/api/@azure/storage-blob/storagesharedkeycredential) class to create the credential that is used to sign the SAS. Next, call the [generateBlobSASQueryParameters](/javascript/api/@azure/storage-blob/#@azure-storage-blob-generateblobsasqueryparameters) function providing the required parameters to get the SAS token string.

:::code language="javascript" source="~/azure-storage-snippets/blobs/howto/JavaScript/NodeJS-v12/SAS.js" id="Snippet_ContainerSAS":::

## Create a service SAS for a blob

The following code example creates a SAS on a blob. If the name of an existing stored access policy is provided, that policy is associated with the SAS. If no stored access policy is provided, then the code creates an ad hoc SAS on the blob.

To create a service SAS for a blob, call the [generateBlobSASQueryParameters](/javascript/api/@azure/storage-blob/#@azure-storage-blob-generateblobsasqueryparameters) function providing the required parameters.

:::code language="javascript" source="~/azure-storage-snippets/blobs/howto/JavaScript/NodeJS-v12/SAS.js" id="Snippet_BlobSAS":::

[!INCLUDE [storage-blob-javascript-resources-include](../../../includes/storage-blob-javascript-resources-include.md)]

## Next steps

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md)
- [Create a service SAS](/rest/api/storageservices/create-service-sas)
