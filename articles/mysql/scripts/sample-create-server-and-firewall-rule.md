---
title: Azure CLI samples to create a single Azure Database for MySQL server and configure a firewall rule | Microsoft Docs
description: This sample CLI script creates an Azure Database for MySQL server and configures a server-level firewall rule.
services: mysql
author: v-chenyh
ms.author: v-chenyh
manager: jhubbard
editor: jasonh
ms.assetid: 
ms.service: mysql-database
ms.tgt_pltfrm: portal
ms.devlang: azurecli
ms.topic: article
ms.custom: sample
ms.date: 05/10/2017
---

# Create a MySQL server and configure a firewall rule using the Azure CLI
This sample CLI script creates an Azure Database for MySQL server and configures a server-level firewall rule. Once the script runs successfully, the MySQL server is accessible by all Azure services and the configured IP address.

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

## Sample Script
```bash
#!/bin/bash

# Create a resource group
az group create \
--name myresource \
--location westus

# Create a MySQL server in the resource group
# Name of a server maps to DNS name and is thus required to be globally unique in Azure.
# Substitute the <server_admin_password> with your own value.
az mysql server create \
--name mysqlserver4demo \
--resource-group myresource \
--location westus \
--admin-user myadmin \
--admin-password <server_admin_password> \
--performance-tier Basic \
--compute-units 50 \

# Configure a firewall rule for the server
# The ip address range that you want to allow to access your server
az mysql server firewall-rule create \
--resource-group myresource \
--server mysqlserver4demo \
--name AllowIps \
--start-ip-address 0.0.0.0 \
--end-ip-address 255.255.255.255

# Default database ‘postgres’ gets created on the server.
```

## Clean up deployment
 After the script sample runs, use the following command to remove the resource group and all resources associated with it.
```azurecli
az group delete --name myresource
```
## Script explanation
This script uses the following commands. Each command in the table links to command specific documentation.

| **Command** | **Notes** |
|-------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| [az group create](https://docs.microsoft.com/en-us/cli/azure/group#create) | Creates a resource group in which all resources are stored. |
| az mysql server create | Creates a MySQL server that hosts the databases. |
| az mysql server firewall create | Creates a firewall rule to allow access to the server and databases under it from the entered IP address range. |
| [az group delete](https://docs.microsoft.com/en-us/cli/azure/resource#delete) | Deletes a resource group including all nested resources. |

## Next steps
[Azure CLI samples for Azure Database for MySQL](../sample-scripts-azure-cli.md)
