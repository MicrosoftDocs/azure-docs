---
title: Create a function app with GitHub deployment - Azure CLI
description: Create a function app and deploy function code from a GitHub repository using Azure Functions.
ms.date: 07/03/2018
ms.topic: sample
ms.custom: mvc, devx-track-azurecli
---
# Create a function app in Azure that is deployed from GitHub

This Azure Functions sample script creates a function app using the [Consumption plan](../consumption-plan.md), along with its related resources. The script also configures your function code for  continuous deployment from a GitHub repository. 

In this sample, you need:

* A GitHub repository with functions code, that you have administrative permissions for.
* A [Personal Access Token (PAT)](https://help.github.com/articles/creating-an-access-token-for-command-line-use) for your GitHub account.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

 - This tutorial requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed. 

## Sample script

This sample creates an Azure Function app and deploys function code from GitHub.

[!code-azurecli-interactive[main](../../../cli_scripts/azure-functions/deploy-function-app-with-function-github-continuous/deploy-function-app-with-function-github-continuous.sh?highlight=3-4 "Azure Service")]

[!INCLUDE [cli-script-clean-up](../../../includes/cli-script-clean-up.md)]

## Script explanation

Each command in the table links to command specific documentation. This script uses the following commands:

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az_group_create) | Creates a resource group in which all resources are stored. |
| [az storage account create](/cli/azure/storage/account#az_storage_account_create) | Creates the storage account required by the function app. |
| [az functionapp create](/cli/azure/functionapp#az_functionapp_create) | Creates a function app in the serverless [Consumption plan](../consumption-plan.md) and associates it with a Git or Mercurial repository. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional Azure Functions CLI script samples can be found in the [Azure Functions documentation](../functions-cli-samples.md).
