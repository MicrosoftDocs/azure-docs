---
title: CLI example-active geo-replication-single Azure SQL Database 
description: Azure CLI example script to set up active geo-replication for a single database in Azure SQL Database and fail it over.
services: sql-database
ms.service: sql-database
ms.subservice: high-availability
ms.custom: 
ms.devlang: azurecli
ms.topic: sample
author: mashamsft
ms.author: mathoma
ms.reviewer: carlrab
ms.date: 03/12/2019
---
# Use CLI to configure active geo-replication for a single database in Azure SQL Database

This Azure CLI script example configures active geo-replication for a single database and fails it over to a secondary replica of the database.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

## Sample scripts

[!code-azurecli-interactive[main](../../../cli_scripts/sql-database/setup-geodr-and-failover/setup-geodr-and-failover-single-database.sh "Set up active geo-replication for single database")]

## Clean up deployment

Use the following command to remove the resource group and all resources associated with it.

```azurecli-interactive
az group delete --name $resourceGroupName
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az sql server create](/cli/azure/sql/server#az-sql-server-create) | Creates a SQL Database server that hosts single databases and elastic pools. |
| [az sql elastic-pool create](/cli/azure/sql/elastic-pool#az-sql-elastic-pool-create) | Creates an elastic pool. |
| [az sql db update](/cli/azure/sql/db#az-sql-db-update) | Updates database properties (such as the service tier or compute size) or moves a database into, out of, or between elastic pools. |
| [az sql db replica create](/cli/azure/sql/db/replica#az-sql-db-replica-create) | Creates a secondary database for an existing database and starts data replication. |
| [az sql db show](/cli/azure/sql/db#az-sql-db-show) | Gets one or more databases. |
| [az sql db replica set-primary](/cli/azure/sql/db/replica#az-sql-db-replica-set-primary)| Switches a secondary database to be primary to initiate failover. |
| [az sql db replica list-links](/cli/azure/sql/db/replica#az-sql-db-replica-list-links) | Gets the geo-replication links between an Azure SQL Database and a resource group or SQL Server. |
| [az sql db replica delete-link](/cli/azure/sql/db/replica?view=azure-cli-latest#az-sql-db-replica-delete-link) | Terminates data replication between a SQL Database and the specified secondary database. |
| [az group delete](/cli/azure/vm/extension#az-vm-extension-set) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional SQL Database PowerShell script samples can be found in the [Azure SQL Database PowerShell scripts](../sql-database-powershell-samples.md).
