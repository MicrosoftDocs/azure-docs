---
title: "Azure CLI Script - Create an Azure Database for MySQL | Microsoft Docs"
description: Creates an Azure Database for MySQL server and configures a server-level firewall rule.
services: mysql
author: v-chenyh
ms.author: v-chenyh
manager: jhubbard
editor: jasonh
ms.assetid:
ms.service: mysql-database
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: portal
ms.date: 05/10/2017
---

# Create a MySQL server and configure a firewall rule using the Azure CLI
This sample CLI script creates an Azure Database for MySQL server and configures a server-level firewall rule. Once the script has run successfully, the MySQL server can be accessed from all Azure services and the configured IP address.

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

## Sample Script
Azure CLI
```azurecli
#!/bin/bash

# Set an admin login and password for your server
adminlogin=ServerAdmin
password=ChangeYourAdminPassword1

# The server name has to be unique in the system
servername=server-$RANDOM

# The ip address range that you want to allow to access your server
startip=0.0.0.0
endip=255.255.255.255

# Create a resource group
az group create \
--name myResourceGroup \
--location westus

# Create a MySQL server in the resource group
az mysql server create \
--name $servername \
--resource-group myResourceGroup \
--location westus \
--admin-user $adminlogin \
--admin-password $password \
--performance-tier Standard \
--compute-units 100 \

# Configure a firewall rule for the server
az mysql server firewall-rule create \
--resource-group myResourceGroup \
--server $servername \
--name AllowIps \
--start-ip-address $startip \
--end-ip-address $endip
```

## Clean up deployment
 After the script sample has been run, the following command can be used to remove the resource group and all resources associated with it.
```azurecli
az group delete --name myResourceGroup
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
- For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview).
- Additional Azure Database for MySQL CLI script samples can be found in [Azure CLI samples for Azure Database for MySQL](../sample-scripts-azure-cli.md)