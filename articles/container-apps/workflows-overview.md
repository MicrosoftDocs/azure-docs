---
title: Workflows in Azure Container Apps
description: Learn about your workflow options for Azure Container Apps.
services: container-apps, azure-functions
author: hhunter-ms
ms.service: azure-container-apps
ms.topic: overview
ms.date: 04/29/2025
ms.author: jiayma
ms.reviewer: cshoe, hannahhunter
---

# Workflows in Azure Container Apps
Workflows are multi-step operations that may need to happen in a certain order and/or involve long-running tasks. Some real-world scenarios that require workflows include:
- Order processing
- AI agents 
- Infrastructure management 
- Data processing pipeline 

Because workflows involve multiple steps and could be long-running, execution may be interrupted by events such as temporary infrastructure failures or dependency downtime. As such, it's important to have *durable execution*, i.e. execution continues from the point of failure instead of restarting in the event of temporary failures.

Azure provides two code-oriented workflow frameworks you can use to build apps that run on Azure Container Apps: **Durable Task SDKs** (currently in public preview) and **Durable Functions**. These frameworks continuously checkpoint workflow state as the app runs and automatically handle retries to ensure durable execution. 

> [!NOTE]
> You might see workflows referred to as *orchestrations*, especially in the context of Durable Functions. To avoid creating confusion with container orchestrations, this article refrains from using orchestrations to refer to workflows. 

## Workflow frameworks for developers in Azure
The workflow frameworks described in this section are designed for developers and are available in multiple programming languages. 

### Durable Task SDKs (public preview)
The Durable Task SDKs are lightweight client SDKs that provide a relatively un-opinionated programming model for authoring workflows. They allow your app to connect to a workflow engine called the [Durable Task Scheduler](/articles/azure-functions/durable/durable-task-scheduler/durable-task-scheduler.md) hosted in Azure. 

To ensure durable execution, the Durable Task SDKs require a storage backend to persist workflow state as the app runs. In this case, the Durable Task Scheduler also plays the role of the backend for apps leveraging the Durable Task SDKs. 

#### Quickstarts
- [.NET](/articles/azure-functions/durable/durable-task-scheduler/quickstart-portable-durable-task-sdks.md) 
- [Python](/articles/azure-functions/durable/durable-task-scheduler/quickstart-portable-durable-task-sdks.md) 
- [Java](/articles/azure-functions/durable/durable-task-scheduler/quickstart-portable-durable-task-sdks.md)  

### Durable Functions 
[Durable Functions](/articles/azure-functions/durable/durable-functions-overview.md) is the other code-oriented workflow framework in Azure. As part of Azure Functions, Durable Functions inherits many of its characteristics. Examples include:
- Integrations with other Azure services through Azure Functions [triggers and bindings](/articles/azure-functions/functions-triggers-bindings.md)
- Local development experience
- Serverless pricing model

If you want to host a Durable Functions app in Azure Container Apps, you must use the [Microsoft SQL backend](/articles/azure-functions/durable/durable-functions-storage-providers.md#microsoft-sql-server-mssql) today for state persistence. 

## How to choose 
You can host apps built using either the Durable Task SDKs or Durable Functions in Azure Container Apps. See [guidance for choosing the framework](/articles/azure-functions/durable/durable-task-scheduler/choose-orchestration-framework.md) you need. 

## Next steps
- Learn more about the [Durable Task Scheduler](/articles/azure-functions/durable/durable-task-scheduler/durable-task-scheduler.md) 
