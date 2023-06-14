---
title: Create a document in Azure Cosmos DB for MongoDB using .NET
description: Learn how to work with a document in your Azure Cosmos DB for MongoDB database using the .NET SDK.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb
ms.devlang: csharp
ms.topic: how-to
ms.date: 07/22/2022
ms.custom: devx-track-dotnet, ignite-2022, devguide-csharp, cosmos-db-dev-journey
---

# Manage a document in Azure Cosmos DB for MongoDB using .NET

[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

Manage your MongoDB documents with the ability to insert, update, and delete documents.

> [!NOTE]
> The [example code snippets](https://github.com/Azure-Samples/cosmos-db-mongodb-api-dotnet-samples) are available on GitHub as a .NET project.

[API for MongoDB reference documentation](https://docs.mongodb.com/drivers/node) | [MongoDB Package (NuGet)](https://www.nuget.org/packages/MongoDB.Driver)

## Insert a document

Insert one or many documents, defined with a JSON schema, into your collection.

- [MongoClient.Database.Collection.InsertOne](https://mongodb.github.io/mongo-csharp-driver/2.17/apidocs/html/M_MongoDB_Driver_IMongoCollection_1_InsertOne_1.htm)
- [MongoClient.Database.Collection.InsertMany](https://mongodb.github.io/mongo-csharp-driver/2.17/apidocs/html/M_MongoDB_Driver_IMongoCollection_1_InsertMany_1.htm)

:::code language="csharp" source="~/azure-cosmos-mongodb-dotnet/115-manage-documents/program.cs" id="insert_document":::

## Update a document

To update a document, specify the query filter used to find the document along with a set of properties of the document that should be updated.

- [MongoClient.Database.Collection.UpdateOne](https://mongodb.github.io/mongo-csharp-driver/2.17/apidocs/html/M_MongoDB_Driver_IMongoCollection_1_UpdateOne_1.htm)
- [MongoClient.Database.Collection.UpdateMany](https://mongodb.github.io/mongo-csharp-driver/2.17/apidocs/html/M_MongoDB_Driver_IMongoCollection_1_UpdateMany_1.htm)

:::code language="csharp" source="~/azure-cosmos-mongodb-dotnet/115-manage-documents/program.cs" id="update_document":::

## Bulk updates to a collection

You can perform several different types of operations at once with the **bulkWrite** operation. Learn more about how to [optimize bulk writes for Azure Cosmos DB](optimize-write-performance.md#tune-for-the-optimal-batch-size-and-thread-count).

The following bulk operations are available:

- [MongoClient.Database.Collection.BulkWrite](https://mongodb.github.io/mongo-csharp-driver/2.17/apidocs/html/M_MongoDB_Driver_IMongoCollection_1_BulkWrite_1.htm)

  - insertOne

  - updateOne

  - updateMany

  - deleteOne
  
  - deleteMany

:::code language="csharp" source="~/azure-cosmos-mongodb-dotnet/115-manage-documents/program.cs" id="bulk_write":::

## Delete a document

To delete documents, use a query to define how the documents are found.

- [MongoClient.Database.Collection.DeleteOne](https://mongodb.github.io/mongo-csharp-driver/2.17/apidocs/html/M_MongoDB_Driver_IMongoCollection_1_DeleteOne_1.htm)
- [MongoClient.Database.Collection.DeleteMany](https://mongodb.github.io/mongo-csharp-driver/2.17/apidocs/html/M_MongoDB_Driver_IMongoCollection_1_DeleteMany_1.htm)

:::code language="csharp" source="~/azure-cosmos-mongodb-dotnet/115-manage-documents/program.cs" id="delete_document":::

## See also

- [Get started with Azure Cosmos DB for MongoDB and JavaScript](how-to-javascript-get-started.md)
- [Create a database](how-to-javascript-manage-databases.md)
