---
 title: include file
 description: include file
 services: cosmos-db
 author: SnehaGunda
 ms.service: cosmos-db
 ms.topic: include
 ms.date: 04/13/2018
 ms.author: sngun
 ms.custom: include file
---

1. In a new browser window, sign in to the [Azure portal](https://portal.azure.com/).

2. Click **Create a resource** > **Databases** > **Azure Cosmos DB**.
   
   ![Azure portal "Databases" pane](./media/cosmos-db-create-dbaccount-graph/create-nosql-db-databases-json-tutorial-1.png)

3. In the **Create Azure Cosmos DB Account** page, enter the settings for the new Azure Cosmos DB account. 

    Setting|Value|Description
    ---|---|---
    Subscription|Your subscription|Select the Azure subscription that you want to use for this Azure Cosmos DB account. 
    Resource Group|Create new<br><br>Then enter the same unique name as provided in ID|Select **Create new**. Then enter a new resource-group name for your account. For simplicity, use the same name as your ID. 
    Account Name|Enter a unique name|Enter a unique name to identify your Azure Cosmos DB account. Because *documents.azure.com* is appended to the ID that you provide to create your URI, use a unique ID.<br><br>The ID can use only lowercase letters, numbers, and the hyphen (-) character. It must be between 3 and 31 characters in length.
    API|Gremlin (graph)|The API determines the type of account to create. Azure Cosmos DB provides five APIs: Core(SQL) for document databases, Gremlin for graph databases, MongoDB for document databases, Azure Table, and Cassandra. Currently, you must create a separate account for each API. <br><br>Select **Gremlin (graph)**  because in this quickstart you are creating a table that works with the Gremlin API. <br><br>[Learn more about the Graph API](../articles/cosmos-db/graph-introduction.md).|
    Location|Select the region closest to your users|Select a geographic location to host your Azure Cosmos DB account. Use the location that's closest to your users to give them the fastest access to the data.

    Select **Review+Create**. You can skip the **Network** and **Tags** section. 

    ![The new account blade for Azure Cosmos DB](./media/cosmos-db-create-dbaccount-graph/azure-cosmos-db-create-new-account.png)

4. The account creation takes a few minutes. Wait for the portal to display the **Congratulations! Your Azure Cosmos DB account was created** page.

    ![The Azure portal Notifications pane](./media/cosmos-db-create-dbaccount-graph/azure-cosmos-db-graph-created.png)