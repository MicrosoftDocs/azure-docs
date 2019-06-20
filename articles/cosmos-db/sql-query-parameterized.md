---
title: Parameterized queries
description: Learn about JOIN SQL syntax for Azure Cosmos DB.
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/31/2019
ms.author: mjbrown

---
# Parameterized queries in Azure Cosmos DB

Cosmos DB supports queries with parameters expressed by the familiar @ notation. Parameterized SQL provides robust handling and escaping of user input, and prevents accidental exposure of data through SQL injection.

## Examples

For example, you can write a query that takes `lastName` and `address.state` as parameters, and execute it for various values of `lastName` and `address.state` based on user input.

```sql
    SELECT *
    FROM Families f
    WHERE f.lastName = @lastName AND f.address.state = @addressState
```

You can then send this request to Cosmos DB as a parameterized JSON query like the following:

```sql
    {
        "query": "SELECT * FROM Families f WHERE f.lastName = @lastName AND f.address.state = @addressState",
        "parameters": [
            {"name": "@lastName", "value": "Wakefield"},
            {"name": "@addressState", "value": "NY"},
        ]
    }
```

The following example sets the TOP argument with a parameterized query: 

```sql
    {
        "query": "SELECT TOP @n * FROM Families",
        "parameters": [
            {"name": "@n", "value": 10},
        ]
    }
```

Parameter values can be any valid JSON: strings, numbers, Booleans, null, even arrays or nested JSON. Since Cosmos DB is schemaless, parameters aren't validated against any type.

## Next steps

- [Introduction to Azure Cosmos DB][introduction]
- [Azure Cosmos DB .NET samples](https://github.com/Azure/azure-cosmosdb-dotnet)
- [Azure Cosmos DB consistency levels][consistency-levels]

[1]: ./media/how-to-sql-query/sql-query1.png
[introduction]: introduction.md
[consistency-levels]: consistency-levels.md