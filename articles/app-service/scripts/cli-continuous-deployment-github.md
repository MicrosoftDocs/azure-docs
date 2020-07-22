---
title: 'CLI: Continuous deployment from GitHub'
description: Learn how to use the Azure CLI to automate deployment and management of your App Service app. This sample shows how to create an app with CI/CD from GitHub.
author: msangapu-msft
tags: azure-service-management

ms.assetid: 0205c991-0989-4ca3-bb41-237dcc964460
ms.devlang: azurecli
ms.topic: sample
ms.date: 09/02/2019
ms.author: msangapu
ms.custom: mvc, seodec18
---

# Create an App Service app with continuous deployment from GitHub using CLI

This sample script creates an app in App Service with its related resources, and then sets up continuous deployment from a GitHub repository. For GitHub deployment without continuous deployment, see [Create an app and deploy code from GitHub](cli-deploy-github.md). For this sample, you need:

* A GitHub repository with application code, that you have administrative permissions for. To get automatic builds, structure your repository according to the [Prepare your repository](../deploy-continuous-deployment.md#prepare-your-repository) table.
* A [Personal Access Token (PAT)](https://help.github.com/articles/creating-an-access-token-for-command-line-use) for your GitHub account.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, you need Azure CLI version 2.0 or later. To find the version, run `az --version`. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli).

## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/app-service/deploy-github-continuous/deploy-github-continuous.sh?highlight=3-4 "Create an app with continuous deployment from GitHub")]

[!INCLUDE [cli-script-clean-up](../../../includes/cli-script-clean-up.md)]

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [`az group create`](/cli/azure/group?view=azure-cli-latest#az-group-create) | Creates a resource group in which all resources are stored. |
| [`az appservice plan create`](/cli/azure/appservice/plan?view=azure-cli-latest#az-appservice-plan-create) | Creates an App Service plan. |
| [`az webapp create`](/cli/azure/webapp?view=azure-cli-latest#az-webapp-create) | Creates an App Service app. |
| [`az webapp deployment source config`](/cli/azure/webapp/deployment/source?view=azure-cli-latest#az-webapp-deployment-source-config) | Associates an App Service app with a Git or Mercurial repository. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional App Service CLI script samples can be found in the [Azure App Service documentation](../samples-cli.md).
