---
title: 'CLI: Deploy to staging slot'
description: Learn how to use the Azure CLI to automate deployment and management of your App Service app. This sample shows how to deploy code to a staging slot.
author: msangapu-msft
tags: azure-service-management
ms.assetid: 2b995dcd-e471-4355-9fda-00babcdb156e
ms.devlang: azurecli
ms.topic: sample
ms.date: 04/15/2022
ms.custom: mvc, seodec18, devx-track-azurecli
---

# Create an App Service app and deploy code to a staging environment using Azure CLI

This sample script creates an app in App Service with an additional deployment slot called "staging", and then deploys a sample app to the "staging" slot.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### To create the web app

:::code language="azurecli" source="~/azure_cli_scripts/app-service/deploy-github/deploy-github.sh" id="FullScript":::

### To deploy code to a staging environment

To create a deployment slot with the name "staging, use the following command.

```azurecli
az webapp deployment slot create --name $webapp --resource-group $resourceGroup --slot staging
```

To deploy sample code to "staging" slot from GitHub, use the following command.

```azurecli
# az webapp deployment source config --name $webapp --resource-group $resourceGroup --slot staging --repo-url $gitrepo --branch master --manual-integration
```

Use the following commands to see the web app in the staging slot.

```azurecli
siteStaging="http://$webapp-staging.azurewebsites.net"
echo $siteStaging
curl "$siteStaging" # Optionally, copy and paste the output of the previous command into a browser to see the web app
```

```azurecli
# Swap the verified/warmed up staging slot into production.
# az webapp deployment slot swap --name $webapp --resource-group $resourceGroup --slot staging
```

Use the following commands to see the deployed web app.

```azurecli
site="http://$webapp.azurewebsites.net"
echo $site
curl "$site" # Optionally, copy and paste the output of the previous command into a browser to see the web app
```

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../../includes/cli-clean-up-resources.md)]

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
| [`az webapp deployment slot create`](/cli/azure/webapp/deployment/slot#az-webapp-deployment-slot-create) | Create a deployment slot. |
| [`az webapp deployment source config`](/cli/azure/webapp/deployment/source#az-webapp-deployment-source-config) | Associates an App Service app with a Git or Mercurial repository. |
| [`az webapp deployment slot swap`](/cli/azure/webapp/deployment/slot#az-webapp-deployment-slot-swap) | Swap a specified deployment slot into production. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional App Service CLI script samples can be found in the [Azure App Service documentation](../samples-cli.md).
