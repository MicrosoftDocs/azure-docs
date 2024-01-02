---
title: Get started with Azure Cosmos DB for Table using .NET
description: Get started developing a .NET application that works with Azure Cosmos DB for Table. This article helps you learn how to set up a project and configure access to an Azure Cosmos DB for Table endpoint.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: table
ms.devlang: csharp
ms.topic: how-to
ms.date: 07/06/2022
ms.custom: devx-track-csharp, ignite-2022, devguide-csharp, cosmos-db-dev-journey, devx-track-dotnet
---

# Get started with Azure Cosmos DB for Table using .NET

[!INCLUDE[Table](../includes/appliesto-table.md)]

This article shows you how to connect to Azure Cosmos DB for Table using the .NET SDK. Once connected, you can perform operations on tables and items.

[Package (NuGet)](https://www.nuget.org/packages/Azure.Data.Tables/) | [Samples](samples-dotnet.md) | [API reference](/dotnet/api/azure.data.tables) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/tables/Azure.Data.Tables) | [Give Feedback](https://github.com/Azure/azure-sdk-for-net/issues) |

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- Azure Cosmos DB for Table account. [Create a API for Table account](how-to-create-account.md).
- [.NET 6.0 or later](https://dotnet.microsoft.com/download)
- [Azure Command-Line Interface (CLI)](/cli/azure/) or [Azure PowerShell](/powershell/azure/)

## Set up your project

### Create the .NET console application

Create a new .NET application by using the [``dotnet new``](/dotnet/core/tools/dotnet-new) command with the **console** template.

```dotnetcli
dotnet new console
```

Import the [Azure.Data.Tables](https://www.nuget.org/packages/Azure.Data.Tables) NuGet package using the [``dotnet add package``](/dotnet/core/tools/dotnet-add-package) command.

```dotnetcli
dotnet add package Azure.Data.Tables
```

Build the project with the [``dotnet build``](/dotnet/core/tools/dotnet-build) command.

```dotnetcli
dotnet build
```

## Connect to Azure Cosmos DB for Table

To connect to the API for Table of Azure Cosmos DB, create an instance of the [``TableServiceClient``](/dotnet/api/azure.data.tables.tableserviceclient) class. This class is the starting point to perform all operations against tables. There are two primary ways to connect to an API for Table account using the **TableServiceClient** class:

- [Connect with a API for Table connection string](#connect-with-a-connection-string)

### Connect with a connection string

The most common constructor for **TableServiceClient** has a single parameter:

| Parameter | Example value | Description |
| --- | --- | --- |
| ``connectionString`` | ``COSMOS_CONNECTION_STRING`` environment variable | Connection string to the API for Table account |

#### Retrieve your account connection string

##### [Azure CLI](#tab/azure-cli)

1. Use the [``az cosmosdb list``](/cli/azure/cosmosdb#az-cosmosdb-list) command to retrieve the name of the first Azure Cosmos DB account in your resource group and store it in the *accountName* shell variable.

    ```azurecli-interactive
    # Retrieve most recently created account name
    accountName=$(
        az cosmosdb list \
            --resource-group $resourceGroupName \
            --query "[0].name" \
            --output tsv
    )
    ```

1. Find the *PRIMARY CONNECTION STRING* from the list of connection strings for the account with the [`az-cosmosdb-keys-list`](/cli/azure/cosmosdb/keys#az-cosmosdb-keys-list) command.

    ```azurecli-interactive
    az cosmosdb keys list \
        --resource-group $resourceGroupName \
        --name $accountName \
        --type "connection-strings" \
        --query "connectionStrings[?description == \`Primary Table Connection String\`] | [0].connectionString"
    ```

##### [PowerShell](#tab/azure-powershell)

1. Use the [``Get-AzCosmosDBAccount``](/powershell/module/az.cosmosdb/get-azcosmosdbaccount) cmdlet to retrieve the name of the first Azure Cosmos DB account in your resource group and store it in the *ACCOUNT_NAME* shell variable.

    ```azurepowershell-interactive
    # Retrieve most recently created account name
    $parameters = @{
        ResourceGroupName = $RESOURCE_GROUP_NAME
    }
    $ACCOUNT_NAME = (
        Get-AzCosmosDBAccount @parameters |
            Select-Object -Property Name -First 1
    ).Name
    ```

1. Find the *PRIMARY CONNECTION STRING* from the list of connection strings for the account with the [``Get-AzCosmosDBAccountKey``](/powershell/module/az.cosmosdb/get-azcosmosdbaccountkey) cmdlet.

    ```azurepowershell-interactive
    $parameters = @{
        ResourceGroupName = $RESOURCE_GROUP_NAME
        Name = $ACCOUNT_NAME
        Type = "ConnectionStrings"
    }    
    Get-AzCosmosDBAccountKey @parameters |
        Select-Object -Property "Primary Table Connection String" -First 1    
    ```

---

To use the **PRIMARY CONNECTION STRING** value within your .NET code, persist it to a new environment variable on the local machine running the application.

#### [Windows](#tab/windows)

```powershell
$env:COSMOS_CONNECTION_STRING = "<cosmos-account-PRIMARY-CONNECTION-STRING>"
```

#### [Linux / macOS](#tab/linux+macos)

```bash
export COSMOS_CONNECTION_STRING="<cosmos-account-PRIMARY-CONNECTION-STRING>"
```

---

#### Create TableServiceClient with connection string

Create a new instance of the **TableServiceClient** class with the ``COSMOS_CONNECTION_STRING`` environment variable as the only parameter.

:::code language="csharp" source="~/azure-cosmos-db-table-dotnet-v12/101-client-connection-string/Program.cs" id="connection_string" highlight="3":::

## Build your application

As you build your application, your code will primarily interact with four types of resources:

- The API for Table account, which is the unique top-level namespace for your Azure Cosmos DB data.

- Tables, which contain a set of individual items in your account.

- Items, which represent an individual item in your table.

The following diagram shows the relationship between these resources.

:::image type="complex" source="media/how-to-dotnet-get-started/resource-hierarchy.svg" alt-text="Diagram of the Azure Cosmos DB hierarchy including accounts, tables, and items." border="false":::
    Hierarchical diagram showing an Azure Cosmos DB account at the top. The account has two child table nodes. One of the table nodes includes two child items.
:::image-end:::

Each type of resource is represented by one or more associated .NET classes or interfaces. Here's a list of the most common types:

| Class | Description |
|---|---|
| [``TableServiceClient``](/dotnet/api/azure.data.tables.tableserviceclient) | This client class provides a client-side logical representation for the Azure Cosmos DB service. The client object is used to configure and execute requests against the service. |
| [``TableClient``](/dotnet/api/azure.data.tables.tableclient) | This client class is a reference to a table that may, or may not, exist in the service yet. The table is validated server-side when you attempt to access it or perform an operation against it. |
| [``ITableEntity``](/dotnet/api/azure.data.tables.itableentity) | This interface is the base interface for any items that are created in the table or queried from the table. This interface includes all required properties for items in the API for Table. |
| [``TableEntity``](/dotnet/api/azure.data.tables.tableentity) | This class is a generic implementation of the ``ITableEntity`` interface as a dictionary of key-value pairs. |

The following guides show you how to use each of these classes to build your application.

| Guide | Description |
|--|---|
| [Create a table](how-to-dotnet-create-table.md) | Create tables |
| [Create an item](how-to-dotnet-create-item.md) | Create items |
| [Read an item](how-to-dotnet-read-item.md) | Read items |

## See also

- [Package (NuGet)](https://www.nuget.org/packages/Azure.Data.Tables/)
- [Samples](samples-dotnet.md)
- [API reference](/dotnet/api/azure.data.tables)
- [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/tables/Azure.Data.Tables)
- [Give Feedback](https://github.com/Azure/azure-sdk-for-net/issues)

## Next steps

Now that you've connected to an API for Table account, use the next guide to create and manage tables.

> [!div class="nextstepaction"]
> [Create a table in Azure Cosmos DB for Table using .NET](how-to-dotnet-create-table.md)
