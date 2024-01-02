---
title: Read an item in Azure Cosmos DB for NoSQL using .NET
description: Learn how to point read a specific item in your Azure Cosmos DB for NoSQL container using the .NET SDK.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: csharp
ms.topic: how-to
ms.date: 12/16/2022
ms.custom: devx-track-csharp, devguide-csharp, cosmos-db-dev-journey, devx-track-dotnet
---

# Read an item in Azure Cosmos DB for NoSQL using .NET

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

Items in Azure Cosmos DB represent a specific entity stored within a container. In the API for NoSQL, an item consists of JSON-formatted data with a unique identifier.

## Reading items with unique identifiers

Every item in Azure Cosmos DB for NoSQL has a unique identifier specified by the ``id`` property. Within the scope of a container, two items can't share the same unique identifier. However, Azure Cosmos DB requires both the unique identifier and the partition key value of an item to perform a quick *point read* of that item. If only the unique identifier is available, you would have to perform a less efficient [query](how-to-dotnet-query-items.md) to look up the item across multiple logical partitions. To learn more about point reads and queries, see [optimize request cost for reading data](../optimize-cost-reads-writes.md#reading-data-point-reads-and-queries).

## Read an item

> [!NOTE]
> The examples in this article assume that you have already defined a C# type to represent your data named **Product**:
>
> :::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/275-read-item/Product.cs" id="type" :::
>

To perform a point read of an item, call one of the following methods:

- [``ReadItemAsync<>``](#read-an-item-asynchronously)
- [``ReadItemStreamAsync<>``](#read-an-item-as-a-stream-asynchronously)
- [``ReadManyItemsAsync<>``](#read-multiple-items-asynchronously)

## Read an item asynchronously

The following example point reads a single item asynchronously and returns a deserialized item using the provided generic type:

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/275-read-item/Program.cs" id="read_item" :::

The [``Database.ReadItemAsync<>``](/dotnet/api/microsoft.azure.cosmos.container.readitemasync) method reads an item and returns an object of type [``ItemResponse<>``](/dotnet/api/microsoft.azure.cosmos.itemresponse-1). The **ItemResponse<>** type inherits from the [``Response<>``](/dotnet/api/microsoft.azure.cosmos.response-1) type, which contains an implicit conversion operator to convert the object into the generic type. To learn more about implicit operators, see [user-defined conversion operators](/dotnet/csharp/language-reference/operators/user-defined-conversion-operators).

Alternatively, you can return the **ItemResponse<>** generic type and explicitly get the resource. The more general **ItemResponse<>** type also contains useful metadata about the underlying API operation. In this example, metadata about the request unit charge for this operation is gathered using the **RequestCharge** property.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/275-read-item/Program.cs" id="read_item_expanded" :::

## Read an item as a stream asynchronously

This example reads an item as a data stream directly:

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/275-read-item/Program.cs" id="read_item_stream" :::

The [``Container.ReadItemStreamAsync``](/dotnet/api/microsoft.azure.cosmos.container.readitemstreamasync) method returns the item as a [``Stream``](/dotnet/api/system.io.stream) without deserializing the contents.

If you aren't planning to deserialize the items directly, using the stream APIs can improve performance by handing off the item as a stream directly to the next component of your application. For more tips on how to optimize the SDK for high performance scenarios, see [SDK performance tips](performance-tips-dotnet-sdk-v3.md#sdk-usage).

## Read multiple items asynchronously

In this example, a list of tuples containing unique identifier and partition key pairs are used to look up and retrieve multiple items:

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/275-read-item/Program.cs" id="read_multiple_items" :::

[``Container.ReadManyItemsAsync<>``](/dotnet/api/microsoft.azure.cosmos.container.readmanyitemsasync) returns a list of items based on the unique identifiers and partition keys you provide. This operation is meant to perform better latency-wise than a query with `IN` statements to fetch a large number of independent items.

## Next steps

Now that you've read various items, use the next guide to query items.

> [!div class="nextstepaction"]
> [Query items](how-to-dotnet-query-items.md)
