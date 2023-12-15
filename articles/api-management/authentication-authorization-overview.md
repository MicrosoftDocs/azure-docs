---
title: API authentication and authorization - Overview
titleSuffix: Azure API Management
description: Learn about authentication and authorization features in Azure API Management to secure access to APIs, including options for OAuth 2.0 authorization.
author: dlepow

ms.service: api-management
ms.topic: conceptual
ms.date: 11/08/2023
ms.author: danlep
---

# Authentication and authorization to APIs in Azure API Management

This article is an introduction to a rich, flexible set of features in API Management that help you secure users' access to managed APIs.

API authentication and authorization in API Management involve securing the end-to-end communication of client apps to the API Management gateway and through to backend APIs. In many customer environments, OAuth 2.0 is the preferred API authorization protocol. API Management supports OAuth 2.0 authorization between the client and the API Management gateway, between the gateway and the backend API, or both independently.

:::image type="content" source="media/authentication-authorization-overview/data-plane-security.svg" alt-text="Diagram showing points of interaction for securing APIs.":::

API Management supports other client-side and service-side authentication and authorization mechanisms that supplement OAuth 2.0 or that are useful when OAuth 2.0 authorization for APIs isn't possible. How you choose from among these options depends on the maturity of your organization's API environment, your security and compliance requirements, and your organization's approach to [mitigating common API threats](mitigate-owasp-api-threats.md). 

> [!IMPORTANT]
> Securing users' access to APIs is one of many considerations for securing your API Management environment. For more information, see [Azure security baseline for API Management](/security/benchmark/azure/baselines/api-management-security-baseline?toc=%2Fazure%2Fapi-management%2F&bc=%2Fazure%2Fapi-management%2Fbreadcrumb%2Ftoc.json).

> [!NOTE]
> Other API Management components have separate mechanisms to secure and restrict user access:
> * For managing the API Management instance through the Azure control plane, API Management relies on Microsoft Entra ID and Azure [role-based access control (RBAC)](api-management-role-based-access-control.md).
> * The API Management developer portal supports [several options](secure-developer-portal-access.md) to facilitate secure user sign-up and sign-in.

## Authentication versus authorization

Here's a brief explanation of authentication and authorization in the context of access to APIs:

* **Authentication** - The process of verifying the identity of a user or app that accesses the API. Authentication may be done through credentials such as username and password, a certificate, or through single sign-on (SSO) or other methods.

* **Authorization** - The process of determining whether a user or app has permission to access a particular API, often through a token-based protocol such as OAuth 2.0.

> [!NOTE]
> To supplement authentication and authorization, access to APIs should also be secured using TLS to protect the credentials or tokens that are used for authentication or authorization.

## OAuth 2.0 concepts

[OAuth 2.0](https://oauth.net/2) is a standard authorization framework that is widely used to secure access to resources such as web APIs. OAuth 2.0 restricts actions of what a client app can perform on resources on behalf of the user, without ever sharing the user's credentials. While OAuth 2.0 isn't an authentication protocol, it's often used with OpenID Connect (OIDC), which extends OAuth 2.0 by providing user authentication and SSO functionality.

### OAuth flow

What happens when a client app calls an API with a request that is secured using TLS and OAuth 2.0? The following is an abbreviated example flow:

* The client (the calling app, or *bearer*) authenticates using credentials to an *identity provider*.
* The client obtains a time-limited *access token* (a JSON web token, or JWT) from the identity provider's *authorization server*. 
    
    The identity provider (for example, Microsoft Entra ID) is the *issuer* of the token, and the token includes an *audience claim* that authorizes access to a *resource server* (for example, to a backend API, or to the API Management gateway itself).
* The client calls the API and presents the access token - for example, in an Authorization header.
* The *resource server* validates the access token. Validation is a complex process that includes a check that the *issuer* and *audience* claims contain expected values. 
* Based on token validation criteria, access to resources of the [backend](backends.md) API is then granted.

Depending on the type of client app and scenarios, different *authorization flows* are needed to request and manage tokens. For example, the authorization code flow and grant type are commonly used in apps that call web APIs. Learn more about [OAuth flows and application scenarios in Microsoft Entra ID](../active-directory/develop/authentication-flows-app-scenarios.md).

## OAuth 2.0 authorization scenarios in API Management

### Scenario 1 - Client app authorizes directly to backend

A common authorization scenario is when the calling application requests access to the backend API directly and presents an OAuth 2.0 token in an authorization header to the gateway. Azure API Management then acts as a "transparent" proxy between the caller and backend API, and passes the token through unchanged to the backend. The scope of the access token is between the calling application and backend API. 

The following image shows an example where Microsoft Entra ID is the authorization provider. The client app might be a single-page application (SPA). 

:::image type="content" source="media/authentication-authorization-overview/oauth-token-backend.svg" alt-text="Diagram showing OAuth communication where audience is the backend.":::

Although the access token sent along with the HTTP request is intended for the backend API, API Management still allows for a defense in depth approach. For example, configure policies to [validate the JWT](validate-jwt-policy.md), rejecting requests that arrive without a token, or a token that's not valid for the intended backend API. You can also configure API Management to check other claims of interest extracted from the token. 

> [!NOTE]
> If you secure an API exposed through Azure API Management with OAuth 2.0 in this way, you can configure API Management to generate a valid token for test purposes on behalf of an Azure portal or developer portal test console user. You need to add an OAuth 2.0 server to your API Management instance and enable OAuth 2.0 authorization settings in the API. For more information, see [How to authorize test console of developer portal by configuring OAuth 2.0 user authorization](api-management-howto-oauth2.md).

Example:

* [Protect an API in Azure API Management using OAuth 2.0 authorization with Microsoft Entra ID](api-management-howto-protect-backend-with-aad.md)

> [!TIP]
> In the special case when API access is protected using Microsoft Entra ID, you can configure the [validate-azure-ad-token](validate-azure-ad-token-policy.md) policy for token validation.

### Scenario 2 - Client app authorizes to API Management 

In this scenario, the API Management service acts on behalf of the API, and the calling application requests access to the API Management instance. The scope of the access token is between the calling application and the API Management gateway. In API Management, configure a policy ([validate-jwt](validate-jwt-policy.md) or [validate-azure-ad-token](validate-azure-ad-token-policy.md)) to validate the token before the gateway passes the request to the backend. A separate mechanism typically secures the connection between the gateway and the backend API.

In the following example, Microsoft Entra ID is again the authorization provider, and mutual TLS (mTLS) authentication secures the connection between the gateway and the backend.

:::image type="content" source="media/authentication-authorization-overview/oauth-token-gateway.svg" alt-text="Diagram showing OAuth communication where audience is the API Management gateway.":::

There are different reasons for doing this. For example:

* **The backend is a legacy API that can't be updated to support OAuth** 

    API Management should first be configured to validate the token (checking the issuer and audience claims at a minimum). After validation, use one of several options available to secure onward connections from API Management, such as mutual TLS (mTLS) authentication. See [Service side options](#service-side-options), later in this article.

* **The context required by the backend isn't possible to establish from the caller**  

    After API Management has successfully validated the token received from the caller, it then needs to obtain an access token for the backend API using its own context, or context derived from the calling application. This scenario can be accomplished using either: 

    * A custom policy such as [send-request](send-request-policy.md) to obtain an onward access token valid for the backend API from a configured identity provider. 

    * The API Management instance's own identity – passing the token from the API Management resource's system-assigned or user-assigned [managed identity](authentication-managed-identity-policy.md) to the backend API. 

* **The organization wants to adopt a standardized authorization approach**

    Regardless of the authentication and authorization mechanisms on their API backends, organizations may choose to converge on OAuth 2.0 for a standardized authorization approach on the front end. API Management's gateway can enable consistent authorization configuration and a common experience for API consumers as the organization's backends evolve.

### Scenario 3: API Management authorizes to backend

With managed [connections](credentials-overview.md) (formerly called *authorizations*), you use credential manager in API Management to authorize access to one or more backend or SaaS services, such as LinkedIn, GitHub, or other OAuth 2.0-compatible backends. In this scenario, a user or client app makes a request to the API Management gateway, with gateway access controlled using an identity provider or other [client side options](#client-side-options). Then, through [policy configuration](get-authorization-context-policy.md), the user or client app delegates backend authentication and authorization to API Management. 

In the following example, a subscription key is used between the client and the gateway, and GitHub is the credential provider for the backend API.

:::image type="content" source="media/authentication-authorization-overview/oauth-token-authorization.svg" alt-text="Diagram showing authorization to backend SaaS service using a connection managed in credential manager.":::

With a connection to a credential provider, API Management acquires and refreshes the tokens for API access in the OAuth 2.0 flow. Connections simplify token management in multiple scenarios, such as:

* A client app might need to authorize to multiple SaaS backends to resolve multiple fields using GraphQL resolvers.
* Users authenticate to API Management by SSO from their identity provider, but authorize to a backend SaaS provider (such as LinkedIn) using a common organizational account.
* A client app (or bot) needs to access backend secured online resources on behalf of an authenticated user (for example, checking emails or placing an order).

Examples:

* [Configure credential manager - Microsoft Graph API](credentials-how-to-azure-ad.md)
* [Configure credential manager - GitHub API](credentials-how-to-github.md)
* [Configure credential manager - user delegated access to backend APIs](credentials-how-to-github.md)

## Other options to secure APIs

While authorization is preferred, and OAuth 2.0 has become the dominant method of enabling strong authorization for APIs, API Management provides several other mechanisms to secure or restrict access between client and gateway (client side) or between gateway and backend (service side). Depending on the organization's requirements, these may be used to supplement OAuth 2.0. Alternatively, configure them independently if the calling applications or backend APIs are legacy or don't yet support OAuth 2.0. 

### Client side options

|Mechanism  |Description  |Considerations  |
|---------|---------|---------|
|[mTLS](api-management-howto-mutual-certificates-for-clients.md)     |   [Validate certificate](validate-client-certificate-policy.md) presented by the connecting client and check certificate properties against a certificate managed in API Management     |  Certificate may be stored in a key vault.       |
|[Restrict caller IPs](ip-filter-policy.md)     | Filter (allow/deny) calls from specific IP addresses or address ranges.        |  Use to restrict access to certain users or organizations, or to traffic from upstream services.       |
|[Subscription key](api-management-subscriptions.md)     |  Limit access to one or more APIs based on an API Management [subscription](api-management-howto-create-subscriptions.md)      |  We recommend using a subscription (API) key *in addition to* another method of authentication or authorization. On its own, a subscription key isn't a strong form of authentication, but use of the subscription key might be useful in certain scenarios, for example, tracking individual customers' API usage or granting access to specific API products.       |

> [!TIP]
> For defense in depth, deploying a web application firewall upstream of the API Management instance is strongly recommended. For example, use [Azure Application Gateway](/azure/architecture/reference-architectures/apis/protect-apis) or [Azure Front Door](front-door-api-management.md). 


### Service side options

|Mechanism  |Description  |Considerations  |
|---------|---------|---------|
|[Managed identity authentication](authentication-managed-identity-policy.md)     |   Authenticate to backend API with a system-assigned or user-assigned [managed identity](api-management-howto-use-managed-service-identity.md).      |   Recommended for scoped access to a protected backend resource by obtaining a token from Microsoft Entra ID.    |
|[Certificate authentication](authentication-certificate-policy.md)     |    Authenticate to backend API using a client certificate.      |  Certificate may be stored in key vault.      |
|[Basic authentication](authentication-basic-policy.md)     |   Authenticate to backend API with username and password that are passed through an Authorization header.      | Discouraged if better options are available.         |

## Next steps
* Learn more about [authentication and authorization](../active-directory/develop/authentication-vs-authorization.md) in the Microsoft identity platform.
* Learn how to [mitigate OWASP API security threats](mitigate-owasp-api-threats.md) using API Management.
