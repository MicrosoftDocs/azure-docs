---
title: API authentication and authorization - Overview
titleSuffix: Azure API Management
description: Learn about authentication and authorization features in Azure API Management to secure access to APIs
author: dlepow

ms.service: api-management
ms.topic: conceptual
ms.date: 04/25/2023
ms.author: danlep
---

# Authentication and authorization to APIs in Azure API Management

This article is an introduction to a rich, flexible set of features in API Management that help you secure users' access to managed APIs.

API authentication and authorization in API Management involve securing the end-to-end communication of client apps to the API Management gateway and through to backend APIs. In many customer environments, OAuth 2.0 is the preferred API authorization protocol, and it can be configured on either or both the client side and the service side of the API Management gateway. API Management supports other authentication and authorization mechanisms that can supplement OAuth 2.0 or that you can use when OAuth 2.0 authorization isn't possible.


[INSERT IMAGE]

## Authentication versus authorization

* **Authentication** -

* **Authorization** -

## OAuth 2.0 concepts

[OAuth 2.0](https://datatracker.ietf.org/doc/html/rfc6749) is a standard authorization framework that is widely used to secure access to resources such as web APIs. OAuth 2.0 restricts actions of what a client app can perform on resources on behalf of the user, without ever sharing the user's credentials. While OAuth 2.0 is not an authentication protocol, it's often used with OpenID Connect (OIDC), which extends OAuth 2.0 by providing user authentication and single sign-on (SSO) functionality.

### OAuth flow

What happens when a client app calls an API with a request that is secured using TLS and OAuth 2.0? The following is an abbreviated example flow:

* The client (the calling app, or *bearer*) authenticates using credentials to an *identity provider*.
* The client obtains a time-limited *access token* (a JSON web token, or JWT) from the identity provider's *authorization server*. 
    
    The identity provider (for example, Azure AD) is the *issuer* of the token, and the token includes an *audience claim* that authorizes access to a *resource server* (for example, to a backend API, or to the API Management gateway itself).
* The client calls the API and presents the access token - for example, in an Authorization header.
* The *resource server* validates the access token. Validation is a complex process that includes a check that the *issuer* and *audience* claims contain expected values. 
* Based on token validation criteria, access to resources of the [backend](backends.md) API is then granted.

Depending on the type of client app and scenarios, different *authorization flows* are needed to request and manage tokens. For example, the authorization code flow and grant type are commonly used in apps that call web APIs. Learn more about [OAuth flows and application scenarios in Azure AD](../active-directory/develop/authentication-flows-app-scenarios.md).

## OAuth 2.0 authorization scenarios in API Management

### Scenario 1 - Client app authorizes directly to backend

A common authorization scenario is when the calling application requests access to the backend API directly and presents an OAuth 2.0 token in an authorization header to the gateway. Azure API Management is then a "transparent" proxy between the caller and backend API, and passes the token through unchanged to the backend. The scope of the access token is between the calling application and backend API. 

The following image shows an example where Azure AD is the authorization provider.

:::image type="content" source="media/authentication-authorization-overview/oauth-token-backend.svg" alt-text="Diagram showing OAuth communication where audience is the backend." border="false":::

Although the access token sent along with the HTTP request is intended for the backend API, API Management still allows for a defense in depth approach. For example, configure policies to [validate the JWT](validate-jwt-policy.md), rejecting requests that arrive without a token, or a token that's not valid for the intended backend API. You can also configure API Management to check other claims of interest extracted from the token. 

Example:

* [Protect an API in Azure API Management using OAuth 2.0 authorization with Azure Active Directory](api-management-howto-protect-backend-with-aad.md)

> [!TIP]
> In the special case when API access is protected using Azure AD, you can configure the [validate-azure-ad-token](validate-azure-ad-token-policy.md) policy for token validation.

### Scenario 2 - Client app authorizes to API Management 

In this scenario, the API Management service acts on behalf of the API, and the calling application requests access to the API Management instance. The scope of the access token is between the calling application and the API Management gateway. In API Management, configure a policy ([validate-jwt](validate-jwt-policy.md) or [validate-azure-ad-token](validate-azure-ad-token-policy.md)) to validate the token before the gateway passes the request to the backend. A separate mechanism typically secures the connection between the gateway and the backend API.

In the following example, Azure AD is again the authorization provider, and mutual TLS (mTLS) authentication secures the connection between the gateway and the backend.

:::image type="content" source="media/authentication-authorization-overview/oauth-token-gateway.svg" alt-text="Diagram showing OAuth communication where audience is the API Management gateway." border="false":::

There are different reasons for wanting to do this. For example:

* The backend is a legacy API that can't be updated to support OAuth. 

    API Management should first be configured to validate the token (checking the issuer and audience claims at a minimum). After validation, use one of several options available to secure onward connections from API Management, such as mTLS authentication. See [Service side options](#service-side-options), later in this article.

* The context required by the backend isn't possible to establish from the caller.  

    After API Management has successfully validated the token received from the caller, it then needs to obtain an access token for the backend API using its own context, or context derived from the calling application. This scenario can be accomplished using either: 

    * A custom policy to obtain an onward access token valid for the backend API from a configured identity provider.

    * The API Management instance's own identity – passing the token from the API Management resource's system-assigned or user-assigned [managed identity](authentication-managed-identity-policy.md) to the backend API. 


### Scenario 3: API management authorizes to backend

With [API authorizations](authorizations-overview.md), you configure API Management itself to authorize access to one or more backend or SaaS services, such as LinkedIn, GitHub, or other OAuth 2.0-compatible backends. In this scenario, a user or client app makes a request to the API Management gateway, with gateway access controlled using an identity provider or other [client side options](#client-side-options). Then, through [policy configuration](get-authorization-context-policy.md), the user or client app delegates backend authentication and authorization to API Management. 

In the following example, GitHub is the authorization provider for the backend AI.

[IMAGE]

With an API authorization, API Management acquires and refreshes the tokens in the OAuth 2.0 flow. Authorizations simplify token management in multiples scenarios, for example, with clients that need to authorize to multiple SaaS backends. 

Examples:

* [Create an authorization with the Microsoft Graph API](authorizations-how-to-azure-ad.md)
* [Create an authorization with the GitHub API](authorizations-how-to-github.md)

## Additional options to secure APIs
Although authorization is preferred and OAuth 2.0 has become the dominant method of enabling strong authorization for APIs, API Management enables other mechanisms to secure or restrict access between the client and the gateway (client side) or between the gateway and the backend (service side). Depending on the organization's requirements, these may be used to supplement OAuth 2.0. Alternatively, you can configure them independently if the calling applications or backend APIs are legacy or don't yet support OAuth. 

### Client side options

|Mechanism  |Description  |Considerations  |
|---------|---------|---------|
|[Mutual TLS](api-management-howto-mutual-certificates-for-clients.md)     |   Validate certificate presented by the connecting client and check certificate properties against a certificate managed in API Management     |  Certificate may        |
|[Subscription key](api-management-subscriptions.md)     |  Limit access to one or more APIs based on an API Management subscription      |  We recommend using a subscription (API) key *in addition to* another method of authentication or authorization. On its own, a subscription key isn't a strong form of authentication, but use of the subscription key might be useful in certain scenarios, for example, tracking individual customers' API usage.       |
|[Restrict caller IPs](ip-filter-policy.md)     | Filter (allow/deny) calls from specific IP addresses or address ranges.        |         |
|Row4     |         |         |


### Service side options

|Mechanism  |Description  |Considerations  |
|---------|---------|---------|
|[Basic authentication](authentication-basic-policy.md)     |         |         |
|[Managed identity authentication](authentication-managed-identity-policy.md)     |         |         |
|[Certificate authentication](authentication-certificate-policy.md)     |         |         |
|Row4     |         |         |



## Preserving user context

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
| Validate the OAuth 2.0 token and claims when an API is called through API Management with an access token.     |     [Validate JWT policy](validate-jwt-policy.md)     |

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
| Validate the OAuth 2.0 token and claims when the SPA calls API Management with an access token. In this case, the audience is API Management.   | [Validate JWT policy](validate-jwt-policy.md)  |
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
