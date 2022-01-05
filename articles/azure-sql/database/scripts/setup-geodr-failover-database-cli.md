---
title: "Azure CLI example: Active geo-replication-single Azure SQL Database"
description: Use this Azure CLI example script to set up active geo-replication for a single database in Azure SQL Database and fail it over.
services: sql-database
ms.service: sql-database
ms.subservice: high-availability
ms.custom: 
ms.devlang: azurecli
ms.topic: sample
author: rothja
ms.author: jroth
ms.reviewer: mathoma
ms.date: 12/23/2021
---

# Use CLI to configure active geo-replication for a single database in Azure SQL Database

[!INCLUDE[appliesto-sqldb](../../includes/appliesto-sqldb.md)]

This Azure CLI script example configures active geo-replication for a single database and fails it over to a secondary replica of the database.

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../../includes/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/sql-database/setup-geodr-and-failover/setup-geodr-and-failover-single-database.sh" range="4-46":::

### Clean up resources

Use the following command to remove the resource group and all resources associated with it using the [az group delete](/cli/azure/vm/extension#az_vm_extension_set) command - unless you have an ongoing need for these resources. Some of these resources may take a while to create, as well as to delete.

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Description |
|---|---|
| [az sql db replica](/cli/azure/sql/db/replica) | Database replica commands. |

## Next steps

For more information on Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database documentation](../../../azure-sql/database/az-cli-script-samples-content-guide.md).
