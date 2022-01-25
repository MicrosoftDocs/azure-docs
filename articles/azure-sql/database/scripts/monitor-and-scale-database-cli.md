---
title: "Azure CLI example: Monitor and scale a single database in Azure SQL Database" 
description: Use an Azure CLI example script to monitor and scale a single database in Azure SQL Database.
services: sql-database
ms.service: sql-database
ms.subservice: performance
ms.custom: sqldbrb=1, devx-track-azurecli
ms.devlang: azurecli
ms.topic: sample
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: kendralittle, mathoma
ms.date: 01/17/2022
---

# Use the Azure CLI to monitor and scale a single database in Azure SQL Database

[!INCLUDE[appliesto-sqldb](../../includes/appliesto-sqldb.md)]

This Azure CLI script example scales a single database in Azure SQL Database to a different compute size after querying the size information of the database.

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../../includes/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/sql-database/monitor-and-scale-database/monitor-and-scale-database.sh" range="4-32":::

> [!TIP]
> Use [az sql db op list](/cli/azure/sql/db/op?#az_sql_db_op_list) to get a list of operations performed on the database, and use [az sql db op cancel](/cli/azure/sql/db/op#az_sql_db_op_cancel) to cancel an update operation on the database.

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands. Each command in the table links to command-specific documentation.

| Script | Description |
|---|---|
| [az sql server](/cli/azure/sql/server) | Server commands. |
| [az sql db show-usage](/cli/azure/sql#az_sql_show_usage) | Shows the size usage information for a database. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional CLI script samples can be found in [Azure CLI sample scripts](../az-cli-script-samples-content-guide.md).
