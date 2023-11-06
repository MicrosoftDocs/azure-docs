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
Before setting up a read replica for Azure Database for PostgreSQL, ensure the primary server is configured to meet the necessary prerequisites. Certain settings on the primary server can affect the ability to create replicas.

**Storage auto-grow**: The storage auto-grow setting must be consistent between the primary server and its read replicas. If the primary server has this feature enabled, the read replicas must also have it enabled to prevent inconsistencies in storage behavior that could interrupt replication. If it's disabled on the primary server, it should also be disabled on the replicas.

**Premium SSD v2**: The current release does not support the creation of read replicas for primary servers using Premium SSD v2 storage. If your workload requires read replicas, you will need to choose a different storage option for the primary server.

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

### Modify application(s) to point to virtual endpoint

Modify any applications that are using your Azure Database for PostgreSQL to use the new virtual endpoints (ex: `corp-pg-001.writer.postgres.database.azure.com` and `corp-pg-001.reader.postgres.database.azure.com`)

## Promote replicas

With all the necessary components in place, you are now ready to perform a promote replica to primary operation.

To promote replica from the Azure portal, follow these steps:
1. In the [Azure portal](https://portal.azure.com/), select your primary Azure Database for PostgreSQL - Flexible server.
2. On the server menu, under **Settings**, select **Replication**.
3. Under **Servers**, select the **Promote** icon for the replica.
   :::image type="content" source="./media/how-to-read-replicas-portal/replica-promote.png" alt-text="Select promote for a replica.":::
4. In the dialog, ensure the action is **Promote to primary server**.
5. For **Data sync**, ensure **Planned - sync data before promoting** is selected.
   :::image type="content" source="./media/how-to-read-replicas-portal/replica-promote.png" alt-text="Select promote for a replica.":::
6. Select **Promote** to begin the process. Once it is completed, the roles will reverse: the replica will become the primary, and the primary will assume the role of the replica.
   > [!NOTE]
   >  The replica you are promoting must have the reader virtual endpoint assigned or you will receive an error on promotion.

### Test applications

Restart your applications, attempt to perform some operations. Your applications should function seamlessly without the need to modify the virtual endpoint connection string or DNS entries. Leave your applications running this time.

### Failback to original server and region
Repeat the same operations to promote the original server to the primary:
1. In the [Azure portal](https://portal.azure.com/), select the replica.
2. On the server sidebar, under **Settings**, select **Replication**
3. Under **Servers**, select the **Promote** icon for the replica.
4. In the dialog, ensure the action is **Promote to primary server**.
5. For **Data sync**, ensure **Planned - sync data before promoting** is selected.
6. Select **Promote**, the process will begin. Once it is completed, the roles will reverse: the replica will become the primary, and the primary will assume the role of the replica.


### Test applications
Again, switch to one of the consuming applications. Wait for the primary and replica status to change to `Updating` and then attempt to perform some operations. During the replica promote, it is possible your application will encounter temporary connectivity issues to the endpoint:
:::image type="content" source="./media/how-to-read-replicas-portal/failover-connectivity-psql.png" alt-text="Potential promote connectivity errors.":::

If no application is available to test directly, connectivity during a promotion can be tested against the writer endpoint using psql and the `\watch` switch with a simple psql `select 1` command:

```bash
select 1; \watch
```

## Add secondary read replica

Create a secondary read replica in a seperate region to modify the reader virtual endpoint and to allow for creating an independent server from the first replica.

1. In the [Azure portal](https://portal.azure.com/), choose the primary Azure Database for PostgreSQL - Flexible Server.
2. On the server sidebar, under **Settings**, select **Replication**.
3. Select **Create replica**.
4. Enter the Basics form with information in a third region (ex `westus` and `corp-pg-westus-001`)
5. Select **Review + create** to confirm the creation of the replica or **Next: Networking** if you want to add, delete or modify any firewall rules.
6. Verify the firewall settings. Notice how the primary settings have been copied automatically.
7. Leave the remaining defaults and then select the **Review + create** button at the bottom of the page or proceed to the next forms to configure security or add tags.
8. Review the information in the final confirmation window. When you're ready, select **Create**. A new deployment will be created and executed.
9. During the deployment, you will see the primary in `Updating` status:

## Modify virtual endpoint

1. In the [Azure portal](https://portal.azure.com/), choose the primary Azure Database for PostgreSQL - Flexible Server.
2. On the server sidebar, under **Settings**, select **Replication**.
3. Select the elipses and then select **Edit**.
   :::image type="content" source="./media/how-to-read-replicas-portal/edit-virtual-endpoint.png" alt-text="Edit the virtual endpoint.":::
4. In the dialog, select the new secondary replica.
   :::image type="content" source="./media/how-to-read-replicas-portal/select-secondary-endpoint.png" alt-text="Select the secondary replica.":::
5. Select **Save**. The reader endpoint will now be pointed at the secondary replica and the promote operation will now be tied to this replica.

## Promote replica to independent server

Rather than switchover to a replica, it is also possible to break the replication of a replica such that it becomes its own standalone server.

1. In the [Azure portal](https://portal.azure.com/), choose the Azure Database for PostgreSQL - Flexible Server primary server.
2. On the server sidebar, on the server menu, under **Settings**, select **Replication**.
3. Under **Servers**, select the **Promote** icon for the replica you would like to promote to independent.
:::image type="content" source="./media/how-to-read-replicas-portal/replica-promote.png" alt-text="Select promote for a replica.":::
4. In the dialog, ensure the action is **Promote to independent server and remove from replication. This won't impact the primary server**.
   > [!NOTE]
   > Once a replica is promoted to an independent server, it cannot be added back to the replication set.
5. For **Data sync**, ensure **Planned - sync data before promoting** is selected.
   :::image type="content" source="./media/how-to-read-replicas-portal/replica-promote-independent.png" alt-text="Promote the replica to independent server.":::
6. Select **Promote**, the process will begin. Once completed, the server will no longer be a replica of the primary.

## Delete a replica

You can delete a read replica similar to how you delete a standalone Azure Database for PostgreSQL - Flexible Server.

1. In the Azure portal, open the **Overview** page for the read replica. Select **Delete**.
   :::image type="content" source="./media/how-to-read-replicas-portal/delete-replica.png" alt-text="On the replica Overview page, select to delete the replica.":::

You can also delete the read replica from the **Replication** window by following these steps:

1. In the Azure portal, select your primary Azure Database for PostgreSQL server.
2. On the server menu, under **Settings**, select **Replication**.
3. Select the read replica to delete and then select the ellipses. Select **Delete**.
   :::image type="content" source="./media/how-to-read-replicas-portal/delete-replica02.png" alt-text="Select the replica to delete.":::
4. Acknowledge **Delete** operation.
   :::image type="content" source="./media/how-to-read-replicas-portal/delete-replica-confirm.png" alt-text="Confirm to delete the replica.":::

## Delete a primary server
You can only delete primary server once all read replicas have been deleted. Follow the instruction in [Delete a replica](#delete-a-replica) section to delete replicas and then proceed with steps below.  

To delete a server from the Azure portal, follow these steps:
1. In the Azure portal, select your primary Azure Database for PostgreSQL server.
2. Open the **Overview** page for the server and select **Delete**.
   :::image type="content" source="./media/how-to-read-replicas-portal/delete-primary.png" alt-text="On the server Overview page, select to delete the primary server.":::
3. Enter the name of the primary server to delete. Select **Delete** to confirm deletion of the primary server.
   :::image type="content" source="./media/how-to-read-replicas-portal/delete-primary-confirm.png" alt-text="Confirm to delete the primary server.":::

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
