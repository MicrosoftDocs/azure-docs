---
title: "Tutorial: Use the Azure Database Migration Service to perform an online migration of PostgreSQL to Azure Database for PostgreSQL | Microsoft Docs"
description: Learn to perform an online migration from PostgreSQL on-premises to Azure Database for PostgreSQL by using Azure Database Migration Service.
services: dms
author: HJToland3
ms.author: jtoland
manager: craigg
ms.reviewer: craigg
ms.service: dms
ms.workload: data-services
ms.custom: mvc, tutorial
ms.topic: article
ms.date: 06/28/2019
---

# Tutorial: Migrate PostgreSQL to Azure Database for PostgreSQL online using DMS

You can use Azure Database Migration Service to migrate the databases from an on-premises PostgreSQL instance to [Azure Database for PostgreSQL](https://docs.microsoft.com/azure/postgresql/) with minimal downtime. In other words, migration can be achieved with minimal downtime to the application. In this tutorial, you migrate the **DVD Rental** sample database from an on-premises instance of PostgreSQL 9.6 to Azure Database for PostgreSQL by using the online migration activity in Azure Database Migration Service.

In this tutorial, you learn how to:
> [!div class="checklist"]
>
> * Migrate the sample schema using pg_dump utility.
> * Create an instance of the Azure Database Migration Service.
> * Create a migration project by using the Azure Database Migration Service.
> * Run the migration.
> * Monitor the migration.

> [!NOTE]
> Using Azure Database Migration Service to perform an online migration requires creating an instance based on the Premium pricing tier.

> [!IMPORTANT]
> For an optimal migration experience, Microsoft recommends creating an instance of Azure Database Migration Service in the same Azure region as the target database. Moving data across regions or geographies can slow down the migration process and introduce errors.

## Prerequisites

To complete this tutorial, you need to:

* Download and install [PostgreSQL community edition](https://www.postgresql.org/download/) 9.5, 9.6, or 10. The source PostgreSQL Server version must be 9.5.11, 9.6.7, 10, or later. For more information, see the article [Supported PostgreSQL Database Versions](https://docs.microsoft.com/azure/postgresql/concepts-supported-versions).

    In addition, the on-premises PostgreSQL version must match the Azure Database for PostgreSQL version. For example, PostgreSQL 9.5.11.5 can only migrate to Azure Database for PostgreSQL 9.5.11 and not to version 9.6.7.

    > [!NOTE]
    > For PostgreSQL version 10, currently DMS only supports migration of version 10.3 to Azure Database for PostgreSQL.

* [Create an instance in Azure Database for PostgreSQL](https://docs.microsoft.com/azure/postgresql/quickstart-create-server-database-portal).  
* Create an Azure Virtual Network (VNet) for Azure Database Migration Service by using the Azure Resource Manager deployment model, which provides site-to-site connectivity to your on-premises source servers by using either [ExpressRoute](https://docs.microsoft.com/azure/expressroute/expressroute-introduction) or [VPN](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways). For more information about creating a VNet, see the [Virtual Network Documentation](https://docs.microsoft.com/azure/virtual-network/), and especially the quickstart articles with step-by-step details.

    > [!NOTE]
    > During VNet setup, if you use ExpressRoute with network peering to Microsoft, add the following service [endpoints](https://docs.microsoft.com/azure/virtual-network/virtual-network-service-endpoints-overview) to the subnet in which the service will be provisioned:
    > * Target database endpoint (for example, SQL endpoint, Cosmos DB endpoint, and so on)
    > * Storage endpoint
    > * Service bus endpoint
    >
    > This configuration is necessary because the Azure Database Migration Service lacks internet connectivity.

* Ensure that your VNet Network Security Group (NSG) rules do not block the following inbound communication ports to Azure Database Migration Service: 443, 53, 9354, 445, 12000. For more detail on Azure VNet NSG traffic filtering, see the article [Filter network traffic with network security groups](https://docs.microsoft.com/azure/virtual-network/virtual-network-vnet-plan-design-arm).
* Configure your [Windows Firewall for database engine access](https://docs.microsoft.com/sql/database-engine/configure-windows/configure-a-windows-firewall-for-database-engine-access).
* Open your Windows firewall to allow Azure Database Migration Service to access the source PostgreSQL Server, which by default is TCP port 5432.
* When using a firewall appliance in front of your source database(s), you may need to add firewall rules to allow the Azure Database Migration Service to access the source database(s) for migration.
* Create a server-level [firewall rule](https://docs.microsoft.com/azure/sql-database/sql-database-firewall-configure) for Azure Database for PostgreSQL to allow Azure Database Migration Service to access to the target databases. Provide the subnet range of the VNet used for Azure Database Migration Service.
* There are two methods for invoking the CLI:

  * In the upper-right corner of the Azure postal, select the Cloud Shell button:

       ![Cloud Shell button in the Azure portal](media/tutorial-postgresql-to-azure-postgresql-online/cloud-shell-button.png)

  * Install and run the CLI locally. CLI 2.0 is the command-line tool for managing Azure resources.

       To download the CLI, follow the instructions in the article [Install Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest). The article also lists the platforms that support CLI 2.0.

       To set up Windows Subsystem for Linux (WSL), follow the instructions in the [Windows 10 Installation Guide](https://docs.microsoft.com/windows/wsl/install-win10)

* Enable logical replication in the postgresql.config file, and set the following parameters:

  * wal_level = **logical**
  * max_replication_slots = [number of slots], recommend setting to **5 slots**
  * max_wal_senders =[number of concurrent tasks] - The max_wal_senders parameter sets the number of concurrent tasks that can run, recommend setting to **10 tasks**

## Migrate the sample schema

To complete all the database objects like table schemas, indexes and stored procedures, we need to extract schema from the source database and apply to the database.

1. Use pg_dump -s command to create a schema dump file for a database. 

    ```
    pg_dump -o -h hostname -U db_username -d db_name -s > your_schema.sql
    ```

    For example, to dump a schema file dvdrental database:
    ```
    pg_dump -o -h localhost -U postgres -d dvdrental -s  > dvdrentalSchema.sql
    ```

    For more information about using the pg_dump utility, see the examples in the [pg-dump](https://www.postgresql.org/docs/9.6/static/app-pgdump.html#PG-DUMP-EXAMPLES) tutorial.

2. Create an empty database in your target environment, which is Azure Database for PostgreSQL.

    Refer to the article [Create an Azure Database for PostgreSQL server in the Azure portal](https://docs.microsoft.com/azure/postgresql/quickstart-create-server-database-portal) for details on how to connect and create a database.

3. Import the schema into the target database you created by restoring the schema dump file.

    ```
    psql -h hostname -U db_username -d db_name < your_schema.sql 
    ```

    For example:

    ```
    psql -h mypgserver-20170401.postgres.database.azure.com  -U postgres -d dvdrental < dvdrentalSchema.sql
    ```

4. If you have foreign keys in your schema, the initial load and continuous sync of the migration will fail. Execute the following script in PgAdmin or in psql to extract the drop foreign key script and add foreign key script at the destination (Azure Database for PostgreSQL).
  
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

    Run the drop foreign key (which is the second column) in the query result.

5. Triggers in the data (insert or update triggers) will enforce data integrity in the target ahead of the replicated data from the source. It's recommended that you disable triggers in all the tables **at the target** during migration and then re-enable the triggers after migration is complete.

    To disable triggers in target database, use the following command:

    ```
    select concat ('alter table ', event_object_table, ' disable trigger ', trigger_name)
    from information_schema.triggers;
    ```

6. If there are ENUM data type in any tables, it's recommended that you temporarily update it to a ‘character varying’ datatype in the target table. After data replication is done, revert the datatype to ENUM.

## Provisioning an instance of DMS using the CLI

1. Install the dms sync extension:
   * Sign in to Azure by running the following command:
       ```
       az login
       ```

   * When prompted, open a web browser and enter a code to authenticate your device. Follow the instructions as listed.
   * Add the dms extension:
       * To list the available extensions, run the following command:

           ```
           az extension list-available –otable
           ```

       * To install the extension, run the following command:

           ```
           az extension add –n dms-preview
           ```

   * To verify you have dms extension installed correct, run the following command:

       ```
       az extension list -otable
       ```
       You should see the following output:

       ```
       ExtensionType    Name
       ---------------  ------
       whl              dms
       ```

   * At any time, view all commands supported in DMS by running:

       ```
       az dms -h
       ```

   * If you have multiple Azure subscriptions, run the following command to set the subscription that you want to use to provision an instance of the DMS service.

        ```
       az account set -s 97181df2-909d-420b-ab93-1bff15acb6b7
        ```

2. Provision an instance of DMS by running the following command:

   ```
   az dms create -l [location] -n <newServiceName> -g <yourResourceGroupName> --sku-name BusinessCritical_4vCores --subnet/subscriptions/{vnet subscription id}/resourceGroups/{vnet resource group}/providers/Microsoft.Network/virtualNetworks/{vnet name}/subnets/{subnet name} –tags tagName1=tagValue1 tagWithNoValue
   ```

   For example the following command will create a service in:

   * Location: East US2
   * Subscription: 97181df2-909d-420b-ab93-1bff15acb6b7
   * Resource Group Name: PostgresDemo
   * DMS Service Name: PostgresCLI

   ```
   az dms create -l eastus2 -g PostgresDemo -n PostgresCLI --subnet /subscriptions/97181df2-909d-420b-ab93-1bff15acb6b7/resourceGroups/ERNetwork/providers/Microsoft.Network/virtualNetworks/AzureDMS-CORP-USC-VNET-5044/subnets/Subnet-1 --sku-name BusinessCritical_4vCores
   ```

   It takes about 10-12 minutes to create the instance of the DMS service.

3. To identify the IP address of the DMS agent so that you can add it to the Postgres pg_hba.conf file, run the following command:

    ```
    az network nic list -g <ResourceGroupName>--query '[].ipConfigurations | [].privateIpAddress'
    ```

    For example:

    ```
    az network nic list -g PostgresDemo --query '[].ipConfigurations | [].privateIpAddress'
    ```

    You should get a result similar to the following address: 

    ```
    [
      "172.16.136.18"
    ]
    ```

4. Add the IP address of the DMS agent to the Postgres pg_hba.conf file.

    * Take note of the DMS IP address after you finish provisioning in DMS.
    * Add the IP address to pg_hba.conf file on the source, similar to the following entry:

        ```
        host 	all 	all 	172.16.136.18/10 	md5
        host 	replication 	postgres 	172.16.136.18/10 	md5
        ```

5. Next, create a PostgreSQL migration project by running the following command:
    
    ```
    az dms project create -l <location> -g <ResourceGroupName> --service-name <yourServiceName> --source-platform PostgreSQL --target-platform AzureDbforPostgreSQL -n <newProjectName>
    ```

    For example, the following command creates a project using these parameters:

   * Location: West Central US
   * Resource Group Name: PostgresDemo
   * Service Name: PostgresCLI
   * Project name: PGMigration
   * Source platform: PostgreSQL
   * Target platform: AzureDbForPostgreSql

     ```
     az dms project create -l eastus2 -n PGMigration -g PostgresDemo --service-name PostgresCLI --source-platform PostgreSQL --target-platform AzureDbForPostgreSql
     ```

6. Create a PostgreSQL migration task using the following steps.

    This step includes using the source IP, UserID and password, destination IP, UserID, password, and task type to establish connectivity.

   * To see a full list of options, run the command:

       ```
       az dms project task create -h
       ```

       For both source and target connection, the input parameter is referring to a json file that has the object list.

       The format of the connection JSON object for PostgreSQL connections.
        
       ```
       {
                   "userName": "user name",    // if this is missing or null, you will be prompted
                   "password": null,           // if this is missing or null (highly recommended) you will
               be prompted
                   "serverName": "server name",
                   "databaseName": "database name", // if this is missing, it will default to the 'postgres'
               server
                   "port": 5432                // if this is missing, it will default to 5432
               }
       ```

   * There's also a database option json file that lists the json objects. For PostgreSQL, the format of the database options JSON object is shown below:

       ```
       [
           {
               "name": "source database",
               "target_database_name": "target database",
           },
           ...n
       ]
       ```

   * Create a json file with Notepad, copy the following commands and paste them into the file, and then save the file in C:\DMS\source.json.

        ```
       {
                   "userName": "postgres",    
                   "password": null,           
               be prompted
                   "serverName": "13.51.14.222",
                   "databaseName": "dvdrental", 
                   "port": 5432                
               }
        ```

   * Create another file named target.json and save as C:\DMS\target.json. Include the following commands:

       ```
       {
               "userName": " dms@builddemotarget",    
               "password": null,           
               "serverName": " builddemotarget.postgres.database.azure.com",
               "databaseName": "inventory", 
               "port": 5432                
           }
       ```

   * Create a database options json file that lists inventory as the database to migrate:

       ``` 
       [
           {
               "name": "dvdrental",
               "target_database_name": "dvdrental",
           }
       ]
       ```

   * Run the following command, which takes in the source, destination, and the DB option json files.

       ``` 
       az dms project task create -g PostgresDemo --project-name PGMigration --source-platform postgresql --target-platform azuredbforpostgresql --source-connection-json c:\DMS\source.json --database-options-json C:\DMS\option.json --service-name PostgresCLI --target-connection-json c:\DMS\target.json –task-type OnlineMigration -n runnowtask    
       ```

     At this point, you've successfully submitted a migration task.

7. To show progress of the task, run the following command:

   ```
   az dms project task show --service-name PostgresCLI --project-name PGMigration --resource-group PostgresDemo --name Runnowtask
   ```

   OR

    ```
   az dms project task show --service-name PostgresCLI --project-name PGMigration --resource-group PostgresDemo --name Runnowtask --expand output
    ```

8. You can also query for the migrationState from the expand output:

    ```
    az dms project task show --service-name PostgresCLI --project-name PGMigration --resource-group PostgresDemo --name Runnowtask --expand output --query 'properties.output[].migrationState | [0]' "READY_TO_COMPLETE"
    ```

## Understanding migration task status

In the output file, there are several parameters that indicate progress of migration. For example, see the output file below:

    ```
    "output": [									Database Level
          {
            "appliedChanges": 0,		//Total incremental sync applied after full load
            "cdcDeleteCounter": 0		// Total delete operation  applied after full load
            "cdcInsertCounter": 0,		// Total insert operation applied after full load
            "cdcUpdateCounter": 0,		// Total update operation applied after full load
            "databaseName": "inventory",
            "endedOn": null,
            "fullLoadCompletedTables": 2,	//Number of tables completed full load
            "fullLoadErroredTables": 0,	//Number of tables that contain migration error
            "fullLoadLoadingTables": 0,	//Number of tables that are in loading status
            "fullLoadQueuedTables": 0,	//Number of tables that are in queued status
            "id": "db|inventory",
            "incomingChanges": 0,		//Number of changes after full load
            "initializationCompleted": true,
            "latency": 0,
            "migrationState": "READY_TO_COMPLETE",	//Status of migration task. READY_TO_COMPLETE means the database is ready for cutover
            "resultType": "DatabaseLevelOutput",
            "startedOn": "2018-07-05T23:36:02.27839+00:00"
          },
          {
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
          {										Table 1
            "cdcDeleteCounter": 0,
            "cdcInsertCounter": 0,
            "cdcUpdateCounter": 0,
            "dataErrorsCount": 0,
            "databaseName": "inventory",
            "fullLoadEndedOn": "2018-07-05T23:36:20.740701+00:00",	//Full load completed time
            "fullLoadEstFinishTime": "1970-01-01T00:00:00+00:00",
            "fullLoadStartedOn": "2018-07-05T23:36:15.864552+00:00",	//Full load started time
            "fullLoadTotalRows": 10,					//Number of rows loaded in full load
            "fullLoadTotalVolumeBytes": 7056,				//Volume in Bytes in full load
            "id": "or|inventory|public|actor",			
            "lastModifiedTime": "2018-07-05T23:36:16.880174+00:00",
            "resultType": "TableLevelOutput",
            "state": "COMPLETED",					//State of migration for this table
            "tableName": "public.catalog",				//Table name
            "totalChangesApplied": 0				//Total sync changes that applied after full load
          },
          {										Table 2
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
        ],							DMS migration task state
        "state": "Running",	//Migration task state – Running means it is still listening to any changes that might come in					
        "taskType": null
      },
      "resourceGroup": "PostgresDemo",
      "type": "Microsoft.DataMigration/services/projects/tasks"
    ```

## Cutover migration task

The database is ready for cutover when full load is complete. Depending on how busy the source server is with new transactions is coming in, the DMS task might be still applying changes after the full load is complete.

To ensure all data is caught up, validate row counts between the source and target databases. For example, you can use the following command:

```
"migrationState": "READY_TO_COMPLETE", //Status of migration task. READY_TO_COMPLETE means database is ready for cutover
 "incomingChanges": 0,	//continue to check for a period of 5-10 minutes to make sure no new incoming changes that need to be applied to the target server
   "fullLoadTotalRows": 10,	//full load for table 1
    "cdcDeleteCounter": 0,	//delete, insert and update counter on incremental sync after full load
    "cdcInsertCounter": 50,
    "cdcUpdateCounter": 0,
     "fullLoadTotalRows": 112,	//full load for table 2
```

1. Perform the cutover database migration task by using the following command:

    ```
    az dms project task cutover -h
    ```

    For example:

    ```
    az dms project task cutover --service-name PostgresCLI --project-name PGMigration --resource-group PostgresDemo --name Runnowtask  --database-name Inventory
    ```

2. To monitor the cutover progress, run the following command:

    ```
    az dms project task show --service-name PostgresCLI --project-name PGMigration --resource-group PostgresDemo --name Runnowtask
    ```

## Service, project, task cleanup

If you need to cancel or delete any DMS task, project, or service, perform the cancellation in the following sequence:

* Cancel any running task
* Delete the task
* Delete the project
* Delete DMS service

1. To cancel a running task, use the following command:

    ```
    az dms project task cancel --service-name PostgresCLI --project-name PGMigration --resource-group PostgresDemo --name Runnowtask
     ```

2. To delete a running task, use the following command:
    ```
    az dms project task delete --service-name PostgresCLI --project-name PGMigration --resource-group PostgresDemo --name Runnowtask
    ```

3. To cancel a running project, use the following command:
     ```
    az dms project task cancel -n runnowtask --project-name PGMigration -g PostgresDemo --service-name PostgresCLI
     ```

4. To delete a running project, use the following command:
    ```
    az dms project task delete -n runnowtask --project-name PGMigration -g PostgresDemo --service-name PostgresCLI
    ```

5. To delete DMS service, use the following command:

     ```
    az dms delete -g ProgresDemo -n PostgresCLI
     ```

## Next steps

* For information about known issues and limitations when performing online migrations to Azure Database for PostgreSQL, see the article [Known issues and workarounds with Azure Database for PostgreSQL online migrations](known-issues-azure-postgresql-online.md).
* For information about the Azure Database Migration Service, see the article [What is the Azure Database Migration Service?](https://docs.microsoft.com/azure/dms/dms-overview).
* For information about Azure Database for PostgreSQL, see the article [What is Azure Database for PostgreSQL?](https://docs.microsoft.com/azure/postgresql/overview).