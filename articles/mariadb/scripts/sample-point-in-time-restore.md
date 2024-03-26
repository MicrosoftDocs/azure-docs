---
title: CLI script - Restore server - Azure Database for MariaDB
description: This sample Azure CLI script shows how to restore an Azure Database for MariaDB server and its databases to a previous point in time.
ms.service: mariadb
author: SudheeshGH
ms.author: sunaray
ms.devlang: azurecli
ms.topic: sample
ms.custom: mvc, devx-track-azurecli
ms.date: 02/11/2022 
---

# Restore an Azure Database for MariaDB server using Azure CLI

[!INCLUDE [azure-database-for-mariadb-deprecation](../includes/azure-database-for-mariadb-deprecation.md)]

This sample CLI script restores a single Azure Database for MariaDB server to a previous point in time.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-run-local-sign-in.md](../../../includes/cli-run-local-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/mariadb/backup-restore-pitr/backup-restore.sh" id="FullScript":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the commands outlined in the following table:

| **Command** | **Notes** |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az mariadb server create](/cli/azure/mariadb/server#az-mariadb-server-create) | Creates a MariaDB server that hosts the databases. |
| [az mariadb server restore](/cli/azure/mariadb/server#az-mariadb-server-restore) | Restore a server from backup. |
| [az group delete](/cli/azure/group#az-group-delete) | Deletes a resource group including all nested resources. |

## Next steps

- Read more information on the Azure CLI: [Azure CLI documentation](/cli/azure).
- Try additional scripts: [Azure CLI samples for Azure Database for MariaDB](../sample-scripts-azure-cli.md)
