---
title: include file
description: include file
services: azure-communication-services
author: tomaschladek
manager: nmurav
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 11/17/2021
ms.topic: include
ms.custom: include file
ms.author: tchladek
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Node.js](https://nodejs.org/) Active LTS and Maintenance LTS versions (8.11.1 and 10.14.1 recommended).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).

## Final Code
Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/access-tokens-quickstart).

## Setting Up

### Create a new Node.js Application

Open your terminal or command window create a new directory for your app, and navigate to it.

```console
mkdir access-tokens-quickstart && cd access-tokens-quickstart
```

Run `npm init -y` to create a `package.json` file with default settings.

```console
npm init -y
```

### Install the package

Use the `npm install` command to install the Azure Communication Services Identity SDK for JavaScript.

```console
npm install @azure/communication-identity --save
```

The `--save` option lists the library as a dependency in your `package.json` file.

## Set up the app framework

Within the project directory, use the following code to begin:

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

Once complete, save the new file as `issue-access-token.js` in the project directory.

## Authenticate the client

Instantiate a `CommunicationIdentityClient` with your connection string. The code below retrieves the connection string for the resource from an environment variable named `COMMUNICATION_SERVICES_CONNECTION_STRING`. Learn how to [manage your resource's connection string](../../create-communication-resource.md#store-your-connection-string).

Add the following code to the `main` method:

```javascript
// This code demonstrates how to fetch your connection string
// from an environment variable.
const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];

// Instantiate the identity client
const identityClient = new CommunicationIdentityClient(connectionString);
```

Alternatively, you can separate the endpoint and access key.
```javascript
// This code demonstrates how to fetch your endpoint and access key
// from an environment variable.
const endpoint = process.env["COMMUNICATION_SERVICES_ENDPOINT"];
const accessKey = process.env["COMMUNICATION_SERVICES_ACCESSKEY"];

// Create the credential
const tokenCredential = new AzureKeyCredential(accessKey);

// Instantiate the identity client
const identityClient = new CommunicationIdentityClient(endpoint, tokenCredential)
```

If you have an Azure Active Directory(Azure AD) Application setup, see [Use service principals](../../identity/service-principal.md), you may also authenticate with Azure AD.
```javascript
const endpoint = process.env["COMMUNICATION_SERVICES_ENDPOINT"];
const tokenCredential = new DefaultAzureCredential();
const identityClient = new CommunicationIdentityClient(endpoint, tokenCredential);
```

## Create an identity

To create access tokens, you'll need an identity. Azure Communication Services maintains a lightweight identity directory. Use the `createUser` method to create a new entry in the directory with a unique `Id`. The created identity is required later to issue access tokens.

```javascript
let identityResponse = await identityClient.createUser();
console.log(`\nCreated an identity with ID: ${identityResponse.communicationUserId}`);
```
You should store received identities with a mapping to your application's users. For example, in your application server's database. 

## Issue access tokens

Use the `getToken` method to issue an access token for an already existing Communication Services identity. The `scopes` parameter defines a list of permissions/roles, that this token can perform/use. See the [list of supported actions](../../../concepts/authentication.md). A new instance of parameter `communicationUser` can be constructed based on string representation of an Azure Communication Service identity.

```javascript
// Issue an access token with the "voip" scope for an identity
let tokenResponse = await identityClient.getToken(identityResponse, ["voip"]);

// retrieve the token and its expiry date from the response
const { token, expiresOn } = tokenResponse;

// Print the expiry date and token to the screen
console.log(`\nIssued an access token with 'voip' scope that expires at ${expiresOn}:`);
console.log(token);
```

Access tokens are short-lived credentials that need to be reissued. Not doing so might cause disruption of your application's users experience. The `expiresOn` property indicates the lifetime of the access token.

## Create an identity and issue an access token within one method call

You can use the `createUserAndToken` method to create a Communication Services identity and issue an access token for it in one go. The `scopes` parameter, is the same as above. We'll once again just create one with the `voip` scope.

```javascript
// Issue an identity and an access token with the "voip" scope for the new identity
let identityTokenResponse = await identityClient.createUserAndToken(["voip"]);

// retrieve the token, its expiry date and user from the response
const { token, expiresOn, user } = identityTokenResponse;

// print these details to the screen
console.log(`\nCreated an identity with ID: ${user.communicationUserId}`);
console.log(`\nIssued an access token with 'voip' scope that expires at ${expiresOn}:`);
console.log(token);
```

## Refresh access tokens

As tokens expire, you'll periodically need to refresh them. Refreshing is easy just call `getToken` again with the same identity that was used to issue the tokens. You'll also need to provide the `scopes` of the refreshed tokens.

```javascript
// Value of identityResponse represents the Azure Communication Services identity stored during identity creation and then used to issue the tokens being refreshed
let refreshedTokenResponse = await identityClient.getToken(identityResponse, ["voip"]);
```

## Revoke access tokens

In some cases, you may want to revoke access tokens. For example, when an application's user changes the password they use to authenticate to your service. The `revokeTokens` method invalidates all active access tokens, that were issued to the identity.

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

From a console prompt, navigate to the directory containing the `issue-access-token.js` file, then execute the following `node` command to run the app.

```console
node ./issue-access-token.js
```
