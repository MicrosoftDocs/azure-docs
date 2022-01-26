---
title: Azure Communication Services - Identity best practices
description: Learn more about the best practices for managing User Access Tokens in SDKs
author: petrsvihlik
manager: soricos
services: azure-communication-services

ms.author: petrsvihlik
ms.date: 01/30/2022
ms.topic: conceptual
ms.service: azure-communication-services
---

# Best practices: Managing credentials in Azure Communication Services SDKs

This article provides information about best practices related to managing User Access Tokens - Communication Token Credentials.

## Initialization

Depending on your scenario, you may want to initialize the Communication Token Credential (Credential) with a static token or a callback function.
The tokens supplied to the Credential either through the constructor or via the token refresher callback can be obtained using the Azure Communication Identity API.

### Static token

For short-lived clients, initialize the Credential with a static token. This approach is sutable for scenarios such as sending one-off Chat messages or time-limited Calls.

```javascript
const tokenCredential = new AzureCommunicationTokenCredential("<user_access_token>");
```

### Callback function

For long-lived clients, initialize the Credential with a callback function that ensures a continuous authentication state during communications. This approach is suitable e.g. for long Calling sessions.

```javascript
const tokenCredential = new AzureCommunicationTokenCredential({
            tokenRefresher: async (abortSignal) => fetchTokenFromMyServerForUser(abortSignal, "<user_id>")
        });
```

## Token refreshing

To correctly implement the token refresher callback function, your code must return a string with a valid JWT token. It's necessary that the returned token is valid (its expiration date is set in the future) at all times. Some platforms, such as JavaScript and .NET, offer a way to abort the refresh operation and pass `AbortSignal` or `CancellationToken` to your function. It's recommended to accept these objects, utilize them or pass them further.

### Example 1: Refresh using for Communication User

Let's assume we have a Node.js application built on Express with the `/getToken` endpoint allowing to fetch a new valid token for a user specified by name.

```javascript
app.post('/getToken', async (req, res) => {
    // Process the username
    let userId = await getCommunicationUserIdFromDb(req.body.username);
    // Get a fresh token
    const identityClient = new CommunicationIdentityClient(COMMUNICATION_SERVICES_CONNECTION_STRING);
    let communicationIdentityToken = await identityClient.getToken({ communicationUserId: userId }, ["chat", "voip"]);
    res.json({ communicationIdentityToken: communicationIdentityToken.token });
});
```

The token refresher callback 

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

### Example 2: Refresh token for Teams User

Let's assume we have a Node.js application built on Express with the `/getTokenForTeamsUser` endpoint allowing to exchange an AAD access token of a Teams user for a new Communication Identity access token with a matching expiration time.

```javascript
app.post('/getTokenForTeamsUser', async (req, res) => {
    const identityClient = new CommunicationIdentityClient(COMMUNICATION_SERVICES_CONNECTION_STRING);
    let communicationIdentityToken = await identityClient.getTokenForTeamsUser(req.body.teamsToken);
    res.json({ communicationIdentityToken: communicationIdentityToken.token });
});
```

The responsibility of the token refresher callback function is to:

1. Refresh the AAD access token of the Teams User and ensure the returned token has a sufficient lifetime
1. Exchange the AAD access token of the Teams User for a Communication Identity access token

```javascript
const fetchTokenFromMyServerForUser = async function (abortSignal, username) {
    // MSAL.js v2 exposes several account APIs, logic to determine which account to use is the responsibility of the developer
    // In this case, we'll use an account from the cache
    let teamsUser = (await pca.getTokenCache().getAllAccounts()).find(u => u.username === username);

    let teamsTokenResponse = await refreshAadToken(teamsUser);
    var teamsToken = teamsTokenResponse.accessToken;

    const response = await fetch(`${HOST_URI}/getTokenForTeamsUser`,
        {
            method: "POST",
            body: JSON.stringify({ teamsToken: teamsToken }),
            signal: abortSignal,
            headers: { 'Content-Type': 'application/json' }
        });

    if (response.ok) {
        const data = await response.json();
        return data.communicationIdentityToken;
    }
}
```

To refresh the AAD access token of the Teams user, we first try to obtain the token without the user's interaction by calling `acquireTokenSilent`. If that's not possible, we trigger the interactive flow using `acquireTokenPopup` or `acquireTokenRedirect`. Finally, if the retrieved token's validity is not sufficient, we trigger the whole process again with [`AuthenticationParameters.forceRefresh`](../../../active-directory/develop/msal-js-pass-custom-state-authentication-request.md) set to `true` to bypass MSAL's cache.

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
    return tokenResponse;
}
```

## Initial token

To further optimize your code, you can fetch the token at the application's startup and pass it to the Credential directly. This will skip the first call to refresher callback function but preserve all subsequent calls to it.

```javascript
const tokenCredential = new AzureCommunicationTokenCredential({
            tokenRefresher: async () => fetchTokenFromMyServerForUser("<user_id>"),
            token: "<initial_token>"
        });
```

## Proactive token refreshing

- TODO Refresh logic

Use proactive refreshing to eliminate any possible delay while fetching the token on demand. Proactive refreshing will take care of refreshing the token in the background when it's close to expiry.

```javascript
const tokenCredential = new AzureCommunicationTokenCredential({
            tokenRefresher: async () => fetchTokenFromMyServerForUser("<user_id>"),
            refreshProactively: true
        });
```

### Proactive refreshing with the Custom Teams Endpoint


- TODO
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

We might want to extend the logic of the `refreshAadToken` function with:

```javascript

    if (tokenResponse.expiresOn < (Date.now() + (10 * 60 * 1000)) && !forceRefresh) {
        // Make sure the token has at least 10-minute lifetime and if not, force-renew it
        tokenResponse = await refreshAadToken(teamsUser, true);
    }
```

## Cancel refreshing

- TODO

```javascript
var controller = new AbortController();
var signal = controller.signal;

var downloadBtn = document.querySelector('.download');
var hangUpBtn = document.querySelector('.hangUp');

downloadBtn.addEventListener('click', fetchVideo);

hangUpBtn.addEventListener('click', function() {
  controller.abort();
  console.log('Download aborted');
});

function fetchVideo() {
  ...
  fetch(url, {signal}).then(function(response) {
    ...
  }).catch(function(e) {
    reports.textContent = 'Download error: ' + e.message;
  })
}

```

### Disposal

- TODO

### Cancellation

- TODO
- abortSignal, CancellationToken