---
title: Choosing your orchestration framework
description: This article provides guidance to help developers pick an orchestration framework.
ms.topic: conceptual
ms.date: 04/28/2025
---

# Choosing an orchestration framework

The goal of this article is to provide information about two developer-oriented orchestration frameworks supported by Azure and considerations for when to choose which. The article also provides some context around scenarios that warrant the use of an orchestration framework. 

## Scenarios requiring orchestration 
Developers often find themselves creating solutions that involve multi-step operations, some of which may be long-running. These multiple-step operations are referred to as *orchestrations* or *workflows*. For example, an e-commerce website would need an order processing workflow, which has steps (implemented as microservices) that need to happen sequentially to:
- Check the inventory
- Send order confirmation
- Process payment
- Generate invoice

Another example would be an intelligent trip planner. The planner might suggest ideas based on user requirements, get preference confirmation, and then make required bookings. You can implement an agent for each task and orchestrate the steps for invoking these agents as a workflow.

Since orchestrations involve multiple or long-running steps, it's important that the framework you tracks the application state so that execution can continue from the point of failure rather than the beginning. One way to ensure this statefulness is to continuously checkpoint orchestration states to a persistence layer while it runs. The next section demonstrates how orchestration frameworks maintain statefulness while also taking care automatic retries while you orchestrate your workflows without the burden of architecting for fault tolerance. 

The two previous scenarios share a commonly used orchestration pattern, which is *sequential chaining* of operations. There are other patterns that benefit from the statefulness of an orchestration framework: 
- *Fan-out/fan-in*: For batch jobs, ETL (extract, transfer, and load), and any scenario that requires parallel processing 
- *Human interactions*: For two-factor authentication, workflows that require human approval 
- *Asynchronous HTTP APIs*: For any scenario where a client doesn't want to wait for long-running tasks to complete 

The next section covers the two orchestration frameworks supported by Azure: **Durable Functions** and **Durable Task SDKs (currently in public preview)**. 

## Orchestration framework options 
Both orchestrations frameworks described in this section are designed for developers, so they're code-centric and are available in various popular programming languages. 

### Durable Functions 
As a feature of Azure Functions, [Durable Functions](../durable-functions-overview.md) inherits numerous assets, such as:
- Integrations with other Azure services through the Functions extensions
- Local development experience
- Serverless pricing model, and more. 

Other than running on the Functions platform, Durable Functions apps can also be run on Azure App Service and Azure Container App just like a regular Function app. 

Durable Functions has a special feature called [Durable Entities](../durable-functions-entities.md), which are similar in concept to virtual actors or grains in the Orleans framework. Entities allow you to keep small pieces of states for objects in a distributed system. For example, you could use entities to model users of a microblogging app or the counter of an exercise app. Learn more about Durable Entities. 

As mentioned earlier, orchestration frameworks need to persist state information. In the context of Durable Functions, states are persisted in something called a [storage backend](../durable-functions-storage-providers.md). Durable Functions supports two "bring-your-own" (BYO) backends - Azure Storage and Microsoft SQL - and an Azure managed backend called Durable Task Scheduler (more information about the scheduler in the next section). 

#### When to use Durable Functions
If you need to build event-driven apps with workflows, the recommendation would be to consider Durable Functions. The Azure Functions extensions that provide integrations with other Azure services makes building event-driven scenarios easy. For example, if you need to start a Durable Functions orchestration when a message comes into your Azure Service Bus or a file uploads to Azure Blob Storage, you can easily implement that with Durable Functions. Or if you need an orchestration to start periodically or in reaction to an HTTP request, then you can build that with the Azure Functions timer and HTTP trigger, respectively. 

Another scenario for choosing Durable Functions would be when your solution benefits from using Durable Entities, since the Durable Task SDKs don't provide this feature. 

Lastly, if you're already writing Azure Function apps and realized that you need workflow, you probably want to use Durable Functions. Its programming model is very similar to Functions. You can accelerate your developer in this case. 

**Quickstarts** 
- Create a durable functions app with Azure Storage backend
    - [.NET](../durable-functions-isolated-create-first-csharp.md)
    - [Python](../quickstart-python-vscode.md)
    - [JavaScript/TypeScript](../quickstart-js-vscode.md)
    - [Java](../quickstart-java.md)
    - [PowerShell](../quickstart-powershell-vscode.md)
- [Configure a durable functions app with Durable Task Scheduler](./quickstart-durable-task-scheduler.md)
- [Configure a durable functions app with MSSQL](../quickstart-mssql.md)

**Scenario samples**
- Order processing workflow - [.NET](samples/azure-samples/durable-functions-order-processing/durable-func-order-processing/), [Python](samples/azure-samples/durable-functions-order-processing-python/durable-func-order-processing-py/)
- Intelligent PDF summarizer - [.NET](samples/azure-samples/intelligent-pdf-summarizer-dotnet/durable-func-pdf-summarizer-csharp/), [Python](samples/azure-samples/intelligent-pdf-summarizer/durable-func-pdf-summarizer/)

### Durable Task SDKs with Durable Task Scheduler (public preview)
The Durable Task SDKs are client SDKs that allows the orchestrations you write to connect to the orchestration engine in Azure. Apps that use the Durable Task SDKs can be run on any compute platforms, including:
- Azure Kubernetes Service
- Azure Container Apps
- Azure App Service
- VMs on-premises

The Durable Task SDKs must be used with the Durable Task Scheduler (currently in public preview), where the latter plays both the role of the orchestration engine and the storage backend for orchestration state persistence. As mentioned previously, the Azure-managed Durable Task Scheduler eliminates management overhead. The scheduler is also optimized to provide high orchestration throughput, offers an out-of-the-box dashboard for orchestrations monitoring and debugging, as well as a local emulator and more. Learn more about the [Durable Task Scheduler](./durable-task-scheduler.md). 

#### When to use Durable Task SDKs
Use the Durable Task SDKs when your app needs only workflows. The Durable Task SDKs provide a lightweight and relatively un-opinionated programming model for authoring workflows. 

The other reason for using the Durable Task SDKs is when you need to run apps on Azure Kubernetes Services or VMs on-premises with official Microsoft support. While Durable Functions can be run on these platforms as well, there's no official support. 

**Quickstarts** 
- [.NET][TODO]
- [Python][TODO]
- [Java][TODO] 

> [!NOTE]
> The Durable Task Framework is an open-source .NET orchestration framework. Like the Durable Task SDKs, it can be used to build apps that run on platforms like the Azure Kubernetes Services. However, we don't recommend new customers to use Durable Task Framework because Microsoft doesn't officially support it. 





