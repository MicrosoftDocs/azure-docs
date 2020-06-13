---
title: "The Azure CLI: Move a database between elastic pools" 
description: Use an Azure CLI example script to create two elastic pools and move a database in SQL Database from one elastic pool to another.  
services: sql-database
ms.service: sql-database
ms.subservice: elastic-pools
ms.custom: sqldbrb=1
ms.devlang: azurecli
ms.topic: sample
author: stevestein
ms.author: sstein
ms.reviewer: carlrab
ms.date: 06/25/2019
---
# Use the Azure CLI to move a database in SQL Database in a SQL elastic pool

This Azure CLI script example creates two elastic pools, moves a pooled database in SQL Database from one SQL elastic pool into another SQL elastic pool, and then moves the pooled database out of the SQL elastic pool to be a single database in SQL Database.

If you choose to install and use the CLI locally, this topic requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli).

## Sample script

### Sign in to Azure

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

### Run the script

[!code-azurecli-interactive[main](../../../../cli_scripts/sql-database/move-database-between-pools/move-database-between-pools.sh "Move database between pools")]

### Clean up deployment

Use the following command to remove  the resource group and all resources associated with it.

```azurecli-interactive
az group delete --name $resource
```

## Sample reference

This script uses the following commands. Each command in the table links to command-specific documentation.

| | |
|---|---|
| [az sql server](/cli/azure/sql/server) | Server commands. |
| [az sql elastic-pools](/cli/azure/sql/elastic-pool) | Elastic pool commands. |
| [az sql db](/cli/azure/sql/db) | Database commands. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database documentation](../az-cli-script-samples-content-guide.md).
