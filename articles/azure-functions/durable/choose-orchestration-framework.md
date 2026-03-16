---
title: Choose your hosting model
description: Learn how your hosting platform determines whether to use Durable Functions for Azure Functions or the standalone Durable Task SDKs for self-hosted scenarios.
author: cgillum
ms.author: cgillum
ms.reviewer: hannahhunter
ms.date: 02/14/2026
ms.topic: concept-article
ms.service: azure-functions
ms.subservice: durable
titleSuffix: Durable Task
#Customer intent: As a developer, I want to understand which Durable Task hosting model to use based on my hosting platform.
---

# Choose your hosting model

As described in [What is Durable Task?](what-is-durable-task.md), Durable Task supports two hosting models: 
- **Azure Functions** (via [Durable Functions](./durable-functions-overview.md))
- **Self-hosted** (via [the standalone Durable Task SDKs](./durable-task-scheduler/durable-task-overview.md)). 

Both hosting models provide the same core durable execution capabilities (orchestrations, activities, timers, external events, and more) but differ in how your application is hosted, scaled, and deployed.

In general, where your application runs determines which hosting model you use. If you're building on Azure Functions, you use Durable Functions. If you're building on any other compute platform, you use the standalone Durable Task SDKs.

## Choosing based on hosting platform

If you already know your application's hosting platform, the following table can help you determine which hosting model to use:

| Hosting platform | Hosting model |
| - | - |
| **Azure Functions** (Consumption, Flex Consumption, Premium) | Durable Functions |
| **Azure Container Apps** (with Azure Functions runtime) | Either |
| **Azure App Service** (with Azure Functions runtime) | Either |
| **Azure Kubernetes Service (AKS)** | Standalone Durable Task SDKs |
| **Virtual machines or on-premises** | Standalone Durable Task SDKs |

> [!NOTE]
> Azure App Service and Azure Container Apps can both host the Azure Functions runtime, either through [fully managed Azure Functions integration](../functions-scale.md#overview-of-plans) or by deploying the Functions runtime directly. Thus, both platforms support either hosting model. For more information on Azure Functions hosting models, see [Azure Functions hosting plans](../functions-scale.md).

## Comparing the hosting models

The following table summarizes the key differences between the two hosting models:

| | Durable Functions (Azure Functions) | Standalone Durable Task SDKs (self-hosted) |
| - | - | - |
| **Hosting** | Azure Functions (Consumption, Flex Consumption, Premium), App Service, and Container Apps (with Functions runtime) | Any platform: Azure Container Apps, AKS, App Service, VMs, on-premises |
| **Scaling** | Automatic, managed by the Azure Functions managed scale infrastructure | You manage scaling yourself, or use platform-native autoscaling (for example, [KEDA](https://keda.sh/) on Kubernetes) |
| **Triggers** | Built-in support for HTTP, Queue, Timer, Event Grid, and [other Azure Functions triggers](../functions-triggers-bindings.md) | You define your own entry points (for example, HTTP endpoints, message consumers, etc.) |
| **State storage** | [Durable Task Scheduler](./durable-task-scheduler/durable-task-scheduler.md) (recommended), [Azure Storage](./durable-functions-azure-storage-provider.md), [MSSQL](./durable-functions-storage-providers.md#mssql), [Netherite](./durable-functions-storage-providers.md#netherite) | [Durable Task Scheduler](./durable-task-scheduler/durable-task-scheduler.md) |
| **Languages** | .NET (C#/F#), JavaScript/TypeScript, Python, Java, PowerShell | .NET (C#/F#), JavaScript/TypeScript, Python, Java |
| **Monitoring** | Built-in integration with Azure portal, Application Insights | You set up your own monitoring solution (for example, Azure Monitor, Prometheus, or Grafana) |

> [!NOTE]
> **Cold start** occurs when a function app starts after being idle. [Premium](../functions-premium-plan.md) and [Dedicated](../dedicated-plan.md) hosting plans keep instances warm to reduce cold start latency. 
>
> The [Flex Consumption](../flex-consumption-plan.md) hosting plan offers [an "always read instances" concept](../flex-consumption-plan.md#always-ready-instances) as cold start mitigation.
> 
> Learn more about [Azure Functions hosting models](../functions-scale.md).

### Built-in HTTP APIs

Azure Functions provides HTTP endpoints for your functions app, which the Durable Functions extension leverages to provide built-in support for instance management over HTTP. 

When using the Durable Task SDKs, you need to implement your own HTTP endpoints depending on your hosting compute.

| Feature | Durable Functions | Durable Task SDKs |
| ------- | ----------------- | ----------------- |
| **Management HTTP APIs** | ✅ Built-in | ❌ Implement your own |
| **Automatic status URLs** | ✅ Built-in | ❌ Implement your own |

#### Durable Functions HTTP features

Durable Functions automatically exposes HTTP endpoints for starting orchestrations, querying status, raising events, and terminating instances. These APIs follow the async HTTP polling pattern, making it easy to integrate with external systems.

> [!NOTE]
> Durable Functions supports using `DurableTaskClient` class directly if you would prefer it to using the built-in HTTP APIs.

Learn more: [HTTP features in Durable Functions](durable-functions-http-features.md) | [HTTP API reference](durable-functions-http-api.md)

#### Durable Task SDKs management

With the Durable Task SDKs, you use the `DurableTaskClient` class directly to manage orchestration instances. If you need HTTP endpoints, you implement them yourself using your preferred web framework.

Learn more: [Manage orchestration instances](durable-functions-instance-management.md)

### Storage backends

Durable Functions supports multiple storage backends, while the Durable Task SDKs exclusively use the Durable Task Scheduler.

> [!TIP]
> The **Durable Task Scheduler** is a fully managed Azure service that handles orchestration state persistence and execution. It's provisioned as a separate Azure resource with its own [pricing](./durable-task-scheduler/durable-task-scheduler-billing.md). It's the recommended backend for Durable Functions and the only supported backend for the Durable Task SDKs.

| Storage provider | Durable Functions | Durable Task SDKs |
| ---------------- | ----------------- | ----------------- |
| **Durable Task Scheduler** | ✅ Recommended | ✅ Required |
| **Azure Storage** | ✅ Supported | ❌ Not supported |
| **Microsoft SQL Server** | ✅ Supported | ❌ Not supported |
| **Netherite** | ⚠️ Supported, but being retired | ❌ Not supported |

Learn more: [Storage providers](durable-functions-storage-providers.md)

### Task hub configuration

Durable Functions configures task hubs in the `host.json` file. The Durable Task SDKs configure task hubs in code and environment variables (connection string/endpoint).

Learn more: [Task hubs](durable-functions-task-hubs.md)

### Diagnostics and versioning

| Feature | Durable Functions | Durable Task SDKs |
| ------- | ----------------- | ----------------- |
| **Durable Task Scheduler dashboard** | ✅ Yes | ✅ Yes |
| **Application Insights** | ✅ Built-in | Manual setup |
| **Zero-downtime deployment** | ✅ Functions slots | Platform-specific |

Learn more: [Diagnostics](durable-functions-diagnostics.md) | [Versioning](durable-functions-versioning.md)

Both hosting models support the **[Durable Task Scheduler](./durable-task-scheduler/durable-task-scheduler.md)** as a state storage backend, which provides both state storage and extra monitoring capabilities. Durable Functions also supports several bring-your-own (BYO) storage options for scenarios that require them. For more information, see [Storage providers](durable-functions-storage-providers.md).

## More considerations

When choosing between the two hosting models, consider the following factors:

| Choose Durable Functions if... | Choose standalone Durable Task SDKs if... |
| - | - |
| You want built-in Azure Functions triggers (HTTP, Queue, Timer, etc.). | You want full control over your container and its entry points. |
| You're already familiar with the Azure Functions hosting model. | You prefer a lightweight SDK without the Azure Functions runtime overhead. |
| You want Azure portal integration for function management. | You want the same code to be portable across container platforms (AKS, App Service, etc.). |
| You need to choose from [multiple storage backends](durable-functions-storage-providers.md). | You have existing non-Functions application code to integrate with. |
| You need **serverless, event-driven apps** that scale to zero. | You need **always-on, low-latency workloads** without cold start delays. |
| You want **pay-per-execution pricing** with the consumption plan. | You need **high-throughput scenarios** optimized for batch processing. |
| You need **quick prototyping** with declarative triggers and bindings. | You have **existing containerized or Kubernetes applications**. |

## Migration

If you're already using Durable Functions and want to move to a container-based deployment or take advantage of the Durable Task SDKs' hosting flexibility, migration is straightforward. The orchestration code is very similar between both frameworks.

For detailed migration guidance, see [Migrate from Durable Functions to the Durable Task SDKs](durable-functions-migrate.md).

### Durable Task Framework (DTFx)

The [Durable Task Framework](https://github.com/Azure/durabletask) (DTFx) is a community-maintained, open-source .NET library for durable orchestration. It provides similar orchestration primitives to the modern Durable Task SDKs and continues to be actively used in production by many teams, including within Microsoft. Notably, DTFx is used internally as a dependency of Azure Durable Functions, which is one of the reasons it continues to be maintained. However, it doesn't come with official Microsoft support—bugs and feature requests are addressed on a best-effort basis. It also requires you to manage hosting and operational infrastructure yourself.

If you're starting a new project or need official Microsoft support, we recommend using the modern Durable Task SDKs or Durable Functions instead.

## Next steps

Get started with the framework you chose:

> [!div class="nextstepaction"]
> [Durable Functions overview](durable-functions-overview.md)

> [!div class="nextstepaction"]
> [Durable Task SDKs overview](./durable-task-scheduler/durable-task-overview.md)

Then, learn more about the [Durable Task Scheduler backend provider](durable-task-scheduler/durable-task-scheduler.md).