---
title: Azure CLI script - Change server configurations (PostgreSQL)
description: This sample CLI script lists all available server configuration options and updates the value of one of the options.
ms.author: sunila
author: sunilagarwal
ms.service: postgresql
ms.devlang: azurecli
ms.topic: sample
ms.custom: mvc, devx-track-azurecli
ms.date: 01/26/2022 
---

# List and update configurations of an Azure Database for PostgreSQL server using Azure CLI

[!INCLUDE[applies-to-postgres-single-flexible-server](../includes/applies-to-postgresql-single-flexible-server.md)]

This sample CLI script lists all available configuration parameters as well as their allowable values for Azure Database for PostgreSQL server, and sets the *log_retention_days* to a value that is other than the default one.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/postgresql/change-server-configurations/change-server-configurations.sh" id="FullScript":::

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
| [az postgres server create](/cli/azure/postgres/server) | Creates a PostgreSQL server that hosts the databases. |
| [az postgres server configuration list](/cli/azure/postgres/server/configuration) | List the configurations of an Azure Database for PostgreSQL server. |
| [az postgres server configuration set](/cli/azure/postgres/server/configuration) | Update the configuration of an Azure Database for PostgreSQL server. |
| [az postgres server configuration show](/cli/azure/postgres/server/configuration) | Show the configuration of an Azure Database for PostgreSQL server. |
| [az group delete](/cli/azure/group) | Deletes a resource group including all nested resources. |

## Next steps

- Read more information on the Azure CLI: [Azure CLI documentation](/cli/azure).
- Try additional scripts: [Azure CLI samples for Azure Database for PostgreSQL](../sample-scripts-azure-cli.md)
- For more information on server parameters, see [How To Configure server parameters in Azure portal](../howto-configure-server-parameters-using-portal.md).
