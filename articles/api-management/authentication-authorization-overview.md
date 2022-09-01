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

Azure API Management provides a rich, flexible set of features to support API authentication and authorization in addition to the standard control-plane authentication and role-based access control (RBAC) required when interacting with Azure services. 

API Management also provides a fully customizable, standalone, managed [developer portal](api-management-howto-developer-portal.md), which can be leveraged externally (or internally) to allow developer users to discover and interact with the APIs published through API Management. The developer portal has several options to facilitate secure user sign-up and sign-in. 

The following diagram is a conceptual view of Azure API Management, showing the management plane, API gateway (data plane), and developer portal, each with at least one option to secure interaction. For more an introduction to the product components, see [What is Azure API Management?](api-management-key-concepts.md)

:::image type="content" source="media/authentication-authorization/api-management-security-high-level.png" alt-text="Diagram showing security features at all points of interaction in API Management" border="false":::

## Management plane

Administrators, operators, developers, and DevOps service principals are examples of the different personas required to manage an Azure API Management instance in a customer environment. 

Azure API Management relies on Azure Active Directory (Azure AD), which includes optional features such as multifactor authentication (MFA), and Azure RBAC to enable fine-grained access to the API Management service and its entities (for example, APIs and policies). For more information, see [How to use role-based access control in Azure API Management](api-management-role-based-access-control.md). 

The management plane can be accessed via an Azure AD login (or token) through the Azure portal, infrastructure-as-code templates (such as Azure Resource Manager or Bicep), the REST API, client SDKs, the Azure CLI, or Azure PowerShell. 

## Gateway (data plane)

Here, the context is authentication and authorization to the APIs managed in API Management: first from client apps to the API Management gateway, and then from the gateway to backend APIs.

In many customer environments, [OAuth 2.0](https://oauth.net/2/) protocol is the preferred authorization protocol for communication between apps and the gateway, and between the gateway and backends. API Management supports OAuth across these communication channels.



### OAuth concepts

What happens when a client app calls an API with a request that is secured using SSL/TLS and OAuth?

At a high level, the client (the calling app, or generally the *bearer*) obtains an *access token* from an identity provider's authorization server. 
The identity provider (for example, Azure AD) is the *issuer* of the token, and the token includes one or more *audience claims* that authorize access to a resource server (for example, a backend API, or the API Management gateway itself).

The resource server validates the access token by checking (at a minimum) that the issuer and audience claims contain expected values. Access to resources on the server is then granted.

Depending on the type of client app and scenarios, different *authentication flows* are needed to request and manage tokens. For example, the *authorization code* flow and grant type is commonly used in apps that call web APIs. For more information about OAuth flows and scenarios in Azure AD, see [Authentication flows and application scenarios](../active-directory/develop/authentication-flows-app-scenarios).
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
