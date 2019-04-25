---
title: Azure CLI script examples for SQL Database | Microsoft Docs
description: Azure CLI script examples to create and manage Azure SQL Database servers, elastic pools, databases, and firewalls. 
services: sql-database
ms.service: sql-database
ms.subservice: service
ms.custom: overview-samples, mvc
ms.devlang: azurecli
ms.topic: sample
author: stevestein
ms.author: sstein
ms.reviewer:
manager: craigg
ms.date: 02/03/2019
---

# Azure CLI samples for Azure SQL Database

Azure SQL Database can be configured using <a href="/cli/azure">Azure CLI</a>.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this topic requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli).

## Single database & Elastic pools

The following table includes links to Azure CLI script examples for Azure SQL Database.

| |  |
|---|---|
|**Create a single database and an elastic pool**||
| [Create a single database and configure a firewall rule](scripts/sql-database-create-and-configure-database-cli.md?toc=%2fcli%2fazure%2ftoc.json) | This CLI script example creates a single Azure SQL database and configures a server-level firewall rule. |
| [Create elastic pools and move pooled databases](scripts/sql-database-move-database-between-pools-cli.md?toc=%2fcli%2fazure%2ftoc.json) | This CLI script example creates SQL elastic pools, and moves pooled Azure SQL databases, and changes compute sizes.|
|**Scale a single database and an elastic pool**||
| [Scale a single database](scripts/sql-database-monitor-and-scale-database-cli.md?toc=%2fcli%2fazure%2ftoc.json) | This CLI script example scales a single Azure SQL database to a different compute size after querying the size information for the database. |
| [Scale an elastic pool](scripts/sql-database-scale-pool-cli.md?toc=%2fcli%2fazure%2ftoc.json) | This CLI script example scales a SQL elastic pool to a different compute size.  |
|||

Learn more about the [Single Database Azure CLI API](sql-database-single-databases-manage.md#azure-cli-manage-sql-database-servers-and-single-databases).

## Managed Instance

The following table includes links to Azure CLI script examples for Azure SQL Database - Managed Instance.

| |  |
|---|---|
| [Create a Managed Instance](https://blogs.msdn.microsoft.com/sqlserverstorageengine/20../../create-azure-sql-managed-instance-using-azure-cli/) | This CLI script shows how to create a Managed Instance. |
| [Update a Managed Instance](https://blogs.msdn.microsoft.com/sqlserverstorageengine/20../../modify-azure-sql-database-managed-instance-using-azure-cli/) | This CLI script shows how to update a Managed Instance. |
| [Move a database to another Managed Instance](https://blogs.msdn.microsoft.com/sqlserverstorageengine/20../../cross-instance-point-in-time-restore-in-azure-sql-database-managed-instance/) | This CLI script shows how to restore a backup of a database from one instance to another. |
|||

Learn more about the [Managed Instance Azure CLI API](sql-database-managed-instance-create-manage.md#azure-cli-create-and-manage-managed-instances) and find [additional examples here](https://medium.com/azure-sqldb-managed-instance/working-with-sql-managed-instance-using-azure-cli-611795fe0b44).
