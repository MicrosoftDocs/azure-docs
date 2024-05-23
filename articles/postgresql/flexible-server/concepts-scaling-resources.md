---
title: Scaling resources
description: This article describes the resource scaling in Azure Database for PostgreSQL flexible server.
author: varun-dhawan
ms.author: varundhawan
ms.reviewer: maghan
ms.date: 04/27/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Scaling resources in Azure Database for PostgreSQL flexible server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Azure Database for PostgreSQL flexible server supports both vertical and horizontal scaling options.

**Vertical scaling**: You can scale vertically by adding more resources to the Azure Database for PostgreSQL flexible server instance, such as increasing the instance-assigned number of CPUs and memory. Network throughput of your instance depends on the values you choose for CPU and memory.

After an Azure Database for PostgreSQL flexible server instance is created, you can independently change the:

- CPU (vCores).
- Amount of storage.
- Backup retention period.

The number of vCores can be scaled up or down, but the storage size can only be increased. You can also scale the backup retention period, up or down, from 7 to 35 days. The resources can be scaled by using multiple tools, for instance, the [Azure portal](./quickstart-create-server-portal.md) or the [Azure CLI](./quickstart-create-server-cli.md).

> [!NOTE]
> After you increase the storage size, you can't go back to a smaller storage size.

**Horizontal scaling**: You can scale horizontally by creating [read replicas](./concepts-read-replicas.md). Read replicas let you scale your read workloads onto separate Azure Database for PostgreSQL flexible server instances. They don't affect the performance and availability of the primary instance.

When you change the number of vCores or the compute tier, the instance is restarted for the new server type to take effect. During this time, the system switches over to the new server type. No new connections can be established, and all uncommitted transactions are rolled back. 

The overall time it takes to restart your server depends on the crash recovery process and database activity at the time of the restart. Restart typically takes a minute or less, but it can be several minutes. Timing depends on the transactional activity when the restart was initiated.

If your application is sensitive to loss of in-flight transactions that might occur during compute scaling, we recommend implementing a transaction [retry pattern](../single-server/concepts-connectivity.md#handling-transient-errors).

Scaling the storage doesn't require a server restart in most cases. Similarly, backup retention period changes are an online operation. To improve the restart time, we recommend that you perform scale operations during off-peak hours. That approach reduces the time needed to restart the database server.

## Near-zero downtime scaling

Near-zero downtime scaling is a feature designed to minimize downtime when you modify storage and compute tiers. If you modify the number of vCores or change the compute tier, the server undergoes a restart to apply the new configuration. During this transition to the new server, no new connections can be established.

Typically, this process could take anywhere between 2 to 10 minutes with regular scaling. With the new near-zero downtime scaling feature, this duration is reduced to less than 30 seconds. This reduction in downtime during scaling resources improves the overall availability of your database instance.

### How it works

When you update your Azure Database for PostgreSQL flexible server instance in scaling scenarios, we create a new copy of your server (VM) with the updated configuration. We synchronize it with your current one, and switch to the new copy with a 30-second interruption. Then we retire the old server. The process occurs all at no extra cost to you. 

This process allows for seamless updates while minimizing downtime and ensuring cost-efficiency. This scaling process is triggered when changes are made to the storage and compute tiers. The experience remains consistent for both high-availablity (HA) and non-HA servers. This feature is enabled in all Azure regions. *No customer action is required* to use this capability.

For read replica configured servers, scaling operations must follow a specific sequence to ensure data consistency and minimize downtime. For details about that sequence, refer to [scaling with read replicas](./concepts-read-replicas.md#scale).

> [!NOTE]
> The near-zero downtime scaling process is the _default_ operation. When the following limitations are encountered, the system switches to regular scaling, which involves more downtime compared to the near-zero downtime scaling.

### Precise downtime expectations

* **Downtime duration**: In most cases, the downtime ranges from 10 to 30 seconds.
* **Other considerations**: After a scaling event, there's an inherent DNS `Time-To-Live` (TTL) period of approximately 30 seconds. This period isn't directly controlled by the scaling process. It's a standard part of DNS behavior. From an application perspective, the total downtime experienced during scaling could be in the range of 40 to 60 seconds.

#### Considerations and limitations

- For near-zero downtime scaling to work, enable all [inbound/outbound connections between the IPs in the delegated subnet when you use virtual network integrated networking](../flexible-server/concepts-networking-private.md#virtual-network-concepts). If these connections aren't enabled, the near-zero downtime scaling process doesn't work and scaling occurs through the standard scaling workflow.
- Near-zero downtime scaling doesn't work if there are regional capacity constraints or quota limits on customer subscriptions.
- Near-zero downtime scaling doesn't work for a replica server because it's only supported on the primary server. For a replica server, it automatically goes through a regular scaling process.
- Near-zero downtime scaling doesn't work if a [virtual network-injected server with a delegated subnet](../flexible-server/concepts-networking-private.md#virtual-network-concepts) doesn't have sufficient usable IP addresses. If you have a standalone server, one extra IP address is necessary. For an HA-enabled server, two extra IP addresses are required.
- Logical replication slots aren't preserved during a near-zero downtime failover event. To maintain logical replication slots and ensure data consistency after a scale operation, use the [pg_failover_slot](https://github.com/EnterpriseDB/pg_failover_slots) extension. For more information, see [Enabling extension in a flexible server](../flexible-server/concepts-extensions.md#pg_failover_slots-preview).
- For HA-enabled servers, near-zero downtime scaling is currently enabled for a limited set of regions. More regions will be enabled in a phased manner based on regional capacity.

## Related content

- [Create an Azure Database for PostgreSQL flexible server instance in the portal](how-to-manage-server-portal.md).
