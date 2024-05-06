---
title: Virtual endpoints
description: This article describes the virtual endpoints for read replica feature in Azure Database for PostgreSQL - Flexible Server.
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 04/27/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Virtual endpoints for read replicas in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Virtual Endpoints are read-write and read-only listener endpoints, that remain consistent irrespective of the current role of the Azure Database for PostgreSQL flexible server instance. This means you don't have to update your application's connection string after performing the **promote to primary server** action, as the endpoints will automatically point to the correct instance following a role change.

All operations involving virtual endpoints, whether adding, editing, or removing, are performed in the context of the primary server. In the Azure portal, you manage these endpoints under the primary server page. Similarly, when using tools like the CLI, REST API, or other utilities, commands and actions target the primary server for endpoint management.

Virtual Endpoints offer two distinct types of connection points:

**Writer Endpoint (Read/Write)**: This endpoint always points to the current primary server. It ensures that write operations are directed to the correct server, irrespective of any promote operations users trigger. This endpoint can't be changed to point to a [replica](concepts-read-replicas.md).


**Read-Only Endpoint**: This endpoint can be configured by users to point either to a read replica or the primary server. However, it can only target one server at a time. Load balancing between multiple servers isn't supported. You can adjust the target server for this endpoint anytime, whether before or after promotion.

> [!NOTE]  
> You can create only one writer and one read-only endpoint per primary and one of its replica.

### Virtual Endpoints and Promote Behavior

In the event of a promote action, the behavior of these endpoints remains predictable.
The sections below delve into how these endpoints react to both [Promote to primary server](concepts-read-replicas-promote.md) and **Promote to independent server** scenarios.

| **Virtual endpoint** | **Original target** | **Behavior when "Promote to primary server" is triggered** | **Behavior when "Promote to independent server" is triggered** |
| --- | --- | --- | --- |
| <b> Writer endpoint | Primary | Points to the new primary server. | Remains unchanged. |
| <b> Read-Only endpoint | Replica | Points to the new replica (former primary). | Points to the primary server. |
| <b> Read-Only endpoint | Primary | Not supported. | Remains unchanged. |
#### Behavior when "Promote to primary server" is triggered

- **Writer Endpoint**: This endpoint is updated to point to the new primary server, reflecting the role switch.
- **Read-Only endpoint**
  * **If Read-Only Endpoint Points to Replica**: After the promote action, the read-only endpoint will point to the new replica (the former primary).
  * **If Read-Only Endpoint Points to Primary**: For the promotion to function correctly, the read-only endpoint must be directed at the server intended to be promoted. Pointing to the primary, in this case, isn't supported and must be reconfigured to point to the replica prior to promotion.

#### Behavior when "Promote to the independent server and remove from replication" is triggered

- **Writer Endpoint**: This endpoint remains unchanged. It continues to direct traffic to the server, holding the primary role.
- **Read-Only endpoint**
  * **If Read-Only Endpoint Points to Replica**: The Read-Only endpoint is redirected from the promoted replica to point to the primary server.
  * **If Read-Only Endpoint Points to Primary**: The Read-Only endpoint remains unchanged, continuing to point to the same server.


Learn how to [create virtual endpoints](how-to-read-replicas-portal.md#create-virtual-endpoints).

## Related content

- [Read replicas - overview](concepts-read-replicas.md)
- [Geo-replication](concepts-read-replicas-geo.md)
- [Promote read replicas](concepts-read-replicas-promote.md)
- [Create and manage read replicas in the Azure portal](how-to-read-replicas-portal.md)
- [Cross-region replication with virtual network](concepts-networking.md#replication-across-azure-regions-and-virtual-networks-with-private-networking)
