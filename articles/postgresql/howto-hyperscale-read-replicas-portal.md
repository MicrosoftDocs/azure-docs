---
title: Manage read replicas - Azure portal - Azure Database for PostgreSQL - Hyperscale (Citus)
description: Learn how to manage read replicas Azure Database for PostgreSQL - Hyperscale (Citus) from the Azure portal.
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: how-to
ms.date: 08/03/2021
---

# Create and manage read replicas in Azure Database for PostgreSQL - Hyperscale (Citus) from the Azure portal

In this article, you learn how to create and manage read replicas in Hyperscale
(Citus) from the Azure portal. To learn more about read replicas, see the
[overview](concepts-hyperscale-read-replicas.md).


## Prerequisites

A [Hyperscale (Citus) server group](quickstart-create-hyperscale-portal.md) to
be the primary.

## Create a read replica

To create a read replica, follow these steps:

1. Select an existing Azure Database for PostgreSQL server group to use as the
   primary. 

2. On the server group sidebar, under **Server group management**, select
   **Replication**.

3. Select **Add Replica**.

4. Enter a name for the read replica. 

5. Select **OK** to confirm the creation of the replica.

After the read replica is created, it can be viewed from the **Replication** window.

> [!IMPORTANT]
>
> Review the [considerations section of the Read Replica
> overview](concepts-hyperscale-read-replicas.md#considerations).
>
> Before a primary server group setting is updated to a new value, update the
> replica setting to an equal or greater value. This action helps the replica
> keep up with any changes made to the master.

## Delete a primary server group

To delete a primary server group, you use the same steps as to delete a
standalone Hyperscale (Citus) server group. 

> [!IMPORTANT]
>
> When you delete a primary server group, replication to all read replicas is
> stopped. The read replicas become standalone server groups that now support
> both reads and writes.

To delete a server group from the Azure portal, follow these steps:

1. In the Azure portal, select your primary Azure Database for PostgreSQL
   server group.

2. Open the **Overview** page for the server group. Select **Delete**.
 
3. Enter the name of the primary server group to delete. Select **Delete** to
   confirm deletion of the primary server group.
 

## Delete a replica

You can delete a read replica similarly to how you delete a primary server
group.

- In the Azure portal, open the **Overview** page for the read replica. Select
  **Delete**.
 
You can also delete the read replica from the **Replication** window by
following these steps:

1. In the Azure portal, select your primary Hyperscale (Citus) server group.

2. On the server group menu, under **Server group management**, select
   **Replication**.

3. Select the read replica to delete.
 
4. Select **Delete replica**.
 
5. Enter the name of the replica to delete. Select **Delete** to confirm
   deletion of the replica.

## Next steps

* Learn more about [read replicas in Azure Database for
  PostgreSQL - Hyperscale (Citus)](concepts-hyperscale-read-replicas.md).
