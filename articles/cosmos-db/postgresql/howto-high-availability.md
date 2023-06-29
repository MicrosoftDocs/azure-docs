---
title: Configure high availability - Azure Cosmos DB for PostgreSQL
description: How to enable or disable high availability
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 06/05/2023
---

# Configure high availability in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

Azure Cosmos DB for PostgreSQL provides high availability
(HA) to avoid database downtime. With HA enabled, every node in a cluster
gets a standby. If the original node becomes unhealthy, its standby is
promoted to replace it.

> [!IMPORTANT]
> Because HA doubles the number of servers in the group, it will also double
> the cost.

Enabling HA is possible during cluster creation on **Scale** page. Once cluster is provisioned, set Set **Enable high availability (HA)** checkbox in the **High availability** tab for your cluster in the Azure portal.

:::image type="content" source="media/howto-high-availability/01-ha-slider.png" alt-text="ha slider":::

Click the **Save** button to apply your selection. Enabling HA can take some
time as the cluster provisions standby nodes and streams data to them.

The **Overview** tab for the cluster lists all nodes along with a **High availability** column indicating whether HA is successfully enabled for each node and **Availability zone** column that shows actual availability zone for each primary cluster node.

:::image type="content" source="media/howto-high-availability/02-ha-column.png" alt-text="the ha column in cluster overview":::

### Next steps

Learn more about [high availability](concepts-high-availability.md).
