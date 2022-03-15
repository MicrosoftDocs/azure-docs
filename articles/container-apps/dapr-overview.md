---
title: Dapr integration with Azure Container Apps overview (preview)
description: Learn more about using Dapr on your Azure Container App service to develop applications.
ms.author: hannahhunter
author: hhunter-ms
ms.service: container-apps
ms.topic: conceptual
ms.date: 03/10/2022
---

# Dapr integration with Azure Container Apps

With Azure Container Apps, you get a fully managed version of [Dapr][dapr-concepts] (Distributed Application Runtime) APIs that simplify microservice development and implementation. Dapr is an incrementally adoptable set of APIs that makes it easy for you to write distributed applications. When you use Dapr in Azure Container Apps, using the sidecar pattern, Dapr provides HTTP and gRPC APIs that solve common distributed app challenges, such as:

- [Service to Service calls][dapr-serviceinvo] 
    - mTLS authentication / encryption
    - Resiliency / retries
    - Service discovery
- [Pub/Sub][dapr-pubsub]
- [Event Bindings][dapr-bindings]
- [State Stores][dapr-statemgmt]
- [Actors][dapr-actors]

These APIs provide generic abstractions over popular industry technologies, which ensures app code is decoupled from the technologies you choose.

To learn how to deploy Dapr to Container Apps, see [Build microservices with Dapr][dapr-quickstart].

## Current supported Dapr version

Currently, Azure Container Apps supports Dapr version 1.4.2.

## Supported Dapr capabilities and features

Azure Container Apps offers a fully managed version of the Dapr APIs. With Dapr for Container Apps, you enable Dapr sidecars to run next to your application instances.

### Service-to-service invocation

Dapr addresses challenges around encryption, resiliency, service discovery, and more by:
- Providing a service invocation API that acts as a combination of a reverse proxy with built-in service discovery.
- Leveraging built-in distributed tracing, metrics, error handling, encryption, and more.

:::image type="content" source="./media/dapr-overview/service-invocation.png" alt-text="Service-to-service invocation diagram" :::

#### mTLS authentication / encryption

One of the security mechanisms that Dapr employs for encrypting data in transit is mutual authentication TLS (mTLS). Calls between Dapr sidecars are secured with an "on-by-default" mTLS on hosted platforms, including automatic certificate rollover, via the Dapr Sentry service. 

Dapr enables mTLS with no extra code or complex configuration inside your production systems. With Dapr, operators and developers can either:
- Bring in their own certificates, or 
- Let Dapr automatically create and persist self-signed root and issuer certificates. 

#### Resiliency / retries

Dapr service invocation performs automatic retries with back-off time periods with errors like: 

- Network errors, including endpoint unavailability and refused connections.
- Authentication errors, due to a renewing certificate on the calling/callee Dapr sidecars.

Per-call retries are performed with a back-off interval of one second up to a threshold of three times. Connection establishment via gRPC to the target sidecar has a timeout of five seconds.

#### Service discovery

Dapr can run on various hosting platforms. To enable service discovery and service invocation, Dapr uses pluggable [name resolution components][dapr-pluggable].

[Learn more about Dapr's Service Invocation capabilities.][dapr-serviceinvo]

### State management

Dapr integrates with existing databases to provide apps with state management capabilities for:

- CRUD operations
- Transactions 
- Configuration of multiple, named, state store components per application. 

A state store in Dapr is described using a Component file.

:::image type="content" source="./media/dapr-overview/state-management.png" alt-text="State management diagram" :::

[Learn more about Dapr's State Management capabilities.][dapr-statemgmt]

### Pub/sub broker

Dapr's Pub/sub pattern allows publisher and subscriber microservices to communicate with each other. 

- The publisher writes messages to an input channel and sends them to a topic.
- The subscriber subscribes to the topic to receive its messages from an output channel. 

An intermediary message broker copies each message from an input channel to an output channel for all subscribers interested in that message. This pattern is especially useful when you need to decouple microservices from one another.

[Learn more about Dapr's Pub/sub capabilities.][dapr-pubsub]

:::image type="content" source="./media/dapr-overview/pubsub.png" alt-text="Pub/sub broker diagram" :::

### Bindings

### Actors

## Semi-supported Dapr capabilities

### Observability

Dapr's sidecar architecture enables built-in observability features. As services communicate, Dapr sidecars intercept the traffic and extract tracing, metrics, and logging information. Telemetry is published in an open standards format. By default, Dapr supports OpenTelemetry and Zipkin.

With the OpenTelemetry collector, you can then configure Azure Application Insights for distributed tracing across your services.

:::image type="content" source="./media/dapr-overview/observability.png" alt-text="Observability diagram" :::

## Unsupported Dapr capabilities

### Secrets

Azure Container Apps allows you to define and manage application secrets. [Learn how to define secrets in Azure Container Apps.](manage-secrets.md)


## Schema




## Next Steps

Now that you've learned about Dapr and some of the challenges it solves, try [Deploying a Dapr application to Azure Container Apps using the Azure CLI][dapr-quickstart] or [Azure Resource Manager][dapr-arm-quickstart].

<!-- Links Internal -->
[dapr-quickstart]: ./microservices-dapr.md
[dapr-arm-quickstart]: ./microservices-dapr-azure-resource-manager.md

<!-- Links External -->
[dapr]: https://dapr.io/
[dapr-docs]: https://docs.dapr.io/
[dapr-concepts]: https://docs.dapr.io/concepts/overview/
[dapr-blocks]: https://docs.dapr.io/concepts/building-blocks-concept/
[dapr-secrets-block]: https://docs.dapr.io/developing-applications/building-blocks/secrets/secrets-overview/
[dapr-pubsub]: https://docs.dapr.io/developing-applications/building-blocks/pubsub/pubsub-overview
[dapr-statemgmt]: https://docs.dapr.io/developing-applications/building-blocks/state-management/state-management-overview/
[dapr-serviceinvo]: https://docs.dapr.io/developing-applications/building-blocks/service-invocation/service-invocation-overview/
[dapr-bindings]: https://docs.dapr.io/developing-applications/building-blocks/bindings/bindings-overview/
[dapr-actors]: https://docs.dapr.io/developing-applications/building-blocks/actors/actors-overview/
[dapr-pluggable]: https://docs.dapr.io/reference/components-reference/supported-name-resolution/