---
title: Dapr integration with Azure Container Apps
description: Learn more about using Dapr on your Azure Container App service to develop applications.
ms.author: hannahhunter
author: hhunter-ms
ms.service: container-apps
ms.custom: build-2023
ms.topic: conceptual
ms.date: 04/22/2024
---

# Dapr integration with Azure Container Apps

[Distributed Application Runtime (Dapr)][dapr-concepts] provides APIs that run as a sidecar process that helps you write and implement simple, portable, resilient, and secured microservices. Dapr works together with Azure Container Apps as an abstraction layer to provide a low-maintenance, serverless, and scalable platform. [Enabling Dapr on your container app][dapr-enable] creates a secondary process alongside your application code that simplifies application intercommunication with Dapr via HTTP or gRPC.

## Dapr in Azure Container Apps

Configure Dapr for your container apps environment with a [Dapr-enabled container app][dapr-enable], a [Dapr component configured for your solution][dapr-components], and a Dapr sidecar invoking communication between them. The following diagram demonstrates these core concepts related to Dapr in Azure Container Apps.

:::image type="content" source="media/dapr-overview/dapr-in-aca.png" alt-text="Diagram demonstrating Dapr pub/sub and how it works in Container Apps.":::

| Label | Dapr settings                    | Description                                                                                                                                                                                                                                                                       |
| ----- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | Container Apps with Dapr enabled | Dapr is enabled at the container app level by configuring a set of Dapr arguments. These values apply to all revisions of a given container app when running in multiple revisions mode.                                                                                           |
| 2     | Dapr                             | The fully managed Dapr APIs are exposed to each container app through a Dapr sidecar. The Dapr APIs can be invoked from your container app via HTTP or gRPC. The Dapr sidecar runs on HTTP port 3500 and gRPC port 50001.                                                         |
| 3     | Dapr component configuration     | Dapr uses a modular design where functionality is delivered as a component. Dapr components can be shared across multiple container apps. The Dapr app identifiers provided in the scopes array dictate which dapr-enabled container apps load a given component at runtime. |

## Supported Dapr APIs, components, and tooling

### Managed APIs

Azure Container Apps offers managed generally available Dapr APIs (building blocks). These APIs are fully managed and supported for use in production environments.

To learn more about using _alpha_ Dapr APIs and features, [see the Dapr FAQ][dapr-faq].

:::image type="content" source="media/dapr-overview/azure-container-apps-dapr-building-blocks.png" lightbox="media/dapr-overview/azure-container-apps-dapr-building-blocks.png" alt-text="Diagram that shows Dapr APIs.":::

| API                                              | Status | Description                                                                                                                                                     |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [**Service-to-service invocation**][dapr-serviceinvo] | GA | Discover services and perform reliable, direct service-to-service calls with automatic mTLS authentication and encryption. [See known limitations for Dapr service invocation in Azure Container Apps.](#limitations)                                     |
| [**State management**][dapr-statemgmt]                | GA | Provides state management capabilities for transactions and CRUD operations.                                                                                    |
| [**Pub/sub**][dapr-pubsub]                            | GA | Allows publisher and subscriber container apps to intercommunicate via an intermediary message broker. You can also create declarative subscriptions to a topic using an external component JSON file. [Learn more about the declarative pub/sub API.][declarative-pubsub]                                                         |
| [**Bindings**][dapr-bindings]                         | GA | Trigger your applications based on events                                                                                                                       |
| [**Actors**][dapr-actors]                             | GA | Dapr actors are message-driven, single-threaded, units of work designed to quickly scale. For example, in burst-heavy workload situations. |
| [**Observability**](./observability.md)               | GA | Send tracing information to an Application Insights backend.                                                                                                    |
| [**Secrets**][dapr-secrets]                           | GA | Access secrets from your application code or reference secure values in your Dapr components.                                                                   |
| [**Configuration**][dapr-config]                           | GA | Retrieve and subscribe to application configuration items for supported configuration stores.                                                                   |

[!INCLUDE [component-support](../../includes/dapr-in-azure/dapr-support-policy.md)]

### Tooling

Azure Container Apps ensures compatibility with Dapr open source tooling, such as SDKs and the CLI. 

## Limitations

- **Dapr Configuration spec**: Any capabilities that require use of the Dapr configuration spec.
- **Any Dapr sidecar annotations not listed in [the Dapr enablement guide][dapr-enable]**
- **APIs and components support**: Only the Dapr APIs and components [listed as GA, Tier 1, or Tier 2 in this article](#supported-dapr-apis-components-and-tooling) are supported in Azure Container Apps.
- **Actor reminders**: Require a minReplicas of 1+ to ensure reminders is always active and fires correctly.
- **Jobs**: Dapr isn't supported for jobs.

## Next Steps

- [Enable Dapr in your container app.][dapr-enable]
- [Learn how Dapr components work in Azure Container Apps.][dapr-components]

<!-- Links Internal -->

[dapr-faq]: ./faq.yml#are-alpha-dapr-apis-and-tier-2-components-supported-or-available-in-azure-container-apps-
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
[dapr-subscriptions]: https://docs.dapr.io/developing-applications/building-blocks/pubsub/subscription-methods/#declarative-subscriptions
[declarative-pubsub]: https://docs.dapr.io/developing-applications/building-blocks/pubsub/pubsub-overview/#pubsub-api