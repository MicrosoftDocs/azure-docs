---
title: Failover for business continuity and disaster recovery
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Learn how to plan for disaster recovery and maintain business continuity with Azure Cosmos DB for Mongo vCore
author: sajeetharan
ms.author: sasinnat
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 10/30/2023
---

# Failover for business continuity and disaster recovery with Azure Cosmos DB for MongoDB vCore

To maximize your uptime, plan ahead to maintain business continuity and prepare for disaster recovery with Azure Cosmos DB for MongoDB vCore.

While Azure services are designed to maximize uptime, unplanned service outages might occur. A disaster recovery plan ensures that you have a strategy in place for handling regional service outages.

In this article, learn how to:

- Plan a multi-regional deployment of Azure Cosmos DB for MongoDB vCore and associated resources.
- Design your solutions for high availability.
- Initiate a failover to another Azure region.

> [!IMPORTANT]
> Azure Cosmos DB for MongoDB vCore does not provide built-in automatic failover or disaster recovery. Planning for high availability is a critical step as your solution scales.

Azure Cosmos DB for MongoDB vCore automatically takes backups of your data at regular intervals. The automatic backups are taken without affecting the performance or availability of the database operations. All backups are performed automatically in the background and stored separately from the source data in a storage service. These automatic backups are useful in scenarios when you accidentally delete or modify resources and later require the original versions.

Automatic backups are retained in various intervals based on whether the cluster is currently active or recently deleted.

| | Retention period |
| --- | --- |
| **Active clusters** | `35` days |
| **Deleted clusters** | `7` days |

## Design for high availability

High availability (HA) should be enabled for critical Azure Cosmos DB for MongoDB vCore clusters running production workloads. In an HA-enabled cluster, each node serves as a primary along with a hot-standby node provisioned in another availability zone. Replication between the primary and the secondary node is synchronous by default. Any modification to the database is persisted on both the primary and the secondary (hot-standby) nodes before a response from the database is received.

The service maintains health checks and heartbeats to each primary and secondary node of the cluster. If a primary node becomes unavailable due to a zone or regional outage, the secondary node is automatically promoted to become the new primary and a subsequent secondary node is built for the new primary. In addition, if a secondary node becomes unavailable, the service auto creates a new secondary node with a full copy of data from the primary.

If the service triggers a failover from the primary to the secondary node, connections are seamlessly routed under the covers to the new primary node.

Synchronous replication between the primary and secondary nodes guarantees no data loss if there's a failover.

### Configure high availability

High availability can be specified when [creating a new cluster](quickstart-portal.md) or [updating an existing cluster](how-to-scale-cluster.md).

## Related content

- Read more about [feature compatibility with MongoDB](compatibility.md).
- Review options for [migrating from MongoDB to Azure Cosmos DB for MongoDB vCore](migration-options.md)
- Get started by [creating an account](quickstart-portal.md).
