---
title: Failover and Disaster Recovery for Mongo vCore
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Learn how to plan for disaster recovery and maintain business continuity for Cosmos DB for Mongo vCore
author: sasinnat
ms.author: sasinnat
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: conceptual
ms.date: 08/28/2023
---

# Failover for business continuity and disaster recovery

To maximize your uptime, plan ahead to maintain business continuity and prepare for disaster recovery with Azure Cosmos DB for MongoDB vCore.

Microsoft strives to ensure that Azure services are always available. However, unplanned service outages may occur. We recommend having a disaster recovery plan in place for handling regional service outages. In this article, you'll learn how to:

* Plan for a multi-regional deployment of Azure Cosmos DB for MongoDB vCore and associated resources.
* Design for high availability of your solution.
* Initiate a failover to another region.

> [!IMPORTANT]
> Azure Cosmos DB for MongoDB vCore itself does not provide automatic failover or disaster recovery. 

Azure Cosmos DB for MongoDB vCore automatically takes backups of your data at regular intervals. The automatic backups are taken without affecting the performance or availability of the database operations. All the backups are stored separately in a storage service. The automatic backups are helpful in scenarios when you accidentally delete or update your cluster, database, or collection and later require the data recovery.Backups are performed automatically in the background. Backups are retained for 35 days for active clusters and 7 days for deleted clusters.

## Design for high availability

High availability (HA) should be enabled for critical Azure Cosmos DB for MongoDB vCore clusters running Production workloads. In an HA-enabled cluster, each node serves as a primary along with a hot standby node provisioned in another Availability Zone. Replication between the primary and the secondary node is synchronous. Thus, any modification to the database is persisted on both the primary and the hot standby before a response from the database is received.

The service maintains health checks and heartbeats to each primary and secondary node of the cluster. In the event of a primary node becoming unavailable (either due to a Zone outage or a regional outage), the secondary node is automatically promoted to become the new primary and a subsequent secondary node is built for the new primary. In addition, if a secondary node becomes unavailable, the service auto creates a new secondary node with a full copy of data from the primary.

In the event of a failover from the primary to the secondary node that is triggered by the service, connections are seamlessly routed under the covers to the new primary node.

Synchronous replication between the primary and secondary nodes guarantees no data loss in the event of a failover.

### Configure high availability

High availability (HA) can be specified when [creating a cluster](quickstart-portal.md) or in the [**Scale** section of an existing cluster](how-to-scale-cluster.md) in the Azure portal.

## Disaster recovery in Azure CosmosDB for MongoDB vCore

Resiliency and disaster recovery is a common need for online systems. Azure Cosmos DB for Mongo vCore Service already guarantees 99.995% availability within the region. Multi-region clusters will become available in 2024 to provide both in-region and cross-region availability guarantees.

## Next steps

- Read more about [feature compatibility with MongoDB](compatibility.md).
- Review options for [migrating from MongoDB to Azure Cosmos DB for MongoDB vCore](migration-options.md)
- Get started by [creating an account](quickstart-portal.md).

