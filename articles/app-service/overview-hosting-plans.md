---
title: Azure App Service Plans
description: Learn how App Service plans work in Azure App Service, how they're billed, and how to scale them for your needs.
keywords: app service, azure app service, scale, scalable, scalability, app service plan, app service cost
ms.assetid: dea3f41e-cf35-481b-a6bc-33d7fc9d01b1
ms.topic: overview
ms.date: 07/02/2025
ms.update-cycle: 1095-days
ms.author: msangapu
author: msangapu-msft
ms.custom: UpdateFrequency3
#customer intent: As an app developer, I want to understand which service plan is right for apps in my organization in Azure App Service.
---
# What are Azure App Service plans?

An *Azure App Service plan* defines a set of compute resources for a web app to run. An app service always runs in an App Service plan. [Azure Functions](../azure-functions/dedicated-plan.md) also has the option of running in an App Service plan.

When you create an App Service plan in a certain region, you create a set of compute resources for that plan in that region. Whatever apps you put into the App Service plan run on those compute resources, as defined in the plan.

Each App Service plan defines:

- Operating system (Windows, Linux)
- Region (West US, East US, and so on)
- Number of virtual machine (VM) instances
- Size of VM instances (small, medium, large)
- Pricing tier (Free, Shared, Basic, Standard, Premium, PremiumV2, PremiumV3, IsolatedV2)

## Pricing tiers

The pricing tier of an App Service plan determines what App Service features you get and how much you pay for the plan. The pricing tiers available to your App Service plan depend on the operating system that you select when you create it. This table shows the categories of pricing tiers:

| Category | Tiers | Description |
|:-|:-|:-|
| Shared compute | Free, Shared | Free and Shared, the two base tiers, run an app on the same Azure VM as other App Service apps, including apps of other customers. These tiers allocate CPU quotas to each app that runs on the shared resources. The resources can't scale out. These tiers are intended for only development and testing purposes. |
| Dedicated compute | Basic, Standard, Premium, PremiumV2, PremiumV3 | The Basic, Standard, Premium, PremiumV2, and PremiumV3 tiers run apps on dedicated Azure VMs. Only apps in the same App Service plan share the same compute resources. The higher the tier, the more VM instances that are available to you for scale-out. |
| Isolated | IsolatedV2 | The IsolatedV2 tier runs dedicated Azure VMs on dedicated Azure virtual networks. This tier provides network isolation on top of compute isolation to your apps. It provides the maximum scale-out capabilities. |

Each tier also provides a specific subset of App Service features. These features include custom domains and TLS/SSL certificates, autoscaling, deployment slots, backups, Azure Traffic Manager integration, and more. The higher the tier, the more features that are available. To find out which features are supported in each pricing tier, see the [App Service plan details](https://azure.microsoft.com/pricing/details/app-service/windows/#pricing).

You can find more comparisons of plans in [App Service limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-app-service-limits).

<a name="new-pricing-tier-premiumv3"></a>

### PremiumV3 pricing tier

The PremiumV3 pricing tier provides machines with faster processors (minimum 195 [Azure Compute Units](/azure/virtual-machines/acu) per virtual CPU), SSD storage, memory-optimized options, and quadruple memory-to-core ratio compared to the Standard tier.

PremiumV3 also supports higher scale by using increased instance count, while it still provides the advanced capabilities in the Standard tier. PremiumV3 includes all features available in the PremiumV2 tier.

Multiple VM sizes are available for this tier, including 4-to-1 and 8-to-1 memory-to-core ratios:

| App Service plan | Cores (vCPU) | Memory (GiB) |
|:-|:-|:-|
| P0v3 | 1 | 4 |
| P1v3 | 2 | 8 |
| P1mv3 | 2 | 16 |
| P2v3 | 4 | 16 |
| P2mv3 | 4 | 32 |
| P3v3 | 8 | 32 |
| P3mv3 | 8 | 64 |
| P4mv3 | 16 | 128 |
| P5mv3 | 32 | 256 |

For PremiumV3 pricing information, see [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/).

To get started with the PremiumV3 pricing tier, see [Configure PremiumV3 tier for Azure App Service](app-service-configure-premium-tier.md).

## Considerations for running and scaling an app

In the Free and Shared tiers, an app receives CPU minutes on a shared VM instance and can't scale out.

In other tiers, an app runs and scales as follows:

- If you create an app in App Service, it's part of an App Service plan. When the app runs, it runs on all the VM instances configured in the App Service plan.
- If multiple apps are in the same App Service plan, they all share the same VM instances.
- If you have multiple deployment slots for an app, all deployment slots also run on the same VM instances.
- If you enable diagnostic logs, perform backups, or run [WebJobs](webjobs-create.md), they also use CPU cycles and memory on these VM instances.

In this way, the App Service plan is the scale unit of the App Service apps. If the plan is configured to run five VM instances, then all apps in the plan run on all five instances. If the plan is configured for autoscaling, then all apps in the plan are scaled out together, based on the autoscale settings.

For more information on scaling out an app, see [Get started with autoscale in Azure](/azure/azure-monitor/autoscale/autoscale-get-started).

<a name="cost"></a>

## Cost of App Service plans

This section describes how App Service apps are billed. For detailed, region-specific pricing information, see [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/).

Except for the Free tier, an App Service plan carries a charge on the compute resources that it uses:

- **Shared tier**: Each app receives a quota of CPU minutes, so *each app* is charged for the CPU quota.
- **Dedicated compute tiers (Basic, Standard, Premium, PremiumV2, PremiumV3)**: The App Service plan defines the number of VM instances that the apps are scaled to, so *each VM instance* in the App Service plan is charged. These VM instances are charged the same, regardless of how many apps are running on them. To avoid unexpected charges, see [Delete an App Service plan](app-service-plan-manage.md#delete-an-app-service-plan).
- **IsolatedV2 tier**: The App Service Environment defines the number of isolated workers that run your apps, and *each worker* is charged.

You aren't charged for using the App Service features that are available to you. These features include configuring custom domains, TLS/SSL certificates, deployment slots, and backups. The exceptions are:

- **App Service domains**: You pay when you purchase one in Azure and when you renew it each year.
- **App Service certificates**: You pay when you purchase one in Azure and when you renew it each year.
- **IP-based TLS connections**: There's an hourly charge for each IP-based TLS connection, but some Standard or higher tiers give you one IP-based TLS connection for free. Server Name Indication (SNI)-based TLS connections are free.

If you integrate App Service with another Azure service, you might need to consider charges from that service. For example, if you use Azure Traffic Manager to scale your app geographically, Traffic Manager also charges you based on your usage. To estimate your cross-services cost in Azure, see [Pricing calculator](https://azure.microsoft.com/pricing/calculator/).

> [!TIP]
> [!INCLUDE [cost-management-horizontal](../../includes/cost-management-horizontal.md)]

## <a name = "what-if-my-app-needs-more-capabilities-or-features"></a> Scaling for capabilities or features

You can scale your App Service plan up or down at any time. It's as simple as changing the pricing tier of the plan. You can choose a lower pricing tier at first, and then scale up later when you need more App Service features.

For example, you can start testing your web app in a Free-tier App Service plan and pay nothing. When you add your [custom DNS name](app-service-web-tutorial-custom-domain.md) to the web app, just scale your plan up to the Shared tier. Later, when you want to [create a TLS binding](configure-ssl-bindings.md), scale your plan up to the Basic tier. When you want to have [staging environments](deploy-staging-slots.md), scale up to the Standard tier. When you need more cores, memory, or storage, scale up to a bigger VM size in the same tier.

The same process works in reverse. When you no longer need the capabilities or features of a higher tier, you can scale down to a lower tier and save money.

For more information on scaling up an App Service plan, see [Scale up an app in Azure App Service](manage-scale-up.md).

If your app is in the same App Service plan with other apps, you might want to improve the app's performance by isolating the compute resources. You can isolate the resources by [moving the app to a separate App Service plan](app-service-plan-manage.md#move-an-app-to-another-app-service-plan).

## Decision to use a new plan or an existing plan for an app

You pay for the computing resources that your App Service plan allocates as described in the [earlier section about cost](#cost). You can potentially save money by putting multiple apps into one App Service plan. You can continue to add apps to an existing plan as long as the plan has enough resources to handle the load.

However, keep in mind that apps in the same App Service plan all share the same compute resources. To determine whether the new app has the necessary resources, you need to understand the capacity of the existing App Service plan, along with the expected load for the new app. Overloading an App Service plan can cause downtime for your new and existing apps. You can find more comparisons between plans at [App Service limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-app-service-limits).

Isolate your app in a new App Service plan when:

- The app is resource intensive. For general guidance, use this table:

  | App Service plan | Maximum apps |
  |--|--|
  | B1, S1, P1v2, I1v1 | 8 |
  | B2, S2, P2v2, I2v1 | 16 |
  | B3, S3, P3v2, I3v1 | 32 |
  | P0v3 | 8 |
  | P1v3, I1v2 | 16 |
  | P2v3, I2v2, P1mv3 | 32 |
  | P3v3, I3v2, P2mv3 | 64 |
  | I4v2, I5v2, I6v2 | Maximum density bound by vCPU usage |
  | P3mv3, P4mv3, P5mv3 | Maximum density bound by vCPU usage |
- You want to scale the app independently from the other apps in the existing plan.
- The app needs resources in a different geographical region. This way, you can allocate a new set of resources for your app and gain greater control of your apps.

> [!NOTE]
> An active slot is also classified as an active app because it's competing for resources in the same App Service plan.

## Related content

- [Manage an App Service plan](app-service-plan-manage.md)
