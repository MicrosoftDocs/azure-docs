---
title: 'CLI: Create ASP.NET Core app from Docker'
description: Learn how to use the Azure CLI to automate deployment and management of your App Service app. This sample shows how to create an ASP.NET Core app from Docker Hub.
author: msangapu-msft
tags: azure-service-management

ms.assetid: 3a2d1983-ff7b-476a-ac44-49ec2aabb31a
ms.devlang: azurecli
ms.topic: sample
ms.date: 12/11/2017
ms.author: msangapu
ms.custom: "devx-track-dotnet, mvc, seodec18, devx-track-azurecli"
---

# Create an ASP.NET Core app in a Docker container from Docker Hub using Azure CLI

This sample script creates a resource group, a Linux App Service plan, and an app. It then deploys an ASP.NET Core application using a Docker Container.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

 - This tutorial requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/app-service/deploy-linux-docker/deploy-linux-docker.sh?highlight=6 "Linux Docker")]

[!INCLUDE [cli-script-clean-up](../../../includes/cli-script-clean-up.md)]

## Script explanation

This script uses the following commands to create a resource group, App Service app, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [`az group create`](/cli/azure/group#az_group_create) | Creates a resource group in which all resources are stored. |
| [`az appservice plan create`](/cli/azure/appservice/plan#az_appservice_plan_create) | Creates an App Service plan. |
| [`az webapp create`](/cli/azure/webapp#az_webapp_create) | Creates an App Service app. |
| [`az webapp config container set`](/cli/azure/webapp/config/container#az_webapp_config_container_set) | Sets the Docker container for the App Service app. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional App Service CLI script samples can be found in the [Azure App Service documentation](../samples-cli.md).
