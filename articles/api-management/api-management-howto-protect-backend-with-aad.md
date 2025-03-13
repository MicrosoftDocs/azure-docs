---
title: Protect API in API Management - OAuth 2.0 and Microsoft Entra ID
titleSuffix: Azure API Management
description: Learn how to secure user access to an API in Azure API Management with OAuth 2.0 user authorization and Microsoft Entra ID.
services: api-management
author: dlepow
ms.service: azure-api-management
ms.topic: how-to
ms.date: 02/20/2025
ms.author: danlep
---

# Protect an API in Azure API Management using OAuth 2.0 authorization with Microsoft Entra ID 

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

In this article, you'll learn high level steps to configure your [Azure API Management](api-management-key-concepts.md) instance to protect an API, by using the [OAuth 2.0 protocol with Microsoft Entra ID](../active-directory/develop/active-directory-v2-protocols.md).

For a conceptual overview of API authorization options in API Management, see [Authentication and authorization to APIs in API Management](authentication-authorization-overview.md). 

## Prerequisites

Prior to following the steps in this article, you must have:

- An API Management instance
- A published API using the API Management instance
- A Microsoft Entra tenant where you have permissions to create an app regisgtration

## Overview

Follow these steps to protect an API in API Management, using OAuth 2.0 authorization with Microsoft Entra ID.

1. Register an application (called *backend-app* in this article) in Microsoft Entra ID to represent the API. 
1. Register an application to represent the client app that calls the API and that obtains tokens from Microsoft Entra ID. This step is not covered in this article because the configuration is dependent on the 
1. Configure the [validate-azure-ad-token](validate-azure-ad-token-policy.md) policy in API Management to validate the OAuth token presented in each incoming API request. Requests with valid tokens are passed to the backend API. Depending on your scenario, your backend API could independently validate the token.

## Register an application in Microsoft Entra ID to represent the API

Using the Azure portal, first register an application that represents the API. 

For details about app registration, see [Quickstart: Configure an application to expose a web API](/entra/identity-platform/quickstart-configure-app-expose-web-apis).

1. In the [Azure portal](https://portal.azure.com), search for and select **App registrations**.

1. Select **+ New registration**. 

1. On the **Register an application** page, enter your application's registration information:

   - In the **Name** section, enter a meaningful application name that is displayed to users of the app, such as *backend-app*. 
   - In the **Supported account types** section, select an option that suits your scenario. 

1. Leave the [**Redirect URI**](/entra/identity-platform/reply-url) section empty.

1. Select **Register** to create the application. 

1. On the app **Overview** page, find the **Application (client) ID** value and record it for later.

1. Under the **Manage** section of the side menu, select **Expose an API**. **Add** the **Application ID URI** with the default value. Record this value for later.

1. On the **Expose an API** page, select **+ Add a scope** to display the **Add a scope** page.
    1. Enter a new **Scope name** for a scope that's supported by the API (for example, **Files.Read**).
    1. In **Who can consent?**, make a selection for your scenario, such as **Admins and users**. Select **Admins only** for higher privileged environments.
    1. Enter **Admin consent display name** and **Admin consent description**.
    1. Make sure the **Enabled** scope state is selected.
    1. Select **Add scope** to create the scope. 

1. Repeat the previous step to add all scopes supported by your API.

1. Once the scopes are created, make a note of them for use later. 


## Register an application in Microsoft Entra ID to represent the client app

While not shown in this article, in most scenarios you would register a second application in Microsoft Entra ID (*client-app*) to represent a client application that calls the API. The app registration must have permissions to call the backend app. Details about app registration are specific to your scenario.

Configure the client application to use Microsoft Entra ID to request valid OAuth tokens granting access to the API. Present the token in the request to API Management (for example, in an Authorization header). 

Development of a client application that uses Microsoft Entra ID to request valid OAuth tokens is beyond the scope of this article and specific to your scenario. For examples and guidance, see [Microsoft identity platform code samples](entra/identity-platform/sample-v2-code). 


## Configure a token validation policy to preauthorize requests

[!INCLUDE [api-management-configure-validate-jwt](../../includes/api-management-configure-validate-jwt.md)]


## Authorization workflow

THe following steps make up a typical authorization workflow for an API in API Management that uses OAuth 2.0 authorization with Microsoft Entra ID.

1. A user or application acquires a token from Microsoft Entra ID with permissions that grant access to the backend-app. If you use the v2 endpoint, ensure that the accessTokenAcceptedVersion property is set to 2 in the application manifest of the backend-app and any client app that you configure.

1. The token is added in the Authorization header of API requests to API Management. 

1. API Management validates the token by using the `validate-azure-ad-token` policy. 

    * If a request doesn't have a valid token, API Management blocks it. 

    * If a request is accompanied by a valid token, the gateway can forward the request to the API. 

## Related content

* To learn more about how to build an application and implement OAuth 2.0, see [Microsoft Entra code samples](../active-directory/develop/sample-v2-code.md).

* For an end-to-end example of configuring OAuth 2.0 user authorization in the API Management developer portal, see [How to authorize test console of developer portal by configuring OAuth 2.0 user authorization](api-management-howto-oauth2.md).

- Learn more about [Microsoft Entra ID and OAuth2.0](../active-directory/develop/authentication-vs-authorization.md).

- Learn more about [authentication and authorization options](authentication-authorization-overview.md) in API Management.
