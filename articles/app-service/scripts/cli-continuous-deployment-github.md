---
title: 'CLI: Continuous deployment from GitHub'
description: Learn how to use the Azure CLI to automate deployment and management of your App Service app. This sample shows how to create an app with CI/CD from GitHub.
author: msangapu-msft
tags: azure-service-management

ms.assetid: 0205c991-0989-4ca3-bb41-237dcc964460
ms.devlang: azurecli
ms.topic: sample
ms.date: 04/15/2022
ms.author: msangapu
ms.custom: mvc, seodec18, devx-track-azurecli
---

# Create an App Service app with continuous deployment from GitHub using CLI

This sample script creates an app in App Service with its related resources, and then sets up continuous deployment from a GitHub repository. For GitHub deployment without continuous deployment, see [Create an app and deploy code from GitHub](cli-deploy-github.md). For this sample, you need:

* A GitHub repository with application code, that you have administrative permissions for. To get automatic builds, structure your repository according to the [Prepare your repository](../deploy-continuous-deployment.md#prepare-your-repository) table.
* A [Personal Access Token (PAT)](https://help.github.com/articles/creating-an-access-token-for-command-line-use) for your GitHub account.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### To create the web app

:::code language="azurecli" source="~/azure_cli_scripts/app-service/deploy-github/deploy-github.sh" id="FullScript":::

### To configure continuous deployment from GitHub

1. Create the following variables containing your GitHub information.

   ```azurecli
   gitrepo=<replace-with-URL-of-your-own-GitHub-repo>
   token=<replace-with-a-GitHub-access-token>
   ```

1. Configure continuous deployment from GitHub.

   > [!TIP]
   > The `--git-token` parameter is required only once per Azure account (Azure remembers token).

   ```azurecli
   az webapp deployment source config --name $webapp --resource-group $resourceGroup --repo-url $gitrepo --branch master --git-token $token
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
| [`az webapp deployment source config`](/cli/azure/webapp/deployment/source#az-webapp-deployment-source-config) | Associates an App Service app with a Git or Mercurial repository. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional App Service CLI script samples can be found in the [Azure App Service documentation](../samples-cli.md).
