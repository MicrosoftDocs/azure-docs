---
title: CLI script - Restore an Azure Database for MySQL - Flexible Server
description: This Azure CLI sample script shows how to restore a single Azure Database for MySQL - Flexible Server to a previous point in time.
author: shreyaaithal
ms.author: shaithal
ms.service: mysql
ms.devlang: azurecli
ms.topic: sample
ms.custom: mvc, devx-track-azurecli
ms.date: 09/15/2021
---

# Restore an Azure Database for MySQL - Flexible Server using Azure CLI

Azure Database for MySQL - Flexible Server, automatically creates server backups and securely stores them in local redundant storage within the region.

This sample CLI script performs a [point-in-time restore](../concepts-backup-restore.md) and creates a new server from your Flexible Server's backups. 

The new Flexible Server is created with the original server's configuration and also inherits tags and settings such as virtual network and firewall from the source server. The restored server's compute and storage tier, configuration and security settings can be changed after the restore is completed.

[!INCLUDE [flexible-server-free-trial-note](../../includes/flexible-server-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment](../../../../includes/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed. 

## Sample script

Edit the highlighted lines in the script with your values for variables.

[!code-azurecli-interactive[main](../../../../cli_scripts/mysql/flexible-server/backup-restore/restore-server.sh?highlight=7,10-12 "Perform point-in-time-restore of a source server to a new server.")]

## Clean up deployment

After the sample script has been run, the following code snippet can be used to clean up the resources.

[!code-azurecli-interactive[main](../../../../cli_scripts/mysql/flexible-server/backup-restore/clean-up-resources.sh?highlight=4-5 "Clean up resources.")]

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| **Command** | **Notes** |
|---|---|
|[az group create](/cli/azure/group#az_group_create)|Creates a resource group in which all resources are stored|
|[az mysql flexible-server create](/cli/azure/mysql/flexible-server#az_mysql_flexible_server_create)|Creates a Flexible Server that hosts the databases.|
|[az mysql flexible-server restore](/cli/azure/mysql/flexible-server#az_mysql_flexible_server_restore)|Restore a Flexible Server from backup.|
|[az mysql flexible-server show](/cli/azure/mysql/flexible-server#az_mysql_flexible_server_show)|Get details of a Flexible Server.|
|[az mysql flexible-server delete](/cli/azure/mysql/flexible-server#az_mysql_flexible_server_delete)|Deletes a Flexible Server.|
|[az group delete](/cli/azure/group#az_group_delete) | Deletes a resource group including all nested resources.|

## Next steps

- Try additional scripts: [Azure CLI samples for Azure Database for MySQL - Flexible Server](../sample-scripts-azure-cli.md)
- For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).