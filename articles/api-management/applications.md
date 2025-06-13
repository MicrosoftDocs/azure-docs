---
title: Securely Access Products and APIs - Microsoft Entra Applications - Azure API Management
titleSuffix: Azure API Management
description: Configure OAuth 2.0 access to product APIs in Azure API Management with Microsoft Entra ID applications.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: how-to
ms.date: 05/19/2025
ms.author: danlep
ms.custom:
  - build-2025
---
# Securely access products and APIs with Microsoft Entra applications

[!INCLUDE [api-management-availability-premium-dev-standard-basic](../../includes/api-management-availability-premium-dev-standard-basic.md)]

API Management now supports built-in OAuth 2.0 application-based access to product APIs using the client credentials flow. This feature allows API managers to register Microsoft Entra ID applications, streamlining secure API access for developers through OAuth 2.0 authorization.

> [!NOTE]
> Applications are currently in limited preview. To sign up, fill [this form](https://aka.ms/apimappspreview).

With this feature:

* API managers set a product property to enable application-based access.
* API managers register client applications in Microsoft Entra ID to limit access to specific products. 
* Using the OAuth 2.0 client credentials flow, developers or apps obtain tokens that they can include in API requests
* Tokens presented in API requests are validated by the API Management gateway to authorize access to the product's APIs.

## Prerequisites

- An API Management instance deployed in the **Premium**, **Standard**, **Basic**, or **Developer** tier. If you need to deploy an instance, see [Create an API Management service instance](get-started-create-service-instance.md).

- At least one product in your API Management instance, with at least one API assigned to it. 
    * The product should be in the **Published** state so that it can be accessed by developers through the developer portal.
    * For testing, you can use the default **Starter** product and the **Echo** API that's added to it. 
    * If you want to create a product, see [Create and publish a product](api-management-howto-add-products.md). 

- Sufficient permissions in your Microsoft Entra tenant to assign the **Application Administrator** role, which requires at least the **Privileged Role Administrator** role.

- Optionally, add one or more [users](api-management-howto-create-or-invite-developers.md) in your API Management instance. 

[!INCLUDE [azure-powershell-requirements-no-header](~/reusable-content/ce-skilling/azure/includes/azure-powershell-requirements-no-header.md)]

## Configure managed identity

 1. Enable a system-assigned [managed identity for API Management](api-management-howto-use-managed-service-identity.md) in your API Management instance.
        
1. Assign the identity the **Application Administrator** RBAC role in Microsoft Entra ID. To assign the role:

    1. Sign in to the [portal](https://portal.azure.com) and navigate to **Microsoft Entra ID**. 
    1. In the left menu, select **Manage** > **Roles and administrators**.
    1. Select **Application administrator**.
    1. In the left menu, select **Manage** > **Assignments** > **+ Add assignments**.
    1. In the **Add assignments** page, search for the API Management instance's managed identity by name (the name of the API Management instance). Select the managed identity, and then select **Add**.

## Enable application based access for product

Follow these steps to enable **Application based access** for a product. A product must have this setting enabled to be associated with a client application in later steps. 

The following example uses the **Starter** product, but choose any published product that has at least one API assigned to it.

1. Sign in to the [portal](https://portal.azure.com) and navigate to your API Management instance.
1. In the left menu, under **APIs**, select **Products**.
1. Choose the product that you want to configure, such as the **Starter** product.
1. In the left menu, under **Product**, select **Properties**.
1. In the **Application based access** section, enable the **OAuth 2.0 token (most secure)** setting.
1. Optionally, enable the **Subscription key** setting. If you enable both application based access and a subscription requirement, the API Management gateway can accept either an OAuth 2.0 token or a subscription key for access to the product's APIs.
1. Select **Save**.

:::image type="content" source="media/applications/enable-application-based-access.png" alt-text="Screenshot of enabling application based access in the portal.":::

> [!TIP]
> You can also enable the **OAuth 2.0 token** setting when creating a new product.

 Enabling application based access creates a backend enterprise application in Microsoft Entra ID to represent the product. The backend application ID is displayed in the product's **Properties** page.

:::image type="content" source="media/applications/product-application-settings.png" alt-text="Screenshot of product's application settings in the portal.":::

> [!NOTE]
> This application ID is set as the **Audience** value when creating a client application to access the product. Also use this value when generating a token to call the product API.
> 

## (Optional) Review product application settings in Microsoft Entra ID

Optionally review settings of the backend enterprise application created in Microsoft Entra ID to represent the product. 

The application is named with the following format: **APIMProductApplication\<product-name\>**. For example, if the product name is **Starter**, the application name is **APIMProductApplicationStarter**. The application has an **App role** defined.

To review application settings in **App registrations**:

1. Sign in to the [portal](https://portal.azure.com) and navigate to **Microsoft Entra ID** > **Manage** > **App registrations**.
1. Select **All applications**.
1. Search for and select the application created by API Management.
1. In the left menu, under **Manage**, select **App roles**.
1. Confirm the application role that set by Azure API Management, as shown in the following screenshot:

:::image type="content" source="media/applications/application-roles.png" alt-text="Screenshot of app roles in the portal.":::

## Register client application to access product

Now register a client application that limits access to one or more products. 

* A product must have **Application based access** enabled to be associated with a client application. 
* Each client application has a single user (owner) in the API Management instance. One the owner can access product APIs through the application.
* A product can be associated with more than one client application.

1. Sign in to the [portal](https://portal.azure.com) and navigate to your API Management instance.
1. In the left menu, under **APIs**, select **Applications** > **+ Register application**.
1. In the **Register an application** page, enter the following application settings:
    * **Name**: Enter a name for the application. 
    * **Owner**: Select the owner of the application from the dropdown list of users in the API Management instance. 
    * **Grant access to selected products**: Select one or more products in the API Management instance that were previously enabled for **Application based access**. 
    * **Description**: Optionally enter a description.

    :::image type="content" source="media/applications/register-application.png" alt-text="Screenshot of application settings in the portal.":::
1. Select **Register**.

The application is added to the list of applications on the **Applications** page. Select the application to view details such as the **Client ID**. You need this ID to generate a token to call the product API.

> [!TIP]
> * After creating an application, optionally associate it with other products. Select the application on the **Applications** page, and then select **Details** > **Products** > **+ Add product**. 
> * You can also create or associate an application by editing a product from the **Products** page.

## Generate client secret

A client secret must be generated for the client application to use the OAuth 2.0 client credentials flow. The secret is valid for one year but can be regenerated at any time.

1. On the **Applications** page, select the application that you created.
1. On the application's **Overview** page, next to **Client Secret**, select **Add secret**.
1. On the **New client secret** page, select **Generate**.
    
    A client secret is generated and displayed in the **Client secret** field. Make sure to copy the secret value and store it securely. You won't be able to retrieve it again after you close the page.
1. Select **Close**.

## (Optional) Review client application settings in Microsoft Entra ID

Optionally review settings of the client application in Microsoft Entra ID. 

The application is named with the following format: **APIMApplication\<product-name\>**. For example, if the product name is **Starter**, the application name is similar to **APIMApplicationStarter**. 

To review application settings in **App registrations**:

1. Sign in to the [portal](https://portal.azure.com) and navigate to **Microsoft Entra ID** > **Manage** > **App registrations**.
1. Select **All applications**.
1. Search for and select the client application created by API Management.
1. In the left menu, under **Manage**, select **API permissions**.
1. Confirm that the application has permissions to access the backend product application or applications.

    For example, if the client application grants access to the **Starter** product, the application has **Product.Starter.All** permissions to access the **APIMProductApplicationStarter** application. 

    :::image type="content" source="media/applications/client-api-permissions.png" alt-text="Screenshot of API permissions in the portal.":::  


## Create token and use with API call

After you enable application-based access for a product and register a client application, a developer or app can generate a token to call the product's APIs. The token must be included in the `Authorization` header of a request.

For example, a developer or app can run the following Azure PowerShell scripts to call the client application to generate a token, and then use the token to call a product API in API Management.

> [!CAUTION]
> The following scripts are examples for testing purposes only. In production, use a secure method to store and retrieve the client secret. 

### Call client application to generate token


```powershell
# Replace placeholder values with your own values.

$clientId = "00001111-aaaa-2222-bbbb-3333cccc4444" # Client (application) ID of client application
$clientSecret = "******" # Retrieve secret of client application in developer portal
$scopeOfOtherApp = "api://55556666-ffff-7777-aaaa-8888bbbb9999/.default" # Value of Audience in product properties
$tenantId = "aaaabbbb-0000-cccc-1111-dddd2222eeee" # Directory (tenant) ID in Microsoft Entra ID

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

The token generated in the previous step is used to call a product API. The token is passed in the **Authorization** header of the request. The API Management instance validates the token and authorizes access to the API. 

The following script shows an example call to the echo API.

```powershell
# Gatewate endpoint to call. Update with URI of API operation you want to call.
$uri = "https://<gateway-hostname>/echo/resource?param1=sample"
$headers = @{
   "Authorization" = "Bearer $token"  # $token is the token generated in the previous script.
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

