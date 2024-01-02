---
title: Protect API in API Management using OAuth 2.0 and Microsoft Entra ID 
titleSuffix: Azure API Management
description: Learn how to secure user access to an API in Azure API Management with OAuth 2.0 user authorization and Microsoft Entra ID.
services: api-management
author: dlepow
ms.service: api-management
ms.topic: article
ms.date: 04/27/2022
ms.author: danlep
ms.custom: contperf-fy21q1
---

# Protect an API in Azure API Management using OAuth 2.0 authorization with Microsoft Entra ID 

In this article, you'll learn high level steps to configure your [Azure API Management](api-management-key-concepts.md) instance to protect an API, by using the [OAuth 2.0 protocol with Microsoft Entra ID](../active-directory/develop/active-directory-v2-protocols.md).

For a conceptual overview of API authorization, see [Authentication and authorization to APIs in API Management](authentication-authorization-overview.md). 

## Prerequisites

Prior to following the steps in this article, you must have:

- An API Management instance
- A published API using the API Management instance
- A Microsoft Entra tenant

## Overview

Follow these steps to protect an API in API Management, using OAuth 2.0 authorization with Microsoft Entra ID.

1. Register an application (called *backend-app* in this article) in Microsoft Entra ID to protect access to the API. 

    To access the API, users or applications will acquire and present a valid OAuth token granting access to this app with each API request.

1. Configure the [validate-jwt](validate-jwt-policy.md) policy in API Management to validate the OAuth token presented in each incoming API request. Valid requests can be passed to the API.

Details about OAuth authorization flows and how to generate the required OAuth tokens are beyond the scope of this article. Typically, a separate client app is used to acquire tokens from Microsoft Entra ID that authorize access to the API. For links to more information, see the [Next steps](#next-steps).

<a name='register-an-application-in-azure-ad-to-represent-the-api'></a>

## Register an application in Microsoft Entra ID to represent the API

Using the Azure portal, protect an API with Microsoft Entra ID by first registering an application that represents the API. 

For details about app registration, see [Quickstart: Configure an application to expose a web API](../active-directory/develop/quickstart-configure-app-expose-web-apis.md).

1. In the [Azure portal](https://portal.azure.com), search for and select **App registrations**.

1. Select **New registration**. 

1. When the **Register an application page** appears, enter your application's registration information:

   - In the **Name** section, enter a meaningful application name that will be displayed to users of the app, such as *backend-app*. 
   - In the **Supported account types** section, select an option that suits your scenario. 

1. Leave the [**Redirect URI**](../active-directory/develop/reply-url.md) section empty.

1. Select **Register** to create the application. 

1. On the app **Overview** page, find the **Application (client) ID** value and record it for later.

1. Under the **Manage** section of the side menu, select **Expose an API** and set the **Application ID URI** with the default value. If you're developing a separate client app to obtain OAuth 2.0 tokens for access to the backend-app, record this value for later.

1. Select the **Add a scope** button to display the **Add a scope** page:
    1. Enter a new **Scope name**, **Admin consent display name**, and **Admin consent description**.
    1. Make sure the **Enabled** scope state is selected.

1. Select the **Add scope** button to create the scope. 

1. Repeat the previous two steps to add all scopes supported by your API.

1. Once the scopes are created, make a note of them for use later. 

## Configure a JWT validation policy to pre-authorize requests

[!INCLUDE [api-management-configure-validate-jwt](../../includes/api-management-configure-validate-jwt.md)]

## Authorization workflow

1. A user or application acquires a token from Microsoft Entra ID with permissions that grant access to the backend-app. 

1. The token is added in the Authorization header of API requests to API Management. 

1. API Management validates the token by using the `validate-jwt` policy. 

    * If a request doesn't have a valid token, API Management blocks it. 

    * If a request is accompanied by a valid token, the gateway can forward the request to the API. 

## Next steps

* To learn more about how to build an application and implement OAuth 2.0, see [Microsoft Entra code samples](../active-directory/develop/sample-v2-code.md).

* For an end-to-end example of configuring OAuth 2.0 user authorization in the API Management developer portal, see [How to authorize test console of developer portal by configuring OAuth 2.0 user authorization](api-management-howto-oauth2.md).

- Learn more about [Microsoft Entra ID and OAuth2.0](../active-directory/develop/authentication-vs-authorization.md).

- For other ways to secure your back-end service, see [Mutual certificate authentication](./api-management-howto-mutual-certificates.md).
