---
title: Authorize access to API Management developer portal by using Microsoft Entra ID
titleSuffix: Azure API Management
description: Learn how to enable user sign-in to the API Management developer portal by using Microsoft Entra ID.

author: dlepow
ms.service: api-management
ms.topic: article
ms.date: 12/08/2023
ms.author: danlep
ms.custom: engagement-fy23, devx-track-azurecli
---

# Authorize developer accounts by using Microsoft Entra ID in Azure API Management

In this article, you'll learn how to:
> [!div class="checklist"]
> * Enable access to the developer portal for users from Microsoft Entra ID.
> * Manage groups of Microsoft Entra users by adding external groups that contain the users.

For an overview of options to secure the developer portal, see [Secure access to the API Management developer portal](secure-developer-portal-access.md).

> [!IMPORTANT]
> * This article has been updated with steps to configure a Microsoft Entra app using the Microsoft Authentication Library ([MSAL](../active-directory/develop/msal-overview.md)). 
> * If you previously configured a Microsoft Entra app for user sign-in using the Azure AD Authentication Library (ADAL), we recommend that you [migrate to MSAL](#migrate-to-msal).
 

## Prerequisites

- Complete the [Create an Azure API Management instance](get-started-create-service-instance.md) quickstart.

- [Import and publish](import-and-publish.md) an API in the Azure API Management instance.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

[!INCLUDE [premium-dev-standard.md](../../includes/api-management-availability-premium-dev-standard.md)]

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]


<a name='enable-user-sign-in-using-azure-ad---portal'></a>

## Enable user sign-in using Microsoft Entra ID - portal

To simplify the configuration, API Management can automatically enable a Microsoft Entra application and identity provider for users of the developer portal. Alternatively, you can manually enable the Microsoft Entra application and identity provider.

<a name='automatically-enable-azure-ad-application-and-identity-provider'></a>

### Automatically enable Microsoft Entra application and identity provider

1. In the left menu of your API Management instance, under **Developer portal**, select **Portal overview**.
1. On the **Portal overview** page, scroll down to **Enable user sign-in with Microsoft Entra ID**. 
1. Select **Enable Microsoft Entra ID**.
1. On the **Enable Microsoft Entra ID** page, select **Enable Microsoft Entra ID**.
1. Select **Close**.

    :::image type="content" source="media/api-management-howto-aad/enable-azure-ad-portal.png" alt-text="Screenshot of enabling Microsoft Entra ID in the developer portal overview page.":::

After the Microsoft Entra provider is enabled:

* Users in the specified Microsoft Entra instance can [sign into the developer portal by using a Microsoft Entra account](#log_in_to_dev_portal).
* You can manage the Microsoft Entra configuration on the **Developer portal** > **Identities** page in the portal.
* Optionally configure other sign-in settings by selecting **Identities** > **Settings**. For example, you might want to redirect anonymous users to the sign-in page.
* Republish the developer portal after any configuration change.

<a name='manually-enable-azure-ad-application-and-identity-provider'></a>

### Manually enable Microsoft Entra application and identity provider 

1. In the left menu of your API Management instance, under **Developer portal**, select **Identities**.
1. Select **+Add** from the top to open the **Add identity provider** pane to the right.
1. Under **Type**, select **Microsoft Entra ID** from the drop-down menu. Once selected, you'll be able to enter other necessary information. 
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

1. In the **Add identity provider** pane's **Allowed tenants** field, specify the Microsoft Entra instance's domains to which you want to grant access to the API Management service instance APIs. 
    * You can separate multiple domains with newlines, spaces, or commas.

    > [!NOTE]
    > You can specify multiple domains in the **Allowed Tenants** section. A global administration must grant the application access to directory data before users can sign in from a different domain than the original app registration domain. To grant permission, the global administrator should:
    > 1. Go to `https://<URL of your developer portal>/aadadminconsent` (for example, `https://contoso.portal.azure-api.net/aadadminconsent`).
    > 1. Enter the domain name of the Microsoft Entra tenant to which they want to grant access.
    > 1. Select **Submit**. 

1. After you specify the desired configuration, select **Add**.
1. Republish the developer portal for the Microsoft Entra configuration to take effect. In the left menu, under **Developer portal**, select **Portal overview** > **Publish**. 

After the Microsoft Entra provider is enabled:

* Users in the specified Microsoft Entra instance can [sign into the developer portal by using a Microsoft Entra account](#log_in_to_dev_portal).
* You can manage the Microsoft Entra configuration on the **Developer portal** > **Identities** page in the portal.
* Optionally configure other sign-in settings by selecting **Identities** > **Settings**. For example, you might want to redirect anonymous users to the sign-in page.
* Republish the developer portal after any configuration change.

## Migrate to MSAL

If you previously configured a Microsoft Entra app for user sign-in using the ADAL, you can use the portal to migrate the app to MSAL and update the identity provider in API Management.

<a name='update-azure-ad-app-for-msal-compatibility'></a>

### Update Microsoft Entra app for MSAL compatibility

For steps, see [Switch redirect URIs to the single-page application type](../active-directory/develop/migrate-spa-implicit-to-auth-code.md#switch-redirect-uris-to-spa-platform).

### Update identity provider configuration

1. In the left menu of your API Management instance, under **Developer portal**, select **Identities**.
1. Select **Microsoft Entra ID** from the list.
1. In the **Client library** dropdown, select **MSAL**.
1. Select **Update**.
1. [Republish your developer portal](api-management-howto-developer-portal-customize.md#publish-from-the-azure-portal).


<a name='add-an-external-azure-ad-group'></a>

## Add an external Microsoft Entra group

Now that you've enabled access for users in a Microsoft Entra tenant, you can:
* Add Microsoft Entra groups into API Management. 
* Control product visibility using Microsoft Entra groups.

1. Navigate to the App Registration page for the application you registered in [the previous section](#enable-user-sign-in-using-azure-ad---portal). 
1. Select **API Permissions**. 
1. Add the following minimum **application** permissions for Microsoft Graph API:
    * `User.Read.All` application permission – so API Management can read the user’s group membership to perform group synchronization at the time the user logs in. 
    * `Group.Read.All` application permission – so API Management can read the Microsoft Entra groups when an administrator tries to add the group to API Management using the **Groups** blade in the portal. 
1. Select **Grant admin consent for {tenantname}** so that you grant access for all users in this directory. 

Now you can add external Microsoft Entra groups from the **Groups** tab of your API Management instance.

1. Under **Developer portal** in the side menu, select **Groups**.
1. Select the **Add Microsoft Entra group** button.

    :::image type="content" source="media/api-management-howto-aad/api-management-with-aad008.png" alt-text="Screenshot showing Add Microsoft Entra group button in the portal.":::

1. Select the **Tenant** from the drop-down. 
1. Search for and select the group that you want to add.
1. Press the **Select** button.

Once you add an external Microsoft Entra group, you can review and configure its properties: 
1. Select the name of the group from the **Groups** tab. 
2. Edit **Name** and **Description** information for the group.
 
Users from the configured Microsoft Entra instance can now:
* Sign into the developer portal. 
* View and subscribe to any groups for which they have visibility.

> [!NOTE]
> Learn more about the difference between **Delegated** and **Application** permissions types in [Permissions and consent in the Microsoft identity platform](../active-directory/develop/v2-permissions-and-consent.md#permission-types) article.

### Synchronize Microsoft Entra groups with API Management

Groups configured in Microsoft Entra must synchronize with API Management so that you can add them to your instance. If the groups don't synchronize automatically, do one of the following to synchronize group information manually:

* Sign out and sign in to Microsoft Entra ID. This activity usually triggers synchronization of groups.
* Ensure that the Microsoft Entra sign-in tenant is specified the same way (using one of tenant ID or domain name) in your configuration settings in API Management. You specify the sign-in tenant in the Microsoft Entra ID identity provider for the developer portal and when you add a Microsoft Entra group to API Management.

## <a id="log_in_to_dev_portal"></a> Developer portal: Add Microsoft Entra account authentication

In the developer portal, you can sign in with Microsoft Entra ID using the **Sign-in button: OAuth** widget included on the sign-in page of the default developer portal content.

:::image type="content" source="media/api-management-howto-aad/developer-portal-azure-ad-signin.png" alt-text="Screenshot showing OAuth widget in developer portal.":::


Although a new account will automatically be created when a new user signs in with Microsoft Entra ID, consider adding the same widget to the sign-up page. The **Sign-up form: OAuth** widget represents a form used for signing up with OAuth.

> [!IMPORTANT]
> You need to [republish the portal](api-management-howto-developer-portal-customize.md#publish) for the Microsoft Entra ID changes to take effect.

## Related content

- Learn more about [Microsoft Entra ID and OAuth2.0](../active-directory/develop/authentication-vs-authorization.md).
- Learn more about [MSAL](../active-directory/develop/msal-overview.md) and [migrating to MSAL](../active-directory/develop/msal-migration.md).
- [Troubleshoot network connectivity to Microsoft Graph from inside a VNet](api-management-using-with-vnet.md#troubleshoot-connection-to-microsoft-graph-from-inside-a-vnet). 

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
