---
title: CLI example of auditing and Advanced Threat Protection - Azure SQL Database  
description: Azure CLI example script to configure auditing and Advanced Threat Protection in an Azure SQL Database
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.custom: security
ms.devlang: azurecli
ms.topic: sample
author: ronitr
ms.author: ronitr
ms.reviewer: carlrab, vanto
ms.date: 08/05/2019
---
# Use CLI to configure SQL Database auditing and Advanced Threat Protection

This Azure CLI script example configures SQL Database auditing and Advanced Threat Protection.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this topic requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/sql-database/database-auditing-and-threat-detection/database-auditing-and-threat-detection.sh "Configure auditing and threat detection")]

## Clean up deployment

Use the following command to remove the resource group and all resources associated with it.

```azurecli-interactive
az group delete --name $resourceGroupName
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az sql server create](/cli/azure/sql/server#az-sql-server-create) | Creates a SQL Database server that hosts a single database or elastic pool. |
| [az sql db create](/cli/azure/sql/db#az-sql-db-create) | Creates a single database or elastic pool. |
| [az storage account create](/cli/azure/storage/account#az-storage-account-create) | Creates a Storage account. |
| [az sql db audit-policy update](/cli/azure/sql/db/audit-policy#az-sql-db-audit-policy-update) | Sets the auditing policy for a database. |
| [az sql db threat-policy update](/cli/azure/sql/db/threat-policy#az-sql-db-threat-policy-update) | Sets an Advanced Threat Protection policy on a database. |
| [az group delete](/cli/azure/resource#az-resource-delete) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database documentation](../sql-database-cli-samples.md).
