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

# Create an Azure Database for PostgreSQL server and configure a firewall rule using the Azure CLI
This sample CLI script creates an Azure Database for PostgreSQL server and configures a server-level firewall rule. Once the script has been successfully run, the PostgreSQL server can be accessed from all Azure services and the configured IP address.

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

## Sample Script
```azurecli
#!/bin/bash

# Create a resource group
az group create \
--name myresourcegroup \
--location westus

# Create a PostgreSQL server in the resource group
# Name of a server maps to DNS name and is thus required to be globally unique in Azure.
# Substitute the <server_admin_password> with your own value.
az postgres server create \
--name mypgserver-20170401 \
--resource-group myresourcegroup \
--location westus \
--admin-user mylogin \
--admin-password <server_admin_password> \
--performance-tier Basic \
--compute-units 50 \

# Configure a firewall rule for the server
# The ip address range that you want to allow to access your server
az postgres server firewall-rule create \
--resource-group myresourcegroup \
--server mypgserver-20170401 \
--name AllowIps \
--start-ip-address 0.0.0.0 \
--end-ip-address 255.255.255.255

# Default database ‘postgres’ gets created on the server.
```

## Clean up deployment
After the script sample has been run, the following command can be used to remove the resource group and all resources associated with it.
```azurecli
az group delete --name myresourcegroup
```

## Next steps
- For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview).
- Additional Azure Database for PostgreSQL CLI script samples can be found in the [Azure Database for PostgreSQL documentation](../sample-scripts-azure-cli.md).
