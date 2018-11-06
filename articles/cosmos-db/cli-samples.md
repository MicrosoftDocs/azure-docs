---
title: Azure CLI Samples for Azure Cosmos DB | Microsoft Docs
description: Azure CLI Samples - Create and manage Azure Cosmos DB accounts, databases, containers, regions, and firewalls. 
author: markjbrown

ms.service: cosmos-db
ms.topic: sample
ms.date: 10/26/2018
ms.author: mjbrown
---

# Azure CLI samples for Azure Cosmos DB

The following table includes links to sample Azure CLI scripts for Azure Cosmos DB. Reference pages for all Azure Cosmos DB CLI commands are available in the [Azure CLI Reference](/cli/azure/cosmosdb).

| |  |
|---|---|
|**Create Azure Cosmos DB account, database, and containers**||
| [Create a SQL API account](scripts/create-database-account-collections-cli.md?toc=%2fcli%2fazure%2ftoc.json)| Creates a single Azure Cosmos DB SQL API account, database, and container. |
| [Create a MongoDB API account](scripts/create-mongodb-database-account-cli.md?toc=%2fcli%2fazure%2ftoc.json) | Creates a single Azure Cosmos DB MongoDB API account, database, and collection. |
| [Create a Gremlin API account](scripts/create-gremlin-database-account-cli.md?toc=%2fcli%2fazure%2ftoc.json) | Creates a single Azure Cosmos DB Gremlin API account, database, and graph. |
| [Create a Cassandra API account](scripts/create-cassandra-database-account-cli.md?toc=%2fcli%2fazure%2ftoc.json) | Creates a single Azure Cosmos DB Cassandra API account and database. |
| [Create a Table API account](scripts/create-table-database-account-cli.md?toc=%2fcli%2fazure%2ftoc.json) | Creates a single Azure Cosmos DB Table API account, database, and table. |
|**Scale Azure Cosmos DB**||
| [Scale container throughput](scripts/scale-collection-throughput-cli.md?toc=%2fcli%2fazure%2ftoc.json) | Changes the provisioned throughput on a container.|
| [Replicate Azure Cosmos DB database account in multiple regions and configure failover priorities](scripts/scale-multiregion-cli.md?toc=%2fcli%2fazure%2ftoc.json)|Globally replicates account data into multiple regions with a specified failover priority.|
|**Secure Azure Cosmos DB**||
| [Get account keys](scripts/secure-get-account-key-cli.md?toc=%2fcli%2fazure%2ftoc.json) | Gets the primary and secondary master write keys and primary and secondary read-only keys for the account.|
| [Get MongoDB connection string](scripts/secure-mongo-connection-string-cli.md?toc=%2fcli%2fazure%2ftoc.json) | Gets the connection string to connect your MongoDB app to your Azure Cosmos DB account.|
| [Regenerate account keys](scripts/secure-regenerate-key-cli.md?toc=%2fcli%2fazure%2ftoc.json)|Regenerate the keys for the account.|
| [Create a firewall](scripts/create-firewall-cli.md?toc=%2fcli%2fazure%2ftoc.json)| Create an inbound IP access control policy to limit access to the account from an approved set of machines and/or cloud services.|
|**High availability, disaster recovery, backup and restore**||
| [Configure failover policy](scripts/ha-failover-policy-cli.md?toc=%2fcli%2fazure%2ftoc.json)|Sets the failover priority of each region in which the account is replicated.|
|**Connect Azure Cosmos DB to resources**||
| [Connect a web app to Azure Cosmos DB](../app-service/scripts/app-service-cli-app-service-documentdb.md?toc=%2fcli%2fazure%2ftoc.json)|Create and connect an Azure Cosmos DB database and an Azure web app.|
|||
