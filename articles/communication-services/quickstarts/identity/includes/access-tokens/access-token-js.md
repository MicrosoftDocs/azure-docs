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
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../../create-communication-resource.md).

## Final code
Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/access-tokens-quickstart).

## Set up your environment

### Create a new Node.js application

In a terminal or Command Prompt window, create a new directory for your app, and then open it.

```console
mkdir access-tokens-quickstart && cd access-tokens-quickstart
```

Run `npm init -y` to create a *package.json* file with default settings.

```console
npm init -y
```

### Install the package

Use the `npm install` command to install the Azure Communication Services Identity SDK for JavaScript.

```console
npm install @azure/communication-identity@latest --save
```

The `--save` option lists the library as a dependency in your *package.json* file.

## Set up the app framework

1. Create a file named `issue-access-token.js` in the project directory and add the following code:

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


## Authenticate the client

Instantiate `CommunicationIdentityClient` with your connection string. The following code, which you add to the `Main` method, retrieves the connection string for the resource from an environment variable named `COMMUNICATION_SERVICES_CONNECTION_STRING`. 

For more information, see the "Store your connection string" section of [Create and manage Communication Services resources](../../../create-communication-resource.md#store-your-connection-string).

```javascript
// This code demonstrates how to fetch your connection string
// from an environment variable.
const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];

// Instantiate the identity client
const identityClient = new CommunicationIdentityClient(connectionString);
```

Alternatively, you can separate the endpoint and access key by running the following code:

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

If you've already set up a Microsoft Entra application, you can [authenticate by using Microsoft Entra ID](../../../identity/service-principal.md).

```javascript
const endpoint = process.env["COMMUNICATION_SERVICES_ENDPOINT"];
const tokenCredential = new DefaultAzureCredential();
const identityClient = new CommunicationIdentityClient(endpoint, tokenCredential);
```

## Create an identity

To create access tokens, you need an identity. Azure Communication Services maintains a lightweight identity directory for this purpose. Use the `createUser` method to create a new entry in the directory with a unique `Id`. The identity is required later for issuing access tokens.

```javascript
let identityResponse = await identityClient.createUser();
console.log(`\nCreated an identity with ID: ${identityResponse.communicationUserId}`);
```
Store the received identity with mapping to your application's users (for example, by storing it in your application server database).

## Issue an access token

Use the `getToken` method to issue an access token for your Communication Services identity. The `scopes` parameter defines a set of access token permissions and roles. For more information, see the list of supported actions in [Identity model](../../../../concepts/identity-model.md#access-tokens). You can also construct a new instance of a `communicationUser` based on a string representation of the Azure Communication Service identity.

```javascript
// Issue an access token with a validity of 24 hours and the "voip" scope for an identity
let tokenResponse = await identityClient.getToken(identityResponse, ["voip"]);

// Get the token and its expiration date from the response
const { token, expiresOn } = tokenResponse;
console.log(`\nIssued an access token with 'voip' scope that expires at ${expiresOn}:`);
console.log(token);
```

Access tokens are short-lived credentials that need to be reissued. Not doing so might cause a disruption of your application users' experience. The `expiresOn` property indicates the lifetime of the access token.

## Set a custom token expiration time

The default token expiration time is 24 hours (1440 minutes), but you can configure it by providing a value between 60 minutes and 1440 minutes to the optional parameter `tokenExpiresInMinutes`. When requesting a new token, it's recommended that you specify the expected typical length of a communication session for the token expiration time.

```javascript
// Issue an access token with a validity of an hour and the "voip" scope for an identity
const tokenOptions: GetTokenOptions = { tokenExpiresInMinutes: 60 };
let tokenResponse = await identityClient.getToken
(identityResponse, ["voip"], tokenOptions);
```

## Create an identity and issue a token in one method call

You can use the `createUserAndToken` method to create a Communication Services identity and issue an access token for it at the same time. The `scopes` parameter defines a set of access token permissions and roles. Again, you create it with the `voip` scope.

```javascript
// Issue an identity and an access token with a validity of 24 hours and the "voip" scope for the new identity
let identityTokenResponse = await identityClient.createUserAndToken(["voip"]);

// Get the token, its expiration date, and the user from the response
const { token, expiresOn, user } = identityTokenResponse;
console.log(`\nCreated an identity with ID: ${user.communicationUserId}`);
console.log(`\nIssued an access token with 'voip' scope that expires at ${expiresOn}:`);
console.log(token);
```

## Refresh an access token

As tokens expire, you'll periodically need to refresh them. Refreshing is easy just call `getToken` again with the same identity that was used to issue the tokens. You'll also need to provide the `scopes` of the refreshed tokens.

```javascript
// Value of identityResponse represents the Azure Communication Services identity stored during identity creation and then used to issue the tokens being refreshed
let refreshedTokenResponse = await identityClient.getToken(identityResponse, ["voip"]);
```

## Revoke access tokens

You might occasionally need to revoke an access token. For example, you would do so when application users change the password they use to authenticate to your service. The `revokeTokens` method invalidates all active access tokens that were issued to the identity.

```javascript
await identityClient.revokeTokens(identityResponse);

console.log(`\nSuccessfully revoked all access tokens for identity with ID: ${identityResponse.communicationUserId}`);
```

## Delete an identity

When you delete an identity, you revoke all active access tokens and prevent the further issuance of access tokens for the identity. Doing so also removes all persisted content that's associated with the identity.

```javascript
await identityClient.deleteUser(identityResponse);

console.log(`\nDeleted the identity with ID: ${identityResponse.communicationUserId}`);
```

## Run the code

From a console prompt, go to the directory that contains the *issue-access-token.js* file, and then execute the following `node` command to run the app:

```console
node ./issue-access-token.js
```

The app's output describes each completed action:

<!---cSpell:disable --->
```console
Azure Communication Services - Access Tokens Quickstart

Created an identity with ID: 8:acs:4ccc92c8-9815-4422-bddc-ceea181dc774_00000006-19e0-2727-80f5-8b3a0d003502

Issued an access token with 'voip' scope that expires at 2022-10-11T07:34:29.9028648+00:00:
eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwNiIsIng1dCI6Im9QMWFxQnlfR3hZU3pSaXhuQ25zdE5PU2p2cyIsInR5cCI6IkpXVCJ9.eyJza3lwZWlkIjoiYWNzOjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMF8wMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAiLCJzY3AiOjE3OTIsImNzaSI6IjE2NjUzODcyNjkiLCJleHAiOjE2NjUzOTA4NjksImFjc1Njb3BlIjoidm9pcCIsInJlc291cmNlSWQiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAiLCJyZXNvdXJjZUxvY2F0aW9uIjoidW5pdGVkc3RhdGVzIiwiaWF0IjoxNjY1Mzg3MjY5fQ.kTXpQQtY7w6O82kByljZXrKtBvNNOleDE5m06LapzLeoWfRZCCpJQcDzBoLRA146mOhNzLZ0b5WMNTa5tD-0hWCiicDwgKLMASEGY9g0EvNQOidPff47g2hh6yqi9PKiDPp-t5siBMYqA6Nh6CQ-Oeh-35vcRW09VfcqFN38IgSSzJ7QkqBiY_QtfXz-iaj81Td0287KO4U1y2LJIGiyJLWC567F7A_p1sl6NmPKUmvmwM47tyCcQ1r_lfkRdeyDmcrGgY6yyI3XJZQbpxyt2DZqOTSVPB4PuRl7iyXxvppEa4Uo_y_BdMOOWFe6YTRB5O5lhI8m7Tf0LifisxX2sw

Created an identity with ID: 8:acs:4ccc92c8-9815-4422-bddc-ceea181dc774_00000006-1ce9-31b4-54b7-a43a0d006a52

Issued an access token with 'voip' scope that expires at 2022-10-11T07:34:29.9028648+00:00:
eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwNiIsIng1dCI6Im9QMWFxQnlfR3hZU3pSaXhuQ25zdE5PU2p2cyIsInR5cCI6IkpXVCJ9.eyJza3lwZWlkIjoiYWNzOjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMF8wMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAiLCJzY3AiOjE3OTIsImNzaSI6IjE2NjUzODcyNjkiLCJleHAiOjE2NjUzOTA4NjksImFjc1Njb3BlIjoidm9pcCIsInJlc291cmNlSWQiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAiLCJyZXNvdXJjZUxvY2F0aW9uIjoidW5pdGVkc3RhdGVzIiwiaWF0IjoxNjY1Mzg3MjY5fQ.kTXpQQtY7w6O82kByljZXrKtBvNNOleDE5m06LapzLeoWfRZCCpJQcDzBoLRA146mOhNzLZ0b5WMNTa5tD-0hWCiicDwgKLMASEGY9g0EvNQOidPff47g2hh6yqi9PKiDPp-t5siBMYqA6Nh6CQ-Oeh-35vcRW09VfcqFN38IgSSzJ7QkqBiY_QtfXz-iaj81Td0287KO4U1y2LJIGiyJLWC567F7A_p1sl6NmPKUmvmwM47tyCcQ1r_lfkRdeyDmcrGgY6yyI3XJZQbpxyt2DZqOTSVPB4PuRl7iyXxvppEa4Uo_y_BdMOOWFe6YTRB5O5lhI8m7Tf0LifisxX2sw

Successfully revoked all access tokens for identity with ID: 8:acs:4ccc92c8-9815-4422-bddc-ceea181dc774_00000006-19e0-2727-80f5-8b3a0d003502

Deleted the identity with ID: 8:acs:4ccc92c8-9815-4422-bddc-ceea181dc774_00000006-19e0-2727-80f5-8b3a0d003502
```
<!---cSpell:enable --->
