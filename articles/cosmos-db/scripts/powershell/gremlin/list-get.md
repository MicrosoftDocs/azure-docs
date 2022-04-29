---
title: PowerShell script to list and get Azure Cosmos DB Gremlin API accounts, databases, and graphs
description: Run this Azure PowerShell script to list and get operations for an Azure Cosmos DB Gremlin API account.
author: markjbrown
ms.service: cosmos-db
ms.subservice: cosmosdb-graph
ms.topic: sample
ms.date: 05/02/2022
ms.author: mjbrown 
ms.custom: devx-track-azurepowershell
---

# PowerShell script to list and get databases and graphs for an Azure Cosmos DB Gremlin API account

[!INCLUDE[appliesto-gremlin-api](../../../includes/appliesto-gremlin-api.md)]

This PowerShell script lists or gets specific Azure Cosmos DB Gremlin API accounts, databases, and graphs in an Azure resource group.

[!INCLUDE [updated-for-az](../../../../../includes/updated-for-az.md)]

## Prerequisites

- This sample requires Azure PowerShell Az 5.4.0 or later. Run `Get-Module -ListAvailable Az` to see which versions are installed. If you need to install, see [Install Azure PowerShell module](/powershell/azure/install-az-ps).

- Run [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) to sign in to Azure.

## Sample script

In this script:

- [Get-AzCosmosDBAccount](/powershell/module/az.cosmosdb/get-azcosmosdbaccount) lists Azure Cosmos DB accounts, or gets a specific Azure Cosmos DB account, in a resource group.
- [Get-AzCosmosDBGremlinDatabase](/powershell/module/az.cosmosdb/get-azcosmosdbgremlindatabase) lists Gremlin API databases, or gets a specific Gremlin API database, in an Azure Cosmos DB account.
- [Get-AzCosmosDBGremlinGraph](/powershell/module/az.cosmosdb/get-azcosmosdbgremlingraph) lists Gremlin API graphs, or gets a specific Gremlin API graph, in a Gremlin API database.

[!code-powershell[main](../../../../../powershell_scripts/cosmosdb/gremlin/ps-gremlin-list-get.ps1 "List or get databases or graphs for Gremlin API")]

## Delete Azure resource group

If you want to delete your Azure Cosmos DB account, you can use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) PowerShell command to remove its resource group. This command removes the Azure resource group and all the resources in it, including Azure Cosmos DB accounts and their containers and databases.

```powershell
Remove-AzResourceGroup -ResourceGroupName "myResourceGroup"
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
|**Azure Cosmos DB**| |
|**Azure Resource Groups**| |
| [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) | Deletes a resource group including all nested resources. |
|||

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/).
