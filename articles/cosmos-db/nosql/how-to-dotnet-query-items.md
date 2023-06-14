---
title: Query items in Azure Cosmos DB for NoSQL using .NET
description: Learn how to query items in your Azure Cosmos DB for NoSQL container using the .NET SDK.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: csharp
ms.topic: how-to
ms.date: 06/15/2022
ms.custom: devx-track-csharp, ignite-2022, devguide-csharp, cosmos-db-dev-journey, devx-track-dotnet
---

# Query items in Azure Cosmos DB for NoSQL using .NET

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

Items in Azure Cosmos DB represent entities stored within a container. In the API for NoSQL, an item consists of JSON-formatted data with a unique identifier. When you issue queries using the API for NoSQL, results are returned as a JSON array of JSON documents.

## Query items using SQL

The Azure Cosmos DB for NoSQL supports the use of Structured Query Language (SQL) to perform queries on items in containers. A simple SQL query like ``SELECT * FROM products`` will return all items and properties from a container. Queries can be even more complex and include specific field projections, filters, and other common SQL clauses:

```sql
SELECT 
    p.name, 
    p.description AS copy
FROM 
    products p 
WHERE 
    p.price > 500
```

To learn more about the SQL syntax for Azure Cosmos DB for NoSQL, see [Getting started with SQL queries](query/getting-started.md).

## Query an item

> [!NOTE]
> The examples in this article assume that you have already defined a C# type to represent your data named **Product**:
>
> :::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/300-query-items/Product.cs" id="type" :::
>

To query items in a container, call one of the following methods:

- [``GetItemQueryIterator<>``](#query-items-using-a-sql-query-asynchronously)
- [``GetItemLinqQueryable<>``](#query-items-using-linq-asynchronously)

## Query items using a SQL query asynchronously

This example builds a SQL query using a simple string, retrieves a feed iterator, and then uses nested loops to iterate over results. The outer **while** loop will iterate through result pages, while the inner **foreach** loop iterates over results within a page.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/300-query-items/Program.cs" id="query_items_sql" :::

The [Container.GetItemQueryIterator<>](/dotnet/api/microsoft.azure.cosmos.container.getitemqueryiterator) method returns a [``FeedIterator<>``](/dotnet/api/microsoft.azure.cosmos.feediterator-1) that is used to iterate through multi-page results. The ``HasMoreResults`` property indicates if there are more result pages left. The ``ReadNextAsync`` method gets the next page of results as an enumerable that is then used in a loop to iterate over results.

Alternatively, use the [QueryDefinition](/dotnet/api/microsoft.azure.cosmos.querydefinition) to build a SQL query with parameterized input:

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/300-query-items/Program.cs" id="query_items_sql_parameters" :::

> [!TIP]
> Parameterized input values can help prevent many common SQL query injection attacks.

## Query items using LINQ asynchronously

In this example, an [``IQueryable``<>](/dotnet/api/system.linq.iqueryable) object is used to construct a [Language Integrated Query (LINQ)](/dotnet/csharp/programming-guide/concepts/linq/). The results are then iterated over using a feed iterator.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/300-query-items/Program.cs" id="query_items_queryable" :::

The [Container.GetItemLinqQueryable<>](/dotnet/api/microsoft.azure.cosmos.container.getitemlinqqueryable) method constructs an ``IQueryable`` to build the LINQ query. Then the ``ToFeedIterator<>`` method is used to convert the LINQ query expression into a [``FeedIterator<>``](/dotnet/api/microsoft.azure.cosmos.feediterator-1).

> [!TIP]
> While you can iterate over the ``IQueryable<>``, this operation is synchronous. Use the ``ToFeedIterator<>`` method to gather results asynchronously.

## Next steps

Now that you've queried multiple items, try one of our end-to-end tutorials with the API for NoSQL.

> [!div class="nextstepaction"]
> [Build an app that queries and adds data to Azure Cosmos DB for NoSQL](/training/modules/build-dotnet-app-cosmos-db-sql-api/)
