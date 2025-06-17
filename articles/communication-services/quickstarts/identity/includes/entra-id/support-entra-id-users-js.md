---
title: include file
description: include file
services: azure-communication-services
author: aigerim
manager: soricos

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 05/06/2025
ms.topic: include
ms.custom: include file
ms.author: aigerimb
---

## Set up prerequisites

- [Node.js](https://nodejs.org/) Active LTS and Maintenance LTS versions (8.11.1 and 10.14.1 recommended).
- [Azure Identify SDK for JavaScript](https://www.npmjs.com/package/@azure/identity) to authenticate with Microsoft Entra ID.
- [Azure Communication Services Common SDK for JavaScript](https://www.npmjs.com/package/@azure/communication-common) to obtain Azure Communication Services access tokens for Microsoft Entra ID user.

## Final code
Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/entra-id-users-support-quickstart).

## Set up

### Create a new Node.js Application

Open your terminal or command window create a new directory for your app, and navigate to it.

```console
mkdir entra-id-users-support-quickstart && cd entra-id-users-support-quickstart
```

Run `npm init -y` to create a `package.json` file with default settings.

```console
npm init -y
```

### Install the package

Use the `npm install` command to install the Azure Identity and Azure Communication Services Common SDKs for JavaScript.The Azure Communication Services Common SDK version should be `2.4.0` or later.

```console
npm install @azure/communication-common@latest --save
npm install --save @azure/identity
npm install express --save
npm install dotenv --save
```

The `--save` option lists the library as a dependency in your **package.json** file.

## Set up the app framework

From the project directory:

1. Open a new text file in your code editor
1. Create the structure for the program, including basic exception handling and importing following SDK classes:

    ```javascript
    const { AzureCommunicationTokenCredential } = require('@azure/communication-common');    
    const {InteractiveBrowserCredential} = require('@azure/identity');
    const express = require("express");

    // You will need to set environment variables in .env
    const SERVER_PORT = process.env.PORT || 80;

    // Quickstart code goes here

    app.listen(SERVER_PORT, () => console.log(`Communication access token application started on ${SERVER_PORT}!`))
    ```

    You can import any implementation of the [TokenCredential](https://learn.microsoft.com/javascript/api/%40azure/core-auth/tokencredential) interface from the [Azure Identity SDK for JavaScript](https://www.npmjs.com/package/@azure/identity) to authenticate with Microsoft Entra ID. In this quickstart, we use the `InteractiveBrowserCredential` class, which is suitable for browser basic authentication scenarios. For a full list of the credentials offered, see [Credential Classes](https://learn.microsoft.com/javascript/api/overview/azure/identity-readme#credential-classes).

1. Save the new file as `obtain-access-token-for-entra-id-user.js` in the `entra-id-users-support-quickstart` directory.

<a name='step-1-obtain-entra-user-token-via-the-identity-library'></a>

### Step 1: Initialize implementation of TokenCredential from Azure Identity SDK

The first step in obtaining Communication Services access token for Entra ID user is getting  an Entra ID access token for your Entra ID user by using [Azure Identity](https://learn.microsoft.com/javascript/api/overview/azure/identity-readme) SDK. The code below retrieves the Contoso Entra client ID and the Fabrikam tenant ID from environment variables named `ENTRA_CLIENT_ID` and `ENTRA_TENANT_ID`. To enable authentication for users across multiple tenants, initialize the `InteractiveBrowserCredential` class with the authority set to `https://login.microsoftonline.com/organizations`. For more information, see [Authority](https://learn.microsoft.com//entra/identity-platform/msal-client-application-configuration#authority).

```javascript
// This code demonstrates how to fetch your Microsoft Entra client ID and tenant ID from environment variables.
const clientId = process.env['ENTRA_CLIENT_ID'];
const tenantId = process.env['ENTRA_TENANT_ID'];

// Initialize InteractiveBrowserCredential for use with AzureCommunicationTokenCredential.
const entraTokenCredential = new InteractiveBrowserCredential({
  tenantId: tenantId,
  clientId: clientId,
});
```

### Step 2: Initialize AzureCommunicationTokenCredential

Instantiate a `AzureCommunicationTokenCredential` with the TokenCredential created above and your Communication Services resource endpoint URI. The code below retrieves the endpoint for the resource from an environment variable named `COMMUNICATION_SERVICES_RESOURCE_ENDPOINT`.

```javascript
const app = express();

app.get('/', async (req, res) => {
    try {
        console.log("Azure Communication Services - Obtain Access Token for Entra ID User Quickstart");
        // This code demonstrates how to fetch your Azure Communication Services resource endpoint URI
        // from an environment variable.
        const resourceEndpoint = process.env['COMMUNICATION_SERVICES_RESOURCE_ENDPOINT'];
        
        // Set up AzureCommunicationTokenCredential to request a Communication Services access token for a Microsoft Entra ID user.
        const entraTokenCredentialOptions = {
            resourceEndpoint: resourceEndpoint,
            tokenCredential: entraTokenCredential,
            scopes: ["https://communication.azure.com/clients/VoIP"],
        };
        const entraCommunicationTokenCredential = new AzureCommunicationTokenCredential(
            entraTokenCredentialOptions
        );

        // Obtain an access token for the Entra ID user code goes here.
        
    } catch (err) {
        console.error("Error obtaining token:", err);
        res.status(500).send("Failed to obtain token");
    }
});
```
Providing scopes is optional. When not specified, the `https://communication.azure.com/clients/.default` scope is automatically used, requesting all API permissions for Communication Services Clients.

<a name='step-3-obtain-acs-access-token-of-the-entra-id-user'></a>

### Step 3: Obtain Azure Communication Services access token for Microsoft Entra ID user

Use the `getToken` method to obtain an access token for the Entra ID user. The `AzureCommunicationTokenCredential` can be used with the Azure Communication Services SDKs.

```javascript
// To obtain a Communication Services access token for Microsoft Entra ID call getToken() function.
let accessToken = await entraCommunicationTokenCredential.getToken();
console.log("Token:", accessToken);
```

## Run the code

From a console prompt, navigate to the directory containing the *obtain-access-token-for-entra-id-user.js* file, then execute the following `node` command to run the app.

```console
node ./obtain-access-token-for-entra-id-user.js
```
