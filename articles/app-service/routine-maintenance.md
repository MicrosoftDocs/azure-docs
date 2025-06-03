---
title: Routine Maintenance for Azure App Service
description: Learn more about routine, planned maintenance to help keep the App Service platform up to date and secure.
author: msangapu-msft
tags: app-service

ms.topic: article
ms.date: 05/19/2025
ms.author: msangapu
ms.collection: ce-skilling-ai-copilot
ms.custom:
  - build-2025
---

# Routine planned maintenance for Azure App Service

Routine maintenance includes behind-the-scenes updates to Azure App Service. These updates may include performance improvements, bug fixes, new features, or security updates. Maintenance can apply to the App Service platform or the underlying operating system.

> [!IMPORTANT]
> A breaking change or deprecation of functionality isn't part of routine maintenance. For more information, see [Modern Lifecycle Policy](/lifecycle/policies/modern).

Microsoft's service quality and uptime guarantees continue to apply during maintenance periods. Notifications are provided to give customers visibility into platform changes.

## What to expect

Like personal computers, mobile phones, and other devices, machines in the cloud need regular updates. Unlike physical devices, Azure App Service handles routine maintenance with minimal disruption. Workloads can be shifted to updated hardware in seconds, allowing updates to proceed without downtime.

Maintenance typically occurs monthly but may vary depending on your organization's needs and other factors.

Because a typical cloud solution consists of multiple applications, databases, storage accounts, functions, and other resources, parts of your solution may undergo maintenance at different times. This variation can be due to geography, region, datacenters, and availability zones. For more information, see [Safe deployment practices](/devops/operate/safe-deployment-practices).

To find maintenance events, search for **Service Health** in the Azure portal. Under **Active Events**, select **Planned maintenance**.

:::image type="content" source="media/routine-maintenance/routine-maintenance.png" alt-text="Screenshot of a maintenance event in the Azure portal." lightbox="media/routine-maintenance/routine-maintenance.png":::

From top to bottom, the example shows:

- A descriptive title of the maintenance event.
- Affected regions and subscriptions.
- The expected maintenance window.

The following screenshots show additional information available through the **Impacted Resources** tab:

:::image type="content" source="media/routine-maintenance/routine-maintenance-first-page.png" alt-text="Screenshot of the Impacted Resources section in the Azure portal." lightbox="media/routine-maintenance/routine-maintenance-first-page.png":::

From left to right, the example shows:

- Selecting the **Impacted Resources** tab.
- The **More info** option.

:::image type="content" source="./media/routine-maintenance/routine-maintenance-more.png" alt-text="Screenshot of more info for a maintenance event in the Azure portal." lightbox="media/routine-maintenance/routine-maintenance-more.png":::

This example shows:

- The state of the maintenance, which can be pending, started, or completed.
- Once maintenance starts, timestamps can be viewed under **More info**.

## Frequently asked questions

### Why is the maintenance taking so long?

Routine maintenance delivers the latest updates to the platform and service. It's difficult to predict how maintenance affects individual apps, so notifications provide general time ranges. These ranges reflect the overall operation across all resources, not specific app-level experiences. Apps that undergo maintenance restart on freshly updated machines and continue working. There's no downtime when requests and traffic aren't served.

### Why am I getting so many notifications?

Customers often have multiple applications that are upgraded at different times. To avoid sending notifications for each of them, we send one notification that captures multiple resources. We send the notification at the beginning and throughout the maintenance window. You might receive multiple reminders for the same rollout if the time window is long, so you can more easily correlate any restarts, interruptions, or other issues.

### How is routine maintenance related to SLA?

Platform maintenance shouldn't affect application uptime or availability. Applications continue to stay online while platform maintenance occurs.

Platform maintenance might cause applications to be cold started on new virtual machines, which can lead to delays. An application is still considered to be online while it's cold starting. To minimize or avoid cold starts, consider using [local cache for Windows apps](overview-local-cache.md) and [health check](monitor-instances-health-check.md).

We don't expect sites to incur any service-level agreement (SLA) violations during the maintenance windows.

### How does the upgrade ensure the smooth operation of my apps?

Azure App Service represents a fleet of scale units that provide hosting of web applications and solutions to customers. Each scale unit is divided into upgrade domains and availability zones. This division optimizes placement of larger App Service plans and enables smooth deployments, because not all machines in each scale unit are updated at once.

Maintenance operations upgrade machines iteratively while App Service monitors the health of the fleet. If there's a problem, the system can stop the rollout. For more information about this process, see the blog post [Demystifying the magic behind App Service OS updates](https://azure.github.io/AppService/2018/01/18/Demystifying-the-magic-behind-App-Service-OS-updates.html).

### Are business hours reflected?

Yes, business hours are reflected for the time zone of the region. Maintenance operations are optimized to start outside the standard business hours of 9 AM to 5 PM. Statistically, that's the best time for any interruptions and restarts of workloads because there's less stress on the system (in customer applications and transitively on the platform itself). App Service maintenance is designed to minimize disruption during business hours. If any upgrades are still in progress by 9 AM in a given region, they will attempt to pause before reaching critical phases. Some underlying instance movements may continue, but they are orchestrated to overlap safely and maintain site availability.

### What are my options to control routine maintenance?

If you run your workloads in an isolated product via App Service Environment v3, you can schedule the upgrades if necessary. For more information about this capability, see the blog post [Control and automate planned maintenance for App Service Environment v3](https://azure.github.io/AppService/2022/09/15/Configure-automation-for-upgrade-preferences-in-App-Service-Environment.html).

### Can I prepare my apps better for restarts?

If your applications need extra time during restarts to come online, consider using [health check](monitor-instances-health-check.md). A typical pattern for needing extra time is heavy dependency on external resources during application warmup or startup.

You can use health check to inform the platform that your application isn't ready to receive requests yet. The system can use that information to route requests to other instances in your App Service plan. For such cases, we recommend that you have at least two instances in the plan.

### My applications have been online, but things are worse since these notifications started showing up. What changed?

Updates and maintenance events have been happening to the platform since its inception. The frequency of updates has decreased over time, so the number of interruptions has also decreased and uptime has increased. However, you now have more visibility into all changes. Increased visibility might cause the perception that more changes are happening.

## Related content

- [Routine Planned Maintenance Notifications for Azure App Service](https://azure.github.io/AppService/2022/02/01/App-Service-Planned-Notification-Feature.html)
