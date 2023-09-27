---
title: Customize sign-ins and sign-outs
description: Use the built-in authentication and authorization in App Service and at the same time customize the sign-in and sign-out behavior.
ms.topic: article
ms.date: 03/29/2021
ms.custom: AppServiceIdentity
author: cephalin
ms.author: cephalin
---

# Customize sign-in and sign-out in Azure App Service authentication

This article shows you how to customize user sign-ins and sign-outs while using the built-in [authentication and authorization in App Service](overview-authentication-authorization.md). 

## Use multiple sign-in providers

The portal configuration doesn't offer a turn-key way to present multiple sign-in providers to your users (such as both Facebook and Twitter). However, it isn't difficult to add the functionality to your app. The steps are outlined as follows:

First, in the **Authentication / Authorization** page in the Azure portal, configure each of the identity provider you want to enable.

In **Action to take when request is not authenticated**, select **Allow Anonymous requests (no action)**.

In the sign-in page, or the navigation bar, or any other location of your app, add a sign-in link to each of the providers you enabled (`/.auth/login/<provider>`). For example:

```html
<a href="/.auth/login/aad">Log in with the Microsoft Identity Platform</a>
<a href="/.auth/login/facebook">Log in with Facebook</a>
<a href="/.auth/login/google">Log in with Google</a>
<a href="/.auth/login/twitter">Log in with Twitter</a>
<a href="/.auth/login/apple">Log in with Apple</a>
```

When the user clicks on one of the links, the respective sign-in page opens to sign in the user.

To redirect the user post-sign-in to a custom URL, use the `post_login_redirect_uri` query string parameter (not to be confused with the Redirect URI in your identity provider configuration). For example, to navigate the user to `/Home/Index` after sign-in, use the following HTML code:

```html
<a href="/.auth/login/<provider>?post_login_redirect_uri=/Home/Index">Log in</a>
```

## Client-directed sign-in

In a client-directed sign-in, the application signs in the user to the identity provider using a provider-specific SDK. The application code then submits the resulting authentication token to App Service for validation (see [Authentication flow](overview-authentication-authorization.md#authentication-flow)) using an HTTP POST request. This validation itself doesn't actually grant you access to the desired app resources, but a successful validation will give you a session token that you can use to access app resources.

To validate the provider token, App Service app must first be configured with the desired provider. At runtime, after you retrieve the authentication token from your provider, post the token to `/.auth/login/<provider>` for validation. For example:

```
POST https://<appname>.azurewebsites.net/.auth/login/aad HTTP/1.1
Content-Type: application/json

{"id_token":"<token>","access_token":"<token>"}
```

The token format varies slightly according to the provider. See the following table for details:

| Provider value | Required in request body | Comments |
|-|-|-|
| `aad` | `{"access_token":"<access_token>"}` | The `id_token`, `refresh_token`, and `expires_in` properties are optional. |
| `microsoftaccount` | `{"access_token":"<access_token>"}` or `{"authentication_token": "<token>"`| `authentication_token` is preferred over `access_token`. The `expires_in` property is optional. <br/> When requesting the token from Live services, always request the `wl.basic` scope. |
| `google` | `{"id_token":"<id_token>"}` | The `authorization_code` property is optional. Providing an `authorization_code` value will add an access token and a refresh token to the token store. When specified, `authorization_code` can also optionally be accompanied by a `redirect_uri` property. |
| `facebook`| `{"access_token":"<user_access_token>"}` | Use a valid [user access token](https://developers.facebook.com/docs/facebook-login/access-tokens) from Facebook. |
| `twitter` | `{"access_token":"<access_token>", "access_token_secret":"<access_token_secret>"}` | |
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

```html
<a href="/.auth/logout">Sign out</a>
```

By default, a successful sign-out redirects the client to the URL `/.auth/logout/complete`. You can change the post-sign-out redirect page by adding the `post_logout_redirect_uri` query parameter. For example:

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

## Limit the domain of sign-in accounts

Both Microsoft Account and Azure Active Directory lets you sign in from multiple domains. For example, Microsoft Account allows _outlook.com_, _live.com_, and _hotmail.com_ accounts. Azure AD allows any number of custom domains for the sign-in accounts. However, you may want to accelerate your users straight to your own branded Azure AD sign-in page (such as `contoso.com`). To suggest the domain name of the sign-in accounts, follow these steps.

1. In [https://resources.azure.com](https://resources.azure.com), At the top of the page, select **Read/Write**.
2. In the left browser, navigate to **subscriptions** > **_\<subscription-name_** > **resourceGroups** > **_\<resource-group-name>_** > **providers** > **Microsoft.Web** > **sites** > **_\<app-name>_** > **config** > **authsettingsV2**.
3. Click **Edit**.
4. Add a `loginParameters` array with a `domain_hint` item.

    ```json
    "identityProviders": {
        "azureActiveDirectory": {
            "login": {
                "loginParameters": ["domain_hint=<domain-name>"],
            }
        }
    }
    ```

5. Click **Put**.

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

If either of the other levels don't provide the authorization you need, or if your platform or identity provider isn't supported, you must write custom code to authorize users based on the [user claims](configure-authentication-user-identities.md).

## More resources

- [Tutorial: Authenticate and authorize users end-to-end](tutorial-auth-aad.md)
- [Environment variables and app settings for authentication](reference-app-settings.md#authentication--authorization)
