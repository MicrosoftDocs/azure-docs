---
title: Parameterized queries
titleSuffix: Azure Cosmos DB for NoSQL
description: Execute parameterized queries in Azure Cosmos DB for NoSQL to provide robust handling and escaping of user input, and prevent accidental exposure of data through SQL injection.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.date: 07/31/2023
ms.custom: query-reference
---

# Parameterized queries in Azure Cosmos DB for NoSQL

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Azure Cosmos DB for NoSQL supports queries with parameters expressed by the familiar @ notation. Parameterized SQL provides robust handling and escaping of user input, and prevents accidental exposure of data through SQL injection.

## Examples

For example, you can write a query that takes ``lastName`` and ``address.state`` as parameters, and execute it for various values of ``lastName`` and ``address.state`` based on user input.

```sql
SELECT
    *
FROM
    p
WHERE
    (NOT p.onSale) AND
    (p.price BETWEEN 0 AND @upperPriceLimit)
```

You can then send this request to Azure Cosmos DB for NoSQL as a parameterized JSON query object.

```json
{
  "query": "SELECT * FROM p WHERE (NOT p.onSale) AND (p.price BETWEEN 0 AND @upperPriceLimit)",
  "parameters": [
    {
      "name": "@upperPriceLimit",
      "value": 100
    }
  ]
}
```

This next example sets the ``TOP`` argument with a parameterized query:

```sql
{
  "query": "SELECT TOP @pageSize * FROM products",
  "parameters": [
    {
      "name": "@pageSize",
      "value": 10
    }
  ]
}
```

Parameter values can be any valid JSON: strings, numbers, booleans, null, even arrays or nested JSON. Since Azure Cosmos DB for NoSQL is schemaless, parameters aren't validated against any type.

Here are examples for parameterized queries in each Azure Cosmos DB for NoSQL SDK:

- [.NET SDK](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/Queries/Program.cs#L195)
- [Java](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/queries/sync/QueriesQuickstart.java#L392-L421)
- [Node.js](https://github.com/Azure/azure-cosmos-js/blob/master/samples/ItemManagement.ts#L58-L79)
- [Python](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/document_management.py#L66-L78)

## Next steps

- [``SELECT`` clause](select.md)
- [``WHERE`` clause](where.md)
