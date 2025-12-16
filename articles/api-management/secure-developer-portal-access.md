---
title: Secure access to developer portal
titleSuffix: Azure API Management
description: Learn about options to secure access to the API Management developer portal, including Microsoft Entra ID, Microsoft Entra External ID, and basic authentication
author: dlepow

ms.service: azure-api-management
ms.topic: concept-article
ms.date: 12/08/2025
ms.author: danlep
ms.custom: sfi-image-nochange
---

# Secure access to the API Management developer portal

[!INCLUDE [api-management-availability-premium-dev-standard-basic-premiumv2-standardv2-basicv2](../../includes/api-management-availability-premium-dev-standard-basic-premiumv2-standardv2-basicv2.md)]

API Management has a fully customizable, standalone, managed [developer portal](api-management-howto-developer-portal.md), which can be used externally (or internally) to allow developer users to discover and interact with the APIs published through API Management. The developer portal has several options to facilitate secure user sign-up and sign-in. 

> [!NOTE]
> By default, the developer portal enables anonymous access. This default setting means that anyone can view the portal and content such as APIs without signing in, although functionality such as using the test console is restricted. You can enable a setting that requires users to sign in to view the developer portal. In the Azure portal, in the left menu of your API Management instance, under **Developer portal**, select **Identities** > **Settings**. Under **Anonymous users**, select (enable) **Redirect anonymous users to sign-in page**.

## Authentication options

* **External users** - To enable access to the developer portal for external users, use external identity providers enabled through [Microsoft Entra External ID](/entra/external-id/external-identities-overview). 
    * For example, you want users to access the developer portal by using existing social media accounts.  
    * The service provides features to enable the end user sign-up and sign-in experience. 
    
    Currently, API Management supports external identity providers when configured in your Microsoft Entra ID workforce tenant, not in an external tenant. For more information, see [How to authorize developer accounts by using Microsoft Entra External ID](api-management-howto-entra-external-id.md).

    [!INCLUDE [api-management-active-directory-b2c-support](../../includes/api-management-active-directory-b2c-support.md)]

    [!INCLUDE [active-directory-b2c-end-of-sale-notice-b](../../includes/active-directory-b2c-end-of-sale-notice-b.md)]

* **Internal users** - To enable access to the developer portal for internal users, use your corporate (workforce) Microsoft Entra ID tenant. Microsoft Entra ID provides a seamless single sign-on (SSO) experience for corporate users who need to access and discover APIs through the developer portal. 

    For steps to enable Microsoft Entra authentication in the developer portal, see [How to authorize developer accounts by using Microsoft Entra ID in Azure API Management](api-management-howto-aad.md).
    

* **Basic authentication** - Use the built-in developer portal [username and password](developer-portal-basic-authentication.md) provider. This option allows developers to register directly in API Management and sign in by using API Management user accounts. User registration through this option is protected by a CAPTCHA service. 

    > [!CAUTION]
    > While you can use basic authentication to secure users' access to the developer portal, we recommend configuring a more secure authentication method such as [Microsoft Entra ID](api-management-howto-aad.md).


## Developer portal test console
In addition to providing configuration for developer users to sign up for access and sign in, the developer portal includes a test console where the developers can send test requests through API Management to the backend APIs. This test facility also exists for contributing users of API Management who manage the service using the Azure portal. 

If you secure the API exposed through Azure API Management with OAuth 2.0 - that is, a calling application (*bearer*) needs to obtain and pass a valid access token - you can configure API Management to generate a valid token on behalf of an Azure portal or developer portal test console user. For more information, see [How to authorize test console of developer portal by configuring OAuth 2.0 user authorization](api-management-howto-oauth2.md).

To enable the test console to acquire a valid OAuth 2.0 token for API testing:

1. Add an OAuth 2.0 user authorization server to your instance. You can use any OAuth 2.0 provider, including Microsoft Entra ID, Microsoft Entra External ID, or a third-party identity provider. 

1. Configure the API with settings for that authorization server. In the portal, configure OAuth 2.0 authorization on the API's **Settings** page > **Security** > **User authorization**.

    :::image type="content" source="media/secure-developer-portal-access/oauth-settings-for-testing.png" alt-text="Screenshot of OAuth settings for an API in the portal." lightbox="media/secure-developer-portal-access/oauth-settings-for-testing.png":::

This OAuth 2.0 configuration for API testing is independent of the configuration required for user access to the developer portal. However, the identity provider and user can be the same. For example, an intranet application could require user access to the developer portal by using SSO with their corporate identity. That same corporate identity could obtain a token, through the test console, for the backend service being called with the same user context. 

## Scenarios

Different authentication and authorization options apply to different scenarios. The following sections explore high level configurations for three example scenarios. You need to take more steps to fully secure and configure APIs exposed through API Management. However, the scenarios intentionally focus on the minimum configurations recommended in each case to provide the required authentication and authorization. 

### Scenario 1 - Intranet API and applications

* An API Management contributor and backend API developer want to publish an API that's secured by OAuth 2.0. 
* The API is consumed by desktop applications whose users sign in by using SSO through Microsoft Entra ID. 
* The desktop application developers need to discover and test the APIs through the API Management developer portal.

Key configurations:


|Configuration  |Reference  |
|---------|---------|
| Authorize developer users of the API Management developer portal by using their corporate identities and Microsoft Entra ID.     |   [Authorize developer accounts by using Microsoft Entra ID in Azure API Management](api-management-howto-aad.md)     |
|Set up the test console in the developer portal to obtain a valid OAuth 2.0 token for the desktop app developers to exercise the backend API. <br/><br/>The same configuration can be used for the test console in the Azure portal, which is accessible to the API Management contributors and backend developers. <br/><br/>The token can be used in combination with an API Management subscription key.     |    [How to authorize test console of developer portal by configuring OAuth 2.0 user authorization](api-management-howto-oauth2.md)<br/><br/>[Subscriptions in Azure API Management](api-management-subscriptions.md)     |
| Validate the OAuth 2.0 token and claims when an API is called through API Management with an access token.     |     [Validate JWT policy](validate-jwt-policy.md)     |

Go a step further with this scenario by moving API Management into the network perimeter and controlling ingress through a reverse proxy. For a reference architecture, see [Protect APIs with Application Gateway and API Management](/azure/architecture/reference-architectures/apis/protect-apis).
 
### Scenario 2 - External API, partner application

* An API Management contributor and backend API developer want to quickly create a proof of concept to expose a legacy API through Azure API Management. The API through API Management is externally (internet) facing.
* The API uses client certificate authentication and is consumed by a new public-facing single-page app (SPA) developed offshore by a partner. 
* The SPA uses OAuth 2.0 with OpenID Connect (OIDC). 
* Application developers access the API in a test environment through the developer portal, using a test backend endpoint to speed up frontend development. 

Key configurations: 

|Configuration  |Reference  |
|---------|---------|
| Configure frontend developer access to the developer portal by using the default username and password authentication.<br/><br/>Developers can also be invited to the developer portal.  | [Configure users of the developer portal to authenticate using usernames and passwords](developer-portal-basic-authentication.md)<br/><br/>[How to manage user accounts in Azure API Management](api-management-howto-create-or-invite-developers.md) |
| Validate the OAuth 2.0 token and claims when the SPA calls API Management with an access token. In this case, the audience is API Management.   | [Validate JWT policy](validate-jwt-policy.md)  |
| Set up API Management to use client certificate authentication to the backend. |  [Secure backend services using client certificate authentication in Azure API Management](api-management-howto-mutual-certificates.md) |

To take this scenario further, use the [developer portal with Microsoft Entra authorization](api-management-howto-aad.md) and Microsoft Entra [B2B collaboration](../active-directory/external-identities/what-is-b2b.md) to allow the delivery partners to collaborate more closely. Consider delegating access to API Management through RBAC in a development or test environment and enable SSO into the developer portal by using their own corporate credentials.

### Scenario 3 - External API, SaaS, open to the public

* An API Management contributor and backend API developer write several new APIs that community developers can use.
* The APIs are publicly available, but full functionality is protected behind a paywall and secured by using OAuth 2.0. After purchasing a license, the developer gets their own client credentials and subscription key that's valid for production use. 
* External community developers discover the APIs by using the developer portal. Developers sign up and sign in to the developer portal by using their social media accounts. 
* Interested developer portal users with a test subscription key can explore the API functionality in a test context, without needing to purchase a license. The developer portal test console represents the calling application and generates a default access token to the backend API. 
 
    > [!CAUTION]
    > Extra care is required when using a client credentials flow with the developer portal test console. See [security considerations](api-management-howto-oauth2.md#security-considerations).

Key configurations:

|Configuration  |Reference  |
|---------|---------|
| Set up products in Azure API Management to represent the combinations of APIs that you expose to community developers.<br/><br/> Set up subscriptions to enable developers to consume the APIs.  | [Tutorial: Create and publish a product](api-management-howto-add-products.md)<br/><br/>[Subscriptions in Azure API Management](api-management-subscriptions.md)  |
|  Configure community developer access to the developer portal using Microsoft Entra External ID. Microsoft Entra External ID     can then be configured to work with one or more downstream social media identity providers. |  [How to authorize developer accounts by using Microsoft Entra External ID in Azure API Management](api-management-howto-entra-external-id.md) |
| Set up the test console in the developer portal to obtain a valid OAuth 2.0 token to the backend API by using the client credentials flow.  |  [How to authorize test console of developer portal by configuring OAuth 2.0 user authorization](api-management-howto-oauth2.md)<br/><br/>Adjust configuration steps shown in this article to use the [client credentials grant flow](../active-directory/develop/v2-oauth2-client-creds-grant-flow.md) instead of the authorization code grant flow. |

Go a step further by delegating [user registration or product subscription](api-management-howto-setup-delegation.md) and extend the process with your own logic. 


## Related content
* Learn more about [authentication and authorization](../active-directory/develop/authentication-vs-authorization.md) in the Microsoft identity platform.
* Learn how to [mitigate OWASP API security threats](mitigate-owasp-api-threats.md) by using API Management.
