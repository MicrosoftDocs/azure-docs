---
title: Authentication and authorization - Overview
titleSuffix: Azure API Management
description: Learn about authentication and authorization features in Azure API Management to secure access to the management, API, and developer features
author: bengimblett

ms.service: api-management
ms.topic: conceptual
ms.date: 08/31/2022
ms.author: begim
---

# Authentication and authorization in Azure API Management

This article is an introduction to API Management capabilities that help you secure users' access to API Management features and APIs.

API Management provides a rich, flexible set of features to support API authentication and authorization in addition to the standard control-plane authentication and role-based access control (RBAC) required when interacting with Azure services. 

API Management also provides a fully customizable, standalone, managed [developer portal](api-management-howto-developer-portal.md), which can be leveraged externally (or internally) to allow developer users to discover and interact with the APIs published through API Management. The developer portal has several options to facilitate secure user sign-up and sign-in. 

The following diagram is a conceptual view of Azure API Management, showing the management plane, API gateway (data plane), and developer portal, each with at least one option to secure interaction. For an overview of API Management components, see [What is Azure API Management?](api-management-key-concepts.md)

:::image type="content" source="media/authentication-authorization-overview/api-management-security-high-level.png" alt-text="Diagram showing security features at all points of interaction in API Management" border="false":::

## Management plane

Administrators, operators, developers, and DevOps service principals are examples of the different personas required to manage an Azure API Management instance in a customer environment. 

Azure API Management relies on Azure Active Directory (Azure AD), which includes optional features such as multifactor authentication (MFA), and Azure RBAC to enable fine-grained access to the API Management service and its entities (for example, APIs and policies). For more information, see [How to use role-based access control in Azure API Management](api-management-role-based-access-control.md). 

The management plane can be accessed via an Azure AD login (or token) through the Azure portal, infrastructure-as-code templates (such as Azure Resource Manager or Bicep), the REST API, client SDKs, the Azure CLI, or Azure PowerShell. 

## Gateway (data plane)

API authentication and authorization in API Management involve the end-to-end communication of client apps to the API Management gateway, and then from the gateway to backend APIs.

In many customer environments, [OAuth 2.0](https://oauth.net/2/) is the preferred API authorization protocol. API Management supports OAuth 2.0 across the data plane.

### OAuth concepts

What happens when a client app calls an API with a request that is secured using SSL/TLS and OAuth? The following is an abbreviated example flow:

* The client (the calling app, or generally the *bearer*) authenticates using credentials to an *identity provider*.
* The client obtains an *access token* (a JSON web token, or JWT) from an identity provider's authorization server. 
    
    The identity provider (for example, Azure AD) is the *issuer* of the token, and the token includes one or more *audience claims* that authorize access to a *resource server* (for example, to a backend API, or to the API Management gateway itself).
* The client calls the API and presents the access token - for example, in an Authorization header.
* The resource server validates the access token by checking (at a minimum) that the issuer and audience claims contain expected values. 
* Based on token validation criteria, access to resources on the server is then granted.

Depending on the type of client app and scenarios, different *authentication flows* are needed to request and manage tokens. For example, the *authorization code* flow and grant type is commonly used in apps that call web APIs. For more information about OAuth flows and scenarios in Azure AD, see [Authentication flows and application scenarios](../active-directory/develop/authentication-flows-app-scenarios).


### OAuth 2.0 authorization scenarios

#### Audience is the backend

The most common scenario is when the Azure API Management instance is a "transparent" proxy between the caller and backend API, and the calling application requests access to the API directly. In this case, the scope of the access token is between the calling application and backend API.

:::image type="content" source="media/authentication-authorization-overview/oauth-token-backend.png" alt-text="Diagram showing OAuth communication where audience is the backend." border="false":::

In this scenario, the access token sent along with the HTTP request is intended for the backend API, not API Management. However, API Management still allows for a defense in depth approach. For example, configure policies to [validate the token](api-management-access-restriction-policies.md#a-namevalidatejwta-validate-jwt), rejecting requests that arrive without a token, or a token that's not valid for the intended backend API. You can also configure API Management to check other claims of interest extracted from the token. 

#### Audience is API Management

In this scenario, the API Management service acts on behalf of the API, and the calling application requests access to the API Management instance. The scope of the access token is between the calling application and API Management. 

:::image type="content" source="media/authentication-authorization-overview/oauth-token-gateway.png" alt-text="Diagram showing OAuth communication where audience is the API Management gateway." border="false":::

There are different reasons for wanting to do this. For example:

* The backend is a legacy API that can't be updated to support OAuth. 

    API Management should first be configured to validate the token (checking the issuer and audience claims at a minimum). After validation, use one of several options available to secure onward connections from API Management. For example:  

    * Mutual TLS (mTLS), also known as [client certificate authentication](api-management-howto-mutual-certificates.md) 
    * Basic authentication  
    * API key 

* The context required by the backend isn’t possible to establish from the caller.  

    After API Management has successfully validated the token received from the caller, it then needs to obtain an access token for the backend API using its own context, or context derived from the calling application. This scenario can be accomplished using either: 

    * Custom policy to obtain an onward access token valid for the backend API from a configured identity provider.

    * The API Management instance's own identity – passing the token from the API Management resource's system-assigned or user-assigned [managed identity](api-management-authentication-policies.md#ManagedIdentity) to the backend API. 

### Token management by API Management

API Management also supports acquiring and secure storage of OAuth 2.0 tokens for certain downstream services using the [authorizations](authorizations-overview.md) (preview) feature, including through use of custom policy and caching.

With authorizations, API Management manages the tokens for access to OAuth 2.0 backends, simplifying the development of client apps that access APIs.

### Other options

Although authorization is preferred and OAuth 2.0 has become the dominant method of enabling strong Authorization for APIs, API Management enables other authentication options which can be useful if the backend or calling applications are legacy or don't yet support OAuth. Options include:

* Mutual TLS (mTLS), also known as client certificate authentication, between the client (app) and API Management. This authentication can be end-to-end, with the call between API Management and the backend API secured in the same way.  For more information, see [How to secure APIs using client certificate authentication in API Management](api-management-howto-mutual-certificates-for-clients.md)
* Basic authentication, using the [authentication-basic](api-management-authentication-policies.md#Basic) policy.
* Subscription key. For more information, see [Subscriptions in API Management](api-management-subscriptions.md). 

> [!NOTE]
> We recommend using a subscription key *in addition to* another method of authentication or authorization. On its own, a subscription key isn't a strong form of authentication, but use of the subscription key might be useful in certain scenarios, for example, tracking API usage which provides information that's otherwise publicly available.

## Developer portal (user plane)

The managed dveloper portal is an optional API Management feature that allows internal, external (or both) developers and other interested parties to discover and use APIs that are published through API Management.  

If you elect to customize and publish the developer portal, API Management provides different options to secure it: 

* **External users** - The preferred option when the developer portal is to be consumed externally is to enable business-to-consumer access control through Azure Active Directory B2C (Azure AD B2C). 
    * Azure AD B2C provides the option of using Azure AD B2C native accounts: users sign up to Azure AD B2C and use that identity to access the developer portal) 
    * Azure AD B2C is also useful if you want users to access the developer portal using existing social media accounts.  
    * Azure AD B2C provides many features to improve the end user sign up and sign in experience, including conditional access and MFA. 
    
    For steps to enable Azure AD B2C authentication in the developer portal, see [How to authorize developer accounts by using Azure Active Directory B2C in Azure API Management](api-management-howto-aad-b2c.md).


* **Internal users** - The preferred option when the developer portal is to be consumed internally is to leverage your corporate Azure Active Directory (Azure AD). Azure AD provides a seamless single sign-on (SSO) experience for corporate users that need to access discover APIs through the developer portal. 

    For steps to enable Azure AD authentication in the developer portal, see [How to authorize developer accounts by using Azure Active Directory in Azure API Management](api-management-howto-aad.md).
    

* **Basic authentication** - A default option is to use the built-in developer portal username and password provider, which allows developer users to register directly in API Management and sign in using API Management user accounts. Registration through this option is protected by a Captcha service. 

In addition to providing configuration for Developer users to sign-up for and log-in to the Developer Portal, a test console is also included, where the Developers can send test requests through API Management to the backend API. This test facility also exists for contributing users of API Management that are accessing the product through the Azure Portal. 

In either case, if the API being exposed through Azure API Management is secured with OAuth, in other-words a calling application (bearer) would need to obtain and pass a valid access token, the facility exists to configure API Management to generate a valid token on behalf of An Azure Portal or Developer Portal test-console user. For more information see here. 

Note: This additional OAuth configuration is independent of the configuration required for user access to the developer portal, but the IdP and user could be the same (for example an intranet application where the user accessing the developer portal does using SSO with their corporate identity, and that same corporate identity is also used to obtain a token, through the test console, for the backend service being called with the same user context. 



## Next steps

* Learn more about [authentication and authorization](../active-directory/develop/authentication-vs-authorization.md) in the Microsoft identity platform.

*  [Azure Active Directory B2C overview]
*  [Azure Active Directory B2C: Extensible policy framework]
*  [Use a Microsoft account as an identity provider in Azure Active Directory B2C]
*  [Use a Google account as an identity provider in Azure Active Directory B2C]
*  [Use a LinkedIn account as an identity provider in Azure Active Directory B2C]
*  [Use a Facebook account as an identity provider in Azure Active Directory B2C]


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
[Azure Active Directory B2C overview]: ../active-directory-b2c/overview.md
[How to authorize developer accounts using Azure Active Directory]: ./api-management-howto-aad.md
[Azure Active Directory B2C: Extensible policy framework]: ../active-directory-b2c/user-flow-overview.md
[Use a Microsoft account as an identity provider in Azure Active Directory B2C]: ../active-directory-b2c/identity-provider-microsoft-account.md
[Use a Google account as an identity provider in Azure Active Directory B2C]: ../active-directory-b2c/identity-provider-google.md
[Use a Facebook account as an identity provider in Azure Active Directory B2C]: ../active-directory-b2c/identity-provider-facebook.md
[Use a LinkedIn account as an identity provider in Azure Active Directory B2C]: ../active-directory-b2c/identity-provider-linkedin.md

[Prerequisites]: #prerequisites
[Configure an OAuth 2.0 authorization server in API Management]: #step1
[Configure an API to use OAuth 2.0 user authorization]: #step2
[Test the OAuth 2.0 user authorization in the Developer Portal]: #step3
[Next steps]: #next-steps

[Log in to the Developer portal using an Azure Active Directory account]: #Log-in-to-the-Developer-portal-using-an-Azure-Active-Directory-account
