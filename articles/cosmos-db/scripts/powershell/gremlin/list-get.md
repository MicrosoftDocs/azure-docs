---
title: PowerShell script to list or get Azure Cosmos DB Gremlin API databases and graphs
description: Run this Azure PowerShell script to list all or get specific Azure Cosmos DB Gremlin API databases and graphs.
author: seesharprun
ms.service: cosmos-db
ms.subservice: cosmosdb-graph
ms.topic: sample
ms.date: 05/02/2022
ms.author: sidandrews
ms.reviewer: mjbrown 
ms.custom: devx-track-azurepowershell
---

# PowerShell script to list or get Azure Cosmos DB Gremlin API databases and graphs

[!INCLUDE[appliesto-gremlin-api](../../../includes/appliesto-gremlin-api.md)]

This PowerShell script lists or gets specific Azure Cosmos DB accounts, Gremlin API databases, and  Gremlin API graphs.

[!INCLUDE [updated-for-az](../../../../../includes/updated-for-az.md)]

## Prerequisites

- This sample requires Azure PowerShell Az 5.4.0 or later. Run `Get-Module -ListAvailable Az` to see which versions are installed. If you need to install, see [Install Azure PowerShell module](/powershell/azure/install-az-ps).

- Run [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) to sign in to Azure.

## Sample script

In this script:

- [Get-AzCosmosDBAccount](/powershell/module/az.cosmosdb/get-azcosmosdbaccount) lists all or gets a specific Azure Cosmos DB account in an Azure resource group.
- [Get-AzCosmosDBGremlinDatabase](/powershell/module/az.cosmosdb/get-azcosmosdbgremlindatabase) lists all or gets a specific Gremlin API database in an Azure Cosmos DB account.
- [Get-AzCosmosDBGremlinGraph](/powershell/module/az.cosmosdb/get-azcosmosdbgremlingraph) lists all or gets a specific Gremlin API graph in a Gremlin API database.

[!code-powershell[main](../../../../../powershell_scripts/cosmosdb/gremlin/ps-gremlin-list-get.ps1 "List or get databases or graphs for Gremlin API")]

## Delete Azure resource group

If you want to delete your Azure Cosmos DB account, you can use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) PowerShell command to remove its resource group. This command removes the Azure resource group and all the resources in it, including Azure Cosmos DB accounts and their containers and databases.

```powershell
Remove-AzResourceGroup -ResourceGroupName "myResourceGroup"
```

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/).
