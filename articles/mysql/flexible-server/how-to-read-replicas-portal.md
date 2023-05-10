---
title: Manage read replicas - Azure portal - Azure Database for MySQL - Flexible Server
description: Learn how to set up and manage read replicas in Azure Database for MySQL - Flexible Server using the Azure portal.
ms.service: mysql
ms.subservice: flexible-server
ms.topic: how-to
author: VandhanaMehta
ms.author: vamehta
ms.date: 06/17/2021
---

# How to create and manage read replicas in Azure Database for MySQL - Flexible Server using the Azure portal

[[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

In this article, you will learn how to create and manage read replicas in the Azure Database for MySQL - Flexible Server using the Azure portal.

> [!Note]
> 
> * If GTID is enabled on a primary server (`gtid_mode` = ON), newly created replicas will also have GTID enabled and use GTID based replication. To learn more refer to [Global transaction identifier (GTID)](concepts-read-replicas.md#global-transaction-identifier-gtid)

## Prerequisites

- An [Azure Database for MySQL server Flexible Server](quickstart-create-server-portal.md) that will be used as the source server.

## Create a read replica

> [!IMPORTANT]
>When you create a replica for a source that has no existing replicas, the source will first restart to prepare itself for replication. Take this into consideration and perform these operations during an off-peak period.

A read replica server can be created using the following steps:

1. Sign into the [Azure portal](https://portal.azure.com/).

2. Select the existing Azure Database for MySQL - Flexible Server that you want to use as a source. This action opens the **Overview** page.

3. Select **Replication** from the menu, under **SETTINGS**.

4. Select **Add Replica**.

   :::image type="content" source="./media/how-to-read-replica-portal/add-replica.png" alt-text="Azure Database for MySQL - Replication":::

5. Enter a name for the replica server. If your region support Availability Zones, you can select Availability zone of your choice.

    :::image type="content" source="./media/how-to-read-replica-portal/replica-name.png" alt-text="Azure Database for MySQL - Replica name":::

6. Select **OK** to confirm creation of the replica.

> [!NOTE]
> Read replicas are created with the same server configuration as the source. The replica server configuration can be changed after it has been created. The replica server is always created in the same resource group, same location and same subscription as the source server. If you want to create a replica server to a different resource group or different subscription, you can [move the replica server](../../azure-resource-manager/management/move-resource-group-and-subscription.md) after creation. It is recommended that the replica server's configuration should be kept at equal or greater values than the source to ensure the replica is able to keep up with the source.

Once the replica server has been created, it can be viewed from the **Replication** blade.

   [:::image type="content" source="./media/how-to-read-replica-portal/list-replica.png" alt-text="Azure Database for MySQL - List replicas":::](./media/how-to-read-replica-portal/list-replica.png#lightbox)

## Stop replication to a replica server

> [!IMPORTANT]
>Stopping replication to a server is irreversible. Once replication has stopped between a source and replica, it cannot be undone. The replica server then becomes a standalone server and now supports both read and writes. This server cannot be made into a replica again.

To stop replication between a source and a replica server from the Azure portal, use the following steps:

1. In the Azure portal, select your source Azure Database for MySQL - Flexible Server.

2. Select **Replication** from the menu, under **SETTINGS**.

3. Select the replica server you wish to stop replication for.

   [:::image type="content" source="./media/how-to-read-replica-portal/stop-replication-select.png" alt-text="Azure Database for MySQL - Stop replication select server":::](./media/how-to-read-replica-portal/stop-replication-select.png#lightbox)

4. Select **Stop replication**.

   [:::image type="content" source="./media/how-to-read-replica-portal/stop-replication.png" alt-text="Azure Database for MySQL - Stop replication":::](./media/how-to-read-replica-portal/stop-replication.png#lightbox)

5. Confirm you want to stop replication by clicking **OK**.

   [:::image type="content" source="./media/how-to-read-replica-portal/stop-replication-confirm.png" alt-text="Azure Database for MySQL - Stop replication confirm":::](./media/how-to-read-replica-portal/stop-replication-confirm.png#lightbox)

## Delete a replica server

To delete a read replica server from the Azure portal, use the following steps:

1. In the Azure portal, select your source Azure Database for MySQL - Flexible Server.

2. Select **Replication** from the menu, under **SETTINGS**.

3. Select the replica server you wish to delete.

   [:::image type="content" source="./media/how-to-read-replica-portal/delete-replica-select.png" alt-text="Azure Database for MySQL - Delete replica select server":::](./media/how-to-read-replica-portal/delete-replica-select.png#lightbox)

4. Select **Delete replica**

   :::image type="content" source="./media/how-to-read-replica-portal/delete-replica.png" alt-text="Azure Database for MySQL - Delete replica":::

5. Type the name of the replica and click **Delete** to confirm deletion of the replica.

   :::image type="content" source="./media/how-to-read-replica-portal/delete-replica-confirm.png" alt-text="Azure Database for MySQL - Delete replica confirm":::

## Delete a source server

> [!IMPORTANT]
>Deleting a source server stops replication to all replica servers and deletes the source server itself. Replica servers become standalone servers that now support both read and writes.

To delete a source server from the Azure portal, use the following steps:

1. In the Azure portal, select your source Azure Database for MySQL - Flexible Server.

2. From the **Overview**, select **Delete**.

   [:::image type="content" source="./media/how-to-read-replica-portal/delete-master-overview.png" alt-text="Azure Database for MySQL - Delete source":::](./media/how-to-read-replica-portal/delete-master-overview.png#lightbox)

3. Type the name of the source server and click **Delete** to confirm deletion of the source server.

   :::image type="content" source="./media/how-to-read-replica-portal/delete-master-confirm.png" alt-text="Azure Database for MySQL - Delete source confirm":::

## Monitor replication

1. In the [Azure portal](https://portal.azure.com/), select the replica Azure Database for MySQL - Flexible Server you want to monitor.

2. Under the **Monitoring** section of the sidebar, select **Metrics**:

3. Select **Replication lag in seconds** from the dropdown list of available metrics.

   [:::image type="content" source="./media/how-to-read-replica-portal/monitor-select-replication-lag.png" alt-text="Select Replication lag":::](./media/how-to-read-replica-portal/monitor-select-replication-lag.png#lightbox)

4. Select the time range you wish to view. The image below selects a 30 minute time range.

   [:::image type="content" source="./media/how-to-read-replica-portal/monitor-replication-lag-time-range.png" alt-text="Select time range":::](./media/how-to-read-replica-portal/monitor-replication-lag-time-range.png#lightbox)

5. View the replication lag for the selected time range. The image below displays the last 30 minutes.

   [:::image type="content" source="./media/how-to-read-replica-portal/monitor-replication-lag-time-range-thirty-mins.png" alt-text="Select time range 30 minutes":::](./media/how-to-read-replica-portal/monitor-replication-lag-time-range-thirty-mins.png#lightbox)

## Next steps

- Learn more about [read replicas](concepts-read-replicas.md)
- You can also monitor the replication latency by following the steps mentioned [here](../single-server/how-to-troubleshoot-replication-latency.md#monitoring-replication-latency).
- To troubleshoot high replication latency observed in Metrics, visit the [link](../single-server/how-to-troubleshoot-replication-latency.md#common-scenarios-for-high-replication-latency).