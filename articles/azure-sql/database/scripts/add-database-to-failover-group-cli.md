---
title: "Azure CLI example: Add a database to a failover group" 
description: Use this Azure CLI example script to create a database in Azure SQL Database, add it to an auto-failover group, and test failover. 
services: sql-database
ms.service: sql-database
ms.subservice: high-availability
ms.custom: sqldbrb=1, devx-track-azurecli
ms.devlang: azurecli
ms.topic: sample
author: emlisa
ms.author: emlisa
ms.reviewer: kendralittle, mathoma
ms.date: 01/17/2022
---

# Use Azure CLI to add a database to a failover group

[!INCLUDE[appliesto-sqldb](../../includes/appliesto-sqldb.md)]

This Azure CLI script example creates a database in Azure SQL Database, creates a failover group, adds the database to it, and tests failover.

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../../includes/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/sql-database/failover-groups/add-single-db-to-failover-group-az-cli.sh" range="4-47":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands. Each command in the table links to command-specific documentation.

| Command | Description |
|---|---|
| [az sql db](/cli/azure/sql/db) | Database commands. |
| [az sql failover-group](/cli/azure/sql/failover-group) | Failover group commands. |

## Next steps

For more information on Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database documentation](../az-cli-script-samples-content-guide.md).
