---
title: CLI example- Failover group - Azure SQL Database elastic pool 
description: Azure CLI example script to create an Azure SQL Database elastic pool, add it to a failover group, and test failover. 
services: sql-database
ms.service: sql-database
ms.subservice: high-availability
ms.custom: 
ms.devlang: azurecli
ms.topic: sample
author: MashaMSFT
ms.author: mathoma
ms.reviewer: carlrab
ms.date: 07/16/2019
---
# Use CLI to add an Azure SQL Database elastic pool to a failover group

This Azure CLI script example creates a single database, adds it to an elastic pool, creates a failover group, and tests failover.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

## Sample scripts

[!code-azurecli-interactive[main](../../../cli_scripts/sql-database/failover-groups/add-elastic-pool-to-failover-group-az-cli.sh "Add elastic pool to a failover group")]

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
| [az sql server firewall-rule create](/cli/azure/sql/server/firewall-rule#az-sql-server-firewall-rule-create) | Creates a firewall rule for a logical server. |
| [az sql db create](/cli/azure/sql/db?view=azure-cli-latest#az-sql-db-create) | Creates a new Azure SQL Database single database. |
| [az sql elastic-pool create](/cli/azure/sql/elastic-pool#az-sql-elastic-pool-create) | Creates an elastic database pool for a an Azure SQL Database.|
| [az sql db update](/cli/azure/sql/db#az-sql-db-update) | Sets properties for a database, or moves an existing database into an elastic pool. |
| [az sql failover-group create](/cli/azure/sql/failover-group#az-sql-failover-group-create) | Creates a new failover group. |
| [az sql db show](/cli/azure/sql/db#az-sql-db-show) | Gets one or more SQL databases. |
| [az sql failover-group update](/cli/azure/sql/failover-group#az-sql-failover-group-update) | Adds one or more Azure SQL Databases to a failover group. |
| [az sql failover-group show](/cli/azure/sql/failover-group#az-sql-failover-group-show) | Gets or lists Azure SQL Database failover groups. |
| [az sql failover-group set-primary](/cli/azure/sql/failover-group#az-sql-failover-group-set-primary)| Executes a failover of an Azure SQL Database failover group. |
| [az group delete](/cli/azure/vm/extension#az-vm-extension-set) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional SQL Database PowerShell script samples can be found in the [Azure SQL Database PowerShell scripts](../sql-database-powershell-samples.md).
