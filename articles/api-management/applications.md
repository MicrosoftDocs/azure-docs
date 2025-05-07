---
title: Create OAuth 2.0 application to access product APIs - Azure API Management
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

API Management is introducing built-in OAuth 2.0 application-based access to products using the client credentials flow. API managers and developers can use applications to simplify securing access to APIs using OAuth 2.0 authorization.

With this feature:

* An API manager configures a product to use application based access, and registers a client application in Microsoft Entra ID that restricts access to the product's APIs. 
* Developers obtain application credentials from the developer portal to generate OAuth 2.0 tokens from Microsoft Entra ID. 
* A developer (or client app) can then use the OAuth 2.0 client credentials flow to obtain OAuth 2.0 tokens that are passed to the API Management gateway for authorization to the product's APIs. 

> [!IMPORTANT]
> This feature is in private preview. Ensure that you can create an API Management instance in an Early Updates Access Program (EUAP) region. See detailed [Prerequisites](#prerequisites).
>

This article describes the following steps:

* Enable application-based access for a product in API Management
* Create a client application in API Management that restricts access to the product
* View the client application in the developer portal and get credentials to the product's APIs
* Test OAuth 2.0 token-based access to the product's associated API


<!-- Clarify personas
This feature enables:

* API Management gateway can now authorize product/API access using OAuth token **in client credentials flow**
* API managers can identify products which have OAuth authorization enabled
* API managers can create client applications and assign access to products
* Developers can view all client applications and use OAuth token to get secure access to product/API
-->

## Prerequisites

- An API Management instance deployed in one of the Azure Early Updates Access Program (EUAP) regions, such as Central US EUAP. To create an API Management service instance, see [Create an API Management service instance](get-started-create-service-instance.md). The API Management instance must be in the **Premium**, **Standard**, **Basic**, or **Developer** tier.

    > [!NOTE]
    > If you don't have access to an EUAP region, you can [request it](/troubleshoot/azure/general/region-access-request-process) through the Azure portal.

- At least one product in your API Management instance, with at least one API assigned to it. If you haven't yet created a product, see [Create and publish a product](api-management-howto-add-products.md). 
    For testing, you can use the default **Starter** product and the **Echo** API that's added to it. The product should be in the **Published** state so that it can be accessed by developers through the developer portal.

- Sufficient permissions tenant to assign the **Application Administrator** role in Microsoft Entra, which requires at least the **Privileged Role Administrator** role.

- Optionally, add one or more [users](api-management-howto-create-or-invite-developers.md) in your API Management instance. 

[!INCLUDE [azure-powershell-requirements-no-header](~/reusable-content/ce-skilling/azure/includes/azure-powershell-requirements-no-header.md)]

<!-- Clarify personas for API Management and developer portal. -->

## Configure managed identity

 1. Enable a system-assigned [managed identity for API Management](api-management-howto-use-managed-service-identity.md) in your API Management instance.
    
    * Take note of the identity's **Object (principal) ID**.
    
1. Assign the identity the **Application Administrator** RBAC role in Microsoft Entra ID. To assign the role:

    1. Sign in to the portal and navigate to **Microsoft Entra ID**. 
    1. In the left menu, select **Manage** > **Roles and administrators**.
    1. Select **Application administrator**.
    1. In the left menu, select **Manage** > **Assignments** > **+ Add assignments**.
    1. In the **Add assignments** pane, search for the API Management instance's managed identity by name or object (principal) ID, select it, and then select **Add**.


## Enable application based access for product

Follow these steps to enable **Application based access** for a product. A product must have this setting enabled to be associated with a client application in later steps. 

The following example uses the **Starter** product, but choose any published product that has at least one API assigned to it.


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

Enabling application based access create a backend enterprise application in Microsoft Entra ID to represent the product.  

The application is named with the following format: **APIMProductApplication\<product-name\>**. For example, if the product name is **Starter**, the application name is **APIMProductApplicationStarter**. The application has an **App role** defined.

Review application settings in **App registrations**:

1. Sign in to the Azure portal and navigate to **Microsoft Entra ID** > **Manage** > **App registrations**.
1. Select **All applications**.
1. Search for and select the application created by API Management.
1. In the left menu, under **Manage**, select **App roles**.
1. Confirm that an application role was set by Azure API Management, as shown in the following screenshot:

:::image type="content" source="media/applications/application-roles.png" alt-text="Screenshot of app roles in the portal.":::

## Create client application to access product

Now create a client application that is registered in Microsoft Entra ID and restricts access to one or more products. 

* A product must have **Application based access** enabled to be associated with a client application. 
* Each client application has a single user (owner) in the API Management instance that can access product APIs through the application.
* A product can be associated with more than one client application.

1. Sign in to the Azure portal at the following test URL:

    [`https://portal.azure.com/?showversion=true&feature.customPortal=false&Microsoft_Azure_ApiManagement=javierbo2&applicationNewRoleValueFormat=true`](https://portal.azure.com/?showversion=true&feature.customPortal=false&Microsoft_Azure_ApiManagement=javierbo2&applicationNewRoleValueFormat=true)
1. Navigate to your API Management instance.
1. In the left menu, under **APIs**, select **Applications** > **+ Register application**.
1. In the **Register an application** pane, enter the following application settings:
    * **Name**: Enter a name for the application. 
    * **Owner**: Select the owner of the application from the dropdown list of users in the API Management instance. 
    * **Grant access to selected products**: Select one or more products in the API Management instance that have **Application based access** enabled, such as the **Starter** product (see [Enable application based access for product](#enable-application-based-access-for-product)). 
    * **Description**: Optionally enter a description.

    :::image type="content" source="media/applications/register-application.png" alt-text="Screenshot of application settings in the portal.":::
1. Select **Register**.

The application is added to the list of applications on the **Applications** pane. A client secret is automatically generated for the application. The client secret is used to obtain an OAuth token from the client application in the client credentials flow.

<!-- Where would client secret show? Should customer store it somewhere? -->

## Review client application settings

Review the settings for the client application in Microsoft Entra ID.

The application is named with the following format: **APIMApplication\<product-name\>**. For example, if the product name is **Starter**, the application name is similar to **APIMApplicationStarter**. 

Review application settings in **App registrations**:

1. Sign in to the Azure portal and navigate to **Microsoft Entra ID** > **Manage** > **App registrations**.
1. Select **All applications**.
1. Search for and select the client application created by API Management.
1. In the left menu, under **Manage**, select **API permissions**.
1. Confirm that the application has permissions to access the backend product application or applications.

    For example, if the client application grants access to the **Starter** product, the application has **Product.Starter.All** permissions to access the **APIMProductApplicationStarter** application. 

    <!-- Insert screenshot -->


## List applications and get secrets in the developer portal

[TBD]

## Create token and use with API call

A developer or client app can run the following Azure PowerShell scripts to call the client application to generate a token, and then use the token to call a product API in API Management.

> [!CAUTION]
> The following scripts are examples for testing purposes only. In production, use a secure method to store and retrieve the client secret. 

### Call client application to generate token


```powershell

# Replace placeholder values with your own values.

$clientId = "00001111-aaaa-2222-bbbb-3333cccc4444" # Client (application) ID of client application
$clientSecret = "******" # Retrieve secret of client application in developer portal
$scopeOfOtherApp = "api://055556666-ffff-7777-aaaa-8888bbbb9999/.default" # Value of Audience in product properties
$tenantId = "aaaabbbb-0000-cccc-1111-dddd2222eeee" # Your tenant id

$body = @{
    grant_type    = "client_credentials"
    client_id     = $clientId
    client_secret = $clientSecret
    scope         = $scopeOfOtherApp
}
$response = Invoke-RestMethod -Method Post -Uri "https://login.microsoftonline.com/$tenantId/oauth2/v2.0/token" -ContentType "application/x-www-form-urlencoded" -Body $body
$token = $response.access_token
```

### Call product API using token

The token generated in the previous step is used to call a product API. The token is passed in the **Authorization** header of the request. The API Management instance validates the token and authorizes access to the API. The following is an example call to the echo API.

```powershell

# Gatewate endpoint to call. Update with URI of API operation you want to call.
$uri = "https://<gateway-hostname>/echo/resource?param1=sample"
# $token is the token generated in the previous step.
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


## Related content

* [Create and publish a product](api-management-howto-add-products.md)
* [Authentication and authorization to APIs in API Management](authentication-authorization-overview.md)

