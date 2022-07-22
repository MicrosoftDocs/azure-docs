---
title: Manage a MongoDB database using .NET
description: Learn how to manage your Cosmos DB resource when it provides the MongoDB API with a .NET SDK.
author: alexwolfmsft
ms.author: alexwolf
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.devlang: dotnet
ms.topic: how-to
ms.date: 07/22/2022
ms.custom: devx-track-dotnet
---

# Manage a MongoDB database using .NET

[!INCLUDE[appliesto-mongodb-api](../includes/appliesto-mongodb-api.md)]

Your MongoDB server in Azure Cosmos DB is available from the common NuGet packages for MongoDB such as:

* [MongoDB](https://www.nuget.org/packages/MongoDB.Driver)

> [!NOTE]
> The [example code snippets](https://github.com/Azure-Samples/cosmos-db-mongodb-api-dotnet-samples) are available on GitHub as a .NET project.

[MongoDB API reference documentation](https://docs.mongodb.com/drivers/node) | [MongoDB Package (NuGet)](https://www.nuget.org/packages/MongoDB.Driver)

## Name a database

In Azure Cosmos DB, a database is analogous to a namespace. When you create a database, the database name forms a segment of the URI used to access the database resource and any child resources.

Here are some quick rules when naming a database:

* Keep database names between 3 and 63 characters long
* Database names can only contain lowercase letters, numbers, or the dash (-) character.
* Database names must start with a lowercase letter or number.

Once created, the URI for a database is in this format:

``https://<cosmos-account-name>.documents.azure.com/dbs/<database-name>``

## Create a database instance

You can use the `MongoClient` to get an instance of a database, or create one if it doesn't exist already. The `MongoDatabase` class provides access to collections and their documents.

* [MongoClient](https://mongodb.github.io/mongo-csharp-driver/2.16/apidocs/html/T_MongoDB_Driver_MongoClient.htm)
* [MongoClient.Database](https://mongodb.github.io/mongo-csharp-driver/2.16/apidocs/html/T_MongoDB_Driver_MongoDatabase.htm)

The following code snippet creates a new database by inserting a document into a collection. Remember, the database will not be created until it is needed for this type of operation.

:::code language="dotnet" source="~/samples-cosmosdb-mongodb-dotnet/105-manage-databases/program.cs" id="create_database":::

## Get an existing database

You can also retrieve an existing database by name to access its collections and documents.

:::code language="dotnet" source="~/samples-cosmosdb-mongodb-dotnet/105-manage-databases/program.cs" id="get_database":::

## Get a list of all databases

You can also easily retrieve a list of all the databases on the server using the `MongoClient`. This technique can also be used to check if a database already exists.

* [MongoClient.Database.ListDatabaseNames](https://mongodb.github.io/node-mongodb-native/4.7/classes/Db.html)

:::code language="dotnet" source="~/samples-cosmosdb-mongodb-dotnet/105-manage-databases/program.cs" id="get_all_databases":::

## Drop a database

A database is removed from the server using the `DropDatabase` method on the DB class. 

* [MongoClient.DropDatabase](https://mongodb.github.io/mongo-csharp-driver/2.17/apidocs/html/M_MongoDB_Driver_MongoClient_DropDatabase_1.htm)

:::code language="dotnet" source="~/samples-cosmosdb-mongodb-dotnet/105-manage-databases/program.cs" id="drop_database":::

## See also

- [Get started with Azure Cosmos DB MongoDB API and .NET](how-to-dotnet-get-started.md)
- Work with a collection](how-to-dotnet-manage-collections.md)
