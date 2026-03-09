---
title: Authorize access to API Management developer portal by using Microsoft Entra ID
titleSuffix: Azure API Management
description: Learn how to enable user sign-in to the API Management developer portal by using Microsoft Entra ID.

author: dlepow
ms.service: azure-api-management
ms.topic: how-to
ms.date: 12/12/2025
ms.author: danlep
ms.custom:
  - engagement-fy23
  - devx-track-azurecli
  - sfi-image-nochange
---

# Authorize developer accounts by using Microsoft Entra ID in Azure API Management

[!INCLUDE [premium-dev-standard-premiumv2-standardv2-basicv2.md](../../includes/api-management-availability-premium-dev-standard-premiumv2-standardv2-basicv2.md)]


In this article, you learn how to:
> [!div class="checklist"]
> * Enable access to the developer portal for users in your organization's Microsoft Entra ID tenant or other Microsoft Entra ID workforce tenants.
> * Manage groups of Microsoft Entra users by adding external groups that contain the users.

For an overview of options to secure the developer portal, see [Secure access to the API Management developer portal](secure-developer-portal-access.md).

> [!IMPORTANT]
> * This article is updated with steps to configure a Microsoft Entra app using the Microsoft Authentication Library ([MSAL](../active-directory/develop/msal-overview.md)). 
> * If you previously configured a Microsoft Entra app for user sign-in by using the Azure AD Authentication Library (ADAL), [migrate to MSAL](#migrate-to-msal).

For scenarios involving Microsoft External ID to allow external identities to sign in to the developer portal, see [Authorize access to API Management developer portal by using Microsoft Entra External ID](api-management-howto-entra-external-id.md).

[!INCLUDE [api-management-developer-portal-entra-tenants.md](../../includes/api-management-developer-portal-entra-tenants.md)]


## Prerequisites

- Complete the [Create an Azure API Management instance](get-started-create-service-instance.md) quickstart.

- [Import and publish](import-and-publish.md) an API in the Azure API Management instance.

- If you created your instance in a v2 tier, enable the developer portal. For more information, see [Tutorial: Access and customize the developer portal](api-management-howto-developer-portal-customize.md).

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

[!INCLUDE [api-management-developer-portal-entra-app.md](../../includes/api-management-developer-portal-entra-app.md)]

## Migrate to MSAL

If you previously configured a Microsoft Entra app for user sign-in by using ADAL, you can use the portal to migrate the app to MSAL and update the identity provider in API Management.

<a name='update-azure-ad-app-for-msal-compatibility'></a>

### Update Microsoft Entra app for MSAL compatibility

For steps, see [Switch redirect URIs to the single-page application type](../active-directory/develop/migrate-spa-implicit-to-auth-code.md#switch-redirect-uris-to-spa-platform).

### Update identity provider configuration

1. In the left menu of your API Management instance, under **Developer portal**, select **Identities**.
1. Select **Microsoft Entra ID** from the list.
1. In the **Client library** dropdown, select **MSAL**.
1. Select **Update**.
1. [Republish your developer portal](developer-portal-overview.md#publish-the-portal).


<a name='add-an-external-azure-ad-group'></a>

## Configure access by users in more than one Microsoft Entra tenant

> [!NOTE]
> Support for access to the developer portal by users from multiple Microsoft Entra ID tenants is currently available in the API Management Developer, Standard, and Premium tiers.

You can enable access to the developer portal by users from more than one Microsoft Entra ID tenant. To do this:

* Configure app registration for multiple tenants.
* Update the Microsoft Entra ID identity provider configuration for the developer portal to add another tenant.

### Configure app registration for multiple tenants

The app registration you configure for the identity provider must support multiple tenants. You can do this in either of the following ways:

* When creating the app registration, set **Supported account types** to **Accounts in any organizational directory (Any Microsoft Entra ID tenant - Multitenant)**. 
* If you previously configured an app registration for a single tenant, update the **Supported account types** setting on the **Manage** > **Authentication** page of the app registration.

### Update Microsoft Entra ID identity provider configuration for multiple tenants

Update the identity provider configuration to add another tenant:

1. In the Azure portal, go to your API Management instance.
1. Under **Developer portal**, select **Identities**.
1. Select **Microsoft Entra ID** from the list.
1. In the **Tenant ID** field, add the extra tenant IDs separated by commas.
1. Update the value of **Signin tenant** to one of the configured tenants. 
1. Select **Update**.
1. [Republish your developer portal](developer-portal-overview.md#publish-the-portal).

## Add an external Microsoft Entra group

After you enable access for users in a Microsoft Entra tenant, you can:
* Add Microsoft Entra groups into API Management. You must add groups in the tenant where you deployed your API Management instance.
* Control product visibility by using Microsoft Entra groups.

1. Go to the App Registration page for the application you registered in [the previous section](#enable-user-sign-in-using-azure-ad---portal). 
1. Select **API Permissions**. 
1. Add the following minimum **application** permissions for Microsoft Graph API:
    * `User.Read.All` application permission – so API Management can read the user’s group membership to perform group synchronization when the user signs in. 
    * `Group.Read.All` application permission – so API Management can read the Microsoft Entra groups when an administrator tries to add the group to API Management by using the **Groups** blade in the portal. 
1. Select **Grant admin consent for {tenantname}** to grant access for all users in this directory. 

Now you can add external Microsoft Entra groups from the **Groups** tab of your API Management instance.

1. Under **Developer portal** in the side menu, select **Groups**.
1. Select the **Add Microsoft Entra group** button.

    :::image type="content" source="media/api-management-howto-aad/api-management-with-aad008.png" alt-text="Screenshot showing Add Microsoft Entra group button in the portal.":::

1. Select the **Tenant** from the drop-down. 
1. Search for and select the group that you want to add.
1. Press the **Select** button.

After you add an external Microsoft Entra group, you can review and configure its properties: 
1. Select the name of the group from the **Groups** tab. 
1. Edit **Name** and **Description** information for the group.
 
Users from the configured Microsoft Entra instance can now:
* Sign in to the developer portal. 
* View and subscribe to any groups for which they have visibility.

> [!NOTE]
> Learn more about the difference between **Delegated** and **Application** permissions types in [Permissions and consent in the Microsoft identity platform](../active-directory/develop/v2-permissions-and-consent.md#permission-types) article.

### Synchronize Microsoft Entra groups with API Management

Groups you configure in Microsoft Entra must synchronize with API Management so that you can add them to your instance. If the groups don't synchronize automatically, use one of the following steps to manually synchronize group information:

* Sign out and sign in to Microsoft Entra ID. This activity usually triggers synchronization of groups.
* Ensure that the Microsoft Entra sign-in tenant is specified the same way (using one of tenant ID or domain name) in your configuration settings in API Management. You specify the sign-in tenant in the Microsoft Entra ID identity provider for the developer portal and when you add a Microsoft Entra group to API Management.

## <a id="log_in_to_dev_portal"></a> Developer portal: Add Microsoft Entra account authentication

In the developer portal, you can enable sign in with Microsoft Entra ID by using the **Sign-in button: OAuth** widget included on the sign-in page of the default developer portal content.

A user can then sign in with Microsoft Entra ID as follows:

1. Go to the developer portal. Select **Sign in**.

1. On the **Sign in** page, select **Microsoft Entra ID**. Selecting this button opens the Microsoft Entra ID sign-in page.


    :::image type="content" source="media/api-management-howto-aad/developer-portal-azure-ad-signin.png" alt-text="Screenshot showing OAuth widget in developer portal.":::

    > [!TIP]
    > If more than one tenant is configured for access, more than one Microsoft Entra ID button appears on the sign-in page. Each button is labeled with the tenant name.

1. In the sign-in window for your Microsoft Entra tenant, respond to the prompts. After sign-in is complete, the user is redirected back to the developer portal. 

The user is now signed in to the developer portal and added as a new API Management user identity in **Users**.

Although a new account is automatically created when a new user signs in with Microsoft Entra ID, consider adding the same widget to the sign-up page. The **Sign-up form: OAuth** widget represents a form used for signing up with OAuth.

> [!IMPORTANT]
> You need to [republish the portal](developer-portal-overview.md#publish-the-portal) for the Microsoft Entra ID changes to take effect.

## Related content

- Learn more about [Microsoft Entra ID and OAuth2.0](../active-directory/develop/authentication-vs-authorization.md).
- Learn more about [MSAL](../active-directory/develop/msal-overview.md) and [migrating to MSAL](../active-directory/develop/msal-migration.md).
- [Troubleshoot network connectivity to Microsoft Graph from inside a VNet](api-management-using-with-vnet.md#troubleshoot-connection-to-microsoft-graph-from-inside-a-vnet). 

[api-management-dev-portal-signin]: ./media/api-management-howto-aad/api-management-dev-portal-signin.png
[api-management-aad-signin]: ./media/api-management-howto-aad/api-management-aad-signin.png
[api-management-complete-registration]: ./media/api-management-howto-aad/api-management-complete-registration.png
[api-management-registration-complete]: ./media/api-management-howto-aad/api-management-registration-complete.png

[How to add operations to an API]: ./mock-api-responses.md
[How to add and publish a product]: ./api-management-howto-add-products.md
[Monitoring and analytics]: ./api-management-monitoring.md
[Add APIs to a product]: ./api-management-howto-add-products.md#add-apis
[Publish a product]: ./api-management-howto-add-products.md#publish-product
[Get started with Azure API Management]: ./get-started-create-service-instance.md
[API Management policy reference]: ./api-management-policies.md
[Caching policies]: ./api-management-policies.md#caching
[Create an API Management service instance]: ./get-started-create-service-instance.md

[https://oauth.net/2/]: https://oauth.net/2/
[WebApp-GraphAPI-DotNet]: https://github.com/AzureADSamples/WebApp-GraphAPI-DotNet

[Prerequisites]: #prerequisites
[Configure an OAuth 2.0 authorization server in API Management]: #step1
[Configure an API to use OAuth 2.0 user authorization]: #step2
[Test the OAuth 2.0 user authorization in the Developer Portal]: #step3
[Next steps]: #next-steps

[Sign in to the developer portal by using an Azure AD account]: #Sign-in-to-the-developer-portal-by-using-an-Azure-AD-account
