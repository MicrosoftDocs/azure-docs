---
title: PowerShell scripts for throughput (RU/s) operations for Azure Cosmos DB for Apache Cassandra resources
description: PowerShell scripts for throughput (RU/s) operations for Azure Cosmos DB for Apache Cassandra resources
author: seesharprun
ms.service: cosmos-db
ms.subservice: apache-cassandra
ms.topic: sample
ms.date: 10/07/2020
ms.author: sidandrews
ms.reviewer: mjbrown 
ms.custom: ignite-2022, devx-track-azurepowershell
---

# Throughput (RU/s) operations with PowerShell for a keyspace or table for Azure Cosmos DB - API for Cassandra
[!INCLUDE[Cassandra](../../../includes/appliesto-cassandra.md)]

[!INCLUDE [updated-for-az](../../../../../includes/updated-for-az.md)]

This sample requires Azure PowerShell Az 5.4.0 or later. Run `Get-Module -ListAvailable Az` to see which versions are installed.
If you need to install, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell).

Run [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) to sign in to Azure.

## Get throughput

[!code-powershell[main](../../../../../powershell_scripts/cosmosdb/cassandra/ps-cassandra-ru-get.ps1 "Get throughput on a keyspace or table for API for Cassandra")]

## Update throughput

[!code-powershell[main](../../../../../powershell_scripts/cosmosdb/cassandra/ps-cassandra-ru-update.ps1 "Update throughput on a keyspace or table for API for Cassandra")]

## Migrate throughput

[!code-powershell[main](../../../../../powershell_scripts/cosmosdb/cassandra/ps-cassandra-ru-migrate.ps1 "Migrate between standard and autoscale throughput on a keyspace or table for API for Cassandra")]

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
| [Get-AzCosmosDBCassandraKeyspaceThroughput](/powershell/module/az.cosmosdb/get-azcosmosdbcassandrakeyspacethroughput) | Gets the throughput value of the API for Cassandra Keyspace. |
| [Get-AzCosmosDBCassandraTableThroughput](/powershell/module/az.cosmosdb/get-azcosmosdbcassandratablethroughput) | Gets the throughput value of the API for Cassandra Table. |
| [Update-AzCosmosDBCassandraKeyspaceThroughput](/powershell/module/az.cosmosdb/update-azcosmosdbcassandrakeyspacethroughput) | Updates the throughput value of the API for Cassandra Keyspace. |
| [Update-AzCosmosDBCassandraTableThroughput](/powershell/module/az.cosmosdb/update-azcosmosdbcassandratablethroughput) | Updates the throughput value of the API for Cassandra Table. |
| [Invoke-AzCosmosDBCassandraKeyspaceThroughputMigration](/powershell/module/az.cosmosdb/invoke-azcosmosdbcassandrakeyspacethroughputmigration) | Migrate throughput for a API for Cassandra Keyspace. |
| [Invoke-AzCosmosDBCassandraTableThroughputMigration](/powershell/module/az.cosmosdb/invoke-azcosmosdbcassandratablethroughputmigration) | Migrate throughput for a API for Cassandra Table. |
|**Azure Resource Groups**| |
| [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) | Deletes a resource group including all nested resources. |
|||

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/).
