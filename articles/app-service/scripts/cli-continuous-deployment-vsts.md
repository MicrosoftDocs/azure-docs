---
title: 'Continuous deployment from Azure Repos'
description: Learn how to use the Azure CLI to automate deployment and management of your App Service app. This sample shows how to set up CI/CD from Azure Repos.
author: msangapu-msft
tags: azure-service-management

ms.assetid: 389d3bd3-cd8e-4715-a3a1-031ec061d385
ms.devlang: azurecli
ms.topic: sample
ms.date: 04/15/2022
ms.author: msangapu
ms.custom: mvc, devx-track-azurecli
---
# Create an App Service app with continuous deployment from an Azure DevOps repository using Azure CLI

This sample script creates an app in App Service with its related resources, and then sets up continuous deployment from an Azure DevOps repository. For this sample, you need:

* An Azure DevOps repository with application code, that you have administrative permissions for.
* A [Personal Access Token (PAT)](/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate) for your Azure DevOps organization.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### To create the web app

:::code language="azurecli" source="~/azure_cli_scripts/app-service/deploy-vsts-continuous/deploy-vsts-continuous-webapp-only.sh" id="FullScript":::

### To configure continuous deployment from Azure DevOps

Create the following variables containing your Azure DevOps information.

```azurecli
gitrepo=<Replace with your Azure DevOps Services (formerly Visual Studio Team Services, or VSTS) repo URL>
token=<Replace with an Azure DevOps Services (formerly Visual Studio Team Services, or VSTS) personal access token>
```

Configure continuous deployment from Azure DevOps Services (formerly Visual Studio Team Services, or VSTS). The `--git-token` parameter is required only once per Azure account (Azure remembers token).

```azurecli
az webapp deployment source config --name $webapp --resource-group $resourceGroup \
--repo-url $gitrepo --branch master --git-token $token
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
