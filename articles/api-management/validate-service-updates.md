---
title: Configure API Management settings for service updates
description: Learn how to configure settings for applying service updates to your Azure API Management instance. Settings include the upgrade group and the maintenance window.
author: dlepow
ms.service: azure-api-management
ms.topic: how-to
ms.date: 03/18/2025
ms.author: danlep
---

# Configure service update settings for your API Management instances 

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

This article shows you how to configure service update settings in your API Management instance. From time to time, Azure applies service updates automatically to API Management instances, using a phased rollout approach that takes from several days to several weeks. These updates include new features, security enhancements, and reliability improvements. 

You can't control exactly when Azure updates each instance, but API Management lets you select an *update group* for your instance, and also a *maintenance window* during the day when you want your instance to receive updates. 

* **Update group** - A set of instances that receive updates during a production rollout. Choose from:
    * Early - Receive updates early. Updates may include preview builds.
    * Default - Receive updates according to the usual phased rollout.
    * Late - Receive updates later. Updates include the most stable builds.

    > [!NOTE]
    > Azure deploys all updates using a [safe deployment practices (SDP) framework](https://azure.microsoft.com/blog/advancing-safe-deployment-practices/). However, updates released earlier in a rollout may be less stable and may be replaced later by stable releases. All instances are eventually updated to the most stable release builds.

    For example, you might want to add a test instance to the Early update group. This instance would receive updates before your production instances, which you put in the Late update group. You can then monitor the test instance for any issues caused by the updates before they reach your production instances. [Learn more about canary deployments](#canary-deployment-strategies) with API Management

 * **Maintenance window** - An 8-hour daily period when you want your instance to receive updates. By default, the maintenance window is 10 PM to 6 AM in the instance's time zone. 

    Although service disruptions are rare during an update, you might want to reduce risk by selecting times of low service use. For example, you might want to set a maintenance window during weekday evenings and weekend mornings for your production instances. 


## Configure service update settings

1. Sign in to the [Azure portal](https://portal.azure.com) and go to your API Management instance.
1. In the left menu, select **Deployment + infrastructure ** > **Service update settings**.
1. Under **Update group**, review the current setting and select **Edit** to change it.
    > [!NOTE]
    > Only the Early update group is available for API Management instances in the Developer tier.

1. Under **Maintenance window**, review the current settings and select **Edit** to change them. For each day you can select the default window, a different standard window, or a custom window by day.
 

<!---
*"One of the value propositions of the cloud is that it’s continually improving, delivering new capabilities and features, as well as security and reliability enhancements. But since the platform is continuously evolving, change is inevitable."* - Mark Russinovich, CTO, Azure

Microsoft uses a safe deployment practices framework to thoroughly test, monitor, and validate service updates, and then deploy them to Azure regions using a phased approach. Even so, service updates that reach your API Management instances could introduce unanticipated risks to your production workloads and disrupt your API consumers. Learn how you can apply our safe deployment approach to reduce risks by validating the updates before they reach your production API Management environments.

## What is the Azure safe deployment practices framework? 

Azure deploys updates for a given service in a series of pre-production and production steps using a [safe deployment practices (SDP) framework](https://azure.microsoft.com/blog/advancing-safe-deployment-practices/). This framework is shown in simplified form in the following image:

:::image type="content" source="media/validate-service-updates/azure-safe-deployment-practices-framework.png" alt-text="Safe deployment practices framework" lightbox="media/validate-service-updates/azure-safe-deployment-practices-framework-expanded.png":::

Deployment phases include:

* **Development and test** - Azure engineering teams iterate on and validate updates for their services in development and test environments, with strict quality gates. 

    Careful monitoring, validation, and extensive testing for regressions during these stages reduce the risk that software changes will negatively affect customers' Azure workloads in production. 

* **Production** - Production-ready updates are then introduced to customers' Azure services in a phased production rollout pipeline: 

    * **Canary regions** receive updates first. These regions, known formally as **Early Updates Access Programs (EUAP)** regions, are full, production-level environments where scenarios can be validated at scale by Azure engineering teams and by invited customers. Currently, Azure canary regions are **East US 2 EUAP** and **Central US EUAP**. 

      > [!NOTE]
      > While the EUAP regions are production-ready, capacity may be limited, and services can be disrupted from time to time by disaster recovery drills and other testing by Azure engineering teams.

    * A **pilot** region supported for production use with an SLA receives the updates next. Currently, the pilot region is **West Central US**. 

    * After an observation period in the pilot region, the service updates are gradually introduced to remaining regions, broadening customers' exposure. 



## How do I safely deploy updates to my API Management instances? 

As an Azure customer, you're not able to control when to apply service updates to your API Management instances - updates are applied automatically. However, to minimize risk, you can use a strategy to deploy your noncritical instances to regions that receive updates before the regions running your production instances.

* The instance that receives updates first is effectively your canary deployment. 

    Use this instance to monitor for any issues caused by the updates against the baseline production instances. With monitoring, identify and mitigate potential regressions before your production services are affected. 

    > [!IMPORTANT]
    > If your canary instance experiences issues associated with the update process, please open an Azure support request as soon as possible.

* After you validate the canary deployment, you have greater confidence in updates that come later to your production instances.

See [example strategies](#canary-deployment-strategies) to create and use a canary deployment of API Management, later in this article.

--->
## Know when your instances are receiving updates 

Here is how to know about service updates that are expected or are in progress. 

* API Management updates are announced on the [API Management GitHub repo](https://github.com/Azure/API-Management/releases). We recommend that you subscribe to receive notifications from this repository to know when update rollouts begin. 

* Monitor service updates that are taking place in your API Management instance by using the Azure [Activity log](/azure/azure-monitor/essentials/activity-log). The "Scheduled maintenance" event is emitted when an update begins.

    :::image type="content" source="media/validate-service-updates/scheduled-maintenance.png" alt-text="Scheduled maintenance event in Activity log":::

    To receive notifications automatically, [set up an alert](/azure/azure-monitor/alerts/alerts-activity-log) on the Activity log.

* Updates roll out to regions in the following phases: Azure EUAP regions, followed by West Central US, followed by remaining regions in several later phases. The sequence of regions updated in the later deployment phases differs from service to service. You can expect at least 24 hours between each phase of the production rollout.

* Within a region, API Management instances in the Premium tier receive updates several hours later than those in other service tiers.

> [!TIP]
> If your API Management instance is deployed to multiple locations (regions), the timing of updates is determined by the instance's **Primary** location.

## Canary deployment strategies
  
Here are example strategies to use an API Management instance as a canary deployment that receives updates earlier than your production instances.

* **Add instance to Early update group** - If you have an API Management instance in the Early update group, you can use it to validate updates early in the production pipeline. This instance is effectively your canary deployment. 

* **Deploy in canary region** - If you have access to an Azure EUAP region, you can use an instance there to validate updates as soon as they're released to the production pipeline. Learn about the [Azure region access request process](/troubleshoot/azure/general/region-access-request-process).

    > [!NOTE]
    > Because of capacity constraints in EUAP regions, you might not be able to scale API Management instances as needed.  

* **Deploy in pilot region** - Use an instance in the West Central US to simulate your production environment, or use it in production for noncritical API traffic. While this region receives updates after the EUAP regions, a deployment there is more likely to identify regressions that are specific to your service configuration.

* **Deploy duplicate instances in a region** - If your production workload is a Premium tier instance in a specific region, consider deploying a similarly configured instance in a lower tier that receives updates earlier. For example, configure a pre-production instance in the Developer tier to validate updates. 
 
## Related content

* Learn [how to monitor](api-management-howto-use-azure-monitor.md) your API Management instance.
* Learn about other options to [observe](observability.md) your API Management instance.
