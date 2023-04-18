---
title: Azure Communication Services - Credentials best practices
description: Learn more about the best practices for managing User Access Tokens in SDKs
author: petrsvihlik
manager: soricos
services: azure-communication-services

ms.author: petrsvihlik
ms.date: 01/30/2022
ms.topic: conceptual
ms.service: azure-communication-services
#Customer intent: As a developer, I want learn how to correctly handle Credential objects so that I can build applications that run efficiently.
---

# Credentials in Communication SDKs

This article provides best practices for managing [User Access Tokens](./authentication.md#user-access-tokens) in Azure Communication Services SDKs. Following this guidance will help you optimize the resources used by your application and reduce the number of roundtrips to the Azure Communication Identity API.

## Communication Token Credential

Communication Token Credential (Credential) is an authentication primitive that wraps User Access Tokens. It's used to authenticate users in Communication Services, such as Chat or Calling. Additionally, it provides built-in token refreshing functionality for the convenience of the developer.

## Choosing the session lifetime

Depending on your scenario, you may want to adjust the lifespan of tokens issued for your application. The following best practices or their combination can help you achieve the optimal solution for your scenario:
- [Customize the token expiration time](#setting-a-custom-token-expiration-time) to your specific needs.
- Initialize the Credential with a [static token](#static-token) for one-off Chat messages or time-limited Calling sessions.
- Use a [callback function](#callback-function) for agents using the application for longer periods of time.

### Setting a custom token expiration time
When requesting a new token, we recommend using short lifetime tokens for one-off Chat messages or time-limited Calling sessions and longer lifetime tokens for agents using the application for longer periods of time. The default token expiration time is 24 hours but you can customize it by providing a value between an hour and 24 hours to the optional parameter as follows:

```javascript
const tokenOptions = { tokenExpiresInMinutes: 60 };
const user = { communicationUserId: userId };
const scopes = ["chat"];
let communicationIdentityToken = await identityClient.getToken(user, scopes, tokenOptions);
```

### Static token

For short-lived clients, initialize the Credential with a static token. This approach is suitable for scenarios such as sending one-off Chat messages or time-limited Calling sessions.

```javascript
let communicationIdentityToken = await identityClient.getToken({ communicationUserId: userId }, ["chat", "voip"]);
const tokenCredential = new AzureCommunicationTokenCredential(communicationIdentityToken.token);
```

### Callback function

For long-lived clients, initialize the Credential with a callback function that ensures a continuous authentication state during communications. This approach is suitable, for example, for long Calling sessions.

```javascript
const tokenCredential = new AzureCommunicationTokenCredential({
            tokenRefresher: async (abortSignal) => fetchTokenFromMyServerForUser(abortSignal, "<user_name>")
        });
```

## Token refreshing

To correctly implement the token refresher callback, the code must return a string with a valid JSON Web Token (JWT). It's necessary that the returned token is valid (its expiration date is set in the future) at all times. Some platforms, such as JavaScript and .NET, offer a way to abort the refresh operation, and pass `AbortSignal` or `CancellationToken` to your function. It's recommended to accept these objects, utilize them or pass them further.

### Example 1: Refreshing a token for a Communication User

Let's assume we have a Node.js application built on Express with the `/getToken` endpoint allowing to fetch a new valid token for a user specified by name.

```javascript
app.post('/getToken', async (req, res) => {
    // Custom logic to determine the communication user id
    let userId = await getCommunicationUserIdFromDb(req.body.username);
    // Get a fresh token
    const identityClient = new CommunicationIdentityClient("<COMMUNICATION_SERVICES_CONNECTION_STRING>");
    let communicationIdentityToken = await identityClient.getToken({ communicationUserId: userId }, ["chat", "voip"]);
    res.json({ communicationIdentityToken: communicationIdentityToken.token });
});
```

Next, we need to implement a token refresher callback in the client application, properly utilizing the `AbortSignal` and returning an unwrapped JWT string.

```javascript
const fetchTokenFromMyServerForUser = async function (abortSignal, username) {
    const response = await fetch(`${HOST_URI}/getToken`,
        {
            method: "POST",
            body: JSON.stringify({ username: username }),
            signal: abortSignal,
            headers: { 'Content-Type': 'application/json' }
        });

    if (response.ok) {
        const data = await response.json();
        return data.communicationIdentityToken;
    }
};
```

### Example 2: Refreshing a token for a Teams User

Let's assume we have a Node.js application built on Express with the `/getTokenForTeamsUser` endpoint allowing to exchange an Azure Active Directory (Azure AD) access token of a Teams user for a new Communication Identity access token with a matching expiration time.

```javascript
app.post('/getTokenForTeamsUser', async (req, res) => {
    const identityClient = new CommunicationIdentityClient("<COMMUNICATION_SERVICES_CONNECTION_STRING>");
    let communicationIdentityToken = await identityClient.getTokenForTeamsUser(req.body.teamsToken, '<AAD_CLIENT_ID>', '<TEAMS_USER_OBJECT_ID>');
    res.json({ communicationIdentityToken: communicationIdentityToken.token });
});
```

Next, we need to implement a token refresher callback in the client application, whose responsibility will be to:

1. Refresh the Azure AD access token of the Teams User
2. Exchange the Azure AD access token of the Teams User for a Communication Identity access token

```javascript
const fetchTokenFromMyServerForUser = async function (abortSignal, username) {
    // 1. Refresh the Azure AD access token of the Teams User
    let teamsTokenResponse = await refreshAadToken(abortSignal, username);

    // 2. Exchange the Azure AD access token of the Teams User for a Communication Identity access token
    const response = await fetch(`${HOST_URI}/getTokenForTeamsUser`,
        {
            method: "POST",
            body: JSON.stringify({ teamsToken: teamsTokenResponse.accessToken }),
            signal: abortSignal,
            headers: { 'Content-Type': 'application/json' }
        });

    if (response.ok) {
        const data = await response.json();
        return data.communicationIdentityToken;
    }
}
```

In this example, we use the Microsoft Authentication Library (MSAL) to refresh the Azure AD access token. Following the guide to [acquire an Azure AD token to call an API](../../active-directory/develop/scenario-spa-acquire-token.md), we first try to obtain the token without the user's interaction. If that's not possible, we trigger one of the interactive flows.

```javascript
const refreshAadToken = async function (abortSignal, username) {
    if (abortSignal.aborted === true) throw new Error("Operation canceled");

    // MSAL.js v2 exposes several account APIs; the logic to determine which account to use is the responsibility of the developer. 
    // In this case, we'll use an account from the cache.    
    let account = (await publicClientApplication.getTokenCache().getAllAccounts()).find(u => u.username === username);

    const renewRequest = {
        scopes: [
            "https://auth.msft.communication.azure.com/Teams.ManageCalls",
            "https://auth.msft.communication.azure.com/Teams.ManageChats"
        ],
        account: account,
        forceRefresh: forceRefresh
    };
    let tokenResponse = null;
    // Try to get the token silently without the user's interaction    
    await publicClientApplication.acquireTokenSilent(renewRequest).then(renewResponse => {
        tokenResponse = renewResponse;
    }).catch(async (error) => {
        // In case of an InteractionRequired error, send the same request in an interactive call
        if (error instanceof InteractionRequiredAuthError) {
            // You can choose the popup or redirect experience (`acquireTokenPopup` or `acquireTokenRedirect` respectively)
            publicClientApplication.acquireTokenPopup(renewRequest).then(function (renewInteractiveResponse) {
                tokenResponse = renewInteractiveResponse;
            }).catch(function (interactiveError) {
                console.log(interactiveError);
            });
        }
    });
    return tokenResponse;
}
```

## Providing an initial token

To further optimize your code, you can fetch the token at the application's startup and pass it to the Credential directly. Providing an initial token will skip the first call to the refresher callback function while preserving all subsequent calls to it.

```javascript
const tokenCredential = new AzureCommunicationTokenCredential({
            tokenRefresher: async () => fetchTokenFromMyServerForUser("<user_id>"),
            token: "<initial_token>"
        });
```

## Proactive token refreshing

Use proactive refreshing to eliminate any possible delay during the on-demand fetching of the token. The proactive refreshing will refresh the token in the background at the end of its lifetime. When the token is about to expire, 10 minutes before the end of its validity, the Credential will start attempting to retrieve the token. It will trigger the refresher callback with increasing frequency until it succeeds and retrieves a token with long enough validity.

```javascript
const tokenCredential = new AzureCommunicationTokenCredential({
            tokenRefresher: async () => fetchTokenFromMyServerForUser("<user_id>"),
            refreshProactively: true
        });
```

If you want to cancel scheduled refresh tasks, [dispose](#cleaning-up-resources) of the Credential object.

### Proactively refreshing a token for a Teams User

To minimize the number of roundtrips to the Azure Communication Identity API, make sure the Azure AD token you're passing for an [exchange](../quickstarts/manage-teams-identity.md#step-3-exchange-the-azure-ad-access-token-of-the-teams-user-for-a-communication-identity-access-token) has long enough validity (> 10 minutes). In case that MSAL returns a cached token with a shorter validity, you have the following options to bypass the cache:

1. Refresh the token forcibly
2. Increase the MSAL's token renewal window to more than 10 minutes

# [JavaScript](#tab/javascript)

Option 1: Trigger the token acquisition flow with [`AuthenticationParameters.forceRefresh`](../../active-directory/develop/msal-js-pass-custom-state-authentication-request.md) set to `true`.

```javascript
// Extend the `refreshAadToken` function 
const refreshAadToken = async function (abortSignal, username) {

    // ... existing refresh logic

    // Make sure the token has at least 10-minute lifetime and if not, force-renew it
    if (tokenResponse.expiresOn < (Date.now() + (10 * 60 * 1000))) {
        const renewRequest = {
            scopes: [
                "https://auth.msft.communication.azure.com/Teams.ManageCalls",
                "https://auth.msft.communication.azure.com/Teams.ManageChats"
            ],
            account: account,
            forceRefresh: true // Force-refresh the token
        };        
        
        await publicClientApplication.acquireTokenSilent(renewRequest).then(renewResponse => {
            tokenResponse = renewResponse;
        });
    }
}
```

Option 2: Initialize the MSAL authentication context by instantiating a `PublicClientApplication` with a custom [`SystemOptions.tokenRenewalOffsetSeconds`](https://azuread.github.io/microsoft-authentication-library-for-js/ref/modules/_azure_msal_common.html#systemoptions-1).

```javascript
const publicClientApplication = new PublicClientApplication({
    system: {
        tokenRenewalOffsetSeconds: 900 // 15 minutes (by default 5 minutes)
    });
```

---

## Canceling refreshing

For the Communication clients to be able to cancel ongoing refresh tasks, it's necessary to pass a cancellation object to the refresher callback.
*Note that this pattern applies only to JavaScript and .NET.*

```javascript
var controller = new AbortController();

var joinChatBtn = document.querySelector('.joinChat');
var leaveChatBtn = document.querySelector('.leaveChat');

joinChatBtn.addEventListener('click', function () {
    // Wrong:
    const tokenCredentialWrong = new AzureCommunicationTokenCredential({
        tokenRefresher: async () => fetchTokenFromMyServerForUser("<user_name>")
    });

    // Correct: Pass abortSignal through the arrow function
    const tokenCredential = new AzureCommunicationTokenCredential({
        tokenRefresher: async (abortSignal) => fetchTokenFromMyServerForUser(abortSignal, "<user_name>")
    });

    // ChatClient is now able to abort token refresh tasks
    const chatClient = new ChatClient("<endpoint-url>", tokenCredential);

    // Pass the abortSignal to the chat client through options
    const createChatThreadResult = await chatClient.createChatThread(
        { topic: "Hello, World!" },
        {
            // ...
            abortSignal: controller.signal
        }
    );

    // ...
});

leaveChatBtn.addEventListener('click', function() {
    controller.abort();
    console.log('Leaving chat...');
});
```

If you want to cancel subsequent refresh tasks, [dispose](#cleaning-up-resources) of the Credential object.

### Cleaning up resources

Since the Credential object can be passed to multiple Chat or Calling client instances, the SDK will make no assumptions about its lifetime and leaves the responsibility of its disposal to the developer. It's up to the Communication Services applications to dispose the Credential instance when it's no longer needed. Disposing the credential will also cancel scheduled refresh actions when the proactive refreshing is enabled.

Call the `.dispose()` function.

```javascript
const tokenCredential = new AzureCommunicationTokenCredential("<token>");
// Use the credential for Calling or Chat
const chatClient = new ChatClient("<endpoint-url>", tokenCredential);
// ...
tokenCredential.dispose()
```

## Handling a sign-out

Depending on your scenario, you may want to sign a user out from one or more services:

- To sign a user out from a single service, [dispose](#cleaning-up-resources) of the Credential object.
- To sign a user out from multiple services, implement a signaling mechanism to notify all services to [dispose](#cleaning-up-resources) of the Credential object, and additionally, [revoke all access tokens](../quickstarts/identity/access-tokens.md?tabs=windows&pivots=programming-language-javascript#revoke-access-tokens) for a given identity.

---

## Next steps

In this article, you learned how to:

> [!div class="checklist"]
> * Correctly initialize and dispose of a Credential object
> * Implement a token refresher callback
> * Optimize your token refreshing logic

To learn more, you may want to explore the following quickstart guides:

* [Create and manage access tokens](../quickstarts/identity/access-tokens.md)
* [Manage access tokens for Teams users](../quickstarts/manage-teams-identity.md)
