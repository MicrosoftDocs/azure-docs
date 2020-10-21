---
title: include file
description: include file
services: azure-communication-services
author: matthewrobertson
manager: nimag
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 08/20/2020
ms.topic: include
ms.custom: include file
ms.author: marobert
---


## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Node.js](https://nodejs.org/) Active LTS and Maintenance LTS versions (8.11.1 and 10.14.1 recommended).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../create-communication-resource.md).

## Setting Up

### Create a new Node.js Application

Open your terminal or command window create a new directory for your app, and navigate to it.

```console
mkdir user-tokens-quickstart && cd user-tokens-quickstart
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
  console.log("Azure Communication Services - User Access Tokens Quickstart")

  // Quickstart code goes here
};

main().catch((error) => {
  console.log("Encountered and error");
  console.log(error);
})
```

1. Save the new file as **issue-token.js** in the *user-tokens-quickstart* directory.

[!INCLUDE [User Access Tokens Object Model](user-access-tokens-object-model.md)]

## Authenticate the client

Instantiate a `CommunicationIdentityClient` with your connection string. The code below retrieves the connection string for the resource from an environment variable named `COMMUNICATION_SERVICES_CONNECTION_STRING`. Learn how to [manage you resource's connection string](../create-communication-resource.md#store-your-connection-string).

Add the following code to the `main` method:

```javascript
// This code demonstrates how to fetch your connection string
// from an environment variable.
const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];

// Instantiate the user token client
const identityClient = new CommunicationIdentityClient(connectionString);
```

## Create a user

Azure Communication Services maintains a lightweight identity directory. Use the `createUser` method to create a new entry in the directory with a unique `Id`. You should maintain a mapping between your application's users and Communication Services generated identities (e.g. by storing them in your application server's database).

```javascript
let userResponse = await identityClient.createUser();
console.log(`\nCreated a user with ID: ${userResponse.communicationUserId}`);
```

## Issue user access tokens

Use the `issueToken` method to issue an access token for a Communication Services user. If you do not provide the optional `user` parameter a new user will be created and returned with the token.

```javascript
// Issue an access token with the "voip" scope for a new user
let tokenResponse = await identityClient.issueToken(userResponse, ["voip"]);
const { token, expiresOn } = tokenResponse;
console.log(`\nIssued a token with 'voip' scope that expires at ${expiresOn}:`);
console.log(token);
```

User access tokens are short-lived credentials that need to be reissued in order to prevent your users from experiencing service disruptions. The `expiresOn` response property indicates the lifetime of the token.

## Revoke user access tokens

In some cases, you may need to explicitly revoke user access tokens, for example, when a user changes the password they use to authenticate to your service. This use the `revokeTokens` method to invalidate all of a user's access tokens.

```javascript  
await identityClient.revokeTokens(userResponse);
console.log(`\nSuccessfully revoked all tokens for user with Id: ${userResponse.communicationUserId}`);
```

## Delete a user

Deleting a user revokes all active tokens and prevents you from issuing subsequent tokens for the identities. It also removes all the persisted content associated with the user.

```javascript
await identityClient.deleteUser(userResponse);
console.log(`\nDeleted the user with Id: ${userResponse.communicationUserId}`);
```

## Run the code

From a console prompt, navigate to the directory containing the *issue-token.js* file, then execute the following `node` command to run the app.

```console
node ./issue-token.js
```
