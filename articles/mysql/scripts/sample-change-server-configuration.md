---
title: CLI script - Change server parameters - Azure Database for MySQL
description: This sample CLI script lists all available server configurations and updates the value of innodb_lock_wait_timeout.
author: savjani
ms.author: pariks
ms.service: mysql
ms.devlang: azurecli
ms.topic: sample
ms.custom: mvc, devx-track-azurecli
ms.date: 12/02/2019
---

# List and update configurations of an Azure Database for MySQL server using Azure CLI
This sample CLI script lists all available configuration parameters as well as their allowable values for Azure Database for MySQL server, and sets the *innodb_lock_wait_timeout* to a value that is other than the default one.

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed. 

## Sample script
In this sample script, edit the highlighted lines to update the admin username and password to your own.
[!code-azurecli-interactive[main](../../../cli_scripts/mysql/change-server-configurations/change-server-configurations.sh?highlight=15-16 "List and update configurations of Azure Database for MySQL.")]

## Clean up deployment
Use the following command to remove the resource group and all resources associated with it after the script has been run. 
[!code-azurecli-interactive[main](../../../cli_scripts/mysql/change-server-configurations/delete-mysql.sh  "Delete the resource group.")]

## Script explanation
This script uses the commands outlined in the following table:

| **Command** | **Notes** |
|---|---|
| [az group create](/cli/azure/group#az_group_create) | Creates a resource group in which all resources are stored. |
| [az mysql server create](/cli/azure/mysql/server#az_mysql_server_create) | Creates a MySQL server that hosts the databases. |
| [az mysql server configuration list](/cli/azure/mysql/server/configuration#az_mysql_server_configuration_list) | List the configurations of an Azure Database for MySQL server. |
| [az mysql server configuration set](/cli/azure/mysql/server/configuration#az_mysql_server_configuration_set) | Update the configuration of an Azure Database for MySQL server. |
| [az mysql server configuration show](/cli/azure/mysql/server/configuration#az_mysql_server_configuration_show) | Show the configuration of an Azure Database for MySQL server. |
| [az group delete](/cli/azure/group#az_group_delete) | Deletes a resource group including all nested resources. |

## Next steps
- Read more information on the Azure CLI: [Azure CLI documentation](/cli/azure).
- Try additional scripts: [Azure CLI samples for Azure Database for MySQL](../sample-scripts-azure-cli.md)
- For more information on server parameters, see [How To Configure Server Parameters in Azure Database for MySQL](../howto-server-parameters.md).
