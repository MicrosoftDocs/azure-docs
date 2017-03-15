---
title: Choose an Azure Functions hosting plan | Microsoft Docs
description: Understand how Azure Functions scale to meet the needs of your event-driven workloads.
services: functions
documentationcenter: na
author: dariagrigoriu
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
ms.date: 02/27/2017
ms.author: dariagrigoriu, glenga

ms.custom: H1Hack27Feb2017

---
# Choose the correct service plan for Azure Functions

## Introduction

Azure Functions has two different service plans: Consumption plan and App Service plan. The Consumption plan automatically allocates compute power when your code is running, scales-out as necessary to handle load, and then scales-in when code is not running. This means you don’t pay for idle VMs or have to reserve capacity before it is needed. This article focuses on the Consumption service plan. For details about how the App Service plan works, see the [Azure App Service plans in-depth overview](../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md). 

If you are not yet familiar with Azure Functions, see the [Azure Functions overview](functions-overview.md) article.

## Service plan options

When you create a function app, you must configure a hosting plan for functions contained in the app. The available hosting plans are: the **Consumption Plan** and the [App Service plan](../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md). Currently, this choice must be made during the creation of the function app. You cannot change between these two options after creation. You can scale between tiers on the [App Service plan](../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md). No changes are currently supported for the Consumption plan as scaling is dynamic.

### Consumption plan

In the **Consumption plan**, your function apps are assigned to a compute processing instance. When needed, more instances are dynamically added or removed. Moreover, your functions run in parallel minimizing the total time needed to process requests. Execution time for each function is aggregated by the containing function app. Cost is driven by memory size and total execution time across all functions in a function app as measured in gigabyte-seconds. This is an excellent option if your compute needs are intermittent or your job times tend to be very short as it allows you to only pay for compute resources when they are actually in use. The next section provides details on how the Consumption plan works.

### App Service plan

In the **App Service plan**, your function apps run on dedicated VMs, just like Web Apps work today for Basic, Standard, or Premium SKUs. Dedicated VMs are allocated to your App Service apps and function apps and are always available whether code is being actively executed or not. This is a good option if you have existing, under-utilized VMs that are already running other code or if you expect to run functions continuously or almost continuously. A VM decouples cost from both runtime and memory size. As a result, you can limit the cost of many long-running functions to the cost of the VMs that they run on. For details about how the App Service plan works, see the [Azure App Service plans in-depth overview](../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md). 

## How the Consumption plan works

The Consumption plan automatically scales CPU and memory resources by adding additional processing instances based on the runtime requirements of the functions in a function app. Every function app processing instance is allocated memory resources up to 1.5 GB.

When running on a Consumption plan, if a Function App has gone idle, there can be up to a 10-minute day in processing new blobs. Once the Function App is running, blobs are processed more quickly. To avoid this initial delay, either use a regular App Service Plan with Always On enabled or use another mechanism to trigger the blob processing, such as a queue message that contains the blob name. 

When creating a Function App, you must create or link a general-purpose Azure Storage account that supports Blob, Queue, and Table storage. Internally Azure Functions uses Azure Storage for operations such as managing triggers and logging function executions. Some storage accounts do not support queues and tables, such as blob-only storage accounts (including premium storage) and general purpose storage accounts with ZRS replication. These accounts are filtered from the Storage Account blade when creating a new Function App.

When using the Consumption hosting plan, Function App content (such as function code files and binding configuration) are stored on Azure Files shares on the main storage account. If you delete the main storage account, this content will be deleted and cannot be recovered.

To learn more about storage account types, see [Introducing the Azure Storage Services] (../storage/storage-introduction.md#introducing-the-azure-storage-services).

### Runtime scaling

Functions uses a central listener to evaluate compute needs based on the configured triggers and to decide when to scale out or scale in. The central listener continuously processes hints for memory requirements and trigger-specific data points. For example, in the case of an Azure Queue Storage trigger, the data points include the queue length and queue time of the oldest entry.

![](./media/functions-scale/central-listener.png)

The unit of scaling is the function app. Scaling out in this case means adding more instances of a function app. Inversely, as compute demand is reduced, function app instances are removed. The number of instances is eventually scaled-down to zero when none are running. 

### Billing model

Billing for the Consumption plan is described in detail on the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions). Usage is reported per function app, only for time when code is being executed. The following are units for billing: 
* **Resource consumption in GB-s (gigabyte-seconds)** computed as a combination of memory size and execution time for all functions running in a Function App. 
* **Executions** counted each time a function is executed in response to an event, triggered by a binding.
