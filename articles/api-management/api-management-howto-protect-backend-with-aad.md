---
title: Protect API backend in API Management using OAuth 2.0 and Azure Active Directory 
titleSuffix: Azure API Management
description: Learn how to secure user access to a web API backend in Azure API Management with OAuth 2.0 user authorization and Azure Active Directory.
services: api-management
author: dlepow
ms.service: api-management
ms.topic: article
ms.date: 04/21/2022
ms.author: danlep
ms.custom: contperf-fy21q1
---

# Protect a web API backend in Azure API Management using OAuth 2.0 authorization with Azure Active Directory 

In this article, you'll learn a basic scenario to configure your [Azure API Management](api-management-key-concepts.md) instance to protect an API, by using the [OAuth 2.0 protocol with Azure Active Directory (Azure AD)](../active-directory/develop/active-directory-v2-protocols.md). 

> [!NOTE]
> This feature is available in the **Developer**, **Basic**, **Standard**, and **Premium** tiers of API Management.  
> 
## Prerequisites

Prior to following the steps in this article, you must have:

- An API Management instance
- A published API using the API Management instance
- An Azure AD tenant

## Overview

This article includes the following high-level steps to configure Azure AD to represent the API and to configure a policy to validate the OAuth token. Details about OAuth authorization flows and generating OAuth tokens for use in calling APIs in API Management are beyond the scope of this article. 

* Learn more about [OAuth grant types](https://oauth.net/2/grant-types/).

* For information about the authorization code flow with Azure AD, see [Microsoft identity platform and OAuth 2.0 authorization code flow](../active-directory/develop/v2-oauth2-auth-code-flow.md). 

* For an end-to-end example of configuring OAuth 2.0 authorization in the API Management developer portal, see [How to authorize developer accounts using OAuth 2.0 in Azure API Management](api-management-howto-oauth2.md).

:::image type="content" source="media/api-management-howto-protect-backend-with-aad/overview-graphic-2021.png" alt-text="Overview graphic to visually conceptualize the following flow.":::

1. Register an application (backend-app) in Azure AD to represent the API.

1. Add the **validate-jwt** policy to validate the OAuth token for every incoming request.

## 1. Register an application in Azure AD to represent the API

Using the Azure portal, protect an API with Azure AD by registering an application that represents the API in Azure AD. 

For details about app registration, see [Quickstart: Configure an application to expose a web API](../active-directory/develop/quickstart-configure-app-expose-web-apis.md).

1. In the [Azure portal](https://portal.azure.com), search for and select **App registrations**.

1. Select **New registration**. 

1. When the **Register an application page** appears, enter your application's registration information:

   - In the **Name** section, enter a meaningful application name that will be displayed to users of the app, such as *backend-app*. 
   - In the **Supported account types** section, select an option that suits your scenario. 

1. Leave the [**Redirect URI**](../active-directory/develop/reply-url.md) section empty.

1. Select **Register** to create the application. 

1. On the app **Overview** page, find the **Application (client) ID** value and record it for later.

1. Under the **Manage** section of the side menu, select **Expose an API** and set the **Application ID URI** with the default value. Record this value for later.

1. Select the **Add a scope** button to display the **Add a scope** page:
    1. Enter a new **Scope name**, **Admin consent display name**, and **Admin consent description**.
    1. Make sure the **Enabled** scope state is selected.

1. Select the **Add scope** button to create the scope. 

1. Repeat the previous two steps to add all scopes supported by your API.

1. Once the scopes are created, make a note of them for use later. 

## 2. Configure a JWT validation policy to pre-authorize requests

Users or services will acquire an access token from Azure AD (not shown) and send the token in the authorization header. In the inbound policy the token can be validated. 

Pre-authorize requests in API Management with the [validate JWT](./api-management-access-restriction-policies.md#ValidateJWT) policy, by validating the access tokens of each incoming request. If a request does not have a valid token, API Management blocks it. 

The following example policy, when added to the `<inbound>` policy section, checks the value of the audience claim in an access token obtained from Azure AD, and returns an error message if the token is not valid. 


```xml
<validate-jwt header-name="Authorization" failed-validation-httpcode="401" failed-validation-error-message="Unauthorized. Access token is missing or invalid.">
    <openid-config url="https://login.microsoftonline.com/{aad-tenant}/v2.0/.well-known/openid-configuration" />
    <required-claims>
        <claim name="aud">
            <value>{backend-api-application-client-id}</value>
        </claim>
    </required-claims>
</validate-jwt>
```

> [!NOTE]
> The above `openid-config` URL corresponds to the v2 endpoint. For the v1 `openid-config`endpoint, use `https://login.microsoftonline.com/{aad-tenant}/.well-known/openid-configuration`.

> [!TIP] 
> Find the **{aad-tenant}** value as your Azure AD tenant ID in the Azure portal, either on:
> * The overview page of your Azure AD resource, or
> * The **Manage > Properties** page of your Azure AD resource.

For information on how to configure policies, see [Set or edit policies](./set-edit-policies.md).

## Build an application to call the API

This article did not provide guidance about creating a client application to call an API in API Management protected by OAuth 2.0.

* To learn more about how to build an application and implement OAuth* 2.0, see [Azure AD code samples](../active-directory/develop/sample-v2-code.md).

* For an end-to-end example, see [How to authorize developer accounts using OAuth 2.0 in Azure API Management](api-management-howto-oauth2.md).


## Next steps

- Learn more about [Azure AD and OAuth2.0](../active-directory/develop/authentication-vs-authorization.md).
- For other ways to secure your back-end service, see [Mutual Certificate authentication](./api-management-howto-mutual-certificates.md).

