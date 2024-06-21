---
title: Azure Functions scale and hosting
description: Compare the various options you need to consider when choosing a hosting plan in which to run your function app in Azure Functions.
ms.assetid: 5b63649c-ec7f-4564-b168-e0a74cb7e0f3
ms.topic: limits-and-quotas
ms.date: 05/10/2024
ms.custom: H1Hack27Feb2017, devdivchpfy22, build-2023, build-2024
---
# Azure Functions hosting options

When you create a function app in Azure, you must choose a hosting option for your app. Azure provides you with these hosting options for your function code:

| Hosting option | Service | Availability | Container support |
| --- | --- | --- | --- | 
| **[Consumption plan]** | Azure Functions | Generally available (GA) | None |
| **[Flex Consumption plan]** | Azure Functions | Preview  |  None | 
| **[Premium plan]** | Azure Functions | GA | Linux |
| **[Dedicated plan]** | Azure Functions | GA | Linux |
| **[Container Apps]** | Azure Container Apps | GA | Linux |

Azure Functions hosting options are facilitated by Azure App Service infrastructure on both Linux and Windows virtual machines. The hosting option you choose dictates the following behaviors:

* How your function app is scaled.
* The resources available to each function app instance.
* Support for advanced functionality, such as Azure Virtual Network connectivity.
* Support for Linux containers.

The plan you choose also impacts the costs for running your function code. For more information, see [Billing](#billing).

This article provides a detailed comparison between the various hosting options. To learn more about running and managing your function code in Linux containers, see [Linux container support in Azure Functions](container-concepts.md).

## Overview of plans

The following is a summary of the benefits of the various options for Azure Functions hosting:

| Option | Benefits |
| --- | --- |  
|**[Consumption plan]**| Pay for compute resources only when your functions are running (pay-as-you-go) with automatic scale.<br/><br/>On the Consumption plan, instances of the Functions host are dynamically added and removed based on the number of incoming events.<br/><br/> ✔ Default hosting plan that provides true _serverless_ hosting.<br/>✔ Pay only when your functions are running.<br/>✔ Scales automatically, even during periods of high load.|  
|**[Flex Consumption plan]**| Get high scalability with compute choices, virtual networking, and pay-as-you-go billing.<br/><br/>On the Flex Consumption plan, instances of the Functions host are dynamically added and removed based on the configured per instance concurrency and the number of incoming events. <br/><br/> ✔ Reduce cold starts by specifying a number of pre-provisioned (always ready) instances.<br/> ✔ Supports virtual networking for added security.<br/>✔ Pay when your functions are running.<br/>✔ Scales automatically, even during periods of high load.| 
|**[Premium plan]**|Automatically scales based on demand using prewarmed workers, which run applications with no delay after being idle, runs on more powerful instances, and connects to virtual networks. <br/><br/>Consider the Azure Functions Premium plan in the following situations: <br/><br/>✔ Your function apps run continuously, or nearly continuously.<br/>✔ You want more control of your instances and want to deploy multiple function apps on the same plan with event-driven scaling.<br/>✔ You have a high number of small executions and a high execution bill, but low GB seconds in the Consumption plan.<br/>✔ You need more CPU or memory options than are provided by consumption plans.<br/>✔ Your code needs to run longer than the maximum execution time allowed on the Consumption plan.<br/>✔ You require virtual network connectivity.<br/>✔ You want to provide a custom Linux image in which to run your functions. |  
|**[Dedicated plan]** |Run your functions within an App Service plan at regular [App Service plan rates](https://azure.microsoft.com/pricing/details/app-service/windows/).<br/><br/>Best for long-running scenarios where [Durable Functions](durable/durable-functions-overview.md) can't be used. Consider an App Service plan in the following situations:<br/><br/>✔ You have existing and underutilized virtual machines that are already running other App Service instances.<br/>✔ You must have fully predictable billing, or you need to manually scale instances.<br/>✔ You want to run multiple web apps and function apps on the same plan<br/>✔ You need access to larger compute size choices.<br/>✔ Full compute isolation and secure network access provided by an App Service Environment (ASE).<br/>✔ Very high memory usage and high scale (ASE).|  
| **[Container Apps]** | Create and deploy containerized function apps in a fully managed environment hosted by Azure Container Apps.<br/><br/>Use the Azure Functions programming model to build event-driven, serverless, cloud native function apps. Run your functions alongside other microservices, APIs, websites, and workflows as container-hosted programs. Consider hosting your functions on Container Apps in the following situations:<br/><br/>✔ You want to package custom libraries with your function code to support line-of-business apps.<br/>✔ You need to migration code execution from on-premises or legacy apps to cloud native microservices running in containers.<br/>✔ When you want to avoid the overhead and complexity of managing Kubernetes clusters and dedicated compute.<br/>✔ Your functions need high-end processing power provided by dedicated GPU compute resources. |  

The remaining tables in this article compare hosting options based on various features and behaviors. 

## <a name="operating-systemruntime"></a>Operating system support

This table shows operating system support for the hosting options. 

| Hosting | Linux<sup>1</sup> deployment| Windows<sup>2</sup> deployment | 
| --- | --- | --- | 
| **[Consumption plan]** | ✅ Code-only<br/>❌ Container (not supported) | ✅ Code-only |
| **[Flex Consumption plan]** | ✅ Code-only<br/>❌ Container (not supported) | ❌ Not supported |
| **[Premium plan]** | ✅ Code-only<br/>✅ Container | ✅ Code-only | 
| **[Dedicated plan]** | ✅ Code-only<br/>✅ Container | ✅ Code-only |
| **[Container Apps]** | ✅ Container-only | ❌ Not supported |

<sup>1</sup> Linux is the only supported operating system for the [Python runtime stack](./functions-reference-python.md).  
<sup>2</sup> Windows deployments are code-only. Functions doesn't currently support Windows containers. 

[!INCLUDE [Timeout Duration section](../../includes/functions-timeout-duration.md)]

## Language support

For details on current native language stack support in Functions, see [Supported languages in Azure Functions](supported-languages.md).

## Scale

The following table compares the scaling behaviors of the various hosting plans.  
Maximum instances are given on a per-function app (Consumption) or per-plan (Premium/Dedicated) basis, unless otherwise indicated. 

| Plan | Scale out | Max # instances | 
| --- | --- | --- |
| **[Consumption plan]** | [Event driven](event-driven-scaling.md). Scales out automatically, even during periods of high load. Functions infrastructure scales CPU and memory resources by adding more instances of the Functions host, based on the number of incoming trigger events. | **Windows:** 200<br/>**Linux:** 100<sup>1</sup>  | 
| **[Flex Consumption plan]** | [Per-function scaling](./flex-consumption-plan.md#per-function-scaling). Event-driven scaling decisions are calculated on a per-function basis, which provides a more deterministic way of scaling the functions in your app. With the exception of HTTP, Blob storage (Event Grid), and Durable Functions, all other function trigger types in your app scale on independent instances. All HTTP triggers in your app scale together as a group on the same instances, as do all Blob storage (Event Grid) triggers. All Durable Functions triggers also share instances and scale together. | Limited only by total memory usage of all instances across a given region. For more information, see [Instance memory](flex-consumption-plan.md#instance-memory).  | 
| **[Premium plan]** | [Event driven](event-driven-scaling.md). Scale out automatically, even during periods of high load. Azure Functions infrastructure scales CPU and memory resources by adding more instances of the Functions host, based on the number of events that its functions are triggered on. | **Windows:** 100<br/>**Linux:** 20-100<sup>2</sup>| 
| **[Dedicated plan]**<sup>3</sup> | Manual/autoscale |10-30<br/>100 (ASE)| 


<sup>1</sup> During scale-out, there's currently a limit of 500 instances per subscription per hour for Linux apps on a Consumption plan.  <br/>
<sup>2</sup> In some regions, Linux apps on a Premium plan can scale to 100 instances. For more information, see the [Premium plan article](functions-premium-plan.md#region-max-scale-out). <br/>
<sup>3</sup> For specific limits for the various App Service plan options, see the [App Service plan limits](../azure-resource-manager/management/azure-subscription-service-limits.md#app-service-limits).

## Cold start behavior

| Plan | Details | 
| -- | -- |
| **[Consumption plan]** | Apps can scale to zero when idle, meaning some requests might have more latency at startup. The consumption plan does have some optimizations to help decrease cold start time, including pulling from prewarmed placeholder functions that already have the function host and language processes running. |
| **[Flex Consumption plan]** | Supports [always ready instances](./flex-consumption-plan.md#always-ready-instances) to reduce the delay when provisioning new instances. |
| **[Premium plan]** | Supports [always ready instances](./functions-premium-plan.md#always-ready-instances) to avoid cold starts by letting you maintain one or more _perpetually warm_ instances. |
| **[Dedicated plan]** | When running in a Dedicated plan, the Functions host can run continuously on a prescribed number of instances, which means that cold start isn't really an issue. |

## Service limits

[!INCLUDE [functions-limits](../../includes/functions-limits.md)]

## Networking features

[!INCLUDE [functions-networking-features](../../includes/functions-networking-features.md)]

## Billing

| Plan | Details |
| --- | --- |
| **[Consumption plan]** | Pay only for the time your functions run. Billing is based on number of executions, execution time, and memory used. |
| **[Flex Consumption plan]** | Billing is based on number of executions, the memory of instances when they're actively executing functions, plus the cost of any [always ready instances](./flex-consumption-plan.md#always-ready-instances). For more information, see [Flex Consumption plan billing](flex-consumption-plan.md#billing).
| **[Premium plan]** | Premium plan is based on the number of core seconds and memory used across needed and prewarmed instances. At least one instance per plan must always be kept warm. This plan provides the most predictable pricing. |
| **[Dedicated plan]** | You pay the same for function apps in an App Service Plan as you would for other App Service resources, like web apps.<br/><br/>For an ASE, there's a flat monthly rate that pays for the infrastructure and doesn't change with the size of the environment. There's also a cost per App Service plan vCPU. All apps hosted in an ASE are in the Isolated pricing SKU. For more information, see the [ASE overview article](../app-service/environment/overview.md#pricing). |

For a direct cost comparison between dynamic hosting plans (Consumption, Flex Consumption, and Premium), see the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/). For pricing of the various Dedicated plan options, see the [App Service pricing page](https://azure.microsoft.com/pricing/details/app-service). For pricing Container Apps hosting, see [Azure Container Apps pricing](https://azure.microsoft.com/pricing/details/container-apps/).

<!---this needs to move into a troubleshooting how to article-->
## Limitations for creating new function apps in an existing resource group

In some cases, when trying to create a new hosting plan for your function app in an existing resource group you might receive one of the following errors:

* The pricing tier is not allowed in this resource group
* <SKU_name> workers are not available in resource group <resource_group_name>

This can happen when the following conditions are met:

* You create a function app in an existing resource group that has ever contained another function app or web app. For example, Linux Consumption apps aren't supported in the same resource group as Linux Dedicated or Linux Premium plans.
* Your new function app is created in the same region as the previous app.
* The previous app is in some way incompatible with your new app. This error can happen between SKUs, operating systems, or due to other platform-level features, such as availability zone support.

The reason this happens is due to how function app and web app plans are mapped to different pools of resources when being created. Different SKUs require a different set of infrastructure capabilities. When you create an app in a resource group, that resource group is mapped and assigned to a specific pool of resources. If you try to create another plan in that resource group and the mapped pool does not have the required resources, this error occurs.

When this error occurs, instead create your function app and hosting plan in a new resource group.

## Next steps

+ [Deployment technologies in Azure Functions](functions-deployment-technologies.md) 
+ [Azure Functions developer guide](functions-reference.md)

[Consumption plan]: consumption-plan.md
[Flex Consumption plan]: flex-consumption-plan.md
[Premium plan]: functions-premium-plan.md
[Dedicated plan]: dedicated-plan.md
[Container Apps]: functions-container-apps-hosting.md
