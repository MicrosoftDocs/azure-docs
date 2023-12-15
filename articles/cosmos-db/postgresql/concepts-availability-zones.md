---
title: Availability zone (AZ) outage resiliency – Azure Cosmos DB for PostgreSQL
description: Disaster recovery using Azure availability zones (AZ) concepts
ms.author: nlarin
author: niklarin
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: conceptual
ms.date: 11/28/2023
---

# Availability zone outage resiliency in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

Many Azure regions have availability zones. Availability zones (AZs) are separated groups of datacenters within a region. Availability zones are close enough to have low-latency connections to other availability zones within their region. They're connected by a high-performance network with a round-trip latency of less than 2 milliseconds.

At the same time, availability zones are far enough apart to reduce the likelihood that more than one will be affected by local outages or weather. Availability zones have independent power, cooling, and networking infrastructure. They're designed so that if one zone experiences an outage, then regional services are supported by the remaining zones across various Azure services.

Azure Cosmos DB for PostgreSQL supports availability zones for improved reliability and disaster recovery. Advantages of availability zones vary depending on whether [high availability](./concepts-high-availability.md) is enabled on an Azure Cosmos DB for PostgreSQL cluster.

## Availability zone outage resiliency for regional service components
There are many Azure Cosmos DB for PostgreSQL service components in each supported Azure region that don't belong to individual clusters but are rather critical parts of running the managed service. These components allow ongoing execution of all management operations such as new cluster provisioning and scaling existing clusters and all internal operations such as monitoring node health.

When Azure region supports availability zones, all of these service components are configured to be AZ redundant. It means that all Azure Cosmos DB for PostgreSQL service components can sustain outage of an AZ, or in other words are resilient to a single AZ outage.

Whether a cluster is configured with high availability or not, its ongoing operations depend on these service components. AZ redundancy of the service components is a critical element of availability zone outage resiliency in Azure Cosmos DB for PostgreSQL.

## Availability zone outage impact on clusters with and without high availability

All nodes in a cluster are provisioned into one availability zone. Preferred AZ setting allows you to put all cluster nodes in the same availability zone where the application is deployed. Having all nodes in the same AZ ensures lower latency between the nodes thus improving overall cluster performance.

When high availability (HA) is enabled on a cluster, all primary nodes are created in one AZ and all standby nodes are provisioned into another AZ. Nodes can move between availability zones during the following events:

- A failure occurs on a primary HA-enabled node. In this case primary node's standby is going to become a new primary and standby node's AZ is going to be the new AZ for that primary node.
- A [scheduled maintenance](./concepts-maintenance.md) event happens on cluster. At the end of maintenance all primary nodes in a cluster are going to be in the same AZ. 

If high availability *is* enabled, cluster continues to be available throughout AZ outage with a possible failover on those primary nodes that are in the impacted AZ. 
If high availability *is not* enabled on a cluster, only outage in the AZ where nodes are deployed would impact cluster availability.

You can always check availability zone for each primary node using the [Azure portal](./concepts-cluster.md#node-availability-zone) or using programmatic methods such as [REST APIs](/rest/api/postgresqlhsc/servers/get).

To get resiliency benefits of availability zones, your cluster needs to be in [one of the Azure regions](./resources-regions.md) where Azure Cosmos DB for PostgreSQL is configured for AZ outage resiliency.

## Next steps

- Check out [regions that are configured for AZ outage resiliency](./resources-regions.md) in Azure Cosmos DB for PostgreSQL
- Learn about [availability zones in Azure](../../reliability/availability-zones-overview.md)
- Learn how to [enable high availability](howto-high-availability.md) in a cluster
