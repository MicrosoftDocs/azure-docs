---
title: Configure high availability - Hyperscale (Citus) - Azure Database for PostgreSQL
description: How to enable or disable high availability
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: how-to
ms.date: 07/27/2020
---

# Configure Hyperscale (Citus) high availability

Azure Database for PostgreSQL - Hyperscale (Citus) provides high availability
(HA) to avoid database downtime. With HA enabled, every node in a server group
will get a standby. If the original node becomes unhealthy, its standby will be
promoted to replace it.

> [!IMPORTANT]
> Because HA doubles the number of servers in the group, it will also double
> the cost.

Enabling HA is possible during server group creation, or afterward in the
**Compute + storage** tab for your server group in the Azure portal. The user
interface looks similar in either case. Drag the slider for **High
availability** from NO to YES:

:::image type="content" source="./media/howto-hyperscale-high-availability/01-ha-slider.png" alt-text="ha slider":::

Click the **Save** button to apply your selection. Enabling HA can take some
time as the server group provisions standbys and streams data to them.

The **Overview** tab for the server group will list all nodes and their
standbys, along with a **High availability** column indicating whether HA is
successfully enabled for each node.

:::image type="content" source="./media/howto-hyperscale-high-availability/02-ha-column.png" alt-text="the ha column in server group overview":::

### Next steps

Learn more about [high availability](concepts-hyperscale-high-availability.md).
