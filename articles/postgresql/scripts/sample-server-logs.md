---
title: Azure CLI script - Download server logs
description: This sample Azure CLI script shows how to enable and download the server logs of an Azure Database for PostgreSQL - Flexible Server instance.
ms.author: sunila
author: sunilagarwal
ms.service: postgresql
ms.devlang: azurecli
ms.topic: sample
ms.custom: mvc, devx-track-azurecli
ms.date: 01/26/2022 
---

# Enable and download server slow query logs of an Azure Database for PostgreSQL - Flexible Server instance using Azure CLI

[!INCLUDE[applies-to-postgres-single-flexible-server](../includes/applies-to-postgresql-single-flexible-server.md)]

This sample CLI script enables and downloads the slow query logs of a single Azure Database for PostgreSQL flexible server instance.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/postgresql/server-logs/server-logs.sh" id="FullScript":::

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
| [az postgres server create](/cli/azure/postgres/server) | Creates an Azure Database for PostgreSQL flexible server instance that hosts the databases. |
| [az postgres server configuration list](/cli/azure/postgres/server/configuration) | Lists the configuration values for a server. |
| [az postgres server configuration set](/cli/azure/postgres/server/configuration) | Updates the configuration of a server. |
| [az postgres server-logs list](/cli/azure/postgres/server-logs) | Lists log files for a server. |
| [az postgres server-logs download](/cli/azure/postgres/server-logs) | Downloads log files. |
| [az group delete](/cli/azure/group) | Deletes a resource group including all nested resources. |

## Next steps

- Read more information on the Azure CLI: [Azure CLI documentation](/cli/azure).
- Try additional scripts: [Azure CLI samples for Azure Database for PostgreSQL - Flexible Server instance](../sample-scripts-azure-cli.md)
- [Configure and access server logs in the Azure portal](../howto-configure-server-logs-in-portal.md)
