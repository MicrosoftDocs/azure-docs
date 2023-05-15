---
author: alexwolfmsft
ms.service: cosmos-db
ms.subservice: table
ms.custom: ignite-2022, devx-track-azurecli
ms.topic: include
ms.date: 07/08/2022
ms.author: alexwolf
---
1. Create shell variables for *accountName*, *resourceGroupName*, and *location*.

    ```azurecli-interactive
    # Variable for resource group name
    resourceGroupName="msdocs-cosmos-quickstart-rg"
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
        --locations regionName=$location
        --capabilities EnableTable
    ```
