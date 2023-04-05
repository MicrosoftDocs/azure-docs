---
title: Configure Azure AD authentication
description: Learn how to configure Azure Active Directory authentication as an identity provider for your App Service or Azure Functions app.
ms.assetid: 6ec6a46c-bce4-47aa-b8a3-e133baef22eb
ms.topic: article
ms.date: 01/31/2023
ms.custom: seodec18, fasttrack-edit
---

# Configure your App Service or Azure Functions app to use Azure AD login

Select another authentication provider to jump to it.

[!INCLUDE [app-service-mobile-selector-authentication](../../includes/app-service-mobile-selector-authentication.md)]

This article shows you how to configure authentication for Azure App Service or Azure Functions so that your app signs in users with the [Microsoft identity platform](../active-directory/develop/v2-overview.md) (Azure AD) as the authentication provider.

The App Service Authentication feature can automatically create an app registration with the Microsoft identity platform. You can also use a registration that you or a directory admin creates separately.

- [Create a new app registration automatically](#express)
- [Use an existing registration created separately](#advanced)

> [!NOTE]
> The option to create a new registration is not available for government clouds. Instead, [define a registration separately](#advanced).

## <a name="express"> </a> Option 1: Create a new app registration automatically

Use this option unless you need to create an app registration separately. It makes enabling authentication simple and requires just a few clicks. You can customize the app registration in Azure AD once it's created. 

1. Sign in to the [Azure portal] and navigate to your app.
1. Select **Authentication** in the menu on the left. Click **Add identity provider**.
1. Select **Microsoft** in the identity provider dropdown. The option to create a new registration is selected by default. You can change the name of the registration or the supported account types.

    A client secret will be created and stored as a slot-sticky [application setting] named `MICROSOFT_PROVIDER_AUTHENTICATION_SECRET`. You can update that setting later to use [Key Vault references](./app-service-key-vault-references.md) if you wish to manage the secret in Azure Key Vault.

1. If this is the first identity provider configured for the application, you will also be prompted with an **App Service authentication settings** section. Otherwise, you may move on to the next step.
    
    These options determine how your application responds to unauthenticated requests, and the default selections will redirect all requests to log in with this new provider. You can change customize this behavior now or adjust these settings later from the main **Authentication** screen by choosing **Edit** next to **Authentication settings**. To learn more about these options, see [Authentication flow](overview-authentication-authorization.md#authentication-flow).

1. (Optional) Click **Next: Permissions** and add any Microsoft Graph permissions needed by the application. These will be added to the app registration, but you can also change them later.
1. Click **Add**.

You're now ready to use the Microsoft identity platform for authentication in your app. The provider will be listed on the **Authentication** screen. From there, you can edit or delete this provider configuration.

For an example of configuring Azure AD login for a web app that accesses Azure Storage and Microsoft Graph, see [this tutorial](scenario-secure-app-authentication-app-service.md).

## <a name="advanced"> </a>Option 2: Use an existing registration created separately

You can configure App Service authentication to use an existing app registration. The following situations are the most common cases to use an existing app registration: 

- Your account doesn't have permissions to create app registrations in your Azure AD tenant.
- You want to use an app registration from a different Azure AD tenant than the one your app is in.
- The option to create a new registration is not available for government clouds.

#### <a name="register"> </a>Step 1: Create an app registration in Azure AD for your App Service app

During creation of the app registration, collect the following information which you will need later when you configure the authentication in the App Service app:

- Client ID
- Tenant ID
- Client secret (optional)
- Application ID URI

To register the app, perform the following steps:

1. Sign in to the [Azure portal], search for and select **App Services**, and then select your app. Note your app's **URL**. You'll use it to configure your Azure Active Directory app registration.
1. From the portal menu, select **Azure Active Directory**.
1. From the left navigation, select **App registrations** > **New registration**.
1. In the **Register an application** page, enter a **Name** for your app registration.
1. In **Supported account types**, select the account type that can access this application.
1. In the **Redirect URIs** section, select **Web** for platform and type `<app-url>/.auth/login/aad/callback`. For example, `https://contoso.azurewebsites.net/.auth/login/aad/callback`.
1. Select **Register**.
1. After the app registration is created, copy the **Application (client) ID** and the **Directory (tenant) ID** for later.
1. Under **Implicit grant and hybrid flows**, enable **ID tokens** to allow OpenID Connect user sign-ins from App Service. Select **Save**.
1. (Optional) From the left navigation, select **Branding & properties**. In **Home page URL**, enter the URL of your App Service app and select **Save**.
1. From the left navigation, select **Expose an API** > **Set** > **Save**. This value uniquely identifies the application when it is used as a resource, allowing tokens to be requested that grant access. It is used as a prefix for scopes you create.

    For a single-tenant app, you can use the default value, which is in the form `api://<application-client-id>`. You can also specify a more readable URI like `https://contoso.com/api` based on one of the verified domains for your tenant. For a multi-tenant app, you must provide a custom URI. To learn more about accepted formats for App ID URIs, see the [app registrations best practices reference](../active-directory/develop/security-best-practices-for-app-registration.md#application-id-uri).

1. Select **Add a scope**.
   1. In **Scope name**, enter *user_impersonation*.
   1. In **Who can consent**, select **Admins and users** if you want to allow users to consent to this scope.
   1. In the text boxes, enter the consent scope name and description you want users to see on the consent page. For example, enter *Access &lt;application-name&gt;*.
   1. Select **Add scope**.
1. (Optional) To create a client secret:
    1. From the left navigation, select **Certificates & secrets** > **Client secrets** > **New client secret**. 
    1. Enter a description and expiration and select **Add**. 
    1. In the **Value** field, copy the client secret value. It won't be shown again once you navigate away from this page.
1. (Optional) To add multiple **Reply URLs**, select **Authentication**.

#### <a name="secrets"> </a>Step 2: Enable Azure Active Directory in your App Service app

1. Sign in to the [Azure portal] and navigate to your app.
1. From the left navigation, select **Authentication** > **Add identity provider** > **Microsoft**.
1. For **App registration type**, choose one of the following:
    - **Pick an existing app registration in this directory**: Choose an app registration from the current tenant and automatically gather the necessary app information. 
    - **Provide the details of an existing app registration**: Specify details for an app registration from another tenant or if your account does not have permission in the current tenant to query the registrations. For this option, you will need to fill in the following configuration details:

        |Field|Description|
        |-|-|
        |Application (client) ID| Use the **Application (client) ID** of the app registration. |
        |Client Secret| Use the client secret you generated in the app registration. With a client secret, hybrid flow is used and the App Service will return access and refresh tokens. When the client secret is not set, implicit flow is used and only an ID token is returned. These tokens are sent by the provider and stored in the EasyAuth token store.|
        |Issuer Url| Use `<authentication-endpoint>/<tenant-id>/v2.0`, and replace *\<authentication-endpoint>* with the [authentication endpoint for your cloud environment](../active-directory/develop/authentication-national-cloud.md#azure-ad-authentication-endpoints) (e.g., "https://login.microsoftonline.com" for global Azure), also replacing *\<tenant-id>* with the **Directory (tenant) ID** in which the app registration was created. This value is used to redirect users to the correct Azure AD tenant, as well as to download the appropriate metadata to determine the appropriate token signing keys and token issuer claim value for example. For applications that use Azure AD v1, omit `/v2.0` in the URL.|
        |Allowed Token Audiences| The configured **Application (client) ID** is *always* implicitly considered to be an allowed audience. If this is a cloud or server app and you want to accept authentication tokens from a client App Service app (the authentication token can be retrieved in the [X-MS-TOKEN-AAD-ID-TOKEN](configure-authentication-oauth-tokens.md#retrieve-tokens-in-app-code)) header, add the **Application (client) ID** of the client app here. |
    
        The client secret will be stored as a slot-sticky [application setting] named `MICROSOFT_PROVIDER_AUTHENTICATION_SECRET`. You can update that setting later to use [Key Vault references](./app-service-key-vault-references.md) if you wish to manage the secret in Azure Key Vault.
    
1. If this is the first identity provider configured for the application, you will also be prompted with an **App Service authentication settings** section. Otherwise, you may move on to the next step.
    
    These options determine how your application responds to unauthenticated requests, and the default selections will redirect all requests to log in with this new provider. You can change customize this behavior now or adjust these settings later from the main **Authentication** screen by choosing **Edit** next to **Authentication settings**. To learn more about these options, see [Authentication flow](overview-authentication-authorization.md#authentication-flow).

1. Click **Add**.

You're now ready to use the Microsoft identity platform for authentication in your app. The provider will be listed on the **Authentication** screen. From there, you can edit or delete this provider configuration.

## Authorize requests

By default, App Service Authentication only handles authentication, determining if the caller is who they say they are. Authorization, determining if that caller should have access to some resource, is an additional step beyond authentication. You can learn more about these concepts from [Microsoft identity platform authorization basics](../active-directory/develop/authorization-basics.md).

Your app can [make authorization decisions in code](#perform-validations-from-application-code). App Service Authentication does provide some [built-in checks](#use-a-built-in-authorization-policy) which can help, but they may not alone be sufficient to cover the authorization needs of your app.

> [!TIP]
> Multi-tenant applications should validate the issuer and tenant ID of the request as part of this process to make sure the values are allowed. When App Service Authentication is configured for a multi-tenant scenario, it does not validate which tenant the request comes from. An app may need to be limited to specific tenants, based on if the organization has signed up for the service, for example. See the [Microsoft identity platform multi-tenant guidance](../active-directory/develop/howto-convert-app-to-be-multi-tenant.md#update-your-code-to-handle-multiple-issuer-values).

### Perform validations from application code

When you perform authorization checks in your app code, you can leverage the [claims information that App Service Authentication makes available](./configure-authentication-user-identities.md#access-user-claims-in-app-code). The injected `x-ms-client-principal` header contains a Base64-encoded JSON object with the claims asserted about the caller. By default, these claims go through a claims mapping, so the claim names may not always match what you would see in the token. For example, the `tid` claim is mapped to `http://schemas.microsoft.com/identity/claims/tenantid` instead.

You can also work directly with the underlying access token from the injected `x-ms-token-aad-access-token` header.

### Use a built-in authorization policy

The created app registration authenticates incoming requests for your Azure AD tenant. By default, it also lets anyone within the tenant to access the application, which is fine for many applications. However, some applications need to restrict access further by making authorization decisions. Your application code is often the best place to handle custom authorization logic. However, for common scenarios, the Microsoft identity platform provides built-in checks that you can use to limit access.

This section shows how to enable built-in checks using the [App Service authentication V2 API](./configure-authentication-api-version.md). Currently, the only way to configure these built-in checks is via [Azure Resource Manager templates](/azure/templates/microsoft.web/sites/config-authsettingsv2) or the [REST API](/rest/api/appservice/web-apps/update-auth-settings-v2).

Within the API object, the Azure Active Directory identity provider configuration has a `validation` section that can include a `defaultAuthorizationPolicy` object as in the following structure:

```json
{
    "validation": {
        "defaultAuthorizationPolicy": {
            "allowedApplications": [],
            "allowedPrincipals": {
                "identities": []
            }
        }
    }
}
```

| Property                                 | Description |
|------------------------------------------|-------------|
| `defaultAuthorizationPolicy`             | A grouping of requirements that must be met in order to access the app. Access is granted based on a logical `AND` over each of its configured properties. When `allowedApplications` and `allowedPrincipals` are both configured, the incoming request must satisfy both requirements in order to be accepted. |
| `allowedApplications`                    | An allowlist of string application **client IDs** representing the client resource that is calling into the app. When this property is configured as a nonempty array, only tokens obtained by an application specified in the list will be accepted.<br/><br/>This policy evaluates the `appid` or `azp` claim of the incoming token, which must be an access token. See the [Microsoft Identity Platform claims reference]. |
| `allowedPrincipals`                      | A grouping of checks that determine if the principal represented by the incoming request may access the app. Satisfaction of `allowedPrincipals` is based on a logical `OR` over its configured properties. |
| `identities` (under `allowedPrincipals`) | An allowlist of string **object IDs** representing users or applications that have access. When this property is configured as a nonempty array, the `allowedPrincipals` requirement can be satisfied if the user or application represented by the request is specified in the list.<br/><br/>This policy evaluates the `oid` claim of the incoming token. See the [Microsoft Identity Platform claims reference]. |

Additionally, some checks can be configured through an [application setting], regardless of the API version being used. The `WEBSITE_AUTH_AAD_ALLOWED_TENANTS` application setting can be configured with a comma-separated list of up to 10 tenant IDs (e.g., "559a2f9c-c6f2-4d31-b8d6-5ad1a13f8330,5693f64a-3ad5-4be7-b846-e9d1141bcebc") to require that the incoming token is from one of the specified tenants, as specified by the `tid` claim. The `WEBSITE_AUTH_AAD_REQUIRE_CLIENT_SERVICE_PRINCIPAL` application setting can be configured to "true" or "1" to require the incoming token to include an `oid` claim. This setting is ignored and treated as true if `allowedPrincipals.identities` has been configured (since the `oid` claim is checked against this provided list of identities).

Requests that fail these built-in checks are given an HTTP `403 Forbidden` response.

[Microsoft Identity Platform claims reference]: ../active-directory/develop/access-tokens.md#payload-claims

## Configure client apps to access your App Service

In the prior sections, you registered your App Service or Azure Function to authenticate users. This section explains how to register native clients or daemon apps in Azure AD so that they can request access to APIs exposed by your App Service on behalf of users or themselves, such as in an N-tier architecture. Completing the steps in this section is not required if you only wish to authenticate users.

### Native client application

You can register native clients to request access your App Service app's APIs on behalf of a signed in user.

1. From the portal menu, select **Azure Active Directory**.
1. From the left navigation, select **App registrations** > **New registration**.
1. In the **Register an application** page, enter a **Name** for your app registration.
1. In **Redirect URI**, select **Public client (mobile & desktop)** and type the URL `<app-url>/.auth/login/aad/callback`. For example, `https://contoso.azurewebsites.net/.auth/login/aad/callback`.
1. Select **Register**.
1. After the app registration is created, copy the value of **Application (client) ID**.

    > [!NOTE]
    > For a Microsoft Store application, use the [package SID](/previous-versions/azure/app-service-mobile/app-service-mobile-dotnet-how-to-use-client-library#package-sid) as the URI instead.
1. From the left navigation, select **API permissions** > **Add a permission** > **My APIs**.
1. Select the app registration you created earlier for your App Service app. If you don't see the app registration, make sure that you've added the **user_impersonation** scope in [Create an app registration in Azure AD for your App Service app](#register).
1. Under **Delegated permissions**, select **user_impersonation**, and then select **Add permissions**.

You have now configured a native client application that can request access your App Service app on behalf of a user.

### Daemon client application (service-to-service calls)

In an N-tier architecture, your client application can acquire a token to call an App Service or Function app on behalf of the client app itself (not on behalf of a user). This scenario is useful for non-interactive daemon applications that perform tasks without a logged in user. It uses the standard OAuth 2.0 [client credentials](../active-directory/develop/v2-oauth2-client-creds-grant-flow.md) grant.

1. From the portal menu, select **Azure Active Directory**.
1. From the left navigation, select **App registrations** > **New registration**.
1. In the **Register an application** page, enter a **Name** for your app registration.
1. For a daemon application, you don't need a Redirect URI so you can keep that empty.
1. Select **Register**.
1. After the app registration is created, copy the value of **Application (client) ID**.
1. From the left navigation, select **Certificates & secrets** > **Client secrets** > **New client secret**.
1. Enter a description and expiration and select **Add**. 
1. In the **Value** field, copy the client secret value. It won't be shown again once you navigate away from this page.

You can now [request an access token using the client ID and client secret](../active-directory/develop/v2-oauth2-client-creds-grant-flow.md#first-case-access-token-request-with-a-shared-secret) by setting the `resource` parameter to the **Application ID URI** of the target app. The resulting access token can then be presented to the target app using the standard [OAuth 2.0 Authorization header](../active-directory/develop/v2-oauth2-client-creds-grant-flow.md#use-a-token), and App Service authentication will validate and use the token as usual to now indicate that the caller (an application in this case, not a user) is authenticated.

At present, this allows _any_ client application in your Azure AD tenant to request an access token and authenticate to the target app. If you also want to enforce _authorization_ to allow only certain client applications, you must perform some additional configuration.

1. [Define an App Role](../active-directory/develop/howto-add-app-roles-in-azure-ad-apps.md) in the manifest of the app registration representing the App Service or Function app you want to protect.
1. On the app registration representing the client that needs to be authorized, select **API permissions** > **Add a permission** > **My APIs**.
1. Select the app registration you created earlier. If you don't see the app registration, make sure that you've [added an App Role](../active-directory/develop/howto-add-app-roles-in-azure-ad-apps.md).
1. Under **Application permissions**, select the App Role you created earlier, and then select **Add permissions**.
1. Make sure to click **Grant admin consent** to authorize the client application to request the permission.
1. Similar to the previous scenario (before any roles were added), you can now [request an access token](../active-directory/develop/v2-oauth2-client-creds-grant-flow.md#first-case-access-token-request-with-a-shared-secret) for the same target `resource`, and the access token will include a `roles` claim containing the App Roles that were authorized for the client application.
1. Within the target App Service or Function app code, you can now validate that the expected roles are present in the token (this is not performed by App Service authentication). For more information, see [Access user claims](configure-authentication-user-identities.md#access-user-claims-in-app-code).

You have now configured a daemon client application that can access your App Service app using its own identity.

## Best practices

Regardless of the configuration you use to set up authentication, the following best practices will keep your tenant and applications more secure:

- Configure each App Service app with its own app registration in Azure AD.
- Give each App Service app its own permissions and consent.
- Avoid permission sharing between environments by using separate app registrations for separate deployment slots. When testing new code, this practice can help prevent issues from affecting the production app.

## <a name="related-content"> </a>Next steps

[!INCLUDE [app-service-mobile-related-content-get-started-users](../../includes/app-service-mobile-related-content-get-started-users.md)]
* [Tutorial: Authenticate and authorize users in a web app that accesses Azure Storage and Microsoft Graph](scenario-secure-app-authentication-app-service.md)
* [Tutorial: Authenticate and authorize users end-to-end in Azure App Service](tutorial-auth-aad.md)
<!-- URLs. -->

[Azure portal]: https://portal.azure.com/
[application setting]: ./configure-common.md#configure-app-settings
