---
title: Choosing your orchestration framework
description: This article provides guidance to help developers pick an orchestration framework.
ms.topic: conceptual
ms.date: 04/24/2025
ms.author: azfuncdf
author: lilyjma
---

# Choosing your orchestration framework

The goal of this article is to provide information about two developer-oriented orchestration frameworks supported by Azure and considerations for when to choose which. The article will also provide some context around scenarios that warrant the use of an orchestration framework. 

## Scenarios requiring orchestration 
Developers often find themselves creating solutions that involve multi-step operations, some of which may be long-running. These multiple-step operations are referred to as *orchestrations* or *workflows*. For example, an e-commerce website would need an order processing workflow, which has steps (maybe implemented as microservices) that need to happen sequentially to check the inventory, send order confirmation, process payment, and generate invoice. Another example would be an intelligent trip planner. The planner might suggest ideas based on user requirements, get preference confirmation, and then make required bookings. You can implement an agent for each task and orchestrate the steps for invoking these agents as a workflow.

Since orchestrations involve multiple steps or a step might be long-running, it's important that the framework you use keeps track of the application state so that execution can continue from the point of failure rather than the beginning. One way to ensure this statefulness is to continuouly checkpoint orchestration states to a persistance layer while it runs. The orchestration frameworks discussed in the next section does exactly this, while also taking care automatic retries so that you can orchestrate your workflows without the burden of architecting for fault tolerance. 

The two scenarios above share a commonly used orchestration pattern, which is sequential chaining of operations. There are other patterns that benefit from the statefulness of an orchestration framework: 
- Fan-out/fan-in: For batch jobs, ETL (extract, transfer, and load), and any scenario that requires parallel processing 
- Human interactions: For two-factor authentication, workflows that require human approval 
- Asynchronous HTTP APIs: For any scenario where a client doesn't want to wait for long-running tasks to complete 

The next section will cover the two orchestration frameworks supported by Azure: **Durable Functions** and **Durable Task SDKs (currently in public preview)**. 

## Orchestration framework options 
Both orchestrations frameworks described in this section are designed for developers, so they're code-centric and are available in various popular programming languages. 

### Durable Functions 
Durable Functions is a feature of Azure Functions, so it inherits a lot of the assets from the latter such as integrations with other Azure services through the Functions extensions, local development experience, serverless pricing model, etc. Other than running on the Functions platform, Durable Functions apps can also be run on Azure App Service and Azure Container App just like a regular Function app. 

Durable Functions has a special feature called Durable Entities, which are similar in concept to virtual actors or grains in the Orleans framework. Entities allow you to keep small pieces of states for objects in a distributed system. For example, you could use entities to model users of a microblogging app or the counter of an exercise app. Learn more about Durable Entities. 

As mentioned earlier, orchestration frameworks need to persist state information. In the context of Durable Functions, states are persisted in something called a storage backend. Durable Functions supports two BYO or "bring-your-own" backends - Azure Storage and Microsoft SQL - and an Azure managed backend called Durable Task Scheduler (more information about the scheduler in the next section). 

#### When to use Durable Functions
If you need to build event-driven apps with workflows, the recommendation would be to consider Durable Functions. The Azure Functions extensions that provide integrations with other Azure services makes building event-driven scenarios easier. For example, if you need to start a Durable Functions orchestration when a message comes into your Azure Service Bus or when a file is uploaded to Azure Blob Storage, then you can easily implement that with Durable Functions. Or if you need an orchestration to start periodically or in reaction to an HTTP request, then you can build that with the Azure Functions timer and HTTP trigger, respectively. 

Another scenario for choosing Durable Functions would be when your solution benefits from using Durable Entities, since the Durable Task SDKs don't provide this feature. 

Lastly, if you're already writing Azure Function apps and realized that you need workflow, then you probably would want to use Durable Functions because you'll find its programming model to be very similar to Functions. You can accelerate your develope in this case. 

### Durable Task SDKs with Durable Task Scheduler (public preview)
The Durable Task SDKs are client SDKs that allows the orchestrations you write to connect to the orchestration engine in Azure. Apps that leverage the Durable Task SDKs can be run on virtually any compute platforms, including Azure Kubernetes Service, Azure Container Apps, Azure App Service, or just VMs on-prem. 

The Durable Task SDKs must be used with the Durable Task Scheduler (currently in public preview), where the latter plays both the role of the orchestration engine and the storage backend for orchestration state persistence. As mentioned previously, the Durable Task Scheduler is fully managed Azure, which eliminates management overhead. The scheduler is optimized to provide high orchestration throughput, offers an out-of-the-box dashboard for monitoring and debugging of orchestrations as well as a local emulator and more. Learn more about the Durable Task Scheduler. 

#### When to use Durable Task SDKs
Use the Durable Task SDKs when your app needs only workflows. The Durable Task SDKs provide a lightweight and relatively un-opinionated programming model for authoring workflows. If you're looking to run your apps on Azure Kubernetes Services or VMs on-prem, the Durable Task SDKs would be the only option supported in Azure. 

>[!NOTE]
>The Durable Task Framework is an open-source .NET orchestration framework. Like the Durable Task SDKs, it can be used to build apps that run on platforms like the Azure Kubernetes Services. However, we don't recommend new customers to use Durable Task Framework because it is not officially supported by Microsoft. 

## Samples and references 
The following quickstarts show how to create a Durable Functions app and configure it to use different backends: 
- Create a durable functions app with Azure Storage backend
    - .NET
    - Python
    - JavaScript/TypeScript
    - Java
    - PowerShell
- Configure a durable functions app with Durable Task Scheduler
- Configure a durable functions app with MSSQL

The following quickstarts show how to create an app with the Durable Task SDKs: 
- .NET
- Python
- JavaScript/TypeScript (coming soon)
- Java 

