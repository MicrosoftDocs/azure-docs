---
title: Configure and view availability zones in Azure Cosmos DB for PostgreSQL
description: How to set preferred availability zone and check AZs for nodes
ms.author: nlarin
author: niklarin
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: how-to
ms.date: 11/29/2023
---

# Use availability zones in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

Azure Cosmos DB for PostgreSQL provisions all nodes of a cluster in a single [availability zone](./concepts-availability-zones.md) (AZ) for better performance and availability. If cluster has [high availability](./concepts-high-availability.md) enabled, all standby nodes are provisioned into another availability zone to make sure all nodes in cluster continue to be available, with a possible failover, if there is an AZ outage.

To get resiliency benefits of availability zones, your cluster needs to be in [one of the Azure regions](./resources-regions.md) where Azure Cosmos DB for PostgreSQL is configured for AZ outage resiliency.

In this article, you learn how to specify preferred availability zone for your Azure Cosmos DB for PostgreSQL cluster. You will also learn how to check availability zone for each node once cluster is provisioned.

## Specify preferred availability zone for new cluster

By default preferred availability zone isn't set for a new cluster. In that case Azure Cosmos DB for PostgreSQL service would randomly select an availability zone for primary nodes.

Selecting preferred AZ is possible during cluster creation on the **Scale** page in the **Availability zones** section.

## Change preferred availability zone

Once cluster is provisioned, select AZ in the **Preferred availability zone** drop-down list on the **Scale** page for your cluster in the Azure portal. Click the **Save** button to apply your selection.

To avoid disruption, change of the availability zone isn't applied immediately. Rather all nodes are going to be moved to preferred availability zone during the next [maintenance](./concepts-maintenance.md) event.

## Check availability zone for each node

The **Overview** tab for the cluster lists all nodes along with the **Availability zone** column that shows actual availability zone for each primary cluster node.

## Next steps

- Learn more about [availability zones](./concepts-availability-zones.md) in Azure Cosmos DB for PostgreSQL.
- Learn more about [availability zones in Azure](/azure/reliability/availability-zones-overview).
- Use [REST APIs](/rest/api/postgresqlhsc/clusters/update), [Terraform](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/cosmosdb_postgresql_cluster), or [Azure CLI](/cli/azure/cosmosdb/postgres/cluster#az-cosmosdb-postgres-cluster-update) to perform operations with availability zones in Azure Cosmos DB for PostgreSQL.
