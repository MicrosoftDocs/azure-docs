---
title: Protect API backend in API Management using OAuth 2.0 and Azure Active Directory 
titleSuffix: Azure API Management
description: Learn how to secure user access to a web API backend in Azure API Management and the developer portal with OAuth 2.0 user authorization and Azure Active Directory.
services: api-management
author: dlepow
ms.service: api-management
ms.topic: article
ms.date: 09/17/2021
ms.author: danlep
ms.custom: contperf-fy21q1
---

# Protect a web API backend in Azure API Management using OAuth 2.0 authorization with Azure Active Directory 

In this article, you'll learn how to configure your [Azure API Management](api-management-key-concepts.md) instance to protect an API, by using the [OAuth 2.0 protocol with Azure Active Directory (Azure AD)](../active-directory/develop/active-directory-v2-protocols.md). 

You can configure authorization for developer accounts using other OAuth 2.0 providers. For more information, see [How to authorize developer accounts using OAuth 2.0 in Azure API Management](api-management-howto-oauth2.md).

> [!NOTE]
> This feature is available in the **Developer**, **Basic**, **Standard**, and **Premium** tiers of API Management.  
> 
> You can follow every step below in the **Consumption** tier, except for calling the API from the developer portal.

## Prerequisites

Prior to following the steps in this article, you must have:

- An API Management instance
- A published API using the API Management instance
- An Azure AD tenant

## Overview

:::image type="content" source="media/api-management-howto-protect-backend-with-aad/overview-graphic-2021.png" alt-text="Overview graphic to visually conceptualize the following flow.":::

1. Register an application (backend-app) in Azure AD to represent the API.

1. Register another application (client-app) in Azure AD to represent a client application that needs to call the API.

1. In Azure AD, grant permissions to allow the client-app to call the backend-app.

1. Configure the developer console in the developer portal to call the API using OAuth 2.0 user authorization.

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

1. Repeat steps 8 and 9 to add all scopes supported by your API.

1. Once the scopes are created, make a note of them for use in a subsequent step. 

## 2. Register another application in Azure AD to represent a client application

Register every client application that calls the API as an application in Azure AD. In this example, the client application is the **developer console** in the API Management developer portal. 

To register another application in Azure AD to represent the Developer Console:

1. In the [Azure portal](https://portal.azure.com), search for and select **App registrations**.

1. Select **New registration**.

1. When the **Register an application page** appears, enter your application's registration information:

   - In the **Name** section, enter a meaningful application name that will be displayed to users of the app, such as *client-app*. 
   - In the **Supported account types** section, select **Accounts in any organizational directory (Any Azure AD directory - Multitenant)**. 

1. In the **Redirect URI** section, select `Web` and leave the URL field empty for now.

1. Select **Register** to create the application. 

1. On the app **Overview** page, find the **Application (client) ID** value and record it for later.

1. Create a client secret for this application to use in a subsequent step.

   1. Under the **Manage** section of the side menu, select **Certificates & secrets**.
   1. Under **Client secrets**, select **New client secret**.
   1. Under **Add a client secret**, provide a **Description** and choose when the key should expire.
   1. Select **Add**.

When the secret is created, note the key value for use in a subsequent step. 

## 3. Grant permissions in Azure AD

Now that you have registered two applications to represent the API and the Developer Console, grant permissions to allow the client-app to call the backend-app.  

1. In the [Azure portal](https://portal.azure.com), search for and select **App registrations**.

1. Choose your client app. Then in the list of pages for the app, select **API permissions**.

1. Select **Add a Permission**.

1. Under **Select an API**, select **My APIs**, and then find and select your backend-app.

1. Select **Delegated Permissions**, then select the appropriate permissions to your backend-app.

1. Select **Add permissions**.

Optionally:
1. Navigate to your client app's **API permissions** page.

1. Select **Grant admin consent for \<your-tenant-name>** to grant consent on behalf of all users in this directory. 

## 4. Enable OAuth 2.0 user authorization in the Developer Console

At this point, you have created your applications in Azure AD, and have granted proper permissions to allow the client-app to call the backend-app. 

In this example, you enable OAuth 2.0 user authorization in the developer console (the client app).

1. In the Azure portal, find the **Authorization endpoint URL** and **Token endpoint URL** and save them for later. 
    1. Open the **App registrations** page. 
    1. Select **Endpoints**.
    1. Copy the **OAuth 2.0 Authorization Endpoint** and the **OAuth 2.0 Token Endpoint**. 

1. Browse to your API Management instance.

1. Under the **Developer portal** section in the side menu, select **OAuth 2.0 + OpenID Connect**. 

1. Under the **OAuth 2.0** tab, select **Add**.

1. Provide a **Display name** and **Description**.

1. For the **Client registration page URL**, enter a placeholder value, such as `http://localhost`. 
    * The **Client registration page URL** points to a page where users create and configure their own accounts supported by OAuth 2.0 providers. 
    * We use a placeholder, since, in this example, users do not create and configure their own accounts.

1. For **Authorization grant types**, select **Authorization code**.

1. Specify the **Authorization endpoint URL** and **Token endpoint URL** you saved earlier: 
    1. Copy and paste the **OAuth 2.0 Authorization Endpoint** into the **Authorization endpoint URL** text box. 
    1. Select **POST** under Authorization request method.
    1. Enter the **OAuth 2.0 Token Endpoint**, and paste it into the **Token endpoint URL** text box. 
        * If you use the **v1** endpoint:
          * Add a body parameter named **resource**.
          * Enter the back-end app **Application ID** for the value.
        * If you use the **v2** endpoint:
          * Use the back-end app scope you created in the **Default scope** field.
          * Set the value for the [`accessTokenAcceptedVersion`](../active-directory/develop/reference-app-manifest.md#accesstokenacceptedversion-attribute) property to `2` in your [application manifest](../active-directory/develop/reference-app-manifest.md).
          

   >[!IMPORTANT]
   > While you can use either **v1** or **v2** endpoints, we recommend using v2 endpoints. 

1. Specify the client app credentials:
    * For **Client ID**, use the **Application ID** of the client-app.
    * For **Client secret**, use the key you created for the client-app earlier. 

1. Make note of the **Redirect URI** for the authorization code grant type.

1. Select **Create**.

1. Return to your client-app registration. 
 
1. Under **Manage**, select **Authentication**.

1. Under **Platform configurations**:
    * Click on **Add a platform**.
    * Select the type as **Web**. 
    * Paste the redirect URI you saved earlier under **Redirect URIs**.
    * Click on **Configure** button to save.

   Now that the developer console can obtain access tokens from Azure AD via your OAuth 2.0 authorization server, enable OAuth 2.0 user authorization for your API. This enables the developer console to know that it needs to obtain an access token on behalf of the user, before making calls to your API.

1. Browse to your API Management instance, and go to **APIs**.

1. Select the API you want to protect. For example, `Echo API`.

1. Go to **Settings**.

1. Under **Security**:
    1. Choose **OAuth 2.0**.
    1. Select the OAuth 2.0 server you configured earlier. 

1. Select **Save**.

## 5. Successfully call the API from the developer portal

> [!NOTE]
> This section does not apply to the **Consumption** tier, as it does not support the developer portal.

[!INCLUDE [api-management-test-oauth-authorization](../../includes/api-management-test-oauth-authorization.md)]

## 6. Configure a JWT validation policy to pre-authorize requests

So far:
* You've tried to make a call from the developer console.
* You've been prompted and have signed into the Azure AD tenant. 
* The developer console obtains an access token on your behalf, and includes the token in the request made to the API.

However, what if someone calls your API without a token or with an invalid token? For example, if you call the API without the `Authorization` header, the call will still go through, since API Management does not validate the access token. It simply passes the `Authorization` header to the back-end API.

Pre-authorize requests in API Management with the [Validate JWT](./api-management-access-restriction-policies.md#ValidateJWT) policy, by validating the access tokens of each incoming request. If a request does not have a valid token, API Management blocks it. 

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

In this guide, you used the developer console in API Management as the sample client application to call the `Echo API` protected by OAuth 2.0. To learn more about how to build an application and implement OAuth 2.0, see [Azure AD code samples](../active-directory/develop/sample-v2-code.md).

## Next steps

- Learn more about [Azure AD and OAuth2.0](../active-directory/develop/authentication-vs-authorization.md).
- Check out more [videos](https://azure.microsoft.com/documentation/videos/index/?services=api-management) about API Management.
- For other ways to secure your back-end service, see [Mutual Certificate authentication](./api-management-howto-mutual-certificates.md).
- [Create an API Management service instance](./get-started-create-service-instance.md).
- [Manage your first API](./import-and-publish.md).
