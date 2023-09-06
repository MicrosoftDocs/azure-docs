---
title: 'CLI: Create ASP.NET Core app from Docker'
description: Learn how to use the Azure CLI to automate deployment and management of your App Service app. This sample shows how to create an ASP.NET Core app from Docker Hub.
author: msangapu-msft
tags: azure-service-management

ms.assetid: 3a2d1983-ff7b-476a-ac44-49ec2aabb31a
ms.devlang: azurecli
ms.topic: sample
ms.date: 04/21/2022
ms.author: msangapu
ms.custom: mvc, seodec18, devx-track-azurecli
---

# Create an ASP.NET Core app in a Docker container from Docker Hub using Azure CLI

This sample script creates a resource group, a Linux App Service plan, and an app. It then deploys an ASP.NET Core application using a Docker Container.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### To create the web app

:::code language="azurecli" source="~/azure_cli_scripts/app-service/deploy-linux-docker/deploy-linux-docker-webapp-only.sh" id="FullScript":::

### Configure Web App with a Custom Docker Container from Docker Hub

1. Create the following variable containing your GitHub information.

   ```azurecli
   dockerHubContainerPath="<replace-with-docker-container-path>" #format: <username>/<container-or-image>:<tag>
   ```

1. Configure the web app with a custom docker container from Docker Hub.

   ```azurecli
   az webapp config container set --docker-custom-image-name $dockerHubContainerPath --name $webApp --resource-group $resourceGroup
   ```

1. Copy the result of the following command into a browser to see the web app.

   ```azurecli
   site="http://$webapp.azurewebsites.net"
   echo $site
   curl "$site"
   ```

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands to create a resource group, App Service app, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [`az group create`](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [`az appservice plan create`](/cli/azure/appservice/plan#az-appservice-plan-create) | Creates an App Service plan. |
| [`az webapp create`](/cli/azure/webapp#az-webapp-create) | Creates an App Service app. |
| [`az webapp config container set`](/cli/azure/webapp/config/container#az-webapp-config-container-set) | Sets the Docker container for the App Service app. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional App Service CLI script samples can be found in the [Azure App Service documentation](../samples-cli.md).
