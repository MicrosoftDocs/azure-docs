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
2. In the left menu, click **Create a resource**, click **Databases**, and then select **Azure Cosmos DB**. 

3. In the **Create Azure Cosmos DB Account** page, enter the settings for the new Azure Cosmos DB account. 
 
    Setting|Value|Description
    ---|---|---
    Subscription|Your subscription|Select the Azure subscription that you want to use for this Azure Cosmos DB account. 
    Resource Group|Create new<br><br>Then enter the same unique name as provided in ID|Select **Create new**. Then enter a new resource-group name for your account. For simplicity, use the same name as your ID. 
    Account Name|Enter a unique name|Enter a unique name to identify your Azure Cosmos DB account.<br><br>The ID can use only lowercase letters, numbers, and the hyphen (-) character. It must be between 3 and 31 characters in length.
    API|Azure Table|The API determines the type of account to create. Azure Cosmos DB provides five APIs: Core(SQL) for document databases, Gremlin for graph databases, MongoDB for document databases, Azure Table, and Cassandra. Currently, you must create a separate account for each API. <br><br>Select **Azure Table** because in this quickstart you are creating a table that works with the Table API. <br><br>[Learn more about the Table API](../articles/cosmos-db/table-introduction.md)|
    Location|Select the region closest to your users|Select a geographic location to host your Azure Cosmos DB account. Use the location that's closest to your users to give them the fastest access to the data.

4. You can leave **Geo-Redundancy** and **Multi-region Writes** options to their default values that is **Disable** to avoid additional RU charge. You can skip the **Network** and **Tags**.

5. Select **Review+Create** after the validation is complete, select **Create** to create the account. 
 
   ![The new account page for Azure Cosmos DB](./media/cosmos-db-create-dbaccount-table/azure-cosmos-db-create-new-account.png)

6. The account creation takes a few minutes and you will see **Your deployment is underway** message. Wait for it to complete and then select **Go to resource**.

    ![The Azure portal Notifications pane](./media/cosmos-db-create-dbaccount-table/azure-cosmos-db-account-created.png)
