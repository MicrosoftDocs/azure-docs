---
title: Create a function app with DevOps deployment - Azure CLI
description: Create a Function App and deploy function code from Azure DevOps
ms.date: 07/03/2018
ms.topic: sample
ms.custom: mvc, devx-track-azurecli
---
# Create a function in Azure that is deployed from Azure DevOps

This topic shows you how to use Azure Functions to create a [serverless](https://azure.microsoft.com/solutions/serverless/) function app using the [Consumption plan](../consumption-plan.md). The function app, which is a container for your functions, is continuously deployed from an Azure DevOps repository. 

To complete this topic, you must have:

* An Azure DevOps repository that contains your function app project and to which you have administrative permissions.
* A [personal access token (PAT)](/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate) to access your Azure DevOps repository.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

 - This tutorial requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed. 

## Sample script

This sample creates an Azure Function app and deploys function code from Azure DevOps.

[!code-azurecli-interactive[main](../../../cli_scripts/azure-functions/deploy-function-app-with-function-vsts/deploy-function-app-with-function-vsts.sh?highlight=3-4 "Azure Service")]

[!INCLUDE [cli-script-clean-up](../../../includes/cli-script-clean-up.md)]

## Script explanation

This script uses the following commands to create a resource group, storage account, function app, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az_group_create) | Creates a resource group in which all resources are stored. |
| [az storage account create](/cli/azure/storage/account#az_storage_account_create) | Creates the storage account required by the function app. |
| [az functionapp create](/cli/azure/functionapp#az_functionapp_create) | Creates a function app in the serverless [Consumption plan](../consumption-plan.md). |
| [az functionapp deployment source config](/cli/azure/functionapp/deployment/source#az_functionapp_deployment_source_config) | Associates a function app with a Git or Mercurial repository. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional Azure Functions CLI script samples can be found in the [Azure Functions documentation](../functions-cli-samples.md).
