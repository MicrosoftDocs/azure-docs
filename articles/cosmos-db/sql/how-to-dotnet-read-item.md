---
title: Read an item in Azure Cosmos DB SQL API using .NET
description: Learn how to point read a specific item in your Azure Cosmos DB SQL API container using the .NET SDK.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: csharp
ms.topic: how-to
ms.date: 06/15/2022
ms.custom: devx-track-csharp
---

# Read an item in Azure Cosmos DB SQL API using .NET

[!INCLUDE[appliesto-sql-api](../includes/appliesto-sql-api.md)]

Items in Azure Cosmos DB represent a specific entity stored within a container. In the SQL API, an item consists of JSON-formatted data with a unique identifier.

## Reading items with unique identifiers

Every item in Azure Cosmos DB SQL API has a unique identifier specified by the ``id`` property. Within the scope of a container, two items can't share the same unique identifier. However, Azure Cosmos DB requires both the unique identifier and the partition key value of an item to perform a quick *point read* of that item. If only the unique identifier is available, you would have to perform a less efficient [query](how-to-dotnet-query-items.md) to lookup the item across multiple logical partitions. To learn more about point reads and queries, see [optimize request cost for reading data](../optimize-cost-reads-writes.md#reading-data-point-reads-and-queries).

## Read an item

> [!NOTE]
> The examples in this article assume that you have already defined a C# type to represent your data named **Product**:
>
> :::code language="csharp" source="~/azure-cosmos-dotnet-v3/275-read-item/Product.cs" id="type" :::
>

To perform a point read of an item, call one of the following methods:

* [``ReadItemAsync<>``](#read-an-item-asynchronously)
* [``ReadItemStreamAsync<>``](#read-an-item-as-a-stream-asynchronously)
* [``ReadManyItemsAsync<>``](#read-multiple-items-asynchronously)

## Read an item asynchronously



:::code language="csharp" source="~/azure-cosmos-dotnet-v3/275-read-item/Program.cs" id="" :::

## Read an item as a stream asynchronously



## Read multiple items asynchronously



## Next steps

Now that you've read various items, use the next guide to query items.

> [!div class="nextstepaction"]
> [Query items](how-to-dotnet-query-items.md)
