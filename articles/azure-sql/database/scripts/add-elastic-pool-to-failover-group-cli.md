---
title: CLI example- Failover group - Azure SQL Database elastic pool 
description: Azure CLI example script to create an Azure SQL Database elastic pool, add it to a failover group, and test failover. 
services: sql-database
ms.service: sql-database
ms.subservice: high-availability
ms.custom: 
ms.devlang: azurecli
ms.topic: sample
author: rothja
ms.author: jroth
ms.reviewer: mathoma
ms.date: 12/06/2021
---
# Use CLI to add an Azure SQL Database elastic pool to a failover group

This Azure CLI script example creates a single database, adds it to an elastic pool, creates a failover group, and tests failover.

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

## Sample script

### Sign in to Azure

Sign in to Azure using the appropriate subscription. [!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

```azurecli-interactive
subscription="<subscriptionId>" # add subscription here

az account set -s $subscription # ...or use 'az login'
```

For more information, see [set active subscription](/cli/azure/account#az_account_set) or [log in interactively](/cli/azure/reference-index#az_login)

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/sql-database/failover-groups/add-elastic-pool-to-failover-group-az-cli.sh" range="4-62":::

### Clean up deployment

Use the following command to remove the resource group and all resources associated with it.

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Description |
|---|---|
| [az sql elastic-pool](/cli/azure/sql/elastic-pool) | Elastic pool commands. |
| [az sql failover-group ](/cli/azure/sql/failover-group) | Failover group commands. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure/overview).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database documentation](../az-cli-script-samples-content-guide.md).
