---
title: Query items in Azure Cosmos DB for NoSQL using JavaScript
description: Learn how to query items in your Azure Cosmos DB for NoSQL account using the JavaScript SDK.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: javascript
ms.topic: how-to
ms.date: 05/17/2023
ms.custom: devx-track-js, cosmos-db-dev-journey
---

# Query items in Azure Cosmos DB for NoSQL using JavaScript
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

Items in Azure Cosmos DB represent entities stored within a container. In the API for NoSQL, an item consists of JSON-formatted data with a unique identifier. When you issue queries using the API for NoSQL, results are returned as a JSON array of JSON documents.

## Query items using SQL

The Azure Cosmos DB for NoSQL supports the use of Structured Query Language (SQL) to perform queries on items in containers. A simple SQL query like ``SELECT * FROM products`` returns all items and properties from a container. Queries can be even more complex and include specific field projections, filters, and other common SQL clauses:

```sql
SELECT 
    p.name, 
    p.quantity
FROM 
    products p 
WHERE 
    p.quantity > 500
```

To learn more about the SQL syntax for Azure Cosmos DB for NoSQL, see [Getting started with SQL queries](query/getting-started.md).

## Query an item

Create an array of matched items from the container's [items](/javascript/api/@azure/cosmos/container#@azure-cosmos-container-items) object using the [query](/javascript/api/@azure/cosmos/items) method.

```javascript
const querySpec = {
    query: `SELECT * FROM ${container.id} f WHERE  f.name = @name`,
    parameters: [{
        name: "@name",
        value: "Sunnox Surfboard",
    }],
};
const { resources } = await container.items.query(querySpec).fetchAll();

for (const product of resources) {
  console.log(`${product.name}, ${product.quantity} in stock `);
}
```

The [query](/javascript/api/@azure/cosmos/items#@azure-cosmos-items-query) method returns a [QueryIterator](/javascript/api/@azure/cosmos/queryiterator) object. Use the iterator's [fetchAll](/javascript/api/@azure/cosmos/queryiterator#@azure-cosmos-queryiterator-fetchall) method to retrieve all the results. The QueryIterator also provides [fetchNext](/javascript/api/@azure/cosmos/queryiterator#@azure-cosmos-queryiterator-fetchnext), [hasMoreResults](/javascript/api/@azure/cosmos/queryiterator#@azure-cosmos-queryiterator-hasmoreresults), and other methods to help you use the results.

## Next steps

Now that you've queried multiple items, try one of our end-to-end tutorials with the API for NoSQL.

> [!div class="nextstepaction"]
> [Build a Node.js web app by using the JavaScript SDK to manage an API for NoSQL account in Azure Cosmos DB](tutorial-nodejs-web-app.md)