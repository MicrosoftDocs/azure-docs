---
title: "Azure CLI: Restore a backup"  
description: Azure CLI example script to restore a database in Azure SQL Database to an earlier point in time from automatic backups. 
services: sql-database
ms.service: sql-database
ms.subservice: operations
ms.custom: 
ms.devlang: azurecli
ms.topic: sample
author: mashamsft
ms.author: mathoma
ms.reviewer: carlrab
ms.date: 03/27/2019
---
# Use CLI to restore a single database in Azure SQL Database to an earlier point in time

This Azure CLI example restores a single database in Azure SQL Database to a specific point in time.  

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli).

## Sample script

### Sign in to Azure

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

```azurecli-interactive
$subscription = "<subscriptionId>" # add subscription here

az account set -s $subscription # ...or use 'az login'
```

### Run the script

[!code-azurecli-interactive[main](../../../cli_scripts/sql-database/restore-database/restore-database.sh "Restore SQL Database")]

### Clean up deployment

Use the following command to remove  the resource group and all resources associated with it.

```azurecli-interactive
az group delete --name $resource
```

## Sample reference

This script uses the following commands. Each command in the table links to command specific documentation.

| | |
|---|---|
| [az sql db restore](/cli/azure/sql/db#az-sql-db-restore) | Restore database command. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database documentation](../../azure-sql/database/az-cli-script-samples-content-guide.md).
