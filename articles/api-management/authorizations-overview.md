---
title: About OAuth 2.0 authorizations in Azure API Management | Microsoft Docs
description: Learn about authorizations in Azure API Management, a feature that simplifies the process of managing OAuth 2.0 authorization tokens to APIs
author: dlepow
ms.service: api-management
ms.topic: conceptual
ms.date: 05/02/2022
ms.author: danlep
---

# Authorizations overview

API Management *authorizations* (preview) simplifies the process of managing authorization tokens to OAuth 2.0 backend services. The feature consists of two parts, management and runtime.

The management part takes care of configuring identity providers, enabling the consent flow for the identity provider, and managing access to the authorizations.

The runtime part is using policies to fetch and store authorization and refresh tokens. When a call comes into API Management and the `get-authorization-context` policy is executed, it will first validate if the existing authorization token is valid. If the authorization token has expired, the refresh token is used to try to fetch a new authorization and refresh token from the configured identity provider. If the call to the backend provider is successful, the new authorization token will be used and both the authorization token and refresh token will be stored encrypted.

During the policy execution, the access to the tokens is also validated using access policies.

:::image type="content" source="media/authorizations-overview/overview.png" alt-text="Identity providers that can be used for OAuth 2.0 authorizations in API Management" border="false":::

Learn more about OAuth 2.0:

* [OAuth 2.0 overview](https://aaronparecki.com/oauth-2-simplified/)
* [OAuth 2.0 specification](https://oauth.net/2/)  

## Authorization providers
 
Authorization provider configuration includes which identity provider and grant type are used. Each identity provider requires different configurations.

* An authorization provider configuration can only have one grant type. 
* One authorization provider configuration can have multiple authorizations.

The following identity providers are supported for public preview:

- Azure AD, DropBox, Facebook, Generic OAuth 2, GitHub, Google, Instagram, LinkedIn, Spotify

With the Generic OAuth 2 provider, other identity providers that support the standards of OAuth 2.0 flow can be used.

## Authorizations

To use an authorization provider, at least one *authorization* is required. Depending on what grant type is used, the process of configuring an authorization differs.

### Authorization code
Authorization code grant type is bound to a user context, which means that a user needs to consent to the authorization. As long as the refresh token is valid, API Management can retrieve new access and refresh tokens. If the refresh token becomes invalid, the user needs to reauthorize.

### Client credentials
Client credentials grant type isn't bound to a user and is often used in application-to-application scenarios. No consent is required for client credentials grant type, and the authorization doesn’t become invalid.

## Access policies
Access policies determine which identities can use the authorization that the access policy is related to. There are three types of identities that can be used. The identities must belong to the same tenant as the API Management tenant.  

- Managed identities - System- or user-assigned identity for the API Management instance that is being used.
- User identities - Users in the same tenant as the API Management instance.  
- Service principals - Applications in the same Azure AD tenant as the API Management instance.

## Supported grant types

The supported grant types depend on the identity provider being used. All identity providers support authorization code and some of them also support client credentials.
Each authorization provider configuration only supports one grant type. This means, for example, if you want to configure Azure AD to use both grant types, two authorization provider configurations are needed.

## Process flow for creating authorizations

:::image type="content" source="media/authorizations-overview/get-token.png" alt-text="Process flow for creating authorizations" border="false":::

1. Client sends a request to Azure REST API with a post login URL. For public preview, Contributor role of API Management instance is required. 
1. Authorization is created but not "connected". 
1. Client sends a request to retrieve a link to start the OAuth 2.0 consent at the identity provider. 
1. Response is returned with a URL that should be used to start the consent flow. 
1. Client opens a browser with the URL that was provided in the previous step. The browser is redirected to the identity provider OAuth 2.0 consent flow. 
1. After the consent is approved, the browser is redirected with an authorization code to the redirect URL configured at the identity provider. 
1. API Management uses the authorization code to fetch access and refresh token. 
1. API Management receives the tokens and encrypts them.
1. API Management redirects to the provided URL from step 1.

## Process flow for runtime

:::image type="content" source="media/authorizations-overview/get-token-for-backend.png" alt-text="Process flow for creating runtime" border="false":::

1. Client sends request to API Management instance.
1. Inbound policy `get-authorization-context` checks if the access token is valid for the current authorization.
1. If the access token has expired but the refresh token is valid, API Management tries to fetch new access and refresh token from the configured identity provider.
1. The identity provider returns both an access token and refresh token, which are encrypted and saved to API Management. 
1. Policy is configured to attach a bearer token as a header to the outgoing request.
1. Response is returned to API Management.
1. Response is returned to the client.

## Error handling

If acquiring the authorization context results in an error, the outcome depends on how the attribute `ignore-error` is configured in the policy `get-authorization-context`. If the value is set to `false` (default), an error with `500 Internal Server Error` will be returned. If the value is set to `true`, the error will be ignored and execution will proceed.

If the value is set to `false` and the on-error section in the policy is configured, the error will be available in the property `context.LastError`. By using the on-error section, the error that is sent back to the client could be adjusted. Errors from API Management could be caught using standard Azure alerts.

## Requirements

- Managed identity must be enabled for the API Management instance.
- API Management instance must have outbound connectivity to internet on port `443` (HTTPS).

## Limitations

For public preview the following limitations exist.

- Identity providers supported: Azure AD, DropBox, Facebook, Generic OAuth 2, GitHub, Google, Instagram, LinkedIn, Spotify
- Maximum configured number of authorization providers per API Management instance: 50
- Maximum configured number of authorizations per Authorization provider: 500
- Max configured number of access policies per authorization: 100
- Maximum requests per minute per authorization: 100
- Authorization code PKCE flow with code challenge isn't supported
- Authorizations feature isn't supported on self-hosted gateway

## Authorizations FAQ

### How are the tokens stored in API Management?

The authorization token and other secrets (for example, client secrets) are encrypted with an envelope encryption and stored in an internal, multitenant storage. The data are encrypted with AES-128 using a key that is unique per data; those keys are encrypted asymmetrically with a master certificate stored in Azure Key Vault and rotated every month.

### When are the access tokens refreshed?

When the policy `get-authorization-context` is executed at runtime, API Management checks if the stored authorization token is valid. If the token has expired, API Management uses the refresh token to fetch a new authorization token and a new refresh token from the configured identity provider. If the refresh token has expired, an error is thrown and the authorization needs to be reauthorized before it will work.

### What happens if the client secret expires at the identity provider?
At runtime API Management can't fetch new tokens and an error will occur. 

If the Authorization is of type `Authorization code` the client secret needs to be updated on authorization provider level.

If the Authorization is of type `Client credentials` the client secret needs to be updated on authorizations level.

### Is this feature supported using API Management running inside a VNet?

Yes, as long as API Management gateway has outbound internet connectivity on port `443`.

### What happens when an authorization provider is deleted?

All underlying authorizations and access policies are also deleted.

### Are the authorization tokens cached by API Management?

The authorization tokens are cached for 15 seconds by API Management.

### What grant types are supported?

For public preview, the Azure AD identity provider supports authorization code and client credentials.

The other identity providers support authorization code. After public preview, more identity providers and grant types will be added.

# Policies

To access the authorization and its access token at runtime, you need to add `get-authorization-context` to the API you want to use. This policy gets the authorization context of the specified authorization, including the access token.

### Policy Statement

```xml
<get-authorization-context
    provider-id="authorization provider id" 
    authorization-id="authorization id" 
    context-variable-name="variable name" 
    identity-type ="managed | JWT"
    identity = "JWT bearer token"
    ignore-error="true | false" />
```

### Attributes

| Name | Description | Required | Default |
|---|---|---|---|
| `provider-id` | The authorization provider resource identifier. | Yes |   |
| `authorization-id` | The authorization resource identifier. | Yes |   |
| `context-variable-name` | The name of the context variable to receive the [`Authorization` object](#authorization-object). | Yes |   |
| `identity-type` | Type of identity to be checked against the Authorization permissions. <br> - `managed`: managed identity of the API Management service will be used. <br> - `jwt`: Jwt bearer token specified in the `identity` attribute will be used. | No | managed |
| `identity` | An Azure AD JWT bearer token to be checked against the Authorization permissions. Ignored if identity-type != "jwt". <br><br>Expected Claims: <br> - audience: https://management.core.windows.net/ <br> - oid: Permission object id <br> - tid: Permission tenant id | No |   |
| `ignore-error` | If acquiring the authorization context results in an error (e.g. the authorization resource is not found or is in an error state): <br> - ignore-error="true": the context variable is assigned a value of null. <br> - ignore-error="false": return 500 | No | false |

## Examples

### Example 1: Get token back
```xml
<!-- Add to inbound policy. -->
<get-authorization-context 
    provider-id="github-01" 
    authorization-id="auth-01" 
    context-variable-name="auth-context" 
    identity-type="managed" 
    identity="@(context.Request.Headers["Authorization"][0].Replace("Bearer ", ""))"
    ignore-error="false" />
<!-- Return the token back -->
<return-response>
    <set-status code="200" />
    <set-body template="none">@(((Authorization)context.Variables.GetValueOrDefault("auth-context"))?.AccessToken)</set-body>
</return-response>
```

### Example 1a: Get token back (with dynamically set attributes)

```xml
<!-- Add to inbound policy. -->
<get-authorization-context 
  provider-id="@(context.Request.Url.Query.GetValueOrDefault("authorizationProviderId"))" 
  authorization-id="@(context.Request.Url.Query.GetValueOrDefault("authorizationId"))" context-variable-name="auth-context" 
  ignore-error="false" 
  identity-type="managed" />
<!-- Return the token back -->
<return-response>
    <set-status code="200" />
    <set-body template="none">@(((Authorization)context.Variables.GetValueOrDefault("auth-context"))?.AccessToken)</set-body>
</return-response>
```

### Example 2: Attach the token to the backend call
```xml
<!-- Add to inbound policy. -->
<get-authorization-context
    provider-id="github-01" 
    authorization-id="auth-01" 
    context-variable-name="auth-context" 
    identity-type="managed" 
    ignore-error="false" />
<!-- Attach the token to the backend call -->
<set-header name="Authorization" exists-action="override">
    <value>@("Bearer " + ((Authorization)context.Variables.GetValueOrDefault("auth-context"))?.AccessToken)</value>
</set-header>
```

### Authorization Object

The Authorization context variable receives an object of type `Authorization`.

```c#
class Authorization
{
    public string AccessToken { get; }
    public IReadOnlyDictionary<string, object> Claims { get; }
}
```

| Property Name | Description |
| -- | -- |
| AccessToken | Bearer access token to authorize a backend HTTP request. |
| Claims | Claims returned from the authorization server’s token response API (see [RFC6749#section-5.1](https://datatracker.ietf.org/doc/html/rfc6749#section-5.1)) |

## Next steps

- Learn how to [create and use](authorizations-how-to.md) an authorization
