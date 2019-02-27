---
title: "Tutorial: Use the Azure Database Migration Service to migrate MongoDB to Azure Cosmos DB's API for MongoDB offline | Microsoft Docs"
description: Learn to migrate from MongoDB on-premises to Azure Cosmos DB's API for MongoDB offline by using the Azure Database Migration Service.
services: dms
author: pochiraju
ms.author: rajpo
manager: craigg
ms.reviewer: douglasl
ms.service: dms
ms.workload: data-services
ms.custom: mvc, tutorial
ms.topic: article
ms.date: 12/11/2018
---

# Tutorial: Migrate MongoDB to Azure Cosmos DB's API for MongoDB offline using DMS
You can use the Azure Database Migration Service to perform an offline (one-time) migration of databases from an on-premises or cloud instance of MongoDB to Azure Cosmos DB's API for MongoDB.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Create an instance of the Azure Database Migration Service.
> * Create a migration project by using the Azure Database Migration Service.
> * Run the migration.
> * Monitor the migration.

In this tutorial, you migrate a dataset in MongoDB hosted in an Azure Virtual Machine to Azure Cosmos DB's API for MongoDB by using the Azure Database Migration Service. If you don't have a MongoDB source set up already, see the article [Install and configure MongoDB on a Windows VM in Azure](https://docs.microsoft.com/azure/virtual-machines/windows/install-mongodb).

## Prerequisites
To complete this tutorial, you need to:
- [Create an Azure Cosmos DB's API for MongoDB account](https://ms.portal.azure.com/#create/Microsoft.DocumentDB).
- Create a VNET for the Azure Database Migration Service by using the Azure Resource Manager deployment model, which provides site-to-site connectivity to your on-premises source servers by using either [ExpressRoute](https://docs.microsoft.com/azure/expressroute/expressroute-introduction) or [VPN](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways).
- Ensure that your Azure Virtual Network (VNET) Network Security Group rules don't block the following communication ports: 443, 53, 9354, 445, and 12000. For more detail on Azure VNET NSG traffic filtering, see the article [Filter network traffic with network security groups](https://docs.microsoft.com/azure/virtual-network/virtual-networks-nsg).
- Open your Windows firewall to allow the Azure Database Migration Service to access the source MongoDB server, which by default is TCP port 27017.
- When using a firewall appliance in front of your source database(s), you may need to add firewall rules to allow the Azure Database Migration Service to access the source database(s) for migration.

## Register the Microsoft.DataMigration resource provider
1. Sign in to the Azure portal, select **All services**, and then select **Subscriptions**.

   ![Show portal subscriptions](media/tutorial-mongodb-to-cosmosdb/portal-select-subscription1.png)
       
2. Select the subscription in which you want to create the instance of the Azure Database Migration Service, and then select **Resource providers**.
 
    ![Show resource providers](media/tutorial-mongodb-to-cosmosdb/portal-select-resource-provider.png)
    
3.  Search for migration, and then to the right of **Microsoft.DataMigration**, select **Register**.
 
    ![Register resource provider](media/tutorial-mongodb-to-cosmosdb/portal-register-resource-provider.png)    

## Create an instance
1.	In the Azure portal, select + **Create a resource**, search for Azure Database Migration Service, and then select **Azure Database Migration Service** from the drop-down list.

    ![Azure Marketplace](media/tutorial-mongodb-to-cosmosdb/portal-marketplace.png)

2.  On the **Azure Database Migration Service** screen, select **Create**.
 
    ![Create Azure Database Migration Service instance](media/tutorial-mongodb-to-cosmosdb/dms-create1.png)
  
3.	On the **Create Migration Service** screen, specify a name for the service, the subscription, and a new or existing resource group.

4. Select the location in which you want to create the instance of the Azure Database Migration Service. 

5. Select an existing virtual network (VNET) or create a new one.

    The VNET provides the Azure Database Migration Service with access to the source MongoDB instance and the target Azure Cosmos DB account.

    For more information about how to create a VNET in the Azure portal, see the article [Create a virtual network using the Azure portal](https://aka.ms/DMSVnet).

6. Select a pricing tier.

    For more information on costs and pricing tiers, see the [pricing page](https://aka.ms/dms-pricing).

    If you need help in choosing the right Azure Database Migration Service tier, refer to the recommendations in the blog post [here](https://go.microsoft.com/fwlink/?linkid=861067).  

     ![Configure Azure Database Migration Service instance settings](media/tutorial-mongodb-to-cosmosdb/dms-settings2.png)

7.	Select **Create** to create the service.

## Create a migration project
After the service is created, locate it within the Azure portal, open it, and then create a new migration project.

1. In the Azure portal, select **All services**, search for Azure Database Migration Service, and then select **Azure Database Migration Services**.
 
      ![Locate all instances of the Azure Database Migration Service](media/tutorial-mongodb-to-cosmosdb/dms-search.png)

2. On the **Azure Database Migration Services** screen, search for the name of the Azure Database Migration Service instance that you created, and then select the instance.

3. Select + **New Migration Project**.

4. On the **New migration project** screen, specify a name for the project, in the **Source server type** text box, select **MongoDB**, in the **Target server type** text box, select **CosmosDB (MongoDB API)**, and then for **Choose type of activity**, select **Offline data migration**. 

    ![Create Database Migration Service project](media/tutorial-mongodb-to-cosmosdb/dms-create-project.png)

5.	Select **Create and run activity** to create the project and run the migration activity.

## Specify source details
1. On the **Source details** screen, specify the connection details for the source MongoDB server.
    
   You can also use connection string mode and supply a location for a blob store file container in which you've dumped the collection data you intend to migrate.

   > [!NOTE]
   > The Azure Database Migration Service can also migrate bson documents or json documents to Azure Cosmos DB's API for MongoDB collections.
    
   You can also use the IP Address for situations in which DNS name resolution isn't possible.

   ![Specify source details](media/tutorial-mongodb-to-cosmosdb/dms-specify-source.png)

2. Select **Save**.

## Specify target details
1. On the **Migration target details** screen, specify the connection details for the target Azure Cosmos DB account, which is the pre-provisioned Azure Cosmos DB's API for MongoDB account to which you're migrating your MongoDB data.

    ![Specify target details](media/tutorial-mongodb-to-cosmosdb/dms-specify-target.png)

2. Select **Save**.

## Map to target databases
1. On the **Map to target databases** screen, map the source and the target database for migration.

    If the target database contains the same database name as the source database, the Azure Database Migration Service selects the target database by default.

    If the string **Create** appears next to the database name, it indicates that the Azure Database Migration Service didn't find the target database, and the service will create the database for you.

    At this point in the migration, you can [provision throughput](https://docs.microsoft.com/azure/cosmos-db/set-throughput). In Cosmos DB, you can provision throughput either at the database-level or individually for each collection. Throughput is measured in [Request Units](https://docs.microsoft.com/azure/cosmos-db/request-units) (RUs). Learn more about [Azure Cosmos DB pricing](https://azure.microsoft.com/pricing/details/cosmos-db/).

    ![Map to target databases](media/tutorial-mongodb-to-cosmosdb/dms-map-target-databases.png)

2. Select **Save**.
3. On the **Collection setting** screen, expand the collections listing, and then review the list of collections that will be migrated.

    Note that the Azure Database Migration Service auto selects all the collections that exist on the source MongoDB instance that don't exist on the target Azure Cosmos DB account. If you want to remigrate collections that already include data, you need to explicitly select the collections on this blade.

    You can specify the amount of RUs that you want the collections to use. The Azure Database Migration Service suggests smart defaults based on the collection size.

    You can also specify a shard key to take advantage of [partitioning in Azure Cosmos DB](https://docs.microsoft.com/azure/cosmos-db/partitioning-overview) for optimal scalability. Be sure to review the  [best practices for selecting a shard/partition key](https://docs.microsoft.com/azure/cosmos-db/partitioning-overview#choose-partitionkey).

    ![Select collections tables](media/tutorial-mongodb-to-cosmosdb/dms-collection-setting.png)

4. Select **Save**.

5. On the **Migration summary** screen, in the **Activity name** text box, specify a name for the migration activity.

    ![Migration summary](media/tutorial-mongodb-to-cosmosdb/dms-migration-summary.png)

## Run the migration
- Select **Run migration**.

    The migration activity window appears, and the **Status** of the activity is **Not started**.

    ![Activity status](media/tutorial-mongodb-to-cosmosdb/dms-activity-status.png)

## Monitor the migration
- On the migration activity screen, select **Refresh** to update the display until the **Status** of the migration shows as **Completed**.

   > [!NOTE]
   > You can select the Activity to get details of database- and collection-level migration metrics.

    ![Activity status completed](media/tutorial-mongodb-to-cosmosdb/dms-activity-completed.png)

## Verify data in Cosmos DB

- After the migration completes, you can check your Azure Cosmos DB account to verify that all the collections were migrated successfully.

    ![Activity status completed](media/tutorial-mongodb-to-cosmosdb/dms-cosmosdb-data-explorer.png)

## Additional resources

 * [Cosmos DB service information](https://azure.microsoft.com/services/cosmos-db/)

## Next steps
- Review  migration guidance for additional scenarios in the Microsoft [Database Migration Guide](https://datamigration.microsoft.com/).
