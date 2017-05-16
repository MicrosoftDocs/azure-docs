---
title: Consumption and App Service Plans on Azure Functions | Microsoft Docs
description: Understand how Azure Functions scale to meet the needs of your event-driven workloads.
services: functions
documentationcenter: na
author: lindydonna
manager: erikre
editor: ''
tags: ''
keywords: azure functions, functions, event processing, webhooks, dynamic compute, serverless architecture

ms.assetid: 5b63649c-ec7f-4564-b168-e0a74cb7e0f3
ms.service: functions
ms.devlang: multiple
ms.topic: reference
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 05/15/2017
ms.author: donnam, glenga

ms.custom: H1Hack27Feb2017

---
# Consumption and App Service Plans on Azure Functions

## Introduction

Azure Functions can be run in two different modes: Consumption plan and App Service plan. The Consumption plan automatically allocates compute power when your code is running, scales-out as necessary to handle load, and then scales down when code is not running. So, you don't have to pay for idle VMs and don't have to reserve capacity in advance. This article focuses on the Consumption plan. For details about how the App Service plan works, see the [Azure App Service plans in-depth overview](../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md). 

If you are not yet familiar with Azure Functions, see the [Azure Functions overview](functions-overview.md) article.

## Compute options

When you create a function app, you must configure a hosting plan for functions contained in the app. The available hosting plans are the **Consumption Plan** and the [**App Service plan**](../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md). In either mode, functions are executed by an instance of the *Azure Functions host*. The type of plan controls: 1) how host instances are scaled out and 2) the resources that are available to each host.

Currently, the choice of plan type must be made during the creation of the function app. You cannot change between these two options after creation. You can scale between tiers on the [App Service plan](../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md). Manual scaling is not available for the Consumption plan.

### Consumption plan

When using a **Consumption plan**, instances of the Azure Functions host are dynamically added and removed based on the number of incoming events. This plan scales automatically and you are charged for compute resources only when your functions are running. Billing is based on execution time and memory used and is aggregated across all functions within a function app. The next section provides details on how the Consumption plan works. On a Consumption plan, a function can run for a maximum of five (5) minutes. 

Consider a Consumption plan in the following cases:
- Your functions only need to run occasionally and you want to pay only when they are running.
- Your compute needs are highly variable, including periods of high scale.
- You want the platform to handle scale out automatically.
- Your function execution time is 5 minutes or less.

### App Service plan

In the **App Service plan**, your function apps run on dedicated VMs on Basic, Standard, Premium SKUs, similar to Web Apps. Dedicated VMs are allocated to your App Service apps, which means the functions host is always running.

Consider an App Service plan in the following cases:
- You have existing, under-utilized VMs that are already running other App Service instances.
- You expect your function apps to run continuously, or nearly continuously.
- You need more CPU or memory options than what is provided in the Consumption plan.
- You need to run longer than the maximum execution time allowed on the Consumption plan

A VM decouples cost from both runtime and memory size. As a result, you can limit the cost of many long-running functions to the cost of the VMs that they run on. For details about how the App Service plan works, see the [Azure App Service plans in-depth overview](../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md). 

With an App Service plan, you can manually scale out by adding more single-core VM instances, or you can enable auto-scale. For more information, see [Scale instance count manually or automatically](../monitoring-and-diagnostics/insights-how-to-scale.md?toc=%2fazure%2fapp-service-web%2ftoc.json). You can also scale up by choosing a different App Service plan. For more information, see [Scale up an app in Azure](../app-service-web/web-sites-scale.md). If you are planning to run JavaScript functions on an App Service plan, you should choose a plan with fewer cores. For more information, see the [JavaScript reference for Functions](functions-reference-node.md#choose-single-core-app-service-plans).  

### Storage account requirements

On either a Consumption or App Service plan, a Function App requires a general-purpose Azure Storage account that supports Blob, Queue, and Table storage. Internally Azure Functions uses Azure Storage for operations such as managing triggers and logging function executions. Some storage accounts do not support queues and tables, such as blob-only storage accounts (including premium storage) and general-purpose storage accounts with ZRS replication. These accounts are filtered from the Storage Account blade when creating a Function App.

To learn more about storage account types, see [Introducing the Azure Storage Services] (../storage/storage-introduction.md#introducing-the-azure-storage-services).

## How the Consumption plan works

The Consumption plan automatically scales CPU and memory resources by adding additional instances of the Functions host, based on the number of events that its functions are triggered on. Each instance of the Functions host is limited to 1.5 GB.

When using the Consumption hosting plan, function code files are stored on Azure Files shares on the main storage account. When you delete the main storage account, this content is deleted and cannot be recovered.

> [!NOTE] When running on a Consumption plan, if a Function App has gone idle, there can be up to a 10-minute delay in processing new blobs. Once the Function App is running, blobs are processed more quickly. To avoid this initial delay, consider one of the following options:
> - Use a regular App Service Plan with Always On enabled
> - Use another mechanism to trigger the blob processing, such as a queue message that contains the blob > name. For an example, see (queue trigger with blob input binding) [functions-bindings-storage-blob.md#input-sample].

### Runtime scaling

Azure Functions uses a component called the *scale controller* to monitor the rate of events and determine whether to scale out or scale down. The scale controller uses heuristics to determine the amount of number of required compute instances based on the type of trigger. For example, when using an Azure Queue Storage trigger, the scale controller makes scale decisions based on the queue length and the age of the oldest queue message.

![](./media/functions-scale/central-listener.png)

The unit of scale is the function app. When scaled out, more resources are allocated to run multiple instances of the Azure Functions host. Conversely, as compute demand is reduced, function host instances are removed. The number of instances is eventually scaled down to zero when no functions are running within a function app.

### Billing model

Billing for the Consumption plan is described in detail on the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions). Usage is aggregated at the function app level and counts only the time that function code is executing. The following are units for billing: 
* **Resource consumption in GB-s (gigabyte-seconds)**. Computed as a combination of memory size and execution time for all functions within a Function App. 
* **Executions**. Counted each time a function is executed in response to an event, triggered by a binding.
