---
title: CLI script - Configure zone-redundant high availability in an Azure Database for MySQL - Flexible Server
description: This Azure CLI sample script shows how to configure Zone-Redundant high availability in an Azure Database for MySQL - Flexible Server.
author: shreyaaithal
ms.author: shaithal
ms.service: mysql
ms.devlang: azurecli
ms.topic: sample
ms.custom: mvc, devx-track-azurecli
ms.date: 09/15/2021
---

# Configure zone-redundant high availability in an Azure Database for MySQL - Flexible Server using Azure CLI

This sample CLI script configures and manages [Zone-Redundant high availability](../concepts-high-availability.md) in an Azure Database for MySQL - Flexible Server. 
You can enable Zone-Redundant high availability only during Flexible Server creation, and can disable it anytime. You can also choose the availability zone for the primary and the standby replica. 

Currently, Zone-Redundant high availability is supported only for the General purpose and Memory optimized pricing tiers.


[!INCLUDE [flexible-server-free-trial-note](../../includes/flexible-server-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment](../../../../includes/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed. 

## Sample script

Edit the highlighted lines in the script with your values for variables.

[!code-azurecli-interactive[main](../../../../cli_scripts/mysql/flexible-server/high-availability/zone-redundant-ha.sh?highlight=7,10-11,13-14 "Configure Zone-Redundant High Availability.")]


## Clean up deployment

After the sample script has been run, the following code snippet can be used to clean up the resources.

[!code-azurecli-interactive[main](../../../../cli_scripts/mysql/flexible-server/high-availability/clean-up-resources.sh?highlight=4 "Clean up resources.")]


## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| **Command** | **Notes** |
|---|---|
|[az group create](/cli/azure/group#az_group_create)|Creates a resource group in which all resources are stored|
|[az mysql flexible-server create](/cli/azure/mysql/flexible-server#az_mysql_flexible_server_create)|Creates a Flexible Server that hosts the databases.|
|[az mysql flexible-server update](/cli/azure/mysql/flexible-server#az_mysql_flexible_server_update)|Updates a Flexible Server.|
|[az mysql flexible-server delete](/cli/azure/mysql/flexible-server#az_mysql_flexible_server_delete)|Deletes a Flexible Server.|
|[az group delete](/cli/azure/group#az_group_delete) | Deletes a resource group including all nested resources.|

## Next steps

- Try additional scripts: [Azure CLI samples for Azure Database for MySQL - Flexible Server](../sample-scripts-azure-cli.md)
- For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).