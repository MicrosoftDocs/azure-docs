---
title: 'CLI: Connect an app to a storage account'
description: Learn how to use the Azure CLI to automate deployment and management of your App Service app. This sample shows how to connect an app to a storage account.
author: msangapu-msft
tags: azure-service-management

ms.assetid: bc8345b2-8487-40c6-a91f-77414e8688e6
ms.devlang: azurecli
ms.topic: sample
ms.date: 04/21/2022
ms.author: msangapu
ms.custom: mvc, seodec18, devx-track-azurecli
---

# Connect an App Service app to a storage account using CLI

This sample script creates an Azure storage account and an App Service app. It then links the storage account to the app using app settings.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/app-service/connect-to-storage/connect-to-storage.sh" id="FullScript":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands to create a resource group, App Service app, storage account, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [`az group create`](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [`az appservice plan create`](/cli/azure/appservice/plan#az-appservice-plan-create) | Creates an App Service plan. |
| [`az webapp create`](/cli/azure/webapp#az-webapp-create) | Creates an App Service app. |
| [`az storage account create`](/cli/azure/storage/account#az-storage-account-create) | Creates a storage account. |
| [`az storage account show-connection-string`](/cli/azure/storage/account#az-storage-account-show-connection-string) | Get the connection string for a storage account. |
| [`az webapp config appsettings set`](/cli/azure/webapp/config/appsettings#az-webapp-config-appsettings-set) | Creates or updates an app setting for an App Service app. App settings are exposed as environment variables for your app. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional App Service CLI script samples can be found in the [Azure App Service documentation](../samples-cli.md).
