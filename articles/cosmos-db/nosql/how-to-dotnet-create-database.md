---
title: Create a database in Azure Cosmos DB for NoSQL using .NET
description: Learn how to create a database in your Azure Cosmos DB for NoSQL account using the .NET SDK.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: csharp
ms.topic: how-to
ms.date: 08/02/2023
ms.custom: devx-track-csharp, devguide-csharp, cosmos-db-dev-journey, devx-track-dotnet
---

# Create a database in Azure Cosmos DB for NoSQL using .NET

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

Databases in Azure Cosmos DB are units of management for one or more containers. Before you can create or manage containers, you must first create a database.

## Name a database

In Azure Cosmos DB, a database is analogous to a namespace. When you create a database, the database name forms a segment of the URI used to access the database resource and any child resources.

Here are some quick rules when naming a database:

- Database names must not be empty.
- Database names can't be longer than 256 characters.

Once created, the URI for a database is in this format:

``https://<cosmos-account-name>.documents.azure.com/dbs/<database-name>``

> [!TIP]
> For more information on database name limits, see [service quotas and limits](../concepts-limits.md)

## Create a database

To create a database, call one of the following methods:

- [``CreateDatabaseAsync``](#create-a-database-asynchronously)
- [``CreateDatabaseIfNotExistsAsync``](#create-a-database-asynchronously-if-it-doesnt-already-exist)

### Create a database asynchronously

The following example creates a database asynchronously:

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/201-create-database-options/Program.cs" id="create_database" highlight="2":::

The [``CosmosClient.CreateDatabaseAsync``](/dotnet/api/microsoft.azure.cosmos.cosmosclient.createdatabaseasync) method throws an exception if a database with the same name already exists.

### Create a database asynchronously if it doesn't already exist

The following example creates a database asynchronously only if it doesn't already exist on the account:

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/201-create-database-options/Program.cs" id="create_database_check" highlight="2":::

The [``CosmosClient.CreateDatabaseIfNotExistsAsync``](/dotnet/api/microsoft.azure.cosmos.cosmosclient.createdatabaseifnotexistsasync) method only creates a new database if it doesn't already exist. This method is useful for avoiding errors if you run the same code multiple times.

## Parsing the response

In all examples so far, the response from the asynchronous request was cast immediately to the [``Database``](/dotnet/api/microsoft.azure.cosmos.database) type. You may want to parse metadata about the response including headers and the HTTP status code. The true return type for the **CosmosClient.CreateDatabaseAsync** and **CosmosClient.CreateDatabaseIfNotExistsAsync** methods is [``DatabaseResponse``](/dotnet/api/microsoft.azure.cosmos.databaseresponse).

The following example shows the **CosmosClient.CreateDatabaseIfNotExistsAsync** method returning a **DatabaseResponse**. Once returned, you can parse response properties and then eventually get the underlying **Database** object:

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/201-create-database-options/Program.cs" id="create_database_response" highlight="2,6":::

## Next steps

Now that you've created a database, use the next guide to create containers.

> [!div class="nextstepaction"]
> [Create a container](how-to-dotnet-create-container.md)
