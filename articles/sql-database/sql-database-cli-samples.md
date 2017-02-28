---
title: Azure CLI Samples for SQL Database | Microsoft Docs
description: Azure CLI Samples - Create and manage Azure SQL Database servers, elastic pools, databases, and firewalls. 
services: sql-database
documentationcenter: sql-database
author: CarlRabeler
manager: jhubbard
editor: tysonn
tags: azure-service-management

ms.assetid:
ms.service: sql-database
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: sql-database
ms.workload: database
ms.date: 02/21/2017
ms.author: janeng
---

# Azure SQL Database CLI Samples

The following table includes links to sample Azure CLI scripts for Azure SQL Database.

| |  |
|---|---|
|**Create databases and firewall rules**||
| [Create a single SQL database and configure a firewall rule](sql-database-create-and-configure-database-cli.md) | The sample script provided here illustrates how to create an Azure SQL database and configure a server-level firewall rule. Once the script has been successfully run, the SQL Database can be accessed from all Azure services and the configured IP address. |
| [Create elastic pools and move pooled databases between pools and out of a pool](sql-database-move-database-between-pools-cli.md) | The sample script provided here illustrates how a database can be moved from one elastic pool into another elastic pool and finally to a standalone performance level.|
|**Monitor and scale databases**||
| [Monitor and scale a single SQL database](sql-database-monitor-and-scale-database-cli.md) | The sample script provided here illustrates how to scale a single Azure SQL database to a different performance level after querying the size information for the database. |
| [Create and scale an elastic pool](sql-database-scale-pool-cli.md) | The sample script provided here creates an elastic database pool in the North Central US region and scales the performance up.  |
|||
