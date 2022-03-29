---
title: Dapr integration with Azure Container Apps (preview)
description: Learn more about using Dapr on your Azure Container App service to develop applications.
ms.author: hannahhunter
author: hhunter-ms
ms.service: container-apps
ms.topic: conceptual
ms.date: 03/29/2022
---

# Dapr integration with Azure Container Apps (preview)

When building a microservices or distributed application with Container Apps, you may encounter the following common patterns and challenges: 

- How do I integrate with external systems to which my application needs to react and respond?
- How do I create event-driven applications that reliably send events between services?
- How do I handle secure communication between services?
- How do I discover other services and call methods on them?
- How do I handle connection failures and build resiliency into my application?
- How do I write an application that runs in multiple environments without code changes?

Distributed Application Runtime ([Dapr][dapr-concepts]) is an incrementally adoptable HTTP or gRPC APIs that you can selectively plug into your Container App. Dapr exposes these APIs to your microservices or distributed Container App as a sidecar, addressing the above common challenges by providing:

- Building blocks built on best practice industry standards.
- Consistent, portable APIs that seamlessly fit with your preferred language or framework.
- Extensible and pluggable components that you can add to or remove from your Container App based on your needs.
- Platform-agnostic performance.
- Maintained open-source, community-driven updates, releases, and communications.

For example, you can implement Dapr's service-to-service invocation or pub/sub messaging APIs to allow secure intercommunication in your distributed application, without modifying your application code.  

Thanks to Dapr, you don't have to be an expert in implementing resource-specific SDKs or libraries into your Container App. Dapr abstracts away those complexities and performs the heavy lifting for you, while adhering to industry best practices.

### Current supported Dapr version

Currently, Azure Container Apps supports Dapr version 1.4.2. 

Version upgrades are handled transparently by the Container Apps platform. You can find the current version via the Azure portal and the CLI. See [known limitations](#limitations) around versioning.

<!-- command -->

## How Dapr works in Container Apps


### Dapr building blocks available to Container Apps

:::image type="content" source="media/dapr-overview/building_blocks.png" alt-text="Visualization of Dapr building blocks":::

| Building block | Description |
| -------------- | ----------- |
| [**Service-to-service invocation**][dapr-serviceinvo] | Provides mTLS authentication and encryption, resiliency, service discovery, and more. |
| [**State management**][dapr-statemgmt] | Provides state management capabilities for: <ul><li>CRUD operations</li><li>Transactions</li><li>Configuration of multiple, named, state store components per application.</li></ul> |
| [**Pub/sub**][dapr-pubsub] | Allows publisher and subscriber microservices to intercommunicate via an intermediary message broker. _[Known limitations.](#limitations)_ |
| [**Bindings**][dapr-bindings] | Trigger your application with incoming or outgoing events, without SDK or library dependencies. |
| [**Actors**][dapr-actors] | Dapr actors apply the scalability and reliability that the underlying platform provides. |
| **Observability** | Pass in a Dapr instrumentation key, which will send tracing information to an Application Insights backend. _[Known limitations.](#limitations)_ |

### Dapr core concepts in Container Apps

| Dapr concept | How Dapr concept works in Container Apps |
| ------------ | ---------------------------------------- |
| [Component](#dapr-components) | Pluggable modules that: <ul><li>Allow you to use the individual Dapr building block APIs</li><li>Can be easily swapped out at the environment level of your container app.</li></ul> |
| [Scopes](#dapr-scopes) | Application limitations added to a component. |
| [`app-id`](#app-id) | Unique identifier. |
| [Configurations](#dapr-configuration) | A YAML file, bicep, or ARM template declaring Dapr sidecars or the Dapr control plane settings. |

#### Dapr components

Dapr components allow Dapr to communicate with your container apps using building blocks. Based on your needs, you can "plug in" certain Dapr component types like state stores, service invocation, pub/sub brokers, and more. 

# [YAML](#tab/yaml)

yaml

# [Bicep](#tab/bicep)

bicep

# [ARM](#tab/arm)

ARM

---

#### Dapr scopes

By default, the Dapr component will make itself available to all container apps in your environment. To maintain application speed and efficiency, we recommend adding application scopes to the Dapr component. 

Scope the Dapr component to a particular container app by adding the `scope` array to your component definition. 

#### Dapr `app-id` setting


#### Dapr configuration

A container app has its own Dapr configuration, including:
- Enabling Dapr on the app.
- Scoping the `app-id`, the `app-protocol`, and the `app-port` to the app.

Since Dapr settings are considered application-scope changes, new revisions won't be created when you change Dapr settings. However, when changing a Dapr setting, you'll trigger an automatic restart of that container app instance and revisions.

> [!NOTE]
> Setting ACL policies on the Dapr sidecar configuration is currently not supported.

# [YAML](#tab/yaml)

yaml

# [Bicep](#tab/bicep)

bicep

# [ARM](#tab/arm)

ARM

---

### Deploying Dapr to single vs. multiple environments

Since Dapr components and settings aren't revisionable, all running instances of a revision share the same set of Dapr components. To run different Dapr components on multiple revisions of your container app, we recommend creating a new Dapr component scoped to the new revision's `app-id`. 

## Limitations

### Versions
Version upgrades currently don't guarantee full support for all Dapr features in a given version.

### Secrets
While Azure Container Apps currently doesn't support Dapr secrets, you can provide secrets to your components using the [Container Apps secret mechanism][aca-secrets]. 

### Configuration CRD
While we expose the ability for customers to use Dapr components, Container Apps doesn't currently expose Dapr configuration CRD.

### Observability
While we don't currently expose the ability for you to customize your tracing backend, you are able to use Application Insights as your tracing backend.

### Pub/Sub
Currently, Container Apps supports Dapr's programmatic subscription model, not Dapr's configuration object.


## Next Steps

Now that you've learned about Dapr and some of the challenges it solves, try [Deploying a Dapr application to Azure Container Apps using the Azure CLI][dapr-quickstart] or [Azure Resource Manager][dapr-arm-quickstart].

<!-- Links Internal -->
[dapr-quickstart]: ./microservices-dapr.md
[dapr-arm-quickstart]: ./microservices-dapr-azure-resource-manager.md
[aca-secrets]: ./manage-secrets.md

<!-- Links External -->
[dapr-concepts]: https://docs.dapr.io/concepts/overview/
[dapr-pubsub]: https://docs.dapr.io/developing-applications/building-blocks/pubsub/pubsub-overview
[dapr-statemgmt]: https://docs.dapr.io/developing-applications/building-blocks/state-management/state-management-overview/
[dapr-serviceinvo]: https://docs.dapr.io/developing-applications/building-blocks/service-invocation/service-invocation-overview/
[dapr-bindings]: https://docs.dapr.io/developing-applications/building-blocks/bindings/bindings-overview/
[dapr-actors]: https://docs.dapr.io/developing-applications/building-blocks/actors/actors-overview/
