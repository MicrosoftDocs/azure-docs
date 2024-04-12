---
title: Route traffic for HA of applications - Azure CLI - Traffic Manager
description: Azure CLI script sample - Route traffic for high availability of applications
services: traffic-manager
author: greg-lindsay
manager: kumud
tags: azure-infrastructure
ms.custom: devx-track-azurecli
ms.service: traffic-manager
ms.devlang: azurecli
ms.topic: article
ms.date: 04/27/2023
ms.author: greglin
---

# Route traffic for high availability of applications using Azure CLI

This script creates a resource group, two app service plans, two web apps, a traffic manager profile, and two traffic manager endpoints. Traffic Manager directs traffic to the application in one region as the primary region, and to the secondary region when the application in the primary region is unavailable. Before executing the script, you must change the MyWebApp, MyWebAppL1 and MyWebAppL2 values to unique values across Azure. After running the script, you can access the app in the primary region with the URL mywebapp.trafficmanager.net.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/traffic-manager/direct-traffic-for-increased-application-availability/direct-traffic-for-increased-application-availability.sh" id="FullScript":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup1
az group delete --name $resourceGroup2
```

## Sample reference

This script uses the following commands to create a resource group, web app, traffic manager profile, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group) | Creates a resource group in which all resources are stored. |
| [az appservice plan create](/cli/azure/appservice/plan) | Creates an App Service plan. This is like a server farm for your Azure web app. |
| [az webapp web create](/cli/azure/webapp#az-webapp-create) | Creates an Azure web app within the App Service plan. |
| [az network traffic-manager profile create](/cli/azure/network/traffic-manager/profile) | Creates an Azure Traffic Manager profile. |
| [az network traffic-manager endpoint create](/cli/azure/network/traffic-manager/endpoint) | Adds an endpoint to an Azure Traffic Manager Profile. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional App Service CLI script samples can be found in the [Azure Networking documentation](../cli-samples.md).
