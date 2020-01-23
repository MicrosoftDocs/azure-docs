---
 title: include file
 description: include file
 services: cosmos-db
 ms.custom: include file
---

1. In a new window, sign in to the [Azure portal](https://portal.azure.com/).
2. In the left menu, select **Create a resource**, select **Databases**, and then under **Azure Cosmos DB**, select **Create**.
   
   ![Screenshot of the Azure portal, highlighting More Services, and Azure Cosmos DB](./media/cosmos-db-create-dbaccount-mongodb/create-nosql-db-databases-json-tutorial-1.png)

3. In the **Create Azure Cosmos DB Account** page, enter the settings for the new Azure Cosmos DB account. 
 
    Setting|Value|Description
    ---|---|---
    Subscription|Your subscription|Select the Azure subscription that you want to use for this Azure Cosmos DB account. 
    Resource Group|Create new<br><br>Then enter the same unique name as provided in ID|Select **Create new**. Then enter a new resource-group name for your account. For simplicity, use the same name as your ID. 
    Account Name|Enter a unique name|Enter a unique name to identify your Azure Cosmos DB account. Because *mongo.cosmos.azure.com* is appended to the ID that you provide to create your URI, use a unique ID.<br><br>The ID can use only lowercase letters, numbers, and the hyphen (-) character. It must be between 3 and 31 characters in length.
    API|Azure Cosmos DB's API for MongoDB|The API determines the type of account to create. Azure Cosmos DB provides five APIs: Core (SQL) for document databases, Gremlin for graph databases, Azure Cosmos DB's API MongoDB for document databases, Azure Table, and Cassandra. Currently, you must create a separate account for each API. <br><br>Select **MongoDB**  because in this quickstart you are creating a collection that works with MongoDB.|
    Location|Select the region closest to your users|Select a geographic location to host your Azure Cosmos DB account. Use the location that's closest to your users to give them the fastest access to the data.
    Version|3.6|Select the MongoDB wire protocol version 3.6 or for backwards compatibility, select 3.2.

    Select **Review+Create**. You can skip the **Network** and **Tags** section. 

    ![The new account page for Azure Cosmos DB](./media/cosmos-db-create-dbaccount-mongodb/azure-cosmos-db-create-new-account.png)

4. The account creation takes a few minutes. Wait for the portal to display the **Congratulations! Your Cosmos account with wire protocol compatibility for MongoDB is ready** page.

    ![The Azure portal Notifications pane](./media/cosmos-db-create-dbaccount-mongodb/azure-cosmos-db-account-created.png)
