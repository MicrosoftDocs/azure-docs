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
In this sample script, edit the highlighted lines to customize the admin username and password.
[!code-azurecli-interactive[main](../../../cli_scripts/postgresql/create-postgresql-server-and-firewall-rule/create-postgresql-server-and-firewall-rule.sh?highlight=15-16) "Create an Azure Database for PostgreSQL, and server-level firewall rule.")]


## Clean up deployment
After the script sample has been run, the following command can be used to remove the resource group and all resources associated with it.
```azurecli
az group delete --name myresourcegroup
```

## Next steps
- For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure/overview).
- For additional scripts, see [Azure CLI samples for Azure Database for PostgreSQL](../sample-scripts-azure-cli.md)
