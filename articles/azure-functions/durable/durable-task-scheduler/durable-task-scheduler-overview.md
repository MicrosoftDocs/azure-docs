---
title: Durable execution using the Durable Task Scheduler (preview)
description: Learn about the characteristics of the Durable Task Scheduler
ms.topic: conceptual
ms.date: 01/24/2025
---

# Durable execution using the Durable Task Scheduler (preview)

Using Durable Task Scheduler, you can author your orchestrations as code using the [Durable Functions framework](#durable-functions-in-azure-functions) or [Durable Task SDKs](#the-durable-task-sdks-in-other-azure-services). By eliminating the overhead of managing your own backend storage, Durable Task Scheduler makes tasks such as maintaining and purging orchestration data no longer the responsibility of development teams.

Connect your workloads to the Durable Task Scheduler, which:
- Handles orchestrations and task scheduling
- Persists orchestration state
- Manages orchestration and task failures
- Load balances orchestration execution at scale
- Provides an easy debugging experience for stuck orchestrations via [the Durable Task Scheduler dashboard](./durable-task-scheduler-dashboard.md)

The choice of developer orchestration framework depends on where your applications are hosted. You can use:
- [Durable Functions in Azure Functions](#durable-functions-in-azure-functions)
- [The Durable Task SDKs in Azure Container Apps, Azure Kubernetes Service, App Service, etc.](#the-durable-task-sdks-in-other-azure-services)

:::image type="content" source="/media/durable-task-scheduler-overview/dts-in-all-computes.png" alt-text="Diagram demonstrating Durable Task Scheduler spanning Azure Computes.":::

### Durable Functions in Azure Functions

[Durable Functions](../durable-functions-overview.md) is an extension of Azure Functions that lets you write stateful functions in a serverless compute environment. With Durable Functions, you define:
- Stateful operations (durable executions) by writing orchestrations 
- Stateful entities using the Azure Functions programming model 

Durable Functions works with all Azure Functions programming languages and supports [multiple application patterns](../durable-functions-overview.md#application-patterns).

Durable Functions uses a backend component, which refers to the storage provider. The Durable Task Scheduler storage provider:
- Schedule orchestrations and tasks
- Persist the state of orchestrations and entities. 

Learn more about the [Durable Task Scheduler storage provider](../durable-functions-storage-providers.md#dts)

###  The Durable Task SDKs in other Azure Services 

In addition to Azure Functions, the Durable Task Scheduler introduces a managed workflow engine and storage provider that can be leveraged from other Azure services, such as:
- Azure Container Apps (ACA)
- Azure Kubernetes Service (AKS)
- Azure App Service
- Virtual Machines and other computes

You can write your orchestrations as code using the Durable Task SDKs and connect your workloads directly to the Durable Task Scheduler for scheduling and persistence of orchestration state. 

The Durable Task SDKs are available in multiple programming languages:

- [.NET](https://github.com/microsoft/durabletask-dotnet)
- [Python](https://github.com/microsoft/durabletask-python)
- [JavaScript](https://github.com/microsoft/durabletask-js)
- [Java](https://github.com/microsoft/durabletask-java)

## Limitations

- **Durable Entities:** Currently, Durable Task Scheduler does not have support for Durable Entities.
- **Auto-scaling:** Currently, auto-scaling is not supported when hosted on Azure Container Apps.