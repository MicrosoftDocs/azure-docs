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
* Not supported in sovereign clouds or in the following regions: australiacentral, australiacentral2, jioindiacentral

## Key scenarios
This feature creates value for professional and citizen developers alike, supporting scenarios such as:

* Connect Power Apps and Power Automate developers to SaaS providers that require OAuth 2.0
* Enable Enterprise Application Integration (EAI) patterns using service-to-service authorization to use client credentials grant type against backend APIs that are using OAuth 2.0
* Expose APIs in API Management as a Logic Apps Custom Connector where the backend service requires an OAuth 2.0 flow
* Allow a marketing team to use the same authorization for interacting with a social media platform using OAuth 2.0

## Authorizations and authorization providers

An *authorization* is an API Management resource that you configure to fetch and store OAuth 2.0 tokens from one of the [supported identity providers](authorizations-reference.md) such as Azure Active Directory, GitHub, and several others, including a generic OAuth 2.0 provider. Use the authorization to manage the tokens for access to backend OAuth 2.0 services.

To create and use an authorization in API Management, you first configure an *authorization provider*. An authorization provider specifies one of the identity providers and the settings for an OAuth 2.0 flow using the provider. You can configure multiple authorizations based on a given authorization provider.

### Grant types

An API Management authorization provider specifies one of two OAuth 2.0 *grant types* for authorizations: authorization code, or client credentials. The grant type refers to the way that tokens are obtained and through which the tokens' access is restricted. 

You can use the authorization code grant type with any of the supported identity providers; API Management also supports the client credentials grant type for some of them. If an identity provider (such as Azure AD) supports both grant types and you want to configure authorizations for either, you need to configure a separate authorization provider for each grant type.


#### Authorization code grant type

The authorization code grant type is bound to a user context, meaning a user needs to consent to the authorization before the authorization server can return access and refresh tokens. As long as the refresh token is valid, API Management can retrieve new access and refresh tokens. If the refresh token becomes invalid, the user needs to reauthorize. [Learn more](https://www.rfc-editor.org/rfc/rfc6749?msclkid=929b18b5d0e611ec82a764a7c26a9bea#section-1.3.1) about the authorization code grant type.

The [Proof Key for Code Exchange (PKCE) extension](https://oauth.net/2/pkce/) to the authorization code grant type provides more security by introducing an additional secret that can be verified by the authorization server. We recommend using the authorization code grant type with PKCE extension if it's supported by the identity provider. 

#### Client credentials grant type

The client credentials grant type isn't bound to a user and is often used in application-to-application scenarios. No user consent is required for the client credentials grant type; a client requests an access token using only its credentials (id and secret). An API Management authorization using this grant type doesn't become invalid. [Learn more](https://www.rfc-editor.org/rfc/rfc6749?msclkid=929b18b5d0e611ec82a764a7c26a9bea#section-1.3.4) about the client credentials grant type.

### Scopes

OAuth 2.0 *scopes* provide a way to limit the amount of access that is granted to an access token. When you set up an authorization provider in API Management, optionally specify scopes to limit the access of any configured authorizations to an OAuth 2.0 API. The content and format of the scopes are specific to the identity provider and the API permissions needed for your scenario. For example, you might configure a `User.Read` scope for an Azure AD authorization provider used to authorize access to user data via a Microsoft Graph API.

### Consent flow

When you create an authorization based on the authorization code grant type, you must first manually login to the provider to consent to authorization. After successful login and authorization by the identity provider, the provider returns valid access and refresh tokens, which are encrypted and saved by API Management. After this initial consent, API Management uses the authorization settings to manage token retrieval.

### Access policies

You configure one or more *access policies* for each authorization. The access policies determine which identities are permitted to access that authorization's tokens for API access. The supported identities are Azure managed identities and service principals. The identities must belong to the same Azure AD tenant as the tenant where the API Management instance belongs. 


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




* The **runtime** part uses the [`get-authorization-context`](get-authorization-context-policy.md) policy to fetch and store access and refresh tokens. When a call comes into API Management, and the `get-authorization-context` policy is executed, it will first validate if the existing authorization token is valid. If the authorization token has expired, the refresh token is used to try to fetch a new authorization and refresh token from the configured identity provider. If the call to the backend provider is successful, the new authorization token will be used, and both the authorization token and refresh token will be stored encrypted.


    During the policy execution, access to the tokens is also validated using access policies.

:::image type="content" source="media/authorizations-overview/overview.png" alt-text="Screenshot showing identity providers that can be used for OAuth 2.0 authorizations in API Management." border="false":::    

### Requirements 

- Managed system-assigned identity must be enabled for the API Management instance.  
- API Management instance must have outbound connectivity to internet on port `443` (HTTPS).

### Limitations

For public preview the following limitations exist:

- Authorizations feature only supports Service Principal and Managed Identity as access policies.
- Authorizations feature only supports /.default app-only scopes while acquire token for https://.../authorizationmanager audience.
- Authorizations feature is not supported in the following regions: australiacentral, australiacentral2, jioindiacentral.
- Authorizations feature is not supported in National Clouds.
- Authorizations feature is not supported on self-hosted gateways.
- Supported identity providers can be found in [this](https://github.com/Azure/APIManagement-Authorizations/blob/main/docs/identityproviders.md) GitHub repository.
- Maximum configured number of authorization providers per API Management instance: 1,000
- Maximum configured number of authorizations per authorization provider: 10,000
- Maximum configured number of access policies per authorization: 100
- Maximum requests per minute per service: 250

### Authorization providers
 
Authorization provider configuration includes which identity provider and grant type are used. Each identity provider requires different configurations.

* An authorization provider configuration can only have one grant type. 
* One authorization provider configuration can have multiple authorizations.
* You can find the supported identity providers for public preview in [this](https://github.com/Azure/APIManagement-Authorizations/blob/main/docs/identityproviders.md) GitHub repository.

With the Generic OAuth 2.0 provider, other identity providers that support the standards of OAuth 2.0 flow can be used.


### Authorizations

To use an authorization provider, at least one *authorization* is required. The process of configuring an authorization differs based on the used grant type. Each authorization provider configuration only supports one grant type. For example, if you want to configure Azure AD to use both grant types, two authorization provider configurations are needed.

**Authorization code grant type**

Authorization code grant type is bound to a user context, meaning a user needs to consent to the authorization. As long as the refresh token is valid, API Management can retrieve new access and refresh tokens. If the refresh token becomes invalid, the user needs to reauthorize. All identity providers support authorization code. [Read more about Authorization code grant type](https://www.rfc-editor.org/rfc/rfc6749?msclkid=929b18b5d0e611ec82a764a7c26a9bea#section-1.3.1). 

**Client credentials grant type**

Client credentials grant type isn't bound to a user and is often used in application-to-application scenarios. No consent is required for client credentials grant type, and the authorization doesn't become invalid.  [Read more about Client Credentials grant type](https://www.rfc-editor.org/rfc/rfc6749?msclkid=929b18b5d0e611ec82a764a7c26a9bea#section-1.3.4).


### Access policies
Access policies determine which identities can use the authorization that the access policy is related to. The supported identities are managed identities, user identities, and service principals. The identities must belong to the same tenant as the API Management tenant.  

- **Managed identities** - System- or user-assigned identity for the API Management instance that is being used.
- **User identities** - Users in the same tenant as the API Management instance.  
- **Service principals** - Applications in the same Azure AD tenant as the API Management instance.

### Process flow for creating authorizations

The following image shows the process flow for creating an authorization in API Management using the grant type authorization code. For public preview no API documentation is available.

:::image type="content" source="media/authorizations-overview/get-token.svg" alt-text="Process flow for creating authorizations" border="false":::


1. Client sends a request to create an authorization provider. 
1. Authorization provider is created, and a response is sent back.
1. Client sends a request to create an authorization.
1. Authorization is created, and a response is sent back with the information that the authorization is not "connected". 
1. Client sends a request to retrieve a login URL to start the OAuth 2.0 consent at the identity provider. The request includes a post-redirect URL to be used in the last step.  
1. Response is returned with a login URL that should be used to start the consent flow. 
1. Client opens a browser with the login URL that was provided in the previous step. The browser is redirected to the identity provider OAuth 2.0 consent flow. 
1. After the consent is approved, the browser is redirected with an authorization code to the redirect URL configured at the identity provider. 
1. API Management uses the authorization code to fetch access and refresh tokens. 
1. API Management receives the tokens and encrypts them.
1. API Management redirects to the provided URL from step 5.

### Process flow for runtime

The following image shows the process flow to fetch and store authorization and refresh tokens based on a configured authorization. After the tokens have been retrieved a call is made to the backend API. 

:::image type="content" source="media/authorizations-overview/get-token-for-backend.svg" alt-text="Diagram that shows the process flow for creating runtime." border="false":::

1. Client sends request to API Management instance.
1. The policy [`get-authorization-context`](get-authorization-context-policy.md) checks if the access token is valid for the current authorization.
1. If the access token has expired but the refresh token is valid, API Management tries to fetch new access and refresh tokens from the configured identity provider.
1. The identity provider returns both an access token and a refresh token, which are encrypted and saved to API Management. 
1. After the tokens have been retrieved, the access token is attached using the `set-header` policy as an authorization header to the outgoing request to the backend API.
1. Response is returned to API Management.
1. Response is returned to the client.

### Error handling

If acquiring the authorization context results in an error, the outcome depends on how the attribute `ignore-error` is configured in the policy `get-authorization-context`. If the value is set to `false` (default), an error with `500 Internal Server Error` will be returned. If the value is set to `true`, the error will be ignored and execution will proceed with the context variable set to `null`.

If the value is set to `false`, and the on-error section in the policy is configured, the error will be available in the property `context.LastError`. By using the on-error section, the error that is sent back to the client can be adjusted. Errors from API Management can be caught using standard Azure alerts. Read more about [handling errors in policies](api-management-error-handling-policies.md).  

## Security considerations

The access token and other secrets (for example, client secrets) are encrypted with an envelope encryption and stored in an internal, multitenant storage. The data are encrypted with AES-128 using a key that is unique per data; those keys are encrypted asymmetrically with a master certificate stored in Azure Key Vault and rotated every month.

## Frequently asked questions (FAQ)


### When are the access tokens refreshed?

When the policy `get-authorization-context` is executed at runtime, API Management checks if the stored access token is valid. If the token has expired or is near expiry, API Management uses the refresh token to fetch a new access token and a new refresh token from the configured identity provider. If the refresh token has expired, an error is thrown, and the authorization needs to be reauthorized before it will work.

### What happens if the client secret expires at the identity provider?
At runtime API Management can't fetch new tokens, and an error will occur. 

* If the authorization is of type authorization code, the client secret needs to be updated on authorization provider level.

* If the authorization is of type client credentials, the client secret needs to be updated on authorizations level.

### Is this feature supported using API Management running inside a VNet?

Yes, as long as outbound connectivity on port 443 to dependencies are configured in the API Management gateway subnet. For more information, see [Virtual network configuration reference](virtual-network-reference.md#required-ports).

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
