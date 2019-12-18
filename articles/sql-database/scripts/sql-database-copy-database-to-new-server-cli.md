---
title: CLI example-copy-Azure SQL database-new server 
description: Azure CLI example script to copy a SQL database to a new server
services: sql-database
ms.service: sql-database
ms.subservice: data-movement
ms.custom: 
ms.devlang: azurecli
ms.topic: sample
author: stevestein
ms.author: sstein
ms.reviewer: carlrab
ms.date: 03/12/2019
---
# Use CLI to copy a SQL database to a new server

This Azure CLI script example creates a copy of an existing database in a new server.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

## Copy a database to a new server

[!code-azurecli-interactive[main](../../../cli_scripts/sql-database/copy-database-to-new-server/copy-database-to-new-server.sh "Copy database to new server")]

## Clean up deployment

Use the following command to remove the resource group and all resources associated with it.

```azurecli-interactive
az group delete --name $sourceresourcegroupname
az group delete --name $targetresourcegroupname
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az sql server create](/cli/azure/sql/server#az-sql-server-create) | Creates a SQL Database server that hosts single databases and elastic pools. |
| [az sql db create](/cli/azure/sql/db?view=azure-cli-latest#az-sql-db-create) | Creates a single database or elastic pool. |
| [az sql db copy](/cli/azure/sql/db#az-sql-db-copy) | Creates a copy of a database that uses the snapshot at the current time. |
| [az group delete](/cli/azure/vm/extension#az-vm-extension-set) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database documentation](../sql-database-cli-samples.md).
