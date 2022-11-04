---
title: Create a container in Azure Cosmos DB for NoSQL using .NET
description: Learn how to create a container in your Azure Cosmos DB for NoSQL database using the .NET SDK.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: csharp
ms.topic: how-to
ms.date: 07/06/2022
ms.custom: devx-track-csharp
---

# Create a container in Azure Cosmos DB for NoSQL using .NET

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

Containers in Azure Cosmos DB store sets of items. Before you can create, query, or manage items, you must first create a container.

## Name a container

In Azure Cosmos DB, a container is analogous to a table in a relational database. When you create a container, the container name forms a segment of the URI used to access the container resource and any child items.

Here are some quick rules when naming a container:

* Keep container names between 3 and 63 characters long
* Container names can only contain lowercase letters, numbers, or the dash (-) character.
* Container names must start with a lowercase letter or number.

Once created, the URI for a container is in this format:

``https://<cosmos-account-name>.documents.azure.com/dbs/<database-name>/colls/<container-name>``

## Create a container

To create a container, call one of the following methods:

* [``CreateContainerAsync``](#create-a-container-asynchronously)
* [``CreateContainerIfNotExistsAsync``](#create-a-container-asynchronously-if-it-doesnt-already-exist)

### Create a container asynchronously

The following example creates a container asynchronously:

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/226-create-container-options/Program.cs" id="create_container" highlight="2":::

The [``Database.CreateContainerAsync``](/dotnet/api/microsoft.azure.cosmos.database.createcontainerasync) method will throw an exception if a database with the same name already exists.

### Create a container asynchronously if it doesn't already exist

The following example creates a container asynchronously only if it doesn't already exist on the account:

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/226-create-container-options/Program.cs" id="create_container_check" highlight="2":::

The [``Database.CreateContainerIfNotExistsAsync``](/dotnet/api/microsoft.azure.cosmos.database.createcontainerifnotexistsasync) method will only create a new container if it doesn't already exist. This method is useful for avoiding errors if you run the same code multiple times.

## Parsing the response

In all examples so far, the response from the asynchronous request was cast immediately to the [``Container``](/dotnet/api/microsoft.azure.cosmos.container) type. You may want to parse metadata about the response including headers and the HTTP status code. The true return type for the **Database.CreateContainerAsync** and **Database.CreateContainerIfNotExistsAsync** methods is [``ContainerResponse``](/dotnet/api/microsoft.azure.cosmos.containerresponse).

The following example shows the **Database.CreateContainerIfNotExistsAsync** method returning a **ContainerResponse**. Once returned, you can parse response properties and then eventually get the underlying **Container** object:

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/226-create-container-options/Program.cs" id="create_container_response" highlight="2,6":::

## Next steps

Now that you've create a container, use the next guide to create items.

> [!div class="nextstepaction"]
> [Create an item](how-to-dotnet-create-item.md)
