---
title: Promote read replicas
description: This article describes the promote action for read replica feature in Azure Database for PostgreSQL - Flexible Server.
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 04/27/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Promote read replicas in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Promote refers to the process where a replica is commanded to end its replica mode and transition into full read-write operations.

> [!IMPORTANT]  
> Promote operation is not automatic. In the event of a primary server failure, the system won't switch to the read replica independently. An user action is always required for the promote operation.

Promotion of replicas can be done in two distinct manners:

**Promote to primary server**

This action elevates a replica to the role of the primary server. In the process, the current primary server is demoted to a replica role, swapping their roles. For a successful promotion, it's necessary to have a [virtual endpoint](concepts-read-replicas-promote.md) configured for both the current primary as the writer endpoint, and the replica intended for promotion as the reader endpoint. The promotion is successful only if the targeted replica is included in the reader endpoint configuration.

The diagram illustrates the configuration of the servers before the promotion and the resulting state after the promotion operation is successfully completed.

:::image type="content" source="./media/concepts-read-replica/promote-to-primary-server.png" alt-text="Diagram that shows promote to primary server operation." lightbox="./media/concepts-read-replica/promote-to-primary-server.png":::

**Promote to independent server and remove from replication**

When you choose this option, the replica is promoted to become an independent server and is removed from the replication process. As a result, both the primary and the promoted server function as two independent read-write servers. It should be noted that while virtual endpoints can be configured, they aren't a necessity for this operation. The newly promoted server is no longer part of any existing virtual endpoints, even if the reader endpoint was previously pointing to it. Thus, it's essential to update your application's connection string to direct to the newly promoted replica if the application should connect to it.

The diagram shows how the servers are set up before they're promoted and their configuration after successfully becoming independent servers.

:::image type="content" source="./media/concepts-read-replica/promote-to-independent-server.png" alt-text="Diagram that shows promote to independent server and remove from replication operation." lightbox="./media/concepts-read-replica/promote-to-independent-server.png":::

> [!IMPORTANT]  
> The **Promote to independent server and remove from replication** action is backward compatible with the previous promote functionality.

> [!IMPORTANT]  
> **Server Symmetry**: For a successful promotion using the promote to primary server operation, both the primary and replica servers must have identical tiers and storage sizes. For instance, if the primary has 2vCores and the replica has 4vCores, the only viable option is to use the "promote to independent server and remove from replication" action. Additionally, they need to share the same values for [server parameters that allocate shared memory](concepts-read-replicas.md#server-parameters).

For both promotion methods, there are more options to consider:

- **Planned**: This option ensures that data is synchronized before promoting. It applies all the pending logs to ensure data consistency before accepting client connections.

- **Forced**: This option is designed for rapid recovery in scenarios such as regional outages. Instead of waiting to synchronize all the data from the primary, the server becomes operational once it processes WAL files needed to achieve the nearest consistent state. If you promote the replica using this option, the lag at the time you delink the replica from the primary indicates how much data is lost.

> [!IMPORTANT]
> The **Forced** promotion option is specifically designed to address regional outages and, in such cases, it skips all checks - including the server symmetry requirement - and proceeds with promotion. This is because it prioritizes immediate server availability to handle disaster scenarios. However, using the Forced option outside of region down scenarios is not allowed if the requirements for read replicas specified in the documentation, especially server symmetry requirement, are not met, as it could lead to issues such as broken replication.
 

Learn how to [promote replica to primary](how-to-read-replicas-portal.md#promote-replicas) and [promote to independent server and remove from replication](how-to-read-replicas-portal.md#promote-replica-to-independent-server).

## Configuration management

Read replicas are treated as separate servers in terms of control plane configurations. This approach provides flexibility for read scale scenarios. However, when using replicas for disaster recovery purposes, users must ensure the configuration is as desired.

The promote operation does not carry over specific configurations and parameters. Here are some of the notable ones:

- **PgBouncer**: [The built-in PgBouncer](concepts-pgbouncer.md) connection pooler's settings and status aren't replicated during the promotion process. If PgBouncer was enabled on the primary but not on the replica, it will remain disabled on the replica after promotion. Should you want PgBouncer on the newly promoted server, you must enable it either before or following the promotion action.
- **Geo-redundant backup storage**: Geo-backup settings aren't transferred. Since replicas cannot have geo-backup enabled, the promoted primary (formerly the replica) does not have it after promotion. The feature can only be activated at the standard server's creation time (not a replica).
- **Server Parameters**: If their values differ on the primary and read replica, they will not change during promotion. It's essential to note that parameters influencing shared memory size must have the same values on both the primary and replicas. This requirement is detailed in the [Server parameters](concepts-read-replicas.md#server-parameters) section.
- **Microsoft Entra authentication**: If the primary had [Microsoft Entra authentication](concepts-azure-ad-authentication.md) configured, but the replica was set up with PostgreSQL authentication, then after promotion, the replica won't automatically switch to Microsoft Entra authentication. It retains the PostgreSQL authentication. Users need to manually configure Microsoft Entra authentication on the promoted replica either before or after the promotion process.
- **High Availability (HA)**: Should you require [HA](concepts-high-availability.md) after the promotion, it must be configured on the freshly promoted primary server, following the role reversal.


## Considerations
### Server states during promotion

In both the Planned and Forced promotion scenarios, it's required that servers (both primary and replica) be in an "Available" state. If a server's status is anything other than "Available" (such as "Updating" or "Restarting"), the promotion typically can't proceed without issues. However, an exception is made in the case of regional outages.

During such regional outages, the Forced promotion method can be implemented regardless of the primary server's current status. This approach allows for swift action in response to potential regional disasters, bypassing normal checks on server availability. 

Note that if the former primary server fails beyond recovery during the promotion of its replica, the only option is to delete the former primary and recreate the replica server. 

### Multiple replicas visibility during promotion in nonpaired regions

When dealing with multiple replicas and if the primary region lacks a [paired region](concepts-read-replicas-geo.md#paired-regions-for-disaster-recovery-purposes), a special consideration must be considered. In the event of a regional outage affecting the primary, any other replicas won't be automatically recognized by the newly promoted replica. While applications can still be directed to the promoted replica for continued operation, the unrecognized replicas remain disconnected during the outage. These extra replicas will only reassociate and resume their roles once the original primary region has been restored.

## Frequently asked questions

* **Can I promote a replica if my primary server has high availability (HA) enabled?**

     Yes, whether your primary server is HA-enabled or not, you can promote its read replica. The ability to promote a read replica to a primary server is independent of the HA configuration of the primary. 

* **If I have an HA-enabled primary and a read replica, and I promote the replica, then switch back to the original primary, will the server still be in HA?**
 
    No, we disable HA during the initial promotion since we don't support HA-enabled read replicas. Promoting a read replica to a primary means that the original primary is changing its role to a replica. If you're switching back, you need to enable HA on your original primary server.

## Related content

- [Read replicas - overview](concepts-read-replicas.md)
- [Geo-replication](concepts-read-replicas-geo.md)
- [Virtual endpoints](concepts-read-replicas-virtual-endpoints.md)
- [Create and manage read replicas in the Azure portal](how-to-read-replicas-portal.md)
- [Cross-region replication with virtual network](concepts-networking.md#replication-across-azure-regions-and-virtual-networks-with-private-networking)
