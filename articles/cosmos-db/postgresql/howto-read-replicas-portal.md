---
title: Manage read replicas - Azure portal - Azure Cosmos DB for PostgreSQL
description: Learn how to manage read replicas Azure Cosmos DB for PostgreSQL from the Azure portal.
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: how-to
ms.date: 06/17/2022
---

# Create and manage read replicas in Azure Cosmos DB for PostgreSQL from the Azure portal

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

In this article, you learn how to create and manage read replicas in Hyperscale
(Citus) from the Azure portal. To learn more about read replicas, see the
[overview](concepts-read-replicas.md).


## Prerequisites

A [cluster](quickstart-create-portal.md) to
be the primary.

## Create a read replica

To create a read replica, follow these steps:

1. Select an existing Azure Database for PostgreSQL cluster to use as the
   primary. 

2. On the cluster sidebar, under **Server group management**, select
   **Replication**.

3. Select **Add Replica**.

4. Enter a name for the read replica. 

5. Select a value from the **Location (preview)** drop-down.

6. Select **OK** to confirm the creation of the replica.

After the read replica is created, it can be viewed from the **Replication** window.

> [!IMPORTANT]
>
> Review the [considerations section of the Read Replica
> overview](concepts-read-replicas.md#considerations).
>
> Before a primary cluster setting is updated to a new value, update the
> replica setting to an equal or greater value. This action helps the replica
> keep up with any changes made to the master.

## Delete a primary cluster

To delete a primary cluster, you use the same steps as to delete a
standalone cluster. From the Azure portal, follow these
steps:

1. In the Azure portal, select your primary Azure Database for PostgreSQL
   cluster.

2. Open the **Overview** page for the cluster. Select **Delete**.
 
3. Enter the name of the primary cluster to delete. Select **Delete** to
   confirm deletion of the primary cluster.
 

## Delete a replica

You can delete a read replica similarly to how you delete a primary server
group.

- In the Azure portal, open the **Overview** page for the read replica. Select
  **Delete**.
 
You can also delete the read replica from the **Replication** window by
following these steps:

1. In the Azure portal, select your primary cluster.

2. On the cluster menu, under **Server group management**, select
   **Replication**.

3. Select the read replica to delete.
 
4. Select **Delete replica**.
 
5. Enter the name of the replica to delete. Select **Delete** to confirm
   deletion of the replica.

## Next steps

* Learn more about [read replicas in Azure Database for
  PostgreSQL - Hyperscale (Citus)](concepts-read-replicas.md).
