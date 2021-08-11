---
title: "Tutorial: Geo-replication & failover in portal"
description: Learn how to configure geo-replication for a SQL database using the Azure portal or Azure CLI and initiate failover.
services: sql-database
ms.service: sql-database
ms.subservice: high-availability
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: tutorial
author: BustosMSFT
ms.author: robustos
ms.reviewer: mathoma
ms.date: 02/13/2019
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

[!INCLUDE [azure-cli-prepare-your-environment-no-header](../../includes/azure-cli-prepare-your-environment-no-header.md)]

---

## Add a secondary database

The following steps create a new secondary database in a geo-replication partnership.  

To add a secondary database, you must be the subscription owner or co-owner.

The secondary database has the same name as the primary database and has, by default, the same service tier and compute size. The secondary database can be a single database or a pooled database. For more information, see [DTU-based purchasing model](service-tiers-dtu.md) and [vCore-based purchasing model](service-tiers-vcore.md).
After the secondary is created and seeded, data begins replicating from the primary database to the new secondary database.

> [!NOTE]
> If the partner database already exists (for example, as a result of terminating a previous geo-replication relationship) the command fails.

# [Portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), browse to the database that you want to set up for geo-replication.
2. On the SQL Database page, select **geo-replication**, and then select the region to create the secondary database. You can select any region other than the region hosting the primary database, but we recommend the [paired region](../../best-practices-availability-paired-regions.md).

    ![Configure geo-replication](./media/active-geo-replication-configure-portal/configure-geo-replication.png)
3. Select or configure the server and pricing tier for the secondary database.

    ![create secondary form](./media/active-geo-replication-configure-portal/create-secondary.png)
4. Optionally, you can add a secondary database to an elastic pool. To create the secondary database in a pool, click **elastic pool** and select a pool on the target server. A pool must already exist on the target server. This workflow does not create a pool.
5. Click **Create** to add the secondary.
6. The secondary database is created and the seeding process begins.

    ![secondaries map](./media/active-geo-replication-configure-portal/seeding0.png)
7. When the seeding process is complete, the secondary database displays its status.

    ![Seeding complete](./media/active-geo-replication-configure-portal/seeding-complete.png)

# [Azure CLI](#tab/azure-cli)

1. Select the database you want to set up for geo-replication. You'll need the following information:
    - Your original Azure SQL database name.
    - The Azure SQL server name.
    - Your resource group name.
    - The region for the secondary database.
    - The name of the server to create the new replica in.

> [!NOTE]
> The secondary database must have the same edition as the primary.

2. For the server region, you can select any region other than the region hosting the primary database, but we recommend the [paired region](../../best-practices-availability-paired-regions.md).
3. Create your secondary database. Optionally, you can add a secondary database to an elastic pool. To create the secondary database in a pool, use the `--elastic-pool` value. A pool must already exist on the target server. This workflow does not create a pool.

    ```azurecli
    az sql db replica create -g mygroup -s myserver -n originalDb --partner-server newDbname --service-objective S2 --secondary-type Geo
    ```

4. The secondary database is created and the seeding process begins.
5. When the seeding process is complete, you can check the status of the secondary database with the following command:
    
    ```azurecli
    az sql db replica list-links -n MyAzureSQLDatabase -g MyResourceGroup -s myserver
    ```

---

## Initiate a failover

The secondary database can be switched to become the primary.

# [Portal](#tab/portal)  

1. In the [Azure portal](https://portal.azure.com), browse to the primary database in the geo-replication partnership.
2. On the SQL Database blade, select **All settings** > **geo-replication**.
3. In the **SECONDARIES** list, select the database you want to become the new primary and click **Forced Failover**.

    ![failover](./media/active-geo-replication-configure-portal/secondaries.png)
4. Click **Yes** to begin the failover.

# [Azure CLI](#tab/azure-cli)

You'll need the name of the database that you want to fail over.

```azurecli
az sql db replica set-primary -n MyDatabase -g MyResourceGroup -s myserver
```

---

The command immediately switches the secondary database into the primary role. This process normally should complete within 30 sec or less.

There is a short period during which both databases are unavailable (on the order of 0 to 25 seconds) while the roles are switched. If the primary database has multiple secondary databases, the command automatically reconfigures the other secondaries to connect to the new primary. The entire operation should take less than a minute to complete under normal circumstances.

> [!NOTE]
> This command is designed for quick recovery of the database in case of an outage. It triggers failover without data synchronization (forced failover).  If the primary is online and committing transactions when the command is issued some data loss may occur.

## Remove secondary database

This operation permanently terminates the replication to the secondary database, and changes the role of the secondary to a regular read-write database. If the connectivity to the secondary database is broken, the command succeeds but the secondary does not become read-write until after connectivity is restored.

# [Portal](#tab/portal)  

1. In the [Azure portal](https://portal.azure.com), browse to the primary database in the geo-replication partnership.
2. On the SQL database page, select **geo-replication**.
3. In the **SECONDARIES** list, select the database you want to remove from the geo-replication partnership.
4. Click **Stop Replication**.

    ![Remove secondary](./media/active-geo-replication-configure-portal/remove-secondary.png)
5. A confirmation window opens. Click **Yes** to remove the database from the geo-replication partnership. (Set it to a read-write database not part of any replication.)
 
# [Azure CLI](#tab/azure-cli)

```azurecli
az sql db replica delete-link --partner-server myreplicadb
```

---

## Next steps

* To learn more about active geo-replication, see [active geo-replication](active-geo-replication-overview.md).
* To learn about auto-failover groups, see [Auto-failover groups](auto-failover-group-overview.md)
* For a business continuity overview and scenarios, see [Business continuity overview](business-continuity-high-availability-disaster-recover-hadr-overview.md).