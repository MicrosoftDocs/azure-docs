---
title: CLI Script - Monitor and Scale an Azure Database for MySQL - Flexible Server (Preview)
description: This Azure CLI sample script shows how to monitor and scale a single Azure Database for MySQL - Flexible server up or down to allow for changing performance needs. 
author: shreyaaithal
ms.author: shaithal
ms.service: mysql
ms.devlang: azurecli
ms.topic: sample
ms.custom: mvc, devx-track-azurecli
ms.date: 09/15/2021
---

# Monitor and Scale an Azure Database for MySQL - Flexible Server (Preview) using Azure CLI

This sample CLI script scales compute, storage and IOPS for a single Azure Database for MySQL - Flexible server after querying the corresponding metrics. Compute and IOPS can be scaled up or down, while storage can only be scaled up. 

[!INCLUDE [flexible-server-free-trial-note](../../includes/flexible-server-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment](../../../../includes/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed. 

## Sample Script

Update the script with your values for variables in **Set up variables** section. 

```azurecli
#!/bin/bash

# Monitor your Flexible Server and scale Compute and Storage

# Set up variables
SUBSCRIPTION_ID="" # Enter your subscription ID
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

# 3. Monitor CPU percent, Storage usage and IO percent

# Monitor CPU Usage
az monitor metrics list \
    --resource "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.DBforMySQL/flexibleservers/$SERVER_NAME" \
    --metric cpu_percent \
    --interval PT1M

# Monitor usage metrics - Storage
az monitor metrics list \
    --resource "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.DBforMySQL/flexibleservers/$SERVER_NAME" \
    --metric storage_used \
    --interval PT1M

# Monitor IO Percent
az monitor metrics list \
    --resource "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.DBforMySQL/flexibleservers/$SERVER_NAME" \
    --metric io_consumption_percent \
    --interval PT1M

# 4. Scale up and down

# Scale up the server by provisionining to higher tier from Burstable to General purpose 4vcore
az mysql flexible-server update \
    --resource-group $RESOURCE_GROUP \
    --name $SERVER_NAME \
    --sku-name Standard_D4ds_v4 \
    --tier GeneralPurpose 

# Scale down to by provisioning to General purpose 2vcore within the same tier
az mysql flexible-server update \
    --resource-group $RESOURCE_GROUP \
    --name $SERVER_NAME \
    --sku-name Standard_D2ds_v4

# Scale up the server to provision a storage size of 64GB. Note storage size cannot be reduced.
az mysql flexible-server update \
    --resource-group $RESOURCE_GROUP \
    --name $SERVER_NAME \
    --storage-size 64

# Scale IOPS
az mysql flexible-server update \
    --resource-group $RESOURCE_GROUP \
    --name $SERVER_NAME \
    --iops 550
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
|[az monitor metrics list](/cli/azure/monitor/metrics#az_monitor_metrics_list)|Lists the Azure Monitor metric value for the resources.|
|[az mysql flexible-server update](/cli/azure/mysql/flexible-server#az_mysql_flexible_server_update)|Updates properties of the Flexible Server.|
|[az mysql flexible-server delete](/cli/azure/mysql/flexible-server#az_mysql_flexible_server_delete)|Deletes a Flexible Server.|
|[az group delete](/cli/azure/group#az_group_delete) | Deletes a resource group including all nested resources.|

## Next Steps

- Try additional scripts: [Azure CLI samples for Azure Database for MySQL - Flexible Server (Preview)](../sample-scripts-azure-cli.md)
- For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).