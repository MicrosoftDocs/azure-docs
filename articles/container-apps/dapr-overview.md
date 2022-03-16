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

Distributed Application Runtime ([Dapr][dapr-concepts]) is a portable, efficient, event-driven runtime that consists of open, independent HTTP or gRPC APIs, called building blocks. Dapr exposes these APIs as a sidecar, running as a separate process alongside your application.

Dapr is an incrementally adoptable set of APIs that makes it easy for you to write distributed applications. Dapr's sidecar architecture helps you build simple, portable, resilient, and secured microservices that embrace the diversity of languages and developer frameworks.

With Dapr in Azure Container Apps, you get a fully managed version of the Dapr APIs. Dapr's HTTP and gRPC APIs address the common complexities developers regularly encounter when building and implementing distributed applications, such as:

- Inter-service communication, like [direct service-to-service invocation][dapr-serviceinvo] or [pub/sub messaging][dapr-pubsub]
- Input and output [event binding][dapr-bindings]
- [State stores][dapr-statemgmt]
- [Actors][dapr-actors]


To learn how to deploy Dapr to Container Apps, see [Build microservices with Dapr][dapr-quickstart].

## Current supported Dapr version

Currently, Azure Container Apps supports Dapr version 1.4.2.

## Supported Dapr capabilities and features

With Dapr for Container Apps, you can enable the following Dapr sidecars to run next to your application instances.

### Service-to-service invocation

Dapr addresses challenges around encryption, resiliency, service discovery, and more with their service invocation building block.

:::image type="content" source="./media/dapr-overview/service-invocation.png" alt-text="Service-to-service invocation diagram" :::

| Capability | Description |
| ---------- | ----------- |
| mTLS authentication | Calls between Dapr sidecars are secured with an "on-by-default" mTLS on hosted platforms, including automatic certificate rollover, via the Dapr Sentry service. |
| Resiliency | Dapr service invocation performs automatic retries with back-off time periods with network and authentication errors. |
| Service discovery | Dapr uses pluggable [name resolution components][dapr-pluggable] to enable service discovery and service invocation.
 |

[Learn more about Dapr's service invocation capabilities.][dapr-serviceinvo]

### State management

Dapr integrates with existing databases to provide apps with state management capabilities for:

- CRUD operations
- Transactions 
- Configuration of multiple, named, state store components per application. 

:::image type="content" source="./media/dapr-overview/state-management.png" alt-text="State management diagram" :::

[Learn more about Dapr's state management capabilities.][dapr-statemgmt]

### Pub/sub broker

Dapr's Pub/sub pattern allows publisher and subscriber microservices to communicate with each other while remaining decoupled. An intermediary message broker copies each message from an input channel to an output channel for all subscribers interested in that message. 

[Learn more about Dapr's pub/sub capabilities.][dapr-pubsub]

:::image type="content" source="./media/dapr-overview/pubsub.png" alt-text="Pub/sub broker diagram" :::

### Bindings

With Dapr's input and output bindings, you can trigger your application with incoming or outgoing events, without taking dependencies from SDKs or libraries.

### Actors

Write your Dapr actors according to the Actor model while Dapr leverages the scalability and reliability that the underlying platform provides.

## Semi-supported Dapr capabilities

### Observability

Dapr's sidecar architecture enables built-in observability features. By default, Dapr supports OpenTelemetry and Zipkin. With the OpenTelemetry collector, you can then configure Azure Application Insights for distributed tracing across your services.

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