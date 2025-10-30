---
title: Authorize Access to API Management Developer Portal by using Microsoft Entra External ID
titleSuffix: Azure API Management
description: Learn how to authorize users of the developer portal in Azure API Management by using Microsoft Entra External ID
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: how-to
ms.date: 09/30/2025
ms.author: danlep
ms.custom:

---

# How to authorize developer accounts by using Microsoft Entra External ID

[!INCLUDE [premium-dev-standard-premiumv2-standardv2-basicv2.md](../../includes/api-management-availability-premium-dev-standard-premiumv2-standardv2-basicv2.md)]

[Microsoft Entra External ID](/entra/external-id/external-identities-overview) is a cloud identity management solution that allows external identities to securely access your apps and resources. You can use it to manage access to your API Management developer portal by external identities. 

In this article, you learn the configuration of the Microsoft Entra ID identity provider for the following scenarios that are supported by the API Management developer portal: 

* Integration with Microsoft Entra External ID in your *workforce tenant*. For example, if your workforce tenant is for the Contoso organization, you might want to configure Google or Facebook as an external identity provider so that these external users can also sign in using their accounts. 
* Integration with Microsoft Entra External ID in a separate *external tenant*. This configuration only allows external users from that tenant to sign in to the developer portal. 

> [!NOTE]
> Currently, you can't configure more than one Microsoft Entra ID identity provider for the developer portal. 

For an overview of options to secure access to the developer portal, see [Secure access to the API Management developer portal](secure-developer-portal-access.md).

[!INCLUDE [api-management-active-directory-b2c-support](../../includes/api-management-active-directory-b2c-support.md)]

[!INCLUDE [active-directory-b2c-end-of-sale-notice-b](../../includes/active-directory-b2c-end-of-sale-notice-b.md)]

## Prerequisites

* A Microsoft Entra ID tenant (workforce tenant) in which to enable external access, or a separate [external tenant](/entra/external-id/customers/how-to-create-external-tenant-portal)
* Permissions to create an application and configure user flows in the workforce tenant.
* An API Management instance. If you don't already have one, [create an Azure API Management instance](get-started-create-service-instance.md).
* If you created your instance in a v2 tier, enable the developer portal. For more information, see [Tutorial: Access and customize the developer portal](api-management-howto-developer-portal-customize.md).

## Add external identity provider to your tenant

If you're using a workforce tenant, an external identity provider must be enabled in your workforce tenant. Configuring the external identity provider is outside the scope of this article. For more information, see [Identity providers for External ID in workforce tenant](/entra/external-id/identity-providers).

## Create Microsoft Entra app registration

Create an app registration in your Microsoft Entra ID tenant. The app registration represents the developer portal application in Microsoft Entra and enables the portal to sign in users by using Microsoft Entra ID.

1. In the Azure portal, go to Microsoft Entra ID. 
1. In the sidebar menu, under **Manage**, select **App registrations** >  **+ New registration**.
1. In the **Register an application** page, enter your application's registration information.
    * In the **Name** section, enter an application name of your choosing.
    * In the **Supported account types** section, select **Accounts in this organizational directory only**.
    * In **Redirect URI**, select **Single-page application (SPA)** and enter the following URL: `https://{your-api-management-service-name}.developer.azure-api.net/signin`, where `{your-api-management-service-name}` is the name of your API Management instance.
    * Select **Register** to create the application.
1.On the app **Overview** page, find the **Application (client) ID** and **Directory (tenant) ID** and copy these values to a safe location. You need them later.
1. In the sidebar menu, under **Manage**, select **Certificates & secrets**. 
1. From the **Certificates & secrets** page, on the **Client secrets** tab, select **+ New client secret**. 
    * Enter a **Description**.
    * Select any option for **Expires**.
    * Choose **Add**. 
1. Copy the client **Secret value** to a safe location before leaving the page. You need it later. 
1. In the sidebar menu, under **Manage**, select **Token configuration** > **+ Add optional claim**.
    1. In **Token type**, select **ID**.
    1. Select (check) the following claims: **email**, **family_name**, **given_name**.
    1. Select **Add**. If prompted, select **Turn on the Microsoft Graph email, profile permission**.

## Enable self-service sign-up for your tenant

For external users to sign up for access to the developer portal, you must complete these steps:

* Enable self-service sign-up for your tenant. 
* Add your app to the self-service sign-up user flow. 

For more information and detailed steps, see the following articles, depending on whether you're using a workforce or an external tenant:

- Workforce tenant: [Add self-service sign-up user flows for B2B collaboration](/entra/external-id/self-service-sign-up-user-flow) 
- External tenant: [Create a sign-up and sign-in user flow for an external tenant app](/entra/external-id/customers/how-to-user-flow-sign-up-sign-in-customers) and [Add an app to the user flow](/entra/external-id/customers/how-to-user-flow-add-application)

## Configure Microsoft Entra ID as an identity provider for developer portal

In your API Management instance, configure the Microsoft Entra ID identity provider. You need the values you copied from your app registration in a previous section.

1. In the [Azure portal](https://portal.azure.com) tab, navigate to your API Management instance.
1. In the sidebar menu, under **Developer portal**, select **Identities** > **+ Add**.
1. In the **Add identity provider** page, select **Microsoft Entra ID**. Once selected, you're able to enter other necessary information. 
    1. In **client id**, enter the **Application (client) ID** from your app registration.
    1. In **Client secret**, enter the **Secret value** from your app registration.
    1. In **Signin tenant**, enter the **Directory (tenant) ID** from your app registration.
    * In the **Client library** dropdown, select **MSAL**.
1. Select **Add**.

    :::image type="content" source="media/api-management-howto-external-id/entra-id-identity-provider.png" alt-text="Screenshot of the Microsoft Entra ID identity provider configuration in the portal.":::
1. Republish the developer portal for the Microsoft Entra configuration to take effect. In the sidebar menu, under **Developer portal**, select **Portal overview** > **Publish**.   

> [!IMPORTANT]
> You need to [republish the developer portal](developer-portal-overview.md#publish-the-portal) when you create or update the identity provider's configuration settings for the changes to take effect.

## Sign in to developer portal with Microsoft Entra External ID

In the developer portal, sign-in with Microsoft Entra External ID is possible with the **Sign-in button: OAuth** widget. The widget is already included on the sign-in page of the default developer portal content.

1. To sign in by using Microsoft Entra External ID, open a new browser window and go to the developer portal. Select **Sign in**.

1. On the **Sign in** page, select **Azure Active Directory**.

    :::image type="content" source="media/api-management-howto-external-id/developer-portal-sign-in.png" alt-text="Screenshot of select Azure Active Directory on Sign in page in developer portal.":::

1. In the sign-in window for your Microsoft Entra tenant, select **Sign-in options**. Select the identity provider you configured in your Microsoft Entra tenant to sign in. For example, if you configured Google as an identity provider, select **Sign in with Google**.

    :::image type="content" source="media/api-management-howto-external-id/sign-in-options.png" alt-text="Screenshot of select external identity provider in Microsoft Entra.":::

To continue sign-in, respond to the prompts. After sign-in is complete, you're redirected back to the developer portal. 

You're now signed in to the developer portal for your API Management service instance. You're added as a new API Management user identity in Users, and a new external tenant user in Microsoft Entra ID.

## Related content

* [Secure access to the API Management developer portal](secure-developer-portal-access.md)
* [Authorize access to API Management developer portal by using Microsoft Entra ID](api-management-howto-aad.md)
* [Introduction to Microsoft Entra External ID](/entra/external-id/external-identities-overview)
* [Supported features in workforce and external tenants](/entra/external-id/customers/concept-supported-features-customers)
