---
title: Create a table in Azure Cosmos DB for Table using .NET
description: Learn how to create a table in your Azure Cosmos DB for Table account using the .NET SDK
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: table
ms.devlang: csharp
ms.topic: how-to
ms.date: 07/06/2022
ms.custom: devx-track-csharp, ignite-2022, devguide-csharp, cosmos-db-dev-journey, devx-track-dotnet
---

# Create a table in Azure Cosmos DB for Table using .NET

[!INCLUDE[Table](../includes/appliesto-table.md)]

Tables in Azure Cosmos DB for Table are units of management for multiple items. Before you can create or manage items, you must first create a table.

## Name a table

In Azure Cosmos DB, a table is analogous to a table in a relational database.

> [!NOTE]
> With API for Table accounts, when you create your first table, a default database is automatically created in your Azure Cosmos DB account.

Here are some quick rules when naming a table:

- Keep table names between 3 and 63 characters long
- Table names can only contain lowercase letters, numbers, or the dash (-) character.
- Table names must start with a lowercase letter or number.

## Create a table

To create a table, call one of the following methods:

- [``CreateAsync``](#create-a-table-asynchronously)
- [``CreateIfNotExistsAsync``](#create-a-table-asynchronously-if-it-doesnt-already-exist)

### Create a table asynchronously

The following example creates a table asynchronously:

:::code language="csharp" source="~/azure-cosmos-db-table-dotnet-v12/201-create-table-options/Program.cs" id="create_table" highlight="3":::

The [``TableCient.CreateAsync``](/dotnet/api/azure.data.tables.tableclient.createasync) method will throw an exception if a database with the same name already exists.

### Create a table asynchronously if it doesn't already exist

The following example creates a table asynchronously only if it doesn't already exist on the account:

:::code language="csharp" source="~/azure-cosmos-db-table-dotnet-v12/201-create-table-options/Program.cs" id="create_table_check" highlight="3":::

The [``TableClient.CreateIfNotExistsAsync``](/dotnet/api/azure.data.tables.tableclient.createifnotexistsasync) method will only create a new table if it doesn't already exist. This method is useful for avoiding errors if you run the same code multiple times.

## Next steps

Now that you've created a table, use the next guide to create items.

> [!div class="nextstepaction"]
> [Create an item](how-to-dotnet-create-item.md)
