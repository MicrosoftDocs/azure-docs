---
title: CLI example-Configure a failover group for a group of databases in Azure SQL Database 
description: Azure CLI example script to set up a failover group for a set of databases in Azure SQL Database and fail it over.
services: sql-database
ms.service: sql-database
ms.subservice: high-availability
ms.custom: 
ms.devlang: azurecli
ms.topic: sample
author: rothja
ms.author: jroth
ms.reviewer: mathoma
ms.date: 12/07/2021
---
# Use CLI to configure a failover group for a group of databases in Azure SQL Database

This Azure CLI script example configures a failover group for a group of databases in Azure SQL Database and fails it over to a secondary Azure SQL Database.

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

## Sample script

### Sign in to Azure

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

```azurecli-interactive
$subscription = "<subscriptionId>" # add subscription here

az account set -s $subscription # ...or use 'az login'
```

### Run the script

[!code-azurecli-interactive[main](../../../../cli_scripts/sql-database/setup-geodr-and-failover/setup-geodr-and-failover-database-failover-group.sh "Set up a failover group")]

### Clean up deployment

Use the following command to remove the resource group and all resources associated with it.

```azurecli-interactive
az group delete --name $resource
```

## Sample reference

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Description |
|---|---|
| [az sql failover-group create](/cli/azure/sql/failover-group#az_sql_failover_group_create) | Creates a failover group. |
| [az sql failover-group set-primary](/cli/azure/sql/failover-groupt#az_sql_failover_group_set_primary) | Set the primary of the failover group by failing over all databases from the current primary server |
| [az sql failover-group show](/cli/azure/sql/failover-group) | Gets a failover group |
| [az sql failover-group delete](/cli/azure/sql/failover-group) | Deletes a failover group |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database documentation](../../../azure-sql/database/az-cli-script-samples-content-guide.md).