---
title: Azure API Management policy reference - retry | Microsoft Docs
description: Reference for the retry policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 12/08/2022
ms.author: danlep
---

# Retry

The `retry` policy executes its child policies once and then retries their execution until the retry `condition` becomes `false` or retry `count` is exhausted.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]


## Policy statement

```xml
<retry
    condition="Boolean expression or literal"
    count="number of retry attempts"
    interval="retry interval in seconds"
    max-interval="maximum retry interval in seconds"
    delta="retry interval delta in seconds"
    first-fast-retry="boolean expression or literal">
        <!-- One or more child policies. No restrictions. -->
</retry>
```


## Attributes

| Attribute        | Description                                                                                                                                           | Required | Default |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| condition        | Boolean. Specifies whether retries should be stopped (`false`) or continued (`true`). Policy expressions are allowed.     | Yes      | N/A     |
| count            | A positive number specifying the maximum number of retries to attempt. Policy expressions are allowed.                                                                               | Yes      | N/A     |
| interval         | A positive number in seconds specifying the wait interval between the retry attempts. Policy expressions are allowed.                                                                 | Yes      | N/A     |
| max-interval     | A positive number in seconds specifying the maximum wait interval between the retry attempts. It is used to implement an exponential retry algorithm. Policy expressions are allowed. | No       | N/A     |
| delta            | A positive number in seconds specifying the wait interval increment. It is used to implement the linear and exponential retry algorithms. Policy expressions are allowed.             | No       | N/A     |
| first-fast-retry | Boolean. If set to `true`, the first retry attempt is performed immediately. Policy expressions are allowed.                                                                                  | No       | `false` |

## Retry wait times

* When only the `interval` is specified, **fixed** interval retries are performed.
* When only the `interval` and `delta` are specified, a **linear** interval retry algorithm is used. The  wait time between retries increases according to the following formula: `interval + (count - 1)*delta`.
* When the `interval`, `max-interval` and `delta` are specified, an **exponential** interval retry algorithm is applied. The wait time between the retries increases exponentially according to the following formula: `interval + (2^count - 1) * random(delta * 0.8, delta * 1.2)`, up to a maximum interval set by `max-interval`. 

    For example, when `interval` and `delta` are both set to 10 seconds, and `max-interval` is 100 seconds, the approximate wait time between retries increases as follows: 10 seconds, 20 seconds, 40 seconds, 80 seconds, with 100 seconds wait time used for remaining retries.

## Elements

The `retry` policy may contain any other policies as its child elements.

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound, outbound, backend, on-error
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption, self-hosted

## Examples

### Request forwarding with exponential retry

In the following example, request forwarding is retried up to ten times using an exponential retry algorithm. Since `first-fast-retry` is set to `false`, all retry attempts are subject to exponentially increasing retry wait times (in this example, approximately 10 seconds, 20 seconds, 40 seconds, ...), up to a maximum wait of `max-interval`.

```xml
<retry
    condition="@(context.Response.StatusCode == 500)"
    count="10"
    interval="10"
    max-interval="100"
    delta="10"
    first-fast-retry="false">
        <forward-request buffer-request-body="true" />
</retry>
```

### Send request upon initial request failure

In the following example, sending a request to a URL other than the defined backend is retried up to three times if the connection is dropped/timed out, or the request results in a server-side error. Since `first-fast-retry` is set to true, the first retry is executed immediately upon the initial request failure. Note that `send-request` must set `ignore-error` to true in order for `response-variable-name` to be null in the event of an error.

```xml

<retry
    condition="@(context.Variables["response"] == null || ((IResponse)context.Variables["response"]).StatusCode >= 500)"
    count="3"
    interval="1"
    first-fast-retry="true">
        <send-request 
            mode="new" 
            response-variable-name="response" 
            timeout="3" 
            ignore-error="true">
		        <set-url>https://api.contoso.com/products/5</set-url>
		        <set-method>GET</set-method>
		</send-request>
</retry>
```

## Related policies

* [API Management advanced policies](api-management-advanced-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]