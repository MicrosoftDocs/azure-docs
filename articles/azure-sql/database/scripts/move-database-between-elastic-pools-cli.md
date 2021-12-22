---
title: "The Azure CLI: Move a database between elastic pools" 
description: Use an Azure CLI example script to create two elastic pools and move a database in SQL Database from one elastic pool to another.  
services: sql-database
ms.service: sql-database
ms.subservice: elastic-pools
ms.custom: sqldbrb=1, devx-track-azurecli
ms.devlang: azurecli
ms.topic: sample
author: arvindshmicrosoft 
ms.author: arvindsh
ms.reviewer: kendralittle, mathoma
ms.date: 12/07/2021
---
# Use the Azure CLI to move a database in SQL Database in a SQL elastic pool

This Azure CLI script example creates two elastic pools, moves a pooled database in SQL Database from one SQL elastic pool into another SQL elastic pool, and then moves the pooled database out of the SQL elastic pool to be a single database in SQL Database.

If you choose to install and use the CLI locally, this topic requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli).

## Sample script

### Sign in to Azure

Cloud Shell is automatically authenticated under the initial account signed-in with. Use the following script to sign in using a different subscription. Sign in to Azure using the appropriate subscription. [!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

```azurecli-interactive
subscription="<subscriptionId>" # add subscription here

az account set -s $subscription # ...or use 'az login'
```

For more information, see [set active subscription](/cli/azure/account#az_account_set) or [log in interactively](/cli/azure/reference-index#az_login)

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/sql-database/move-database-between-pools/move-database-between-pools.sh" range="4-39":::

### Clean up resources

Use the following command to remove the resource group and all resources associated with it - unless you have additional needs for these resources. Some of these resources may take a while to create, as well as to delete.

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands. Each command in the table links to command-specific documentation.

| Command | Description |
|---|---|
| [az sql server](/cli/azure/sql/server) | Server commands. |
| [az sql elastic-pools](/cli/azure/sql/elastic-pool) | Elastic pool commands. |
| [az sql db](/cli/azure/sql/db) | Database commands. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database documentation](../az-cli-script-samples-content-guide.md).
