---
title: Create a function app with GitHub deployment - Azure CLI
description: Create a function app and deploy function code from a GitHub repository using Azure Functions.
ms.date: 03/28/2022
ms.topic: sample
ms.custom: mvc, devx-track-azurecli
---
# Create a function app in Azure that is deployed from GitHub

This Azure Functions sample script creates a function app using the [Consumption plan](../consumption-plan.md), along with its related resources. The script also configures your function code for continuous deployment from a public GitHub repository. There is also commented out code for using a private GitHub repository.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/azure-functions/deploy-function-app-with-function-github-continuous/deploy-function-app-with-function-github-continuous.sh" id="FullScript":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

Each command in the table links to command specific documentation. This script uses the following commands:

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az storage account create](/cli/azure/storage/account#az-storage-account-create) | Creates the storage account required by the function app. |
| [az functionapp create](/cli/azure/functionapp#az-functionapp-create) | Creates a function app in the serverless [Consumption plan](../consumption-plan.md) and associates it with a Git or Mercurial repository. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional Azure Functions CLI script samples can be found in the [Azure Functions documentation](../functions-cli-samples.md).
