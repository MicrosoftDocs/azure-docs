---
title: "Azure CLI example: Copy database in Azure SQL Database to new server"  
description: Use this Azure CLI example script to copy a database in Azure SQL Database to a new server
services: sql-database
ms.service: sql-database
ms.subservice: data-movement
ms.custom: devx-track-azurecli
ms.devlang: azurecli
ms.topic: sample
author: rothja
ms.author: jroth
ms.reviewer: mathoma
ms.date: 01/17/2022
---

# Use CLI to copy a database in Azure SQL Database to a new server

[!INCLUDE[appliesto-sqldb](../../includes/appliesto-sqldb.md)]

This Azure CLI script example creates a copy of an existing database in a new server.

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../../includes/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/sql-database/copy-database-to-new-server/copy-database-to-new-server.sh" range="4-36":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $targetResourceGroup
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Description |
|---|---|
| [az sql db copy](/cli/azure/sql/db#az_sql_db_copy) | Creates a copy of a database that uses the snapshot at the current time. |

## Next steps

For more information on Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database documentation](../az-cli-script-samples-content-guide.md).
