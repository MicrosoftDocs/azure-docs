---
title: Query documents in Azure Cosmos DB MongoDB API using .NET
description: Learn how to query documents in your Azure Cosmos DB MongoDB API database using the .NET SDK.
author: alexwolfmsft
ms.author: alexwolf
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.devlang: dotnet
ms.topic: how-to
ms.date: 07/22/2022
ms.custom: devx-track-dotnet
---

# Query documents in Azure Cosmos DB MongoDB API using .NET

[!INCLUDE[appliesto-mongodb-api](../includes/appliesto-mongodb-api.md)]

Use queries to find documents in a collection.

> [!NOTE]
> The [example code snippets](https://github.com/Azure-Samples/cosmos-db-mongodb-api-dotnet-samples) are available on GitHub as a .NET project.

[MongoDB API reference documentation](https://docs.mongodb.com/drivers/node) | [MongoDB Package (NuGet)](https://www.nuget.org/packages/MongoDB.Driver)

## Query for documents

To find documents, use a query filter on the collection to define how the documents are found. 

* [MongoClient.Database.Collection.Find](https://www.mongodb.com/docs/manual/reference/method/db.collection.find/)
* [FilterDefinition](https://mongodb.github.io/mongo-csharp-driver/2.17/apidocs/html/T_MongoDB_Driver_FilterDefinition_1.htm)
* [FilterDefinitionBuilder](https://mongodb.github.io/mongo-csharp-driver/2.17/apidocs/html/T_MongoDB_Driver_FilterDefinitionBuilder_1.htm)

:::code language="csharp" source="~/azure-cosmos-mongodb-dotnet/125-manage-queries/program.cs" id="query_documents":::

## See also

- [Get started with Azure Cosmos DB MongoDB API and .NET](how-to-dotnet-get-started.md)
- [Create a database](how-to-dotnet-manage-databases.md)
