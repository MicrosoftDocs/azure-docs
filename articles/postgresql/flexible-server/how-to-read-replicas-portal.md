---
title: Manage read replicas - Azure portal - Azure Database for PostgreSQL - Flexible Server
description: Learn how to manage read replicas Azure Database for PostgreSQL - Flexible Server from the Azure portal.
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
ms.author: alkuchar
author: AwdotiaRomanowna
ms.date: 10/14/2022
---

# Create and manage read replicas in Azure Database for PostgreSQL - Flexible Server from the Azure portal

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

In this article, you learn how to create and manage read replicas in Azure Database for PostgreSQL from the Azure portal. To learn more about read replicas, see the [overview](concepts-read-replicas.md).

## Prerequisites

An [Azure Database for PostgreSQL server](./quickstart-create-server-portal.md) to be the primary server.

> [!NOTE]
> When deploying read replicas for persistent heavy write-intensive primary workloads, the replication lag could continue to grow and may never be able to catch-up with the primary. This may also increase storage usage at the primary as the WAL files are not deleted until they are received at the replica.

## Review primary settings
Before you begin the read replica setup for Azure Database for PostgreSQL, it’s essential to verify that your primary server’s configuration adheres to the prerequisites for creating replicas. Certain features enabled on the primary server can obstruct the replica creation process.

**Storage auto-grow**: Check and ensure that the storage auto-grow feature is deactivated on the primary server. The creation of a read replica cannot proceed if this feature is turned on.

**Private link**: Review the networking configuration of the primary server. For the read replica creation to be allowed, the primary server must be configured with either public access using allowed IP addresses or combined public and private access using VNET Integration. Private Link configurations that do not meet these conditions will prevent the creation of a read replica.

* In the [Azure portal](https://portal.azure.com/), choose the Azure Database for PostgreSQL - Flexible Server that you want to setup a replica for.
* On the **Overview** dialog, note the PostgreSQL version (ex `15.4`).  Also note the region your primary is deployed too (ex. `East US`).

:::image type="content" source="./media/how-to-read-replicas-portal/primary-settings.png" alt-text="Review primary settings":::

* On the server sidebar, under **Settings**, select **Compute + storage**.
* Review and note the following settings:
  * Compute: Tier, Processor, Size (ex `Standard_D4ads_v5`).
  * Storage 
    * Storage size (ex `128GB`)
    * Auto-growth
  * High Availability
    * Enabled / Disabled
    * Availability zone settings
  * Backup settings
    * Retention period
    * Redundancy Options
* Under **Settings**, select **Networking**
  * Review the network settings

:::image type="content" source="./media/how-to-read-replicas-portal/primary-compute.png" alt-text="Review features enabled":::

## Create a read replica

To create a read replica, follow these steps:

1. Select an existing Azure Database for PostgreSQL server to use as the primary server.

2. On the server sidebar, under **Settings**, select **Replication**.

3. Select **Create replica**.

   :::image type="content" source="./media/how-to-read-replicas-portal/add-replica.png" alt-text="Add a replica":::

4. Enter the Basics form with the following information.

    :::image type="content" source="./media/how-to-read-replicas-portal/basics.png" alt-text="Enter the Basics information":::

* Set the replica server name.
   > [!TIP]
   > It is a Cloud Adoption Framework (CAF) best practice to [use a resource naming convention](/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming) that will allow you to easily determine what instance you are connecting too or managing and where it resides.
* Select a location that is different from your primary but note that you can select the same region.
   > [!TIP]
   > To learn more about which regions you can create a replica in, visit the [read replica concepts article](concepts-read-replicas.md).
* Set the compute and storage to what you recorded from your primary. If the displayed compute does not match, select **Configure server** and select the appropriate one.
   > [!NOTE]
   > If you select a compute size smaller than the primary, the deployment will fail. Also be aware that the compute size may not be available in a different region.
    
    :::image type="content" source="./media/how-to-read-replicas-portal/replica-compute.png" alt-text="Chose the compute size.":::

6. Select **Review + create** to confirm the creation of the replica or **Next: Networking** if you want to add, delete or modify any firewall rules.
    :::image type="content" source="./media/how-to-read-replicas-portal/networking.png" alt-text="Modify firewall rules.":::
7. Leave the remaining defaults and then select the **Review + create** button at the bottom of the page or proceed to the next forms to add tags or change data encryption method.
8. Review the information in the final confirmation window. When you're ready, select **Create**. A new deployment will be created and executed.
    :::image type="content" source="./media/how-to-read-replicas-portal/replica-review.png" alt-text="Review the information in the final confirmation window.":::
9. During the deployment, you will see the primary in `Updating` state.
   :::image type="content" source="./media/how-to-read-replicas-portal/primary-updating.png" alt-text="Primary enters into updating status."::: 
After the read replica is created, it can be viewed from the **Replication** window.
:::image type="content" source="./media/how-to-read-replicas-portal/list-replica.png" alt-text="View the new replica in the Replication window.":::

> [!IMPORTANT]
> Review the [considerations section of the Read Replica overview](concepts-read-replicas.md#considerations).
>
> To avoid issues during promotion of replicas always change the following server parameters on the replicas first, before applying them on the primary: max_connections, max_prepared_transactions, max_locks_per_transaction, max_wal_senders, max_worker_processes.

## Add Virtual Endpoints (preview)
1. In the Azure portal, select the primary server.
2. On the server sidebar, under **Settings**, select **Replication**.
3. Select **Create endpoint**.
4. In the dialog, type a meaningful name for your endpoint.  Notice the DNS endpoint that is being generated.
    :::image type="content" source="./media/how-to-read-replicas-portal/add-virtual-endpoint.png" alt-text="Add a new virtual endpoint with custom name.":::
5. Select **Create**.
    > [!NOTE]
    >  If you do not create a virtual endpoint you will receive an error on the promote replica attempt.
    :::image type="content" source="./media/how-to-read-replicas-portal/replica-promote-attempt.png" alt-text="Promotion error when missing virtual endpoint.":::

## Promote replicas

You can promote replicas to become stand-alone servers serving read-write requests.

> [!IMPORTANT]
> Promotion of replicas cannot be undone. The read replica becomes a standalone server that supports both reads and writes. The standalone server can't be made into a replica again.

To promote replica from the Azure portal, follow these steps:

1. In the Azure portal, select your primary Azure Database for PostgreSQL server.

2. On the server menu, under **Settings**, select **Replication**.

3. Select the replica server for which to stop replication and hit **Promote**.

   :::image type="content" source="./media/how-to-read-replicas-portal/select-replica.png" alt-text="Select the replica":::

4. Confirm promote operation.

   :::image type="content" source="./media/how-to-read-replicas-portal/confirm-promote.png" alt-text="Confirm to promote replica":::

## Delete a primary server
You can only delete primary server once all read replicas have been deleted. Follow the instruction in [Delete a replica](#delete-a-replica) section to delete replicas and then proceed with steps below.  

To delete a server from the Azure portal, follow these steps:

1. In the Azure portal, select your primary Azure Database for PostgreSQL server.

2. Open the **Overview** page for the server and select **Delete**.

   :::image type="content" source="./media/how-to-read-replicas-portal/delete-server.png" alt-text="On the server Overview page, select to delete the primary server":::

3. Enter the name of the primary server to delete. Select **Delete** to confirm deletion of the primary server.

   :::image type="content" source="./media/how-to-read-replicas-portal/confirm-delete.png" alt-text="Confirm to delete the primary server":::

## Delete a replica

You can delete a read replica similar to how you delete a standalone Azure Database for PostgreSQL server.

- In the Azure portal, open the **Overview** page for the read replica. Select **Delete**.

   :::image type="content" source="./media/how-to-read-replicas-portal/delete-replica.png" alt-text="On the replica Overview page, select to delete the replica":::

You can also delete the read replica from the **Replication** window by following these steps:

1. In the Azure portal, select your primary Azure Database for PostgreSQL server.

2. On the server menu, under **Settings**, select **Replication**.

3. Select the read replica to delete and hit the **Delete** button.

   :::image type="content" source="./media/how-to-read-replicas-portal/delete-replica02.png" alt-text="Select the replica to delete":::

4. Acknowledge **Delete** operation.

   :::image type="content" source="./media/how-to-read-replicas-portal/delete-confirm.png" alt-text="Confirm to delete te replica":::

## Monitor a replica

Two metrics are available to monitor read replicas.

### Max Physical Replication Lag
> Available only on the primary.

The **Max Physical Replication Lag** metric shows the lag in bytes between the primary server and the most-lagging replica.

1.	In the Azure portal, select the primary server.

2.	Select **Metrics**. In the **Metrics** window, select **Max Physical Replication Lag**.

    :::image type="content" source="./media/how-to-read-replicas-portal/metrics_max_physical_replication_lag.png" alt-text="Screenshot of the Metrics blade showing Max Physical Replication Lag metric.":::

3.	For your **Aggregation**, select **Max**.

### Read Replica Lag metric
> Available only on replicas.

The **Read Replica Lag** metric shows the time since the last replayed transaction on a replica. If there are no transactions occurring on your primary, the metric reflects this time lag. For instance if there are no transactions occurring on your primary server, and the last transaction was replayed 5 seconds ago, then the Read Replica Lag will show 5 second delay.

1. In the Azure portal, select read replica.

2. Select **Metrics**. In the **Metrics** window, select **Read Replica Lag**.

   :::image type="content" source="./media/how-to-read-replicas-portal/metrics_read_replica_lag.png" alt-text="  screenshot of the Metrics blade showing Read Replica Lag metric.":::
    
3. For your **Aggregation**, select **Max**.

## Next steps

* Learn more about [read replicas in Azure Database for PostgreSQL](concepts-read-replicas.md).

[//]: # (* Learn how to [create and manage read replicas in the Azure CLI and REST API]&#40;how-to-read-replicas-cli.md&#41;.)
