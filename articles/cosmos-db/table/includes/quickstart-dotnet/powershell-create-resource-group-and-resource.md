---
author: alexwolfmsft
ms.service: cosmos-db
ms.subservice: table
ms.custom: ignite-2022
ms.topic: include
ms.date: 07/08/2022
ms.author: alexwolf
---
1. Create shell variables for *ACCOUNT_NAME*, *RESOURCE_GROUP_NAME*, and **LOCATION**.

    ```azurepowershell-interactive
    # Variable for resource group name
    $RESOURCE_GROUP_NAME = "msdocs-cosmos-quickstart-rg"
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
        Location = $LOCATION
        ApiKind "Table"
    }
    New-AzCosmosDBAccount @parameters
    ```
