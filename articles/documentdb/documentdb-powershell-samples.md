---
title: Azure PowerShell Samples for DocumentDB | Microsoft Docs
description: Azure PowerShell Samples - Scripts to help you create and manage Azure DocumentDB accounts, databases, and collections. 
services: documentdb
author: mimig1
manager: jhubbard
editor: ''
tags: azure-service-management

ms.assetid:
ms.service: documentdb
ms.custom: sample
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: database
ms.date: 04/20/2017
ms.author: mimig
---

# Azure PowerShell samples for Azure DocumentDB

The following table includes links to sample Azure PowerShell scripts for Azure DocumentDB.

| |  |
|---|---|
|**Create DocumentDB account**||
|[Create a Document API account](scripts/documentdb-create-database-account-powershell.md)| Creates a single Azure DocumentDB account to use with the DocumentDB API. |
| [Create a MongoDB API account](scripts/documentdb-create-mongodb-database-account-powershell.md) | Creates a single Azure DocumentDB account for use with the API for MongoDB. |
| [Create a Graph API account](scripts/documentdb-create-gremlin-graph-database-account-powershell.md) | Creates a single Azure DocumentDB account for use with the Graph API. |
| [Create a Tables API account](scripts/documentdb-create-tables-database-account-powershell.md) | Creates a single Azure DocumentDB account for use with the Tables API. |
|**Scale DocumentDB database**||
| [Scale collection throughput](scripts/documentdb-scale-collection-throughput-powershell.md) | Changes the provisioned througput on a collection.|
|[Replicate DocumentDB database account in multiple regions and configure failover priorities](scripts/documentdb-scale-multiregion-powershell.md)|Globally replicates account data into multiple regions with a specified failover priority.|
|**Secure DocumentDB database**||
| [Get account keys](scripts/documentdb-secure-get-account-key-powershell.md) | Gets the primary and secondary master write keys and primary and secondary read-only keys for the account.|
| [Get MongoDB connection string](scripts/documentdb-secure-mongo-connection-string-powershell.md) | Gets the connection string to connect your MongoDB app to your DocumentDB account.|
|[Regenerate account keys](scripts/documentdb-secure-regenerate-key-powershell.md)|Regenerates the master or read-only key for the account.|
|[Create a firewall](scripts/documentdb-create-firewall-powershell.md)| Creates an inbound IP access control policy to limit access to the account from an approved set of machines and/or cloud services.|
|**High availability, disaster recovery, backup and restore**||
|[Configure failover policy](scripts/documentdb-ha-failover-policy-powershell.md)|Sets the failover priority of each region in which the account is replicated.|
|||