1. In a new window, sign in to the [Azure portal](https://portal.azure.com/).
2. In the left pane, click **New**, click **Databases**, and then under **Azure Cosmos DB**, click **Create**.
   
   ![The Azure portal Databases pane](./media/cosmos-db-create-dbaccount/create-nosql-db-databases-json-tutorial-1.png)

3. On the **New account** blade, specify the configuration that you want for this Azure Cosmos DB account. 
 
    Setting|Suggested value|Description
    ---|---|---
    ID|*Enter a unique name*|Enter a unique name to identify this Azure Cosmos DB account. Because *documents.azure.com* is appended to the ID that you provide to create your URI, use a unique but identifiable ID.<br><br>The ID can contain only lowercase letters, numbers, and the hyphen (-) character, and it must contain 3 to 50 characters.
    API|SQL (DocumentDB)|The API determines the type of account to create. Azure Cosmos DB provides four APIs to suits the needs of your application: Gremlin (graph), MongoDB, SQL (DocumentDB), and Table (key-value), each which currently require a separate account. <br><br>Select **SQL (DocumentDB)** because in this quickstart you are creating a document database that is queryable using SQL syntax.<br><br>[Learn more about the DocumentDB API](../articles/cosmos-db/documentdb-introduction.md)|
    Subscription|*Your subscription*|The Azure subscription that you want to use for this Azure Cosmos DB account. 
    Resource Group|*Enter the same unique name as provided above in ID*|The new resource-group name for your account. For simplicity, you can use the same name as your ID. 
    Location|*Choose the region closest to your users*|The geographic location in which to host your Azure Cosmos DB account. Choose the location that's closest to your users to give them the fastest access to the data.

    ![The new account blade for Azure Cosmos DB](./media/cosmos-db-create-dbaccount/create-nosql-db-databases-json-tutorial-2.png)

4. Leave the check boxes blank, and click **Create**.

    The account creation takes a few minutes, 

5. The account creation takes a few minutes. To watch the status click the **Notifications** icon ![The notification icon](./media/cosmos-db-create-dbaccount/notification-icon.png) .

    ![The Azure portal Notifications pane](./media/cosmos-db-create-dbaccount-graph/azure-documentdb-nosql-notification.png)

6.  When the Notifications window indicates the deployment succeeded, close the notification window and open the new account from the **All Resources** tile on the Dashboard. 

    ![The Azure Cosmos DB account on the All Resources tile](./media/cosmos-db-create-dbaccount/all-resources.png)
 
