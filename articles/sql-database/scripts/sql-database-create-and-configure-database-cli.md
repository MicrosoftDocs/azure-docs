---
title: CLI example-create an Azure SQL database | Microsoft Docs
description: Use this Azure CLI example script to create a SQL database.
services: sql-database
ms.service: sql-database
ms.subservice: single-database
ms.custom: 
ms.devlang: azurecli
ms.topic: sample
author: stevestein
manager: craigg
ms.author: sstein
ms.reviewer:
manager: craigg
ms.date: 06/25/2019
---
# Use CLI to create a single Azure SQL database and configure a firewall rule

This Azure CLI script example creates an Azure SQL database and configure a server-level firewall rule. Once the script has been successfully run, the SQL Database can be accessed from all Azure services and the configured IP address.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this topic requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli).

## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/sql-database/create-and-configure-database/create-and-configure-database.sh "Create SQL Database")]

## Clean up deployment

Use the following command to remove  the resource group and all resources associated with it.

```azurecli-interactive
az group delete --name $resourceGroupName
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az sql server create](/cli/azure/sql/server#az-sql-server-create) | Creates a SQL Database server that hosts a single database or elastic pool. |
| [az sql server firewall create](/cli/azure/sql/server/firewall-rule#az-sql-server-firewall-rule-create) | Creates a firewall rule to allow access to all single databases an elastic pools on the SQL Database server from the entered IP address range. |
| [az sql db create](/cli/azure/sql/db#az-sql-db-create) | Creates a single database or elastic pool. |
| [az group delete](/cli/azure/resource#az-resource-delete) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database documentation](../sql-database-cli-samples.md).
