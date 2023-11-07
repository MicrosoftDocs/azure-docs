---
title: OAuth tokens in AuthN/AuthZ
description: Learn how to retrieve tokens and refresh tokens and extend sessions when using the built-in authentication and authorization in App Service.
ms.topic: article
ms.date: 03/29/2021
ms.custom: AppServiceIdentity
author: cephalin
ms.author: cephalin
---

# Work with OAuth tokens in Azure App Service authentication

This article shows you how to work with OAuth tokens while using the built-in [authentication and authorization in App Service](overview-authentication-authorization.md). 

## Retrieve tokens in app code

From your server code, the provider-specific tokens are injected into the request header, so you can easily access them. The following table shows possible token header names:

| Provider | Header names |
|-|-|
| Microsoft Entra ID | `X-MS-TOKEN-AAD-ID-TOKEN` <br/> `X-MS-TOKEN-AAD-ACCESS-TOKEN` <br/> `X-MS-TOKEN-AAD-EXPIRES-ON`  <br/> `X-MS-TOKEN-AAD-REFRESH-TOKEN` |
| Facebook Token | `X-MS-TOKEN-FACEBOOK-ACCESS-TOKEN` <br/> `X-MS-TOKEN-FACEBOOK-EXPIRES-ON` |
| Google | `X-MS-TOKEN-GOOGLE-ID-TOKEN` <br/> `X-MS-TOKEN-GOOGLE-ACCESS-TOKEN` <br/> `X-MS-TOKEN-GOOGLE-EXPIRES-ON` <br/> `X-MS-TOKEN-GOOGLE-REFRESH-TOKEN` |
| Twitter | `X-MS-TOKEN-TWITTER-ACCESS-TOKEN` <br/> `X-MS-TOKEN-TWITTER-ACCESS-TOKEN-SECRET` |
|||

> [!NOTE]
> Different language frameworks may present these headers to the app code in different formats, such as lowercase or title case.

From your client code (such as a mobile app or in-browser JavaScript), send an HTTP `GET` request to `/.auth/me` ([token store](overview-authentication-authorization.md#token-store) must be enabled). The returned JSON has the provider-specific tokens.

> [!NOTE]
> Access tokens are for accessing provider resources, so they are present only if you configure your provider with a client secret. To see how to get refresh tokens, see Refresh access tokens.

## Refresh auth tokens

When your provider's access token (not the [session token](#extend-session-token-expiration-grace-period)) expires, you need to reauthenticate the user before you use that token again. You can avoid token expiration by making a `GET` call to the `/.auth/refresh` endpoint of your application. When called, App Service automatically refreshes the access tokens in the [token store](overview-authentication-authorization.md#token-store) for the authenticated user. Subsequent requests for tokens by your app code get the refreshed tokens. However, for token refresh to work, the token store must contain [refresh tokens](https://auth0.com/learn/refresh-tokens/) for your provider. The way to get refresh tokens are documented by each provider, but the following list is a brief summary:

- **Google**: Append an `access_type=offline` query string parameter to your `/.auth/login/google` API call. For more information, see [Google Refresh Tokens](https://developers.google.com/identity/protocols/OpenIDConnect#refresh-tokens).
- **Facebook**: Doesn't provide refresh tokens. Long-lived tokens expire in 60 days (see [Facebook Expiration and Extension of Access Tokens](https://developers.facebook.com/docs/facebook-login/access-tokens/expiration-and-extension)).
- **Twitter**: Access tokens don't expire (see [Twitter OAuth FAQ](https://developer.twitter.com/en/docs/authentication/faq)).
- **Microsoft**: In [https://resources.azure.com](https://resources.azure.com), do the following steps:
    1. At the top of the page, select **Read/Write**.
    2. In the left browser, navigate to **subscriptions** > **_\<subscription\_name>_** > **resourceGroups** > **_\<resource\_group\_name>_** > **providers** > **Microsoft.Web** > **sites** > **_\<app\_name>_** > **config** > **authsettingsV2**.
    3. Click **Edit**.
    4. Modify the following property.

        ```json
        "identityProviders": {
          "azureActiveDirectory": {
            "login": {
              "loginParameters": ["scope=openid profile email offline_access"]
            }
          }
        }
        ```

    5. Click **Put**.
    
    > [!NOTE]
    > The scope that gives you a refresh token is [offline_access](../active-directory/develop/v2-permissions-and-consent.md#offline_access). See how it's used in [Tutorial: Authenticate and authorize users end-to-end in Azure App Service](tutorial-auth-aad.md). The other scopes are requested by default by App Service already. For information on these default scopes, see [OpenID Connect Scopes](../active-directory/develop/v2-permissions-and-consent.md#openid-connect-scopes).

Once your provider is configured, you can [find the refresh token and the expiration time for the access token](#retrieve-tokens-in-app-code) in the token store. 

To refresh your access token at any time, just call `/.auth/refresh` in any language. The following snippet uses jQuery to refresh your access tokens from a JavaScript client.

```javascript
function refreshTokens() {
  let refreshUrl = "/.auth/refresh";
  $.ajax(refreshUrl) .done(function() {
    console.log("Token refresh completed successfully.");
  }) .fail(function() {
    console.log("Token refresh failed. See application logs for details.");
  });
}
```

If a user revokes the permissions granted to your app, your call to `/.auth/me` may fail with a `403 Forbidden` response. To diagnose errors, check your application logs for details.

## Extend session token expiration grace period

The authenticated session expires after 8 hours. After an authenticated session expires, there is a 72-hour grace period by default. Within this grace period, you're allowed to refresh the session token with App Service without reauthenticating the user. You can just call `/.auth/refresh` when your session token becomes invalid, and you don't need to track token expiration yourself. Once the 72-hour grace period is lapses, the user must sign in again to get a valid session token.

If 72 hours isn't enough time for you, you can extend this expiration window. Extending the expiration over a long period could have significant security implications (such as when an authentication token is leaked or stolen). So you should leave it at the default 72 hours or set the extension period to the smallest value.

To extend the default expiration window, run the following command in the [Cloud Shell](../cloud-shell/overview.md).

```azurecli-interactive
az webapp auth update --resource-group <group_name> --name <app_name> --token-refresh-extension-hours <hours>
```

> [!NOTE]
> The grace period only applies to the App Service authenticated session, not the tokens from the identity providers. There is no grace period for the expired provider tokens. 
>

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Authenticate and authorize users end-to-end](tutorial-auth-aad.md)
