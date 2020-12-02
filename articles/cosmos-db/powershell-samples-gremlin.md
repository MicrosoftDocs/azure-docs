---
title: Azure PowerShell samples for Azure Cosmos DB Gremlin API
description:  Get the Azure PowerShell samples to perform common tasks in Azure Cosmos DB Gremlin API
author: markjbrown
ms.service: cosmos-db
ms.subservice: cosmosdb-graph
ms.topic: sample
ms.date: 10/13/2020
ms.author: mjbrown
---

# Azure PowerShell samples for Azure Cosmos DB Gremlin API
[!INCLUDE[appliesto-gremlin-api](includes/appliesto-gremlin-api.md)]

The following table includes links to commonly used Azure PowerShell scripts for Azure Cosmos DB. Use the links on the right to navigate to API specific samples. Common samples are the same across all APIs. Reference pages for all Azure Cosmos DB PowerShell cmdlets are available in the [Azure PowerShell Reference](/powershell/module/az.cosmosdb). Please check for updates to `Az.CosmosDB` regularly. You can also fork these PowerShell samples for Cosmos DB from our GitHub repository, [Cosmos DB PowerShell Samples on GitHub](https://github.com/Azure/azure-docs-powershell-samples/tree/master/cosmosdb).

## Common Samples

|Task | Description |
|---|---|
|[Update an account](scripts/powershell/common/account-update.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Update a Cosmos DB account's default consistency level. |
|[Update an account's regions](scripts/powershell/common/update-region.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Update a Cosmos DB account's regions. |
|[Change failover priority or trigger failover](scripts/powershell/common/failover-priority-update.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Change the regional failover priority of an Azure Cosmos account or trigger a manual failover. |
|[Account keys or connection strings](scripts/powershell/common/keys-connection-strings.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Get primary and secondary keys, connection strings or regenerate an account key of an Azure Cosmos DB account. |
|[Create a Cosmos Account with IP Firewall](scripts/powershell/common/firewall-create.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Create an Azure Cosmos DB account with IP Firewall enabled. |
|||

## Gremlin API Samples

|Task | Description |
|---|---|
|[Create an account, database and graph](scripts/powershell/gremlin/create.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an Azure Cosmos account, database and graph. |
|[Create an account, database and graph with autoscale](scripts/powershell/gremlin/autoscale.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an Azure Cosmos account, database and graph with autoscale. |
|[List or get databases or graphs](scripts/powershell/gremlin/list-get.md?toc=%2fpowershell%2fmodule%2ftoc.json)| List or get database or graph. |
|[Throughput operations](scripts/powershell/gremlin/throughput.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Throughput operations for a database or graph including get, update and migrate between autoscale and standard throughput. |
|[Lock resources from deletion](scripts/powershell/gremlin/lock.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Prevent resources from being deleted with resource locks. |
|||
