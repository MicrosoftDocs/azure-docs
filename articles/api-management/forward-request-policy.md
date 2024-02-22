---
title: Azure API Management policy reference - forward-request | Microsoft Docs
description: Reference for the forward-request policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 10/19/2023
ms.author: danlep
---

# Forward request

The `forward-request` policy forwards the incoming request to the backend service specified in the request [context](api-management-policy-expressions.md#ContextVariables). The backend service URL is specified in the API [settings](./import-and-publish.md) and can be changed using the [set backend service](api-management-transformation-policies.md) policy.

> [!IMPORTANT]
> * This policy is required to forward requests to an API backend. By default, API Management sets up this policy at the global scope.
> * Removing this policy results in the request not being forwarded to the backend service. Policies in the outbound section are evaluated immediately upon the successful completion of the policies in the inbound section.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml
<forward-request http-version="1 | 2or1 | 2" timeout="time in seconds (alternatively, use timeout-ms)" | timeout-ms="time in milliseconds (alternatively, use timeout)" continue-timeout="time in seconds" follow-redirects="false | true" buffer-request-body="false | true" buffer-response="true | false" fail-on-error-status-code="false | true"/>
```

## Attributes

| Attribute                                     | Description                                                                                                                                                                                                                                                                                                    | Required | Default |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| timeout                             | The amount of time in seconds to wait for the HTTP response headers to be returned by the backend service before a timeout error is raised. Minimum value is 0 seconds. Values greater than 240 seconds may not be honored, because the underlying network infrastructure can drop idle connections after this time. Policy expressions are allowed. You can specify either `timeout` or `timeout-ms` but not both. | No       | 300    |
| timeout-ms                             | The amount of time in milliseconds to wait for the HTTP response headers to be returned by the backend service before a timeout error is raised. Minimum value is 0 ms. Policy expressions are allowed. You can specify either `timeout` or `timeout-ms` but not both.  | No       | N/A    |
| continue-timeout | The amount of time in seconds to wait for a `100 Continue` status code to be returned by the backend service before a timeout error is raised. Policy expressions are allowed. | No  | N/A |
| http-version                             | The HTTP spec version to use when sending the HTTP response to the backend service. When using `2or1`, the gateway will favor HTTP /2 over /1, but fall back to HTTP /1 if HTTP /2 doesn't work. | No       | 1    |
| follow-redirects | Specifies whether redirects from the backend service are followed by the gateway or returned to the caller. Policy expressions are allowed.                                                                                                                                                                                                    | No       | `false`   |
| buffer-request-body      | When set to `true`, request is buffered and will be reused on [retry](retry-policy.md).                                                                                                                                                                                               | No       | `false`   |
| buffer-response | Affects processing of chunked responses. When set to `false`, each chunk received from the backend is immediately returned to the caller. When set to `true`, chunks are buffered (8 KB, unless end of stream is detected) and only then returned to the caller.<br/><br/>Set to `false` with backends such as those implementing [server-sent events (SSE)](how-to-server-sent-events.md) that require content to be returned or streamed immediately to the caller. Policy expressions aren't allowed. | No | `true` |
| fail-on-error-status-code | When set to `true`, triggers [on-error](api-management-error-handling-policies.md) section for response codes in the range from 400 to 599 inclusive.  Policy expressions aren't allowed.                                                                                                                                                                     | No       | `false`   |


## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) backend
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption, self-hosted

## Examples

### Send request to HTTP/2 backend

The following API level policy forwards all API requests to an HTTP/2 backend service.

```xml
<!-- api level -->
<policies>
    <inbound>
        <base/>
    </inbound>
    <backend>
        <forward-request http-version="2or1"/>
    </backend>
    <outbound>
        <base/>
    </outbound>
</policies>
```

This is required for HTTP /2 or gRPC workloads and currently only supported in self-hosted gateway. Learn more in our [API gateway overview](api-management-gateways-overview.md).

### Forward request with timeout interval

The following API level policy forwards all API requests to the backend service with a timeout interval of 60 seconds.

```xml
<!-- api level -->
<policies>
    <inbound>
        <base/>
    </inbound>
    <backend>
        <forward-request timeout="60"/>
    </backend>
    <outbound>
        <base/>
    </outbound>
</policies>
```

### Inherit policy from parent scope

This operation level policy uses the `base` element to inherit the backend policy from the parent API level scope.

```xml
<!-- operation level -->
<policies>
    <inbound>
        <base/>
    </inbound>
    <backend>
        <base/>
    </backend>
    <outbound>
        <base/>
    </outbound>
</policies>

```

### Do not inherit policy from parent scope

This operation level policy explicitly forwards all requests to the backend service with a timeout of 120 and doesn't inherit the parent API level backend policy. If the backend service responds with an error status code from 400 to 599 inclusive, [on-error](api-management-error-handling-policies.md) section will be triggered.

```xml
<!-- operation level -->
<policies>
    <inbound>
        <base/>
    </inbound>
    <backend>
        <forward-request timeout="120" fail-on-error-status-code="true" />
        <!-- effective policy. note the absence of <base/> -->
    </backend>
    <outbound>
        <base/>
    </outbound>
</policies>

```

### Do not forward requests to backend

This operation level policy doesn't forward requests to the backend service.

```xml
<!-- operation level -->
<policies>
    <inbound>
        <base/>
    </inbound>
    <backend>
        <!-- no forwarding to backend -->
    </backend>
    <outbound>
        <base/>
    </outbound>
</policies>

```

## Related policies

* [API Management advanced policies](api-management-advanced-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
