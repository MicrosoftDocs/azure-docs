---
title: Authorize test console of API Management developer portal using OAuth 2.0
titleSuffix: Azure API Management
description: Set up OAuth 2.0 user authorization for the test console in the Azure API Management developer portal. This example uses Microsoft Entra ID as an OAuth 2.0 provider.
services: api-management
documentationcenter: ''
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 09/12/2023
ms.author: danlep
ms.custom: engagement-fy23
---

# How to authorize test console of developer portal by configuring OAuth 2.0 user authorization

Many APIs support [OAuth 2.0](https://oauth.net/2/) to secure the API and ensure that only valid users have access, and they can only access resources to which they're entitled. To use Azure API Management's interactive developer console with such APIs, the service allows you to configure an external provider for OAuth 2.0 user authorization.

Configuring OAuth 2.0 user authorization in the test console of the developer portal provides developers with a convenient way to acquire an OAuth 2.0 access token. From the test console, the token is then passed to the backend with the API call. Token validation must be configured separately - either using a [JWT validation policy](validate-jwt-policy.md), or in the backend service.

## Prerequisites

This article shows you how to configure your API Management service instance to use OAuth 2.0 authorization in the developer portal's test console, but it doesn't show you how to configure an OAuth 2.0 provider. 

If you haven't yet created an API Management service instance, see [Create an API Management service instance][Create an API Management service instance].

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]

## Scenario overview

Configuring OAuth 2.0 user authorization in API Management only enables the developer portal's test console (and the test console in the Azure portal) as a client to acquire a token from the authorization server. The configuration for each OAuth 2.0 provider is different, although the steps are similar, and the required pieces of information used to configure OAuth 2.0 in your API Management service instance are the same. This article shows an example using Microsoft Entra ID as an OAuth 2.0 provider.

The following are the high level configuration steps:

1. Register an application (backend-app) in Microsoft Entra ID to represent the API.

1. Register another application (client-app) in Microsoft Entra ID to represent a client application that needs to call the API - in this case, the test console of the developer portal.

    In Microsoft Entra ID, grant permissions to allow the client-app to call the backend-app.

1. Configure the test console in the developer portal to call an API using OAuth 2.0 user authorization.

1. Configure an API to use OAuth 2.0 user authorization.

1. Add a policy to pre-authorize the OAuth 2.0 token for every incoming request. You can use the `validate-jwt` policy for any OAuth 2.0 provider. 

This configuration supports the following OAuth flow:

:::image type="content" source="media/api-management-howto-oauth2/overview-graphic-azure-ad.png" alt-text="Overview graphic to visually conceptualize the following flow.":::

1. The developer portal requests a token from Microsoft Entra ID using the client-app credentials.

1. After successful validation, Microsoft Entra ID issues the access/refresh token.

1. A developer (user of the developer portal) makes an API call with the authorization header.

1. The token gets validated by using the `validate-jwt` policy in API Management by Microsoft Entra ID.

1. Based on the validation result, the developer will receive the response in the developer portal.


## Authorization grant types
 
Azure API Management supports the following OAuth 2.0 grant types (flows). A grant type refers to a way for a client application (in this context, the test console in the developer portal) to obtain an access token to your backend API. You may configure one or more grant types, depending on your OAuth 2.0 provider and scenarios. 

The following is a high level summary. For more information about grant types, see the [OAuth 2.0 Authorization Framework](https://datatracker.ietf.org/doc/html/rfc6749) and [OAuth grant types](https://oauth.net/2/grant-types/).


|Grant type  |Description  |Scenarios  |
|---------|---------|---------|
|Authorization code     | Exchanges authorization code for token         |  Server-side apps such as web apps      |
|Implicit     | Returns access token immediately without an extra authorization code exchange step       |  Clients that can't protect a secret or token such as mobile apps and single-page apps<br/><br/>Generally not recommended because of inherent risks of returning access token in HTTP redirect without confirmation that it's received by client     |
|Resource owner password  | Requests user credentials (username and password), typically using an interactive form |    For use with highly trusted applications<br/><br/>Should only be used when other, more secure flows can't be used        |
|Client credentials     | Authenticates and authorizes an app rather than a user       |  Machine-to-machine applications that don't require a specific user's permissions to access data, such as CLIs, daemons, or services running on your backend       |

### Security considerations

Consider how the grant type generates a token, the token's [scope](https://oauth.net/2/scope/), and how the token could be exposed. A compromised token could be used by a malicious actor to access additional resources within the token's scope.

When configuring OAuth 2.0 user authorization in the test console of the developer portal:

* **Limit the token's scope to the minimum** needed for developers to test the APIs. Limit the scope to the test console, or to the affected APIs. The steps to configure token scope depend on your OAuth 2.0 provider.

  Depending on your scenarios, you may configure more or less restrictive token scopes for other client applications that you create to access backend APIs.
* **Take extra care if you enable the Client Credentials flow**. The test console in the developer portal, when working with the Client Credentials flow, doesn't ask for credentials. An access token could be inadvertently exposed to developers or anonymous users of the developer console. 

## Keeping track of key information

Throughout this tutorial you'll be asked to record key information to reference later on:

- **Backend Application (client) ID**: The GUID of the application that represents the backend API
- **Backend Application Scopes**: One or more scopes you may create to access the API. The scope format is `api://<Backend Application (client) ID>/<Scope Name>` (for example, api://1764e900-1827-4a0b-9182-b2c1841864c2/Read)
- **Client Application (client) ID**: The GUID of the application that represents the developer portal
- **Client Application Secret Value**: The GUID that serves as the secret for interaction with the client application in Microsoft Entra ID 

## Register applications with the OAuth server

You'll need to register two applications with your OAuth 2.0 provider: one represents the backend API to be protected, and a second represents the client application that calls the API - in this case, the test console of the developer portal.

The following are example steps using Microsoft Entra ID as the OAuth 2.0 provider. For details about app registration, see [Quickstart: Configure an application to expose a web API](../active-directory/develop/quickstart-configure-app-expose-web-apis.md).

<a name='register-an-application-in-azure-ad-to-represent-the-api'></a>

### Register an application in Microsoft Entra ID to represent the API

1. In the [Azure portal](https://portal.azure.com), search for and select **App registrations**.

1. Select **New registration**. 

1. When the **Register an application page** appears, enter your application's registration information:

   - In the **Name** section, enter a meaningful application name that will be displayed to users of the app, such as *backend-app*. 
   - In the **Supported account types** section, select an option that suits your scenario. 

1. Leave the [**Redirect URI**](../active-directory/develop/reply-url.md) section empty. Later, you'll add a redirect URI generated in the OAuth 2.0 configuration in API Management. 

1. Select **Register** to create the application. 

1. On the app **Overview** page, find the **Application (client) ID** value and record it for later.

1. Under the **Manage** section of the side menu, select **Expose an API** and set the **Application ID URI** with the default value. Record this value for later.

1. Select the **Add a scope** button to display the **Add a scope** page:
    1. Enter a **Scope name** for a scope that's supported by the API (for example, **Files.Read**).
    1. In **Who can consent?**, make a selection for your scenario, such as **Admins and users**. Select **Admins only** for higher privileged scenarios.
    1. Enter **Admin consent display name** and **Admin consent description**.
    1. Make sure the **Enabled** scope state is selected.

1. Select the **Add scope** button to create the scope. 

1. Repeat the previous two steps to add all scopes supported by your API.

1. Once the scopes are created, make a note of them for use in a subsequent step. 

<a name='register-another-application-in-azure-ad-to-represent-a-client-application'></a>

### Register another application in Microsoft Entra ID to represent a client application

Register every client application that calls the API as an application in Microsoft Entra ID.

1. In the [Azure portal](https://portal.azure.com), search for and select **App registrations**.

1. Select **New registration**.

1. When the **Register an application page** appears, enter your application's registration information:

   - In the **Name** section, enter a meaningful application name that will be displayed to users of the app, such as *client-app*. 
   - In the **Supported account types** section, select an option that suits your scenario.

1. In the **Redirect URI** section, select **Web** and leave the URL field empty for now.

1. Select **Register** to create the application. 

1. On the app **Overview** page, find the **Application (client) ID** value and record it for later.

1. Create a client secret for this application to use in a subsequent step.

   1. Under the **Manage** section of the side menu, select **Certificates & secrets**.
   1. Under **Client secrets**, select **+ New client secret**.
   1. Under **Add a client secret**, provide a **Description** and choose when the key should expire.
   1. Select **Add**.

When the secret is created, note the key value for use in a subsequent step. You can't access the secret again in the portal.

<a name='grant-permissions-in-azure-ad'></a>

### Grant permissions in Microsoft Entra ID

Now that you've registered two applications to represent the API and the test console, grant permissions to allow the client-app to call the backend-app.  

1. In the [Azure portal](https://portal.azure.com), search for and select **App registrations**.

1. Choose your client app. Then in the side menu, select **API permissions**.

1. Select **+ Add a Permission**.

1. Under **Select an API**, select **My APIs**, and then find and select your backend-app.

1. Select **Delegated Permissions**, then select the appropriate permissions to your backend-app.

1. Select **Add permissions**.

Optionally:
1. Navigate to your client-app's **API permissions** page.

1. Select **Grant admin consent for \<your-tenant-name>** to grant consent on behalf of all users in this directory. 

## Configure an OAuth 2.0 authorization server in API Management

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.

1. Under **Developer portal** in the side menu, select **OAuth 2.0 + OpenID Connect**.

1. Under the **OAuth 2.0** tab, select **+ Add**.

   :::image type="content" source="media/api-management-howto-oauth2/oauth-01.png" alt-text="OAuth 2.0 menu":::

1. Enter a name and an optional description in the **Name** and **Description** fields.

    > [!NOTE]
    > These fields identify the OAuth 2.0 authorization server within the current API Management service. Their values do not come from the OAuth 2.0 server.

1. Enter the **Client registration page URL** - for example, `https://contoso.com/login`. This page is where users can create and manage their accounts, if your OAuth 2.0 provider supports user management of accounts. The page varies depending on the OAuth 2.0 provider used. 

   If your OAuth 2.0 provider doesn't have user management of accounts configured, enter a placeholder URL here such as the URL of your company, or a URL such as `http://localhost`.

    :::image type="content" source="media/api-management-howto-oauth2/oauth-02.png" alt-text="OAuth 2.0 new server":::

1. The next section of the form contains the **Authorization grant types**, **Authorization endpoint URL**, and **Authorization request method** settings.

    * Select one or more desired **Authorization grant types**. For this example, select **Authorization code** (the default). [Learn more](#authorization-grant-types)

    * Enter the **Authorization endpoint URL**. You can obtain the endpoint URL from the **Endpoints** page of one of your app registrations. For a single-tenant app in Microsoft Entra ID, this URL will be similar to one of the following URLs, where `{aad-tenant}` is replaced with the ID of your Microsoft Entra tenant.  

        Using the v2 endpoint is recommended; however, API Management supports both v1 and v2 endpoints.

        `https://login.microsoftonline.com/{aad-tenant}/oauth2/v2.0/authorize` (v2)

        `https://login.microsoftonline.com/{aad-tenant}/oauth2/authorize` (v1)

    * The **Authorization request method** specifies how the authorization request is sent to the OAuth 2.0 server. Select **POST**.

    :::image type="content" source="media/api-management-howto-oauth2/oauth-03.png" alt-text="Specify authorization settings":::

1. Specify **Token endpoint URL**, **Client authentication methods**, **Access token sending method**, and **Default scope**.

    * Enter the **Token endpoint URL**. For a single tenant app in Microsoft Entra ID, it will be similar to one of the following URLs, where `{aad-tenant}` is replaced with the ID of your Microsoft Entra tenant. Use the same endpoint version (v2 or v1) that you chose previously.

        `https://login.microsoftonline.com/{aad-tenant}/oauth2/v2.0/token` (v2)

        `https://login.microsoftonline.com/{aad-tenant}/oauth2/token` (v1)

    * If you use **v1** endpoints, add a body parameter:  
          * Name: **resource**.  
          * Value: the back-end app **Application (client) ID**.
    * If you use **v2** endpoints:  
          * Enter the back-end app scope you created in the **Default scope** field.  
          * Set the value for the [`accessTokenAcceptedVersion`](../active-directory/develop/reference-app-manifest.md#accesstokenacceptedversion-attribute) property to `2` in the [application manifest](../active-directory/develop/reference-app-manifest.md) for both the backend-app and the client-app registrations.  

    * Accept the default settings for **Client authentication methods** and **Access token sending method**. 

1. In **Client credentials**, enter the **Client ID** and **Client secret**, which you obtained during the creation and configuration process of your client-app. 
  
1. After the **Client ID** and **Client secret** are specified, the **Redirect URI** for the **authorization code** is generated. This URI is used to configure the redirect URI in your OAuth 2.0 server configuration.

    In the developer portal, the URI suffix is of the form:

    - `/signin-oauth/code/callback/{authServerName}` for authorization code grant flow
    - `/signin-oauth/implicit/callback` for implicit grant flow

    :::image type="content" source="media/api-management-howto-oauth2/oauth-04.png" alt-text="Add client credentials for the OAuth 2.0 service":::

    Copy the appropriate Redirect URI to the **Authentication** page of your client-app registration. In the app registration, select **Authentication** > **+ Add a platform** > **Web**, and then enter the Redirect URI.

1. If **Authorization grant types** is set to **Resource owner password**, the **Resource owner password credentials** section is used to specify those credentials; otherwise you can leave it blank.

1. Select **Create** to save the API Management OAuth 2.0 authorization server configuration. 

1. [Republish](developer-portal-overview.md#publish-the-portal) the developer portal.

    > [!IMPORTANT]
    > When making OAuth 2.0-related changes, be sure to republish the developer portal after every modification as relevant changes (for example, scope change) otherwise cannot propagate into the portal and subsequently be used in trying out the APIs.

## Configure an API to use OAuth 2.0 user authorization

After saving the OAuth 2.0 server configuration, configure an API or APIs to use this configuration.

> [!IMPORTANT]
> * Configuring OAuth 2.0 user authorization settings for an API enables API Management to acquire a token from the authorization server when you use the test console in the Azure portal or developer portal. The authorization server settings are also added to the API definition and documentation. 
> * For OAuth 2.0 authorization at runtime, the client app must acquire and present the token and you need to configure token validation in API Management or the backend API. For an example, see [Protect an API in Azure API Management using OAuth 2.0 authorization with Microsoft Entra ID](api-management-howto-protect-backend-with-aad.md). 

1. Select **APIs** from the **API Management** menu on the left.

1. Select the name of the desired API and select the **Settings** tab. Scroll to the **Security** section, and then select **OAuth 2.0**.

1. Select the desired **Authorization server** from the drop-down list, and select **Save**.

    :::image type="content" source="./media/api-management-howto-oauth2/oauth-07.png" alt-text="Configure OAuth 2.0 authorization server":::

## Developer portal - test the OAuth 2.0 user authorization

[!INCLUDE [api-management-test-oauth-authorization](../../includes/api-management-test-oauth-authorization.md)]

## Configure a JWT validation policy to pre-authorize requests

In the configuration so far, API Management doesn't validate the access token. It only passes the token in the authorization header to the backend API.

To pre-authorize requests, configure a [validate-jwt](validate-jwt-policy.md) policy to validate the access token of each incoming request. If a request doesn't have a valid token, API Management blocks it.

[!INCLUDE [api-management-configure-validate-jwt](../../includes/api-management-configure-validate-jwt.md)]

## Next steps

For more information about using OAuth 2.0 and API Management, see [Protect a web API backend in Azure API Management using OAuth 2.0 authorization with Microsoft Entra ID](api-management-howto-protect-backend-with-aad.md).


[api-management-oauth2-signin]: ./media/api-management-howto-oauth2/api-management-oauth2-signin.png
[api-management-request-header-token]: ./media/api-management-howto-oauth2/api-management-request-header-token.png
[api-management-open-console]: ./media/api-management-howto-oauth2/api-management-open-console.png
[api-management-apis-echo-api]: ./media/api-management-howto-oauth2/api-management-apis-echo-api.png

[How to add operations to an API]: ./mock-api-responses.md
[How to add and publish a product]: api-management-howto-add-products.md
[Monitoring and analytics]: api-management-monitoring.md
[Add APIs to a product]: api-management-howto-add-products.md#add-apis
[Publish a product]: api-management-howto-add-products.md#publish-product
[Get started with Azure API Management]: get-started-create-service-instance.md
[API Management policy reference]: ./api-management-policies.md
[Caching policies]: ./api-management-policies.md#caching-policies
[Create an API Management service instance]: get-started-create-service-instance.md

[https://oauth.net/2/]: https://oauth.net/2/
[WebApp-GraphAPI-DotNet]: https://github.com/AzureADSamples/WebApp-GraphAPI-DotNet

[Prerequisites]: #prerequisites
[Configure an OAuth 2.0 authorization server in API Management]: #step1
[Configure an API to use OAuth 2.0 user authorization]: #step2
[Test the OAuth 2.0 user authorization in the Developer Portal]: #step3
[Next steps]: #next-steps
