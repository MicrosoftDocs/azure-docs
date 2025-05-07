---
title: Azure API Management policy reference - get-authorization-context | Microsoft Docs
description: Reference for the get-authorization-context policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: reference
ms.date: 07/23/2024
ms.author: danlep
---

# Get authorization context

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

Use the `get-authorization-context` policy to get the authorization context of a specified [connection](credentials-overview.md) (formerly called an *authorization*) to a credential provider that is configured in the API Management instance. 

The policy fetches and stores authorization and refresh tokens from the configured credential provider using the connection.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]


## Policy statement

```xml
<get-authorization-context
    provider-id="credential provider id" 
    authorization-id="connection id" 
    context-variable-name="variable name" 
    identity-type="managed | jwt"
    identity="JWT bearer token"
    ignore-error="true | false" />
```


## Attributes

| Attribute | Description | Required | Default |
|---|---|---|---|
| provider-id | The credential provider resource identifier. Policy expressions are allowed. | Yes | N/A  |
| authorization-id | The connection resource identifier. Policy expressions are allowed. | Yes | N/A  |
| context-variable-name | The name of the context variable to receive the [`Authorization` object](#authorization-object). Policy expressions are allowed.  | Yes | N/A  |
| identity-type | Type of identity to check against the connection's access policy. <br> - `managed`: system-assigned managed identity of the API Management instance. <br> - `jwt`: JWT bearer token specified in the `identity` attribute.<br/><br/>Policy expressions are allowed.  | No | `managed` |
| identity | A Microsoft Entra JWT bearer token to check against the connection permissions. Ignored for `identity-type` other than `jwt`. <br><br>Expected claims: <br> - audience: `https://azure-api.net/authorization-manager` <br> - `oid`: Permission object ID <br> - `tid`: Permission tenant ID<br/><br/>Policy expressions are allowed.  | No |  N/A |
| ignore-error | Boolean. If acquiring the authorization context results in an error (for example, the connection resource isn't found or is in an error state): <br> - `true`: the context variable is assigned a value of null. <br> - `false`: return `500`<br/><br/>If you set the value to `false`, and the policy configuration includes an `on-error` section, the error is available in the `context.LastError` property.<br/><br/>Policy expressions are allowed.   | No | `false` |

### Authorization object

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
| Claims | Claims returned from the authorization server's token response API (see [RFC6749#section-5.1](https://datatracker.ietf.org/doc/html/rfc6749#section-5.1)). |

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) classic, v2, consumption

### Usage notes

* Configure `identity-type=jwt` when the [access policy](credentials-process-flow.md#access-policy) for the connection is assigned to a service principal. Only `/.default` app-only scopes are supported for the JWT.

## Examples

### Get token back

```xml
<!-- Add to inbound policy. -->
<get-authorization-context 
    provider-id="github-01" 
    authorization-id="auth-01" 
    context-variable-name="auth-context" 
    identity-type="managed" 
    ignore-error="false" />
<!-- Return the token -->
<return-response>
    <set-status code="200" />
    <set-body template="none">@(((Authorization)context.Variables.GetValueOrDefault("auth-context"))?.AccessToken)</set-body>
</return-response>
```

### Get token back with dynamically set attributes

```xml
<!-- Add to inbound policy. -->
<get-authorization-context 
  provider-id="@(context.Request.Url.Query.GetValueOrDefault("authorizationProviderId"))" 
  authorization-id="@(context.Request.Url.Query.GetValueOrDefault("authorizationId"))" context-variable-name="auth-context" 
  ignore-error="false" 
  identity-type="managed" />
<!-- Return the token -->
<return-response>
    <set-status code="200" />
    <set-body template="none">@(((Authorization)context.Variables.GetValueOrDefault("auth-context"))?.AccessToken)</set-body>
</return-response>
```

### Attach the token to the backend call

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

### Get token from incoming request and return token

```xml
<!-- Add to inbound policy. -->
<get-authorization-context 
    provider-id="github-01" 
    authorization-id="auth-01" 
    context-variable-name="auth-context" 
    identity-type="jwt" 
    identity="@(context.Request.Headers["Authorization"][0].Replace("Bearer ", ""))"
    ignore-error="false" />
<!-- Return the token -->
<return-response>
    <set-status code="200" />
    <set-body template="none">@(((Authorization)context.Variables.GetValueOrDefault("auth-context"))?.AccessToken)</set-body>
</return-response>
```

## Related policies

* [Authentication and authorization](api-management-policies.md#authentication-and-authorization)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
