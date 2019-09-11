---
title: Scale an Azure Database for PostgreSQL - Hyperscale (Citus) server group
description: Adjust server group memory, disk, and CPU resources to deal with increased load
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.topic: conceptual
ms.date: 9/10/2019
---

# Scale a Hyperscale (Citus) server group

Azure Database for PostgreSQL - Hyperscale (Citus) provides self-service
scaling to deal with increased load. The Azure portal makes it easy to either
add new worker nodes or increase existing nodes’ memory, disk, and CPU
capacity.

To scale worker nodes, go to the **Configure** tab in your Azure Database for
PostgreSQL server group. Adjust the sliders to change the values:

![Resource sliders](./media/howto-hyperscale-scaling/01-sliders-workers.png)

Applications send their queries to the coordinator node, which relays them to
the relevant workers and accumulates the results. Scaling the coordinator can
improve performance for queries that require large or CPU-intensive
aggregations. To do so, click **View configuration** and adjust the sliders:

![Resource sliders](./media/howto-hyperscale-scaling/02-sliders-coordinator.png)

## Next steps

Learn more about server group [performance
options](concepts-hyperscale-configuration-options.md).
