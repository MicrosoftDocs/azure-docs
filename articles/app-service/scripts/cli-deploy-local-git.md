---
title: 'CLI: Deploy from local Git repo'
description: Learn how to use the Azure CLI to automate deployment and management of your App Service app. This sample shows how to deploy code into a local Git repository.
author: msangapu-msft
tags: azure-service-management

ms.assetid: 048f98aa-f708-44cb-9b9e-953f67dc6da8
ms.devlang: azurecli
ms.topic: sample
ms.date: 04/15/2022
ms.author: msangapu
ms.custom: mvc, seodec18, devx-track-azurecli
---

# Create an App Service app and deploy code into a local Git repository using Azure CLI

This sample script creates an app in App Service with its related resources, and then deploys your app code in a local Git repository.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### To create the web app

:::code language="azurecli" source="~/azure_cli_scripts/app-service/deploy-github/deploy-github.sh" id="FullScript":::

### To deploy to your local Git repository

1. Create the following variables containing your GitHub information.

   ```azurecli
   gitdirectory=<Replace with path to local Git repo>
   username=<Replace with desired deployment username>
   password=<Replace with desired deployment password>
   ```

1. Configure local Git and get deployment URL.

   ```azurecli
   url=$(az webapp deployment source config-local-git --name $webapp --resource-group $resourceGroup --query url --output tsv)
   ```

1. Add the Azure remote to your local Git repository and push your code. When prompted for password, use the value of $password that you specified.

   ```bash
   cd $gitdirectory
   git remote add azure $url
   git push azure main
   ```

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
| [`az webapp deployment user set`](/cli/azure/webapp/deployment/user#az-webapp-deployment-user-set) | Sets the account-level deployment credentials for App Service. |
| [`az webapp deployment source config-local-git`](/cli/azure/webapp/deployment/source#az-webapp-deployment-source-config-local-git) | Creates a source control configuration for a local Git repository. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional App Service CLI script samples can be found in the [Azure App Service documentation](../samples-cli.md).
