---
title: CLI Script - Configure slow query logs on an Azure Database for MySQL - Flexible Server (Preview)
description: This Azure CLI sample script shows how to configure slow query logs on an Azure Database for MySQL - Flexible Server.
author: shreyaaithal
ms.author: shaithal
ms.service: mysql
ms.devlang: azurecli
ms.topic: sample
ms.custom: mvc, devx-track-azurecli
ms.date: 09/15/2021
---

# Configure slow query logs on an Azure Database for MySQL - Flexible Server (Preview) using Azure CLI

This sample CLI script configures [slow query logs](../concepts-slow-query-logs.md) on an Azure Database for MySQL - Flexible Server. 

[!INCLUDE [flexible-server-free-trial-note](../../includes/flexible-server-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment](../../../../includes/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed. 

## Sample Script

Update the script with your values for variables in **Set up variables** section.

```azurecli
#!/bin/bash

# Configure slow query logs on Azure Database for MySQL - Flexible Server

# Set up variables
RESOURCE_GROUP="myresourcegroup" 
SERVER_NAME="mydemoserver" # Substitute with preferred name for MySQL Flexible Server. 
LOCATION="westus" 
ADMIN_USER="mysqladmin" 
PASSWORD="" # Enter your server admin password
IP_ADDRESS= # Enter your IP Address for Public Access - https://whatismyipaddress.com

# 1. Create resource group
az group create \
--name $RESOURCE_GROUP \
--location $LOCATION

# 2. Create a MySQL Flexible server in the resource group
az mysql flexible-server create \
--name $SERVER_NAME \
--resource-group $RESOURCE_GROUP \
--location $LOCATION \
--admin-user $ADMIN_USER \
--admin-password $PASSWORD \
--public-access $IP_ADDRESS

# 3. Enable slow query logs

az mysql flexible-server parameter set \
--name slow_query_log \
--resource-group $RESOURCE_GROUP \
--server-name $SERVER_NAME \
--value ON

# 4. Set long_query_time time to 15 sec
# This setting will log all queries executing for more than 15 sec. Please adjust this threshold based on your definition for slow queries

az mysql flexible-server parameter set \
--name long_query_time \
--resource-group $RESOURCE_GROUP \
--server $SERVER_NAME \
--value 15

# 5. Allow slow administrative statements (ex. ALTER_TABLE, ANALYZE_TABLE) to be logged.

az mysql flexible-server parameter set \
--resource-group $RESOURCE_GROUP \
--server-name $SERVER_NAME \
--name log_slow_admin_statements \
--value ON

```

## Clean up deployment

After the sample script has been run, the following code snippet can be used to clean up the resources.

```azurecli
#!/bin/bash

RESOURCE_GROUP="myresourcegroup" 
SERVER_NAME="mydemoserver" # Enter your server name

# Delete MySQL Flexible Server
az mysql flexible-server delete \
--resource-group $RESOURCE_GROUP 
--name $SERVER_NAME

# Optional : Delete resource group
az group delete --name $RESOURCE_GROUP
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| **Command** | **Notes** |
|---|---|
|[az group create](/cli/azure/group#az_group_create)|Creates a resource group in which all resources are stored|
|[az mysql flexible-server create](/cli/azure/mysql/flexible-server#az_mysql_flexible_server_create)|Creates a Flexible Server that hosts the databases.|
|[az mysql flexible-server parameter set](/cli/azure/mysql/flexible-server/parameter#az_mysql_flexible_server_parameter_set)|Updates the parameter of a flexible server.|
|[az mysql flexible-server delete](/cli/azure/mysql/flexible-server#az_mysql_flexible_server_delete)|Deletes a Flexible Server.|
|[az group delete](/cli/azure/group#az_group_delete) | Deletes a resource group including all nested resources.|

## Next Steps

- Try additional scripts: [Azure CLI samples for Azure Database for MySQL - Flexible Server (Preview)](../sample-scripts-azure-cli.md)
- For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).