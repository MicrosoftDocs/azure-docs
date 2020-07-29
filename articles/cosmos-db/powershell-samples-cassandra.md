---
title: Azure PowerShell samples for Azure Cosmos DB - Cassandra API
description:  Get the Azure PowerShell samples to perform various common tasks in Azure Cosmos DB Cassandra API accounts
author: markjbrown
ms.service: cosmos-db
ms.topic: how-to
ms.date: 06/12/2020
ms.author: mjbrown
---

# Azure PowerShell samples for Azure Cosmos DB - Cassandra API

The following table includes links to sample Azure PowerShell scripts for Azure Cosmos DB for Cassandra API.

> [!NOTE]
> The samples use [Az.CosmosDB](https://docs.microsoft.com/powershell/module/az.cosmosdb) management cmdlets. Please check for updates to `Az.CosmosDB` regularly.

|Task | Description |
|---|---|
|[Create an account, keyspace and table](scripts/powershell/cassandra/ps-cassandra-create.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an Azure Cosmos account, keyspace and table. |
|[List or get keyspaces or tables](scripts/powershell/cassandra/ps-cassandra-list-get.md?toc=%2fpowershell%2fmodule%2ftoc.json)| List or get keyspaces or tables. |
|[Get RU/s](scripts/powershell/cassandra/ps-cassandra-ru-get.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Get RU/s for a keyspace or table. |
|[Update RU/s](scripts/powershell/cassandra/ps-cassandra-ru-update.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Update RU/s for a keyspace or table. |
|[Update an account or add a region](scripts/powershell/common/ps-account-update.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Add a region to a Cosmos account. Can also be used to modify other account properties but these must be separate from changes to regions. |
|[Change failover priority or trigger failover](scripts/powershell/common/ps-account-failover-priority-update.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Change the regional failover priority of an Azure Cosmos account or trigger a manual failover. |
|[Account keys or connection strings](scripts/powershell/common/ps-account-keys-connection-strings.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Get primary and secondary keys, connection strings or regenerate an account key of an Azure Cosmos account. |
|[Create a Cosmos Account with IP Firewall](scripts/powershell/common/ps-account-firewall-create.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Create an Azure Cosmos account with IP Firewall enabled. |
|[Lock resources from deletion](scripts/powershell/cassandra/powershell-cassandra-lock.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Prevent resources from being deleted with resource locks. |
|||
