---
title: Configure high availability for an Azure Database for PostgreSQL - Hyperscale (Citus) server group
description: How to enable or disable high availability
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.topic: conceptual
ms.date: 10/04/2019
---

# Configure Hyperscale (Citus) high availability

Azure Database for PostgreSQL - Hyperscale (Citus) provides high availability
(HA) to avoid database downtime.  When HA is enabled, a server group will run
twice as many nodes as without. Each node will get a replica.

> [!IMPORTANT]
> Because HA doubles the number of servers in the group, it will also double
> the cost.

To enable or disable HA, go to the **Configure** tab in your Hyperscale (Citus)
server group.  Drag the slider for **Highly Available** to ON or OFF.

![ha slider](./media/howto-hyperscale-high-availability/01-ha-slider.png)

Click the "Save" button to apply your selection. Enabling HA can take some time
as the server group provisions replicas and streams data to them.

## Error handling

TODO: the unhappy path.

## Next steps

Learn more about [high availability](concepts-hyperscale-high-availability.md).
