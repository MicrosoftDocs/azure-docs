---
title: include file
description: include file
services: azure-communication-services
author: tomaschladek
manager: nmurav
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 08/20/2020
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

Use the `npm install` command to install the Azure Communication Services Administration client library for JavaScript.

```console

npm install @azure/communication-administration --save

```

The `--save` option lists the library as a dependency in your **package.json** file.

## Set up the app framework

From the project directory:

1. Open a new text file in your code editor
1. Add a `require` call to load the `CommunicationIdentityClient`
1. Create the structure for the program, including basic exception handling

Use the following code to begin:

```javascript
const { CommunicationIdentityClient } = require('@azure/communication-administration');

const main = async () => {
  console.log("Azure Communication Services - Access Tokens Quickstart")

  // Quickstart code goes here
};

main().catch((error) => {
  console.log("Encountered and error");
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

## Create an identity

Azure Communication Services maintains a lightweight identity directory. Use the `createUser` method to create a new entry in the directory with a unique `Id`. You should maintain a mapping between your application's users and Communication Services generated identities (e.g. by storing them in your application server's database).

```javascript
let identityResponse = await identityClient.createUser();
console.log(`\nCreated an identity with ID: ${identityResponse.communicationUserId}`);
```

## Issue access tokens

Use the `issueToken` method to issue an access token for a Communication Services identity. Parameter `scopes` defines set of actions, which are authorized to be performed with the access token. See the [list of supported actions](../concepts/authentication.md). New instance of parameter `communicationUser` can be constructed with the identity's ID, which you are suppose to store and map to your application's users.

```javascript
// Issue an access token with the "voip" scope for an identity
let tokenResponse = await identityClient.issueToken(identityResponse, ["voip"]);
const { token, expiresOn } = tokenResponse;
console.log(`\nIssued an access token with 'voip' scope that expires at ${expiresOn}:`);
console.log(token);
```

Access tokens are short-lived credentials that need to be reissued in order to prevent your application's users from experiencing service disruptions. The `expiresOn` response property indicates the lifetime of the access token.


## Refresh access tokens

To refresh an access token, use the `CommunicationUser` object to re-issue:

```javascript  
// Value existingIdentity represents identity of Azure Communication Services stored during identity creation
identityResponse = new CommunicationUser(existingIdentity);
tokenResponse = await identityClient.issueToken(identityResponse, ["voip"]);
```


## Revoke access tokens

In some cases, you may need to explicitly revoke access tokens, for example, when an application's user changes the password they use to authenticate to your service. Method `revokeTokens` invalidate all active access tokens, that were issued to the identity.

```javascript  
await identityClient.revokeTokens(identityResponse);
console.log(`\nSuccessfully revoked all access tokens for identity with Id: ${identityResponse.communicationUserId}`);
```

## Delete an identity

Deleting an identity revokes all active access tokens and prevents you from issuing subsequent access tokens for the identity. It also removes all the persisted content associated with the identity.

```javascript
await identityClient.deleteUser(identityResponse);
console.log(`\nDeleted the identity with Id: ${identityResponse.communicationUserId}`);
```

## Run the code

From a console prompt, navigate to the directory containing the *issue-access-token.js* file, then execute the following `node` command to run the app.

```console
node ./issue-access-token.js
```
