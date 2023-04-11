---
title: Quickstart - Create Azure Cosmos DB resources from the Azure portal
description: Use this quickstart to learn how to create an Azure Cosmos DB database, container, and items by using the Azure portal.
author: deborahc
ms.author: dech
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: quickstart
ms.date: 03/03/2023
ms.custom: mode-ui, ignite-2022
---
# Quickstart: Create an Azure Cosmos DB account, database, container, and items from the Azure portal
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

> [!div class="op_single_selector"]
> - [Azure portal](quickstart-portal.md)
> - [.NET](quickstart-dotnet.md)
> - [Java](quickstart-java.md)
> - [Node.js](quickstart-nodejs.md)
> - [Python](quickstart-python.md)
>  

Azure Cosmos DB is Microsoft's globally distributed multi-model database service. You can use Azure Cosmos DB to quickly create and query key/value databases, document databases, and graph databases. This approach benefits from the global distribution and horizontal scale capabilities at the core of Azure Cosmos DB.

This quickstart demonstrates how to use the Azure portal to create an Azure Cosmos DB [API for NoSQL](../introduction.md) account. In that account, you create a document database, and container, and add data to the container. Without a credit card or an Azure subscription, you can set up a free [Try Azure Cosmos DB account](https://aka.ms/trycosmosdb).

## Prerequisites

An Azure subscription or free Azure Cosmos DB trial account.

- [!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

- [!INCLUDE [cosmos-db-emulator-docdb-api](../includes/cosmos-db-emulator-docdb-api.md)]  

## <a id="create-account"></a>Create an Azure Cosmos DB account

[!INCLUDE [cosmos-db-create-dbaccount](../includes/cosmos-db-create-dbaccount.md)]

## <a id="create-container-database"></a>Add a database and a container

You can use the Data Explorer in the Azure portal to create a database and container.

1. Select **Data Explorer** from the left navigation on your Azure Cosmos DB account page, and then select **New Container** > **New Container**.

    You may need to scroll right to see the **New Container** window.

    :::image type="content" source="./media/quickstart-portal/add-database-container.png" alt-text="Screenshot shows the Azure portal Data Explorer page with the New Container pane open." lightbox="./media/quickstart-portal/add-database-container.png":::

1. In the **New Container** pane, enter the settings for the new container.

    |Setting|Suggested value|Description|
    |---|---|---|
    |**Database id**|ToDoList|Enter *ToDoList* as the name for the new database. Database names must contain 1-255 characters, and they can't contain `/`, `\`, `#`, `?`, or a trailing space. Check the **Share throughput across containers** option. It allows you to share the throughput provisioned on the database across all the containers within the database. This option also helps with cost savings. |
    | **Database throughput**|**Autoscale** or **Manual**|Manual throughput allows you to scale request units per second (RU/s) yourself whereas  autoscale throughput allows the system to scale RU/s based on usage. Select **Manual** for this example.|
    |**Database Max RU/s**| 400 RU/s|If you want to reduce latency, you can scale up the throughput later by estimating the required RU/s with the [capacity calculator](estimate-ru-with-capacity-planner.md). **Note**: This setting isn't available when creating a new container in a serverless account. |
    |**Container id**|Items|Enter *Items* as the name for your new container. Container IDs have the same character requirements as database names.|
    |**Partition key**| /category| The sample described in this article uses */category* as the partition key.|

    Don't add **Unique keys** or turn on **Analytical store** for this example.

    - Unique keys let you add a layer of data integrity to the database by ensuring the uniqueness of one or more values per partition key. For more information, see [Unique keys in Azure Cosmos DB](../unique-keys.md).
    - [Analytical store](../analytical-store-introduction.md) is used to enable large-scale analytics against operational data without any effect on your transactional workloads.

1. Select **OK**. The Data Explorer displays the new database and the container that you created.

## Add data to your database

Add data to your new database using Data Explorer.

1. In **Data Explorer**, expand the **ToDoList** database, and expand the **Items** container.

1. Next, select **Items**, and then select **New Item**.

   :::image type="content" source="./media/quickstart-portal/azure-cosmosdb-new-document.png" alt-text="Screenshot shows the New Item option in Data Explorer in the Azure portal." lightbox="./media/quickstart-portal/azure-cosmosdb-new-document.png":::

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

   :::image type="content" source="./media/quickstart-portal/azure-cosmosdb-save-document.png" alt-text="Screenshot shows where you can copy json data and select Save in Data Explorer in the Azure portal." lightbox="./media/quickstart-portal/azure-cosmosdb-save-document.png":::

1. Select **New Item** again, and create and save another document with a unique `id`, and any other properties and values you want. Your documents can have any structure, because Azure Cosmos DB doesn't impose any schema on your data.

## Query your data

[!INCLUDE [cosmos-db-create-sql-api-query-data](../includes/cosmos-db-create-sql-api-query-data.md)]

## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](../includes/cosmos-db-delete-resource-group.md)]

If you wish to delete just the database and use the Azure Cosmos DB account in future, you can delete the database with the following steps:

1. Go to your Azure Cosmos DB account.
1. Open **Data Explorer**, select the **More** (**...**) for the database that you want to delete and select **Delete Database**.
1. Enter the database ID or database name to confirm the delete operation.

## Next steps

You can now import more data to your Azure Cosmos DB account.

- [Convert the number of vCores or vCPUs in your nonrelational database to Azure Cosmos DB RU/s](../convert-vcore-to-request-unit.md)
- [Estimate RU/s using the Azure Cosmos DB capacity planner - API for NoSQL](estimate-ru-with-capacity-planner.md)
