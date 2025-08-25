---
title: Disaster Recovery and Geo-Distribution in Durable Functions
description: Learn about disaster recovery and geo-distribution in Durable Functions.
author: MS-Santi
ms.topic: conceptual
ms.date: 08/05/2025
ms.author: azfuncdf
---

# Disaster recovery and geo-distribution in Durable Functions

Microsoft strives to ensure that Azure services are always available. However, unplanned service outages might happen. When your application requires resiliency, you should configure your app for geo-redundancy.

You should also have a disaster recovery plan in place for handling a regional service outage. An important part of a disaster recovery plan is being prepared to fail over to the secondary replicas of both your app and your storage account when the primary replicas become unavailable.

This article describes example scenarios for configuring disaster recovery and geo-distribution by using the Durable Functions feature of Azure Functions.

## Background

In Durable Functions, all state is persisted in Azure Storage by default. A [task hub](durable-functions-task-hubs.md) is a logical container for Azure Storage resources that are used for [orchestrations](durable-functions-types-features-overview.md#orchestrator-functions) and [entities](durable-functions-types-features-overview.md#entity-functions). Orchestrator, activity, and entity functions can interact with each other only when they belong to the same task hub. This article refers to task hubs when describing scenarios for keeping these Azure Storage resources highly available.

Orchestrations and entities can be triggered via [client functions](durable-functions-types-features-overview.md#client-functions) that are themselves triggered via HTTP or one of the other supported Azure Functions trigger types. Orchestrations and entities can also be triggered via [built-in HTTP APIs](durable-functions-http-features.md#built-in-http-apis). For simplicity, this article focuses on scenarios that involve Azure Storage and HTTP-based function triggers, along with options to increase availability and minimize downtime during disaster recovery. This article doesn't explicitly cover other trigger types, such as Azure Service Bus or Azure Cosmos DB triggers.

The scenarios in this article are based on active/passive configurations, which best support the usage of Azure Storage. This pattern consists of deploying a backup (passive) function app to a different region. [Azure Traffic Manager](https://azure.microsoft.com/services/traffic-manager/) monitors the primary (active) function app for HTTP availability. It fails over to the backup function app when the primary app fails. For more information, see [Priority traffic-routing method](../../traffic-manager/traffic-manager-routing-methods.md#priority-traffic-routing-method).

## General considerations

Keep these considerations in mind when you're configuring an active/passive failover configuration for Durable Functions:

- The guidance in this article assumes that you're using the default [Azure Storage provider](./durable-functions-azure-storage-provider.md) for storing the Durable Functions runtime state. You can also configure alternate storage providers that store state elsewhere, such as in a SQL Server database. Alternate storage providers might require different disaster recovery and geo-distribution strategies. For more information, see [Durable Functions storage providers](durable-functions-storage-providers.md).
- The proposed active/passive configuration ensures that a client can always trigger new orchestrations via HTTP. However, when two function apps share the same task hub in storage, some background storage transactions can be distributed between the apps. As a result of this distribution, this configuration can result in added egress costs for the secondary function app.
- The underlying storage account and task hub are both created in the primary region. The function apps share this storage account and task hub.
- All function apps that are redundantly deployed must share the same function access keys when they're activated via HTTP. The Azure Functions runtime exposes a [management API](https://github.com/Azure/azure-functions-host/wiki/Key-management-API) that you can use to programmatically add, delete, and update function keys. You can also manage keys by using [Azure Resource Manager APIs](https://www.markheath.net/post/managing-azure-functions-keys-2).

## Scenario 1: Load-balanced compute with shared storage

To mitigate the possibility of downtime if your function app resources become unavailable, this scenario uses two function apps deployed to different regions. We recommend this scenario as a solution for failovers.

Traffic Manager is configured to detect problems in the primary function app and automatically redirect traffic to the function app in the secondary region. This function app shares the same Azure Storage account and task hub. The state of the function apps isn't lost, and work can resume normally. After health is restored to the primary region, Azure Traffic Manager starts routing requests to that function app automatically.

![Diagram that shows function apps in separate regions with a shared Azure Storage account.](./media/durable-functions-disaster-recovery-geo-distribution/durable-functions-geo-scenario01.png)

There are several benefits to using this deployment scenario:

- If the compute infrastructure fails, work can resume in the failover region without data loss.
- Traffic Manager takes care of the automatic failover to the healthy function app.
- Traffic Manager automatically re-establishes traffic to the primary function app after the outage ends.

### Scenario-specific considerations

- If you deploy the function app by using a dedicated Azure App Service plan, replicating the compute infrastructure in the failover datacenter increases costs.
- This scenario covers outages at the compute infrastructure, but the storage account continues to be the single point of failure for the function app. If an Azure Storage outage occurs, the application suffers downtime.
- If the function app is failed over, latency increases because the app accesses its storage account across regions.
- When the function app is in failover, it accesses the storage service in the original region. The network egress traffic can result in higher costs.
- This scenario depends on Traffic Manager. A client application can take some time before it needs to again request the function app address from Traffic Manager. For more information, see [How Traffic Manager works](../../traffic-manager/traffic-manager-how-it-works.md).
- Starting in version 2.3.0 of the Durable Functions extension, you can safely run two function apps at the same time with the same storage account and task hub configuration. The first app to start acquires an application-level blob lease that prevents other apps from stealing messages from the task hub queues. If this first app stops running, its lease expires. A second app can acquire the lease and begin to process task hub messages.

  For extension versions before 2.3.0, function apps that are configured to use the same storage account process messages and update storage artifacts concurrently. This concurrent activity results in higher overall latencies and egress costs. If the primary and replica apps ever have different code deployed to them, even temporarily, orchestrations might also fail to run correctly because of orchestrator function inconsistencies across the two apps.

  All apps that require geo-distribution for disaster recovery should use version 2.3.0 or later of the Durable Functions extension.

## Scenario 2: Load-balanced compute with regional storage or a regional durable task scheduler

The preceding scenario covers only failures limited to the compute infrastructure. An outage of the function app can also occur when either the storage service or the durable task scheduler fails.

To ensure continuous operation of Durable Functions, the second scenario deploys a dedicated storage account or a durable task scheduler in each region where function apps are hosted. We currently recommend this disaster recovery approach when you're using a durable task scheduler.

![Diagram that shows function apps in separate regions with separate Azure Storage accounts.](./media/durable-functions-disaster-recovery-geo-distribution/durable-functions-geo-scenario02.png)

This approach adds improvements to the previous scenario:

- **Regional state isolation**: Each function app is linked to its own regional storage account or durable task scheduler. If the function app fails, Traffic Manager redirects traffic to the secondary region. Because the function app in each region uses its local storage or durable task scheduler, Durable Functions can continue processing by using the local state.
- **No added latency on failover**: During a failover, a function app and state provider (storage account or durable task scheduler) are colocated, so there's no added latency in the failover region.
- **Resilience to state backing failures**: If the storage account or durable task scheduler in one region fails, Durable Functions fails in that region. The failure of Durable Functions triggers redirection to the secondary region. Because both compute and app state are isolated per region, Durable Functions in the failover region remains operational.

### Scenario-specific considerations

- If you deploy the function app by using a dedicated App Service plan, replicating the compute infrastructure in the failover datacenter increases costs.
- The current state isn't failed over. Existing orchestrations and entities are effectively paused and unavailable until the primary region recovers. Whether this tradeoff to preserving latency and minimizing egress costs is acceptable depends on the requirements of the application.

## Scenario 3: Load-balanced compute with shared GRS

This scenario is a modification of the first scenario (implementing a shared storage account). The main difference is that the storage account is created with geo-replication enabled.

![Diagram that shows function apps in separate regions sharing a storage account, with failover to a replica.](./media/durable-functions-disaster-recovery-geo-distribution/durable-functions-geo-scenario03.png)

This scenario provides the same functional advantages as the first scenario, but it also enables other data recovery advantages:

- Geo-redundant storage (GRS) and read-access GRS (RA-GRS) maximize availability for your storage account.
- If there's a regional outage of the Azure Storage service, you can [manually initiate a failover to the secondary replica](../../storage/common/storage-initiate-account-failover.md). In extreme circumstances where a region is lost due to a disaster, Microsoft might initiate a regional failover. In this case, you don't need to take any action.
- When a failover happens, the state of Durable Functions is preserved up to the last replication of the storage account. The replication typically occurs every few minutes.

For more information, see [Azure storage disaster recovery planning and failover](../../storage/common/storage-disaster-recovery-guidance.md).

### Scenario-specific considerations

- A failover to the replica might take some time. Until the failover finishes and Azure Storage DNS records are updated, the function app continues to be inaccessible.
- There's an increased cost for using geo-replicated storage accounts.
- GRS replication copies your data asynchronously. Some of the latest transactions might be lost because of the latency of the replication process.
- As described for the first scenario, we recommend that function apps deployed in this strategy use version 2.3.0 or later of the Durable Functions extension.

## Next step

> [!div class="nextstepaction"]
> [Learn more about designing highly available applications in Azure Storage](../../storage/common/geo-redundant-design.md)
