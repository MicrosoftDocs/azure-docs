---
title: CLI script - Change server parameters - Azure Database for MariaDB
description: This sample CLI script lists all available server configurations and updates of an Azure Database for MariaDB.
ms.service: mariadb
author: SudheeshGH
ms.author: sunaray
ms.devlang: azurecli
ms.topic: sample
ms.custom: mvc, devx-track-azurecli
ms.date: 01/26/2022 
---

# List and update configurations of an Azure Database for MariaDB server using Azure CLI

[!INCLUDE [azure-database-for-mariadb-deprecation](../includes/azure-database-for-mariadb-deprecation.md)]

This sample CLI script lists all available configuration parameters as well as their allowable values for Azure Database for MariaDB server, and sets the *innodb_lock_wait_timeout* to a value that is other than the default one.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/mariadb/change-server-configurations/change-server-configurations.sh" id="FullScript":::

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
| [az mariadb server configuration list](/cli/azure/mariadb/server/configuration#az-mariadb-server-configuration-list) | List the configurations of an Azure Database for MariaDB server. |
| [az mariadb server configuration set](/cli/azure/mariadb/server/configuration#az-mariadb-server-configuration-set) | Update the configuration of an Azure Database for MariaDB server. |
| [az mariadb server configuration show](/cli/azure/mariadb/server/configuration#az-mariadb-server-configuration-show) | Show the configuration of an Azure Database for MariaDB server. |
| [az group delete](/cli/azure/group#az-group-delete) | Deletes a resource group including all nested resources. |

## Next steps

- Read more information on the Azure CLI: [Azure CLI documentation](/cli/azure).
- Try additional scripts: [Azure CLI samples for Azure Database for MariaDB](../sample-scripts-azure-cli.md)
- For more information on server parameters, see [How To Configure Server Parameters in Azure Database for MariaDB](../howto-server-parameters.md).
