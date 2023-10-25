---
title: Quickstart - Create Azure API Management instance using CLI
description: Create a new Azure API Management service instance by using the Azure CLI.
author: dlepow
ms.service: api-management
ms.topic: quickstart
ms.custom: mode-api, devx-track-azurecli, devdivchpfy22
ms.date: 03/29/2022
ms.author: danlep 
ms.devlang: azurecli
---

# Quickstart: Create a new Azure API Management service instance by using the Azure CLI

Azure API Management (APIM) helps organizations publish APIs to external, partner, and internal developers to unlock the potential of their data and services. API Management provides the core competencies to ensure a successful API program through developer engagement, business insights, analytics, security, and protection. APIM lets you create and manage modern API gateways for existing backend services hosted anywhere. For more information about APIM, see the [Overview](api-management-key-concepts.md).

This quickstart describes the steps for creating a new API Management instance using [az apim](/cli/azure/apim) commands in the Azure CLI.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This article requires version 2.11.1 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

Azure API Management instances, like all Azure resources, must be deployed into a resource group. Resource groups let you organize and manage related Azure resources.

First, create a resource group named *myResourceGroup* in the Central US location with the following [az group create](/cli/azure/group#az-group-create) command:

```azurecli-interactive
az group create --name myResourceGroup --location centralus
```

## Create a new service

Now that you have a resource group, you can create an API Management service instance. Create one by using the [az apim create](/cli/azure/apim#az-apim-create) command and provide a service name and publisher details. The service name must be unique within Azure.

In the following example, *myapim* is used for the service name. Update the name to a unique value. Also update the name of the API publisher's organization and the email address to receive notifications.

```azurecli-interactive
az apim create --name myapim --resource-group myResourceGroup \
  --publisher-name Contoso --publisher-email admin@contoso.com \
  --no-wait
```

By default, the command creates the instance in the Developer tier, an economical option to evaluate Azure API Management. This tier isn't for production use. For more information about scaling the API Management tiers, see [upgrade and scale](upgrade-and-scale.md). 

> [!TIP]
> It can take between 30 and 40 minutes to create and activate an API Management service in this tier. The previous command uses the `--no-wait` option so that the command returns immediately while the service is created.

Check the status of the deployment by running the [az apim show](/cli/azure/apim#az-apim-show) command:

```azurecli-interactive
az apim show --name myapim --resource-group myResourceGroup --output table
```

Initially, output is similar to the following, showing the `Activating` status:

```console
NAME         RESOURCE GROUP    LOCATION    GATEWAY ADDR    PUBLIC IP    PRIVATE IP    STATUS      TIER       UNITS
-----------  ----------------  ----------  --------------  -----------  ------------  ----------  ---------  -------
myapim       myResourceGroup   Central US                                             Activating  Developer  1
```

After activation, the status is `Online` and the service instance has a gateway address and public IP address. For now, these addresses don't expose any content. For example:

```console
NAME         RESOURCE GROUP    LOCATION    GATEWAY ADDR                       PUBLIC IP     PRIVATE IP    STATUS    TIER       UNITS
-----------  ----------------  ----------  ---------------------------------  ------------  ------------  --------  ---------  -------
myapim       myResourceGroup   Central US  https://myapim.azure-api.net       203.0.113.1                 Online    Developer  1
```

When your API Management service instance is online, you're ready to use it. Start with the tutorial to [import and publish your first API](import-and-publish.md).

## Clean up resources

You can use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group and the API Management service instance when they aren't needed.

```azurecli-interactive
az group delete --name myResourceGroup
```

## Next steps

> [!div class="nextstepaction"]
> [Import and publish your first API](import-and-publish.md)
