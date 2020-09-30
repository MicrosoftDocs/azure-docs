---
 title: include file
 description: include file
 services: cosmos-db
 author: deborahc
 ms.service: cosmos-db
 ms.topic: include
 ms.date: 11/24/2018
 ms.author: dech
 ms.custom: include file
---

1. In a new browser window, sign in to the [Azure portal](https://portal.azure.com/).
2. Click **Create a resource** > **Databases** > **Azure Cosmos DB**.
   
   ![The Azure portal Databases pane](./media/cosmos-db-create-dbaccount/create-nosql-db-databases-json-tutorial-1.png)

3. In the **Create Azure Cosmos DB Account** page, enter the settings for the new Azure Cosmos DB account. 
 
    Setting|Value|Description
    ---|---|---
    Subscription|*Your subscription*|Select the Azure subscription that you want to use for this Azure Cosmos DB account. 
    Resource Group|Create new<br><br>*Enter a unique name*|Select **Create New**, then enter a new resource-group name for your account. For simplicity, you can use the same name as your Account Name. 
    Account Name|*Enter a unique name*|Enter a unique name to identify your Azure Cosmos DB account. Because *documents.azure.com* is appended to the ID that you provide to create your URI, use a unique ID.<br><br>The ID can only contain lowercase letters, numbers, and the hyphen (-) character, and it must be between 3 and 31 characters in length..
    API|Core (SQL)|The API determines the type of account to create. Azure Cosmos DB provides five APIs: SQL (document database), Gremlin (graph database), MongoDB (document database), Table API, and Cassandra API. Each API currently requires you to create a separate account. <br><br>Select **Core (SQL)** because in this article you will create a document database and query using SQL syntax. <br><br>[Learn more about the SQL API](../articles/cosmos-db/documentdb-introduction.md)|
    Location|*Select the region closest to your users*|Select a geographic location to host your Azure Cosmos DB account. Use the location that's closest to your users to give them the fastest access to the data.
    Enable geo-redundancy| Leave blank | This creates a replicated version of your database in a second (paired) region. Leave this blank.  
    Multi-region writes| Leave blank | This enables each of your database regions to be both a read and write region. Leave this blank.  

    Then click **Review + create**. You can skip the **Network** and **Tags** section. 

    ![The new account page for Azure Cosmos DB](./media/cosmos-db-create-dbaccount/azure-cosmos-db-create-new-account-preview.png)

    Review the summary information and click **Create**. 

    ![The account verification summary page](./media/cosmos-db-create-dbaccount/azure-cosmos-db-create-new-account-summary-preview.png)

4. The account creation takes a few minutes. Wait for the portal to display the **Your deployment is complete** message and click **Go to resource**.     

    ![The account successfully created page](./media/cosmos-db-create-dbaccount/azure-cosmos-db-create-new-account-complete-preview.png)

5. The portal will now display the **Congratulations! Your Azure Cosmos DB account was created** page.

    ![The Azure portal Notifications pane](./media/cosmos-db-create-dbaccount/azure-cosmos-db-account-created.png)

