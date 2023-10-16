---
 title: include file
 description: include file
 services: cosmos-db
 author: seesharprun
 ms.service: cosmos-db
 ms.topic: include
 ms.date: 03/03/2023
 ms.author: sidandrews
ms.reviewer: mjbrown
ms.custom: include file, ignite-2022
---
You can use queries in Data Explorer to retrieve and filter your data.

1. At the top of the **Items** tab in Data Explorer, review the default query `SELECT * FROM c`. This query retrieves and displays all documents from the container ordered by ID.

   :::image type="content" source="./media/cosmos-db-create-sql-api-query-data/azure-cosmosdb-data-explorer-query.png" alt-text="Screenshot shows the default query in Data Explorer, SELECT * FROM c." lightbox="./media/cosmos-db-create-sql-api-query-data/azure-cosmosdb-data-explorer-query.png":::

1. To change the query, select **Edit Filter**, replace the default query with `ORDER BY c._ts DESC`, and then select **Apply Filter**.

   :::image type="content" source="./media/cosmos-db-create-sql-api-query-data/azure-cosmosdb-data-explorer-edit-query.png" alt-text="Screenshot shows a change to the default query to ORDER BY c._ts DESC." lightbox="./media/cosmos-db-create-sql-api-query-data/azure-cosmosdb-data-explorer-edit-query.png":::

   The modified query displays the documents in descending order based on their timestamp, so now your second document is listed first.

   :::image type="content" source="./media/cosmos-db-create-sql-api-query-data/azure-cosmosdb-data-explorer-edited-query.png" alt-text="Screenshot shows the result of the changed query." lightbox="./media/cosmos-db-create-sql-api-query-data/azure-cosmosdb-data-explorer-edited-query.png":::

If you're familiar with SQL syntax, you can enter any supported [SQL queries](../nosql/query/getting-started.md) in the query predicate box. You can also use Data Explorer to create stored procedures, user defined functions, and triggers for server-side business logic.

Data Explorer provides easy access in the Azure portal to all of the built-in programmatic data access features available in the APIs. You can also use the Azure portal to scale throughput, get keys and connection strings, and review metrics and SLAs for your Azure Cosmos DB account.
