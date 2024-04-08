---
title: Azure CLI script - Restore
description: This sample Azure CLI script shows how to restore an Azure Database for PostgreSQL - Flexible Server instance and its databases to a previous point in time.
ms.author: alkuchar
author: AwdotiaRomanowna
ms.service: postgresql
ms.devlang: azurecli
ms.topic: sample
ms.custom: mvc, devx-track-azurecli
ms.date: 02/11/2022 
---

# Restore an Azure Database for PostgreSQL - Flexible Server instance using Azure CLI

[!INCLUDE[applies-to-postgres-single-flexible-server](../includes/applies-to-postgresql-single-flexible-server.md)]

This sample CLI script restores a single Azure Database for PostgreSQL flexible server instance to a previous point in time.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-run-local-sign-in.md](../../../includes/cli-run-local-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/postgresql/backup-restore/backup-restore.sh" id="FullScript":::

## Clean up deployment

[!INCLUDE [cli-clean-up-resources.md](../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the commands outlined in the following table:

| **Command** | **Notes** |
|---|---|
| [az group create](/cli/azure/group) | Creates a resource group in which all resources are stored. |
| [az postgresql server create](/cli/azure/postgres/server#az-postgres-server-create) | Creates an Azure Database for PostgreSQL flexible server instance that hosts the databases. |
| [az postgresql server restore](/cli/azure/postgres/server#az-postgres-server-restore) | Restore a server from backup. |
| [az group delete](/cli/azure/group) | Deletes a resource group including all nested resources. |

## Next steps

- Read more information on the Azure CLI: [Azure CLI documentation](/cli/azure).
- Try additional scripts: [Azure CLI samples for Azure Database for PostgreSQL - Flexible Server](../sample-scripts-azure-cli.md)
- [How to backup and restore a server in Azure Database for PostgreSQL - Flexible Server using the Azure portal](../howto-restore-server-portal.md)
