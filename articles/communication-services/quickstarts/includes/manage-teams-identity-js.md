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

npm install @azure/communication-identity@next --save
npm install @azure/msal-node --save
npm install express --save

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
    
    const SERVER_PORT = process.env.PORT || 80;
    const REDIRECT_URI = `http://localhost:${SERVER_PORT}/redirect`;
    
    // Quickstart code goes here
    
    app.listen(SERVER_PORT, () => console.log(`Communication access token application started on ${SERVER_PORT}!`))
    
    ```

1. Save the new file as `issue-communication-access-token.js` in the `access-tokens-quickstart` directory.

### Step 1: Receive the Azure AD user token via the MSAL library

The first step in the token exchange flow is getting a token for your Teams user by using [Microsoft.Identity.Client](../../../active-directory/develop/reference-v2-libraries.md).

```javascript
const msalConfig = {
    auth: {
        clientId: "<contoso_application_id>",
        authority: "https://login.microsoftonline.com/<contoso_tenant_id>",
    }
};

const pca = new PublicClientApplication(msalConfig);
const provider = new CryptoProvider();

const app = express();

let pkceVerifier = "";

app.get('/', async (req, res) => {
    const {verifier, challenge} = await provider.generatePkceCodes();
    pkceVerifier = verifier;
    
    const authCodeUrlParameters = {
        scopes: ["https://auth.msft.communication.azure.com/Teams.ManageCalls"],
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
        scopes: ["https://auth.msft.communication.azure.com/Teams.ManageCalls"],
        redirectUri: REDIRECT_URI,
        codeVerifier: pkceVerifier,
    };

    pca.acquireTokenByCode(tokenRequest).then((response) => {
        console.log("Response:", response);
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

### Step 3: Exchange the AAD access token of the Teams User for a Communication Identity access token

Use the `getTokenForTeamsUser` method to issue an access token for the Teams user that can be used with the Azure Communication Services SDKs.

```javascript
let teamsToken = response.accessToken;
let accessToken = await identityClient.getTokenForTeamsUser(teamsToken);
console.log("Token:", accessToken);
```

### Step 4: Creating a Communication Token Credential

In order to utilize the token for Calling, you need to provide the `CallAgent` with a `CommunicationTokenCredential` object. Although, you can initialize the credential one time with a static token, for longer calling sessions, it's recommended to initialize the it with a callback function capable of refreshing the token to ensure continuous authentication state.

```javascript
const tokenCredential = new AzureCommunicationTokenCredential({
            tokenRefresher: async () => fetchTokenFromMyServerForUser("<user_id>"),
            refreshProactively: true,
            token: null
        });
```

The responsibility of the `fetchTokenFromMyServerForUser` function is to:

1. Refresh the AAD access token of the Teams User and ensure the returned token has a sufficient lifetime
1. Exchange the AAD access token of the Teams User for a Communication Identity access token

```javascript
const fetchTokenFromMyServerForUser = async function (username) {
    // MSAL.js v2 exposes several account APIs, logic to determine which account to use is the responsibility of the developer
    // In this case, we'll use an account from the cache
    let teamsUser = (await pca.getTokenCache().getAllAccounts()).find(u => u.username === username);

    let teamsTokenResponse = await refreshAadToken(teamsUser);

    let communicationIdentityToken = await identityClient.getTokenForTeamsUser(teamsTokenResponse.accessToken);
    return communicationIdentityToken.token;
}
```

To refresh the token for the Teams user, we first try to obtain the token without the user's interaction by calling `acquireTokenSilent`. If that's not possible, we trigger the interactive flow using `acquireTokenPopup` or `acquireTokenRedirect`. Finally, if the retrieved token's validity is not sufficient, we trigger the whole process again with [`AuthenticationParameters.forceRefresh`](../../../active-directory/develop/msal-js-pass-custom-state-authentication-request.md) set to `true` to bypass MSAL's cache.

```javascript
const refreshAadToken = async function (account, forceRefresh) {
    const renewRequest = {
        scopes: ["https://auth.msft.communication.azure.com/Teams.ManageCalls"],
        account: account,
        forceRefresh: forceRefresh
    };
    let tokenResponse = null;
    await pca.acquireTokenSilent(renewRequest).then(renewResponse => {
        tokenResponse = renewResponse;
    }).catch(async (error) => {
        // In case of an InteractionRequired error, send the same request in an interactive call
        if (error instanceof InteractionRequiredAuthError) {
            pca.acquireTokenPopup(renewRequest).then(function (renewInteractiveResponse) {
                tokenResponse = renewInteractiveResponse;
            }).catch(function (interactiveError) {
                console.log(interactiveError);
            });
        }
    });
    if (tokenResponse.expiresOn < (Date.now() + (10 * 60 * 1000))) {
        // Make sure the token has at least 10-minute lifetime and if not, force-renew it
        tokenResponse = await refreshAadToken(teamsUser, true);
    }
    return tokenResponse;
}
```

```javascript
const msalConfig = {
    auth: {
        clientId: "<contoso_application_id>",
        authority: "https://login.microsoftonline.com/<contoso_tenant_id>",
    }
    system: {
        tokenRenewalOffsetSeconds: 600
    }
};

const pca = new PublicClientApplication(msalConfig);
```

## Run the code

From a console prompt, navigate to the directory containing the *issue-communication-access-token.js* file, then execute the following `node` command to run the app.

```console
node ./issue-communication-access-token.js
```
