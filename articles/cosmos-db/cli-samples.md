---
title: Azure CLI Samples for Azure Cosmos DB
description: Azure CLI Samples - Create and manage Azure Cosmos DB accounts, databases, containers, regions, and firewalls. 
author: markjbrown
ms.service: cosmos-db
ms.topic: sample
ms.date: 10/26/2018
ms.author: mjbrown
ms.reviewer: sngun
---

# Azure CLI samples for Azure Cosmos DB

The following table includes links to sample Azure CLI scripts for Azure Cosmos DB. Reference pages for all Azure Cosmos DB CLI commands are available in the [Azure CLI Reference](/cli/azure/cosmosdb).

| |  |
|---|---|
|**Create Azure Cosmos DB account, database, and containers**||
| [Create an Azure Cosmos DB account using SQL API](scripts/create-database-account-collections-cli.md?toc=%2fcli%2fazure%2ftoc.json)| Creates a single Azure Cosmos DB account, database, and container. |
| [Create an Azure Cosmos DB account using Cosmos DB's API for MongoDB](scripts/create-mongodb-database-account-cli.md?toc=%2fcli%2fazure%2ftoc.json) | Creates a single Azure Cosmos DB account, a database, and a collection. |
| [Create an Azure Cosmos DB account using Gremlin API](scripts/create-gremlin-database-account-cli.md?toc=%2fcli%2fazure%2ftoc.json) | Creates a single Azure Cosmos DB account, database, and graph. |
| [Create an Azure Cosmos DB account using Cassandra API](scripts/create-cassandra-database-account-cli.md?toc=%2fcli%2fazure%2ftoc.json) | Creates a single Azure Cosmos DB account and database. |
| [Create an Azure Cosmos DB account using Table API](scripts/create-table-database-account-cli.md?toc=%2fcli%2fazure%2ftoc.json) | Creates a single Azure Cosmos DB account, database, and table. |
|**Scale Azure Cosmos DB**||
| [Scale container throughput](scripts/scale-collection-throughput-cli.md?toc=%2fcli%2fazure%2ftoc.json) | Changes the provisioned throughput on a container.|
| [Replicate Azure Cosmos DB database account in multiple regions and configure failover priorities](scripts/scale-multiregion-cli.md?toc=%2fcli%2fazure%2ftoc.json)|Globally replicates account data into multiple regions with a specified failover priority.|
|**Secure Azure Cosmos DB**||
| [Get account keys](scripts/secure-get-account-key-cli.md?toc=%2fcli%2fazure%2ftoc.json) | Gets the primary and secondary master write keys and primary and secondary read-only keys for the account.|
| [Get the connection string for Cosmos account configured with Azure Cosmos DB's API for MongoDB](scripts/secure-mongo-connection-string-cli.md?toc=%2fcli%2fazure%2ftoc.json) | Gets the connection string to connect MongoDB app to your Azure Cosmos DB account.|
| [Regenerate account keys](scripts/secure-regenerate-key-cli.md?toc=%2fcli%2fazure%2ftoc.json)|Regenerate the keys for the account.|
| [Create a firewall](scripts/create-firewall-cli.md?toc=%2fcli%2fazure%2ftoc.json)| Create an inbound IP access control policy to limit access to the account from an approved set of machines and/or cloud services.|
|**High availability, disaster recovery, backup and restore**||
| [Configure failover policy](scripts/ha-failover-policy-cli.md?toc=%2fcli%2fazure%2ftoc.json)|Sets the failover priority of each region in which the account is replicated.|
|**Connect Azure Cosmos DB to resources**||
| [Connect a web app to Azure Cosmos DB](../app-service/scripts/cli-connect-to-documentdb.md?toc=%2fcli%2fazure%2ftoc.json)|Create and connect an Azure Cosmos DB database and an Azure web app.|
|||
