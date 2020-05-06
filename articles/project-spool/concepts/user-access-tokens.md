---
title: User Access Tokens
description: Learn how to manage users and authenticate them to ACS
author: mikben
manager: jken
services: azure-project-spool

ms.author: mikben
ms.date: 03/18/2020
ms.topic: conceptual
ms.service: azure-project-spool

---
# User Access Tokens

User Access Tokens enable you to build client applications that directly authenticate to Azure Communication Services. You generate these tokens on your server, pass them back to a client device, and then use them to initialize the Communication Services SDKs.

## Creating User Access Tokens

The Azure Communication Services Management SDK provides the functionality to create user access tokens. You should expose this functionality via a trusted web service that your users can authenticate against. Once your endpoint validates that a user should be authorized to access Azure Communication Services, you should use the management SDK to create a User Access Token for that user's unique identity, serialize it and return it to the user's client application so it can initialize an instance of an Azure Communication Services client SDK.

```csharp
[HttpPost]
[Authorize]
public async Task<ActionResult> CreateAccessToken(string userName)
{
    // validate the user that sent this request is authorized to
    // access Azure Communication Services
    
    // initialize the management client with a connection string
    // retrieved from the Azure Portal
    var managementClient = new ManagementClient(CONNECTION_STRING);
    
    // create a user access token for the provided identity
    var tokenResult = await managementClient.CreateUserAccessTokenAsync(userName);
    
    // TODO: we should handle failures
    
    // return the access token to the
    var response = new CreateAccessTokenResponse()
    {
      token: tokenResult.UserAccessToken,
      ttl: tokenResult.Ttl,
    }
    return Ok(response);
}
```

By default, user access tokens expire after 24 hours but it is a good security practice to limit the lifetime to the minimum duration required by your application. You can use the optional `ttl` parameter of the `CreateUserAccessTokenAsync` method to limit the duration of user access tokens.

## User access token scopes

Scopes allow you to specify the exact Azure Communications Services functionality that a user access token will be able to authorize. By default, user access tokens enable clients to participate in chat threads they have been invited to and to receive incoming VOIP calls. Additional scopes must be specified when creating user access tokens.

```csharp
// create a user access token that enables outbound voip calling
// and expires after five minutes
var tokenResult = await managementClient.CreateUserAccessTokenAsync(
    userName,
    ["voip:adhoc"],
    (60 * 5),
);
```

Scopes are applied to individual user access tokens. If you wish to remove a user's ability to access to some specific functionality, you should first [revoke any existing access tokens](#revoking-user-access-tokens) that may include undesired scopes before issuing a new token with a more limited set of scopes.

### Supported Scopes

Azure Communication Services supports the following scopes for user access tokens:

> TODO I made all these up, we should align on what is required

| Name                   | Description  |
| -----------------------|--------------|
| `chat:send_message`    | Grants the ability to send chat messages |
| `chat:manage_threads`  | Grants the create and invite users to chat threads|
| `voip:adhoc`           | Grants the ability to make outbound VOIP calls using the calling SDK|
| `voip:pstn`            | Grants the ability to make outbound PSTN calls using the calling SDK |
| `spaces:manage`        | Grants the ability to create and invite users to communication spaces |

## Refreshing User Access Tokens

User access tokens are short-lived credentials that need to be refreshed in order to prevent your users from experiencing service disruptions. The client SDKs provide events to let you know when the provided user access token is about to expire. You should subscribe to these events and use them to fetch a new user access token from your trusted service.

```javascript
const { ChatClient } = require('@azure/communicationservices-chat');

// Your unique Azure Communication service endpoint
const endpoint = 'https://<RESOURCE_NAME>.communcationservices.azure.com';

// User access token fetched from your trusted service
const userAccessToken = 'SECRET';

// Initialize the a chat client
const client = new ChatClient(endpoint, userAccessToken);

client.on('token_will_expire', (tokenProvider) => {
  // fetch a new token from the your trusted service and
  // pass it to the token provider
  fetchNewToken()
    .then((newToken) => tokenProvider.udpateToken(newToken));
});
```

If your client application is using several of the Azure Communication Services client SDKs, you should instantiate each SDK with a shared instance of the `UserAccessTokenProvider` class and use that instance to manage the user access token refresh process.

```javascript
const { ChatClient, UserAccessTokenProvider } = require('@azure/communicationservices-chat');
const { CallingClient } = require('@azure/communicationservices-calling');

// initialize a UserAccessTokenProvider instance
const tokenProvider = new UserAccessTokenProvider(token);

// single function to refresh tokens across all SDK instances
tokenProvider.on('token_will_expire', (tokenProvider) => { 
    // fetch a new token and pass it to the provider
});

// initialize the chat SDK with the token provider
const chatClient = new ChatClient(endpoint, tokenProvider);

// initialize the calling SDK with the token provider
const callingClient = new CallingClient(endpoint, tokenProvider);
```

## Revoking User Access Tokens

In some cases, you may need to explicitly revoke user access tokens, for example, when a user changes the password they use to authenticate to your service. This functionality is available via the Azure Communication Services Management SDK.

```csharp
// revoke all access tokens issued for a given user
var result = await managementClient.RevokeUserAccessTokenAsync(userName);
```

## Impersonating users

> marobert: do we want to include this?

In some cases, you may want a user to communicate on behalf of another user. There are no explicit flows for impersonation with ACS, and you accomplish impersonation by providing another person's user access token.

## Trouble Shooting

> TODO: common issues and how to deal with them
