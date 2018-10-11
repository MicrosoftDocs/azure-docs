---
title: Azure Functions scale and hosting | Microsoft Docs
description: Learn how to choose between Azure Functions Consumption plan and App Service plan.
services: functions
documentationcenter: na
author: ggailey777
manager: jeconnoc
keywords: azure functions, functions,  consumption plan, app service plan, event processing, webhooks, dynamic compute, serverless architecture

ms.assetid: 5b63649c-ec7f-4564-b168-e0a74cb7e0f3
ms.service: azure-functions
ms.devlang: multiple
ms.topic: reference
ms.date: 08/09/2018
ms.author: glenga

ms.custom: H1Hack27Feb2017

---
# Azure Functions scale and hosting

Azure Functions runs in two different modes: Consumption plan and Azure App Service plan. The Consumption plan automatically allocates compute power when your code is running. Your app is scaled out when needed to handle load, and scaled down when code is not running. You don't have to pay for idle VMs or reserve capacity in advance. This article focuses on the Consumption plan, a [serverless](https://azure.microsoft.com/solutions/serverless/) app model. For details about how the dedicated App Service plan works, see the [Azure App Service plans in-depth overview](../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md).

> [!NOTE]  
> [Linux hosting](functions-create-first-azure-function-azure-cli-linux.md) is currently only available on an App Service plan.

If you aren't familiar with Azure Functions, see the [Azure Functions overview](functions-overview.md).

When you create a function app, you choose the hosting plan for functions in the app. In either plan, an instance of the *Azure Functions host* executes the functions. The type of plan controls:

* How host instances are scaled out.
* The resources that are available to each host.

> [!IMPORTANT]
> You must choose the type of hosting plan during the creation of the function app. You can't change it afterward.

On an App Service plan, you can scale between tiers to allocate different amount of resources. On the Consumption plan, Azure Functions automatically handles all resource allocation. 

## Consumption plan

When you're using a Consumption plan, instances of the Azure Functions host are dynamically added and removed based on the number of incoming events. This serverless plan scales automatically, and you're charged for compute resources only when your functions are running. On a Consumption plan, a function execution times out after a configurable period of time.

> [!NOTE]
> The default timeout for functions on a Consumption plan is 5 minutes. The value can be increased for the Function App up to a maximum of 10 minutes by changing the property `functionTimeout` in the [host.json](functions-host-json.md#functiontimeout) project file.

Billing is based on number of executions, execution time, and memory used. Billing is aggregated across all functions within a function app. For more information, see the [Azure Functions pricing page].

The Consumption plan is the default hosting plan and offers the following benefits:

* Pay only when your functions are running.
* Scale out automatically, even during periods of high load.

## App Service plan

In the dedicated App Service plan, your function apps run on dedicated VMs on Basic, Standard, Premium, and Isolated SKUs, which is the same as other App Service apps. Dedicated VMs are allocated to your function app, which means the functions host can be [always running](#always-on). App Service plans support Linux.

Consider an App Service plan in the following cases:

* You have existing, underutilized VMs that are already running other App Service instances.
* Your function apps run continuously, or nearly continuously. In this case, an App Service Plan can be more cost-effective.
* You need more CPU or memory options than what is provided on the Consumption plan.
* Your code needs to run longer than the maximum execution time allowed on the Consumption plan, which is up to 10 minutes.
* You require features that are only available on an App Service plan, such as support for App Service Environment, VNET/VPN connectivity, and larger VM sizes.
* You want to run your function app on Linux, or you want to provide a custom image on which to run your functions.

A VM decouples cost from number of executions, execution time, and memory used. As a result, you won't pay more than the cost of the VM instance that you allocate. For details about how the App Service plan works, see the [Azure App Service plans in-depth overview](../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md). 

With an App Service plan, you can manually scale out by adding more VM instances, or you can enable autoscale. For more information, see [Scale instance count manually or automatically](../monitoring-and-diagnostics/monitoring-autoscale-get-started.md?toc=%2fazure%2fapp-service%2ftoc.json). You can also scale up by choosing a different App Service plan. For more information, see [Scale up an app in Azure](../app-service/web-sites-scale.md). 

When running JavaScript functions on an App Service plan, you should choose a plan that has fewer vCPUs. For more information, see the [Choose single-core App Service plans](functions-reference-node.md#considerations-for-javascript-functions).  

<!-- Note: the portal links to this section via fwlink https://go.microsoft.com/fwlink/?linkid=830855 --> 
<a name="always-on"></a>
### Always On

If you run on an App Service plan, you should enable the **Always on** setting so that your function app runs correctly. On an App Service plan, the functions runtime goes idle after a few minutes of inactivity, so only HTTP triggers will "wake up" your functions. Always on is available only on an App Service plan. On a Consumption plan, the platform activates function apps automatically.

## What is my hosting plan

To determine the hosting plan used by your function app, see **App Service plan / pricing tier** in the **Overview** tab for the function app in the [Azure portal](https://portal.azure.com). For App Service plans, the pricing tier is also indicated. 

![View scaling plan in the portal](./media/functions-scale/function-app-overview-portal.png)

You can also use the Azure CLI to determine the plan, as follows:

```azurecli-interactive
appServicePlanId=$(az functionapp show --name <my_function_app_name> --resource-group <my_resource_group> --query appServicePlanId --output tsv)
az appservice plan list --query "[?id=='$appServicePlanId'].sku.tier" --output tsv
```  

When the output from this command is `dynamic`, your function app is in the Consumption plan. All other values indicate tiers of an App Service plan.

Even with Always On enabled, the execution timeout for individual functions is controlled by the `functionTimeout` setting in the [host.json](functions-host-json.md#functiontimeout) project file.

## Storage account requirements

On either a Consumption plan or an App Service plan, a function app requires a general Azure Storage account, which supports Azure Blob, Queue, Files, and Table storage. This is because Functions relies on Azure Storage for operations such as managing triggers and logging function executions, but some storage accounts do not support queues and tables. These accounts, which include blob-only storage accounts (including premium storage) and general-purpose storage accounts with zone-redundant storage replication, are filtered-out from your existing **Storage Account** selections when you create a function app.

<!-- JH: Does using a Premium Storage account improve perf? -->

To learn more about storage account types, see [Introducing the Azure Storage services](../storage/common/storage-introduction.md#azure-storage-services).

## How the Consumption plan works

In the Consumption plan, the scale controller automatically scales CPU and memory resources by adding additional instances of the Functions host, based on the number of events that its functions are triggered on. Each instance of the Functions host is limited to 1.5 GB of memory.  An instance of the host is the function app, meaning all functions within a function app share resource within an instance and scale at the same time. Function apps that share the same Consumption plan are scaled independently.  

When you use the Consumption hosting plan, function code files are stored on Azure Files shares on the function's main storage account. When you delete the main storage account of the function app, the function code files are deleted and cannot be recovered.

> [!NOTE]
> When you're using a blob trigger on a Consumption plan, there can be up to a 10-minute delay in processing new blobs. This delay occurs when a function app has gone idle. After the function app is running, blobs are processed immediately. To avoid this cold-start delay, use an App Service plan with **Always On** enabled, or use the Event Grid trigger. For more information, see [the blob trigger binding reference article](functions-bindings-storage-blob.md#trigger).

### Runtime scaling

Azure Functions uses a component called the *scale controller* to monitor the rate of events and determine whether to scale out or scale in. The scale controller uses heuristics for each trigger type. For example, when you're using an Azure Queue storage trigger, it scales based on the queue length and the age of the oldest queue message.

The unit of scale is the function app. When the function app is scaled out, additional resources are allocated to run multiple instances of the Azure Functions host. Conversely, as compute demand is reduced, the scale controller removes function host instances. The number of instances is eventually scaled down to zero when no functions are running within a function app.

![Scale controller monitoring events and creating instances](./media/functions-scale/central-listener.png)

### Understanding scaling behaviors

Scaling can vary on a number of factors, and scale differently based on the trigger and language selected. However there are a few aspects of scaling that exist in the system today:

* A single function app only scales up to a maximum of 200 instances. A single instance may process more than one message or request at a time though, so there isn't a set limit on number of concurrent executions.
* New instances will only be allocated at most once every 10 seconds.

Different triggers may also have different scaling limits as well as documented below:

* [Event Hub](functions-bindings-event-hubs.md#trigger---scaling)

### Best practices and patterns for scalable apps

There are many aspects of a function app that will impact how well it will scale, including host configuration, runtime footprint, and resource efficiency.  For more information, see the [scalability section of the performance considerations article](functions-best-practices.md#scalability-best-practices). You should also be aware of how connections behave as your function app scales. For more information, see [How to manage connections in Azure Functions](manage-connections.md).

### Billing model

Billing for the Consumption plan is described in detail on the [Azure Functions pricing page]. Usage is aggregated at the function app level and counts only the time that function code is executed. The following are units for billing:

* **Resource consumption in gigabyte-seconds (GB-s)**. Computed as a combination of memory size and execution time for all functions within a function app. 
* **Executions**. Counted each time a function is executed in response to an event trigger.

[Azure Functions pricing page]: https://azure.microsoft.com/pricing/details/functions
