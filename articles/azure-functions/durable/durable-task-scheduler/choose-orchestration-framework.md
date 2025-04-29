--- 
title: Choosing your orchestration framework 
description: This article provides guidance to help developers pick an orchestration framework. 
ms.topic: conceptual 
ms.date: 04/29/2025 
--- 

# Choosing an orchestration framework 
The goal of this article is to provide information about two developer-oriented orchestration frameworks supported by Azure and considerations for when to choose which. The article also provides some context around scenarios that warrant the use of an orchestration framework.  

## Scenarios requiring orchestration  
Developers often find themselves creating solutions that involve multi-step operations, some of which may be long-running. These multiple-step operations are referred to as *orchestrations* or *workflows*. For example, an e-commerce website would need an order processing workflow, which has steps that need to happen sequentially to: 
- Check the inventory 
- Send order confirmation 
- Process payment 
- Generate invoice 

Another example would be an intelligent trip planner. The planner might suggest ideas based on user requirements, get preference confirmation, and then make required bookings. You can implement an agent for each task and orchestrate the steps for invoking these agents as a workflow. 

Since orchestrations involve multiple or long-running steps, it's important to ensure *durable execution* so that orchestrations can continue executing from the point of failure instead of restarting in the face of interruptions or temporary infrastructure failures. The frameworks described in the next section continuously checkpoints orchestration state to a persistence layer while the app runs, so that when interruptions occur, the app can rebuild its local state and continues execution without losing previous progress. The frameworks also take care of automatic retries, so you can author your orchestrations without the burden of architecting for fault tolerance.  

Other than *sequential chaining* of operations (the pattern used by the order processing and trip planner scenarios), there are other patterns that benefit from the statefulness of orchestration frameworks:  
- *Fan-out/fan-in*: For batch jobs, ETL (extract, transfer, and load), and any scenario that requires parallel processing  
- *Human interactions*: For two-factor authentication, workflows that require human approval  
- *Asynchronous HTTP APIs*: For any scenario where a client doesn't want to wait for long-running tasks to complete  

The next section provides an overview of the two orchestration frameworks supported by Azure, **Durable Functions** and **Durable Task SDKs (currently in public preview)**, and when to use them.  

## Orchestration framework options  
Both orchestrations frameworks described in this section are designed for developers, so they're code-centric and are available in various popular programming languages.  

### Durable Functions  
As a feature of Azure Functions, [Durable Functions](../durable-functions-overview.md) inherits numerous assets, including but not limited to the following: 

- Azure Functions extensions, which provide integrations with other Azure services through [triggers and bindings](../../functions-triggers-bindings.md) 
- Local development experience 
- Serverless pricing model 
- Hosting in App Service and Azure Container Apps 

Durable Functions has a special feature called [Durable Entities](../durable-functions-entities.md), which are similar in concept to virtual actors or grains in the Orleans framework. Entities allow you to keep small pieces of states for objects in a distributed system. For example, you could use entities to model users of a microblogging app or the counter of an exercise app.  

As mentioned earlier, orchestration frameworks need to persist state information. In the context of Durable Functions, states are persisted in something called a [storage backend](../durable-functions-storage-providers.md). Durable Functions supports two "bring-your-own" (BYO) backends - Azure Storage and Microsoft SQL - and an Azure managed backend called Durable Task Scheduler (more information about the scheduler in the next section).  

#### When to use Durable Functions 
If you need to build event-driven apps with workflows, consider Durable Functions. The Azure Functions extensions provide integrations with other Azure services, which makes building event-driven scenarios easy. For example, if you need to start an orchestration when a message comes into your Azure Service Bus or when a file is uploaded to Azure Blob Storage, you can easily implement that with the respective Azure Function triggers in your Durable Functions app. Or if you need an orchestration to start periodically or in reaction to an HTTP request, then you can build that with the Azure Function timer and HTTP trigger, respectively.  

Another scenario for choosing Durable Functions is when your solution benefits from using Durable Entities, since the Durable Task SDKs don't provide this feature.  

Lastly, if you already have Azure Function apps and realized that you need workflow, you probably would want to use Durable Functions as its programming model is similar to that of Azure Function's. You can accelerate your development in this case.  

**Quickstarts**  
- Create a Durable Functions app with Azure Storage backend 
    - [.NET](../durable-functions-isolated-create-first-csharp.md) 
    - [Python](../quickstart-python-vscode.md) 
    - [JavaScript/TypeScript](../quickstart-js-vscode.md) 
    - [Java](../quickstart-java.md) 
    - [PowerShell](../quickstart-powershell-vscode.md) 
- [Configure a Durable Functions app with Durable Task Scheduler](./quickstart-durable-task-scheduler.md) 
- [Configure a Durable Functions app with MSSQL](../quickstart-mssql.md) 

**Scenario samples** 
- Order processing workflow - [.NET](/samples/azure-samples/durable-functions-order-processing/durable-func-order-processing/), [Python](/samples/azure-samples/durable-functions-order-processing-python/durable-func-order-processing-py/)
- Intelligent PDF summarizer - [.NET](samples/azure-samples/intelligent-pdf-summarizer-dotnet/durable-func-pdf-summarizer-csharp/), [Python](samples/azure-samples/intelligent-pdf-summarizer/durable-func-pdf-summarizer/) 

### Durable Task SDKs with Durable Task Scheduler (public preview) 
The Durable Task SDKs are client SDKs that allows the orchestrations you write to connect to the orchestration engine in Azure. Apps that use the Durable Task SDKs can be run on multiple compute platforms, including: 
- Azure Kubernetes Service 
- Azure Container Apps 
- Azure App Service 
- VMs on-premises 

The Durable Task SDKs must be used with the [Durable Task Scheduler](./durable-task-scheduler.md), where the latter plays both the role of the orchestration engine and the storage backend for orchestration state persistence. As mentioned previously, the Durable Task Scheduler is managed by Azure, eliminating the management overhead that comes with BYO backends. The scheduler is also optimized to provide high orchestration throughput, offers an out-of-the-box dashboard for orchestrations monitoring and debugging, an emulator for local development, and more.  

#### When to use Durable Task SDKs 
The Durable Task SDKs provide a lightweight and relatively un-opinionated programming model for authoring workflows. Use the Durable Task SDKs when your app needs only workflows and don't benefit from the triggers and bindings provided by Azure Functions.  

The other scenario for choosing the Durable Task SDKs is when you need to run apps on Azure Kubernetes Services or VMs on-premises with official Microsoft support. While Durable Functions can be run on these platforms as well, there's no official support.  

**Quickstarts**  
- [.NET](./quickstart-portable-durable-task-sdks.md) 
- [Python](./quickstart-portable-durable-task-sdks.md) 
- [Java](./quickstart-portable-durable-task-sdks.md) 

> [!NOTE] 
> The Durable Task Framework (DTFx) is an open-source .NET orchestration framework similar to the .NET Durable Task SDK and can be used to build apps that run on platforms like the Azure Kubernetes Services. However, we don't recommend new customers to use DTFx as Microsoft doesn't officially support it.  