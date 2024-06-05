---
title: Manage read replicas - Azure portal - Azure Database for MySQL
description: Learn how to set up and manage read replicas in Azure Database for MySQL using the Azure portal.
ms.service: mysql
ms.subservice: single-server
author: SudheeshGH
ms.author: sunaray
ms.topic: how-to
ms.date: 06/20/2022
---

# How to create and manage read replicas in Azure Database for MySQL using the Azure portal

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

In this article, you will learn how to create and manage read replicas in the Azure Database for MySQL service using the Azure portal.

## Prerequisites

- An [Azure Database for MySQL server](quickstart-create-mysql-server-database-using-azure-portal.md) that will be used as the source server.

> [!IMPORTANT]
> The read replica feature is only available for Azure Database for MySQL servers in the General Purpose or Memory Optimized pricing tiers. Ensure the source server is in one of these pricing tiers.

## Create a read replica

> [!IMPORTANT]
>  If your source server has no existing replica servers, source server might need a restart to prepare itself for replication depending upon the storage used (v1/v2). Please consider server restart and perform this operation during off-peak hours. See [Source Server restart](./concepts-read-replicas.md#source-server-restart) for more details. 
>
>If GTID is enabled on a primary server (`gtid_mode` = ON), newly created replicas will also have GTID enabled and use GTID based replication. To learn more refer to [Global transaction identifier (GTID)](concepts-read-replicas.md#global-transaction-identifier-gtid)

A read replica server can be created using the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Select the existing Azure Database for MySQL server that you want to use as a master. This action opens the **Overview** page.

3. Select **Replication** from the menu, under **SETTINGS**.

4. Select **Add Replica**.

   :::image type="content" source="./media/how-to-read-replica-portal/add-replica-1.png" alt-text="Azure Database for MySQL - Replication":::

5. Enter a name for the replica server.

    :::image type="content" source="./media/how-to-read-replica-portal/replica-name.png" alt-text="Azure Database for MySQL - Replica name":::

6. Select the location for the replica server. The default location is the same as the source server's.

    :::image type="content" source="./media/how-to-read-replica-portal/replica-location.png" alt-text="Azure Database for MySQL - Replica location":::

   > [!NOTE]
   > To learn more about which regions you can create a replica in, visit the [read replica concepts article](concepts-read-replicas.md). 

7. Select **OK** to confirm creation of the replica.

> [!NOTE]
> Read replicas are created with the same server configuration as the master. The replica server configuration can be changed after it has been created. The replica server is always created in the same resource group and same subscription as the source server. If you want to create a replica server to a different resource group or different subscription, you can [move the replica server](../../azure-resource-manager/management/move-resource-group-and-subscription.md) after creation. It is recommended that the replica server's configuration should be kept at equal or greater values than the source to ensure the replica is able to keep up with the master.

Once the replica server has been created, it can be viewed from the **Replication** blade.

   :::image type="content" source="./media/how-to-read-replica-portal/list-replica.png" alt-text="Azure Database for MySQL - List replicas":::

## Stop replication to a replica server

> [!IMPORTANT]
> Stopping replication to a server is irreversible. Once replication has stopped between a source and replica, it cannot be undone. The replica server then becomes a standalone server and now supports both read and writes. This server cannot be made into a replica again.

To stop replication between a source and a replica server from the Azure portal, use the following steps:

1. In the Azure portal, select your source Azure Database for MySQL server. 

2. Select **Replication** from the menu, under **SETTINGS**.

3. Select the replica server you wish to stop replication for.

   :::image type="content" source="./media/how-to-read-replica-portal/stop-replication-select.png" alt-text="Azure Database for MySQL - Stop replication select server":::

4. Select **Stop replication**.

   :::image type="content" source="./media/how-to-read-replica-portal/stop-replication.png" alt-text="Azure Database for MySQL - Stop replication":::

5. Confirm you want to stop replication by clicking **OK**.

   :::image type="content" source="./media/how-to-read-replica-portal/stop-replication-confirm.png" alt-text="Azure Database for MySQL - Stop replication confirm":::

## Delete a replica server

To delete a read replica server from the Azure portal, use the following steps:

1. In the Azure portal, select your source Azure Database for MySQL server.

2. Select **Replication** from the menu, under **SETTINGS**.

3. Select the replica server you wish to delete.

   :::image type="content" source="./media/how-to-read-replica-portal/delete-replica-select.png" alt-text="Azure Database for MySQL - Delete replica select server":::

4. Select **Delete replica**

   :::image type="content" source="./media/how-to-read-replica-portal/delete-replica.png" alt-text="Azure Database for MySQL - Delete replica":::

5. Type the name of the replica and click **Delete** to confirm deletion of the replica.  

   :::image type="content" source="./media/how-to-read-replica-portal/delete-replica-confirm.png" alt-text="Azure Database for MySQL - Delete replica confirm":::

## Delete a source server

> [!IMPORTANT]
> Deleting a source server stops replication to all replica servers and deletes the source server itself. Replica servers become standalone servers that now support both read and writes.

To delete a source server from the Azure portal, use the following steps:

1. In the Azure portal, select your source Azure Database for MySQL server.

2. From the **Overview**, select **Delete**.

   :::image type="content" source="./media/how-to-read-replica-portal/delete-master-overview.png" alt-text="Azure Database for MySQL - Delete master":::

3. Type the name of the source server and click **Delete** to confirm deletion of the source server.  

   :::image type="content" source="./media/how-to-read-replica-portal/delete-master-confirm.png" alt-text="Azure Database for MySQL - Delete master confirm":::

## Monitor replication

1. In the [Azure portal](https://portal.azure.com), select the replica Azure Database for MySQL server you want to monitor.

2. Under the **Monitoring** section of the sidebar, select **Metrics**:

3. Select **Replication lag in seconds** from the dropdown list of available metrics.

   :::image type="content" source="./media/how-to-read-replica-portal/monitor-select-replication-lag-1.png" alt-text="Select Replication lag":::

4. Select the time range you wish to view. The image below selects a 30 minute time range.

   :::image type="content" source="./media/how-to-read-replica-portal/monitor-replication-lag-time-range-1.png" alt-text="Select time range":::

5. View the replication lag for the selected time range. The image below displays the last 30 minutes.

   :::image type="content" source="./media/how-to-read-replica-portal/monitor-replication-lag-time-range-thirty-mins-1.png" alt-text="Select time range 30 minutes":::

## Next steps

- Learn more about [read replicas](concepts-read-replicas.md)
