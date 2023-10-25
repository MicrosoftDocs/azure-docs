---
title: Azure Functions Dedicated hosting 
description: Learn about the benefits of running Azure Functions on a dedicated App Service hosting plan.
ms.topic: conceptual
ms.date: 01/26/2023
---

# Dedicated hosting plans for Azure Functions

This article is about hosting your function app with dedicated resources in an App Service plan, including in an App Service Environment (ASE). For other hosting options, see the [hosting plan article](functions-scale.md).

An App Service plan defines a set of dedicated compute resources for an app to run. These dedicated compute resources are analogous to the [_server farm_](https://wikipedia.org/wiki/Server_farm) in conventional hosting. One or more function apps can be configured to run on the same computing resources (App Service plan) as other App Service apps, such as web apps. The dedicated App Service plans supported for function app hosting include Basic, Standard, Premium, and Isolated SKUs. For details about how the App Service plan works, see the [Azure App Service plans in-depth overview](../app-service/overview-hosting-plans.md).

> [!IMPORTANT]
> Free and Shared tier App Service plans aren't supported by Azure Functions. For a lower-cost option hosting your function executions, you should instead consider the [Consumption plan](consumption-plan.md), where you are billed based on function executions.  

Consider a dedicated App Service plan in the following situations:

* You have existing, underutilized VMs that are already running other App Service instances.
* You want to provide a custom image on which to run your functions.

## Billing

You pay for function apps in an App Service Plan as you would for other App Service resources. This differs from Azure Functions [Consumption plan](consumption-plan.md) or [Premium plan](functions-premium-plan.md) hosting, which have consumption-based cost components. You are billed only for the plan, regardless of how many function apps or web apps run in the plan. To learn more, see the [App Service pricing page](https://azure.microsoft.com/pricing/details/app-service/windows/). 

## <a name="always-on"></a> Always On

If you run on an App Service plan, you should enable the **Always on** setting so that your function app runs correctly. On an App Service plan, the functions runtime goes idle after a few minutes of inactivity, so only HTTP triggers will "wake up" your functions. The **Always on** setting is available only on an App Service plan. On a Consumption plan, the platform activates function apps automatically.

Even with Always On enabled, the execution timeout for individual functions is controlled by the `functionTimeout` setting in the [host.json](functions-host-json.md#functiontimeout) project file.

## Scaling

Using an App Service plan, you can manually scale out by adding more VM instances. You can also enable autoscale, though autoscale will be slower than the elastic scale of the Premium plan. For more information, see [Scale instance count manually or automatically](../azure-monitor/autoscale/autoscale-get-started.md?toc=%2fazure%2fapp-service%2ftoc.json). You can also scale up by choosing a different App Service plan. For more information, see [Scale up an app in Azure](../app-service/manage-scale-up.md). 

> [!NOTE] 
> When running JavaScript (Node.js) functions on an App Service plan, you should choose a plan that has fewer vCPUs. For more information, see [Choose single-core App Service plans](functions-reference-node.md#choose-single-vcpu-app-service-plans). 
<!-- Note: the portal links to this section via fwlink https://go.microsoft.com/fwlink/?linkid=830855 --> 

## App Service Environments

Running in an App Service Environment (ASE) lets you fully isolate your functions and take advantage of higher numbers of instances than an App Service Plan. To get started, see [Introduction to the App Service Environments](../app-service/environment/intro.md).

If you just want to run your function app in a virtual network, you can do this using the [Premium plan](functions-premium-plan.md). To learn more, see [Establish Azure Functions private site access](functions-create-private-site-access.md). 

## Next steps

+ [Azure Functions hosting options](functions-scale.md)
+ [Azure App Service plan overview](../app-service/overview-hosting-plans.md)
