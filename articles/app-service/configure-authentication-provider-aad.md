---
title: Configure Microsoft Entra authentication
description: Learn how to configure Microsoft Entra authentication as an identity provider for your App Service or Azure Functions app.
ms.assetid: 6ec6a46c-bce4-47aa-b8a3-e133baef22eb
ms.topic: article
ms.date: 05/16/2023
ms.custom: fasttrack-edit, AppServiceIdentity
author: cephalin
ms.author: cephalin
---

# Configure your App Service or Azure Functions app to use Microsoft Entra sign-in

[!INCLUDE [regionalization-note](./includes/regionalization-note.md)]

Select another authentication provider to jump to it.

[!INCLUDE [app-service-mobile-selector-authentication](../../includes/app-service-mobile-selector-authentication.md)]

This article shows you how to configure authentication for Azure App Service or Azure Functions so that your app signs in users with the [Microsoft identity platform](../active-directory/develop/v2-overview.md) (Microsoft Entra) as the authentication provider.

## Choose a tenant for your application and its users

Before your application can sign in users, you first need to register it in a workforce or external tenant.  If you're making your app available to employee or business guests, register your app in a workforce tenant. If your app is for consumers and business customers, register it in an external tenant. 

1. Sign in to the [Azure portal] and navigate to your app.
    
1. On your app's left menu, select **Authentication**, and then select **Add identity provider**.

1. In the **Add an identity provider** page, select **Microsoft** as the **Identity provider** to sign in Microsoft and Microsoft Entra identities.

1. For **Tenant type**, select **Workforce configuration (current tenant)** for employees and business guests or select **External configuration** for consumers and business customers.

## Choose the app registration

The App Service Authentication feature can automatically create an app registration for you or you can use a registration that you or a directory admin created separately. 

Create a new app registration automatically, unless you need to create an app registration separately. You can customize the app registration in the [Microsoft Entra admin center](https://entra.microsoft.com) later if you want.

The following situations are the most common cases to use an existing app registration:

- Your account doesn't have permissions to create app registrations in your Microsoft Entra tenant.
- You want to use an app registration from a different Microsoft Entra tenant than the one your app is in.
- The option to create a new registration isn't available for government clouds.

# [Workforce configuration](#tab/workforce-configuration)

[Create and use a new app registration](#express) or [use an existing registration created separately](#advanced).

### <a name="express"></a> Option 1: Create and use a new app registration

Use this option unless you need to create an app registration separately. You can customize the app registration in Microsoft Entra once it's created. 

> [!NOTE]
> The option to create a new registration automatically isn't available for government clouds. Instead, [define a registration separately](#advanced).

Enter the **Name** for the new app registration.

Select the **Supported account type**:

- **Current tenant - Single tenant**. Accounts in this organizational directory only. All user and guest accounts in your directory can use your application or API. Use this option if your target audience is internal to your organization.
- **Any Microsoft Entra directory - Multitenant**. Accounts in any organizational directory. All users with a work or school account from Microsoft can use your application or API. This includes schools and businesses that use Office 365. Use this option if your target audience is business or educational customers and to enable multitenancy.
- **Any Microsoft Entra directory & personal Microsoft accounts**. Accounts in any organizational directory and personal Microsoft accounts (for example, Skype, Xbox). All users with a work or school, or personal Microsoft account can use your application or API. It includes schools and businesses that use Office 365 as well as personal accounts that are used to sign in to services like Xbox and Skype. Use this option to target the widest set of Microsoft identities and to enable multitenancy.
- **Personal Microsoft accounts only**. Personal accounts that are used to sign in to services like Xbox and Skype. Use this option to target the widest set of Microsoft identities.

You can change the name of the registration or the supported account types later if you want.

A client secret is created as a slot-sticky [application setting] named `MICROSOFT_PROVIDER_AUTHENTICATION_SECRET`. You can update that setting later to use [Key Vault references](./app-service-key-vault-references.md) if you wish to manage the secret in Azure Key Vault.  

### <a name="advanced"> </a>Option 2: Use an existing registration created separately

Either:
- Select **Pick an existing app registration in this directory** and select an app registration from the drop-down.
- Select **Provide the details of an existing app registration** and provide:
    - Application (client) ID.
    - Client secret (recommended). A secret value that the application uses to prove its identity when requesting a token. This value is saved in your app's configuration as a slot-sticky application setting named `MICROSOFT_PROVIDER_AUTHENTICATION_SECRET`. If the client secret isn't set, sign-in operations from the service use the OAuth 2.0 implicit grant flow, which isn't* recommended.
    - Issuer URL, which takes the form `<authentication-endpoint>/<tenant-id>/v2.0`. Replace `<authentication-endpoint>` with the authentication endpoint [value specific to the cloud environment](/entra/identity-platform/authentication-national-cloud#azure-ad-authentication-endpoints).  For example, a workforce tenant in global Azure would use "https://login.microsoftonline.com" as its authentication endpoint.

If you need to manually create an app registration in a workforce tenant, follow the [register an application](/entra/identity-platform/quickstart-register-app) quickstart.  As you go through the registration process, be sure to note the application (client) ID and client secret values.

During the registration process, in the **Redirect URIs** section, select **Web** for platform and type `<app-url>/.auth/login/aad/callback`. For example, `https://contoso.azurewebsites.net/.auth/login/aad/callback`.

After creation, modify the app registration:

1. From the left navigation, select **Expose an API** > **Add** > **Save**. This value uniquely identifies the application when it's used as a resource, allowing tokens to be requested that grant access. It's used as a prefix for scopes you create.

    For a single-tenant app, you can use the default value, which is in the form `api://<application-client-id>`. You can also specify a more readable URI like `https://contoso.com/api` based on one of the verified domains for your tenant. For a multitenant app, you must provide a custom URI. To learn more about accepted formats for App ID URIs, see the [app registrations best practices reference](../active-directory/develop/security-best-practices-for-app-registration.md#application-id-uri).

1. Select **Add a scope**.
   1. In **Scope name**, enter *user_impersonation*.
   1. In **Who can consent**, select **Admins and users** if you want to allow users to consent to this scope.
   1. In the text boxes, enter the consent scope name and description you want users to see on the consent page. For example, enter *Access &lt;application-name&gt;*.
   1. Select **Add scope**.
1. (Recommended) To create a client secret:
    1. From the left navigation, select **Certificates & secrets** > **Client secrets** > **New client secret**. 
    1. Enter a description and expiration and select **Add**. 
    1. In the **Value** field, copy the client secret value. It won't be shown again once you navigate away from this page.
1. (Optional) To add multiple **Reply URLs**, select **Authentication**.

# [External configuration](#tab/external-configuration)

[Create and use a new app registration](#express_external) or [use an existing registration created separately](#advanced_external).

### <a name="express_external"></a> Option 1: Create and use a new app registration

Use this option unless you need to create an app registration separately. You can customize the app registration in Microsoft Entra once it's created. 

Select **Create new app registration** to create a new app registration.

1. Select an existing tenant to use from the drop-down, or select **Create new** to create a new [external tenant](/entra/external-id/customers/quickstart-tenant-setup).

#### To create a new external tenant (optional)

In the **Create a tenant** page, add the **Tenant Name** and **Domain Name**.  Select a **Location** and select **Review and create** and then select **Create**.  The tenant creation process takes a few minutes.

#### To setup sign-in

1. Select **Configure** to **configure external authentication** for the new tenant.

1. The browser opens **Configure customer authentication**.  

1. Select a user flow from the drop-down or select **Create new**.  The user flow defines the sign-in methods your external users can use. Each app can only have one user flow, but you can reuse the same user flow for multiple apps.

#### To create a new user flow

1. Enter a **Name** for the user flow.

1. Select the sign-in method for your external users.  **Email and password** and **Email and one-time passcode** are already configured in the new tenant.  You can [Configure Google](/entra/external-id/customers/how-to-google-federation-customers) or [Configure Facebook](/entra/external-id/customers/how-to-facebook-federation-customers) as identity providers as well.

1. Select **Create** to create the user flow.

#### To customize branding

1. Select **Next** to customize branding.

1. Add your logo, select a background color, and select a sign-in layout.

1. Select **Next** and **Yes, update the changes** to accept the branding changes.

1. Select **Configure** in the **Review** tab to confirm external tenant update. 

1. The browser opens to the **Add an identity provider** page again.

### <a name="advanced_external"> </a>Option 2: Use an existing registration created separately

Select **Provide the details of an existing app registration** and provide:
    - Application (client) ID
    - Client secret
    - Issuer URL

If you need to manually create an app registration in an external tenant, follow the [register an application](/entra/external-id/customers/how-to-register-ciam-app?tabs=webapp#register-your-web-app) quickstart.

During the registration process, in the **Redirect URIs** section, select **Web** for platform and type `<app-url>/.auth/login/aad/callback`. For example, `https://contoso.azurewebsites.net/.auth/login/aad/callback`.

After creation, modify the app registration:

1. From the left navigation, select **Expose an API** > **Add** > **Save**. This value uniquely identifies the application when it's used as a resource, allowing tokens to be requested that grant access. It's used as a prefix for scopes you create.

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
---

## Configure additional checks

Configure **Additional checks**, which determines which requests are allowed to access your application.  You can customize this behavior now or adjust these settings later from the main **Authentication** screen by choosing **Edit** next to **Authentication settings**.

For **Client application requirement**, choose whether to:
- Allow requests only from this application itself
- Allow requests from specific client applications
- Allow requests from any application (Not recommended)

For **Identity requirement**, choose whether to:
- Allow requests from any identity
- Allow requests from specific identities

For **Tenant requirement**, choose whether to:
- Allow requests only from the issuer tenant
- Allow requests from specific tenants
- Use default restrictions based on issuer

Your app may still need to make additional authorization decisions in code. For more information, see [Use a built-in authorization policy](#use-a-built-in-authorization-policy).

## Configure authentication settings

These options determine how your application responds to unauthenticated requests, and the default selections will redirect all requests to sign in with this new provider. You can change customize this behavior now or adjust these settings later from the main **Authentication** screen by choosing **Edit** next to **Authentication settings**. To learn more about these options, see [Authentication flow](/azure/app-service/overview-authentication-authorization#authentication-flow).

For **Restrict access**, decide whether to:
- Require authentication
- Allow unauthenticated access

For **Unauthenticated requests**
- HTTP 302 Found redirect: recommended for websites
- HTTP 401 Unauthorized: recommended for APIs
- HTTP 403 Forbidden
- HTTP 404 Not found

Select **Token store** (recommended).  The token store collects, stores, and refreshes tokens for your application. You can disable this later if your app doesn't need tokens or you need to optimize performance.

## Add the identity provider

If you selected workforce configuration, you can select **Next: Permissions** and add any Microsoft Graph permissions needed by the application. These will be added to the app registration, but you can also change them later.  If you selected external configuration, you can add Microsoft Graph permissions later.

Select **Add**.

You're now ready to use the Microsoft identity platform for authentication in your app. The provider will be listed on the **Authentication** screen. From there, you can edit or delete this provider configuration.

For an example of configuring Microsoft Entra sign-in for a web app that accesses Azure Storage and Microsoft Graph, see [this tutorial](scenario-secure-app-authentication-app-service.md).

## Authorize requests

By default, App Service Authentication only handles authentication, determining if the caller is who they say they are. Authorization, determining if that caller should have access to some resource, is an extra step beyond authentication. You can learn more about these concepts from [Microsoft identity platform authorization basics](../active-directory/develop/authorization-basics.md).

Your app can [make authorization decisions in code](#perform-validations-from-application-code). App Service Authentication does provide some [built-in checks](#use-a-built-in-authorization-policy), which can help, but they may not alone be sufficient to cover the authorization needs of your app.

> [!TIP]
> Multi-tenant applications should validate the issuer and tenant ID of the request as part of this process to make sure the values are allowed. When App Service Authentication is configured for a multi-tenant scenario, it doesn't validate which tenant the request comes from. An app may need to be limited to specific tenants, based on if the organization has signed up for the service, for example. See the [Microsoft identity platform multi-tenant guidance](../active-directory/develop/howto-convert-app-to-be-multi-tenant.md#update-your-code-to-handle-multiple-issuer-values).

### Perform validations from application code

When you perform authorization checks in your app code, you can use the [claims information that App Service Authentication makes available](./configure-authentication-user-identities.md#access-user-claims-in-app-code). The injected `x-ms-client-principal` header contains a Base64-encoded JSON object with the claims asserted about the caller. By default, these claims go through a claims mapping, so the claim names may not always match what you would see in the token. For example, the `tid` claim is mapped to `http://schemas.microsoft.com/identity/claims/tenantid` instead.

You can also work directly with the underlying access token from the injected `x-ms-token-aad-access-token` header.

### Use a built-in authorization policy

The created app registration authenticates incoming requests for your Microsoft Entra tenant. By default, it also lets anyone within the tenant to access the application, which is fine for many applications. However, some applications need to restrict access further by making authorization decisions. Your application code is often the best place to handle custom authorization logic. However, for common scenarios, the Microsoft identity platform provides built-in checks that you can use to limit access.

This section shows how to enable built-in checks using the [App Service authentication V2 API](./configure-authentication-api-version.md). Currently, the only way to configure these built-in checks is via [Azure Resource Manager templates](/azure/templates/microsoft.web/sites/config-authsettingsv2) or the [REST API](/rest/api/appservice/web-apps/update-auth-settings-v2).

Within the API object, the Microsoft Entra identity provider configuration has a `validation` section that can include a `defaultAuthorizationPolicy` object as in the following structure:

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
| `allowedApplications`                    | An allowlist of string application **client IDs** representing the client resource that is calling into the app. When this property is configured as a nonempty array, only tokens obtained by an application specified in the list will be accepted.<br/><br/>This policy evaluates the `appid` or `azp` claim of the incoming token, which must be an access token. See the [Microsoft identity platform claims reference]. |
| `allowedPrincipals`                      | A grouping of checks that determine if the principal represented by the incoming request may access the app. Satisfaction of `allowedPrincipals` is based on a logical `OR` over its configured properties. |
| `identities` (under `allowedPrincipals`) | An allowlist of string **object IDs** representing users or applications that have access. When this property is configured as a nonempty array, the `allowedPrincipals` requirement can be satisfied if the user or application represented by the request is specified in the list. There's a limit of 500 characters total across the list of identities.<br/><br/>This policy evaluates the `oid` claim of the incoming token. See the [Microsoft identity platform claims reference]. |

Additionally, some checks can be configured through an [application setting], regardless of the API version being used. The `WEBSITE_AUTH_AAD_ALLOWED_TENANTS` application setting can be configured with a comma-separated list of up to 10 tenant IDs (for example, "559a2f9c-c6f2-4d31-b8d6-5ad1a13f8330,5693f64a-3ad5-4be7-b846-e9d1141bcebc") to require that the incoming token is from one of the specified tenants, as specified by the `tid` claim. The `WEBSITE_AUTH_AAD_REQUIRE_CLIENT_SERVICE_PRINCIPAL` application setting can be configured to "true" or "1" to require the incoming token to include an `oid` claim. This setting is ignored and treated as true if `allowedPrincipals.identities` has been configured (since the `oid` claim is checked against this provided list of identities).

Requests that fail these built-in checks are given an HTTP `403 Forbidden` response.

[Microsoft Identity Platform claims reference]: ../active-directory/develop/access-token-claims-reference.md#payload-claims

## Configure client apps to access your App Service

In the prior sections, you registered your App Service or Azure Function to authenticate users. This section explains how to register native clients or daemon apps in Microsoft Entra so that they can request access to APIs exposed by your App Service on behalf of users or themselves, such as in an N-tier architecture. Completing the steps in this section isn't required if you only wish to authenticate users.

### Native client application

You can register native clients to request access your App Service app's APIs on behalf of a signed in user.

1. From the portal menu, select **Microsoft Entra**.
1. From the left navigation, select **App registrations** > **New registration**.
1. In the **Register an application** page, enter a **Name** for your app registration.
1. In **Redirect URI**, select **Public client (mobile & desktop)** and type the URL `<app-url>/.auth/login/aad/callback`. For example, `https://contoso.azurewebsites.net/.auth/login/aad/callback`.
1. Select **Register**.
1. After the app registration is created, copy the value of **Application (client) ID**.

    > [!NOTE]
    > For a Microsoft Store application, use the [package SID](/previous-versions/azure/app-service-mobile/app-service-mobile-dotnet-how-to-use-client-library#package-sid) as the URI instead.
1. From the left navigation, select **API permissions** > **Add a permission** > **My APIs**.
1. Select the app registration you created earlier for your App Service app. If you don't see the app registration, make sure that you've added the **user_impersonation** scope in the app registration.
1. Under **Delegated permissions**, select **user_impersonation**, and then select **Add permissions**.

You have now configured a native client application that can request access your App Service app on behalf of a user.

### Daemon client application (service-to-service calls)

In an N-tier architecture, your client application can acquire a token to call an App Service or Function app on behalf of the client app itself (not on behalf of a user). This scenario is useful for non-interactive daemon applications that perform tasks without a logged in user. It uses the standard OAuth 2.0 [client credentials](../active-directory/develop/v2-oauth2-client-creds-grant-flow.md) grant.

1. From the portal menu, select **Microsoft Entra**.
1. From the left navigation, select **App registrations** > **New registration**.
1. In the **Register an application** page, enter a **Name** for your app registration.
1. For a daemon application, you don't need a Redirect URI so you can keep that empty.
1. Select **Register**.
1. After the app registration is created, copy the value of **Application (client) ID**.
1. From the left navigation, select **Certificates & secrets** > **Client secrets** > **New client secret**.
1. Enter a description and expiration and select **Add**. 
1. In the **Value** field, copy the client secret value. It won't be shown again once you navigate away from this page.

You can now [request an access token using the client ID and client secret](../active-directory/develop/v2-oauth2-client-creds-grant-flow.md#first-case-access-token-request-with-a-shared-secret) by setting the `resource` parameter to the **Application ID URI** of the target app. The resulting access token can then be presented to the target app using the standard [OAuth 2.0 Authorization header](../active-directory/develop/v2-oauth2-client-creds-grant-flow.md#use-a-token), and App Service authentication will validate and use the token as usual to now indicate that the caller (an application in this case, not a user) is authenticated.

At present, this allows _any_ client application in your Microsoft Entra tenant to request an access token and authenticate to the target app. If you also want to enforce _authorization_ to allow only certain client applications, you must perform some extra configuration.

1. [Define an App Role](../active-directory/develop/howto-add-app-roles-in-azure-ad-apps.md) in the manifest of the app registration representing the App Service or Function app you want to protect.
1. On the app registration representing the client that needs to be authorized, select **API permissions** > **Add a permission** > **My APIs**.
1. Select the app registration you created earlier. If you don't see the app registration, make sure that you've [added an App Role](../active-directory/develop/howto-add-app-roles-in-azure-ad-apps.md).
1. Under **Application permissions**, select the App Role you created earlier, and then select **Add permissions**.
1. Make sure to select **Grant admin consent** to authorize the client application to request the permission.
1. Similar to the previous scenario (before any roles were added), you can now [request an access token](../active-directory/develop/v2-oauth2-client-creds-grant-flow.md#first-case-access-token-request-with-a-shared-secret) for the same target `resource`, and the access token will include a `roles` claim containing the App Roles that were authorized for the client application.
1. Within the target App Service or Function app code, you can now validate that the expected roles are present in the token (this isn't performed by App Service authentication). For more information, see [Access user claims](configure-authentication-user-identities.md#access-user-claims-in-app-code).

You have now configured a daemon client application that can access your App Service app using its own identity.

## Best practices

Regardless of the configuration you use to set up authentication, the following best practices keep your tenant and applications more secure:

- Configure each App Service app with its own app registration in Microsoft Entra.
- Give each App Service app its own permissions and consent.
- Avoid permission sharing between environments by using separate app registrations for separate deployment slots. When you're testing new code, this practice can help prevent issues from affecting the production app.

### Migrate to the Microsoft Graph

Some older apps may also have been set up with a dependency on the [deprecated Azure AD Graph][aad-graph], which is scheduled for full retirement. For example, your app code may have called Azure AD Graph to check group membership as part of an authorization filter in a middleware pipeline. Apps should move to the [Microsoft Graph](/graph/overview) by following the [guidance provided by Microsoft Entra as part of the Azure AD Graph deprecation process][aad-graph]. In following those instructions, you may need to make some changes to your configuration of App Service authentication. Once you have added Microsoft Graph permissions to your app registration, you can:

1. Update the **Issuer URL** to include the "/v2.0" suffix if it doesn't already. 
1. Remove requests for Azure AD Graph permissions from your sign-in configuration. The properties to change depend on [which version of the management API you're using](./configure-authentication-api-version.md):
    - If you're using the V1 API (`/authsettings`), this would be in the `additionalLoginParams` array. 
    - If you're using the V2 API (`/authsettingsV2`), this would be in the `loginParameters` array.
    
    You would need to remove any reference to "https://graph.windows.net", for example. This includes the `resource` parameter (which isn't supported by the "/v2.0" endpoint) or any scopes you're specifically requesting that are from the Azure AD Graph.

    You would also need to update the configuration to request the new Microsoft Graph permissions you set up for the application registration. You can use the [.default scope](../active-directory/develop/scopes-oidc.md#the-default-scope) to simplify this setup in many cases. To do so, add a new sign-in parameter `scope=openid profile email https://graph.microsoft.com/.default`.

With these changes, when App Service Authentication attempts to sign in, it will no longer request permissions to the Azure AD Graph, and instead it will get a token for the Microsoft Graph. Any use of that token from your application code would also need to be updated, as per the [guidance provided by Microsoft Entra][aad-graph].

[aad-graph]: /graph/migrate-azure-ad-graph-overview

## <a name="related-content"> </a>Next steps

[!INCLUDE [app-service-mobile-related-content-get-started-users](../../includes/app-service-mobile-related-content-get-started-users.md)]
* [Tutorial: Authenticate and authorize users in a web app that accesses Azure Storage and Microsoft Graph](scenario-secure-app-authentication-app-service.md)
* [Tutorial: Authenticate and authorize users end-to-end in Azure App Service](tutorial-auth-aad.md)
<!-- URLs. -->

[Azure portal]: https://portal.azure.com/
[application setting]: ./configure-common.md#configure-app-settings
[Azure Active Directory for customers (Preview)]: ../active-directory/external-identities/customers/overview-customers-ciam.md
[Switch your directory]: ../azure-portal/set-preferences.md#switch-and-manage-directories
[Create a sign-up and sign-in user flow]: ../active-directory/external-identities/customers/how-to-user-flow-sign-up-sign-in-customers.md
[Add your application to the user flow]: ../active-directory/external-identities/customers/how-to-user-flow-add-application.md
