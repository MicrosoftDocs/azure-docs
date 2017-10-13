1. In a new window, sign in to the [Azure portal](https://portal.azure.com/).

2. In the left pane, select **New** > **Databases** > **Azure Cosmos DB** > **Create**.
   
   ![Azure portal "Databases" pane](./media/cosmos-db-create-dbaccount-graph/create-nosql-db-databases-json-tutorial-1.png)

3. Under **New account**, specify the configuration that you want for this Azure Cosmos DB account. 

    With Azure Cosmos DB, you can choose one of four programming models: Gremlin (graph), MongoDB, SQL (DocumentDB), and Table (key-value). Each model currently requires a separate account.
       
    In this Quick Start article, we program against the Graph API, so choose **Gremlin (graph)** as you fill out the form. If you have document data from a catalog app, key/value (table) data, or data that's migrated from a MongoDB app, realize that Azure Cosmos DB can provide a highly available, globally distributed database service platform for all your mission-critical applications.

    Fill in the fields on the **New account** blade by using the information in the following screenshot as a guide. Your values might be different from the values in the screenshot.
 
    !["New account" blade](./media/cosmos-db-create-dbaccount-graph/create-nosql-db-databases-json-tutorial-2.png)

    Setting|Suggested value|Description
    ---|---|---
    ID|*Unique value*|A unique name that identifies this Azure Cosmos DB account. Because *documents.azure.com* is appended to the ID that you provide to create your URI, use a unique but identifiable ID. The ID must contain only lowercase letters, numbers, and the hyphen (-) character. It must contain from 3 to 50 characters.
    API|Gremlin (graph)|We program against the [Graph API](../articles/cosmos-db/graph-introduction.md) later in this article.|
    Subscription|*Your subscription*|The Azure subscription that you want to use for this Azure Cosmos DB account. 
    Resource group|*The same value as ID*|The new resource group name for your account. For simplicity, you can use the same name as your ID. 
    Location|*The region closest to your users*|The geographic location in which to host your Azure Cosmos DB account. Choose the location closest to your users to give them the fastest access to the data.

4. Select **Create** to create the account.

5. On the toolbar, select the **Notifications** icon ![Notifications icon](./media/cosmos-db-create-dbaccount-graph/notification-icon.png) to monitor the deployment process.

    ![Azure portal "Notifications" pane](./media/cosmos-db-create-dbaccount-graph/notification.png)

6. When the **Notifications** window indicates the deployment succeeded, close the window. Open the new account from the **All resources** tile on the **Dashboard**. 

    !["All resources" tile](./media/cosmos-db-create-dbaccount-graph/azure-documentdb-all-resources.png)