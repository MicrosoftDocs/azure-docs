---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 12/03/2025
ms.author: danlep
---
<a name='enable-user-sign-in-using-azure-ad---portal'></a>

## Enable user sign-in using Microsoft Entra ID - portal

To simplify the configuration, API Management can automatically enable a Microsoft Entra application and identity provider for users of the developer portal. Alternatively, you can manually enable the Microsoft Entra application and identity provider.

<a name='automatically-enable-azure-ad-application-and-identity-provider'></a>

### Automatically enable Microsoft Entra application and identity provider

Follow these steps to automatically enable Microsoft Entra ID in the developer portal:

1. In the left menu of your API Management instance, under **Developer portal**, select **Portal overview**.
1. On the **Portal overview** page, scroll down to **Enable user sign-in with Microsoft Entra ID**. 
1. Select **Enable Microsoft Entra ID**.
1. On the **Enable Microsoft Entra ID** page, select **Enable Microsoft Entra ID**.
1. Select **Close**.

    :::image type="content" source="media/api-management-developer-portal-entra-app/enable-azure-ad-portal.png" alt-text="Screenshot of enabling Microsoft Entra ID in the developer portal overview page.":::

After the Microsoft Entra provider is enabled:

* Users in your Microsoft Entra tenant can [sign into the developer portal by using a Microsoft Entra account](#log_in_to_dev_portal).
* You can manage the Microsoft Entra identity provider configuration on the **Developer portal** > **Identities** page in the portal.
* Optionally update the app registration in Microsoft Entra ID to support multiple tenants, as described in [Configure app registration for multiple tenants](../articles/api-management/api-management-howto-aad.md#configure-app-registration-for-multiple-tenants). The name of the default app registration created by API Management is the same as the API Management instance name.
* Optionally configure other sign-in settings by selecting **Identities** > **Settings**. For example, you might want to redirect anonymous users to the sign-in page.
* Republish the developer portal after any configuration change.

<a name='manually-enable-azure-ad-application-and-identity-provider'></a>

### Manually enable Microsoft Entra application and identity provider 

Alternatively, manually enable Microsoft Entra ID in the developer portal by registering an application yourself in Microsoft Entra ID and configuring the identity provider for the developer portal.

1. In the left menu of your API Management instance, under **Developer portal**, select **Identities**.
1. Select **+ Add** from the top to open the **Add identity provider** pane to the right.
1. Under **Type**, select **Microsoft Entra ID** from the drop-down menu. When you select this option, you can enter other necessary information. 
    * In the **Client library** dropdown, select **MSAL**.
    * To add **Client ID** and **Client secret**, see steps later in the article.
1. Save the **Redirect URL** for later.
    
    :::image type="content" source="media/api-management-developer-portal-entra-app/api-management-with-aad001.png" alt-text="Screenshot of adding identity provider in Azure portal.":::
  
1. In your browser, open the Azure portal in a new tab. 
1. Navigate to [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) to register an app in Microsoft Entra ID.
1. Select **New registration**. On the **Register an application** page, set the values as follows:
    
    * Set **Name** to a meaningful name such as *developer-portal*
    * Set **Supported account types**, make a selection appropriate for your scenarios. If you want to allow users in multiple Microsoft Entra ID tenants to access the developer portal, select **Accounts in any organizational directory (Multitenant)**. 
    * In **Redirect URI**, select **Single-page application (SPA)** and paste the redirect URL you saved from a previous step. 
    * Select **Register**. 

1. After you register the application, copy the **Application (client) ID** from the **Overview** page. 
1. Switch to the browser tab with your API Management instance. 
1. In the **Add identity provider** window, paste the **Application (client) ID** value into the **Client ID** box.
1. Switch to the browser tab with the app registration.
1. Select the appropriate app registration.    
1. Under the **Manage** section of the side menu, select **Certificates & secrets**. 
1. From the **Certificates & secrets** page, select the **New client secret** button under **Client secrets**. 
    * Enter a **Description**.
    * Select any option for **Expires**.
    * Choose **Add**. 
1. Copy the client **Secret value** before leaving the page. You need it in a later step. 
1. Under **Manage** in the side menu, select **Token configuration** > **+ Add optional claim**.
    1. In **Token type**, select **ID**.
    1. Select (check) the following claims: **email**, **family_name**, **given_name**.
    1. Select **Add**. If prompted, select **Turn on the Microsoft Graph email, profile permission**. 
1. Switch to the browser tab with your API Management instance. 
1. Paste the secret into the **Client secret** field in the **Add identity provider** pane.

    > [!IMPORTANT]
    > Update the **Client secret** before the key expires. 

1. In **Signin tenant**, specify a tenant name or ID to use for sign-in to Microsoft Entra. If you don't specify a value, the Common endpoint is used.
1. In **Allowed tenants**, add one or more specific Microsoft Entra tenant names or IDs for sign-in to Microsoft Entra. 

    > [!NOTE]
    > If you specify additional tenants, the app registration must be configured to support multiple tenants. For more information, see [Configure app registration for multiple tenants](../articles/api-management/api-management-howto-aad.md#configure-app-registration-for-multiple-tenants).
1. After you specify the desired configuration, select **Add**.
1. Republish the developer portal for the Microsoft Entra configuration to take effect. In the left menu, under **Developer portal**, select **Portal overview** > **Publish**. 

After the Microsoft Entra provider is enabled:

* Users in the specified Microsoft Entra tenant(s) can [sign into the developer portal by using a Microsoft Entra account](#log_in_to_dev_portal).
* You can manage the Microsoft Entra configuration on the **Developer portal** > **Identities** page in the portal.
* Optionally configure other sign-in settings by selecting **Identities** > **Settings**. For example, you might want to redirect anonymous users to the sign-in page.
* Republish the developer portal after any configuration change.
