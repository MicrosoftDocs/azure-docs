---
title: "Tutorial: Migrate RDS PostgreSQL online to Azure Database for PostgreSQL"
titleSuffix: Azure Database Migration Service
description: Learn to perform an online migration from RDS PostgreSQL to Azure Database for PostgreSQL by using the Azure Database Migration Service.
services: dms
author: HJToland3
ms.author: jtoland
manager: craigg
ms.reviewer: craigg
ms.service: dms
ms.workload: data-services
ms.custom: "seo-lt-2019"
ms.topic: article
ms.date: 04/11/2020
---

# Tutorial: Migrate RDS PostgreSQL to Azure DB for PostgreSQL online using DMS

You can use Azure Database Migration Service to migrate databases from an RDS PostgreSQL instance to [Azure Database for PostgreSQL](https://docs.microsoft.com/azure/postgresql/) while the source database remains online during migration. In other words, migration can be achieved with minimal downtime to the application. In this tutorial, you migrate the **DVD Rental** sample database from an instance of RDS PostgreSQL 9.6 to Azure Database for PostgreSQL by using the online migration activity in Azure Database Migration Service.

In this tutorial, you learn how to:
> [!div class="checklist"]
>
> * Migrate the sample schema by using the pg_dump utility.
> * Create an instance of Azure Database Migration Service.
> * Create a migration project by using Azure Database Migration Service.
> * Run the migration.
> * Monitor the migration.
> * Perform migration cutover.

> [!NOTE]
> Using the Azure Database Migration Service to perform an online migration requires creating an instance based on the Premium pricing tier. For more information, see the Azure Database Migration Service [pricing](https://azure.microsoft.com/pricing/details/database-migration/) page. We encrypt disk to prevent data theft during the process of migration.

> [!IMPORTANT]
> For an optimal migration experience, Microsoft recommends creating an instance of the Azure Database Migration Service in the same Azure region as the target database. Moving data across regions or geographies can slow down the migration process and introduce errors.

[!INCLUDE [online-offline](../../includes/database-migration-service-offline-online.md)]

This article describes how to perform an online migration from an on-premises instance of PostgreSQL to Azure Database for PostgreSQL.

## Prerequisites

To complete this tutorial, you need to:

* Download and install [PostgreSQL community edition](https://www.postgresql.org/download/) 9.5, 9.6, or 10. The source PostgreSQL Server version must be 9.5.11, 9.6.7, 10, or later. For more information, see the article [Supported PostgreSQL Database Versions](https://docs.microsoft.com/azure/postgresql/concepts-supported-versions).

   Also note that the target Azure Database for PostgreSQL version must be equal to or later than the RDS PostgreSQL version. For example, RDS PostgreSQL 9.6 can only migrate to Azure Database for PostgreSQL 9.6, 10, or 11, but not to Azure Database for PostgreSQL 9.5.

* Create an instance of [Azure Database for PostgreSQL](https://docs.microsoft.com/azure/postgresql/quickstart-create-server-database-portal) or [Azure Database for PostgreSQL - Hyperscale (Citus)](https://docs.microsoft.com/azure/postgresql/quickstart-create-hyperscale-portal). Refer to this [section](https://docs.microsoft.com/azure/postgresql/quickstart-create-server-database-portal#connect-to-the-postgresql-server-using-pgadmin) of the document for detail on how to connect to the PostgreSQL Server using pgAdmin.
* Create a Microsoft Azure Virtual Network for Azure Database Migration Service by using the Azure Resource Manager deployment model, which provides site-to-site connectivity to your on-premises source servers by using either [ExpressRoute](https://docs.microsoft.com/azure/expressroute/expressroute-introduction) or [VPN](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways). For more information about creating a virtual network, see the [Virtual Network Documentation](https://docs.microsoft.com/azure/virtual-network/), and especially the quickstart articles with step-by-step details.
* Ensure that your virtual network Network Security Group rules don't block the following inbound communication ports to Azure Database Migration Service: 443, 53, 9354, 445, and 12000. For more detail on virtual network NSG traffic filtering, see the article [Filter network traffic with network security groups](https://docs.microsoft.com/azure/virtual-network/virtual-networks-nsg).
* Configure your [Windows Firewall for database engine access](https://docs.microsoft.com/sql/database-engine/configure-windows/configure-a-windows-firewall-for-database-engine-access).
* Open your Windows firewall to allow Azure Database Migration Service to access the source PostgreSQL server, which by default is TCP port 5432.
* When using a firewall appliance in front of your source database(s), you may need to add firewall rules to allow the Azure Database Migration Service to access the source database(s) for migration.
* Create a server-level [firewall rule](https://docs.microsoft.com/azure/sql-database/sql-database-firewall-configure) for the Azure Database for PostgreSQL server to allow Azure Database Migration Service access to the target databases. Provide the subnet range of the virtual network used for Azure Database Migration Service.

### Set up AWS RDS PostgreSQL for replication

1. To create a new parameter group, follow the instructions provided by AWS in the article [Working with DB Parameter Groups](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithParamGroups.html).
2. Use the master user name to connect to the source from Azure Database Migration Service. If you use an account other than the master user account, the account must have the rds_superuser role and the rds_replication role. The rds_replication role grants permissions to manage logical slots and to stream data using logical slots.
3. Create a new parameter group with the following configuration:

    a. Set the rds.logical_replication parameter in your DB parameter group to 1.

    b. max_wal_senders =[number of concurrent tasks] - The max_wal_senders parameter sets the number of concurrent tasks that can run, recommend 10 tasks.

    c. max_replication_slots – = [number of slots], recommend set to five slots.

4. Associate the parameter group you created to the RDS PostgreSQL instance.

## Migrate the schema

1. Extract the schema from the source database and apply to the target database to complete migration of all database objects such as table schemas, indexes, and stored procedures.

    The easiest way to migrate only the schema is to use pg_dump with the -s option. For more information, see the [examples](https://www.postgresql.org/docs/9.6/app-pgdump.html#PG-DUMP-EXAMPLES) in the Postgres pg_dump tutorial.

    ```
    pg_dump -o -h hostname -U db_username -d db_name -s > your_schema.sql
    ```

    For example, to dump a schema file for the **dvdrental** database, use the following command:

    ```
    pg_dump -o -h localhost -U postgres -d dvdrental -s  > dvdrentalSchema.sql
    ```

2. Create an empty database in the target service, which is Azure Database for PostgreSQL. To connect and create a database, refer to one of the following articles:

    * [Create an Azure Database for PostgreSQL server by using the Azure portal](https://docs.microsoft.com/azure/postgresql/quickstart-create-server-database-portal)
    * [Create an Azure Database for PostgreSQL - Hyperscale (Citus) server using the Azure portal](https://docs.microsoft.com/azure/postgresql/quickstart-create-hyperscale-portal)

3. Import the schema to target service, which is Azure Database for PostgreSQL. To restore the schema dump file, run the following command:

    ```
    psql -h hostname -U db_username -d db_name < your_schema.sql
    ```

    For example:

    ```
    psql -h mypgserver-20170401.postgres.database.azure.com  -U postgres -d dvdrental < dvdrentalSchema.sql
    ```

4. If you have foreign keys in your schema, the initial load and continuous sync of the migration will fail. To extract the drop foreign key script and add foreign key script at the destination (Azure Database for PostgreSQL), run the following script in PgAdmin or in psql:
  
    ```
    SELECT Queries.tablename
           ,concat('alter table ', Queries.tablename, ' ', STRING_AGG(concat('DROP CONSTRAINT ', Queries.foreignkey), ',')) as DropQuery
                ,concat('alter table ', Queries.tablename, ' ',
                                                STRING_AGG(concat('ADD CONSTRAINT ', Queries.foreignkey, ' FOREIGN KEY (', column_name, ')', 'REFERENCES ', foreign_table_name, '(', foreign_column_name, ')' ), ',')) as AddQuery
        FROM
        (SELECT
        tc.table_schema,
        tc.constraint_name as foreignkey,
        tc.table_name as tableName,
        kcu.column_name,
        ccu.table_schema AS foreign_table_schema,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
    FROM
        information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
    WHERE constraint_type = 'FOREIGN KEY') Queries
      GROUP BY Queries.tablename;
    ```

5. Run the drop foreign key (which is the second column) in the query result to drop the foreign key.

6. If you have triggers (insert or update trigger) in the data, it will enforce data integrity in the target before replicating data from the source. The recommendation is to disable triggers in all the tables *at the target* during migration, and then enable the triggers after migration is complete.

    To disable triggers in target database:

    ```
    SELECT Concat('DROP TRIGGER ', Trigger_Name, ';') FROM  information_schema.TRIGGERS WHERE TRIGGER_SCHEMA = 'your_schema';
    ```

## Register the Microsoft.DataMigration resource provider

1. Sign in to the Azure portal, select **All services**, and then select **Subscriptions**.

   ![Show portal subscriptions](media/tutorial-rds-postgresql-server-azure-db-for-postgresql-online/portal-select-subscription1.png)

2. Select the subscription in which you want to create the instance of Azure Database Migration Service, and then select **Resource providers**.

    ![Show resource providers](media/tutorial-rds-postgresql-server-azure-db-for-postgresql-online/portal-select-resource-provider.png)

3. Search for migration, and then to the right of **Microsoft.DataMigration**, select **Register**.

    ![Register resource provider](media/tutorial-rds-postgresql-server-azure-db-for-postgresql-online/portal-register-resource-provider.png)

## Create an instance of Azure Database Migration Service

1. In the Azure portal, select + **Create a resource**, search for Azure Database Migration Service, and then select **Azure Database Migration Service** from the drop-down list.

    ![Azure Marketplace](media/tutorial-rds-postgresql-server-azure-db-for-postgresql-online/portal-marketplace.png)

2. On the **Azure Database Migration Service** screen, select **Create**.

    ![Create Azure Database Migration Service instance](media/tutorial-rds-sql-to-azure-sql-and-managed-instance/dms-create1.png)
  
3. On the **Create Migration Service** screen, specify a name for the service, the subscription, and a new or existing resource group.

4. Select the location in which you want to create the instance of Azure Database Migration Service.

5. Select an existing virtual network or create a new one.

    The virtual network provides Azure Database Migration Service with access to the source PostgreSQL instance and the target Azure Database for PostgreSQL instance.

    For more information about how to create a virtual network in the Azure portal, see the article [Create a virtual network using the Azure portal](https://aka.ms/DMSVnet).

6. Select a pricing tier; for this online migration, be sure to select the Premium: 4vCores pricing tier.

    ![Configure Azure Database Migration Service instance settings](media/tutorial-rds-postgresql-server-azure-db-for-postgresql-online/dms-settings5.png)

7. Select **Create** to create the service.

## Create a migration project

After the service is created, locate it within the Azure portal, open it, and then create a new migration project.

1. In the Azure portal, select **All services**, search for Azure Database Migration Service, and then select **Azure Database Migration Services**.

      ![Locate all instances of the Azure Database Migration Service](media/tutorial-rds-postgresql-server-azure-db-for-postgresql-online/dms-search.png)

2. On the **Azure Database Migration Services** screen, search for the name of the Azure Database Migration Service instance that you created, select the instance, and then select + **New Migration Project**.
3. On the **New migration project** screen, specify a name for the project, in the **Source server type** text box, select **AWS RDS for PostgreSQL**, and then in the **Target server type** text box, select **Azure Database for PostgreSQL**.
4. In the **Choose type of activity** section, select **Online data migration**.

    > [!IMPORTANT]
    > Be sure to select **Online data migration**; offline migrations are not supported for this scenario.

    ![Create Database Migration Service Project](media/tutorial-rds-postgresql-server-azure-db-for-postgresql-online/dms-create-project5.png)

    > [!NOTE]
    > Alternately, you can choose **Create project only** to create the migration project now and execute the migration later.

5. Select **Save**.

6. Select **Create and run activity** to create the project and run the migration activity.

    > [!NOTE]
    > Please make a note of the pre-requisites needed to set up online migration in the project creation blade.

## Specify source details

* On the **Add Source Details** screen, specify the connection details for the source PostgreSQL instance.

   ![Source Details](media/tutorial-rds-postgresql-server-azure-db-for-postgresql-online/dms-source-details5.png)

## Specify target details

1. Select **Save**, and then on the **Target details** screen, specify the connection details for the target Azure Database for PostgreSQL server, which is pre-provisioned and has the **DVD Rentals** schema deployed using pg_dump.

    ![Target details](media/tutorial-rds-postgresql-server-azure-db-for-postgresql-online/dms-target-details.png)

2. Select **Save**, and then on the **Map to target databases** screen, map the source and the target database for migration.

    If the target database contains the same database name as the source database, Azure Database Migration Service selects the target database by default.

    ![Map to target databases](media/tutorial-rds-postgresql-server-azure-db-for-postgresql-online/dms-map-target-databases.png)

3. Select **Save**, on the **Migration summary** screen, in the **Activity name** text box, specify a name for the migration activity, and then review the summary to ensure that the source and target details match what you previously specified.

    ![Migration Summary](media/tutorial-rds-postgresql-server-azure-db-for-postgresql-online/dms-migration-summary1.png)

## Run the migration

* Select **Run migration**.

    The migration activity window appears, and the **Status** of the activity is **Initializing**.

## Monitor the migration

1. On the migration activity screen, select **Refresh** to update the display until the **Status** of the migration shows as **Running**.

    ![Activity Status - running](media/tutorial-rds-postgresql-server-azure-db-for-postgresql-online/dms-activity-status3.png)

2. Under **DATABASE NAME**, select a specific database to get to the migration status for **Full data load** and **Incremental data sync** operations.

    **Full data load** shows the initial load migration status, while **Incremental data sync** shows change data capture (CDC) status.

    ![Inventory screen - full data load](media/tutorial-rds-postgresql-server-azure-db-for-postgresql-online/dms-inventory-full-load.png)

    ![Inventory screen - incremental data sync](media/tutorial-rds-postgresql-server-azure-db-for-postgresql-online/dms-inventory-incremental.png)

## Perform migration cutover

After the initial Full load is completed, the databases are marked **Ready to Cutover**.

1. When you're ready to complete the database migration, select **Start Cutover**.

2. Wait until the **Pending changes** counter shows **0** to ensure that all incoming transactions to the source database are stopped, select the **Confirm** checkbox, and then select **Apply**.

    ![Complete cutover screen](media/tutorial-rds-postgresql-server-azure-db-for-postgresql-online/dms-complete-cutover.png)

3. When the database migration status shows **Completed**, connect your applications to the new target Azure Database for PostgreSQL database.

Your online migration of an on-premises instance of RDS PostgreSQL to Azure Database for PostgreSQL is now complete.

## Next steps

* For information about the Azure Database Migration Service, see the article [What is the Azure Database Migration Service?](https://docs.microsoft.com/azure/dms/dms-overview).
* For information about Azure Database for PostgreSQL, see the article [What is Azure Database for PostgreSQL?](https://docs.microsoft.com/azure/postgresql/overview).
* For other questions, email the [Ask Azure Database Migrations](mailto:AskAzureDatabaseMigrations@service.microsoft.com) alias.
