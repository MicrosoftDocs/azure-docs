---
title: CLI example-monitor-scale-single Azure SQL database 
description: Azure CLI example script to monitor and scale a single Azure SQL database
services: sql-database
ms.service: sql-database
ms.subservice: performance
ms.custom: 
ms.devlang: azurecli
ms.topic: sample
author: juliemsft
ms.author: jrasnick
ms.reviewer: carlrab
ms.date: 06/25/2019
---
# Use CLI to monitor and scale a single SQL database

This Azure CLI script example scales a single Azure SQL database to a different compute size after querying the size information of the database.

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

## Sample script

### Sign in to Azure

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

```azurecli-interactive
$subscription = "<subscriptionId>" # add subscription here

az account set -s $subscription # ...or use 'az login'
```

### Run the script

[!code-azurecli-interactive[main](../../../cli_scripts/sql-database/monitor-and-scale-database/monitor-and-scale-database.sh "Monitor and scale single SQL Database")]

> [!TIP]
> Use [az sql db op list](/cli/azure/sql/db/op?#az-sql-db-op-list) to get a list of operations performed on the database and [az sql db op cancel](/cli/azure/sql/db/op#az-sql-db-op-cancel) to cancel an update operation on the database.

### Clean up deployment

Use the following command to remove the resource group and all resources associated with it.

```azurecli-interactive
az group delete --name $resource
```

## Sample reference

This script uses the following commands. Each command in the table links to command specific documentation.

| | |
|---|---|
| [az sql server](/cli/azure/sql/server) | Server commands. |
| [az sql db show-usage](/cli/azure/sql#az-sql-show-usage) | Shows the size usage information for a single or pooled database. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database documentation](../sql-database-cli-samples.md).
