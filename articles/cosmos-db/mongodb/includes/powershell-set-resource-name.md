---
author: diberry
ms.service: cosmos-db
ms.subservice: mongodb
ms.custom: ignite-2022
ms.topic: include
ms.date: 11/14/2022
ms.author: diberry
---
1. Create a shell variable for *RESOURCE_GROUP_NAME*.

    ```azurepowershell-interactive
    # Variable for resource group name
    $RESOURCE_GROUP_NAME = "msdocs-cosmos"
    ```
2. Use the [Get-AzCosmosDBAccountKey](/powershell/module/az.cosmosdb/get-azcosmosdbaccountkey) cmdlet to retrieve the name of the first Azure Cosmos DB account in your resource group and store it in the accountName shell variable.

    ```azurepowershell-interactive
    # Get the name of the first Azure Cosmos DB account in your resource group
    $ACCOUNT_NAME = (Get-AzCosmosDBAccount -ResourceGroupName $RESOURCE_GROUP_NAME)[0].Name
    ```