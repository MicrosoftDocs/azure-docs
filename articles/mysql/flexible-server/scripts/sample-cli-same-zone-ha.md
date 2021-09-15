---
title: CLI Script - Configure Same-Zone high availability in an Azure Database for MySQL - Flexible Server (Preview)
description: This Azure CLI sample script shows how to configure Same-Zone high availability in an Azure Database for MySQL - Flexible Server.
author: shreyaaithal
ms.author: shaithal
ms.service: mysql
ms.devlang: azurecli
ms.topic: sample
ms.custom: mvc, devx-track-azurecli
ms.date: 09/13/2021
---

# Configure Same-Zone high availability in an Azure Database for MySQL - Flexible Server (Preview) using Azure CLI

This sample CLI script configures and manages Same-Zone high availability in an Azure Database for MySQL - Flexible Server. 
You can enable Same-Zone high availability only during Flexible Server creation, and can disable it anytime. Currently, Same-Zone high availability is supported only for the General purpose and Memory optimized pricing tiers.


[!INCLUDE [flexible-server-free-trial-note](../../includes/flexible-server-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment](../../../../includes/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed. 

## Sample Script

In this sample script, edit the highlighted lines to update the variable values.



## Clean up deployment

After the sample script has been run, the following code snippet can be used to clean up the resources.


## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| **Command** | **Notes** |
|---|---|
|[az group create](/cli/azure/group#az_group_create)|Creates a resource group in which all resources are stored|
|[az mysql flexible-server create](/cli/azure/mysql/flexible-server#az_mysql_flexible_server_create)|Creates a Flexible Server that hosts the databases.|
|[az mysql flexible-server update](/cli/azure/mysql/flexible-server#az_mysql_flexible_server_update)|Updates a Flexible Server.|
|[az mysql flexible-server delete](/cli/azure/mysql/flexible-server#az_mysql_flexible_server_delete)|Deletes a Flexible Server.|
|[az group delete](/cli/azure/group#az_group_delete) | Deletes a resource group including all nested resources.|

## Next Steps

