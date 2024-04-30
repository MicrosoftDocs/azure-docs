---
title: Quickstart - Azure Cosmos DB for MongoDB for .NET with MongoDB driver
description: Learn how to build a .NET app to manage Azure Cosmos DB for MongoDB account resources in this quickstart.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb
ms.devlang: csharp
ms.topic: quickstart
ms.date: 07/06/2022
ms.custom: devx-track-csharp, mode-api, devguide-csharp, cosmos-db-dev-journey, devx-track-azurecli, devx-track-dotnet, devx-track-extended-azdevcli
zone_pivot_groups: azure-cosmos-db-quickstart-env
---

# Quickstart: Azure Cosmos DB for MongoDB for .NET with the MongoDB driver

[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

Get started with MongoDB to create databases, collections, and docs within your Azure Cosmos DB resource. Follow these steps to deploy a minimal solution to your environment using the Azure Developer CLI.

[API for MongoDB reference documentation](https://www.mongodb.com/docs/drivers/csharp) | [MongoDB Package (NuGet)](https://www.nuget.org/packages/MongoDB.Driver)
packages/Microsoft.Azure.Cosmos) | [Azure Developer CLI](/azure/developer/azure-developer-cli/overview)

## Prerequisites

[!INCLUDE [Developer Quickstart prerequisites](../nosql/includes/quickstart/dev-prereqs.md)]

## Setting up

Deploy this project's development container to your environment. Then, use the Azure Developer CLI (`azd`) to create an Azure Cosmos DB for MongoDB account and deploy a containerized sample application. The sample application uses the client library to manage, create, read, and query sample data.

::: zone pivot="devcontainer-codespace"

[![Open in GitHub Codespaces](https://img.shields.io/static/v1?style=for-the-badge&label=GitHub+Codespaces&message=Open&color=brightgreen&logo=github)](https://codespaces.new/azure-samples/cosmos-db-mongodb-dotnet-quickstart?template=false&quickstart=1&azure-portal=true)

::: zone-end

::: zone pivot="devcontainer-vscode"

[![Open in Dev Container](https://img.shields.io/static/v1?style=for-the-badge&label=Dev+Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/azure-samples/cosmos-db-mongodb-dotnet-quickstart)

::: zone-end

[!INCLUDE [dev-setup](../nosql/includes/quickstart/dev-setup.md)]

---

### Install the client library

The client library is available through NuGet, as the `Microsoft.Azure.Cosmos` package.

1. Open a terminal and navigate to the `/src/web` folder.

    ```bash
    cd ./src/web
    ```

1. If not already installed, install the `MongoDb.Driver` package using `dotnet add package`.

    ```bash
    dotnet add package MongoDb.Driver
    ```

1. Also, install the `Azure.Identity` package if not already installed.

    ```bash
    dotnet add package Azure.Identity
    ```

## Object model

Before you start building the application, let's look into the hierarchy of resources in Azure Cosmos DB. Azure Cosmos DB has a specific object model used to create and access resources. The Azure Cosmos DB creates resources in a hierarchy that consists of accounts, databases, collections, and docs.

:::image type="complex" source="media/quickstart-dotnet/resource-hierarchy.png" alt-text="Diagram of the Azure Cosmos DB hierarchy including accounts, databases, collections, and docs.":::
    Hierarchical diagram showing an Azure Cosmos DB account at the top. The account has two child database shards. One of the database shards includes two child collection shards. The other database shard includes a single child collection shard. That single collection shard has three child doc shards.
:::image-end:::

You'll use the following MongoDB classes to interact with these resources:

- [``MongoClient``](https://mongodb.github.io/mongo-csharp-driver/2.16/apidocs/html/T_MongoDB_Driver_MongoClient.htm) - This class provides a client-side logical representation for the API for MongoDB layer on Azure Cosmos DB. The client object is used to configure and execute requests against the service.
- [``MongoDatabase``](https://mongodb.github.io/mongo-csharp-driver/2.16/apidocs/html/T_MongoDB_Driver_MongoDatabase.htm) - This class is a reference to a database that may, or may not, exist in the service yet. The database is validated server-side when you attempt to access it or perform an operation against it.
- [``Collection``](https://mongodb.github.io/mongo-csharp-driver/2.16/apidocs/html/T_MongoDB_Driver_MongoCollection.htm) - This class is a reference to a collection that also may not exist in the service yet. The collection is validated server-side when you attempt to work with it.

## Code examples

- [Authenticate the client](#authenticate-the-client)
- [Create a database](#create-a-database)
- [Create a container](#create-a-collection)
- [Create an item](#create-an-item)
- [Get an item](#get-an-item)
- [Query items](#query-items)

The sample code demonstrated in this article creates a database named ``adventureworks`` with a collection named ``products``. The ``products`` collection is designed to contain product details such as name, category, quantity, and a sale indicator. Each product also contains a unique identifier.

### Authenticate the client

From the project directory, open the *Program.cs* file. In your editor, add a using directive for ``MongoDB.Driver``.

:::code language="csharp" source="~/azure-cosmos-mongodb-dotnet/001-quickstart/Program.cs" id="using_directives":::

Define a new instance of the ``MongoClient`` class using the constructor, and [``Environment.GetEnvironmentVariable``](/dotnet/api/system.environment.getenvironmentvariables) to read the connection string you set earlier.

:::code language="csharp" source="~/azure-cosmos-mongodb-dotnet/001-quickstart/Program.cs"  id="client_credentials":::

### Create a database

Use the [``MongoClient.GetDatabase``](https://mongodb.github.io/mongo-csharp-driver/2.16/apidocs/html/M_MongoDB_Driver_MongoClient_GetDatabase.htm) method to create a new database if it doesn't already exist. This method will return a reference to the existing or newly created database.

:::code language="csharp" source="~/azure-cosmos-mongodb-dotnet/001-quickstart/Program.cs" id="new_database" :::

### Create a collection

The [``MongoDatabase.GetCollection``](https://mongodb.github.io/mongo-csharp-driver/2.16/apidocs/html/M_MongoDB_Driver_MongoDatabase_GetCollection.htm) will create a new collection if it doesn't already exist and return a reference to the collection.

:::code language="csharp" source="~/azure-cosmos-mongodb-dotnet/001-quickstart/Program.cs" id="new_collection":::

### Create an item

The easiest way to create a new item in a collection is to create a C# [class](/dotnet/csharp/language-reference/keywords/class) or [record](/dotnet/csharp/language-reference/builtin-types/record) type with all of the members you want to serialize into JSON. In this example, the C# record has a unique identifier, a *category* field for the partition key, and extra *name*, *quantity*, and *sale* fields.

```csharp
public record Product(
    string Id,
    string Category,
    string Name,
    int Quantity,
    bool Sale
);
```

Create an item in the collection using the `Product` record by calling [``IMongoCollection<TDocument>.InsertOne``](https://mongodb.github.io/mongo-csharp-driver/2.16/apidocs/html/M_MongoDB_Driver_IMongoCollection_1_InsertOne_1.htm).

:::code language="csharp" source="~/azure-cosmos-mongodb-dotnet/001-quickstart/Program.cs" id="new_item" :::

### Get an item

In Azure Cosmos DB, you can retrieve items by composing queries using Linq. In the SDK, call [``IMongoCollection.FindAsync<>``](https://mongodb.github.io/mongo-csharp-driver/2.16/apidocs/html/M_MongoDB_Driver_IMongoCollection_1_FindAsync__1.htm) and pass in a C# expression to filter the results.

:::code language="csharp" source="~/azure-cosmos-mongodb-dotnet/001-quickstart/Program.cs" id="read_item" :::

### Query items

After you insert an item, you can run a query to get all items that match a specific filter by treating the collection as an `IQueryable`. This example uses an expression to filter products by category. Once the call to `AsQueryable`  is made, call [``MongoQueryable.Where``](https://mongodb.github.io/mongo-csharp-driver/2.16/apidocs/html/M_MongoDB_Driver_Linq_MongoQueryable_Where__1.htm) to retrieve a set of filtered items.

:::code language="csharp" source="~/azure-cosmos-mongodb-dotnet/001-quickstart/Program.cs" id="query_items" :::

## Run the code

This app creates an Azure Cosmos DB MongoDb API database and collection. The example then creates an item and then reads the exact same item back. Finally, the example creates a second item and then performs a query that should return multiple items. With each step, the example outputs metadata to the console about the steps it has performed.

To run the app, use a terminal to navigate to the application directory and run the application.

```dotnetcli
dotnet run
```

The output of the app should be similar to this example:

```output
Single product name: 
Yamba Surfboard
Multiple products:
Yamba Surfboard
Sand Surfboard
```

## Clean up resources

When you no longer need the Azure Cosmos DB for MongoDB account, you can delete the corresponding resource group.

### [Azure CLI / Resource Manager template](#tab/azure-cli)

Use the [``az group delete``](/cli/azure/group#az-group-delete) command to delete the resource group.

```azurecli-interactive
az group delete --name $resourceGroupName
```

### [PowerShell](#tab/azure-powershell)

Use the [``Remove-AzResourceGroup``](/powershell/module/az.resources/remove-azresourcegroup) cmdlet to delete the resource group.

```azurepowershell-interactive
$parameters = @{
    Name = $RESOURCE_GROUP_NAME
}
Remove-AzResourceGroup @parameters
```

### [Portal](#tab/azure-portal)

1. Navigate to the resource group you previously created in the Azure portal.

    > [!TIP]
    > In this quickstart, we recommended the name ``msdocs-cosmos-quickstart-rg``.
1. Select **Delete resource group**.

   :::image type="content" source="media/quickstart-dotnet/delete-resource-group-option.png" lightbox="media/quickstart-dotnet/delete-resource-group-option.png" alt-text="Screenshot of the Delete resource group option in the navigation bar for a resource group.":::

1. On the **Are you sure you want to delete** dialog, enter the name of the resource group, and then select **Delete**.

   :::image type="content" source="media/quickstart-dotnet/delete-confirmation.png" lightbox="media/quickstart-dotnet/delete-confirmation.png" alt-text="Screenshot of the delete confirmation page for a resource group.":::

---
