---
title: Getting started with queries
titleSuffix: Azure Cosmos DB for NoSQL
description: Learn how to access data using the built-in query syntax of Azure Cosmos DB for NoSQL. Use queries to find data in a container that allows a flexible schema.
author: seesharprun
ms.author: sidandrews
ms.reviewer: jucocchi
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 04/03/2023
ms.custom: ignite-2022
---

# Getting started with queries

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

In Azure Cosmos DB for NoSQL accounts, there are two ways to read data:

- **Point reads**
  - You can do a key/value lookup on a single *item ID* and partition key. The *item ID* and partition key combination is the key and the item itself is the value. For a 1-KB document, point reads typically cost one [request unit](../../request-units.md) with a latency under 10 ms. Point reads return a single whole item, not a partial item or a specific field.
  - Here are some examples of how to do **Point reads** with each SDK:
    - [.NET SDK](/dotnet/api/microsoft.azure.cosmos.container.readitemasync)
    - [Java SDK](/java/api/com.azure.cosmos.cosmoscontainer.readitem#com-azure-cosmos-cosmoscontainer-(t)readitem(java-lang-string-com-azure-cosmos-models-partitionkey-com-azure-cosmos-models-cosmositemrequestoptions-java-lang-class(t)))
    - [Node.js SDK](/javascript/api/@azure/cosmos/item#@azure-cosmos-item-read)
    - [Python SDK](/python/api/azure-cosmos/azure.cosmos.containerproxy#azure-cosmos-containerproxy-read-item)
    - [Go SDK](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/data/azcosmos#ContainerClient.ReadItem)
- **Queries**
  - You can query data by writing queries using the Structured Query Language (SQL) as a JSON query language. Queries always cost at least 2.3 request units and, in general, have a higher and more variable latency than point reads. Queries can return many items.
  - Most read-heavy workloads on Azure Cosmos DB use a combination of both point reads and queries. If you just need to read a single item, point reads are cheaper and faster than queries. Point reads don't need to use the query engine to access data and can read the data directly. It's not possible for all workloads to exclusively read data using point reads, so support of a custom query language and [schema-agnostic indexing](../../index-overview.md) provide a more flexible way to access your data.
  - Here are some examples of how to do **queries** with each SDK:
    - [.NET SDK](../samples-dotnet.md#items)
    - [Java SDK](../samples-java.md#query-examples)
    - [Node.js SDK](../samples-nodejs.md#item-examples)
    - [Python SDK](../samples-python.md#item-examples)
    - [Go SDK](../samples-go.md#item-examples)

> [!IMPORTANT]
> The query language is only used to query items in Azure Cosmos DB for NoSQL. You cannot use the query language to perform operations (Create, Update, Delete, etc.) on items.

The remainder of this article shows how to get started writing queries in Azure Cosmos DB. queries can be run through either the SDK or Azure portal.

## Upload sample data

In your API for NoSQL Azure Cosmos DB account, use the [Data Explorer](../../data-explorer.md) to create a container called `products`. After the container is created, use the data structures browser to expand the `products` container. Finally, select **Items**.

The menu bar should now have the **New Item** option. You use this option to create the JSON items in this article.

> [!TIP]
> For this quick guide, you can use `/id` as the partition key. For a real-world container, you should consider your overall workload when selecting a partition key strategy. For more information, see [partitioning and horizontal scaling](../../partitioning-overview.md).

### Create JSON items

These two JSON items represent two example products from [AdventureWorks](https://www.adventure-works.com/). They include information about the product, its manufacturer, and metadata tags. Each item includes nested properties, arrays, strings, numbers, GeoJSON data, and booleans.

The first item has strings, numbers, Booleans, arrays, and nested properties:

```json
{
  "id": "863e778d-21c9-4e2a-a984-d31f947c665c",
  "categoryName": "Surfboards",
  "name": "Teapo Surfboard (6'10\") Grape",
  "sku": "teapo-surfboard-72109",
  "price": 690.00,
  "manufacturer": {
    "name": "Taepo",
    "location": {
      "type": "Point",
      "coordinates": [ 
        34.15562788533047, -118.4633004882891
      ]
    }
  },
  "tags": [
    { "name": "Tail Shape: Swallow" },
    { "name": "Color Group: Purple" }
  ]
}
```

The second item includes a different set of fields than the first item:

```json
{
  "id": "6e9f51c1-6b45-440f-af5a-2abc96cd083d",
  "categoryName": "Sleeping Bags",
  "name": "Vareno Sleeping Bag (6') Turmeric",
  "price": 120.00,
  "closeout": true,
  "manufacturer": {
    "name": "Vareno"
  },
  "tags": [
    { "name": "Color Group: Yellow" },
    { "name": "Bag Shape: Mummy" }
  ]
}
```

### Query the JSON items

To understand some of the key aspects of the API for NoSQL's query language, it's useful to try a few sample queries.

- This first query simply returns the entire JSON item for each item in the container. The identifier `products` in this example is arbitrary and you can use any name to reference your container.

    ```sql
    SELECT *
    FROM products
    ```

    The query results are:

    ```sql
    [
      {
        "id": "863e778d-21c9-4e2a-a984-d31f947c665c",
        "categoryName": "Surfboards",
        "name": "Teapo Surfboard (6'10\") Grape",
        "sku": "teapo-surfboard-72109",
        "price": 690,
        "manufacturer": {
          "name": "Taepo",
          "location": {
            "type": "Point",
            "coordinates": [
              34.15562788533047, -118.4633004882891
            ]
          }
        },
        "tags": [
          { "name": "Tail Shape: Swallow" },
          { "name": "Color Group: Purple" }
        ]
      },
      {
        "id": "6e9f51c1-6b45-440f-af5a-2abc96cd083d",
        "categoryName": "Sleeping Bags",
        "name": "Vareno Sleeping Bag (6') Turmeric",
        "price": 120,
        "closeout": true,
        "manufacturer": {
          "name": "Vareno"
        },
        "tags": [
          { "name": "Color Group: Yellow" },
          { "name": "Bag Shape: Mummy" }
        ]
      }
    ]
    ```

    > [!NOTE]
    > The JSON items typically include additional fields that are managed by Azure Cosmos DB. These fields include, but are not limited to:
    >
    > - `_rid`
    > - `_self`
    > - `_etag`
    > - `_ts`
    >
    > For this article, these fields are removed to make the output shorter and easier to understand.

- This query returns the items where the `categoryName` field matches `Sleeping Bags`. Since it's a `SELECT *` query, the output of the query is the complete JSON item. For more information about `SELECT` syntax, see [`SELECT` statement](select.md). This query also uses the shorter `p` alias for the container.

    ```sql
    SELECT *
    FROM products p
    WHERE p.categoryName = "Sleeping Bags"
    ```

    The query results are:

    ```json
    [
      {
        "id": "6e9f51c1-6b45-440f-af5a-2abc96cd083d",
        "categoryName": "Sleeping Bags",
        "name": "Vareno Sleeping Bag (6') Turmeric",
        "price": 120,
        "closeout": true,
        "manufacturer": {
          "name": "Vareno"
        },
        "tags": [
          { "name": "Color Group: Yellow" },
          { "name": "Bag Shape: Mummy" }
        ]
      }
    ]
    ```

- This next query uses a different filter and then reformats the JSON output into a different shape. The query projects a new JSON object with three fields: `name`, `manufacturer.name` and `sku`. This example uses various aliases including `product` and `vendor` to reshape the output object into a format our application can use.

    ```sql
    SELECT {
      "name": p.name,
      "sku": p.sku,
      "vendor": p.manufacturer.name
    } AS product
    FROM products p
    WHERE p.sku = "teapo-surfboard-72109"
    ```

    The query results are:

    ```json
    [
      {
        "product": {
          "name": "Teapo Surfboard (6'10\") Grape",
          "sku": "teapo-surfboard-72109",
          "vendor": "Taepo"
        }
      }
    ]
    ```

- You can also flatten custom JSON results by using `SELECT VALUE`.

    ```sql
    SELECT VALUE {
      "name": p.name,
      "sku": p.sku,
      "vendor": p.manufacturer.name
    }
    FROM products p
    WHERE p.sku = "teapo-surfboard-72109"
    ```

    The query results are:

    ```json
    [
      {
        "name": "Teapo Surfboard (6'10\") Grape",
        "sku": "teapo-surfboard-72109",
        "vendor": "Taepo"
      }
    ]
    ```

- Finally, this last query returns all of the tags by using the `JOIN` keyword. For more information, see [`JOIN` keyword](join.md). This query only returns keywords for products manufactured by `Taepo`.

    ```sql
    SELECT t.name
    FROM products p
    JOIN t in p.tags
    WHERE p.manufacturer.name = "Taepo"
    ```

    The results are:

    ```json
    [
      { "name": "Tail Shape: Swallow" },
      { "name": "Color Group: Purple" }
    ]
    ```

## Wrapping up

The examples in this article show several aspects of the Azure Cosmos DB query language:  

- API for NoSQL works on JSON values. The API deals with tree-shaped entities instead of rows and columns. You can refer to the tree nodes at any arbitrary depth, like `Node1.Node2.Node3…..Nodem`, similar to the two-part reference of `<table>.<column>` in ANSI SQL.
- Because the query language works with schemaless data, the type system must be bound dynamically. The same expression could yield different types on different items. The result of a query is a valid JSON value, but isn't guaranteed to be of a fixed schema.  
- Azure Cosmos DB supports strict JSON items only. The type system and expressions are restricted to deal only with JSON types. For more information, see the [JSON specification](https://www.json.org/).  
- A container is a schema-free collection of JSON items. Containment implicitly captures relations within and across container items, not by primary key and foreign key relations. This feature is important for the intra-item joins. For more information, see [`JOIN` keyword](join.md).

## Next steps

- Explore a few query features:
  - [`SELECT` clause](select.md)
  - [`JOIN` keyword](join.md)
  - [Subqueries](subquery.md)
