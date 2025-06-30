---
title: Work with OAuth Tokens in Authentication and Authorization
description: Learn how to retrieve tokens, refresh tokens, and extend session token expiration when you use the built-in authentication and authorization in Azure App Service.
ms.topic: how-to
ms.date: 06/30/2025
ms.custom: AppServiceIdentity
author: cephalin
ms.author: cephalin
---

# Manage OAuth tokens in Azure App Service

This article shows you how to manage OAuth tokens when you use [built-in authentication and authorization](overview-authentication-authorization.md) in Azure App Service.

## Retrieve tokens in app code

Provider-specific tokens are injected into the request header from your server code so you can easily access them. To get the provider-specific tokens, send an HTTP `GET` request to `/.auth/me` from your client code, such as a mobile app or in-browser JavaScript. [Token store](overview-authentication-authorization.md#token-store) must be enabled for the app. The returned JSON contains the provider-specific tokens.

> [!NOTE]
> Access tokens are for accessing provider resources, so are present only if you configure your provider with a client secret.

The following table lists possible token headers from several providers:

| Provider | Header names |
|-|-|
| Microsoft Entra | `X-MS-TOKEN-AAD-ID-TOKEN` <br/> `X-MS-TOKEN-AAD-ACCESS-TOKEN` <br/> `X-MS-TOKEN-AAD-EXPIRES-ON`  <br/> `X-MS-TOKEN-AAD-REFRESH-TOKEN` |
| Facebook | `X-MS-TOKEN-FACEBOOK-ACCESS-TOKEN` <br/> `X-MS-TOKEN-FACEBOOK-EXPIRES-ON` |
| Google | `X-MS-TOKEN-GOOGLE-ID-TOKEN` <br/> `X-MS-TOKEN-GOOGLE-ACCESS-TOKEN` <br/> `X-MS-TOKEN-GOOGLE-EXPIRES-ON` <br/> `X-MS-TOKEN-GOOGLE-REFRESH-TOKEN` |
| X | `X-MS-TOKEN-TWITTER-ACCESS-TOKEN` <br/> `X-MS-TOKEN-TWITTER-ACCESS-TOKEN-SECRET` |

> [!NOTE]
> Different language frameworks might present these headers to the app code in different formats, such as lowercase or title case.

## Refresh auth tokens

The following information refers to provider tokens. For session tokens, see [Extend session token expiration grace period](#extend-session-token-expiration-grace-period).

If your provider's access token expires, you must reauthenticate the user before you can use that token again. You can avoid token expiration by making a `GET` call to the `/.auth/refresh` endpoint of your application.

To refresh your access token at any time, call `/.auth/refresh` in any language. The following snippet uses jQuery to refresh your access tokens from a JavaScript client.

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

When called, App Service automatically refreshes the access tokens in the [token store](overview-authentication-authorization.md#token-store) for the authenticated user. Subsequent requests for tokens get the refreshed tokens. You can see the refresh tokens and the expiration time for the tokens by using the headers listed in [Retrieve tokens in app code](#retrieve-tokens-in-app-code).

>[!NOTE]
>If a user revokes the permissions they granted to your app, your call to `/.auth/me` might fail with a `403 Forbidden` response. To diagnose errors, check your application logs for details.

### Configure providers to supply refresh tokens

For token refresh to work, the token store must contain [refresh tokens](/entra/identity-platform/refresh-tokens) from your provider. Each provider documents how to get their refresh tokens. The following table provides a brief summary:

| Provider | Refresh tokens |
|-|-|
| Microsoft | Follow the procedure in [Configure the Microsoft Entra provider to supply refresh tokens](#configure-the-microsoft-entra-provider-to-supply-refresh-tokens). |
| Facebook | Doesn't provide refresh tokens. Long-lived tokens expire in 60 days. For more information, see [Long-Lived Access Tokens](https://developers.facebook.com/docs/facebook-login/guides/access-tokens/get-long-lived/). |
| Google | Append an `access_type=offline` query string parameter to your `/.auth/login/google` API call. For more information, see [Google Refresh Tokens](https://developers.google.com/identity/protocols/OpenIDConnect#refresh-tokens).|
| X | Access tokens don't expire. For more information, see [OAuth FAQ](https://developer.x.com/en/docs/authentication/faq). |

### Configure the Microsoft Entra provider to supply refresh tokens

1. In the Azure portal, go to the [API Playground (preview)](https://portal.azure.com/#view/Microsoft_Azure_Resources/ArmPlayground).
1. In the **Enter ARM relative path here** field, enter the following string, replacing the placeholders with your subscription ID, resource group name, and app name:<br>`subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Web/sites/<app-name>/config/authsettingsV2?api-version=2024-11-01`
1. Select **Execute**.
1. Copy the contents of the **Response body** field and paste them into an editor.
1. In the code, add the following line to the `"identityProviders":` **>** `"azureActiveDirectory":` **>** `"login":` section:<br>`"loginParameters": ["scope=openid profile email offline_access"]`.
1. In the API Playground, select **New request**.
1. Select `PUT` from the command dropdown list.
1. Enter the same ARM relative path and API version as for the `GET` command.
1. Select the **Request body** field, and paste in your edited code.
1. Select **Execute**. The **Response body** field shows your changes.

[Offline_access](/entra/identity-platform/scopes-oidc#the-offline_access-scope) is the scope that provides refresh tokens. App Service already requests the other scopes by default. For more information, see [OpenID Connect Scopes](/entra/identity-platform/scopes-oidc#openid-connect-scopes) and [Web Apps - Update Auth Settings V2](/rest/api/appservice/web-apps/update-auth-settings-v-2).

## Extend session token expiration grace period

The authenticated session expires after 8 hours, and a 72-hour default grace period follows. Within this grace period, you can refresh the session token with App Service without reauthenticating the user. You can simply call `/.auth/refresh` when your session token becomes invalid, and you don't need to track token expiration yourself.

When the 72-hour grace period lapses, the user must sign in again to get a valid session token. If you need a longer expiration window than 72 hours, you can extend it, but extending the expiration for a long period could have significant security implications if an authentication token is leaked or stolen. It's best to leave the setting at the default 72 hours or set the extension period to the smallest possible value.

To extend the default expiration window, run the following Azure CLI command in [Azure Cloud Shell](../cloud-shell/overview.md):

```azurecli-interactive
az webapp auth update --resource-group <group_name> --name <app_name> --token-refresh-extension-hours <hours>
```

> [!NOTE]
> The grace period applies only to the App Service authenticated session, not to the access tokens from the identity providers. No grace period exists for expired provider tokens.

## Related content

- [Tutorial: Authenticate and authorize users end to end](tutorial-auth-aad.md)
