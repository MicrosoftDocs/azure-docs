---
title: Azure API Management policy reference - invoke-dapr-binding | Microsoft Docs
description: Reference for the invoke-dapr-binding policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 12/07/2022
ms.author: danlep
---

# Trigger output binding

The `invoke-dapr-binding` policy instructs API Management gateway to trigger an outbound Dapr [binding](https://github.com/dapr/docs/blob/master/README.md). The policy accomplishes that by making an HTTP POST request to `http://localhost:3500/v1.0/bindings/{{bind-name}},` replacing the template parameter and adding content specified in the policy statement.

The policy assumes that Dapr runtime is running in a sidecar container in the same pod as the gateway. Dapr runtime is responsible for invoking the external resource represented by the binding. Learn more about [Dapr integration with API Management](api-management-dapr-policies.md).

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml
<invoke-dapr-binding name="bind-name" operation="op-name" ignore-error="false | true" response-variable-name="resp-var-name" timeout="in seconds" template="Liquid" content-type="application/json">
    <metadata>
        <item key="item-name"><!-- item-value --></item>
    </metadata>
    <data>
        <!-- message content -->
    </data>
</invoke-dapr-binding>
```

## Attributes

| Attribute        | Description                     | Required | Default |
|------------------|---------------------------------|----------|---------|
| name            | Target binding name. Must match the name of the bindings [defined](https://github.com/dapr/docs/blob/master/daprdocs/content/en/reference/api/bindings_api.md#bindings-structure) in Dapr. Policy expressions are allowed.          | Yes      | N/A     |
| operation       | Target operation name (binding specific). Maps to the [operation](https://github.com/dapr/docs/blob/master/daprdocs/content/en/reference/api/bindings_api.md#invoking-output-bindings) property in Dapr. Policy expressions aren't allowed. | No | None |
| ignore-error     | If set to `true` instructs the policy not to trigger ["on-error"](api-management-error-handling-policies.md) section upon receiving error from Dapr runtime. Policy expressions aren't allowed. | No | `false` |
| response-variable-name | Name of the [Variables](api-management-policy-expressions.md#ContextVariables) collection entry to use for storing response from Dapr runtime. Policy expressions aren't allowed. | No | None |
| timeout | Time (in seconds) to wait for Dapr runtime to respond. Can range from 1 to 240 seconds. Policy expressions are allowed.| No | 5 |
| template | Templating engine to use for transforming the message content. "Liquid" is the only supported value.  | No | None |
| content-type | Type of the message content. "application/json" is the only supported value. | No | None |

## Elements

| Element             | Description  | Required |
|---------------------|--------------|----------|
| metadata            | Binding specific metadata in the form of key/value pairs. Maps to the [metadata](https://github.com/dapr/docs/blob/master/daprdocs/content/en/reference/api/bindings_api.md#invoking-output-bindings) property in Dapr. | No |
| data            | Content of the message. Maps to the [data](https://github.com/dapr/docs/blob/master/daprdocs/content/en/reference/api/bindings_api.md#invoking-output-bindings) property in Dapr. Policy expressions are allowed. | No |

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound, outbound, on-error
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) self-hosted

### Usage notes

Dapr support must be [enabled](api-management-dapr-policies.md#enable-dapr-support-in-the-self-hosted-gateway) in the self-hosted gateway.


## Example

The following example demonstrates triggering of outbound binding named "external-systems" with operation named "create", metadata consisting of two key/value items named "source" and "client-ip", and the body coming from the original request. Response received from the Dapr runtime is captured in the "bind-response" entry of the Variables collection in the [context](api-management-policy-expressions.md#ContextVariables) object.

If Dapr runtime fails for some reason and responds with an error, the "on-error" section is triggered and response received from the Dapr runtime is returned to the caller verbatim. Otherwise, default `200 OK` response is returned.

The "backend" section is empty and the request is not forwarded to the backend.

```xml
<policies>
     <inbound>
        <base />
        <invoke-dapr-binding
                      name="external-system"
                      operation="create"
                      response-variable-name="bind-response">
            <metadata>
                <item key="source">api-management</item>
                <item key="client-ip">@(context.Request.IpAddress )</item>
            </metadata>
            <data>
                @(context.Request.Body.As<string>() )
            </data>
        </invoke-dapr-binding>
    </inbound>
    <backend>
    </backend>
    <outbound>
        <base />
    </outbound>
    <on-error>
        <base />
        <return-response response-variable-name="bind-response" />
    </on-error>
</policies>
```

## Related policies

* [API Management Dapr integration policies](api-management-dapr-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]