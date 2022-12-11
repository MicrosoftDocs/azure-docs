---
title: Get started with Azure Cosmos DB for MongoDB using .NET
description: Get started developing a .NET application that works with Azure Cosmos DB for MongoDB. This article helps you learn how to set up a project and configure access to an Azure Cosmos DB for MongoDB database.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb
ms.devlang: csharp
ms.topic: how-to
ms.date: 10/17/2022
ms.custom: devx-track-dotnet, ignite-2022, devguide-csharp, cosmos-db-dev-journey
---

# Get started with Azure Cosmos DB for MongoDB using .NET

[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

This article shows you how to connect to Azure Cosmos DB for MongoDB using .NET Core and the relevant NuGet packages. Once connected, you can perform operations on databases, collections, and documents.

> [!NOTE]
> The [example code snippets](https://github.com/Azure-Samples/cosmos-db-mongodb-api-dotnet-samples) are available on GitHub as a .NET Core project.

[API for MongoDB reference documentation](https://docs.mongodb.com/drivers/csharp) | [MongoDB Package (NuGet)](https://www.nuget.org/packages/MongoDB.Driver)

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- [.NET 6.0](https://dotnet.microsoft.com/download)
- [Azure Command-Line Interface (CLI)](/cli/azure/) or [Azure PowerShell](/powershell/azure/)
- [Azure Cosmos DB for MongoDB resource](quickstart-dotnet.md#create-an-azure-cosmos-db-account)

## Create a new .NET Core app

1. Create a new .NET Core application in an empty folder using your preferred terminal. For this scenario, you'll use a console application. Use the [``dotnet new``](/dotnet/core/tools/dotnet-new) command to create and name the console app.

    ```console
    dotnet new console -o app
    ```

2. Add the [MongoDB](https://www.nuget.org/packages/MongoDB.Driver) NuGet package to the console project. Use the [``dotnet add package``](/dotnet/core/tools/dotnet-add-package) command specifying the name of the NuGet package.

    ```console
    dotnet add package MongoDB.Driver
    ```

3. To run the app, use a terminal to navigate to the application directory and run the application.

    ```console
    dotnet run
    ```

## Connect to Azure Cosmos DB for MongoDB with the MongoDB native driver

To connect to Azure Cosmos DB with the MongoDB native driver, create an instance of the [``MongoClient``](https://mongodb.github.io/mongo-csharp-driver/2.17/apidocs/html/T_MongoDB_Driver_MongoClient.htm) class. This class is the starting point to perform all operations against MongoDb databases. The most common constructor for **MongoClient** accepts a connection string, which you can retrieve using the following steps:

## Get resource name

### [Azure CLI](#tab/azure-cli)

[!INCLUDE [Azure CLI - get resource name](<./includes/azure-cli-get-resource-name.md>)]

### [PowerShell](#tab/azure-powershell)

[!INCLUDE [Powershell - set resource name](<./includes/powershell-set-resource-name.md>)]

### [Portal](#tab/azure-portal)

Skip this step and use the information for the portal in the next step.

---

## Retrieve your connection string

### [Azure CLI](#tab/azure-cli)

[!INCLUDE [Azure CLI - get connection string](<./includes/azure-cli-get-connection-string.md>)]

### [PowerShell](#tab/azure-powershell)

[!INCLUDE [Powershell - get connection string](<./includes/powershell-get-connection-string.md>)]

### [Portal](#tab/azure-portal)

> [!TIP]
> For this guide, we recommend using the resource group name ``msdocs-cosmos``.

[!INCLUDE [Portal - get connection string](<./includes/portal-get-connection-string-from-sign-in.md>)]

---

## Configure environment variables

[!INCLUDE [Multitab - store connection string in environment variable](<./includes/environment-variables-connection-string.md>)]

## Create MongoClient with connection string

Define a new instance of the ``MongoClient`` class using the constructor and the connection string variable you set previously.

:::code language="csharp" source="~/azure-cosmos-mongodb-dotnet/101-manage-connection/program.cs" id="client_credentials":::

## Use the MongoDB client classes with Azure Cosmos DB for API for MongoDB

[!INCLUDE [Conceptual object model](<./includes/conceptual-object-model.md>)]

Each type of resource is represented by one or more associated C# classes. Here's a list of the most common classes:

| Class | Description |
|---|---|
|[``MongoClient``](https://mongodb.github.io/mongo-csharp-driver/2.16/apidocs/html/T_MongoDB_Driver_MongoClient.htm)|This class provides a client-side logical representation for the API for MongoDB layer on Azure Cosmos DB. The client object is used to configure and execute requests against the service.|
|[``MongoDatabase``](https://mongodb.github.io/mongo-csharp-driver/2.16/apidocs/html/T_MongoDB_Driver_MongoDatabase.htm)|This class is a reference to a database that may, or may not, exist in the service yet. The database is validated or created server-side when you attempt to perform an operation against it.|
|[``Collection``](https://mongodb.github.io/mongo-csharp-driver/2.16/apidocs/html/T_MongoDB_Driver_MongoCollection.htm)|This class is a reference to a collection that also may not exist in the service yet. The collection is validated server-side when you attempt to work with it.|

The following guides show you how to use each of these classes to build your application and manage data.

**Guide**:

- [Manage databases](how-to-dotnet-manage-databases.md)  
- [Manage collections](how-to-dotnet-manage-collections.md)
- [Manage documents](how-to-dotnet-manage-documents.md)
- [Use queries to find documents](how-to-dotnet-manage-queries.md)

## See also

- [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.Cosmos)
- [API reference](https://docs.mongodb.com/drivers/csharp)

## Next steps

Now that you've connected to an API for MongoDB account, use the next guide to create and manage databases.

> [!div class="nextstepaction"]
> [Create a database in Azure Cosmos DB for MongoDB using .NET](how-to-dotnet-manage-databases.md)
