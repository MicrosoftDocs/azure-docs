---
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: include
ms.date: 05/17/2022
---

1. Get the SQL API endpoint *URI* for the account using the [``az cosmosdb show``](/cli/azure/cosmosdb#az-cosmosdb-show) command.

    ```azurecli-interactive
    az cosmosdb show \
        --resource-group $resourceGroupName \
        --name $accountName \
        --query "documentEndpoint"
    ```

1. Find the *PRIMARY KEY* from the list of keys for the account with the[``az-cosmosdb-keys-list``](/cli/azure/cosmosdb/keys#az-cosmosdb-keys-list) command.

    ```azurecli-interactive
    az cosmosdb keys list \
        --resource-group $resourceGroupName \
        --name $accountName \
        --type "keys" \
        --query "primaryMasterKey"
    ```

1. Record the *URI* and *PRIMARY KEY* values. You'll use these credentials later.
