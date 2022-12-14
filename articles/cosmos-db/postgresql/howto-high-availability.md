---
title: Configure high availability - Azure Cosmos DB for PostgreSQL
description: How to enable or disable high availability
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 07/27/2020
---

# Configure high availability

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

Azure Cosmos DB for PostgreSQL provides high availability
(HA) to avoid database downtime. With HA enabled, every node in a cluster
will get a standby. If the original node becomes unhealthy, its standby will be
promoted to replace it.

> [!IMPORTANT]
> Because HA doubles the number of servers in the group, it will also double
> the cost.

Enabling HA is possible during cluster creation, or afterward in the
**Compute + storage** tab for your cluster in the Azure portal. The user
interface looks similar in either case. Drag the slider for **High
availability** from NO to YES:

:::image type="content" source="media/howto-high-availability/01-ha-slider.png" alt-text="ha slider":::

Click the **Save** button to apply your selection. Enabling HA can take some
time as the cluster provisions standbys and streams data to them.

The **Overview** tab for the cluster will list all nodes and their
standbys, along with a **High availability** column indicating whether HA is
successfully enabled for each node.

:::image type="content" source="media/howto-high-availability/02-ha-column.png" alt-text="the ha column in cluster overview":::

### Next steps

Learn more about [high availability](concepts-high-availability.md).
