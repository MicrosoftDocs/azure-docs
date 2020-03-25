---
title: "Tutorial: Migrate Oracle online to Azure Database for PostgreSQL"
titleSuffix: Azure Database Migration Service
description: Learn to perform an online migration from Oracle on-premises or on virtual machines to Azure Database for PostgreSQL by using Azure Database Migration Service.
services: dms
author: HJToland3
ms.author: jtoland
manager: craigg
ms.reviewer: craigg
ms.service: dms
ms.workload: data-services
ms.custom: "seo-lt-2019"
ms.topic: article
ms.date: 01/24/2020
---

# Tutorial: Migrate Oracle to Azure Database for PostgreSQL online using DMS (Preview)

You can use Azure Database Migration Service to migrate the databases from Oracle databases hosted on-premises or on virtual machines to [Azure Database for PostgreSQL](https://docs.microsoft.com/azure/postgresql/) with minimal downtime. In other words, you can complete the migration with minimal downtime to the application. In this tutorial, you migrate the **HR** sample database from an on-premises or virtual machine instance of Oracle 11g to Azure Database for PostgreSQL by using the online migration activity in Azure Database Migration Service.

In this tutorial, you learn how to:
> [!div class="checklist"]
>
> * Assess the migration effort using the ora2pg tool.
> * Migrate the sample schema using the ora2pg tool.
> * Create an instance of Azure Database Migration Service.
> * Create a migration project by using Azure Database Migration Service.
> * Run the migration.
> * Monitor the migration.

> [!NOTE]
> Using Azure Database Migration Service to perform an online migration requires creating an instance based on the Premium pricing tier.

> [!IMPORTANT]
> For an optimal migration experience, Microsoft recommends creating an instance of Azure Database Migration Service in the same Azure region as the target database. Moving data across regions or geographies can slow down the migration process and introduce errors.

[!INCLUDE [online-offline](../../includes/database-migration-service-offline-online.md)]

This article describes how to perform an online migration from Oracle to Azure Database for PostgreSQL.

## Prerequisites

To complete this tutorial, you need to:

* Download and install [Oracle 11g Release 2 (Standard Edition, Standard Edition One, or Enterprise Edition)](https://www.oracle.com/technetwork/database/enterprise-edition/downloads/index.html).
* Download the sample **HR** database from [here](https://docs.oracle.com/database/121/COMSC/installation.htm#COMSC00002).
* Download and [install ora2pg on either Windows or Linux](https://github.com/microsoft/DataMigrationTeam/blob/master/Whitepapers/Steps%20to%20Install%20ora2pg%20on%20Windows%20and%20Linux.pdf).
* [Create an instance in Azure Database for PostgreSQL](https://docs.microsoft.com/azure/postgresql/quickstart-create-server-database-portal).
* Connect to the instance and create a database using the instruction in this [document](https://docs.microsoft.com/azure/postgresql/tutorial-design-database-using-azure-portal).
* Create a Microsoft Azure Virtual Network for Azure Database Migration Service by using the Azure Resource Manager deployment model, which provides site-to-site connectivity to your on-premises source servers by using either [ExpressRoute](https://docs.microsoft.com/azure/expressroute/expressroute-introduction) or [VPN](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways). For more information about creating a virtual network, see the [Virtual Network Documentation](https://docs.microsoft.com/azure/virtual-network/), and especially the quickstart articles with step-by-step details.

  > [!NOTE]
  > During virtual network setup, if you use ExpressRoute with network peering to Microsoft, add the following service [endpoints](https://docs.microsoft.com/azure/virtual-network/virtual-network-service-endpoints-overview) to the subnet in which the service will be provisioned:
  >
  > * Target database endpoint (for example, SQL endpoint, Cosmos DB endpoint, and so on)
  > * Storage endpoint
  > * Service bus endpoint
  >
  > This configuration is necessary because Azure Database Migration Service lacks internet connectivity.

* Ensure that your virtual network Network Security Group (NSG) rules don't block the following inbound communication ports to Azure Database Migration Service: 443, 53, 9354, 445, 12000. For more detail on virtual network NSG traffic filtering, see the article [Filter network traffic with network security groups](https://docs.microsoft.com/azure/virtual-network/virtual-network-vnet-plan-design-arm).
* Configure your [Windows Firewall for database engine access](https://docs.microsoft.com/sql/database-engine/configure-windows/configure-a-windows-firewall-for-database-engine-access).
* Open your Windows firewall to allow Azure Database Migration Service to access the source Oracle server, which by default is TCP port 1521.
* When using a firewall appliance in front of your source database(s), you may need to add firewall rules to allow Azure Database Migration Service to access the source database(s) for migration.
* Create a server-level [firewall rule](https://docs.microsoft.com/azure/sql-database/sql-database-firewall-configure) for Azure Database for PostgreSQL to allow Azure Database Migration Service access to the target databases. Provide the subnet range of the virtual network used for Azure Database Migration Service.
* Enable access to the source Oracle databases.

  > [!NOTE]
  > The DBA role is required for a user to connect to the Oracle source.

  * Archive Redo Logs is required for incremental sync in Azure Database Migration Service to capture data change. Follow these steps to configure the Oracle source:
    * Sign in using SYSDBA privilege by running the following command:

      ```
      sqlplus (user)/(password) as sysdba
      ```

    * Shut down the database instance by running the following command.

      ```
      SHUTDOWN IMMEDIATE;
      ```

      Wait for the confirmation `'ORACLE instance shut down'`.

    * Start the new instance and mount (but don't open) the database to enable or disable archiving bu running the following command:

      ```
      STARTUP MOUNT;
      ```

      The database must be mounted; wait for confirmation 'Oracle instance started'.

    * Change the database archiving mode by running the following command:

      ```
      ALTER DATABASE ARCHIVELOG;
      ```

    * Open the database for normal operations by running the following command:

      ```
      ALTER DATABASE OPEN;
      ```

      You may need to restart for the ARC file to show up.

    * To verify, run the following command:

      ```
      SELECT log_mode FROM v$database;
      ```

      You should receive a response `'ARCHIVELOG'`. If the response is `'NOARCHIVELOG'`, then the requirement isn't met.

  * Enable supplemental logging for replication using one of the following options.

    * **Option 1**.
      Change the database level supplemental logging to cover all the tables with PK and unique index. The detection query will return `'IMPLICIT'`.

      ```
      ALTER DATABASE ADD SUPPLEMENTAL LOG DATA (PRIMARY KEY, UNIQUE) COLUMNS;
      ```

      Change the table level supplemental logging. Run only for tables that have data manipulation and don't have PKs or unique indexes.

      ```
      ALTER TABLE [TABLENAME] ADD SUPPLEMENTAL LOG DATA (ALL) COLUMNS;
      ```

    * **Option 2**.
      Change the database level supplemental logging to cover all the tables, and the detection query returns `'YES'`.

      ```
      ALTER DATABASE ADD SUPPLEMENTAL LOG DATA;
      ```

      Change the table level supplemental logging. Follow the logic below to run only one statement for every table.

      If the table has a primary key:

      ```
      ALTER TABLE xxx ADD SUPPLEMENTAL LOG DATA (PRIMARY KEY) COLUMNS;
      ```

      If the table has a unique index:

      ```
      ALTER TABLE xxx ADD SUPPLEMENTAL LOG GROUP (first unique index columns) ALWAYS;
      ```

      Otherwise, run the following command:

      ```
      ALTER TABLE xxx ADD SUPPLEMENTAL LOG DATA (ALL) COLUMNS;
      ```

    To verify, run the following command:

      ```
      SELECT supplemental_log_data_min FROM v$database;
      ```

    You should receive a response `'YES'`.

## Assess the effort for an Oracle to Azure Database for PostgreSQL migration

We recommend using ora2pg to assess the effort required to migrate from Oracle to Azure Database for PostgreSQL. Use the `ora2pg -t SHOW_REPORT` directive to create a report listing all the Oracle objects, the estimated migration cost (in developer days), and certain database objects that may require special attention as part of the conversion.

Most customers will spend a considerable amount time reviewing the assessment report and considering the automatic and manual conversion effort.

To configure and run ora2pg to create an assessment report, see the **Premigration: Assessment** section of the [Oracle to Azure Database for PostgreSQL Cookbook](https://github.com/Microsoft/DataMigrationTeam/blob/master/Whitepapers/Oracle%20to%20Azure%20PostgreSQL%20Migration%20Cookbook.pdf). A sample ora2pg assessment report is available for reference [here](https://ora2pg.darold.net/report.html).

## Export the Oracle schema

We recommend that you use ora2pg to convert the Oracle schema and other Oracle objects (types, procedures, functions, etc.) to a schema that is compatible with Azure Database for PostgreSQL. ora2pg includes many directives to help you pre-define certain data types. For example, you can use the `DATA_TYPE` directive to replace all NUMBER(*,0) with bigint rather than NUMERIC(38).

You can run ora2pg to export each of the database objects in .sql files. You can then review the .sql files before importing them to Azure Database for PostgreSQL using psql or you can execute the .SQL script in PgAdmin.

```
psql -f [FILENAME] -h [AzurePostgreConnection] -p 5432 -U [AzurePostgreUser] -d database 
```

For example:

```
psql -f %namespace%\schema\sequences\sequence.sql -h server1-server.postgres.database.azure.com -p 5432 -U username@server1-server -d database
```

To configure and run ora2pg for schema conversion, see the **Migration: Schema and data** section of the [Oracle to Azure Database for PostgreSQL Cookbook](https://github.com/Microsoft/DataMigrationTeam/blob/master/Whitepapers/Oracle%20to%20Azure%20PostgreSQL%20Migration%20Cookbook.pdf).

## Set up the schema in Azure Database for PostgreSQL

You can choose to convert Oracle table schemas, stored procedures, packages, and other database objects to make them Postgres compatible by using ora2pg before starting a migration pipeline in Azure Database Migration Service. See the links below for how to work with ora2pg:

* [Install ora2pg on Windows](https://github.com/microsoft/DataMigrationTeam/blob/master/Whitepapers/Steps%20to%20Install%20ora2pg%20on%20Windows%20and%20Linux.pdf)
* [Oracle to Azure PostgreSQL Migration Cookbook](https://github.com/Microsoft/DataMigrationTeam/blob/master/Whitepapers/Oracle%20to%20Azure%20PostgreSQL%20Migration%20Cookbook.pdf)

Azure Database Migration Service can also create the PostgreSQL table schema. The service accesses the table schema in the connected Oracle source and creates a compatible table schema in Azure Database for PostgreSQL. Be sure to validate and check the schema format in Azure Database for PostgreSQL after Azure Database Migration Service finishes creating the schema and moving the data.

> [!IMPORTANT]
> Azure Database Migration Service only creates the table schema; other database objects such as stored procedures, packages, indexes, etc., are not created.

Also be sure to drop the foreign key in the target database for the full load to run. Refer to the **Migrate the sample schema** section of the article [here](https://docs.microsoft.com/azure/dms/tutorial-postgresql-azure-postgresql-online) for a script that you can use to drop the foreign key. Use Azure Database Migration Service to run for full load and sync.

### When the PostgreSQL table schema already exists

If you create a PostgreSQL schema using tools such as ora2pg before starting the data movement with Azure Database Migration Service, map the source tables to the target tables in Azure Database Migration Service.

1. When you create a new Oracle to Azure Database for PostgreSQL migration project, you're prompted to select target database and target schema in Select schemas step. Fill in the target database and target schema.

   ![Show portal subscriptions](media/tutorial-oracle-azure-postgresql-online/dms-map-to-target-databases.png)

2. The **Migration settings** screen presents a list of tables in the Oracle source. Azure Database Migration Service tries to match tables in the source and the target tables based on table name. If multiple matching target tables with different casing exist, you can select which target table to map to.

    ![Show portal subscriptions](media/tutorial-oracle-azure-postgresql-online/dms-migration-settings.png)

> [!NOTE]
> If you need to map source table names to tables with different names, email [dmsfeedback@microsoft.com](mailto:dmsfeedbac@microsoft.com) and we can provide a script to automate the process.

### When the PostgreSQL table schema doesn’t exist

If the target PostgreSQL database doesn’t contain any table schema information, Azure Database Migration Service converts the source schema and recreates it in the target database. Remember, Azure Database Migration Service creates only the table schema, not other database objects such as stored procedures, packages, and indexes.
To have Azure Database Migration Service create the schema for you, ensure that your target environment includes a schema with no existing tables. If Azure Database Migration Service discovers any table, the service assumes that the schema was created by an external tool such as ora2pg.

> [!IMPORTANT]
> Azure Database Migration Service requires that all tables be created the same way, by using either Azure Database Migration Service or a tool such as ora2pg, but not both.

To get started:

1. Create a schema in the target database based on your application requirements. By default, PostgreSQL table schema and columns names are lower cased. Oracle table schema and columns, on the other hand, are by default in all capital case.
2. In Select schemas step, specify the target database and the target schema.
3. Based on the schema you create in Azure Database for PostgreSQL, Azure Database Migration Service uses the following transformation rules:

    If the schema name in the Oracle source and matches that in Azure Database for PostgreSQL, then Azure Database Migration Service *creates the table schema using the same case as in the target*.

    For example:

    | Source Oracle schema | Target PostgreSQL Database.Schema | DMS created schema.table.column |
    | ------------- | ------------- | ------------- |
    | HR | targetHR.public | public.countries.country_id |
    | HR | targetHR.trgthr | trgthr.countries.country_id |
    | HR | targetHR.TARGETHR | "TARGETHR"."COUNTRIES"."COUNTRY_ID" |
    | HR | targetHR.HR | "HR"."COUNTRIES"."COUNTRY_ID" |
    | HR | targetHR.Hr | *Unable to map mixed cases |

    *To create mixed case schema and table names in target PostgreSQL, contact [dmsfeedback@microsoft.com](mailto:dmsfeedback@microsoft.com). We can provide a script to set up mixed case table schema in the target PostgreSQL database.

## Register the Microsoft.DataMigration resource provider

1. Sign in to the Azure portal, select **All services**, and then select **Subscriptions**.

   ![Show portal subscriptions](media/tutorial-oracle-azure-postgresql-online/portal-select-subscriptions.png)

2. Select the subscription in which you want to create the instance of the Azure Database Migration Service, and then select **Resource providers**.

    ![Show resource providers](media/tutorial-oracle-azure-postgresql-online/portal-select-resource-provider.png)

3. Search for migration, and then to the right of **Microsoft.DataMigration**, select **Register**.

    ![Register resource provider](media/tutorial-oracle-azure-postgresql-online/portal-register-resource-provider.png)

## Create a DMS instance

1. In the Azure portal, select + **Create a resource**, search for Azure Database Migration Service, and then select **Azure Database Migration Service** from the drop-down list.

    ![Azure Marketplace](media/tutorial-oracle-azure-postgresql-online/portal-marketplace.png)

2. On the **Azure Database Migration Service** screen, select **Create**.

    ![Create Azure Database Migration Service instance](media/tutorial-oracle-azure-postgresql-online/dms-create2.png)
  
3. On the **Create Migration Service** screen, specify a name for the service, the subscription, and a new or existing resource group.

4. Select an existing virtual network or create a new one.

    The virtual network provides Azure Database Migration Service with access to the source Oracle and the target Azure  Database for PostgreSQL instance.

    For more information about how to create a virtual network in the Azure portal, see the article [Create a virtual network using the Azure portal](https://aka.ms/DMSVnet).

5. Select a pricing tier.

    For more information on costs and pricing tiers, see the [pricing page](https://aka.ms/dms-pricing).

    ![Configure Azure Database Migration Service instance settings](media/tutorial-oracle-azure-postgresql-online/dms-settings5.png)

6. Select **Create** to create the service.

## Create a migration project

After the service is created, locate it within the Azure portal, open it, and then create a new migration project.

1. In the Azure portal, select **All services**, search for Azure Database Migration Service, and then select **Azure Database Migration Services**.

    ![Locate all instances of the Azure Database Migration Service](media/tutorial-oracle-azure-postgresql-online/dms-search.png)

2. On the **Azure Database Migration Services** screen, search for the name of the Azure Database Migration Service instance that you created, and then select the instance.

    ![Locate your instance of the Azure Database Migration Service](media/tutorial-oracle-azure-postgresql-online/dms-instance-search.png)

3. Select + **New Migration Project**.
4. On the **New migration project** screen, specify a name for the project, in the **Source server type** text box, select **Oracle**, in the **Target server type** text box, select **Azure Database for PostgreSQL**.
5. In the **Choose type of activity** section, select **Online data migration**.

   ![Create Database Migration Service Project](media/tutorial-oracle-azure-postgresql-online/dms-create-project5.png)

   > [!NOTE]
   > Alternately, you can choose **Create project only** to create the migration project now and execute the migration later.

6. Select **Save**, note the requirements to successfully use Azure Database Migration Service to perform an online migration, and then select **Create and run activity**.

## Specify source details

* On the **Add Source Details** screen, specify the connection details for the source Oracle instance.

  ![Add Source Details screen](media/tutorial-oracle-azure-postgresql-online/dms-add-source-details.png)

## Upload Oracle OCI driver

1. Select **Save**, and then on the **Install OCI driver** screen, sign into your Oracle account and download the driver **instantclient-basiclite-windows.x64-12.2.0.1.0.zip** (37,128,586 Byte(s)) (SHA1 Checksum: 865082268) from [here](https://www.oracle.com/technetwork/topics/winx64soft-089540.html#ic_winx64_inst).
2. Download the driver to a shared folder.

   Make sure the folder is shared with the username that you specified with minimum Read-only access. Azure Database Migration Service accesses and reads from the share to upload the OCI driver to Azure by impersonating the username you specify.

   The username you specify must be a Windows user account.

   ![OCI Driver Install](media/tutorial-oracle-azure-postgresql-online/dms-oci-driver-install.png)

## Specify target details

1. Select **Save**, and then on the **Target details** screen, specify the connection details for the target Azure Database for PostgreSQL server, which is the pre-provisioned instance of Azure Database for PostgreSQL to which the **HR** schema was deployed.

    ![Target details screen](media/tutorial-oracle-azure-postgresql-online/dms-add-target-details1.png)

2. Select **Save**, and then on the **Map to target databases** screen, map the source and the target database for migration.

    If the target database contains the same database name as the source database, Azure Database Migration Service selects the target database by default.

    ![Map to target databases](media/tutorial-oracle-azure-postgresql-online/dms-map-target-details.png)

3. Select **Save**, on the **Migration summary** screen, in the **Activity name** text box, specify a name for the migration activity, and then review the summary to ensure that the source and target details match what you previously specified.

    ![Migration Summary](media/tutorial-oracle-azure-postgresql-online/dms-migration-summary.png)

## Run the migration

* Select **Run migration**.

  The migration activity window appears, and the **Status** of the activity is **initializing**.

## Monitor the migration

1. On the migration activity screen, select **Refresh** to update the display until the **Status** of the migration shows as **Running**.

     ![Activity Status - running](media/tutorial-oracle-azure-postgresql-online/dms-activity-running.png)

2. Under **Database Name**, select a specific database to get to the migration status for **Full data load** and **Incremental data sync** operations.

    Full data load will show the initial load migration status while Incremental data sync will show change data capture (CDC) status.

     ![Activity Status - Full load completed](media/tutorial-oracle-azure-postgresql-online/dms-activity-full-load-completed.png)

     ![Activity Status - Incremental data sync](media/tutorial-oracle-azure-postgresql-online/dms-activity-incremental-data-sync.png)

## Perform migration cutover

After the initial Full load is completed, the databases are marked **Ready to cutover**.

1. When you're ready to complete the database migration, select **Start Cutover**.

2. Make sure to stop all the incoming transactions to the source database; wait until the **Pending changes** counter shows **0**.

   ![Start cutover](media/tutorial-oracle-azure-postgresql-online/dms-start-cutover.png)

3. Select **Confirm**, and then select **Apply**.
4. When the database migration status shows **Completed**, connect your applications to the new target Azure Database for PostgreSQL instance.

 > [!NOTE]
 > Since PostgreSQL by default has schema.table.column in lower case, you can revert from upper case to lower case by using the script in the **Set up the schema in Azure Database for PostgreSQL** section earlier in this article.

## Next steps

* For information about known issues and limitations when performing online migrations to Azure Database for PostgreSQL, see the article [Known issues and workarounds with Azure Database for PostgreSQL online migrations](known-issues-azure-postgresql-online.md).
* For information about the Azure Database Migration Service, see the article [What is Azure Database Migration Service?](https://docs.microsoft.com/azure/dms/dms-overview).
* For information about Azure Database for PostgreSQL, see the article [What is Azure Database for PostgreSQL?](https://docs.microsoft.com/azure/postgresql/overview).
