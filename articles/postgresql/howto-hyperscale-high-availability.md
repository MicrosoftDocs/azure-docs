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
(HA) to avoid database downtime. However, with HA enabled a server group will
use twice as many nodes as without HA, because each node gets a standby.

> [!IMPORTANT]
> Because HA doubles the number of servers in the group, it will also double
> the cost.

Enabling HA is possible during server group creation, or afterward in the
**Configure** tab for your server group in the Azure portal. The user interface
looks similar in either case. Drag the slider for **Highly Available** to ON or
OFF:

![ha slider](./media/howto-hyperscale-high-availability/01-ha-slider.png)

Click the "Save" button to apply your selection. Enabling HA can take some time
as the server group provisions standbys and streams data to them.

## Next steps

Learn more about [high availability](concepts-hyperscale-high-availability.md).
