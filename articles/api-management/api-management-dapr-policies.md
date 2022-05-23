---
title: Azure API Management Dapr integration policies | Microsoft Docs
description: Reference for Azure API Management policies for interacting with Dapr microservices extensions. Provides policy usage, settings and examples.
author: dlepow
ms.author: danlep
ms.date: 03/07/2022
ms.topic: reference
ms.service: api-management
---

# API Management Dapr integration policies

This article provides a reference for API Management policies used for integrating with Distributed Application Runtime (Dapr) microservices extensions.

[!INCLUDE [api-management-policy-intro-links](../../includes/api-management-policy-intro-links.md)]

## About Dapr

Dapr is a portable runtime for building stateless and stateful microservices-based applications with any language or framework. It codifies the common microservice patterns, like service discovery and invocation with build-in retry logic, publish-and-subscribe with at-least-once delivery semantics, or pluggable binding resources to ease composition using external services. Go to [dapr.io](https://dapr.io) for detailed information and instruction on how to get started with Dapr.

> [!IMPORTANT]
> Policies referenced in this topic work only in the [self-hosted version of the API Management gateway](self-hosted-gateway-overview.md) with Dapr support enabled.

## Enable Dapr support in the self-hosted gateway

To turn on Dapr support in the self-hosted gateway add the [Dapr annotations](https://github.com/dapr/docs/blob/master/README.md) below to the [Kubernetes deployment template](how-to-deploy-self-hosted-gateway-kubernetes.md) replacing "app-name" with a desired name. Complete walkthrough of setting up and using API Management with Dapr is available [here](https://aka.ms/apim/dapr/walkthru).
```yml
template:
    metadata:
      labels:
        app: app-name
      annotations:
        dapr.io/enabled: "true"
        dapr.io/app-id: "app-name"
```

> [!TIP]
> You can also deploy the [self-hosted gateway with Helm](how-to-deploy-self-hosted-gateway-kubernetes-helm.md) and use the Dapr configuration options.

## Distributed Application Runtime (Dapr) integration policies

-  [Send request to a service](api-management-dapr-policies.md#invoke): Uses Dapr runtime to locate and reliably communicate with a Dapr microservice. To learn more about service invocation in Dapr, see the description in this [README](https://github.com/dapr/docs/blob/master/README.md#service-invocation) file.
-  [Send message to Pub/Sub topic](api-management-dapr-policies.md#pubsub): Uses Dapr runtime to publish a message to a Publish/Subscribe topic. To learn more about Publish/Subscribe messaging in Dapr, see the description in this [README](https://github.com/dapr/docs/blob/master/README.md) file.
-  [Trigger output binding](api-management-dapr-policies.md#bind): Uses Dapr runtime to invoke an external system via output binding. To learn more about bindings in Dapr, see the description in this [README](https://github.com/dapr/docs/blob/master/README.md) file.

## <a name="invoke"></a> Send request to a service

This policy sets the target URL for the current request to `http://localhost:3500/v1.0/invoke/{app-id}[.{ns-name}]/method/{method-name}` replacing template parameters with values specified in the policy statement.

The policy assumes that Dapr runs in a sidecar container in the same pod as the gateway. Upon receiving the request, Dapr runtime performs service discovery and actual invocation, including possible protocol translation between HTTP and gRPC, retries, distributed tracing, and error handling.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

### Policy statement

```xml
<set-backend-service backend-id="dapr" dapr-app-id="app-id" dapr-method="method-name" dapr-namespace="ns-name" />
```

### Examples

#### Example

The following example demonstrates invoking the method named "back" on the microservice called "echo". The `set-backend-service` policy sets the destination URL to `http://localhost:3500/v1.0/invoke/echo.echo-app/method/back`. The `forward-request` policy dispatches the request to the Dapr runtime, which delivers it to the microservice.

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

### Elements

| Element             | Description  | Required |
|---------------------|--------------|----------|
| set-backend-service | Root element | Yes      |

### Attributes

| Attribute        | Description                     | Required | Default |
|------------------|---------------------------------|----------|---------|
| backend-id       | Must be set to "dapr"           | Yes      | N/A     |
| dapr-app-id      | Name of the target microservice. Used to form the [appId](https://github.com/dapr/docs/blob/master/daprdocs/content/en/reference/api/service_invocation_api.md) parameter in Dapr.| Yes | N/A |
| dapr-method      | Name of the method or a URL to invoke on the target microservice. Maps to the [method-name](https://github.com/dapr/docs/blob/master/daprdocs/content/en/reference/api/service_invocation_api.md) parameter in Dapr.| Yes | N/A |
| dapr-namespace   | Name of the namespace the target microservice is residing in. Used to form the [appId](https://github.com/dapr/docs/blob/master/daprdocs/content/en/reference/api/service_invocation_api.md) parameter in Dapr.| No | N/A |

### Usage

This policy can be used in the following policy [sections](./api-management-howto-policies.md#sections) and [scopes](./api-management-howto-policies.md#scopes).

- **Policy sections:** inbound
- **Policy scopes:** all scopes

## <a name="pubsub"></a> Send message to Pub/Sub topic

This policy instructs API Management gateway to send a message to a Dapr Publish/Subscribe topic. The policy accomplishes that by making an HTTP POST request to `http://localhost:3500/v1.0/publish/{{pubsub-name}}/{{topic}}` replacing template parameters and adding content specified in the policy statement.

The policy assumes that Dapr runtime is running in a sidecar container in the same pod as the gateway. Dapr runtime implements the Pub/Sub semantics.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

### Policy statement

```xml
<publish-to-dapr pubsub-name="pubsub-name" topic="topic-name" ignore-error="false|true" response-variable-name="resp-var-name" timeout="in seconds" template="Liquid" content-type="application/json">
    <!-- message content -->
</publish-to-dapr>
```

### Examples

#### Example

The following example demonstrates sending the body of the current request to the "new" [topic](https://github.com/dapr/docs/blob/master/daprdocs/content/en/reference/api/pubsub_api.md#url-parameters) of the "orders" Pub/Sub [component](https://github.com/dapr/docs/blob/master/daprdocs/content/en/reference/api/pubsub_api.md#url-parameters). Response received from the Dapr runtime is stored in the "dapr-response" entry of the Variables collection in the [context](api-management-policy-expressions.md#ContextVariables) object.

If Dapr runtime can't locate the target topic, for example, and responds with an error, the "on-error" section is triggered. The response received from the Dapr runtime is returned to the caller verbatim. Otherwise, default `200 OK` response is returned.

The "backend" section is empty and the request is not forwarded to the backend.

```xml
<policies>
     <inbound>
        <base />
        <publish-to-dapr
           pubsub-name="orders"
               topic="new"
               response-variable-name="dapr-response">
            @(context.Request.Body.As<string>())
        </publish-to-dapr>
    </inbound>
    <backend>
    </backend>
    <outbound>
        <base />
    </outbound>
    <on-error>
        <base />
        <return-response response-variable-name="pubsub-response" />
    </on-error>
</policies>
```

### Elements

| Element             | Description  | Required |
|---------------------|--------------|----------|
| publish-to-dapr     | Root element | Yes      |

### Attributes

| Attribute        | Description                     | Required | Default |
|------------------|---------------------------------|----------|---------|
| pubsub-name      | The name of the target PubSub component. Maps to the [pubsubname](https://github.com/dapr/docs/blob/master/daprdocs/content/en/reference/api/pubsub_api.md) parameter in Dapr. If not present, the __topic__ attribute value must be in the form of `pubsub-name/topic-name`.    | No       | None    |
| topic            | The name of the topic. Maps to the [topic](https://github.com/dapr/docs/blob/master/daprdocs/content/en/reference/api/pubsub_api.md) parameter in Dapr.               | Yes      | N/A     |
| ignore-error     | If set to `true` instructs the policy not to trigger ["on-error"](api-management-error-handling-policies.md) section upon receiving error from Dapr runtime | No | `false` |
| response-variable-name | Name of the [Variables](api-management-policy-expressions.md#ContextVariables) collection entry to use for storing response from Dapr runtime | No | None |
| timeout | Time (in seconds) to wait for Dapr runtime to respond. Can range from 1 to 240 seconds. | No | 5 |
| template | Templating engine to use for transforming the message content. "Liquid" is the only supported value. | No | None |
| content-type | Type of the message content. "application/json" is the only supported value. | No | None |

### Usage

This policy can be used in the following policy [sections](./api-management-howto-policies.md#sections) and [scopes](./api-management-howto-policies.md#scopes).

- **Policy sections:** inbound, outbound, on-error
- **Policy scopes:** all scopes

## <a name="bind"></a> Trigger output binding

This policy instructs API Management gateway to trigger an outbound Dapr [binding](https://github.com/dapr/docs/blob/master/README.md). The policy accomplishes that by making an HTTP POST request to `http://localhost:3500/v1.0/bindings/{{bind-name}}` replacing template parameter and adding content specified in the policy statement.

The policy assumes that Dapr runtime is running in a sidecar container in the same pod as the gateway. Dapr runtime is responsible for invoking the external resource represented by the binding.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

### Policy statement

```xml
<invoke-dapr-binding name="bind-name" operation="op-name" ignore-error="false|true" response-variable-name="resp-var-name" timeout="in seconds" template="Liquid" content-type="application/json">
    <metadata>
        <item key="item-name"><!-- item-value --></item>
    </metadata>
    <data>
        <!-- message content -->
    </data>
</invoke-dapr-binding>
```

### Examples

#### Example

The following example demonstrates triggering of outbound binding named "external-systems" with operation name "create", metadata consisting of two key/value items named "source" and "client-ip", and the body coming from the original request. Response received from the Dapr runtime is captured in the "bind-response" entry of the Variables collection in the [context](api-management-policy-expressions.md#ContextVariables) object.

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
                <item key="client-ip">@( context.Request.IpAddress )</item>
            </metadata>
            <data>
                @( context.Request.Body.As<string>() )
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

### Elements

| Element             | Description  | Required |
|---------------------|--------------|----------|
| invoke-dapr-binding | Root element | Yes      |
| metadata            | Binding specific metadata in the form of key/value pairs. Maps to the [metadata](https://github.com/dapr/docs/blob/master/daprdocs/content/en/reference/api/bindings_api.md#invoking-output-bindings) property in Dapr. | No |
| data            | Content of the message. Maps to the [data](https://github.com/dapr/docs/blob/master/daprdocs/content/en/reference/api/bindings_api.md#invoking-output-bindings) property in Dapr. | No |


### Attributes

| Attribute        | Description                     | Required | Default |
|------------------|---------------------------------|----------|---------|
| name            | Target binding name. Must match the name of the bindings [defined](https://github.com/dapr/docs/blob/master/daprdocs/content/en/reference/api/bindings_api.md#bindings-structure) in Dapr.           | Yes      | N/A     |
| operation       | Target operation name (binding specific). Maps to the [operation](https://github.com/dapr/docs/blob/master/daprdocs/content/en/reference/api/bindings_api.md#invoking-output-bindings) property in Dapr. | No | None |
| ignore-error     | If set to `true` instructs the policy not to trigger ["on-error"](api-management-error-handling-policies.md) section upon receiving error from Dapr runtime | No | `false` |
| response-variable-name | Name of the [Variables](api-management-policy-expressions.md#ContextVariables) collection entry to use for storing response from Dapr runtime | No | None |
| timeout | Time (in seconds) to wait for Dapr runtime to respond. Can range from 1 to 240 seconds. | No | 5 |
| template | Templating engine to use for transforming the message content. "Liquid" is the only supported value. | No | None |
| content-type | Type of the message content. "application/json" is the only supported value. | No | None |

### Usage

This policy can be used in the following policy [sections](./api-management-howto-policies.md#sections) and [scopes](./api-management-howto-policies.md#scopes).

- **Policy sections:** inbound, outbound, on-error
- **Policy scopes:** all scopes

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]

