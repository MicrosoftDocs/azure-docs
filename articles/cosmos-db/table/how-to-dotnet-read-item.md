---
title: Read an item in Azure Cosmos DB for Table using .NET
description: Learn how to read an item in your Azure Cosmos DB for Table account using the .NET SDK
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: table
ms.devlang: csharp
ms.topic: how-to
ms.date: 07/06/2022
ms.custom: devx-track-csharp, ignite-2022, devguide-csharp, cosmos-db-dev-journey, devx-track-dotnet
---

# Read an item in Azure Cosmos DB for Table using .NET

[!INCLUDE[Table](../includes/appliesto-table.md)]

Items in Azure Cosmos DB represent a specific entity stored within a table. In the API for Table, an item consists of a set of key-value pairs uniquely identified by the composite of the row and partition keys.

## Reading items using the composite key

Every item in Azure Cosmos DB for Table has a unique identifier specified by the composite of the **row** and **partition** keys. These composite keys are stored as the ``RowKey`` and ``PartitionKey`` properties respectively. Within the scope of a table, two items can't share the same unique identifier composite.

Azure Cosmos DB requires both the unique identifier and the partition key value of an item to perform a read of the item. Specifically, providing the composite key will perform a quick *point read* of that item with a predictable cost in request units (RUs).

## Read an item

To perform a point read of an item, use one of the following strategies:

- [Return a ``TableEntity`` object using ``GetEntityAsync<>``](#read-an-item-using-a-built-in-class)
- [Return an object of your own type using ``GetEntityAsync<>``](#read-an-item-using-your-own-type)

### Read an item using a built-in class

The following example point reads a single item asynchronously and returns the results deserialized into a dictionary using the built-in [``TableEntity``](/dotnet/api/azure.data.tables.tableentity) type:

:::code language="csharp" source="~/azure-cosmos-db-table-dotnet-v12/275-read-item-tableentity/Program.cs" id="read_item" highlight="3-4":::

The [``TableClient.GetEntityAsync<TableEntity>``](/dotnet/api/azure.data.tables.tableclient.getentityasync) method reads an item and returns an object of type [``Response<TableEntity>``](/dotnet/api/azure.response-1). The **Response\<\>** type contains an implicit conversion operator to convert the object into a **TableEntity`` object.

### Read an item using your own type

> [!NOTE]
> The examples in this section assume that you have already defined a C# type to represent your data named **Product**:
>
> :::code language="csharp" source="~/azure-cosmos-db-table-dotnet-v12/276-read-item-itableentity/Product.cs" id="type":::
>

The following example point reads a single item asynchronously and returns a deserialized item using the provided generic type:

:::code language="csharp" source="~/azure-cosmos-db-table-dotnet-v12/276-read-item-itableentity/Program.cs" id="read_item" highlight="3-4":::

> [!IMPORTANT]
> The generic type you use with the **TableClient.GetEntityAsync\<\>** method must implement the [``ITableEntity`` interface](/dotnet/api/azure.data.tables.itableentity).

The [``TableClient.GetEntityAsync<>``](/dotnet/api/azure.data.tables.tableclient.getentityasync) method reads an item and returns an object of type [``Response<>``](/dotnet/api/azure.response-1). The **Response\<\>** type contains an implicit conversion operator to convert the object into the generic type. To learn more about implicit operators, see [user-defined conversion operators](/dotnet/csharp/language-reference/operators/user-defined-conversion-operators).

## Next steps

Now that you've read various items, try one of our tutorials on querying Azure Cosmos DB for Table data.

> [!div class="nextstepaction"]
> [Query Azure Cosmos DB by using the API for Table](tutorial-query.md)
