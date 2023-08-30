---
title: "Cache the authentication token"
titleSuffix: Azure AI services
description: This article will show you how to cache the authentication token.
author: rwallerms
manager: nitinme

ms.service: applied-ai-services
ms.subservice: immersive-reader
ms.topic: how-to
ms.date: 01/14/2020
ms.author: rwaller
ms.custom: "devx-track-js, devx-track-csharp"
---

# How to cache the authentication token

This article demonstrates how to cache the authentication token in order to improve performance of your application.

## Using ASP.NET

Import the **Microsoft.Identity.Client** NuGet package, which is used to acquire a token.

Create a confidential client application property.

```csharp
private IConfidentialClientApplication _confidentialClientApplication;
private IConfidentialClientApplication ConfidentialClientApplication
{
    get {
        if (_confidentialClientApplication == null) {
            _confidentialClientApplication = ConfidentialClientApplicationBuilder.Create(ClientId)
            .WithClientSecret(ClientSecret)
            .WithAuthority($"https://login.windows.net/{TenantId}")
            .Build();
        }

        return _confidentialClientApplication;
    }
}
```

Next, use the following code to acquire an `AuthenticationResult`, using the authentication values you got when you [created the Immersive Reader resource](./how-to-create-immersive-reader.md).

> [!IMPORTANT]
> The [Microsoft.IdentityModel.Clients.ActiveDirectory](https://www.nuget.org/packages/Microsoft.IdentityModel.Clients.ActiveDirectory) NuGet package and Azure AD Authentication Library (ADAL) have been deprecated. No new features have been added since June 30, 2020.   We strongly encourage you to upgrade, see the [migration guide](../../active-directory/develop/msal-migration.md) for more details.


```csharp
public async Task<string> GetTokenAsync()
{
    const string resource = "https://cognitiveservices.azure.com/";

    var authResult = await ConfidentialClientApplication.AcquireTokenForClient(
        new[] { $"{resource}/.default" })
        .ExecuteAsync()
        .ConfigureAwait(false);

    return authResult.AccessToken;
}
```

The `AuthenticationResult` object has an `AccessToken` property which is the actual token you will use when launching the Immersive Reader using the SDK. It also has an `ExpiresOn` property which denotes when the token will expire. Before launching the Immersive Reader, you can check whether the token has expired, and acquire a new token only if it has expired.

## Using Node.JS

Add the [**request**](https://www.npmjs.com/package/request) npm package to your project. Use the following code to acquire a token, using the authentication values you got when you [created the Immersive Reader resource](./how-to-create-immersive-reader.md).

```javascript
router.get('/token', function(req, res) {
    request.post(
        {
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            url: `https://login.windows.net/${TENANT_ID}/oauth2/token`,
            form: {
                grant_type: 'client_credentials',
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                resource: 'https://cognitiveservices.azure.com/'
            }
        },
        function(err, resp, json) {
            const result = JSON.parse(json);
            return res.send({
                access_token: result.access_token,
                expires_on: result.expires_on
            });
        }
    );
});
```

The `expires_on` property is the date and time at which the token expires, expressed as the number of seconds since January 1, 1970 UTC. Use this value to determine whether your token has expired before attempting to acquire a new one.

```javascript
async function getToken() {
    if (Date.now() / 1000 > CREDENTIALS.expires_on) {
        CREDENTIALS = await refreshCredentials();
    }
    return CREDENTIALS.access_token;
}
```

## Next steps

* Explore the [Immersive Reader SDK Reference](./reference.md)
