---
title: Authorize developer accounts using OAuth 2.0 in API Management
titleSuffix: Azure API Management
description: Learn how to authorize users using OAuth 2.0 in API Management. OAuth 2.0 secures the API so that users can only access resources to which they're entitled.
services: api-management
documentationcenter: ''
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 11/16/2021
ms.author: danlep
---

# How to authorize developer accounts using OAuth 2.0 in Azure API Management

Many APIs support [OAuth 2.0](https://oauth.net/2/) to secure the API and ensure that only valid users have access, and they can only access resources to which they're entitled. To use Azure API Management's interactive developer console with such APIs, the service allows you to configure your service instance to work with your OAuth 2.0 enabled API.

Configuring OAuth 2.0 user authorization in the test console of the developer portal provides developers with a convenient way to acquire an OAuth 2.0 access token. From the test console, the token is simply passed to the backend with the API call. Token validation must be configured separately - either using a [JWT validation policy](api-management-access-restriction-policies.md#ValidateJWT), or in the backend service.


## Prerequisites

This guide shows you how to configure your API Management service instance to use OAuth 2.0 authorization for developer accounts, but does not show you how to configure an OAuth 2.0 provider. 

The configuration for each OAuth 2.0 provider is different, although the steps are similar, and the required pieces of information used to configure OAuth 2.0 in your API Management service instance are the same. This topic shows examples using Azure Active Directory as an OAuth 2.0 provider.

If you have not yet created an API Management service instance, see [Create an API Management service instance][Create an API Management service instance].

> [!NOTE]
> For more information on configuring OAuth 2.0 using Azure Active Directory, see [Protect a web API backend in Azure API Management using OAuth 2.0 authorization with Azure Active Directory](api-management-howto-protect-backend-with-aad.md).

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]

## Authorization grant types
 
Azure API Management supports the following OAuth 2.0 grant types (flows). A grant type refers to a way for a client application (in this context, the test console in the developer portal) to obtain an access token to your backend API. You may configure one or more grant types, depending on your OAuth 2.0 provider and scenarios. 

The following is a high level summary. For more information about grant types, see the [OAuth 2.0 Authorization Framework](https://datatracker.ietf.org/doc/html/rfc6749) and [OAuth grant types](https://oauth.net/2/grant-types/).


|Grant type  |Description  |Scenarios  |
|---------|---------|---------|
|Authorization code     | Exchanges authorization code for token         |  Server-side apps such as web apps      |
|Implicit     | Returns access token immediately without an extra authorization code exchange step       |  Clients that can't protect a secret or token such as mobile apps and single-page apps<br/><br/>Generally not recommended because of inherent risks of returning access token in HTTP redirect without confirmation that it is received by client     |
|Resource owner password  | Requests user credentials (username and password), typically using an interactive form |    For use with highly trusted applications<br/><br/>Should only be used when other, more secure flows can't be used        |
|Client credentials     | Authenticates and authorizes an app rather than a user       |  Machine-to-machine applications that do not require a specific user's permissions to access data, such as CLIs, daemons, or services running on your backend       |

### Security considerations

Consider how the grant type generates a token, the token's [scope](https://oauth.net/2/scope/), and how the token could be exposed. A compromised token could be used by a malicious actor to access additional resources within the token's scope.

When configuring OAuth 2.0 user authorization in the test console of the developer portal:

* **Limit the token's scope to the minimum** needed for developers to test the APIs. Limit the scope to the test console, or to the affected APIs. The steps to configure token scope depend on your OAuth 2.0 provider.

  Depending on your scenarios, you may configure more or less restrictive token scopes for other client applications that you create to access backend APIs.
* **Take extra care if you enable the Client Credentials flow**. The test console in the developer portal, when working with the Client Credentials flow, doesn't ask for credentials. An access token could be inadvertently exposed to developers or anonymous users of the developer console. 

## Configure an OAuth 2.0 authorization server in API Management

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.

1. Under the Developer portal section in the side menu, select **OAuth 2.0 + OpenID Connect**.

1. Under the **OAuth 2.0 tab**, select **+Add**.

   :::image type="content" source="media/api-management-howto-oauth2/oauth-01.png" alt-text="OAuth 2.0 menu":::

1. Enter a name and an optional description in the **Name** and **Description** fields.

    > [!NOTE]
    > These fields identify the OAuth 2.0 authorization server within the current API Management service. Their values do not come from the OAuth 2.0 server.

1. Enter the **Client registration page URL** - for example, `https://contoso.com/login`. This page is where users can create and manage their accounts, if your OAuth 2.0 provider supports user management of accounts. The page varies depending on the OAuth 2.0 provider used. 

   If your OAuth 2.0 provider does not have user management of accounts configured, enter a placeholder URL here such as the URL of your company, or a URL such as `https://placeholder.contoso.com`.

    :::image type="content" source="media/api-management-howto-oauth2/oauth-02.png" alt-text="OAuth 2.0 new server":::

1. The next section of the form contains the **Authorization grant types**, **Authorization endpoint URL**, and **Authorization request method** settings.

    * Specify the **Authorization grant types** by checking the desired types. **Authorization code** is specified by default. [Learn more](#authorization-grant-types).

    * Enter the **Authorization endpoint URL**. For Azure Active Directory, this URL will be similar to the following URL, where `<tenant_id>` is replaced with the ID of your Azure AD tenant.

       `https://login.microsoftonline.com/<tenant_id>/oauth2/authorize`

    * The **Authorization request method** specifies how the authorization request is sent to the OAuth 2.0 server. By default **GET** is selected.

    :::image type="content" source="media/api-management-howto-oauth2/oauth-03.png" alt-text="Specify authorization settings":::

1. Specify **Token endpoint URL**, **Client authentication methods**, **Access token sending method** and **Default scope**.

    * For an Azure Active Directory OAuth 2.0 server, the **Token endpoint URL** has the following format, where `<TenantID>`  has the format of `yourapp.onmicrosoft.com`.

        `https://login.microsoftonline.com/<TenantID>/oauth2/token`

    * The default setting for **Client authentication methods** is **In the body**, and  **Access token sending method** is **Authorization header**. These values are configured on this section of the form, along with the **Default scope**.

6. The **Client credentials** section contains the **Client ID** and **Client secret**, which are obtained during the creation and configuration process of your OAuth 2.0 server. 
  
    After the **Client ID** and **Client secret** are specified, the **redirect_uri** for the **authorization code** is generated. This URI is used to configure the reply URL in your OAuth 2.0 server configuration.

    In the developer portal, the URI suffix is of the form:

    - `/signin-oauth/code/callback/{authServerName}` for authorization code grant flow
    - `/signin-oauth/implicit/callback` for implicit grant flow

    :::image type="content" source="media/api-management-howto-oauth2/oauth-04.png" alt-text="Add client credentials for the OAuth 2.0 service":::

1. If **Authorization grant types** is set to **Resource owner password**, the **Resource owner password credentials** section is used to specify those credentials; otherwise you can leave it blank.

1. Select **Create** to save the API Management OAuth 2.0 authorization server configuration. 

After the server configuration is saved, you can configure APIs to use this configuration, as shown in the next section.

## Configure an API to use OAuth 2.0 user authorization

1. Select **APIs** from the **API Management** menu on the left.

1. Select the name of the desired API and select the **Settings** tab. Scroll to the **Security** section, and then select **OAuth 2.0**.

1. Select the desired **Authorization server** from the drop-down list, and select **Save**.

    :::image type="content" source="./media/api-management-howto-oauth2/oauth-07.png" alt-text="Configure OAuth 2.0 authorization server":::


## Developer portal - test the OAuth 2.0 user authorization

[!INCLUDE [api-management-test-oauth-authorization](../../includes/api-management-test-oauth-authorization.md)]

## Legacy developer portal - test the OAuth 2.0 user authorization

[!INCLUDE [api-management-portal-legacy.md](../../includes/api-management-portal-legacy.md)]

Once you have configured your OAuth 2.0 authorization server and configured your API to use that server, you can test it by going to the Developer Portal and calling an API. Click **Developer portal (legacy)** in the top menu from your Azure API Management instance **Overview** page.

Click **APIs** in the top menu and select **Echo API**.

![Echo API][api-management-apis-echo-api]

> [!NOTE]
> If you have only one API configured or visible to your account, then clicking APIs takes you directly to the operations for that API.

Select the **GET Resource** operation, click **Open Console**, and then select **Authorization code** from the drop-down.

![Open console][api-management-open-console]

When **Authorization code** is selected, a pop-up window is displayed with the sign-in form of the OAuth 2.0 provider. In this example the sign-in form is provided by Azure Active Directory.

> [!NOTE]
> If you have pop-ups disabled, you'll be prompted to enable them by the browser. After you enable them, select **Authorization code** again and the sign-in form will be displayed.

![Sign in][api-management-oauth2-signin]

Once you have signed in, the **Request headers** are populated with an `Authorization : Bearer` header that authorizes the request.

![Request header token][api-management-request-header-token]

At this point you can configure the desired values for the remaining parameters, and submit the request.

## Next steps

For more information about using OAuth 2.0 and API Management, see the following video and accompanying [article](api-management-howto-protect-backend-with-aad.md).

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
