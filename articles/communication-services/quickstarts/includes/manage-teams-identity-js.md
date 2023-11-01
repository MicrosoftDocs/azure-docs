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

## Set up prerequisites

- [Node.js](https://nodejs.org/) Active LTS and Maintenance LTS versions (8.11.1 and 10.14.1 recommended).

## Final code
Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/manage-teams-identity-mobile-and-desktop).

## Set up

### Create a new Node.js Application

Open your terminal or command window create a new directory for your app, and navigate to it.

```console
mkdir communication-access-tokens-quickstart && cd communication-access-tokens-quickstart
```

Run `npm init -y` to create a `package.json` file with default settings.

```console
npm init -y
```

### Install the package

Use the `npm install` command to install the Azure Communication Services Identity SDK for JavaScript.

```console

npm install @azure/communication-identity@latest --save
npm install @azure/msal-node --save
npm install express --save
npm install dotenv --save

```

The `--save` option lists the library as a dependency in your **package.json** file.

## Set up the app framework

From the project directory:

1. Open a new text file in your code editor
1. Add a `require` call to load the `CommunicationIdentityClient`
1. Create the structure for the program, including basic exception handling

    ```javascript
    const { CommunicationIdentityClient } = require('@azure/communication-identity');    
    const { PublicClientApplication, CryptoProvider } = require('@azure/msal-node');
    const express = require("express");

    // You will need to set environment variables in .env
    const SERVER_PORT = process.env.PORT || 80;
    const REDIRECT_URI = `http://localhost:${SERVER_PORT}/redirect`;
    const clientId = process.env['AAD_CLIENT_ID'];
    const tenantId = process.env['AAD_TENANT_ID'];

    // Quickstart code goes here
    
    app.listen(SERVER_PORT, () => console.log(`Communication access token application started on ${SERVER_PORT}!`))
    
    ```

1. Save the new file as `issue-communication-access-token.js` in the `access-tokens-quickstart` directory.

<a name='step-1-receive-the-azure-ad-user-token-and-object-id-via-the-msal-library'></a>

### Step 1: Receive the Microsoft Entra user token and object ID via the MSAL library

The first step in the token exchange flow is getting a token for your Teams user by using [Microsoft.Identity.Client](../../../active-directory/develop/reference-v2-libraries.md). The code below retrieves Microsoft Entra client ID and tenant ID from environment variables named `AAD_CLIENT_ID` and `AAD_TENANT_ID`. It's essential to configure the MSAL client with the correct authority, based on the `AAD_TENANT_ID` environment variable, to be able to retrieve the Object ID (`oid`) claim corresponding with a user in Fabrikam's tenant and initialize the `userObjectId` variable.

```javascript
// Create configuration object that will be passed to MSAL instance on creation.
const msalConfig = {
    auth: {
        clientId: clientId,
        authority: `https://login.microsoftonline.com/${tenantId}`,
    }
};

// Create an instance of PublicClientApplication
const pca = new PublicClientApplication(msalConfig);
const provider = new CryptoProvider();

const app = express();

let pkceVerifier = "";
const scopes = [
            "https://auth.msft.communication.azure.com/Teams.ManageCalls",
            "https://auth.msft.communication.azure.com/Teams.ManageChats"
        ];

app.get('/', async (req, res) => {
    // Generate PKCE Codes before starting the authorization flow
    const {verifier, challenge} = await provider.generatePkceCodes();
    pkceVerifier = verifier;
    
    const authCodeUrlParameters = {
        scopes: scopes,
        redirectUri: REDIRECT_URI,
        codeChallenge: challenge, 
        codeChallengeMethod: "S256"
    };
    // Get url to sign user in and consent to scopes needed for application
    pca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
        res.redirect(response);
    }).catch((error) => console.log(JSON.stringify(error)));
});

app.get('/redirect', async (req, res) => {
    // Create request parameters object for acquiring the AAD token and object ID of a Teams user
    const tokenRequest = {
        code: req.query.code,
        scopes: scopes,
        redirectUri: REDIRECT_URI,
        codeVerifier: pkceVerifier,
    };
    // Retrieve the AAD token and object ID of a Teams user
    pca.acquireTokenByCode(tokenRequest).then(async(response) => {
        console.log("Response:", response);
        let teamsUserAadToken = response.accessToken;
        let userObjectId = response.uniqueId;
        //TODO: the following code snippets go here
        res.sendStatus(200);
    }).catch((error) => {
        console.log(error);
        res.status(500).send(error);
    });
});
```

### Step 2: Initialize the CommunicationIdentityClient

Instantiate a `CommunicationIdentityClient` with your connection string. The code below retrieves the connection string for the resource from an environment variable named `COMMUNICATION_SERVICES_CONNECTION_STRING`. Learn how to [manage your resource's connection string](../create-communication-resource.md#store-your-connection-string).

Add the following code to the `then` method:

```javascript
// This code demonstrates how to fetch your connection string
// from an environment variable.
const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];

// Instantiate the identity client
const identityClient = new CommunicationIdentityClient(connectionString);
```

<a name='step-3-exchange-the-azure-ad-access-token-of-the-teams-user-for-a-communication-identity-access-token'></a>

### Step 3: Exchange the Microsoft Entra access token of the Teams User for a Communication Identity access token

Use the `getTokenForTeamsUser` method to issue an access token for the Teams user that can be used with the Azure Communication Services SDKs.

```javascript
//Exchange the Azure AD access token of the Teams User for a Communication Identity access token
let accessToken = await identityClient.getTokenForTeamsUser({
    teamsUserAadToken: teamsUserAadToken,
    clientId: clientId,
    userObjectId: userObjectId,
  });
console.log("Token:", accessToken);
```

## Run the code

From a console prompt, navigate to the directory containing the *issue-communication-access-token.js* file, then execute the following `node` command to run the app.

```console
node ./issue-communication-access-token.js
```
