---
title: Disaster recovery and geo-distribution in Durable Functions - Azure
description: Learn about disaster recovery and geo-distribution in Durable Functions.
services: functions
author: MS-Santi
manager: jeconnoc
keywords:
ms.service: azure-functions
ms.devlang: multiple
ms.topic: conceptual
ms.date: 04/25/2018
ms.author: azfuncdf
---

# Disaster recovery and geo-distribution

## Overview

In Durable Functions, all state is persisted in Azure Storage. A [task hub](durable-functions-task-hubs.md) is a logical container for Azure Storage resources that are used for orchestrations. Orchestrator and activity functions can only interact with each other when they belong to the same task hub.
The described scenarios propose deployment options to increase availability and minimize downtime during disaster recovery activities.

It's important to notice that these scenarios are based on Active-Passive configurations, since they are guided by the usage of Azure Storage. This pattern consists of deploying a backup (passive) function app to a different region. Traffic Manager will monitor the primary (active) function app for availability. It will fail over to the backup function app if the primary fails. For more information,  see [Traffic Manager](https://azure.microsoft.com/services/traffic-manager/)'s [Priority Traffic-Routing Method.](../../traffic-manager/traffic-manager-routing-methods.md#priority-traffic-routing-method)

>[!NOTE]
>
> - The proposed Active-Passive configuration ensures that a client is always able to trigger new orchestrations via HTTP. However, as a consequence of having two function apps sharing the same storage, background processing will be distributed between both of them, competing for messages on the same queues. This configuration incurs in added egress costs for the secondary function app.
> - The underlying storage account and task hub are created in the primary region, and are shared by both function apps.
> - All function apps that are redundantly deployed, must share the same function access keys in the case of being activated via HTTP. The Functions Runtime exposes a [management API](https://github.com/Azure/azure-functions-host/wiki/Key-management-API) that enables consumers to programmatically add, delete, and update function keys.

## Scenario 1 - Load balanced compute with shared storage

If the compute infrastructure in Azure fails, the function app may become unavailable. To minimize the possibility of such downtime, this scenario uses two function apps deployed to different regions.
Traffic Manager is configured to detect problems in the primary function app and automatically redirect traffic to the function app in the secondary region. This function app shares the same Azure Storage account and Task Hub. Therefore, the state of the function apps isn't lost and work can resume normally. Once health is restored to the primary region, Azure Traffic Manager will start routing requests to that function app automatically.

![Diagram showing scenario 1.](./media/durable-functions-disaster-recovery-geo-distribution/durable-functions-geo-scenario01.png)

There are several benefits when using this deployment scenario:

- If the compute infrastructure fails, work can resume in the fail over region without state loss.
- Traffic Manager takes care of the automatic fail over to the healthy function app automatically.
- Traffic Manager automatically re-establishes traffic to the primary function app after the outage has been corrected.

However,  using this scenario consider:

- If the function app is deployed using a dedicated App Service plan, replicating the compute infrastructure in the fail over datacenter increases costs.
- This scenario covers outages at the compute infrastructure, but the storage account continues to be the single point of failure for the function App. If there is a Storage outage, the application suffers a downtime.
- If the function app is failed over, there will be increased latency since it will access its storage account across regions.
- Accessing the storage service from a different region where it's located incurs in higher cost due to network egress traffic.
- This scenario depends on Traffic Manager. Considering [how Traffic Manager works](../../traffic-manager/traffic-manager-how-it-works.md), it may be some time until a client application that consumes a Durable Function needs to query again the function app address from Traffic Manager.

## Scenario 2 - Load balanced compute with regional storage

The preceding scenario covers only the case of failure in the compute infrastructure. If the storage service fails, it will result in an outage of the function app.
To ensure continuous operation of the durable functions, this scenario uses a local storage account on each region to which the function apps are deployed.

![Diagram showing scenario 2.](./media/durable-functions-disaster-recovery-geo-distribution/durable-functions-geo-scenario02.png)

This approach adds improvements on the previous scenario:

- If the function app fails, Traffic Manager takes care of failing over to the secondary region. However, because the function app relies on its own storage account, the durable functions continue to work.
- During a fail over, there is no additional latency in the fail over region, since the function app and the storage account are co-located.
- Failure of the storage layer will cause failures in the durable functions, which, in turn, will trigger a redirection to the fail over region. Again, since the function app and storage are isolated per region, the durable functions will continue to work.

Important considerations for this scenario:

- If the function app is deployed using a dedicated AppService plan, replicating the compute infrastructure in the fail over datacenter increases costs.
- Current state isn't failed over, which implies that executing and checkpointed functions will fail. It's up to the client application to retry/restart the work.

## Scenario 3 - Load balanced compute with GRS shared storage

This scenario is a modification over the first scenario, implementing a shared storage account. The main difference that the storage account is created with geo-replication enabled.
Functionally, this scenario provides the same advantages as Scenario 1, but it enables additional data recovery advantages:

- Geo-redundant storage (GRS) and Read-access GRS (RA-GRS) maximize availability for your storage account.
- If there is a region outage of the storage service, one of the possibilities is that the datacenter operations determine that storage must be failed over to the secondary region. In this case, storage account access will be redirected transparently to the geo-replicated copy of the storage account, without user intervention.
- In this case, state of the durable functions will be preserved up to the last replication of the storage account, which occurs every few minutes.

As with the other scenarios, there are important considerations:

- Fail over to the replica is done by datacenter operators and it may take some time. Until that time, the function app will suffer an outage.
- There is an increased cost for using geo-replicated storage accounts.
- GRS occurs asynchronously. Some of the latest transactions might be lost because of the latency of the replication process.

![Diagram showing scenario 3.](./media/durable-functions-disaster-recovery-geo-distribution/durable-functions-geo-scenario03.png)

## Next steps

You can read more about [Designing Highly Available Applications using RA-GRS](../../storage/common/storage-designing-ha-apps-with-ragrs.md)
