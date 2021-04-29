---
title: 'CLI: Connect an app to SQL Database'
description: Learn how to use the Azure CLI to automate deployment and management of your App Service app. This sample shows how to connect an app to SQL Database.
author: msangapu-msft
tags: azure-service-management

ms.assetid: 7c2efdd0-f553-4038-a77a-e953021b3f77
ms.devlang: azurecli
ms.topic: sample
ms.date: 12/11/2017
ms.author: msangapu
ms.custom: mvc, seodec18, devx-track-azurecli
---

# Connect an App Service app to SQL Database using CLI

This sample script creates a database in Azure SQL Database and an App Service app. It then links the database to the app using app settings.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, you need Azure CLI version 2.0 or later. To find the version, run `az --version`. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli).

## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/app-service/connect-to-sql/connect-to-sql.sh?highlight=9-10 "SQL Database")]

[!INCLUDE [cli-script-clean-up](../../../includes/cli-script-clean-up.md)]

## Script explanation

This script uses the following commands to create a resource group, App Service app, SQL Database, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [`az group create`](/cli/azure/group#az_group_create) | Creates a resource group in which all resources are stored. |
| [`az appservice plan create`](/cli/azure/appservice/plan#az_appservice_plan_create) | Creates an App Service plan. |
| [`az webapp create`](/cli/azure/webapp#az_webapp_create) | Creates an App Service app. |
| [`az sql server create`](/cli/azure/sql/server#az_sql_server_create) | Creates a server.  |
| [`az sql db create`](/cli/azure/sql/db#az_sql_db_create) | Creates a new database. |
| [`az sql db show-connection-string`](/cli/azure/sql/db#az_sql_db_show-connection_string) | Generates a connection string to a database. |
| [`az webapp config appsettings set`](/cli/azure/webapp/config/appsettings#az_webapp_config_appsettings_set) | Creates or updates an app setting for an App Service app. App settings are exposed as environment variables for your app. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional App Service CLI script samples can be found in the [Azure App Service documentation](../samples-cli.md).
