---
title: "Tutorial: Migrate PostgreSQL to Azure Database for PostgreSQL online via the Azure portal"
titleSuffix: Azure Database Migration Service
description: Learn to perform an online migration from PostgreSQL on-premises to Azure Database for PostgreSQL by using Azure Database Migration Service via the Azure portal.
author: apduvuri
ms.author: adityaduvuri
ms.reviewer: craigg
ms.date: 03/31/2023
ms.service: dms
ms.topic: tutorial
ms.custom:
  - seo-lt-2019
  - ignite-2022
---

# Tutorial: Migrate PostgreSQL to Azure Database for PostgreSQL online using DMS (classic) via the Azure portal

You can use Azure Database Migration Service to migrate the databases from an on-premises PostgreSQL instance to [Azure Database for PostgreSQL](../postgresql/index.yml) with minimal downtime to the application. In this tutorial, you migrate the **listdb** sample database from an on-premises instance of PostgreSQL 13.10 to Azure Database for PostgreSQL by using the online migration activity in Azure Database Migration Service.

In this tutorial, you learn how to:
> [!div class="checklist"]
>
> * Migrate the sample schema using the pg_dump utility.
> * Create an instance of Azure Database Migration Service.
> * Create a migration project in Azure Database Migration Service.
> * Run the migration.
> * Monitor the migration.
> * Perform migration cutover.

> [!NOTE]
> Using Azure Database Migration Service to perform an online migration requires creating an instance based on the Premium pricing tier. We encrypt disk to prevent data theft during the process of migration

> [!IMPORTANT]
> For an optimal migration experience, Microsoft recommends creating an instance of Azure Database Migration Service in the same Azure region as the target database. Moving data across regions or geographies can slow down the migration process and introduce errors.

## Prerequisites

To complete this tutorial, you need to:

* Download and install [PostgreSQL community edition](https://www.postgresql.org/download/). The source PostgreSQL Server version must be >= 9.4. For more information, see [Supported PostgreSQL database versions](../postgresql/flexible-server/concepts-supported-versions.md).

    Also note that the target Azure Database for PostgreSQL version must be equal to or later than the on-premises PostgreSQL version. For example, PostgreSQL 12 can migrate to Azure Database for PostgreSQL >= 12 version but not to Azure Database for PostgreSQL 11. 

* [Create an Azure Database for PostgreSQL server](../postgresql/quickstart-create-server-database-portal.md).

* Create a Microsoft Azure Virtual Network for Azure Database Migration Service by using the Azure Resource Manager deployment model, which provides site-to-site connectivity to your on-premises source servers by using either [ExpressRoute](../expressroute/expressroute-introduction.md) or [VPN](../vpn-gateway/vpn-gateway-about-vpngateways.md). For more information about creating a virtual network, see the [Virtual Network Documentation](../virtual-network/index.yml), and especially the quickstart articles with step-by-step details.

    > [!NOTE]
    > During virtual network setup, if you use ExpressRoute with network peering to Microsoft, add the following service [endpoints](../virtual-network/virtual-network-service-endpoints-overview.md) to the subnet in which the service will be provisioned:
    >
    > * Target database endpoint (for example, SQL endpoint, Azure Cosmos DB endpoint, and so on)
    > * Storage endpoint
    > * Service bus endpoint
    >
    > This configuration is necessary because Azure Database Migration Service lacks internet connectivity.

* Ensure that the Network Security Group (NSG) rules for your virtual network don't block the outbound port 443 of ServiceTag for ServiceBus, Storage and AzureMonitor. For more detail on virtual network NSG traffic filtering, see the article [Filter network traffic with network security groups](../virtual-network/virtual-network-vnet-plan-design-arm.md).
* Configure your [Windows Firewall for database engine access](/sql/database-engine/configure-windows/configure-a-windows-firewall-for-database-engine-access).
* Open your Windows firewall to allow Azure Database Migration Service to access the source PostgreSQL Server, which by default is TCP port 5432.
* When using a firewall appliance in front of your source database(s), you may need to add firewall rules to allow the Azure Database Migration Service to access the source database(s) for migration.
* Create a server-level [firewall rule](../postgresql/concepts-firewall-rules.md) for Azure Database for PostgreSQL to allow Azure Database Migration Service to access to the target databases. Provide the subnet range of the virtual network used for Azure Database Migration Service.
* Enable logical replication in the postgresql.config file, and set the following parameters:

  * wal_level = **logical**
  * max_replication_slots = [number of slots], recommend setting to **five slots**
  * max_wal_senders =[number of concurrent tasks] - The max_wal_senders parameter sets the number of concurrent tasks that can run, recommend setting to **10 tasks**

* The user must have the REPLICATION role on the server hosting the source database.

> [!IMPORTANT]
> All tables in your existing database need a primary key to ensure that changes can be synced to the target database.

## Migrate the sample schema

To complete all the database objects like table schemas, indexes and stored procedures, we need to extract schema from the source database and apply to the database.

1. Use pg_dump -s command to create a schema dump file for a database.

    ```
    pg_dump -O -h hostname -U db_username -d db_name -s > your_schema.sql
    ```

    For example, to create a schema dump file for the **listdb** database:

    ```
    pg_dump -O -h localhost -U postgres -d listdb -s -x > listdbSchema.sql
    ```

    For more information about using the pg_dump utility, see the examples in the [pg-dump](https://www.postgresql.org/docs/9.6/static/app-pgdump.html#PG-DUMP-EXAMPLES) tutorial.

2. Create an empty database in your target environment, which is Azure Database for PostgreSQL.

    For details on how to connect and create a database, see the article [Create an Azure Database for PostgreSQL server in the Azure portal](../postgresql/quickstart-create-server-database-portal.md).


3. Import the schema into the target database you created by restoring the schema dump file.

    ```
    psql -h hostname -U db_username -d db_name < your_schema.sql
    ```

    For example:

    ```
    psql -h mypgserver-20170401.postgres.database.azure.com  -U postgres -d migratedb < listdbSchema.sql
    ```

   > [!NOTE]
   > The migration service internally handles the enable/disable of foreign keys and triggers to ensure a reliable and robust data migration. As a result, you do not have to worry about making any modifications to the target database schema.

[!INCLUDE [resource-provider-register](../../includes/database-migration-service-resource-provider-register.md)]

[!INCLUDE [instance-create](../../includes/database-migration-service-instance-create.md)]   


## Create a migration project

After the service is created, locate it within the Azure portal, open it, and then create a new migration project.

1. In the Azure portal, select **All services**, search for Azure Database Migration Service, and then select **Azure Database Migration Services**.
      
      :::image type="content" source="media/tutorial-postgresql-to-azure-postgresql-online-portal/dms-search-classic.png" alt-text="Screenshot of a Search Azure Database Migration Service.":::

2. On the **Azure Database Migration Services** screen, search for the name of Azure Database Migration Service instance that you created, select the instance, and then select + **New Migration Project**.

      :::image type="content" source="media/tutorial-postgresql-to-azure-postgresql-online-portal/dms-instance-search-classic.png" alt-text="Screenshot of a Searching the Azure Database Migration Service instance.":::

3. On the **New migration project** screen, specify a name for the project, in the **Source server type** text box, select **PostgreSQL**, in the **Target server type** text box, select **Azure Database for PostgreSQL**.

4. In the **Migration activity type** section, select **Online data migration**.

      :::image type="content" source="media/tutorial-postgresql-to-azure-postgresql-online-portal/dms-create-project-classic.png" alt-text="Screenshot of a Create a new migration project.":::

    > [!NOTE]
    > Alternately, you can choose **Create project only** to create the migration project now and execute the migration later.

5. Select **Create and run activity**, to successfully use Azure Database Migration Service to migrate data.

## Specify source details

1. On the **Add Source Details** screen, specify the connection details for the source PostgreSQL instance.

    :::image type="content" source="media/tutorial-postgresql-to-azure-postgresql-online-portal/dms-add-source-details-classic.png" alt-text="Screenshot of an Add source details screen.":::

## Specify target details

1. On the **Target details** screen, specify the connection details for the target Azure Database for PostgreSQL - Flexible server, which is the preprovisioned instance to which the schema was deployed by using pg_dump.

    :::image type="content" source="media/tutorial-postgresql-to-azure-postgresql-online-portal/dms-add-target-details-classic.png" alt-text="Screenshot of an Add target details screen.":::

2. Click on **Next:Select databases**, and then on the **Select databases** screen, map the source and the target database for migration.

    If the target database contains the same database name as the source database, Azure Database Migration Service selects the target database by default.

    :::image type="content" source="media/tutorial-postgresql-to-azure-postgresql-online-portal/dms-map-target-databases-classic.png" alt-text="Screenshot of a map databases with the target screen.":::

3. Click on **Next:Select tables**, and then on the **Select tables** screen, select the required tables that need to be migrated.

    :::image type="content" source="media/tutorial-postgresql-to-azure-postgresql-online-portal/dms-select-tables-classic.png" alt-text="Screenshot of a selecting the tables for migration screen.":::
 
4. Click on **Next:Configure migration settings**, and then on the **Configure migration settings** screen, accept the default values.

    :::image type="content" source="media/tutorial-postgresql-to-azure-postgresql-online-portal/dms-migration-settings-classic.png" alt-text="Screenshot of configuring migration setting screen.":::

5. On the **Migration summary** screen, in the **Activity name** text box, specify a name for the migration activity, and then review the summary to ensure that the source and target details match what you previously specified.

    :::image type="content" source="media/tutorial-postgresql-to-azure-postgresql-online-portal/dms-migration-summary-classic.png" alt-text="Screenshot of migration summary screen.":::

## Run the migration

* Select **Start migration**.

    The migration activity window appears, and the **Status** of the activity should update to show as **Backup in Progress**.

## Monitor the migration

1. On the migration activity screen, select **Refresh** to update the display until the **Status** of the migration shows as **Complete**.

     :::image type="content" source="media/tutorial-postgresql-to-azure-postgresql-online-portal/dms-monitor-migration-classic.png" alt-text="Screenshot of migration monitoring screen.":::

2. When the migration is complete, under **Database Name**, select a specific database to get to the migration status for **Full data load** and **Incremental data sync** operations.

   > [!NOTE]
   > **Full data load** shows the initial load migration status, while **Incremental data sync** shows change data capture (CDC) status.

     :::image type="content" source="media/tutorial-postgresql-to-azure-postgresql-online-portal/dms-full-data-load-details-classic.png" alt-text="Screenshot of migration full load details screen.":::

     :::image type="content" source="media/tutorial-postgresql-to-azure-postgresql-online-portal/dms-incremental-data-sync-details-classic.png" alt-text="Screenshot of migration incremental load details screen.":::

## Perform migration cutover

After the initial Full load is completed, the databases are marked **Ready to cutover**.

1. When you're ready to complete the database migration, select **Start Cutover**.

2. Wait until the **Pending changes** counter shows **0** to ensure that all incoming transactions to the source database are stopped, select the **Confirm** checkbox, and then select **Apply**.

    :::image type="content" source="media/tutorial-postgresql-to-azure-postgresql-online-portal/dms-complete-cutover-classic.png" alt-text="Screenshot of cutover completion screen.":::

3. When the database migration status shows **Completed**, [recreate sequences](https://wiki.postgresql.org/wiki/Fixing_Sequences) (if applicable), and connect your applications to the new target instance of Azure Database for PostgreSQL.

## Next steps

* For information about known issues and limitations when performing online migrations to Azure Database for PostgreSQL, see the article [Known issues and workarounds with Azure Database for PostgreSQL online migrations](known-issues-azure-postgresql-online.md).
* For information about the Azure Database Migration Service, see the article [What is the Azure Database Migration Service?](./dms-overview.md).
* For information about Azure Database for PostgreSQL, see the article [What is Azure Database for PostgreSQL?](../postgresql/overview.md).
