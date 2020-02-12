---
title: CLI example-backup-Azure SQL database 
description: Azure CLI example script to backup an Azure SQL single database to an Azure storage container
services: sql-database
ms.service: sql-database
ms.subservice: backup
ms.custom: 
ms.devlang: azurecli
ms.topic: sample
author: mashamsft
ms.author: mathoma
ms.reviewer: carlrab
ms.date: 03/27/2019
---
# Use CLI to backup an Azure SQL single database to an Azure storage container

This Azure CLI example backs up an Azure SQL database to an Azure storage container.  

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli).

## Sample script

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

### Sign in to Azure

```azurecli-interactive
$subscription = "<subscriptionId>" # add subscription here

az account set -s $subscription # ...or use 'az login'
```

### Run the script

[!code-azurecli-interactive[main](../../../cli_scripts/sql-database/backup-database/backup-database.sh "Restore SQL Database")]

### Clean up deployment

Use the following command to remove  the resource group and all resources associated with it.

```azurecli-interactive
az group delete --name $resourceGroup
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az sql server create](/cli/azure/sql/server#az-sql-server-create) | Creates a SQL Database server that hosts single databases and elastic pools. |
| [az sql db show](/cli/azure/sql/db#az-sql-db-show) | Gets a SQL standalone or pooled database. |
| [az sql db restore](/cli/azure/sql/db#az-sql-db-restore) | Restores a SQL standalone or pooled database. |
| [az sql db delete](/cli/azure/sql/db#az-sql-db-delete) | Removes an Azure SQL standalone or pooled database. |
| [az group delete](h/cli/azure/vm/extension#az-vm-extension-set) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database documentation](../sql-database-cli-samples.md).
