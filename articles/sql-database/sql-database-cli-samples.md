---
title: Azure CLI Samples for SQL Database | Microsoft Docs
description: Azure CLI Samples - Create and manage Azure SQL Database servers, elastic pools, databases, and firewalls. 
services: sql-databas
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
ms.date: 02/18/2017
ms.author: janeng
---

# Azure CLI Samples for Azure SQL Database - BASH

The following table includes links to sample Azure CLI scripts for Azure SQL Database.


| Sample | Description  |
|---|---|
|**Create a single database**||
| [Create a SQL database and configure a firewall rule](sql-database-create-and-configure-database-cli.md) | The sample script provided here creates a Azure SQL database in the North Central US region. Once the script has been successfully run, the SQL Database can be access from all Azure services and the configured IP address. |
|**Monitor and scale a single database**||
| [Monitor and scale a SQL database](sql-database-monitor-and-scale-database-cli.md) | The sample script provided here creates a Azure SQL database in the North Central US region and scales it to a different performance level after querying the size information of the database. |
|**Create elastic pools and manage pooled databases**||
| [Create elastic pools and move databases between pools and out of a pool](sql-database-move-database-between-pools-cli.md) | The sample script provided here illustrates how a database can be moved from one elastic pool into another elastic pool and finally to a standalone performance level.|
|**Create and scale elastic pools**||
| [Create and scale an elastic pool](sql-database-scale-pool-cli.md) | The sample script provided here creates an elastic database pool in the North Central US region and scales the performance up.  |
