---
title: Authorize access to API Management developer portal by using Azure AD
titleSuffix: Azure API Management
description: Learn how to enable user sign-in to the API Management developer portal by using Azure Active Directory.

author: dlepow
ms.service: api-management
ms.topic: article
ms.date: 04/18/2023
ms.author: danlep
ms.custom: engagement-fy23, devx-track-azurecli
---

# Authorize developer accounts by using Azure Active Directory in Azure API Management

In this article, you'll learn how to:
> [!div class="checklist"]
> * Enable access to the developer portal for users from Azure Active Directory (Azure AD).
> * Manage groups of Azure AD users by adding external groups that contain the users.

For an overview of options to secure the developer portal, see [Secure access to the API Management developer portal](secure-developer-portal-access.md).

> [!IMPORTANT]
> * This article has been updated with steps to configure an Azure AD app using the Microsoft Authentication Library ([MSAL](../active-directory/develop/msal-overview.md)). 
> * If you previously configured an Azure AD app for user sign-in using the Azure AD Authentication Library (ADAL), we recommend that you [migrate to MSAL](#migrate-to-msal).
 

## Prerequisites

- Complete the [Create an Azure API Management instance](get-started-create-service-instance.md) quickstart.

- [Import and publish](import-and-publish.md) an API in the Azure API Management instance.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

[!INCLUDE [premium-dev-standard.md](../../includes/api-management-availability-premium-dev-standard.md)]

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]


## Enable user sign-in using Azure AD - portal

To simplify the configuration, API Management can automatically enable an Azure AD application and identity provider for users of the developer portal. Alternatively, you can manually enable the Azure AD application and identity provider.

### Automatically enable Azure AD application and identity provider

1. In the left menu of your API Management instance, under **Developer portal**, select **Portal overview**.
1. On the **Portal overview** page, scroll down to **Enable user sign-in with Azure Active Directory**. 
1. Select **Enable Azure AD**.
1. On the **Enable Azure AD** page, select **Enable Azure AD**.
1. Select **Close**.

    :::image type="content" source="media/api-management-howto-aad/enable-azure-ad-portal.png" alt-text="Screenshot of enabling Azure AD in the developer portal overview page.":::

After the Azure AD provider is enabled:

* Users in the specified Azure AD instance can [sign into the developer portal by using an Azure AD account](#log_in_to_dev_portal).
* You can manage the Azure AD configuration on the **Developer portal** > **Identities** page in the portal.
* Optionally configure other sign-in settings by selecting **Identities** > **Settings**. For example, you might want to redirect anonymous users to the sign-in page.
* Republish the developer portal after any configuration change.

### Manually enable Azure AD application and identity provider 

1. In the left menu of your API Management instance, under **Developer portal**, select **Identities**.
1. Select **+Add** from the top to open the **Add identity provider** pane to the right.
1. Under **Type**, select **Azure Active Directory** from the drop-down menu. Once selected, you'll be able to enter other necessary information. 
    * In the **Client library** dropdown, select **MSAL**.
    * To add **Client ID** and **Client secret**, see steps later in the article.
1. Save the **Redirect URL** for later.
    
    :::image type="content" source="media/api-management-howto-aad/api-management-with-aad001.png" alt-text="Screenshot of adding identity provider in Azure portal.":::

    > [!NOTE]
    > There are two redirect URLs:<br/>
    > * **Redirect URL** points to the latest developer portal of the API Management.
    > * **Redirect URL (deprecated portal)** points to the deprecated developer portal of API Management.
    >
    > We recommended you use the latest developer portal Redirect URL.
   
1. In your browser, open the Azure portal in a new tab. 
1. Navigate to [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) to register an app in Active Directory.
1. Select **New registration**. On the **Register an application** page, set the values as follows:
    
    * Set **Name** to a meaningful name such as *developer-portal*
    * Set **Supported account types** to **Accounts in any organizational directory**. 
    * In **Redirect URI**, select **Single-page application (SPA)** and paste the redirect URL you saved from a previous step. 
    * Select **Register**. 

1.  After you've registered the application, copy the **Application (client) ID** from the **Overview** page. 
1. Switch to the browser tab with your API Management instance. 
1. In the **Add identity provider** window, paste the **Application (client) ID** value into the **Client ID** box.
1. Switch to the browser tab with the App registration.
1. Select the appropriate app registration.
1. Under the **Manage** section of the side menu, select **Certificates & secrets**. 
1. From the **Certificates & secrets** page, select the **New client secret** button under **Client secrets**. 
    * Enter a **Description**.
    * Select any option for **Expires**.
    * Choose **Add**. 
1. Copy the client **Secret value** before leaving the page. You will need it later. 
1. Under **Manage** in the side menu, select **Authentication**.
    1. Under the **Implicit grant and hybrid flows** section, select the **ID tokens** checkbox.
    1. Select **Save**.
1. Under **Manage** in the side menu, select **Token configuration** > **+ Add optional claim**.
    1. In **Token type**, select **ID**.
    1. Select (check) the following claims: **email**, **family_name**, **given_name**.
    1. Select **Add**. If prompted, select **Turn on the Microsoft Graph email, profile permission**. 
1. Switch to the browser tab with your API Management instance. 
1. Paste the secret into the **Client secret** field in the **Add identity provider** pane.

    > [!IMPORTANT]
    > Update the **Client secret** before the key expires. 

1. In the **Add identity provider** pane's **Allowed tenants** field, specify the Azure AD instance's domains to which you want to grant access to the API Management service instance APIs. 
    * You can separate multiple domains with newlines, spaces, or commas.

    > [!NOTE]
    > You can specify multiple domains in the **Allowed Tenants** section. A global administration must grant the application access to directory data before users can sign in from a different domain than the original app registration domain. To grant permission, the global administrator should:
    > 1. Go to `https://<URL of your developer portal>/aadadminconsent` (for example, `https://contoso.portal.azure-api.net/aadadminconsent`).
    > 1. Enter the domain name of the Azure AD tenant to which they want to grant access.
    > 1. Select **Submit**. 

1. After you specify the desired configuration, select **Add**.
1. Republish the developer portal for the Azure AD configuration to take effect. In the left menu, under **Developer portal**, select **Portal overview** > **Publish**. 

After the Azure AD provider is enabled:

* Users in the specified Azure AD instance can [sign into the developer portal by using an Azure AD account](#log_in_to_dev_portal).
* You can manage the Azure AD configuration on the **Developer portal** > **Identities** page in the portal.
* Optionally configure other sign-in settings by selecting **Identities** > **Settings**. For example, you might want to redirect anonymous users to the sign-in page.
* Republish the developer portal after any configuration change.

## Migrate to MSAL

If you previously configured an Azure AD app for user sign-in using the ADAL, you can use the portal to migrate the app to MSAL and update the identity provider in API Management.

### Update Azure AD app for MSAL compatibility

For steps, see [Switch redirect URIs to the single-page application type](../active-directory/develop/migrate-spa-implicit-to-auth-code.md#switch-redirect-uris-to-spa-platform).

### Update identity provider configuration

1. In the left menu of your API Management instance, under **Developer portal**, select **Identities**.
1. Select **Azure Active Directory** from the list.
1. In the **Client library** dropdown, select **MSAL**.
1. Select **Update**.
1. [Republish your developer portal](api-management-howto-developer-portal-customize.md#publish-from-the-azure-portal).


## Add an external Azure AD group

Now that you've enabled access for users in an Azure AD tenant, you can:
* Add Azure AD groups into API Management. 
* Control product visibility using Azure AD groups.

1. Navigate to the App Registration page for the application you registered in [the previous section](#enable-user-sign-in-using-azure-ad---portal). 
1. Select **API Permissions**. 
1. Add the following minimum **application** permissions for Microsoft Graph API:
    * `User.Read.All` application permission – so API Management can read the user’s group membership to perform group synchronization at the time the user logs in. 
    * `Group.Read.All` application permission – so API Management can read the Azure AD groups when an administrator tries to add the group to API Management using the **Groups** blade in the portal. 
1. Select **Grant admin consent for {tenantname}** so that you grant access for all users in this directory. 

Now you can add external Azure AD groups from the **Groups** tab of your API Management instance.

1. Under **Developer portal** in the side menu, select **Groups**.
1. Select the **Add Azure AD group** button.

    :::image type="content" source="media/api-management-howto-aad/api-management-with-aad008.png" alt-text="Screenshot showing Add Azure AD group button in the portal.":::

1. Select the **Tenant** from the drop-down. 
1. Search for and select the group that you want to add.
1. Press the **Select** button.

Once you add an external Azure AD group, you can review and configure its properties: 
1. Select the name of the group from the **Groups** tab. 
2. Edit **Name** and **Description** information for the group.
 
Users from the configured Azure AD instance can now:
* Sign into the developer portal. 
* View and subscribe to any groups for which they have visibility.

> [!NOTE]
> Learn more about the difference between **Delegated** and **Application** permissions types in [Permissions and consent in the Microsoft identity platform](../active-directory/develop/v2-permissions-and-consent.md#permission-types) article.

## <a id="log_in_to_dev_portal"></a> Developer portal: Add Azure AD account authentication

In the developer portal, you can sign in with Azure AD using the **Sign-in button: OAuth** widget included on the sign-in page of the default developer portal content.

:::image type="content" source="media/api-management-howto-aad/developer-portal-azure-ad-signin.png" alt-text="Screenshot showing OAuth widget in developer portal.":::


Although a new account will automatically be created when a new user signs in with Azure AD, consider adding the same widget to the sign-up page. The **Sign-up form: OAuth** widget represents a form used for signing up with OAuth.

> [!IMPORTANT]
> You need to [republish the portal](api-management-howto-developer-portal-customize.md#publish) for the Azure AD changes to take effect.

## Legacy developer portal: How to sign in with Azure AD

[!INCLUDE [api-management-portal-legacy.md](../../includes/api-management-portal-legacy.md)]

To sign into the developer portal by using an Azure AD account that you configured in the previous sections:

1. Open a new browser window using the sign-in URL from the Active Directory application configuration. 
2. Select **Azure Active Directory**.

   ![Sign-in page][api-management-dev-portal-signin]

1. Enter the credentials of one of the users in Azure AD.
2. Select **Sign in**.

   ![Signing in with username and password][api-management-aad-signin]

1. If prompted with a registration form, complete with any additional information required. 
2. Select **Sign up**.

   !["Sign up" button on registration form][api-management-complete-registration]

Your user is now signed in to the developer portal for your API Management service instance.

![Developer portal after registration is complete][api-management-registration-complete]

## Next Steps

- Learn more about [Azure Active Directory and OAuth2.0](../active-directory/develop/authentication-vs-authorization.md).
- Learn more about [MSAL](../active-directory/develop/msal-overview.md) and [migrating to MSAL](../active-directory/develop/msal-migration.md).
- [Create an API Management service instance](./get-started-create-service-instance.md).
- [Manage your first API](./import-and-publish.md).

[api-management-dev-portal-signin]: ./media/api-management-howto-aad/api-management-dev-portal-signin.png
[api-management-aad-signin]: ./media/api-management-howto-aad/api-management-aad-signin.png
[api-management-complete-registration]: ./media/api-management-howto-aad/api-management-complete-registration.png
[api-management-registration-complete]: ./media/api-management-howto-aad/api-management-registration-complete.png

[How to add operations to an API]: ./mock-api-responses.md
[How to add and publish a product]: api-management-howto-add-products.md
[Monitoring and analytics]: api-management-monitoring.md
[Add APIs to a product]: api-management-howto-add-products.md#add-apis
[Publish a product]: api-management-howto-add-products.md#publish-product
[Get started with Azure API Management]: get-started-create-service-instance.md
[API Management policy reference]: ./api-management-policies.md
[Caching policies]: ./api-management-policies.md#caching-policies
[Create an API Management service instance]: get-started-create-service-instance.md

[https://oauth.net/2/]: https://oauth.net/2/
[WebApp-GraphAPI-DotNet]: https://github.com/AzureADSamples/WebApp-GraphAPI-DotNet

[Prerequisites]: #prerequisites
[Configure an OAuth 2.0 authorization server in API Management]: #step1
[Configure an API to use OAuth 2.0 user authorization]: #step2
[Test the OAuth 2.0 user authorization in the Developer Portal]: #step3
[Next steps]: #next-steps

[Sign in to the developer portal by using an Azure AD account]: #Sign-in-to-the-developer-portal-by-using-an-Azure-AD-account
