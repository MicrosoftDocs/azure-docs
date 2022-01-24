---
title: "Azure CLI example: Restore a backup"  
description: Use this Azure CLI example script to restore a database in Azure SQL Database to an earlier point in time from automatic backups. 
services: sql-database
ms.service: sql-database
ms.subservice: backup-restore
ms.custom: devx-track-azurecli
ms.devlang: azurecli
ms.topic: sample
author: rothja
ms.author: jroth
ms.reviewer: carlrab
ms.date: 01/18/2022
---

# Use CLI to restore a single database in Azure SQL Database to an earlier point in time

[!INCLUDE[appliesto-sqldb](../../includes/appliesto-sqldb.md)]

This Azure CLI example restores a single database in Azure SQL Database to a specific point in time.  

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../../includes/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-run-local-sign-in.md](../../../../includes/cli-run-local-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/sql-database/restore-database/restore-database.sh" range="4-39":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Description |
|---|---|
| [az sql db restore](/cli/azure/sql/db#az_sql_db_restore) | Restore database command. |

## Next steps

For more information on Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database documentation](../../../azure-sql/database/az-cli-script-samples-content-guide.md).
