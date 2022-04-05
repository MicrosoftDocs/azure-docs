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

When building a microservices or distributed application, you may encounter common patterns and challenges, like how you: 

- Integrate external systems with your application.
- Create applications that reliably send events between services.
- Handle secure resilient communication between services.
- Discover other services and call methods on them.

For example, you may want to apply the pub/sub pattern to handle distributed communication without implementing resource-specific SDKs or libraries in your Container App.  

Thanks to Distributed Application Runtime ([Dapr][dapr-concepts]), you can simply plug the Dapr HTTP or gRPC APIs you need into your application. Dapr abstracts away typical complexities and performs the heavy lifting for you, while adhering to industry best practices.

## How Dapr works in Container Apps

Dapr is a fully managed, incrementally adoptable set of HTTP or gRPC APIs that you can plug into your Container App. Dapr exposes these APIs, or building blocks, to your Container App as a sidecar. 

Dapr's portable building blocks are built on best practice industry standards, that:

- Seamlessly fit with your preferred language or framework.
- You can add to or remove from your Container App, based on your needs.

### Dapr building blocks available to Container Apps

:::image type="content" source="media/dapr-overview/building_blocks.png" alt-text="Visualization of Dapr building blocks":::

| Building block | Description |
| -------------- | ----------- |
| [**Service-to-service invocation**][dapr-serviceinvo] | Provides mTLS authentication and encryption, resiliency, service discovery, and more. |
| [**State management**][dapr-statemgmt] | Provides state management capabilities for: <ul><li>CRUD operations</li><li>Transactions</li><li>Configuration of multiple, named, state store components per application.</li></ul> |
| [**Pub/sub**][dapr-pubsub] | Allows publisher and subscriber container apps to intercommunicate via an intermediary message broker. _[Known limitations.](#limitations)_ |
| [**Bindings**][dapr-bindings] | Trigger your application with incoming or outgoing events, without SDK or library dependencies. |
| [**Actors**][dapr-actors] | Dapr actors apply the scalability and reliability that the underlying platform provides. |
| **Observability** | Pass in a Dapr instrumentation key, which will send tracing information to an Application Insights backend. _[Known limitations.](#limitations)_ |

### Dapr settings in Container Apps

#### Environment-level

**Dapr components**

Dapr components are pluggable modules that:

- Allow you to use the individual Dapr building block APIs.
- Can be easily swapped out at the environment level of your container app.

With components, Dapr communicates with your container apps. Based on your needs, you can "plug in" certain Dapr component types like state stores, service invocation, pub/sub brokers, and more. 

# [YAML](#tab/yaml)

yaml

# [Bicep](#tab/bicep)

bicep

# [ARM](#tab/arm)

ARM

---

> [!NOTE]
> Since Dapr components and settings aren't revisionable, all running instances of a revision share the same set of Dapr components. 

**Dapr scopes**

By default, the Dapr component will make itself available to all container apps in your environment. To maintain application speed and efficiency, we recommend adding application scopes to the Dapr component. 

Scope the Dapr component to a particular container app by adding the `scope` array to your component definition. 

#### Application-level

**Dapr settings**

Define Dapr sidecars or control plane settings for your container app using a YAML file, bicep, or ARM template. With these settings, you:

- Enable Dapr on the app.
- Scope the `app-id`, the `app-protocol`, and the `app-port` to the app.

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

### Current supported Dapr version

Currently, Azure Container Apps supports Dapr version 1.4.2. 

Version upgrades are handled transparently by the Container Apps platform. You can find the current version via the Azure portal and the CLI. See [known limitations](#limitations) around versioning.

<!-- command -->

## Limitations

- **Versions**  
   Version upgrades currently don't guarantee full support for all Dapr features in a given version.  
- **Secrets**  
   While Azure Container Apps currently doesn't support Dapr secrets, you can provide secrets to your components using the [Container Apps secret mechanism][aca-secrets].  
- **Configuration CRD**  
   While we expose the ability for customers to use Dapr components, Container Apps doesn't currently expose Dapr configuration CRD.  
- **Observability**  
   While we don't currently expose the ability for you to customize your tracing backend, you are able to use Application Insights as your tracing backend.  
- **Pub/sub**  
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
