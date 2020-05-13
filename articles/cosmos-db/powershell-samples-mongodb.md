---
title: Azure PowerShell samples for Azure Cosmos DB - MongoDB API
description: Get the Azure PowerShell samples to perform various common tasks in Azure Cosmos DB's API for MongoDB
author: markjbrown
ms.service: cosmos-db
ms.topic: sample
ms.date: 05/13/2020
ms.author: mjbrown
---

# Azure PowerShell samples for Azure Cosmos DB MongoDB API

The following table includes links to sample Azure PowerShell scripts for Azure Cosmos DB for MongoDB API.

> [!NOTE]
> Currently you can only create 3.2 version (that is, accounts using the endpoint in the format `*.documents.azure.com`) of Azure Cosmos DB's API for MongoDB accounts by using PowerShell, CLI, and Resource Manager templates. To create 3.6 version of accounts, use Azure portal instead.

> [!NOTE]
> The samples use [Az.CosmosDB](https://docs.microsoft.com/powershell/module/az.cosmosdb) management cmdlets. Please check for updates to `Az.CosmosDB` regularly.

| | |
|---|---|
|[Create an account, database and collection](scripts/powershell/mongodb/ps-mongodb-create.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an Azure Cosmos account, database and collection. |
|[List or get databases or collections](scripts/powershell/mongodb/ps-mongodb-list-get.md?toc=%2fpowershell%2fmodule%2ftoc.json)| List or get database or collection. |
|[Get RU/s](scripts/powershell/mongodb/ps-mongodb-ru-get.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Get RU/s for a database or collection. |
|[Update RU/s](scripts/powershell/mongodb/ps-mongodb-ru-update.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Update RU/s for a database or collection. |
|[Update an account or add a region](scripts/powershell/common/ps-account-update.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Add a region to a Cosmos account. Can also be used to modify other account properties but these must be separate from changes to regions. |
|[Change failover priority or trigger failover](scripts/powershell/common/ps-account-failover-priority-update.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Change the regional failover priority of an Azure Cosmos account or trigger a manual failover. |
|[Account keys or connection strings](scripts/powershell/common/ps-account-keys-connection-strings.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Get primary and secondary keys, connection strings or regenerate an account key of an Azure Cosmos account. |
|[Create a Cosmos Account with IP Firewall](scripts/powershell/common/ps-account-firewall-create.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Create an Azure Cosmos account with IP Firewall enabled. |
|||
