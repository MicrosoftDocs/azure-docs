---
title: "Azure CLI example: Configure active geo-replication for an elastic pool" 
description: Use this Azure CLI example script to set up active geo-replication for a pooled database in Azure SQL Database and fail it over.
services: sql-database
ms.service: sql-database
ms.subservice: high-availability
ms.custom: sqldbrb=1, devx-track-azurecli
ms.devlang: azurecli
ms.topic: sample
author: rothja
ms.author: jroth
ms.reviewer: mathoma
ms.date: 01/05/2022
---

# Use CLI to configure active geo-replication for a pooled database in Azure SQL Database

[!INCLUDE[appliesto-sqldb](../../includes/appliesto-sqldb.md)]

This Azure CLI script example configures active geo-replication for a pooled database in Azure SQL Database and fails it over to the secondary replica of the database.

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../../includes/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/sql-database/setup-geodr-and-failover/setup-geodr-and-failover-elastic-pool.sh" range="4-47":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
az group delete --name $secondaryResourceGroup
```

## Sample reference

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Description |
|---|---|
| [az sql elastic-pool](/cli/azure/sql/elastic-pool) | Elastic pool commands |
| [az sql db replica](/cli/azure/sql/db/replica) | Database replication commands. |

## Next steps

For more information on Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database documentation](../../../azure-sql/database/az-cli-script-samples-content-guide.md).
