---
title: PowerShell script to list and get Azure Cosmos DB for Apache Cassandra resources
description: Azure PowerShell script - Azure Cosmos DB list and get operations for API for Cassandra
author: seesharprun
ms.service: cosmos-db
ms.subservice: apache-cassandra
ms.topic: sample
ms.date: 03/18/2020
ms.author: sidandrews
ms.reviewer: mjbrown 
ms.custom: devx-track-azurepowershell, ignite-2022
---

# List and get keyspaces and tables for Azure Cosmos DB - API for Cassandra
[!INCLUDE[Cassandra](../../../includes/appliesto-cassandra.md)]

[!INCLUDE [updated-for-az](../../../../../includes/updated-for-az.md)]

This sample requires Azure PowerShell Az 5.4.0 or later. Run `Get-Module -ListAvailable Az` to see which versions are installed.
If you need to install, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell).

Run [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) to sign in to Azure.

## Sample script

[!code-powershell[main](../../../../../powershell_scripts/cosmosdb/cassandra/ps-cassandra-list-get.ps1 "List or get keyspace or table for API for Cassandra")]

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
| [Get-AzCosmosDBCassandraKeyspace](/powershell/module/az.cosmosdb/get-azcosmosdbcassandrakeyspace) | Lists Azure Cosmos DB for Apache Cassandra Keyspaces in an Account, or gets a specified Azure Cosmos DB for Apache Cassandra Keyspace in an Account. |
| [Get-AzCosmosDBCassandraTable](/powershell/module/az.cosmosdb/get-azcosmosdbcassandratable) | Lists Azure Cosmos DB for Apache Cassandra Tables in a Keyspace, or gets a specified Azure Cosmos DB for Apache Cassandra Table in a Keyspace. |
|**Azure Resource Groups**| |
| [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) | Deletes a resource group including all nested resources. |
|||

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/).
