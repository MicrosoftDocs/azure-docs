---
title: Continuous Deployment from Azure Repos
description: Learn how to use the Azure CLI to automate deployment and management of your App Service app. This sample shows how to set up CI/CD from Azure Repos.
author: msangapu-msft
tags: azure-service-management

ms.assetid: 389d3bd3-cd8e-4715-a3a1-031ec061d385
ms.devlang: azurecli
ms.topic: sample
ms.date: 12/08/2025
ms.author: msangapu
ms.custom: mvc, devx-track-azurecli
ms.service: azure-app-service
---
# Set up continuous deployment from an Azure DevOps repository using Azure CLI

This sample script creates an app in App Service with its related resources, and then sets up continuous deployment from an Azure DevOps repository.

## Prerequisites

* An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

* An Azure DevOps repository with application code, for which you have administrative permissions.

* A [personal access token (PAT)](/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate) for your Azure DevOps organization.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](~/reusable-content/ce-skilling/azure/includes/cli-launch-cloud-shell-sign-in.md)]

### Create the web app

Use the following commands to create the web app.

:::code language="azurecli" source="~/azure_cli_scripts/app-service/deploy-vsts-continuous/deploy-vsts-continuous-webapp-only.sh" id="FullScript":::

### Configure continuous deployment from Azure DevOps

Create the following variables containing information from your Azure DevOps Services (formerly Visual Studio Team Services, or VSTS).

```azurecli
gitrepo=<Replace with your Azure DevOps Services repo URL>
token=<Replace with an Azure DevOps Services personal access token>
```

Configure continuous deployment from Azure DevOps Services. The `--git-token` parameter is required only once per Azure account; Azure remembers the token.

```azurecli
az webapp deployment source config --name $webapp --resource-group $resourceGroup \
--repo-url $gitrepo --branch main --git-token $token
```

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](~/reusable-content/ce-skilling/azure/includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands. Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [`az group create`](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [`az appservice plan create`](/cli/azure/appservice/plan#az-appservice-plan-create) | Creates an App Service plan. |
| [`az webapp create`](/cli/azure/webapp#az-webapp-create) | Creates an App Service app. |
| [`az webapp deployment source config`](/cli/azure/webapp/deployment/source#az-webapp-deployment-source-config) | Associates an App Service app with a Git or Mercurial repository. |

## Related content

- [Azure CLI documentation](/cli/azure)
- [CLI samples for Azure App Service](../samples-cli.md)
