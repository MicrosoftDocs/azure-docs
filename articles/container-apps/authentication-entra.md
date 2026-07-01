---
title: Enable Authentication and Authorization in Container Apps with Microsoft Entra ID
description: Learn how to use the built-in Microsoft Entra authentication provider in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: how-to
ms.date: 01/30/2026
ms.author: cshoe
ms.custom: sfi-ropc-nochange
---

# Enable authentication and authorization in Azure Container Apps with Microsoft Entra ID

This article describes how to configure authentication for Azure Container Apps so that your app signs in users by using the [Microsoft identity platform](../active-directory/develop/v2-overview.md) as the authentication provider.

Container Apps authentication can automatically create an app registration with the Microsoft identity platform. You can also use a registration that you or a directory admin creates separately.

- [Create a new app registration automatically](#entra-id-express)
- [Use an existing registration created separately](#entra-id-advanced)

## <a name="entra-id-express"> </a> Option 1: Create a new app registration automatically

This option is designed to make enabling authentication simple and requires just a few steps.

1. Sign in to the [Azure portal] and go to your app.
1. Select **Security** > **Authentication** in the left pane. Select **Add identity provider**.
1. Select **Microsoft** in the identity provider list. The option to create a new registration is selected by default. You can change the name of the registration or the supported account types.

    A client secret is created and stored as a [secret](manage-secrets.md) in the container app.

1. In the **Client secret expiration** list, select an expiration date.

1. If you're configuring the first identity provider for this application, you see a **Container App authentication settings** section. Otherwise, you move on to the next step.

    These options determine how your application responds to unauthenticated requests. The default selections redirect all requests to sign in with this new provider. You can customize this behavior now or adjust these settings later on the main **Authentication** pane by selecting **Edit** next to **Authentication settings**. To learn more about these options, see [Authentication flow](authentication.md#authentication-flow).

1. (Optional) Select **Next: Permissions** and add any scopes needed by the application. The scopes are added to the app registration, but you can also change them later.
1. Select **Add**.

You're now ready to use the Microsoft identity platform for authentication in your app. The provider is listed on the **Authentication** pane. From there, you can edit or delete this provider configuration.

## <a name="entra-id-advanced"> </a>Option 2: Use an existing registration created separately

You can also manually register your application for the Microsoft identity platform, customize the registration, and configure Container Apps Authentication with the registration details. This approach is useful when you want to use an app registration from a Microsoft Entra tenant that isn't the one in which your application is defined.

### <a name="entra-id-register"> </a>Create an app registration in Microsoft Entra ID for your container app

First, you create your app registration. As you do so, collect the following information that you need later when you configure the authentication in the container app:

- Client ID
- Tenant ID
- Client secret (optional)
- Application ID URI

To register the app, perform the following steps:

1. Sign in to the [Azure portal].
1. Search for and select **Container Apps**, and then select your app. In the **Overview** pane, note your app's **Application Url**. You use it to configure your Microsoft Entra app registration.
1. Select **Home** to return to the portal's home page. Search for and select **Microsoft Entra ID**.
1. In the **Overview** pane, select **Add**, and then select **App registration**.
    1. In the **Register an application** pane, enter a **Name** for your app registration.
    1. In the **Redirect URI** section, select **Web**, and then enter the following. Replace `\<APP_URL\>` with the application URL that you noted previously.

        `<APP_URL>/.auth/login/aad/callback`
    
        For example: `https://<CONTAINER_APP_NAME>.<ENVIRONMENT_UNIQUE_ID>.<REGION_NAME>.azurecontainerapps.io/.auth/login/aad/callback`
    1. Select **Register**.
    1. Under **Manage** in the left pane, select **Authentication (Preview)**.
    1. On the **Settings** tab, select **ID tokens (used for implicit and hybrid flows)** to allow OpenID Connect user sign-ins from Container Apps. Select **Save**.
   
1. Go to the new app registration.
    1. In the **Overview** pane, copy the **Application (client) ID** and the **Directory (tenant) ID** for later.
    1. (Optional) If you didn't already add the redirect URI to the app registration, you can do so now.
        1. Under **Manage** in the left pane, select **Authentication (Preview)**.
        1. In the **Authentication (Preview)** pane, select **Add Redirect URI**.
        1. In the **Select a platform to add redirect URI** pane, select **Web**.
        1. In the **Add Redirect URI** pane, in the **Redirect URI** box, enter the following. Replace `\<APP_URL\>` with the application URL that you noted previously.

            `<APP_URL>/.auth/login/aad/callback`
    
            For example: `https://<CONTAINER_APP_NAME>.<HOSTNAME>.<LOCATION>.azurecontainerapps.io/.auth/login/aad/callback`

        1. Select **Configure**.
    1. (Optional) Under **Manage** in the left pane, select **Branding & properties**. In the **Home page URL** box, enter the URL of your container app, and then select **Save**.
    1. Under **Manage** in the left pane, select **Expose an API**.
        1. Select **Add** next to **Application ID URI**.

            The **Application ID URI** uniquely identifies your application when it's used as a resource. It allows requested tokens to grant access. The value is also used as a prefix for scopes you create.

            For a single-tenant app, you can use the default value, which is in the form `api://<APPLICATION_CLIENT_ID>`. You can also specify a more readable URI, like `https://contoso.com/api`, based on one of the verified domains for your tenant. For a multitenant app, you must provide a custom URI. To learn more about accepted formats for app ID URIs, see [Security best practices for application properties in Microsoft Entra ID](../active-directory/develop/security-best-practices-for-app-registration.md#application-id-uri).

            The value is automatically saved.

        1. Select **Add a scope**.
        1. In the **Add a scope** pane, the **Application ID URI** is the value you set in a previous step.
        1. Select **Save and continue**.
        1. In the **Scope name** box, enter **user_impersonation**.
        1. Enter the **Admin consent display name** and **Admin consent description** that you want admins to see on the consent page. An example consent display name is *Access &lt;application-name&gt;*.
        1. Select **Add scope**.
    1. Under **Manage** in the left pane, select **Certificates & secrets**.
        1. In the **Certificates & secrets** pane, select **Client secrets**.
        1. Select **New client secret**.
        1. Enter a **Description**, and then, in **Expires**, select an expiration date.
        1. Select **Add**.
        1. Copy the client secret value shown on the page. The site won't show it to you again.

### <a name="entra-id-secrets"> </a>Enable Microsoft Entra ID in your container app

1. Sign in to the [Azure portal] and go to your app.
1. In the left pane, under **Security**, select **Authentication**. Select **Add provider**.
1. Select **Microsoft** in the identity provider list.
1. For **App registration type**, you can select **Pick an existing app registration in this directory**, which automatically gathers the necessary app information. If your registration is from another tenant or you don't have permission to view the registration object, select **Provide the details of an existing app registration**. For this option, you need to provide the following configuration details:

    > [!WARNING]
    > Whenever possible, avoid using implicit grant flow. In most scenarios, more secure alternatives are available and recommended. Certain configurations of this flow require a high degree of trust in the application and carry risks that aren't present in other flows. You should only use this flow when other more secure flows aren't viable. For more information, see the [security concerns with implicit grant flow](/entra/identity-platform/v2-oauth2-implicit-grant-flow#security-concerns-with-implicit-grant-flow).

    |Setting|Description|
    |-|-|
    |**Application (client) ID**| Use the **Application (client) ID** of the app registration. |
    |**Client secret**| Use the client secret you generated in the app registration. Client secrets use hybrid flow, and the app returns access and refresh tokens. When the client secret isn't set, implicit flow is used and only an ID token is returned. The provider sends the tokens, and they're stored in the EasyAuth token store. |
    |**Issuer URL**| Use `<AUTHENTICATION-ENDPOINT>/<TENANT-ID>/v2.0`. Replace *\<AUTHENTICATION-ENDPOINT>* with the [authentication endpoint for your cloud environment](../active-directory/develop/authentication-national-cloud.md#azure-ad-authentication-endpoints) (for example, "https://login.microsoftonline.com" for global Azure). Replace *\<TENANT-ID>* with the **Directory (tenant) ID** in which the app registration was created. This value is used to redirect users to the correct Microsoft Entra tenant, and to download the metadata to determine the appropriate token signing keys and token issuer claim value, for example. For applications that use Azure Active Directory v1, omit `/v2.0` in the URL.|
    |**Allowed token audiences**| The configured **Application (client) ID** is *always* implicitly considered to be an allowed audience. If this value refers to a cloud or server app and you want to accept authentication tokens from a client container app (the authentication token can be retrieved in the `X-MS-TOKEN-AAD-ID-TOKEN` header), add the **Application (client) ID** of the client app here. |

    The client secret is stored as a [secret](manage-secrets.md) in your container app.

1. If this is the first identity provider configured for the application, you see a **Container Apps authentication settings** section. Otherwise, you move on to the next step.

    These options determine how your application responds to unauthenticated requests. The default selections will redirect all requests to sign in with this new provider. You can change this behavior now or adjust these settings later on the main **Authentication** pane by selecting **Edit** next to **Authentication settings**. To learn more about these options, see [Authentication flow](authentication.md#authentication-flow).

1. Select **Add**.

You're now ready to use the Microsoft identity platform for authentication in your app. The provider is listed on the **Authentication** pane. From there, you can edit or delete this provider configuration.

## Configure client apps to access your container app

In the previous section, you registered your container app to authenticate users. In this section, you register native client or daemon apps. They can then request access to APIs exposed by your container app on behalf of users or themselves. You don't need to complete the steps in this section if you only want to authenticate users.

### Native client application

You can register native clients to request access to your container app's APIs on behalf of a signed in user.

1. In the [Azure portal], search for and select **Microsoft Entra ID**. 
1. In the **Overview** pane, select **Add** > **App registration**.
1. In the **Register an application** pane, enter a **Name** for your app registration.
1. Under **Redirect URI**, select **Public client (mobile & desktop)** and type the URL `<app-url>/.auth/login/aad/callback`. For example, `https://<hostname>.azurecontainerapps.io/.auth/login/aad/callback`.

    > [!NOTE]
    > For a Microsoft Store application, use the [package SID](/previous-versions/azure/app-service-mobile/app-service-mobile-dotnet-how-to-use-client-library#package-sid) as the URI instead.
1. Select **Register**.
1. After the app registration is created, copy the **Application (client) ID** value.
1. Under **Manage** in the left pane, select **API permissions**. Select **Add a permission** > **My APIs**.
1. Select the app registration you created earlier for your container app. If you don't see the app registration, make sure that you added the **user_impersonation** scope in [Create an app registration in Microsoft Entra ID for your container app](#entra-id-register).
1. Under **Delegated permissions**, select **user_impersonation**, and then select **Add permissions**.

### Daemon client application (service-to-service calls)

Your application can acquire a token to call a Web API hosted in your container app on behalf of itself (not on behalf of a user). This scenario is useful for non-interactive daemon applications that perform tasks without a logged in user. It uses the standard OAuth 2.0 [client credentials](../active-directory/develop/v2-oauth2-client-creds-grant-flow.md) grant.

1. In the [Azure portal], search for and select **Microsoft Entra ID**.
1. In the **Overview pane**, select **Add** > **App registration**.
1. In the **Register an application** pane, enter a **Name** for your daemon app registration.
1. For a daemon application, you don't need a **Redirect URI**, so you can leave that field empty.
1. Select **Register**.
1. After the app registration is created, copy the **Application (client) ID** value.
1. In the left pane, under **Manage**, select **Certificates & secrets**.
1. In the **Certificates & secrets** pane, select **New client secret**.
1. Select **Add** in the **Add a client secret** pane. Copy the client secret value shown on the page. It isn't shown again.

You can now [request an access token by using the client ID and client secret](../active-directory/develop/v2-oauth2-client-creds-grant-flow.md#first-case-access-token-request-with-a-shared-secret) by setting the `resource` parameter to the **Application ID URI** of the target app. You can then present the resulting access token to the target app by using the standard [OAuth 2.0 Authorization header](../active-directory/develop/v2-oauth2-client-creds-grant-flow.md#use-a-token). Container Apps authentication/authorization validates and uses the token as usual to indicate that the caller (an application in this case, not a user) is authenticated.

This process allows _any_ client application in your Microsoft Entra tenant to request an access token and authenticate to the target app. If you also want to enforce _authorization_ to allow only certain client applications, you must adjust the configuration.

1. [Define an app role](../active-directory/develop/howto-add-app-roles-in-azure-ad-apps.md) in the manifest of the app registration that represents the container app that you want to protect.
1. On the app registration that represents the client that needs to be authorized, select **API permissions** > **Add a permission**.
1. In the Request API permissions pane, select **My APIs**.
1. Select the app registration you created earlier. If you don't see the app registration, make sure that you [add an app role](../active-directory/develop/howto-add-app-roles-in-azure-ad-apps.md).
1. Under **Application permissions**, select the app role you created earlier, and then select **Add permissions**.
1. Make sure to select **Grant admin consent** to authorize the client application to request permission.
1. As in the previous scenario (before any roles were added), you can now [request an access token](../active-directory/develop/v2-oauth2-client-creds-grant-flow.md#first-case-access-token-request-with-a-shared-secret) for the same target `resource`. The access token includes a `roles` claim containing the app roles that are authorized for the client application.
1. In the target Container Apps code, validate that expected roles are now present in the token. The Container Apps authentication layer doesn't perform the validation steps. For more information, see [Access user claims](authentication.md#access-user-claims-in-application-code).

## Working with authenticated users

See the following resources for details on working with authenticated users.

* [Customize sign-in and sign out](authentication.md#customize-sign-in-and-sign-out)
* [Access user claims in application code](authentication.md#access-user-claims-in-application-code)

## Next step

> [!div class="nextstepaction"]
> [Authentication and authorization overview](authentication.md)

<!-- URLs. -->
[Azure portal]: https://portal.azure.com/
