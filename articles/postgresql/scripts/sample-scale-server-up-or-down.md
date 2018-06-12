---
title: Azure CLI script - Scale Azure Database for PostgreSQL
description: Azure CLI Script Sample - Scale Azure Database for PostgreSQL server to a different performance level after querying the metrics.
services: postgresql
author: rachel-msft
ms.author: raagyema
manager: kfile
editor: jasonwhowell
ms.service: postgresql
ms.devlang: azure-cli
ms.custom: mvc
ms.topic: sample
ms.date: 04/05/2018
---
# Monitor and scale a single PostgreSQL server using Azure CLI
This sample CLI script scales a single Azure Database for PostgreSQL server to a different performance level after querying the metrics. 

[!INCLUDE [cloud-shell-try-it](../../../includes/cloud-shell-try-it.md)]

If you choose to run the CLI locally, this article requires Azure CLI version 2.0 or later. Check the version by running `az --version`. See [Install Azure CLI]( /cli/azure/install-azure-cli) to install or upgrade your version of Azure CLI.

## Sample script
In this sample script, edit the highlighted lines to update the admin username and password to your own. Replace the SubscriptionID used in the `az monitor` commands with your own subscription ID.
[!code-azurecli-interactive[main](../../../cli_scripts/postgresql/scale-postgresql-server/scale-postgresql-server.sh?highlight=18-19 "Create and scale Azure Database for PostgreSQL.")]

## Clean up deployment
Use the following command to remove the resource group and all resources associated with it after the script has been run. 
[!code-azurecli-interactive[main](../../../cli_scripts/postgresql/scale-postgresql-server/delete-postgresql.sh "Delete the resource group.")]

## Script explanation
This script uses the commands outlined in the following table:

| **Command** | **Notes** |
|---|---|
| [az group create](/cli/azure/group#az_group_create) | Creates a resource group in which all resources are stored. |
| [az postgres server create](/cli/azure/postgres/server#az_postgres_server_create) | Creates a PostgreSQL server that hosts the databases. |
| [az monitor metrics list](/cli/azure/monitor/metrics#az_monitor_metrics_list) | List the metric value for the resources. |
| [az group delete](/cli/azure/group#az_group_delete) | Deletes a resource group including all nested resources. |

## Next steps
- Read more information on the Azure CLI: [Azure CLI documentation](/cli/azure)
- Try additional scripts: [Azure CLI samples for Azure Database for PostgreSQL](../sample-scripts-azure-cli.md)
- Read more information on scaling: [Service Tiers](../concepts-service-tiers.md) and [Compute Units and Storage Units](../concepts-compute-unit-and-storage.md)
