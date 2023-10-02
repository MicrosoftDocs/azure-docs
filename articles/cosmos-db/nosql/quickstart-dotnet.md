---
title: Quickstart - Azure Cosmos DB for NoSQL client library for .NET
description: Learn how to build a .NET app to manage Azure Cosmos DB for NoSQL account resources in this quickstart.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: csharp
ms.topic: quickstart
ms.date: 11/07/2022
ms.custom: devx-track-csharp, ignite-2022, devguide-csharp, cosmos-db-dev-journey, passwordless-dotnet, devx-track-azurecli, devx-track-dotnet
---

# Quickstart: Azure Cosmos DB for NoSQL client library for .NET

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

[!INCLUDE[Quickstart selector](includes/quickstart-selector.md)]

Get started with the Azure Cosmos DB client library for .NET to create databases, containers, and items within your account. Follow these steps to install the package and try out example code for basic tasks.

> [!NOTE]
> The [example code snippets](https://github.com/azure-samples/cosmos-db-nosql-dotnet-samples) are available on GitHub as a .NET project.

[API reference documentation](/dotnet/api/microsoft.azure.cosmos) | [Library source code](https://github.com/Azure/azure-cosmos-dotnet-v3) | [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.Cosmos) | [Samples](samples-dotnet.md)

## Prerequisites

- An Azure account with an active subscription.
  - No Azure subscription? You can [try Azure Cosmos DB free](../try-free.md) with no credit card required.
- [.NET 6.0 or later](https://dotnet.microsoft.com/download)
- [Azure Command-Line Interface (CLI)](/cli/azure/) or [Azure PowerShell](/powershell/azure/)

### Prerequisite check

- In a terminal or command window, run ``dotnet --version`` to check that the .NET SDK is version 6.0 or later.
- Run ``az --version`` (Azure CLI) or ``Get-Module -ListAvailable AzureRM`` (Azure PowerShell) to check that you have the appropriate Azure command-line tools installed.

## Setting up

This section walks you through creating an Azure Cosmos DB account and setting up a project that uses Azure Cosmos DB for NoSQL client library for .NET to manage resources.

### <a id="create-account"></a>Create an Azure Cosmos DB account

> [!TIP]
> No Azure subscription? You can [try Azure Cosmos DB free](../try-free.md) with no credit card required. If you create an account using the free trial, you can safely skip ahead to the [Create a new .NET app](#create-a-new-net-app) section.

[!INCLUDE [Create resource tabbed conceptual - ARM, Azure CLI, PowerShell, Portal](./includes/create-resources.md)]

### Create a new .NET app

Create a new .NET application in an empty folder using your preferred terminal. Use the [``dotnet new``](/dotnet/core/tools/dotnet-new) command specifying the **console** template.

```dotnetcli
dotnet new console
```

### Install the package

Add the [Microsoft.Azure.Cosmos](https://www.nuget.org/packages/Microsoft.Azure.Cosmos) NuGet package to the .NET project. Use the [``dotnet add package``](/dotnet/core/tools/dotnet-add-package) command specifying the name of the NuGet package.

```dotnetcli
dotnet add package Microsoft.Azure.Cosmos
```

Build the project with the [``dotnet build``](/dotnet/core/tools/dotnet-build) command.

```dotnetcli
dotnet build
```

Make sure that the build was successful with no errors. The expected output from the build should look something like this:

```output
  Determining projects to restore...
  All projects are up-to-date for restore.
  dslkajfjlksd -> C:\Users\sidandrews\Demos\dslkajfjlksd\bin\Debug\net6.0\dslkajfjlksd.dll

Build succeeded.
    0 Warning(s)
    0 Error(s)
```

### Configure environment variables

[!INCLUDE [Create environment variables for key and endpoint](./includes/environment-variables.md)]

## Object model

[!INCLUDE [Explain DOCUMENT DB object model](./includes/object-model.md)]

You'll use the following .NET classes to interact with these resources:

- [``CosmosClient``](/dotnet/api/microsoft.azure.cosmos.cosmosclient) - This class provides a client-side logical representation for the Azure Cosmos DB service. The client object is used to configure and execute requests against the service.
- [``Database``](/dotnet/api/microsoft.azure.cosmos.database) - This class is a reference to a database that may, or may not, exist in the service yet. The database is validated server-side when you attempt to access it or perform an operation against it.
- [``Container``](/dotnet/api/microsoft.azure.cosmos.container) - This class is a reference to a container that also may not exist in the service yet. The container is validated server-side when you attempt to work with it.
- [``QueryDefinition``](/dotnet/api/microsoft.azure.cosmos.querydefinition) - This class represents a SQL query and any query parameters.
- [``FeedIterator<>``](/dotnet/api/microsoft.azure.cosmos.feediterator-1) - This class represents an iterator that can track the current page of results and get a new page of results.
- [``FeedResponse<>``](/dotnet/api/microsoft.azure.cosmos.feedresponse-1) - This class represents a single page of responses from the iterator. This type can be iterated over using a ``foreach`` loop.

## Code examples

- [Authenticate the client](#authenticate-the-client)
- [Create a database](#create-a-database)
- [Create a container](#create-a-container)
- [Create an item](#create-an-item)
- [Get an item](#get-an-item)
- [Query items](#query-items)

The sample code described in this article creates a database named ``cosmicworks`` with a container named ``products``. The ``products`` table is designed to contain product details such as name, category, quantity, and a sale indicator. Each product also contains a unique identifier.

For this sample code, the container will use the category as a logical partition key.

### Authenticate the client

[!INCLUDE [passwordless-overview](../../../includes/passwordless/passwordless-overview.md)]

## [Passwordless (Recommended)](#tab/passwordless)

[!INCLUDE [dotnet-default-azure-credential-overview](../../../includes/passwordless/dotnet-default-azure-credential-overview.md)]

[!INCLUDE [cosmos-nosql-create-assign-roles](../../../includes/passwordless/cosmos-nosql/cosmos-nosql-create-assign-roles.md)]

## Authenticate using DefaultAzureCredential

[!INCLUDE [default-azure-credential-sign-in](../../../includes/passwordless/default-azure-credential-sign-in.md)]

You can authenticate to Cosmos DB for NoSQL using `DefaultAzureCredential` by adding the `Azure.Identity` NuGet package to your application. `DefaultAzureCredential` will automatically discover and use the account you signed-in with in the previous step.

```dotnetcli
dotnet add package Azure.Identity
```

From the project directory, open the `Program.cs` file. In your editor, add using directives for the ``Microsoft.Azure.Cosmos`` and `Azure.Identity` namespaces.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/002-quickstart-passwordless/Program.cs" id="using_directives":::

Define a new instance of the ``CosmosClient`` class using the constructor, and [``Environment.GetEnvironmentVariable``](/dotnet/api/system.environment.getenvironmentvariable) to read the `COSMOS_ENDPOINT` environment variable you created earlier.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/002-quickstart-passwordless/Program.cs" id="client_credentials" highlight="3-4":::

For more information on different ways to create a ``CosmosClient`` instance, see [Get started with Azure Cosmos DB for NoSQL and .NET](how-to-dotnet-get-started.md#connect-to-azure-cosmos-db-sql-api).

## [Connection String](#tab/connection-string)

From the project directory, open the `Program.cs` file. In your editor, add a using directive for ``Microsoft.Azure.Cosmos``.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/001-quickstart/Program.cs" id="using_directives":::

Define a new instance of the ``CosmosClient`` class using the constructor, and [``Environment.GetEnvironmentVariable``](/dotnet/api/system.environment.getenvironmentvariable) to read the two environment variables you created earlier.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/001-quickstart/Program.cs" id="client_credentials" highlight="3-4":::

For more information on different ways to create a ``CosmosClient`` instance, see [Get started with Azure Cosmos DB for NoSQL and .NET](how-to-dotnet-get-started.md#connect-to-azure-cosmos-db-sql-api).

---

### Create and query the database

Next you'll create a database and container to store products, and perform queries to insert and read those items.

## [Passwordless (Recommended)](#tab/passwordless)

The `Microsoft.Azure.Cosmos` client libraries enable you to perform *data* operations using [Azure RBAC](../role-based-access-control.md). However, to authenticate *management* operations such as creating and deleting databases you must use RBAC through one of the following options:

> - [Azure CLI scripts](manage-with-cli.md)
> - [Azure PowerShell scripts](manage-with-powershell.md)
> - [Azure Resource Manager templates (ARM templates)](manage-with-templates.md)
> - [Azure Resource Manager .NET client library](https://www.nuget.org/packages/Azure.ResourceManager.CosmosDB/)

The Azure CLI approach is used in this example. Use the [`az cosmosdb sql database create`](/cli/azure/cosmosdb/sql/database#az-cosmosdb-sql-database-create) and [`az cosmosdb sql container create`](/cli/azure/cosmosdb/sql/container#az-cosmosdb-sql-container-create) commands to create a Cosmos DB NoSQL database and container.

```azurecli
# Create a SQL API database
az cosmosdb sql database create 
    --account-name msdocs-cosmos-nosql
    --resource-group msdocs
    --name cosmicworks

# Create a SQL API container
az cosmosdb sql container create
    --account-name msdocs-cosmos-nosql 
    --resource-group msdocs
    --database-name cosmicworks
    --name products
```

After the resources have been created, use classes from the `Microsoft.Azure.Cosmos` client libraries to connect to and query the database.

### Get the database

Use the [``CosmosClient.GetDatabase``](/dotnet/api/microsoft.azure.cosmos.cosmosclient.getdatabase) method will return a reference to the specified database.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/002-quickstart-passwordless/Program.cs" id="new_database" highlight="2,4":::

### Get the container

The [``Database.GetContainer``](/dotnet/api/microsoft.azure.cosmos.database.getcontainer) will return a reference to the specified container.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/002-quickstart-passwordless/Program.cs" id="new_container" highlight="2,4":::

## [Connection String](#tab/connection-string)

### Create a database

Use the [``CosmosClient.CreateDatabaseIfNotExistsAsync``](/dotnet/api/microsoft.azure.cosmos.cosmosclient.createdatabaseifnotexistsasync) method to create a new database if it doesn't already exist. This method will return a reference to the existing or newly created database.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/002-quickstart-passwordless/Program.cs" id="new_database" highlight="3":::

For more information on creating a database, see [Create a database in Azure Cosmos DB for NoSQL using .NET](how-to-dotnet-create-database.md).


### Create a container

The [``Database.CreateContainerIfNotExistsAsync``](/dotnet/api/microsoft.azure.cosmos.database.createcontainerifnotexistsasync) will create a new container if it doesn't already exist. This method will also return a reference to the container.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/001-quickstart/Program.cs" id="new_container" highlight="3-5":::

For more information on creating a container, see [Create a container in Azure Cosmos DB for NoSQL using .NET](how-to-dotnet-create-container.md).

---

### Create an item

The easiest way to create a new item in a container is to first build a C# [class](/dotnet/csharp/language-reference/keywords/class) or [record](/dotnet/csharp/language-reference/builtin-types/record) type with all of the members you want to serialize into JSON. In this example, the C# record has a unique identifier, a *categoryId* field for the partition key, and extra *categoryName*, *name*, *quantity*, and *sale* fields.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/002-quickstart-passwordless/Product.cs" id="entity":::

Create an item in the container by calling [``Container.CreateItemAsync``](/dotnet/api/microsoft.azure.cosmos.container.createitemasync).

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/002-quickstart-passwordless/Program.cs" id="new_item" highlight="3-4,12":::

For more information on creating, upserting, or replacing items, see [Create an item in Azure Cosmos DB for NoSQL using .NET](how-to-dotnet-create-item.md).

### Get an item

In Azure Cosmos DB, you can perform a point read operation by using both the unique identifier (``id``) and partition key fields. In the SDK, call [``Container.ReadItemAsync<>``](/dotnet/api/microsoft.azure.cosmos.container.readitemasync) passing in both values to return a deserialized instance of your C# type.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/002-quickstart-passwordless/Program.cs" id="read_item" highlight="3-4":::

For more information about reading items and parsing the response, see [Read an item in Azure Cosmos DB for NoSQL using .NET](how-to-dotnet-read-item.md).

### Query items

After you insert an item, you can run a query to get all items that match a specific filter. This example runs the SQL query: ``SELECT * FROM products p WHERE p.categoryId = "61dba35b-4f02-45c5-b648-c6badc0cbd79"``. This example uses the **QueryDefinition** type and a parameterized query expression for the partition key filter. Once the query is defined, call [``Container.GetItemQueryIterator<>``](/dotnet/api/microsoft.azure.cosmos.container.getitemqueryiterator) to get a result iterator that will manage the pages of results. Then, use a combination of ``while`` and ``foreach`` loops to retrieve pages of results and then iterate over the individual items.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/002-quickstart-passwordless/Program.cs" id="query_items" highlight="3,5,16":::

## Run the code

This app creates an API for NoSQL database and container. The example then creates an item and then reads the exact same item back. Finally, the example issues a query that should only return that single item. With each step, the example outputs metadata to the console about the steps it has performed.

To run the app, use a terminal to navigate to the application directory and run the application.

```dotnetcli
dotnet run
```

The output of the app should be similar to this example:

```output
New database:   adventureworks
New container:  products
Created item:   68719518391     [gear-surf-surfboards]
```

## Clean up resources

[!INCLUDE [Clean up resources - Azure CLI, PowerShell, Portal](./includes/clean-up-resources.md)]

## Next steps

In this quickstart, you learned how to create an Azure Cosmos DB for NoSQL account, create a database, and create a container using the .NET SDK. You can now dive deeper into a tutorial where you manage your Azure Cosmos DB for NoSQL resources and data using a .NET console application.

> [!div class="nextstepaction"]
> [Tutorial: Develop a .NET console application with Azure Cosmos DB for NoSQL](tutorial-dotnet-console-app.md)
