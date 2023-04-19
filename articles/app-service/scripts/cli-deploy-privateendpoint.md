---
title: 'CLI: Deploy Private Endpoint for Web App with Azure CLI'
description: Learn how to use the Azure CLI to deploy Private Endpoint for your Web App
author: ericgre
ms.assetid: a56faf72-7237-41e7-85ce-da8346f2bcaa
ms.devlang: azurecli
ms.custom: devx-track-azurecli
ms.topic: sample
ms.date: 07/06/2020
ms.author: ericg
ms.service: app-service
ms.workload: web
---


# Create an App Service app and deploy Private Endpoint using Azure CLI

This sample script creates an app in App Service with its related resources, and then deploys a Private Endpoint.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

 - This tutorial requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

Before you can create any resource, you have to create a resource group to host the Web App, the Virtual Network, and other network components. Create a resource group with [az group create](/cli/azure/group). This example creates a resource group named *myResourceGroup* in the *francecentral* location:

```azurecli-interactive
az group create --name myResourceGroup --location francecentral 
```

## Create an App Service Plan

You need to create an App Service Plan to host your Web App.
Create an App Service Plan with [az appservice plan create](/cli/azure/appservice/plan#az-appservice-plan-create).
This example creates App Service Plan named *myAppServicePlan* in the *francecentral* location with *P1V2* sku and only one worker: 

```azurecli-interactive
az appservice plan create \
--name myAppServicePlan \
--resource-group myResourceGroup \
--location francecentral \
--sku P1V2 \
--number-of-workers 1
```

## Create a Web App

Now that you have an App Service Plan you can deploy a Web App.
Create a Web App with [az webapp create](/cli/azure/webapp#az-webapp-create).
This example creates a Web App named *mySiteName* in the Plan named *myAppServicePlan*

```azurecli-interactive
az webapp create \
--name mySiteName \
--resource-group myResourceGroup \
--plan myAppServicePlan
```

## Create a VNet

Create a Virtual Network with [az network vnet create](/cli/azure/network/vnet). This example creates a default Virtual Network named *myVNet* with one subnet named *mySubnet*:

```azurecli-interactive
az network vnet create \
--name myVNet \
--resource-group myResourceGroup \
--location francecentral \
--address-prefixes 10.8.0.0/16 \
--subnet-name mySubnet \
--subnet-prefixes 10.8.100.0/24
```

## Configure the Subnet 

You need to update the subnet to disable private endpoint network policies. Update a subnet configuration named *mySubnet* with [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update):

```azurecli-interactive
az network vnet subnet update \
--name mySubnet \
--resource-group myResourceGroup \
--vnet-name myVNet \
--disable-private-endpoint-network-policies true
```

## Create the Private Endpoint

Create the Private Endpoint for your Web App with [az network private-endpoint create](/cli/azure/network/private-endpoint). 
This example creates a Private Endpoint named *myPrivateEndpoint* in the VNet *myVNet* in the Subnet *mySubnet* with a connection named *myConnectionName* to the resource ID of my Web App /subscriptions/SubscriptionID/resourceGroups/myResourceGroup/providers/Microsoft.Web/sites/myWebApp, the group parameter is *sites* for Web App type. 

```azurecli-interactive
az network private-endpoint create \
--name myPrivateEndpoint \
--resource-group myResourceGroup \
--vnet-name myVNet \
--subnet mySubnet \
--connection-name myConnectionName \
--private-connection-resource-id /subscriptions/SubscriptionID/resourceGroups/myResourceGroup/providers/Microsoft.Web/sites/myWebApp \
--group-id sites
```

## Configure the private zone

At the end, you need to create a private DNS zone named *privatelink.azurewebsites.net* linked to the VNet to resolve DNS name of the Web App.


```azurecli-interactive
az network private-dns zone create \
--name privatelink.azurewebsites.net \
--resource-group myResourceGroup

az network private-dns link vnet create \
--name myDNSLink \
--resource-group myResourceGroup \
--registration-enabled false \
--virtual-network myVNet \
--zone-name privatelink.azurewebsites.net

az network private-endpoint dns-zone-group create \
--name myZoneGroup \
--resource-group myResourceGroup \
--endpoint-name myPrivateEndpoint \
--private-dns-zone privatelink.azurewebsites.net \
--zone-name privatelink.azurewebsites.net
```






[!INCLUDE [cli-script-clean-up](../../../includes/cli-script-clean-up.md)]


## Next steps

- For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).
- Additional App Service CLI script samples can be found in the [Azure App Service documentation](../samples-cli.md).
