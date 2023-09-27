---
title: "Tutorial: Migrate PostgreSQL to Azure Database for PostgreSQL online via the Azure CLI"
titleSuffix: Azure Database Migration Service
description: Learn to perform an online migration from PostgreSQL on-premises to Azure Database for PostgreSQL by using Azure Database Migration Service via the CLI.
author: apduvuri
ms.author: adityaduvuri
ms.reviewer: randolphwest
ms.date: 04/11/2020
ms.service: dms
ms.topic: tutorial
ms.custom:
  - seo-lt-2019
  - devx-track-azurecli
  - ignite-2022
---

# Tutorial: Migrate PostgreSQL to Azure Database for PostgreSQL online using DMS (classic) via the Azure CLI

You can use Azure Database Migration Service to migrate the databases from an on-premises PostgreSQL instance to [Azure Database for PostgreSQL](../postgresql/index.yml) with minimal downtime. In other words, migration can be achieved with minimal downtime to the application. In this tutorial, you migrate the **DVD Rental** sample database from an on-premises instance of PostgreSQL 9.6 to Azure Database for PostgreSQL by using the online migration activity in Azure Database Migration Service.

In this tutorial, you learn how to:
> [!div class="checklist"]
>
> * Migrate the sample schema using pg_dump utility.
> * Create an instance of the Azure Database Migration Service.
> * Create a migration project by using the Azure Database Migration Service.
> * Run the migration.
> * Monitor the migration.

> [!NOTE]
> Using Azure Database Migration Service to perform an online migration requires creating an instance based on the Premium pricing tier. We encrypt disk to prevent data theft during the process of migration.

> [!IMPORTANT]
> For an optimal migration experience, Microsoft recommends creating an instance of Azure Database Migration Service in the same Azure region as the target database. Moving data across regions or geographies can slow down the migration process and introduce errors.

## Prerequisites

To complete this tutorial, you need to:

* Download and install [PostgreSQL community edition](https://www.postgresql.org/download/) 9.4, 9.5, 9.6, or 10. The source PostgreSQL Server version must be 9.4, 9.5, 9.6, 10, 11, 12, or 13. For more information, see [Supported PostgreSQL database versions](../postgresql/concepts-supported-versions.md).

    Also note that the target Azure Database for PostgreSQL version must be equal to or later than the on-premises PostgreSQL version. For example, PostgreSQL 9.6 can only migrate to Azure Database for PostgreSQL 9.6, 10, or 11, but not to Azure Database for PostgreSQL 9.5.

* [Create an instance in Azure Database for PostgreSQL](../postgresql/quickstart-create-server-database-portal.md) or [Create an Azure Database for PostgreSQL - Hyperscale (Citus) server](../postgresql/hyperscale/quickstart-create-portal.md).
* Create a Microsoft Azure Virtual Network for Azure Database Migration Service by using the Azure Resource Manager deployment model, which provides site-to-site connectivity to your on-premises source servers by using either [ExpressRoute](../expressroute/expressroute-introduction.md) or [VPN](../vpn-gateway/vpn-gateway-about-vpngateways.md). For more information about creating a virtual network, see the [Virtual Network Documentation](../virtual-network/index.yml), and especially the quickstart articles with step-by-step details.

    > [!NOTE]
    > During virtual network setup, if you use ExpressRoute with network peering to Microsoft, add the following service [endpoints](../virtual-network/virtual-network-service-endpoints-overview.md) to the subnet in which the service will be provisioned:
    >
    > * Target database endpoint (for example, SQL endpoint, Azure Cosmos DB endpoint, and so on)
    > * Storage endpoint
    > * Service bus endpoint
    >
    > This configuration is necessary because Azure Database Migration Service lacks internet connectivity.

* Ensure that your virtual network Network Security Group (NSG) rules don't block the outbound port 443 of ServiceTag for ServiceBus, Storage, and AzureMonitor. For more detail on virtual network NSG traffic filtering, see the article [Filter network traffic with network security groups](../virtual-network/virtual-network-vnet-plan-design-arm.md).
* Configure your [Windows Firewall for database engine access](/sql/database-engine/configure-windows/configure-a-windows-firewall-for-database-engine-access).
* Open your Windows firewall to allow Azure Database Migration Service to access the source PostgreSQL Server, which by default is TCP port 5432.
* When using a firewall appliance in front of your source database(s), you may need to add firewall rules to allow the Azure Database Migration Service to access the source database(s) for migration.
* Create a server-level [firewall rule](../postgresql/concepts-firewall-rules.md) for Azure Database for PostgreSQL to allow Azure Database Migration Service to access to the target databases. Provide the subnet range of the virtual network used for Azure Database Migration Service.
* There are two methods for invoking the CLI:

  * In the upper-right corner of the Azure portal, select the Cloud Shell button:

       ![Cloud Shell button in the Azure portal](media/tutorial-postgresql-to-azure-postgresql-online/cloud-shell-button.png)

  * Install and run the CLI locally. CLI 2.18 or above version of the command-line tool is required for managing the Azure resources needed for this migration.

       To download the CLI, follow the instructions in the article [Install Azure CLI](/cli/azure/install-azure-cli). The article also lists the platforms that support Azure CLI.

       To set up Windows Subsystem for Linux (WSL), follow the instructions in the [Windows 10 Installation Guide](/windows/wsl/install-win10)

* Enable logical replication on the source server, by editing the postgresql.config file and setting the following parameters:

  * wal_level = **logical**
  * max_replication_slots = [number of slots], recommend setting to **five slots**
  * max_wal_senders =[number of concurrent tasks] - The max_wal_senders parameter sets the number of concurrent tasks that can run, recommend setting to **10 tasks**

## Migrate the sample schema

To complete all the database objects like table schemas, indexes and stored procedures, we need to extract schema from the source database and apply to the database.

1. Use pg_dump -s command to create a schema dump file for a database. 

    ```
    pg_dump -O -h hostname -U db_username -d db_name -s > your_schema.sql
    ```

    For example, to dump a schema file dvdrental database:
    ```
    pg_dump -O -h localhost -U postgres -d dvdrental -s  > dvdrentalSchema.sql
    ```

    For more information about using the pg_dump utility, see the examples in the [pg-dump](https://www.postgresql.org/docs/9.6/static/app-pgdump.html#PG-DUMP-EXAMPLES) tutorial.

2. Create an empty database in your target environment, which is Azure Database for PostgreSQL.

    For details on how to connect and create a database, see the article [Create an Azure Database for PostgreSQL server in the Azure portal](../postgresql/quickstart-create-server-database-portal.md) or [Create an Azure Database for PostgreSQL - Hyperscale (Citus) server in the Azure portal](../postgresql/hyperscale/quickstart-create-portal.md).

3. Import the schema into the target database you created by restoring the schema dump file.

    ```
    psql -h hostname -U db_username -d db_name < your_schema.sql 
    ```

    For example:

    ```
    psql -h mypgserver-20170401.postgres.database.azure.com  -U postgres -d dvdrental < dvdrentalSchema.sql
    ```

  > [!NOTE]
   > The migration service internally handles the enable/disable of foreign keys and triggers to ensure a reliable and robust data migration. As a result, you do not have to worry about making any modifications to the target database schema.

## Provisioning an instance of DMS using the Azure CLI

1. Install the dms sync extension:
   * Sign in to Azure by running the following command:
       ```azurecli
       az login
       ```

   * When prompted, open a web browser and enter a code to authenticate your device. Follow the instructions as listed.

   * PostgreSQL online migration is now available within the regular CLI package (version 2.18.0 and above) without the need for the `dms-preview` extension. If you have installed the extension in the past, you can remove it using the following steps :
        * To check if you have `dms-preview` extension already installed, run the following command:
        
            ```azurecli
            az extension list -o table
            ```

        * If `dms-preview` extension is installed, then to uninstall it, run the following command:
        
            ```azurecli
            az extension remove --name dms-preview
            ```

        * To verify you have uninstalled `dms-preview` extension correctly, run the following command and you should not see the `dms-preview` extension in the list:

            ```azurecli
            az extension list -o table
            ```

      > [!IMPORTANT]
      > `dms-preview` extension may still be needed for other migration paths supported by Azure DMS. Please check the documentation of specific migration path to determine if the extension is needed. This documentation covers the requirement of extension, specific to PostgreSQL to Azure Database for PostgreSQL online.

   * At any time, view all commands supported in DMS by running:

       ```azurecli
       az dms -h
       ```

   * If you have multiple Azure subscriptions, run the following command to set the subscription that you want to use to provision an instance of the DMS service.

        ```azurecli
       az account set -s 97181df2-909d-420b-ab93-1bff15acb6b7
        ```

2. Provision an instance of DMS by running the following command:

   ```azurecli
   az dms create -l <location> -n <newServiceName> -g <yourResourceGroupName> --sku-name Premium_4vCores --subnet/subscriptions/{vnet subscription id}/resourceGroups/{vnet resource group}/providers/Microsoft.Network/virtualNetworks/{vnet name}/subnets/{subnet name} –tags tagName1=tagValue1 tagWithNoValue
   ```

   For example the following command will create a service in:

   * Location: East US2
   * Subscription: 97181df2-909d-420b-ab93-1bff15acb6b7
   * Resource Group Name: PostgresDemo
   * DMS Service Name: PostgresCLI

   ```azurecli
   az dms create -l eastus2 -g PostgresDemo -n PostgresCLI --subnet /subscriptions/97181df2-909d-420b-ab93-1bff15acb6b7/resourceGroups/ERNetwork/providers/Microsoft.Network/virtualNetworks/AzureDMS-CORP-USC-VNET-5044/subnets/Subnet-1 --sku-name Premium_4vCores
   ```

   It takes about 10-12 minutes to create the instance of the DMS service.

3. To identify the IP address of the DMS agent so that you can add it to the Postgres pg_hba.conf file, run the following command:

    ```azurecli
    az network nic list -g <ResourceGroupName>--query '[].ipConfigurations | [].privateIpAddress'
    ```

    For example:

    ```azurecli
    az network nic list -g PostgresDemo --query '[].ipConfigurations | [].privateIpAddress'
    ```

    You should get a result similar to the following address: 

    ```output
    [
      "172.16.136.18"
    ]
    ```

4. Add the IP address of the DMS agent to the Postgres pg_hba.conf file.

    * Take note of the DMS IP address after you finish provisioning in DMS.
    * Add the IP address to pg_hba.conf file on the source, similar to the following entry:

        ```
        host     all            all        172.16.136.18/10    md5
        host     replication    postgres   172.16.136.18/10    md5
        ```

5. Next, create a PostgreSQL migration project by running the following command:
    
    ```azurecli
    az dms project create -l <location> -g <ResourceGroupName> --service-name <yourServiceName> --source-platform PostgreSQL --target-platform AzureDbforPostgreSQL -n <newProjectName>
    ```

    For example, the following command creates a project using these parameters:

    * Location: West Central US
    * Resource Group Name: PostgresDemo
    * Service Name: PostgresCLI
    * Project name: PGMigration
    * Source platform: PostgreSQL
    * Target platform: AzureDbForPostgreSql   

     ```azurecli
     az dms project create -l westcentralus -n PGMigration -g PostgresDemo --service-name PostgresCLI --source-platform PostgreSQL --target-platform AzureDbForPostgreSql
     ```

6. Create a PostgreSQL migration task using the following steps.

    This step includes using the source IP, UserID and password, destination IP, UserID, password, and task type to establish connectivity.

    * To see a full list of options, run the command:

        ```azurecli
        az dms project task create -h
        ```

        For both source and target connection, the input parameter is referring to a json file that has the object list.

        The format of the connection JSON object for PostgreSQL connections.
        
        ```json
        {
            // if this is missing or null, you will be prompted
            "userName": "user name",
            // if this is missing or null (highly recommended) you will  be prompted  
            "password": null,
            "serverName": "server name",
            // if this is missing, it will default to the 'postgres' database
            "databaseName": "database name",
            // if this is missing, it will default to 5432 
            "port": 5432                
        }
        ```

        There's also a database option json file that lists the json objects. For PostgreSQL, the format of the database options JSON object is shown below:

        ```json
        [
            {
                "name": "source database",
                "target_database_name": "target database",
                "selectedTables": [
                    "schemaName1.tableName1",
                    ...n
                ]
            },
            ...n
        ]
        ```

    * To create the source connection json, open Notepad and copy the following json and paste it into the file. Save the file in C:\DMS\source.json after modifying it according to your source server.

        ```json
        {
            "userName": "postgres",    
            "password": null,
            "serverName": "13.51.14.222",
            "databaseName": "dvdrental", 
            "port": 5432                
        }
        ```

    * To create the target connection json, open Notepad and copy the following json and paste it into the file. Save the file in C:\DMS\target.json after modifying it according to your target server.
    
        ```json
        {
            "userName": " dms@builddemotarget",    
            "password": null,           
            "serverName": " builddemotarget.postgres.database.azure.com",
            "databaseName": "inventory", 
            "port": 5432                
        }
        ```

    * Create a database options json file that lists inventory and mapping of the databases to migrate:

        * Create a list of tables to be migrated, or you can use a SQL query to generate the list from the source database. A sample query to generate the list of tables is given below just as an example. If using this query, please remember to remove the last comma at the end of the last table name to make it a valid JSON array. 
        
            ```sql
            SELECT
                FORMAT('%s,', REPLACE(FORMAT('%I.%I', schemaname, tablename), '"', '\"')) AS SelectedTables
            FROM 
                pg_tables
            WHERE 
                schemaname NOT IN ('pg_catalog', 'information_schema');
            ```

        * Create the database options json file with one entry for each database with the source and target database names and the list of selected tables to be migrated. You can use the output of the SQL query above to populate the *"selectedTables"* array. **Please note that if the selected tables list is empty, then the service will include all the tables for migration which have matching schema and table names.**.
        
            ```json
            [
                {
                    "name": "dvdrental",
                    "target_database_name": "dvdrental",
                    "selectedTables": [
                        "schemaName1.tableName1",
                        "schemaName1.tableName2",                    
                        ...
                        "schemaNameN.tableNameM"
                    ]
                },
                ... n
            ]
            ```

    * Run the following command, which takes in the source connection, target connection, and the database options json files.

        ```azurecli
        az dms project task create -g PostgresDemo --project-name PGMigration --source-connection-json c:\DMS\source.json --database-options-json C:\DMS\option.json --service-name PostgresCLI --target-connection-json c:\DMS\target.json --task-type OnlineMigration -n runnowtask    
        ```

    At this point, you've successfully submitted a migration task.

7. To show progress of the task, run the following command:

    * To see the general task status in short
        ```azurecli
        az dms project task show --service-name PostgresCLI --project-name PGMigration --resource-group PostgresDemo --name runnowtask
        ```

    * To see the detailed task status including the migration progress information

        ```azurecli
        az dms project task show --service-name PostgresCLI --project-name PGMigration --resource-group PostgresDemo --name runnowtask --expand output
        ```

    * You can also use [JMESPath](/cli/azure/query-azure-cli) query format to only extract the migrationState from the expand output:

        ```azurecli
        az dms project task show --service-name PostgresCLI --project-name PGMigration --resource-group PostgresDemo --name runnowtask --expand output --query 'properties.output[].migrationState'
        ```

        In the output, there are several parameters that indicate progress of different migration steps. For example, see the output below:

        ```json
        {
            "output": [
                // Database Level
                {
                    "appliedChanges": 0, // Total incremental sync applied after full load
                    "cdcDeleteCounter": 0, // Total delete operation  applied after full load
                    "cdcInsertCounter": 0, // Total insert operation applied after full load
                    "cdcUpdateCounter": 0, // Total update operation applied after full load
                    "databaseName": "inventory",
                    "endedOn": null,
                    "fullLoadCompletedTables": 2, //Number of tables completed full load
                    "fullLoadErroredTables": 0, //Number of tables that contain migration error
                    "fullLoadLoadingTables": 0, //Number of tables that are in loading status
                    "fullLoadQueuedTables": 0, //Number of tables that are in queued status
                    "id": "db|inventory",
                    "incomingChanges": 0, //Number of changes after full load
                    "initializationCompleted": true,
                    "latency": 0,
                    //Status of migration task
                    "migrationState": "READY_TO_COMPLETE", //READY_TO_COMPLETE => the database is ready for cutover
                    "resultType": "DatabaseLevelOutput",
                    "startedOn": "2018-07-05T23:36:02.27839+00:00"
                }, {
                    "databaseCount": 1,
                    "endedOn": null,
                    "id": "dd27aa3a-ed71-4bff-ab34-77db4261101c",
                    "resultType": "MigrationLevelOutput",
                    "sourceServer": "138.91.123.10",
                    "sourceVersion": "PostgreSQL",
                    "startedOn": "2018-07-05T23:36:02.27839+00:00",
                    "state": "PENDING",
                    "targetServer": "builddemotarget.postgres.database.azure.com",
                    "targetVersion": "Azure Database for PostgreSQL"
                },
                // Table 1
                {
                    "cdcDeleteCounter": 0,
                    "cdcInsertCounter": 0,
                    "cdcUpdateCounter": 0,
                    "dataErrorsCount": 0,
                    "databaseName": "inventory",
                    "fullLoadEndedOn": "2018-07-05T23:36:20.740701+00:00", //Full load completed time
                    "fullLoadEstFinishTime": "1970-01-01T00:00:00+00:00",
                    "fullLoadStartedOn": "2018-07-05T23:36:15.864552+00:00", //Full load started time
                    "fullLoadTotalRows": 10, //Number of rows loaded in full load
                    "fullLoadTotalVolumeBytes": 7056, //Volume in Bytes in full load
                    "id": "or|inventory|public|actor",
                    "lastModifiedTime": "2018-07-05T23:36:16.880174+00:00",
                    "resultType": "TableLevelOutput",
                    "state": "COMPLETED", //State of migration for this table
                    "tableName": "public.catalog", //Table name
                    "totalChangesApplied": 0 //Total sync changes that applied after full load
                },
                //Table 2
                {
                    "cdcDeleteCounter": 0,
                    "cdcInsertCounter": 50,
                    "cdcUpdateCounter": 0,
                    "dataErrorsCount": 0,
                    "databaseName": "inventory",
                    "fullLoadEndedOn": "2018-07-05T23:36:23.963138+00:00",
                    "fullLoadEstFinishTime": "1970-01-01T00:00:00+00:00",
                    "fullLoadStartedOn": "2018-07-05T23:36:19.302013+00:00",
                    "fullLoadTotalRows": 112,
                    "fullLoadTotalVolumeBytes": 46592,
                    "id": "or|inventory|public|address",
                    "lastModifiedTime": "2018-07-05T23:36:20.308646+00:00",
                    "resultType": "TableLevelOutput",
                    "state": "COMPLETED",
                    "tableName": "public.orders",
                    "totalChangesApplied": 0
                }
            ],
            // DMS migration task state
            "state": "Running", //Running => service is still listening to any changes that might come in
            "taskType": null
        }
        ```

## Cutover migration task

The database is ready for cutover when full load is complete. Depending on how busy the source server is with new transactions is coming in, the DMS task might be still applying changes after the full load is complete.

To ensure all data is caught up, validate row counts between the source and target databases. For example, you can validate the following details from the status output:

```
Database Level
"migrationState": "READY_TO_COMPLETE" => Status of migration task. READY_TO_COMPLETE means database is ready for cutover
"incomingChanges": 0 => Check for a period of 5-10 minutes to ensure no new incoming changes need to be applied to the target server

Table Level (for each table)
"fullLoadTotalRows": 10    => The row count matches the initial row count of the table
"cdcDeleteCounter": 0      => Number of deletes after the full load
"cdcInsertCounter": 50     => Number of inserts after the full load
"cdcUpdateCounter": 0      => Number of updates after the full load
```

1. Perform the cutover database migration task by using the following command:

    ```azurecli
    az dms project task cutover -h
    ```

    For example, the following command will initiate the cut-over for the 'Inventory' database:

    ```azurecli
    az dms project task cutover --service-name PostgresCLI --project-name PGMigration --resource-group PostgresDemo --name runnowtask  --object-name Inventory
    ```

2. To monitor the cutover progress, run the following command:

    ```azurecli
    az dms project task show --service-name PostgresCLI --project-name PGMigration --resource-group PostgresDemo --name runnowtask
    ```
3. When the database migration status shows **Completed**, [recreate sequences](https://wiki.postgresql.org/wiki/Fixing_Sequences) (if applicable), and connect your applications to the new target instance of Azure Database for PostgreSQL.

## Service, project, task cleanup

If you need to cancel or delete any DMS task, project, or service, perform the cancellation in the following sequence:

* Cancel any running task
* Delete the task
* Delete the project
* Delete DMS service

1. To cancel a running task, use the following command:

    ```azurecli
    az dms project task cancel --service-name PostgresCLI --project-name PGMigration --resource-group PostgresDemo --name runnowtask
     ```

2. To delete a running task, use the following command:
    ```azurecli
    az dms project task delete --service-name PostgresCLI --project-name PGMigration --resource-group PostgresDemo --name runnowtask
    ```

3. To cancel a running project, use the following command:
     ```azurecli
    az dms project task cancel -n runnowtask --project-name PGMigration -g PostgresDemo --service-name PostgresCLI
     ```

4. To delete a running project, use the following command:
    ```azurecli
    az dms project task delete -n runnowtask --project-name PGMigration -g PostgresDemo --service-name PostgresCLI
    ```

5. To delete DMS service, use the following command:

     ```azurecli
    az dms delete -g ProgresDemo -n PostgresCLI
     ```

## Next steps

* For information about known issues and limitations when performing online migrations to Azure Database for PostgreSQL, see the article [Known issues and workarounds with Azure Database for PostgreSQL online migrations](known-issues-azure-postgresql-online.md).
* For information about the Azure Database Migration Service, see the article [What is the Azure Database Migration Service?](./dms-overview.md).
* For information about Azure Database for PostgreSQL, see the article [What is Azure Database for PostgreSQL?](../postgresql/overview.md).
