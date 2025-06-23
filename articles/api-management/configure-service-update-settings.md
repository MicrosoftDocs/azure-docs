---
title: Configure API Management settings for service updates
description: Learn how to configure settings for applying service updates to your Azure API Management instance. Settings include the upgrade group and the maintenance window.
author: dlepow
ms.service: azure-api-management
ms.topic: how-to
ms.date: 04/08/2025
ms.author: danlep
---

# Configure service update settings for your API Management instances 

[!INCLUDE [api-management-availability-premium-standard-basic](../../includes/api-management-availability-premium-standard-basic.md)]


This article shows you how to configure *service update* settings (preview) in your API Management instance. Azure periodically applies service updates automatically to API Management instances, using a phased rollout approach. These updates include new features, security enhancements, and reliability improvements. 

You can't control exactly when Azure updates each API Management instance, but in select service tiers you can choose an *update group* (also called a *release channel*) for your instance so that it receives updates earlier or later than it usually would during an update rollout. You can also configure a *maintenance window* during the day when you want your instance to receive updates. 

* **Update group** - A set of instances that receive API Management service updates during a production rollout, which can take from several days to several weeks to complete. 

    Choose from:
    * **Early** - Receive updates early in the rollout, for testing and early access to new features. This option is not recommended for production deployments.
    * **Default** - Receive updates as part of the regular release rollout. This option is recommended for most services, including production deployments.
    * **Late** - Receive updates later than the previous groups, typically weeks after the initial rollout. This option is recommended for mission-critical deployments only.
    * **AI Gateway Early** (GenAI release channel) - Get early access to the latest [AI gateway features and updates](genai-gateway-capabilities.md) before they reach other update groups. Receive other service updates as part of the **Late** rollout group.

    > [!NOTE]
    > Azure deploys all updates using a [safe deployment practices (SDP) framework](https://azure.microsoft.com/blog/advancing-safe-deployment-practices/). Updates released early in a rollout might be less stable and replaced later by stable releases. All instances are eventually updated to the most stable release builds.

    For example, you might want to add a test instance to the **Early** update group. This instance receives updates before your production instances, which you put in the **Default** or **Late** update group. You can monitor the test instance for any issues caused by the updates before they reach your production instances. [Learn more about canary deployments](#canary-deployment-strategies) with API Management

 * **Maintenance window** - An 8-hour daily period when you want your instance to receive updates. By default, the maintenance window is 10 PM to 6 AM in the instance's timezone. 

    Service disruptions are rare during an update, but you might want to reduce risk by selecting times of low service use. For example, for production instances, set a maintenance window during weekday evenings and weekend mornings. 

## Configure service update settings

1. Sign in to the [Azure portal](https://portal.azure.com) and go to your API Management instance.
1. In the left menu, select **Deployment + infrastructure** > **Service update settings**.
1. Under **Update group**, review the current setting and select **Edit** to change it.
1. Under **Maintenance window**, review the current settings and select **Edit** to change them. For each day you can select the default window, a different standard window, or a custom window by day.
 
## Know when your instances are receiving updates 

Here's how to know about service updates that are expected or are in progress. 

* API Management updates are announced on the [API Management GitHub repo](https://github.com/Azure/API-Management/releases). Subscribe to receive notifications from this repository to know when update rollouts begin. 

* Monitor service updates that are taking place in your API Management instance by using the Azure [Activity log](/azure/azure-monitor/essentials/activity-log). The "Scheduled maintenance" event is emitted when an update begins.

    :::image type="content" source="media/configure-service-update-settings/scheduled-maintenance.png" alt-text="Scheduled maintenance event in Activity log in the portal.":::

    To receive notifications automatically, [set up an alert](/azure/azure-monitor/alerts/alerts-activity-log) on the Activity log.

* By default, updates roll out to regions in the following phases: Azure EUAP regions, followed by West Central US, followed by remaining regions in several later phases. The sequence of regions updated in the later deployment phases differs from service to service. You can expect at least 24 hours between each phase of the production rollout.

* Within a region, API Management instances in the Premium tier receive updates several hours later than those in other service tiers.

> [!TIP]
> If your API Management instance is deployed to multiple locations (regions), the timing of updates is determined by the instance's **Primary** location.

## Canary deployment strategies
  
You can use an API Management instance assigned to a specific update group (if that option is available) or deployed in a specific Azure region as a canary deployment that receives updates earlier than your production instances.

* **Add instance to Early update group** - Use an API Management instance in the Early update group to validate updates early in a production rollout. This instance is effectively your canary deployment. 

* **Deploy in canary region** - If you have access to an Azure EUAP region, use an instance there to validate updates as soon as they're released to the production pipeline. Learn about the [Azure region access request process](/troubleshoot/azure/general/region-access-request-process).

    > [!NOTE]
    > Because of capacity constraints in EUAP regions, you might not be able to scale API Management instances as needed.  

* **Deploy in pilot region** - Use an instance in the West Central US to simulate your production environment, or use it in production for noncritical API traffic. While this region receives updates after the EUAP regions, a deployment there is more likely to identify regressions that are specific to your service configuration.

* **Deploy duplicate instances in a region** - If your production workload is a Premium tier instance in a specific region, consider deploying a similarly configured instance in a lower tier that receives updates earlier. For example, configure a preproduction instance in the Developer tier to validate updates. 
 
## Related content

* Learn [how to monitor](api-management-howto-use-azure-monitor.md) your API Management instance.
* Learn about other options to [observe](observability.md) your API Management instance.
