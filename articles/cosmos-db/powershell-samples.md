---
title: Azure PowerShell samples for Azure Cosmos DB
description:  Get the Azure PowerShell samples to perform common tasks in Azure Cosmos DB
author: markjbrown
ms.service: cosmos-db
ms.topic: sample
ms.date: 07/30/2020
ms.author: mjbrown
---

# Azure PowerShell samples for Azure Cosmos DB

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

## Core (SQL) API Samples

|Task | Description |
|---|---|
|[Create an account, database and container](scripts/powershell/sql/create.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Create an Azure Cosmos DB account, database and container. |
|[Create an account, database and container with autoscale](scripts/powershell/sql/autoscale.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Create an Azure Cosmos DB account, database and container with autoscale. |
|[Create a container with a large partition key](scripts/powershell/sql/create-large-partition-key.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Create a container with a large partition key. |
|[Create a container with no index policy](scripts/powershell/sql/create-index-none.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Create an Azure Cosmos container with index policy turned off.|
|[List or get databases or containers](scripts/powershell/sql/list-get.md?toc=%2fpowershell%2fmodule%2ftoc.json)| List or get database or containers. |
|[Get throughput](scripts/powershell/sql/throughput-get.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Get throughput for a database or container. |
|[Update throughput](scripts/powershell/sql/throughput-update.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Update throughput for a database or container. |
|[Lock resources from deletion](scripts/powershell/sql/lock.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Prevent resources from being deleted with resource locks. |
|||

## Cassandra API Samples

|Task | Description |
|---|---|
|[Create an account, keyspace and table](scripts/powershell/cassandra/create.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an Azure Cosmos account, keyspace and table. |
|[Create an account, keyspace and table with autoscale](scripts/powershell/cassandra/autoscale.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an Azure Cosmos account, keyspace and table with autoscale. |
|[List or get keyspaces or tables](scripts/powershell/cassandra/list-get.md?toc=%2fpowershell%2fmodule%2ftoc.json)| List or get keyspaces or tables. |
|[Get throughput](scripts/powershell/cassandra/throughput-get.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Get throughput for a keyspace or table. |
|[Update throughput](scripts/powershell/cassandra/throughput-update.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Update throughput for a keyspace or table. |
|[Lock resources from deletion](scripts/powershell/cassandra/lock.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Prevent resources from being deleted with resource locks. |
|||

## Mongo DB API Samples

|Task | Description |
|---|---|
|[Create an account, database and collection](scripts/powershell/mongodb/create.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an Azure Cosmos account, database and collection. |
|[Create an account, database and collection with autoscale](scripts/powershell/mongodb/autoscale.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an Azure Cosmos account, database and collection with autoscale. |
|[List or get databases or collections](scripts/powershell/mongodb/list-get.md?toc=%2fpowershell%2fmodule%2ftoc.json)| List or get database or collection. |
|[Get throughput](scripts/powershell/mongodb/throughput-get.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Get throughput for a database or collection. |
|[Update throughput](scripts/powershell/mongodb/throughput-update.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Update throughput for a database or collection. |
|[Lock resources from deletion](scripts/powershell/mongodb/lock.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Prevent resources from being deleted with resource locks. |
|||

## Gremlin API Samples

|Task | Description |
|---|---|
|[Create an account, database and graph](scripts/powershell/gremlin/create.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an Azure Cosmos account, database and graph. |
|[Create an account, database and graph with autoscale](scripts/powershell/gremlin/autoscale.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an Azure Cosmos account, database and graph with autoscale. |
|[List or get databases or graphs](scripts/powershell/gremlin/list-get.md?toc=%2fpowershell%2fmodule%2ftoc.json)| List or get database or graph. |
|[Get throughput](scripts/powershell/gremlin/throughput-get.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Get throughput for a database or graph. |
|[Update throughput](scripts/powershell/gremlin/throughput-update.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Update throughput for a database or graph. |
|[Lock resources from deletion](scripts/powershell/gremlin/lock.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Prevent resources from being deleted with resource locks. |
|||

## Table API Samples

|Task | Description |
|---|---|
|[Create an account and table](scripts/powershell/table/create.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an Azure Cosmos account and table. |
|[Create an account and table with autoscale](scripts/powershell/table/autoscale.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an Azure Cosmos account and table autoscale. |
|[List or get tables](scripts/powershell/table/list-get.md?toc=%2fpowershell%2fmodule%2ftoc.json)| List or get tables. |
|[Get throughput](scripts/powershell/table/throughput-get.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Get throughput for a table. |
|[Update throughput](scripts/powershell/table/throughput-update.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Update throughput for a table. |
|[Lock resources from deletion](scripts/powershell/table/lock.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Prevent resources from being deleted with resource locks. |
|||
