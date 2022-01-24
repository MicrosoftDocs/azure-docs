---
title: "Azure CLI example: Restore geo-backup - Azure SQL Database" 
description: Use this Azure CLI example script to restore an Azure SQL Managed Instance Database from a geo-redundant backup.
services: sql-database
ms.service: sql-database
ms.subservice: backup-restore
ms.custom: 
ms.devlang: azurecli
ms.topic: sample
author: rothja
ms.author: jroth
ms.reviewer: mathoma
ms.date: 01/18/2022
---

# Use CLI to restore a Managed Instance database to another geo-region

[!INCLUDE[appliesto-sqldb](../../includes/appliesto-sqlmi.md)]

This Azure CLI script example restores an Azure SQL Managed Instance database from a remote geo-region (geo-restore) to a point in time.

This sample requires an existing pair of managed instances, see [Use Azure CLI to create an Azure SQL Managed Instance](create-configure-managed-instance-cli.md) to create a pair of managed instances in different regions.

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../../includes/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-run-local-sign-in.md](../../../../includes/cli-run-local-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/sql-database/sql-managed-instance-restore-geo-backup/restore-geo-backup-cli.sh" range="4-28":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands. Each command in the table links to command specific documentation.

| Script | Description |
|---|---|
| [az sql midb](/cli/azure/sql/midb) | Managed Instance Database commands. |

## Next steps

For more information on Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database documentation](../../../azure-sql/database/az-cli-script-samples-content-guide.md).
