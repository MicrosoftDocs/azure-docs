---
title: Azure CLI script - Download server logs in Azure Database for PostgreSQL
description: This sample Azure CLI script shows how to enable and download the server logs of an Azure Database for PostgreSQL server.
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.devlang: azurecli
ms.topic: sample
ms.custom: mvc
ms.date: 02/28/2018
---

# Enable and download server slow query logs of an Azure Database for PostgreSQL server using Azure CLI
This sample CLI script enables and downloads the slow query logs of a single Azure Database for PostgreSQL server.

[!INCLUDE [cloud-shell-try-it](../../../includes/cloud-shell-try-it.md)]

If you choose to run the CLI locally, this article requires Azure CLI version 2.0 or later. Check the version by running `az --version`. See [Install Azure CLI]( /cli/azure/install-azure-cli) to install or upgrade your version of Azure CLI.

## Sample script
In this sample script, edit the highlighted lines to update the admin username and password to your own. Replace the &lt;log_file_name&gt; in the `az monitor` commands with your own server log file name.
[!code-azurecli-interactive[main](../../../cli_scripts/postgresql/server-logs/server-logs.sh?highlight=15-16 "Manipulate with server logs.")]

## Clean up deployment
Use the following command to remove the resource group and all resources associated with it after the script has been run. 
[!code-azurecli-interactive[main](../../../cli_scripts/postgresql/server-logs/delete-postgresql.sh  "Delete the resource group.")]

## Script explanation
This script uses the commands outlined in the following table:

| **Command** | **Notes** |
|---|---|
| [az group create](/cli/azure/group) | Creates a resource group in which all resources are stored. |
| [az postgres server create](/cli/azure/postgres/server) | Creates a PostgreSQL server that hosts the databases. |
| [az postgres server configuration list](/cli/azure/postgres/server/configuration) | List the configuration values for a server. |
| [az postgres server configuration set](/cli/azure/postgres/server/configuration) | Update the configuration of a server. |
| [az postgres server-logs list](/cli/azure/postgres/server-logs) | List log files for a server. |
| [az postgres server-logs download](/cli/azure/postgres/server-logs) | Download log files. |
| [az group delete](/cli/azure/group) | Deletes a resource group including all nested resources. |

## Next steps
- Read more information on the Azure CLI: [Azure CLI documentation](/cli/azure).
- Try additional scripts: [Azure CLI samples for Azure Database for PostgreSQL](../sample-scripts-azure-cli.md)
- [Configure and access server logs in the Azure portal](../howto-configure-server-logs-in-portal.md)
