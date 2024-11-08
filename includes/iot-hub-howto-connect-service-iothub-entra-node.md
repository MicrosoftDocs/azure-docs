---
title: How to connect a service to IoT Hub using Microsoft Entra (Node.js)
titleSuffix: Azure IoT Hub
description: Learn how to connect a service to IoT Hub using Microsoft Entra and the Azure IoT Hub SDK for Node.js.
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.devlang: javascript
ms.topic: include
ms.manager: lizross
ms.date: 11/06/2024
---

For an overview of Node.js SDK authentication, see:

* [Getting started with user authentication on Azure](/azure/developer/javascript/how-to/with-authentication/getting-started)
* [Azure Identity client library for JavaScript](/javascript/api/overview/azure/identity-readme)

### Entra token credential

Use [DefaultAzureCredential](/javascript/api/@azure/identity/defaultazurecredential) to generate a token. The token will be supplied to `fromTokenCredential`.

### Connect to IoT Hub

Use [fromTokenCredential](/javascript/api/azure-iothub/registry?#azure-iothub-registry-fromtokencredential) to create a service connection to IoT Hub using an Entra token credential.

`fromTokenCredential` requires two parameters:

* hostname - The Azure service URL
* tokenCredential - The Azure credential token

In this example, the Azure credential is obtained using `DefaultAzureCredential`. THe Azure domain URL and credential are then supplied to `KeyClient`.

```javascript
import { DefaultAzureCredential } from "@azure/identity";
import { KeyClient } from "@azure/keyvault-keys";

// Configure vault URL
const vaultUrl = "https://<your-unique-keyvault-name>.vault.azure.net";
// Azure SDK clients accept the credential as a parameter
const credential = new DefaultAzureCredential();
// Create authenticated client
const client = new KeyClient(vaultUrl, credential);
```
