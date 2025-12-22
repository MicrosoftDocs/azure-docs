---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 12/15/2025
ms.author: glenga 
---

This example shows how to get the BlobClient from both a Storage Blob trigger and from the input binding on an HTTP trigger:

:::code language="typescript" source="~/functions-node-sdk-bindings-blob/blobClientSdkBinding/src/functions/storageBlobTrigger.ts" :::

This example shows how to get the `ContainerClient` from both a Storage Blob input binding using an HTTP trigger:

:::code language="typescript" source="~/functions-node-sdk-bindings-blob/containerClientInputBinding/src/functions/listBlobs.ts" :::