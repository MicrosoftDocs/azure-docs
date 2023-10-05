---
title: Tutorial - JavaScript Web app accesses storage by using managed identities | Azure
description: In this tutorial, you learn how to access Azure Storage for a JavaScript app by using managed identities.
services: storage, app-service-web
author: rwike77
manager: CelesteDG
ms.service: app-service
ms.topic: tutorial
ms.workload: identity
ms.date: 07/31/2023
ms.author: ryanwi
ms.reviewer: stsoneff
ms.devlang: javascript, azurecli
ms.custom: azureday1, devx-track-azurecli, devx-track-azurepowershell, subject-rbac-steps, devx-track-dotnet, devx-track-js, AppServiceConnectivity
ms.subservice: web-apps
#Customer intent: As an application developer, I want to learn how to access Azure Storage for an app by using managed identities.
---

# Tutorial: Access Azure services from a JavaScript web app

[!INCLUDE [tutorial-content-above-code](./includes/tutorial-dotnet-storage-managed-identity/introduction.md)]

## Access Blob Storage
The `DefaultAzureCredential` class from [@azure/identity](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/identity/identity/README.md) package is used to get a token credential for your code to authorize requests to Azure Storage. The `BlobServiceClient` class from [@azure/storage-blob](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/storage/storage-blob) package is used to upload a new blob to storage. Create an instance of the `DefaultAzureCredential` class, which uses the managed identity to fetch tokens and attach them to the blob service client. The following code example gets the authenticated token credential and uses it to create a service client object, which uploads a new blob.

To see this code as part of a sample application, see *StorageHelper.js* in the:
* [Sample on GitHub](https://github.com/Azure-Samples/ms-identity-easyauth-nodejs-storage-graphapi/tree/main/1-WebApp-storage-managed-identity).

## JavaScript example

```nodejs
const { DefaultAzureCredential } = require("@azure/identity");
const { BlobServiceClient } = require("@azure/storage-blob");
const defaultAzureCredential = new DefaultAzureCredential();

// Some code omitted for brevity.

async function uploadBlob(accountName, containerName, blobName, blobContents) {
    const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net`,
        defaultAzureCredential
    );

    const containerClient = blobServiceClient.getContainerClient(containerName);

    try {
        await containerClient.createIfNotExists();
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        const uploadBlobResponse = await blockBlobClient.upload(blobContents, blobContents.length);
        console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
    } catch (error) {
        console.log(error);
    }
}
```

[!INCLUDE [tutorial-clean-up-steps](./includes/tutorial-cleanup.md)]

[!INCLUDE [tutorial-content-below-code](./includes/tutorial-dotnet-storage-managed-identity/cleanup.md)]
