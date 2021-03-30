---
title: Manage read replicas - Azure portal - Azure Database for PostgreSQL - Hyperscale (Citus)
description: Learn how to manage read replicas Azure Database for PostgreSQL - Hyperscale (Citus) from the Azure portal.
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.topic: how-to
ms.date: 03/29/2021
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

2. On the server sidebar, under **SETTINGS**, select **Replication**.

3. Select **Add Replica**.

4. Enter a name for the read replica. 

5. Select **OK** to confirm the creation of the replica.

After the read replica is created, it can be viewed from the **Replication** window:
 

> [!IMPORTANT]
>
> Review the [considerations section of the Read Replica
> overview](concepts-hyperscale-read-replicas.md#considerations).
>
> Before a primary server setting is updated to a new value, update the replica
> setting to an equal or greater value. This action helps the replica keep up
> with any changes made to the master.

## Stop replication

You can stop replication between a primary server and a read replica.

> [!IMPORTANT]
>
> After you stop replication to a primary server and a read replica, it can't
> be undone. The read replica becomes a standalone server that supports both
> reads and writes. The standalone server can't be made into a replica again.

To stop replication between a primary server and a read replica from the Azure
portal, follow these steps:

1. In the Azure portal, select your primary Hyperscale (Citus) server group.

2. On the server menu, under **SETTINGS**, select **Replication**.

3. Select the replica server for which to stop replication.
 
4. Select **Stop replication**.
 
5. Select **OK** to stop replication.
 

## Delete a primary server

To delete a primary server group, you use the same steps as to delete a
standalone Hyperscale (Citus) server group. 

> [!IMPORTANT]
>
> When you delete a primary server group, replication to all read replicas is
> stopped. The read replicas become standalone servers that now support both
> reads and writes.

To delete a server from the Azure portal, follow these steps:

1. In the Azure portal, select your primary Azure Database for PostgreSQL server.

2. Open the **Overview** page for the server. Select **Delete**.
 
3. Enter the name of the primary server to delete. Select **Delete** to confirm
   deletion of the primary server.
 

## Delete a replica

You can delete a read replica similar to how you delete a primary server.

- In the Azure portal, open the **Overview** page for the read replica. Select
  **Delete**.
 
You can also delete the read replica from the **Replication** window by
following these steps:

1. In the Azure portal, select your primary Azure Database for PostgreSQL server.

2. On the server menu, under **SETTINGS**, select **Replication**.

3. Select the read replica to delete.
 
4. Select **Delete replica**.
 
5. Enter the name of the replica to delete. Select **Delete** to confirm
   deletion of the replica.

## Next steps

* Learn more about [read replicas in Azure Database for
  PostgreSQL](concepts-hyperscale-read-replicas.md).
  API](howto-read-replicas-cli.md).
