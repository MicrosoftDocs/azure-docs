---
title: Azure CLI Samples for Azure Cosmos DB | Microsoft Docs
description: Azure CLI Samples - Create and manage Azure Cosmos DB accounts, databases, collections, regions, and firewalls. 
services: documentdb
author: mimig1
manager: jhubbard
editor: 
tags: azure-service-management

ms.assetid:
ms.service: documentdb
ms.custom: sample
ms.devlang: azurecli
ms.topic: article
ms.tgt_pltfrm: documentdb
ms.workload: database
ms.date: 04/12/2017
ms.author: mimig
---

# Azure CLI samples for Azure Cosmos DB

The following table includes links to sample Azure CLI scripts for Azure Cosmos DB.

| |  |
|---|---|
|**Create Azure Cosmos DB account, database, and collections**||
|[Create a Document API account, database, and collections](scripts/documentdb-create-database-account-collections-cli.md)| Creates a single Azure Cosmos DB DocumentDB API account, database, and collection. |
| [Create a MongoDB API account, database, and collections](scripts/documentdb-create-mongodb-database-account-cli.md) | Creates a single Azure Cosmos DB MongoDB API account, database, and collection. |
| [Create a Graph API account, database, and collections](scripts/documentdb-create-gremlin-graph-database-account-cli.md) | Creates a single Azure Cosmos DB Graph API account, database, and collection. |
| [Create a Tables API account, database, and collections](scripts/documentdb-create-tables-database-account-cli.md) | Creates a single Azure Cosmos DB account, database, and collection. |
|**Scale Azure Cosmos DB**||
| [Scale collection throughput](scripts/documentdb-scale-collection-throughput-cli.md) | Changes the provisioned througput on a collection.|
| [Autoscale a collection](scripts/documentdb-autoscale-collection-cli.md) | Sets up alerts and creates an Azure function that scales collection throughput based on the alert.|
|[Replicate Azure Cosmos DB database account in multiple regions and configure failover priorities](scripts/documentdb-scale-multiregion-cli.md)|Globally replicates account data into multiple regions with a specified failover priority.|
|**Secure Azure Cosmos DB**||
| [Get account keys](scripts/documentdb-secure-get-account-key-cli.md) | Gets the primary and secondary master write keys and primary and secondary read-only keys for the account.|
| [Get MongoDB connection string](scripts/documentdb-secure-mongo-connection-string-cli.md) | Gets the connection string to connect your MongoDB app to your Azure Cosmos DB account.|
|[Regenerate account keys](scripts/documentdb-secure-regenerate-key-cli.md)|Regenerates the master or read-only key for the account.|
|[Create a firewall](scripts/documentdb-create-firewall-cli.md)| Creates an inbound IP access control policy to limit access to the account from an approved set of machines and/or cloud services.|
|**High availability, disaster recovery, backup and restore**||
|[Configure failover policy](scripts/documentdb-ha-failover-policy-cli.md)|Sets the failover priority of each region in which the account is replicated.|
|**Connect Azure Cosmos DB to resources**||
|[Connect a web app to Azure Cosmos DB](https://docs.microsoft.com/azure/app-service-web/scripts/app-service-cli-app-service-documentdb?toc=%2fcli%2fazure%2ftoc.json)|Create and connect an Azure Cosmos DB database and an Azure web app.|
|||