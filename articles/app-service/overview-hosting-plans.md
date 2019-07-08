---
title: App Service plan overview - Azure | Microsoft Docs
description: Learn how App Service plans for Azure App Service work, and how they benefit your management experience.
keywords: app service, azure app service, scale, scalable, scalability, app service plan, app service cost
services: app-service
documentationcenter: ''
author: cephalin
manager: cfowler
editor: ''

ms.assetid: dea3f41e-cf35-481b-a6bc-33d7fc9d01b1
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/09/2017
ms.author: cephalin
ms.custom: seodec18

---
# Azure App Service plan overview

In App Service, an app runs in an _App Service plan_. An App Service plan defines a set of compute resources for a web app to run. These compute resources are analogous to the [_server farm_](https://wikipedia.org/wiki/Server_farm) in conventional web hosting. One or more apps can be configured to run on the same computing resources (or in the same App Service plan).

When you create an App Service plan in a certain region (for example, West Europe), a set of compute resources is created for that plan in that region. Whatever apps you put into this App Service plan run on these compute resources as defined by your App Service plan. Each App Service plan defines:

- Region (West US, East US, etc.)
- Number of VM instances
- Size of VM instances (Small, Medium, Large)
- Pricing tier (Free, Shared, Basic, Standard, Premium, PremiumV2, Isolated, Consumption)

The _pricing tier_ of an App Service plan determines what App Service features you get and how much you pay for the plan. There are a few categories of pricing tiers:

- **Shared compute**: **Free** and **Shared**, the two base tiers, runs an app on the same Azure VM as other App Service apps, including apps of other customers. These tiers allocate CPU quotas to each app that runs on the shared resources, and the resources cannot scale out.
- **Dedicated compute**: The **Basic**, **Standard**, **Premium**, and **PremiumV2** tiers run apps on dedicated Azure VMs. Only apps in the same App Service plan share the same compute resources. The higher the tier, the more VM instances are available to you for scale-out.
- **Isolated**: This tier runs dedicated Azure VMs on dedicated Azure Virtual Networks, which provides network isolation on top of compute isolation to your apps. It provides the maximum scale-out capabilities.
- **Consumption**: This tier is only available to [function apps](../azure-functions/functions-overview.md). It scales the functions dynamically depending on workload. For more information, see [Azure Functions hosting plans comparison](../azure-functions/functions-scale.md).

[!INCLUDE [app-service-dev-test-note](../../includes/app-service-dev-test-note.md)]

Each tier also provides a specific subset of App Service features. These features include custom domains and SSL certificates, autoscaling, deployment slots, backups, Traffic Manager integration, and more. The higher the tier, the more features are available. To find out which features are supported in each pricing tier, see [App Service plan details](https://azure.microsoft.com/pricing/details/app-service/plans/).

<a name="new-pricing-tier-premiumv2"></a>

> [!NOTE]
> The new **PremiumV2** pricing tier provides [Dv2-series VMs](../virtual-machines/windows/sizes-general.md#dv2-series) with faster processors, SSD storage, and double memory-to-core ratio compared to **Standard** tier. **PremiumV2** also supports higher scale via increased instance count while still providing all the advanced capabilities found in the Standard plan. All features available in the existing **Premium** tier are included in **PremiumV2**.
>
> Similar to other dedicated tiers, three VM sizes are available for this tier:
>
> - Small (one CPU core, 3.5 GiB of memory) 
> - Medium (two CPU cores, 7 GiB of memory) 
> - Large (four CPU cores, 14 GiB of memory)  
>
> For **PremiumV2** pricing information, see [App Service Pricing](https://azure.microsoft.com/pricing/details/app-service/).
>
> To get started with the new **PremiumV2** pricing tier, see [Configure PremiumV2 tier for App Service](app-service-configure-premium-tier.md).

## How does my app run and scale?

In the **Free** and **Shared** tiers, an app receives CPU minutes on a shared VM instance and cannot scale out. In other tiers, an app runs and scales as follows.

When you create an app in App Service, it is put into an App Service plan. When the app runs, it runs on all the VM instances configured in the App Service plan. If multiple apps are in the same App Service plan, they all share the same VM instances. If you have multiple deployment slots for an app, all deployment slots also run on the same VM instances. If you enable diagnostic logs, perform backups, or run WebJobs, they also use CPU cycles and memory on these VM instances.

In this way, the App Service plan is the scale unit of the App Service apps. If the plan is configured to run five VM instances, then all apps in the plan run on all five instances. If the plan is configured for autoscaling, then all apps in the plan are scaled out together based on the autoscale settings.

For information on scaling out an app, see [Scale instance count manually or automatically](../monitoring-and-diagnostics/insights-how-to-scale.md).

<a name="cost"></a>

## How much does my App Service plan cost?

This section describes how App Service apps are billed. For detailed, region-specific pricing information, see [App Service Pricing](https://azure.microsoft.com/pricing/details/app-service/).

Except for **Free** tier, an App Service plan carries an hourly charge on the compute resources it uses.

- In the **Shared** tier, each app receives a quota of CPU minutes, so _each app_ is charged hourly for the CPU quota.
- In the dedicated compute tiers (**Basic**, **Standard**, **Premium**, **PremiumV2**), The App Service plan defines the number of VM instances the apps are scaled to, so _each VM instance_ in the App Service plan has an hourly charge. These VM instances are charged the same regardless how many apps are running on them. To avoid unexpected charges, see [Clean up an App Service plan](app-service-plan-manage.md#delete).
- In the **Isolated** tier, the App Service Environment defines the number of isolated workers that run your apps, and _each worker_ is charged hourly. In addition, there's an hourly base fee for the running the App Service Environment itself. 
- (Azure Functions only) The **Consumption** tier dynamically allocates VM instances to service a function app's workload, and is charged dynamically per second by Azure. For more information, see [Azure Functions pricing](https://azure.microsoft.com/pricing/details/functions/).

You don't get charged for using the App Service features that are available to you (configuring custom domains, SSL certificates, deployment slots, backups, etc.). The exceptions are:

- App Service Domains - you pay when you purchase one in Azure and when you renew it each year.
- App Service Certificates - you pay when you purchase one in Azure and when you renew it each year.
- IP-based SSL connections - There's an hourly charge for each IP-based SSL connection, but some **Standard** tier or above gives you one IP-based SSL connection for free. SNI-based SSL connections are free.

> [!NOTE]
> If you integrate App Service with another Azure service, you may need to consider charges from these other services. For example, if you use Azure Traffic Manager to scale your app geographically, Azure Traffic Manager also charges you based on your usage. To estimate your cross-services cost in Azure, see [Pricing calculator](https://azure.microsoft.com/pricing/calculator/). 
>
>

## What if my app needs more capabilities or features?

Your App Service plan can be scaled up and down at any time. It is as simple as changing the pricing tier of the plan. You can choose a lower pricing tier at first and scale up later when you need more App Service features.

For example, you can start testing your web app in a **Free** App Service plan and pay nothing. When you want to add your [custom DNS name](app-service-web-tutorial-custom-domain.md) to the web app, just scale your plan up to **Shared** tier. Later, when you want to add a [custom SSL certificate](app-service-web-tutorial-custom-ssl.md), scale your plan up to **Basic** tier. When you want to have [staging environments](deploy-staging-slots.md), scale up to **Standard** tier. When you need more cores, memory, or storage, scale up to a bigger VM size in the same tier.

The same works in the reverse. When you feel you no longer need the capabilities or features of a higher tier, you can scale down to a lower tier, which saves you money.

For information on scaling up the App Service plan, see [Scale up an app in Azure](web-sites-scale.md).

If your app is in the same App Service plan with other apps, you may want to improve the app's performance by isolating the compute resources. You can do it by moving the app into a separate App Service plan. For more information, see [Move an app to another App Service plan](app-service-plan-manage.md#move).

## Should I put an app in a new plan or an existing plan?

Since you pay for the computing resources your App Service plan allocates (see [How much does my App Service plan cost?](#cost)), you can potentially save money by putting multiple apps into one App Service plan. You can continue to add apps to an existing plan as long as the plan has enough resources to handle the load. However, keep in mind that apps in the same App Service plan all share the same compute resources. To determine whether the new app has the necessary resources, you need to understand the capacity of the existing App Service plan, and the expected load for the new app. Overloading an App Service plan can potentially cause downtime for your new and existing apps.

Isolate your app into a new App Service plan when:

- The app is resource-intensive.
- You want to scale the app independently from the other apps the existing plan.
- The app needs resource in a different geographical region.

This way you can allocate a new set of resources for your app and gain greater control of your apps.

## Manage an App Service plan

> [!div class="nextstepaction"]
> [Manage an App Service plan](app-service-plan-manage.md)
