---
title: CLI example-monitor-scale-single Azure SQL database | Microsoft Docs
description: Azure CLI example script to monitor and scale a single Azure SQL database
services: sql-database
ms.service: sql-database
ms.subservice: performance
ms.custom: 
ms.devlang: azurecli
ms.topic: sample
author: CarlRabeler
ms.author: carlrab
ms.reviewer: 
manager: craigg
ms.date: 10/02/2018
---
# Use CLI to monitor and scale a single SQL database

This Azure CLI script example scales a single Azure SQL database to a different compute size after querying the size information of the database. 

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli). 

## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/sql-database/monitor-and-scale-database/monitor-and-scale-database.sh "Monitor and scale single SQL Database")]

> [!TIP]
> Use [az sql db op list](/cli/azure/sql/db/op?#az-sql-db-op-list) to get a list of operations performed on the database and use [az sql db op cancel](/cli/azure/sql/db/op#az-sql-db-op-cancel) to cancel an update operation on the database.

## Clean up deployment

After the script sample has been run, the following command can be used to remove the resource group and all resources associated with it.

```azurecli-interactive
az group delete --name myResourceGroup
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](https://docs.microsoft.com/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az sql server create](https://docs.microsoft.com/cli/azure/sql/server#az-sql-server-create) | Creates a logical server that hosts a database. |
| [az sql db show-usage](https://docs.microsoft.com/cli/azure/sql/db#az-sql-db-show-usage) | Shows the size usage information for a database. |
| [az sql db update](https://docs.microsoft.com/cli/azure/sql/db#az-sql-db-update) | Updates database properties (such as the service tier or compute size) or moves a database into, out of, or between elastic pools. |
| [az group delete](https://docs.microsoft.com/cli/azure/vm/extension#az-vm-extension-set) | Deletes a resource group including all nested resources. |
|||

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database documentation](../sql-database-cli-samples.md).
