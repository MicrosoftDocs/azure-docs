---
title: "Azure CLI Script - Create an Azure Database for PostgreSQL | Microsoft Docs"
description: "Azure CLI Script Sample - Creates an Azure Database for PostgreSQL server and configures a server-level firewall rule."
services: postgresql
author: salonisonpal
ms.author: salonis
manager: jhubbard
editor: jasonwhowell
ms.service: postgresql-database
ms.custom: mvc
ms.devlang: azure-cli
ms.topic: sample
ms.date: 05/31/2017
---

# Create an Azure Database for PostgreSQL server and configure a firewall rule using the Azure CLI
This sample CLI script creates an Azure Database for PostgreSQL server and configures a server-level firewall rule. Once the script has been successfully run, the PostgreSQL server can be accessed from all Azure services and the configured IP address.

[!INCLUDE [cloud-shell-try-it](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this topic requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

## Sample script
In this sample script, edit the highlighted lines to customize the admin username and password.
[!code-azurecli-interactive[main](../../../cli_scripts/postgresql/create-postgresql-server-and-firewall-rule/create-postgresql-server-and-firewall-rule.sh?highlight=15-16 "Create an Azure Database for PostgreSQL, and server-level firewall rule.")]

## Clean up deployment
After the script sample has been run, the following command can be used to remove the resource group and all resources associated with it.
[!code-azurecli-interactive[main](../../../cli_scripts/postgresql/create-postgresql-server-and-firewall-rule/delete-postgresql.sh "Delete the resource group.")]

## Script explanation
This script uses the following commands. Each command in the table links to command specific documentation.

| **Command** | **Notes** |
|---|---|
| [az group create](/cli/azure/group#create) | Creates a resource group in which all resources are stored. |
| [az postgres server create](/cli/azure/postgres/server#create) | Creates a PostgreSQL server that hosts the databases. |
| [az postgres server firewall create](/cli/azure/postgres/server/firewall-rule#create) | Creates a firewall rule to allow access to the server and databases under it from the entered IP address range. |
| [az group delete](/cli/azure/group#delete) | Deletes a resource group including all nested resources. |

## Next steps
- Read more information on the Azure CLI: [Azure CLI documentation](/cli/azure/overview)
- Try additional scripts: [Azure CLI samples for Azure Database for PostgreSQL](../sample-scripts-azure-cli.md)
