---
author: alexwolfmsft
ms.service: cosmos-db
ms.subservice: table
ms.custom: ignite-2022
ms.topic: include
ms.date: 07/08/2022
ms.author: alexwolf
---
1. Find the *CONNECTION STRING* from the list of keys and connection strings for the account with the [``Get-AzCosmosDBAccountKey``](/powershell/module/az.cosmosdb/get-azcosmosdbaccountkey) cmdlet.

    ```azurepowershell-interactive
    $parameters = @{
        ResourceGroupName = $RESOURCE_GROUP_NAME
        Name = $ACCOUNT_NAME
        Type = "ConnectionStrings"
    }    
    Get-AzCosmosDBAccountKey @parameters | Select-Object -Property "Primary Table Connection String"    
    ```

1. Record the *CONNECTION STRING* value. You'll use these credentials later.
