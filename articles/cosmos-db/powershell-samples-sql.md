---
title: Azure PowerShell samples for Azure Cosmos DB - SQL (Core) API
description:  Get the Azure PowerShell samples to perform various common tasks in Azure Cosmos DB SQL API accounts
author: markjbrown
ms.service: cosmos-db
ms.topic: sample
ms.date: 06/12/2020
ms.author: mjbrown
---

# Azure PowerShell samples for Azure Cosmos DB - SQL (Core) API

The following table includes links to commonly used Azure PowerShell scripts for Azure Cosmos DB for SQL (Core) API. If you'd like to fork these PowerShell samples for Cosmos DB from our GitHub repository, visit [Cosmos DB PowerShell Samples on GitHub](https://github.com/Azure/azure-docs-powershell-samples/tree/master/cosmosdb).

For additional Cosmos DB PowerShell samples for SQL (Core) API and documentation, see [Manage Azure Cosmos DB SQL API resources using PowerShell](manage-with-powershell.md). For Cosmos DB PowerShell samples for other APIs, see [Cassandra API](powershell-samples-cassandra.md), [MongoDB API](powershell-samples-mongodb.md), [Gremlin API](powershell-samples-gremlin.md), and [Table API](powershell-samples-table.md).

> [!NOTE]
> The samples use [Az.CosmosDB](https://docs.microsoft.com/powershell/module/az.cosmosdb) management cmdlets. Please check for updates to `Az.CosmosDB` regularly.

|Task | Description |
|---|---|
|[Create an account, database and container](scripts/powershell/sql/ps-sql-create.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Create an Azure Cosmos DB account, database and container. |
|[Create a container with a large partition key](scripts/powershell/sql/ps-sql-container-create-large-partition-key.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Create a container with a large partition key. |
|[List or get databases or containers](scripts/powershell/sql/ps-sql-list-get.md?toc=%2fpowershell%2fmodule%2ftoc.json)| List or get database or containers. |
|[Get RU/s](scripts/powershell/sql/ps-sql-ru-get.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Get RU/s for a database or container. |
|[Update RU/s](scripts/powershell/sql/ps-sql-ru-update.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Update RU/s for a database or container. |
|[Create a container with no index policy](scripts/powershell/sql/ps-sql-container-create-index-none.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Create an Azure Cosmos container with index policy turned off.|
|[Update an account](scripts/powershell/common/ps-account-update.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Update a Cosmos DB account's default consistency level. |
|[Update an account's regions](scripts/powershell/common/ps-account-update-region.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Update a Cosmos DB account's regions. |
|[Change failover priority or trigger failover](scripts/powershell/common/ps-account-failover-priority-update.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Change the regional failover priority of an Azure Cosmos account or trigger a manual failover. |
|[Account keys or connection strings](scripts/powershell/common/ps-account-keys-connection-strings.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Get primary and secondary keys, connection strings or regenerate an account key of an Azure Cosmos DB account. |
|[Create a Cosmos Account with IP Firewall](scripts/powershell/common/ps-account-firewall-create.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Create an Azure Cosmos DB account with IP Firewall enabled. |
|[Lock resources from deletion](scripts/powershell/sql/powershell-sql-lock.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Prevent resources from being deleted with resource locks. |
|||
