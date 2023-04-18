---
title: Azure CLI script sample - Integrate App Service with Application Gateway | Microsoft Docs
description: Azure CLI script sample - Integrate App Service with Application Gateway
services: appservice
documentationcenter: appservice
author: madsd
manager: ccompy
editor: 
tags: azure-service-management

ms.assetid: 6c16d6f8-3c08-4a59-858e-684a2ceccb5f
ms.service: app-service
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: web
ms.date: 04/15/2022
ms.author: madsd
ms.custom: seodec18, devx-track-azurecli, ignite-2022
---

# Integrate App Service with Application Gateway using CLI

This sample script creates an Azure App Service web app, an Azure Virtual Network and an Application Gateway. It then restricts the traffic for the web app to only originate from the Application Gateway subnet.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/app-service/integrate-with-app-gateway/integrate-with-app-gateway.sh" id="FullScript":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands to create a resource group, an App Service app, an Azure Cosmos DB instance, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [`az group create`](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [`az network vnet create`](/cli/azure/network/vnet#az-network-vnet-create) | Creates a virtual network. |
| [`az network public-ip create`](/cli/azure/network/public-ip#az-network-public-ip-create) | Creates a public IP address. |
| [`az network public-ip show`](/cli/azure/network/public-ip#az-network-public-ip-show) | Show details of a public IP address. |
| [`az appservice plan create`](/cli/azure/appservice/plan#az-appservice-plan-create) | Creates an App Service plan. |
| [`az webapp create`](/cli/azure/webapp#az-webapp-create) | Creates an App Service web app. |
| [`az webapp show`](/cli/azure/webapp#az-webapp-show) | Show details of an App Service web app. |
| [`az webapp config access-restriction add`](/cli/azure/webapp/config/access-restriction#az-webapp-config-access-restriction-add) | Adds an access restriction to the App Service web app. |
| [`az network application-gateway create`](/cli/azure/network/application-gateway#az-network-application-gateway-create) | Creates an Application Gateway. |
| [`az network application-gateway http-settings update`](/cli/azure/network/application-gateway/http-settings#az-network-application-gateway-http-settings-update) | Updates Application Gateway HTTP settings. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional App Service CLI script samples can be found in the [Azure App Service documentation](../samples-cli.md).
