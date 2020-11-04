---
title: Getting started with SQL queries in Azure Cosmos DB
description: Learn how to use SQL queries to query data from Azure Cosmos DB. You can upload sample data to a container in Azure Cosmos DB and query it. 
author: timsander1
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: conceptual
ms.date: 11/04/2020
ms.author: tisande

---
# Getting started with SQL queries
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

In Azure Cosmos DB SQL API accounts, there are two ways to read data:

**Point reads** - You can do a key/value lookup on a single *item ID* and partition key. The *item ID* and partition key combination is the key and the item itself is the value. For a 1 KB document, point reads typically cost 1 [request unit](request-units.md) with a latency under 10 ms. Point reads return a single item.

Here are some examples of how to do **Point reads** with each SDK:

- [.NET SDK](/dotnet/api/microsoft.azure.cosmos.container.readitemasync?preserve-view=true&view=azure-dotnet)
- [Java SDK](/java/api/com.azure.cosmos.cosmoscontainer.readitem?preserve-view=true&view=azure-java-stable#com_azure_cosmos_CosmosContainer__T_readItem_java_lang_String_com_azure_cosmos_models_PartitionKey_com_azure_cosmos_models_CosmosItemRequestOptions_java_lang_Class_T__)
- [Node.js SDK](/javascript/api/@azure/cosmos/item?preserve-view=true&view=azure-node-latest#read-requestoptions-)
- [Python SDK](/python/api/azure-cosmos/azure.cosmos.containerproxy?preserve-view=true&view=azure-python#read-item-item--partition-key--populate-query-metrics-none--post-trigger-include-none----kwargs-)

**SQL queries** - You can query data by writing queries using the Structured Query Language (SQL) as a JSON query language. Queries always cost at least 2.3 request units and, in general, will have a higher and more variable latency than point reads. Queries can return many items.

Most read-heavy workloads on Azure Cosmos DB use a combination of both point reads and SQL queries. If you just need to read a single item, point reads are cheaper and faster than queries. Point reads don't need to use the query engine to access data and can read the data directly. Of course, it's not possible for all workloads to exclusively read data using point reads, so support of SQL as a query language and [schema-agnostic indexing](index-overview.md) provide a more flexible way to access your data.

Here are some examples of how to do **SQL queries** with each SDK:

- [.NET SDK](https://docs.microsoft.com/dotnet/api/microsoft.azure.cosmos.container.getitemqueryiterator?view=azure-dotnet)
- [Java SDK](https://docs.microsoft.com/java/api/com.azure.cosmos.cosmoscontainer.queryitems?view=azure-java-stable)
- [Node.js SDK](https://docs.microsoft.com/javascript/api/@azure/cosmos/queryiterator?view=azure-node-latest)
- [Python SDK](https://docs.microsoft.com/python/api/azure-cosmos/azure.cosmos.containerproxy?preserve-view=true&view=azure-python#query-items-query--parameters-none--partition-key-none--enable-cross-partition-query-none--max-item-count-none--enable-scan-in-query-none--populate-query-metrics-none----kwargs-)

The remainder of this doc shows how to get started writing SQL queries in Azure Cosmos DB. SQL queries can be run through either the SDK or Azure portal.

## Upload sample data

In your SQL API Cosmos DB account, open the [Data Explorer](https://docs.microsoft.com/azure/cosmos-db/data-explorer) to create a container called `Families`. After the container is created, use the data structures browser, or menu, to find and open the container you just created. In your container, you will see the `Items` option. Open this option and you'll see a button in the center of the screen to create a 'New Item'. You will use this option to create the 2 JSON items below.

### Create JSON items

The following JSON items are documents about the Andersen and Wakefield families. They include parents, children and their pets, address, and registration information. 

The first item has strings, numbers, Booleans, arrays, and nested properties:

```json
{
  "id": "AndersenFamily",
  "lastName": "Andersen",
  "parents": [
     { "firstName": "Thomas" },
     { "firstName": "Mary Kay"}
  ],
  "children": [
     {
         "firstName": "Henriette Thaulow",
         "gender": "female",
         "grade": 5,
         "pets": [{ "givenName": "Fluffy" }]
     }
  ],
  "address": { "state": "WA", "county": "King", "city": "Seattle" },
  "creationDate": 1431620472,
  "isRegistered": true
}
```

The second item uses `givenName` and `familyName` instead of `firstName` and `lastName`:

```json
{
  "id": "WakefieldFamily",
  "parents": [
      { "familyName": "Wakefield", "givenName": "Robin" },
      { "familyName": "Miller", "givenName": "Ben" }
  ],
  "children": [
      {
        "familyName": "Merriam",
        "givenName": "Jesse",
        "gender": "female",
        "grade": 1,
        "pets": [
            { "givenName": "Goofy" },
            { "givenName": "Shadow" }
        ]
      },
      {
        "familyName": "Miller",
         "givenName": "Lisa",
         "gender": "female",
         "grade": 8 }
  ],
  "address": { "state": "NY", "county": "Manhattan", "city": "NY" },
  "creationDate": 1431620462,
  "isRegistered": false
}
```

### Query the JSON items

Try a few queries against the JSON data to understand some of the key aspects of Azure Cosmos DB's SQL query language.

The following query returns the items where the `id` field matches `AndersenFamily`. Since it's a `SELECT *` query, the output of the query is the complete JSON item. For more information about SELECT syntax, see [SELECT statement](sql-query-select.md).

```sql
    SELECT *
    FROM Families f
    WHERE f.id = "AndersenFamily"
```

The query results are:

```json
    [{
        "id": "AndersenFamily",
        "lastName": "Andersen",
        "parents": [
           { "firstName": "Thomas" },
           { "firstName": "Mary Kay"}
        ],
        "children": [
           {
               "firstName": "Henriette Thaulow", "gender": "female", "grade": 5,
               "pets": [{ "givenName": "Fluffy" }]
           }
        ],
        "address": { "state": "WA", "county": "King", "city": "Seattle" },
        "creationDate": 1431620472,
        "isRegistered": true
    }]
```

The following query reformats the JSON output into a different shape. The query projects a new JSON `Family` object with two selected fields, `Name` and `City`, when the address city is the same as the state. "NY, NY" matches this case.

```sql
    SELECT {"Name":f.id, "City":f.address.city} AS Family
    FROM Families f
    WHERE f.address.city = f.address.state
```

The query results are:

```json
    [{
        "Family": {
            "Name": "WakefieldFamily",
            "City": "NY"
        }
    }]
```

The following query returns all the given names of children in the family whose `id` matches `WakefieldFamily`, ordered by city.

```sql
    SELECT c.givenName
    FROM Families f
    JOIN c IN f.children
    WHERE f.id = 'WakefieldFamily'
    ORDER BY f.address.city ASC
```

The results are:

```json
    [
      { "givenName": "Jesse" },
      { "givenName": "Lisa"}
    ]
```

## Remarks

The preceding examples show several aspects of the Cosmos DB query language:  

* Since SQL API works on JSON values, it deals with tree-shaped entities instead of rows and columns. You can refer to the tree nodes at any arbitrary depth, like `Node1.Node2.Node3…..Nodem`, similar to the two-part reference of `<table>.<column>` in ANSI SQL.

* Because the query language works with schemaless data, the type system must be bound dynamically. The same expression could yield different types on different items. The result of a query is a valid JSON value, but isn't guaranteed to be of a fixed schema.  

* Azure Cosmos DB supports strict JSON items only. The type system and expressions are restricted to deal only with JSON types. For more information, see the [JSON specification](https://www.json.org/).  

* A Cosmos container is a schema-free collection of JSON items. The relations within and across container items are implicitly captured by containment, not by primary key and foreign key relations. This feature is important for the intra-item joins discussed later in this article.

## Next steps

- [Introduction to Azure Cosmos DB](introduction.md)
- [Azure Cosmos DB .NET samples](https://github.com/Azure/azure-cosmos-dotnet-v3)
- [SELECT clause](sql-query-select.md)
