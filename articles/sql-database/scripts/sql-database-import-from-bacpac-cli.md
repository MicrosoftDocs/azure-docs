---
title: CLI example import BACPAC file Azure SQL database 
description: Azure CLI example script to import a BACPAC file into a SQL database
services: sql-database
ms.service: sql-database
ms.subservice: data-movement
ms.custom: load & move data
ms.devlang: azurecli
ms.topic: sample
author: stevestein
ms.author: sstein
ms.reviewer: carlrab
ms.date: 05/24/2019
---
# Use CLI to import a BACPAC file into an Azure SQL database

This Azure CLI script example imports a database from a BACPAC file into an Azure SQL database.  

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/sql-database/import-from-bacpac/import-from-bacpac.sh "Create SQL Database")]

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
| [az sql server firewall-rule create](/cli/azure/sql/server/firewall-rule#az-sql-server-firewall-rule-create) | Creates a SQL Database server firewall rule to allow access to all single databases and pooled database on the SQL Database server from the entered IP address range. |
| [az sql db import](/cli/azure/sql/db#az-sql-db-import) | Imports a BACPAC file and create a new database on the server. |
| [az group delete](/cli/azure/vm/extension#az-vm-extension-set) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database documentation](../sql-database-cli-samples.md).
