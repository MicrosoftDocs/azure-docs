---
 title: include file
 description: include file
 services: cosmos-db
 author: SnehaGunda
 ms.service: cosmos-db
 ms.topic: include
 ms.date: 09/14/2018
 ms.author: sngun
 ms.custom: include file
---

1. In a new browser window, sign in to the [Azure portal](https://portal.azure.com/).

2. Select **Create a resource** > **Databases** > **Azure Cosmos DB**.
   
   ![The Azure portal Databases pane](./media/cosmos-db-create-dbaccount-cassandra/create-nosql-db-databases-json-tutorial-1.png)

3. In the **New account** page, enter the settings for the new Azure Cosmos DB account. 
 
    Setting|Suggested value|Description
    ---|---|---
    ID|*Enter a unique name*|Enter a unique name to identify this Azure Cosmos DB account. Because *cassandra.cosmosdb.azure.com* is appended to the ID that you provide to create your contact point, use a unique but identifiable ID.<br><br>The ID can contain only lowercase letters, numbers, and the hyphen (-) character, and it must contain 3 to 50 characters.
    API|Cassandra|The API determines the type of account to create. Azure Cosmos DB provides five APIs to suit the needs of your application: SQL (document database), Gremlin (graph database), MongoDB (document database), Azure Table, and Cassandra, each of which currently requires a separate account. <br><br>Select **Cassandra** because, in this quickstart, you are creating a wide-column database that is queryable using CQL syntax.<br><br>[Learn more about the Cassandra API](../articles/cosmos-db/cassandra-introduction.md).|
    Subscription|*Your subscription*|Select Azure subscription that you want to use for this Azure Cosmos DB account. 
    Resource Group|Create new<br><br>*Then enter the same unique name as provided above in ID*|Select **Create New**, then enter a new resource-group name for your account. For simplicity, you can use the same name as your ID. 
    Location|*Select the region closest to your users*|Select geographic location in which to host your Azure Cosmos DB account. Use the location that's closest to your users to give them the fastest access to the data.
    Pin to dashboard | Select | Select this box so that your new database account is added to your portal dashboard for easy access.

    Then click **Create**.

    ![The new account page for Azure Cosmos DB](./media/cosmos-db-create-dbaccount-cassandra/azure-cosmos-db-create-new-account.png)

4. The account creation takes a few minutes. Wait for the portal to display the page saying **Congratulations! Your Azure Cosmos DB account was created**.

