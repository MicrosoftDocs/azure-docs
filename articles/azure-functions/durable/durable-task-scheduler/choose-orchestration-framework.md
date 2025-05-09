---
title: Choosing an orchestration framework
description: Learn which orchestration framework works for your scenario.
ms.topic: conceptual
ms.date: 05/06/2025
---

# Choosing an orchestration framework

In this article, you learn:

> [!div class="checklist"]
> - The benefits of using an orchestration framework.
> - Which framework works best for your scenario. 

Azure offers two developer-oriented orchestration frameworks you can use to build apps: **Durable Functions** for apps hosted in Azure Functions, and **Durable Task SDKs** for apps hosted on other compute platforms. Orchestrations, also called _workflows_, involve arranging and coordinating multiple (long-running) tasks or processes, often involving multiple systems, to be executed in a certain order. It's important that an orchestration framework guarantees _durable execution_, meaning when there are interruptions or infrastructure failures, execution can continue in another process or machine from the point of failure. The Durable Task SDKs and Durable Functions ensure that orchestrations are executed durably through built-in state persistence and automatic retries, so that you can author orchestrations without the burden of architecting for fault tolerance.

## Scenarios requiring orchestration 

The following are scenarios requiring common orchestration patterns that benefit from the Durable Task SDKs and Durable Functions: 
- **Function chaining:** For scenarios involving sequential steps, where each step may depend on the output of the previous one. 
- **Fan-out/fan-in:** For batch jobs, ETL (extract, transfer, and load), and any scenario that requires parallel processing. 
- **Human interactions:** For two-factor authentication, workflows requiring human intervention. 
- **Asynchronous HTTP APIs:** For any scenario where a client doesn't want to wait for long-running tasks to complete. 

The two following scenarios share the *function chaining* pattern. 

### Processing orders on an e-commerce website

Let's say you create an e-commerce website. Your website likely needs an order processing workflow for any customer purchase. The workflow may include the following sequential steps:
1. Check the inventory
1. Process payment
1. Update the inventory
1. Generate invoice
1. Send order confirmation

### Invoking AI agents for planning a trip

In this scenario, let's say you need to create an intelligent trip planner. There's a series of known steps the planner should go through:
1. Suggest ideas based on user requirements
1. Get preference confirmation
1. Make required bookings

You can implement an AI agent for each task, and then write an orchestration that invokes these agents in certain order. 

## Orchestration framework options  

Both Durable Functions and Durable Task SDK are available in multiple languages but there are some differences in how they can be used. The important differences and use case for each framework option are described in the following sections. 

### Durable Functions
 
As a feature of Azure Functions, [Durable Functions](../durable-functions-overview.md) inherits numerous assets, such as:
- Integrations with other Azure services through the Functions extensions
- Local development experience 
- Serverless pricing model
- Hosting in Azure App Service and Azure Container Apps 

Durable Functions persists states in a [storage backend](../durable-functions-storage-providers.md) and supports:
- Two "bring-your-own" (BYO) backends:
  - Azure Storage 
  - Microsoft SQL 
- An Azure managed backend:
  - [Durable Task Scheduler](#durable-task-sdks-with-durable-task-scheduler-preview) 

#### When to use Durable Functions

Consider using Durable Functions if you need to build event-driven apps with workflows. The Azure Functions extensions provide integrations with other Azure services, which make building event-driven scenarios easy. For example, with Durable Functions:

- You can easily start an orchestration when a message comes into your Azure Service Bus or a file uploads to Azure Blob Storage. 
- You can easily build an orchestration that runs periodically or in response to an HTTP request with the Azure Functions timer and HTTP trigger, respectively. 

Another reason to consider Durable Functions is if you're already writing Azure Function apps and realized that you need workflow. Since Durable Functions programming model is similar to Function's, you can accelerate your development.

#### Try it out

Walk through one of the following quickstarts or samples to learn more about Durable Functions.

##### Quickstarts

|   | Quickstart | Description |
| - | ---------- | ----------- |
| **Durable Task Scheduler (preview)** | [Create a Durable Functions app with Durable Task Scheduler](./quickstart-durable-task-scheduler.md) | Create a "hello world" Durable Functions app that uses the Durable Task Scheduler as the backend, test locally, and publish to Azure. |
| **Azure Storage** | Create a Durable Functions app with the Azure Storage backend:<br>- [.NET](../durable-functions-isolated-create-first-csharp.md)<br>- [Python](../quickstart-python-vscode.md)<br>- [JavaScript/TypeScript](../quickstart-js-vscode.md)<br>- [Java](../quickstart-java.md)<br>- [PowerShell](../quickstart-powershell-vscode.md) | Create a "hello world" Durable Functions app that uses Azure Storage as the backend, test locally, and publish to Azure. |
| **MSSQL** | [Create a Durable Functions app with MSSQL](../quickstart-mssql.md) | Create a "hello world" Durable Functions app that uses MSSQL as the backend, test locally, and publish to Azure. |
 
##### Samples

|   | Sample | Description |
| - | ---------- | ----------- |
| **Order processing workflow** | Create an order processing workflow with Durable Functions:<br>- [.NET](/samples/azure-samples/durable-functions-order-processing/durable-func-order-processing/)<br>- [Python](/samples/azure-samples/durable-functions-order-processing-python/durable-func-order-processing-py/) | This sample implements an order processing workflow that includes checking inventory, processing payment, updating inventory, and notifying customer. |
| **Intelligent PDF summarizer** | Create an app that processes PDFs with Durable Functions:<br>- [.NET](/samples/azure-samples/intelligent-pdf-summarizer-dotnet/durable-func-pdf-summarizer-csharp/)<br>- [Python](/samples/azure-samples/intelligent-pdf-summarizer/durable-func-pdf-summarizer/) | This sample demonstrates using Durable Functions to coordinate the steps for processing and summarizing PDFs using Azure Cognitive Services and Azure OpenAI. |

### Durable Task SDKs with Durable Task Scheduler (preview)

The Durable Task SDKs are client SDKs that must be used with the Durable Task Scheduler. The Durable Task SDKs connect the orchestrations you write to the Durable Task Scheduler orchestration engine in Azure. Apps that use the Durable Task SDKs can be run on any compute platform, including:
- Azure Kubernetes Service
- Azure Container Apps
- Azure App Service
- Virtual Machines (VMs) on-premises

The [Durable Task Scheduler](./durable-task-scheduler.md) (currently in preview) plays the role of both the orchestration engine and the storage backend for orchestration state persistence. The Durable Task Scheduler:
- Is fully managed by Azure, thus removing management overhead
- Provides high orchestration throughput
- Offers an out-of-the-box dashboard for orchestration monitoring and debugging
- Includes a local emulator

#### When to use Durable Task SDKs

If you don't want to use the Azure Functions programming model, the Durable Task SDKs provide a lightweight and relatively unopinionated programming model for authoring workflows. 

When you need to run apps on Azure Kubernetes Services or VMs on-premises with official Microsoft support, you should consider using the Durable Task SDKs. While Durable Functions can be run on these platforms as well, there's no official support. 

#### Try it out

Walk through one of the following quickstarts to configure your applications to use the Durable Task Scheduler with the Durable Task SDKs.

|   | Quickstart | Description |
| - | ---------- | ----------- |
| **Local development quickstart** | [Create an app with Durable Task SDKs and Durable Task Scheduler](./quickstart-portable-durable-task-sdks.md) using either the .NET, Python, or Java SDKs. | Run a fan-in/fan-out orchestration locally using the Durable Task Scheduler emulator and review orchestration history using the dashboard. |
| **Hosting in Azure Container Apps** | [Deploy a Durable Task SDK app to Azure Container Apps](./quickstart-container-apps-durable-task-sdk.md) | Quickly deploy a "hello world" Durable Task SDK app to Azure Container Apps using the Azure Developer CLI. |


> [!NOTE]
> The Durable Task Framework (DTFx) is an open-source .NET orchestration framework similar to the .NET Durable Task SDK. While it *can* be used to build apps that run on platforms like Azure Kubernetes Services, **DTFx doesn't receive official Microsoft support**.

## Next steps

- [Durable Functions overview](../durable-functions-overview.md)
- [Durable Functions types and features](../durable-functions-types-features-overview.md)
- [Durable Task Scheduler overview](./durable-task-scheduler.md)
- [Configure managed identity for Durable Task Scheduler](./durable-task-scheduler-identity.md)