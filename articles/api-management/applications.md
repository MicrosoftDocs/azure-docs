---
title: Create OAuth application access to product - Azure API Management
titleSuffix: Azure API Management
description: Learn how to configure OAuth 2.0 application-based access to products in Azure API Management, including prerequisites and step-by-step guidance.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: how-to
ms.date: 05/06/2025
ms.author: danlep
ms.custom: 
---

# Create and authorize access to products using OAuth 2.0 application 

[!INCLUDE [api-management-availability-premium-dev-standard-basic](../../includes/api-management-availability-premium-dev-standard-basic.md)]

API Management is introducing built-in OAuth 2.0 application-based access to products using the client credentials flow. 

With this feature, an API manager configures an application in Microsoft Entra ID to represent a product, and registers a client application in Microsoft Entra ID that restricts access to the product's APIs. A developer (or client app) can then use the OAuth 2.0 client credentials flow to obtain OAuth tokens from the client application that are passed to the API Management gateway for authorization to the product's APIs.

> [!NOTE]
> This feature is in private preview. Ensure that you have received instructions to access the preview and that your subscription allows you to create an API Management instance in an Early Updates Access Program (EUAP) region. See detailed [Prerequisites](#prerequisites).
>

This article describes the following steps:

* Enable application-based access for a product in API Management.
* Create a client application in API Management that restricts access to the product.
* Test OAuth 2.0 token-based access the product's associated API.
* View the client application in the developer portal and get secure access to the product's APIs.

<!-- Clarify personas
This feature enables:

* API Management gateway can now authorize product/API access using OAuth token **in client credentials flow**
* API managers can identify products which have OAuth authorization enabled
* API managers can create client applications and assign access to products
* Developers can view all client applications and use OAuth token to get secure access to product/API
-->

## Prerequisites

- An API Management instance deployed in one of the Azure Early Updates Access Program (EUAP) regions, such as Central US EUAP. To create an API Management service instance, see [Create an API Management service instance](get-started-create-service-instance.md). The API Management instance must be in **Premium**, **Standard**, **Basic**, or **Developer** tier.

    > [!NOTE]
    > If you don't have access to an EUAP region, you can [request it](/troubleshoot/azure/general/region-access-request-process) through the Azure portal.

- At least one product in your API Management instance, with at least one API assigned to it. If you haven't yet created a product, see [Create and publish a product](api-management-howto-add-products.md). For testing, you may use the default **Starter** product and the **Echo** API that's added to it. The product should be in the **Published** state so that it can be accessed by developers through the developer portal.

- Permissions to create an app registration in your Microsoft Entra tenant.

- Permissions to assign the **Application Administrator** role, which requires at least the **Privileged Role Administrator** role in Microsoft Entra.

- Optionally, add one or more [users](api-management-howto-create-or-invite-developers.md) in your API Management instance. 

[!INCLUDE [azure-powershell-requirements-no-header](~/reusable-content/ce-skilling/azure/includes/azure-powershell-requirements-no-header.md)]


<!-- Any special considerations to access the preview - regions, special URLs, etc. -->




<!-- Clarify personas for API Management and developer portal. -->



## Configure managed identity

 1. Enable a system-assigned [managed identity for API Management](api-management-howto-use-managed-service-identity.md) in your API Management instance.
    
    * Take note of the identity's **Object (principal) ID**.
    
1. Assign the identity the **Application Administrator** RBAC role in Microsoft Entra ID. To assign the role:

    1. Sign in to the portal and navigate to **Microsoft Entra** 
    1. In the left menu, select **Manage** > **Roles and administrators**.
    1. Select **Application administrator**.
    1. In the left menu, select **Manage** > **Assignments** > **+ Add assignments**.
    1. In the **Add assignments** pane, search for the API Management instance's managed identity by name or object (principal) ID, select it, and then select **Add**.


## Enable application based access for product

Follow these steps to enable **Application based access** for a product. Enabling this setting automatically creates an application in Microsoft Entra ID to represent the selected product.


1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your API Management instance.
2. In the left menu, under **APIs**, select **Products**.
3. Choose the product you want to configure, such as the **Starter** product.
4. In the left menu, under **Product**, select **Properties**.
5. Enable the **Application based access** setting.
6. Select **Save**.

:::image type="content" source="media/applications/enable-application-based-access.png" alt-text="Screenshot of enabling application based access in the portal.":::

> [!TIP]
> You can also enable the **Application based access** setting when creating a new product. 

## Review product application settings

After you enable application based access, an enterprise application is created. 

The application is named with the following format: **APIMProductApplication<product-name>**. For example, if the product name is **Starter**, the application name is **APIMProductApplicationStarter**. The application should have an **App role** defined.

You can review application settings in **App registrations**.

1. Sign in to the Azure portal and navigate to **App registrations**.
1. Select **All applications** and search for the application created by API Management.
1. In the left menu, under **Manage**, select **App roles**.
1. Confirm that an application role was set by Azure API Management, as shown in the following screenshot:

:::image type="content" source="media/applications/application-roles.png" alt-text="Screenshot of app roles in the portal.":::

## Create client application to access product

Now create a client application that will be registered in Microsoft Entra ID and restricts to access one or more products. 

* Products must have **Application based access** enabled to be associated with a client application. 
* Each client application is associated with a single user (owner) in the API Management instance.
* A product can be associated with more than one client application.

1. Sign in to the Azure portal at the following URL (`https://portal.azure.com/?showversion=true&feature.customPortal=false&Microsoft_Azure_ApiManagement=javierbo2&applicationNewRoleValueFormat=true`) and navigate to your API Management instance.
1. In the left menu, under **APIs**, select **Applications** > **+ Register application**.
1. In the **Register an application** pane, enter the following application settings:
    * **Name**: Enter a name for the application. 
    * **Owner**: Select the owner of the application from the dropdown list of users in the API Management instance. 
    * **Grant access to selected products**: Select one or more products in the API Management instance that have **Application based access** enabled, such as the **Starter** product (see [Enable application based access for product](#enable-application-based-access-for-product)). 
    * **Description**: Optionally enter a description.

    :::image type="content" source="media/applications/register-application.png" alt-text="Screenshot of application settings in the portal.":::
1. Select **Register**.

The application is added to the list of applications on the Applications pane. A client secret is automatically generated for the application. The client secret is used to obtain an OAuth token from the client application in the client credentials flow.

<!-- Where would client secret show? Should customer store it somewhere? -->

## Review client application settings

Review the settings for the client application in Microsoft Entra ID.

The application is named with the following format: **xxxxxxTBD**. For example, if the product name is **Starter**, the application name is **APIMProductApplicationStarter**. The application should have an **App role** defined.

You can review application settings in **App registrations**.

1. Sign in to the Azure portal and navigate to **App registrations**.
1. Select **All applications** and search for the application created by API Management.
1. In the left menu, under **Manage**, select **App roles**.
1. Confirm that an application role was set by Azure API Management, as shown in the following screenshot:


## Create token and use with API call


Run the following Azure PowerShell scripts to obtain a token generated for the client application and to call a product API using the token.

<!-- Warn about secure handling of token and secrets -->

### Obtain token for client application
```powershell

# Replace placeholder values with your own values.

$clientId = "aa8029d8-83a5-4713-939d-cebac1bbd672" # Client (application) ID of client application
$clientSecret = "xxxxx" # Retrieve secret of client application in developer portal
$scopeOfOtherApp = "api://03db2e9e-efe9-4f68-b74d-911966d1a684/.default" # Audience of application audience is visible under a product
$tenantId = "e74bd0b5-f803-4e01-858b-dba7e58e55cf" # Your tenant id

$body = @{
    grant_type    = "client_credentials"
    client_id     = $clientId
    client_secret = $clientSecret
    scope         = $scopeOfOtherApp
}
$response = Invoke-RestMethod -Method Post -Uri "https://login.microsoftonline.com/$tenantId/oauth2/v2.0/token" -ContentType "application/x-www-form-urlencoded" -Body $body
$token = $response.access_token
$token
```

### Call product API using token

The token generated in the previous step is used to call a product API. The token is passed in the **Authorization** header of the request. The API Management instance validates the token and authorizes access to the API.

```powershell

# $token = "...token here..."
# Gatewate endpoint to call. Update with URI of API operation you want to call.
$uri = "https://<gateway-hostname>/echo/resource?param1=sample"
#
$headers = @{
   "Authorization" = "Bearer $token"
}
$body = @{
    "hello" = "world"
} | ConvertTo-Json -Depth 5
$getresponse = Invoke-RestMethod -Method Post -Uri $uri -ContentType "application/x-www-form-urlencoded" -Headers $headers -Body $body
Write-Host "Response:"
$getresponse | ConvertTo-Json -Depth 5
```


## List applications and get secrets in the developer portal


## Related content

* Add link here

