---
title: Manage read replicas - Azure portal - Azure Database for MariaDB
description: This article describes how to set up and manage read replicas in Azure Database for MariaDB using the portal
author: ajlam
ms.author: andrela
ms.service: mariadb
ms.topic: conceptual
ms.date: 6/10/2020
---

# How to create and manage read replicas in Azure Database for MariaDB using the Azure portal

In this article, you will learn how to create and manage read replicas in the Azure Database for MariaDB service using the Azure portal.

## Prerequisites

- An [Azure Database for MariaDB server](quickstart-create-mariadb-server-database-using-azure-portal.md) that will be used as the master server.

> [!IMPORTANT]
> The read replica feature is only available for Azure Database for MariaDB servers in the General Purpose or Memory Optimized pricing tiers. Ensure the master server is in one of these pricing tiers.

## Create a read replica

> [!IMPORTANT]
> When you create a replica for a master that has no existing replicas, the master will first restart to prepare itself for replication. Take this into consideration and perform these operations during an off-peak period.

A read replica server can be created using the following steps:

1. Sign into the [Azure portal](https://portal.azure.com/).

2. Select the existing Azure Database for MariaDB server that you want to use as a master. This action opens the **Overview** page.

3. Select **Replication** from the menu, under **SETTINGS**.

4. Select **Add Replica**.

   ![Azure Database for MariaDB - Replication](./media/howto-read-replica-portal/add-replica.png)

5. Enter a name for the replica server.

    ![Azure Database for MariaDB - Replica name](./media/howto-read-replica-portal/replica-name.png)

6. Select the location for the replica server. The default location is the same as the master server's.

    ![Azure Database for MariaDB - Replica location](./media/howto-read-replica-portal/replica-location.png)

7. Select **OK** to confirm creation of the replica.

> [!NOTE]
> Read replicas are created with the same server configuration as the master. The replica server configuration can be changed after it has been created. It is recommended that the replica server's configuration should be kept at equal or greater values than the master to ensure the replica is able to keep up with the master.

Once the replica server has been created, it can be viewed from the **Replication** blade.

   ![Azure Database for MariaDB - List replicas](./media/howto-read-replica-portal/list-replica.png)

## Stop replication to a replica server

> [!IMPORTANT]
> Stopping replication to a server is irreversible. Once replication has stopped between a master and replica, it cannot be undone. The replica server then becomes a standalone server and now supports both read and writes. This server cannot be made into a replica again.

To stop replication between a master and a replica server from the Azure portal, use the following steps:

1. In the Azure portal, select your master Azure Database for MariaDB server. 

2. Select **Replication** from the menu, under **SETTINGS**.

3. Select the replica server you wish to stop replication for.

   ![Azure Database for MariaDB - Stop replication select server](./media/howto-read-replica-portal/stop-replication-select.png)

4. Select **Stop replication**.

   ![Azure Database for MariaDB - Stop replication](./media/howto-read-replica-portal/stop-replication.png)

5. Confirm you want to stop replication by clicking **OK**.

   ![Azure Database for MariaDB - Stop replication confirm](./media/howto-read-replica-portal/stop-replication-confirm.png)

## Delete a replica server

To delete a read replica server from the Azure portal, use the following steps:

1. In the Azure portal, select your master Azure Database for MariaDB server.

2. Select **Replication** from the menu, under **SETTINGS**.

3. Select the replica server you wish to delete.

   ![Azure Database for MariaDB - Delete replica select server](./media/howto-read-replica-portal/delete-replica-select.png)

4. Select **Delete replica**

   ![Azure Database for MariaDB - Delete replica](./media/howto-read-replica-portal/delete-replica.png)

5. Type the name of the replica and click **Delete** to confirm deletion of the replica.  

   ![Azure Database for MariaDB - Delete replica confirm](./media/howto-read-replica-portal/delete-replica-confirm.png)

## Delete a master server

> [!IMPORTANT]
> Deleting a master server stops replication to all replica servers and deletes the master server itself. Replica servers become standalone servers that now support both read and writes.

To delete a master server from the Azure portal, use the following steps:

1. In the Azure portal, select your master Azure Database for MariaDB server.

2. From the **Overview**, select **Delete**.

   ![Azure Database for MariaDB - Delete master](./media/howto-read-replica-portal/delete-master-overview.png)

3. Type the name of the master server and click **Delete** to confirm deletion of the master server.  

   ![Azure Database for MariaDB - Delete master](./media/howto-read-replica-portal/delete-master-confirm.png)

## Monitor replication

1. In the [Azure portal](https://portal.azure.com/), select the replica Azure Database for MariaDB server you want to monitor.

2. Under the **Monitoring** section of the sidebar, select **Metrics**:

3. Select **Replication lag in seconds** from the dropdown list of available metrics.

   ![Select Replication lag](./media/howto-read-replica-portal/monitor-select-replication-lag.png)

4. Select the time range you wish to view. The image below selects a 30 minute time range.

   ![Select time range](./media/howto-read-replica-portal/monitor-replication-lag-time-range.png)

5. View the replication lag for the selected time range. The image below displays the last 30 minutes for a large workload.

   ![Select time range](./media/howto-read-replica-portal/monitor-replication-lag-time-range-thirty-mins.png)

## Next steps

- Learn more about [read replicas](concepts-read-replicas.md)