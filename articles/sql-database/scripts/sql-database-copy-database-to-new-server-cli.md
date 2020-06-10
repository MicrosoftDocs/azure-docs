---
title: "Azure CLI: Copy database in Azure SQL Database to new server"  
description: Azure CLI example script to copy a database in Azure SQL Database to a new server
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
# Use CLI to copy a database in Azure SQL Database to a new server

This Azure CLI script example creates a copy of an existing database in a new server.

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

## Sample script

### Sign in to Azure

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

```azurecli-interactive
$subscription = "<subscriptionId>" # add subscription here

az account set -s $subscription # ...or use 'az login'
```

### Run the script

[!code-azurecli-interactive[main](../../../cli_scripts/sql-database/copy-database-to-new-server/copy-database-to-new-server.sh "Copy database to new server")]

### Clean up deployment

Use the following command to remove the resource group and all resources associated with it.

```azurecli-interactive
az group delete --name $resource
az group delete --name $targetResource
```

## Sample reference

This script uses the following commands. Each command in the table links to command specific documentation.

| | |
|---|---|
| [az sql db copy](/cli/azure/sql/db#az-sql-db-copy) | Creates a copy of a database that uses the snapshot at the current time. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database documentation](../../azure-sql/database/az-cli-script-samples-content-guide.md).
