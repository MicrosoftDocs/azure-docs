---
title: About API authorizations in Azure API Management
description: Learn about API authorizations in Azure API Management, a feature that simplifies the process of managing OAuth 2.0 authorization tokens to backend SaaS APIs
author: dlepow
ms.service: api-management
ms.topic: conceptual
ms.date: 02/21/2023
ms.author: danlep
ms.custom: references_regions
---

# What are API authorizations?

API Management *authorizations* provide a simple and reliable way to unbundle and abstract authorizations from your web APIs. Use authorizations to delegate authentication to your API Management instance to let it authenticate against a given backend service or SaaS platform. 

Authorizations simplify the process of managing authorization tokens when sending requests based on the OAuth 2.0 standard. By configuring any of the [supported identity providers](authorizations-configure-common-providers.md), API Management will retrieve and refresh access tokens to be used inside of API management or sent back to a client. This feature enables APIs to be exposed with or without a subscription key, and reduces development costs in ramping up, implementing, and maintaining security features with service integrations.

:::image type="content" source="media/authorizations-overview/overview-providers.png" alt-text="Diagram of API Management authorizations and supported SaaS providers." border="false":::

## Key scenarios

Using authorizations, customers can enable different scenarios and easily connect to SaaS providers or backend services that are using OAuth 2.0. Use authorizations for both attended scenarios (human-initiated) and unattended scenarios (fully automated). Examples include:

* **Attended** - Azure static web app that calls the GitHub API to add an issue to a repository. For more information, see the [blog post](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/use-static-web-apps-api-and-api-management-authorizations-to/ba-p/3603755).

    :::image type="content" source="media/authorizations-overview/static-web-apps-calls-github-api.png" alt-text="Diagram showing attended scenario for API Management authorization." border="false":::

* **Unattended** - Azure function using a timer trigger that uses an authorization to connect to a backend API.

    :::image type="content" source="media/authorizations-overview/azure-function-connects-backend-apis.png" alt-text="Diagram showing unattended scenario for API Management authorization." border="false":::

## How do authorizations work?

Authorizations consist of two parts, **management** and **runtime**.

### Management

The management part takes care of configuring identity providers, enabling the consent flow for the identity provider, and managing access to the authorizations. 

The following image summarizes the process flow for creating an authorization in API Management that uses the authorization code grant type. For configuration details, see [How to configure authorizations?](#how-to-configure-authorizations)

:::image type="content" source="media/authorizations-overview/get-token.svg" alt-text="Diagram showing process flow for creating authorizations." border="false":::

| Step | Description
| --- | --- |
| 1 | Client sends a request to create an authorization provider |
| 2 | Authorization provider is created, and a response is sent back |
| 3| Client sends a request to create an authorization |
| 4| Authorization is created, and a response is sent back with the information that the authorization is not "connected"| 
|5| Client sends a request to retrieve a login URL to start the OAuth 2.0 consent at the identity provider. The request includes a post-redirect URL to be used in the last step|  
|6|Response is returned with a login URL that should be used to start the consent flow. |
|7|Client opens a browser with the login URL that was provided in the previous step. The browser is redirected to the identity provider OAuth 2.0 consent flow | 
|8|After the consent is approved, the browser is redirected with an authorization code to the redirect URL configured at the identity provider| 
|9|API Management uses the authorization code to fetch access and refresh tokens| 
|10|API Management receives the tokens and encrypts them|
|11 |API Management redirects to the provided URL from step 5|

### Runtime

The runtime part uses the [`get-authorization-context` policy](get-authorization-context-policy.md) to fetch and store the authorization's access and refresh tokens. When a call comes into API Management, and the `get-authorization-context` policy is executed, it will first validate if the existing authorization token is valid. If the authorization token has expired, API Management uses an OAuth 2.0 flow to refresh the stored tokens from the identity provider. Then the access token is used to authorize access to the backend service.  
   
During the policy execution, access to the tokens is also validated using access policies.

The following image shows the process flow to fetch and store authorization and refresh tokens based on an authorization that uses the authorization code grant type. After the tokens have been retrieved, a call is made to the backend API. 

:::image type="content" source="media/authorizations-overview/get-token-for-backend.svg" alt-text="Diagram that shows the process flow for creating runtime." border="false":::

| Step | Description
| --- | --- |
| 1 |Client sends request to API Management instance|
|2|The [`get-authorization-context`](get-authorization-context-policy.md) policy checks if the access token is valid for the current authorization|
|3|If the access token has expired but the refresh token is valid, API Management tries to fetch new access and refresh tokens from the configured identity provider|
|4|The identity provider returns both an access token and a refresh token, which are encrypted and saved to API Management| 
|5|After the tokens have been retrieved, the access token is attached using the `set-header` policy as an authorization header to the outgoing request to the backend API|
|6| Response is returned to API Management|
|7| Response is returned to the client|


## How to configure authorizations?

### Requirements

* Managed system-assigned identity must be enabled for the API Management instance.

* API Management instance must have outbound connectivity to internet on port 443 (HTTPS).

### Availability

* All API Management service tiers

* Not supported in self-hosted gateway
* Not supported in sovereign clouds or in the following regions: australiacentral, australiacentral2, jioindiacentral

### Limits

| Resource | Limit |
| --------------------| ----|
| Maximum number of authorization providers per service instance| 1,000 |
| Maximum number of authorizations per authorization provider| 10,000 |
| Maximum number of access policies per authorization | 100 |
| Maximum number of authorization requests per minute per authorization | 250 |



### Configuration steps

Configuring an authorization in your API Management instance consists of three steps: configuring an authorization provider, granting access by logging in, and creating access policies.


:::image type="content" source="media/authorizations-overview/configure-authorization.png" alt-text="Diagram of steps to create an authorization in API Management." border="false":::

#### Authorization providers
Authorization provider configuration includes which identity provider and [grant type](#grant-types) are used. Each identity provider requires a specific configuration. For more information, see [Configure identity providers for API authorizations](authorizations-configure-common-providers.md).

* An authorization provider configuration can only have one grant type. 
* One authorization provider configuration can have multiple authorizations.


> [!NOTE]
> With the Generic OAuth 2.0 provider, other identity providers that support the standards of [OAuth 2.0 flow](https://oauth.net/2/) can be used.
> 

To use an authorization provider, at least one authorization is required. The process of configuring an authorization differs based on the used grant type. Each authorization provider configuration only supports one grant type. For example, if you want to configure Azure AD to use both grant types, two authorization provider configurations are needed.

#### Grant types

An API Management authorization can use either of two OAuth 2.0 grant types: [authorization code](https://www.rfc-editor.org/rfc/rfc6749?msclkid=929b18b5d0e611ec82a764a7c26a9bea#section-1.3.1) or [client credentials](https://www.rfc-editor.org/rfc/rfc6749?msclkid=929b18b5d0e611ec82a764a7c26a9bea#section-1.3.4). The grant type refers to the way that tokens are obtained and through which the tokens' access is restricted. 

**Authorization code grant type** is bound to a user context, meaning a user needs to consent to the authorization. As long as the refresh token is valid, API Management can retrieve new access and refresh tokens. If the refresh token becomes invalid, the user needs to reauthorize. All identity providers support authorization code. 

**Client credentials grant type** isn't bound to a user and is often used in application-to-application scenarios. No consent is required for client credentials grant type, and the authorization doesn't become invalid. 

#### Scopes

OAuth 2.0 *scopes* provide a way to limit the amount of access that is granted to an access token. Specify scopes to limit the access of any configured authorizations to a backend OAuth 2.0 API. The content and format of the scopes are specific to the identity provider and the API permissions you need. For example, you might configure a `User.Read` scope for an Azure AD authorization provider used to authorize access to user data via a Microsoft Graph API.


### Login to grant access

For authorizations based on the authorization code grant type, you must first manually login to the provider to consent to authorization. After successful login and authorization by the identity provider, the provider returns valid access and refresh tokens, which are encrypted and saved by API Management. After this initial consent, API Management uses the authorization settings to manage token retrieval.

### Access policies

You configure one or more *access policies* for each authorization. The access policies determine which [Azure AD identities](../active-directory/develop/app-objects-and-service-principals.md) are permitted to access that authorization's tokens for API access. The supported identities are as follows:


|Identity  |Description  |
|---------|---------|
|Managed identity     |  System- or user-assigned [managed identity](api-management-howto-use-managed-service-identity.md) for the API Management instance that's being used.<br/><br/>Simplest way to access authorization. However, identity is tied to specific Azure infrastructure, and anyone with contributor access to your Azure API Management instance can access any authorization granting managed identity permissions.        |
|Service principal     |   Identity of an Azure AD application in the same Azure AD tenant as the API Management instance, with access to the instance. <br/><br/>Permits more tightly scoped access control to authorization, and is not tied to specific API Management instance. However, getting the [authorization context](get-authorization-context-policy.md) requires you to manage Azure AD credentials.     |

## Security considerations

The access token and other authorization secrets (for example, client secrets) are encrypted with an envelope encryption and stored in an internal, multitenant storage. The data are encrypted with AES-128 using a key that is unique per data. Those keys are encrypted asymmetrically with a master certificate stored in Azure Key Vault and rotated every month.

## Frequently asked questions (FAQ)


### When are the access tokens refreshed?

When the policy `get-authorization-context` is executed at runtime, API Management checks if the stored access token is valid. If the token has expired or is near expiry, API Management uses the refresh token to fetch a new access token and a new refresh token from the configured identity provider. If the refresh token has expired, an error is thrown, and the authorization needs to be reauthorized before it will work.

### What happens if the client secret expires at the identity provider?

At runtime API Management can't fetch new tokens, and an error occurs. 

* If the authorization is of type authorization code, the client secret needs to be updated on authorization provider level.

* If the authorization is of type client credentials, the client secret needs to be updated on authorizations level.

### Is this feature supported using API Management running inside a VNet?

Yes, as long as outbound connectivity on port 443 is enabled to the **ServiceConnectors** service tag. For more information, see [Virtual network configuration reference](virtual-network-reference.md#required-ports).

### What happens when an authorization provider is deleted?

All underlying authorizations and access policies are also deleted.

### Are the access tokens cached by API Management?

The access token is cached by the API management until 3 minutes before the token expiration time.


### Next steps

Learn how to:
- Configure [identity providers](authorizations-configure-common-providers.md) for authorizations
- Configure and use an authorization for the [Microsoft Graph API](authorizations-how-to-azure-ad.md) or the [GitHub API](authorizations-how-to-github.md)
