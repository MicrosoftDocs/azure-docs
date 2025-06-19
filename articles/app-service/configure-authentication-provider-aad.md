---
title: Configure Microsoft Entra Authentication
description: Learn how to configure Microsoft Entra authentication as an identity provider for your App Service or Azure Functions app.
ms.assetid: 6ec6a46c-bce4-47aa-b8a3-e133baef22eb
ms.topic: how-to
ms.date: 03/28/2025
ms.custom: fasttrack-edit, AppServiceIdentity
author: cephalin
ms.author: cephalin
#customer intent: As an app deployment engineer, I want configure Microsoft Entra authentication for my apps in App Service and understand how to migrate older apps to Microsoft Graph.
---

# Configure your App Service or Azure Functions app to use Microsoft Entra sign-in

Select another authentication provider to jump to it.

[!INCLUDE [app-service-mobile-selector-authentication](../../includes/app-service-mobile-selector-authentication.md)]

This article shows you how to configure authentication for Azure App Service or Azure Functions so that your app signs in users with the [Microsoft identity platform](../active-directory/develop/v2-overview.md) (Microsoft Entra) as the authentication provider.

## Choose a tenant for your application and its users

Before your application can sign in users, you need to register it in a workforce tenant or an external tenant. If you're making your app available to employee or business guests, register your app in a workforce tenant. If your app is for consumers and business customers, register it in an external tenant.

1. Sign in to the [Azure portal] and go to your app.

1. On your app's left menu, select **Settings** > **Authentication**, and then select **Add identity provider**.

1. On the **Add an identity provider** page, select **Microsoft** as the **Identity provider** value to sign in Microsoft and Microsoft Entra identities.

1. Under **Choose a tenant for your application and its users**, select either:
  
   - **Workforce configuration (current tenant)** for employees and business guests
   - **External configuration** for consumers and business customers

## Choose the app registration

The App Service authentication feature can automatically create an app registration for you. Or, you can use a registration that you or a directory admin creates separately.

Create a new app registration automatically, unless you need to create an app registration separately. You can customize the app registration in the [Microsoft Entra admin center](https://entra.microsoft.com) later if you want.

The following situations are the most common cases for using an existing app registration:

- Your account doesn't have permissions to create app registrations in your Microsoft Entra tenant.
- You want to use an app registration from a different Microsoft Entra tenant than the one that contains your app. This is always the case if you selected **External configuration** when you chose a tenant.
- The option to create a new registration isn't available for government clouds.

# [Workforce configuration](#tab/workforce-configuration)

### <a name="express"></a> Option 1: Create and use a new app registration

1. Select **Create new app registration**.

1. For **Name**, enter the name of the new app registration.

1. Select the **Supported account type** value:

   - **Current tenant - Single tenant**. Accounts in this organizational directory only. All user and guest accounts in your directory can use your application or API. Use this option if your target audience is internal to your organization.
   - **Any Microsoft Entra directory - Multitenant**. Accounts in any organizational directory. All users with a work or school account from Microsoft can use your application or API. These accounts include schools and businesses that use Office 365. Use this option if your target audience is business or educational customers and to enable multitenancy.
   - **Any Microsoft Entra directory & personal Microsoft accounts**. Accounts in any organizational directory and personal Microsoft accounts (for example, Skype or Xbox). All users with a work or school account, or a personal Microsoft account, can use your application or API. It includes schools and businesses that use Office 365, along with personal accounts that are used to sign in to services like Xbox and Skype. Use this option to target the widest set of Microsoft identities and to enable multitenancy.
   - **Personal Microsoft accounts only**. Personal accounts that are used to sign in to services like Xbox and Skype. Use this option to target the widest set of Microsoft identities.

You can change the name of the registration or the supported account types later if you want.

A client secret is created as a slot-sticky [application setting] named `MICROSOFT_PROVIDER_AUTHENTICATION_SECRET`. If you want to manage the secret in Azure Key Vault, you can update that setting later to use [Key Vault references](./app-service-key-vault-references.md). Alternatively, you can change this to [use an identity instead of a client secret][fic-config]. Support for using an identity is currently in preview.

### <a name="advanced"> </a>Option 2: Use an existing registration created separately

To use an existing registration, select either:

- **Pick an existing app registration in this directory**. Then select an app registration from the dropdown list.
- **Provide the details of an existing app registration**. Then provide:

  - **Application (client) ID**.
  - **Client secret (recommended)**. A secret value that the application uses to prove its identity when it requests a token. This value is saved in your app's configuration as a slot-sticky application setting named `MICROSOFT_PROVIDER_AUTHENTICATION_SECRET`. If the client secret isn't set, sign-in operations from the service use the OAuth 2.0 implicit grant flow, which we *don't* recommend.

    You can also configure the application to [use an identity instead of a client secret][fic-config]. Support for using an identity is currently in preview.
  - **Issuer URL**. This URL takes the form `<authentication-endpoint>/<tenant-id>/v2.0`. Replace `<authentication-endpoint>` with the authentication endpoint [value that's specific to the cloud environment](/entra/identity-platform/authentication-national-cloud#azure-ad-authentication-endpoints). For example, a workforce tenant in global Azure would use `https://sts.windows.net` as its authentication endpoint.

If you need to manually create an app registration in a workforce tenant, see [Register an application with the Microsoft identity platform](/entra/identity-platform/quickstart-register-app). As you go through the registration process, be sure to note the application (client) ID and client secret values.

During the registration process, in the **Redirect URIs** section, select **Web** for platform, and enter a redirect URI. For example, enter `https://contoso.azurewebsites.net/.auth/login/aad/callback`.

Now, modify the app registration:

1. On the left pane, select **Expose an API** > **Add** > **Save**. This value uniquely identifies the application when it's used as a resource, which allows tokens that grant access to be requested. The value is a prefix for scopes that you create.

   For a single-tenant app, you can use the default value, which is in the form `api://<application-client-id>`. You can also specify a more readable URI like `https://contoso.com/api`, based on one of the verified domains for your tenant. For a multitenant app, you must provide a custom URI. For more information about accepted formats for app ID URIs, see [Security best practices for application properties in Microsoft Entra ID](../active-directory/develop/security-best-practices-for-app-registration.md#application-id-uri).

1. Select **Add a scope**, and then:

   1. In **Scope name**, enter **user_impersonation**.
   1. In **Who can consent**, select **Admins and users** if you want to allow users to consent to this scope.
   1. Enter the consent scope name. Enter a description that you want users to see on the consent page. For example, enter **Access** *application-name*.
   1. Select **Add scope**.

1. (Recommended) Create a client assertion for the app. To create a client secret:

    1. On the left pane, select **Certificates & secrets** > **Client secrets** > **New client secret**.
    1. Enter a description and expiration, and then select **Add**.
    1. In the **Value** field, copy the client secret value. After you move away from this page, it doesn't appear again.

    You can also configure the application to [use an identity instead of a client secret][fic-config]. Support for using an identity is currently in preview.

1. (Optional) To add multiple reply URLs, select **Authentication**.

# [External configuration](#tab/external-configuration)

### <a name="express_external"></a> Option 1: Create and use a new app registration

1. Select **Create new app registration**.

1. For **Select a tenant**, take one of the following actions:

   - Select an existing tenant to use.

   - Select **Create new**, and then:

      1. On the **Create a tenant** page, add the **Tenant Name** and **Domain Name** values.

      1. Select a **Location** value, and then select **Review and create** > **Create**. The tenant creation process takes a few minutes.

      For more information about creating a tenant, see [Use your Azure subscription to create an external tenant](/entra/external-id/customers/quickstart-tenant-setup).

#### Set up sign-in

1. Select **Configure** to configure external authentication for the new tenant.

1. The browser opens **Configure customer authentication**.

1. Select or create a user flow. The user flow defines the sign-in methods that your external users can use. Each app can only have one user flow, but you can reuse the same user flow for multiple apps.

   Take one of the following actions:

   - Select a user flow from the dropdown list.

   - Select **Create new**, and then:

     1. For **Name**, enter a name for the user flow.

     1. Select the sign-in method for your external users.

        **Email and password** and **Email and one-time passcode** are already configured in the new tenant. You can also add [Google](/entra/external-id/customers/how-to-google-federation-customers) or [Facebook](/entra/external-id/customers/how-to-facebook-federation-customers) as identity providers.

     1. Select **Create**.

#### Customize branding

1. Select **Next** to customize branding.

1. Add your logo, select a background color, and select a sign-in layout.

1. Select **Next**, and then select **Yes, update the changes** to accept the branding changes.

1. On the **Review** tab, select **Configure** to confirm the external tenant update.

   The browser opens to the **Add an identity provider** page.

### <a name="advanced_external"> </a>Option 2: Use an existing registration created separately

To use an existing registration, select **Provide the details of an existing app registration**. Then provide values for:

- **Application (client) ID**
- **Client secret**
- **Issuer URL**

If you need to manually create an app registration in an external tenant, see [Register an app in your external tenant](/entra/external-id/customers/how-to-register-ciam-app?tabs=webapp#register-your-web-app).

During the registration process, in the **Redirect URIs** section, select **Web** for platform, and enter a redirect URI. For example, enter `https://contoso.azurewebsites.net/.auth/login/aad/callback`.

Now, modify the app registration:

1. On the left pane, select **Expose an API** > **Add** > **Save**. This value uniquely identifies the application when it's used as a resource, which allows tokens that grant access to be requested. The value is a prefix for scopes that you create.

   For a single-tenant app, you can use the default value, which is in the form `api://<application-client-id>`. You can also specify a more readable URI like `https://contoso.com/api`, based on one of the verified domains for your tenant. For a multitenant app, you must provide a custom URI. For more information about accepted formats for app ID URIs, see [Security best practices for application properties in Microsoft Entra ID](../active-directory/develop/security-best-practices-for-app-registration.md#application-id-uri).

1. Select **Add a scope**, and then:

   1. In **Scope name**, enter **user_impersonation**.
   1. In **Who can consent**, select **Admins and users** if you want to allow users to consent to this scope.
   1. Enter the consent scope name. Then enter a description that you want users to see on the consent page. For example, enter **Access** *application-name*.
   1. Select **Add scope**.

1. (Optional) Create a client secret:

    1. On the left pane, select **Certificates & secrets** > **Client secrets** > **New client secret**.
    1. Enter a description and expiration, and then select **Add**.
    1. In the **Value** field, copy the client secret value. After you move away from this page, it doesn't appear again.

1. (Optional) To add multiple reply URLs, select **Authentication**.

---

## Configure additional checks

*Additional checks* determine which requests are allowed to access your application. You can customize this behavior now, or you can adjust these settings later from the main **Authentication** page by selecting **Edit** next to **Authentication settings**.

For **Client application requirement**, choose whether to:

- Allow requests only from this application itself.
- Allow requests from specific client applications.
- Allow requests from any application (not recommended).

For **Identity requirement**, choose whether to:

- Allow requests from any identity.
- Allow requests from specific identities.

For **Tenant requirement**, choose whether to:

- Allow requests only from the issuer tenant.
- Allow requests from specific tenants.
- Use default restrictions based on the issuer.

Your app might still need to make other authorization decisions in code. For more information, see [Use a built-in authorization policy](#use-a-built-in-authorization-policy) later in this article.

## Configure authentication settings

Authentication settings determine how your application responds to unauthenticated requests. The default selections redirect all requests to sign in with this new provider. You can customize this behavior now, or you can adjust these settings later from the main **Authentication** page by selecting **Edit** next to **Authentication settings**. For more information, see [Authentication flow](/azure/app-service/overview-authentication-authorization#authentication-flow).

For **Restrict access**, decide whether to:

- Require authentication.
- Allow unauthenticated access.

For **Unauthenticated requests**, choose error options:

- HTTP `302 Found redirect`: recommended for websites
- HTTP `401 Unauthorized`: recommended for APIs
- HTTP `403 Forbidden`
- HTTP `404 Not found`

Select **Token store** (recommended). The token store collects, stores, and refreshes tokens for your application. You can disable this behavior later if your app doesn't need tokens or if you need to optimize performance.

## Add the identity provider

If you selected workforce configuration, you can select **Next: Permissions** and add any Microsoft Graph permissions that the application needs. These permissions are added to the app registration, but you can also change them later. If you selected external configuration, you can add Microsoft Graph permissions later.

- Select **Add**.

You're now ready to use the Microsoft identity platform for authentication in your app. The provider is listed on the **Authentication** page. From there, you can edit or delete this provider configuration.

For an example of configuring Microsoft Entra sign-in for a web app that accesses Azure Storage and Microsoft Graph, see [Add app authentication to your web app](scenario-secure-app-authentication-app-service.md).

## Authorize requests

By default, App Service authentication handles only *authentication*. It determines whether the caller is who they say they are. *Authorization*, determining whether that caller should have access to some resource, is a step beyond authentication. For more information, see [Authorization basics](../active-directory/develop/authorization-basics.md).

Your app can [make authorization decisions in code](#perform-validations-from-application-code). App Service authentication provides some [built-in checks](#use-a-built-in-authorization-policy), which can help, but they alone might not be sufficient to cover the authorization needs of your app. The following sections cover these capabilities.

> [!TIP]
> Multitenant applications should validate the issuer and tenant ID of the request as part of this process to make sure the values are allowed. When App Service authentication is configured for a multitenant scenario, it doesn't validate which tenant the request comes from. An app might need to be limited to specific tenants, based on whether the organization has signed up for the service (for example). See [Update your code to handle multiple issuer values](../active-directory/develop/howto-convert-app-to-be-multi-tenant.md#update-your-code-to-handle-multiple-issuer-values).

### Perform validations from application code

When you perform authorization checks in your app code, you can use the claims information that App Service authentication makes available. For more information, see [Access user claims in app code](./configure-authentication-user-identities.md#access-user-claims-in-app-code).

The injected `x-ms-client-principal` header contains a Base64-encoded JSON object with the claims asserted about the caller. By default, these claims go through a claims mapping, so the claim names might not always match what you would see in the token. For example, the `tid` claim is mapped to `http://schemas.microsoft.com/identity/claims/tenantid` instead.

You can also work directly with the underlying access token from the injected `x-ms-token-aad-access-token` header.

### Use a built-in authorization policy

The created app registration authenticates incoming requests for your Microsoft Entra tenant. By default, it also lets anyone within the tenant access the application. This approach is fine for many applications. Some applications need to restrict access further by making authorization decisions.

Your application code is often the best place to handle custom authorization logic. However, for common scenarios, the Microsoft identity platform provides built-in checks that you can use to limit access.

This section shows how to enable built-in checks by using the [App Service authentication V2 API](./configure-authentication-api-version.md). Currently, the only way to configure these built-in checks is by using [Azure Resource Manager templates](/azure/templates/microsoft.web/sites/config-authsettingsv2) or the [REST API](/rest/api/appservice/web-apps/update-auth-settings-v2).

Within the API object, the Microsoft Entra identity provider configuration has a `validation` section that can include a `defaultAuthorizationPolicy` object, as shown in the following structure:

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
| `defaultAuthorizationPolicy`             | A group of requirements that must be met for access to the app. Access is granted based on a logical `AND` over each of its configured properties. When `allowedApplications` and `allowedPrincipals` are both configured, the incoming request must satisfy both requirements to be accepted. |
| `allowedApplications`                    | An allowlist of string application *client IDs* that represent the client resource that calls into the app. When this property is configured as a nonempty array, only tokens obtained by an application specified in the list are accepted.<br/><br/>This policy evaluates the `appid` or `azp` claim of the incoming token, which must be an access token. See [Payload claims]. |
| `allowedPrincipals`                      | A group of checks that determine if the principal that the incoming request represents can access the app. Satisfaction of `allowedPrincipals` is based on a logical `OR` over its configured properties. |
| `identities` (under `allowedPrincipals`) | An allowlist of string *object IDs* that represent users or applications that have access. When this property is configured as a nonempty array, the `allowedPrincipals` requirement can be satisfied if the user or application that the request represents is specified in the list. There's a limit of 500 characters (total) across the list of identities.<br/><br/>This policy evaluates the `oid` claim of the incoming token. See [Payload claims]. |

Also, you can configure some checks through an [application setting], regardless of the API version that you're using. You can configure the `WEBSITE_AUTH_AAD_ALLOWED_TENANTS` application setting with a comma-separated list of up to 10 tenant IDs; for example, `aaaabbbb-0000-cccc-1111-dddd2222eeee`. This setting can require that the incoming token is from one of the specified tenants, as specified by the `tid` claim.

You can configure the `WEBSITE_AUTH_AAD_REQUIRE_CLIENT_SERVICE_PRINCIPAL` application setting to `true` or `1`, to require the incoming token to include an `oid` claim. If you configured `allowedPrincipals.identities`, this setting is ignored and treated as true because the `oid` claim is checked against this provided list of identities.

Requests that fail these built-in checks get an HTTP `403 Forbidden` response.

[Payload claims]: ../active-directory/develop/access-token-claims-reference.md#payload-claims

## Use a managed identity instead of a secret (preview)

[fic-config]: #use-a-managed-identity-instead-of-a-secret-preview

Instead of configuring a client secret for your app registration, you can [configure an application to trust a managed identity (preview)][entra-fic]. Using an identity instead of a secret means you don't have to manage a secret. You don't have secret expiration events to handle, and you don't have the same level of risk associated with possibly disclosing or leaking that secret.

The identity allows you to create a *federated identity credential*, which can be used instead of a client secret as a *client assertion*. This approach is available only for workforce configurations. The built-in authentication feature currently supports federated identity credentials as a preview.

You can use the steps in this section to configure your App Service or Azure Functions resource to use this pattern. The steps here assume that you already set up an app registration by using one of the supported methods, and that you have a secret defined already.

1. Create a user-assigned managed identity resource according to [these instructions](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities#create-a-user-assigned-managed-identity).

1. [Assign that identity](./overview-managed-identity.md#add-a-user-assigned-identity) to your App Service or Azure Functions resource.

    > [!IMPORTANT]
    > The user-assigned managed identity that you create should only be assigned to the App Service or Azure Functions application through this registration. If you assign the identity to another resource, you're giving that resource unnecessary access to your app registration.
1. Note down the **Object ID** and **Client ID** values of the managed identity. You'll need the object ID to create a federated identity credential in the next step. You'll use the managed identity's client ID in a later step.

1. Follow the Microsoft Entra ID [instructions to configure a federated identity credential on an existing application](/entra/workload-id/workload-identity-federation-config-app-trust-managed-identity#configure-a-federated-identity-credential-on-an-existing-application). Those instructions also include sections for updating application code, which you can skip.

1. Add a new [application setting] named `OVERRIDE_USE_MI_FIC_ASSERTION_CLIENTID`. Set its value to the managed identity's **Client ID** value that you obtained in a previous step. Don't use the client ID of your app registration. Make sure to mark this application setting as slot-sticky.

1. In the built-in authentication settings for your app resource, set **Client secret setting name** to `OVERRIDE_USE_MI_FIC_ASSERTION_CLIENTID`.

   To make this change by using the Azure portal:

   1. Go back to your App Service or Azure Functions resource and select the **Authentication** tab.
   1. In the **Identity provider** section, for the **Microsoft** entry, select the icon in the **Edit** column.
   1. In the **Edit identity provider** dialog, open the dropdown list for **Client secret setting name** and select `OVERRIDE_USE_MI_FIC_ASSERTION_CLIENTID`.
   1. Select **Save**.

   To make this change by using the REST API:

   - Set the `clientSecretSettingName` property to `OVERRIDE_USE_MI_FIC_ASSERTION_CLIENTID`. You can find this property under `properties` > `identityProviders` > `azureActiveDirectory` > `registration`.

1. Verify that the application works as you expect. You should be able to successfully perform a new sign-in action.

When you're satisfied with the behavior using a managed identity, remove the existing secret:

1. Make sure that your app code doesn't take a dependency on the application setting. If it does, follow the [instructions to update your application code to request an access token](/entra/workload-id/workload-identity-federation-config-app-trust-managed-identity#update-your-application-code-to-request-an-access-token).

1. Remove the application setting that previously held your secret. The name of this application setting is the previous **Client secret setting name** value, before you set it to `OVERRIDE_USE_MI_FIC_ASSERTION_CLIENTID`.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com/) by using the tenant that contains your app registration. Go to the app registration again.

1. Under **Certificates & secrets**, select **Client secrets** and remove the client secret.

Your app is now configured to use Microsoft Entra ID authentication without secrets.

[entra-fic]: /entra/workload-id/workload-identity-federation-config-app-trust-managed-identity

## <a name = "configure-client-apps-to-access-your-app-service"></a> Configure client apps to access App Service

In prior sections, you registered your App Service or Azure Functions app to authenticate users. The following sections explain how to register native clients or daemon apps in Microsoft Entra. These clients or apps can request access to APIs exposed by App Service on behalf of users or themselves, such as in an N-tier architecture. If you only want to authenticate users, the steps in the following sections aren't required.

### Native client application

You can register native clients to request access to your App Service app's APIs on behalf of a signed-in user:

1. On the Azure portal menu, select **Microsoft Entra ID**.

1. On the left pane, select **Manage** > **App registrations**. Then select **New registration**.

1. On the **Register an application** pane, for **Name**, enter a name for your app registration.

1. In **Redirect URI**, select **Public client/native (mobile & desktop)** and enter the redirect URL. For example, enter `https://contoso.azurewebsites.net/.auth/login/aad/callback`.

1. Select **Register**.

1. After the app registration is created, copy the value of **Application (client) ID**.

   > [!NOTE]
   > For a Microsoft Store application, use the [package SID](/previous-versions/azure/app-service-mobile/app-service-mobile-dotnet-how-to-use-client-library#package-sid) as the URI instead.

1. On the left pane, select **Manage** > **API permissions**. Then select **Add a permission** > **My APIs**.

1. Select the app registration that you created earlier for your App Service app. If you don't see the app registration, be sure to add the **user_impersonation** scope in the app registration.

1. Under **Delegated permissions**, select **user_impersonation**, and then select **Add permissions**.

You've now configured a native client application that can request access your App Service app on behalf of a user.

### Daemon client application (service-to-service calls)

In an N-tier architecture, your client application can acquire a token to call an App Service or Azure Functions app on behalf of the client app itself, not on behalf of a user. This scenario is useful for non-interactive daemon applications that perform tasks without a logged-in user. It uses the standard OAuth 2.0 client credentials grant. For more information, see [Microsoft identity platform and the OAuth 2.0 client credentials flow](../active-directory/develop/v2-oauth2-client-creds-grant-flow.md).

1. On the Azure portal menu, select **Microsoft Entra ID**.

1. On the left pane, select **Manage** > **App registrations**. Then select **New registration**.

1. On the **Register an application** pane, for **Name**, enter a name for your app registration.

1. For a daemon application, you don't need a redirect URI, so you can keep the **Redirect URI** box empty.

1. Select **Register**.

1. After the app registration is created, copy the value of **Application (client) ID**.

1. On the left pane, select **Manage** > **Certificates & secrets**. Then select **Client secrets** > **New client secret**.

1. Enter a description and expiration, and then select **Add**.

1. In the **Value** field, copy the client secret value. After you move away from this page, it doesn't appear again.

You can now [request an access token by using the client ID and client secret](../active-directory/develop/v2-oauth2-client-creds-grant-flow.md#first-case-access-token-request-with-a-shared-secret). Set the `resource` parameter to the **Application ID URI** value of the target app. The resulting access token can then be presented to the target app via the standard [OAuth 2.0 Authorization header](../active-directory/develop/v2-oauth2-client-creds-grant-flow.md#use-a-token). App Service authentication validates and uses the token to indicate that the caller is authenticated. In this case, the caller is an application, not a user.

This approach allows *any* client application in your Microsoft Entra tenant to request an access token and authenticate to the target app. If you also want to enforce authorization to allow only certain client applications, you must perform extra configuration.

1. [Define an app role](../active-directory/develop/howto-add-app-roles-in-azure-ad-apps.md) in the manifest of the app registration that represents the App Service or Azure Functions app that you want to protect.

1. On the app registration that represents the client that needs to be authorized, select **API permissions** > **Add a permission** > **My APIs**.

1. Select the app registration that you created earlier. If you don't see the app registration, make sure that you [added an app role](../active-directory/develop/howto-add-app-roles-in-azure-ad-apps.md).

1. Under **Application permissions**, select the app role that you created earlier. Then select **Add permissions**.

1. Select **Grant admin consent** to authorize the client application to request the permission.

   Similar to the previous scenario (before you added any roles), you can now [request an access token](../active-directory/develop/v2-oauth2-client-creds-grant-flow.md#first-case-access-token-request-with-a-shared-secret) for the same target resource. The access token includes a `roles` claim that contains the app roles that were authorized for the client application.

Within the target App Service or Azure Functions app code, you can now validate that the token has the expected roles. App Service authentication doesn't perform this validation. For more information, see [Access user claims in app code](configure-authentication-user-identities.md#access-user-claims-in-app-code).

You've now configured a daemon client application that can access your App Service app by using its own identity.

## Best practices

Regardless of the configuration that you use to set up authentication, the following best practices keep your tenant and applications more secure:

- Configure each App Service app with its own app registration in Microsoft Entra.
- Give each App Service app its own permissions and consent.
- Avoid permission sharing between environments. Use separate app registrations for separate deployment slots. When you're testing new code, this practice can help prevent problems from affecting the production app.

### Migrate to Microsoft Graph

Some older apps might be set up with a dependency on [Azure AD Graph][aad-graph], which is deprecated and scheduled for full retirement. For example, your app code might call Azure AD Graph to check group membership as part of an authorization filter in a middleware pipeline. Apps should move to [Microsoft Graph](/graph/overview). For more information, see [Migrate your apps from Azure AD Graph to Microsoft Graph][aad-graph].

During this migration, you might need to make some changes to your configuration of App Service authentication. After you add Microsoft Graph permissions to your app registration, you can:

- Update the **Issuer URL** value to include the `/v2.0` suffix if it doesn't already.
- Remove requests for Azure AD Graph permissions from your sign-in configuration. The properties to change depend on [which version of the management API you're using](./configure-authentication-api-version.md):

  - If you're using the V1 API (`/authsettings`), this setting is in the `additionalLoginParams` array.
  - If you're using the V2 API (`/authsettingsV2`), this setting is in the `loginParameters` array.

   You need to remove any reference to `https://graph.windows.net`, for example. This change includes the `resource` parameter, which the `/v2.0` endpoint doesn't support. It also includes any scopes that you specifically request that are from Azure AD Graph.

   You also need to update the configuration to request the new Microsoft Graph permissions that you set up for the application registration. In many cases, you can use the [default scope](../active-directory/develop/scopes-oidc.md#the-default-scope) to simplify this setup. To do so, add a new sign-in parameter: `scope=openid profile email https://graph.microsoft.com/.default`.

With these changes, when App Service authentication tries to sign in, it no longer requests permissions to Azure AD Graph. Instead, it gets a token for Microsoft Graph. Any use of that token from your application code also needs to be updated, as described in [Migrate your apps from Azure AD Graph to Microsoft Graph][aad-graph].

## <a name="related-content"> </a>Related content

[!INCLUDE [app-service-mobile-related-content-get-started-users](../../includes/app-service-mobile-related-content-get-started-users.md)]
- [Quickstart: Add app authentication to your web app running on Azure App Service](scenario-secure-app-authentication-app-service.md)

<!-- URLs. -->

[aad-graph]: /graph/migrate-azure-ad-graph-overview
[Azure portal]: https://portal.azure.com/
[application setting]: ./configure-common.md#configure-app-settings
