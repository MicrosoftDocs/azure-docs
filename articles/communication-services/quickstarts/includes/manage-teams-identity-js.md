---
title: include file
description: include file
services: azure-communication-services
author: gistefan
manager: soricos

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 10/08/2021
ms.topic: include
ms.custom: include file
ms.author: gistefan
---

## Prerequisites

- [Node.js](https://nodejs.org/) Active LTS and Maintenance LTS versions (8.11.1 and 10.14.1 recommended).

## Setting Up

### Create a new Node.js Application

Open your terminal or command window create a new directory for your app, and navigate to it.

```console
mkdir teams-access-tokens-quickstart && cd teams-access-tokens-quickstart
```

Run `npm init -y` to create a **package.json** file with default settings.

```console
npm init -y
```

### Install the package

Use the `npm install` command to install the Azure Communication Services Identity SDK for JavaScript.

```console

npm install @azure/communication-identity --save
npm install @azure/msal-node --save
npm install express --save

```

The `--save` option lists the library as a dependency in your **package.json** file.

## Set up the app framework

From the project directory:

1. Open a new text file in your code editor
1. Add a `require` call to load the `CommunicationIdentityClient`
1. Create the structure for the program, including basic exception handling

Use the following code to begin:

```javascript
const { CommunicationIdentityClient } = require('@azure/communication-identity');
const path = require('path');
const express = require("express");
const msal = require('@azure/msal-node');

const SERVER_PORT = process.env.PORT || 3000;
const REDIRECT_URI = "http://localhost:3000"; 

// Quickstart code goes here

app.listen(SERVER_PORT, () => console.log(`Teams token application starte on ${SERVER_PORT}!`))

```

1. Save the new file as **issue-teams-access-token.js** in the *access-tokens-quickstart* directory.

### Step 1: Receive the Azure AD user token via the MSAL library

First step in the token exchange flow is getting a token for your Teams user by using the [Microsoft.Identity.Client](https://docs.microsoft.com/en-us/azure/active-directory/develop/reference-v2-libraries).

```javascript
const msalConfig = {
    auth: {
        clientId: "Contoso's_Application_ID",
        authority: "https://login.microsoftonline.com/common",
    }
};

const pca = new msal.PublicClientApplication(msalConfig);
const provider = new msal.CryptoProvider();

const app = express();

app.get('/', async (req, res) => {
    const {verifier, challenge} = await provider.generatePkceCodes();
    const authCodeUrlParameters = {
        scopes: ["https://auth.msft.communication.azure.com/VoIP"],
        redirectUri: REDIRECT_URI,
        codeChallenge: challenge, 
        codeChallengeMethod: "S256"
    };

    pca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
        res.redirect(response);
    }).catch((error) => console.log(JSON.stringify(error)));
});

app.get('/redirect', async (req, res) => {
    const tokenRequest = {
        code: req.query.code,
        scopes: ["https://auth.msft.communication.azure.com/VoIP"],
        redirectUri: REDIRECT_URI,
    };

    pca.acquireTokenByCode(tokenRequest).then((response) => {
        console.log("nResponse: n:", response);
        //TODO: the following code snipets go here
        res.sendStatus(200);
    }).catch((error) => {
        console.log(error);
        res.status(500).send(error);
    });
});
```

### Step 2: Initialize the CommunicationIdentityClient

Instantiate a `CommunicationIdentityClient` with your connection string. The code below retrieves the connection string for the resource from an environment variable named `COMMUNICATION_SERVICES_CONNECTION_STRING`. Learn how to [manage your resource's connection string](../create-communication-resource.md#store-your-connection-string).

Add the following code to the `main` method:

```javascript
// This code demonstrates how to fetch your connection string
// from an environment variable.
const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];

// Instantiate the identity client
const identityClient = new CommunicationIdentityClient(connectionString);
```

Alternatively, you can separate endpoint and access key.
```javascript
// This code demonstrates how to fetch your endpoint and access key
// from an environment variable.
const endpoint = process.env["COMMUNICATION_SERVICES_ENDPOINT"];
const accessKey = process.env["COMMUNICATION_SERVICES_ACCESSKEY"];
const tokenCredential = new AzureKeyCredential(accessKey);
// Instantiate the identity client
const identityClient = new CommunicationIdentityClient(endpoint, tokenCredential)
```

If you have an Azure Active Directory Application setup, see [Use service principals](../identity/service-principal.md), you may also authenticate with AD.
```javascript
const endpoint = process.env["COMMUNICATION_SERVICES_ENDPOINT"];
const tokenCredential = new DefaultAzureCredential();
const identityClient = new CommunicationIdentityClient(endpoint, tokenCredential);

### Step 3: Exchange the Azure AD user token for the Teams access token

Use the `ExchangeTeamsTokenAsync` method to issue an access token for the Teams user that can be used with the Azure Communicatin Services SDKs.

```javascript
let response = await identityClient.exchangeTeamsToken(teamsToken);
console.log(`Token: ${response}`);
```

## Run the code

From a console prompt, navigate to the directory containing the *issue-teams-access-token.js* file, then execute the following `node` command to run the app.

```console
node ./issue-teams-access-token.js
```
