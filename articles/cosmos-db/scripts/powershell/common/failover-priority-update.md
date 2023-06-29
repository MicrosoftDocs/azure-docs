---
title: PowerShell script to change failover priority for an Azure Cosmos DB account with single write region
description: Azure PowerShell script sample - Change failover priority or trigger failover for an Azure Cosmos DB account with single write region
author: seesharprun
ms.service: cosmos-db
ms.topic: sample
ms.date: 03/18/2020
ms.author: sidandrews
ms.reviewer: mjbrown 
ms.custom: devx-track-azurepowershell, ignite-2022
---

# Change failover priority or trigger failover for an Azure Cosmos DB account with single write region by using PowerShell
[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](../../../includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

[!INCLUDE [updated-for-az](../../../../../includes/updated-for-az.md)]

This sample requires Azure PowerShell Az 5.4.0 or later. Run `Get-Module -ListAvailable Az` to see which versions are installed.
If you need to install, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell).

Run [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) to sign in to Azure.

## Sample script

> [!NOTE]
> Any change to a region with `failoverPriority=0` triggers a manual failover and can only be done to an account configured for manual failover. Changes to all other regions simply changes the failover priority for an Azure Cosmos DB account.
> [!NOTE]
> This sample demonstrates using a API for NoSQL account. To use this sample for other APIs, copy the related properties and apply to your API specific script

[!code-powershell[main](../../../../../powershell_scripts/cosmosdb/common/ps-account-failover-priority-update.ps1 "Update failover priority for an Azure Cosmos DB account or trigger a manual failover")]

## Clean up deployment

After the script sample has been run, the following command can be used to remove the resource group and all resources associated with it.

```powershell
Remove-AzResourceGroup -ResourceGroupName "myResourceGroup"
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
|**Azure Cosmos DB**| |
| [Get-AzCosmosDBAccount](/powershell/module/az.cosmosdb/get-azcosmosdbaccount) | Lists Azure Cosmos DB Accounts, or gets a specified Azure Cosmos DB Account. |
| [Update-AzCosmosDBAccountFailoverPriority](/powershell/module/az.cosmosdb/update-azcosmosdbaccountfailoverpriority) | Update the failover priority order of an Azure Cosmos DB Account's regions. |
|**Azure Resource Groups**| |
| [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) | Deletes a resource group including all nested resources. |
|||

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/).
