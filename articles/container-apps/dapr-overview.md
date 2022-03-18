---
title: Dapr integration with Azure Container Apps (preview)
description: Learn more about using Dapr on your Azure Container App service to develop applications.
ms.author: hannahhunter
author: hhunter-ms
ms.service: container-apps
ms.topic: conceptual
ms.date: 03/10/2022
---

# Dapr integration with Azure Container Apps

Distributed Application Runtime ([Dapr][dapr-concepts]) is a portable, efficient, event-driven runtime that consists of open, independent HTTP or gRPC APIs. Dapr exposes these APIs as a sidecar, running as a separate process alongside your application.

When building a microservices or distributed application with Container Apps, you can use Dapr APIs to accomplish typical patterns or challenges. For example, you can implement Dapr's service-to-service invocation or pub/sub messaging APIs to allow intercommunication in your distributed application, without modifying your application code.  

Thanks to Dapr's portability, you don't have to be an expert in implementing Dapr SDKs or libraries with your container app. Dapr abstracts away those complexities and performs the heavy lifting for you, while adhering to industry best practices.

## Current supported Dapr version

Currently, Azure Container Apps supports Dapr version 1.4.2. 

Version upgrades will happen transparently and autonomously, but don't guarantee full support for all Dapr features in a given version. You can find the current version via the Azure portal and the CLI. 

<!-- command -->

## How Dapr works in Container Apps

Dapr is an incrementally adoptable set of APIs, or building blocks, that makes it easy for you to write distributed applications. With Dapr for Container Apps, you can enable specific container apps to use Dapr's building blocks.

### Dapr building blocks available to Container Apps

#### Service-to-service invocation

Dapr addresses challenges around encryption, resiliency, service discovery, and more with their service invocation building block.

:::image type="content" source="./media/dapr-overview/service-invocation.png" alt-text="Service-to-service invocation diagram" :::

| Capability | Description |
| ---------- | ----------- |
| mTLS authentication | Calls between Dapr sidecars are secured with an "on-by-default" mTLS on hosted platforms, including automatic certificate rollover, via the Dapr Sentry service. |
| Resiliency | Dapr service invocation performs automatic retries with back-off time periods with network and authentication errors. |
| Service discovery | Dapr uses pluggable name resolution components to enable service discovery and service invocation.
 |

#### State management

Dapr integrates with existing databases to provide apps with state management capabilities for:

- CRUD operations
- Transactions 
- Configuration of multiple, named, state store components per application. 

:::image type="content" source="./media/dapr-overview/state-management.png" alt-text="State management diagram" :::

#### Pub/sub broker

Dapr's Pub/sub pattern allows publisher and subscriber microservices to communicate with each other while remaining decoupled. A message broker mediates between an input channel to an output channel for all subscribers interested. 

Currently, Container Apps supports Dapr's programmatic subscription model, not Dapr's configuration object.

:::image type="content" source="./media/dapr-overview/pubsub.png" alt-text="Pub/sub broker diagram" :::

#### Observability

Dapr's sidecar architecture enables built-in observability features. In Container Apps, we are opinionated about the configuration for tracing. When creating a Container Apps environment, you can pass in a Dapr instrumentation key, which will send tracing information to Application Insights. 

We don't currently expose the ability for you to customize your tracing backend.

:::image type="content" source="./media/dapr-overview/observability.png" alt-text="Observability diagram" :::

#### Bindings

With Dapr's input and output bindings, you can trigger your application with incoming or outgoing events, without taking dependencies from SDKs or libraries.

#### Actors

Write your Dapr actors according to the Actor model while Dapr applies the scalability and reliability that the underlying platform provides.


### Dapr core concepts

| Dapr concept | How Dapr concept works in Container Apps |
| ------------ | ---------------------------------------- |
| [Component](#dapr-components) | Pluggable modules that: <ul><li>Allow you to use the individual Dapr building block APIs</li><li>Can be easily swapped out at the environment level of your container app.</li></ul> |
| [Scopes](#dapr-scopes) | Application limitations added to a component, granting the component access only to the application specified by their `app-id`. |
| [Configurations](#dapr-configuration) | A YAML file, bicep, or ARM template declaring Dapr sidecars or the Dapr control plane settings. |

#### Dapr components

Dapr components are scoped to the environment level. You can define component types like state stores, name resolutions, pub/sub brokers, secrets, scopes, and more based on your needs. Building blocks can use any combination of components.

> [!NOTE]
> We expose the ability for customers to use Dapr components but don't currently expose Dapr configuration CRD.

# [YAML](#tab/yaml)

yaml

# [Bicep](#tab/bicep)

bicep

# [ARM](#tab/arm)

ARM

---

#### Dapr scopes

By default, the Dapr component will make itself available to all container apps in your environment. To maintain application speed and efficiency, we recommend adding application scopes to the Dapr component. Enable Dapr on your container apps by scoping to the `app-id` of the application you'd like the Dapr component to access. 

#### Dapr configurations

Dapr configurations are settings and policies that live at the container app level. Since Dapr settings are considered application-scope changes, new revisions won't be created when you change Dapr settings and components. You'll trigger an automatic restart of all container app revisions will take place to align with changes if:
- Multi-revision mode is enabled for your container apps.
- Changes are made to Dapr settings. 

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

While Azure Container Apps currently doesn't support Dapr secrets, you can provide secrets to your components using the [Container Apps secret mechanism](manage-secrets.md). 

## Next Steps

Now that you've learned about Dapr and some of the challenges it solves, try [Deploying a Dapr application to Azure Container Apps using the Azure CLI][dapr-quickstart] or [Azure Resource Manager][dapr-arm-quickstart].

<!-- Links Internal -->
[dapr-quickstart]: ./microservices-dapr.md
[dapr-arm-quickstart]: ./microservices-dapr-azure-resource-manager.md

<!-- Links External -->
[dapr-concepts]: https://docs.dapr.io/concepts/overview/
