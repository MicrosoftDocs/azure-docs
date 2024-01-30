---
title: Create an item in Azure Cosmos DB for Table using .NET
description: Learn how to create an item in your Azure Cosmos DB for Table account using the .NET SDK
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: table
ms.devlang: csharp
ms.topic: how-to
ms.date: 07/06/2022
ms.custom: devx-track-csharp, ignite-2022, devguide-csharp, cosmos-db-dev-journey, devx-track-dotnet
---

# Create an item in Azure Cosmos DB for Table using .NET

[!INCLUDE[Table](../includes/appliesto-table.md)]

Items in Azure Cosmos DB represent a specific entity stored within a table. In the API for Table, an item consists of a set of key-value pairs uniquely identified by the composite of the row and partition keys.

## Create a unique identifier for an item

The unique identifier, programmatically known as the **** is a distinct string that identifies an item within a table. Each item also includes a **partition key** value that is used to determine the logical partition for the item. Both keys are required when creating a new item within a table.

Within the scope of a table, two items can't share both the same **row key** and **partition key**.

## Create an item

The [``TableEntity``](/dotnet/api/azure.data.tables.tableentity) class is a generic implementation of a dictionary that is uniquely designed to make it easy to create a new item from an arbitrary dictionary of key-value pairs.

Use one of the following strategies to model items that you wish to create in a table:

- [Create an instance of the ``TableEntity`` class](#use-a-built-in-class)
- [Implement the ``ITableEntity`` interface](#implement-interface)

### Use a built-in class

The [``(string rowKey, string partitionKey)`` constructor](/dotnet/api/azure.data.tables.tableentity.-ctor#azure-data-tables-tableentity-ctor(system-string-system-string)) of the **TableEntity** class is a quick way to create an item with just the required properties. You can then use the [``Add``](/dotnet/api/azure.data.tables.tableentity.add) method to add extra key-value pairs to the item.

For example, you can create a new instance of the **TableEntity** class by first specifying the **row** and **partition** keys in the constructor and then adding new key-value pairs to the dictionary:

:::code language="csharp" source="~/azure-cosmos-db-table-dotnet-v12/250-create-item-tableentity/Program.cs" id="create_object_add" highlight="3-4,8-10,13":::

The [``(IDictionary<string, object>)`` constructor](/dotnet/api/azure.data.tables.tableentity.-ctor#azure-data-tables-tableentity-ctor(system-collections-generic-idictionary((system-string-system-object)))) of the **TableEntity** class converts an existing dictionary into an item ready to be added to a table.

For example, you can pass in a dictionary to a new instance of the **TableEntity** class:

:::code language="csharp" source="~/azure-cosmos-db-table-dotnet-v12/250-create-item-tableentity/Program.cs" id="create_object_dictionary" highlight="2-9,13,17":::

The [``TableClient.AddEntityAsync<>``](/dotnet/api/azure.data.tables.tableclient.addentityasync#azure-data-tables-tableclient-addentityasync-1(-0-system-threading-cancellationtoken)) method takes in a parameter of type **TableEntity** and then creates a server-side item in the table.

### Implement interface

> [!NOTE]
> The examples in this section assume that you have already defined a C# type to represent your data named **Product**:
>
> :::code language="csharp" source="~/azure-cosmos-db-table-dotnet-v12/251-create-item-itableentity/Product.cs" id="type":::
>

The [``TableClient.AddEntityAsync<>``](/dotnet/api/azure.data.tables.tableclient.addentityasync#azure-data-tables-tableclient-addentityasync-1(-0-system-threading-cancellationtoken)) method takes in a parameter of any type that implements the [``ITableEntity`` interface](/dotnet/api/azure.data.tables.itableentity). The interface already includes the required ``RowKey`` and ``PartitionKey`` properties.

For example, you can create a new object that implements at least all of the required properties in the **ITableEntity** interface:

:::code language="csharp" source="~/azure-cosmos-db-table-dotnet-v12/251-create-item-itableentity/Program.cs" id="create_object" highlight="4-5":::

You can then pass this object to the **AddEntityAsync``<>``** method creating a server-side item:

:::code language="csharp" source="~/azure-cosmos-db-table-dotnet-v12/251-create-item-itableentity/Program.cs" id="create_item" highlight="2":::

## Next steps

Now that you've created various items, use the next guide to read an item.

> [!div class="nextstepaction"]
> [Read an item](how-to-dotnet-read-item.md)
