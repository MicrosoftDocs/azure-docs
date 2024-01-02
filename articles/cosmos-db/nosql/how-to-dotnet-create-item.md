---
title: Create an item in Azure Cosmos DB for NoSQL using .NET
description: Learn how to create, upsert, or replace an item in your Azure Cosmos DB for NoSQL container using the .NET SDK.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: csharp
ms.topic: how-to
ms.date: 07/06/2022
ms.custom: devx-track-csharp, devguide-csharp, cosmos-db-dev-journey, devx-track-dotnet
---

# Create an item in Azure Cosmos DB for NoSQL using .NET

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

Items in Azure Cosmos DB represent a specific entity stored within a container. In the API for NoSQL, an item consists of JSON-formatted data with a unique identifier.

## Create a unique identifier for an item

The unique identifier is a distinct string that identifies an item within a container. The ``id`` property is the only required property when creating a new JSON document. For example, this JSON document is a valid item in Azure Cosmos DB:

```json
{
  "id": "unique-string-2309509"
}
```

Within the scope of a container, two items can't share the same unique identifier.

> [!IMPORTANT]
> The ``id`` property is case-sensitive. Properties named ``ID``, ``Id``, ``iD``, and ``_id`` will be treated as an arbitrary JSON property.

Once created, the URI for an item is in this format:

``https://<cosmos-account-name>.documents.azure.com/dbs/<database-name>/docs/<item-resource-identifier>``

When referencing the item using a URI, use the system-generated *resource identifier* instead of the ``id`` field. For more information about system-generated item properties in Azure Cosmos DB for NoSQL, see [properties of an item](../resource-model.md#properties-of-an-item)

## Create an item

> [!NOTE]
> The examples in this article assume that you have already defined a C# type to represent your data named **Product**:
>
> :::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/250-create-item/Product.cs" id="type" :::
>
> The examples also assume that you have already created a new object of type **Product** named **newItem**:
>
> :::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/250-create-item/Program.cs" id="create_object" :::
>

To create an item, call one of the following methods:

- [``CreateItemAsync<>``](#create-an-item-asynchronously)
- [``ReplaceItemAsync<>``](#replace-an-item-asynchronously)
- [``UpsertItemAsync<>``](#create-or-replace-an-item-asynchronously)

## Create an item asynchronously

The following example creates a new item asynchronously:

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/250-create-item/Program.cs" id="create_item" :::

The [``Container.CreateItemAsync<>``](/dotnet/api/microsoft.azure.cosmos.container.createitemasync) method will throw an exception if there's a conflict with the unique identifier of an existing item. To learn more about potential exceptions, see [``CreateItemAsync<>`` exceptions](/dotnet/api/microsoft.azure.cosmos.container.createitemasync#exceptions).

## Replace an item asynchronously

The following example replaces an existing item asynchronously:

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/250-create-item/Program.cs" id="replace_item" :::

The [``Container.ReplaceItemAsync<>``](/dotnet/api/microsoft.azure.cosmos.container.replaceitemasync) method requires the provided string for the ``id`` parameter to match the unique identifier of the ``item`` parameter.

## Create or replace an item asynchronously

The following example will create a new item or replace an existing item if an item already exists with the same unique identifier:

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/250-create-item/Program.cs" id="upsert_item" :::

The [``Container.UpsertItemAsync<>``](/dotnet/api/microsoft.azure.cosmos.container.upsertitemasync) method will use the unique identifier of the ``item`` parameter to determine if there's a conflict with an existing item and to replace the item appropriately.

## Next steps

Now that you've created various items, use the next guide to read an item.

> [!div class="nextstepaction"]
> [Read an item](how-to-dotnet-read-item.md)
