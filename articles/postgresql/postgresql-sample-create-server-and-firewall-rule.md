---
title: 'Azure CLI Script - Create an Azure Database for PostgreSQL | Microsoft Docs
description: Azure CLI Script Sample - Creates an Azure Database for PostgreSQL server and configures a server-level firewall rule. 
keywords: azure cloud postgresql postgres scale cli
services: postgresql
author: salonisonpal
ms.author: salonis
manager: jhubbard
editor: jasonh
ms.assetid:
ms.service: postgresql-database
ms.tgt_pltfrm: portal
ms.devlang: azurecli
ms.topic: article
ms.date: 04/30/2017
---
# Create a single PostgreSQL server and configure a firewall rule using the Azure CLI
This sample CLI script creates an Azure Database for PostgreSQL server and configures a server-level firewall rule. Once the script has been successfully run, the PostgreSQL server can be accessed from all Azure services and the configured IP address.

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

## Sample Script
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

az group create \\
--name myResourceGroup \\
--location westus

# Create a PostgreSQL server in the resource group
az postgres server create \\
--name $servername \\
--resource-group myResourceGroup \\
--location westus \\
--admin-user $adminlogin \\
--admin-password $password \\
--performance-tier Standard \\
--compute-units 100 \\

# Configure a firewall rule for the server
az postgres server firewall-rule create \\
--resource-group myResourceGroup \\
--server $servername \\
--name AllowIps \\
--start-ip-address $startip \\
--end-ip-address $endip

# Default database ‘postgres’ gets created on the server.
```

## Clean up deployment
After the script sample has been run, the following command can be used to remove the resource group and all resources associated with it.
```azurecli
az group delete --name myResourceGroup
```

## Script explanation
This script uses the following commands. Each command in the table links to command specific documentation.

| | |
|---|---|
| **Command** | **Notes** |
| [az group create](https://docs.microsoft.com/en-us/cli/azure/group#create) | Creates a resource group in which all resources are stored. |
| [az postgres server create](./placeholder.md) | Creates a PostgreSQL server that hosts the databases. |
| [az postgres server firewall create](./placeholder.md) | Creates a firewall rule to allow access to the server and databases under it from the entered IP address range. |
| [az group delete](https://docs.microsoft.com/en-us/cli/azure/resource#delete) | Deletes a resource group including all nested resources. |
| | |

## Next steps
For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview).

Additional Azure Database for PostgreSQL CLI script samples can be found in the [Azure Database for PostgreSQL documentation](./postgresql-sample-scripts-azure-cli.md).
