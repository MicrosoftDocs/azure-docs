---
title: Create a function app in a Premium plan - Azure CLI
description: Create a function app in a scalable Premium plan in Azure using the Azure CLI
ms.service: azure-functions
ms.topic: sample
ms.date: 03/24/2022 
ms.custom: devx-track-azurecli
---

# Create a function app in a Premium plan - Azure CLI

This Azure Functions sample script creates a function app, which is a container for your functions. The function app that is created uses a [scalable Premium plan](../functions-premium-plan.md).

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/azure-functions/create-function-app-premium-plan/create-function-app-premium-plan.sh" id="FullScript":::

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
| [az functionapp plan create](/cli/azure/functionapp/plan#az-functionapp-plan-create) | Creates a Premium plan in a [specific SKU](../functions-premium-plan.md#available-instance-skus). |
| [az functionapp create](/cli/azure/functionapp#az-functionapp-create) | Creates a function app in the App Service plan. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional Azure Functions CLI script samples can be found in the [Azure Functions documentation](../functions-cli-samples.md).
