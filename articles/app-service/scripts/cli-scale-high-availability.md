---
title: 'CLI: Scale app with Traffic Manager'
description: Learn how to use the Azure CLI to automate deployment and management of your App Service app. This sample shows how to scale an worldwide with Traffic Manager.
author: msangapu-msft
tags: azure-service-management

ms.assetid: e4033a50-0e05-4505-8ce8-c876204b2acc
ms.devlang: azurecli
ms.topic: sample
ms.date: 12/11/2017
ms.author: msangapu
ms.custom: mvc, seodec18, devx-track-azurecli
---

# Scale an App Service app worldwide with a high-availability architecture using Azure CLI

This sample script creates a resource group, two App Service plans, two apps, a traffic manager profile, and two traffic manager endpoints. Once the exercise is complete, you have a high-available architecture, which provides global availability of your app based on the lowest network latency.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

 - This tutorial requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/app-service/scale-geographic/scale-geographic.sh "Geographic Scale")]

[!INCLUDE [cli-script-clean-up](../../../includes/cli-script-clean-up.md)]

## Script explanation

This script uses the following commands to create a resource group, App Service app, traffic manager profile, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [`az group create`](/cli/azure/group#az_group_create) | Creates a resource group in which all resources are stored. |
| [`az appservice plan create`](/cli/azure/appservice/plan#az_appservice_plan_create) | Creates an App Service plan. |
| [`az webapp create`](/cli/azure/webapp#az_webapp_create) | Creates an App Service app. |
| [`az network traffic-manager profile create`](/cli/azure/network/traffic-manager/profile#az_network_traffic_manager_profile_create) | Creates an Azure Traffic Manager profile. |
| [`az network traffic-manager endpoint create`](/cli/azure/network/traffic-manager/endpoint#az_network_traffic-manager_endpoint_create) | Adds an endpoint to an Azure Traffic Manager Profile. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional App Service CLI script samples can be found in the [Azure App Service documentation](../samples-cli.md).
