---
title: Routine maintenance for Azure App Service
description: Learn more about routine, planned maintenance to help keep the App Service platform up to date and secure.
author: msangapu-msft
tags: app-service

ms.topic: article
ms.date: 02/08/2023
ms.author: msangapu
---

# Routine (planned) maintenance for Azure App Service

Routine maintenance covers behind-the-scenes updates to Azure App Service. Types of maintenance can be performance improvements, bug fixes, new features, or security updates. App Service maintenance can be on the service itself or the underlying operating system.

> [!IMPORTANT]
> A breaking change or deprecation of functionality is not a part of routine maintenance. For more information, see [Modern Lifecycle Policy](/lifecycle/policies/modern).

Microsoft service quality and uptime guarantees continue to apply during maintenance periods. Notifications mention maintenance periods to help customers get visibility into platform changes.

## What to expect

Like personal computers, mobile phones, and other devices, machines in the cloud need the latest updates. Unlike physical devices, cloud solutions like Azure App Service provide ways to handle routine maintenance with more ease. There's no need to stop working and wait until patches are installed. Any workload can be shifted to different hardware in a matter of seconds and while updates are installed. The updates happen monthly but can vary, depending on your organization's needs and other factors.

Because a typical cloud solution consists of multiple applications, databases, storage accounts, functions, and other resources, parts of your solutions can undergo maintenance at different times. Some of this coordination is related to geography, region, datacenters, and availability zones. It can also be due to the cloud, where not everything is touched simultaneously. For more information, see [Safe deployment practices](/devops/operate/safe-deployment-practices).

The following screenshot shows an example of a maintenance event.

:::image type="content" source="./media/routine-maintenance/routine-maintenance.png" alt-text="Screenshot of a maintenance event in the Azure portal.":::

In order from top to bottom, the example shows:

- A descriptive title of the maintenance event.
- Affected regions and subscriptions.
- The expected maintenance window.

## Frequently asked questions

### Why is the maintenance taking so long?

Fundamentally, routine maintenance delivers the latest updates to the platform and service. It's hard to predict how the maintenance will affect individual apps down to a specific time, so notifications tend to be more general. The time ranges in notifications don't reflect the experiences at the app level, but rather the overall operation across all resources. Apps that undergo maintenance instantly restart on freshly updated machines and continue working. There's no downtime when requests and traffic aren't served.

### Why am I getting so many notifications?

A typical scenario is that customers have multiple applications that are upgraded at different times. To avoid sending notifications for each of them, we send one notification that captures multiple resources. We send the notification at the beginning and throughout the maintenance window. You might receive multiple reminders for the same rollout if the time window is long, so you can more easily correlate any restarts, interruptions, or other issues.

### How is routine maintenance related to SLA?

Platform maintenance shouldn't affect application uptime or availability. Applications continue to stay online while platform maintenance occurs.

Platform maintenance might cause applications to be cold started on new virtual machines, which can lead to delays. An application is still considered to be online while it's cold starting. To minimize or avoid cold starts, consider using [local cache for Windows apps](overview-local-cache.md) and [health check](monitor-instances-health-check.md).

We don't expect sites to incur any service-level agreement (SLA) violations during the maintenance windows.

### How does the upgrade ensure the smooth operation of my apps?

Azure App Service represents a fleet of scale units that provide hosting of web applications and solutions to customers. Each scale unit is divided into upgrade domains and availability zones. This division optimizes placements of bigger App Service plans and smooth deployments, because not all machines in each scale unit are updated at once.

Maintenance operations upgrade machines iteratively while App Service monitors the health of the fleet. If there's a problem, the system can stop the rollout. For more information about this process, see the blog post [Demystifying the magic behind App Service OS updates](https://azure.github.io/AppService/2018/01/18/Demystifying-the-magic-behind-App-Service-OS-updates.html).

### Are business hours reflected?

Maintenance operations are optimized to start outside the standard business hours of 9 AM to 5 PM. Statistically, that's the best time for any interruptions and restarts of workloads because there's less stress on the system (in customer applications and transitively on the platform itself). For App Service plans and App Service Environment v2, maintenance can continue into business hours during longer maintenance events.

### What are my options to control routine maintenance?

If you run your workloads in an isolated product via App Service Environment v3, you can schedule the upgrades if necessary. For more information about this capability, see the blog post [Control and automate planned maintenance for App Service Environment v3](https://azure.github.io/AppService/2022/09/15/Configure-automation-for-upgrade-preferences-in-App-Service-Environment.html).

### Can I prepare my apps better for restarts?

If your applications need extra time during restarts to come online, consider using [health check](monitor-instances-health-check.md). A typical pattern for needing extra time is heavy dependency on external resources during application warmup or startup.

You can use health check to inform the platform that your application isn't ready to receive requests yet. The system can use that information to route requests to other instances in your App Service plan. For such cases, we recommend that you have at least two instances in the plan.

### My applications have been online, but things are worse since these notifications started showing up. What changed?

Updates and maintenance events have been happening to the platform since its inception. The frequency of updates decreased over time, so the number of interruptions also decreased and uptime increased. However, you now have more visibility into all changes. Increased visibility might cause the perception that more changes are happening.

## Next steps

Get more information about maintenance notifications by reading the blog post [Routine Planned Maintenance Notifications for Azure App Service](https://azure.github.io/AppService/2022/02/01/App-Service-Planned-Notification-Feature.html).
