---
title: Azure CLI Samples for Azure Cosmos DB | Microsoft Docs
description: Azure CLI Samples - Create and manage Azure Cosmos DB accounts, databases, containers, regions, and firewalls. 
services: cosmos-db
author: mimig1
manager: jhubbard
editor: 
tags: azure-service-management

ms.assetid:
ms.service: cosmos-db
ms.custom: mvc
ms.devlang: azurecli
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: database
ms.date: 06/07/2017
ms.author: mimig
---

# Azure CLI samples for Azure Cosmos DB

The following table includes links to sample Azure CLI scripts for Azure Cosmos DB. Reference pages for all Azure Cosmos DB CLI commands are available in the [Azure CLI 2.0 Reference](https://docs.microsoft.com/cli/azure/cosmosdb).

| |  |
|---|---|
|**Create Azure Cosmos DB account, database, and containers**||
|[Create a DocumentDB, Graph, or Table API account](scripts/create-database-account-collections-cli.md)| Creates a single Azure Cosmos DB API account, database, and container for use with the DocumentDB, Graph, or Table APIs. |
| [Create a MongoDB API account](scripts/create-mongodb-database-account-cli.md) | Creates a single Azure Cosmos DB MongoDB API account, database, and collection. |
|**Scale Azure Cosmos DB**||
| [Scale container throughput](scripts/scale-collection-throughput-cli.md) | Changes the provisioned througput on a container.|
|[Replicate Azure Cosmos DB database account in multiple regions and configure failover priorities](scripts/scale-multiregion-cli.md)|Globally replicates account data into multiple regions with a specified failover priority.|
|**Secure Azure Cosmos DB**||
| [Get account keys](scripts/secure-get-account-key-cli.md) | Gets the primary and secondary master write keys and primary and secondary read-only keys for the account.|
| [Get MongoDB connection string](scripts/secure-mongo-connection-string-cli.md) | Gets the connection string to connect your MongoDB app to your Azure Cosmos DB account.|
|[Regenerate account keys](scripts/secure-regenerate-key-cli.md)|Regenerates the master or read-only key for the account.|
|[Create a firewall](scripts/create-firewall-cli.md)| Creates an inbound IP access control policy to limit access to the account from an approved set of machines and/or cloud services.|
|**High availability, disaster recovery, backup and restore**||
|[Configure failover policy](scripts/ha-failover-policy-cli.md)|Sets the failover priority of each region in which the account is replicated.|
|**Connect Azure Cosmos DB to resources**||
|[Connect a web app to Azure Cosmos DB](https://docs.microsoft.com/azure/app-service-web/scripts/app-service-cli-app-service-documentdb?toc=%2fcli%2fazure%2ftoc.json)|Create and connect an Azure Cosmos DB database and an Azure web app.|
|||
