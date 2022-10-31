---
author: diberry
ms.service: cosmos-db
ms.subservice: mongodb
ms.custom: ignite-2022
ms.topic: include
ms.date: 06/13/2019
ms.author: diberry
---
1. Find the API for MongoDB **connection string** from the list of connection strings for the account with the [``az cosmosdb keys list``](/cli/azure/cosmosdb/keys#az-cosmosdb-keys-list) command.

    ```azurecli-interactive
    cosmosdb keys list --type connection-strings \
        --resource-group $resourceGroupName \
        --name $accountName 
    ```

1. Record the *PRIMARY KEY* values. You'll use these credentials later.
