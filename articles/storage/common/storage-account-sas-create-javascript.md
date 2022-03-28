---
title: Create an account SAS with JavaScript
titleSuffix: Azure Storage
description: Learn how to create an account shared access signature (SAS) using the JavaScript client library.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 03/28/2022
ms.author: tamram
ms.reviewer: dineshm
ms.subservice: common
ms.custom: devx-track-js
---

# Create an account SAS with JavaScript

[!INCLUDE [storage-auth-sas-intro-include](../../../includes/storage-auth-sas-intro-include.md)]

This article shows how to use the storage account key to create an account SAS with the [Azure Storage client library for JavaScript](/javascript/api/@azure/storage-blob).

## Create an account SAS with JavaScript v12 SDK

A account SAS is signed with the account access key. Use the [StorageSharedKeyCredential](/javascript/api/@azure/storage-blob/storagesharedkeycredential?view=azure-node-latest) class to create the credential that is used to sign the SAS.

**NEED TO ADD Snippet_GetAccountSASToken**

# [Node.js](#tab/nodejs)

:::code language="javascript" source="~/azure-storage-snippets/blobs/howto/JavaScript/NodeJS-v12/SAS.js" id="Snippet_GetAccountSASToken":::

# [Browser/Client](#tab/browser)



---

## Create a container SAS with JavaScript v12 SDK

To create an account SAS for a container, call the [ContainerSASPermissions.generateBlobSASQueryParameters](/javascript/api/@azure/storage-blob/containersaspermissions?view=azure-node-latest) method.


# [Node.js](#tab/nodejs)

:::code language="javascript" source="~/azure-storage-snippets/blobs/howto/JavaScript/NodeJS-v12/SAS.js" id="Snippet_ContainerSAS":::

# [Browser/Client](#tab/browser)


---


## Next steps

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](storage-sas-overview.md)
- [Create an account SAS](/rest/api/storageservices/create-account-sas)
