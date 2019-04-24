---
title: Azure PowerShell Samples for Azure Cosmos DB
description: Azure PowerShell Samples - Scripts to help you create and manage Azure Cosmos DB accounts. 
author: markjbrown
ms.service: cosmos-db
ms.topic: sample
ms.date: 05/08/2019
ms.author: mjbrown
---

# Azure PowerShell samples for Azure Cosmos DB

The following table includes links to sample Azure PowerShell scripts for Azure Cosmos DB for Core (SQL) API.

| |  |
|---|---|
|**Azure Cosmos accounts**||
|[Create an account](scripts/powershell/sql/ps-account-create.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an Azure Cosmos SQL API account. |
|[Get an account](scripts/powershell/sql/ps-account-create.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Get the properties of an Azure Cosmos account. |
|[Add a region](scripts/powershell/sql/ps-account-update.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Get an Azure Cosmos account and add a region to the list of locations. |
|[Change the failover priority](scripts/powershell/sql/ps-account-failover-priority-update.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Change the failover priority of an Azure Cosmos account with a manual failover trigger. |
|[Update tags](scripts/powershell/sql/ps-account-tags-update.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Update the tags for an Azure Cosmos account. |
|[Get account keys](scripts/powershell/sql/ps-account-key-get.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Get the primary and secondary keys of an Azure Cosmos account. |
|[Regenerate account keys](scripts/powershell/sql/ps-account-key-get.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Regenerate the primary and secondary keys of an Azure Cosmos account. |
|[List connection strings](scripts/powershell/sql/ps-account-connection-string-get.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Get the primary and secondary connection strings of an Azure Cosmos account. |
|[Create IP Firewall](scripts/powershell/sql/ps-account-firewall-create.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Create an IP Firewall for an Azure Cosmos account. |
|[Delete an Azure Cosmos account](scripts/powershell/sql/ps-account-delete.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Delete an Azure Cosmos account. |
|**Azure Cosmos databases**||
| [Create a database](scripts/powershell/sql/ps-database-create.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Create a database within an Azure Cosmos account.|
| [Create a database with shared/database-level throughput](scripts/powershell/sql/ps-database-create-shared.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Create an Azure Cosmos database with database-level throughput that is shared with its containers.|
| [List all databases](scripts/powershell/sql/ps-database-list.md?toc=%2fpowershell%2fmodule%2ftoc.json) | List all the databases in an Azure Cosmos account.|
| [Get a database](scripts/powershell/sql/ps-database-get.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Get the properties of an Azure Cosmos database.|
|**Azure Cosmos containers**||
| [Create a container](scripts/powershell/sql/ps-container-create.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Create an Azure Cosmos container with dedicated throughput.|
| [Create a container with shared throughput](scripts/powershell/sql/ps-container-create-shared.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Create an Azure Cosmos container with throughput shared with other containers in the database.|
| [Create a container with index policy](scripts/powershell/sql/ps-container-create-index-custom.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Create an Azure Cosmos container with a custom index policy.|
| [Create a container with no index policy](scripts/powershell/sql/ps-container-create-index-none.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Create an Azure Cosmos container with index policy turned off.|
| [Create a container with unique keys & TTL](scripts/powershell/sql/ps-container-create-unique-key-ttl.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Create an Azure Cosmos container with a unique key constraint and time-to-live configured.|
| [Create a container with conflict resolution](scripts/powershell/sql/ps-container-create-conflict-policy.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Create an Azure Cosmos container with last-writer-wins conflict resolution policy.|
| [List all containers](scripts/powershell/sql/ps-container-list.md?toc=%2fpowershell%2fmodule%2ftoc.json) | List all containers in an Azure Cosmos database.|
| [Get a container](scripts/powershell/sql/ps-container-get.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Get the properties for a container in an Azure Cosmos database.|
| [Delete a container](scripts/powershell/sql/ps-container-delete.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Delete a container in an Azure Cosmos database.|
|||