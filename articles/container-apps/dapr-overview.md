---
title: Microservice APIs powered by Dapr
description: Learn more about using Dapr on your Azure Container App service to develop applications.
ms.author: hannahhunter
author: hhunter-ms
ms.service: container-apps
ms.custom: build-2023
ms.topic: conceptual
ms.date: 04/08/2024
---

# Microservice APIs powered by Dapr

Azure Container Apps provides serverless and versionless APIs powered by [Distributed Application Runtime (Dapr)][dapr-concepts] that run as a sidecar process that helps you write and implement simple, portable, resilient, and secured microservices. Dapr works together with Azure Container Apps as an abstraction layer to provide a low-maintenance, serverless, and scalable platform. [Enabling Dapr on your container app][dapr-enable] creates a secondary process alongside your application code that simplifies application intercommunication with Dapr via HTTP or gRPC.

## Versionless Dapr in Azure Container Apps

Previously, Dapr worked as an extension in Azure Container Apps, mirroring Dapr open-source release cadence. Unfortunately, some APIs, features, and code enhancements offered in each open-source release bring in breaking changes to customer environments. 

In an effort to meld smoothly with Azure Container Apps, Dapr now provides _versionless_ APIs. By taking a step back from the rapid release cadence of Dapr open-source, Dapr in Azure can now offer a selection of fully-managed Dapr APIs, components, and features, catered specifically to an Azure Container Apps scenario. 

Simply enable and configure Dapr as usual in your container app environment and rely on up-to-date, fully-managed microservice APIs. 

## How the microservices APIs work with your container app

Configure microservices APIs for your container apps environment with a [Dapr-enabled container app][dapr-enable], a [Dapr component configured for your solution][dapr-components], and a Dapr sidecar invoking communication between them. The following diagram demonstrates these core concepts, using the pub/sub API as an example.

:::image type="content" source="media/dapr-overview/dapr-in-aca.png" alt-text="Diagram demonstrating Dapr pub/sub and how it works in Container Apps.":::

| Label | Dapr settings                    | Description                                                                                                                                                                                                                                                                       |
| ----- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | Container Apps with Dapr enabled | Dapr is enabled at the container app level by configuring a set of Dapr arguments. These values apply to all revisions of a given container app when running in multiple revisions mode.                                                                                           |
| 2     | Dapr                             | The fully managed Dapr APIs are exposed to each container app through a Dapr sidecar. The Dapr APIs can be invoked from your container app via HTTP or gRPC. The Dapr sidecar runs on HTTP port 3500 and gRPC port 50001.                                                         |
| 3     | Dapr component configuration     | Dapr uses a modular design where functionality is delivered as a component. Dapr components can be shared across multiple container apps. The Dapr app identifiers provided in the scopes array dictate which dapr-enabled container apps load a given component at runtime. |

## Supported microservices APIs

Azure Container Apps offers the following APIs powered by Dapr. 

:::image type="content" source="media/dapr-overview/azure-container-apps-dapr-building-blocks.png" alt-text="Diagram that shows Dapr APIs.":::

| API                                              | Description                                                                                                                                                     |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [**Service-to-service invocation**][dapr-serviceinvo] | Discover services and perform reliable, direct service-to-service calls with automatic mTLS authentication and encryption.                                     |
| [**State management**][dapr-statemgmt]                | Provides state management capabilities for transactions and CRUD operations.                                                                                    |
| [**Pub/sub**][dapr-pubsub]                            | Allows publisher and subscriber container apps to intercommunicate via an intermediary message broker. You can also create [declarative subscriptions][dapr-subscriptions] to a topic using an external component JSON file. [Learn more about the declarative pub/sub API.][declarative-pubsub]                                                         |
| [**Bindings**][dapr-bindings]                         | Trigger your applications based on events                                                                                                                       |
| [**Actors**][dapr-actors]                             | Dapr actors are message-driven, single-threaded, units of work designed to quickly scale. For example, in burst-heavy workload situations. |
| [**Observability**](./observability.md)               | Send tracing information to an Application Insights backend.                                                                                                    |
| [**Secrets**][dapr-secrets]                           | Access secrets from your application code or reference secure values in your Dapr components.                                                                   |
| [**Configuration**][dapr-config]                           | Retrieve and subscribe to application configuration items for supported configuration stores.                                                                   |


## Next Steps

- [Enable Dapr in your container app.][dapr-enable]
- [Learn how Dapr components work in Azure Container Apps.][dapr-components]

<!-- Links Internal -->

[dapr-faq]: ./faq.yml#dapr
[dapr-enable]: ./enable-dapr.md
[dapr-components]: ./dapr-components.md
[declarative-pubsub]: /rest/api/containerapps/dapr-subscriptions/create-or-update

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
