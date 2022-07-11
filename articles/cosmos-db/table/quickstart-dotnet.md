---
title: Quickstart - Azure Cosmos DB Table API for .NET
description: Learn how to build a .NET app to manage Azure Cosmos DB Table API resources in this quickstart.
author: alexwolfmsft
ms.author: alexwolf
ms.service: cosmos-db
ms.subservice: cosmosdb-table
ms.devlang: dotnet
ms.topic: quickstart
ms.date: 06/24/2022
ms.custom: devx-track-dotnet
---

# Quickstart: Azure Cosmos DB Table API for .NET
[!INCLUDE[appliesto-table-api](../includes/appliesto-table-api.md)]

This quickstart shows how to get started with the Azure Cosmos DB Table API from a .NET application. The Cosmos DB Table API is a schemaless data store allowing applications to store structured NoSQL data in the cloud. You'll learn how to create tables, rows, and perform basic tasks within your Cosmos DB resource using the the [Azure.Data.Tables Package (NuGet)](https://www.nuget.org/packages/Azure.Data.Tables/).

> [!NOTE]
> The [example code snippets](https://github.com/Azure-Samples/cosmos-db-table-api-dotnet-samples) are available on GitHub as a .NET project.

[Table API reference documentation](/azure/storage/tables) | [Azure.Data.Tables Package (NuGet)](https://www.nuget.org/packages/Azure.Data.Tables/)

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
* [.NET 6.0](https://dotnet.microsoft.com/en-us/download)
* [Azure Command-Line Interface (CLI)](/cli/azure/) or [Azure PowerShell](/powershell/azure/)

### Prerequisite check

* In a terminal or command window, run ``dotnet --list-sdks`` to check that .NET 6.x is one of the available versions.
* Run ``az --version`` (Azure CLI) or ``Get-Module -ListAvailable AzureRM`` (Azure PowerShell) to check that you have the appropriate Azure command-line tools installed.

## Setting up

This section walks you through how to create an Azure Cosmos account and set up a project that uses the Table API NuGet packages. 

### Create an Azure Cosmos DB account

This quickstart will create a single Azure Cosmos DB account using the Table API.

#### [Azure CLI](#tab/azure-cli)

[!INCLUDE [azure-cli-create-resource-group-and-resource](./includes/quickstart-dotnet/azure-cli-create-resource-group-and-resource.md)]

#### [PowerShell](#tab/azure-powershell)

[!INCLUDE [Powershell - create resource group and resources](<./includes/quickstart-dotnet/powershell-create-resource-group-and-resource.md>)]

#### [Portal](#tab/azure-portal)

[!INCLUDE [Portal - create resource](<./includes/quickstart-dotnet/portal-create-resource.md>)]

---

### Get Table API connection string

#### [Azure CLI](#tab/azure-cli)

[!INCLUDE [Azure CLI - get connection string](<./includes/quickstart-dotnet/azure-cli-get-connection-string.md>)]

#### [PowerShell](#tab/azure-powershell)

[!INCLUDE [Powershell - get connection string](<./includes/quickstart-dotnet/powershell-get-connection-string.md>)]

#### [Portal](#tab/azure-portal)

[!INCLUDE [Portal - get connection string](<./includes/quickstart-dotnet/portal-get-connection-string-from-resource.md>)]

---

### Create a new .NET app

Create a new .NET application in an empty folder using your preferred terminal. Use the [``dotnet new console``](/dotnet/core/tools/dotnet-newt) to create a new console app. 

```console
dotnet new console -output <app-name>
```

### Install the NuGet package

Add the [Azure.Data.Tables](https://www.nuget.org/packages/Azure.Data.Tables) NuGet package to the new .NET project. Use the [``dotnet add package``](/dotnet/core/tools/dotnet-add-package) command specifying the name of the NuGet package.

```console
dotnet add package Azure.Data.Tables
```

### Configure environment variables

[!INCLUDE [Multi-tab](<./includes/quickstart-dotnet/environment-variables-connection-string.md>)]

## Code examples

* [Authenticate the client](#authenticate-the-client)
* [Create a table](#create-a-table)
* [Create an item](#create-an-item)
* [Get an item](#get-an-item)
* [Query items](#query-items)

The sample code described in this article creates a table named ``adventureworks``. Each table row contains the details of a product such as name, category, quantity, and a sale indicator. Each product also contains a unique identifier.

You'll use the following Table API classes to interact with these resources:

- [``TableClient``](/dotnet/api/azure.data.tables.tableclient) - This class provides a client-side logical representation for working with tables on Cosmos DB. The client object is used to configure and execute requests against the service.
- [``TableEntity``](/dotnet/api/azure.data.tables.tableentity) - This class is a reference to a row in a table that allows you to manage properties and column data.

### Authenticate the client

From the project directory, open the *Program.cs* file. In your editor, add a using directive for ``Azure.Data.Tables``.

:::code language="csharp" source="~/azure-cosmos-tableapi-dotnet/001-quickstart/Program.cs" id="using_directives":::

Define a new instance of the ``TableClient`` class using the constructor, and [``Environment.GetEnvironmentVariable``](/dotnet/api/system.environment.getenvironmentvariables) to read the connection string you set earlier.

:::code language="csharp" source="~/azure-cosmos-tableapi-dotnet/001-quickstart/Program.cs"  id="client_credentials":::

### Create a table

Use the [``TableClient.CreateIfNotExistsAsync``](/dotnet/api/azure.data.tables.tableclient.createifnotexistsasync)) method to create a new table if it doesn't already exist. This method will return a reference to the existing or newly created table.

:::code language="csharp" source="~/azure-cosmos-tableapi-dotnet/001-quickstart/Program.cs" id="create_table" :::

### Create an item

The easiest way to create a new item in a table is to create a new object using the [``TableEntity``](/dotnet/api/azure.data.tables.tableentity) type. You can then add properties to the object to populate columns of data in that table row. 

Create an item in the collection using the `TableEntity` by calling [``TableClient.AddEntityAsync<T>``](/dotnet/api/azure.data.tables.tableclient.addentityasync). 

:::code language="csharp" source="~/azure-cosmos-tableapi-dotnet/001-quickstart/Program.cs" id="create_object_add" :::

### Get an item

Tou can retrieve a specific item from a table using the [``TableEntity.GetEntityAsync<T>``](/dotnet/api/azure.data.tables.tableclient.getentity) method. Provide the `partitionKey` and `rowKey` as parameters to identify the correct row.

:::code language="csharp" source="~/azure-cosmos-tableapi-dotnet/001-quickstart/Program.cs" id="read_item" :::

### Query items

After you insert an item, you can also run a query to get all items that match a specific filter by using the `TableClient.Query<T>` method. This example uses an expression to filter products by category.

:::code language="csharp" source="~/azure-cosmos-tableapi-dotnet/001-quickstart/Program.cs" id="query_items" :::

## Run the code

This app creates an Azure Cosmos Table API table. The example then creates an item and then reads the exact same item back. Finally, the example creates a second item and then performs a query that should returns multiple items. With each step, the example outputs metadata to the console about the steps it has performed.

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

When you no longer need the Azure Cosmos DB SQL API account, you can delete the corresponding resource group.

### [Azure CLI](#tab/azure-cli)

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

   :::image type="content" source="media/dotnet-quickstart/delete-resource-group-option.png"  alt-text="Screenshot of the Delete resource group option in the navigation bar for a resource group.":::

1. On the **Are you sure you want to delete** dialog, enter the name of the resource group, and then select **Delete**.

   :::image type="content" source="media/dotnet-quickstart/delete-confirmation.png" alt-text="Screenshot of the delete confirmation page for a resource group.":::

---

## Next steps

In this quickstart, you learned how to create an Azure Cosmos DB Table API account, create a table, and create entries using the .NET SDK. You can now dive deeper into the SDK to import more data, perform complex queries, and manage your Azure Cosmos DB Table API resources.

> [!div class="nextstepaction"]
> [Get started with Azure Cosmos DB Table API and .NET](/azure/cosmos-db/table/how-to-dotnet-get-started)

You can also see Blob storage sample apps and further explore .NET using these resources:

- [Azure Blob Storage SDK v12 .NET samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs/samples)
- For tutorials, samples, quick starts and other .NET on Azure documentation, visit [Azure for .NET and .NET Core developers](/dotnet/azure/).
- To learn more about .NET Core specifically, see [Get started with .NET in 10 minutes](https://dotnet.microsoft.com/learn/dotnet/hello-world-tutorial/intro).