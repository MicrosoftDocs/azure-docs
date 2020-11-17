---
title: Azure Functions Dedicated (App Service) hosting plan 
description: Learn how to choose between Azure Functions Consumption plan and Premium plan.
ms.topic: conceptual
ms.date: 10/29/2020

---

# Dedicated (App Service) hosting plan for Azure Functions

This article is about hosting your function app in a Dedicated (App Service) plan, including in an App Service Environment (ASE). For other hosting plan options, see the [hosting plan article](functions-scale.md).

Your function apps can also run on the same dedicated VMs as other App Service apps (Basic, Standard, Premium, and Isolated SKUs).

Consider an App Service plan in the following situations:

* You have existing, underutilized VMs that are already running other App Service instances.
* You want to provide a custom image on which to run your functions.

You pay the same for function apps in an App Service Plan as you would for other App Service resources, like web apps. For details about how the App Service plan works, see the [Azure App Service plans in-depth overview](../app-service/overview-hosting-plans.md).

## App Service Environments

Running in an [App Service Environment](../app-service/environment/intro.md) (ASE) lets you fully isolate your functions and take advantage of higher numbers of instances than an App Service Plan. To get started, see .

If you just want to run your function app in a virtual network, you can do this using the [Premium plan](functions-premium-plan.md). To learn more, see [Establish Azure Functions private site access](functions-create-private-site-access.md). 

## <a name="always-on"></a> Always On

If you run on an App Service plan, you should enable the **Always on** setting so that your function app runs correctly. On an App Service plan, the functions runtime goes idle after a few minutes of inactivity, so only HTTP triggers will "wake up" your functions. Always on is available only on an App Service plan. On a Consumption plan, the platform activates function apps automatically.

Even with Always On enabled, the execution timeout for individual functions is controlled by the `functionTimeout` setting in the [host.json](functions-host-json.md#functiontimeout) project file.

## Scaling

Using an App Service plan, you can manually scale out by adding more VM instances. You can also enable autoscale, though autoscale will be slower than the elastic scale of the Premium plan. For more information, see [Scale instance count manually or automatically](../azure-monitor/platform/autoscale-get-started.md?toc=%2fazure%2fapp-service%2ftoc.json). You can also scale up by choosing a different App Service plan. For more information, see [Scale up an app in Azure](../app-service/manage-scale-up.md). 

> [!NOTE] 
> When running JavaScript (Node.js) functions on an App Service plan, you should choose a plan that has fewer vCPUs. For more information, see [Choose single-core App Service plans](functions-reference-node.md#choose-single-vcpu-app-service-plans). 
<!-- Note: the portal links to this section via fwlink https://go.microsoft.com/fwlink/?linkid=830855 --> 
