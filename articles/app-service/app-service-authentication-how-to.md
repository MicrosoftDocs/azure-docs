---
title: Advanced usage of AuthN/AuthO
description: Learn to customize the authentication and authorization feature in App Service for different scenarios, and get user claims and different tokens.
ms.topic: article
ms.date: 10/24/2019
ms.custom: seodec18
---

# Advanced usage of authentication and authorization in Azure App Service

This article shows you how to customize the built-in [authentication and authorization in App Service](overview-authentication-authorization.md), and to manage identity from your application. 

To get started quickly, see one of the following tutorials:

* [Tutorial: Authenticate and authorize users end-to-end in Azure App Service (Windows)](app-service-web-tutorial-auth-aad.md)
* [Tutorial: Authenticate and authorize users end-to-end in Azure App Service for Linux](containers/tutorial-auth-aad.md)
* [How to configure your app to use Azure Active Directory login](configure-authentication-provider-aad.md)
* [How to configure your app to use Facebook login](configure-authentication-provider-facebook.md)
* [How to configure your app to use Google login](configure-authentication-provider-google.md)
* [How to configure your app to use Microsoft Account login](configure-authentication-provider-microsoft.md)
* [How to configure your app to use Twitter login](configure-authentication-provider-twitter.md)

## Use multiple sign-in providers

The portal configuration doesn't offer a turn-key way to present multiple sign-in providers to your users (such as both Facebook and Twitter). However, it isn't difficult to add the functionality to your app. The steps are outlined as follows:

First, in the **Authentication / Authorization** page in the Azure portal, configure each of the identity provider you want to enable.

In **Action to take when request is not authenticated**, select **Allow Anonymous requests (no action)**.

In the sign-in page, or the navigation bar, or any other location of your app, add a sign-in link to each of the providers you enabled (`/.auth/login/<provider>`). For example:

```HTML
<a href="/.auth/login/aad">Log in with Azure AD</a>
<a href="/.auth/login/microsoftaccount">Log in with Microsoft Account</a>
<a href="/.auth/login/facebook">Log in with Facebook</a>
<a href="/.auth/login/google">Log in with Google</a>
<a href="/.auth/login/twitter">Log in with Twitter</a>
```

When the user clicks on one of the links, the respective sign-in page opens to sign in the user.

To redirect the user post-sign-in to a custom URL, use the `post_login_redirect_url` query string parameter (not to be confused with the Redirect URI in your identity provider configuration). For example, to navigate the user to `/Home/Index` after sign-in, use the following HTML code:

```HTML
<a href="/.auth/login/<provider>?post_login_redirect_url=/Home/Index">Log in</a>
```

## Validate tokens from providers

In a client-directed sign-in, the application signs in the user to the provider manually and then submits the authentication token to App Service for validation (see [Authentication flow](overview-authentication-authorization.md#authentication-flow)). This validation itself doesn't actually grant you access to the desired app resources, but a successful validation will give you a session token that you can use to access app resources. 

To validate the provider token, App Service app must first be configured with the desired provider. At runtime, after you retrieve the authentication token from your provider, post the token to `/.auth/login/<provider>` for validation. For example: 

```
POST https://<appname>.azurewebsites.net/.auth/login/aad HTTP/1.1
Content-Type: application/json

{"id_token":"<token>","access_token":"<token>"}
```

The token format varies slightly according to the provider. See the following table for details:

| Provider value | Required in request body | Comments |
|-|-|-|
| `aad` | `{"access_token":"<access_token>"}` | |
| `microsoftaccount` | `{"access_token":"<token>"}` | The `expires_in` property is optional. <br/>When requesting the token from Live services, always request the `wl.basic` scope. |
| `google` | `{"id_token":"<id_token>"}` | The `authorization_code` property is optional. When specified, it can also optionally be accompanied by the `redirect_uri` property. |
| `facebook`| `{"access_token":"<user_access_token>"}` | Use a valid [user access token](https://developers.facebook.com/docs/facebook-login/access-tokens) from Facebook. |
| `twitter` | `{"access_token":"<access_token>", "access_token_secret":"<acces_token_secret>"}` | |
| | | |

If the provider token is validated successfully, the API returns with an `authenticationToken` in the response body, which is your session token. 

```json
{
    "authenticationToken": "...",
    "user": {
        "userId": "sid:..."
    }
}
```

Once you have this session token, you can access protected app resources by adding the `X-ZUMO-AUTH` header to your HTTP requests. For example: 

```
GET https://<appname>.azurewebsites.net/api/products/1
X-ZUMO-AUTH: <authenticationToken_value>
```

## Sign out of a session

Users can initiate a sign-out by sending a `GET` request to the app's `/.auth/logout` endpoint. The `GET` request does the following:

- Clears authentication cookies from the current session.
- Deletes the current user's tokens from the token store.
- For Azure Active Directory and Google, performs a server-side sign-out on the identity provider.

Here's a simple sign-out link in a webpage:

```HTML
<a href="/.auth/logout">Sign out</a>
```

By default, a successful sign-out redirects the client to the URL `/.auth/logout/done`. You can change the post-sign-out redirect page by adding the `post_logout_redirect_uri` query parameter. For example:

```
GET /.auth/logout?post_logout_redirect_uri=/index.html
```

It's recommended that you [encode](https://wikipedia.org/wiki/Percent-encoding) the value of `post_logout_redirect_uri`.

When using fully qualified URLs, the URL must be either hosted in the same domain or configured as an allowed external redirect URL for your app. In the following example, to redirect to `https://myexternalurl.com` that's not hosted in the same domain:

```
GET /.auth/logout?post_logout_redirect_uri=https%3A%2F%2Fmyexternalurl.com
```

Run the following command in the [Azure Cloud Shell](../cloud-shell/quickstart.md):

```azurecli-interactive
az webapp auth update --name <app_name> --resource-group <group_name> --allowed-external-redirect-urls "https://myexternalurl.com"
```

## Preserve URL fragments

After users sign in to your app, they usually want to be redirected to the same section of the same page, such as `/wiki/Main_Page#SectionZ`. However, because [URL fragments](https://wikipedia.org/wiki/Fragment_identifier) (for example, `#SectionZ`) are never sent to the server, they are not preserved by default after the OAuth sign-in completes and redirects back to your app. Users then get a suboptimal experience when they need to navigate to the desired anchor again. This limitation applies to all server-side authentication solutions.

In App Service authentication, you can preserve URL fragments across the OAuth sign-in. To do this, set an app setting called `WEBSITE_AUTH_PRESERVE_URL_FRAGMENT` to `true`. You can do it in the [Azure portal](https://portal.azure.com), or simply run the following command in the [Azure Cloud Shell](../cloud-shell/quickstart.md):

```azurecli-interactive
az webapp config appsettings set --name <app_name> --resource-group <group_name> --settings WEBSITE_AUTH_PRESERVE_URL_FRAGMENT="true"
```

## Access user claims

App Service passes user claims to your application by using special headers. External requests aren't allowed to set these headers, so they are present only if set by App Service. Some example headers include:

* X-MS-CLIENT-PRINCIPAL-NAME
* X-MS-CLIENT-PRINCIPAL-ID

Code that is written in any language or framework can get the information that it needs from these headers. For ASP.NET 4.6 apps, the **ClaimsPrincipal** is automatically set with the appropriate values. ASP.NET Core, however, doesn't provide an authentication middleware that integrates with App Service user claims. For a workaround, see [MaximeRouiller.Azure.AppService.EasyAuth](https://github.com/MaximRouiller/MaximeRouiller.Azure.AppService.EasyAuth).

Your application can also obtain additional details on the authenticated user by calling `/.auth/me`. The Mobile Apps server SDKs provide helper methods to work with this data. For more information, see [How to use the Azure Mobile Apps Node.js SDK](../app-service-mobile/app-service-mobile-node-backend-how-to-use-server-sdk.md#howto-tables-getidentity), and [Work with the .NET backend server SDK for Azure Mobile Apps](../app-service-mobile/app-service-mobile-dotnet-backend-how-to-use-server-sdk.md#user-info).

## Retrieve tokens in app code

From your server code, the provider-specific tokens are injected into the request header, so you can easily access them. The following table shows possible token header names:

| Provider | Header names |
|-|-|
| Azure Active Directory | `X-MS-TOKEN-AAD-ID-TOKEN` <br/> `X-MS-TOKEN-AAD-ACCESS-TOKEN` <br/> `X-MS-TOKEN-AAD-EXPIRES-ON`  <br/> `X-MS-TOKEN-AAD-REFRESH-TOKEN` |
| Facebook Token | `X-MS-TOKEN-FACEBOOK-ACCESS-TOKEN` <br/> `X-MS-TOKEN-FACEBOOK-EXPIRES-ON` |
| Google | `X-MS-TOKEN-GOOGLE-ID-TOKEN` <br/> `X-MS-TOKEN-GOOGLE-ACCESS-TOKEN` <br/> `X-MS-TOKEN-GOOGLE-EXPIRES-ON` <br/> `X-MS-TOKEN-GOOGLE-REFRESH-TOKEN` |
| Microsoft Account | `X-MS-TOKEN-MICROSOFTACCOUNT-ACCESS-TOKEN` <br/> `X-MS-TOKEN-MICROSOFTACCOUNT-EXPIRES-ON` <br/> `X-MS-TOKEN-MICROSOFTACCOUNT-AUTHENTICATION-TOKEN` <br/> `X-MS-TOKEN-MICROSOFTACCOUNT-REFRESH-TOKEN` |
| Twitter | `X-MS-TOKEN-TWITTER-ACCESS-TOKEN` <br/> `X-MS-TOKEN-TWITTER-ACCESS-TOKEN-SECRET` |
|||

From your client code (such as a mobile app or in-browser JavaScript), send an HTTP `GET` request to `/.auth/me`. The returned JSON has the provider-specific tokens.

> [!NOTE]
> Access tokens are for accessing provider resources, so they are present only if you configure your provider with a client secret. To see how to get refresh tokens, see Refresh access tokens.

## Refresh identity provider tokens

When your provider's access token (not the [session token](#extend-session-token-expiration-grace-period)) expires, you need to reauthenticate the user before you use that token again. You can avoid token expiration by making a `GET` call to the `/.auth/refresh` endpoint of your application. When called, App Service automatically refreshes the access tokens in the token store for the authenticated user. Subsequent requests for tokens by your app code get the refreshed tokens. However, for token refresh to work, the token store must contain [refresh tokens](https://auth0.com/learn/refresh-tokens/) for your provider. The way to get refresh tokens are documented by each provider, but the following list is a brief summary:

- **Google**: Append an `access_type=offline` query string parameter to your `/.auth/login/google` API call. If using the Mobile Apps SDK, you can add the parameter to one of the `LogicAsync` overloads (see [Google Refresh Tokens](https://developers.google.com/identity/protocols/OpenIDConnect#refresh-tokens)).
- **Facebook**: Doesn't provide refresh tokens. Long-lived tokens expire in 60 days (see [Facebook Expiration and Extension of Access Tokens](https://developers.facebook.com/docs/facebook-login/access-tokens/expiration-and-extension)).
- **Twitter**: Access tokens don't expire (see [Twitter OAuth FAQ](https://developer.twitter.com/en/docs/basics/authentication/FAQ)).
- **Microsoft Account**: When [configuring Microsoft Account Authentication Settings](configure-authentication-provider-microsoft.md), select the `wl.offline_access` scope.
- **Azure Active Directory**: In [https://resources.azure.com](https://resources.azure.com), do the following steps:
    1. At the top of the page, select **Read/Write**.
    2. In the left browser, navigate to **subscriptions** > **_\<subscription\_name_** > **resourceGroups** > **_\<resource\_group\_name>_** > **providers** > **Microsoft.Web** > **sites** > **_\<app\_name>_** > **config** > **authsettings**. 
    3. Click **Edit**.
    4. Modify the following property. Replace _\<app\_id>_ with the Azure Active Directory application ID of the service you want to access.

        ```json
        "additionalLoginParams": ["response_type=code id_token", "resource=<app_id>"]
        ```

    5. Click **Put**. 

Once your provider is configured, you can [find the refresh token and the expiration time for the access token](#retrieve-tokens-in-app-code) in the token store. 

To refresh your access token at any time, just call `/.auth/refresh` in any language. The following snippet uses jQuery to refresh your access tokens from a JavaScript client.

```JavaScript
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

## Limit the domain of sign-in accounts

Both Microsoft Account and Azure Active Directory lets you sign in from multiple domains. For example, Microsoft Account allows _outlook.com_, _live.com_, and _hotmail.com_ accounts. Azure AD allows any number of custom domains for the sign-in accounts. However, you may want to accelerate your users straight to your own branded Azure AD sign-in page (such as `contoso.com`). To suggest the domain name of the sign-in accounts, follow these steps.

In [https://resources.azure.com](https://resources.azure.com), navigate to **subscriptions** > **_\<subscription\_name_** > **resourceGroups** > **_\<resource\_group\_name>_** > **providers** > **Microsoft.Web** > **sites** > **_\<app\_name>_** > **config** > **authsettings**. 

Click **Edit**, modify the following property, and then click **Put**. Be sure to replace _\<domain\_name>_ with the domain you want.

```json
"additionalLoginParams": ["domain_hint=<domain_name>"]
```

This setting appends the `domain_hint` query string parameter to the login redirect URL. 

> [!IMPORTANT]
> It's possible for the client to remove the `domain_hint` parameter after receiving the redirect URL, and then login with a different domain. So while this function is convenient, it's not a security feature.
>

## Authorize or deny users

While App Service takes care of the simplest authorization case (i.e. reject unauthenticated requests), your app may require more fine-grained authorization behavior, such as limiting access to only a specific group of users. In certain cases, you need to write custom application code to allow or deny access to the signed-in user. In other cases, App Service or your identity provider may be able to help without requiring code changes.

- [Server level](#server-level-windows-apps-only)
- [Identity provider level](#identity-provider-level)
- [Application level](#application-level)

### Server level (Windows apps only)

For any Windows app, you can define authorization behavior of the IIS web server, by editing the *Web.config* file. Linux apps don't use IIS and can't be configured through *Web.config*.

1. Navigate to `https://<app-name>.scm.azurewebsites.net/DebugConsole`

1. In the browser explorer of your App Service files, navigate to *site/wwwroot*. If a *Web.config* doesn't exist, create it by selecting **+** > **New File**. 

1. Select the pencil for *Web.config* to edit it. Add the following configuration code and click **Save**. If *Web.config* already exists, just add the `<authorization>` element with everything in it. Add the accounts you want to allow in the `<allow>` element.

    ```xml
    <?xml version="1.0" encoding="utf-8"?>
    <configuration>
       <system.web>
          <authorization>
            <allow users="user1@contoso.com,user2@contoso.com"/>
            <deny users="*"/>
          </authorization>
       </system.web>
    </configuration>
    ```

### Identity provider level

The identity provider may provide certain turn-key authorization. For example:

- For [Azure App Service](configure-authentication-provider-aad.md), you can [manage enterprise-level access](../active-directory/manage-apps/what-is-access-management.md) directly in Azure AD. For instructions, see [How to remove a user's access to an application](../active-directory/manage-apps/methods-for-removing-user-access.md).
- For [Google](configure-authentication-provider-google.md), Google API projects that belong to an [organization](https://cloud.google.com/resource-manager/docs/cloud-platform-resource-hierarchy#organizations) can be configured to allow access only to users in your organization (see [Google's **Setting up OAuth 2.0** support page](https://support.google.com/cloud/answer/6158849?hl=en)).

### Application level

If either of the other levels don't provide the authorization you need, or if your platform or identity provider isn't supported, you must write custom code to authorize users based on the [user claims](#access-user-claims).

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Authenticate and authorize users end-to-end (Windows)](app-service-web-tutorial-auth-aad.md)
> [Tutorial: Authenticate and authorize users end-to-end (Linux)](containers/tutorial-auth-aad.md)
