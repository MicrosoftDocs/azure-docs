---
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: include
ms.date: 06/08/2022
---

1. If you haven't already, sign in to the Azure CLI using the [``az login``](/cli/azure/reference-index#az-login) command.

1. Use the [``az group create``](/cli/azure/group#az-group-create) command to create a new resource group in your subscription.

    ```azurecli-interactive
    az group create \
        --name $resourceGroupName \
        --location $location
    ```

1. Use the [``az cosmosdb create``](/cli/azure/cosmosdb#az-cosmosdb-create) command to create a new Azure Cosmos DB SQL API account with default settings.

    ```azurecli-interactive
    az cosmosdb create \
        --resource-group $resourceGroupName \
        --name $accountName \
        --locations regionName=$location
    ```
