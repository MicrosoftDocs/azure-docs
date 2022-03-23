---
title: Dapr integration with Azure Container Apps (preview)
description: Learn more about using Dapr on your Azure Container App service to develop applications.
ms.author: hannahhunter
author: hhunter-ms
ms.service: container-apps
ms.topic: conceptual
ms.date: 03/21/2022
---

# Dapr integration with Azure Container Apps (preview)

Distributed Application Runtime ([Dapr][dapr-concepts]) is an event-driven runtime that consists of open, independent HTTP or gRPC APIs. Dapr exposes these APIs as a sidecar, running as a separate process alongside your application.

When building a microservices or distributed application with Container Apps, you can use Dapr APIs to accomplish common patterns you find in a distributed application. For example, you can implement Dapr's service-to-service invocation or pub/sub messaging APIs to allow intercommunication in your distributed application, without modifying your application code.  

Thanks to Dapr abstraction, you don't have to be an expert in implementing Dapr SDKs or libraries with your container app. Dapr abstracts away those complexities and performs the heavy lifting for you, while adhering to industry best practices.

## Current supported Dapr version

Currently, Azure Container Apps supports Dapr version 1.4.2. 

Version upgrades will happen transparently and autonomously, but don't guarantee full support for all Dapr features in a given version. You can find the current version via the Azure portal and the CLI. 

<!-- command -->

## How Dapr works in Container Apps

Dapr is an incrementally adoptable set of APIs, or building blocks, that makes it easy for you to write distributed applications. With Dapr for Container Apps, you can enable specific container apps to use Dapr's building blocks.

### Dapr building blocks available to Container Apps

| Building block | Supported in Container Apps | Description |
| -------------- | --------------------------- | ----------- |
| [**Service-to-service invocation**][dapr-serviceinvo] | Yes | Dapr addresses challenges around mTLS authentication and encryption, resiliency, service discovery, and more with their service invocation building block. |
| [**State management**][dapr-statemgmt] | Yes | Dapr integrates with existing databases to provide apps with state management capabilities for: <ul><li>CRUD operations</li><li>Transactions</li><li>Configuration of multiple, named, state store components per application.</li></ul> |
| [**Pub/sub broker**][dapr-pubsub] | Yes | Dapr's Pub/sub pattern allows publisher and subscriber microservices to communicate with each other while remaining decoupled, thanks to an intermediary message broker. <br> Currently, Container Apps supports Dapr's *programmatic subscription model*, not Dapr's configuration object. |
| [**Bindings**][dapr-bindings] | Yes | With Dapr's input and output bindings, you can trigger your application with incoming or outgoing events, without taking dependencies from SDKs or libraries. |
| [**Actors**][dapr-actors] | Yes | Write your Dapr actors according to the Actor model while Dapr applies the scalability and reliability that the underlying platform provides. |
| **Observability** | Yes | In Container Apps, we are opinionated about the configuration for tracing. When creating a Container Apps environment, you can pass in a Dapr instrumentation key, which will send tracing information to Application Insights. <br> We don't currently expose the ability for you to customize your tracing backend. |

### Dapr core concepts

| Dapr concept | How Dapr concept works in Container Apps |
| ------------ | ---------------------------------------- |
| [Component](#dapr-components) | Pluggable modules that: <ul><li>Allow you to use the individual Dapr building block APIs</li><li>Can be easily swapped out at the environment level of your container app.</li></ul> |
| [Scopes](#dapr-scopes) | Application limitations added to a component, granting the component access only to the application specified by their `app-id`. |
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

**Secrets**
While Azure Container Apps currently doesn't support Dapr secrets, you can provide secrets to your components using the [Container Apps secret mechanism][aca-secrets]. 

**Configuration CRD**
We expose the ability for customers to use Dapr components but don't currently expose Dapr configuration CRD.


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
