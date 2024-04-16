---
title: App Service plans
description: Learn how App Service plans work in Azure App Service, how they're billed to the customer, and how to scale them for your needs.
keywords: app service, azure app service, scale, scalable, scalability, app service plan, app service cost
ms.assetid: dea3f41e-cf35-481b-a6bc-33d7fc9d01b1
ms.topic: article
ms.date: 05/26/2023
ms.author: msangapu
author: msangapu-msft
ms.custom: UpdateFrequency3

---
# Azure App Service plan overview

An app service always runs in an _App Service plan_. In addition, [Azure Functions](../azure-functions/dedicated-plan.md) also has the option of running in an _App Service plan_. An App Service plan defines a set of compute resources for a web app to run. 

When you create an App Service plan in a certain region (for example, West Europe), a set of compute resources is created for that plan in that region. Whatever apps you put into this App Service plan run on these compute resources as defined by your App Service plan. Each App Service plan defines:

- Operating System (Windows, Linux)
- Region (West US, East US, and so on)
- Number of VM instances
- Size of VM instances (Small, Medium, Large)
- Pricing tier (Free, Shared, Basic, Standard, Premium, PremiumV2, PremiumV3, Isolated, IsolatedV2)

The _pricing tier_ of an App Service plan determines what App Service features you get and how much you pay for the plan. The pricing tiers available to your App Service plan depend on the operating system selected at creation time. There are the following categories of pricing tiers:

- **Shared compute**: **Free** and **Shared**, the two base tiers, runs an app on the same Azure VM as other App Service apps, including apps of other customers. These tiers allocate CPU quotas to each app that runs on the shared resources, and the resources cannot scale out. These tiers are intended to be used only for development and testing purposes.
- **Dedicated compute**: The **Basic**, **Standard**, **Premium**, **PremiumV2**, and **PremiumV3** tiers run apps on dedicated Azure VMs. Only apps in the same App Service plan share the same compute resources. The higher the tier, the more VM instances are available to you for scale-out.
- **Isolated**: The **Isolated** and **IsolatedV2** tiers run dedicated Azure VMs on dedicated Azure Virtual Networks. It provides network isolation on top of compute isolation to your apps. It provides the maximum scale-out capabilities.

Each tier also provides a specific subset of App Service features. These features include custom domains and TLS/SSL certificates, autoscaling, deployment slots, backups, Traffic Manager integration, and more. The higher the tier, the more features are available. To find out which features are supported in each pricing tier, see [App Service plan details](https://azure.microsoft.com/pricing/details/app-service/windows/#pricing).

<a name="new-pricing-tier-premiumv3"></a>

## Premium V3 pricing tier

The **PremiumV3** pricing tier guarantees machines with faster processors (minimum 195 [ACU](../virtual-machines/acu.md) per virtual CPU), SSD storage, memory-optimized options and quadruple memory-to-core ratio compared to **Standard** tier. **PremiumV3** also supports higher scale via increased instance count while still providing all the advanced capabilities found in **Standard** tier. All features available in the existing **PremiumV2** tier are included in **PremiumV3**.

Multiple VM sizes are available for this tier including 4-to-1 and 8-to-1 memory-to-core ratios:
 
- P0v3&nbsp;&nbsp;&nbsp;&nbsp;(1 vCPU, 4 GiB of memory) 
- P1v3&nbsp;&nbsp;&nbsp;&nbsp;(2 vCPU, 8 GiB of memory)
- P1mv3&nbsp;(2 vCPU, 16 GiB of memory)
- P2v3&nbsp;&nbsp;&nbsp;&nbsp;(4 vCPU, 16 GiB of memory) 
- P2mv3&nbsp;(4 vCPU, 32 GiB of memory)
- P3v3&nbsp;&nbsp;&nbsp;&nbsp;(8 vCPU, 32 GiB of memory)  
- P3mv3&nbsp;(8 vCPU, 64 GiB of memory)
- P4mv3&nbsp;(16 vCPU, 128 GiB of memory) 
- P5mv3&nbsp;(32 vCPU, 256 GiB of memory) 

For **PremiumV3** pricing information, see [App Service Pricing](https://azure.microsoft.com/pricing/details/app-service/).

To get started with the new **PremiumV3** pricing tier, see [Configure PremiumV3 tier for App Service](app-service-configure-premium-tier.md).

## How does my app run and scale?

In the **Free** and **Shared** tiers, an app receives CPU minutes on a shared VM instance and cannot scale out. In other tiers, an app runs and scales as follows.

When you create an app in App Service, it's part of an App Service plan. When the app runs, it runs on all the VM instances configured in the App Service plan. If multiple apps are in the same App Service plan, they all share the same VM instances. If you have multiple deployment slots for an app, all deployment slots also run on the same VM instances. If you enable diagnostic logs, perform backups, or run [WebJobs](), they also use CPU cycles and memory on these VM instances.

In this way, the App Service plan is the scale unit of the App Service apps. If the plan is configured to run five VM instances, then all apps in the plan run on all five instances. If the plan is configured for autoscaling, then all apps in the plan are scaled out together based on the autoscale settings.

For information on scaling out an app, see [Scale instance count manually or automatically](../azure-monitor/autoscale/autoscale-get-started.md).

<a name="cost"></a>

## How much does my App Service plan cost?

This section describes how App Service apps are billed. For detailed, region-specific pricing information, see [App Service Pricing](https://azure.microsoft.com/pricing/details/app-service/).

Except for **Free** tier, an App Service plan carries a charge on the compute resources it uses.

- In the **Shared** tier, each app receives a quota of CPU minutes, so _each app_ is charged for the CPU quota.
- In the dedicated compute tiers (**Basic**, **Standard**, **Premium**, **PremiumV2**, **PremiumV3**), the App Service plan defines the number of VM instances the apps are scaled to, so _each VM instance_ in the App Service plan is charged. These VM instances are charged the same regardless of how many apps are running on them. To avoid unexpected charges, see [Clean up an App Service plan](app-service-plan-manage.md#delete).
- In the **Isolated** and **IsolatedV2** tiers, the App Service Environment defines the number of isolated workers that run your apps, and _each worker_ is charged. In addition, in the **Isolated** tier there's a flat Stamp Fee for running the App Service Environment itself.

You don't get charged for using the App Service features that are available to you (configuring custom domains, TLS/SSL certificates, deployment slots, backups, etc.). The exceptions are:

- App Service Domains - you pay when you purchase one in Azure and when you renew it each year.
- App Service Certificates - you pay when you purchase one in Azure and when you renew it each year.
- IP-based TLS connections - There's an hourly charge for each IP-based TLS connection, but some **Standard** tier or above gives you one IP-based TLS connection for free. SNI-based TLS connections are free.

> [!NOTE]
> If you integrate App Service with another Azure service, you may need to consider charges from these other services. For example, if you use Azure Traffic Manager to scale your app geographically, Azure Traffic Manager also charges you based on your usage. To estimate your cross-services cost in Azure, see [Pricing calculator](https://azure.microsoft.com/pricing/calculator/). 

Want to optimize and save on your cloud spending?

[!INCLUDE [cost-management-horizontal](../../includes/cost-management-horizontal.md)]

## What if my app needs more capabilities or features?

Your App Service plan can be scaled up and down at any time. It is as simple as changing the pricing tier of the plan. You can choose a lower pricing tier at first and scale up later when you need more App Service features.

For example, you can start testing your web app in a **Free** App Service plan and pay nothing. When you add your [custom DNS name](app-service-web-tutorial-custom-domain.md) to the web app, just scale your plan up to **Shared** tier. Later, when you want to [create a TLS binding](configure-ssl-bindings.md), scale your plan up to **Basic** tier. When you want to have [staging environments](deploy-staging-slots.md), scale up to **Standard** tier. When you need more cores, memory, or storage, scale up to a bigger VM size in the same tier.

The same works in the reverse. When you feel you no longer need the capabilities or features of a higher tier, you can scale down to a lower tier, which saves you money.

For information on scaling up the App Service plan, see [Scale up an app in Azure](manage-scale-up.md).

If your app is in the same App Service plan with other apps, you may want to improve the app's performance by isolating the compute resources. You can do it by moving the app into a separate App Service plan. For more information, see [Move an app to another App Service plan](app-service-plan-manage.md#move).

## Should I put an app in a new plan or an existing plan?

Since you pay for the computing resources your App Service plan allocates (see [How much does my App Service plan cost?](#cost)), you can potentially save money by putting multiple apps into one App Service plan. You can continue to add apps to an existing plan as long as the plan has enough resources to handle the load. However, keep in mind that apps in the same App Service plan all share the same compute resources. To determine whether the new app has the necessary resources, you need to understand the capacity of the existing App Service plan, and the expected load for the new app. Overloading an App Service plan can potentially cause downtime for your new and existing apps.

Isolate your app into a new App Service plan when:

- The app is resource-intensive. The number may actually be lower depending on how resource intensive the hosted applications are, however as a general guidance, you may refer to the table below:

  | App Service Plan SKU | Max Apps |
  |--|--|
  | B1, S1, P1v2, I1v1 | 8 |
  | B2, S2, P2v2, I2v1 | 16 |
  | B3, S3, P3v2, I3v1 | 32 |
  | P0v3 | 8 |
  | P1v3, I1v2 | 16 |
  | P2v3, I2v2, P1mv3 | 32 |
  | P3v3, I3v2, P2mv3 | 64 |
  | I4v2, I5v2, I6v2 | Max density bounded by vCPU usage |
  | P3mv3, P4mv3, P5mv3 | Max density bounded by vCPU usage |

- You want to scale the app independently from the other apps in the existing plan.
- The app needs resource in a different geographical region.

> [!NOTE]
>  An active slot is also classified as an active app as it too is competing for resources on the same App Service Plan.

This way you can allocate a new set of resources for your app and gain greater control of your apps.

## Next steps

> [!div class="nextstepaction"]
> [Manage an App Service plan](app-service-plan-manage.md)
