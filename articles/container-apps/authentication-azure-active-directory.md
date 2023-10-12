---
title: Enable authentication and authorization in Azure Container Apps with Microsoft Entra ID
description: Learn to use the built-in Microsoft Entra authentication provider in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom: event-tier1-build-2022
ms.topic: how-to
ms.date: 04/20/2022
ms.author: cshoe
---

# Enable authentication and authorization in Azure Container Apps with Microsoft Entra ID

This article shows you how to configure authentication for Azure Container Apps so that your app signs in users with the [Microsoft identity platform](../active-directory/develop/v2-overview.md) as the authentication provider.

The Container Apps Authentication feature can automatically create an app registration with the Microsoft identity platform. You can also use a registration that you or a directory admin creates separately.

- [Create a new app registration automatically](#aad-express)
- [Use an existing registration created separately](#aad-advanced)

## <a name="aad-express"> </a> Option 1: Create a new app registration automatically

This option is designed to make enabling authentication simple and requires just a few steps.

1. Sign in to the [Azure portal] and navigate to your app.
1. Select **Authentication** in the menu on the left. Select **Add identity provider**.
1. Select **Microsoft** in the identity provider dropdown. The option to create a new registration is selected by default. You can change the name of the registration or the supported account types.

    A client secret will be created and stored as a [secret](manage-secrets.md) in the container app.

1. If you're configuring the first identity provider for this application, you'll also be prompted with a **Container Apps authentication settings** section. Otherwise, you may move on to the next step.

    These options determine how your application responds to unauthenticated requests, and the default selections redirect all requests to sign in with this new provider. You can customize this behavior now or adjust these settings later from the main **Authentication** screen by choosing **Edit** next to **Authentication settings**. To learn more about these options, see [Authentication flow](authentication.md#authentication-flow).

1. (Optional) Select **Next: Permissions** and add any scopes needed by the application. These will be added to the app registration, but you can also change them later.
1. Select **Add**.

You're now ready to use the Microsoft identity platform for authentication in your app. The provider will be listed on the **Authentication** screen. From there, you can edit or delete this provider configuration.

## <a name="aad-advanced"> </a>Option 2: Use an existing registration created separately

You can also manually register your application for the Microsoft identity platform, customizing the registration and configuring Container Apps Authentication with the registration details. This approach is useful if you want to use an app registration from a different Microsoft Entra tenant other than the one your application is defined.

### <a name="aad-register"> </a>Create an app registration in Microsoft Entra ID for your container app

First, you'll create your app registration. As you do so, collect the following information that you'll need later when you configure the authentication in the container app:

- Client ID
- Tenant ID
- Client secret (optional)
- Application ID URI

To register the app, perform the following steps:

1. Sign in to the [Azure portal], search for and select **Container Apps**, and then select your app. Note your app's **URL**. You'll use it to configure your Microsoft Entra app registration.
1. From the portal menu, select **Microsoft Entra ID**, then go to the **App registrations** tab and select **New registration**.
1. In the **Register an application** page, enter a **Name** for your app registration.
1. In **Redirect URI**, select **Web** and type `<app-url>/.auth/login/aad/callback`. For example, `https://<hostname>.azurecontainerapps.io/.auth/login/aad/callback`.
1. Select **Register**.
1. After the app registration is created, copy the **Application (client) ID** and the **Directory (tenant) ID** for later.
1. Select **Authentication**. Under **Implicit grant and hybrid flows**, enable **ID tokens** to allow OpenID Connect user sign-ins from Container Apps.  Select **Save**.
1. (Optional) Select **Branding**. In **Home page URL**, enter the URL of your container app and select **Save**.
1. Select **Expose an API**, and select **Set** next to *Application ID URI*. This value uniquely identifies the application when it's used as a resource, allowing tokens to be requested that grant access. The value is also used as a prefix for scopes you create.

    For a single-tenant app, you can use the default value, which is in the form `api://<application-client-id>`. You can also specify a more readable URI like `https://contoso.com/api` based on one of the verified domains for your tenant. For a multi-tenant app, you must provide a custom URI. To learn more about accepted formats for App ID URIs, see the [app registrations best practices reference](../active-directory/develop/security-best-practices-for-app-registration.md#application-id-uri).

    The value is automatically saved.

1. Select **Add a scope**.
   1. In **Add a scope**, the **Application ID URI** is the value you set in a previous step.  Select **Save and continue**.
   1. In **Scope name**, enter *user_impersonation*.
   1. In the text boxes, enter the consent scope name and description you want users to see on the consent page. For example, enter *Access &lt;application-name&gt;*.
   1. Select **Add scope**.
1. (Optional) To create a client secret, select **Certificates & secrets** > **Client secrets** > **New client secret**.  Enter a description and expiration and select **Add**. Copy the client secret value shown in the page. It won't be shown again.
1. (Optional) To add multiple **Reply URLs**, select **Authentication**.

### <a name="aad-secrets"> </a>Enable Microsoft Entra ID in your container app

1. Sign in to the [Azure portal] and navigate to your app.
1. Select **Authentication** in the menu on the left. Select **Add identity provider**.
1. Select **Microsoft** in the identity provider dropdown.
1. For **App registration type**, you can choose to **Pick an existing app registration in this directory** which will automatically gather the necessary app information. If your registration is from another tenant or you don't have permission to view the registration object, choose **Provide the details of an existing app registration**. For this option, you'll need to fill in the following configuration details:

    |Field|Description|
    |-|-|
    |Application (client) ID| Use the **Application (client) ID** of the app registration. |
    |Client Secret| Use the client secret you generated in the app registration. With a client secret, hybrid flow is used and the Container Apps will return access and refresh tokens. When the client secret isn't set, implicit flow is used and only an ID token is returned. These tokens are sent by the provider and stored in the EasyAuth token store.|
    |Issuer Url| Use `<authentication-endpoint>/<TENANT-ID>/v2.0`, and replace *\<authentication-endpoint>* with the [authentication endpoint for your cloud environment](../active-directory/develop/authentication-national-cloud.md#azure-ad-authentication-endpoints) (for example, "https://login.microsoftonline.com" for global Azure), also replacing *\<TENANT-ID>* with the **Directory (tenant) ID** in which the app registration was created. This value is used to redirect users to the correct Microsoft Entra tenant, and to download the appropriate metadata to determine the appropriate token signing keys and token issuer claim value for example. For applications that use Azure AD v1, omit `/v2.0` in the URL.|
    |Allowed Token Audiences| The configured **Application (client) ID** is *always* implicitly considered to be an allowed audience. If this value refers to a cloud or server app and you want to accept authentication tokens from a client container app (the authentication token can be retrieved in the `X-MS-TOKEN-AAD-ID-TOKEN` header), add the **Application (client) ID** of the client app here. |

    The client secret will be stored as [secrets](manage-secrets.md) in your container app.

1. If this is the first identity provider configured for the application, you'll also be prompted with a **Container Apps authentication settings** section. Otherwise, you may move on to the next step.

    These options determine how your application responds to unauthenticated requests, and the default selections will redirect all requests to sign in with this new provider. You can change customize this behavior now or adjust these settings later from the main **Authentication** screen by choosing **Edit** next to **Authentication settings**. To learn more about these options, see [Authentication flow](authentication.md#authentication-flow).

1. Select **Add**.

You're now ready to use the Microsoft identity platform for authentication in your app. The provider will be listed on the **Authentication** screen. From there, you can edit or delete this provider configuration.

## Configure client apps to access your container app

In the prior section, you registered your container app to authenticate users. This section explains how to register native client or daemon apps so that they can request access to APIs exposed by your container app on behalf of users or themselves. Completing the steps in this section isn't required if you only wish to authenticate users.

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
1. Select the app registration you created earlier for your container app. If you don't see the app registration, make sure that you've added the **user_impersonation** scope in [Create an app registration in Microsoft Entra ID for your container app](#aad-register).
1. Under **Delegated permissions**, select **user_impersonation**, and then select **Add permissions**.

You've now configured a native client application that can request access your container app on behalf of a user.

### Daemon client application (service-to-service calls)

Your application can acquire a token to call a Web API hosted in your container app on behalf of itself (not on behalf of a user). This scenario is useful for non-interactive daemon applications that perform tasks without a logged in user. It uses the standard OAuth 2.0 [client credentials](../active-directory/develop/v2-oauth2-client-creds-grant-flow.md) grant.

1. In the [Azure portal], select **Active Directory** > **App registrations** > **New registration**.
1. In the **Register an application** page, enter a **Name** for your daemon app registration.
1. For a daemon application, you don't need a Redirect URI so you can keep that empty.
1. Select **Create**.
1. After the app registration is created, copy the value of **Application (client) ID**.
1. Select **Certificates & secrets** > **New client secret** > **Add**. Copy the client secret value shown in the page. It won't be shown again.

You can now [request an access token using the client ID and client secret](../active-directory/develop/v2-oauth2-client-creds-grant-flow.md#first-case-access-token-request-with-a-shared-secret) by setting the `resource` parameter to the **Application ID URI** of the target app. The resulting access token can then be presented to the target app using the standard [OAuth 2.0 Authorization header](../active-directory/develop/v2-oauth2-client-creds-grant-flow.md#use-a-token), and Container Apps Authentication / Authorization will validate and use the token as usual to now indicate that the caller (an application in this case, not a user) is authenticated.

This process allows _any_ client application in your Microsoft Entra tenant to request an access token and authenticate to the target app. If you also want to enforce _authorization_ to allow only certain client applications, you must adjust the configuration.

1. [Define an App Role](../active-directory/develop/howto-add-app-roles-in-azure-ad-apps.md) in the manifest of the app registration representing the container app you want to protect.
1. On the app registration representing the client that needs to be authorized, select **API permissions** > **Add a permission** > **My APIs**.
1. Select the app registration you created earlier. If you don't see the app registration, make sure that you've [added an App Role](../active-directory/develop/howto-add-app-roles-in-azure-ad-apps.md).
1. Under **Application permissions**, select the App Role you created earlier, and then select **Add permissions**.
1. Make sure to select **Grant admin consent** to authorize the client application to request the permission.
1. Similar to the previous scenario (before any roles were added), you can now [request an access token](../active-directory/develop/v2-oauth2-client-creds-grant-flow.md#first-case-access-token-request-with-a-shared-secret) for the same target `resource`, and the access token will include a `roles` claim containing the App Roles that were authorized for the client application.
1. Within the target Container Apps code, you can now validate that the expected roles are present in the token. The validation steps aren't performed by the Container Apps auth layer. For more information, see [Access user claims](authentication.md#access-user-claims-in-application-code).

You've now configured a daemon client application that can access your container app using its own identity.

## Working with authenticated users

Use the following guides for details on working with authenticated users.

* [Customize sign-in and sign-out](authentication.md#customize-sign-in-and-sign-out)
* [Access user claims in application code](authentication.md#access-user-claims-in-application-code)

## Next steps

> [!div class="nextstepaction"]
> [Authentication and authorization overview](authentication.md)

<!-- URLs. -->
[Azure portal]: https://portal.azure.com/
