---
title: Migrate data using the desktop data migration tool
titleSuffix: Azure Cosmos DB
description: Use the desktop data migration tool to migrate data from JSON, MongoDB, SQL Server, or Azure Table storage to Azure Cosmos DB.
author: seesharprun
ms.author: sidandrews
ms.reviewer: markjbrown
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.date: 05/01/2023
---

# Migrate data to Azure Cosmos DB using the desktop data migration tool

[!INCLUDE[NoSQL, MongoDB, Table](includes/appliesto-nosql-mongodb-table.md)]

The [Azure Cosmos DB desktop data migration tool](https://github.com/azurecosmosdb/data-migration-desktop-tool) is an open-source command-line application to import or export data from Azure Cosmos DB. The tool can migrate data to and from many sources and sinks including, but not limited to:

- Azure Cosmos DB for NoSQL
- Azure Cosmos DB for MongoDB
- Azure Cosmos DB for Table
- Azure Table storage
- JSON
- MongoDB
- SQL Server

> [!IMPORTANT]
> For this guide, you will perform a data migration from JSON to Azure Cosmos DB for NoSQL.

## Prerequisites

- An existing Azure Cosmos DB for NoSQL account.
  - If you have an Azure subscription, [create a new account](nosql/how-to-create-account.md?tabs=azure-portal).
  - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
  - Alternatively, you can [try Azure Cosmos DB free](try-free.md) before you commit.
- Latest version of [Azure CLI](/cli/azure/install-azure-cli).
- [.NET 6.0](https://dotnet.microsoft.com/download/dotnet/6.0) or later.

## Install the desktop data migration tool

First, install the latest version of the desktop data migration tool from the GitHub repository.

> [!NOTE]
> The desktop data migration tool requires [.NET 6.0](https://dotnet.microsoft.com/download/dotnet/6.0) or later on your local machine.

1. In your browser, navigate to the **Releases** section of the repository: [azurecosmosdb/data-migration-desktop-tool/releases](https://github.com/azurecosmosdb/data-migration-desktop-tool/releases).

1. Download the latest compressed folder for your platform. There are compressed folders for the **win-x64**, **mac-x64**, and **linux-x64** platforms.

1. Extract the files to an install location on your local machine.

1. (Optional) Add the desktop data migration tool to the `PATH` environment variable of your local machine.

## Prepare your migration target

Next, create a target database and container on the Azure Cosmos DB for NoSQL account.

### [Azure CLI](#tab/azure-cli)

1. Open a new terminal. If you haven't already, [sign in to the Azure CLI](/cli/azure/authenticate-azure-cli).

1. Create new shell variables for the Azure Cosmos DB account's name and resource group.

    ```azurecli-interactive
    # Variable for Azure Cosmos DB account name
    accountName="<name-of-existing-account>"
    
    # Variable for resource group name
    resourceGroupName="<name-of-existing-resource-group>"
    ```

1. Create a new database using [`az cosmosdb sql database create`](/cli/azure/cosmosdb/sql/database#az-cosmosdb-sql-database-create). Name the new database `cosmicworks` and configure the database with 400 RU/s of shared throughput.

    ```azurecli-interactive
    az cosmosdb sql database create \
        --resource-group $resourceGroupName \
        --account-name $accountName \
        --name cosmicworks \
        --throughput 400
    ```

1. Use [`az cosmosdb sql container create`](/cli/azure/cosmosdb/sql/container#az-cosmosdb-sql-container-create) to create a new container named `products` within the `cosmicworks` database. Set the partition key path of the new container to `/category`.

    ```azurecli-interactive
    az cosmosdb sql container create \
        --resource-group $resourceGroupName \
        --account-name $accountName \
        --database-name cosmicworks \
        --name products \
        --partition-key-path "/category"
    ```

1. Find the *primary connection string* from the list of keys for the account with [`az cosmosdb keys list`](/cli/azure/cosmosdb/keys#az-cosmosdb-keys-list).

    ```azurecli-interactive
    az cosmosdb keys list \
        --resource-group $resourceGroupName \
        --name $accountName \
        --type connection-strings
    ```

1. Record the *primary connection string* value. You use this credential later when migrating data with the tool.

### [Azure PowerShell](#tab/azure-powershell)

1. Open a new terminal. If you haven't already, [sign in to the Azure CLI](/cli/azure/authenticate-azure-cli).

1. Create new variables for the Azure Cosmos DB account's name and resource group.

    ```azurepowershell-interactive
    # Variable for Azure Cosmos DB account name
    $ACCOUNT_NAME = "<name-of-existing-account>"
    
    # Variable for resource group name
    $RESOURCE_GROUP_NAME = "<name-of-existing-resource-group>"
    ```

1. Create a new database using [`New-AzCosmosDBSqlDatabase`](/powershell/module/az.cosmosdb/new-azcosmosdbsqldatabase). Name the new database `cosmicworks` and configure the database with 400 RU/s of shared throughput.

    ```azurepowershell-interactive
    $parameters = @{
        ResourceGroupName = $RESOURCE_GROUP_NAME
        AccountName = $ACCOUNT_NAME
        Name = "cosmicworks"
        Throughput = 400
    }
    New-AzCosmosDBSqlDatabase @parameters
    ```

1. Use [`New-AzCosmosDBSqlContainer`](/powershell/module/az.cosmosdb/new-azcosmosdbsqlcontainer) to create a new container named `products` within the `cosmicworks` database. Set the partition key path of the new container to `/category`.

    ```azurepowershell-interactive
    $parameters = @{
        ResourceGroupName = $RESOURCE_GROUP_NAME
        AccountName = $ACCOUNT_NAME
        DatabaseName = "cosmicworks"
        Name = "products"
        PartitionKeyPath = "/category"
        PartitionKeyKind = "Hash"
    }
    New-AzCosmosDBSqlContainer @parameters
    ```

1. Find the *primary connection string* from the list of keys for the account with [`Get-AzCosmosDBAccountKey`](/powershell/module/az.cosmosdb/get-azcosmosdbaccountkey).

    ```azurepowershell-interactive
    $parameters = @{
        ResourceGroupName = $RESOURCE_GROUP_NAME
        Name = $ACCOUNT_NAME
        Type = "ConnectionStrings"
    }
    Get-AzCosmosDBAccountKey @parameters
    ```

1. Record the *primary connection string* value. You use this credential later when migrating data with the tool.

---

## Perform a migration operation

Now, migrate data from a JSON array to the newly created Azure Cosmos DB for NoSQL container.

1. Navigate to an empty directory on your local machine. Within that directory, create a new file named **migrationsettings.json**.

1. Within the JSON file, create a new empty JSON object:

    ```json
    {}
    ```

1. Create a new property named `Source` with the value `json`. Create another new property named `SourceSettings` with an empty object as the value.

    ```json
    {
      "Source": "json",
      "SourceSettings": {}
    }
    ```

1. Within the `SourceSettings` object, create a new property named `FilePath` with the value set to this URI: [https://raw.githubusercontent.com/azure-samples/cosmos-db-migration-sample-data/main/nosql-data.json](https://github.com/azure-samples/cosmos-db-migration-sample-data/blob/main/nosql-data.json).

    ```json
    {
      "Source": "json",
      "SourceSettings": {
        "FilePath": "https://raw.githubusercontent.com/azure-samples/cosmos-db-migration-sample-data/main/nosql-data.json"
      }
    }
    ```

1. Create another new property named `Sink` with the value `cosmos-nosql`. Also, create a property named `SinkSettings` with an empty object.

    ```json
    {
      "Source": "json",
      "SourceSettings": {
        "FilePath": "https://raw.githubusercontent.com/azure-samples/cosmos-db-migration-sample-data/main/nosql-data.json"
      },
      "Sink": "cosmos-nosql",
      "SinkSettings": {
      }
    }
    ```

1. Within `SinkSettings`, create a property named `ConnectionString` with the *primary connection string* you recorded earlier in this guide as its value.

    ```json
    {
      "Source": "json",
      "SourceSettings": {
        "FilePath": "https://raw.githubusercontent.com/azure-samples/cosmos-db-migration-sample-data/main/nosql-data.json"
      },
      "Sink": "cosmos-nosql",
      "SinkSettings": {
        "ConnectionString": "<connection-string-for-existing-account>"
      }
    }
    ```

1. Add `Database`, `Container`, and `PartitionKeyPath` properties with `cosmicworks`, `products`, and `/category` as their values respectively.

    ```json
    {
      "Source": "json",
      "SourceSettings": {
        "FilePath": "https://raw.githubusercontent.com/azure-samples/cosmos-db-migration-sample-data/main/nosql-data.json"
      },
      "Sink": "cosmos-nosql",
      "SinkSettings": {
        "ConnectionString": "<connection-string-for-existing-account>",
        "Database": "cosmicworks",
        "Container": "products",
        "PartitionKeyPath": "/category"
      }
    }
    ```

1. **Save** the **migrationsettings.json** file.

1. Open a new terminal and navigate to the directory containing your **migrationsettings.json** file.

1. Run the desktop data migration tool using the `dmt` command.

    ```terminal
    dmt
    ```

    > [!NOTE]
    > If you did not add the installation path to your `PATH` environment variable, you may need to specify the full path to the `dmt` executable.

1. The tool now outputs the sources and sinks used by the migration.

    ```output
    Using JSON Source
    Using Cosmos-nosql Sink
    ```

## Next steps

- Review [options for migrating data to Azure Cosmos DB](migration-choices.md).
