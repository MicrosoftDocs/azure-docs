---
title: Azure API Management policy reference - set-backend-service (Dapr) | Microsoft Docs
description: Reference for the set-backend-service policy available for use in Dapr integration with Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 12/07/2022
ms.author: danlep
---

# Send request to a service

The `set-backend-service` policy sets the target URL for the current request to `http://localhost:3500/v1.0/invoke/{app-id}[.{ns-name}]/method/{method-name}`, replacing template parameters with values specified in the policy statement.

The policy assumes that Dapr runs in a sidecar container in the same pod as the gateway. Upon receiving the request, Dapr runtime performs service discovery and actual invocation, including possible protocol translation between HTTP and gRPC, retries, distributed tracing, and error handling. Learn more about [Dapr integration with API Management](self-hosted-gateway-enable-dapr.md).

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml
<set-backend-service backend-id="dapr" dapr-app-id="app-id" dapr-method="method-name" dapr-namespace="ns-name" />
```

## Attributes

| Attribute        | Description                     | Required | Default |
|------------------|---------------------------------|----------|---------|
| backend-id       | Must be set to "dapr".           | Yes      | N/A     |
| dapr-app-id      | Name of the target microservice. Used to form the [appId](https://github.com/dapr/docs/blob/master/daprdocs/content/en/reference/api/service_invocation_api.md) parameter in Dapr. Policy expressions are allowed. | Yes | N/A |
| dapr-method      | Name of the method or a URL to invoke on the target microservice. Maps to the [method-name](https://github.com/dapr/docs/blob/master/daprdocs/content/en/reference/api/service_invocation_api.md) parameter in Dapr. Policy expressions are allowed. | Yes | N/A |
| dapr-namespace   | Name of the namespace the target microservice is residing in. Used to form the [appId](https://github.com/dapr/docs/blob/master/daprdocs/content/en/reference/api/service_invocation_api.md) parameter in Dapr. Policy expressions are allowed. | No | N/A |

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) self-hosted

### Usage notes

Dapr support must be [enabled](self-hosted-gateway-enable-dapr.md) in the self-hosted gateway.

## Example

The following example demonstrates invoking the method named "back" on the microservice called "echo". The `set-backend-service` policy sets the destination URL to `http://localhost:3500/v1.0/invoke/echo.echo-app/method/back`. The [`forward-request`](forward-request-policy.md) policy dispatches the request to the Dapr runtime, which delivers it to the microservice.

The `forward-request` policy is shown here for clarity. The policy is typically "inherited" from the global scope via the `base` keyword.

```xml
<policies>
    <inbound>
        <base />
        <set-backend-service backend-id="dapr" dapr-app-id="echo" dapr-method="back" dapr-namespace="echo-app" />
    </inbound>
    <backend>
        <forward-request />
    </backend>
    <outbound>
        <base />
    </outbound>
    <on-error>
        <base />
    </on-error>
</policies>
```

## Related policies

* [API Management Dapr integration policies](api-management-dapr-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]