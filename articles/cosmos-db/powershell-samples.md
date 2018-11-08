---
title: Azure PowerShell Samples for Azure Cosmos DB | Microsoft Docs
description: Azure PowerShell Samples - Scripts to help you create and manage Azure Cosmos DB accounts. 
services: cosmos-db
author: SnehaGunda
manager: kfile
tags: azure-service-management

ms.service: cosmos-db
ms.custom: mvc
ms.devlang: na
ms.topic: sample
ms.date: 10/16/2017
ms.author: sngun
---

# Azure PowerShell samples for Azure Cosmos DB

The following table includes links to sample Azure PowerShell scripts for Azure Cosmos DB. At this time, you can only manage the Azure Cosmos DB account via PowerShell; other resources such as databases and containers cannot be managed via PowerShell.

| |  |
|---|---|
|**Create an Azure Cosmos DB account**||
|[Create a SQL API account](scripts/create-database-account-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates a single Azure Cosmos DB account to use with the SQL API. |
|[Create a MongoDB API account](scripts/create-mongodb-database-account-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates a single Azure Cosmos DB account to use with the MongoDB API. |
|[Create a Gremlin API account](scripts/create-graph-database-account-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates a single Azure Cosmos DB account to use with the Gremlin API. |
|[Create a Cassandra API account](scripts/create-and-configure-cassandra-database.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates a single Azure Cosmos DB account to use with the Cassandra API. |
|[Create a Table API account](scripts/create-table-database-account-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates a single Azure Cosmos DB account to use with the Table API. |
|**Scale Azure Cosmos DB**||
|[Replicate Azure Cosmos DB account in multiple regions and configure failover priorities](scripts/scale-multiregion-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json)|Globally replicates account data into multiple regions with a specified failover priority.|
|**Secure Azure Cosmos DB**||
| [Get account keys](scripts/secure-get-account-key-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Gets the primary and secondary master write keys and primary and secondary read-only keys for the account.|
| [Get MongoDB connection string](scripts/secure-mongo-connection-string-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Gets the connection string to connect your MongoDB app to your Azure Cosmos DB account.|
|[Regenerate account keys](scripts/secure-regenerate-key-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json)|Regenerates the master or read-only key for the account.|
|[Create a firewall](scripts/create-firewall-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an inbound IP access control policy to limit access to the account from an approved set of machines and/or cloud services.|
|**High availability, disaster recovery, backup, and restore**||
|[Configure failover policy](scripts/ha-failover-policy-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json)|Sets the failover priority of each region in which the account is replicated.|
|||
