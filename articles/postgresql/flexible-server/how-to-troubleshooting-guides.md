---
title: Troubleshooting guides - Azure portal - Azure Database for PostgreSQL - Flexible Server Preview
description: Learn how to use Troubleshooting guides for Azure Database for PostgreSQL - Flexible Server from the Azure portal.
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
ms.author: alkuchar
author: AwdotiaRomanowna
ms.date: 03/21/2023
---

# Troubleshooting guides - Azure portal - Azure Database for PostgreSQL - Flexible Server Preview

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

> [!NOTE]
> Troubleshooting guides for PostgreSQL Flexible Server are currently in preview.

In this article, you'll learn how to use Troubleshooting guides for Azure Database for PostgreSQL from the Azure portal. To learn more about Troubleshooting guides, see the [overview](concepts-troubleshooting-guides.md).

## Prerequisites

To effectively troubleshoot specific issue, you need to make sure you have all the necessary data in place. 
Each troubleshooting guide requires a specific set of data, which is sourced from three separate features: [Diagnostic settings](howto-configure-and-access-logs.md), [Query Store](concepts-query-store.md), and [Enhanced Metrics](concepts-monitoring.md#enabling-enhanced-metrics).
All troubleshooting guides require logs to be sent to the Log Analytics workspace, but the specific category of logs to be captured may vary depending on the particular guide. 

Please follow the steps described in the [Configure and Access Logs in Azure Database for PostgreSQL - Flexible Server](howto-configure-and-access-logs.md) article to configure diagnostic settings and send the logs to the Log Analytics workspace.
Query Store, and Enhanced Metrics are configured via the Server Parameters. Please follow the steps described in the "Configure server parameters in Azure Database for PostgreSQL - Flexible Server" articles for [Azure Portal](howto-configure-server-parameters-using-portal.md) or [Azure CLI](howto-configure-server-parameters-using-cli.md).  

The table below provides information on the required log categories for each troubleshooting guide, as well as the necessary Query Store and Enhanced Metrics prerequisites.

| Troubleshooting guide                           | Diagnostic settings log categories                                                                                          | Query Store                                  | Enhanced Metrics                    |
|:------------------------------------------------|:----------------------------------------------------------------------------------------------------------------------------|----------------------------------------------|-------------------------------------|
| Autovacuum blockers & wraparound identification | "PostgreSQL Sessions", "PostgreSQL Database Remaining Transactions"                                                         | :x:                                          | :x:                                 |
| Autovacuum monitoring                           | "PostgreSQL Server Logs", "PostgreSQL Tables Statistics", "PostgreSQL Database Remaining Transactions"                      | :x:                                          | :x:                                 |
| High CPU utilization                            | "PostgreSQL Server Logs", "PostgreSQL Sessions", "AllMetrics"                                                               | pg_qs.query_capture_mode to TOP or ALL       | metrics.collector_database_activity |
| High IOPS utilization                           | "PostgreSQL Query Store Runtime", "PostgreSQL Server Logs", "PostgreSQL Sessions", "PostgreSQL Query Store Wait Statistics" | pgms_wait_sampling.query_capture_mode to ALL | metrics.collector_database_activity |
| High memory usage                               | "PostgreSQL Server Logs", "PostgreSQL Sessions"                                                                             | pg_qs.query_capture_mode to TOP or ALL       | metrics.collector_database_activity |
| High temporary file usage                       | "PostgreSQL Query Store Runtime", "PostgreSQL Query Store Wait Statistics"                                                  | pg_qs.query_capture_mode to TOP or ALL       | metrics.collector_database_activity |



> [!NOTE]
> When deploying read replicas for persistent heavy write-intensive primary workloads, the replication lag could continue to grow and may never be able to catch-up with the primary. This may also increase storage usage at the primary as the WAL files are not deleted until they are received at the replica.

## Create a read replica

To create a read replica, follow these steps:

1. Select an existing Azure Database for PostgreSQL server to use as the primary server.

2. On the server sidebar, under **Settings**, select **Replication**.

3. Select **Add Replica**.

   :::image type="content" source="./media/how-to-read-replicas-portal/add-replica.png" alt-text="Add a replica":::

4. Enter the Basics form with the following information.

    :::image type="content" source="./media/how-to-read-replicas-portal/basics.png" alt-text="Enter the Basics information":::

   > [!NOTE]
   > To learn more about which regions you can create a replica in, visit the [read replica concepts article](concepts-read-replicas.md).

6. Select **Review + create** to confirm the creation of the replica or **Next: Networking** if you want to add, delete or modify any firewall rules.
    :::image type="content" source="./media/how-to-read-replicas-portal/networking.png" alt-text="Modify firewall rules":::
7. Leave the remaining defaults and then select the **Review + create** button at the bottom of the page or proceed to the next forms to add tags or change data encryption method.
8. Review the information in the final confirmation window. When you're ready, select **Create**.
    :::image type="content" source="./media/how-to-read-replicas-portal/review.png" alt-text="Review the information in the final confirmation window":::

After the read replica is created, it can be viewed from the **Replication** window.

:::image type="content" source="./media/how-to-read-replicas-portal/list-replica.png" alt-text="View the new replica in the Replication window":::

> [!IMPORTANT]
> Review the [considerations section of the Read Replica overview](concepts-read-replicas.md#considerations).
>
> To avoid issues during promotion of replicas always change the following server parameters on the replicas first, before applying them on the primary: max_connections, max_prepared_transactions, max_locks_per_transaction, max_wal_senders, max_worker_processes.

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