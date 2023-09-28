---
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: apache-gremlin
ms.topic: include
ms.date: 09/27/2023
---

1. Create shell variables for *accountName*, *resourceGroupName*, and *location*.

    ```azurecli-interactive
    # Variable for resource group name
    resourceGroupName="msdocs-cosmos-gremlin-quickstart"
    location="westus"
    
    # Variable for account name with a randomly generated suffix
    
    let suffix=$RANDOM*$RANDOM
    accountName="msdocs-gremlin-$suffix"
    ```

1. If you haven't already, sign in to the Azure CLI using `az login`.

1. Use `az group create` to create a new resource group in your subscription.

    ```azurecli-interactive
    az group create \
        --name $resourceGroupName \
        --location $location
    ```

1. Use `az cosmosdb create` to create a new API for NoSQL account with default settings.

    ```azurecli-interactive
    az cosmosdb create \
        --resource-group $resourceGroupName \
        --name $accountName \
        --capabilities "EnableGremlin" \
        --locations regionName=$location \
        --enable-free-tier true
    ```

    > [!NOTE]
    > You can have up to one free tier Azure Cosmos DB account per Azure subscription and must opt-in when creating the account. If this command fails to apply the free tier discount, this means another account in the subscription has already been enabled with free tier.

1. Get the API for Gremlin endpoint *NAME* for the account using `az cosmosdb show`.

    ```azurecli-interactive
    az cosmosdb show \
        --resource-group $resourceGroupName \
        --name $accountName \
        --query "name"
    ```

1. Find the *KEY* from the list of keys for the account with `az-cosmosdb-keys-list`.

    ```azurecli-interactive
    az cosmosdb keys list \
        --resource-group $resourceGroupName \
        --name $accountName \
        --type "keys" \
        --query "primaryMasterKey"
    ```

1. Record the *NAME* and *KEY* values. You use these credentials later.

1. Create a *database* named `cosmicworks` using `az cosmosdb gremlin database create`.

    ```azurecli-interactive
    az cosmosdb gremlin database create \
        --resource-group $resourceGroupName \
        --account-name $accountName \
        --name "cosmicworks"
    ```

1. Create a *graph* using `az cosmosdb gremlin graph create`. Name the graph `products`, then set the throughput to `400`, and finally set the partition key path to `/category`.

    ```azurecli-interactive
    az cosmosdb gremlin graph create \
        --resource-group $resourceGroupName \
        --account-name $accountName \
        --database-name "cosmicworks" \
        --name "products" \
        --partition-key-path "/category" \
        --throughput 400
    ```
