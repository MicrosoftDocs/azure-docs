---
title: App Service plans in Azure App Service Web Apps | Microsoft Docs
description: Learn how App Service plans for Azure App Service work, and how they benefit your management experience.
keywords: app service, azure app service, scale, scalable, app service plan, app service cost
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
ms.date: 11/07/2017
ms.author: cephalin

---
# App Service plans in Azure App Service Web Apps

In App Service, a web app, mobile back end, or API app runs in an _App Service plan_. This article explores the key characteristics of an App Service plan, such as pricing tiers and scale, and how they work when you manage your apps.

An App Service plan defines a set computing resources for a web app to run, and its region determines which datacenter these computing resources are located. One or more apps can be configured to run on the same computing resources (or in the same App Service plan). Each App Service plan defines:

- CPU, memory, and disk space
- Number of scale-out VM instances
- App Service features available to apps

An App Service plans can have a range of compute specifications and supported features, and the specifications and features are determined by the _pricing tier_ of the plan. In App Service, there are a few categories of pricing tiers:

- **Shared compute**: **Free** and **Shared**, the two base tiers, run apps on the same Azure VMs as other App Service apps, including apps of other customers. These tiers allot certain compute quotas
- **Dedicated compute**: The **Basic**, **Standard**, **Premium**, and **PremiumV2** tiers run apps on dedicated Azure VMs. Only apps in the same App Service plan share the same compute resources.
- **Isolated**: **Isolated**, the highest tier, run dedicated Azure VMs on dedicated Azure Virtual Networks, which provides network isolation on top of compute isolation to your apps.
- **Consumption**: This type is only available to [function apps](../azure-functions/functions-overview.md), which scales the functions dynamically depending on workload. For more information, see [Azure Functions hosting plans comparison](../azure-functions/functions-scale.md).

Each higher tier provides increased storage capacities and available VM instances for scaling out your apps. Each pricing tier also provides a specific subset of App Service features. These features include custom domains and SSL certificates, autoscaling, deployment slots, backups, Traffic Manager integration, and more. The higher the tier, the more features are available.

For a comprehensive list of which features are supported in each pricing tier, see [App Service plan details](https://azure.microsoft.com/pricing/details/app-service/plans/).

<a name="new-pricing-tier-premiumv2"></a>

> [!NOTE]
> The new **PremiumV2** pricing tier provides [Dv2-series VMs](../virtual-machines/windows/sizes-general.md#dv2-series) with faster processors, SSD storage, and double memory-to-core ratio compared to **Standard** tier. **PremiumV2** also supports higher scale via increased instance count while still providing all the advanced capabilities found in the Standard plan. All features available in the existing **Premium** tier are included in **PremiumV2**.
>
> Similar to other dedicated tiers, three VM sizes are available for this tier:
>
> - Small (1 CPU core, 3.5 GiB memory) 
> - Medium (2 CPU cores, 7 GiB memory) 
> - Large (4 CPU core, 14 GiB memory)  
>
> For **PremiumV2** pricing information, see [App Service Pricing](/pricing/details/app-service/).
>
> To get started with the new **PremiumV2** pricing tier, see [Configure PremiumV2 tier for App Service](app-service-configure-premium-tier.md).

## How are my app run and scaled out?

When you create a web app in App Service, it must be assigned to an App Service plan. When the app runs, it runs on all the resources available to the App Service plan. When multiple apps are assigned to the same App Service plan, then the all share the same compute resources.

In short, the App Service plan is the scale unit of your App Service apps. If the plan is configured to run multiple VM instances, then all apps in the plan run on all the instances that are currently configured. If the plan is configured for autoscaling, then all apps in the plan are scaled out automatically based on the autoscale settings.

For information on scaling out an app, see [Scale instance count manually or automatically](../monitoring-and-diagnostics/insights-how-to-scale.md).

<a name="cost"></a>

## How much does my App Service plan cost?

This section describes how web apps are billed in App Service. For detailed, region-specific pricing information, see [App Service Pricing](https://azure.microsoft.com/pricing/details/app-service/).

Except for **Free** tier, an App Service plan carries a hourly charge on the compute resources it uses. For example:

- In the **Shared** tier, each web app in the plan is alloted a certain number of CPU minutes, so each app in the plan is charged hourly for the CPU allotment.
- In the dedicated compute tiers (**Basic**, **Standard**, **Premium**, **PremiumV2**), The App Service plan defines how many VM instances are available to run apps, so each VM instance in the App Service plan has an hourly charge. The VM instances are charged regardless how many apps are running on them. To avoid unexpected charges, see [Clean up an App Service plan](#delete).
- In the **Isolated** tier, the App Service Environment defines the number of isolated workers that run your apps, and each worker is charged hourly. In addition, there's an hourly base fee for the App Service Environment itself. 
- (Azure Functions only) The **Consumption** tier dynamically allocates VM instances to service a function app's workload, and is charged dynamically by-the-second by Azure. For more information, see [Azure Functions pricing](https://azure.microsoft.com/pricing/details/functions/).

You don't get charged for using App Service features that are available to the pricing tier you choose, such as custom domains, SSL certificates, deployment slots, backups, with the following exceptions:

- App Service Domains (domains you buy directly from Azure)
- App Service Certificates (certificates you buy directly from Azure)
- IP-based SSL connections

> [!NOTE]
> If you integrate App Service with another Azure service, you may need to consider other charges. For example, if you use Azure Traffic Manager to scale your app geographically, you need to consider service charges by Azure Traffic Manager. To help estimate your cross-services cost in Azure, see [Pricing calculator](https://azure.microsoft.com/pricing/calculator/). 

## What if my app needs more capabilities or features?

Your App Service plan can be scaled up and down anytime. It is as simple as changing the pricing tier of the plan. So you can choose a lower pricing tier at first and scale up later when you need more App Service features or more instances to meet customer demands. 

For example, you can start hosting your web app in a **Free** App Service plan and pay nothing. When you want to add your [custom DNS name](app-service-web-tutorial-custom-domain.md) to the web app, just scale your plan up to **Shared** tier. Later when you want to add a [custom SSL certificate](app-service-web-tutorial-custom-ssl.md), scale your plan up to **Basic** tier. Then later when you want to have [staging environments](web-sites-staged-publishing.md), scale up to **Standard** tier.

For information on scaling up the App Service plan, see [Scale up an app in Azure](web-sites-scale.md).

If your app is in the same App Service plan with other apps, and you want improve the app's performance by using isolated compute resources, you can move the app into a separate App Service plan. 
- cam also move apps to a different App Service plan.

## Should I put an app in a new plan or an existing plan?

Since you pay for the computing resources your App Service plan allocates (see [How much does my App Service plan cost?](#cost)), you can potentially save money by putting a new app into an existing App Service plan. On the other hand, you need to keep in mind that apps in the same App Service plan all share the same compute resources. To determine whether the new app has the necessary resources, you need to understand the capacity of the existing App Service plan, and the expected load for the new app. Overloading an App Service plan can potentially cause downtime for your new and existing apps.

You should isolate your app into a new App Service plan when:

- The app is resource-intensive.
- You want to scale the app independently from the other apps the existing plan.
- The app needs resource in a different geographical region.

This way you can allocate a new set of resources for your app and gain greater control of your apps.

## Create an App Service plan

> [!TIP]
> If you have an App Service Environment, see [Create an App Service plan in an App Service Environment](../app-service/environment/app-service-web-how-to-create-a-web-app-in-an-ase.md#createplan).

You can create an empty App Service plan or as part of app creation.

In the [Azure portal](https://portal.azure.com), click **New** > **Web + mobile**, and then select **Web App** or other App Service app kind.

![Create an app in the Azure portal.][createWebApp]

You can then select or create the App Service plan for the new app.

 ![Create an App Service plan.][createASP]

To create an App Service plan, click **[+] Create New**, type the **App Service plan** name, and then select an appropriate **Location**. Click **Pricing tier**, and then select an appropriate pricing tier for the service. Select **View all** to view more pricing options, such as **Free** and **Shared**. After you have selected the pricing tier, click the **Select** button.

## Move an app to another App Service plan

You can move an app to a different App Service plan . You can move apps between plans as long as the plans are in the _same resource group and geographical region_.

To move an app to another plan, navigate to the app that you want to move in the [Azure portal](https://portal.azure.com).

In the **Menu**, look for the **App Service Plan** section.

Select **Change App Service plan** to start the process.

**Change App Service plan** opens the **App Service plan** selector. At this point, you can pick an existing plan to move this app into. Only plans in the same resource group and region are displayed.

![App Service plan selector.][change]

Each plan has its own pricing tier. For example, moving a site from a Free tier to a Standard tier, enables all apps assigned to it to use the features and resources of the Standard tier.

## Clone an app to a different App Service plan

If you want to move the app to a different region, one alternative is app cloning. Cloning makes a copy of your app in a new or existing App Service plan in any region.

You can find **Clone App** in the **Development Tools** section of the menu.

> [!IMPORTANT]
> Cloning has some limitations that you can read about at [Azure App Service App cloning](app-service-web-app-cloning.md).

## Scale an App Service plan

To scale up ah App Service plan's pricing tier, see [Scale up an app in Azure](web-sites-scale.md).

To scale out an app's instance count, see [Scale instance count manually or automatically](../monitoring-and-diagnostics/insights-how-to-scale.md).

<a name="delete"></a>

## Delete an App Service plan

To avoid unexpected charges, when the last app hosted in an App Service plan is deleted, the resulting empty App Service plan is also deleted by default.

If you remove all apps from a plan but choose keep the plan, you should change the plan to **Free** tier so that you don't get charged.

> [!IMPORTANT]
> **App Service plans** that have no apps associated to them still incur charges since they continue to reserve the configured VM instances.

## Next steps

> [!div class="nextstepaction"]
> [Scale up an app in Azure](web-sites-scale.md)

[change]: ./media/azure-web-sites-web-hosting-plans-in-depth-overview/change-appserviceplan.png
[createASP]: ./media/azure-web-sites-web-hosting-plans-in-depth-overview/create-appserviceplan.png
[createWebApp]: ./media/azure-web-sites-web-hosting-plans-in-depth-overview/create-web-app.png
