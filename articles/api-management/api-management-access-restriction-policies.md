---
title: Azure API Management access restriction policies | Microsoft Docs
description: Reference for the access restriction policies available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
documentationcenter: ''
author: dlepow

ms.service: api-management
ms.topic: reference
ms.date: 06/03/2022
ms.author: danlep
---

# API Management access restriction policies

This article provides a reference for API Management access restriction policies. 

[!INCLUDE [api-management-policy-intro-links](../../includes/api-management-policy-intro-links.md)]

## <a name="AccessRestrictionPolicies"></a> Access restriction policies

-   [Check HTTP header](#CheckHTTPHeader) - Enforces existence and/or value of an HTTP header.
- [Get authorization context](#GetAuthorizationContext) - Gets the authorization context of a specified [authorization](authorizations-overview.md) configured in the API Management instance.
-   [Limit call rate by subscription](#LimitCallRate) - Prevents API usage spikes by limiting call rate, on a per subscription basis.
-   [Limit call rate by key](#LimitCallRateByKey) - Prevents API usage spikes by limiting call rate, on a per key basis.
-   [Restrict caller IPs](#RestrictCallerIPs) - Filters (allows/denies) calls from specific IP addresses and/or address ranges.
-   [Set usage quota by subscription](#SetUsageQuota) - Allows you to enforce a renewable or lifetime call volume and/or bandwidth quota, on a per subscription basis.
-   [Set usage quota by key](#SetUsageQuotaByKey) - Allows you to enforce a renewable or lifetime call volume and/or bandwidth quota, on a per key basis.
-   [Validate JWT](#ValidateJWT) - Enforces existence and validity of a JWT extracted from either a specified HTTP header or a specified query parameter.
-  [Validate client certificate](#validate-client-certificate) - Enforces that a certificate presented by a client to an API Management instance matches specified validation rules and claims.

> [!TIP]
> You can use access restriction policies in different scopes for different purposes. For example, you can secure the whole API with AAD authentication by applying the `validate-jwt` policy on the API level or you can apply it on the API operation level and use `claims` for more granular control.

## <a name="CheckHTTPHeader"></a> Check HTTP header

Use the `check-header` policy to enforce that a request has a specified HTTP header. You can optionally check to see if the header has a specific value or check for a range of allowed values. If the check fails, the policy terminates request processing and returns the HTTP status code and error message specified by the policy.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

### Policy statement

```xml
<check-header name="header name" failed-check-httpcode="code" failed-check-error-message="message" ignore-case="true">
    <value>Value1</value>
    <value>Value2</value>
</check-header>
```

### Example

```xml
<check-header name="Authorization" failed-check-httpcode="401" failed-check-error-message="Not authorized" ignore-case="false">
    <value>f6dc69a089844cf6b2019bae6d36fac8</value>
</check-header>
```

### Elements

| Name         | Description                                                                                                                                   | Required |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| check-header | Root element.                                                                                                                                 | Yes      |
| value        | Allowed HTTP header value. When multiple value elements are specified, the check is considered a success if any one of the values is a match. | No       |

### Attributes

| Name                       | Description                                                                                                                                                            | Required | Default |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| failed-check-error-message | Error message to return in the HTTP response body if the header doesn't exist or has an invalid value. This message must have any special characters properly escaped. | Yes      | N/A     |
| failed-check-httpcode      | HTTP Status code to return if the header doesn't exist or has an invalid value.                                                                                        | Yes      | N/A     |
| header-name                | The name of the HTTP header to check.                                                                                                                                  | Yes      | N/A     |
| ignore-case                | Can be set to True or False. If set to True case is ignored when the header value is compared against the set of acceptable values.                                    | Yes      | N/A     |

### Usage

This policy can be used in the following policy [sections](./api-management-howto-policies.md#sections) and [scopes](./api-management-howto-policies.md#scopes).

-   **Policy sections:** inbound, outbound

-   **Policy scopes:** all scopes

## <a name="GetAuthorizationContext"></a> Get authorization context

Use the `get-authorization-context` policy to get the authorization context of a specified [authorization](authorizations-overview.md) (preview) configured in the API Management instance. 

The policy fetches and stores authorization and refresh tokens from the configured authorization provider.

If `identity-type=jwt` is configured, a JWT token is required to be validated. The audience of this token must be `https://azure-api.net/authorization-manager`.  

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]


### Policy statement

```xml
<get-authorization-context
    provider-id="authorization provider id" 
    authorization-id="authorization id" 
    context-variable-name="variable name" 
    identity-type="managed | jwt"
    identity="JWT bearer token"
    ignore-error="true | false" />
```

### Examples

#### Example 1: Get token back

```xml
<!-- Add to inbound policy. -->
<get-authorization-context 
    provider-id="github-01" 
    authorization-id="auth-01" 
    context-variable-name="auth-context" 
    identity-type="managed" 
    identity="@(context.Request.Headers["Authorization"][0].Replace("Bearer ", ""))"
    ignore-error="false" />
<!-- Return the token -->
<return-response>
    <set-status code="200" />
    <set-body template="none">@(((Authorization)context.Variables.GetValueOrDefault("auth-context"))?.AccessToken)</set-body>
</return-response>
```

#### Example 2: Get token back with dynamically set attributes

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

#### Example 3: Attach the token to the backend call

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

#### Example 4: Get token from incoming request and return token

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

### Elements

| Name  | Description   | Required |
| ----- | ------------- | -------- |
| get-authorization-context | Root element. | Yes      |

### Attributes

| Name | Description | Required | Default |
|---|---|---|---|
| provider-id | The authorization provider resource identifier. | Yes |   |
| authorization-id | The authorization resource identifier. | Yes |   |
| context-variable-name | The name of the context variable to receive the [`Authorization` object](#authorization-object). | Yes |   |
| identity-type | Type of identity to be checked against the authorization access policy. <br> - `managed`: managed identity of the API Management service. <br> - `jwt`: JWT bearer token specified in the `identity` attribute. | No | managed |
| identity | An Azure AD JWT bearer token to be checked against the authorization permissions. Ignored for `identity-type` other than `jwt`. <br><br>Expected claims: <br> - audience: `https://azure-api.net/authorization-manager` <br> - `oid`: Permission object ID <br> - `tid`: Permission tenant ID | No |   |
| ignore-error | Boolean. If acquiring the authorization context results in an error (for example, the authorization resource is not found or is in an error state): <br> - `true`: the context variable is assigned a value of null. <br> - `false`: return `500` | No | false |

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
| Claims | Claims returned from the authorization server’s token response API (see [RFC6749#section-5.1](https://datatracker.ietf.org/doc/html/rfc6749#section-5.1)). |

### Usage

This policy can be used in the following policy [sections](./api-management-howto-policies.md#sections) and [scopes](./api-management-howto-policies.md#scopes).

-   **Policy sections:** inbound

-   **Policy scopes:** all scopes


## <a name="LimitCallRate"></a> Limit call rate by subscription

The `rate-limit` policy prevents API usage spikes on a per subscription basis by limiting the call rate to a specified number per a specified time period. When the call rate is exceeded, the caller receives a `429 Too Many Requests` response status code.

To understand the difference between rate limits and quotas, [see Rate limits and quotas.](./api-management-sample-flexible-throttling.md#rate-limits-and-quotas)

> [!IMPORTANT]
> * This policy can be used only once per policy document.
> * [Policy expressions](api-management-policy-expressions.md) cannot be used in any of the policy attributes for this policy.

[!INCLUDE [api-management-rate-limit-accuracy](../../includes/api-management-rate-limit-accuracy.md)]

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

### Policy statement

```xml
<rate-limit calls="number" renewal-period="seconds">
    <api name="API name" id="API id" calls="number" renewal-period="seconds">
        <operation name="operation name" id="operation id" calls="number" renewal-period="seconds" 
        retry-after-header-name="custom header name, replaces default 'Retry-After'" 
        retry-after-variable-name="policy expression variable name"
        remaining-calls-header-name="header name"  
        remaining-calls-variable-name="policy expression variable name"
        total-calls-header-name="header name"/>
    </api>
</rate-limit>
```

### Example

In the following example, the per subscription rate limit is 20 calls per 90 seconds. After each policy execution, the remaining calls allowed in the time period are stored in the variable `remainingCallsPerSubscription`.

```xml
<policies>
    <inbound>
        <base />
        <rate-limit calls="20" renewal-period="90" remaining-calls-variable-name="remainingCallsPerSubscription"/>
    </inbound>
    <outbound>
        <base />
    </outbound>
</policies>
```

### Elements

| Name       | Description                                                                                                                                                                                                                                                                                              | Required |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| rate-limit | Root element.                                                                                                                                                                                                                                                                                            | Yes      |
| api        | Add one or more of these elements to impose a call rate limit on APIs within the product. Product and API call rate limits are applied independently. API can be referenced either via `name` or `id`. If both attributes are provided, `id` will be used and `name` will be ignored.                    | No       |
| operation  | Add one or more of these elements to impose a call rate limit on operations within an API. Product, API, and operation call rate limits are applied independently. Operation can be referenced either via `name` or `id`. If both attributes are provided, `id` will be used and `name` will be ignored. | No       |

### Attributes

| Name           | Description                                                                                           | Required | Default |
| -------------- | ----------------------------------------------------------------------------------------------------- | -------- | ------- |
| name           | The name of the API for which to apply the rate limit.                                                | Yes      | N/A     |
| calls          | The maximum total number of calls allowed during the time interval specified in `renewal-period`. | Yes      | N/A     |
| renewal-period | The length in seconds of the sliding window during which the number of allowed requests should not exceed the value specified in `calls`. Maximum allowed value: 300 seconds.                                            | Yes      | N/A     |
| retry-after-header-name    | The name of a custom response header whose value is the recommended retry interval in seconds after the specified call rate is exceeded. |  No | `Retry-After`  |
| retry-after-variable-name    | The name of a policy expression variable that stores the recommended retry interval in seconds after the specified call rate is exceeded. |  No | N/A  |
| remaining-calls-header-name    | The name of a response header whose value after each policy execution is the number of remaining calls allowed for the time interval specified in the `renewal-period`. |  No | N/A  |
| remaining-calls-variable-name    | The name of a policy expression variable that after each policy execution stores the number of remaining calls allowed for the time interval specified in the `renewal-period`. |  No | N/A  |
| total-calls-header-name    | The name of a response header whose value is the value specified in `calls`. |  No | N/A  |

### Usage

This policy can be used in the following policy [sections](./api-management-howto-policies.md#sections) and [scopes](./api-management-howto-policies.md#scopes).

-   **Policy sections:** inbound

-   **Policy scopes:** product, api, operation

## <a name="LimitCallRateByKey"></a> Limit call rate by key

> [!IMPORTANT]
> This feature is unavailable in the **Consumption** tier of API Management.

The `rate-limit-by-key` policy prevents API usage spikes on a per key basis by limiting the call rate to a specified number per a specified time period. The key can have an arbitrary string value and is typically provided using a policy expression. Optional increment condition can be added to specify which requests should be counted towards the limit. When this call rate is exceeded, the caller receives a `429 Too Many Requests` response status code.

To understand the difference between rate limits and quotas, [see Rate limits and quotas.](./api-management-sample-flexible-throttling.md#rate-limits-and-quotas)

For more information and examples of this policy, see [Advanced request throttling with Azure API Management](./api-management-sample-flexible-throttling.md).

[!INCLUDE [api-management-rate-limit-accuracy](../../includes/api-management-rate-limit-accuracy.md)]

[!INCLUDE [api-management-policy-form-alert](../../includes/api-management-policy-form-alert.md)]

### Policy statement

```xml
<rate-limit-by-key calls="number"
                   renewal-period="seconds"
                   increment-condition="condition"
                   increment-count="number"
                   counter-key="key value" 
                   retry-after-header-name="custom header name, replaces default 'Retry-After'" 
                   retry-after-variable-name="policy expression variable name"
                   remaining-calls-header-name="header name"  
                   remaining-calls-variable-name="policy expression variable name"
                   total-calls-header-name="header name"/> 

```

### Example

In the following example, the rate limit of 10 calls per 60 seconds is keyed by the caller IP address. After each policy execution, the remaining calls allowed in the time period are stored in the variable `remainingCallsPerIP`.

```xml
<policies>
    <inbound>
        <base />
        <rate-limit-by-key  calls="10"
              renewal-period="60"
              increment-condition="@(context.Response.StatusCode == 200)"
              counter-key="@(context.Request.IpAddress)"
              remaining-calls-variable-name="remainingCallsPerIP"/>
    </inbound>
    <outbound>
        <base />
    </outbound>
</policies>
```

### Elements

| Name              | Description   | Required |
| ----------------- | ------------- | -------- |
| rate-limit-by-key | Root element. | Yes      |

### Attributes

| Name                | Description                                                                                           | Required | Default |
| ------------------- | ----------------------------------------------------------------------------------------------------- | -------- | ------- |
| calls               | The maximum total number of calls allowed during the time interval specified in the `renewal-period`. Policy expression is allowed. | Yes      | N/A     |
| counter-key         | The key to use for the rate limit policy. For each key value, a single counter is used for all scopes at which the policy is configured.           | Yes      | N/A     |
| increment-condition | The boolean expression specifying if the request should be counted towards the rate (`true`).        | No       | N/A     |
| increment-count | The number by which the counter is increased per request.        | No       | 1     |
| renewal-period      | The length in seconds of the sliding window during which the number of allowed requests should not exceed the value specified in `calls`. Policy expression is allowed. Maximum allowed value: 300 seconds.                 | Yes      | N/A     |
| retry-after-header-name    | The name of a custom response header whose value is the recommended retry interval in seconds after the specified call rate is exceeded. |  No | `Retry-After`  |
| retry-after-variable-name    | The name of a policy expression variable that stores the recommended retry interval in seconds after the specified call rate is exceeded. |  No | N/A  |
| remaining-calls-header-name    | The name of a response header whose value after each policy execution is the number of remaining calls allowed for the time interval specified in the `renewal-period`. |  No | N/A  |
| remaining-calls-variable-name    | The name of a policy expression variable that after each policy execution stores the number of remaining calls allowed for the time interval specified in the `renewal-period`. |  No | N/A  |
| total-calls-header-name    | The name of a response header whose value is the value specified in `calls`. |  No | N/A  |

### Usage

This policy can be used in the following policy [sections](./api-management-howto-policies.md#sections) and [scopes](./api-management-howto-policies.md#scopes).

-   **Policy sections:** inbound

-   **Policy scopes:** all scopes

## <a name="RestrictCallerIPs"></a> Restrict caller IPs

The `ip-filter` policy filters (allows/denies) calls from specific IP addresses and/or address ranges.

> [!NOTE]
> The policy filters the immediate caller's IP address. However, if API Management is hosted behind Application Gateway, the policy considers its IP address, not the originator of the API request. Presently, IP addresses in the `X-Forwarded-For` are not considered.

[!INCLUDE [api-management-policy-form-alert](../../includes/api-management-policy-form-alert.md)]

### Policy statement

```xml
<ip-filter action="allow | forbid">
    <address>address</address>
    <address-range from="address" to="address" />
</ip-filter>
```

### Example

In the following example, the policy only allows requests coming either from the single IP address or range of IP addresses specified

```xml
<ip-filter action="allow">
    <address>13.66.201.169</address>
    <address-range from="13.66.140.128" to="13.66.140.143" />
</ip-filter>
```

### Elements

| Name                                      | Description                                         | Required                                                       |
| ----------------------------------------- | --------------------------------------------------- | -------------------------------------------------------------- |
| ip-filter                                 | Root element.                                       | Yes                                                            |
| address                                   | Specifies a single IP address on which to filter.   | At least one `address` or `address-range` element is required. |
| address-range from="address" to="address" | Specifies a range of IP address on which to filter. | At least one `address` or `address-range` element is required. |

### Attributes

| Name                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
| address-range from="address" to="address" | A range of IP addresses to allow or deny access for.                                        | Required when the `address-range` element is used. | N/A     |
| ip-filter action="allow &#124; forbid"    | Specifies whether calls should be allowed or not for the specified IP addresses and ranges. | Yes                                                | N/A     |

### Usage

This policy can be used in the following policy [sections](./api-management-howto-policies.md#sections) and [scopes](./api-management-howto-policies.md#scopes).

-   **Policy sections:** inbound
-   **Policy scopes:** all scopes

> [!NOTE]
> If you configure this policy at more than one scope, IP filtering is applied in the order of [policy evaluation](set-edit-policies.md#use-base-element-to-set-policy-evaluation-order) in your policy definition. 

## <a name="SetUsageQuota"></a> Set usage quota by subscription

The `quota` policy enforces a renewable or lifetime call volume and/or bandwidth quota, on a per subscription basis.  When the quota is exceeded, the caller receives a `403 Forbidden` response status code, and the response includes a `Retry-After` header whose value is the recommended retry interval in seconds.

To understand the difference between rate limits and quotas, [see Rate limits and quotas.](./api-management-sample-flexible-throttling.md#rate-limits-and-quotas)

> [!IMPORTANT]
> * This policy can be used only once per policy document.
> * [Policy expressions](api-management-policy-expressions.md) cannot be used in any of the policy attributes for this policy.

[!INCLUDE [api-management-quota-accuracy](../../includes/api-management-quota-accuracy.md)]

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

### Policy statement

```xml
<quota calls="number" bandwidth="kilobytes" renewal-period="seconds">
    <api name="API name" id="API id" calls="number">
        <operation name="operation name" id="operation id" calls="number" />
    </api>
</quota>
```

### Example

```xml
<policies>
    <inbound>
        <base />
        <quota calls="10000" bandwidth="40000" renewal-period="3600" />
    </inbound>
    <outbound>
        <base />
    </outbound>
</policies>
```

### Elements

| Name      | Description                                                                                                                                                                                                                                                                                  | Required |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| quota     | Root element.                                                                                                                                                                                                                                                                                | Yes      |
| api       | Add one or more of these elements to impose call quota on APIs within the product. Product and API call quotas are applied independently. API can be referenced either via `name` or `id`. If both attributes are provided, `id` will be used and `name` will be ignored.                    | No       |
| operation | Add one or more of these elements to impose call quota on operations within an API. Product, API, and operation call quotas are applied independently. Operation can be referenced either via `name` or `id`. If both attributes are provided, `id` will be used and `name` will be ignored. | No      |

### Attributes

| Name           | Description                                                                                               | Required                                                         | Default |
| -------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------- |
| name           | The name of the API or operation for which the quota applies.                                             | Yes                                                              | N/A     |
| bandwidth      | The maximum total number of kilobytes allowed during the time interval specified in the `renewal-period`. | Either `calls`, `bandwidth`, or both together must be specified. | N/A     |
| calls          | The maximum total number of calls allowed during the time interval specified in the `renewal-period`.     | Either `calls`, `bandwidth`, or both together must be specified. | N/A     |
| renewal-period | The length in seconds of the fixed window after which the quota resets. The start of each period is calculated relative to the start time of the subscription. When `renewal-period` is set to `0`, the period is set to infinite.| Yes                                                              | N/A     |

### Usage

This policy can be used in the following policy [sections](./api-management-howto-policies.md#sections) and [scopes](./api-management-howto-policies.md#scopes).

-   **Policy sections:** inbound
-   **Policy scopes:** product

## <a name="SetUsageQuotaByKey"></a> Set usage quota by key

> [!IMPORTANT]
> This feature is unavailable in the **Consumption** tier of API Management.

The `quota-by-key` policy enforces a renewable or lifetime call volume and/or bandwidth quota, on a per key basis. The key can have an arbitrary string value and is typically provided using a policy expression. Optional increment condition can be added to specify which requests should be counted towards the quota. If multiple policies would increment the same key value, it is incremented only once per request. When the quota is exceeded, the caller receives a `403 Forbidden` response status code, and the response includes a `Retry-After` header whose value is the recommended retry interval in seconds.

For more information and examples of this policy, see [Advanced request throttling with Azure API Management](./api-management-sample-flexible-throttling.md).

To understand the difference between rate limits and quotas, [see Rate limits and quotas.](./api-management-sample-flexible-throttling.md#rate-limits-and-quotas)

[!INCLUDE [api-management-quota-accuracy](../../includes/api-management-quota-accuracy.md)]


[!INCLUDE [api-management-policy-form-alert](../../includes/api-management-policy-form-alert.md)]


### Policy statement

```xml
<quota-by-key calls="number"
              bandwidth="kilobytes"
              renewal-period="seconds"
              increment-condition="condition"
              counter-key="key value"
              first-period-start="date-time" />
```

### Example

In the following example, the quota is keyed by the caller IP address.

```xml
<policies>
    <inbound>
        <base />
        <quota-by-key calls="10000" bandwidth="40000" renewal-period="3600"
                      increment-condition="@(context.Response.StatusCode >= 200 && context.Response.StatusCode < 400)"
                      counter-key="@(context.Request.IpAddress)" />
    </inbound>
    <outbound>
        <base />
    </outbound>
</policies>
```

### Elements

| Name  | Description   | Required |
| ----- | ------------- | -------- |
| quota | Root element. | Yes      |

### Attributes

| Name                | Description                                                                                               | Required                                                         | Default |
| ------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------- |
| bandwidth           | The maximum total number of kilobytes allowed during the time interval specified in the `renewal-period`. | Either `calls`, `bandwidth`, or both together must be specified. | N/A     |
| calls               | The maximum total number of calls allowed during the time interval specified in the `renewal-period`.     | Either `calls`, `bandwidth`, or both together must be specified. | N/A     |
| counter-key         | The key to use for the quota policy. For each key value, a single counter is used for all scopes at which the policy is configured.              | Yes                                                              | N/A     |
| increment-condition | The boolean expression specifying if the request should be counted towards the quota (`true`)             | No                                                               | N/A     |
| renewal-period      | The length in seconds of the fixed window after which the quota resets. The start of each period is calculated relative to `first-perdiod-start`. When `renewal-period` is set to `0`, the period is set to infinite.                                                   | Yes                                                              | N/A     |
| first-period-start      | The starting date and time for quota renewal periods, in the following format: `yyyy-MM-ddTHH:mm:ssZ` as specified by the ISO 8601 standard.   | No                                                              | `0001-01-01T00:00:00Z`     |

> [!NOTE]
> The `counter-key` attribute value must be unique across all the APIs in the API Management if you don't want to share the total between the other APIs.

### Usage

This policy can be used in the following policy [sections](./api-management-howto-policies.md#sections) and [scopes](./api-management-howto-policies.md#scopes).

-   **Policy sections:** inbound
-   **Policy scopes:** all scopes

## <a name="ValidateJWT"></a> Validate JWT

The `validate-jwt` policy enforces existence and validity of a JSON web token (JWT) extracted from a specified HTTP header, extracted from a specified query parameter, or matching a specific value. The JSON Web Key Set (JWKS) is cached and is not fetched on each request. Automatic metadata refresh occurs once per hour. If retrieval fails, it will be refreshed in five minutes.

> [!IMPORTANT]
> The `validate-jwt` policy requires that the `exp` registered claim is included in the JWT token, unless `require-expiration-time` attribute is specified and set to `false`.
> The `validate-jwt` policy supports HS256 and RS256 signing algorithms. For HS256 the key must be provided inline within the policy in the base64 encoded form. For RS256 the key may be provided either via an Open ID configuration endpoint, or by providing the ID of an uploaded certificate that contains the public key or modulus-exponent pair of the public key but in PFX format.
> The `validate-jwt` policy supports tokens encrypted with symmetric keys using the following encryption algorithms: A128CBC-HS256, A192CBC-HS384, A256CBC-HS512.

[!INCLUDE [api-management-policy-form-alert](../../includes/api-management-policy-form-alert.md)]


### Policy statement

```xml
<validate-jwt
    header-name="name of HTTP header containing the token (alternatively, use query-parameter-name or token-value attribute to specify token)"
    query-parameter-name="name of query parameter used to pass the token (alternative, use header-name or token-value attribute to specify token)"
    token-value="expression returning the token as a string (alternatively, use header-name or query-parameter attribute to specify token)"
    failed-validation-httpcode="http status code to return on failure"
    failed-validation-error-message="error message to return on failure"
    require-expiration-time="true|false"
    require-scheme="scheme"
    require-signed-tokens="true|false"
    clock-skew="allowed clock skew in seconds"
    output-token-variable-name="name of a variable to receive a JWT object representing successfully validated token">
  <openid-config url="full URL of the configuration endpoint, e.g. https://login.constoso.com/openid-configuration" />
  <issuer-signing-keys>
    <key>base64 encoded signing key</key>
    <!-- if there are multiple keys, then add additional key elements -->
  </issuer-signing-keys>
  <decryption-keys>
    <key>base64 encoded signing key</key>
    <!-- if there are multiple keys, then add additional key elements -->
  </decryption-keys>
  <audiences>
    <audience>audience string</audience>
    <!-- if there are multiple possible audiences, then add additional audience elements -->
  </audiences>
  <issuers>
    <issuer>issuer string</issuer>
    <!-- if there are multiple possible issuers, then add additional issuer elements -->
  </issuers>
  <required-claims>
    <claim name="name of the claim as it appears in the token" match="all|any" separator="separator character in a multi-valued claim">
      <value>claim value as it is expected to appear in the token</value>
      <!-- if there is more than one allowed values, then add additional value elements -->
    </claim>
    <!-- if there are multiple possible allowed values, then add additional value elements -->
  </required-claims>
</validate-jwt>

```

### Examples

#### Simple token validation

```xml
<validate-jwt header-name="Authorization" require-scheme="Bearer">
    <issuer-signing-keys>
        <key>{{jwt-signing-key}}</key>  <!-- signing key specified as a named value -->
    </issuer-signing-keys>
    <audiences>
        <audience>@(context.Request.OriginalUrl.Host)</audience>  <!-- audience is set to API Management host name -->
    </audiences>
    <issuers>
        <issuer>http://contoso.com/</issuer>
    </issuers>
</validate-jwt>
```

#### Token validation with RSA certificate

```xml
<validate-jwt header-name="Authorization" require-scheme="Bearer">
    <issuer-signing-keys>
        <key certificate-id="my-rsa-cert" />  <!-- signing key specified as certificate ID, enclosed in double-quotes -->
    </issuer-signing-keys>
    <audiences>
        <audience>@(context.Request.OriginalUrl.Host)</audience>  <!-- audience is set to API Management host name -->
    </audiences>
    <issuers>
        <issuer>http://contoso.com/</issuer>
    </issuers>
</validate-jwt>
```

#### Azure Active Directory token validation

```xml
<validate-jwt header-name="Authorization" failed-validation-httpcode="401" failed-validation-error-message="Unauthorized. Access token is missing or invalid.">
    <openid-config url="https://login.microsoftonline.com/contoso.onmicrosoft.com/.well-known/openid-configuration" />
    <audiences>
        <audience>25eef6e4-c905-4a07-8eb4-0d08d5df8b3f</audience>
    </audiences>
    <required-claims>
        <claim name="id" match="all">
            <value>insert claim here</value>
        </claim>
    </required-claims>
</validate-jwt>
```

#### Azure Active Directory B2C token validation

```xml
<validate-jwt header-name="Authorization" failed-validation-httpcode="401" failed-validation-error-message="Unauthorized. Access token is missing or invalid.">
    <openid-config url="https://login.microsoftonline.com/tfp/contoso.onmicrosoft.com/b2c_1_signin/v2.0/.well-known/openid-configuration" />
    <audiences>
        <audience>d313c4e4-de5f-4197-9470-e509a2f0b806</audience>
    </audiences>
    <required-claims>
        <claim name="id" match="all">
            <value>insert claim here</value>
        </claim>
    </required-claims>
</validate-jwt>
```

#### Authorize access to operations based on token claims

This example shows how to use the [Validate JWT](api-management-access-restriction-policies.md#ValidateJWT) policy to authorize access to operations based on token claims value.

```xml
<validate-jwt header-name="Authorization" require-scheme="Bearer" output-token-variable-name="jwt">
    <issuer-signing-keys>
        <key>{{jwt-signing-key}}</key> <!-- signing key is stored in a named value -->
    </issuer-signing-keys>
    <audiences>
        <audience>@(context.Request.OriginalUrl.Host)</audience>
    </audiences>
    <issuers>
        <issuer>contoso.com</issuer>
    </issuers>
    <required-claims>
        <claim name="group" match="any">
            <value>finance</value>
            <value>logistics</value>
        </claim>
    </required-claims>
</validate-jwt>
<choose>
    <when condition="@(context.Request.Method == "POST" && !((Jwt)context.Variables["jwt"]).Claims["group"].Contains("finance"))">
        <return-response>
            <set-status code="403" reason="Forbidden" />
        </return-response>
    </when>
</choose>
```

### Elements

| Element             | Description                                                                                                                                                                                                                                                                                                                                           | Required |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| validate-jwt        | Root element.                                                                                                                                                                                                                                                                                                                                         | Yes      |
| audiences           | Contains a list of acceptable audience claims that can be present on the token. If multiple audience values are present, then each value is tried until either all are exhausted (in which case validation fails) or until one succeeds. At least one audience must be specified.                                                                     | No       |
| issuer-signing-keys | A list of Base64-encoded security keys used to validate signed tokens. If multiple security keys are present, then each key is tried until either all are exhausted (in which case validation fails) or one succeeds (useful for token rollover). Key elements have an optional `id` attribute used to match against `kid` claim. <br/><br/>Alternatively supply an issuer signing key using:<br/><br/> - `certificate-id` in format `<key certificate-id="mycertificate" />` to specify the identifier of a certificate entity [uploaded](/rest/api/apimanagement/apimanagementrest/azure-api-management-rest-api-certificate-entity#Add) to API Management<br/>- RSA modulus `n` and exponent `e` pair in format `<key n="<modulus>" e="<exponent>" />` to specify the RSA parameters in base64url-encoded format               | No       |
| decryption-keys     | A list of Base64-encoded keys used to decrypt the tokens. If multiple security keys are present, then each key is tried until either all keys are exhausted (in which case validation fails) or a key succeeds. Key elements have an optional `id` attribute used to match against `kid` claim.<br/><br/>Alternatively supply a decryption key using:<br/><br/> - `certificate-id` in format `<key certificate-id="mycertificate" />` to specify the identifier of a certificate entity [uploaded](/rest/api/apimanagement/apimanagementrest/azure-api-management-rest-api-certificate-entity#Add) to API Management                                                 | No       |
| issuers             | A list of acceptable principals that issued the token. If multiple issuer values are present, then each value is tried until either all are exhausted (in which case validation fails) or until one succeeds.                                                                                                                                         | No       |
| openid-config       | The element used for specifying a compliant Open ID configuration endpoint from which signing keys and issuer can be obtained.                                                                                                                                                                                                                        | No       |
| required-claims     | Contains a list of claims expected to be present on the token for it to be considered valid. When the `match` attribute is set to `all` every claim value in the policy must be present in the token for validation to succeed. When the `match` attribute is set to `any` at least one claim must be present in the token for validation to succeed. | No       |

### Attributes

| Name                            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                            | Required                                                                         | Default                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| clock-skew                      | Timespan. Use to specify maximum expected time difference between the system clocks of the token issuer and the API Management instance.                                                                                                                                                                                                                                                                                                               | No                                                                               | 0 seconds                                                                         |
| failed-validation-error-message | Error message to return in the HTTP response body if the JWT does not pass validation. This message must have any special characters properly escaped.                                                                                                                                                                                                                                                                                                 | No                                                                               | Default error message depends on validation issue, for example "JWT not present." |
| failed-validation-httpcode      | HTTP Status code to return if the JWT doesn't pass validation.                                                                                                                                                                                                                                                                                                                                                                                         | No                                                                               | 401                                                                               |
| header-name                     | The name of the HTTP header holding the token.                                                                                                                                                                                                                                                                                                                                                                                                         | One of `header-name`, `query-parameter-name` or `token-value` must be specified. | N/A                                                                               |
| query-parameter-name            | The name of the query parameter holding the token.                                                                                                                                                                                                                                                                                                                                                                                                     | One of `header-name`, `query-parameter-name` or `token-value` must be specified. | N/A                                                                               |
| token-value                     | Expression returning a string containing the token. You must not return `Bearer ` as part of the token value.                                                                                                                                                                                                                                                                                                                                           | One of `header-name`, `query-parameter-name` or `token-value` must be specified. | N/A                                                                               |
| id                              | The `id` attribute on the `key` element allows you to specify the string that will be matched against `kid` claim in the token (if present) to find out the appropriate key to use for signature validation.                                                                                                                                                                                                                                           | No                                                                               | N/A                                                                               |
| match                           | The `match` attribute on the `claim` element specifies whether every claim value in the policy must be present in the token for validation to succeed. Possible values are:<br /><br /> - `all` - every claim value in the policy must be present in the token for validation to succeed.<br /><br /> - `any` - at least one claim value must be present in the token for validation to succeed.                                                       | No                                                                               | all                                                                               |
| require-expiration-time         | Boolean. Specifies whether an expiration claim is required in the token.                                                                                                                                                                                                                                                                                                                                                                               | No                                                                               | true                                                                              |
| require-scheme                  | The name of the token scheme, e.g. "Bearer". When this attribute is set, the policy will ensure that specified scheme is present in the Authorization header value.                                                                                                                                                                                                                                                                                    | No                                                                               | N/A                                                                               |
| require-signed-tokens           | Boolean. Specifies whether a token is required to be signed.                                                                                                                                                                                                                                                                                                                                                                                           | No                                                                               | true                                                                              |
| separator                       | String. Specifies a separator (e.g. ",") to be used for extracting a set of values from a multi-valued claim.                                                                                                                                                                                                                                                                                                                                          | No                                                                               | N/A                                                                               |
| url                             | Open ID configuration endpoint URL from where Open ID configuration metadata can be obtained. The response should be according to specs as defined at URL:`https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata`. For Azure Active Directory use the following URL: `https://login.microsoftonline.com/{tenant-name}/.well-known/openid-configuration` substituting your directory tenant name, e.g. `contoso.onmicrosoft.com`. | Yes                                                                              | N/A                                                                               |
| output-token-variable-name      | String. Name of context variable that will receive token value as an object of type [`Jwt`](api-management-policy-expressions.md) upon successful token validation                                                                                                                                                                                                                                                                                     | No                                                                               | N/A                                                                               |

### Usage

This policy can be used in the following policy [sections](./api-management-howto-policies.md#sections) and [scopes](./api-management-howto-policies.md#scopes).

-   **Policy sections:** inbound
-   **Policy scopes:** all scopes


## Validate client certificate

Use the `validate-client-certificate` policy to enforce that a certificate presented by a client to an API Management instance matches specified validation rules and claims such as subject or issuer for one or more certificate identities.

To be considered valid, a client certificate must match all the validation rules defined by the attributes at the top-level element and match all defined claims for at least one of the defined identities. 

Use this policy to check incoming certificate properties against desired properties. Also use this policy to override default validation of client certificates in these cases:

* If you have uploaded custom CA certificates to validate client requests to the managed gateway
* If you configured custom certificate authorities to validate client requests to a self-managed gateway

For more information about custom CA certificates and certificate authorities, see [How to add a custom CA certificate in Azure API Management](api-management-howto-ca-certificates.md).
 
[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

### Policy statement

```xml
<validate-client-certificate 
    validate-revocation="true|false"
    validate-trust="true|false" 
    validate-not-before="true|false" 
    validate-not-after="true|false" 
    ignore-error="true|false">
    <identities>
        <identity 
            thumbprint="certificate thumbprint"
            serial-number="certificate serial number"
            common-name="certificate common name"
            subject="certificate subject string"
            dns-name="certificate DNS name"
            issuer-subject="certificate issuer"
            issuer-thumbprint="certificate issuer thumbprint"
            issuer-certificate-id="certificate identifier" />
    </identities>
</validate-client-certificate> 
```

### Example

The following example validates a client certificate to match the policy's default validation rules and checks whether the subject and issuer name match specified values.

```xml
<validate-client-certificate 
    validate-revocation="true" 
    validate-trust="true" 
    validate-not-before="true" 
    validate-not-after="true" 
    ignore-error="false">
    <identities>
        <identity
            subject="C=US, ST=Illinois, L=Chicago, O=Contoso Corp., CN=*.contoso.com"
            issuer-subject="C=BE, O=FabrikamSign nv-sa, OU=Root CA, CN=FabrikamSign Root CA" />
    </identities>
</validate-client-certificate> 
```

### Elements

| Element             | Description                                  | Required |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| validate-client-certificate        | Root element.      | Yes      |
|   identities      |  Contains a list of identities with defined claims on the client certificate.       |    No        |

### Attributes

| Name                            | Description      | Required |  Default    |
| ------------------------------- | -----------------| -------- | ----------- |
| validate-revocation  | Boolean. Specifies whether certificate is validated against online revocation list.  | no   | True  |
| validate-trust | Boolean. Specifies if validation should fail in case chain cannot be successfully built up to trusted CA. | no | True |
| validate-not-before | Boolean. Validates value against current time. | no | True |
| validate-not-after  | Boolean. Validates value against current time. | no | True|
| ignore-error  | Boolean. Specifies if policy should proceed to the next handler or jump to on-error upon failed validation. | no | False |
| identity | String. Combination of certificate claim values that make certificate valid. | yes | N/A |
| thumbprint | Certificate thumbprint. | no | N/A |
| serial-number | Certificate serial number. | no | N/A |
| common-name | Certificate common name (part of Subject string). | no | N/A |
| subject | Subject string. Must follow format of Distinguished Name. | no | N/A |
| dns-name | Value of dnsName entry inside Subject Alternative Name claim. | no | N/A |
| issuer-subject | Issuer's subject. Must follow format of Distinguished Name. | no | N/A |
| issuer-thumbprint | Issuer thumbprint. | no | N/A |
| issuer-certificate-id | Identifier of existing certificate entity representing the issuer's public key. Mutually exclusive with other issuer attributes.  | no | N/A |

### Usage

This policy can be used in the following policy [sections](./api-management-howto-policies.md#sections) and [scopes](./api-management-howto-policies.md#scopes).

-   **Policy sections:** inbound
-   **Policy scopes:** all scopes

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
