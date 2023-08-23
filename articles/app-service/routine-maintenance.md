---
title: App Service routine maintenance
description: Learn more about the routine, planned maintenance to keep the App Service platform up-to-date and secure.
author: msangapu-msft
tags: app-service

ms.topic: article
ms.date: 02/08/2023
ms.author: msangapu
---
# Routine (planned) maintenance for App Service

Routine maintenance covers behind the scenes updates to the Azure App Service platform. Types of maintenance can be performance improvements, bug fixes, 
new features, or security updates. App Service maintenance can be on App Service itself or the underlying operating system.

>[!IMPORTANT]
>A breaking change or deprecation of functionality is not a part of routine maintenance (see [Modern Lifecycle Policy - Microsoft Lifecycle | Microsoft Learn](/lifecycle/policies/modern) for deprecation topic for details).
>

Our service quality and uptime guarantees continue to apply during maintenance periods. Maintenance periods are mentioned to help customers to get visibility into platform changes.

## What to expect

Like security updates on personal computers, mobile phones and other devices, even machines in the cloud need the latest updates. Unlike physical devices, cloud solutions like Azure App Service provide ways to overcome these routines with more ease. There's no need to "stop working" for a certain period and wait until patches are installed. Any workload can be shifted to different hardware in a matter of seconds and while updates are installed. The updates are made monthly, but can vary on the needs and other factors.

Since a typical cloud solution consists of multiple applications, databases, storage accounts, functions, and other resources, various parts of your solutions can be undergoing maintenance at different times. Some of this coordination is related to geography, region, data centers, and availability zones. It can also be due to the cloud where not everything is touched simultaneously.

[Safe deployment practices - Azure DevOps | Microsoft Learn](/devops/operate/safe-deployment-practices)

:::image type="content" source="./media/routine-maintenance/routine-maintenance.png" alt-text="Screenshot of a maintenance event in the Azure Portal.":::

In order from top to bottom we see:
- A descriptive title of the maintenance event
- Impacted regions and subscriptions
- Expected maintenance window

## Frequently Asked Questions

### Why is the maintenance taking so long?

The maintenance fundamentally represents delivering latest updates to the platform and service. It's difficult to predict when individual apps would be affected down to a specific time, so more generic notifications are sent out. The time ranges in those notifications don't reflect the experiences at the app level, but the overall operation across all resources. Apps which undergo maintenance instantly restart on freshly updated machines and continue working. There's no downtime when requests/traffic aren't served.

### Why am I getting so many notifications?

A typical scenario is that customers have multiple applications, and they are upgraded at different times. To avoid sending notifications for each of them, a more generic notification is sent that captures multiple resources. The notification is sent at the beginning and throughout the maintenance window. Due to the time window being longer, you can receive multiple reminders for the same rollout so you can easier correlate any restart/interruption/issue in case it is needed.

### How is routine maintenance related to SLA?

Platform maintenance isn't expected to impact application uptime or availability. Applications continue to stay online while platform maintenance occurs. Platform maintenance may cause applications to be cold started on new virtual machines, which can lead to cold start delays. An application is still considered to be online, even while cold-starting. For best practices to minimize/avoid cold starts, consider using [local cache for Windows apps](overview-local-cache.md) as well as [Health check](monitor-instances-health-check.md). It's not expected that sites would incur any SLA violation during maintenance windows.

### How does the upgrade work how does it ensure the smooth operation of my apps?

Azure App Service represents a fleet of scale units, which provide hosting of web applications/solutions to the customers. Each scale unit is further divided into smaller pieces and sliced into a concept of upgrade domains and availability zones. This is to optimize placements of bigger App Service Plans and smooth deployments since not all machines in each scale unit are updated at once. Fleet upgrades machines iteratively while monitoring the health of the fleet so any time there is an issue, the system can stop the rollout. This process is described in detail at [Demystifying the magic behind App Service OS updates - Azure App Service](https://azure.github.io/AppService/2018/01/18/Demystifying-the-magic-behind-App-Service-OS-updates.html).

### Are business hours reflected?

Maintenance operations are optimized to start outside standard business hours (9-5pm) as statistically that is a better timing for any interruptions and restarts of workloads as there is a less stress on the system (in customer applications and transitively also on the platform itself). For App Service Plan and App Service Environment v2, maintenance can continue into business hours during longer maintenance events. 

### What are my options to control routine maintenance?

If you run your workloads in Isolated SKU via App Service Environment v3, you can also schedule the upgrades when needed. This is described with details at Control and automate planned maintenance for App Service Environment v3 - Azure App Service.

### Can I prepare my apps better for restarts?

If your applications need extra time during restarts to come online (a typical pattern would be heavy dependency on external resources during application warm-up/start-up), consider using [Health Check](monitor-instances-health-check.md). You can use this to communicate with the platform that your application is not ready to receive requests yet and the system can use that information to route requests to other instances in your App Service Plan. For such case, it's recommended to have at least two instances in the plan.

### My applications have been online, but since these notifications started showing up things are worse. What changed?

Updates and maintenance events have been happening to the platform since its inception. The frequency of updates decreased over time, so the number of interruptions also decreased and uptime increases. However, there is an increased level of visibility into all changes which can cause the perception that more changes are being made.

## Next steps

[Control and automate planned maintenance for App Service Environment v3 - Azure App Service](https://azure.github.io/AppService/2022/09/15/Configure-automation-for-upgrade-preferences-in-App-Service-Environment.html)

[Demystifying the magic behind App Service OS updates - Azure App Service](https://azure.github.io/AppService/2018/01/18/Demystifying-the-magic-behind-App-Service-OS-updates.html)

[Routine Planned Maintenance Notifications for Azure App Service - Azure App Service](https://azure.github.io/AppService/2022/02/01/App-Service-Planned-Notification-Feature.html)
