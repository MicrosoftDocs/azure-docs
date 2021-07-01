---
title: CLI script - Change server parameters - Azure Database for MariaDB
description: This sample CLI script lists all available server configurations and updates of an Azure Database for MariaDB.
author: savjani
ms.author: pariks
ms.service: mariadb
ms.devlang: azurecli
ms.topic: sample
ms.custom: mvc, devx-track-azurecli
ms.date: 12/02/2019
---

# List and update configurations of an Azure Database for MariaDB server using Azure CLI
This sample CLI script lists all available configuration parameters as well as their allowable values for Azure Database for MariaDB server, and sets the *innodb_lock_wait_timeout* to a value that is other than the default one.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Sample script
In this sample script, edit the highlighted lines to update the admin username and password to your own.
[!code-azurecli-interactive[main](../../../cli_scripts/mariadb/change-server-configurations/change-server-configurations.sh?highlight=15-16 "List and update configurations of Azure Database for MariaDB.")]

## Clean up deployment
Use the following command to remove the resource group and all resources associated with it after the script has been run.
[!code-azurecli-interactive[main](../../../cli_scripts/mariadb/change-server-configurations/delete-mariadb.sh  "Delete the resource group.")]

## Script explanation
This script uses the commands outlined in the following table:

| **Command** | **Notes** |
|---|---|
| [az group create](/cli/azure/group#az_group_create) | Creates a resource group in which all resources are stored. |
| [az mariadb server create](/cli/azure/mariadb/server#az_mariadb_server_create) | Creates a MariaDB server that hosts the databases. |
| [az mariadb server configuration list](/cli/azure/mariadb/server/configuration#az_mariadb_server_configuration_list) | List the configurations of an Azure Database for MariaDB server. |
| [az mariadb server configuration set](/cli/azure/mariadb/server/configuration#az_mariadb_server_configuration_set) | Update the configuration of an Azure Database for MariaDB server. |
| [az mariadb server configuration show](/cli/azure/mariadb/server/configuration#az_mariadb_server_configuration_show) | Show the configuration of an Azure Database for MariaDB server. |
| [az group delete](/cli/azure/group#az_group_delete) | Deletes a resource group including all nested resources. |

## Next steps
- Read more information on the Azure CLI: [Azure CLI documentation](/cli/azure).
- Try additional scripts: [Azure CLI samples for Azure Database for MariaDB](../sample-scripts-azure-cli.md)
- For more information on server parameters, see [How To Configure Server Parameters in Azure Database for MariaDB](../howto-server-parameters.md).
