---
title: Create an Azure Cosmos DB for Table account
description: Learn how to create a new Azure Cosmos DB for Table account
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: table
ms.devlang: csharp
ms.topic: how-to
ms.date: 07/06/2022
ms.custom: devx-track-csharp, ignite-2022
---

# Create an Azure Cosmos DB for Table account

[!INCLUDE[Table](../includes/appliesto-table.md)]

An Azure Cosmos DB for Table account contains all of your Azure Cosmos DB resources: tables and items. The account provides a unique endpoint for various tools and SDKs to connect to Azure Cosmos DB and perform everyday operations. For more information about the resources in Azure Cosmos DB, see [Azure Cosmos DB resource model](../resource-model.md).

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).

## Create an account

Create a single Azure Cosmos DB account using the API for Table.

### [Azure CLI](#tab/azure-cli)

1. Create shell variables for *accountName*, *resourceGroupName*, and *location*.

    ```azurecli-interactive
    # Variable for resource group name
    resourceGroupName="msdocs-cosmos"

    # Variable for location
    location="westus"

    # Variable for account name with a randomnly generated suffix
    let suffix=$RANDOM*$RANDOM
    accountName="msdocs-$suffix"
    ```

1. If you haven't already, sign in to the Azure CLI using the [``az login``](/cli/azure/reference-index#az-login) command.

1. Use the [``az group create``](/cli/azure/group#az-group-create) command to create a new resource group in your subscription.

    ```azurecli-interactive
    az group create \
        --name $resourceGroupName \
        --location $location
    ```

1. Use the [``az cosmosdb create``](/cli/azure/cosmosdb#az-cosmosdb-create) command to create a new Azure Cosmos DB for Table account with default settings.

    ```azurecli-interactive
    az cosmosdb create \
        --resource-group $resourceGroupName \
        --name $accountName \
        --capabilities EnableTable \
        --locations regionName=$location
    ```

### [PowerShell](#tab/azure-powershell)

1. Create shell variables for *ACCOUNT_NAME*, *RESOURCE_GROUP_NAME*, and **LOCATION**.

    ```azurepowershell-interactive
    # Variable for resource group name
    $RESOURCE_GROUP_NAME = "msdocs-cosmos"

    # Variable for location
    $LOCATION = "West US"

    # Variable for account name with a randomnly generated suffix
    $SUFFIX = Get-Random
    $ACCOUNT_NAME = "msdocs-$SUFFIX"
    ```

1. If you haven't already, sign in to Azure PowerShell using the [``Connect-AzAccount``](/powershell/module/az.accounts/connect-azaccount) cmdlet.

1. Use the [``New-AzResourceGroup``](/powershell/module/az.resources/new-azresourcegroup) cmdlet to create a new resource group in your subscription.

    ```azurepowershell-interactive
    $parameters = @{
        Name = $RESOURCE_GROUP_NAME
        Location = $LOCATION
    }
    New-AzResourceGroup @parameters    
    ```

1. Use the [``New-AzCosmosDBAccount``](/powershell/module/az.cosmosdb/new-azcosmosdbaccount) cmdlet to create a new Azure Cosmos DB for Table account with default settings.

    ```azurepowershell-interactive
    $parameters = @{
        ResourceGroupName = $RESOURCE_GROUP_NAME
        Name = $ACCOUNT_NAME
        ApiKind = "Table"
        Location = $LOCATION
    }
    New-AzCosmosDBAccount @parameters
    ```

---

## Next steps

In this guide, you learned how to create an Azure Cosmos DB for Table account.

> [!div class="nextstepaction"]
> [Quickstart: Azure Cosmos DB for Table for .NET](quickstart-dotnet.md)
