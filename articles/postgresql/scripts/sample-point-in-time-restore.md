---
title: Azure CLI script - Restore an Azure Database for PostgreSQL server
description: This sample Azure CLI script shows how to restore an Azure Database for PostgreSQL server and its databases to a previous point in time.
services: postgresql
author: rachel-msft
ms.author: raagyema
manager: kfile
editor: jasonwhowell
ms.service: postgresql
ms.devlang: azure-cli
ms.topic: sample
ms.custom: mvc
ms.date: 02/28/2018
---

# Restore an Azure Database for PostgreSQL server using Azure CLI
This sample CLI script restores a single Azure Database for PostgreSQL server to a previous point in time.

[!INCLUDE [cloud-shell-try-it](../../../includes/cloud-shell-try-it.md)]

If you choose to run the CLI locally, this article requires Azure CLI version 2.0 or later. Check the version by running `az --version`. See [Install Azure CLI]( /cli/azure/install-azure-cli) to install or upgrade your version of Azure CLI.

## Sample script
In this sample script, edit the highlighted lines to update the admin username and password to your own. Replace the subscription ID used in the `az monitor` commands with your own subscription ID.
[!code-azurecli-interactive[main](../../../cli_scripts/postgresql/backup-restore/backup-restore.sh?highlight=18-19 "Restore Azure Database for PostgreSQL.")]

## Clean up deployment
Use the following command to remove the resource group and all resources associated with it after the script has been run. 
[!code-azurecli-interactive[main](../../../cli_scripts/postgresql/backup-restore/delete-postgresql.sh  "Delete the resource group.")]

## Script explanation
This script uses the commands outlined in the following table:

| **Command** | **Notes** |
|---|---|
| [az group create](/cli/azure/group#az_group_create) | Creates a resource group in which all resources are stored. |
| [az postgresql server create](/cli/azure/postgres/server#az-postgres-server-create) | Creates a PostgreSQL server that hosts the databases. |
| [az postgresql server restore](/cli/azure/postgres/server#az-postgres-server-restore) | Restore a server from backup. |
| [az group delete](/cli/azure/group#az_group_delete) | Deletes a resource group including all nested resources. |

## Next steps
- Read more information on the Azure CLI: [Azure CLI documentation](/cli/azure).
- Try additional scripts: [Azure CLI samples for Azure Database for PostgreSQL](../sample-scripts-azure-cli.md)
- [How to backup and restore a server in Azure Database for PostgreSQL using the Azure portal](../howto-restore-server-portal.md)
