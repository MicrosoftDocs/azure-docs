---
title: Choosing an orchestration framework
description: Learn which orchestration framework works for your scenario.
ms.topic: conceptual
ms.date: 05/06/2025
---

# Choosing an orchestration framework

Azure offers two developer-oriented orchestration frameworks you can use to build apps: **Durable Task SDKs** and **Durable Functions**. These frameworks simplify the implementation of application patterns involving complex, long-running, and multi-step operations by providing built-in state persistence and automatic retries. These frameworks ensure durable execution, meaning code can continue executing even with interruptions or infrastructure failures. Since all state information is persisted, execution continues in another process or machine from the point of failure.

In this article, you learn:

> [!div class="checklist"]
> - The benefits of using an orchestration framework.
> - Which framework works best for your scenario. 

## Scenarios requiring orchestration 

Application patterns that benefit from the Durable Task SDKs and Durable Functions include: 
- **Function chaining:** For executing sequential workflow steps in order, passing data between steps with data transformations at each step, and building pipelines where each activity builds on the previous one.
- **Fan-out/fan-in:** For batch jobs, ETL (extract, transfer, and load), and any scenario that requires parallel processing. 
- **Human interactions:** For two-factor authentication, workflows that require human approval. 
- **Asynchronous HTTP APIs:** For any scenario where a client doesn't want to wait for long-running tasks to complete. 

The two following scenarios share the commonly used *function chaining* pattern. 

### Processing orders on an e-commerce website

Let's say you create an e-commerce solution that involves multi-step operations, some of which may be long-running. These multiple-step operations are referred to as *orchestrations* or *workflows*. Your website needs an order processing workflow that includes steps happening sequentially to:
- Check the inventory
- Send order confirmation
- Process payment
- Generate invoice

### Invoking AI agents for planning a trip

In this scenario, you created an intelligent trip planner. The planner:
- Suggests ideas based on user requirements
- Gets preference confirmation
- Makes required bookings

You can implement an agent for each task and orchestrate the steps for agent invocation as a workflow.

## Orchestration framework options 

Since orchestrations involve multiple or long-running steps, it's important for orchestration frameworks to maintain application statefulness so that execution can continue from the point of failure rather than the beginning. One way to ensure this statefulness is to continuously checkpoint orchestration states to a persistence layer while it runs. 

Both Durable Functions and the Durable Task SDKs maintain statefulness while also handling automatic retries while you orchestrate your workflows without the burden of architecting for fault tolerance. 

> [!NOTE]
> Durable Functions and the Durable Task SDKs are code-centric and available in various popular programming languages. 

### Durable Functions
 
As a feature of Azure Functions, [Durable Functions](../durable-functions-overview.md) inherits numerous assets, such as:
- Integrations with other Azure services through the Functions extensions
- Local development experience
- Serverless pricing model, and more. 

Aside from running on the Functions platform, Durable Functions apps can also be run on Azure App Service and Azure Container Apps. 

Durable Functions includes a special feature called [Durable Entities](../durable-functions-entities.md), which are similar in concept to virtual actors or grains in the Orleans framework. *Entities* allow you to keep small pieces of states for objects in a distributed system. For example, you could use entities to model users of a microblogging app or the counter of an exercise app. 

Durable Functions persists states in a [storage backend](../durable-functions-storage-providers.md). Durable Functions supports:

- Two "bring-your-own" (BYO) backends:
  - Azure Storage 
  - Microsoft SQL 
- An Azure managed backend:
  - [Durable Task Scheduler](#durable-task-sdks-with-durable-task-scheduler-preview) 

#### When to use Durable Functions

Consider using Durable Functions if you need to build event-driven apps with workflows. The Azure Functions extensions that provide integrations with other Azure services makes building event-driven scenarios easy. For example, with Durable Functions:

- You can easily start a Durable Functions orchestration when a message comes into your Azure Service Bus or a file uploads to Azure Blob Storage. 
- You can easily build an orchestration to start periodically or in reaction to an HTTP request with the Azure Functions timer and HTTP trigger, respectively. 
- Your solution benefits from using Durable Entities, since the Durable Task SDKs don't provide this feature. 
- You're already writing Azure Function apps and realized that you need workflow. Since its programming model is similar to Functions, you can accelerate your developer with Durable Functions. 

#### Try it out

Walk through one of the following quickstarts or scenarios to configure your function apps with one of the storage backends available for Durable Functions.

##### Quickstarts

|   | Quickstart | Description |
| - | ---------- | ----------- |
| **Durable Task Scheduler (preview)** | [Configure a durable functions app with Durable Task Scheduler](./quickstart-durable-task-scheduler.md) | Configure a "hello world" Durable Functions app to use the Durable Task Scheduler as the backend storage provider, test locally, and publish to Azure. |
| **Azure Storage** | Create a durable functions app with Azure Storage backend:<br>- [.NET](../durable-functions-isolated-create-first-csharp.md)<br>- [Python](../quickstart-python-vscode.md)<br>- [JavaScript/TypeScript](../quickstart-js-vscode.md)<br>- [Java](../quickstart-java.md)<br>- [PowerShell](../quickstart-powershell-vscode.md) | Locally create and test a "hello world" Durable Functions app and deploy to Azure. |
| **MSSQL** | [Configure a durable functions app with MSSQL](../quickstart-mssql.md) | Using an existing "hello world" Durable Functions app, configure the MSSQL backend storage provider, test locally, and publish to Azure. |
 
##### Samples

|   | Sample | Description |
| - | ---------- | ----------- |
| **Order processing workflow** | Create an order processing workflow with Durable Functions with Azure Storage:<br>- [.NET](/samples/azure-samples/durable-functions-order-processing/durable-func-order-processing/)<br>- [Python](/samples/azure-samples/durable-functions-order-processing-python/durable-func-order-processing-py/) | Configure a "hello world" Durable Functions app to use the Durable Task Scheduler as the backend storage provider, test locally, and publish to Azure. |
| **Intelligent PDF summarizer** | Create an intelligent application using Azure Durable Functions, Azure Storage, Azure Developer CLI, and more:<br>- [.NET](/samples/azure-samples/intelligent-pdf-summarizer-dotnet/durable-func-pdf-summarizer-csharp/)<br>- [Python](/samples/azure-samples/intelligent-pdf-summarizer/durable-func-pdf-summarizer/) | Locally create and test a "hello world" Durable Functions app and deploy to Azure. |

### Durable Task SDKs with Durable Task Scheduler (preview)

The Durable Task SDKs are client SDKs that must be used with the Durable Task Scheduler. The Durable Task SDKs connect the orchestrations you write to the Durable Task Scheduler orchestration engine in Azure. Apps that use the Durable Task SDKs can be run on any compute platform, including:
- Azure Kubernetes Service
- Azure Container Apps
- Azure App Service
- Virtual Machines (VMs) on-premises

The [Durable Task Scheduler](./durable-task-scheduler.md) (currently in preview) plays the role of both the orchestration engine and the storage backend for orchestration state persistence. The Azure-managed Durable Task Scheduler:
- Eliminates management overhead
- Provides high orchestration throughput
- Offers an out-of-the-box dashboard for orchestration monitoring and debugging
- Includes a local emulator

#### When to use Durable Task SDKs

If your app only needs workflows, the Durable Task SDKs provide a lightweight and relatively unopinionated programming model for authoring workflows. 

When you need to run apps on Azure Kubernetes Services or VMs on-premises with official Microsoft support. While Durable Functions can be run on these platforms as well, there's no official support. 

#### Try it out

Walk through one of the following quickstarts to configure your applications to use the Durable Task Scheduler with the Durable Task SDKs.

|   | Quickstart | Description |
| - | ---------- | ----------- |
| **Local development quickstart** | [Create an app with Durable Task SDKs and Durable Task Scheduler](./quickstart-portable-durable-task-sdks.md) using either the .NET, Python, or Java SDKs. | Run a fan-in/fan-out orchestration locally using the Durable Task Scheduler emulator and review orchestration history using the dashboard. |
| **Deploy to Azure Container Apps using Azure Developer CLI** | [Configure Durable Task SDKs in your container app with Azure Functions Durable Task Scheduler][./quickstart-container-apps-durable-task-sdk.md] | Deploy a function chaining pattern solution using the Azure Developer CLI. |


> [!NOTE]
> The Durable Task Framework (DTFx) is an open-source .NET orchestration framework similar to the .NET Durable Task SDK. While it *can* be used to build apps that run on platforms like Azure Kubernetes Services, **DTFx doesn't receive official Microsoft support**.

## Next steps

For Durable Task Scheduler for Durable Functions:
- [Quickstart: Configure a Durable Functions app to use Azure Functions Durable Task Scheduler](./quickstart-durable-task-scheduler.md)
- [Develop with the Azure Functions Durable Task Scheduler](./develop-with-durable-task-scheduler.md)

For Durable Task Scheduler for the Durable Task SDKs:
- [Quickstart: Create an app with Durable Task SDK and Durable Task Scheduler](./quickstart-portable-durable-task-sdks.md)
- [Quickstart: Configure a container app with Durable Task SDK and Durable Task Scheduler](./quickstart-container-apps-durable-task-sdk.md)