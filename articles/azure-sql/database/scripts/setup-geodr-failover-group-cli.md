---
title: "Azure CLI example: Configure a failover group for a group of databases in Azure SQL Database"
description: Use this Azure CLI example script to set up a failover group for a set of databases in Azure SQL Database and fail it over.
services: sql-database
ms.service: sql-database
ms.subservice: high-availability
ms.custom: 
ms.devlang: azurecli
ms.topic: sample
author: rothja
ms.author: jroth
ms.reviewer: mathoma
ms.date: 01/17/2022
---

# Use CLI to configure a failover group for a group of databases in Azure SQL Database

[!INCLUDE[appliesto-sqldb](../../includes/appliesto-sqldb.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../../includes/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/sql-database/setup-geodr-and-failover/setup-geodr-and-failover-database-failover-group.sh" range="4-45":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $failoverResourceGroup -y
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Description |
|---|---|
| [az sql failover-group create](/cli/azure/sql/failover-group#az_sql_failover_group_create) | Creates a failover group. |
| [az sql failover-group set-primary](/cli/azure/sql/failover-group#az-sql-failover-group-set-primary) | Set the primary of the failover group by failing over all databases from the current primary server |
| [az sql failover-group show](/cli/azure/sql/failover-group) | Gets a failover group |
| [az sql failover-group delete](/cli/azure/sql/failover-group) | Deletes a failover group |

## Next steps

For more information on Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database documentation](../../../azure-sql/database/az-cli-script-samples-content-guide.md).
