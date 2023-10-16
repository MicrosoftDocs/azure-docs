---
title: 'CLI: Deploy app files with FTP'
description: Learn how to use the Azure CLI to automate deployment and management of your App Service app. This sample shows how to create an app and deploy files with FTP.
author: msangapu-msft
tags: azure-service-management
ms.devlang: azurecli
ms.topic: sample
ms.date: 04/15/2022
ms.author: msangapu
ms.custom: mvc, seodec18, devx-track-azurecli
---

# Create an App Service app and deploy files with FTP using Azure CLI

This sample script creates an app in App Service with its related resources, and then deploys a static HTML page using FTP. For FTP upload, the script uses [cURL](https://en.wikipedia.org/wiki/CURL) as an example. You can use whatever FTP tool to upload your files.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/app-service/deploy-ftp/deploy-ftp.sh" id="FullScript":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [`az group create`](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [`az appservice plan create`](/cli/azure/appservice/plan#az-appservice-plan-create) | Creates an App Service plan. |
| [`az webapp create`](/cli/azure/webapp#az-webapp-create) | Creates an App Service app. |
| [`az webapp deployment list-publishing-profiles`](/cli/azure/webapp/deployment#az-webapp-deployment-list-publishing-profiles) | Get the details for available app deployment profiles. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional App Service CLI script samples can be found in the [Azure App Service documentation](../samples-cli.md).
