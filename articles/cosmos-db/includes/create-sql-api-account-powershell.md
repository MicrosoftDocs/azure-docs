---
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: include
ms.date: 05/17/2022
---

1. If you haven't already, sign in to Azure PowerShell using the [``Connect-AzAccount``](/powershell/module/az.accounts/connect-azaccount) cmdlet.

1. Use the [``New-AzResourceGroup``](/powershell/module/az.resources/new-azresourcegroup) cmdlet to create a new resource group in your subscription. 

    ```azurepowershell-interactive
    $parameters = @{
        Name = $RESOURCE_GROUP_NAME
        Location = $LOCATION
    }
    New-AzResourceGroup @parameters    
    ```

1. Use the [``New-AzCosmosDBAccount``](/powershell/module/az.cosmosdb/new-azcosmosdbaccount) cmdlet to create a new Azure Cosmos DB SQL API account with default settings. 

    ```azurepowershell-interactive
    $parameters = @{
        ResourceGroupName = $RESOURCE_GROUP_NAME
        Name = $ACCOUNT_NAME
        Location = $LOCATION
    }
    New-AzCosmosDBAccount @parameters
    ```
