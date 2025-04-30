---
title: Workflows in Azure Container Apps
description: Learn about your workflow options for Azure Container Apps.
services: container-apps, azure-functions
author: lilyjma
ms.service: azure-container-apps
ms.topic: overview
ms.date: 04/29/2025
ms.author: jiayma
ms.reviewer: cshoe, hannahhunter
---

# Workflows in Azure Container Apps

> [!NOTE]
> You might see workflows referred to as *orchestrations*, especially in the context of Durable Functions. To avoid confusion with container orchestrations, this article uses the term *workflows* instead. 

Workflows are multi-step operations that usually occur in a specific order or involve long-running tasks. Real-world scenarios requiring workflows include:
- Order processing
- AI agents
- Infrastructure management
- Data processing pipelines 

Events like temporary infrastructure failures or dependency downtime can often interrupt workflow execution. To prevent interruptions, you can use durable execution, which continues from the point of failure instead of restarting.

Azure provides two code-oriented workflow frameworks you can use to build apps that run on Azure Container Apps: 
- **Durable Task SDKs** (preview)
- **Durable Functions** 

These frameworks continuously checkpoint workflow state as the app runs and automatically handles retries to ensure durable execution. 

## Workflow frameworks for developers in Azure

The Durable Task SDKs and Durable Functions workflow frameworks are designed for developers and available in multiple programming languages. 

### Durable Task SDKs (preview)

The Durable Task SDKs are lightweight client SDKs that provide an unopinionated programming model for authoring workflows. They allow your app to connect to a workflow engine hosted in Azure called the [Durable Task Scheduler](../azure-functions/durable/durable-task-scheduler/durable-task-scheduler.md). 

To ensure durable execution, the Durable Task SDKs require a storage backend to persist workflow state as the app runs. The Durable Task Scheduler works as the backend for apps using the Durable Task SDKs. 

#### Quickstarts

Try out configuring the Durable Task SDKs for your container app using the following quickstarts.

| Quickstart | Description | 
| ---------- | ----------- |
| [Configure a Durable Task SDK in your application](../azure-functions/durable/durable-task-scheduler/quickstart-portable-durable-task-sdks.md) | Learn how to create workflows that use the fan-out/fan-in Durable Functions application pattern. Currently available with the .NET, Python, and Java Durable Task SDKs. |
| [Configure a Durable Task SDK in your container app][TODO] | Use the Azure Developer CLI to create Durable Task Scheduler resources and deploy them to Azure with two container apps running workflow tasks. Currently available with the .NET, Python, and Java Durable Task SDKs. |

### Durable Functions 

As a feature of Azure Functions, [Durable Functions](../azure-functions/durable/durable-functions-overview.md) inherits many of its characteristics as a code-oriented workflow framework offering in Azure. For example, with Durable Functions, you benefit from:
- Integrations with other Azure services through Azure Functions [triggers and bindings](../azure-functions/functions-triggers-bindings.md)
- Local development experience
- Serverless pricing model

> [!NOTE]
> Durable Functions with Durable Task Scheduler currently only runs in App Service and Elastic Premium SKUs. Until it's available in other SKUs (like Flex Consumption), you need to use the [Microsoft SQL backend](../azure-functions/durable/durable-functions-storage-providers.md#mssql) for state persistence when hosting a Durable Functions app in Azure Container Apps. 

## How to choose 

Applications built using either the Durable Task SDKs or Durable Functions can be hosted in Azure Container Apps. [Learn which framework works best for your scenario](../azure-functions/durable/durable-task-scheduler/choose-orchestration-framework.md). 

## Next steps

> [!div class="nextstepaction"]
> [Learn more about the Durable Task Scheduler](../azure-functions/durable/durable-task-scheduler/durable-task-scheduler.md) 