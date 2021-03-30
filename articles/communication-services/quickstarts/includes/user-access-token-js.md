---
title: include file
description: include file
services: azure-communication-services
author: tomaschladek
manager: nmurav
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 03/10/2021
ms.topic: include
ms.custom: include file
ms.author: tchladek
---


## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Node.js](https://nodejs.org/) Active LTS and Maintenance LTS versions (8.11.1 and 10.14.1 recommended).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../create-communication-resource.md).

## Setting Up

### Create a new Node.js Application

Open your terminal or command window create a new directory for your app, and navigate to it.

```console
mkdir access-tokens-quickstart && cd access-tokens-quickstart
```

Run `npm init -y` to create a **package.json** file with default settings.

```console
npm init -y
```

### Install the package

Use the `npm install` command to install the Azure Communication Services Identity SDK for JavaScript.

```console

npm install @azure/communication-identity --save

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

const main = async () => {
  console.log("Azure Communication Services - Access Tokens Quickstart")

  // Quickstart code goes here
};

main().catch((error) => {
  console.log("Encountered an error");
  console.log(error);
})
```

1. Save the new file as **issue-access-token.js** in the *access-tokens-quickstart* directory.

## Authenticate the client

Instantiate a `CommunicationIdentityClient` with your connection string. The code below retrieves the connection string for the resource from an environment variable named `COMMUNICATION_SERVICES_CONNECTION_STRING`. Learn how to [manage you resource's connection string](../create-communication-resource.md#store-your-connection-string).

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

If you have managed identity set up, see [Use managed identities](../managed-identity.md), you may also authenticate with managed identity.
```javascript
const endpoint = process.env["COMMUNICATION_SERVICES_ENDPOINT"];
const tokenCredential = new DefaultAzureCredential();
var client = new CommunicationIdentityClient(endpoint, tokenCredential);
```

## Create an identity

Azure Communication Services maintains a lightweight identity directory. Use the `createUser` method to create a new entry in the directory with a unique `Id`. Store received identity with mapping to your application's users. For example, by storing them in your application server's database. The identity is required later to issue access tokens.

```javascript
let identityResponse = await identityClient.createUser();
console.log(`\nCreated an identity with ID: ${identityResponse.communicationUserId}`);
```

## Issue access tokens

Use the `getToken` method to issue an access token for an already existing Communication Services identity. Parameter `scopes` defines set of primitives, that will authorize this access token. See the [list of supported actions](../../concepts/authentication.md). New instance of parameter `communicationUser` can be constructed based on string representation of Azure Communication Service identity.

```javascript
// Issue an access token with the "voip" scope for an identity
let tokenResponse = await identityClient.getToken(identityResponse, ["voip"]);
const { token, expiresOn } = tokenResponse;
console.log(`\nIssued an access token with 'voip' scope that expires at ${expiresOn}:`);
console.log(token);
```

Access tokens are short-lived credentials that need to be reissued. Not doing so might cause disruption of your application's users experience. The `expiresOn` response property indicates the lifetime of the access token.

## Create an identity and issue an access token within the same request

Use the `createUserAndToken` method to create a Communication Services identity and issue an access token for it. Parameter `scopes` defines set of primitives, that will authorize this access token. See the [list of supported actions](../../concepts/authentication.md).

```javascript
// Issue an identity and an access token with the "voip" scope for the new identity
let identityTokenResponse = await this.client.createUserAndToken(["voip"]);
const { token, expiresOn, user } = identityTokenResponse;
console.log(`\nCreated an identity with ID: ${user.communicationUserId}`);
console.log(`\nIssued an access token with 'voip' scope that expires at ${expiresOn}:`);
console.log(token);
```

## Refresh access tokens

Refreshing access tokens is as easy as calling `getToken` with the same identity that was used to issue the tokens. You also need to provide the `scopes` of the refreshed tokens.

```javascript
// // Value of identityResponse represents the Azure Communication Services identity stored during identity creation and then used to issue the tokens being refreshed
let refreshedTokenResponse = await identityClient.getToken(identityResponse, ["voip"]);
```


## Revoke access tokens

In some cases, you may explicitly revoke access tokens. For example, when an application's user changes the password they use to authenticate to your service. Method `revokeTokens` invalidate all active access tokens, that were issued to the identity.

```javascript
await identityClient.revokeTokens(identityResponse);
console.log(`\nSuccessfully revoked all access tokens for identity with ID: ${identityResponse.communicationUserId}`);
```

## Delete an identity

Deleting an identity revokes all active access tokens and prevents you from issuing access tokens for the identity. It also removes all the persisted content associated with the identity.

```javascript
await identityClient.deleteUser(identityResponse);
console.log(`\nDeleted the identity with ID: ${identityResponse.communicationUserId}`);
```

## Run the code

From a console prompt, navigate to the directory containing the *issue-access-token.js* file, then execute the following `node` command to run the app.

```console
node ./issue-access-token.js
```
