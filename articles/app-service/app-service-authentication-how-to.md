---
title: Advanced usage of AuthN/AuthZ
description: Learn to customize the authentication and authorization feature in App Service for different scenarios, and get user claims and different tokens.
ms.topic: article
ms.date: 03/29/2021
ms.custom: seodec18, devx-track-azurecli
---

# Advanced usage of authentication and authorization in Azure App Service

This article shows you how to customize the built-in [authentication and authorization in App Service](overview-authentication-authorization.md), and to manage identity from your application. 

To get started quickly, see one of the following tutorials:

* [Tutorial: Authenticate and authorize users end-to-end in Azure App Service](tutorial-auth-aad.md)
* [How to configure your app to use Microsoft Identity Platform login](configure-authentication-provider-aad.md)
* [How to configure your app to use Facebook login](configure-authentication-provider-facebook.md)
* [How to configure your app to use Google login](configure-authentication-provider-google.md)
* [How to configure your app to use Twitter login](configure-authentication-provider-twitter.md)
* [How to configure your app to login using an OpenID Connect provider (Preview)](configure-authentication-provider-openid-connect.md)
* [How to configure your app to login using an Sign in with Apple (Preview)](configure-authentication-provider-apple.md)

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

To redirect the user post-sign-in to a custom URL, use the `post_login_redirect_url` query string parameter (not to be confused with the Redirect URI in your identity provider configuration). For example, to navigate the user to `/Home/Index` after sign-in, use the following HTML code:

```html
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

```html
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

If the [token store](overview-authentication-authorization.md#token-store) is enabled for your app, you can also obtain additional details on the authenticated user by calling `/.auth/me`. The Mobile Apps server SDKs provide helper methods to work with this data. For more information, see [How to use the Azure Mobile Apps Node.js SDK](/previous-versions/azure/app-service-mobile/app-service-mobile-node-backend-how-to-use-server-sdk#howto-tables-getidentity), and [Work with the .NET backend server SDK for Azure Mobile Apps](/previous-versions/azure/app-service-mobile/app-service-mobile-dotnet-backend-how-to-use-server-sdk#user-info).

## Retrieve tokens in app code

From your server code, the provider-specific tokens are injected into the request header, so you can easily access them. The following table shows possible token header names:

| Provider | Header names |
|-|-|
| Azure Active Directory | `X-MS-TOKEN-AAD-ID-TOKEN` <br/> `X-MS-TOKEN-AAD-ACCESS-TOKEN` <br/> `X-MS-TOKEN-AAD-EXPIRES-ON`  <br/> `X-MS-TOKEN-AAD-REFRESH-TOKEN` |
| Facebook Token | `X-MS-TOKEN-FACEBOOK-ACCESS-TOKEN` <br/> `X-MS-TOKEN-FACEBOOK-EXPIRES-ON` |
| Google | `X-MS-TOKEN-GOOGLE-ID-TOKEN` <br/> `X-MS-TOKEN-GOOGLE-ACCESS-TOKEN` <br/> `X-MS-TOKEN-GOOGLE-EXPIRES-ON` <br/> `X-MS-TOKEN-GOOGLE-REFRESH-TOKEN` |
| Twitter | `X-MS-TOKEN-TWITTER-ACCESS-TOKEN` <br/> `X-MS-TOKEN-TWITTER-ACCESS-TOKEN-SECRET` |
|||

From your client code (such as a mobile app or in-browser JavaScript), send an HTTP `GET` request to `/.auth/me` ([token store](overview-authentication-authorization.md#token-store) must be enabled). The returned JSON has the provider-specific tokens.

> [!NOTE]
> Access tokens are for accessing provider resources, so they are present only if you configure your provider with a client secret. To see how to get refresh tokens, see Refresh access tokens.

## Refresh identity provider tokens

When your provider's access token (not the [session token](#extend-session-token-expiration-grace-period)) expires, you need to reauthenticate the user before you use that token again. You can avoid token expiration by making a `GET` call to the `/.auth/refresh` endpoint of your application. When called, App Service automatically refreshes the access tokens in the [token store](overview-authentication-authorization.md#token-store) for the authenticated user. Subsequent requests for tokens by your app code get the refreshed tokens. However, for token refresh to work, the token store must contain [refresh tokens](https://auth0.com/learn/refresh-tokens/) for your provider. The way to get refresh tokens are documented by each provider, but the following list is a brief summary:

- **Google**: Append an `access_type=offline` query string parameter to your `/.auth/login/google` API call. If using the Mobile Apps SDK, you can add the parameter to one of the `LogicAsync` overloads (see [Google Refresh Tokens](https://developers.google.com/identity/protocols/OpenIDConnect#refresh-tokens)).
- **Facebook**: Doesn't provide refresh tokens. Long-lived tokens expire in 60 days (see [Facebook Expiration and Extension of Access Tokens](https://developers.facebook.com/docs/facebook-login/access-tokens/expiration-and-extension)).
- **Twitter**: Access tokens don't expire (see [Twitter OAuth FAQ](https://developer.twitter.com/en/docs/authentication/faq)).
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

## Updating the configuration version

There are two versions of the management API for the Authentication / Authorization feature. The V2 version is required for the "Authentication" experience in the Azure portal. An app already using the V1 API can upgrade to the V2 version once a few changes have been made. Specifically, secret configuration must be moved to slot-sticky application settings. This can be done automatically from the "Authentication" section of the portal for your app.

> [!WARNING]
> Migration to V2 will disable management of the App Service Authentication / Authorization feature for your application through some clients, such as its existing experience in the Azure portal, Azure CLI, and Azure PowerShell. This cannot be reversed.

The V2 API does not support creation or editing of Microsoft Account as a distinct provider as was done in V1. Rather, it leverages the converged [Microsoft Identity Platform](../active-directory/develop/v2-overview.md) to sign-in users with both Azure AD and personal Microsoft accounts. When switching to the V2 API, the V1 Azure Active Directory configuration is used to configure the Microsoft Identity Platform provider. The V1 Microsoft Account provider will be carried forward in the migration process and continue to operate as normal, but it is recommended that you move to the newer Microsoft Identity Platform model. See [Support for Microsoft Account provider registrations](#support-for-microsoft-account-provider-registrations) to learn more.

The automated migration process will move provider secrets into application settings and then convert the rest of the configuration into the new format. To use the automatic migration:

1. Navigate to your app in the portal and select the **Authentication** menu option.
1. If the app is configured using the V1 model, you will see an **Upgrade** button.
1. Review the description in the confirmation prompt. If you are ready to perform the migration, click **Upgrade** in the prompt.

### Manually managing the migration

The following steps will allow you to manually migrate the application to the V2 API if you do not wish to use the automatic version mentioned above.

#### Moving secrets to application settings

1. Get your existing configuration by using the V1 API:

   ```azurecli
   # For Web Apps
   az webapp auth show -g <group_name> -n <site_name>

   # For Azure Functions
   az functionapp auth show -g <group_name> -n <site_name>
   ```

   In the resulting JSON payload, make note of the secret value used for each provider you have configured:

   * AAD: `clientSecret`
   * Google: `googleClientSecret`
   * Facebook: `facebookAppSecret`
   * Twitter: `twitterConsumerSecret`
   * Microsoft Account: `microsoftAccountClientSecret`

   > [!IMPORTANT]
   > The secret values are important security credentials and should be handled carefully. Do not share these values or persist them on a local machine.

1. Create slot-sticky application settings for each secret value. You may choose the name of each application setting. It's value should match what you obtained in the previous step or [reference a Key Vault secret](./app-service-key-vault-references.md?toc=/azure/azure-functions/toc.json) that you have created with that value.

   To create the setting, you can use the Azure portal or run a variation of the following for each provider:

   ```azurecli
   # For Web Apps, Google example    
   az webapp config appsettings set -g <group_name> -n <site_name> --slot-settings GOOGLE_PROVIDER_AUTHENTICATION_SECRET=<value_from_previous_step>

   # For Azure Functions, Twitter example
   az functionapp config appsettings set -g <group_name> -n <site_name> --slot-settings TWITTER_PROVIDER_AUTHENTICATION_SECRET=<value_from_previous_step>
   ```

   > [!NOTE]
   > The application settings for this configuration should be marked as slot-sticky, meaning that they will not move between environments during a [slot swap operation](./deploy-staging-slots.md). This is because your authentication configuration itself is tied to the environment. 

1. Create a new JSON file named `authsettings.json`.Take the output that you received previously and remove each secret value from it. Write the remaining output to the file, making sure that no secret is included. In some cases, the configuration may have arrays containing empty strings. Make sure that `microsoftAccountOAuthScopes` does not, and if it does, switch that value to `null`.

1. Add a property to `authsettings.json` which points to the application setting name you created earlier for each provider:
 
   * AAD: `clientSecretSettingName`
   * Google: `googleClientSecretSettingName`
   * Facebook: `facebookAppSecretSettingName`
   * Twitter: `twitterConsumerSecretSettingName`
   * Microsoft Account: `microsoftAccountClientSecretSettingName`

   An example file after this operation might look similar to the following, in this case only configured for AAD:

   ```json
   {
       "id": "/subscriptions/00d563f8-5b89-4c6a-bcec-c1b9f6d607e0/resourceGroups/myresourcegroup/providers/Microsoft.Web/sites/mywebapp/config/authsettings",
       "name": "authsettings",
       "type": "Microsoft.Web/sites/config",
       "location": "Central US",
       "properties": {
           "enabled": true,
           "runtimeVersion": "~1",
           "unauthenticatedClientAction": "AllowAnonymous",
           "tokenStoreEnabled": true,
           "allowedExternalRedirectUrls": null,
           "defaultProvider": "AzureActiveDirectory",
           "clientId": "3197c8ed-2470-480a-8fae-58c25558ac9b",
           "clientSecret": "",
           "clientSecretSettingName": "MICROSOFT_IDENTITY_AUTHENTICATION_SECRET",
           "clientSecretCertificateThumbprint": null,
           "issuer": "https://sts.windows.net/0b2ef922-672a-4707-9643-9a5726eec524/",
           "allowedAudiences": [
               "https://mywebapp.azurewebsites.net"
           ],
           "additionalLoginParams": null,
           "isAadAutoProvisioned": true,
           "aadClaimsAuthorization": null,
           "googleClientId": null,
           "googleClientSecret": null,
           "googleClientSecretSettingName": null,
           "googleOAuthScopes": null,
           "facebookAppId": null,
           "facebookAppSecret": null,
           "facebookAppSecretSettingName": null,
           "facebookOAuthScopes": null,
           "gitHubClientId": null,
           "gitHubClientSecret": null,
           "gitHubClientSecretSettingName": null,
           "gitHubOAuthScopes": null,
           "twitterConsumerKey": null,
           "twitterConsumerSecret": null,
           "twitterConsumerSecretSettingName": null,
           "microsoftAccountClientId": null,
           "microsoftAccountClientSecret": null,
           "microsoftAccountClientSecretSettingName": null,
           "microsoftAccountOAuthScopes": null,
           "isAuthFromFile": "false"
       }   
   }
   ```

1. Submit this file as the new Authentication/Authorization configuration for your app:

   ```azurecli
   az rest --method PUT --url "/subscriptions/<subscription_id>/resourceGroups/<group_name>/providers/Microsoft.Web/sites/<site_name>/config/authsettings?api-version=2020-06-01" --body @./authsettings.json
   ```

1. Validate that your app is still operating as expected after this gesture.

1. Delete the file used in the previous steps.

You have now migrated the app to store identity provider secrets as application settings.

#### Support for Microsoft Account provider registrations

If your existing configuration contains a Microsoft Account provider and does not contain an Azure Active Directory provider, you can switch the configuration over to the Azure Active Directory provider and then perform the migration. To do this:

1. Go to [**App registrations**](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade) in the Azure portal and find the registration associated with your Microsoft Account provider. It may be under the "Applications from personal account" heading.
1. Navigate to the "Authentication" page for the registration. Under "Redirect URIs" you should see an entry ending in `/.auth/login/microsoftaccount/callback`. Copy this URI.
1. Add a new URI that matches the one you just copied, except instead have it end in `/.auth/login/aad/callback`. This will allow the registration to be used by the App Service Authentication / Authorization configuration.
1. Navigate to the App Service Authentication / Authorization configuration for your app.
1. Collect the configuration for the Microsoft Account provider.
1. Configure the Azure Active Directory provider using the "Advanced" management mode, supplying the client ID and client secret values you collected in the previous step. For the Issuer URL, use Use `<authentication-endpoint>/<tenant-id>/v2.0`, and replace *\<authentication-endpoint>* with the [authentication endpoint for your cloud environment](../active-directory/develop/authentication-national-cloud.md#azure-ad-authentication-endpoints) (e.g., "https://login.microsoftonline.com" for global Azure), also replacing *\<tenant-id>* with your **Directory (tenant) ID**.
1. Once you have saved the configuration, test the login flow by navigating in your browser to the `/.auth/login/aad` endpoint on your site and complete the sign-in flow.
1. At this point, you have successfully copied the configuration over, but the existing Microsoft Account provider configuration remains. Before you remove it, make sure that all parts of your app reference the Azure Active Directory provider through login links, etc. Verify that all parts of your app work as expected.
1. Once you have validated that things work against the AAD Azure Active Directory provider, you may remove the Microsoft Account provider configuration.

> [!WARNING]
> It is possible to converge the two registrations by modifying the [supported account types](../active-directory/develop/supported-accounts-validation.md) for the AAD app registration. However, this would force a new consent prompt for Microsoft Account users, and those users' identity claims may be different in structure, `sub` notably changing values since a new App ID is being used. This approach is not recommended unless thoroughly understood. You should instead wait for support for the two registrations in the V2 API surface.

#### Switching to V2

Once the above steps have been performed, navigate to the app in the Azure portal. Select the "Authentication (preview)" section. 

Alternatively, you may make a PUT request against the `config/authsettingsv2` resource under the site resource. The schema for the payload is the same as captured in the [Configure using a file](#config-file) section.

## <a name="config-file"> </a>Configure using a file (preview)

Your auth settings can optionally be configured via a file that is provided by your deployment. This may be required by certain preview capabilities of App Service Authentication / Authorization.

> [!IMPORTANT]
> Remember that your app payload, and therefore this file, may move between environments, as with [slots](./deploy-staging-slots.md). It is likely you would want a different app registration pinned to each slot, and in these cases, you should continue to use the standard configuration method instead of using the configuration file.

### Enabling file-based configuration

> [!CAUTION]
> During preview, enabling file-based configuration will disable management of the App Service Authentication / Authorization feature for your application through some clients, such as the Azure portal, Azure CLI, and Azure PowerShell.

1. Create a new JSON file for your configuration at the root of your project (deployed to D:\home\site\wwwroot in your web / function app). Fill in your desired configuration according to the [file-based configuration reference](#configuration-file-reference). If modifying an existing Azure Resource Manager configuration, make sure to translate the properties captured in the `authsettings` collection into your configuration file.

2. Modify the existing configuration, which is captured in the [Azure Resource Manager](../azure-resource-manager/management/overview.md) APIs under `Microsoft.Web/sites/<siteName>/config/authsettings`. To modify this, you can use an [Azure Resource Manager template](../azure-resource-manager/templates/overview.md) or a tool like [Azure Resource Explorer](https://resources.azure.com/). Within the authsettings collection, you will need to set three properties (and may remove others):

    1.	Set `enabled` to "true"
    2.	Set `isAuthFromFile` to "true"
    3.	Set `authFilePath` to the name of the file (for example, "auth.json")

> [!NOTE]
> The format for `authFilePath` varies between platforms. On Windows, both relative and absolute paths are supported. Relative is recommended. For Linux, only absolute paths are supported currently, so the value of the setting should be "/home/site/wwwroot/auth.json" or similar.

Once you have made this configuration update, the contents of the file will be used to define the behavior of App Service Authentication / Authorization for that site. If you ever wish to return to Azure Resource Manager configuration, you can do so by setting `isAuthFromFile` back to "false".

### Configuration file reference

Any secrets that will be referenced from your configuration file must be stored as [application settings](./configure-common.md#configure-app-settings). You may name the settings anything you wish. Just make sure that the references from the configuration file uses the same keys.

The following exhausts possible configuration options within the file:

```json
{
    "platform": {
        "enabled": <true|false>
    },
    "globalValidation": {
        "unauthenticatedClientAction": "RedirectToLoginPage|AllowAnonymous|Return401|Return403",
        "redirectToProvider": "<default provider alias>",
        "excludedPaths": [
            "/path1",
            "/path2"
        ]
    },
    "httpSettings": {
        "requireHttps": <true|false>,
        "routes": {
            "apiPrefix": "<api prefix>"
        },
        "forwardProxy": {
            "convention": "NoProxy|Standard|Custom",
            "customHostHeaderName": "<host header value>",
            "customProtoHeaderName": "<proto header value>"
        }
    },
    "login": {
        "routes": {
            "logoutEndpoint": "<logout endpoint>"
        },
        "tokenStore": {
            "enabled": <true|false>,
            "tokenRefreshExtensionHours": "<double>",
            "fileSystem": {
                "directory": "<directory to store the tokens in if using a file system token store (default)>"
            },
            "azureBlobStorage": {
                "sasUrlSettingName": "<app setting name containing the sas url for the Azure Blob Storage if opting to use that for a token store>"
            }
        },
        "preserveUrlFragmentsForLogins": <true|false>,
        "allowedExternalRedirectUrls": [
            "https://uri1.azurewebsites.net/",
            "https://uri2.azurewebsites.net/",
            "url_scheme_of_your_app://easyauth.callback"
        ],
        "cookieExpiration": {
            "convention": "FixedTime|IdentityDerived",
            "timeToExpiration": "<timespan>"
        },
        "nonce": {
            "validateNonce": <true|false>,
            "nonceExpirationInterval": "<timespan>"
        }
    },
    "identityProviders": {
        "azureActiveDirectory": {
            "enabled": <true|false>,
            "registration": {
                "openIdIssuer": "<issuer url>",
                "clientId": "<app id>",
                "clientSecretSettingName": "APP_SETTING_CONTAINING_AAD_SECRET",
            },
            "login": {
                "loginParameters": [
                    "paramName1=value1",
                    "paramName2=value2"
                ]
            },
            "validation": {
                "allowedAudiences": [
                    "audience1",
                    "audience2"
                ]
            }
        },
        "facebook": {
            "enabled": <true|false>,
            "registration": {
                "appId": "<app id>",
                "appSecretSettingName": "APP_SETTING_CONTAINING_FACEBOOK_SECRET"
            },
            "graphApiVersion": "v3.3",
            "login": {
                "scopes": [
                    "public_profile",
                    "email"
                ]
            },
        },
        "gitHub": {
            "enabled": <true|false>,
            "registration": {
                "clientId": "<client id>",
                "clientSecretSettingName": "APP_SETTING_CONTAINING_GITHUB_SECRET"
            },
            "login": {
                "scopes": [
                    "profile",
                    "email"
                ]
            }
        },
        "google": {
            "enabled": true,
            "registration": {
                "clientId": "<client id>",
                "clientSecretSettingName": "APP_SETTING_CONTAINING_GOOGLE_SECRET"
            },
            "login": {
                "scopes": [
                    "profile",
                    "email"
                ]
            },
            "validation": {
                "allowedAudiences": [
                    "audience1",
                    "audience2"
                ]
            }
        },
        "twitter": {
            "enabled": <true|false>,
            "registration": {
                "consumerKey": "<consumer key>",
                "consumerSecretSettingName": "APP_SETTING_CONTAINING TWITTER_CONSUMER_SECRET"
            }
        },
        "apple": {
            "enabled": <true|false>,
            "registration": {
                "clientId": "<client id>",
                "clientSecretSettingName": "APP_SETTING_CONTAINING_APPLE_SECRET"
            },
            "login": {
                "scopes": [
                    "profile",
                    "email"
                ]
            }
        },
        "openIdConnectProviders": {
            "<providerName>": {
                "enabled": <true|false>,
                "registration": {
                    "clientId": "<client id>",
                    "clientCredential": {
                        "clientSecretSettingName": "<name of app setting containing client secret>"
                    },
                    "openIdConnectConfiguration": {
                        "authorizationEndpoint": "<url specifying authorization endpoint>",
                        "tokenEndpoint": "<url specifying token endpoint>",
                        "issuer": "<url specifying issuer>",
                        "certificationUri": "<url specifying jwks endpoint>",
                        "wellKnownOpenIdConfiguration": "<url specifying .well-known/open-id-configuration endpoint - if this property is set, the other properties of this object are ignored, and authorizationEndpoint, tokenEndpoint, issuer, and certificationUri are set to the corresponding values listed at this endpoint>"
                    }
                },
                "login": {
                    "nameClaimType": "<name of claim containing name>",
                    "scopes": [
                        "openid",
                        "profile",
                        "email"
                    ],
                    "loginParameterNames": [
                        "paramName1=value1",
                        "paramName2=value2"
                    ],
                }
            },
            //...
        }
    }
}
```

## Pin your app to a specific authentication runtime version

When you enable Authentication / Authorization, platform middleware is injected into your HTTP request pipeline as described in the [feature overview](overview-authentication-authorization.md#how-it-works). This platform middleware is periodically updated with new features and improvements as part of routine platform updates. By default, your web or function app will run on the latest version of this platform middleware. These automatic updates are always backwards compatible. However, in the rare event that this automatic update introduces a runtime issue for your web or function app, you can temporarily roll back to the previous middleware version. This article explains how to temporarily pin an app to a specific version of the authentication middleware.

### Automatic and manual version updates 

You can pin your app to a specific version of the platform middleware by setting a `runtimeVersion` setting for the app. Your app always runs on the latest version unless you choose to explicitly pin it back to a specific version. There will be a few versions supported at a time. If you pin to an invalid version that is no longer supported, your app will use the latest version instead. To always run the latest version, set `runtimeVersion` to ~1. 

### View and update the current runtime version

You can change the runtime version used by your app. The new runtime version should take effect after restarting the app. 

#### View the current runtime version

You can view the current version of the platform authentication middleware either using the Azure CLI or via one of the built-in version HTTP endpoints in your app.

##### From the Azure CLI

Using the Azure CLI, view the current middleware version with the [az webapp auth show](/cli/azure/webapp/auth#az_webapp_auth_show) command.

```azurecli-interactive
az webapp auth show --name <my_app_name> \
--resource-group <my_resource_group>
```

In this code, replace `<my_app_name>` with the name of your app. Also replace `<my_resource_group>` with the name of the resource group for your app.

You will see the `runtimeVersion` field in the CLI output. It will resemble the following example output, which has been truncated for clarity: 
```output
{
  "additionalLoginParams": null,
  "allowedAudiences": null,
    ...
  "runtimeVersion": "1.3.2",
    ...
}
```

##### From the version endpoint

You can also hit /.auth/version endpoint on an app also to view the current middleware version that the app is running on. It will resemble the following example output:
```output
{
"version": "1.3.2"
}
```

#### Update the current runtime version

Using the Azure CLI, you can update the `runtimeVersion` setting in the app with the [az webapp auth update](/cli/azure/webapp/auth#az_webapp_auth_update) command.

```azurecli-interactive
az webapp auth update --name <my_app_name> \
--resource-group <my_resource_group> \
--runtime-version <version>
```

Replace `<my_app_name>` with the name of your app. Also replace `<my_resource_group>` with the name of the resource group for your app. Also, replace `<version>` with a valid version of the 1.x runtime or `~1` for the latest version. You can find the release notes on the different runtime versions [here] (https://github.com/Azure/app-service-announcements) to help determine the version to pin to.

You can run this command from the [Azure Cloud Shell](../cloud-shell/overview.md) by choosing **Try it** in the preceding code sample. You can also use the [Azure CLI locally](/cli/azure/install-azure-cli) to execute this command after executing [az login](/cli/azure/reference-index#az_login) to sign in.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Authenticate and authorize users end-to-end](tutorial-auth-aad.md)
