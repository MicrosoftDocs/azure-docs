---
title: Azure PowerShell samples for Azure Cosmos DB for Apache Cassandra
description:  Get the Azure PowerShell samples to perform common tasks in Azure Cosmos DB for Apache Cassandra
author: seesharprun
ms.service: cosmos-db
ms.subservice: apache-cassandra
ms.custom: ignite-2022, devx-track-azurepowershell
ms.topic: sample
ms.date: 01/20/2021
ms.author: sidandrews
ms.reviewer: mjbrown
---

# Azure PowerShell samples for Azure Cosmos DB for Apache Cassandra
[!INCLUDE[Cassandra](../includes/appliesto-cassandra.md)]

The following table includes links to commonly used Azure PowerShell scripts for Azure Cosmos DB. Use the links on the right to navigate to API specific samples. Common samples are the same across all APIs. Reference pages for all Azure Cosmos DB PowerShell cmdlets are available in the [Azure PowerShell Reference](/powershell/module/az.cosmosdb). The `Az.CosmosDB` module is now part of the `Az` module. [Download and install](/powershell/azure/install-azure-powershell) the latest version of Az module to get the Azure Cosmos DB cmdlets. You can also get the latest version from the [PowerShell Gallery](https://www.powershellgallery.com/packages/Az/5.4.0). You can also fork these PowerShell samples for Azure Cosmos DB from our GitHub repository, [Azure Cosmos DB PowerShell Samples on GitHub](https://github.com/Azure/azure-docs-powershell-samples/tree/master/cosmosdb).

## Common Samples

|Task | Description |
|---|---|
|[Update an account](../scripts/powershell/common/account-update.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Update an Azure Cosmos DB account's default consistency level. |
|[Update an account's regions](../scripts/powershell/common/update-region.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Update an Azure Cosmos DB account's regions. |
|[Change failover priority or trigger failover](../scripts/powershell/common/failover-priority-update.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Change the regional failover priority of an Azure Cosmos DB account or trigger a manual failover. |
|[Account keys or connection strings](../scripts/powershell/common/keys-connection-strings.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Get primary and secondary keys, connection strings or regenerate an account key of an Azure Cosmos DB account. |
|[Create an Azure Cosmos DB Account with IP Firewall](../scripts/powershell/common/firewall-create.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Create an Azure Cosmos DB account with IP Firewall enabled. |
|||

## API for Cassandra Samples

|Task | Description |
|---|---|
|[Create an account, keyspace and table](../scripts/powershell/cassandra/create.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an Azure Cosmos DB account, keyspace and table. |
|[Create an account, keyspace and table with autoscale](../scripts/powershell/cassandra/autoscale.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an Azure Cosmos DB account, keyspace and table with autoscale. |
|[List or get keyspaces or tables](../scripts/powershell/cassandra/list-get.md?toc=%2fpowershell%2fmodule%2ftoc.json)| List or get keyspaces or tables. |
|[Perform throughput operations](../scripts/powershell/cassandra/throughput.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Perform throughput operations for a keyspace or table including get, update and migrate between autoscale and standard throughput. |
|[Lock resources from deletion](../scripts/powershell/cassandra/lock.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Prevent resources from being deleted with resource locks. |
|||
