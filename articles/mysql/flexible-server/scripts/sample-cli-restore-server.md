---
title: CLI Script - Restore an Azure Database for MySQL - Flexible Server (Preview)
description: This Azure CLI sample script shows how to restore a single Azure Database for MySQL - Flexible Server to a previous point in time.
author: shreyaaithal
ms.author: shaithal
ms.service: mysql
ms.devlang: azurecli
ms.topic: sample
ms.custom: mvc, devx-track-azurecli
ms.date: 09/15/2021
---

# Restore an Azure Database for MySQL - Flexible Server (Preview) using Azure CLI

Azure Database for MySQL - Flexible Server, automatically creates server backups and securely stores them in local redundant storage within the region.

This sample CLI script performs a [point-in-time restore](../concepts-backup-restore.md) and creates a new server from your Flexible Server's backups. 

The new Flexible Server is created with the original server's configuration and also inherits tags and settings such as virtual network and firewall from the source server. The restored server's compute and storage tier, configuration and security settings can be changed after the restore is completed.

[!INCLUDE [flexible-server-free-trial-note](../../includes/flexible-server-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment](../../../../includes/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed. 

## Sample Script

Update the script with your values for variables in **Set up variables** section.

```azurecli
#!/bin/bash

# Perform point-in-time-restore of a flexible server to a new server

# Set up variables
RESOURCE_GROUP="myresourcegroup" 
SOURCE_SERVER="mydemoserver" # Substitute with preferred name for MySQL Flexible Server. 
LOCATION="westus" 
ADMIN_USER="mysqladmin" 
PASSWORD="" # Enter your server admin password
IP_ADDRESS= # Enter your IP Address for Public Access - https://whatismyipaddress.com
NEW_SERVER="mydemoserver-restored" # Substitute with preferred name for new Flexible Server.

# 1. Create a resource group
az group create \
--name $RESOURCE_GROUP \
--location $LOCATION

# 2. Create a MySQL Flexible server in the resource group

az mysql flexible-server create \
--name $SOURCE_SERVER \
--resource-group $RESOURCE_GROUP \
--location $LOCATION \
--admin-user $ADMIN_USER \
--admin-password $PASSWORD \
--public-access $IP_ADDRESS


# 3. Restore source server to a specific point-in-time as a new server 'mydemoserver-restored'.
# Substitute the 'restore-time' with your desired value in ISO8601 format

az mysql flexible-server restore \
--name $NEW_SERVER \
--resource-group $RESOURCE_GROUP \
--restore-time "2021-07-09T13:10:00Z" \
--source-server $SOURCE_SERVER

# 4. Check server parameters and networking options on new server before use

az mysql flexible-server show \
--resource-group $RESOURCE_GROUP \
--name $NEW_SERVER
```


## Clean up deployment

After the sample script has been run, the following code snippet can be used to clean up the resources.

```azurecli
#!/bin/bash

RESOURCE_GROUP="myresourcegroup"
SOURCE_SERVER="mydemoserver" # Enter source server name.
NEW_SERVER="mydemoserver-restored" # Enter new server name.

# Delete Source Server and New Server
az mysql flexible-server delete \
--resource-group $RESOURCE_GROUP 
--name $SOURCE_SERVER

az mysql flexible-server delete \
--resource-group $RESOURCE_GROUP 
--name $NEW_SERVER

# Optional : Delete resource group
az group delete --name $RESOURCE_GROUP
```

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

## Next Steps

- Try additional scripts: [Azure CLI samples for Azure Database for MySQL - Flexible Server (Preview)](../sample-scripts-azure-cli.md)
- For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).