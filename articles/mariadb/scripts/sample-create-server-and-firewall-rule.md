---
title: CLI script - Create server - Azure Database for MariaDB
description: This sample CLI script creates an Azure Database for MariaDB server and configures a server-level firewall rule.
author: ajlam
ms.author: andrela
ms.service: mariadb
ms.devlang: azurecli
ms.topic: sample
ms.custom: mvc
ms.date: 11/28/2018
---

# Create a MariaDB server and configure a firewall rule using the Azure CLI
This sample CLI script creates an Azure Database for MariaDB server and configures a server-level firewall rule. Once the script runs successfully, the MariaDB server is accessible by all Azure services and the configured IP address.

[!INCLUDE [cloud-shell-try-it](../../../includes/cloud-shell-try-it.md)]

If you choose to run the CLI locally, this article requires Azure CLI version 2.0 or later. Check the version by running `az --version`. See [Install Azure CLI]( /cli/azure/install-azure-cli) to install or upgrade your version of Azure CLI.

## Sample script
In this sample script, edit the highlighted lines to update the admin username and password to your own.
[!code-azurecli-interactive[main](../../../cli_scripts/mariadb/create-mariadb-server-and-firewall-rule/create-mariadb-server-and-firewall-rule.sh?highlight=15-16 "Create an Azure Database for mariadb, and server-level firewall rule.")]

## Clean up deployment
Use the following command to remove the resource group and all resources associated with it after the script has been run.
[!code-azurecli-interactive[main](../../../cli_scripts/mariadb/create-mariadb-server-and-firewall-rule/delete-mariadb.sh "Delete the resource group.")]

## Script explanation
This script uses the commands outlined in the following table:

| **Command** | **Notes** |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az mariadb server create](/cli/azure/mariadb/server#az-mariadb-server-create) | Creates a MariaDB server that hosts the databases. |
| [az mariadb server firewall create](/cli/azure/mariadb/server/firewall-rule#az-mariadb-server-firewall-rule-create) | Creates a firewall rule to allow access to the server and databases under it from the entered IP address range. |
| [az group delete](/cli/azure/group#az-group-delete) | Deletes a resource group including all nested resources. |

## Next steps
- Read more information on the Azure CLI: [Azure CLI documentation](/cli/azure).
- Try additional scripts: [Azure CLI samples for Azure Database for MariaDB](../sample-scripts-azure-cli.md)
