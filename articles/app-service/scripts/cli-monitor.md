---
title: 'CLI: Monitor an app with web server logs'
description: Learn how to use the Azure CLI to automate deployment and management of your App Service app. This sample shows how to monitor an app with web server logs.
author: msangapu-msft
tags: azure-service-management

ms.assetid: 0887656f-611c-4627-8247-b5cded7cef60
ms.devlang: azurecli
ms.topic: sample
ms.date: 04/15/2022
ms.author: msangapu
ms.custom: mvc, seodec18, devx-track-azurecli
---

# Monitor an App Service app with web server logs using Azure CLI

This sample script creates a resource group, App Service plan, and app, and configures the app to enable web server logs. It then downloads the log files for review.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/app-service/monitor-with-logs/monitor-with-logs.sh" id="FullScript":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands to create a resource group, App Service app, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [`az group create`](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [`az appservice plan create`](/cli/azure/appservice/plan#az-appservice-plan-create) | Creates an App Service plan. |
| [`az webapp create`](/cli/azure/webapp#az-webapp-create) | Creates an App Service app. |
| [`az webapp log config`](/cli/azure/webapp/log#az-webapp-log-config) | Configures which logs an App Service app persists. |
| [`az webapp log download`](/cli/azure/webapp/log#az-webapp-log-download) | Downloads the logs of an App Service app to your local machine. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional App Service CLI script samples can be found in the [Azure App Service documentation](../samples-cli.md).
