---
title: Disaster recovery and geo-distribution Azure Durable Functions
description: Learn about disaster recovery and geo-distribution in Durable Functions.
author: MS-Santi
ms.topic: conceptual
ms.date: 08/05/2025
ms.author: azfuncdf
---

# Disaster recovery and geo-distribution in Azure Durable Functions

Microsoft strives to ensure that Azure services are always available. However, unplanned service outages might occur. When your application requires resiliency, you should configure your app for geo-redundancy. Additionally, you should have a disaster recovery plan in place for handling a regional service outage. An important part of a disaster recovery plan is being prepared to fail over to the secondary replicas of both your app and storage account when the primary replicas becomes unavailable.

In Durable Functions, all state is persisted in Azure Storage by default. A [task hub](durable-functions-task-hubs.md) is a logical container for Azure Storage resources that are used for [orchestrations](durable-functions-types-features-overview.md#orchestrator-functions) and [entities](durable-functions-types-features-overview.md#entity-functions). Orchestrator, activity, and entity functions can only interact with each other when they belong to the same task hub. This document refers to task hubs when describing scenarios for keeping these Azure Storage resources highly available.

Orchestrations and entities can be triggered using [client functions](durable-functions-types-features-overview.md#client-functions) that are themselves triggered via HTTP or one of the other supported Azure Functions trigger types. They can also be triggered using [built-in HTTP APIs](durable-functions-http-features.md#built-in-http-apis). For simplicity, this article focuses on scenarios involving Azure Storage and HTTP-based function triggers, and options to increase availability and minimize downtime during disaster recovery activities. Other trigger types, such as Service Bus or Azure Cosmos DB triggers, aren't explicitly covered.

The scenarios in this article are based on active-passive configurations, which best supports the usage of Azure Storage. This pattern consists of deploying a backup (passive) function app to a different region. Traffic Manager monitors the primary (active) function app for HTTP availability. It fails over to the backup function app when the primary app fails. For more information, see [Azure Traffic Manager](https://azure.microsoft.com/services/traffic-manager/)'s [Priority Traffic-Routing Method.](../../traffic-manager/traffic-manager-routing-methods.md#priority-traffic-routing-method)

Keep these considerations in mind when configuring an active-passive failover configuration for Durable Functions:

- The guidance in this article assumes that you're using the default [Azure Storage provider](./durable-functions-azure-storage-provider.md) for storing Durable Functions runtime state. You can also configure alternate storage providers that store state elsewhere, such as in a SQL Server database. Alternate storage providers might require different disaster recovery and geo-distribution strategies. For more information on the alternate storage providers, see the [Durable Functions storage providers](durable-functions-storage-providers.md) documentation.
- The proposed active-passive configuration ensures that a client is always able to trigger new orchestrations via HTTP. However, as a consequence of having two function apps sharing the same task hub in storage, some background storage transactions can get distributed between both app. As a result of this distribution, this configuration can result in added egress costs for the secondary function app.
> - The underlying storage account and task hub, which are both created in the primary region, are shared by both function apps.
> - All function apps that are redundantly deployed must share the same function access keys in the case of being activated via HTTP. The Functions Runtime exposes a [management API](https://github.com/Azure/azure-functions-host/wiki/Key-management-API) that enables consumers to programmatically add, delete, and update function keys. Key management is also possible using [Azure Resource Manager APIs](https://www.markheath.net/post/managing-azure-functions-keys-2).

## Scenario 1 - Load balanced compute with shared storage

To mitigate the possibility of downtime if your function app resources become unavailable, this scenario uses two function apps deployed to different regions.
Traffic Manager is configured to detect problems in the primary function app and automatically redirect traffic to the function app in the secondary region. This function app shares the same Azure Storage account and Task Hub. Therefore, the state of the function apps isn't lost and work can resume normally. Once health is restored to the primary region, Azure Traffic Manager starts routing requests to that function app automatically.

![Diagram showing scenario 1.](./media/durable-functions-disaster-recovery-geo-distribution/durable-functions-geo-scenario01.png)

There are several benefits when using this deployment scenario:

- If the compute infrastructure fails, work can resume in the failover region without data loss.
- Traffic Manager takes care of the automatic failover to the healthy function app automatically.
- Traffic Manager automatically re-establishes traffic to the primary function app after the outage has passed.

However, using this scenario consider:

- If the function app is deployed using a dedicated App Service plan, replicating the compute infrastructure in the failover datacenter increases costs.
- This scenario covers outages at the compute infrastructure, but the storage account continues to be the single point of failure for the function App. If a Storage outage occurs, the application suffers downtime.
- If the function app is failed over, there will be increased latency since it accesses its storage account across regions.
- When in failover, the function app accesses the storage service in the original region, which can result in higher costs due to network egress traffic.
- This scenario depends on Traffic Manager, and it can take some time before a client application needs to again request the function app address from Traffic Manager. For more information, see [How Traffic Manager Works](../../traffic-manager/traffic-manager-how-it-works.md).

> [!NOTE]
> Starting in version 2.3.0 of the Durable Functions extension, two function apps can be run safely at the same time with the same storage account and task hub configuration. The first app to start will acquire an application-level blob lease that prevents other apps from stealing messages from the task hub queues. If this first app stops running, its lease expires and can be acquired by a second app. The second app then proceeds to process task hub messages.
> 
> Prior to v2.3.0, function apps that are configured to use the same storage account processes messages and update storage artifacts concurrently, resulting in higher overall latencies and egress costs. If the primary and replica apps ever have different code deployed to them, even temporarily, then orchestrations could also fail to execute correctly because of orchestrator function inconsistencies across the two apps. As a result, all apps that require geo-distribution for disaster recovery purposes should use v2.3.0 or higher of the Durable extension.

## Scenario 2 - Load balanced compute with regional storage or regional Durable Task Scheduler

The preceding scenario only covers failure scenarios limited to the compute infrastructure and is the recommended solution for failovers. An outage of the function app can also occur when either the storage service or the Durable Task Scheduler (DTS) fails.

To ensure continuous operation of durable functions, this scenario deploys a dedicated storage account or a Scheduler (DTS instance) in each region where function apps are hosted. ***Currently, this is the recommended disaster recovery approach when using Durable Task Scheduler.***

![Diagram showing scenario 2.](./media/durable-functions-disaster-recovery-geo-distribution/durable-functions-geo-scenario02.png)

This approach adds improvements on the previous scenario:

- **Regional State Isolation:** Each function app is linked to its own regional storage account or DTS instance. If the function app fails, Traffic Manager redirects traffic to the secondary region. Because the function app in each region uses its local storage or DTS, durable functions can continue processing using local state.
- **No Added Latency on Failover:** During a failover, function app and state provider (storage or DTS) are colocated, so there's no added latency in the failover region.
- **Resilience to State Backing Failures:** If the storage account or DTS instance in one region fails, the durable functions in that region fail, which will trigger redirection to the secondary region. Because both compute and app state are isolated, per region, the failover region’s durable functions remain operational.

Important considerations for this scenario:

- If the function app is deployed using a dedicated App Service plan, replicating the compute infrastructure in the failover datacenter increases costs.
- Current state isn't failed over, which implies that existing orchestrations and entities are effectively paused and unavailable until the primary region recovers.

To summarize, the tradeoff between the first and second scenario is that latency is preserved and egress costs are minimized but existing orchestrations and entities are unavailable during the downtime. Whether these tradeoffs are acceptable depends on the requirements of the application.

## Scenario 3 - Load balanced compute with GRS shared storage

This scenario is a modification over the first scenario, implementing a shared storage account. The main difference is that the storage account is created with geo-replication enabled.
Functionally, this scenario provides the same advantages as Scenario 1, but it enables other data recovery advantages:

- Geo-redundant storage (GRS) and Read-access GRS (RA-GRS) maximize availability for your storage account.
- If there's a regional outage of the Storage service, you can [manually initiate a failover to the secondary replica](../../storage/common/storage-initiate-account-failover.md). In extreme circumstances where a region is lost due to a significant disaster, Microsoft might initiate a regional failover. In this case, no action on your part is required.
- When a failover happens, state of the durable functions is preserved up to the last replication of the storage account, which typically occurs every few minutes.

As with the other scenarios, there are important considerations:

- A failover to the replica might take some time. Until the failover completes and Azure Storage DNS records are updated, the function app continues to be inaccessible.
- There's an increased cost for using geo-replicated storage accounts.
- GRS replication copies your data asynchronously. Some of the latest transactions might be lost because of the latency of the replication process.

![Diagram showing scenario 3.](./media/durable-functions-disaster-recovery-geo-distribution/durable-functions-geo-scenario03.png)

> [!NOTE]
> As described in Scenario 1, we recommended that function apps deployed with this strategy use **v2.3.0** or higher of the Durable Functions extension.

For more information, see the [Azure Storage disaster recovery and storage account failover](../../storage/common/storage-disaster-recovery-guidance.md) documentation.

## Next steps

> [!div class="nextstepaction"]
> [Learn more about designing highly available applications in Azure Storage](../../storage/common/geo-redundant-design.md)
