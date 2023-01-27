---
title: App Service routine maintenance
description: Learn more about the routine, planned maintenance to keep the App Service platform up-to-date and secure.
author: msangapu-msft
tags: app-service

ms.topic: sample
ms.date: 01/27/2023
ms.author: msangapu
---
# Routine (planned) maintenance for App Service

Routine maintenance is a term which covers changes in the platform
behind the scenes. It can be various performance fixes, improvements,
new features, or security updates. Since App Service is a managed
platform and consists of multiple layers of the stack, all those said
changes can be in both service itself (Azure App Service) and the
underlying OS (both Windows and Linux) of individual machines which are
used to run the service.

Unless communicated clearly upfront, a breaking change or deprecation of
functionality is not a part of such maintenance (see [Modern Lifecycle
Policy - Microsoft Lifecycle | Microsoft
Learn](https://learn.microsoft.com/en-US/lifecycle/policies/modern) for
deprecation topic for details).

Our service quality and uptime guarantees continue to apply, even during
maintenance periods. The reason maintenance periods are mentioned is
from explicit feedback from customers to get more visibility into any
changes of the platform regardless of whether those are impactful or
not.

# What to expect

Like any security updates which are seen with personal computers,
tablets, phones, and other devices, even machines in the cloud need the
latest updates. Unlike with physical devices, cloud solutions like Azure
App Service provide waysto overcome these routines with more ease. there
is no need to “stop working” for certain period and wait until patches
are installed. Any workload can be just shifted to a different
underlying hardware in a matter of seconds and continue working while
updates can be installed where needed.

The frequency of these updates is monthly, but it can vary based on the
current needs, criticality of changes, and multiple other factors.

Since a typical cloud solution consists of multiple applications,
database, storage accounts, functions, and other resources, various
parts of your solutions can be undergoing maintenance at different
times. Some of this coordination is related to placements (geographies,
regions, datacenters, availability zones) and some of this is due to a
pure scale of the cloud where not everything is touched at the same
time.

[Safe deployment practices - Azure DevOps | Microsoft
Learn](https://learn.microsoft.com/en-us/devops/operate/safe-deployment-practices)

<img src="/media/image2.png" style="width:7.13607in;height:4.74251in" />

# In order from top to bottom we see:

- # A descriptive title of the maintenance event

- Impacted regions and subscriptions

- Expected maintenance window

# 

# FAQ

TBD: Should we include some proof / link for customers to monitor uptime
by themselves? This might be double edged sword.

## Why is the maintenance taking so long?

The maintenance fundamentally represents delivering latest updates to
the platform and the service. Given the logistics of the update, it is
complex to predict with certainty ahead of time when individual apps
will be affected down to a specific time, so more generic notifications
are sent out. The time ranges in those notifications do not reflect the
individual experience at the app level, but the overall operation across
all resources. Apps which undergo maintenance just instantly restart on
freshly updated machines and continue working. There is not a time
window when requests/traffic would not be served.

## Why am I getting so many notifications?

This is related to the previous question and answer. A typical scenario
is that customers have multiple different applications, and they are
upgraded at different times. To avoid sending notifications for each
single one of them, a more generic notification is provided which
captures multiple resources at once. The notification is sent at the
beginning of and throughout the maintenance window if it continues to
signal that there is a chance of restarts to be observed. Due to the
time window being longer, you can receive multiple reminders for the
same rollout so you can easier correlate any restart/interruption/issue
in case it is needed.

## How is this related to SLA, is the uptime factored in or not?

Platform maintenance is not expected to impact application uptime or
availability. Applications continue to stay up and running while
platform maintenance occurs. Note: platform maintenance may cause
applications to be cold started on new virtual machines, which can lead
to cold start delays. An application is still considered to be up and
running, even while it is cold starting. For best practices to minimize
or avoid cold starts, consider using local cache (for Windows apps:
<https://learn.microsoft.com/en-us/azure/app-service/overview-local-cache>)
as well as the Health Check feature
(<https://learn.microsoft.com/en-us/azure/app-service/monitor-instances-health-check?tabs=dotnet>)

It is not expected that sites would incur any SLA violation during
maintenance windows.

## How does the upgrade work under the hood and how does it ensure smooth operation for my apps?

Azure App Service represents a fleet of scale units which provide
hosting of web applications/solutions to the customers. Each scale unit
is further divided into smaller pieces (roles of different purposes) and
sliced into a concept of upgrade domains (and availability zones) to
optimize placements of bigger App Service Plans and smooth rollouts
since not all machines in each scale unit are updated at once. Fleet
upgrades machines iteratively while monitoring the health of the fleet
so any time there is an issue, the system can stop the rollout. This is
described in detail at [Demystifying the magic behind App Service OS
updates - Azure App
Service](https://azure.github.io/AppService/2018/01/18/Demystifying-the-magic-behind-App-Service-OS-updates.html)
.

## Are business hours reflected?

Maintenance operations are optimized to run outside standard business
hours (9-5pm) as statistically that is a better timing for any
interruptions and restarts of workloads as there is a less stress on the
system (in customer applications and transitively also on the platform
itself).

## What are my options to control this?

If you run your workloads in Isolated SKU via App Service Environment
v3, you can also schedule the upgrades when needed. This is described
with details at Control and automate planned maintenance for App Service
Environment v3 - Azure App Service .

## Can I prepare my apps better for restarts?

If your applications need extra time during restarts to come online (a
typical pattern would be heavy dependency on external resources during
application warm-up/start-up), consider using Health Check feature
described at [Monitor the health of App Service instances - Azure App
Service | Microsoft
Learn](https://learn.microsoft.com/en-us/azure/app-service/monitor-instances-health-check?tabs=dotnet)
. You can use this to communicate with the platform that your
application is not ready to receive requests yet and the system can use
that information to route requests to other instances in your App
Service Plan (for such case, it is recommended to have at least 2
instances in the plan).

## My applications have been running fine but since these notifications started showing up things are worse. What changed?

Updates and maintenance events have been happening to the platform since
its inception. The frequency of updates decreased over time, so the
number of interruptions also decreased and uptime increases. However,
there is an increased level of visibility into all changes which can
cause the perception that more changes are being made.

# Links

[Control and automate planned maintenance for App Service Environment
v3 - Azure App
Service](https://azure.github.io/AppService/2022/09/15/Configure-automation-for-upgrade-preferences-in-App-Service-Environment.html)

[Demystifying the magic behind App Service OS updates - Azure App
Service](https://azure.github.io/AppService/2018/01/18/Demystifying-the-magic-behind-App-Service-OS-updates.html)

[Routine Planned Maintenance Notifications for Azure App Service - Azure
App
Service](https://azure.github.io/AppService/2022/02/01/App-Service-Planned-Notification-Feature.html)
