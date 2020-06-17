---
title: Quickstart - Create Azure Cosmos DB resources from the Azure portal
description: This quickstart shows how to create an Azure Cosmos database, container, and items by using the Azure portal.
author: SnehaGunda
ms.author: sngun
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: dotnet
ms.topic: quickstart
ms.date: 01/05/2020
---
# Quickstart: Create an Azure Cosmos account, database, container, and items from the Azure portal

> [!div class="op_single_selector"]
> * [Azure portal](create-cosmosdb-resources-portal.md)
> * [.NET](create-sql-api-dotnet.md)
> * [Java](create-sql-api-java.md)
> * [Node.js](create-sql-api-nodejs.md)
> * [Python](create-sql-api-python.md)
> * [Xamarin](create-sql-api-xamarin-dotnet.md)
>  

Azure Cosmos DB is Microsoft's globally distributed multi-model database service. You can use Azure Cosmos DB to quickly create and query key/value databases, document databases, and graph databases, all of which benefit from the global distribution and horizontal scale capabilities at the core of Azure Cosmos DB. 

This quickstart demonstrates how to use the Azure portal to create an Azure Cosmos DB [SQL API](sql-api-introduction.md) account, create a document database, and container, and add data to the container. 

## Prerequisites

An Azure subscription or free Azure Cosmos DB trial account
- [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)] 

- [!INCLUDE [cosmos-db-emulator-docdb-api](../../includes/cosmos-db-emulator-docdb-api.md)]  

<a id="create-account"></a>
## Create an Azure Cosmos DB account

Go to the [Azure portal](https://portal.azure.com/) to create an Azure Cosmos DB account. Search for and select **Azure Cosmos DB**.

   ![The Azure portal Databases pane](./media/create-cosmosdb-resources-portal/find-nosql-cosmosdb-marketplace.png)

1. Select **Add**.
1. On the **Create Azure Cosmos DB Account** page, enter the basic settings for the new Azure Cosmos account. 

    |Setting|Value|Description |
    |---|---|---|
    |Subscription|Subscription name|Select the Azure subscription that you want to use for this Azure Cosmos account. |
    |Resource Group|Resource group name|Select a resource group, or select **Create new**, then enter a unique name for the new resource group. |
    |Account Name|A unique name|Enter a name to identify your Azure Cosmos account. Because *documents.azure.com* is appended to the name that you provide to create your URI, use a unique name.<br><br>The name can only contain lowercase letters, numbers, and the hyphen (-) character. It must be between 3-31 characters in length.|
    |API|The type of account to create|Select **Core (SQL)** to create a document database and query by using SQL syntax. <br><br>The API determines the type of account to create. Azure Cosmos DB provides five APIs: Core (SQL) and MongoDB for document data, Gremlin for graph data, Azure Table, and Cassandra. Currently, you must create a separate account for each API. <br><br>[Learn more about the SQL API](introduction.md).|
    |Apply Free Tier Discount|Apply or Do not apply|With Azure Cosmos DB free tier, you will get the first 400 RU/s and 5 GB of storage for free in an account. Learn more about [free tier](https://azure.microsoft.com/pricing/details/cosmos-db/).|
    |Location|The region closest to your users|Select a geographic location to host your Azure Cosmos DB account. Use the location that is closest to your users to give them the fastest access to the data.|
    |Account Type|Production or Non-Production|Select **Production** if the account will be used for a production workload. Select **Non-Production** if the account will be used for non-production, e.g. development, testing, QA, or staging. This is an Azure resource tag setting that tunes the Portal experience but does not affect the underlying Azure Cosmos DB account. You can change this value anytime.|
    |Geo-Redundancy|Enable or Disable|Enable or disable global distribution on your account by pairing your region with a pair region. You can add more regions to your account later.|
    |Multi-region Writes|Enable or Disable|Multi-region writes capability allows you to take advantage of the provisioned throughput for your databases and containers across the globe.|
    |Availability Zones|Enable or Disable|Availability Zones help you further improve availability and resiliency of your application.|


> [!NOTE]
> You can have up to one free tier Azure Cosmos DB account per Azure subscription and must opt-in when creating the account. If you do not see the option to apply the free tier discount, this means another account in the subscription has already been enabled with free tier.
   
   ![The new account page for Azure Cosmos DB](./media/create-cosmosdb-resources-portal/azure-cosmos-db-create-new-account-detail.png)

1. Select **Review + create**. You can skip the **Network** and **Tags** sections.

1. Review the account settings, and then select **Create**. It takes a few minutes to create the account. Wait for the portal page to display **Your deployment is complete**. 

    ![The Azure portal Notifications pane](./media/create-cosmosdb-resources-portal/azure-cosmos-db-account-deployment-successful.png)

1. Select **Go to resource** to go to the Azure Cosmos DB account page. 

    ![The Azure Cosmos DB account page](./media/create-cosmosdb-resources-portal/azure-cosmos-db-account-quickstart-pane.png)

<a id="create-container-database"></a>
## Add a database and a container 

You can use the Data Explorer in the Azure portal to create a database and container. 

1.  Select **Data Explorer** from the left navigation on your Azure Cosmos DB account page, and then select **New Container**. 
    
    You may need to scroll right to see the **Add Container** window.
    
    ![The Azure portal Data Explorer, Add Container pane](./media/create-sql-api-dotnet/azure-cosmosdb-data-explorer-dotnet.png)
    
1.  In the **Add container** pane, enter the settings for the new container.
    
    |Setting|Suggested value|Description
    |---|---|---|
    |**Database ID**|ToDoList|Enter *ToDoList* as the name for the new database. Database names must contain from 1 through 255 characters, and they cannot contain `/, \\, #, ?`, or a trailing space. Check the **Provision database throughput** option, it allows you to share the throughput provisioned to the database across all the containers within the database. This option also helps with cost savings. |
    |**Throughput**|400|Leave the throughput at 400 request units per second (RU/s). If you want to reduce latency, you can scale up the throughput later.| 
    |**Container ID**|Items|Enter *Items* as the name for your new container. Container IDs have the same character requirements as database names.|
    |**Partition key**| /category| The sample described in this article uses */category* as the partition key.|

    
    Don't add **Unique keys** for this example. Unique keys let you add a layer of data integrity to the database by ensuring the uniqueness of one or more values per partition key. For more information, see [Unique keys in Azure Cosmos DB](unique-keys.md).
    
1.  Select **OK**. The Data Explorer displays the new database and the container that you created.

## Add data to your database

Add data to your new database using Data Explorer.

1. In **Data Explorer**, expand the **ToDoList** database, and expand the **Items** container. Next, select **Items**, and then select **New Item**. 
   
   ![Create new documents in Data Explorer in the Azure portal](./media/create-sql-api-dotnet/azure-cosmosdb-new-document.png)
   
1. Add the following structure to the document on the right side of the **Documents** pane:

     ```json
     {
         "id": "1",
         "category": "personal",
         "name": "groceries",
         "description": "Pick up apples and strawberries.",
         "isComplete": false
     }
     ```

1. Select **Save**.
   
   ![Copy in json data and select Save in Data Explorer in the Azure portal](./media/create-sql-api-dotnet/azure-cosmosdb-save-document.png)
   
1. Select **New Document** again, and create and save another document with a unique `id`, and any other properties and values you want. Your documents can have any structure, because Azure Cosmos DB doesn't impose any schema on your data.

## Query your data

[!INCLUDE [cosmos-db-create-sql-api-query-data](../../includes/cosmos-db-create-sql-api-query-data.md)] 

## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](../../includes/cosmos-db-delete-resource-group.md)]

If you wish to delete just the database and use the Azure Cosmos account in future, you can delete the database with the following steps:

* Got to your Azure Cosmos account.
* Open **Data Explorer**, right click on the database that you want to delete and select **Delete Database**.
* Enter the Database ID/database name to confirm the delete operation. 

## Next steps

In this quickstart, you learned how to create an Azure Cosmos DB account, create a database and container using the Data Explorer. You can now import additional data to your Azure Cosmos DB account. 

> [!div class="nextstepaction"]
> [Import data into Azure Cosmos DB](import-data.md)
