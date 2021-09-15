---
title: CLI Script - Create and manage read replicas in an Azure Database for MySQL - Flexible Server (Preview)
description: This Azure CLI sample script shows how to create and manage read replicas in an Azure Database for MySQL - Flexible Server
author: shreyaaithal
ms.author: shaithal
ms.service: mysql
ms.devlang: azurecli
ms.topic: sample
ms.custom: mvc, devx-track-azurecli
ms.date: 09/13/2021
---

# Create and manage read replicas in an Azure Database for MySQL - Flexible Server (Preview) using Azure CLI

This sample CLI script creates and manages read replicas in an Azure Database for MySQL - Flexible Server.

>[!IMPORTANT]
>When you create a replica for a source that has no existing replicas, the source will first restart to prepare itself for replication. Take this into consideration and perform these operations during an off-peak period.

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
|[az mysql flexible-server replica create](/cli/azure/mysql/flexible-server/replica#az_mysql_flexible_server_replica_create)|Create a read replica for a server.|
|[az mysql flexible-server replica list](/cli/azure/mysql/flexible-server/replica#az_mysql_flexible_server_replica_list)|List all read replicas for a given server.|
|[az mysql flexible-server replica stop-replication](/cli/azure/mysql/flexible-server/replica#az_mysql_flexible_server_replica_stop_replication)|Stop replication to a read replica and make it a read/write server.|
|[az mysql flexible-server delete](/cli/azure/mysql/flexible-server#az_mysql_flexible_server_delete)|Deletes a Flexible Server.|
|[az group delete](/cli/azure/group#az_group_delete) | Deletes a resource group including all nested resources.|

## Next Steps

