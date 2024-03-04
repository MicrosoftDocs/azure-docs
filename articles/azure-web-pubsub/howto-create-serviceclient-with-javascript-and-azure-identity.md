---
title: How to create a WebPubSubServiceClient with JavaScript and Azure Identity
description: How to create a WebPubSubServiceClient with JavaScript and Azure Identity
author: terencefan

ms.author: tefa
ms.date: 11/15/2021
ms.service: azure-web-pubsub
ms.custom: devx-track-js
ms.topic: how-to
---

# How to create a `WebPubSubServiceClient` with JavaScript and Azure Identity

This how-to guide shows you how to create a `WebPubSubServiceClient` using Microsoft Entra ID in JavaScript.

## Requirements

- Install [@azure/identity](https://www.npmjs.com/package/@azure/identity) package from npmjs.com.

  ```bash
  npm install --save @azure/identity
  ```

- Install [@azure/web-pubsub](https://www.npmjs.com/package/@azure/web-pubsub) package from npmjs.com

  ```bash
  npm install @azure/web-pubsub
  ```

## Sample codes

1. Create a `TokenCredential` with Azure Identity SDK.

   ```javascript
   const { DefaultAzureCredential } = require("@azure/identity");

   let credential = new DefaultAzureCredential();
   ```

   `credential` can be any class that inherits from `TokenCredential` class.

   - EnvironmentCredential
   - ClientSecretCredential
   - ClientCertificateCredential
   - ManagedIdentityCredential
   - VisualStudioCredential
   - VisualStudioCodeCredential
   - AzureCliCredential

   To learn more, see [Azure Identity client library for JavaScript](/javascript/api/overview/azure/identity-readme)

2. Then create a `client` with `endpoint`, `hub`, and `credential`.

   ```javascript
   const { DefaultAzureCredential } = require("@azure/identity");

   let credential = new DefaultAzureCredential();

   let serviceClient = new WebPubSubServiceClient(
     "<endpoint>",
     credential,
     "<hub>"
   );
   ```

   Learn how to use this client, see [Azure Web PubSub service client library for JavaScript](/javascript/api/overview/azure/web-pubsub-readme)

## Complete sample

- [Simple chatroom with Microsoft Entra ID authorization](https://github.com/Azure/azure-webpubsub/tree/main/samples/javascript/chatapp-aad)
