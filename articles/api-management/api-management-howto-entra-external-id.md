---
title: Authorize Access to API Management Developer Portal by using Microsoft Entra External ID
titleSuffix: Azure API Management
description: Learn how to authorize external users of the developer portal in Azure API Management by using Microsoft Entra External ID
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: how-to
ms.date: 12/08/2025
ms.author: danlep
ms.custom:

---

# How to authorize developer accounts by using external identity providers in Microsoft Entra External ID

[!INCLUDE [premium-dev-standard-premiumv2-standardv2-basicv2.md](../../includes/api-management-availability-premium-dev-standard-premiumv2-standardv2-basicv2.md)]

[Microsoft Entra External ID](/entra/external-id/external-identities-overview) is a cloud identity management solution that allows external identities to securely access your apps and resources. You can use it to manage access to your API Management developer portal by external identities. 

For an overview of options to secure access to the developer portal, see [Secure access to the API Management developer portal](secure-developer-portal-access.md).

Currently, API Management supports external identity providers in Microsoft Entra External ID when configured in a Microsoft Entra ID *workforce tenant*. For example, if you're enabling access to the developer portal by users in your workforce tenant, such as the Contoso organization, you might want to configure Google or Facebook as an external identity provider so that these external users can also sign in using their accounts. [Learn more about workforce and external tenant configurations in Microsoft External ID](/entra/external-id/tenant-configurations).

[!INCLUDE [api-management-developer-portal-entra-tenants.md](../../includes/api-management-developer-portal-entra-tenants.md)]

[!INCLUDE [api-management-active-directory-b2c-support](../../includes/api-management-active-directory-b2c-support.md)]

[!INCLUDE [active-directory-b2c-end-of-sale-notice-b](../../includes/active-directory-b2c-end-of-sale-notice-b.md)]

## Prerequisites

* A Microsoft Entra ID tenant (workforce tenant) in which to enable external access.
* Permissions to create an application and configure user flows in the workforce tenant.
* An API Management instance. If you don't already have one, [create an Azure API Management instance](get-started-create-service-instance.md).
* If you created your instance in a v2 tier, enable the developer portal. For more information, see [Tutorial: Access and customize the developer portal](api-management-howto-developer-portal-customize.md).

## Add external identity provider to your tenant

For this scenario, you must enable an identity provider for External ID in your workforce tenant. Configuring the external identity provider depends on the specific provider and is outside the scope of this article. For options and links to steps, see [Identity providers for External ID in workforce tenants](/entra/external-id/identity-providers).

[!INCLUDE [api-management-developer-portal-entra-app.md](../../includes/api-management-developer-portal-entra-app.md)]

## Enable self-service sign-up for your tenant

To allow external users to register for access to the developer portal, complete the following steps:

* Enable self-service sign-up for the external tenant. 
* Add your app to the self-service sign-up user flow. 

For more information and detailed steps, see [Add self-service sign-up user flows for B2B collaboration](/entra/external-id/self-service-sign-up-user-flow).


## <a id="log_in_to_dev_portal"></a> Sign in to developer portal with Microsoft Entra External ID

In the developer portal, you can enable sign in with Microsoft Entra External ID by using the **Sign-in button: OAuth** widget. The widget is already included on the sign-in page of the default developer portal content.

A user can then sign in with Microsoft Entra External ID as follows:

1. Go to the developer portal. Select **Sign in**.

1. On the **Sign in** page, select **Microsoft Entra ID**.

    :::image type="content" source="media/api-management-howto-external-id/developer-portal-sign-in.png" alt-text="Screenshot of selecting Microsoft Entra ID on Sign in page in developer portal.":::

    > [!TIP]
    > If you configure more than one Microsoft Entra tenant for access, more than one Microsoft Entra ID button appears on the sign-in page. Each button is labeled with the tenant name.

1. In the sign-in window for your Microsoft Entra tenant, select **Sign-in options**. Select the external identity provider configured in your Microsoft Entra tenant to sign in. For example, if you configured Google as an identity provider, select **Sign in with Google**.

    :::image type="content" source="media/api-management-howto-external-id/sign-in-options.png" alt-text="Screenshot of select external identity provider in Microsoft Entra.":::

1. To continue sign-in, respond to the prompts. After sign-in is complete, the user is redirected back to the developer portal. 

The user is now signed in to the developer portal, added as a new API Management user identity in **Users**, and added as a new external tenant user in Microsoft Entra ID.

## Related content

* [Secure access to the API Management developer portal](secure-developer-portal-access.md)
* [Authorize access to API Management developer portal by using Microsoft Entra ID](api-management-howto-aad.md)
* [Introduction to Microsoft Entra External ID](/entra/external-id/external-identities-overview)
* [Supported features in workforce and external tenants](/entra/external-id/customers/concept-supported-features-customers)
