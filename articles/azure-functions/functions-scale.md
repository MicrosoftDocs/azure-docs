---
title: Azure Functions scale and hosting 
description: Learn how to choose between Azure Functions Consumption plan and Premium plan.
ms.assetid: 5b63649c-ec7f-4564-b168-e0a74cb7e0f3
ms.topic: conceptual
ms.date: 03/27/2019

ms.custom: H1Hack27Feb2017

---
# Azure Functions scale and hosting

When you create a function app in Azure, you must choose a hosting plan for your app. There are three hosting plans available for Azure Functions: [Consumption plan](#consumption-plan), [Premium plan](#premium-plan), and [Dedicated (App Service) plan](#app-service-plan).

The hosting plan you choose dictates the following behaviors:

* How your function app is scaled.
* The resources available to each function app instance.
* Support for advanced features, such as Azure Virtual Network connectivity.

Both Consumption and Premium plans automatically add compute power when your code is running. Your app is scaled out when needed to handle load, and scaled in when code stops running. For the Consumption plan, you also don't have to pay for idle VMs or reserve capacity in advance.  

Premium plan provides additional features, such as premium compute instances, the ability to keep instances warm indefinitely, and VNet connectivity.

App Service plan allows you to take advantage of dedicated infrastructure, which you manage. Your function app doesn't scale based on events, which means is never scales in to zero. (Requires that [Always on](#always-on) is enabled.)

## Hosting plan support

Feature support falls into the following two categories:

* _Generally available (GA)_: fully supported and approved for production use.
* _Preview_: not yet fully supported nor approved for production use.

The following table indicates the current level of support for the three hosting plans, when running on either Windows or Linux:

| | Consumption plan | Premium plan | Dedicated plan |
|-|:----------------:|:------------:|:----------------:|
| Windows | GA | GA | GA |
| Linux | GA | GA | GA |

## Consumption plan

When you're using the Consumption plan, instances of the Azure Functions host are dynamically added and removed based on the number of incoming events. This serverless plan scales automatically, and you're charged for compute resources only when your functions are running. On a Consumption plan, a function execution times out after a configurable period of time.

Billing is based on number of executions, execution time, and memory used. Billing is aggregated across all functions within a function app. For more information, see the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/).

The Consumption plan is the default hosting plan and offers the following benefits:

* Pay only when your functions are running
* Scale out automatically, even during periods of high load

Function apps in the same region can be assigned to the same Consumption plan. There's no downside or impact to having multiple apps running in the same Consumption plan. Assigning multiple apps to the same Consumption plan has no impact on resilience, scalability, or reliability of each app.

To learn more about how to estimate costs when running in a Consumption plan, see [Understanding Consumption plan costs](functions-consumption-costs.md).

## <a name="premium-plan"></a>Premium plan

When you're using the Premium plan, instances of the Azure Functions host are added and removed based on the number of incoming events just like the Consumption plan.  Premium plan supports the following features:

* Perpetually warm instances to avoid any cold start
* VNet connectivity
* Unlimited execution duration (60 minutes guaranteed)
* Premium instance sizes (one core, two core, and four core instances)
* More predictable pricing
* High-density app allocation for plans with multiple function apps

Information on how you can configure these options can be found in the [Azure Functions Premium plan document](functions-premium-plan.md).

Instead of billing per execution and memory consumed, billing for the Premium plan is based on the number of core seconds and memory used across needed and pre-warmed instances. At least one instance must be warm at all times per plan. This means that there is a minimum monthly cost per active plan, regardless of the number of executions. Keep in mind that all function apps in a Premium plan share pre-warmed and active instances.

Consider the Azure Functions Premium plan in the following situations:

* Your function apps run continuously, or nearly continuously.
* You have a high number of small executions and have a high execution bill but low GB second bill in the Consumption plan.
* You need more CPU or memory options than what is provided by the Consumption plan.
* Your code needs to run longer than the [maximum execution time allowed](#timeout) on the Consumption plan.
* You require features that are only available on a Premium plan, such as virtual network connectivity.

When running JavaScript functions on a Premium plan, you should choose an instance that has fewer vCPUs. For more information, see the [Choose single-core Premium plans](functions-reference-node.md#considerations-for-javascript-functions).  

## <a name="app-service-plan"></a>Dedicated (App Service) plan

Your function apps can also run on the same dedicated VMs as other App Service apps (Basic, Standard, Premium, and Isolated SKUs).

Consider an App Service plan in the following situations:

* You have existing, underutilized VMs that are already running other App Service instances.
* You want to provide a custom image on which to run your functions.

You pay the same for function apps in an App Service Plan as you would for other App Service resources, like web apps. For details about how the App Service plan works, see the [Azure App Service plans in-depth overview](../app-service/overview-hosting-plans.md).

With an App Service plan, you can manually scale out by adding more VM instances. You can also enable autoscale. For more information, see [Scale instance count manually or automatically](../azure-monitor/platform/autoscale-get-started.md?toc=%2fazure%2fapp-service%2ftoc.json). You can also scale up by choosing a different App Service plan. For more information, see [Scale up an app in Azure](../app-service/manage-scale-up.md). 

When running JavaScript functions on an App Service plan, you should choose a plan that has fewer vCPUs. For more information, see [Choose single-core App Service plans](functions-reference-node.md#choose-single-vcpu-app-service-plans). 
<!-- Note: the portal links to this section via fwlink https://go.microsoft.com/fwlink/?linkid=830855 --> 

### <a name="always-on"></a> Always On

If you run on an App Service plan, you should enable the **Always on** setting so that your function app runs correctly. On an App Service plan, the functions runtime goes idle after a few minutes of inactivity, so only HTTP triggers will "wake up" your functions. Always on is available only on an App Service plan. On a Consumption plan, the platform activates function apps automatically.

[!INCLUDE [Timeout Duration section](../../includes/functions-timeout-duration.md)]


Even with Always On enabled, the execution timeout for individual functions is controlled by the `functionTimeout` setting in the [host.json](functions-host-json.md#functiontimeout) project file.

## Determine the hosting plan of an existing application

To determine the hosting plan used by your function app, see **App Service plan / pricing tier** in the **Overview** tab for the function app in the [Azure portal](https://portal.azure.com). For App Service plans, the pricing tier is also indicated.

![View scaling plan in the portal](./media/functions-scale/function-app-overview-portal.png)

You can also use the Azure CLI to determine the plan, as follows:

```azurecli-interactive
appServicePlanId=$(az functionapp show --name <my_function_app_name> --resource-group <my_resource_group> --query appServicePlanId --output tsv)
az appservice plan list --query "[?id=='$appServicePlanId'].sku.tier" --output tsv
```  

When the output from this command is `dynamic`, your function app is in the Consumption plan. When the output from this command is `ElasticPremium`, your function app is in the Premium plan. All other values indicate different tiers of an App Service plan.

## Storage account requirements

On any plan, a function app requires a general Azure Storage account, which supports Azure Blob, Queue, Files, and Table storage. This is because Functions relies on Azure Storage for operations such as managing triggers and logging function executions, but some storage accounts do not support queues and tables. These accounts, which include blob-only storage accounts (including premium storage) and general-purpose storage accounts with zone-redundant storage replication, are filtered-out from your existing **Storage Account** selections when you create a function app.

The same storage account used by your function app can also be used by your triggers and bindings to store your application data. However, for storage-intensive operations, you should use a separate storage account.  

It's certainly possible for multiple function apps to share the same storage account without any issues. (A good example of this is when you develop multiple apps in your local environment using the Azure Storage Emulator, which acts like one storage account.) 

<!-- JH: Does using a Premium Storage account improve perf? -->

To learn more about storage account types, see [Introducing the Azure Storage services](../storage/common/storage-introduction.md#core-storage-services).

## How the consumption and premium plans work

In the Consumption and Premium plans, the Azure Functions infrastructure scales CPU and memory resources by adding additional instances of the Functions host, based on the number of events that its functions are triggered on. Each instance of the Functions host in the Consumption plan is limited to 1.5 GB of memory and one CPU.  An instance of the host is the entire function app, meaning all functions within a function app share resource within an instance and scale at the same time. Function apps that share the same Consumption plan are scaled independently.  In the Premium plan, your plan size will determine the available memory and CPU for all apps in that plan on that instance.  

Function code files are stored on Azure Files shares on the function's main storage account. When you delete the main storage account of the function app, the function code files are deleted and cannot be recovered.

### Runtime scaling

Azure Functions uses a component called the *scale controller* to monitor the rate of events and determine whether to scale out or scale in. The scale controller uses heuristics for each trigger type. For example, when you're using an Azure Queue storage trigger, it scales based on the queue length and the age of the oldest queue message.

The unit of scale for Azure Functions is the function app. When the function app is scaled out, additional resources are allocated to run multiple instances of the Azure Functions host. Conversely, as compute demand is reduced, the scale controller removes function host instances. The number of instances is eventually *scaled in* to zero when no functions are running within a function app.

![Scale controller monitoring events and creating instances](./media/functions-scale/central-listener.png)

### Understanding scaling behaviors

Scaling can vary on a number of factors, and scale differently based on the trigger and language selected. There are a few intricacies of scaling behaviors to be aware of:

* A single function app only scales out to a maximum of 200 instances. A single instance may process more than one message or request at a time though, so there isn't a set limit on number of concurrent executions.
* For HTTP triggers, new instances are allocated, at most, once per second.
* For non-HTTP triggers, new instances are allocated, at most, once every 30 seconds. Scaling is faster when running in a [Premium plan](#premium-plan).
* For Service Bus triggers, use _Manage_ rights on resources for the most efficient scaling. With _Listen_ rights, scaling isn't as accurate because the queue length can't be used to inform scaling decisions. To learn more about setting rights in Service Bus access policies, see [Shared Access Authorization Policy](../service-bus-messaging/service-bus-sas.md#shared-access-authorization-policies).
* For Event Hub triggers, see the [scaling guidance](functions-bindings-event-hubs-trigger.md#scaling) in the reference article. 

### Best practices and patterns for scalable apps

There are many aspects of a function app that will impact how well it will scale, including host configuration, runtime footprint, and resource efficiency.  For more information, see the [scalability section of the performance considerations article](functions-best-practices.md#scalability-best-practices). You should also be aware of how connections behave as your function app scales. For more information, see [How to manage connections in Azure Functions](manage-connections.md).

For additional information on scaling in Python and Node.js, see [Azure Functions Python developer guide - Scaling and concurrency](functions-reference-python.md#scaling-and-concurrency) and [Azure Functions Node.js developer guide - Scaling and concurrency](functions-reference-node.md#scaling-and-concurrency).

### Billing model

Billing for the different plans is described in detail on the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/). Usage is aggregated at the function app level and counts only the time that function code is executed. The following are units for billing:

* **Resource consumption in gigabyte-seconds (GB-s)**. Computed as a combination of memory size and execution time for all functions within a function app. 
* **Executions**. Counted each time a function is executed in response to an event trigger.

Useful queries and information on how to understand your consumption bill can be found [on the billing FAQ](https://github.com/Azure/Azure-Functions/wiki/Consumption-Plan-Cost-Billing-FAQ).

[Azure Functions pricing page]: https://azure.microsoft.com/pricing/details/functions

## Hosting plans comparison

The following comparison table shows all important aspects to help the decision of Azure Functions App hosting plan choice:

### Plan summary

|[Consumption plan](#consumption-plan)|[Premium plan](#premium-plan)|[Dedicated (App Service) plan](#app-service-plan)<sup>1</sup>|[Isolated Service Plan (App Service Environment)](#app-service-plan)<sup>1</sup>|[Kubernetes](../aks/quotas-skus-regions.md)|
| --- | --- | --- | --- | --- |
|Scale automatically and only pay for compute resources when your functions are running. On the Consumption plan, instances of the Functions host are dynamically added and removed based on the number of incoming events. <ul><li>Default hosting plan</li><li>Pay only when your functions are running.</li><li>Scale out automatically, even during periods of high load</li></ul>|While automatically scaling based on demand, use pre-warmed workers to run applications with no delay after being idle, run on more powerful instances, and connect to VNETs. Consider the Azure Functions Premium plan in the following situations,  in addition to all features of the App Service plan: <ul><li>Your function apps run continuously, or nearly continuously.</li><li>You have a high number of small executions and have a high execution bill but low GB second bill in the Consumption plan.</li><li>You need more CPU or memory options than what is provided by the Consumption plan.</li><li>Your code needs to run longer than the maximum execution time allowed on the Consumption plan.</li><li>You require features that are only avail [able on a Premium plan, such as virtual network connectivity.</li></ul>|Run your functions within an App Service plan at regular App Service plan rates. Good fit for long running operations, as well as when more predictive scaling and costs are required. Consider an App Service plan in the following situations:<ul><li>You have existing, underutilized VMs that are already running other App Service instances.</li><li>You want to provide a custom image on which to run your functions.</li></ul>|The Azure App Service Environment is an Azure App Service feature that provides a fully isolated and dedicated environment for securely running App Service apps at high scale. App Service environments (ASEs) are appropriate for application workloads that require: <ul><li>Very high scale.</li><li>Isolation and secure network access.</li><li>High memory utilization.</li></ul>|Kubernetes (recommended in [AKS](../aks/intro-kubernetes.md)) provides a fully isolated and dedicated environment running on top of the Kubernetes platform.  Kubernetes is appropriate for application workloads that require: <ul><li>Custom hardware requirements.</li><li>Isolation and secure network access.</li><li>Ability to run in hybrid or multi-cloud environment.</li><li>Run alongside existing Kubernetes applications and services.</li></ul>|

### Operating System/Runtime

|  | [Consumption plan](#consumption-plan) | [Premium plan](#premium-plan) | [Dedicated (App Service) plan](#app-service-plan)<sup>1</sup> | [Isolated Service Plan (App Service Environment)](#app-service-plan)<sup>1</sup> | [Kubernetes](../aks/quotas-skus-regions.md) |
| --- | --- | --- | --- | --- | --- |
|**Linux: code-only**<br/>Linux is the only supported operating system for the Python runtime stack.  |<ul><li>.NET Core</li><li>Node.js</li><li>Java</li><li>Python</li></ul>  |<ul><li>.NET Core</li><li>Node.js</li><li>Java</li><li>Python</li></ul> |<ul><li>.NET Core</li><li>Node.js</li><li>Java</li><li>Python</li></ul>  |<ul><li>.NET Core</li><li>Node.js</li><li>Java</li><li>Python</li></ul> |n/a  |
| **Windows: code-only**<br/>Windows is the only supported operating system for the PowerShell runtime stack.  |<ul><li>.NET Core</li><li>Node.js</li><li>Java</li><li>PowerShell Core</li></ul> |<ul><li>.NET Core</li><li>Node.js</li><li>Java</li><li>PowerShell Core</li></ul> |<ul><li>.NET Core</li><li>Node.js</li><li>Java</li><li>PowerShell Core</li></ul> |<ul><li>.NET Core</li><li>Node.js</li><li>Java</li><li>PowerShell Core</li></ul> |n/a  |
| **Linux: Docker container**<br/> Linux is the only supported operating system for Docker containers.  |No support.  |<ul><li>.NET Core</li><li>Node.js</li><li>Java</li><li>PowerShell Core</li><li>Python</li></ul>  |<ul><li>.NET Core</li><li>Node.js</li><li>Java</li><li>PowerShell Core</li><li>Python</li></ul> |<ul><li>.NET Core</li><li>Node.js</li><li>Java</li><li>PowerShell Core</li><li>Python</li></ul>  |<ul><li>.NET Core</li><li>Node.js</li><li>Java</li><li>PowerShell Core</li><li>Python</li></ul>  |
| **Windows: Docker container**. |No support.  |No support.  |No support.  |No support.  |No support.  |

### Scale
| | [Consumption plan](#consumption-plan) | [Premium plan](#premium-plan) | [Dedicated (App Service) plan](#app-service-plan)<sup>1</sup> | [Isolated Service Plan (App Service Environment)](#app-service-plan)<sup>1</sup> | [Kubernetes](../aks/quotas-skus-regions.md) |
| --- | --- | --- | --- | --- | --- |
| Scale out | Event driven. Scale out automatically, even during periods of high load. Azure Functions infrastructure scales CPU and memory resources by adding additional instances of the Functions host, based on the number of events that its functions are triggered on. | Event driven. Scale out automatically, even during periods of high load. Azure Functions infrastructure scales CPU and memory resources by adding additional instances of the Functions host, based on the number of events that its functions are triggered on. | Manual/autoscale | Manual/autoscale | [KEDA](https://keda.sh) - Kubernetes-based event driven autoscale |
| Max instances | 200 | 100 | 10-20 | 100| Depends on cluster |

### Cold Start

| [Consumption plan](#consumption-plan) | [Premium plan](#premium-plan) | [Dedicated (App Service) plan](#app-service-plan)<sup>1</sup> | [Isolated Service Plan (App Service Environment)](#app-service-plan)<sup>1</sup> | [Kubernetes](../aks/quotas-skus-regions.md) |
| --- | --- | --- | --- | --- |
| Instead of starting from scratch every time, we’ve implemented a way to keep a pool of servers warm and draw workers from that pool. What this means is that at any point in time there are idle workers that have been preconfigured with the Functions runtime up and running. Making these “pre-warmed sites” happen has given us measurable  improvements on our cold start times.  | Perpetually warm instances to avoid any cold start. | When using Azure Functions in the dedicated plan, the Functions host is always running, which means that cold start isn’t really an issue. |When using Azure Functions in the dedicated plan, the Functions host is always running, which means that cold start isn’t really an issue. | Depends on KEDA configuration. Apps can be configured to always run and never have cold start, or configured to scale to zero which would cause cold start on new events. |

### Features limits

| Feature | [Consumption plan](#consumption-plan) | [Premium plan](#premium-plan) | [Dedicated (App Service) plan](#app-service-plan)<sup>1</sup> | [Isolated Service Plan (App Service Environment)](#app-service-plan)<sup>1</sup> | [Kubernetes](../aks/quotas-skus-regions.md) |
| --- | --- | --- | --- | --- | --- |
|Default [timeout duration](#timeout) (min) |5 | 30 |30<sup>2</sup> | 30 | 30 |
|Max [timeout duration](#timeout) (min) |10 | unbounded<sup>8</sup> | unbounded<sup>3</sup> | unbounded | unbounded |
| Max outbound connections (per instance) | 600 active (1200 total) | unbounded | unbounded | unbounded | unbounded |
| Max request size (MB)<sup>4</sup> | 100 | 100 | 100 | 100 | Depends on cluster |
| Max query string length<sup>4</sup> | 4096 | 4096 | 4096 | 4096 | Depends on cluster |
| Max request URL length<sup>4</sup> | 8192 | 8192 | 8192 | 8192 | Depends on cluster |
|[ACU](../virtual-machines/windows/acu.md) per instance | 100 | 210-840 | 100-840 |Workers are roles that host customer apps. Workers are available in three fixed sizes: One vCPU/3.5 GB RAM; Two vCPU/7 GB RAM; Four vCPU/14 GB RAM | [AKS pricing](https://azure.microsoft.com/pricing/details/container-service/) |
| Max memory (GB per instance) | 1.5 | 3.5-14 | 1.75-14 | 3.5 - 14 | Any node is supported |
| Function apps per plan |100 |100 |unbounded<sup>5</sup> | unbounded | unbounded |
| [App Service plans](../app-service/overview-hosting-plans.md) | 100 per [region](https://azure.microsoft.com/global-infrastructure/regions/) |100 per resource group |100 per resource group | - | - |
| Storage<sup>6</sup> |1 GB |250 GB |50-1000 GB | 1 TB | n/a |
| Custom domains per app</a> |500<sup>7</sup> |500 |500 | 500 | n/a |
| Custom domain [SSL support](../app-service/configure-ssl-bindings.md) |unbounded SNI SSL connection included | unbounded SNI SSL and 1 IP SSL connections included |unbounded SNI SSL and 1 IP SSL connections included | unbounded SNI SSL and 1 IP SSL connections included | n/a |

### Networking limits

| Feature | [Consumption plan](#consumption-plan) | [Premium plan](#premium-plan) | [Dedicated (App Service) plan](#app-service-plan)<sup>1</sup> | [Isolated Service Plan (App Service Environment)](#app-service-plan)<sup>1</sup> | [Kubernetes](../aks/quotas-skus-regions.md) |
| --- | --- | --- | --- | --- | --- |
| Inbound IP restrictions & private site access |Yes |Yes |Yes | Yes | Yes |
| Virtual network integration |No |Yes (Regional) |Yes (Regional and Gateway) | Yes | Yes |
| Virtual network triggers (non-HTTP) |Yes |Yes |Yes | Yes | Yes |
| Hybrid connections (Windows only) |No |Yes |Yes | Yes | Yes |
| Outbound IP restrictions |No |No |Yes | Yes | Yes |
| Regional virtual network integration |No |Yes |Yes | Yes | Yes |

### Billing

| [Consumption plan](#consumption-plan) | [Premium plan](#premium-plan) | [Dedicated (App Service) plan](#app-service-plan)<sup>1</sup> | [Isolated Service Plan (App Service Environment)](#app-service-plan)<sup>1</sup> | [Kubernetes](../aks/quotas-skus-regions.md) |
| --- | --- | --- | --- | --- |
|Pay only when your functions are running. Billing is based on number of executions, execution time, and memory used. |More predictable pricing. Premium plan is based on the number of core seconds and memory used across needed and pre-warmed instances. At least one instance must be warm at all times per plan. |You pay the same for function apps in an App Service Plan as you would for other App Service resources, like web apps. | There is a flat monthly rate for an ASE that pays for the infrastructure and doesn't change with the size of the ASE. In addition, there is a cost per App Service plan vCPU. All apps hosted in an ASE are in the Isolated pricing SKU. |User would be paying for AKS.  Functions just run as an application workload on top of their cluster - potentially alongside other apps. |  

<sup>1</sup> For specific limits for the various App Service plan options, see the [App Service plan limits](../azure-resource-manager/management/azure-subscription-service-limits.md#app-service-limits).  
<sup>2</sup> By default, the timeout for the Functions 1.x runtime in an App Service plan is unbounded.  
<sup>3</sup> Requires the App Service plan be set to [Always On](#always-on). Pay at standard [rates](https://azure.microsoft.com/pricing/details/app-service/).  
<sup>4</sup> These limits are [set in the host](https://github.com/Azure/azure-functions-host/blob/dev/src/WebJobs.Script.WebHost/web.config).  
<sup>5</sup> The actual number of function apps that you can host depends on the activity of the apps, the size of the machine instances, and the corresponding resource utilization.  
<sup>6</sup> The storage limit is the total content size in temporary storage across all apps in the same App Service plan. Consumption plan uses Azure Files for temporary storage.  
<sup>7</sup> When your function app is hosted in a [Consumption plan](#consumption-plan), only the CNAME option is supported. For function apps in a [Premium plan](#premium-plan) or an [App Service plan](#app-service-plan), you can map a custom domain using either a CNAME or an A record.  
<sup>8</sup> Guaranteed for up to 60 minutes.


