---
title: "The Azure CLI: Scale an elastic pool"
description: Use an Azure CLI example script to scale an elastic pool in Azure SQL Database.
services: sql-database
ms.service: sql-database
ms.subservice: elastic-pools
ms.custom: sqldbrb=1
ms.devlang: azurecli
ms.topic: sample
author: stevestein
ms.author: sstein
ms.reviewer:
ms.date: 06/25/2019
---

# Use the Azure CLI to scale an elastic pool in Azure SQL Database

[!INCLUDE[appliesto-sqldb](../../includes/appliesto-sqldb.md)]

This Azure CLI script example creates elastic pools in Azure SQL Database, moves pooled databases, and changes elastic pool compute sizes.

If you choose to install and use the Azure CLI locally, this topic requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli).

## Sample script

### Sign in to Azure

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

### Run the script

[!code-azurecli-interactive[main](../../../../cli_scripts/sql-database/scale-pool/scale-pool.sh "Move database between pools")]

### Clean up deployment

Use the following command to remove  the resource group and all resources associated with it.

```azurecli-interactive
az group delete --name $resource
```

## Sample reference

This script uses the following commands. Each command in the table links to command-specific documentation.

| | |
|---|---|
| [az sql server](/cli/azure/sql/server) | Server commands. |
| [az sql db](/cli/azure/sql/db) | Database commands. |
| [az sql elastic-pools](/cli/azure/sql/elastic-pool) | Elastic pool commands. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database documentation](../az-cli-script-samples-content-guide.md).
