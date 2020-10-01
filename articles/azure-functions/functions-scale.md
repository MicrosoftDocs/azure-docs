---
title: Azure Functions scale and hosting 
description: Learn how to choose between Azure Functions Consumption plan and Premium plan.
ms.assetid: 5b63649c-ec7f-4564-b168-e0a74cb7e0f3
ms.topic: conceptual
ms.date: 08/17/2020

ms.custom: H1Hack27Feb2017

---
# Azure Functions scale and hosting

When you create a function app in Azure, you must choose a hosting plan for your app. There are three basic hosting plans available for Azure Functions: [Consumption plan](#consumption-plan), [Premium plan](#premium-plan), and [Dedicated (App Service) plan](#app-service-plan). All hosting plans are generally available (GA) on both Linux and Windows virtual machines.

The hosting plan you choose dictates the following behaviors:

* How your function app is scaled.
* The resources available to each function app instance.
* Support for advanced features, such as Azure Virtual Network connectivity.

Both Consumption and Premium plans automatically add compute power when your code is running. Your app is scaled out when needed to handle load, and scaled in when code stops running. For the Consumption plan, you also don't have to pay for idle VMs or reserve capacity in advance.  

Premium plan provides additional features, such as premium compute instances, the ability to keep instances warm indefinitely, and VNet connectivity.

App Service plan allows you to take advantage of dedicated infrastructure, which you manage. Your function app doesn't scale based on events, which means is never scales in to zero. (Requires that [Always on](#always-on) is enabled.)

For a detailed comparison between the various hosting plans (including Kubernetes-based hosting), see the [Hosting plans comparison section](#hosting-plans-comparison).

## Consumption plan

When you're using the Consumption plan, instances of the Azure Functions host are dynamically added and removed based on the number of incoming events. This serverless plan scales automatically, and you're charged for compute resources only when your functions are running. On a Consumption plan, a function execution times out after a configurable period of time.

Billing is based on number of executions, execution time, and memory used. Usage is aggregated across all functions within a function app. For more information, see the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/).

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

To learn how you can create a function app in a Premium plan, see [Azure Functions Premium plan](functions-premium-plan.md).

Instead of billing per execution and memory consumed, billing for the Premium plan is based on the number of core seconds and memory allocated across instances.  There is no execution charge with the Premium plan. At least one instance must be allocated at all times per plan. This results in a minimum monthly cost per active plan, regardless if the function is active or idle. Keep in mind that all function apps in a Premium plan share allocated instances.

Consider the Azure Functions Premium plan in the following situations:

* Your function apps run continuously, or nearly continuously.
* You have a high number of small executions and have a high execution bill but low GB second bill in the Consumption plan.
* You need more CPU or memory options than what is provided by the Consumption plan.
* Your code needs to run longer than the [maximum execution time allowed](#timeout) on the Consumption plan.
* You require features that are only available on a Premium plan, such as virtual network connectivity. 

## <a name="app-service-plan"></a>Dedicated (App Service) plan

Your function apps can also run on the same dedicated VMs as other App Service apps (Basic, Standard, Premium, and Isolated SKUs).

Consider an App Service plan in the following situations:

* You have existing, underutilized VMs that are already running other App Service instances.
* You want to provide a custom image on which to run your functions.

You pay the same for function apps in an App Service Plan as you would for other App Service resources, like web apps. For details about how the App Service plan works, see the [Azure App Service plans in-depth overview](../app-service/overview-hosting-plans.md).

Using an App Service plan, you can manually scale out by adding more VM instances. You can also enable autoscale, though autoscale will be slower than the elastic scale of the Premium plan. For more information, see [Scale instance count manually or automatically](../azure-monitor/platform/autoscale-get-started.md?toc=%2fazure%2fapp-service%2ftoc.json). You can also scale up by choosing a different App Service plan. For more information, see [Scale up an app in Azure](../app-service/manage-scale-up.md). 

When running JavaScript functions on an App Service plan, you should choose a plan that has fewer vCPUs. For more information, see [Choose single-core App Service plans](functions-reference-node.md#choose-single-vcpu-app-service-plans). 
<!-- Note: the portal links to this section via fwlink https://go.microsoft.com/fwlink/?linkid=830855 --> 

Running in an [App Service Environment](../app-service/environment/intro.md) (ASE) lets you fully isolate your functions and take advantage of higher number of instances than an App Service Plan.

### <a name="always-on"></a> Always On

If you run on an App Service plan, you should enable the **Always on** setting so that your function app runs correctly. On an App Service plan, the functions runtime goes idle after a few minutes of inactivity, so only HTTP triggers will "wake up" your functions. Always on is available only on an App Service plan. On a Consumption plan, the platform activates function apps automatically.

[!INCLUDE [Timeout Duration section](../../includes/functions-timeout-duration.md)]


Even with Always On enabled, the execution timeout for individual functions is controlled by the `functionTimeout` setting in the [host.json](functions-host-json.md#functiontimeout) project file.

## Determine the hosting plan of an existing application

To determine the hosting plan used by your function app, see **App Service plan** in the **Overview** tab for the function app in the [Azure portal](https://portal.azure.com). To see the pricing tier, select the name of the **App Service Plan**, and then select **Properties** from the left pane.

![View scaling plan in the portal](./media/functions-scale/function-app-overview-portal.png)

You can also use the Azure CLI to determine the plan, as follows:

```azurecli-interactive
appServicePlanId=$(az functionapp show --name <my_function_app_name> --resource-group <my_resource_group> --query appServicePlanId --output tsv)
az appservice plan list --query "[?id=='$appServicePlanId'].sku.tier" --output tsv
```  

When the output from this command is `dynamic`, your function app is in the Consumption plan. When the output from this command is `ElasticPremium`, your function app is in the Premium plan. All other values indicate different tiers of an App Service plan.

## Storage account requirements

On any plan, a function app requires a general Azure Storage account, which supports Azure Blob, Queue, Files, and Table storage. This is because Azure Functions relies on Azure Storage for operations such as managing triggers and logging function executions, but some storage accounts don't support queues and tables. These accounts, which include blob-only storage accounts (including premium storage) and general-purpose storage accounts with zone-redundant storage replication, are filtered-out from your existing **Storage Account** selections when you create a function app.

The same storage account used by your function app can also be used by your triggers and bindings to store your application data. However, for storage-intensive operations, you should use a separate storage account.  

It's possible for multiple function apps to share the same storage account without any issues. (A good example of this is when you develop multiple apps in your local environment using the Azure Storage Emulator, which acts like one storage account.) 

<!-- JH: Does using a Premium Storage account improve perf? -->

To learn more about storage account types, see [Introducing the Azure Storage services](../storage/common/storage-introduction.md#core-storage-services).

### In Region Data Residency

When necessary for all customer data to remain within a single region, the storage account associated with the function app must be one with [in region redundancy](../storage/common/storage-redundancy.md).  An in-region redundant storage account would also need to be used with [Azure Durable Functions](./durable/durable-functions-perf-and-scale.md#storage-account-selection) for Durable Functions.

Other platform-managed customer data will only be stored within the region when hosting in an Internal Load Balancer App Service Environment (or ILB ASE).  Details can be found in [ASE zone redundancy](../app-service/environment/zone-redundancy.md#in-region-data-residency).

## How the Consumption and Premium plans work

In the Consumption and Premium plans, the Azure Functions infrastructure scales CPU and memory resources by adding additional instances of the Functions host, based on the number of events that its functions are triggered on. Each instance of the Functions host in the Consumption plan is limited to 1.5 GB of memory and one CPU.  An instance of the host is the entire function app, meaning all functions within a function app share resource within an instance and scale at the same time. Function apps that share the same Consumption plan are scaled independently.  In the Premium plan, your plan size will determine the available memory and CPU for all apps in that plan on that instance.  

Function code files are stored on Azure Files shares on the function's main storage account. When you delete the main storage account of the function app, the function code files are deleted and cannot be recovered.

### Runtime scaling

Azure Functions uses a component called the *scale controller* to monitor the rate of events and determine whether to scale out or scale in. The scale controller uses heuristics for each trigger type. For example, when you're using an Azure Queue storage trigger, it scales based on the queue length and the age of the oldest queue message.

The unit of scale for Azure Functions is the function app. When the function app is scaled out, additional resources are allocated to run multiple instances of the Azure Functions host. Conversely, as compute demand is reduced, the scale controller removes function host instances. The number of instances is eventually *scaled in* to zero when no functions are running within a function app.

![Scale controller monitoring events and creating instances](./media/functions-scale/central-listener.png)

### Cold Start

After your function app has been idle for a number of minutes, the platform may scale the number of instances on which your app runs down to zero. The next request has the added latency of scaling from zero to one. This latency is referred to as a _cold start_. The number of dependencies that must be loaded by your function app can impact the cold start time. Cold start is more of an issue for  synchronous operations, such as HTTP triggers that must return a response. If cold starts are impacting your functions, consider running in a Premium plan or in a Dedicated plan with Always on enabled.   

### Understanding scaling behaviors

Scaling can vary on a number of factors, and scale differently based on the trigger and language selected. There are a few intricacies of scaling behaviors to be aware of:

* A single function app only scales out to a maximum of 200 instances. A single instance may process more than one message or request at a time though, so there isn't a set limit on number of concurrent executions.  You can [specify a lower maximum](#limit-scale-out) to throttle scale as required.
* For HTTP triggers, new instances are allocated, at most, once per second.
* For non-HTTP triggers, new instances are allocated, at most, once every 30 seconds. Scaling is faster when running in a [Premium plan](#premium-plan).
* For Service Bus triggers, use _Manage_ rights on resources for the most efficient scaling. With _Listen_ rights, scaling isn't as accurate because the queue length can't be used to inform scaling decisions. To learn more about setting rights in Service Bus access policies, see [Shared Access Authorization Policy](../service-bus-messaging/service-bus-sas.md#shared-access-authorization-policies).
* For Event Hub triggers, see the [scaling guidance](functions-bindings-event-hubs-trigger.md#scaling) in the reference article. 

### Limit scale out

You may wish to restrict the number of instances an app scales out to.  This is most common for cases where a downstream component like a database has limited throughput.  By default, consumption plan functions will scale out to as many as 200 instances, and premium plan functions will scale out to as many as 100 instances.  You can specify a lower maximum for a specific app by modifying the `functionAppScaleLimit` value.  The `functionAppScaleLimit` can be set to 0 or null for unrestricted, or a valid value between 1 and the app maximum.

```azurecli
az resource update --resource-type Microsoft.Web/sites -g <resource_group> -n <function_app_name>/config/web --set properties.functionAppScaleLimit=<scale_limit>
```

### Best practices and patterns for scalable apps

There are many aspects of a function app that will impact how well it will scale, including host configuration, runtime footprint, and resource efficiency.  For more information, see the [scalability section of the performance considerations article](functions-best-practices.md#scalability-best-practices). You should also be aware of how connections behave as your function app scales. For more information, see [How to manage connections in Azure Functions](manage-connections.md).

For more information on scaling in Python and Node.js, see [Azure Functions Python developer guide - Scaling and concurrency](functions-reference-python.md#scaling-and-concurrency) and [Azure Functions Node.js developer guide - Scaling and concurrency](functions-reference-node.md#scaling-and-concurrency).

### Billing model

Billing for the different plans is described in detail on the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/). Usage is aggregated at the function app level and counts only the time that function code is executed. The following are units for billing:

* **Resource consumption in gigabyte-seconds (GB-s)**. Computed as a combination of memory size and execution time for all functions within a function app. 
* **Executions**. Counted each time a function is executed in response to an event trigger.

Useful queries and information on how to understand your consumption bill can be found [on the billing FAQ](https://github.com/Azure/Azure-Functions/wiki/Consumption-Plan-Cost-Billing-FAQ).

[Azure Functions pricing page]: https://azure.microsoft.com/pricing/details/functions

## Hosting plans comparison

The following comparison table shows all important aspects to help the decision of Azure Functions App hosting plan choice:

### Plan summary
| | |
| --- | --- |  
|**[Consumption plan](#consumption-plan)**| Scale automatically and only pay for compute resources when your functions are running. On the Consumption plan, instances of the Functions host are dynamically added and removed based on the number of incoming events.<br/> ✔ Default hosting plan.<br/>✔ Pay only when your functions are running.<br/>✔ scale-out automatically, even during periods of high load.|  
|**[Premium plan](#premium-plan)**|While automatically scaling based on demand, use pre-warmed workers to run applications with no delay after being idle, run on more powerful instances, and connect to VNETs. Consider the Azure Functions Premium plan in the following situations,  in addition to all features of the App Service plan: <br/>✔ Your function apps run continuously, or nearly continuously.<br/>✔ You have a high number of small executions and have a high execution bill but low GB second bill in the Consumption plan.<br/>✔ You need more CPU or memory options than what is provided by the Consumption plan.<br/>✔ Your code needs to run longer than the maximum execution time allowed on the Consumption plan.<br/>✔ You require features that are only available on a Premium plan, such as virtual network connectivity.|  
|**[Dedicated plan](#app-service-plan)**<sup>1</sup>|Run your functions within an App Service plan at regular App Service plan rates. Good fit for long running operations, as well as when more predictive scaling and costs are required. Consider an App Service plan in the following situations:<br/>✔ You have existing, underutilized VMs that are already running other App Service instances.<br/>✔ You want to provide a custom image on which to run your functions.|  
|**[ASE](#app-service-plan)**<sup>1</sup>|App Service Environment (ASE) is an App Service feature that provides a fully isolated and dedicated environment for securely running App Service apps at high scale. ASEs are appropriate for application workloads that require: <br/>✔ Very high scale.<br/>✔ Full compute isolation and secure network access.<br/>✔ High memory utilization.|  
| **[Kubernetes](functions-kubernetes-keda.md)** | Kubernetes provides a fully isolated and dedicated environment running on top of the Kubernetes platform.  Kubernetes is appropriate for application workloads that require: <br/>✔ Custom hardware requirements.<br/>✔ Isolation and secure network access.<br/>✔ Ability to run in hybrid or multi-cloud environment.<br/>✔ Run alongside existing Kubernetes applications and services.|  

<sup>1</sup> For specific limits for the various App Service plan options, see the [App Service plan limits](../azure-resource-manager/management/azure-subscription-service-limits.md#app-service-limits).

### Operating system/runtime

| | Linux<sup>1</sup><br/>Code-only | Windows<sup>2</sup><br/>Code-only | Linux<sup>1,3</sup><br/>Docker container |
| --- | --- | --- | --- |
| **[Consumption plan](#consumption-plan)** | .NET Core<br/>Node.js<br/>Java<br/>Python | .NET Core<br/>Node.js<br/>Java<br/>PowerShell Core | No support  |
| **[Premium plan](#premium-plan)** | .NET Core<br/>Node.js<br/>Java<br/>Python|.NET Core<br/>Node.js<br/>Java<br/>PowerShell Core |.NET Core<br/>Node.js<br/>Java<br/>PowerShell Core<br/>Python  | 
| **[Dedicated plan](#app-service-plan)**<sup>4</sup> | .NET Core<br/>Node.js<br/>Java<br/>Python|.NET Core<br/>Node.js<br/>Java<br/>PowerShell Core |.NET Core<br/>Node.js<br/>Java<br/>PowerShell Core<br/>Python |
| **[ASE](#app-service-plan)**<sup>4</sup> | .NET Core<br/>Node.js<br/>Java<br/>Python |.NET Core<br/>Node.js<br/>Java<br/>PowerShell Core  |.NET Core<br/>Node.js<br/>Java<br/>PowerShell Core<br/>Python | 
| **[Kubernetes](functions-kubernetes-keda.md)** | n/a | n/a |.NET Core<br/>Node.js<br/>Java<br/>PowerShell Core<br/>Python |

<sup>1</sup>Linux is the only supported operating system for the Python runtime stack.  
<sup>2</sup>Windows is the only supported operating system for the PowerShell runtime stack.   
<sup>3</sup>Linux is the only supported operating system for Docker containers.
<sup>4</sup> For specific limits for the various App Service plan options, see the [App Service plan limits](../azure-resource-manager/management/azure-subscription-service-limits.md#app-service-limits).

### Scale

| | Scale out | Max # instances |
| --- | --- | --- |
| **[Consumption plan](#consumption-plan)** | Event driven. Scale out automatically, even during periods of high load. Azure Functions infrastructure scales CPU and memory resources by adding additional instances of the Functions host, based on the number of events that its functions are triggered on. | 200 |
| **[Premium plan](#premium-plan)** | Event driven. Scale out automatically, even during periods of high load. Azure Functions infrastructure scales CPU and memory resources by adding additional instances of the Functions host, based on the number of events that its functions are triggered on. |100|
| **[Dedicated plan](#app-service-plan)**<sup>1</sup> | Manual/autoscale |10-20|
| **[ASE](#app-service-plan)**<sup>1</sup> | Manual/autoscale |100 |
| **[Kubernetes](functions-kubernetes-keda.md)**  | Event-driven autoscale for Kubernetes clusters using [KEDA](https://keda.sh). | Varies&nbsp;by&nbsp;cluster.&nbsp;&nbsp;|

<sup>1</sup> For specific limits for the various App Service plan options, see the [App Service plan limits](../azure-resource-manager/management/azure-subscription-service-limits.md#app-service-limits).

### Cold start behavior

|    |    | 
| -- | -- |
| **[Consumption&nbsp;plan](#consumption-plan)** | Apps may scale to zero if idle for a period of time, meaning some requests may have additional latency at startup.  The consumption plan does have some optimizations to help decrease cold start time, including pulling from pre-warmed placeholder functions that already have the function host and language processes running. |
| **[Premium plan](#premium-plan)** | Perpetually warm instances to avoid any cold start. |
| **[Dedicated plan](#app-service-plan)**<sup>1</sup> | When running in a Dedicated plan, the Functions host can run continuously, which means that cold start isn’t really an issue. |
| **[ASE](#app-service-plan)**<sup>1</sup> | When running in a Dedicated plan, the Functions host can run continuously, which means that cold start isn’t really an issue. |
| **[Kubernetes](functions-kubernetes-keda.md)**  | Depends on KEDA configuration. Apps can be configured to always run and never have cold start, or configured to scale to zero, which results in cold start on new events. 

<sup>1</sup> For specific limits for the various App Service plan options, see the [App Service plan limits](../azure-resource-manager/management/azure-subscription-service-limits.md#app-service-limits).

### Service limits

[!INCLUDE [functions-limits](../../includes/functions-limits.md)]

### Networking features

[!INCLUDE [functions-networking-features](../../includes/functions-networking-features.md)]

### Billing

| | | 
| --- | --- |
| **[Consumption plan](#consumption-plan)** | Pay only for the time your functions run. Billing is based on number of executions, execution time, and memory used. |
| **[Premium plan](#premium-plan)** | Premium plan is based on the number of core seconds and memory used across needed and pre-warmed instances. At least one instance per plan must be kept warm at all times. This plan provides more predictable pricing. |
| **[Dedicated plan](#app-service-plan)**<sup>1</sup> | You pay the same for function apps in an App Service Plan as you would for other App Service resources, like web apps.|
| **[ASE](#app-service-plan)**<sup>1</sup> | there's a flat monthly rate for an ASE that pays for the infrastructure and doesn't change with the size of the ASE. In addition, there's a cost per App Service plan vCPU. All apps hosted in an ASE are in the Isolated pricing SKU. |
| **[Kubernetes](functions-kubernetes-keda.md)**| You pay only the costs of your Kubernetes cluster; no additional billing for Functions. Your function app runs as an application workload on top of your cluster, just like a regular app. |

<sup>1</sup> For specific limits for the various App Service plan options, see the [App Service plan limits](../azure-resource-manager/management/azure-subscription-service-limits.md#app-service-limits).

## Next steps

+ [Quickstart: Create an Azure Functions project using Visual Studio Code](functions-create-first-function-vs-code.md)
+ [Deployment technologies in Azure Functions](functions-deployment-technologies.md) 
+ [Azure Functions developer guide](functions-reference.md)
