---
title: Microservice APIs powered by Dapr
description: Learn more about using Dapr on your Azure Container App service to develop applications.
ms.author: hannahhunter
author: hhunter-ms
ms.service: azure-container-apps
ms.custom: build-2023
ms.topic: conceptual
ms.date: 01/08/2025
---

# Microservice APIs powered by Dapr

Azure Container Apps provides APIs powered by [Distributed Application Runtime (Dapr)][dapr-concepts] that help you write and implement simple, portable, resilient, and secured microservices. Dapr works together with Azure Container Apps as an abstraction layer to provide a low-maintenance and scalable platform. Azure Container Apps offers a selection of fully managed Dapr APIs, components, and features, catered specifically to microservice scenarios. Simply [enable and configure Dapr][dapr-enable] as usual in your container app environment.

## How the microservices APIs work with your container app

Configure microservices APIs for your container apps environment with a [Dapr-enabled container app][dapr-enable], a [Dapr component configured for your solution][dapr-components], and a Dapr sidecar invoking communication between them. The following diagram demonstrates these core concepts, using the pub/sub API as an example.

:::image type="content" source="media/dapr-overview/dapr-in-aca.png" alt-text="Diagram demonstrating Dapr pub/sub and how it works in Container Apps.":::

| Label | Dapr settings                    | Description                                                                                                                                                                                                                                                                       |
| ----- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | Container Apps with Dapr enabled | Dapr is enabled at the container app level by configuring a set of Dapr arguments. These values apply to all revisions of a given container app when running in multiple revisions mode.                                                                                           |
| 2     | Dapr                             | The fully managed Dapr APIs are exposed to each container app through a Dapr sidecar. The Dapr APIs can be invoked from your container app via HTTP or gRPC. The Dapr sidecar runs on HTTP port 3500 and gRPC port 50001.                                                         |
| 3     | Dapr component configuration     | Dapr uses a modular design where functionality is delivered as a component. Dapr components can be shared across multiple container apps. The Dapr app identifiers provided in the scopes array dictate which dapr-enabled container apps load a given component at runtime. |

## Versioning

Dapr versions in Azure Container Apps include:
- A semantic versioning prefix, such as `1.13.6`, which denotes compatibility with the corresponding OSS Dapr runtime version APIs and related tools like SDKs, CLI, etc.
- A `-msft.<number>` suffix, which denotes incorporating Azure-specific customizations for enhanced security and production readiness.

The complete version format for Dapr in Azure Container Apps can look something like `1.13.6-msft.1`.

> [!NOTE]
> The `<number>` in the suffix may not always increment sequentially. For example, version `1.13.6-msft.3` may skip `1.13.6-msft.2`. 

## Supported Dapr APIs, components, and tooling

### Managed APIs

Azure Container Apps offers managed generally available Dapr APIs (building block APIs and operational APIs). These APIs are fully managed and supported for use in production environments.

To learn more about using _alpha_ Dapr APIs and features, [see the Dapr FAQ][dapr-faq].

:::image type="content" source="media/dapr-overview/azure-container-apps-dapr-building-blocks.png" lightbox="media/dapr-overview/azure-container-apps-dapr-building-blocks.png" alt-text="Diagram that shows Dapr APIs.":::

#### Building block APIs

| Building block API                                              | Status | Description                                                                                                                                                     |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [**Service-to-service invocation**][dapr-serviceinvo] | GA | Discover services and perform reliable, direct service-to-service calls with automatic mTLS authentication and encryption. [See known limitations for Dapr service invocation in Azure Container Apps.](#limitations)                                     |
| [**State management**][dapr-statemgmt]                | GA | Provides state management capabilities for transactions and CRUD operations.                                                                                    |
| [**Pub/sub**][dapr-pubsub]                            | GA | Allows publisher and subscriber container apps to intercommunicate via an intermediary message broker. You can also create declarative subscriptions to a topic using an external component JSON file. [Learn more about the declarative pub/sub API.][declarative-pubsub]                                                         |
| [**Bindings**][dapr-bindings]                         | GA | Trigger your applications based on events                                                                                                                       |
| [**Actors**][dapr-actors]                             | GA | Dapr actors are message-driven, single-threaded, units of work designed to quickly scale. For example, in burst-heavy workload situations. |
| [**Secrets**][dapr-secrets]                           | GA | Access secrets from your application code or reference secure values in your Dapr components.                                                                   |
| [**Configuration**][dapr-config]                           | GA | Retrieve and subscribe to application configuration items for supported configuration stores.                                                                   |

#### Operational APIs

| Operational API                                              | Status | Description                                                                                                                                                     |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [**Health**][dapr-health] | GA | Health check probes that monitor readiness or liveness of Dapr and initialization readiness of SDKs. The health API is only available for HTTP.                                     |
| [**Metadata**][dapr-metadata]                | GA | Returns information about the sidecar, allowing runtime discoverability.                                                                                    |


### Compatible SDKs

Dapr's latest client SDK packages are compatible with Azure Container Apps. You can use Dapr SDKs with any of the [supported, GA Dapr v1.12 runtime APIs](#managed-apis). 

> [!NOTE] 
> Currently, the Dapr server extensions, actor, and workflow SDK packages are not compatible with Azure Container Apps. [Learn more about all of the Dapr SDK packages.](https://docs.dapr.io/developing-applications/sdks/)

[!INCLUDE [component-support](~/reusable-content/ce-skilling/azure/includes/dapr-in-azure/dapr-support-policy.md)]

[Learn more about how to use the supported Dapr components in Azure Container Apps.][dapr-components]

### Tooling

Azure Container Apps ensures compatibility with Dapr open source tooling, such as SDKs and the CLI. 

## Limitations

- **Dapr Configuration spec**: Any capabilities that require use of the Dapr configuration spec.
- **Any Dapr sidecar annotations not listed in [the Dapr enablement guide][dapr-enable]**
- **APIs and components support**: Only the Dapr APIs and components [listed as GA, Tier 1, or Tier 2 in this article](#supported-dapr-apis-components-and-tooling) are supported in Azure Container Apps.
- **Actor reminders**: Require a minReplicas of 1+ to ensure reminders is always active and fires correctly.
- **Jobs**: Dapr isn't supported for jobs.

## Next steps

- Deploy Dapr using:
  - [Azure CLI](./microservices-dapr.md)
  - [ARM or Bicep templates](./microservices-dapr-azure-resource-manager.md)
- [Enable Dapr in an existing container app.][dapr-enable]

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
[dapr-health]: https://docs.dapr.io/reference/api/health_api/
[dapr-metadata]: https://docs.dapr.io/reference/api/metadata_api/