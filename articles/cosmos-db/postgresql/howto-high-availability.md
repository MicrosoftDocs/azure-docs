---
title: Configure high availability - Azure Cosmos DB for PostgreSQL
description: How to enable or disable high availability
ms.author: nlarin
author: niklarin
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: how-to
ms.date: 11/28/2023
---

# Configure high availability in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

Azure Cosmos DB for PostgreSQL provides high availability
(HA) to avoid database downtime. With HA enabled, every node in a cluster
gets a standby. If the original node becomes unhealthy, its standby is
promoted to replace it.

Enabling HA is possible during cluster creation on **Scale** page. Once cluster is provisioned, set **Enable high availability (HA)** checkbox in the **High availability** tab for your cluster in the Azure portal.

Click the **Save** button to apply your selection. Enabling HA can take some
time as the cluster provisions standby nodes and streams data to them.

The **Overview** tab for the cluster lists all nodes along with a **High availability** column indicating whether HA is successfully enabled for each node and **Availability zone** column that shows actual availability zone for each primary cluster node.

:::image type="content" source="media/howto-high-availability/02-ha-column.png" alt-text="the ha column in cluster overview":::

## Next steps

- Learn more about [high availability](concepts-high-availability.md).
- Learn more about [availability zones](./concepts-availability-zones.md) in Azure Cosmos DB for PostgreSQL.
