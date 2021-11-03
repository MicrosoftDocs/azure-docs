---
title: CLI script - Restart/stop/start an Azure Database for MySQL - Flexible Server (Preview)
description: This Azure CLI sample script shows how to Restart/Stop/Start an Azure Database for MySQL - Flexible Server.
author: shreyaaithal
ms.author: shaithal
ms.service: mysql
ms.devlang: azurecli
ms.topic: sample
ms.custom: mvc, devx-track-azurecli
ms.date: 09/15/2021
---

# Restart/stop/start an Azure Database for MySQL - Flexible Server (Preview) using Azure CLI

This sample CLI script performs restart, start and stop operations on an Azure Database for MySQL - Flexible Server. 

[!INCLUDE [flexible-server-free-trial-note](../../includes/flexible-server-free-trial-note.md)]


> [!IMPORTANT]
> When you **Stop** the server it remains in that state for the next 7 days in a stretch. If you do not manually **Start** it during this time, the server will automatically be started at the end of 7 days. You can chose to **Stop** it again if you are not using the server.

During the time server is stopped, no management operations can be performed on the server. In order to change any configuration settings on the server, you will need to start the server. 

Also, see [stop/start limitations](../concepts-limitations.md#stopstart-operation) before performing stop/start operations.


[!INCLUDE [azure-cli-prepare-your-environment](../../../../includes/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed. 

## Sample script

Edit the highlighted lines in the script with your values for variables.

[!code-azurecli-interactive[main](../../../../cli_scripts/mysql/flexible-server/manage-server/restart-start-stop.sh?highlight=7,10-11 "Create a server, perform restart / start / stop operations.")]

## Clean up deployment

After the sample script has been run, the following code snippet can be used to clean up the resources.

[!code-azurecli-interactive[main](../../../../cli_scripts/mysql/flexible-server/manage-server/clean-up-resources.sh?highlight=4 "Clean up resources.")]

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| **Command** | **Notes** |
|---|---|
|[az group create](/cli/azure/group#az_group_create)|Creates a resource group in which all resources are stored|
|[az mysql flexible-server create](/cli/azure/mysql/flexible-server#az_mysql_flexible_server_create)|Creates a Flexible Server that hosts the databases.|
|[az mysql flexible-server stop](/cli/azure/mysql/flexible-server#az_mysql_flexible_server_stop)|Stops a Flexible Server.|
|[az mysql flexible-server start](/cli/azure/mysql/flexible-server#az_mysql_flexible_server_start)|Starts a Flexible Server.|
|[az mysql flexible-server restart](/cli/azure/mysql/flexible-server#az_mysql_flexible_server_restart)|Restarts a Flexible Server.|
|[az mysql flexible-server delete](/cli/azure/mysql/flexible-server#az_mysql_flexible_server_delete)|Deletes a Flexible Server.|
|[az group delete](/cli/azure/group#az_group_delete) | Deletes a resource group including all nested resources.|

## Next steps

- Try additional scripts: [Azure CLI samples for Azure Database for MySQL - Flexible Server (Preview)](../sample-scripts-azure-cli.md)
- For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).