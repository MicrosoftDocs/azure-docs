---
title: Dapr integration with Azure Container Apps
description: Learn more about using Dapr on your Azure Container App service to develop applications.
ms.author: hannahhunter
author: hhunter-ms
ms.service: container-apps
ms.custom: event-tier1-build-2022, ignite-2022, build-2023
ms.topic: conceptual
ms.date: 11/27/2023
---

# Dapr integration with Azure Container Apps

[Distributed Application Runtime (Dapr)][dapr-concepts] provides APIs that run as a sidecar process that helps you write and implement simple, portable, resilient, and secured microservices. Dapr works as an abstraction layer, simplifying common complexities related to application intercommunication. Enabling Dapr on your container app creates a secondary process alongside your application code that enables communication with Dapr via HTTP or gRPC.

Dapr works together with Azure Container Apps to provide a low-maintenance, serverless, and scalable platform. This guide provides insight into core Dapr concepts and details regarding the Dapr interaction model in Azure Container Apps.

## Dapr in Azure Container Apps

Configure Dapr for your container apps environment with a Dapr-enabled container app, a Dapr component configured for your solution, and a Dapr sidecar invoking communication between them. The following diagram demonstrates these core concepts related to Dapr in Azure Container Apps.

:::image type="content" source="media/dapr-overview/dapr-in-aca.png" alt-text="Diagram demonstrating Dapr pub/sub and how it works in Container Apps.":::

| Label | Dapr settings                    | Description                                                                                                                                                                                                                                                                       |
| ----- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | Container Apps with Dapr enabled | Dapr is enabled at the container app level by configuring a set of Dapr arguments. These values apply to all revisions of a given container app when running in multiple revisions mode.                                                                                           |
| 2     | Dapr                             | The fully managed Dapr APIs are exposed to each container app through a Dapr sidecar. The Dapr APIs can be invoked from your container app via HTTP or gRPC. The Dapr sidecar runs on HTTP port 3500 and gRPC port 50001.                                                         |
| 3     | Dapr component configuration     | Dapr uses a modular design where functionality is delivered as a component. Dapr components can be shared across multiple container apps. The Dapr app identifiers provided in the scopes array dictate which dapr-enabled container apps load a given component at runtime. |

## Supported Dapr APIs

Azure Container Apps offers fully managed versions of the following _stable_ Dapr APIs (building blocks). To learn more about using alpha APIs and features, [see the Dapr FAQ][dapr-faq].

:::image type="content" source="media/dapr-overview/azure-container-apps-dapr-building-blocks.png" alt-text="Diagram that shows Dapr APIs.":::

| Dapr API                                              | Description                                                                                                                                                     |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [**Service-to-service invocation**][dapr-serviceinvo] | Discover services and perform reliable, direct service-to-service calls with automatic mTLS authentication and encryption. [See known limitations for Dapr service invocation in Azure Container Apps.](#limitations)                                     |
| [**State management**][dapr-statemgmt]                | Provides state management capabilities for transactions and CRUD operations.                                                                                    |
| [**Pub/sub**][dapr-pubsub]                            | Allows publisher and subscriber container apps to intercommunicate via an intermediary message broker.                                                          |
| [**Bindings**][dapr-bindings]                         | Trigger your applications based on events                                                                                                                       |
| [**Actors**][dapr-actors]                             | Dapr actors are message-driven, single-threaded, units of work designed to quickly scale. For example, in burst-heavy workload situations. |
| [**Observability**](./observability.md)               | Send tracing information to an Application Insights backend.                                                                                                    |
| [**Secrets**][dapr-secrets]                           | Access secrets from your application code or reference secure values in your Dapr components.                                                                   |
| [**Configuration**][dapr-config]                           | Retrieve and subscribe to application configuration items for supported configuration stores.                                                                   |

## Limitations

- **Dapr Configuration spec**: Any capabilities that require use of the Dapr configuration spec.
- **Any Dapr sidecar annotations not listed in [the Dapr enablement guide][dapr-enable]**
- **Alpha APIs and components**: Azure Container Apps doesn't guarantee the availability of Dapr alpha APIs and features. For more information, see the [Dapr FAQ][dapr-faq].
- **Actor reminders**: Require a minReplicas of 1+ to ensure reminders is always active and fires correctly.
- **Jobs**: Dapr isn't supported for jobs.

## Next Steps

- [Enable Dapr in your container app][dapr-enable]
- [Learn how Dapr components work in Azure Container Apps][dapr-components]

<!-- Links Internal -->

[dapr-faq]: ./faq.yml#dapr
[dapr-enable]: ./enable-dapr.md
[dapr-components]: ./dapr-components.md

<!-- Links External -->

[dapr-concepts]: https://docs.dapr.io/concepts/overview/
[dapr-pubsub]: https://docs.dapr.io/developing-applications/building-blocks/pubsub/pubsub-overview
[dapr-statemgmt]: https://docs.dapr.io/developing-applications/building-blocks/state-management/state-management-overview/
[dapr-serviceinvo]: https://docs.dapr.io/developing-applications/building-blocks/service-invocation/service-invocation-overview/
[dapr-bindings]: https://docs.dapr.io/developing-applications/building-blocks/bindings/bindings-overview/
[dapr-actors]: https://docs.dapr.io/developing-applications/building-blocks/actors/actors-overview/
[dapr-secrets]: https://docs.dapr.io/developing-applications/building-blocks/secrets/secrets-overview/
[dapr-config]: https://docs.dapr.io/developing-applications/building-blocks/configuration/
