---
title: CLI script - Configure audit logs on an Azure Database for MySQL - Flexible Server
description: This Azure CLI sample script shows how to configure audit logs on an Azure Database for MySQL - Flexible Server.
author: shreyaaithal
ms.author: shaithal
ms.service: mysql
ms.devlang: azurecli
ms.topic: sample
ms.custom: mvc, devx-track-azurecli
ms.date: 09/15/2021
---

# Configure audit logs on an Azure Database for MySQL - Flexible Server using Azure CLI

This sample CLI script enables [audit logs](../concepts-audit-logs.md) on an Azure Database for MySQL - Flexible Server. 


[!INCLUDE [flexible-server-free-trial-note](../../includes/flexible-server-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment](../../../../includes/azure-cli-prepare-your-environment.md)]


- This article requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed. 

## Sample script

Edit the highlighted lines in the script with your values for variables.

[!code-azurecli-interactive[main](../../../../cli_scripts/mysql/flexible-server/configure-logs/configure-audit-logs.sh?highlight=7,10-11 "Configure audit logs on Azure Database for MySQL - Flexible Server.")]


## Clean up deployment

After the sample script has been run, the following code snippet can be used to clean up the resources.

[!code-azurecli-interactive[main](../../../../cli_scripts/mysql/flexible-server/configure-logs/clean-up-resources.sh?highlight=4 "Clean up resources.")]


## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| **Command** | **Notes** |
|---|---|
|[az group create](/cli/azure/group#az_group_create)|Creates a resource group in which all resources are stored|
|[az mysql flexible-server create](/cli/azure/mysql/flexible-server#az_mysql_flexible_server_create)|Creates a Flexible Server that hosts the databases.|
|[az mysql flexible-server parameter set](/cli/azure/mysql/flexible-server/parameter#az_mysql_flexible_server_parameter_set)|Updates the parameter of a flexible server.|
|[az mysql flexible-server delete](/cli/azure/mysql/flexible-server#az_mysql_flexible_server_delete)|Deletes a Flexible Server.|
|[az group delete](/cli/azure/group#az_group_delete) | Deletes a resource group including all nested resources.|

## Next steps

- Try additional scripts: [Azure CLI samples for Azure Database for MySQL - Flexible Server](../sample-scripts-azure-cli.md)
- For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).