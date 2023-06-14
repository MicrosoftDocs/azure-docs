---
title: Azure PowerShell samples for Azure Cosmos DB for NoSQL
description:  Get the Azure PowerShell samples to perform common tasks in Azure Cosmos DB for API for NoSQL
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.custom: ignite-2022, devx-track-azurepowershell
ms.topic: sample
ms.date: 01/20/2021
ms.author: sidandrews
ms.reviewer: mjbrown
---

# Azure PowerShell samples for Azure Cosmos DB for NoSQL
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

The following table includes links to commonly used Azure PowerShell scripts for Azure Cosmos DB. Use the links on the right to navigate to API specific samples. Common samples are the same across all APIs. Reference pages for all Azure Cosmos DB PowerShell cmdlets are available in the [Azure PowerShell Reference](/powershell/module/az.cosmosdb). The `Az.CosmosDB` module is now part of the `Az` module. [Download and install](/powershell/azure/install-azure-powershell) the latest version of Az module to get the Azure Cosmos DB cmdlets. You can also get the latest version from the [PowerShell Gallery](https://www.powershellgallery.com/packages/Az/5.4.0). You can also fork these PowerShell samples for Azure Cosmos DB from our GitHub repository, [Azure Cosmos DB PowerShell Samples on GitHub](https://github.com/Azure/azure-docs-powershell-samples/tree/master/cosmosdb).

For PowerShell cmdlets for other APIs see [PowerShell Samples for Cassandra](../cassandra/powershell-samples.md), [PowerShell Samples for API for MongoDB](../mongodb/powershell-samples.md), [PowerShell Samples for Gremlin](../graph/powershell-samples.md), [PowerShell Samples for Table](../table/powershell-samples.md)

## Common Samples

|Task | Description |
|---|---|
|[Update an account](../scripts/powershell/common/account-update.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Update an Azure Cosmos DB account's default consistency level. |
|[Update an account's regions](../scripts/powershell/common/update-region.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Update an Azure Cosmos DB account's regions. |
|[Change failover priority or trigger failover](../scripts/powershell/common/failover-priority-update.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Change the regional failover priority of an Azure Cosmos DB account or trigger a manual failover. |
|[Account keys or connection strings](../scripts/powershell/common/keys-connection-strings.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Get primary and secondary keys, connection strings or regenerate an account key of an Azure Cosmos DB account. |
|[Create an Azure Cosmos DB Account with IP Firewall](../scripts/powershell/common/firewall-create.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Create an Azure Cosmos DB account with IP Firewall enabled. |
|||

## API for NoSQL Samples

|Task | Description |
|---|---|
|[Create an account, database and container](../scripts/powershell/sql/create.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Create an Azure Cosmos DB account, database and container. |
|[Create an account, database and container with autoscale](../scripts/powershell/sql/autoscale.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Create an Azure Cosmos DB account, database and container with autoscale. |
|[Create a container with a large partition key](../scripts/powershell/sql/create-large-partition-key.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Create a container with a large partition key. |
|[Create a container with no index policy](../scripts/powershell/sql/create-index-none.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Create an Azure Cosmos DB container with index policy turned off.|
|[List or get databases or containers](../scripts/powershell/sql/list-get.md?toc=%2fpowershell%2fmodule%2ftoc.json)| List or get database or containers. |
|[Perform throughput operations](../scripts/powershell/sql/throughput.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Perform throughput operations for a database or container including get, update and migrate between autoscale and standard throughput. |
|[Lock resources from deletion](../scripts/powershell/sql/lock.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Prevent resources from being deleted with resource locks. |
|||
