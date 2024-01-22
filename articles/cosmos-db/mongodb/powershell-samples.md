---
title: Azure PowerShell samples for Azure Cosmos DB for MongoDB
description:  Get the Azure PowerShell samples to perform common tasks in Azure Cosmos DB for MongoDB
author: seesharprun
ms.service: cosmos-db
ms.subservice: mongodb
ms.custom: ignite-2022, devx-track-azurepowershell
ms.topic: sample
ms.date: 08/26/2021
ms.author: sidandrews
ms.reviewer: mjbrown
---

# Azure PowerShell samples for Azure Cosmos DB for MongoDB
[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

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

## MongoDB API Samples

|Task | Description |
|---|---|
|[Create an account, database and collection](../scripts/powershell/mongodb/create.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an Azure Cosmos DB account, database and collection. |
|[Create an account, database and collection with autoscale](../scripts/powershell/mongodb/autoscale.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an Azure Cosmos DB account, database and collection with autoscale. |
|[List or get databases or collections](../scripts/powershell/mongodb/list-get.md?toc=%2fpowershell%2fmodule%2ftoc.json)| List or get database or collection. |
|[Perform throughput operations](../scripts/powershell/mongodb/throughput.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Perform throughput operations for a database or collection including get, update and migrate between autoscale and standard throughput. |
|[Lock resources from deletion](../scripts/powershell/mongodb/lock.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Prevent resources from being deleted with resource locks. |
|||

## Next steps

Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
* If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
* If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-capacity-planner.md)
