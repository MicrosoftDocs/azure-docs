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
You can now use queries in Data Explorer to retrieve and filter your data.

1. See that by default, the query is set to `SELECT * FROM c`. This default query retrieves and displays all documents in the collection. 

    ![Default query in Data Explorer is `SELECT * FROM c`](./media/cosmos-db-create-sql-api-query-data/azure-cosmosdb-data-explorer-query.png)

2. Stay on the **Documents** tab, and change the query by clicking the **Edit Filter** button, adding `ORDER BY c._ts DESC` to the query predicate box, and then clicking **Apply Filter**.

    ![Change the default query by adding ORDER BY c._ts DESC and clicking Apply Filter](./media/cosmos-db-create-sql-api-query-data/azure-cosmosdb-data-explorer-edit-query.png)

This modified query lists the documents in descending order based on their time stamp, so now your second document is listed first. If you're familiar with SQL syntax, you can enter any of the supported [SQL queries](../articles/cosmos-db/sql-api-sql-query.md) in this box. 

That completes our work in Data Explorer. Before we move on to working with code, note that you can also use Data Explorer to create stored procedures, UDFs, and triggers to perform server-side business logic as well as scale throughput. Data Explorer exposes all of the built-in programmatic data access available in the APIs, but provides easy access to your data in the Azure portal.