---
title: About authorizations in Azure API Management | Microsoft Docs
description: Learn about authorizations in Azure API Management, a feature that simplifies the process of managing OAuth 2.0 authorization tokens to backend SaaS APIs
author: dlepow
ms.service: api-management
ms.topic: conceptual
ms.date: 02/07/2023
ms.author: danlep
ms.custom: references_regions
---

# Authorizations overview

API Management authorizations are resources you create to manage access tokens when sending requests to APIs based on the OAuth 2.0 standard. When you set up an authorization with a supported identity provider, API Management can retrieve and refresh access tokens to be used inside of API management or sent back to a client. This feature enables APIs to be exposed with or without a subscription key, and the authorization to the backend service uses OAuth 2.0. Authorizations support the standard OAuth 2.0 authorization code and client credentials grant types.  

Use authorizations as a service-maintained authorization token store for building connectors to third-party services including common SaaS providers. API Management manages the token lifecycle without requiring complex authentication and authorization code in client apps.

## Availability
* All API Management service tiers
* Not supported in self-hosted gateway
* Not supported in     or in the following regions: australiacentral, australiacentral2, jioindiacentral

## Limits

| Resource | Limit |
| --- | --- |
[!INCLUDE [api-management-authorization-limits](../../includes/api-management-authorization-limits.md)]

## Key scenarios
This feature creates value for professional and citizen developers alike, supporting scenarios such as:

* Connect Power Apps and Power Automate developers to SaaS providers that require OAuth 2.0
* Enable Enterprise Application Integration (EAI) patterns using service-to-service authorization to use client credentials grant type against backend APIs that are using OAuth 2.0
* Expose APIs in API Management as a Logic Apps Custom Connector where the backend service requires an OAuth 2.0 flow
* Allow a marketing team to use the same authorization for interacting with a social media platform using OAuth 2.0

## Authorizations and authorization providers

An *authorization* is an API Management resource that you configure to fetch and store OAuth 2.0 tokens from one of the [supported identity providers](authorizations-reference.md) such as Azure Active Directory, GitHub, and several others, including a generic OAuth 2.0 provider. Use the authorization to manage the tokens for access to backend OAuth 2.0 services.

An authorization is based on an *authorization provider*. An authorization provider specifies one of the identity providers and the settings for an OAuth 2.0 flow using the provider. You can configure multiple authorizations based on a given authorization provider.

### Grant types

An API Management authorization provider specifies one of two OAuth 2.0 *grant types*: authorization code, or client credentials. The grant type refers to the way that tokens are obtained and through which the tokens' access is restricted. 

You can use the authorization code grant type with any of the supported identity providers; API Management also supports the client credentials grant type for some of them. If an identity provider (such as Azure AD) supports both grant types and you want to configure authorizations for either, you need to configure a separate authorization provider for each grant type.


#### Authorization code grant type

The authorization code grant type is bound to a user context, meaning a user needs to consent to the authorization before the authorization server can return access and refresh tokens. As long as the refresh token is valid, API Management can retrieve new access and refresh tokens. If the refresh token becomes invalid, the user needs to reauthorize. [Learn more](https://www.rfc-editor.org/rfc/rfc6749?msclkid=929b18b5d0e611ec82a764a7c26a9bea#section-1.3.1) about the authorization code grant type.

#### Client credentials grant type

The client credentials grant type isn't bound to a user and is often used in application-to-application scenarios. No user consent is required for the client credentials grant type; only client credentials (ID and secret) are needed for an authorization server to return an access token. An API Management authorization using this grant type doesn't become invalid. [Learn more](https://www.rfc-editor.org/rfc/rfc6749?msclkid=929b18b5d0e611ec82a764a7c26a9bea#section-1.3.4) about the client credentials grant type.

### Scopes

OAuth 2.0 *scopes* provide a way to limit the amount of access that is granted to an access token. When you set up an authorization provider in API Management, optionally specify scopes to limit the access of any configured authorizations to an OAuth 2.0 API. The content and format of the scopes are specific to the identity provider and the API permissions you need. For example, you might configure a `User.Read` scope for an Azure AD authorization provider used to authorize access to user data via a Microsoft Graph API.

### Consent flow

When creating an authorization based on the authorization code grant type, you must first manually login to the provider to consent to authorization. After successful login and authorization by the identity provider, the provider returns valid access and refresh tokens, which are encrypted and saved by API Management. After this initial consent, API Management uses the authorization settings to manage token retrieval.

### Access policies

You configure one or more *access policies* for each authorization. The access policies determine which identities are permitted to access that authorization's tokens for API access. The supported identities are Azure managed identities or Azure AD service principals. The identities must belong to the same Azure AD tenant as the tenant where the API Management instance belongs. 


|Identity  |Description  |Typical scenarios  |
|---------|---------|---------|
|Managed identities     |  System- or user-assigned identity for the API Management instance that is being used       |         |
|Service principals    |   Applications in the same Azure AD tenant as the API Management instance.      |         |

### Process flow for creating authorizations

The following image summarizes the process flow for creating an authorization in API Management that uses the authorization code grant type.

:::image type="content" source="media/authorizations-overview/get-token.svg" alt-text="Process flow for creating authorizations" border="false":::

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

## Use an authorization for API requests

### Configure get-authorization-context policy

Configure the [get-authorization-context](get-authorization-context-policy.md) policy to retrieve a stored authorization token in the context of API requests. 

When the `get-authorization-context` policy is executed at runtime for a related API request, API Management checks if the stored access token is valid. During the policy execution, access to the tokens is also validated using access policies. 

* If the access token is valid, it can be used directly to authorize a request to an API backend, or if configured to do so, returned to the client for further processing.

* If the token has expired or is near expiry, API Management uses the refresh token to fetch a new access token and a new refresh token from the configured identity provider. If the refresh token has expired, an error is thrown, and the authorization needs to be reauthorized before it will work.

> [!NOTE]
> If acquiring the authorization context results in an error, the outcome depends on how the `ignore-error` attribute is configured in the `get-authorization-context` policy.

### Process flow for runtime

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

- Learn how to [configure and use an authorization](authorizations-how-to.md).
- See [reference](authorizations-reference.md) for supported identity providers in authorizations.
- Use [policies]() together with authorizations.  
- Authorizations [samples](https://github.com/Azure/APIManagement-Authorizations) GitHub repository. 
- Learn more about OAuth 2.0:

    * [OAuth 2.0 overview](https://aaronparecki.com/oauth-2-simplified/)
    * [OAuth 2.0 specification](https://oauth.net/2/)
