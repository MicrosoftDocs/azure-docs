---
title: Scaling resources
description: This article describes the resource scaling in Azure Database for PostgreSQL - Flexible Server.
author:          varun-dhawan
ms.author:       varundhawan
ms.service:      postgresql
ms.subservice:   flexible-server
ms.topic:        conceptual
ms.date:         12/04/2023
---

# Scaling resources in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Azure Database for PostgreSQL Flexible Server supports both **vertical** and **horizontal** scaling options.

You can scale **vertically** by adding more resources to the Flexible server instance, such as increasing the instance-assigned number of CPUs and memory. Network throughput of your instance depends on the values you choose for CPU and memory. Once a Flexible server instance is created, you can independently change the CPU (vCores), the amount of storage, and the backup retention period. The number of vCores can be scaled up or down. The storage size however can only be increased. In addition, You can scale the backup retention period up or down from 7 to 35 days. The resources can be scaled using multiple tools, for instance,  [Azure portal](./quickstart-create-server-portal.md) or the [Azure CLI](./quickstart-create-server-cli.md).

> [!NOTE]  
> After you increase the storage size, you can't go back to a smaller storage size.

You scale **horizontally** by creating [read replicas](./concepts-read-replicas.md). Read replicas let you scale your read workloads onto separate flexible server instance without affecting the performance and availability of the primary instance.

When you change the number of vCores or the compute tier, the instance is restarted for the new server type to take effect. During this time the system switches over to the new server type, no new connections can be established, and all uncommitted transactions are rolled back. The overall time it takes to restart your server depends on the crash recovery process and database activity at the time of the restart. Restarts typically takes a minute or less but it can be higher and can take several minutes, depending on transactional activity at the time of the restart. 

If you application is sensitive to loss of in-flight transactions that may occur during compute scaling, we recommend implementing transaction [retry pattern](../single-server/concepts-connectivity.md#handling-transient-errors).

Scaling the storage doesn't require a server restart in most cases. Similarly, backup retention period changes are an online operation. To improve the restart time, we recommend that you perform scale operations during off-peak hours. That approach reduces the time needed to restart the database server.

## Near-zero downtime scaling 

Near-zero Downtime Scaling is a feature designed to minimize downtime when modifying storage and compute tiers. If you modify the number of vCores or change the compute tier, the server undergoes a restart to apply the new configuration. During this transition to the new server, no new connections can be established. Typically, this process with regular scaling could take anywhere between 2 to 10 minutes. However, with the new 'Near-zero downtime' Scaling feature this duration is reduced to less than 30 seconds. This significant reduction in downtime during scaling resources, that greatly improves the overall availability of your database instance.

### How it works

When updating your Flexible server in scaling scenarios, we create a new copy of your server (VM) with the updated configuration, synchronize it with your current one, briefly switch to the new copy with a 30-second interruption, and retire the old server, all at no extra cost to you. This process allows for seamless updates while minimizing downtime and ensuring cost-efficiency. This scaling process is triggered when changes are made to the storage and compute tiers, and the experience remains consistent for both (HA) and non-HA servers. This feature is enabled in all Azure regions* and there's **no customer action required** to use this capability. 

> [!NOTE]
>  Near-zero downtime scaling process is the _default_ operation. However, in cases where the following limitations are encountered, the system switches to regular scaling, which involves more downtime compared to the near-zero downtime scaling.

#### Limitations 

- In order for near-zero downtime scaling to work, you should enable all [inbound/outbound connections between the IPs in the delegated subnet when using VNET integrated networking](../flexible-server/concepts-networking-private.md#virtual-network-concepts). If these aren't enabled near zero downtime scaling process will not work and scaling will occur through the standard scaling workflow.
- Near-zero Downtime Scaling won't work if there are regional capacity constraints or quota limits on customer subscriptions.
- Near-zero Downtime Scaling doesn't work for replica server but supports the primary server. For replica server it will automatically go through regular scaling process.
- Near-zero Downtime Scaling won't work if a [virtual network injected Server with delegated subnet](../flexible-server/concepts-networking-private.md#virtual-network-concepts) doesn't have sufficient usable IP addresses. If you have a standalone server, one extra IP address is necessary, and for a HA-enabled server, two extra IP addresses are required.
- *For HA enabled servers, near-zero downtime scaling is currently enabled for limited set of regions. We will be enabling this to more regions in a phased manner based upon the regional capacity.

## Related content

- [create a PostgreSQL server in the portal](how-to-manage-server-portal.md).