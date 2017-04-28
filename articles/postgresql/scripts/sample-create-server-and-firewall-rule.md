---
title: "Azure CLI Script - Create an Azure Database for PostgreSQL | Microsoft Docs"
description: "Azure CLI Script Sample - Creates an Azure Database for PostgreSQL server and configures a server-level firewall rule."
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
ms.date: 05/10/2017
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

az group create \
--name myResourceGroup \
--location westus

# Create a PostgreSQL server in the resource group
az postgres server create \
--name $servername \
--resource-group myResourceGroup \
--location westus \
--admin-user $adminlogin \
--admin-password $password \
--performance-tier Standard \
--compute-units 100 \

# Configure a firewall rule for the server
az postgres server firewall-rule create \
--resource-group myResourceGroup \
--server $servername \
--name AllowIps \
--start-ip-address $startip \
--end-ip-address $endip

# Default database ‘postgres’ gets created on the server.
```

## Clean up deployment
After the script sample has been run, the following command can be used to remove the resource group and all resources associated with it.
```azurecli
az group delete --name myResourceGroup
```

## Next steps
- For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview).
- Additional Azure Database for PostgreSQL CLI script samples can be found in the [Azure Database for PostgreSQL documentation](../sample-scripts-azure-cli.md).
