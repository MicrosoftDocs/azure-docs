---
title: 'CLI: Create ASP.NET Core app from ACR'
description: Learn how to use the Azure CLI to automate deployment and management of your App Service app. This sample shows how to create an Linux ASP.NET Core app from ACR.
author: msangapu-msft
tags: azure-service-management

ms.assetid: 3a2d1983-ff7b-476a-ac44-49ec2aabb31a
ms.devlang: azurecli
ms.topic: sample
ms.date: 04/25/2022
ms.author: msangapu
ms.custom: mvc, seodec18, devx-track-azurecli
---

# Create an ASP.NET Core app in a Docker container in App Service from Azure Container Registry

This sample script creates a resource group, a Linux App Service plan, and an app. It then deploys an ASP.NET Core application using a Docker Container from the Azure Container Registry.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

1. Create a resource group

   ```azurecli
   az group create --name myResourceGroup --location westus
   ```

1. Create an Azure Container Registry

   ```azurecli
   az acr create --name <registry_name> --resource-group myResourceGroup --location westus --sku basic --admin-enabled true --query loginServer --output tsv
   ```

1. Show ACR credentials

   ```azurecli
   az acr credential show --name <registry_name> --resource-group myResourceGroup --query [username,passwords[?name=='password'].value] --output tsv
   ```

1. Before continuing, save the ACR credentials and registry URL. You will need this information in the commands below.

1. Pull from Docker

   ```bash
   docker login <acr_registry_name>.azurecr.io -u <registry_user>
   docker pull <registry_user/container_name:version>
   ```

1. Tag Docker image

   ```bash
   docker tag <registry_user/container_name:version> <acr_registry_name>.azurecr.io/<container_name:version>
   ```

1. Push container image to Azure Container Registry

   ```bash
   docker push <acr_registry_name>.azurecr.io/<container_name:version>
   ```

1. Create an App Service plan

   ```bash
   az appservice plan create --name AppServiceLinuxDockerPlan --resource-group myResourceGroup --location westus --is-linux --sku S1
   ```

1. Create a web app

   ```bash
   az webapp create --name <app_name> --plan AppServiceLinuxDockerPlan --resource-group myResourceGroup --deployment-container-image-name <acr_registry_name>.azurecr.io/<container_name:version>
   ```

1. Configure an existing web app with a custom Docker Container from Azure Container Registry.

   ```bash
   az webapp config container set --resource-group myResourceGroup --name <app_name> --docker-registry-server-url http://<acr_registry_name>.azurecr.io --docker-registry-server-user <registry_user> --docker-registry-server-password <registry_password>
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
