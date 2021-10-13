---
title: 'CLI: Deploy an app from GitHub'
description: Learn how to use the Azure CLI to automate deployment and management of your App Service app. This sample shows how to deploy an app from GitHub.
author: msangapu-msft
tags: azure-service-management

ms.assetid: 0205c991-0989-4ca3-bb41-237dcc964460
ms.devlang: azurecli
ms.topic: sample
ms.date: 12/11/2017
ms.author: msangapu
ms.custom: mvc, seodec18, devx-track-azurecli
---

# Create an App Service app with deployment from GitHub using Azure CLI

This sample script creates an app in App Service with its related resources. It then deploys your app code from a public GitHub repository (without continuous deployment). For GitHub deployment with continuous deployment, see [Create an app with continuous deployment from GitHub](cli-continuous-deployment-github.md).

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

 - This tutorial requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/app-service/deploy-github/deploy-github.sh?highlight=3 "Create an app with deployment from GitHub")]

[!INCLUDE [cli-script-clean-up](../../../includes/cli-script-clean-up.md)]

## Script explanation 

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [`az group create`](/cli/azure/group#az_group_create) | Creates a resource group in which all resources are stored. |
| [`az appservice plan create`](/cli/azure/appservice/plan#az_appservice_plan_create) | Creates an App Service plan. |
| [`az webapp create`](/cli/azure/webapp#az_webapp_create) | Creates an App Service app. |
| [`az webapp deployment source config`](/cli/azure/webapp/deployment/source#az_webapp_deployment_source_config) | Associates an App Service app with a Git or Mercurial repository. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional App Service CLI script samples can be found in the [Azure App Service documentation](../samples-cli.md).
