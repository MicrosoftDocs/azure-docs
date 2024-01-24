---
title: "Tutorial: Migrate MongoDB online to Azure Cosmos DB for MongoDB RU"
titleSuffix: Azure Database Migration Service
description: Learn to migrate from MongoDB on-premises to Azure Cosmos DB for MongoDB RU online by using Azure Database Migration Service.
author: abhims14
ms.author: abhishekum
ms.reviewer: randolphwest
ms.date: 09/21/2021
ms.service: dms
ms.topic: tutorial
ms.custom:
  - seo-nov-2020
  - ignite-2022
  - sql-migration-content
  - ignite-2023
---

# Tutorial: Migrate MongoDB to Azure Cosmos DB for MongoDB RU online using Azure Database Migration Service

[!INCLUDE[appliesto-mongodb-api](../cosmos-db/includes/appliesto-mongodb.md)]

> [!IMPORTANT]
> Please read this entire guide before carrying out your migration steps. Azure Database Migration Service does not currently support migrations to an Azure Cosmos DB for MongoDB vCore account.

This MongoDB migration guide is part of series on MongoDB migration. The critical MongoDB migration steps are [pre-migration](../cosmos-db/mongodb-pre-migration.md), migration, and [post-migration](../cosmos-db/mongodb-post-migration.md), as shown below.

![Diagram of migration steps.](../cosmos-db/mongodb/media/pre-migration-steps/overall-migration-steps.png)

## Overview of online data migration from MongoDB to Azure Cosmos DB using DMS

You can use Azure Database Migration Service to perform an online (minimal downtime) migration of databases from an on-premises or cloud instance of MongoDB to Azure Cosmos DB for MongoDB.

This tutorial demonstrates the steps associated with using Azure Database Migration Service to migrate MongoDB data to Azure Cosmos DB:
> [!div class="checklist"]
> 
> * Create an instance of Azure Database Migration Service. 
> * Create a migration project. 
> * Specify the source. 
> * Specify the target. 
> * Map to target databases. 
> * Run the migration. 
> * Monitor the migration. 
> * Verify data in Azure Cosmos DB. 
> * Complete the migration when you are ready. 

In this tutorial, you migrate a dataset in MongoDB hosted in an Azure virtual machine to Azure Cosmos DB for MongoDB with minimal downtime via Azure Database Migration Service. If you don't have a MongoDB source set up already, see [Install and configure MongoDB on a Windows VM in Azure](/previous-versions/azure/virtual-machines/windows/install-mongodb).

> [!NOTE]
> Using Azure Database Migration Service to perform an online migration requires creating an instance based on the Premium pricing tier.

> [!IMPORTANT]
> For an optimal migration experience, Microsoft recommends creating an instance of Azure Database Migration Service in the same Azure region as the target database. Moving data across regions or geographies can slow down the migration process.

[!INCLUDE [online-offline](../../includes/database-migration-service-offline-online.md)]

This article describes an online migration from MongoDB to Azure Cosmos DB for MongoDB. For an offline migration, see [Migrate MongoDB to Azure Cosmos DB for MongoDB offline using DMS](tutorial-mongodb-cosmos-db.md).

## Prerequisites

To complete this tutorial, you need to:

* [Complete the pre-migration](../cosmos-db/mongodb-pre-migration.md) steps such as estimating throughput, choosing a partition key, and the indexing policy.
* [Create an Azure Cosmos DB for MongoDB account](https://portal.azure.com/#create/Microsoft.DocumentDB) and ensure [SSR (server side retry)](../cosmos-db/mongodb/prevent-rate-limiting-errors.md) is enabled.

  > [!NOTE]
  > DMS is currently not supported if you're migrating to an Azure Cosmos DB for MongoDB account provisioned with serverless mode.

* Create a Microsoft Azure Virtual Network for Azure Database Migration Service by using Azure Resource Manager deployment model, which provides site-to-site connectivity to your on-premises source servers by using either [ExpressRoute](../expressroute/expressroute-introduction.md) or [VPN](../vpn-gateway/vpn-gateway-about-vpngateways.md).

    > [!NOTE]
    > During virtual network setup, if you use ExpressRoute with network peering to Microsoft, add the following service [endpoints](../virtual-network/virtual-network-service-endpoints-overview.md) to the subnet in which the service will be provisioned:
    >
    > * Target database endpoint (for example, SQL endpoint, Azure Cosmos DB endpoint, and so on)
    > * Storage endpoint
    > * Service bus endpoint
    >
    > This configuration is necessary because Azure Database Migration Service lacks internet connectivity.

* Ensure that your virtual network Network Security Group (NSG) rules don't block the following communication ports: 53, 443, 445, 9354, and 10000-20000. For more detail on virtual network NSG traffic filtering, see the article [Filter network traffic with network security groups](../virtual-network/virtual-network-vnet-plan-design-arm.md).
* Open your Windows firewall to allow Azure Database Migration Service to access the source MongoDB server, which by default is TCP port 27017.
* When using a firewall appliance in front of your source database(s), you may need to add firewall rules to allow Azure Database Migration Service to access the source database(s) for migration.

## Configure Azure Cosmos DB Server Side Retries for efficient migration

Customers migrating from MongoDB to Azure Cosmos DB benefit from resource governance capabilities, which guarantee the ability to fully utilize your provisioned RU/s of throughput. Azure Cosmos DB may throttle a given Data Migration Service request in the course of migration if that request exceeds the container provisioned RU/s; then that request needs to be retried. Data Migration Service is capable of performing retries, however the round-trip time involved in the network hop between Data Migration Service and Azure Cosmos DB impacts the overall response time of that request. Improving response time for throttled requests can shorten the total time needed for migration. The *Server Side Retry* feature of Azure Cosmos DB allows the service to intercept throttle error codes and retry with much lower round-trip time, dramatically improving request response times.

You can find the Server Side Retry capability in the *Features* blade of the Azure Cosmos DB portal

![Screenshot of MongoDB Server-Side Retry feature.](media/tutorial-mongodb-to-cosmosdb-online/mongo-server-side-retry-feature.png)

And if it is *Disabled*, then we recommend you enable it as shown below

![Screenshot of MongoDB Server-Side Retry enable.](media/tutorial-mongodb-to-cosmosdb-online/mongo-server-side-retry-enable.png)

[!INCLUDE [resource-provider-register](../../includes/database-migration-service-resource-provider-register.md)] 

## Create an instance

1. In the Azure portal, select + **Create a resource**, search for Azure Database Migration Service, and then select **Azure Database Migration Service** from the drop-down list.

    ![Azure Marketplace](media/tutorial-mongodb-to-cosmosdb-online/portal-marketplace.png)

2. On the **Azure Database Migration Service** screen, select **Create**.

    ![Create Azure Database Migration Service instance](media/tutorial-mongodb-to-cosmosdb-online/dms-create1.png)
  
3. On the **Create Migration Service** screen, specify a name for the service, the subscription, and a new or existing resource group.

4. Select the location in which you want to create the instance of Azure Database Migration Service.

5. Select an existing virtual network, or create a new one.

   The virtual network provides Azure Database Migration Service with access to the source MongoDB instance and the target Azure Cosmos DB account.

   For more information about how to create a virtual network in the Azure portal, see the article [Create a virtual network using the Azure portal](../virtual-network/quick-create-portal.md).

6. Select a SKU from the Premium pricing tier.

    > [!NOTE]
    > Online migrations are supported only when using the Premium tier. For more information on costs and pricing tiers, see the [pricing page](https://aka.ms/dms-pricing).

    ![Configure Azure Database Migration Service instance settings](media/tutorial-mongodb-to-cosmosdb-online/dms-settings3.png)

7. Select **Create** to create the service.

## Create a migration project

After the service is created, locate it within the Azure portal, open it, and then create a new migration project.

1. In the Azure portal, select **All services**, search for Azure Database Migration Service, and then select **Azure Database Migration Services**.

    ![Locate all instances of Azure Database Migration Service](media/tutorial-mongodb-to-cosmosdb-online/dms-search.png)

2. On the **Azure Database Migration Services** screen, search for the name of Azure Database Migration Service instance that you created, and then select the instance.

    Alternately, you can discover Azure Database Migration service instance from the search pane in Azure portal.

    ![Use the Search pane in the Azure portal](media/tutorial-mongodb-to-cosmosdb-online/dms-search-portal.png)

3. Select + **New Migration Project**.

4. On the **New migration project** screen, specify a name for the project, in the **Source server type** text box, select **MongoDB**, in the **Target server type** text box, select **Azure Cosmos DB for MongoDB**, and then for **Choose type of activity**, select **Online data migration [preview]**.

    ![Create Database Migration Service project](media/tutorial-mongodb-to-cosmosdb-online/dms-create-project1.png)

5. Select **Save**, and then select **Create and run activity** to create the project and run the migration activity.

## Specify source details

1. On the **Source details** screen, specify the connection details for the source MongoDB server.

   > [!IMPORTANT]
   > Azure Database Migration Service does not support Azure Cosmos DB as a source.

    There are three modes to connect to a source:
   * **Standard mode**, which accepts a fully qualified domain name or an IP address, Port number, and connection credentials.
   * **Connection string mode**, which accepts a MongoDB Connection string as described in the article [Connection String URI Format](https://docs.mongodb.com/manual/reference/connection-string/).
   * **Data from Azure storage**, which accepts a blob container SAS URL. Select **Blob contains BSON dumps** if the blob container has BSON dumps produced by the MongoDB [bsondump tool](https://docs.mongodb.com/manual/reference/program/bsondump/), and de-select it if the container contains JSON files.

     If you select this option, be sure that the storage account connection string appears in the format:

     ```
     https://blobnameurl/container?SASKEY
     ```

     Also, based on the type dump information in Azure Storage, keep the following detail in mind.

     * For BSON dumps, the data within the blob container must be in bsondump format, such that data files are placed into folders named after the containing databases in the format collection.bson. Metadata files (if any) should be named using the format *collection*.metadata.json.

     * For JSON dumps, the files in the blob container must be placed into folders named after the containing databases. Within each database folder, data files must be placed in a subfolder called "data" and named using the format *collection*.json. Metadata files (if any) must be placed in a subfolder called "metadata" and named using the same format, *collection*.json. The metadata files must be in the same format as produced by the MongoDB bsondump tool.

    > [!IMPORTANT]
    > It is discouraged to use a self-signed certificate on the MongoDB server. However, if one is used, please connect to the server using **connection string mode** and ensure that your connection string has “”
    >
    >```
    >&sslVerifyCertificate=false
    >```

    You can use the IP Address for situations in which DNS name resolution isn't possible.

   ![Specify source details](media/tutorial-mongodb-to-cosmosdb-online/dms-specify-source1.png)

2. Select **Save**.

   > [!NOTE]
   > The Source server address should be the address of the primary if the source is a replica set, and the router if the source is a sharded MongoDB cluster. For a sharded MongoDB cluster, Azure Database Migration Service must be able to connect to the individual shards in the cluster, which may require opening the firewall on more machines.

## Specify target details

1. On the **Migration target details** screen, specify the connection details for the target Azure Cosmos DB account, which is the pre-provisioned Azure Cosmos DB for the MongoDB account to which you're migrating your MongoDB data.

    ![Specify target details](media/tutorial-mongodb-to-cosmosdb-online/dms-specify-target1.png)

2. Select **Save**.

## Map to target databases

1. On the **Map to target databases** screen, map the source and the target database for migration.

   If the target database contains the same database name as the source database, Azure Database Migration Service selects the target database by default.

   If the string **Create** appears next to the database name, it indicates that Azure Database Migration Service didn't find the target database, and the service will create the database for you.

   At this point in the migration, if you want share throughput on the database, specify a throughput RU. In Azure Cosmos DB, you can provision throughput either at the database-level or individually for each collection. Throughput is measured in [Request Units](../cosmos-db/request-units.md) (RUs). Learn more about [Azure Cosmos DB pricing](https://azure.microsoft.com/pricing/details/cosmos-db/).

   ![Map to target databases](media/tutorial-mongodb-to-cosmosdb-online/dms-map-target-databases1.png)

2. Select **Save**.

3. On the **Collection setting** screen, expand the collections listing, and then review the list of collections that will be migrated.

   Azure Database Migration Service auto selects all the collections that exist on the source MongoDB instance that don't exist on the target Azure Cosmos DB account. If you want to remigrate collections that already include data, you need to explicitly select the collections on this screen.

   You can specify the number of RUs that you want the collections to use. In most cases, a value between 500 (1000 minimum for sharded collections) and 4000 should suffice. Azure Database Migration Service suggests smart defaults based on the collection size.

    > [!NOTE]
    > Perform the database migration and collection in parallel using multiple instances of Azure Database Migration Service, if necessary, to speed up the run.

   You can also specify a shard key to take advantage of [partitioning in Azure Cosmos DB](../cosmos-db/partitioning-overview.md) for optimal scalability. Be sure to review the  [best practices for selecting a shard/partition key](../cosmos-db/partitioning-overview.md#choose-partitionkey). If you don’t have a partition key, you can always use **_id** as the shard key for better throughput.

   ![Select collections tables](media/tutorial-mongodb-to-cosmosdb-online/dms-collection-setting1.png)

4. Select **Save**.

5. On the **Migration summary** screen, in the **Activity name** text box, specify a name for the migration activity.

    ![Migration summary](media/tutorial-mongodb-to-cosmosdb-online/dms-migration-summary1.png)

## Run the migration

* Select **Run migration**.

   The migration activity window appears, and the **Status** of the activity is displayed.

   ![Activity status](media/tutorial-mongodb-to-cosmosdb-online/dms-activity-status1.png)

## Monitor the migration

* On the migration activity screen, select **Refresh** to update the display until the **Status** of the migration shows as **Replaying**.

   > [!NOTE]
   > You can select the Activity to get details of database- and collection-level migration metrics.

   ![Activity status replaying](media/tutorial-mongodb-to-cosmosdb-online/dms-activity-replaying.png)

## Verify data in Azure Cosmos DB

1. Make changes to your source MongoDB database.
2. Connect to Azure Cosmos DB to verify if the data is replicated from the source MongoDB server.

    ![Screenshot that shows where you can verify that the data was replicated.](media/tutorial-mongodb-to-cosmosdb-online/dms-verify-data.png)

## Complete the migration

* After all documents from the source are available on the Azure Cosmos DB target, select **Finish** from the migration activity’s context menu to complete the migration.

    This action will finish replaying all the pending changes and complete the migration.

    ![Screenshot that shows the Finish menu option.](media/tutorial-mongodb-to-cosmosdb-online/dms-finish-migration.png)

## Post-migration optimization

After you migrate the data stored in MongoDB database to Azure Cosmos DB for MongoDB, you can connect to Azure Cosmos DB and manage the data. You can also perform other post-migration optimization steps such as optimizing the indexing policy, update the default consistency level, or configure global distribution for your Azure Cosmos DB account. For more information, see the [Post-migration optimization](../cosmos-db/mongodb-post-migration.md) article.

## Additional resources

* [Azure Cosmos DB service information](https://azure.microsoft.com/services/cosmos-db/)
* Trying to do capacity planning for a migration to Azure Cosmos DB?
    * If all you know is the number of vCores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../cosmos-db/convert-vcore-to-request-unit.md) 
    * If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](../cosmos-db/mongodb/estimate-ru-capacity-planner.md)

## Next steps

* Review  migration guidance for additional scenarios in the Microsoft [Database Migration Guide](/data-migration/).
