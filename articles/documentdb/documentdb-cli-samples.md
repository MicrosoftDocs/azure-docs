---
title: Azure CLI Samples for DocumentDB | Microsoft Docs
description: Azure CLI Samples - Create and manage Azure DocumentDB accounts, databases, collections, regions, and firewalls. 
services: documentdb
documentationcenter: documnetdb
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

# Azure CLI samples for Azure DocumentDB

The following table includes links to sample Azure CLI scripts for Azure DocumentDB.

| |  |
|---|---|
|**Create NoSQL account and collections**||
| Create a Document API account, (database,?) and collections| Creates a single Azure DocumentDB account, database, and collection. |
| Create a MongoDB API account and collections | Creates a single Azure DocumentDB account, database, and collection for use with the API for MongoDB. |
| Create a Gremlin graph API account and collections | Creates a single Azure DocumentDB account, database, and collection for use with the API for Gremlin graph. |
| Create a Tables API database account and collections | Creates a single Azure DocumentDB account, database, and collection to use with the API for Tables. |
|**Scale NoSQL database**||
| Scale collection throughput | Changes the provisioned througput on a collection.|
| Autoscale a collection | Sets up alerts and creates an Azure function that scales collection throughput based on the alert.|
|Replicate NoSQL database account in multiple regions and configure failover priorities|Globally replicates account data into multiple regions with a specified failover priority.|
|**Secure NoSQL database**||
| Get account keys | Gets the primary and secondary master write keys and primary and secondary read-only keys for the account.|
| Get MongoDB connection string | Gets the connection string to connect your MongoDB app to your DocumentDB account.|
|Regenerate account keys|Regenerates the master or read-only key for the account.|
|Create a firewall| Creates an inbound IP access control policy to limit access to the account from an approved set of machines and/or cloud services.|
|**High availability, disaster recovery, backup and restore**||
|Configure failover policy|Sets the failover priority of each region in which the account is replicated.|
|**Connect NoSQL database to resources**||
|[Connect a web app to DocumentDB](https://docs.microsoft.com/en-us/azure/app-service-web/scripts/app-service-cli-app-service-documentdb?toc=%2fcli%2fazure%2ftoc.json)|Create and connect an Azure DocumentDB database and an Azure web app.|
|||