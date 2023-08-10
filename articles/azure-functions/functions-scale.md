---
title: Azure Functions scale and hosting 
description: Learn how to choose between Azure Functions Consumption plan and Premium plan.
ms.assetid: 5b63649c-ec7f-4564-b168-e0a74cb7e0f3
ms.topic: conceptual
ms.date: 05/04/2023
ms.custom: H1Hack27Feb2017, devdivchpfy22, build-2023
---
# Azure Functions hosting options

When you create a function app in Azure, you must choose a hosting plan for your app. There are three basic Azure Functions hosting plans provided by Azure Functions: [Consumption plan], [Premium plan], and [Dedicated (App Service) plan][Dedicated plan]. These hosting plans are facilitated by Azure App Service infrastructure and are generally available (GA) on both Linux and Windows virtual machines. 

The Azure Functions hosting plan you choose dictates the following behaviors:

* How your function app is scaled.
* The resources available to each function app instance.
* Support for advanced functionality, such as Azure Virtual Network connectivity.

In addition to Azure Functions hosting, you can also host containerized function apps in containers can also be deployed to Kubernetes clusters and to Azure Container Apps. If you choose to host your functions in a Kubernetes cluster, consider using an [Azure Arc-enabled Kubernetes cluster](../azure-arc/kubernetes/overview.md). To learn more about deploying custom container apps, see [Azure Container Apps hosting of Azure Functions](./functions-container-apps-hosting.md).  

This article provides a detailed comparison between the various hosting plans, including container-based hosting options.

> [!NOTE]
> Hosting Azure Functions containers on both Azure Arc-enabled Kubernetes clusters and Azure Container Apps is currently in preview. 

## Overview of plans

The following is a summary of the benefits of the three main Azure Functions hosting plans:

| Plan | Benefits |
| --- | --- |  
|**[Consumption plan]**| Scale automatically and only pay for compute resources when your functions are running.<br/><br/>On the Consumption plan, instances of the Functions host are dynamically added and removed based on the number of incoming events.<br/><br/> ✔ Default hosting plan.<br/>✔ Pay only when your functions are running.<br/>✔ Scales automatically, even during periods of high load.|  
|**[Premium plan]**|Automatically scales based on demand using pre-warmed workers, which run applications with no delay after being idle, runs on more powerful instances, and connects to virtual networks. <br/><br/>Consider the Azure Functions Premium plan in the following situations: <br/><br/>✔ Your function apps run continuously, or nearly continuously.<br/>✔ You have a high number of small executions and a high execution bill, but low GB seconds in the Consumption plan.<br/>✔ You need more CPU or memory options than what is provided by the Consumption plan.<br/>✔ Your code needs to run longer than the maximum execution time allowed on the Consumption plan.<br/>✔ You require features that aren't available on the Consumption plan, such as virtual network connectivity.<br/>✔ You want to provide a custom Linux image on which to run your functions. |  
|**[Dedicated plan]** |Run your functions within an App Service plan at regular [App Service plan rates](https://azure.microsoft.com/pricing/details/app-service/windows/).<br/><br/>Best for long-running scenarios where [Durable Functions](durable/durable-functions-overview.md) can't be used. Consider an App Service plan in the following situations:<br/><br/>✔ You have existing, underutilized VMs that are already running other App Service instances.<br/>✔ Predictive scaling and costs are required.|  

The comparison tables in this article also include the following hosting options, which provide the highest amount of control and isolation in which to run your function apps.  

| Hosting option | Details |
| --- | --- |  
|**[ASE][Dedicated plan]** | App Service Environment (ASE) is an App Service feature that provides a fully isolated and dedicated environment for securely running App Service apps at high scale.<br/><br/>ASEs are appropriate for application workloads that require: <br/><br/>✔ Very high scale.<br/>✔ Full compute isolation and secure network access.<br/>✔ High memory usage.|  
| **[Azure Container Apps](./functions-container-apps-hosting.md)** | Azure Container Apps is a fully managed environment that enables you to run microservices and containerized applications on a serverless platform. Azure Container Apps let you run your functions with the power of the underlying Azure Kubernetes Service (AKS) while removing the complexity of having to work with Kubernetes APIs.  | 
| **Kubernetes**<br/>([Direct][Kubernetes] or<br/>[Azure Arc](../app-service/overview-arc-integration.md)) | Kubernetes provides a fully isolated and dedicated environment running on top of the Kubernetes platform.<br/><br/> Kubernetes is appropriate for application workloads that require: <br/>✔ Custom hardware requirements.<br/>✔ Isolation and secure network access.<br/>✔ Ability to run in hybrid or multi-cloud environment.<br/>✔ Run alongside existing Kubernetes applications and services.|  

The remaining tables in this article compare the plans on various features and behaviors. For a cost comparison between dynamic hosting plans (Consumption and Premium), see the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/). For pricing of the various Dedicated plan options, see the [App Service pricing page](https://azure.microsoft.com/pricing/details/app-service/windows/). 

## Operating system/runtime

The following table shows operating system and [language support](supported-languages.md) for the hosting plans.

| | Linux<sup>1,2</sup><br/>code-only | Windows code-only | Linux<sup>1,2,3</sup><br/>Docker container |
| --- | --- | --- | --- |
| **[Consumption plan]** | C#<br/>JavaScript<br/>Java<br/>Python<br/>PowerShell Core<br/>TypeScript | C#<br/>JavaScript<br/>Java<br/>PowerShell Core<br/>TypeScript | No support  |
| **[Premium plan]** | C#<br/>JavaScript<br/>Java<br/>Python<br/>PowerShell Core<br/>TypeScript |C#<br/>JavaScript<br/>Java<br/>PowerShell Core<br/>TypeScript |C#<br/>JavaScript<br/>Java<br/>PowerShell Core<br/>Python<br/>TypeScript  | 
| **[Dedicated plan]** | C#<br/>JavaScript<br/>Java<br/>Python<br/>TypeScript |C#<br/>JavaScript<br/>Java<br/>PowerShell Core<br/>TypeScript |C#<br/>JavaScript<br/>Java<br/>PowerShell Core<br/>Python<br/>TypeScript |
| **[ASE][Dedicated plan]** | C#<br/>JavaScript<br/>Java<br/>Python<br/>TypeScript |C#<br/>JavaScript<br/>Java<br/>PowerShell Core<br/>TypeScript |C#<br/>JavaScript<br/>Java<br/>PowerShell Core<br/>Python<br/>TypeScript | 
| **[Kubernetes (direct)][Kubernetes]** | n/a | n/a |C#<br/>JavaScript<br/>Java<br/>PowerShell Core<br/>Python<br/>TypeScript |
| **[Azure Arc (Preview)](../app-service/overview-arc-integration.md)** | C#<br/>JavaScript<br/>Java<br/>Python<br/>TypeScript | n/a |C#<br/>JavaScript<br/>Java<br/>PowerShell Core<br/>Python<br/>TypeScript |

<sup>1</sup> Linux is the only supported operating system for the Python runtime stack. <br/>
<sup>2</sup> PowerShell support on Linux is currently in preview.<br/>
<sup>3</sup> Linux is the only supported operating system for Docker containers.<br/>

[!INCLUDE [Timeout Duration section](../../includes/functions-timeout-duration.md)]

## Scale

The following table compares the scaling behaviors of the various hosting plans.  
Maximum instances are given on a per-function app (Consumption) or per-plan (Premium/Dedicated) basis, unless otherwise indicated. 

| Plan | Scale out | Max # instances | 
| --- | --- | --- |
| **[Consumption plan]** | [Event driven](event-driven-scaling.md). Scale out automatically, even during periods of high load. Azure Functions infrastructure scales CPU and memory resources by adding additional instances of the Functions host, based on the number of incoming trigger events. | **Windows:** 200<br/>**Linux:** 100<sup>1</sup>  | 
| **[Premium plan]** | [Event driven](event-driven-scaling.md). Scale out automatically, even during periods of high load. Azure Functions infrastructure scales CPU and memory resources by adding additional instances of the Functions host, based on the number of events that its functions are triggered on. | **Windows:** 100<br/>**Linux:** 20-100<sup>2</sup>| 
| **[Dedicated plan]**<sup>3</sup> | Manual/autoscale |10-30| 
| **[ASE][Dedicated plan]**<sup>3</sup> | Manual/autoscale |100 | 
| **[Kubernetes]**  | Event-driven autoscale for Kubernetes clusters using [KEDA](https://keda.sh). | Varies&nbsp;by&nbsp;cluster&nbsp;&nbsp;| 

<sup>1</sup> During scale-out, there's currently a limit of 500 instances per subscription per hour for Linux apps on a Consumption plan.  <br/>
<sup>2</sup> In some regions, Linux apps on a Premium plan can scale to 100 instances. For more information, see the [Premium plan article](functions-premium-plan.md#region-max-scale-out). <br/>
<sup>3</sup> For specific limits for the various App Service plan options, see the [App Service plan limits](../azure-resource-manager/management/azure-subscription-service-limits.md#app-service-limits).

## Cold start behavior

| Plan | Details | 
| -- | -- |
| **[Consumption plan]** | Apps may scale to zero when idle, meaning some requests may have additional latency at startup.  The consumption plan does have some optimizations to help decrease cold start time, including pulling from pre-warmed placeholder functions that already have the function host and language processes running. |
| **[Premium plan]** | Perpetually warm instances to avoid any cold start. |
| **[Dedicated plan]** | When running in a Dedicated plan, the Functions host can run continuously, which means that cold start isn't really an issue. |
| **[ASE][Dedicated plan]** | When running in a Dedicated plan, the Functions host can run continuously, which means that cold start isn't really an issue. |
| **[Kubernetes]**  | Depending on KEDA configuration, apps can be configured to avoid a cold start. If configured to scale to zero, then a cold start is experienced for new events. 

## Service limits

[!INCLUDE [functions-limits](../../includes/functions-limits.md)]

## Limitations for creating new function apps in an existing resource group

In some cases, when trying to create a new hosting plan for your function app in an existing resource group you may receive one of the following errors:

* The pricing tier is not allowed in this resource group
* <SKU_name> workers are not available in resource group <resource_group_name>

This can happen when the following conditions are met:

* You create a function app in an existing resource group that has ever contained another function app or web app.
* Your new function app is created in the same region as the previous app.
* The previous app is in some way incompatible with your new app. This can happen between SKUs, operating systems, or due to other platform-level features, such as availability zone support.

The reason this happens is due to how function app and web app plans are mapped to different pools of resources when being created. Different SKUs require a different set of infrastructure capabilities. When you create an app in a resource group, that resource group is mapped and assigned to a specific pool of resources. If you try to create another plan in that resource group and the mapped pool does not have the required resources, this error will occur.

When this error occurs, instead create your function app and hosting plan in a new resource group.

## Networking features

[!INCLUDE [functions-networking-features](../../includes/functions-networking-features.md)]

## Billing

| Plan | Details |
| --- | --- |
| **[Consumption plan]** | Pay only for the time your functions run. Billing is based on number of executions, execution time, and memory used. |
| **[Premium plan]** | Premium plan is based on the number of core seconds and memory used across needed and pre-warmed instances. At least one instance per plan must always be kept warm. This plan provides the most predictable pricing. |
| **[Dedicated plan]** | You pay the same for function apps in an App Service Plan as you would for other App Service resources, like web apps.|
| **[App Service Environment (ASE)][Dedicated plan]** | There's a flat monthly rate for an ASE that pays for the infrastructure and doesn't change with the size of the ASE. There's also a cost per App Service plan vCPU. All apps hosted in an ASE are in the Isolated pricing SKU. |
| **[Kubernetes]**| You pay only the costs of your Kubernetes cluster; no additional billing for Functions. Your function app runs as an application workload on top of your cluster, just like a regular app. |

## Next steps

+ [Deployment technologies in Azure Functions](functions-deployment-technologies.md) 
+ [Azure Functions developer guide](functions-reference.md)

[Consumption plan]: consumption-plan.md
[Premium plan]: functions-premium-plan.md
[Dedicated plan]: dedicated-plan.md
[Kubernetes]: functions-kubernetes-keda.md
