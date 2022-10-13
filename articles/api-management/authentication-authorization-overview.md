---
title: Authentication and authorization - Overview
titleSuffix: Azure API Management
description: Learn about authentication and authorization features in Azure API Management to secure access to the management, API, and developer features
author: bengimblett

ms.service: api-management
ms.topic: conceptual
ms.date: 09/08/2022
ms.author: begim
---

# Authentication and authorization in Azure API Management

This article is an introduction to API Management capabilities that help you secure users' access to API Management features and APIs.

API Management provides a rich, flexible set of features to support API authentication and authorization in addition to the standard control-plane authentication and role-based access control (RBAC) required when interacting with Azure services. 

API Management also provides a fully customizable, standalone, managed [developer portal](api-management-howto-developer-portal.md), which can be used externally (or internally) to allow developer users to discover and interact with the APIs published through API Management. The developer portal has several options to facilitate secure user sign-up and sign-in. 

The following diagram is a conceptual view of Azure API Management, showing the management plane (Azure control plane), API gateway (data plane), and developer portal (user plane), each with at least one option to secure interaction. For an overview of API Management components, see [What is Azure API Management?](api-management-key-concepts.md)

:::image type="content" source="media/authentication-authorization-overview/api-management-security-high-level.png" alt-text="Diagram showing security features at all points of interaction in API Management." border="false":::

## Management plane

Administrators, operators, developers, and DevOps service principals are examples of the different personas required to manage an Azure API Management instance in a customer environment. 

Azure API Management relies on Azure Active Directory (Azure AD), which includes optional features such as multifactor authentication (MFA), and Azure RBAC to enable fine-grained access to the API Management service and its entities including APIs and policies. For more information, see [How to use role-based access control in Azure API Management](api-management-role-based-access-control.md). 

The management plane can be accessed via an Azure AD login (or token) through the Azure portal, infrastructure-as-code templates (such as Azure Resource Manager or Bicep), the REST API, client SDKs, the Azure CLI, or Azure PowerShell. 

## Gateway (data plane)

API authentication and authorization in API Management involve the end-to-end communication of client apps *through* the API Management gateway to backend APIs.

In many customer environments, [OAuth 2.0](https://oauth.net/2/) is the preferred API authorization protocol. API Management supports OAuth 2.0 across the data plane.

### OAuth concepts

What happens when a client app calls an API with a request that is secured using TLS and OAuth? The following is an abbreviated example flow:

* The client (the calling app, or *bearer*) authenticates using credentials to an *identity provider*.
* The client obtains a time-limited *access token* (a JSON web token, or JWT) from the identity provider's *authorization server*. 
    
    The identity provider (for example, Azure AD) is the *issuer* of the token, and the token includes an *audience claim* that authorizes access to a *resource server* (for example, to a backend API, or to the API Management gateway itself).
* The client calls the API and presents the access token - for example, in an Authorization header.
* The *resource server* validates the access token. Validation is a complex process that includes a check that the *issuer* and *audience* claims contain expected values. 
* Based on token validation criteria, access to resources of the [backend] API is then granted.

Depending on the type of client app and scenarios, different *authentication flows* are needed to request and manage tokens. For example, the authorization code flow and grant type are commonly used in apps that call web APIs. Learn more about [OAuth flows and application scenarios in Azure AD](../active-directory/develop/authentication-flows-app-scenarios.md).


### OAuth 2.0 authorization scenarios

#### Audience is the backend

The most common scenario is when the Azure API Management instance is a "transparent" proxy between the caller and backend API, and the calling application requests access to the API directly. The scope of the access token is between the calling application and backend API.

:::image type="content" source="media/authentication-authorization-overview/oauth-token-backend.svg" alt-text="Diagram showing OAuth communication where audience is the backend." border="false":::

In this scenario, the access token sent along with the HTTP request is intended for the backend API, not API Management. However, API Management still allows for a defense in depth approach. For example, configure policies to [validate the token](api-management-access-restriction-policies.md#ValidateJWT), rejecting requests that arrive without a token, or a token that's not valid for the intended backend API. You can also configure API Management to check other claims of interest extracted from the token.

For an example, see [Protect an API in Azure API Management using OAuth 2.0 authorization with Azure Active Directory](api-management-howto-protect-backend-with-aad.md). 

#### Audience is API Management

In this scenario, the API Management service acts on behalf of the API, and the calling application requests access to the API Management instance. The scope of the access token is between the calling application and API Management. 

:::image type="content" source="media/authentication-authorization-overview/oauth-token-gateway.svg" alt-text="Diagram showing OAuth communication where audience is the API Management gateway." border="false":::

There are different reasons for wanting to do this. For example:

* The backend is a legacy API that can't be updated to support OAuth. 

    API Management should first be configured to validate the token (checking the issuer and audience claims at a minimum). After validation, use one of several options available to secure onward connections from API Management. See [other options](#other-options), later in this article.

* The context required by the backend isn’t possible to establish from the caller.  

    After API Management has successfully validated the token received from the caller, it then needs to obtain an access token for the backend API using its own context, or context derived from the calling application. This scenario can be accomplished using either: 

    * A custom policy to obtain an onward access token valid for the backend API from a configured identity provider.

    * The API Management instance's own identity – passing the token from the API Management resource's system-assigned or user-assigned [managed identity](api-management-authentication-policies.md#ManagedIdentity) to the backend API. 

### Token management by API Management

API Management also supports acquisition and secure storage of OAuth 2.0 tokens for certain downstream services using the [authorizations](authorizations-overview.md) (preview) feature, including through use of custom policies and caching.

With authorizations, API Management manages the tokens for access to OAuth 2.0 backends, simplifying the development of client apps that access APIs.

### Other options

Although authorization is preferred and OAuth 2.0 has become the dominant method of enabling strong authorization for APIs, API Management enables other authentication options that can be useful if the backend or calling applications are legacy or don't yet support OAuth. Options include:

* Mutual TLS (mTLS), also known as client certificate authentication, between the client (app) and API Management. This authentication can be end-to-end, with the call between API Management and the backend API secured in the same way. For more information, see [How to secure APIs using client certificate authentication in API Management](api-management-howto-mutual-certificates-for-clients.md)
* Basic authentication, using the [authentication-basic](api-management-authentication-policies.md#Basic) policy.
* Subscription key, also known as an API key. For more information, see [Subscriptions in API Management](api-management-subscriptions.md). 

> [!NOTE]
> We recommend using a subscription (API) key *in addition to* another method of authentication or authorization. On its own, a subscription key isn't a strong form of authentication, but use of the subscription key might be useful in certain scenarios, for example, tracking individual customers' API usage.

## Developer portal (user plane)

The managed developer portal is an optional API Management feature that allows internal or external developers and other interested parties to discover and use APIs that are published through API Management.  

If you elect to customize and publish the developer portal, API Management provides different options to secure it: 

* **External users** - The preferred option when the developer portal is consumed externally is to enable business-to-consumer access control through Azure Active Directory B2C (Azure AD B2C). 
    * Azure AD B2C provides the option of using Azure AD B2C native accounts: users sign up to Azure AD B2C and use that identity to access the developer portal. 
    * Azure AD B2C is also useful if you want users to access the developer portal using existing social media or federated organizational accounts.  
    * Azure AD B2C provides many features to improve the end user sign-up and sign-in experience, including conditional access and MFA. 
    
    For steps to enable Azure AD B2C authentication in the developer portal, see [How to authorize developer accounts by using Azure Active Directory B2C in Azure API Management](api-management-howto-aad-b2c.md).


* **Internal users** - The preferred option when the developer portal is consumed internally is to leverage your corporate Azure AD. Azure AD provides a seamless single sign-on (SSO) experience for corporate users who need to access and discover APIs through the developer portal. 

    For steps to enable Azure AD authentication in the developer portal, see [How to authorize developer accounts by using Azure Active Directory in Azure API Management](api-management-howto-aad.md).
    

* **Basic authentication** - A default option is to use the built-in developer portal [username and password](developer-portal-basic-authentication.md) provider, which allows developer users to register directly in API Management and sign in using API Management user accounts. User sign up through this option is protected by a CAPTCHA service. 

### Developer portal test console
In addition to providing configuration for developer users to sign up for access and sign in, the developer portal includes a test console where the developers can send test requests through API Management to the backend APIs. This test facility also exists for contributing users of API Management who manage the service using the Azure portal. 

In either both cases, if the API exposed through Azure API Management is secured with OAuth 2.0 - that is, a calling application (*bearer*) needs to obtain and pass a valid access token - you can configure API Management to generate a valid token on behalf of an Azure portal or developer portal test console user. For more information, see [How to authorize test console of developer portal by configuring OAuth 2.0 user authorization](api-management-howto-oauth2.md) . 

This OAuth configuration for API testing is independent of the configuration required for user access to the developer portal. However, the identity provider and user could be the same. For example, an intranet application could require user access to the developer portal using SSO with their corporate identity, and that same corporate identity could obtain a token, through the test console, for the backend service being called with the same user context. 

## Scenarios

Different authentication and authorization options apply to different scenarios. The following sections explore high level configurations for three example scenarios. More steps are required to fully secure and configure APIs exposed through API Management to either internal or external audiences. However, the scenarios intentionally focus on the minimum configurations recommended in each case to provide the required authentication and authorization. 

### Scenario 1 - Intranet API and applications

* An API Management contributor and backend API developer wants to publish an API that is secured by OAuth 2.0. 
* The API will be consumed by desktop applications whose users sign in using SSO through Azure AD. 
* The desktop application developers also need to discover and test the APIs via the API Management developer portal.

Key configurations:


|Configuration  |Reference  |
|---------|---------|
| Authorize developer users of the API Management developer portal using their corporate identities and Azure AD.     |   [Authorize developer accounts by using Azure Active Directory in Azure API Management](api-management-howto-aad.md)     |
|Set up the test console in the developer portal to obtain a valid OAuth 2.0 token for the desktop app developers to exercise the backend API. <br/><br/>The same configuration can be used for the test console in the Azure portal, which is accessible to the API Management contributors and backend developers. <br/><br/>The token could be used in combination with an API Management subscription key.     |    [How to authorize test console of developer portal by configuring OAuth 2.0 user authorization](api-management-howto-oauth2.md)<br/><br/>[Subscriptions in Azure API Management](api-management-subscriptions.md)     |
| Validate the OAuth 2.0 token and claims when an API is called through API Management with an access token.     |     [Validate JWT policy](api-management-access-restriction-policies.md#ValidateJWT)     |

Go a step further with this scenario by moving API Management into the network perimeter and controlling ingress through a reverse proxy. For a reference architecture, see [Protect APIs with Application Gateway and API Management](/azure/architecture/reference-architectures/apis/protect-apis).
 
### Scenario 2 - External API, partner application

* An API Management contributor and backend API developer wants to undertake a rapid proof-of-concept to expose a legacy API through Azure API Management. The API through API Management will be externally (internet) facing.
* The API uses client certificate authentication and will be consumed by a new public-facing single-page Application (SPA) being developed and delivered offshore by a partner. 
* The SPA uses OAuth 2.0 with Open ID Connect (OIDC). 
* Application developers will access the API in a test environment through the developer portal, using a test backend endpoint to accelerate frontend development. 

Key configurations: 

|Configuration  |Reference  |
|---------|---------|
| Configure frontend developer access to the developer portal using the default username and password authentication.<br/><br/>Developers can also be invited to the developer portal.  | [Configure users of the developer portal to authenticate using usernames and passwords](developer-portal-basic-authentication.md)<br/><br/>[How to manage user accounts in Azure API Management](api-management-howto-create-or-invite-developers.md) |
| Validate the OAuth 2.0 token and claims when the SPA calls API Management with an access token. In this case, the audience is API Management.   | [Validate JWT policy](api-management-access-restriction-policies.md#ValidateJWT)  |
| Set up API Management to use client certificate authentication to the backend. |  [Secure backend services using client certificate authentication in Azure API Management](api-management-howto-mutual-certificates.md) |

Go a step further with this scenario by using the [developer portal with Azure AD authorization](api-management-howto-aad.md) and Azure AD [B2B collaboration](../active-directory/external-identities/what-is-b2b.md) to allow the delivery partners to collaborate more closely. Consider delegating access to API Management through RBAC in a development or test environment and enable SSO into the developer portal using their own corporate credentials.

### Scenario 3 - External API, SaaS, open to the public

* An API Management contributor and backend API developer is writing several new APIs that will be available to community developers.
* The APIs will be publicly available, with full functionality protected behind a paywall and secured using OAuth 2.0. After purchasing a license, the developer will be provided with their own client credentials and subscription key that is valid for production use. 
* External community developers will discover the APIs using the developer portal. Developers will sign up and sign in to the developer portal using their social media accounts. 
* Interested developer portal users with a test subscription key can explore the API functionality in a test context, without needing to purchase a license. The developer portal test console will represent the calling application and generate a default access token to the backend API. 
 
    > [!CAUTION]
    > Extra care is required when using a client credentials flow with the developer portal test console. See [security considerations](api-management-howto-oauth2.md#security-considerations).

Key configurations:

|Configuration  |Reference  |
|---------|---------|
| Set up products in Azure API Management to represent the combinations of APIs that are exposed to community developers.<br/><br/> Set up subscriptions to enable developers to consume the APIs.  | [Tutorial: Create and publish a product](api-management-howto-add-products.md)<br/><br/>[Subscriptions in Azure API Management](api-management-subscriptions.md)  |
|  Configure community developer access to the developer portal using Azure AD B2C. Azure AD B2C can then be configured to work with one or more downstream social media identity providers. |  [How to authorize developer accounts by using Azure Active Directory B2C in Azure API Management](api-management-howto-aad-b2c.md) |
| Set up the test console in the developer portal to obtain a valid OAuth 2.0 token to the backend API using the client credentials flow.  |  [How to authorize test console of developer portal by configuring OAuth 2.0 user authorization](api-management-howto-oauth2.md)<br/><br/>Adjust configuration steps shown in this article to use the [client credentials grant flow](../active-directory/develop/v2-oauth2-client-creds-grant-flow.md) instead of the authorization code grant flow. |

Go a step further by delegating [user registration or product subscription](api-management-howto-setup-delegation.md) and extend the process with your own logic. 


## Next steps
* Learn more about [authentication and authorization](../active-directory/develop/authentication-vs-authorization.md) in the Microsoft identity platform.
* Learn how to [mitigate OWASP API security threats](mitigate-owasp-api-threats.md) using API Management.
