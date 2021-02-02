---
 title: include file
 description: include file
 services: cosmos-db
 author: SnehaGunda
 ms.author: sngun
 ms.service: cosmos-db
 ms.topic: include
 ms.date: 08/19/2020
 ms.custom: include file
---

1. From the Azure portal menu or the **Home page**, select **Create a resource**.

1. On the **New** page, search for and select **Azure Cosmos DB**.

1. On the **Azure Cosmos DB** page, select **Create**.

1. On the **Create Azure Cosmos DB Account** page, enter the basic settings for the new Azure Cosmos account. 

    |Setting|Value|Description |
    |---|---|---|
    |Subscription|Subscription name|Select the Azure subscription that you want to use for this Azure Cosmos account. |
    |Resource Group|Resource group name|Select a resource group, or select **Create new**, then enter a unique name for the new resource group. |
    |Account Name|A unique name|Enter a name to identify your Azure Cosmos account. Because *documents.azure.com* is appended to the name that you provide to create your URI, use a unique name.<br><br>The name can only contain lowercase letters, numbers, and the hyphen (-) character. It must be between 3-44 characters in length.|
    |API|The type of account to create|Select **Core (SQL)** to create a document database and query by using SQL syntax. <br><br>The API determines the type of account to create. Azure Cosmos DB provides five APIs: Core (SQL) and MongoDB for document data, Gremlin for graph data, Azure Table, and Cassandra. Currently, you must create a separate account for each API. |
    |Capacity mode|Provisioned throughput or Serverless|Select **Provisioned throughput** to create an account in [provisioned throughput](../articles/cosmos-db/set-throughput.md) mode. Select **Serverless** to create an account in [serverless](../articles/cosmos-db/serverless.md) mode.|
    |Apply Free Tier Discount|Apply or Do not apply|With Azure Cosmos DB free tier, you will get the first 400 RU/s and 5 GB of storage for free in an account. Learn more about [free tier](https://azure.microsoft.com/pricing/details/cosmos-db/).|
    |Location|The region closest to your users|Select a geographic location to host your Azure Cosmos DB account. Use the location that is closest to your users to give them the fastest access to the data.|
    |Account Type|Production or Non-Production|Select **Production** if the account will be used for a production workload. Select **Non-Production** if the account will be used for non-production, e.g. development, testing, QA, or staging. This is an Azure resource tag setting that tunes the Portal experience but does not affect the underlying Azure Cosmos DB account. You can change this value anytime.|

    > [!NOTE]
    > You can have up to one free tier Azure Cosmos DB account per Azure subscription and must opt-in when creating the account. If you do not see the option to apply the free tier discount, this means another account in the subscription has already been enabled with free tier.
   
    > [!NOTE]
    > The following options are not available if you select **Serverless** as the **Capacity mode**:
    > - Apply Free Tier Discount
    > - Geo-redundancy
    > - Multi-region Writes
    
    :::image type="content" source="./media/cosmos-db-create-dbaccount/azure-cosmos-db-create-new-account-detail.png" alt-text="The new account page for Azure Cosmos DB":::

1. Select **Review + create**. You can skip the **Network** and **Tags** sections.

1. Review the account settings, and then select **Create**. It takes a few minutes to create the account. Wait for the portal page to display **Your deployment is complete**. 

    :::image type="content" source="./media/cosmos-db-create-dbaccount/azure-cosmos-db-account-created.png" alt-text="The Azure portal Notifications pane":::

1. Select **Go to resource** to go to the Azure Cosmos DB account page. 

    :::image type="content" source="./media/cosmos-db-create-dbaccount/azure-cosmos-db-account-created-2.png" alt-text="The Azure Cosmos DB account page":::
