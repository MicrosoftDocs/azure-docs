---
title: Azure API Management Dapr integration policies | Microsoft Docs
description: Learn about Azure API Management policies for interacting with Dapr microservices extensions.
author: vladvino
ms.author: vlvinogr
ms.date: 9/13/2020
ms.topic: article
ms.service: api-management
---

# API Management Dapr integration policies

This topic provides a reference for Dapr integration API Management policies. Dapr is a portable runtime for building stateless and stateful microservices-based applications with any language or framework. It codifies the common microservice patterns, like service discovery and invocation with build-in retry logic, publish-and-subscribe with at-least-once delivery semantics, or pluggable binding resources to ease composition using external services. Go to [dapr.io](https://dapr.io) for detailed information and instruction on how to get started with Dapr. For information on adding and configuring policies, see [Policies in API Management](api-management-howto-policies.md).

> [!CAUTION]
> Policies referenced in this topic are in Public Preview and are subject to [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/en-us/support/legal/preview-supplemental-terms/).

> [!IMPORTANT]
> Policies referenced in this topic work only in the [self-hosted version of the API Management gateway](self-hosted-gateway-overview.md) with Dapr support enabled.
> To turn on Dapr support in the self-hosted gateway add the following [Dapr annotations](https://github.com/dapr/docs/blob/master/howto/configure-k8s/README.md) to the [Kubernetes deployment template](how-to-deploy-self-hosted-gateway-kubernetes.md) replacing "app-name" with a desired name:

```yml
template:
    metadata:
      labels:
        app: app-name
      annotations:
        dapr.io/enabled: "true"
        dapr.io/app-id: "app-name"
```


## <a name="DaprPolicies"></a> Dapr integration policies

-  [Send request to a service](api-management-dapr-policies.md#invoke) - uses Dapr runtime to locate and reliably communicate with a Dapr microservice. Click [here](https://github.com/dapr/docs/blob/master/concepts/service-invocation/README.md#service-invocation) to learn more about service invocation in Dapr.
-  [Send message to Pub/Sub topic](api-management-dapr-policies.md#pubsub) - uses Dapr runtime to publish a message to a Publish/Subscribe topic. Click [here](https://github.com/dapr/docs/blob/master/concepts/publish-subscribe-messaging/README.md) to learn more about Publish/Subscribe messaging in Dapr.
-  [Trigger output binding](api-management-dapr-policies.md#bind) - uses Dapr runtime to invoke an external system via output binding. Click [here](https://github.com/dapr/docs/blob/master/concepts/bindings/README.md) to learn more about bindings in Dapr.

## <a name="invoke"></a> Send request to a service

This policy sets the target URL for the current request to `http://localhost:3500/v1.0/invoke/{app-id}/method/{method-name}` replacing template parameters with values specified in the policy statement.

The policy assumes that Dapr runs as a sidecar container in the same pod as the gateway. Upon receiving the request, Dapr runtime performs service discovery and actual invocation, including possible protocol translation between HTTP and gRPC, retries, distributed tracing, and error handling.

### Policy statement

```xml
<set-backend-service backend-id="dapr" dapr-app-id="app-id" dapr-method="method-name" />
```

### Examples

#### Example

The following example demonstrates invoking a method named "back" on microservice called "echo". The `set-backend-service` policy sets the destination URL. The `forward-request` policy dispatches the request to the Dapr runtime.

Note that `forward-request` is shown here for clarity but is typically "inherited" from the global scope via the `base` keyword.

```xml
<policies>
    <inbound>
        <base />
        <set-backend-service backend-id="dapr" dapr-app-id="echo" dapr-method="back" />
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
| dapr-app-id      | Name of the target microservice. Maps to the [appId](https://github.com/dapr/docs/blob/master/reference/api/service_invocation_api.md) parameter in Dapr.| Yes | N/A |
| dapr-method      | Name of the method or a URL to invoke on the target microservice. Maps to the [method-name](https://github.com/dapr/docs/blob/master/reference/api/service_invocation_api.md) parameter in Dapr.| Yes | N/A |

### Usage

This policy can be used in the following policy [sections](./api-management-howto-policies.md#sections) and [scopes](./api-management-howto-policies.md#scopes).

- **Policy sections:** inbound
- **Policy scopes:** all scopes

## <a name="pubsub"></a> Send message to Pub/Sub topic

This policy instructs API Management gateway to forward current request to the Dapr runtime by issuing a POST HTTP request to `http://localhost:3500/v1.0/invoke/{app-id}/method/{method-name}` with template parameters replaced by the values specified in the policy statement.

The policy assumes that Dapr runtime is running as a sidecar container in the same pod as the gateway. Upon receiving the request Dapr runtime performs service discovery and actual invocation including possible protocol translation between HTTP and gRPC, retries, distributed tracing, and error handling.

### Policy statement

```xml
<set-backend-service backend-id="dapr" dapr-app-id="app-id" dapr-method="method-name" />
```

### Examples

#### Example

The following example demonstrates invoking a method "back" on microservice called "echo".

```xml
<set-backend-service backend-id="dapr" dapr-app-id="echo" dapr-method="back" />
```

### Elements

| Element             | Description  | Required |
|---------------------|--------------|----------|
| set-backend-service | Root element | Yes      |

### Attributes

| Attribute        | Description                     | Required | Default |
|------------------|---------------------------------|----------|---------|
| backend-id       | Must be set to "dapr"           | Yes      | N/A     |
| dapr-app-id      | Name of the target microservice. Maps to the [appId](https://github.com/dapr/docs/blob/master/reference/api/service_invocation_api.md) parameter in Dapr.| Yes | N/A |
| dapr-method      | Name of the method or a URL to invoke on the target microservice. Maps to the [method-name](https://github.com/dapr/docs/blob/master/reference/api/service_invocation_api.md) parameter in Dapr.| Yes | N/A |

### Usage

This policy can be used in the following policy [sections](./api-management-howto-policies.md#sections) and [scopes](./api-management-howto-policies.md#scopes).

- **Policy sections:** inbound
- **Policy scopes:** all scopes