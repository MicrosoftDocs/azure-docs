---
title: Create a Function App in an App Service plan - Azure CLI
description: Azure CLI Script Sample - Create a Function App in an App Service plan
ms.assetid: 0e221db6-ee2d-4e16-9bf6-a456cd05b6e7
ms.topic: sample
ms.date: 03/24/2022
ms.custom: mvc, devx-track-azurecli
---
# Create a Function App in an App Service plan

This Azure Functions sample script creates a function app, which is a container for your functions. The function app that is created uses a dedicated App Service plan, which means your server resources are always on.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/azure-functions/create-function-app-app-service-plan/create-function-app-app-service-plan.sh" id="FullScript":::

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
| [az storage account create](/cli/azure/storage/account#az-storage-account-create) | Creates an Azure Storage account. |
| [az functionapp plan create](/cli/azure/functionapp/plan#az-functionapp-plan-create) | Creates a Premium plan. |
| [az functionapp create](/cli/azure/functionapp#az-functionapp-create) | Creates a function app in the App Service plan. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional Azure Functions CLI script samples can be found in the [Azure Functions documentation](../functions-cli-samples.md).
