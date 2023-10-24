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

Azure Cosmos DB for MongoDB vCore automatically takes backups of your data at regular intervals. The automatic backups are taken without affecting the performance or availability of the database operations. All the backups are stored separately in a storage service. The automatic backups are helpful in scenarios when you accidentally delete or update your account, database, or container and later require the data recovery.Backups are performed automatically in the background. Backups are retained for 35 days for active clusters and 7 days for deleted clusters.

## Design for high availability

High availability (HA) avoids database downtime by maintaining standby replicas of every node in a cluster. If a node goes down, Azure Cosmos DB for MongoDB vCore switches incoming connections from the failed node to its standby replica.

### Configure high availability

High availability (HA) can be specified when [creating a cluster](quickstart-portal.md) or in the [**Scale** section of an existing cluster](how-to-scale-cluster.md) in the Azure portal.

## Disaster recovery in Azure CosmosDB for MongoDB vCore

Resiliency and disaster recovery is a common need for online systems. Azure Cosmos DB for Mongo vCore Service already guarantees 99.9% availability, but it's still a regional service.
Your service instance is always running in one region and doesn't fail over to another region when there's a region-wide outage.

## Next steps

- Read more about [feature compatibility with MongoDB](compatibility.md).
- Review options for [migrating from MongoDB to Azure Cosmos DB for MongoDB vCore](migration-options.md)
- Get started by [creating an account](quickstart-portal.md).

