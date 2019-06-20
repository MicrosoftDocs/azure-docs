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
2. In the left navigation pane, select **Create a resource**. Select **Databases** and then select **Azure Cosmos DB**.
   
   ![Screenshot of the Azure portal, highlighting More Services, and Azure Cosmos DB](./media/cosmos-db-create-dbaccount-table/create-nosql-db-databases-json-tutorial-1.png)

3. On the **Create Azure Cosmos DB Account** page, enter the settings for the new Azure Cosmos DB account:
 
    Setting|Value|Description
    ---|---|---
    Subscription|Your subscription|Select the Azure subscription that you want to use for this Azure Cosmos DB account. 
    Resource Group|Create new<br><br>Then enter the same unique name as provided in ID|Select **Create new**. Then enter a new resource group name for your account. For simplicity, use the same name as your ID. 
    Account Name|Enter a unique name|Enter a unique name to identify your Azure Cosmos DB account.<br><br>The ID can use only lowercase letters, numbers, and the hyphen (-) character. It must be between 3 and 31 characters long.
    API|Azure Table|The API determines the type of account to create. Azure Cosmos DB provides five APIs: Core(SQL) for document databases, Gremlin for graph databases, MongoDB for document databases, Azure Table, and Cassandra. Currently, you must create a separate account for each API. <br><br>Select **Azure Table** because in this quickstart you're creating a table that works with the Table API. <br><br>[Learn more about the Table API](../articles/cosmos-db/table-introduction.md).|
    Location|Select the region closest to your users|Select a geographic location to host your Azure Cosmos DB account. Use the location that's closest to your users to give them the fastest access to data.

    You can leave the **Geo-Redundancy** and **Multi-region Writes** options at their default values (**Disable**) to avoid additional RU charges. You can skip the **Network** and **Tags** sections.

5. Select **Review+Create**. After the validation is complete, select **Create** to create the account. 
 
   ![The new account page for Azure Cosmos DB](./media/cosmos-db-create-dbaccount-table/azure-cosmos-db-create-new-account.png)

6. It takes a few minutes to create the account. You'll see a message that states **Your deployment is underway**. Wait for the deployment to finish and then select **Go to resource**.

    ![The Azure portal notifications pane](./media/cosmos-db-create-dbaccount-table/azure-cosmos-db-account-created.png)
