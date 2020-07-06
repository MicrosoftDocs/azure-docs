---
title: CLI example- Failover group - Azure SQL Database elastic pool 
description: Azure CLI example script to create an Azure SQL Database elastic pool, add it to a failover group, and test failover. 
services: sql-database
ms.service: sql-database
ms.subservice: high-availability
ms.custom: 
ms.devlang: azurecli
ms.topic: sample
author: MashaMSFT
ms.author: mathoma
ms.reviewer: carlrab
ms.date: 07/16/2019
---
# Use CLI to add an Azure SQL Database elastic pool to a failover group

This Azure CLI script example creates a single database, adds it to an elastic pool, creates a failover group, and tests failover.

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

## Sample script

### Sign in to Azure

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

```azurecli-interactive
$subscription = "<subscriptionId>" # add subscription here

az account set -s $subscription # ...or use 'az login'
```

### Run the script

[!code-azurecli-interactive[main](../../../cli_scripts/sql-database/failover-groups/add-elastic-pool-to-failover-group-az-cli.sh "Add elastic pool to a failover group")]

### Clean up deployment

Use the following command to remove the resource group and all resources associated with it.

```azurecli-interactive
az group delete --name $resource
```

## Sample reference

This script uses the following commands. Each command in the table links to command specific documentation.

| | |
|---|---|
| [az sql elastic-pool](/cli/azure/sql/elastic-pool) | Elastic pool commands. |
| [az sql failover-group ](/cli/azure/sql/failover-group) | Failover group commands. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure/overview).

Additional SQL Database Azure CLI script samples can be found in the [Azure SQL Database Azure CLI scripts](../../azure-sql/database/az-cli-script-samples-content-guide.md).
