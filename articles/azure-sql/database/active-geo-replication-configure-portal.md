---
title: "Tutorial: Geo-replication & failover in portal"
description: Learn how to configure geo-replication for an SQL database using the Azure portal or Azure CLI, and initiate failover.
services: sql-database
ms.service: sql-database
ms.subservice: high-availability
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: tutorial
author: emlisa
ms.author: emlisa
ms.reviewer: mathoma
ms.date: 08/20/2021
---
# Tutorial: Configure active geo-replication and failover (Azure SQL Database)

[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

This article shows you how to configure [active geo-replication for Azure SQL Database](active-geo-replication-overview.md#active-geo-replication-terminology-and-capabilities) using the [Azure portal](https://portal.azure.com) or Azure CLI and to initiate failover.

For best practices using auto-failover groups, see [Best practices for Azure SQL Database](auto-failover-group-overview.md#best-practices-for-sql-database) and [Best practices for Azure SQL Managed Instance](auto-failover-group-overview.md#best-practices-for-sql-managed-instance). 



## Prerequisites

# [Portal](#tab/portal)

To configure active geo-replication by using the Azure portal, you need the following resource:

* A database in Azure SQL Database: The primary database that you want to replicate to a different geographical region.

> [!Note]
> When using Azure portal, you can only create a secondary database within the same subscription as the primary. If a secondary database is required to be in a different subscription, use [Create Database REST API](/rest/api/sql/databases/createorupdate) or [ALTER DATABASE Transact-SQL API](/sql/t-sql/statements/alter-database-transact-sql).

# [Azure CLI](#tab/azure-cli)

To configure active geo-replication, you need a database in Azure SQL Database. It's the primary database that you want to replicate to a different geographical region.

Prepare your environment for the Azure CLI.

[!INCLUDE [azure-cli-prepare-your-environment-no-header](../../../includes/azure-cli-prepare-your-environment-no-header.md)]

---

## Add a secondary database

The following steps create a new secondary database in a geo-replication partnership.  

To add a secondary database, you must be the subscription owner or co-owner.

The secondary database has the same name as the primary database and has, by default, the same service tier and compute size. The secondary database can be a single database or a pooled database. For more information, see [DTU-based purchasing model](service-tiers-dtu.md) and [vCore-based purchasing model](service-tiers-vcore.md).
After the secondary is created and seeded, data begins replicating from the primary database to the new secondary database.

> [!NOTE]
> If the partner database already exists, (for example, as a result of terminating a previous geo-replication relationship) the command fails.

# [Portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), browse to the database that you want to set up for geo-replication.
2. On the SQL Database page, select your database, scroll to **Data management**, select **Replicas**, and then select **Create replica**.

    :::image type="content" source="./media/active-geo-replication-configure-portal/azure-cli-create-geo-replica.png" alt-text="Configure geo-replication":::

3. Select or create the server for the secondary database, and configure the **Compute + storage** options if necessary. You can select any region for your secondary server, but we recommend the [paired region](../../best-practices-availability-paired-regions.md).

    :::image type="content" source="./media/active-geo-replication-configure-portal/azure-portal-create-and-configure-replica.png" alt-text="{alt-text}":::

    Optionally, you can add a secondary database to an elastic pool. To create the secondary database in a pool, select **Yes** next to **Want to use SQL elastic pool?** and select a pool on the target server. A pool must already exist on the target server. This workflow doesn't create a pool.

4. Click **Review + create**, review the information, and then click **Create**.
5. The secondary database is created and the deployment process begins.

    :::image type="content" source="./media/active-geo-replication-configure-portal/azure-portal-geo-replica-deployment.png" alt-text="Screenshot that shows the deployment status of the secondary database.":::

6. When the deployment is complete, the secondary database displays its status.

    :::image type="content" source="./media/active-geo-replication-configure-portal/azure-portal-sql-database-secondary-status.png" alt-text="Screenshot that shows the secondary database status after deployment.":::

7. Return to the primary database page, and then select **Replicas**. Your secondary database is listed under **Geo replicas**.

    :::image type="content" source="./media/active-geo-replication-configure-portal/azure-sql-db-geo-replica-list.png" alt-text="Screenshot that shows the SQL database primary and geo replicas.":::

# [Azure CLI](#tab/azure-cli)

Select the database you want to set up for geo-replication. You'll need the following information:
- Your original Azure SQL database name.
- The Azure SQL server name.
- Your resource group name.
- The name of the server to create the new replica in.

> [!NOTE]
> The secondary database must have the same service tier as the primary.

You can select any region for your secondary server, but we recommend the [paired region](../../best-practices-availability-paired-regions.md).

Run the [az sql db replica create](/cli/azure/sql/db/replica#az_sql_db_replica_create) command.

```azurecli
az sql db replica create --resource-group ContosoHotel --server contosoeast --name guestlist --partner-server contosowest --family Gen5 --capacity 2 --secondary-type Geo
```

Optionally, you can add a secondary database to an elastic pool. To create the secondary database in a pool, use the `--elastic-pool` parameter. A pool must already exist on the target server. This workflow doesn't create a pool.

The secondary database is created and the deployment process begins.

When the deployment is complete, you can check the status of the secondary database by running the [az sql db replica list-links](/cli/azure/sql/db/replica#az_sql_db_replica_list-links) command:
    
```azurecli
az sql db replica list-links --name guestlist --resource-group ContosoHotel --server contosowest
```

---

## Initiate a failover

The secondary database can be switched to become the primary.

# [Portal](#tab/portal)  

1. In the [Azure portal](https://portal.azure.com), browse to the primary database in the geo-replication partnership.
2. Scroll to **Data management**, and then select **Replicas**.
3. In the **Geo replicas** list, select the database you want to become the new primary, select the ellipsis, and then select **Forced failover**.

    :::image type="content" source="./media/active-geo-replication-configure-portal/azure-portal-select-forced-failover.png" alt-text="Screenshot that shows selecting forced failover from the drop-down.":::
4. Select **Yes** to begin the failover.

# [Azure CLI](#tab/azure-cli)

Run the [az sql db replica set-primary](/cli/azure/sql/db/replica#az_sql_db_replica_set-primary) command.

```azurecli
az sql db replica set-primary --name guestlist --resource-group ContosoHotel --server contosowest
```

---

The command immediately switches the secondary database into the primary role. This process normally should complete within 30 seconds or less.

There's a short period during which both databases are unavailable, on the order of 0 to 25 seconds, while the roles are switched. If the primary database has multiple secondary databases, the command automatically reconfigures the other secondaries to connect to the new primary. The entire operation should take less than a minute to complete under normal circumstances.

> [!NOTE]
> This command is designed for quick recovery of the database in case of an outage. It triggers failover without data synchronization, or forced failover.  If the primary is online and committing transactions when the command is issued some data loss may occur.

## Remove secondary database

This operation permanently stops the replication to the secondary database, and changes the role of the secondary to a regular read-write database. If the connectivity to the secondary database is broken, the command succeeds but the secondary doesn't become read-write until after connectivity is restored.

# [Portal](#tab/portal)  

1. In the [Azure portal](https://portal.azure.com), browse to the primary database in the geo-replication partnership.
2. Select **Replicas**.
3. In the **Geo replicas** list, select the database you want to remove from the geo-replication partnership, select the ellipsis, and then select **Stop replication**.

    :::image type="content" source="./media/active-geo-replication-configure-portal/azure-portal-select-stop-replication.png" alt-text="Screenshot that shows selecting stop replication from the drop-down.":::
5. A confirmation window opens. Click **Yes** to remove the database from the geo-replication partnership. (Set it to a read-write database not part of any replication.)
 
# [Azure CLI](#tab/azure-cli)

Run the [az sql db replica delete-link](/cli/azure/sql/db/replica#az_sql_db_replica_delete-link) command.

```azurecli
az sql db replica delete-link --name guestlist --resource-group ContosoHotel --server contosoeast --partner-server contosowest
```

Confirm that you want to perform the operation.

---

## Next steps

* To learn more about active geo-replication, see [active geo-replication](active-geo-replication-overview.md).
* To learn about auto-failover groups, see [Auto-failover groups](auto-failover-group-overview.md)
* For a business continuity overview and scenarios, see [Business continuity overview](business-continuity-high-availability-disaster-recover-hadr-overview.md).