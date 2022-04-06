---
title: Enable authentication and authorization in Azure Container Apps Preview
description: Learn to use the built-in authentication in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: how-to
ms.date: 04/06/2022
ms.author: cshoe
zone_pivot_groups: container-apps-identity-providers
---

# Enable authentication and authorization in Azure Container Apps Preview

::: zone pivot="aad"

This article shows you how to configure authentication for Azure Container Apps so that your app signs in users with the [Microsoft identity platform](../active-directory/develop/v2-overview.md) (Azure AD) as the authentication provider.

The Container Apps Authentication feature can automatically create an app registration with the Microsoft identity platform. You can also use a registration that you or a directory admin creates separately.

- [Create a new app registration automatically](#aad-express)
- [Use an existing registration created separately](#aad-advanced)

## <a name="aad-express"> </a> Option 1: Create a new app registration automatically

This option is designed to make enabling authentication simple and requires just a few clicks.

1. Sign in to the [Azure portal] and navigate to your app.
1. Select **Authentication** in the menu on the left. Click **Add identity provider**.
1. Select **Microsoft** in the identity provider dropdown. The option to create a new registration is selected by default. You can change the name of the registration or the supported account types.

    A client secret will be created and stored as a [secret](manage-secrets.md) in the container app.

1. If this is the first identity provider configured for the application, you'll also be prompted with an **Container Apps authentication settings** section. Otherwise, you may move on to the next step.
    
    These options determine how your application responds to unauthenticated requests, and the default selections will redirect all requests to log in with this new provider. You can change customize this behavior now or adjust these settings later from the main **Authentication** screen by choosing **Edit** next to **Authentication settings**. To learn more about these options, see [Authentication flow](authentication.md#authentication-flow).

1. (Optional) Click **Next: Permissions** and add any scopes needed by the application. These will be added to the app registration, but you can also change them later.
1. Click **Add**.

You're now ready to use the Microsoft identity platform for authentication in your app. The provider will be listed on the **Authentication** screen. From there, you can edit or delete this provider configuration.

## <a name="aad-advanced"> </a>Option 2: Use an existing registration created separately

You can also manually register your application for the Microsoft identity platform, customizing the registration and configuring Container Apps Authentication with the registration details. This is useful, for example, if you want to use an app registration from a different Azure AD tenant than the one your application is in.

### <a name="aad-register"> </a>Create an app registration in Azure AD for your container app

First, you will create your app registration. As you do so, collect the following information which you will need later when you configure the authentication in the container app:

- Client ID
- Tenant ID
- Client secret (optional)
- Application ID URI

To register the app, perform the following steps:

1. Sign in to the [Azure portal], search for and select **Container Appss**, and then select your app. Note your app's **URL**. You'll use it to configure your Azure Active Directory app registration.
1. From the portal menu, select **Azure Active Directory**, then go to the **App registrations** tab and select **New registration**.
1. In the **Register an application** page, enter a **Name** for your app registration.
1. In **Redirect URI**, select **Web** and type `<app-url>/.auth/login/aad/callback`. For example, `https://<hostname>.azurecontainerapps.io/.auth/login/aad/callback`.
1. Select **Register**.
1. After the app registration is created, copy the **Application (client) ID** and the **Directory (tenant) ID** for later.
1. Select **Authentication**. Under **Implicit grant and hybrid flows**, enable **ID tokens** to allow OpenID Connect user sign-ins from Container Apps.  Select **Save**.
1. (Optional) Select **Branding**. In **Home page URL**, enter the URL of your container app and select **Save**.
1. Select **Expose an API**, and click **Set** next to "Application ID URI". This value uniquely identifies the application when it is used as a resource, allowing tokens to be requested that grant access. It is used as a prefix for scopes you create.

    For a single-tenant app, you can use the default value, which is in the form the form `api://<application-client-id>`. You can also specify a more readable URI like `https://contoso.com/api` based on one of the verified domains for your tenant. For a multi-tenant app, you must provide a custom URI. To learn more about accepted formats for App ID URIs, see the [app registrations best practices reference](../active-directory/develop/security-best-practices-for-app-registration.md#appid-uri-configuration).

    The value is automatically saved.

1. Select **Add a scope**.
   1. In **Add a scope**, the **Application ID URI** is the value you set in a previous step.  Select **Save and continue**.
   1. In **Scope name**, enter *user_impersonation*.
   1. In the text boxes, enter the consent scope name and description you want users to see on the consent page. For example, enter *Access &lt;application-name&gt;*.
   1. Select **Add scope**.
1. (Optional) To create a client secret, select **Certificates & secrets** > **Client secrets** > **New client secret**.  Enter a description and expiration and select **Add**. Copy the client secret value shown in the page. It won't be shown again.
1. (Optional) To add multiple **Reply URLs**, select **Authentication**.

### <a name="secrets"> </a>Enable Azure Active Directory in your container app

1. Sign in to the [Azure portal] and navigate to your app.
1. Select **Authentication** in the menu on the left. Click **Add identity provider**.
1. Select **Microsoft** in the identity provider dropdown.
1. For **App registration type**, you can choose to **Pick an existing app registration in this directory** which will automatically gather the necessary app information. If your registration is from another tenant or you do not have permission to view the registration object, choose **Provide the details of an existing app registration**. For this option, you will need to fill in the following configuration details:

    |Field|Description|
    |-|-|
    |Application (client) ID| Use the **Application (client) ID** of the app registration. |
    |Client Secret| Use the client secret you generated in the app registration. With a client secret, hybrid flow is used and the Container Apps will return access and refresh tokens. When the client secret is not set, implicit flow is used and only an ID token is returned. These tokens are sent by the provider and stored in the EasyAuth token store.|
    |Issuer Url| Use `<authentication-endpoint>/<tenant-id>/v2.0`, and replace *\<authentication-endpoint>* with the [authentication endpoint for your cloud environment](../active-directory/develop/authentication-national-cloud.md#azure-ad-authentication-endpoints) (e.g., "https://login.microsoftonline.com" for global Azure), also replacing *\<tenant-id>* with the **Directory (tenant) ID** in which the app registration was created. This value is used to redirect users to the correct Azure AD tenant, as well as to download the appropriate metadata to determine the appropriate token signing keys and token issuer claim value for example. For applications that use Azure AD v1, omit `/v2.0` in the URL.|
    |Allowed Token Audiences| The configured **Application (client) ID** is *always* implicitly considered to be an allowed audience. If this is a cloud or server app and you want to accept authentication tokens from a client container app (the authentication token can be retrieved in the X-MS-TOKEN-AAD-ID-TOKEN header), add the **Application (client) ID** of the client app here. |

    The client secret will be stored as a slot-sticky [application setting](./configure-common.md#configure-app-settings) named `MICROSOFT_PROVIDER_AUTHENTICATION_SECRET`. You can update that setting later to use [Key Vault references](./app-service-key-vault-references.md) if you wish to manage the secret in Azure Key Vault.

1. If this is the first identity provider configured for the application, you will also be prompted with an **Container Apps authentication settings** section. Otherwise, you may move on to the next step.
    
    These options determine how your application responds to unauthenticated requests, and the default selections will redirect all requests to log in with this new provider. You can change customize this behavior now or adjust these settings later from the main **Authentication** screen by choosing **Edit** next to **Authentication settings**. To learn more about these options, see [Authentication flow](authentication.md#authentication-flow).

1. Click **Add**.

You're now ready to use the Microsoft identity platform for authentication in your app. The provider will be listed on the **Authentication** screen. From there, you can edit or delete this provider configuration.

## Configure client apps to access your container app

In the prior section, you registered your container app to authenticate users. This section explains how to register native client or daemon apps so that they can request access to APIs exposed by your container app on behalf of users or themselves. Completing the steps in this section is not required if you only wish to authenticate users.

### Native client application

You can register native clients to request access your container app's APIs on behalf of a signed in user.

1. In the [Azure portal], select **Active Directory** > **App registrations** > **New registration**.
1. In the **Register an application** page, enter a **Name** for your app registration.
1. In **Redirect URI**, select **Public client (mobile & desktop)** and type the URL `<app-url>/.auth/login/aad/callback`. For example, `https://<hostname>.azurecontainerapps.io/.auth/login/aad/callback`.

    > [!NOTE]
    > For a Microsoft Store application, use the [package SID](/previous-versions/azure/app-service-mobile/app-service-mobile-dotnet-how-to-use-client-library#package-sid) as the URI instead.
1. Select **Create**.
1. After the app registration is created, copy the value of **Application (client) ID**.
1. Select **API permissions** > **Add a permission** > **My APIs**.
1. Select the app registration you created earlier for your container app. If you don't see the app registration, make sure that you've added the **user_impersonation** scope in [Create an app registration in Azure AD for your container app](#register).
1. Under **Delegated permissions**, select **user_impersonation**, and then select **Add permissions**.

You have now configured a native client application that can request access your container app on behalf of a user.

### Daemon client application (service-to-service calls)

Your application can acquire a token to call a Web API hosted in your container app or Function app on behalf of itself (not on behalf of a user). This scenario is useful for non-interactive daemon applications that perform tasks without a logged in user. It uses the standard OAuth 2.0 [client credentials](../active-directory/azuread-dev/v1-oauth2-client-creds-grant-flow.md) grant.

1. In the [Azure portal], select **Active Directory** > **App registrations** > **New registration**.
1. In the **Register an application** page, enter a **Name** for your daemon app registration.
1. For a daemon application, you don't need a Redirect URI so you can keep that empty.
1. Select **Create**.
1. After the app registration is created, copy the value of **Application (client) ID**.
1. Select **Certificates & secrets** > **New client secret** > **Add**. Copy the client secret value shown in the page. It won't be shown again.

You can now [request an access token using the client ID and client secret](../active-directory/azuread-dev/v1-oauth2-client-creds-grant-flow.md#first-case-access-token-request-with-a-shared-secret) by setting the `resource` parameter to the **Application ID URI** of the target app. The resulting access token can then be presented to the target app using the standard [OAuth 2.0 Authorization header](../active-directory/azuread-dev/v1-oauth2-client-creds-grant-flow.md#use-the-access-token-to-access-the-secured-resource), and Container Apps Authentication / Authorization will validate and use the token as usual to now indicate that the caller (an application in this case, not a user) is authenticated.

At present, this allows _any_ client application in your Azure AD tenant to request an access token and authenticate to the target app. If you also want to enforce _authorization_ to allow only certain client applications, you must perform some additional configuration.

1. [Define an App Role](../active-directory/develop/howto-add-app-roles-in-azure-ad-apps.md) in the manifest of the app registration representing the Container Apps or Function app you want to protect.
1. On the app registration representing the client that needs to be authorized, select **API permissions** > **Add a permission** > **My APIs**.
1. Select the app registration you created earlier. If you don't see the app registration, make sure that you've [added an App Role](../active-directory/develop/howto-add-app-roles-in-azure-ad-apps.md).
1. Under **Application permissions**, select the App Role you created earlier, and then select **Add permissions**.
1. Make sure to click **Grant admin consent** to authorize the client application to request the permission.
1. Similar to the previous scenario (before any roles were added), you can now [request an access token](../active-directory/azuread-dev/v1-oauth2-client-creds-grant-flow.md#first-case-access-token-request-with-a-shared-secret) for the same target `resource`, and the access token will include a `roles` claim containing the App Roles that were authorized for the client application.
1. Within the target Container Apps or Function app code, you can now validate that the expected roles are present in the token (this is not performed by Container Apps Authentication / Authorization). For more information, see [Access user claims](configure-authentication-user-identities.md#access-user-claims-in-app-code).

You have now configured a daemon client application that can access your container app using its own identity.

::: zone-end

::: zone pivot="facebook"

This article shows how to configure Azure Container Apps to use Facebook as an authentication provider.

To complete the procedure in this article, you need a Facebook account that has a verified email address and a mobile phone number. To create a new Facebook account, go to [facebook.com].

## <a name="facebook-register"> </a>Register your application with Facebook

1. Go to the [Facebook Developers] website and sign in with your Facebook account credentials.

   If you don't have a Facebook for Developers account, select **Get Started** and follow the registration steps.
1. Select **My Apps** > **Add New App**.
1. In **Display Name** field:
   1. Type a unique name for your app.
   1. Provide your **Contact Email**.
   1. Select **Create App ID**.
   1. Complete the security check.

   The developer dashboard for your new Facebook app opens.
1. Select **Dashboard** > **Facebook Login** > **Set up** > **Web**.
1. In the left navigation under **Facebook Login**, select **Settings**.
1. In the **Valid OAuth redirect URIs** field, enter `https://<hostname>.azurecontainerapps.io/.auth/login/facebook/callback`. Remember to use the hostname of your container app.
1. Select **Save Changes**.
1. In the left pane, select **Settings** > **Basic**. 
1. In the **App Secret** field, select **Show**. Copy the values of **App ID** and **App Secret**. You use them later to configure your container app in Azure.

   > [!IMPORTANT]
   > The app secret is an important security credential. Do not share this secret with anyone or distribute it within a client application.
   >

1. The Facebook account that you used to register the application is an administrator of the app. At this point, only administrators can sign in to this application.

   To authenticate other Facebook accounts, select **App Review** and enable **Make \<your-app-name> public** to enable the general public to access the app by using Facebook authentication.

## <a name="facebook-secrets"> </a>Add Facebook information to your application

1. Sign in to the [Azure portal] and navigate to your app.
1. Select **Authentication** in the menu on the left. Click **Add identity provider**.
1. Select **Facebook** in the identity provider dropdown. Paste in the App ID and App Secret values that you obtained previously.

    The secret will be stored as a [secret](manage-secrets.md) in your container app.

1. If this is the first identity provider configured for the application, you will also be prompted with an **Container Apps authentication settings** section. Otherwise, you may move on to the next step.
    
    These options determine how your application responds to unauthenticated requests, and the default selections will redirect all requests to log in with this new provider. You can change customize this behavior now or adjust these settings later from the main **Authentication** screen by choosing **Edit** next to **Authentication settings**. To learn more about these options, see [Authentication flow](authentication.md#authentication-flow).

1. (Optional) Click **Next: Scopes** and add any scopes needed by the application. These will be requested at login time for browser-based flows.
1. Click **Add**.

You're now ready to use Facebook for authentication in your app. The provider will be listed on the **Authentication** screen. From there, you can edit or delete this provider configuration.

::: zone-end

::: zone pivot="google"

This topic shows you how to configure Azure Container Apps to use Google as an authentication provider.

To complete the procedure in this topic, you must have a Google account that has a verified email address. To create a new Google account, go to [accounts.google.com](https://go.microsoft.com/fwlink/p/?LinkId=268302).

## <a name="google-register"> </a>Register your application with Google

1. Follow the Google documentation at [Google Sign-In for server-side apps](https://developers.google.com/identity/sign-in/web/server-side-flow) to create a client ID and client secret. There's no need to make any code changes. Just use the following information:
    - For **Authorized JavaScript Origins**, use `https://<hostname>.azurecontainerapps.io` with the name of your app in *\<hostname>*.
    - For **Authorized Redirect URI**, use `https://<hostname>.azurecontainerapps.io/.auth/login/google/callback`.
1. Copy the App ID and the App secret values.

    > [!IMPORTANT]
    > The App secret is an important security credential. Do not share this secret with anyone or distribute it within a client application.

## <a name="google-secrets"> </a>Add Google information to your application

1. Sign in to the [Azure portal] and navigate to your app.
1. Select **Authentication** in the menu on the left. Click **Add identity provider**.
1. Select **Google** in the identity provider dropdown. Paste in the App ID and App Secret values that you obtained previously.

    The secret will be stored as a [secret](manage-secrets.md) in your container app.

1. If this is the first identity provider configured for the application, you will also be prompted with an **Container Apps authentication settings** section. Otherwise, you may move on to the next step.
    
    These options determine how your application responds to unauthenticated requests, and the default selections will redirect all requests to log in with this new provider. You can change customize this behavior now or adjust these settings later from the main **Authentication** screen by choosing **Edit** next to **Authentication settings**. To learn more about these options, see [Authentication flow](authentication.md#authentication-flow).

1. Click **Add**.

    > [!NOTE]
    > For adding scope: You can define what permissions your application has in the provider's registration portal. The app can request scopes at login time which leverage these permissions.

You are now ready to use Google for authentication in your app. The provider will be listed on the **Authentication** screen. From there, you can edit or delete this provider configuration.

::: zone-end

::: zone pivot="twitter"

This article shows how to configure Azure Container Apps to use Twitter as an authentication provider.

To complete the procedure in this article, you need a Twitter account that has a verified email address and phone number. To create a new Twitter account, go to [twitter.com].

## <a name="twitter-register"> </a>Register your application with Twitter

1. Sign in to the [Azure portal] and go to your application. Copy your **URL**. You'll use it to configure your Twitter app.
1. Go to the [Twitter Developers] website, sign in with your Twitter account credentials, and select **Create an app**.
1. Enter the **App name** and the **Application description** for your new app. Paste your application's **URL** into the **Website URL** field. In the **Callback URLs** section, enter the HTTPS URL of your container app and append the path `/.auth/login/twitter/callback`. For example, `https://<hostname>.azurecontainerapps.io/.auth/login/twitter/callback`.
1. At the bottom of the page, type at least 100 characters in **Tell us how this app will be used**, then select **Create**. Click **Create** again in the pop-up. The application details are displayed.
1. Select the **Keys and Access Tokens** tab.

   Make a note of these values:
   - API key
   - API secret key

   > [!IMPORTANT]
   > The API secret key is an important security credential. Do not share this secret with anyone or distribute it with your app.

## <a name="twitter-secrets"> </a>Add Twitter information to your application

1. Sign in to the [Azure portal] and navigate to your app.
1. Select **Authentication** in the menu on the left. Click **Add identity provider**.
1. Select **Twitter** in the identity provider dropdown. Paste in the `API key` and `API secret key` values that you obtained previously.

    The secret will be stored as [secret](manage-secrets.md) in your container app.

1. If this is the first identity provider configured for the application, you will also be prompted with an **Container Apps authentication settings** section. Otherwise, you may move on to the next step.
    
    These options determine how your application responds to unauthenticated requests, and the default selections will redirect all requests to log in with this new provider. You can change customize this behavior now or adjust these settings later from the main **Authentication** screen by choosing **Edit** next to **Authentication settings**. To learn more about these options, see [Authentication flow](authentication.md#authentication-flow).

1. Click **Add**.

You're now ready to use Twitter for authentication in your app. The provider will be listed on the **Authentication** screen. From there, you can edit or delete this provider configuration.

::: zone-end

::: zone pivot="openid"

This article shows you how to configure Azure Container Apps to use a custom authentication provider that adheres to the [OpenID Connect specification](https://openid.net/connect/). OpenID Connect (OIDC) is an industry standard used by many identity providers (IDPs). You do not need to understand the details of the specification in order to configure your app to use an adherent IDP.

You can configure your app to use one or more OIDC providers. Each must be given a unique alphanumeric name in the configuration, and only one can serve as the default redirect target.

## <a name="openid-register"> </a>Register your application with the identity provider

Your provider will require you to register the details of your application with it. One of these steps involves specifying a redirect URI. This redirect URI will be of the form `<app-url>/.auth/login/<provider-name>/callback`. Each identity provider should provide more instructions on how to complete these steps.

> [!NOTE]
> Some providers may require additional steps for their configuration and how to use the values they provide. For example, Apple provides a private key which is not itself used as the OIDC client secret, and you instead must use it craft a JWT which is treated as the secret you provide in your app config (see the "Creating the Client Secret" section of the [Sign in with Apple documentation](https://developer.apple.com/documentation/sign_in_with_apple/generate_and_validate_tokens))
>

You will need to collect a **client ID** and **client secret** for your application.

> [!IMPORTANT]
> The client secret is an important security credential. Do not share this secret with anyone or distribute it within a client application.
>

Additionally, you will need the OpenID Connect metadata for the provider. This is often exposed via a [configuration metadata document](https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfig), which is the provider's Issuer URL suffixed with `/.well-known/openid-configuration`. Gather this configuration URL.

If you are unable to use a configuration metadata document, you will need to gather the following values separately:

- The issuer URL (sometimes shown as `issuer`)
- The [OAuth 2.0 Authorization endpoint](https://tools.ietf.org/html/rfc6749#section-3.1) (sometimes shown as `authorization_endpoint`)
- The [OAuth 2.0 Token endpoint](https://tools.ietf.org/html/rfc6749#section-3.2) (sometimes shown as `token_endpoint`)
- The URL of the [OAuth 2.0 JSON Web Key Set](https://tools.ietf.org/html/rfc8414#section-2) document (sometimes shown as `jwks_uri`)

## <a name="openid-configure"> </a>Add provider information to your application

1. Sign in to the [Azure portal] and navigate to your app.

1. Select **Authentication** in the menu on the left. Click **Add identity provider**.

1. Select **OpenID Connect** in the identity provider dropdown.

1. Provide the unique alphanumeric name selected earlier for **OpenID provider name**.

1. If you have the URL for the **metadata document** from the identity provider, provide that value for **Metadata URL**. Otherwise, select the **Provide endpoints separately** option and put each URL gathered from the identity provider in the appropriate field.

1. Provide the earlier collected **Client ID** and **Client Secret** in the appropriate fields.

1. Specify an application setting name for your client secret. Your client secret will be stored as a [secret](manage-secrets.md) in your container app.

1. Press the **Add** button to finish setting up the identity provider. 

::: zone-end