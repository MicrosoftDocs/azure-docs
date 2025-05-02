---
title: Authorize test console of API Management developer portal - OAuth 2.0
titleSuffix: Azure API Management
description: Set up OAuth 2.0 user authorization for the test console in Azure API Management developer portal. This example uses Microsoft Entra ID as OAuth 2.0 provider.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: how-to
ms.date: 01/06/2025
ms.author: danlep
ms.custom: engagement-fy23
---

# Create and authorize access to products using OAuth 2.0 application 

[!INCLUDE [api-management-availability-premium-dev-standard-basic](../../includes/api-management-availability-premium-dev-standard-basic.md)]




Applications feature is now available for private preview testing. 


> [!NOTE]
> This feature is in private preview. Ensure that you have ...

This feature enables:

* API Management gateway can now authorize product/API access using OAuth token 
* API managers can identify products which have OAuth authorization enabled
* API managers can create client applications and assign access to products
* Developers can view all client applications and use OAuth token to get secure access to product/API

## Prerequisites

- An API Management instance deployed in one of the Azure Early Updates Access Program (EUAP) regions, such as Central US EUAP. If you haven't yet created an API Management service instance, see [Create an API Management service instance](get-started-create-service-instance). The API Management instance must be in **Premium**, **Standard**, **Basic**, or **Developer** tier.

    > [!NOTE]
    > If you don't have access to an EUAP region, you can [request it](/troubleshoot/azure/general/region-access-request-process) through the Azure portal.

- At least one product in your API Management instance, with at least one API assigned to it. If you haven't yet created a product, see [Create and publish a product](api-management-howto-add-products.md). For testing, you may use the default **Starter** product and the **Echo** API that's added to it.

- Permissions to create an app registration in your Microsoft Entra tenant.

- Permissions to assign the **Application Administrator** role, which requires at least the **Privileged Role Administrator** role in Microsoft Entra.


[Any special considerations to access the preview - regions, special URLs, etc.]

## Scenario overview

The following are the high level configuration steps:

1. Register an application ...in Microsoft Entra ID.

1. The developer portal requests a token from Microsoft Entra ID using the client-app credentials.

1. After successful validation, Microsoft Entra ID issues the access/refresh token.




## Configure managed identity

 1. Enable a system-assigned [managed identity for API Management](api-management-howto-use-managed-service-identity.md) in your API Management instance.
    
    * Take note of the identity's **Object (principal) ID**.
    
1. Assign the identity the **Application Administrator** RBAC role in Microsoft Entra ID. To assign the role:

    1. Sign in to the portal and navigate to **Microsoft Entra** 
    1. In the left menu, select **Manage** > **Roles and administrators**.
    1. Select **Application administrator**.
    1. In the left menu, select **Manage** > **Assignments** > **+ Add assignments**.
    1. In the **Add assignments** pane, search for the API Management instance's managed identity by name or object (prinicipal) ID, select it, and then select **Add**.


## Enable OAuth 2.0 authorization for product

To enable OAuth 2.0 authorization for a product, you must first enable **Application based access** in the product settings. This setting automatically creates a client application in Microsoft Entra ID for this product.

1. Sign in to the Azure portal at the following URL () and navigate to your API Management instance.
1. In the left menu, under **APIs**, select **Products**.
1. Select the product you want to enable OAuth 2.0 authorization for. For this example, select the **Starter** product.
1. In the left menu, under **Product**, select **Properties**.
1. Enable **Application based access**.
1. Select **Save**.

:::image type="content" source="media/applications/enable-application-based-access.png" alt-text="Screenshot of enabling application based access in the portal.":::



## Create application in Microsoft Entra ID

## Add/remove products in application

## Create token and use with API call

## List applications and get secrets in the developer portal


## Related content

