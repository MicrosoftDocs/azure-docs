---
title: Azure CLI Samples for Azure Cosmos DB SQL (Core) API
description: Azure CLI Samples for Azure Cosmos DB SQL (Core) API 
author: markjbrown
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: sample
ms.date: 06/03/2020
ms.author: mjbrown
---

# Azure CLI samples for Azure Cosmos DB Core (SQL) API

The following table includes links to sample Azure CLI scripts for Azure Cosmos DB Core (SQL) API. Reference pages for all Azure Cosmos DB CLI commands are available in the [Azure CLI Reference](/cli/azure/cosmosdb). For Azure CLI samples for other Azure Cosmos DB APIs see, [Cassandra API](cli-samples-cassandra.md), [MongoDB API](cli-samples-mongodb.md), [Gremlin API](cli-samples-gremlin.md), and [Table API](cli-samples-table.md). All Azure Cosmos DB CLI script samples can be found in the [Azure Cosmos DB CLI GitHub Repository](https://github.com/Azure-Samples/azure-cli-samples/tree/master/cosmosdb).

|Task | Description |
|---|---|
| [Create an Azure Cosmos account, database and container](scripts/cli/sql/create.md?toc=%2fcli%2fazure%2ftoc.json)| Creates an Azure Cosmos DB account, database, and container for SQL (Core) API. |
| [Change throughput](scripts/cli/sql/throughput.md?toc=%2fcli%2fazure%2ftoc.json) | Update RU/s on a database and container.|
| [Add or failover regions](scripts/cli/common/regions.md?toc=%2fcli%2fazure%2ftoc.json) | Add a region, change failover priority, trigger a manual failover.|
| [Account keys and connection strings](scripts/cli/common/keys.md?toc=%2fcli%2fazure%2ftoc.json) | List account keys, read-only keys, regenerate keys and list connection strings.|
| [Secure with IP firewall](scripts/cli/common/ipfirewall.md?toc=%2fcli%2fazure%2ftoc.json)| Create a Cosmos account with IP firewall configured.|
| [Secure new account with service endpoints](scripts/cli/common/service-endpoints.md?toc=%2fcli%2fazure%2ftoc.json)| Create a Cosmos account and secure with service-endpoints.|
| [Secure existing account with service endpoints](scripts/cli/common/service-endpoints-ignore-missing-vnet.md?toc=%2fcli%2fazure%2ftoc.json)| Update a Cosmos account to secure with service-endpoints when the subnet is eventually configured.|
| [Lock resources from deletion](scripts/cli/sql/lock.md?toc=%2fcli%2fazure%2ftoc.json)| Prevent resources from being deleted with  resource locks.|
|||
