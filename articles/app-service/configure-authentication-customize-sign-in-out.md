---
title: Customize Sign-ins and Sign-outs
description: Use the built-in authentication and authorization in Azure App Service and at the same time customize the sign-in and sign-out behavior.
ms.topic: how-to
ms.date: 04/03/2025
ms.custom: AppServiceIdentity
author: cephalin
ms.author: cephalin
#customer intent: As an app developer, I want to customize my sign-in and sign-out options to provide links to different providers and to enhance the user experience in Azure App Service.
---

# Customize sign-ins and sign-outs in Azure App Service authentication

This article shows you how to customize user sign-ins and sign-outs while using the built-in [authentication and authorization in Azure App Service](overview-authentication-authorization.md).

## Use multiple sign-in providers

The Azure portal configuration doesn't offer a turnkey way to present multiple sign-in providers to your users. For instance, you might want to offer both Facebook and X as options. To add multiple sign-in providers to your app:

1. In the Azure portal, in your web app, select **Settings** > **Authentication**.

1. For **Authentication settings**, select **Edit**.

1. For **Restrict access**, select **Allow unauthenticated access**.

1. On the sign-in page, the navigation bar, or any other location in your app, add a sign-in link to each of the providers that you enabled (`/.auth/login/<provider>`). For example:

   ```html
   <a href="/.auth/login/aad">Log in with Microsoft Entra</a>
   <a href="/.auth/login/facebook">Log in with Facebook</a>
   <a href="/.auth/login/google">Log in with Google</a>
   <a href="/.auth/login/x">Log in with X</a>
   <a href="/.auth/login/apple">Log in with Apple</a>
   ```

When the user selects one of the links, the respective page opens for sign-in.

To redirect the user to a custom URL after sign-in, use the `post_login_redirect_uri` query string parameter.  For example, to move the user to `/Home/Index` after sign-in, use the following HTML code:

```html
<a href="/.auth/login/<provider>?post_login_redirect_uri=/Home/Index">Log in</a>
```

> [!NOTE]
> Don't confuse this value with the redirect URI in your identity provider configuration.

## <a name = "client-directed-sign-in"></a> Use client-directed sign-in

In a client-directed sign-in, the application signs in the user to the identity provider by using a provider-specific SDK. The application code then submits the resulting authentication token to App Service for validation by using an HTTP `POST` request. This validation itself doesn't grant users access to the desired app resources. A successful validation gives users a session token that they can use to access app resources. For more information, see [Authentication flow](overview-authentication-authorization.md#authentication-flow).

To validate the provider token, the App Service app must first be configured with the desired provider. At runtime, after you retrieve the authentication token from your provider, post the token to `/.auth/login/<provider>` for validation. For example:

```https
POST https://<appname>.azurewebsites.net/.auth/login/aad HTTP/1.1
Content-Type: application/json

{"id_token":"<token>","access_token":"<token>"}
```

The token format varies slightly according to the provider:

| Provider value | Required in request body | Comments |
|:-|:-|:-|
| `aad` | `{"access_token":"<access_token>"}` | The `id_token`, `refresh_token`, and `expires_in` properties are optional. |
| `google` | `{"id_token":"<id_token>"}` | The `authorization_code` property is optional. Providing an `authorization_code` value adds an access token and a refresh token to the token store. When you specify `authorization_code`, you can optionally accompany it with a `redirect_uri` property. |
| `facebook`| `{"access_token":"<user_access_token>"}` | Use a valid [user access token](https://developers.facebook.com/docs/facebook-login/access-tokens) from Facebook. |
| `twitter` | `{"access_token":"<access_token>", "access_token_secret":"<access_token_secret>"}` | |

> [!NOTE]
> The GitHub provider for App Service authentication doesn't support customized sign-in and sign-out.

If the provider token is validated successfully, the API returns with an `authenticationToken` value in the response body. This value is your session token. For more information on user claims, see [Work with user identities in Azure App Service authentication](configure-authentication-user-identities.md).

```json
{
    "authenticationToken": "...",
    "user": {
        "userId": "sid:..."
    }
}
```

After you have this session token, you can access protected app resources by adding the `X-ZUMO-AUTH` header to your HTTP requests. For example:

```https
GET https://<appname>.azurewebsites.net/api/products/1
X-ZUMO-AUTH: <authenticationToken_value>
```

## Sign out of a session

Users can initiate a sign-out by sending a `GET` request to the app's `/.auth/logout` endpoint. The `GET` request:

- Clears authentication cookies from the current session.
- Deletes the current user's tokens from the token store.
- Performs a server-side sign-out on the identity provider for Microsoft Entra and Google.

Here's a simple sign-out link on a webpage:

```html
<a href="/.auth/logout">Sign out</a>
```

By default, a successful sign-out redirects the client to the URL `/.auth/logout/complete`. You can change the post-sign-out redirect page by adding the `post_logout_redirect_uri` query parameter. For example:

```https
GET /.auth/logout?post_logout_redirect_uri=/index.html
```

We recommend that you [encode](https://wikipedia.org/wiki/Percent-encoding) the value of `post_logout_redirect_uri`.

When you use fully qualified URLs, the URL must be hosted in the same domain or configured as an allowed external redirect URL for your app. The following example redirects to an `https://myexternalurl.com` URL that's not hosted in the same domain:

```https
GET /.auth/logout?post_logout_redirect_uri=https%3A%2F%2Fmyexternalurl.com
```

Run the following command in [Azure Cloud Shell](../cloud-shell/quickstart.md):

```azurecli-interactive
az webapp auth update --name <app_name> --resource-group <group_name> --allowed-external-redirect-urls "https://myexternalurl.com"
```

## Preserve URL fragments

After users sign in to your app, they usually want to be redirected to the same section of the same page, such as `/wiki/Main_Page#SectionZ`. However, because [URL fragments](https://wikipedia.org/wiki/Fragment_identifier) (for example, `#SectionZ`) are never sent to the server, they're not preserved by default after the OAuth sign-in finishes and redirects back to your app. Users then get a suboptimal experience when they need to go to the desired anchor again. This limitation applies to all server-side authentication solutions.

In App Service authentication, you can preserve URL fragments across the OAuth sign-in by setting `WEBSITE_AUTH_PRESERVE_URL_FRAGMENT` to `true`. You use this app setting in the [Azure portal](https://portal.azure.com), or you can run the following command in [Cloud Shell](../cloud-shell/quickstart.md):

```azurecli-interactive
az webapp config appsettings set --name <app_name> --resource-group <group_name> --settings WEBSITE_AUTH_PRESERVE_URL_FRAGMENT="true"
```

## Set the domain hint for sign-in accounts

Both Microsoft accounts and Microsoft Entra let users sign in from multiple domains. For example, a Microsoft account allows `outlook.com`, `live.com`, and `hotmail.com` accounts. Microsoft Entra allows any number of custom domains for the sign-in accounts. However, you might want to accelerate your users straight to your own branded Microsoft Entra sign-in page (such as `contoso.com`).

To suggest the domain name of the sign-in accounts, follow these steps:

1. In [Resource Explorer](https://resources.azure.com), at the top of the page, select **Read/Write**.
2. On the left pane, go to **subscriptions** > *subscription-name* > **resourceGroups** > *resource-group-name* > **providers** > **Microsoft.Web** > **sites** > *app-name* > **config** > **authsettingsV2**.
3. Select **Edit**.
4. Add a `loginParameters` array with a `domain_hint` item:

    ```json
    "identityProviders": {
        "azureActiveDirectory": {
            "login": {
                "loginParameters": ["domain_hint=<domain-name>"],
            }
        }
    }
    ```

5. Select **Put**.

This setting appends the `domain_hint` query string parameter to the sign-in redirect URL.

> [!IMPORTANT]
> It's possible for the client to remove the `domain_hint` parameter after receiving the redirect URL, and then sign in with a different domain. So although this function is convenient, it's not a security feature.

## Authorize or deny users

App Service takes care of the simplest authorization case, for example, reject unauthenticated requests. Your app might require more fine-grained authorization behavior, such as limiting access to only a specific group of users.

You might need to write custom application code to allow or deny access to the signed-in user. In some cases, App Service or your identity provider might be able to help without requiring code changes.

### Server level (Windows apps only)

For any Windows app, you can define authorization behavior of the IIS web server by editing the `web.config` file. Linux apps don't use IIS and can't be configured through `web.config`.

1. To go to the Kudu debug console for your app, select **Development Tools** > **Advanced Tools** and select **Go**. Then select **Debug console**.

   You can also open this page with this URL: `https://<app-name>-<random-hash>.scm.<region>.azurewebsites.net/DebugConsole`. To get the random hash and region values, in your app **Overview**, copy **Default domain**.

1. In the browser explorer of your App Service files, go to `site/wwwroot`. If `web.config` doesn't exist, create it by selecting **+** > **New File**.

1. Select the pencil for `web.config` to edit the file. Add the following configuration code, and then select **Save**. If `web.config` already exists, just add the `<authorization>` element with everything in it. In the `<allow>` element, add the accounts that you want to allow.

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

The identity provider might provide certain turnkey authorization. For example:

- For Microsoft Entra, you can [manage enterprise-level access](../active-directory/manage-apps/what-is-access-management.md) directly. For more information, see [Remove user access to applications](../active-directory/manage-apps/methods-for-removing-user-access.md).
- For [Google](configure-authentication-provider-google.md), Google API projects that belong to an [organization](https://cloud.google.com/resource-manager/docs/cloud-platform-resource-hierarchy#organizations) can be configured to allow access only to users in your organization. For more information, see [Manage OAuth Clients](https://support.google.com/cloud/answer/6158849?hl=en).

### Application level

If either of the other levels doesn't provide the authorization that you need, or if your platform or identity provider isn't supported, you must write custom code to authorize users based on the [user claims](configure-authentication-user-identities.md).

## Related content

- [Tutorial: Authenticate and authorize users end to end in Azure App Service](tutorial-auth-aad.md)
- [Environment variables and app settings for authentication](reference-app-settings.md#authentication--authorization)
