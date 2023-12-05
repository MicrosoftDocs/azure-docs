---
title: Manage read replicas - Azure portal - Azure Cosmos DB for PostgreSQL
description: See how to manage read replicas in Azure Cosmos DB for PostgreSQL from the Azure portal.
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 01/30/2023
---

# Create and manage read replicas in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

In this article, you learn how to create and manage read replicas in Azure
Cosmos DB for PostgreSQL from the Azure portal. To learn more about read
replicas, see the [overview](concepts-read-replicas.md).

## Prerequisites

A [cluster](quickstart-create-portal.md) to
be the primary.

## Create a read replica

To create a read replica, follow these steps:

1. Select an existing Azure Cosmos DB for PostgreSQL cluster to use as the
   primary. 

2. On the cluster sidebar, under **Cluster management**, select
   **Replicate data globally**.

3. On the **Replicate data globally** screen, select **Add replica**.

4. Under **Cluster name**, enter a name for the read replica.

5. Select a value from the **Location** drop-down.

6. Select **OK**.

After the read replica is created, you can see it listed on the **Replicate data globally** screen.

> [!IMPORTANT]
>
> Review the [considerations section of the Read Replica
> overview](concepts-read-replicas.md#considerations).
>
> Before a primary cluster setting is updated to a new value, update the
> replica setting to an equal or greater value. This action helps the replica
> keep up with any changes made to the master.

## Promote a read replica

To [promote a cluster read replica](./concepts-read-replicas.md#replica-promotion-to-independent-cluster) to an independent read-write cluster, follow these steps:

1. Select the read replica you would like to promote in the portal. 

2. On the cluster sidebar, under **Cluster management**, select
   **Replicate data globally**.

3. On the **Replicate data globally** page, find the read replica in the list of clusters under the map and click the promote icon. 

4. On the **Promote \<cluster name>** screen, double check the read replica's name, confirm that you understand that promotion is irreversible by setting the checkbox, and select **Promote**.

After the read replica is promoted, it becomes an independent readable and writable cluster with the same connection string. 

## Delete a primary cluster

To delete a primary cluster, you use the same steps as to delete a
standalone cluster. From the Azure portal, follow these
steps:

1. In the Azure portal, select your primary Azure Cosmos DB for PostgreSQL
   cluster.

1. On the **Overview** page for the cluster, select **Delete**.
 
1. On the **Delete \<cluster name>** screen, select the checkbox next to **I understand that this cluster and all nodes that belong to this cluster will be deleted and cannot be recovered.**

1. Select **Delete** to confirm deletion of the primary cluster.

## Delete a replica

You can delete a read replica similarly to how you delete a primary cluster.

You can select the read replica to delete directly from the portal, or from the **Replicate data globally** screen of the primary cluster.

1. In the Azure portal, on the **Overview** page for the read replica, select **Delete**.

1. On the **Delete \<replica name>** screen, select the checkbox next to **I understand that this replica and all nodes that belong to it will be deleted. Deletion of this replica will not impact the primary cluster or other read replicas.**

1. Select **Delete** to confirm deletion of the replica.

## Next steps

* Learn more about [read replicas](concepts-read-replicas.md).
