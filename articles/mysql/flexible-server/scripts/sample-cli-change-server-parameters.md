---
title: CLI Script - List and change server parameters of an Azure Database for MySQL - Flexible Server (Preview)
description: This Azure CLI sample script shows how to list and change server parameters of an Azure Database for MySQL - Flexible Server
author: shreyaaithal
ms.author: shaithal
ms.service: mysql
ms.devlang: azurecli
ms.topic: sample
ms.custom: mvc, devx-track-azurecli
ms.date: 09/13/2021
---

# List and change server parameters of an Azure Database for MySQL - Flexible Server (Preview) using Azure CLI

This sample CLI script lists all available server parameters as well as their allowable values for Azure Database for MySQL - Flexible Server, and sets the *max_connections* and global *time_zone* parameters to values other than the default ones.

[!INCLUDE [flexible-server-free-trial-note](../../includes/flexible-server-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment](../../../../includes/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed. 

# Sample Script

In this sample script, edit the highlighted lines to update the variable values.



# Clean up deployment

After the sample script has been run, the following code snippet can be used to clean up the resources.


# Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| **Command** | **Notes** |
|---|---|
|[az group create](/cli/azure/group#az_group_create)|Creates a resource group in which all resources are stored|
|[az mysql flexible-server create](/cli/azure/mysql/flexible-server#az_mysql_flexible_server_create)|Creates a Flexible Server that hosts the databases.|
|[az mysql flexible-server parameter list](/cli/azure/mysql/flexible-server/parameter#az_mysql_flexible_server_parameter_list)|Lists the parameter values for a flexible server.|
|[az mysql flexible-server parameter set](/cli/azure/mysql/flexible-server/parameter#az_mysql_flexible_server_parameter_set)|Updates the parameter of a flexible server.|
|[az mysql flexible-server parameter show](/cli/azure/mysql/flexible-server/parameter#az_mysql_flexible_server_parameter_show)|Get a specific parameter value for a flexible server.|
|[az mysql flexible-server delete](/cli/azure/mysql/flexible-server#az_mysql_flexible_server_delete)|Deletes a Flexible Server.|
|[az group delete](/cli/azure/group#az_group_delete) | Deletes a resource group including all nested resources.|

# Next Steps

